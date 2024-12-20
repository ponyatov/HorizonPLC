const err = require('ModuleAppError.min.js');
const NumIs = require('ModuleAppMath.min.js');
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

const ClassI2CBus = require("ClassBaseI2CBus.min.js");
let I2Cbus = new ClassI2CBus();
let _bus = I2Cbus.AddBus({sda: P5, scl: P6, bitrate: 100000}).IDbus;
const gasClass = require('ClassAirQualityCCS811.min.js');

let opts = {pins: [P5, P6], bus: _bus, address: 0x5A, mode: 1, quantityChannel: 2};
let sensor_props = {
    name: "CCS811",
    type: "sensor",
    channelNames: ['CO2', 'TVOC'],
    typeInSignal: "digital",
    typeOutSignal: "digital",
    quantityChannel: 2,
    busType: [ "i2c" ],
    manufacturingData: {
        IDManufacturing: [
            {
                "GasMeter": "A2224"
            }
        ],
        IDsupplier: [
            {
                "Sensory": "5522"
            }
        ],
        HelpSens: "CCS811 Air Quality"
    }
};

let gas = new gasClass(opts, sensor_props);


const ch0 = gas.GetChannel(0);
const ch1 = gas.GetChannel(1);


ch0.Start(1000);
ch1.Start(1000);

setInterval(() => {
  console.log(`CO2: ${(ch0.Value)} ppm    TVOC: ${(ch1.Value)} ppb`);
}, 1000);