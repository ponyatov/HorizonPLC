const err = require('ModuleAppError.min.js');
const NumIs = require('ModuleAppMath.min.js');
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

const gasClass = require('ClassAirMethaneMQ4.min.js');
let opts = {pins: [A0, P10], quantityChannel: 1};
let sensor_props = {
    name: "MQ4",
    type: "sensor",
    channelNames: ['methane'],
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
        HelpSens: "MQ4 Air Methane"
    }
};

let gas = new gasClass(opts, sensor_props);
//gas.ControlHeater(0);
gas.Preheat();
gas.Calibrate();

const ch0 = gas.GetChannel(0);
ch0.Start(1000);

setInterval(() => {
  console.log(`CH4: ${(ch0.Value).toFixed(2)} ppm`);
}, 1000);