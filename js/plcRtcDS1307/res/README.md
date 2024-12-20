<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleDS1307
<p align="center">
  <img src="logo.png" width="400" title="hover text">
</p>

-----------------

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для работы с часами реального времени на базе чипа [DS1307](https://github.com/Konkery/ModuleMeteoLPS25HB/blob/main/res/lps25hb.pdf). Модуль является неотъемлемой частью фреймворка Horizon Automated. Датчик на базе чипа DS1307 позволяет получить точное время между 2000 и 2099 годом. Модуль работает по интерфейсу I2C.

Архитектурные решения:
- является потомком класса [ClassMiddleSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md);
- использует шину через глобальный объект [I2Cbus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md).
 
Количество каналов для снятия данных - 1.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает один объект типа **SensorOptsType** и один объект типа [**SensorOptsType**](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md).
```js
let _sensor_props = {
    name: "DS13007",
    type: "sensor",
    channelNames: ['Unix'],
    typeInSignal: "analog",
    typeOutSignal: "digital",
    quantityChannel: 1,
    busType: [ "i2c" ],
};
let _opts = {
    bus: i2c_bus,
}
sensor = new clockClass(_opts, _sensor_props)
```
- <mark style="background-color: lightblue">bus</mark> - объект класса I2C, возвращаемый диспетчером I2C шин - [I2Cbus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md);
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_Rtc</mark> - объект базового класса;
- <mark style="background-color: lightblue">_MinPeriod</mark> - минимальная частота опроса датчика - 100 мс;
- <mark style="background-color: lightblue">_UsedChannels</mark> - используемые каналы данных по нотации архитектуры фреймворка Horizon Automated;
- <mark style="background-color: lightblue">_Interval</mark> - функция SetInterval для опроса датчика.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Init(_sensor_props)</mark> - необходим для первоначальной настройки датчика;
- <mark style="background-color: lightblue">Start(_num_channel, _period)</mark> - запускает циклический опрос заданного канала датчика. Переданное значение периода сверяется с минимальным значением хранящимся в поле *_minPeriod* и, если требуется, регулируется;
- <mark style="background-color: lightblue">SetDefaultPressure(pressure)</mark> - устанавливает значение поля _calPressure;
- <mark style="background-color: lightblue">ChangeFreq(_num_channel, _period)</mark> - останавливает опрос заданного канала и запускает его вновь с уже новой частотой;
- <mark style="background-color: lightblue">Stop(_num_channel)</mark> - прекращает считывание значений с заданного канала;
- <mark style="background-color: lightblue">SetTime(_date)</mark> - устанавливает время на датчике, принимает объетк класса Date;
- <mark style="background-color: lightblue">AdjustTime(_val, _key)</mark> - подводит время на датчике;
- <mark style="background-color: lightblue">GetTimeISO()</mark> - возвращает текущее время с датчика в формате iso;
- <mark style="background-color: lightblue">GetTimeUnix()</mark> - возвращает текущее время с модуля в формате unix;
- <mark style="background-color: lightblue">GetTimeHMS()</mark> - возвращает текущее время с модуля в формате - час:минута:секунда .
</div>

### Примеры
<div style = "color: #555">

Фрагмент кода для вывода времени в консоль в формате ISO раз в одну секунду. Предполагается, что все необходимые модули уже загружены в систему:
```js
//Подключение необходимых модулей
const ClassI2CBus = require("ClassBaseI2CBus.min.js");
const err = require("ModuleAppError.min.js");
const NumIs = require("ModuleAppMath.min.js");
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

//Создание I2C шины
let I2Cbus = new ClassI2CBus();
let bus = I2Cbus.AddBus({sda: B9, scl: B8, bitrate: 100000}).IDbus;

//Настройка передаваемых объектов
const clockClass = require('ModuleDS1307.min.js');
let opts = {pins: [B9, B8], bus: _bus, quantityChannel: 1};
let sensor_props = {
    name: "DS13007",
    type: "sensor",
    channelNames: ['Unix'],
    typeInSignal: "analog",
    typeOutSignal: "digital",
    quantityChannel: 1,
    busType: [ "i2c" ],
    manufacturingData: {
        IDManufacturing: [
            {
                "Clock": "24"
            }
        ],
        IDsupplier: [
            {
                "Alarmer": "A542"
            }
        ],
        HelpSens: "DS1307 RTC"
    }
};
//Создание объекта класса
let clock = new clockClass(opts, sensor_props);

const ch0 = clock.GetChannel(0);

//Создание каналов
ch0.Start(1000);

//Вывод данных
setInterval(() => {
  let date = new Date(ch0.Value).toISOString();
  console.log(date);
}, 1000);
```
Вывод данных в консоль:
<p align="left">
  <img src="./res/output.png" title="hover text">
</p>

Вызов метода для перевода времени:
<p align="left">
  <img src="./res/output2.png" title="hover text">
</p>
<div>

# Зависимости
- [ClassBaseI2CBus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)
</div>