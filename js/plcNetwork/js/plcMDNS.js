const MSG_SUCC = 'PLC name set:';
const MSG_FAIL = 'Failed to set dynamic name';
const MSG_NO_SUPP = 'Service in not supported for';

class ClassMDNS {
    /**
     * @constructor
     */
    constructor (options) {
        //Синглтон
        if (this.Instance) {
            return this.Instance;
        } else {
            ClassMDNS.prototype.Instance = this;
        }
        this._Name = 'MDNS';
        this._HostName = Process._BoardName || 'PLCDefault';
        this._ServiceType = options.servicetype || 'iot';
        this._Port = options.port || 80;
        this.SetMDNS();
    }
    SetMDNS () {
        try {
            switch (H.Network.Service._ChipType) {
                case 'esp32':
                    H.Network.Service._Core.setHostname(this._HostName, () => {
                        H.Logger.Service.Log({service: this._Name, level: 'I', msg: `${MSG_SUCC} ${this._HostName}`});
                    });
                    break;
                case 'esp8266':
                    H.Network.Service._Core.setMDNS(this._HostName, this._ServiceType, this._Port, (err) => {
                        if (err) {
                            H.Logger.Service.Log({service: this._Name, level: 'E', msg: MSG_FAIL});
                        }
                        else {
                            H.Logger.Service.Log({service: this._Name, level: 'I', msg: `${MSG_SUCC} ${this._HostName}`});
                        }
                    });
                    break;
                case 'W5500':
                default:
                    H.Logger.Service.Log({service: this._Name, level: 'W', msg: `${MSG_NO_SUPP} ${H.Network.Service._ChipType}`});
                    break;
            }
        }
        catch (e) {
            H.Logger.Service.Log({service: this._Name, level: 'E', msg: `${e.message}`});
        }
    }
}

exports = ClassMDNS;