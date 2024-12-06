/**
 * @class
 * Класс ClassBaseUARTBus реализует базовые операции по созданию общего для проекта
 * хранилища объектов UART шины.
 * Задачи класса динамически создавать и добавлять в контейнер новый объект UART шины и предоставлять
 * прикладным классам экземпляры объектов, а также хранить информацию о том - занята данная, конкретная
 * шина или нет.
 * Класс хранит экземпляры предопределенных в Espruino UART шин (UART1, UART2, UART3),
 * а также создает soft шины UART. При создании возвращается объект типа UART шина.
 * Класс реализует паттерн - синглтон, т.е. экземпляр класса может быть только один.
 * 
 * 
 * Для работы класса понадобятся пользовательские типы данных, в том числе для передачи параметров.
 * Далее представлены определения этих типов в соответствии с синтаксисом.
 * 
 * тип для передачи аргументов для генерации UART объекта
 * @typedef  {Object} ObjectUARTBusParam - тип аргумента метода AddBus
 * @property {Object} rx      1 - порт rx шины UART, обязательное поле
 * @property {Object} tx      2 - порт tx шины UART, обязательное поле
 * @property {number} baud    3 - бод шины UART, обязательное поле
 * Пример объекта с аргументами для генерации UART объекта:
 * {rt:A0, tx:B2, baudrate:115200}
 * 
 * Тип для хранения сгенерированных объектов-шин UART в экземпляре класса UART
 * Фактически это тип поля UARTbus
 * @typedef  {Object} ObjectUARTcontainer     - тип контейнер хранящий сгенерированные шины
 * @property {Object} BusObjName              - ДИНАМИЧЕСКИ генерируемый ключ записи объекта
 * 
 * Значение  * ключа представляет собой объект хранящий собственно генерируемую UART шину а также
 * ряд прикладных характеристик, например используется ли в RUNTIME данная шина или свободна.
 * Имя ключа генерируется на основе паттерна UARTxx, т.е. итоговые имена могут быть: UART10, UART11...UART19...
 * количество шин не ограничено.
 * Далее представлена структура объекта - значения:
 * {
 *  IDbus: <UART bus object those - result new UART()>, //сгенерированный экземпляр шины UART
 *  Used: true/false //состояние шины используется (true), не используется (false)
 * }
 * В RUNTIME может быть только один экземпляр  класса и он должен называться UARTbus (!),
 * к этому объекту должны обращаться другие объекты
  */
class ClassBaseUARTBus {
    /**
     * @constructor
     */
    constructor() {
        //реализация паттерна синглтон
        if (this.Instance) {
            return this.Instance;
        } else {
            ClassBaseUARTBus.prototype.Instance = this;
        }

        this._UARTbus = {}; //контейнер объектов-шин UART
        this._Pattern = 'UART'; //базовая часть всех ключей объектов-шин UART, полное название получается конкатенацией с текущим индексом
        this._IndexBus = 10; //начальный индекс soft шин

        this.Init();
    }
    /**
     * @method
     * Метод Init добавляет в контейнер шины, которые уже созданы в Espruino
     */
    Init() {
        let i = 1;
        let StrUart = 'Serial' + i;
        while (!(eval('typeof '+StrUart+' === \'undefined\''))) {
            if (eval(StrUart+' instanceof Serial')) {
                    this._UARTbus[StrUart] = {IDbus: eval(StrUart), Used: false};
                }
            i++;
            StrUart = 'Serial' + i;
        }
    }
    /**
     * @method
     * Метод AddBus создает объект экземпляр класса UART, как soft реализацию UART шины.
     * Методу передается в качестве аргумента объект с параметрами создаваемой шины.
     * @param {ObjectUARTBusParam}   _opt        1 - объект с параметрами шины UART
     * @returns {Object}             _retVal      1 - возвращаемый объект вида:
        *                                          { NameBus: //имя созданной шины
        *                                            IDbus:   //объект шины UART
        *                                          }
     */
    AddBus(_opt) {
        /*проверить переданные параметры шины на валидность*/
        if ((typeof (_opt.rx) === 'undefined') || (typeof (_opt.tx) === 'undefined') || (typeof (_opt.baud) === 'undefined')) {
           throw new err(this._Pattern, 10);
        }

        if (!(_opt.rx instanceof Pin) || !(_opt.tx instanceof Pin) || !(Number.isInteger(_opt.baud))) {
           throw new err(this._Pattern, 20);
        }

        /*все необходимые для создания шины параметры переданы -> создать и инициализировать новую шину*/
        let bus_name = this._Pattern + this._IndexBus; //полное имя ключа текущей шины
        
        this._UARTbus[bus_name] = {
            IDbus: new Serial(), //сгенерировать шину
            Used: true //индикатор использования шины в true
        };
        
        
        this._UARTbus[bus_name].IDbus.setup(_opt.baud, {rx:_opt.rx, tx: _opt.tx}); //инициализировать шину

        ++this._IndexBus; //увеличить индекс шины
        
        return {
                NameBus: bus_name, //имя созданной шины
                
                IDbus:   this._UARTbus[bus_name].IDbus //объект шина UART
            };
    }
}

exports = ClassBaseUARTBus;