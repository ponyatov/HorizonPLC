let battery = SensorManager.CreateDevice('14');
let charge = battery[0];
let voltage = battery[1];
charge.Start();

// vl6180
let vl_channels = SensorManager.CreateDevice('00');
let light1 = vl_channels[0];
light1.Start();

// gl5528
let gl = SensorManager.CreateDevice('15');
let light2 = gl[0];
let r = gl[1];
light2.Start();
