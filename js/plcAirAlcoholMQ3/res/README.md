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
- является потомком класса [ClassSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md).
 
Количество каналов для снятия данных - 1.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает объект типа [**SensorOptsType**](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md), который SensorManager формирует из конфигурации *device.json*. Конфигурация для модуля имеет следующий вид:
```json
"AirAlcohol": 
{
    "pins": ["A3"],
    "name": "MQ3",
    "article": "02-501-0110-201-0001",
    "type": "hybrid",
    "channelNames": ["Alcohol"],
    "quantityChannel": 1,
    "subChannels": ["Heater-0"],
    "busTypes": [],
    "manufacturingData": {},
    "modules": ["plcAirAlcoholMQ3.min.js"],
    "config": {
      "baseline": 1000
    }
}
```
Следует выделить следующие ноды, имеющие особенности для этого модуля:
- <mark style="background-color: lightblue">baseline</mark> - норма концентрации паров спирта в помещении, где проводится измерение. Является корректирующей величиной;
- <mark style="background-color: lightblue">subChannels</mark> - так как датчик является гибридом, у него присутствуют субканалы актуатора для контроля нагревателя. Пример **SensorOptsType** для нагревателя:
```json
"Heater": 
{
    "pins": ["P11"],
    "name": "Heater",
    "article": "",
    "type": "actuator",
    "channelNames":  ["dpwm"],
    "typeOutSignals": ["pwm"],
    "quantityChannel": 1,
    "busTypes": [],
    "manufacturingData": {},
    "modules": ["plcPortActuator.min.js"]
}
```
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

- <mark style="background-color: lightblue">Init()</mark> - необходим для первоначальной настройки датчика;
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
//Создание объекта датчика и массива каналов
try {
  let mq3 = H.DeviceManager.Service.CreateDevice("AirAlcohol")[0];
  mq3.Start();

  // Вывод данных
  setInterval(() => {
    H.Logger.Service.Log({service: 'MQ3', level: 'I', msg: `Alcohol fumes: ${(mq3.Value).toFixed(3)} ppm`});
  }, 1000);
}
catch (e) {
  console.log(e);
}
```
Вывод данных в консоль:
<p align="left">
  <img src="./res/output.png" title="hover text">
</p>
<div>

# Зависимости
- [ClassSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md)
- [DeviceManager](https://github.com/Konkery/ModuleSensorManager/blob/main/README.md)
- [ModuleProcess](https://github.com/Konkery/ModuleProcess/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)

</div>
