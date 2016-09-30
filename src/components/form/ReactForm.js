import {getDataFromImmutableOrPlain,isArray,immutableListMap,shallowEqual,uniqueId} from '../../core/utils/index';
import PureRenderComponent from '../../core/PureRenderComponent';
import React, {PropTypes} from 'react';
import $ from 'jquery';

var _undefined = window.undefined;

function formInput(name, text, options,obj) {
    var placeholder = obj.placeholder || "";
    var className = obj.className||"";
    var onClick = function (e) {
        if(obj.onClick){
            obj.onClick(e);
        }
    };

    var onChange = function (e) {
        if(obj.onChange){
            obj.onChange(e);
        }
    };

    var onKeyUp = function (e) {
        if(e.keyCode===13 && obj.onEnterKey){
            obj.onEnterKey(e);
        }
    };

    if(obj.type==="textarea"){
        return <textarea className={`formInput ${className}`} name={name} type={obj.type} placeholder={placeholder} onClick={onClick} onChange={onChange} onKeyUp={onKeyUp} ></textarea>
    }
    else if(obj.type==="submit"||obj.type==="button"){
        return <input className={`formInput ${className}`} name={name} type={obj.type} value={placeholder} onClick={onClick} />;
    }
    else {
        return <input className={`formInput ${className}`} name={name} type={obj.type} placeholder={placeholder} onClick={onClick} onChange={onChange} onKeyUp={onKeyUp} />;
    }

}

function formInputSetter(value, $formItem) {

    if (value === null || value === _undefined) {
        value = "";
    }
    var $input = $formItem.find('.formInput');
    $input.val(value);
}


function formInputGetter($formItem) {
    var $input = $formItem.find('.formInput');
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
    if (value === null || value === _undefined) {
        value = "";
    }
    var $input = $formItem.find('.formInput');
    $input.val(value);
}


function formSelectGetter($formItem) {
    var $input = $formItem.find('.formInput');
    return $input.val();
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






/*****************************************************************************************************************/


var typeRenderMap = {
    'input': formInput,
    'password': formInput,
    'submit': formInput,
    'button': formInput,
    "textarea":formInput,
    'checkbox': formCheckbox,
    'radio': formRadio,
    'select': formSelect
};

var typeSetterMap = {
    'input': formInputSetter,
    'password': formInputSetter,
    'submit': formInputSetter,
    'button': formInputSetter,
    "textarea":formInputSetter,
    'checkbox': formCheckboxSetter,
    'radio': formRadioSetter,
    'select': formSelectSetter
};

var typeGetterMap = {
    'input': formInputGetter,
    'password': formInputGetter,
    'submit': formInputGetter,
    'button': formInputGetter,
    "textarea":formInputGetter,
    'checkbox': formCheckboxGetter,
    'radio': formRadioGetter,
    'select': formSelectGetter
};


function getTypeRender(type) {
    var render = typeRenderMap[type];
    if (render) {
        return render;
    }
    return defaultRender;
}


function getFormItemSetter(type) {
    var setter = typeSetterMap[type];
    if (setter) {
        return setter;
    }
    return $.noop;
}

function getFormItemValueGetter(type) {
    var getter = typeGetterMap[type];
    if (getter) {
        return getter;
    }
    return function () {
        return "";
    }
}

function setFromItemValue($formItem, values) {
    var name = $formItem.attr('data-name');
    var type = $formItem.attr('data-type');
    var value = values[name];
    var setter = getFormItemSetter(type);
    setter(value, $formItem);
}

function getFromItemValue($formItem) {
    var name = $formItem.attr('data-name');
    var type = $formItem.attr('data-type');
    var setter = getFormItemValueGetter(type);
    return setter($formItem);
}



export function getReactFormValues(id) {
    var $formItemList = $("#"+id).find('.formItem');
    var values = {};
    $formItemList.each(function () {
        var $formItem = $(this);
        var name = $formItem.attr('data-name');
        var v = getFromItemValue($formItem);
        values[name] = v;
    });
    return values;
}

export function getReactFormValue(id,name){
    return getReactFormValues(id)[name];
}

export function createReactFormUniqueId(){
    return uniqueId("ReactFormUniqueId")
}

export class FormItem extends PureRenderComponent{
    constructor(props) {
        super(props);
    }

    render(){
        var {text,name,type,options,config} = this.props;
        var itemRender = getTypeRender(type);
        config = config || this.props;
        return (
            <div className="formItem" data-name={name} data-type={type}>
                <div className="formItemTitle">{text}</div>
                <div className="formItemCont">
                    {itemRender(name, text, options,config)}
                </div>
            </div>
        );
    }
}

/***************ReactForm**************/
export default class ReactForm extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {};
        this.values = null;
    }

    isValuesChanged(values) {
        if (this.values === values) {
            return false;
        }
        return !shallowEqual(this.values, values);
    }

    setValues(values) {
        if(!values){
            return;
        }
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


    renderContent(layout,children){
        if(!layout){
            return children;
        }
        else {
            return immutableListMap(layout, function (obj) {
                var text = getDataFromImmutableOrPlain(obj, 'text');
                var name = getDataFromImmutableOrPlain(obj, 'name');
                var type = getDataFromImmutableOrPlain(obj, 'type');
                var options = getDataFromImmutableOrPlain(obj, 'options');
                return <FormItem text={text} name={name} type={type} options={options} config={obj}></FormItem>;
            });
        }
    }

    render() {
        var layout = this.props.layout;
        var id = this.props.id;
        var children = this.props.children;
        return (
            <div ref="formRef" id={id} >
                {this.renderContent(layout,children)}
            </div>
        );
    }
}


////function test(){
////
////    var layout = [
////        {
////            name:'name',text:'姓名',type:'input',placeholder:"请输入姓名",validate:function(){}
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
////        <ReactForm id="" layout={layout} values={values} ></ReactForm>
////
////    );
////
////}
