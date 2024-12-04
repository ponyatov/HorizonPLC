const err = require('ModuleAppError.min.js');
const NumIs = require('ModuleAppMath.min.js');
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

const gasClass = require('ClassAirAlcoholMQ3.min.js');
let opts = {pins: [A0, P10], quantityChannel: 1};
let sensor_props = {
    name: "MQ3",
    type: "sensor",
    channelNames: ['alcohol'],
    typeInSignal: "analog",
    typeOutSignal: "analog",
    quantityChannel: 1,
    busType: [],
    manufacturingData: {
        IDManufacturing: [
            {
                "GasMeter": "A2655"
            }
        ],
        IDsupplier: [
            {
                "Sensory": "5599"
            }
        ],
        HelpSens: "MQ3 Air alcohol"
    }
};

let gas = new gasClass(opts, sensor_props);

gas.Preheat();
gas.Calibrate();

const ch0 = gas.GetChannel(0);
ch0.Start(1000);

setInterval(() => {
  console.log(`C2H5OH: ${(ch0.Value).toFixed(4)} ppm`);
}, 1000);