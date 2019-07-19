
// Require dependencies
const Daemon = require('daemon');

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
    this.eden.register('asset.transport.b2', new B2Transport());
  }
}

/**
 * Export google daemon class
 *
 * @type {google}
 */
module.exports = BackblazeDaemon;
