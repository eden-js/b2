# EdenJS - Backblaze B2
[![TravisCI](https://travis-ci.com/eden-js/b2.svg?branch=master)](https://travis-ci.com/eden-js/b2)
[![Issues](https://img.shields.io/github/issues/eden-js/b2.svg)](https://github.com/eden-js/b2/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eden-js/b2)
[![Awesome](https://img.shields.io/badge/awesome-true-green.svg)](https://github.com/eden-js/b2)
[![Discord](https://img.shields.io/discord/583845970433933312.svg)](https://discord.gg/5u3f3up)

Backblaze B2 base logic component for [EdenJS](https://github.com/edenjs-cli)

`@edenjs/b2` automatically adds the Backblaze B2 asset transport to your EdenJS installation

## Setup

### Install

```
npm i --save @edenjs/b2
```

### Configure

```js
const config = {};

// set b2 config
config.b2 = {
  id     : '', // backblaze id
  secret : '', // backblaze api key
  bucket : '', // backblaze bucket name
  domain : '', // (optional) cname or other domain that points to this bucket address
};
```

#### Example

```js
// require model
const File = model('file');

// load file
const file = new File();

// await file creation
await file.fromFile('/local/file/location.pdf');

// save file
await file.save(); // this is now stored in backblaze

// get url for file
const url = await file.url(); // returns full url to download the file
```