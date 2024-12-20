const ClassSensor = require('plcSensor.min.js');
/**
 * @class
 * Модуль реализует базовые функции метеодатчика на базе чипа CCS811,
 * возращающего данные о качестве воздуха
 */
class ClassAirQualityCCS811 extends ClassSensor {
    /**
     * @constructor
     * @param {Object} _opts   - Объект с параметрами по нотации ClassSensor
     */
    constructor(_opts, _sensor_props) {
        ClassSensor.apply(this, [_opts, _sensor_props]);
        this._Name = 'ClassAirQualityCCS811'; //переопределяем имя типа
		this._Sensor = require('BaseClassCCS811.min.js').connect(_opts.bus, _opts.address, _opts.mode);
        this._MinPeriod = 250;
        this._UsedChannels = [];
        this._Interval;
        this._Margin = {};
        this._Margin.temp = _opts.temp;
        this._Margin.hum = _opts.hum;
        this._CanRead = true;
        this.Init(_sensor_props);
    }
    /**
     * @method
     * Инициализирует датчик
     */
    Init(_sensor_props) {
        super.Init(_sensor_props);
        this._Sensor.init();
        if (this._Margin.hum && this._Margin.temp) {
            this.SetTempHumMargin();
        }
    }
    /**
     * @method
     * Установка температуры и влажности для корректировки
     * возвращаемых с датчика данных
     * @param {Object} _margin   - Объект, содержащий поля humidity и    temperature
     */
    SetTempHumMargin(_margin)
    {
        if (_margin) {
            this._Margin = _margin;
        }
        this._Sensor.setEnvData(this._Margin.hum, this._Margin.temp);
    }
    /**
     * @method
     * Запускает сбор данных с датчика и передачи их в каналы
     * @param {Number} _period          - частота опроса (минимум 1000 мс)
     * @param {Number} _num_channel     - номер канала
     */
    Start(_num_channel, _period) {
        let period = (typeof _period === 'number' & _period >= this._MinPeriod) ? _period    //частота сверяется с минимальной
                 : this._MinPeriod;
        let data;
        if (!this._UsedChannels.includes(_num_channel)) this._UsedChannels.push(_num_channel); //номер канала попадает в список опрашиваемых каналов. Если интервал уже запущен с таким же периодои, то даже нет нужды его перезапускать 
        if (!this._Interval) {          //если в данный момент не ведется ни одного опроса
            this._Interval = setInterval(() => {
                if (this._CanRead) data = this._Sensor.get();
                if (this._UsedChannels.includes(0)) this.Ch0_Value = data.eCO2 | 0;
                if (this._UsedChannels.includes(1)) this.Ch1_Value = data.TVOC | 0;
            }, period);
        }
    }
    /**
     * @method
     * Меняет частоту опроса датчика
     * @param {Number} freq     - новая частота опроса (минимум 1000 мс)
     */
    ChangeFreq(_num_channel, freq) {
        clearInterval(this._Interval);
        setTimeout(() => this.Start(freq), this._Minfrequency);
    }
    /**
     * @method
     * Меняет режим работы датчика через 10 секунд
     * @param {Object} _opts    - объект, содержащий новый режим датчика
     */
    ConfigureRegs(_opts) {
        if (Number.isInteger(_opts.mode) && _opts.mode >= 0 && _opts.mode <= 4) {
            this._CanRead = false;
            setTimeout (() => {
                this._Sensor.setMode(_opts.mode);
            }, 10000);
            this._CanRead = true;
        }   
    }
    /**
     * @methhod
     * Останавливает сбор данных с датчика
     * @param {Number} _num_channel   - номер канала, в который должен быть остановлен поток данных
     */
    Stop(_num_channel) {
        if (_num_channel) this._UsedChannels.splice(this._UsedChannels.indexOf(_num_channel));
        else {
            this._UsedChannels = [];
            clearInterval(this._Interval);
            this._Interval = null;
        }
    }
}
	

exports = ClassAirQualityCCS811;