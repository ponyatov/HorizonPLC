/**
 * @typedef TypePubMsg
 * @property {string} topic
 * @property {string} message
 */

/**
 * @class является придатком WS Server и реализует передачу и обработку запросов и сообщений 
 * как со стороны WS Server (сверху), так и со стороны RouteREPL, SensorManager, Control (снизу). 
 * Экземпляр класса инициализируется как поле класса WS Server при успешном создании последнего.
 */
class ClassProxyMQTT {
    /**
     * @constructor
     * @param {ClassMQTT} _mqtt - MQTT Server(publisher) object
     */
    constructor(_mqtt, _subs) {
        this._MQTT = _mqtt;
        this._Subs = _subs || { dm: { 'sensor': {}, 'actuator': {} }};

        this._SkipData = false;
        this._DataSkipInterval = null;
        // EVENTS
        Object.on('all-data-raw-get', this.OnSensorData.bind(this)); 
        this._MQTT.on('connected',    this.OnConnected.bind(this));
        this._MQTT.on('publish',      this.OnPublish.bind(this));
        this._MQTT.on('disconnected', this.OnDisconnected.bind(this));
    }

    /**
     * @method
     * @description Обработчик данных, полученных от Sensor Manager 
     * @param {Object} _msg 
     */
    OnSensorData(_msg) {
        if (!this._DataSkipInterval || !this._SkipData) {
            const ch_id = _msg.arg[0];
            const topic = this._Subs.dm.sensor[ch_id];
            if (typeof topic == 'string' && this._MQTT.connected)
                this._MQTT.publish(topic, JSON.stringify(_msg.value[0]));
        }  
    }

    /**
     * @method
     * @param {TypePubMsg} pub 
     * @description Устанавливает обработчик на событие 'publish' клиента. Инициирует вызов сообщение 'dm-actuator-set' 
     */
    OnPublish(pub) {
        const ch_id = Object.keys(this._Subs.dm.actuator).find(_key => this._Subs.dm.actuator[_key] == pub.topic);
        if (typeof ch_id == 'string')
            Object.emit('dm-actuator-set', { arg: [ch_id], value: [pub.message] });
    }

    /**
     * @method
     * @description Устанавливает обработчик на событие 'disconnected' клиента, который обеспечивает вызов сообщение 'dm-actuator-set' 
     */
    OnDisconnected() {
        H.Logger.Service.Log({service: 'MQTT', level: 'I', msg: `MQTT disconnected!`});
        
        let c = 0;
        /*let interval = setInterval(() => {
            if (this._MQTT.connected) {
                clearInterval(interval);
                return;
            }
            if (++c == 3) {
                H.Logger.Service.Log('MQTT', H.Logger.Service.LogLevel.INFO, `MQTT failed to reconnect after ${c} retries.`);
                clearInterval(interval);
                return;
            }
            H.Logger.Service.Log('MQTT', H.Logger.Service.LogLevel.INFO, `MQTT trying to reconnect..`);
            this._MQTT.connect();
        }, 3000);*/
    }

    /**
     * @method
     * @description Устанавливает обработчик на событие 'connected' клиента
    */ 
    OnConnected() {
        H.Logger.Service.Log({service: 'MQTT', level: 'I', msg: `MQTT connected!`});
        this.SetDMSubs();
    }

    /**
     * @method
     * @description Устанавливает обработчик на событие 'error' клиента
    */ 
    OnError(_errMsg) {
        H.Logger.Service.Log({service: 'MQTT', level: 'E', msg: `${_errMsg}`});
    }

    /*Example: { sensor: { channel_id1 : topic_name1, channel_id2: topic_name2 } }; */
    /**
     * @method
     * @description Выполняет подписку на указанные топики
     */
    SetDMSubs() {
        if (typeof this._Subs.dm.actuator !== 'object') return false;
        // сохраняется ассоциация ID - название топика
        let actuator_topic_names = Object.keys(this._Subs.dm.actuator).map(_chId => this._Subs.dm.actuator[_chId]);
        this._MQTT.subscribe(actuator_topic_names);   

        H.Logger.Service.Log({service: 'MQTT', level: 'I', msg: `MQTT subscribed on topics ${actuator_topic_names}`});
    }

    /**
     * @method 
     * Удаление подписчиков из коллекции 
     * @param {String} _serviceName
     * @param {[String]} _serviceSubs
     */
    RemoveSubs(_serviceName, _serviceSubs) {
        if (!this._Subs[_serviceName] ||
            typeof _serviceSubs !== 'object') return false;
        
        _serviceSubs.forEach(chId => {
            delete this._Subs[_serviceName][chId];
        });
    }

    /**
     * @method
     * Отправляет сообщение и соответствующий ему топик на MQTT-publisher
     * @param {String} _topicName - идентификатор топика 
     * @param {String} _data сообщение 
     */
    Send(_topicName, _data) { 
        this._MQTT.publish(_topicName, _data);
    }

    /**
     * @method
     * Устанавливает максимальную частоту, с которой пакет сообщений рассылается на MQTT.
     * @param {Number} _freq - частота
     * @returns 
     */
    SetPubMaxFreq(_freq) {
        if (typeof _freq !== 'number' || _freq < 0) return false;

        this._DataSkipInterval = setInterval(() => {
            this._SkipData = !this._SkipData;
        }, 1/_freq*1000);

        return true;
    }
}
exports = ClassProxyMQTT;
