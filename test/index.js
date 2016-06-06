const expect = require('expect.js');
const gpio = require('rpi-gpio');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { MeWoDevice } = require('mewo');

// For stubbing
let PiDevice;
let sandbox;

describe('WeMo Pi Device tests', function() {

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    PiDevice = proxyquire('../index', {
      'rpi-gpio': {
        setup: sandbox.stub(gpio, 'setup', function(pin, fn) {
          fn();
        }),
        write: sandbox.spy(gpio, 'write')
      }
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should instantiate and setup single pin', function() {
    const responder = 'test';
    const name = 'device-name';
    const pin = 1;
    const device = new PiDevice(name, responder, pin);

    // Verify instance vars and extension
    expect(device).to.be.a(MeWoDevice);
    expect(device.name).to.be(name);
    expect(device.responder).to.be(responder);
    expect(device.pins).to.be.an('array');
    expect(device.pins).to.have.length(1);
    expect(device.pins[0]).to.be(pin);

    // Verify that the pin setup is correctly handled
    sinon.assert.calledOnce(gpio.setup);
    sinon.assert.calledWith(gpio.setup, pin, sinon.match.func);
    return device.ready;
  });

  it('should instantiate and setup multiple pins', function() {
    const pins = [ 1, 2 ];
    const device = new PiDevice('test', {}, pins);

    // Verify instance vars and extension
    expect(device.pins).to.be.an('array');
    expect(device.pins).to.have.length(pins.length);
    expect(device.pins).to.eql(pins);

    // Verify that the pin setup is correctly handled
    sinon.assert.calledTwice(gpio.setup);
    sinon.assert.calledWith(gpio.setup.firstCall, pins[0], sinon.match.func);
    sinon.assert.calledWith(gpio.setup.secondCall, pins[1], sinon.match.func);
    return device.ready;
  });

  it('should set the pins high when turned on', function() {
    const device = new PiDevice('test', {}, [ 1, 2 ]);
    device.on().then(() => {
      sinon.assert.calledTwice(gpio.write);
      sinon.assert.calledWith(gpio.write.firstCall, pins[0], true, sinon.match.func);
      sinon.assert.calledWith(gpio.write.secondCall, pins[1], true, sinon.match.func);
    });
  });

  it('should set the pins low when turned off', function() {
    const device = new PiDevice('test', {}, [ 1, 2 ]);
    device.on().then(() => {
      sinon.assert.calledTwice(gpio.write);
      sinon.assert.calledWith(gpio.write.firstCall, pins[0], false, sinon.match.func);
      sinon.assert.calledWith(gpio.write.secondCall, pins[1], false, sinon.match.func);
    });
  });
});