const gpio = require('rpi-gpio');
const { MeWoDevice } = require('mewo');

/**
 * Wraps gpio.setup in a promise
 */
function setupPin(pin) {
  return new Promise((resolve, reject) => {
    gpio.setup(pin, (err) => {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

/**
 * Curries a function for setting many pins to a state
 */
function setPin(state) {
  return function(pin) {
    gpio.write(pin, state);
  };
}

module.exports = class PiDevice extends MeWoDevice {

  /**
   * Creates a device that corresponds to a pin or series of pins
   *
   * @constructor
   */
  constructor(name, responder, pins) {
    super(name, responder);
    this.pins = Array.isArray(pins) ? pins : [ pins ];
    this.ready = Promise.all(this.pins.map(setupPin)).catch((err) => {
      this.error('There was an error seting up the pins', err);
    });
  }

  /**
   * Called when this device is told to turn on
   */
  on() {
    return this.ready.then(() => {
      this.pins.forEach(setPin(true));
    });
  }

  /**
   * Called when this device is told to turn on
   */
  off() {
    return this.ready.then(() => {
      this.pins.forEach(setPin(false));
    });
  }
};