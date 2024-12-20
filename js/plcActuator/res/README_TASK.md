<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ClassTask
<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

### Описание
<div style = "color: #555">

Класс, являющийся частью архитектуры [ModuleActuator](./README.md). Реализует собой сущность таска (задания).
В рамках прикладного кода таск - это набор инструкций, асинхронно исполняющихся актуатором.

А технически - объект класса, хранящий прикладную функцию, обернутую в Promise, а так же набор свойств и методов, необходимых для контроля над статусом выполнения функции таска.   

</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_IsActive</mark> - указывает на то, исполняется ли в данный момент таск;
- <mark style="background-color: lightblue">_Func</mark> - функция, реализующая выполнение таска актуатором;
- <mark style="background-color: lightblue">_Channel</mark> - ссылка на канал, к которому относится данный таск.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">Invoke(...args)</mark> - запускает выполнение таска;
- <mark style="background-color: lightblue">Resolve(_code)</mark> - деактивирует таск как успешно завершенный;
- <mark style="background-color: lightblue">Reject(_code)</mark> - деактивирует таск как завершенный с ошибкой; 
- <mark style="background-color: lightblue">Cancel()</mark> - завершает данный таск в процессе исполнения.
</div>

### Примеры
<div style = "color: #555">

##### Замечание 

Инициализация нового таска имеет некоторые нюансы и правила:
1. Контекст передаваемой функции автоматически привязывается к объекту канала. Это необходимо учитывать при её определении
2. В точке выхода из функции, уже после завершения работы актутора, обязан вызываться метод `this.ResolveTask()`, который уведомляет систему о завершении выполнения таска;
3. Функция, задающая таск, не может содержать вызовы других тасков.

#### Добавление нового таска
<div style = "color: #555">

```js
//Объявление элементарного таска, запускающего зуммер на 3 сек
ch.AddTask('Beep3sec', (freq) => {
    this.On(freq);
    setTimeout(() => {
        this.Off();
        //Завершение выполнения таска
        this.ResolveTask(0);
    }, 3000);
});

ch.RunTask('Beep3sec', 500);
    .then(() => console.log(`Done after 3 sec!`));
```

</div>

</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ClassChannelActuator]()</mark>
- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>