<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleAirAlcoholMQ3
<p align="center">
  <img src="logo.png" width="400" title="hover text">
</p>

-----------------

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для работы с датчиком паров спирта на базе нагревательного элемента [MQ-3](https://github.com/Konkery/ModuleAirAlcoholMQ3/blob/main/res/MQ3_datasheet.pdf). Модуль является неотъемлемой частью фреймворка Horizon Automated. Датчик на MQ-3 позволяет получить данные о концентрации паров спирта в воздухе. В модуле предусмотрено управление встроенным нагревателем. Следует учесть, что управление осуществляется при отсутствии джампера 'H=V', который включает нагреватель при подаче напряжения. Модуль имеет следующие архитектурные решения фреймворка Horizon Automated:
- является потомком класса [ClassMiddleSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md).
 
Количество каналов для снятия данных - 1.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает один объект типа **SensorOptsType** и один объект типа [**SensorOptsType**](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md).
```js
let _sensor_props = {
    name: "MQ3",
    type: "sensor",
    channelNames: ['alcohol'],
    typeInSignal: "analog",
    typeOutSignal: "analog",
    quantityChannel: 1,
    busType: [ "i2c" ],
};
let _opts = {
    dataPin: A0,
    heatPin: P10,
    bus: i2c_bus,
    model: "MQ3",
    baseline: bl,
}
sensor = new ClassAirAlcoholMQ3 (_opts, _sensor_props)
```
- <mark style="background-color: lightblue">dataPin</mark> - номер пина, по которому будут считываться данные с датчика;
- <mark style="background-color: lightblue">heatPin</mark> - номер пина, через который будет осуществляться контроль нагревателя датчика;
- <mark style="background-color: lightblue">bus</mark> - объект класса I2C, возвращаемый диспетчером I2C шин - [I2Cbus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md);
- <mark style="background-color: lightblue">model</mark> - имя модели датчика из серии MQX, нужно для выбора правильного преобразования в базовом классе;
- <mark style="background-color: lightblue">baseline</mark> - норма концентрации паров спирта в помещении, где проводится измерение. Является корректирующей величиной;
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_Sensor</mark> - объект базового класса;
- <mark style="background-color: lightblue">_MinPeriod</mark> - минимальная частота опроса датчика - 250 мс;
- <mark style="background-color: lightblue">_UsedChannels</mark> - используемые каналы данных по нотации архитектуры фреймворка Horizon Automated;
- <mark style="background-color: lightblue">_Interval</mark> - функция SetInterval для опроса датчика.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Init(_sensor_props)</mark> - необходим для первоначальной настройки датчика;
- <mark style="background-color: lightblue">ControlHeater(_val)</mark> - контролирует нагрев датчика;
- <mark style="background-color: lightblue">Calibrate(_val)</mark> - калибрует датчик. Если значение не передано, датчик калибруется автоматически;
- <mark style="background-color: lightblue">Preheat()</mark> - запускает полный нагрев датчика на 30 секунд. Во время нагрева нельзя считаь данные с датчика. После выполнения метода нагреватель остаётся включенным;
- <mark style="background-color: lightblue">Start(_num_channel, _period)</mark> - запускает циклический опрос заданного канала датчика. Переданное значение периода сверяется с минимальным значением хранящимся в поле *_minPeriod* и, если требуется, регулируется;
- <mark style="background-color: lightblue">ChangeFreq(_num_channel, _period)</mark> - останавливает опрос заданного канала и запускает его вновь с уже новой частотой;
- <mark style="background-color: lightblue">Stop(_num_channel)</mark> - прекращает считывание значений с заданного канала.
</div>

### Возвращаемые данные
<div style = "color: #555">

Датчик возвращает значения концентрации паров спирта в воздухе в миллионных долях (ppm).
</div>


### Примеры
<div style = "color: #555">

Фрагмент кода для вывода данных о давлении и температуре в консоль раз в одну секунду. Предполагается, что все необходимые модули уже загружены в систему:
```js
//Подключение необходимых модулей
const err = require("ModuleAppError.min.js");
const NumIs = require("ModuleAppMath.min.js");
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

const gasClass = require('ClassAirAlcoholMQ3.min.js');
//Настройка передаваемых объектов
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
        HelpSens: "MQ3 Air Alcohol"
    }
};
//Создание класса
let gas = new gasClass(opts, sensor_props);

//Нагрев и каллибровка
gas.Preheat();
gas.Calibrate();

const ch0 = gas.GetChannel(0);
ch0.Start(1000);

//Вывод данных
setInterval(() => {
  console.log(`C2H5OH: ${(ch0.Value).toFixed(4)} ppm`);
}, 1000);

```
Вывод данных в консоль:
<p align="left">
  <img src="./res/output.png" title="hover text">
</p>
<div>

# Зависимости
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)
</div>
