import {getDataFromImmutableOrPlain,isArray,immutableListMap,shallowEqual} from '../../core/utils/index';
import React, {PropTypes} from 'react';
import $ from 'jquery';

function formInput(name, text, options) {
    return (
        <input className="formInput" name={name} type="text"/>
    );
}

function formInputSetter(value, $formItem) {
    var $input = $formItem.find('input');
    $input.val(value);
}


function formInputGetter($formItem) {
    var $input = $formItem.find('input');
    return $input.val();
}


function formSelect(name, text, options) {
    var foptions = formOptions(options, function (id, text) {
        return (<option value={id}>{text}</option>)
    });
    return (
        <select className="formInput" name={name}>
            {foptions}
        </select>
    );
}

/**
 * 设置select的值,跟radio一样
 * @param value  like: "11"
 */
function formSelectSetter(value, $formItem) {

}


function formSelectGetter($formItem) {

}


function formOptions(categoryList, callback) {
    var result = [];
    categoryList.forEach(function (c, i) {
        var text = getDataFromImmutableOrPlain(c, 'text');
        var id = getDataFromImmutableOrPlain(c, 'id');
        result.push(callback(id, text, i));
    });
    return result;
}


function formCheckbox(name, text, options) {
    var foptions = formOptions(options, function (id, text, i) {
        return (
            <label key={i}>
                <span>{text}</span>
                <input type="checkbox" name={name} value={id}/>
            </label>)
    });
    return (<span>{foptions}</span>);
}

function formCheckboxSetter(value, $formItem) {

}

function formCheckboxGetter($formItem) {

}


function formRadio(name, text, options) {
    var foptions = formOptions(options, function (id, text, i) {
        return (
            <label key={i}>
                <span>{text}</span>
                <input type="radio" name={name} value={id}/>
            </label>)
    });
    return (<span>{foptions}</span>);
}

/**
 * 设置Radio的值
 * @param value : like "1"
 */
function formRadioSetter(value, $formItem) {

}


function formRadioGetter($formItem) {

}


function defaultRender() {
    return <div>参数配置错误</div>
}

var typeRenderMap = {
    'input': formInput,
    'checkbox': formCheckbox,
    'radio': formRadio,
    'select': formSelect
};

function getTypeRender(type) {
    var render = typeRenderMap[type];
    if (render) {
        return render;
    }
    return defaultRender;
}


/*******Set Values******/


var typeSetterMap = {
    'input': formInputSetter,
    'checkbox': formCheckboxSetter,
    'radio': formRadioSetter,
    'select': formSelectSetter
};


function getFormItemSetter(type) {
    var setter = typeSetterMap[type];
    if (setter) {
        return setter;
    }
    return $.noop;
}


function setFromItemValue($formItem, values) {
    var name = $formItem.attr('data-name');
    var type = $formItem.attr('data-type');
    var value = values[name];
    var setter = getFormItemSetter(type);
    setter(value, $formItem);
}


/***************getFromItemValue($formItem);**************/


var typeGetterMap = {
    'input': formInputGetter,
    'checkbox': formCheckboxGetter,
    'radio': formRadioGetter,
    'select': formSelectGetter
};


function getFormItemValueGetter(type) {
    var getter = typeGetterMap[type];
    if (getter) {
        return getter;
    }
    return function () {
        return "";
    }
}


function getFromItemValue($formItem) {
    var name = $formItem.attr('data-name');
    var type = $formItem.attr('data-type');
    var setter = getFormItemValueGetter(type);
    return setter($formItem);
}







/***************ReactForm**************/
export default class ReactForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.values = null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    getValues() {
        var formRef = this.refs.formRef.getDOMNode();//拿到了原生DOM
        var $formItemList = $(formRef).find('.formItem');
        var values = {};
        $formItemList.each(function () {
            var $formItem = $(this);
            var name = $formItem.attr('data-name');
            var v = getFromItemValue($formItem);
            values[name] = v;
        });
        return values;
    }

    getValue(name){
        return this.getValues()[name];
    }

    isValuesChanged(values) {
        if (this.values === values) {
            return false;
        }
        return !shallowEqual(this.values, values);
    }

    setValues(values) {
        if (this.isValuesChanged(values)) {
            this.values = values;
            var formRef = this.refs.formRef.getDOMNode();//拿到了原生DOM
            var $formItemList = $(formRef).find('.formItem');
            $formItemList.each(function () {
                var $formItem = $(this);
                setFromItemValue($formItem, values);
            });
        }
    }

    componentDidMount() {
        var values = this.props.values;
        this.setValues(values);
    }


    componentWillReceiveProps(nextProps) {
        var values = nextProps.values;
        this.setValues(values);
    }

    render() {

        var layout = this.props.layout;

        return (
            <div ref="formRef">
                {immutableListMap(layout, function (obj) {
                    var text = getDataFromImmutableOrPlain(obj, 'text');
                    var name = getDataFromImmutableOrPlain(obj, 'name');
                    var type = getDataFromImmutableOrPlain(obj, 'type');
                    var options = getDataFromImmutableOrPlain(obj, 'options');
                    var itemRender = getTypeRender(type);
                    return (
                        <div className="formItem" data-name={name} data-type={type}>
                            <div className="formItemTitle">{text}</div>
                            <div className="formItemCont">
                                {itemRender(name, text, options)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}


////function test(){
////
////    var layout = [
////        {
////            name:'name',text:'姓名',type:'input',validate:function(){}
////        },
////        {
////            name:'sex',text:'性别',type:'checkbox',
////            options:[
////                {id:'m',text:'男'},
////                {id:'f',text:'女'}
////            ]
////        }
////    ];
////
////    var values = {
////        name:'luan', //input
////        like:['food','women'], //checkbox
////        sex:'m' //radio
////        city:'nanjing' //select
////    };
////
////    return (
////
////        <ReactForm layout={layout} values={values} ></ReactForm>
////
////    );
////
////}
