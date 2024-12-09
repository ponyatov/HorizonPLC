const err = require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.min.js');
const NumIs = require('https://raw.githubusercontent.com/Konkery/ModuleAppMath/main/js/module/ModuleAppMath.min.js');
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

const bus_class = require('https://raw.githubusercontent.com/AlexGlgr/ModuleBaseI2CBus/fork-Alexander/js/module/ClassBaseI2CBus.min.js');

try {
  let bus = new bus_class();
  console.log(bus);
}
catch(e) {
  console.log('Error>> ' + e.Message + ' Code>> ' + e.Code);
}
