// Require base
const fs      = require('fs-extra');
const Store   = require('backblaze-b2');
const Daemon  = require('daemon');
const config  = require('config');
const request = require('request');

/**
 * Extend base
 *
 * @extends base
 */
class B2Transport extends Daemon {
  /**
   * Construct this
   */
  constructor() {
    // Construct super
    super();

    // Create store
    this.store = new Store({
      accountId      : config.get('b2.id'), // or accountId
      applicationKey : config.get('b2.secret'), // or masterApplicationKey
    });

    // Get bucket
    this.bucket = new Promise(async (res) => {
      // authorize
      await this.store.authorize();

      // resolve got bucket
      res(await this.store.getBucket({
        bucketName : config.get('b2.bucket'),
      }));
    });
  }

  /**
   * Gets asset url
   *
   * @param  {Asset}  asset
   * @param  {String} label
   *
   * @return {*}
   */
  url(asset, label) {
    // Return url
    return `https://${config.get('b2.domain') || 'f002.backblazeb2.com'}/file/${config.get('b2.bucket')}/${asset.get('path')}/${label ? `${label}.${asset.get(`thumbs.${label}.ext`)}` : `full.${asset.get('ext')}`}`;
  }

  /**
   * Pushes asset to storage
   *
   * @param  {Asset}  asset
   * @param  {String} tmp
   * @param  {String} label
   */
  async push(asset, tmp, label) {
    // Await bucket
    const bucket = await this.bucket;

    // Set transport
    asset.set('transport', 'b2');

    // Get date
    let date = asset.get('created_at') || new Date();

    // get upload url
    const uploadUrl = await this.store.getUploadUrl({
      bucketId : bucket.data.buckets[0].bucketId,
    });

    // Augment date
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    // Set path
    asset.set('path', `${date}/${asset.get('hash')}`);

    // await
    const { data } = (await this.store.uploadFile({
      data            : await fs.readFile(tmp), // this is expecting a Buffer, not an encoded string
      fileName        : `${asset.get('path')}/${label ? `${label}.${asset.get(`thumbs.${label}.ext`)}` : `full.${asset.get('ext')}`}`,
      uploadUrl       : uploadUrl.data.uploadUrl,
      uploadAuthToken : uploadUrl.data.authorizationToken,
      info            : {
        str  : date,
        hash : asset.get('hash'),
      },
      onUploadProgress : () => {}, // progress monitoring
      // ...common arguments (optional)
    }));

    // set b2 info
    asset.set(`${label ? `thumbs.${label}.` : ''}b2`, data);
  }

  /**
   * Pulls asset from storage
   *
   * @param  {Asset}  asset
   * @param  {String} tmp
   * @param  {String} label
   */
  async pull(asset, tmp, label) {
    // Create request
    const res  = request.get(await this.url(asset, label));
    const dest = fs.createWriteStream(tmp);

    // Res pipe dest
    res.pipe(dest);

    // Run Promise
    await new Promise((resolve) => {
      // Resolve on end
      res.on('end', resolve);
    });
  }

  /**
   * Removes asset from storage
   *
   * @param  {Asset} asset
   * @param  {String} label
   */
  async remove(asset, label) {
    // Await bucket
    await this.bucket;

    // delete file version
    await this.store.deleteFileVersion({
      fileId   : asset.get(`${label ? `thumbs.${label}.` : ''}b2.fileId`),
      fileName : `${asset.get('path')}/${label ? `${label}.${asset.get(`thumbs.${label}.ext`)}` : `full.${asset.get('ext')}`}`,
    });
  }
}

/**
 * Export local transport class
 *
 * @type {B2Transport}
 */
module.exports = B2Transport;
