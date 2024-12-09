<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleWebSocketServer
<p align="center">
  <img src="logo.png" width="400" title="hover text">
</p>

-----------------

# Лицензия
////

# Описание
<div style = "color: #555">

Модуль предназначен для реализации базовых функций WebSocket сервера и является неотъемлемой частью фреймворка Horizon Automated. Фунциональность напрямую связана с [ProxyWS](https://github.com/Konkery/ModuleProxyWS/blob/main/README.md), без которого работа вебсокет сервера невозможна. Модуль хранит в себе массив подключившихся клиентов и автоматически добавляет новых, а также удаляет отключившихся. Модуль может быть создан при отсутствии интернет соединения. Модуль реализует свой функционал через глобальный объект с именем wsserver.

Архитектурные решения:
- хранение клиентов в поле-массиве;
- паттерн синглтон.
</div>

### Конструктор
<div style = "color: #555">

Конструктор принимает номер порта *_port*. По этому порту сервер будет слушать запросы клиентов на подключение, а также через него будет передавать данные. Параметр не является обязательным. В случае отсутствия данного параметра зсоответствующему полю будет присвоено значение 8080.
</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Name</mark> - имя класса в строковом виде;
- <mark style="background-color: lightblue">_Server</mark> - объект базового класса ws среды Espruino;
- <mark style="background-color: lightblue">_Proxy</mark> - объект класса ProxyWS;
- <mark style="background-color: lightblue">_Port</mark> - порт, через который будет работать сервер. Значение по умолчанию - 8080;
- <mark style="background-color: lightblue">_Clients</mark> - массив подключенных клиентов.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Init()</mark> - осуществляет запуск сервера с привязкой к назначенному порту;
- <mark style="background-color: lightblue">Notify(data)</mark> - осуществаляет отправку данных клинетам, которые установленны ProxyWS.
</div>

### Примеры
<div style = "color: #555; font-size: 16px">

Фрагмент кода для создание WebSocket сервера. Предполагается, что все необходимые модули уже загружены в систему:
```js
//Подключение необходимых модулей
const ClassWSS = require('ClassWebSocketServer.min.js');

// Создание шины и объекта wifi
let wsserver = new ClassWSS();

console.log(wsserver);
```
Вывод созданнного объекта в консоль:
<p align="left">
  <img src="./res/output.png" title="hover text">
</p>
</div>

# Зависимости
- [ProxyWS](https://github.com/Konkery/ModuleProxyWS/blob/main/README.md)
</div>

