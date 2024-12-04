try {
    let ina = SensorManager.CreateDevice("00");
    let i;
    for (i = 0; i<12; i++){
        ina[i].Start(1000);
    }
  
    // Вывод данных
    setInterval(() => {
        for (i = 0; i < 3; i++) {
            console.log("Channel " + i);
            console.log(`Voltage Shunt: ${(ina[i * 4].Value).toFixed(4)} V    Voltage Bus: ${(ina[i * 4 + 1].Value).toFixed(4)} V    Current: ${(ina[i * 4 + 2].Value).toFixed(4)} A    Power: ${(ina[i * 4 + 3].Value).toFixed(4)} mW`);
        }
    }, 1000);
  }
  catch (e) {
    console.log(e);
  }