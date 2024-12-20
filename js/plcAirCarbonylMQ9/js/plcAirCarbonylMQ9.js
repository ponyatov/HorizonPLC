const ClassSensor = require('plcSensor.min.js');
/**
 * @class
 * Модуль реализует базовые функции датчика MQ-9,
 * возвращающего данные о концентрации угарного газа в воздухе
 */
class ClassAirCarbonylMQ9 extends ClassSensor {
    /**
     * @constructor
     * @param {Object} _opts   - Объект с параметрами по нотации ClassSensor
     */
    constructor(_opts, _sensor_props) {
        ClassSensor.call(this, _opts, _sensor_props);
        this._Name = 'ClassAirCarbonylMQ9'; //переопределяем имя типа
		this._Sensor = require('BaseClassMQX.min.js').connect({dataPin: _opts.pins[0], heatPin: _opts.pins[1], model: 'MQ9', r0: _opts.baseline});
        this._MinPeriod = 250;
        this._Interval;
    }
    /**
     * @method
     * Управление нагревателем датчика
     * @param {Number} _val   - Значение от 0 до 1, где 1 - нагрев на максимально возможную температуру,
     * а 0 - выключение нагревателя.
     */
    ControlHeater(_val) {
        this._Sensor.heat(_val);
    }
    /**
     * @method
     * Запускает датчик на полный прогрев в течении 30 секнуд. 
     * В этот период нельзя читать данные с датчика.
     * По окончанию нагрева выводтися сообщение.
     * Нагреватель остаётся включенным.
     */
    Preheat() {
        this._Channels[0].Status = 2;
        console.log("Beginning to preheat MQ-9...");
        this._Sensor.preheat(() => {
            console.log("MQ-9 is heated!");
            this._Channels[0].Status = 1;
        });
    }
    /**
     * @method
     * Запускает датчик на калибровку - определяет базовое значение
     * концентрации угарного газа в воздухе
     * @param {Number} _val   - Значение для калибровки, необязательный параметр
     */
    Calibrate(_val) {
        this._Sensor.calibrate(_val);
    }
    /**
     * @method
     * Запускает сбор данных с датчика и передачи их в каналы
     * @param {Number} _period          - частота опроса (минимум 250 мс)
     * @param {Number} _num_channel     - номер канала
     */
    Start(_num_channel, _period) {
        let period = (typeof _period === 'number' & _period >= this._MinPeriod) ? _period    //частота сверяется с минимальной
                 : this._MinPeriod;
        this._Channels[0].Status = 1;

        this._Interval = setInterval(() => {
            this._Channels[0].Value = (this._Channels[0].Status == 1) ? this._Sensor.read('CO') : 0;
        }, period);
    }
    /**
     * @method
     * Меняет частоту опроса датчика
     * @param {Number} _freq     - новая частота опроса (минимум 1000 мс)
     */
    ChangeFreq(_num_channel, _freq) {
        clearInterval(this._Interval);
        setTimeout(() => this.Start(_freq), this._MinPeriod);
    }
    /**
     * @methhod
     * Останавливает сбор данных с датчика
     * @param {Number} _num_channel   - номер канала, в который должен быть остановлен поток данных
     */
    Stop(_num_channel) {
        this._Channels[0].Status = 0;

        clearInterval(this._Interval);
        this._Interval = null;
    }
}
	

exports = ClassAirCarbonylMQ9;