const Class = require('./ModuleMQTT');
const Process = {
    GetMQTTClientConfig: () => {
        return ({
            "host": "192.168.1.251",
            "port": 1883,
            "username": "operator3",
            "password": "pwd567",
            "keep_alive": 120,
            "subs": {
                "dm": {
                    "vl-0": "/horizon/PLC31-vl-0",
                    "vl-1": "/horizon/PLC31-vl-1",
                    "btn-0": "/horizon/PLC31-btn-0",
                    "bz-0": "/horizon/PLC31-bz-0"
                }
            }
        });
    }
}
const mqtt = new Class();