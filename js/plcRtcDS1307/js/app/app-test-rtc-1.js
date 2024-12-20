const err = require('https://raw.githubusercontent.com/Konkery/ModuleAppError/main/js/module/ModuleAppError.min.js');
const NumIs = require('https://raw.githubusercontent.com/Konkery/ModuleAppMath/main/js/module/ModuleAppMath.min.js');
     NumIs.is(); //добавить функцию проверки целочисленных чисел в Number

const clock_class = require('https://raw.githubusercontent.com/AlexGlgr/ModuleDS1307/fork-Alexander/js/module/ModuleDS1307.min.js');

try {
    let clock = new clock_class();

    clock.SetTime(new Date(2023,3,20,13,55,0));

    //clock.AdjustTime(30, 'mm');
    
    console.log(clock.GetTimeISO() + ' iso\n');

} catch(e){
    console.log('Error>> ' + e.Message + ' Code>> ' + e.Code);
}
