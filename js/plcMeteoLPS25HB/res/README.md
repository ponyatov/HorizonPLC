<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleMeteoLPS25HB
<p align="center">
  <img src="logo.png" width="400" title="hover text">
</p>

-----------------

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для работы с метеодатчиком на базе чипа [LPS25HB](https://github.com/Konkery/ModuleMeteoLPS25HB/blob/main/res/lps25hb.pdf). Модуль является неотъемлемой частью фреймворка Horizon Automated. Датчик на базе чипа LPS25HB позволяет получить данные о температуре, атмосферном давлении и относительной высоте. Модуль работает по интерфейсу I2C. Модуль имеет следующие архитектурные решения фреймворка Horizon Automated:
- является потомком класса [ClassMiddleSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md);
- использует шину через глобальный объект [I2Cbus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md).
 
Количество каналов для снятия данных - 3. Типовая погрешность измерений датчика: 10 Pa для давления (см. документацию).
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает объект типа [**SensorOptsType**](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md), который SensorManager формирует из конфигурации *device.conf*. Конфигурация для модуля имеет следующий вид:
```json
"MeteoLPS": 
{
    "bus": "I2C12",
    "name": "MeteoLPS25HB",
    "article": "02-501-0105-201-0005",
    "type": "sensor",
    "channelNames": ["temperature", "pressure", "altitude"],
    "quantityChannel": 3,
    "busTypes": ["i2c"],
    "manufacturingData": {},
    "modules": ["plcMeteoLPS25HB.min.js"]
}
```

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_Sensor</mark> - объект базового класса;
- <mark style="background-color: lightblue">_MinPeriod</mark> - минимальная частота опроса датчика - 1000 мс;
- <mark style="background-color: lightblue">_UsedChannels</mark> - используемые каналы данных по нотации архитектуры фреймворка Horizon Automated;
- <mark style="background-color: lightblue">_CalPressure</mark> - установленное атмосферное давление на нуле метров над уровнем моря;
- <mark style="background-color: lightblue">_Interval</mark> - функция SetInterval для опроса датчика.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Init()</mark> - необходим для первоначальной настройки датчика;
- <mark style="background-color: lightblue">Start(_num_channel, _period)</mark> - запускает циклический опрос заданного канала датчика. Переданное значение периода сверяется с минимальным значением хранящимся в поле *_minPeriod* и, если требуется, регулируется;
- <mark style="background-color: lightblue">SetDefaultPressure(pressure)</mark> - устанавливает значение поля _calPressure;
- <mark style="background-color: lightblue">ChangeFreq(_num_channel, _period)</mark> - останавливает опрос заданного канала и запускает его вновь с уже новой частотой;
- <mark style="background-color: lightblue">Stop(_num_channel)</mark> - прекращает считывание значений с заданного канала.
</div>

### Возвращаемые данные
<div style = "color: #555">

Модуль предоставляет данные об атмосферном давлении в **килопаскалях**. Для перевода этих значений в другие метрики можно воспользоваться следующим формулам:
- В мм рт ст: p = p0 * 7,501;
- В Бары: p = p0 / 100;
</div>


### Примеры
<div style = "color: #555">

Фрагмент кода для вывода данных о давлении и температуре в консоль раз в одну секунду. Предполагается, что все необходимые модули уже загружены в систему:
```js
//Создание объекта класса
let baro = H.DeviceManager.Service.CreateDevice('MeteoLPS');

// Запускаем опрос 
baro.Start();

const ch0 = baro[0];
const ch1 = baro[1];
const ch2 = baro[2];

//Вывод данных
setInterval(() => {
    H.Logger.Service.Log({service: 'LPS25HB', level: 'I', msg: `Temperature: ${(ch0.Value).toFixed(2)} C    Pressure: ${(ch1.Value).toFixed(3)} kPa    Altitude: ${sum.toFixed(2)} m`});
}, 1000);
```
Вывод данных в консоль:
<p align="left">
  <img src="./res/output.png" title="hover text">
</p>
<div>

# Зависимости
- [ModuleI2CBus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)
</div>