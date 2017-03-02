import {forEach} from 'rebix-utils';

export default function (form,filedArray){
    var result = {};
    forEach(filedArray,function(name){
         result[name] = form[name].value;
    });
    return result;
}