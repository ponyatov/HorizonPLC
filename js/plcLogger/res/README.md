<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleLogger

<div style = "color: #555">
    <p align="center">
    <img src="logo.png" width="400" title="hover text">
    </p>
</div>

## Лицензия

<div style = "color: #555">

В разработке
</div>

## Описание
<div style = "color: #555">

Модуль предназначен для логирования сообщений в рамках фреймворка Horizon Automated.

</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Log({_service, _level, _msg})</mark> - делает лог с указанным уровнем. Предоставленные уровни логирования: 'INFO', 'DEBUG' 'ERROR', 'WARN'. 

</div>

### Примеры
<div style = "color: #555">

```js
H.Logger.Service.Log({service: 'Example', level: 'I', msg: 'AppError loaded'});
H.Logger.Service.Log({service: 'Example', level: 'D', msg: '...'});
H.Logger.Service.Log({service: 'Example', level: 'E', msg: 'Invalid argument!'});
H.Logger.Service.Log({service: 'Example', level: 'W', msg: 'No AppError module found'});
```

</div>

#### Результат выполнения:

<div align='left'>
    <img src="" alt="Image not found">
</div>

### Зависимости
<div style = "color: #555">

</div>

</div>