<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleBattery

<div style = "color: #555">
    <p align="center">
    <img src="logo.png" width="400" title="hover text">
    </p>
</div>

## Лицензия

<div style = "color: #555">
В разработке
</div>

## Описание
<div style = "color: #555">

Модуль предназначен для мониторинга уровня заряда аккумулятора в рамках фреймворка Horizon Automated. Разработан в соответствии с нотацией архитектуры датчиков и является потомком класса [ClassSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md). Количество каналов - 2.

0-й канал - уровень заряда;
1-й канал - величина напряжения на аккумуляторе. 

Логика модуля построена вокруг мониторинга ADC-порта, на который подается сигнал, прямо пропорциональный величине напряжения на источнике питания.  
</div>

## Конструктор
<div style = "color: #555">

Конструктор принимает данные из конфига. Пример ниже:
```json
"Battery": 
{
    "fullChargeV": 4.2,
    "dischargeV": 3.4,
    "k": 0.7797,
    "pins": ["A0"],
    "name": "Battery",
    "article": "02-501-0402-201-0001",
    "type": "actuator",
    "channelNames": ["charge, voltage"],
    "quantityChannel": 2,
    "busTypes": [],
    "manufacturingData": {},
    "modules": ["plcBattery.min.js"]
}
```
Следует выделить следующие ноды, имеющие особенности для этого модуля:
- <mark style="background-color: lightblue">fullChargeV</mark> - напряжение на аккумуляторе при макс. уровне заряда;
- <mark style="background-color: lightblue">dischargeV</mark> - напряжение на аккумуляторе при мин. уровне заряда;
- <mark style="background-color: lightblue">k</mark> - коэффициент делителя напряжения.

**Примечание**: значение *fullChargeV* можно замерить самостоятельно. *dischargeV* выбирается в зависимости от модели источника питания и температуры. Коэффициент *k* можно вычислить либо зная номиналы резисторов, либо рассчитав *Uвых/Uвх*.
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_K</mark> - коэффициент делителя напряжения;
- <mark style="background-color: lightblue">_FullChargeV</mark> - указанное напряжение на заряженном аккумуляторе;
- <mark style="background-color: lightblue">_DischargeV</mark> - указанное напряжение на разряженном аккумуляторе;
- <mark style="background-color: lightblue">_Interval</mark> - поле для хранения ссылки на интервал опроса датчика.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Start()</mark> - запускает циклический опрос измерительного канала датчика;
- <mark style="background-color: lightblue">Stop()</mark> - прекращает считывание значений с заданного канала;
</div>

### События
<div style = "color: #555">

- <mark style="background-color: lightblue">battery-low()</mark> - уровень заряда около 20%;
- <mark style="background-color: lightblue">battery-critical()</mark> - уровень заряда около 10%.

**Примечание:** подписаться на оповещения о низком уровне заряда можно с помощью команд 
`Object.on('battery-low', () => { ... })`
`Object.on('battery-critical', () => { ... })`

</div>

### Возвращаемые данные
<div style = "color: #555">
Каналы модуля предоставляют значения уровня заряда в *%* и напряжения в *V*. 

</div>

### Примеры
<div style = "color: #555">
Пример программы с мониторингом уровня заряда и напряжения:

```js
// Создание объекта класса
let battery = H.DeviceManager.Service.CreateDevice('Battery');
let charge = battery[0];
let voltage = battery[1];
charge.Start();

setTimeout(() => {
    H.Logger.Service.Log({service: 'Battery', level: 'I', msg: `Charge: ${(charge.Value).toFixed(0)} %    Voltage: ${(voltage.Value).toFixed(2)} V`});
}, 1000);

```
Результат выполнения:
<div align='left'>
    <img src='./res/example-1.png'>
</div>

</div>

### Зависимости
<div style = "color: #555">

- [ClassSensor](https://github.com/Konkery/ModuleSensorArchitecture/blob/main/README.md)
- [SensorManager](https://github.com/Konkery/ModuleSensorManager/blob/main/README.md)
- [ModuleProcess](https://github.com/Konkery/ModuleProcess/blob/main/README.md)
- [ModuleAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)
- [ModuleAppMath](https://github.com/Konkery/ModuleAppMath/blob/main/README.md)


</div>

</div>
