
// Require dependencies
const Daemon = require('daemon');
const config = require('config');

// Require transport
const B2Transport = require('backblaze/transports/b2');

/**
 * Build asset dameon class
 *
 * @compute
 * @express
 */
class BackblazeDaemon extends Daemon {
  /**
   * Construct asset daemon class
   */
  constructor(...args) {
    // Run super eden
    super(...args);

    // Register transport
    this.eden.register('asset.transport', new B2Transport());
  }
}

/**
 * Export google daemon class
 *
 * @type {google}
 */
module.exports = BackblazeDaemon;