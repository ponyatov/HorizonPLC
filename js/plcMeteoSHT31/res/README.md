<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleMeteoSHT31
<p align="center">
  <img src="logo.png" width="400" title="hover text">
</p>

-----------------

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для работы с метеодатчиком на базе чипа [SHT31](https://github.com/Konkery/ModuleMeteoSHT31/blob/main/res/sht31_datasheet.pdf). Модуль является неотъемлемой частью фреймворка Horizon Automated. Датчик на базе чипа SHT31 позволяет получить данные о температуре относительной влажности воздуха. Модуль работает по интерфейсу I2C. Модуль имеет следующие архитектурные решения фреймворка Horizon Automated:
- является потомком класса [ClassMiddleSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md);
- создаёт шину через глобальный объект [I2Cbus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md).

Количество каналов для снятия данных - 2. Типовая погрешность измерений датчика: 0.2°С для температуры и 0.2% для влажности (см. документацию).
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает объект типа [**SensorOptsType**](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md), который SensorManager формирует из конфигурации *device.conf*. Конфигурация для модуля имеет следующий вид:
```json
"MeteoSHT":
{
    "bus": "I2C10",
    "name": "MeteoSHT31",
    "article": "02-501-0105-201-0006",
    "type": "sensor",
    "channelNames": ["temperature", "humidity"],
    "quantityChannel": 2,
    "busTypes": ["i2c"],
    "manufacturingData": {},
    "modules": ["plcMeteoSHT31.min.js"]
}
```
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_sensor</mark> - объект базового класса;
- <mark style="background-color: lightblue">_minPeriod</mark> - минимальная частота опроса датчика - 1000 мс;
- <mark style="background-color: lightblue">_usedChannels</mark> - используемые каналы данных по нотации архитектуры фреймворка Horizon Automated;
- <mark style="background-color: lightblue">_interval</mark> - функция SetInterval для опроса датчика.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Init(_sensor_props)</mark> - метод обязывающий провести инициализацию датчика настройкой необходимых для его работы регистров;
- <mark style="background-color: lightblue">Reset()</mark> - метод сбрасывает датчик в состояние по-умолчанию;
- <mark style="background-color: lightblue">Start(_num_channel, _period)</mark> - метод запускает циклический опрос определенного канала датчика с заданной периодичностью в мс. Переданное значение периода сверяется с минимальным значением, хранящимся в поле *_minPeriod*, и, если требуется, регулируется;
- <mark style="background-color: lightblue">ChangeFreq(_num_channel, _period)</mark> - метод останавливает опрос указанного канала и запускает его вновь с уже новой частотой.
- <mark style="background-color: lightblue">Stop(_num_channel)</mark> - метод прекращает считывание значений с заданного канала.
</div>

### Возвращаемые данные
<div style = "color: #555">

Датчик предоставляет данные об относительной влажности воздуха в процентах от 0% до 100%, и температуру окружающей среды от 0 до 90 градусов по шкале цельсия. Перевода значений температуры в другую шкалу выполняется по следующим формулам:
- В Кельвины: t + 273.15;
- В Фарегейты: (t * 9/5) + 32;
</div>


### Примеры
<div style = "color: #555">

Пример кода для вывода данных раз в одну секунду:
```js
let meteo = H.DeviceManager.Service.CreateDevice('MeteoSHT');

// Запускаем опрос 
meteo.Start();

const ch0 = meteo.[0];
const ch1 = meteo.GetChannel[1];

let interval = setInterval(() => {
    H.Logger.Service.Log({service: 'GL5528', level: 'I', msg: `Temperature: ${(ch0.Value).toFixed(2)} C    Humidity: ${(ch1.Value).toFixed(2)} %`});
}, 1000);
```
Вывод данных в консоль:
<p align="left">
  <img src="./res/output.png" title="hover text">
</p>

Пример перевода полученной температуры с *ch0* в Кельвины:
```js
...
let k = H.DeviceManager.Service.CreateDevice('MeteoSHT')[1];

k.Start();

console.log((k.Value + 273.15) + "K");
```
</div>

# Зависимости
- [ClassBaseI2CBus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)
</div>