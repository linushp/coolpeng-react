//import {getDataFromImmutableOrPlain,isArray,immutableListMap} from '../../core/utils/index';
//import React, {PropTypes} from 'react';
//import $ from 'jquery';
//
//function formInput(name,text,options){
//    return (
//        <input className="formInput" name={name} type="text" />
//    );
//}
//
//function formSelect(name,text,options){
//    var foptions = formOptions(options,function(id,text){
//        return (<option value={id}>{text}</option>)
//    });
//    return (
//        <select className="formInput" name={name}>
//            {foptions}
//        </select>
//    );
//}
//
//
//function formOptions(categoryList,callback){
//    var result = [];
//    categoryList.forEach(function(c,i){
//        var text = getDataFromImmutableOrPlain(c,'text');
//        var id = getDataFromImmutableOrPlain(c,'id');
//        result.push(callback(id,text,i));
//    });
//    return result;
//}
//
//
//function formCheckbox(name,text,options){
//    var foptions = formOptions(options,function(id,text,i){
//        return (
//            <label key={i}>
//                <span>{text}</span>
//                <input type="checkbox" name={name}  value={id} />
//            </label>)
//    });
//    return (<span>{foptions}</span>);
//}
//
//function formRadio(name,text,options){
//    var foptions = formOptions(options,function(id,text,i){
//        return (
//            <label key={i}>
//                <span>{text}</span>
//                <input type="radio" name={name} value={id} />
//            </label>)
//    });
//    return (<span>{foptions}</span>);
//}
//
//
//
//
//function defaultRender(){
//    return <div>参数配置错误</div>
//}
//
//var typeRenderMap = {
//    'input':formInput,
//    'checkbox':formCheckbox,
//    'radio':formRadio,
//    'select':formSelect
//};
//
//function getTypeRender(type){
//    var render = typeRenderMap[type];
//    if(render){
//        return render;
//    }
//    return defaultRender;
//}
//
//export default class ReactForm extends React.Component {
//    constructor(props) {
//        super(props);
//        this.state = {
//        };
//    }
//
//    getValues(){
//
//    }
//
//    componentDidMount() {
//
//    }
//
//    render(){
//
//        var layout = this.props.layout;
//
//        return (
//            <div ref="form">
//                {immutableListMap(layout,function(obj){
//                    var text = getDataFromImmutableOrPlain(obj,'text');
//                    var name = getDataFromImmutableOrPlain(obj,'name');
//                    var type = getDataFromImmutableOrPlain(obj,'type');
//                    var options = getDataFromImmutableOrPlain(obj,'options');
//                    var itemRender = getTypeRender(type);
//                    return (
//                        <div className="formItem" name={name}>
//                            <div className="formItemTitle">{text}</div>
//                            <div className="formItemCont">
//                                {itemRender(name,text,options)}
//                            </div>
//                        </div>
//                    );
//                })}
//            </div>
//        );
//    }
//}
//
//
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
////        name:'luan',
////        sex:['m','f']
////    };
////
////    return (
////
////        <ReactForm layout={layout} values={values} ></ReactForm>
////
////    );
////
////}
