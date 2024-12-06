/**
 * @class
 * Класс ClassAppMath расширяет функционал объекта типа Number. Данный типа в реализации Espruino не
 * поддерживает стандартный для JS метод isInteger.
 */
class ClassAppMath {
    /**
     * @constructor
     */
    constructor() {
        //реализация паттерна синглтон
        if (this.Instance) {
            return this.Instance;
        } else {
            ClassAppMath.prototype.Instance = this;
        }
        this.name = 'ClassAppMath'; //переопределяем имя типа
        
        this.AddIsInteger();
    }
    AddIsInteger() {
        /**
        * @param {number} it  - проверяемое число
        */
        Number.isInteger = (it) => {return isFinite(it) && Math.floor(it) === it};
    }
}

exports = ClassAppMath; //экспортируем класс