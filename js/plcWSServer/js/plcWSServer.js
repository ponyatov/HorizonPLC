const MSG_DEBUG_SEND = 'Sending data...';

/*class WSocket {
    constructor(host, options) {
        this.socket = null;
        options = options || {};
        this.host = host;
        this.port = options.port || 80;
        this.protocolVersion = options.protocolVersion || 13;
        this.origin = options.origin || 'Horizon';
        this.keepAlive = options.keepAlive * 1000 || 60000;
        this.masking = options.masking!==undefined ? options.masking : true;
        this.path = options.path || '/';
        this.protocol = options.protocol;
        this.lastData = '';
        this.key = this.BuildKey();
        this.connected = options.connected || false;
        this.headers = options.headers || {};
    }
    BuildKey() {
        let randomString = btoa(Math.random().toString(36).substr(2, 8)+
                                Math.random().toString(36).substr(2, 8));
        let toHash = randomString + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
        return {
            source: randomString,
            hashed: btoa(require('crypto').SHA1(toHash))
        }
    }
    InitializeConnection() {
        require('net').connect({
            host: this.host,
            port: this.port
        }, this.OnConnect.bind(this));
    }
    OnConnect(socket) {
        this.socket = socket;
        let ws = this;
        socket.on('data', this.parseData.bind(this));
        socket.on('close', () => {
            if (ws.pingTimer) {
                clearInterval(ws.pingTimer);
                ws.pingTimer = undefined;
            }
            ws.emit('close');
        });        
        this.Handshake();
    }
    Handshake() {
        let socketHeader = [
            'GET ' + this.path + ' HTTP/1.1',
            'Host: ' + this.host,
            'Upgrade: websocket',
            'Connection: Upgrade',
            'Sec-WebSocket-Key: ' + this.key.source,
            'Sec-WebSocket-Version: ' + this.protocolVersion,
            'Origin: ' + this.origin
        ];
        if (this.protocol)
            socketHeader.push('Sec-WebSocket-Protocol: ' + this.protocol);
        
        for(let key in this.headers) {
            if (this.headers.hasOwnProperty(key))
                socketHeader.push(key + ': ' + this.headers[key]);
        }
       
        this.socket.write(socketHeader.join('\r\n')+'\r\n\r\n');
      };
}
  
  
  
  WebSocket.prototype.parseData = function (data) {
    // see https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers
    // Note, docs specify bits 0-7, etc - but BIT 0 is the MSB, 7 is the LSB
    var ws = this;
    this.emit('rawData', data);
  
    if (this.lastData.length) {
      data = this.lastData+data;
      this.lastData="";
    }
  
    if (!this.connected) {
      // FIXME - not a good idea!
      if (data.indexOf(this.key.hashed) > -1 && data.indexOf('\r\n\r\n') > -1) {
          this.emit('handshake');
        this.pingTimer = setInterval(function () {
          ws.send('ping', 0x89);
        }, this.keepAlive);
        data = data.substring(data.indexOf('\r\n\r\n') + 4);
        this.connected = true;
        this.emit('open');
      }
      this.lastData = data;
      return;
    }
  
    while (data.length) {
      var offset = 2;
      var opcode = data.charCodeAt(0)&15;
      var dataLen = data.charCodeAt(1)&127;
      if (dataLen==126) {
        dataLen = data.charCodeAt(3) | (data.charCodeAt(2)<<8);
        offset += 2;
      } else if (dataLen==127) throw "Messages >65535 in length unsupported";
      var pktLen = dataLen+offset+((data.charCodeAt(1)&128)?4/*mask*//*:0);
      if (pktLen > data.length) {
        // we received the start of a packet, but not enough of it for a full message.
        // store it for later, so when we get the next packet we can do the whole message
        this.lastData = data;
        return;
      }
  
      switch (opcode) {
        case 0xA:
          this.emit('pong');
          break;
        case 0x9:
          this.send('pong', 0x8A);
          this.emit('ping');
          break;
        case 0x8:
          this.socket.end();
          break;
        case 0:
        case 1:
          var mask = [ 0,0,0,0 ];
          if (data.charCodeAt(1)&128 /* mask *//*)
            mask = [ data.charCodeAt(offset++), data.charCodeAt(offset++),
                     data.charCodeAt(offset++), data.charCodeAt(offset++)];
          var msg = "";
          for (var i = 0; i < dataLen; i++)
            msg += String.fromCharCode(data.charCodeAt(offset++) ^ mask[i&3]);
          this.emit('message', msg);
          break;
        default:
          console.log("WS: Unknown opcode "+opcode);
        }
        data = data.substr(pktLen);
      }
  };
  
  /** Send message based on opcode type *//*
  WebSocket.prototype.send = function (msg, opcode) {
    opcode = opcode === undefined ? 0x81 : opcode;
    var size = msg.length;
    if (msg.length>125) {
      size = 126;
    }
    this.socket.write(strChr(opcode, size + ( this.masking ? 128 : 0 )));
  
    if (size == 126) {
      // Need to write extra bytes for longer messages
      this.socket.write(strChr(msg.length >> 8));
      this.socket.write(strChr(msg.length));
    }
  
    if (this.masking) {
      var mask = [];
      var masked = '';
      for (var ix = 0; ix < 4; ix++){
        var rnd = Math.floor( Math.random() * 255 );
        mask[ix] = rnd;
        masked += strChr(rnd);
      }
      for (var ix = 0; ix < msg.length; ix++)
        masked += strChr(msg.charCodeAt(ix) ^ mask[ix & 3]);
      this.socket.write(masked);
    } else {
      this.socket.write(msg);
    }
  };
  
  WebSocket.prototype.close = function() {
    this.socket.end();
  };*/
  

/**
 * @class
 * Класс реализует функционал WebSocket-сервера на Espruino
 * 
 */
class ClassWSServer {
    /**
     * @constructor
     * @param {Number} _port   - порт, по-умолчанию 8080
     */
    constructor(options) {
        //реализация паттерна синглтон
        if (this.Instance) {
            return this.Instance;
        } else {
            ClassWSServer.prototype.Instance = this;
        }

        this._Name = 'WSocket'; //переопределяем имя типа
        this._Server = undefined;
        this._Proxy = new (require(options.proxyModule))(this);
        this._Port = options.port || 8080;
        this._BaseModule = options.baseModule;
        this._Clients = [];
        this.Init();
        this.Run()
	}
    /**
     * @method
     * Метод создания вебсокет-сервера
     */
    Init() {
        this._Server = require(this._BaseModule).createServer((req, res) => {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<html><body>404 - Not supported format</body></html>');
        });
        this._Server.on('websocket', (ws) => {
            Object.emit('connect');
            H.Logger.Service.Log({service: this._Name, level: 'I', msg: `Client connected. Key: ${ws.key.hashed}`});
            ws.RegServices = [];

            ws.on('message', (message) => {
                //console.log(message);
                this._Proxy.Receive(message, ws.key.hashed);
            });
            ws.on('error', (error) => {
              H.Logger.Service.Log({service: this._Name, level: 'E', msg: `${error}`});
            });
            ws.on('close', () => {
                let index = this._Clients.indexOf(ws);
                this._Clients.splice(index,1);
                this._Proxy.RemoveSub(ws.key.hashed);
                H.Logger.Service.Log({service: this._Name, level: 'I', msg: `Client disconnected. Key: ${ws.key.hashed}`});
                Object.emit('disconnect');
            });
            this._Clients.push(ws);
        });

    }
    Run() {
        try {
            this._Server.listen(this._Port);
        }
        catch (e) {
            H.Logger.Service.Log({service: this._Name, level: 'E', msg: `${e.message}`});
        }
        H.Logger.Service.Log({service: this._Name, level: 'I', msg: `Listening to port ${this._Port}`});
    }
    /**
     * @method
     * Вызовом этого метода WSS получает данные и список ключей, по которому определяюся клиенты, 
     * которым необходимо отправить данные. 
     * @param {Object} data - JSON-объект соответствующий LHP протоколу
     */
    Notify(data) {
        //let service = data.MetaData.RegServices;
        H.Logger.Service.Log({service: this._Name, level: 'D', msg: MSG_DEBUG_SEND});
        /*this._Clients.filter(client => client.RegServices.includes(service)).forEach(client => {
            client.send(JSON.stringify(data));
        });*/
        this._Clients.forEach(client => {
          client.send(data);
        });
    }
}

exports = ClassWSServer;