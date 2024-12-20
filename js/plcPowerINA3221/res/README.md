<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModulePowerINA3221
<div style = "color: #555">
    <p align="center">
    <img src="logo.png" width="400" title="hover text">
    </p>
</div>

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для работы с датчиком на базе чипа [INA3221](https://github.com/Konkery/ModulePowerINA3221/blob/main/res/INA3221_Datasheet.pdf) - трехканальном цифровом измерителе тока и напряжения. Диапазон измеряемого напряжения находится в диапазоне 0 — 26 Вольт, а максимальный измеряемый ток составляет около 1,6 Ампера на канал. На каждом установлено по шунту, которые представляют собой три резистора с маркировкой R100 (имеют сопротивление 0,1 Ом). Модуль является неотъемлемой частью фреймворка Horizon Automated. Датчик на баз чипа INA3221 позволяет получить данные о напряжении, а из показаний высчитать значения силы тока и мощности. Модуль работает по интерфейсу I2C. Модуль имеет следующие архитектурные решения фреймворка Horizon Automated:
- является потомком класса [ClassMiddleSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md);
- создаёт шину через глобальный объект [I2Cbus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md).

Количество каналов для снятия данных - 12.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает объект типа [**SensorOptsType**](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md), который SensorManager формирует из конфигурации *device.conf*. Конфигурация для модуля имеет следующий вид:
```js
"00": {
    "pins": [],
    "bus": "I2C11",
    "address": 64, //0x40
    "name": "INA3221",
    "article": "02-501-0106-201-0002",
    "type": "sensor",
    "channelNames": ["vs1", "vb1", "c1", "p1", "vs2", "vb2", "c2", "p2", "vs3", "vb3", "c3", "p3", "vs4", "vb4", "c4", "p4"],
    "typeInSignal": "digital",
    "typeOutSignal": "digital",
    "quantityChannel": 12,
    "busTypes": ["i2c"],
    "manufacturingData": {},
    "modules": ["ModulePowerINA3221.min.js"],
    "config": {
      "WAI": 21577, //0x5449
      "channels": [1, 2, 3],
      "rShunts": [0.1, 0.1, 0.1],
      "averaging": 0,
      "busConvert": 1100,
      "shuntConvert": 1100,
      "vbus": 0,
      "mode": 7
    },				
}
```
ID конфигурации должен быть строкой, представляющий число от 0 до 99, и быть представлено в виде двух цифр. Следует выделить следующие ноды, имеющие особенности для этого модуля:
- <mark style="background-color: lightgreen">address</mark> - адрес датчика на I2C шине. Значение по умолчанию - **0х40**. Адрес на датчике меняется путём соединения адресных выводов A0 и A1 с другими выводами. Для изменения адреса датчика смотреть [документацию](https://github.com/Konkery/ModulePowerINA3221/blob/main/res/INA3221_Datasheet.pdf), стр. 20, таблица 1;
- <mark style="background-color: lightgreen">config</mark> - объект, содержащий настройки конфигурации датчика. **Необязательное поле**.

Объект *config* необходим для настройки режимов работы сенсора. Все поля являются необязательными, так как имеют значение по умолчанию (далее выделены зеленым). Неподдерживаемые значения будут проигнорированны. Поддерживаются следующие поля конфигурации:
- <mark style="background-color: orange">WAI</mark> - Значение регистра *Who am I*. Значение по умолчанию - <mark style="background-color: green">21657</mark> (0x5449);
- <mark style="background-color: orange">channels</mark> - массив номеров работающих каналов. Более подробно - смотреть стр. 17 [документации](https://github.com/Konkery/ModulePowerINA3221/blob/main/res/INA3221_Datasheet.pdf). Значение по умолчанию - <mark style="background-color: green">3.2768</mark>;
- <mark style="background-color: orange">rShunts</mark> - массив сопротивлений шунтирующих резисторов в омах для каждого из трёх каналов. Значение по умолчанию всех - <mark style="background-color: green">0.1</mark>;
- <mark style="background-color: orange">averaging</mark> - количество сэмплов, используемое для усреднения получаемых данных. Поддерживаемые значения: <mark style="background-color: green">1</mark>, 4, 16, 64, 128, 256, 512, 1024 (стр. 26 [документации](https://github.com/Konkery/ModulePowerINA3221/blob/main/res/INA3221_Datasheet.pdf));
- <mark style="background-color: orange">busConvert</mark> - время преобразования напряжения на шине в микросекундах. Поддерживаемые значения: 140, 204, 332, 588,<mark style="background-color: green">1100</mark>, 2116, 4156, 8244 (стр. 26 [документации](https://github.com/Konkery/ModulePowerINA3221/blob/main/res/INA3221_Datasheet.pdf));
- <mark style="background-color: orange">shuntConvert</mark> - время преобразования напряжения на шунте в микросекундах. Поддерживаемые значения: 140, 204, 332, 588,<mark style="background-color: green">1100</mark>, 2116, 4156, 8244 (стр. 26 [документации](https://github.com/Konkery/ModulePowerINA3221/blob/main/res/INA3221_Datasheet.pdf));
- <mark style="background-color: orange">vbus</mark> - значение напряжения на шине. Используется для вычисления силы тока и мощности при подключении по схеме верхнего плеча. Для использования **не должно** ровняться нулю;
- <mark style="background-color: orange">mode</mark> - режим работы датчика. Здесь настраивается одиночное или постоянное преобразование, выключение всего датчика или АЦП. Подробнее читать стр. 26 [документации](https://github.com/Konkery/ModulePowerINA3221/blob/main/res/INA3221_Datasheet.pdf). Поддерживаемые значения: 0, 1, 2, 3, 4, 5, 6, <mark style="background-color: green">7</mark>. В режиме по умолчанию происходит постоянное преобразование показаний напряжения с шины и шунта всех вклученных каналов.
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_Sensor</mark> - объект низкоуровневого класса;
- <mark style="background-color: lightblue">_Config</mark> - объект конфигурации по выше описанной нотации;
- <mark style="background-color: lightblue">_MinPeriod</mark> - минимальная частота опроса датчика - 20 мс;
- <mark style="background-color: lightblue">_Interval</mark> - функция SetInterval для опроса датчика.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Init()</mark> - метод обязывающий провести инициализацию датчика с переданной конфигурацией и калибровкой или со значениями по умолчанию;
- <mark style="background-color: lightblue">Configure(_cfg)</mark> - конфигурирует датчик, принимает объект конфигурации по выше описанной нотации. Все поля необязательны;
- <mark style="background-color: lightblue">EnableChannels(_arr)</mark> - принимает массив номеров каналов, которые будут включены, если в данный момент не работают. Принимает массив со значениями 1, 2 и 3;
- <mark style="background-color: lightblue">DisableChannels(_arr)</mark> - принимает массив номеров каналов, которые будут выключены, если в данный момент работают. Принимает массив со значениями 1, 2 и 3;
- <mark style="background-color: lightblue">Start(_num_channel, _period)</mark> - метод запускает циклический опрос определенного канала датчика с заданной периодичностью в мс. Переданное значение периода сверяется с минимальным значением, хранящимся в поле *_MinPeriod*, и, если требуется, регулируется;
- <mark style="background-color: lightblue">ChangeFreq(_num_channel, _period)</mark> - метод останавливает опрос указанного канала и запускает его вновь с уже новой частотой.
- <mark style="background-color: lightblue">Stop(_num_channel)</mark> - метод прекращает считывание значений с заданного канала.
</div>

### Низкоуровневый класс
<div style = "color: #555">

В модуле присутствует низкоуровневый класс для работы с регистрами датчика.

Поля низкоуровнего класса:
- <mark style="background-color: #AC5207">_I2с</mark> - шина I2C, к которой подключен датчик;
- <mark style="background-color: #AC5207">_Address_</mark> - адрес датчика на I2C шине.

Методы низкоуровнего класса:
- <mark style="background-color: #AC5207">ReadWord(_reg)</mark> - читает 2 байта с указанного региста;
- <mark style="background-color: #AC5207">WriteWord(_reg, _data)</mark> - записывает 2 байта в указанный регистр;
- <mark style="background-color: #AC5207">WhoIam(_wai)</mark> - производит сравнение региста WAI с переданным значением (только младшие 2 байта);
- <mark style="background-color: #AC5207">Reset()</mark> - даёт команду на перезапуск датчика;
- <mark style="background-color: #AC5207">UnsignedToSigned(_val)</mark> - превращает беззнаковое двубайтовое число в число со знаком;
- <mark style="background-color: #AC5207">ReadShuntVoltageRaw(_chn)</mark> - считывает сырое значение напряжения на шунте с указанного канала;
- <mark style="background-color: #AC5207">ReadBusVoltageRaw(_chn)</mark> - считывает сырое значение напряжения на шине с указанного канала;
- <mark style="background-color: #AC5207">EnableChannel(_chn)</mark> - включает указанный канал;
- <mark style="background-color: #AC5207">DisableChannel(_chn)</mark> - выключает указанный канал;
- <mark style="background-color: #AC5207">ConfigureAveraging(_val)</mark> - устанавливает соответствующий флаг усреднения в конфигурационном регистре;
- <mark style="background-color: #AC5207">ConfigureBusConvertion(_val)</mark> - устанавливает соответствующий флаг времени преобразования на шине в конфигурационном регистре;
- <mark style="background-color: #AC5207">ConfigureShuntConvertion(_val)</mark> - устанавливает соответствующий флаг времени преобразования на шунте в конфигурационном регистре;
- <mark style="background-color: #AC5207">ConfigureMode(_val)</mark> - устанавливает соответствующий флаг режима работы датчика.
</div>

### Возвращаемые данные
<div style = "color: #555">

Датчик предоставляет сырые данные через методы низкоуровнего класса. Для перевода напряжения на шине в вольты (V), необходимо умножить полученное значение на _0.005_ - перевод миливольт в вольты плюс смещение. Для перевода напряжения шунта в вольты - полученное значение умножить на _0.001_. Сила тока (А) получается путём деления полученного напряжения на значения сопротивления шунта соответствующего канала. Мощность в миливаттах (mW) получается путём умножения полученного значения силы тока на значение напряжения (или на значения поля конфигурации vbus, если последнее не равно нулю).
</div>

### Примеры
<div style = "color: #555">

Фрагмент кода для вывода данных о давлении и температуре в консоль раз в одну секунду. Предполагается, что все необходимые модули уже загружены в систему:
```js
//Создание объекта датчика
try {
    let ina = SensorManager.CreateDevice("00");
    let i;
    for (i = 0; i<12; i++){
        ina[i].Start(1000);
    }
  
    // Вывод данных
    setInterval(() => {
        for (i = 0; i < 3; i++) {
            console.log("Channel " + (i+1));
            console.log(`Voltage Shunt: ${(ina[i * 4].Value).toFixed(4)} V    Voltage Bus: ${(ina[i * 4 + 1].Value).toFixed(4)} V    Current: ${(ina[i * 4 + 2].Value).toFixed(4)} A    Power: ${(ina[i * 4 + 3].Value).toFixed(4)} mW`);
        }
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
- [SensorManager](https://github.com/Konkery/ModuleSensorManager/blob/main/README.md)
- [ModuleProcess](https://github.com/Konkery/ModuleProcess/blob/main/README.md)
- [ClassBaseI2CBus](https://github.com/Konkery/ModuleBaseI2CBus/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)


</div>  