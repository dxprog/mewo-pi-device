# MeWo Pi Device

A node library that allows a MeWo emulated hub to control GPIO pins on a Raspberry Pi.

## Installation

```
npm install --save mewo-pi-device
```

**Note:** GPIO pins can only be controlled while running as root.

## API

`PiDevice(deviceName, responder, [ pins ])`

Object constructor.

- `deviceName`: The name of the device
- `responder`: The UPnpBroadcastResponder object
- `pins`: A pin number or array of pin numbers for this device to control

## Example

```javascript
const { UPnpBroadcastResponder } = require('mewo');
const { PiDevice } = require('mewo-pi-device');

const GPIO_PIN = 40;

const responder = new UPnpBroadcastResponder();
responder.init().then(() => {
  const piDevice = new PiDevice('pi-device', responder, GPIO_PIN);
  responder.registerDevice(piDevice);
});
```