/**
 * @class
 * Класс ClassAppError основной класс для работы с исключениями, заменяет базовый класс ошибок.
 */
class ClassAppError {
    /**
     * @constructor
     * @param {Object} _message - текстовое сообщение типа ошибки
     * @param {number} _code    - числовой код ошибки
     */
    constructor(_message, _code) {
        this.name = 'ClassAppError'; //переопределяем имя типа
        this._Message = _message;
        this._Code = _code || -1; //по умолчанию присвоить код неизвестной ошибки
    }
    get Message() {return this._Message;}
    get Code() {return this._Code;}
}

exports = ClassAppError; //экспортируем класс
