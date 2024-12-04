require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.min.js');
const wifi_class = require('https://raw.githubusercontent.com/AlexGlgr/ModuleMiddleWIFIesp8266/fork-Alexander/js/module/ClassMiddleWIFIesp8266.min.js');
const UARTBus = require ('https://raw.githubusercontent.com/AlexGlgr/ModuleBaseUARTbus/fork-Alexander/js/module/ClassBaseUARTBus.min.js');
const ws_server = require('https://raw.githubusercontent.com/AlexGlgr/ModuleWebSocketServer/fork-Alexander/js/module/ClassWebSocketServer.min.js');
const ProxyWS = require('https://raw.githubusercontent.com/Nicktonious/ModuleBaseRouteREPL/fork-nikita/js/module/ModuleProxyWS%20prototype.min.js');
const repl_class = require('https://raw.githubusercontent.com/Nicktonious/ModuleBaseRouteREPL/fork-nikita/js/module/ModuleRouteREPL.min.js');

let wifi;
let server;
let repl;
let sensor_interval;

try {
  wifi = new wifi_class();
  repl = new repl_class();

  setTimeout( () => {
    server = new ws_server();
  }, 7000);

  sensor_interval = setInterval(() => {

    Object.emit('sensor-read', 0);
    console.log("Emitted");

  }, 6000);
}
  catch(e) {
    console.log('Error!' + e);
}