<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleAirQualityCCS811
<div style = "color: #555">
    <p align="center">
    <img src="logo.png" width="400" title="hover text">
    </p>
</div>

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для работы с датчиком качества воздуха на базе чипа [CCS811](https://github.com/Konkery/ModuleAirQualityCCS811/blob/main/res/CCS811_Datasheet.pdf). Модуль является неотъемлемой частью фреймворка Horizon Automated. Датчик на баз чипа CCS811 позволяет получить данные о концентрации углекислого газа в воздухе в миллионных долях (ppm) и о концентрации летучих органических веществах в миллиардных долях (ppb). Во время работы датчик будет нагреваться, что является естественным для данного тпа газоанализаторов (MOX). Модуль работает по интерфейсу I2C. Модуль имеет следующие архитектурные решения фреймворка Horizon Automated:
- является потомком класса [ClassSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md);
- использует шину через глобальный объект [I2Cbus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md).

Количество каналов для снятия данных - 2.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает объект типа [**SensorOptsType**](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md), который SensorManager формирует из конфигурации *device.json*. Конфигурация для модуля имеет следующий вид:
```json
"AirCCS811": 
{
    "bus": "I2C10",
    "name": "CCS811",
    "article": "02-501-0110-238-0001",
    "type": "sensor",
    "channelNames": ["CO2", "TVOC"],
    "quantityChannel": 2,
    "busTypes": ["i2c"],
    "manufacturingData": {},
    "modules": ["plcAirQualityCCS811.min.js"],
    "config": {
      "repeatability": "LOW",
      "mode": 1,
      "temp": 24,
      "hum": 45
    }
}
```
Следует выделить следующие ноды, имеющие особенности для этого модуля:
- <mark style="background-color: lightblue">repeatability</mark> - повторяемость датчика (см. документацию на датчик);
- <mark style="background-color: lightblue">mode</mark> - число от 0 до 4 - режим работы датчика (см. документацию на датчик);
- <mark style="background-color: lightblue">temp</mark> - значение температуры воздуха в градусах Цельсия, нужно для более точного расчёта данных, не является обязательным полем, использовать совместно с полем hum;
- <mark style="background-color: lightblue">hum</mark> - значение влажности воздуха в процентах, нужно для более точного расчёта данных, не является обязательным полем, использовать совместно с полем temp.
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_Sensor</mark> - объект базового класса;
- <mark style="background-color: lightblue">_MinPeriod</mark> - минимальная частота опроса датчика - 250 мс;
- <mark style="background-color: lightblue">_UsedChannels</mark> - используемые каналы данных по нотации архитектуры фреймворка Horizon Automated;
- <mark style="background-color: lightblue">_Interval</mark> - функция SetInterval для опроса датчика;
- <mark style="background-color: lightblue">_Margin</mark> - объект, хранящий поля temp и hum - значения температуры и влажности воздуха, необходимы для более точного расчёта выходных данных;
- <mark style="background-color: lightblue">_CanRead</mark> - булевый флаг, разрешающий читать данные с датчика или наоборот запрещающий.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Init()</mark> - метод обязывающий провести инициализацию датчика. Если поле _Margin не undefined - запускает метод SetTempHumMargin();
- <mark style="background-color: lightblue">SetTempHumMargin(_margin)</mark> - записывает в определенные регистры датчика значения температуры и влажности воздуха для повышения точности расчётов выходных данных;
- <mark style="background-color: lightblue">Start(_num_channel, _period)</mark> - метод запускает циклический опрос определенного канала датчика с заданной периодичностью в мс. Переданное значение периода сверяется с минимальным значением, хранящимся в поле *_MinPeriod*, и, если требуется, регулируется;
- <mark style="background-color: lightblue">ConfigureRegs(_opts)</mark> - меняет режим работы датчика, на время перезапуска меняет флаг поля _CanRead на false;
- <mark style="background-color: lightblue">ChangeFreq(_num_channel, _period)</mark> - метод останавливает опрос указанного канала и запускает его вновь с уже новой частотой.
- <mark style="background-color: lightblue">Stop(_num_channel)</mark> - метод прекращает считывание значений с заданного канала.
</div>

### Возвращаемые данные
<div style = "color: #555">

Датчик предоставляет данные о концентрации углекислого газа в воздухе в миллионных долях (ppm), и о концентрации летучих органических веществ в миллиардных долях (ppb). Значения концентрации углекислого газа варьируются от 400ppm до 8192ppm, а для ЛОВ - от 0ppb до 1187ppb. Значения, выходящие за обозначенные отрезки приравниваются к максимальному/минимальному значению отрезка. Работая в режиме 4 датчик возвращает необработанные сырые данные о токах, проходящих через датчик - силу тока в микроамперах и текущее напряжение в вольтах.
</div>

### Примеры
<div style = "color: #555">

Фрагмент кода для вывода данных о давлении и температуре в консоль раз в одну секунду. Предполагается, что все необходимые модули уже загружены в систему:
```js
//Создание объекта датчика и массива каналов
try {
  let ccs = H.DeviceManager.Service.CreateDevice("AirCCS811");
  ccs.Start();

  // Вывод данных
  setInterval(() => {
    H.Logger.Service.Log({service: 'MQ4', level: 'I', msg: `CO2: ${(ccs[0].Value).toFixed(3)} ppm    TVOC: ${(ccs[1].Value)} ppb`});
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
- [ClassBaseI2CBus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md)
- [ClassSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md)
- [DeviceManager](https://github.com/Konkery/ModuleSensorManager/blob/main/README.md)
- [ModuleProcess](https://github.com/Konkery/ModuleProcess/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)


</div>