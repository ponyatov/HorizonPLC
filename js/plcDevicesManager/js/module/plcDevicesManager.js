const POLLING_FREQ = 5;
/**
 * @typedef ClassMsg
 * @property {[string|number]} arg
 * @property {[string|number]} value
 */
/**
 * @class
 * Реализует функционал службы для работы с измерительно-исполняющими устройствами: 
 * инициализации, адресации команд, сбора данных 
 */
class ClassDevicesManager {
    constructor() {
        if (this.Instance) {
            return this.Instance;
        } else {
            ClassDevicesManager.prototype.Instance = this;
        }

        this._Devices = [];
        // this._RegisteredBuses = {};
        // запуск циклического опроса
        Object.on('dm-sub-sensorall', (_msg) => {
            // let freq = _msg.arg[0];
            if (!this._Interval) this.StartPolling(POLLING_FREQ);
        });
        // его остановка
        Object.on('dm-stop-polling',    this.StopPolling.bind(this));
        // сбор метаданных данных о сенсорах
        Object.on('dm-deviceslist-get', this.OnDevicesListGet.bind(this));
        // перенаправление команды актуатору
        Object.on('dm-actuator-set',    this.ActuatorSet.bind(this));

        this.InitBuses();
    }
    get Devices() { return this._Devices; }

    get Sensors() {
        return this._Devices.filter(device => device._Type.toLowerCase() === 'sensor' || device._Type.toLowerCase() === 'hybrid');
    }

    get Actuators() {
        return this._Devices.filter(device => device._Type.toLowerCase() === 'actuator');
    }
    /**
     * @method
     * @description Выполняет инициализацию всех шин, указанных в конфиге к текущей программе.
     */
    InitBuses() {
        let config = Process.GetBusesConfig();

        for (let busName of Object.keys(config)) {
            try {
                let opts = config[busName];
                // Приведение строкового представления пинов к получению их объектов                                   
                for (let option of Object.keys(opts)) {
                    if (option !== 'bitrate') opts[option] = this.GetPinByStr(opts[option]);
                }
                let busObj;
                if (busName.startsWith('I2C')) busObj = H.I2Cbus.Service.AddBus(opts);
                if (busName.startsWith('SPI')) busObj = H.SPIbus.Service.AddBus(opts);
                if (busName.startsWith('UART')) busObj = H.UARTbus.Service.AddBus(opts);

            } catch (e) {
                // log failed to init bus [busname]
            }
        }
    }  
    /**
     * @method
     * @description Добавляет устройство в реестр
     * @param {Object} device 
     */
    AddDevice(device) {
        if ((!this.GetDevice(device.ID)) && device.ID) {
            this._Devices.push(device);
        }
    }
    /**
     * @method
     * @param {string} id 
     * @description Возвращает устройство с соответствующим id
     * @returns 
     */
    GetDevice(id) {
        return this._Devices.find(dev => dev.ID === id);
    }
    /**
     * @method
     * @description Возвращает канал устройства по его id
     * @param {string} chId 
     */
    GetChannel(chId) {
        for (let i = 0; i < this.Devices.length; i++) {
            let ch = this.Devices[i]._Channels.find(_ch => _ch.ID === chId);
            if (ch) return ch;
        }
    }
    /**
     * @method
     * Запускает периодичное считывание данных с сенсоров. 
     * Данные, которые не обновились с момента последнего обхода, пропускаются
     * @param {Number} _freq - частота опроса 
     */
    StartPolling(_freq) {
        const freq = _freq || 5;
        if (typeof freq !== 'number' || freq <= 0) return false;
        
        const valIsEqual = (a, b, x) => {
            return Math.abs(a - b) <= Math.abs(a) * (x / 100);
        };
        let data_cache = {}; // кэширование собранных данных

        this._Interval = setInterval(() => {

            this.Sensors.forEach(_sens => {
                // перебор каналов
                _sens._Channels
                .filter(ch => ch.Status)
                .forEach(ch => {
                    if (!valIsEqual(ch.Value, data_cache[ch.ID], ch.ChangeThreshold)) {
                        let data_package = {
                            com: 'all-data-raw-get',
                            arg: [ch.ID],
                            value: [ch.Value]
                        }
                        data_cache[ch.ID] = ch.Value;
                        this.SendData(data_package);
                    }
                });
            });

            // if (Object.keys(data_package).length) this.Send(data_package);
            // console.log('DEBUG>>iteration is done');

        }, 1 / freq * 1000);
        return true;

    }
    /**
     * @method
     * Прекращает периодический опрос датчиков
     */
    StopPolling() {
        if (this._Interval) clearInterval(this._Interval);
        this._Interval = null;
    }
    /**
     * @method
     * Собирает и возвращает информацию о датчиках
     * @param {[String]} idArr - массив id
     */
    OnDevicesListGet() {
        let data_package = {
            com: 'dm-deviceslist-set',
            value: [{ sensor: [], actuator: [] }]
        };
        // перебор устройств
        this.Sensors.forEach(_sens => {
            _sens._Channels.forEach(ch => {
                data_package.value[0].sensor.push(`${_sens._Article}-${ch.ID}`);
            });
        });

        this.Actuators.forEach(_act => {
            _act._Channels.forEach(ch => {
                data_package.value[0].actuator.push(`${_act._Article}-${ch.ID}`);
            });
        });

        this.SendWS(data_package);
    }
    /**
     * @method
     * @public
     * @description Отправляет сообщение на WSS
     * @param {*} _msg 
     */
    SendWS(_msg) {
        Object.emit('proxyws-send', _msg);
    }
    /**
     * @method
     * @description Выполняет рассылку данных, собранных с сенсоров
     * @param {Object} dataPackage - объект типа { channel_id: channel_value }
     */
    SendData(_msg) {
        Object.emit('all-data-raw-get', _msg);
    }
    /**
     * @method
     * @public
     * @description Устанавливает значение актуатора
     * @param {*} _msg 
     */
    ActuatorSet(_msg) {
        const id = _msg.arg[0];
        const val = +_msg.value[0];
        let act_ch = this.GetChannel(id);
        if (act_ch && typeof act_ch.SetValue === 'function') 
            act_ch.SetValue(val);
    }
    /**
     * @method 
     * @description Вызывает команду актуатора
     * @param {Array} arg - массив типа [id, method/task_name, ...restArgs]
     */
    ExecuteCom(arg) {
        let id = arg.shift();
        let methodName = arg.shift();

        let device = this.GetChannel(id);
        if (!device) return false; 
        if (typeof device[methodName] === 'function') {
            device[methodName].apply(device, arg);
            return true;
        }
        return false;
    }
    /**
     * @method
     * @description Проверяет ID сенсора/актуатора и возвращает булевое значение, указывающее можно ли этот ID использовать.
     * @param {string} _id 
     */
    IsIDAvailable(_id) {
        return !Boolean(this.Devices.find(device => device.ID === _id));
    }
    /**
     * @method
     * @description Проверяет не заняты ли переданные пины
     * @param {[Pin]} _pins - массив пинов
     * @returns 
     */
    ArePinsAvailable(_pins) {
        for (let i = 0; i < _pins.length; i++) {
            if (this.Devices.find(device => device._Pins.includes(_pins[i]))) return false;
        };
        return true;
    }
    /**
     * @method
     * @description Инициализирует датчик
     * @param {Object}  opts Объект, хранящий неопределенное множество аргументов для инициализации датчика
     * 
     * @returns {Object} Объект датчика
     */
    CreateDevice(id, opts) {
        opts = opts || { moduleNum: 0 };
        if (typeof id !== 'string') {
            console.log(`ERROR>> id argument must to be a string`);
            return undefined;
        }

        let dev = this.Devices.find(d => d.ID === id);
        if (dev) return dev._Channels;

        let sensorConfig = Process.GetDeviceConfig(id);

        if (!sensorConfig) {
            console.log(`ERROR>> Failed to get ${id} config"`);
            return undefined;
        }

        // let module = Process.ImportDeviceModule(sensorConfig.name, opts.moduleNum);
        let module = require(sensorConfig.modules[opts.moduleNum]);
        if (opts.key) module = module[key];
        if (!module) {
            console.log(`ERROR>> Cannot load ${sensorConfig.module}"`);
            return undefined;
        }

        if (sensorConfig.bus) sensorConfig.bus = this.GetBusByID(sensorConfig.bus);
        
        sensorConfig.pins = sensorConfig.pins || [];
        sensorConfig.pins = sensorConfig.pins.map(strPin => this.GetPinByStr(strPin));
        sensorConfig.id = id;

        if (!this.ArePinsAvailable(sensorConfig.pins)) {
            console.log(`ERROR>> Pins [${opts.pins.join(', ')}] are already used`);
            return undefined;
        }

        let device = new module(sensorConfig, sensorConfig);
        this.AddDevice(device);
        return device._Channels;
    }
    /**
     * @method
     * @description Возвращает объект пина по его имени
     * @param {String} strPin 
     * @returns 
     */
    GetPinByStr(strPin) {
        let p;
        try {
            p = eval(strPin);
        } catch (e) { }
        if (p instanceof Pin) return p;

        throw new Error(`ERROR>> Pin ${p} doesn't exist`);
    }
    /**
     * @method
     * @description Возвращает объект шины по ее ID
     * @param {string} _bus - ID шины
     * @returns 
     */
    GetBusByID(_bus) {
        let bus;
        if (_bus.startsWith('I2C')) {
            bus = H.I2Cbus.Service._I2Cbus[_bus].IDbus;
        } else if (bus.startsWith('SPI')) {
            _bus = H.SPIbus.Service._SPIbus[_bus].IDbus;
        } else if (bus.startsWith('UART')) {
            _bus = H.UARTbus.Service._UARTbus[_bus].IDbus;
        }
        return bus;
    }
}

exports = ClassDevicesManager;