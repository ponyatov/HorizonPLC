<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleMQTT
<div style = "color: #555">
    <p align="center">
    <img src="logo.png" width="400" title="hover text">
    </p>
</div>

## Лицензия
////

### Описание
<div style = "color: #555">

Модуль реализует клиент MQTT-брокера на стороне контроллера. Представляет собой модифицированный нативный модуль, доступный в Espruino. 
Описание модуля на [официальном сайте](https://www.espruino.com/MQTT).

</div>

### Примеры
<div style = "color: #555">

```js

let mqtt;
let proxy;

setTimeout( () => {
    // ждем пока будет установлено вайфай соединение
    mqtt = new (require("ModuleMQTT.min.js"))();
    mqtt.connect();
    
    //запуск опроса датчиков
    SensorManager.StartPolling(1);
}, 10000);

*/

```
#### Результат выполнения:

<div align='left'>
    <img src="./res/example-2.png" alt="Image not found">
</div>

</div>

### Зависимости
<div style = "color: #555">

</div>

</div>
    