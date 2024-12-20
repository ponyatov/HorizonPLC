let lht = SensorManager.CreateDevice('GL5528')[0];
lht.Start();
let led = SensorManager.CreateDevice('LED')[0];
led.Suppression.SetLim(0, 0.5);

setInterval(() => {
Logger.Log('Luminocity', Logger.LogLevel.INFO, `${(lht.Value).toFixed(3)} lux`);
    }, 1000);
setInterval(() => {
led.SetValue(lht.Value / 600);
    }, 100);