<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleProcess
<p align="center">
  <img src="./res/logo.png" width="400" title="hover text">
</p>

-----------------

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для инициализации платформы, загрузки модулей, необходимых для функционирования системы, подключению к сети и инициализация часов. Запуск модуля осущетвляется при включении платформы автоматически. Такое поведение обеспечено особенностью среды Espruino: js-код в  файле с именем *.boot0*, находящимся во flash-памяти платформы, будет выполнен автоматически при запуске. Такеж для инициализации и работы с платформой модулю взаимодействует с тремя конфигурацонными файлами. Файл *init.conf* содержит имя-идентификатор платформы, часовой пояс по-умолчанию и имена файлов базовых модулей, запуск которых осуществляется Process. **Без этого файла система не запуститься!**. Файл *device.conf* содержит информацию о датчиках и актуаторах, отсортированную по запускаемым пользовательским программам. Модуль взаимодействует с этим файлом по запросу SensorManager, но без этого конфигурационного файла **система не запустится!**. Файл *network.conf* содержит конфигурацию сетевого взаимодействия, например список сетей, к которым осуществлять автоматическое подключение. Без этого файла система запустится, но автоматического подключения к сети WiFi осуществлено не будет. Модуль имеет следующие архитектурные решения:
- реализует паттерн синглтон.
</div>

# Конфигурационные json файлы
<div style = "color: #555">

Для корректного функционирования фреймворка, во Flash-память должны быть загружены следующие конфигурационные файлы. При отсутствии некоторых из них фреймворк не будет запускаться:
- <mark style="background-color: lightblue">init.json</mark> - базовая конфигурация PLC, содержащая ключевую информацию для работы системы. Является обязательным файлом;
- <mark style="background-color: lightblue">device.json</mark> - файл, содержащий конфигурации подключенных к PLC датчикам и актуатором, а также софтверных шин, которые будут инициализированны при запуске. Является обязательным файлом;
- <mark style="background-color: lightblue">services.json</mark> - файл, содержащий конфигурации основных модулей и служб фреймворка. Является обязательным файлом;;
- <mark style="background-color: lightblue">network.json</mark> - файл, содержащий конфигурации подключения к сети. Не является обязательным файлом. Подкючение к сети будет пропущено при отсутсвии данного файла;
- <mark style="background-color: lightblue">ports.json</mark> - файл, содержащий правила настройки режимов пинов при старте системы. Не является обязательным файлом, настройка режимов портов будет пропущена при отсутсвии данного файла.
</div>

### init.json
<div style = "color: #555">

Файл содержит три поля:
- <mark style="background-color: lightblue">name</mark> - Имя PLC. При пустом поле системой будет присвоено имя unknownPLC;
- <mark style="background-color: lightblue">application</mark> - имя запускаемой программы. При пустом поле загрузится программа .bootcde, если такая есть. при отсутствии .bootcde никакая программа не будет запущена после инициализации фреймворка.
- <mark style="background-color: lightblue">deviceConf</mark> - имя запускаемой конфигурации из файла devices.json. При отсуствии поля будет выбрана конфигурация с именем default. Если конфигурация default не будет описана, то система не запустится и выдаст ошибку.

Пример файла init.json:
```json
{
    "name" : "plcXX",
    "application" : "app1.js",
    "deviceConf" : "app1"
}
```
</div>

### devices.json
<div style = "color: #555">

Файл содержит ноды с конфигурацией модулей. Минимум одну, и максимум - теоретически бесконечность, ограниченная размером файла, который может поместиться во Flash памяти PLC. Конфигурация с именем default будет использована по-умолчанию, если не указана другая, или указанная отсутствует. Каждая конфигурация содержит ноды с описанием датчиков, актуаторов и софтверных шин. Подробнее смотрите документацию на конкретный датчик.

Пример файла devices.json. Содержит две конфигурации, одна по-умолчанию. В конфигурации app1 объявлен датчик освещённости GL5528, а также создана одна I2C шина на портах P7 и P2. К этой шине подключен газовый датчик CCS811:
```json
{
  "default": {  // Имя конфигурации
    "SysLED": { // Конфигурация актуатора - светодиода на порту B6
      "pins": ["B6"],
      "name": "SysLED",
      "article": "02-501-0704-201-0002",
      "type": "actuator",
      "quantityChannel": 1,
      "modules": ["ModuleAnalogLed.min.js"]
    },
    "SysBuzzer": {
      "pins": ["A1"],
      "name": "SysBuzzer",
      "article": "02-501-0204-000-0001",
      "type": "actuator",
      "quantityChannel": 1,
      "modules": ["ModuleBuzzer.min.js"]
    }
  },
  "app1": {
    "bus": {  // Нода с софтверными шинами
      "I2C10": {"sda": "P7", "scl": "P2", "bitrate": 400000 }
    },
    "LightSensor": {
      "pins": ["A3"],
      "name": "GL5528",
      "article": "02-501-0105-201-0003",
      "type": "sensor",
      "channelNames": ["light","resistance"],
      "quantityChannel": 2,
      "modules": ["ModuleLightGL5528.min.js"]
    },
    "GasSensor": {
      "pins": [],
      "bus": "I2C10",
      "name": "CCS811",
      "article": "02-501-0105-201-0006",
      "type": "sensor",
      "channelNames": ["CO2", "TVOC"],
      "quantityChannel": 2,
      "busTypes": ["i2c"],
      "modules": ["ModuleCCS811.min.js"]
    }
  }
}
```
</div>

### services.json
<div style = "color: #555">

Файл содержит описание служб, которые будут инициализированы при запуске фреймворка. Каждая нода именуется запускаемой ею службой и имеет следующую конструкцию полей:
- <mark style="background-color: lightblue">status</mark> - состояние службы. По-умолчанию stopped, меняется на running при успешном запуске;
- <mark style="background-color: lightblue">errorMsg</mark> - изначально пустая строка, которая заполнится сообщением ошибки в случае возникновения последней;
- <mark style="background-color: lightblue">importance</mark> - важность службы. Если это поле имеет значение Primary, и при запуске этой службы произойдёт ошибка, то фреймворк не запустится и выдаст ошибку;
- <mark style="background-color: lightblue">initOrder</mark> - порядковый номер службы при запуске фреймворка. Перед непосредственным запуском служб фреймворк отсортирует их по значению этого поля в порядке возрастания;
- <mark style="background-color: lightblue">advancedOptions</mark> - дополнительные опции для запуска службы. Поле может быть пустым, содержание зависит от конкретной службы;
- <mark style="background-color: lightblue">dependency</mark> - имя .js файла во Flash памяти PLC, реализующего данную службу;
- <mark style="background-color: lightblue">description</mark> - Текстовое описание службы.

Пример файла services.json, содержащий неполный список служб:
```json
{
  "Logger" : {
    "Status" : "stopped",
    "ErrorMsg" : "",
    "Importance" : "Primary",
    "InitOrder" : 10,
    "AdvancedOptions" : {
        "server" : "192.168.50.251",
        "port" : 5142
    }, 
    "Dependency" : ["ModuleLogger.min.js"], 
    "Description" : "Logger desription"
  },
  "I2Cbus" : {
    "Status" : "stopped",
    "ErrorMsg" : "",
    "Importance" : "Auxilary",
    "InitOrder" : 40,
    "AdvancedOptions" : { }, 
    "Dependency" : ["ModuleI2CBus.min.js"], 
    "Description" : "I2CBus manager desription"
  },
  "SensorManager" : {
    "Status" : "stopped",
    "ErrorMsg" : "",
    "Importance" : "Primary",
    "InitOrder" : 70,
    "AdvancedOptions" : { }, 
    "Dependency" : ["ModuleSensorManager.min.js"],
    "Description" : "ModuleSensorManager desription"
  }
}
```
</div>

### ports.json
<div style = "color: #555">

Файл содержит список пинов, которые **НЕ** будут переведены в режим *input*, при старте фреймворка. Содержание файла зависит от используемого контроллера, при составлении данного файла рекомендуется пользоваться документацией выбранного чипа.

Пример файла ports.json:
```json
{
  "ports" : [
    "A10",
    "A11",
    "B3",
    "B4",
    "B5",
    "C8"
  ]
}
```
</div>

# Файлы инициализации bootX
<div style = "color: #555">

В фреймворке реализована трёхстадийная система загрузки. Запуск разделён на три файла: .boot0, .boot1 и .boot2, которые выполняются друг за другом при старте системы. Для корректного функционирования фреймворка, все три файла должны быть загружы во Flash память PLC.

- <mark style="background-color: lightblue">.boot0</mark> - код в файле реализует настройку консоли для корректной работы PLC в автономном режиме (не подключен к компьютеру). Также осуществляется перевод всех портов в режим input за исключением тех, что указаны в файле ports.json;
- <mark style="background-color: lightblue">.boot1</mark> - код в этом файле производит проверку на аварийный запуск, а также запускает службу Process - главную службу фреймворка;
- <mark style="background-color: lightblue">.boot2</mark> - код инициализует датчики и актуаторы, опираясь на выбранную конфигурацию из файла devices.json. Созданные каналы помещаются в глобальный объект Devices с указанным именем устройства.

### Аварийный запуск системы
Фреймворком предусмотрен механизм обхода загрузки служб и программ в случае ошибки. Для этого требуется удерживать кнопку BTN1 на запуске PLC. Фреймворк пропустит запуск своих служб и инициализацию датчиков с актуаторами, и в итоге будет выполнен файл SysDeadEnd.js. Это файл должен быть предварительно загружен во Flash память PLC.

</div>

### Примеры
<div style = "color: #555">

Создание объекта Process в файле .boot0.Предполагается, что все необходимые модули уже загружены в систему:
```js
let Process = new (require("ModuleProcess.min.js"))();
Process.Run();
```
Вывод при запуске системы в консоль:
<p align="left">
  <img src="./res/output.png" title="hover text">
</p>
</div>

# Зависимости
- [ModuleLogger](https://github.com/Konkery/ModuleLogger/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)
- [ModuleI2CBus](https://github.com/Konkery/ModuleI2CBus/blob/main/README.md)
- [ModuleSPIBus](https://github.com/Konkery/ModuleSPIBus/blob/main/README.md)
- [ModuleUARTBus](https://github.com/Konkery/ModuleUARTBus/blob/main/README.md)
- [ModuleActuator](https://github.com/Konkery/ModuleActuator/blob/main/README.md)
- [ModuleSensor](https://github.com/Konkery/ModuleSensor/blob/main/README.md)
- [ModuleSensorManager](https://github.com/Konkery//blob/main/README.md)
</div>
