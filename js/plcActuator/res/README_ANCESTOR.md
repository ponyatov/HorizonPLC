<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ClassAncestorActuator 
<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

## Описание
<div style = "color: #555">

Базовый класс в стеке [ModuleActuator](./README.md). Является отправной точкой для создания объектов конкретных актуаторов и обеспечивает сбор и хранение информации о них. Его поля предоставляют основные характеристики, необходимых для идентификации и настройки актуатора в рамках фреймоворка Horizon Automated. В первую очередь собирает в себе самые базовые сведения об актуаторе: переданные в его конструктор параметры и описательную характеристику. Перечень полей см. ниже.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает объект типа **ActuatorOptsType**, наполнение которого определяется конфигом. Единственный нюанс в том, что при получении данных из конфига, еще до вызова конструктора объекта датчика, строковое представление *bus* и *pins* преобразуется в js-объекты. 

Рассмотрим основной набор параметров на примере конфига к [Buzzer](https://github.com/Konkery/ModuleBuzzer). Детальное пояснение к параметрам описано [ниже](./README_ANCESTOR.md/#поля).

```json
"00": {
    "name": "Buzzer",
    "type": "actuator",
    "id": "00",
    "article": "02-501-0204-201-0001",
    "channelNames": ["freq"],
    "typeInSignals": ["analog"],
    "quantityChannel": 1,
    "manufacturingData": {
        "IDManufacturing": [
            { "Adafruit": "4328435534" }  
        ],
        "IDsupplier": [
            { "Adafruit": "4328435534" }  
        ],
        "HelpSens": "buzzer"
    }
}
```

</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Bus</mark> - используемая шина;
- <mark style="background-color: lightblue">_Pins</mark> - массив используемых актуатором пинов;
- <mark style="background-color: lightblue">_Address</mark> - адрес актуатора на шине;
- <mark style="background-color: lightblue">_Bus</mark> - используемая шина;
- <mark style="background-color: lightblue">_Name</mark> - имя актуатора;
- <mark style="background-color: lightblue">_Type</mark> - тип устройства (для всех актуаторов имеет значение "actuator");
- <mark style="background-color: lightblue">_ChannelNames</mark> - массив с названиями каналов;
- <mark style="background-color: lightblue">_TypeInSignals</mark> - типы входых сигналов;
- <mark style="background-color: lightblue">_QuantityChannel</mark> - число физических каналов актуатора;
- <mark style="background-color: lightblue">_ManufacturingData</mark> - объект со сведениями о производителе и поставщике актуатора, а так же его односложное описание;
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">InitProps(_actuatorProps)</mark> - инициализирует поля, хранящие описательные характеристики актуатора.
</div>

### Примеры
<div style = "color: #555">

Данный класс применяется исключительно как звено наследования и не используется независимо. Потому наследники обязаны иметь такие же параметры конструктора, который ввиду особенностей среды выполнения Espruino вызывается таким образом:
```js
ClassAncestorActuator.apply(this, [_opts]);
/// либо
ClassAncestorActuator.call(this, _opts);
```
</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>