import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import PureRenderComponent from '../../core/PureRenderComponent';
import _ from 'underscore';
import './index.less';
var document = window.document;
var undefined = window.undefined;

var DIALOG_TYPE_MODAL = 'modal';
var DIALOG_TYPE_ALERT_INFO = 'alert info';
var DIALOG_TYPE_ALERT_PROMPT = 'alert prompt';
var DIALOG_TYPE_ALERT_ERROR = 'alert error';
var DIALOG_TYPE_ALERT_SUCCESS = 'alert success';

var DIALOG_TYPE_FULL_SCREEN = 'fullScreen';

var DIALOG_TYPE_MSG_INFO = 'msg info';
var DIALOG_TYPE_MSG_SUCCESS = 'msg success';
var DIALOG_TYPE_MSG_ERROR = 'msg error';

var DIALOG_TYPE_NOTIFICATION = 'notification';

var btnOK = {text: '确定', name:'ok', cls: 'primary', action: 'close'};
var btnCancel = {text: '取消', name:'cancel', cls: '', action: 'close'};

var uniqueIdNumber = 0;
var styleZIndex = 1000;
function uniqueId(prefix) {
    uniqueIdNumber++;
    return prefix + '' + uniqueIdNumber;
}


var dialogUniqueId = function () {
    return uniqueId('');
};

class Dialog extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {
            show: props.show
        };
        this.styleZIndex = styleZIndex;
        this.timeoutHandler = null;
        styleZIndex = styleZIndex + 10;
    }

    componentDidMount() {
        var data = this.props.data;
        var type = data.type;
        if (type === DIALOG_TYPE_MSG_ERROR ||
            type === DIALOG_TYPE_MSG_INFO ||
            type === DIALOG_TYPE_MSG_SUCCESS ||
            type === DIALOG_TYPE_NOTIFICATION) {
            var doCloseDialog = this.doCloseDialog.bind(this);
            this.timeoutHandler = window.setTimeout(function () {
                doCloseDialog();
            }, 2000);
        }
    }



    doCloseDialog(){
        if(this.timeoutHandler){
            window.clearTimeout(this.timeoutHandler);
        }
        var data = this.props.data;
        var onClose = this.props.onClose;
        this.setState({show:false});
        this.timeoutHandler = window.setTimeout(function(){
            onClose(data);
        },200);
    }


    onClickClose(btn) {
        var that = this;
        var data = that.props.data;
        var doCloseDialog = that.doCloseDialog.bind(that);
        if (data.callback) {
            if(data.closeControl===true){
                data.callback(btn,data,function(){
                    doCloseDialog();
                });
            }else {
                var dialogContentInner = null;
                if(data.isClassContent){
                    dialogContentInner = that.refs['dialogContentInner'];
                }
                data.callback(btn,data,dialogContentInner,that);
                doCloseDialog();
            }
        }else {
            doCloseDialog();
        }
    }

    onClickEventCallback(name,e){
        var data = this.props.data;
        if (data.callback) {
            var doCloseDialog = this.doCloseDialog.bind(this);
            data.callback({action:name,name:name},e,doCloseDialog);
        }
    }

    onClickContent(e){
        this.onClickEventCallback("onClickContent",e);
    }

    onClickDialogMask(e){
        this.onClickEventCallback("onClickDialogMask",e);
    }


    getPopStyle(popStyle) {
        popStyle = popStyle || {};

        var height = popStyle.height;
        var width = popStyle.width ;
        var newStyle={
            'zIndex': (this.styleZIndex + 1)
        };

        if(height){
            newStyle[height] = height;
            newStyle['marginTop'] = (0-(height/2));
        }
        if(width){
            newStyle[width] = width;
            newStyle['marginLeft'] = (0-(width/2));
        }

        return Object.assign(newStyle, popStyle);
    }

    onButtonClick(btn) {
        var action = btn.action;
        if (action === 'close') {
            this.onClickClose(btn);
        }
    }

    getIconClass(type){
        var iconClass = 'cp-dialog-ico  ';
        if(type===DIALOG_TYPE_ALERT_INFO){
            //iconClass += 'cp-dialog-ico0';
        }else if(type===DIALOG_TYPE_ALERT_SUCCESS){
            iconClass += 'cp-dialog-ico1';
        }else if(type===DIALOG_TYPE_ALERT_ERROR){
            iconClass += 'cp-dialog-ico2';
        }else if(type===DIALOG_TYPE_ALERT_PROMPT){
            iconClass += 'cp-dialog-ico3';
        }
        else if(type===DIALOG_TYPE_MODAL){
            return '';
        }
        else if(type===DIALOG_TYPE_MSG_INFO){
            //iconClass += 'cp-dialog-ico0';
        }
        else if(type===DIALOG_TYPE_MSG_SUCCESS){
            iconClass += 'cp-dialog-ico6';
        }
        else if(type===DIALOG_TYPE_MSG_ERROR){
            iconClass += 'cp-dialog-ico5';
        }
        return iconClass;
    }


    renderFooter(buttons) {
        if (buttons && buttons.length > 0) {
            var that = this;
            return buttons.map(function (btn) {
                //[{text:'确定',cls:'primary',action:'close'}];
                var cls = btn.cls || '';
                return <span onClick={that.onButtonClick.bind(that,btn)}
                             className={`cp-dialog-btn cp-dialog-btn-${cls}`}>{btn.text}</span>
            });
        }
        return null;
    }


    getDialogInstanceMethods(that){
        return {
            closeDialog:that.doCloseDialog.bind(that)
        };
    }

    render() {
        var {type,title, content,callback,id,buttons,popStyle,popClass,isClassContent,instanceArgs} = this.props.data;
        id = id || dialogUniqueId();
        popClass = popClass || '';
        var popClassDisplay = this.state.show?'':'cp-dialog-hidden';
        //draggable={true} onDragEnd={this.ondragend.bind(this)}
        var that = this;
        var dialogInstanceMethods = that.getDialogInstanceMethods(that);

        var dialogContentInner = content;
        if(isClassContent){
            dialogContentInner  = (<content ref="dialogContentInner" dialog={that} methods={dialogInstanceMethods} args={instanceArgs}></content>);
        }else {
            dialogContentInner = content;
        }

        return (
            <div className={`cp-dialog ${popClassDisplay}`}>
                <div data-mid={id} className={`cp-dialog-${type}`}>
                    <div className="cp-dialog-mask" onClick={that.onClickDialogMask.bind(that)} style={{'zIndex':that.styleZIndex}}></div>
                    <div className={`cp-dialog-pop ${popClass}`} style={that.getPopStyle(popStyle)} >
                        <div className="cp-dialog-header" > {title} </div>
                        <div className="cp-dialog-ico cp-dialog-close" onClick={that.onClickClose.bind(that,btnCancel)}
                             style={{'zIndex':(that.styleZIndex+2)}}></div>
                        <div className="cp-dialog-content" onClick={that.onClickContent.bind(that)}>
                            <i className={that.getIconClass(type)}></i>
                            <div className="cp-dialog-inner"> {dialogContentInner}</div>
                        </div>
                        <div className="cp-dialog-footer">
                            {that.renderFooter(buttons)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class DialogManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogList: []
        };
    }

    pushDialog(data) {
        data.id = dialogUniqueId();
        var dialogList = [].concat(this.state.dialogList);
        dialogList.push(data);
        this.setState({dialogList: dialogList});
    }

    onCloseDialog(data) {
        var dialogList = this.state.dialogList;
        var result = [];
        for (var i = 0; i < dialogList.length; i++) {
            var d = dialogList[i];
            if (d.id !== data.id) {
                result.push(d);
            }
        }
        this.setState({dialogList: result});
    }


    render() {
        var dialogList = this.state.dialogList || [];
        var that = this;
        return (
            <div>
                {dialogList.map(function (data) {
                    return <Dialog show={true} key={data.id} data={data} onClose={that.onCloseDialog.bind(that)}></Dialog>
                })}
            </div>
        );
    }
}


var dialogManagerInstance = null;
function getDialogManagerInstance() {
    if (!dialogManagerInstance) {
        var div = document.createElement('div');
        document.body.appendChild(div);
        dialogManagerInstance = ReactDOM.render(<DialogManager></DialogManager>, div);
    }
    return dialogManagerInstance;
}


function createShowDialog(type,defaultTitle, defaultButtons,defaultCloseControl) {
    return function (content,callback,title, buttons, popStyle, popClass,closeControl) {

        buttons = buttons || defaultButtons;
        title = title || defaultTitle;
        if (closeControl === undefined) {
            closeControl = defaultCloseControl;
        }

        var isClassContent = false;

        //第二个参数是一个对象的话,第一个参数就默认是一个Dialog类
        if (!_.isFunction(callback) && !_.isArray(callback) && _.isObject(callback)) {
            var args = callback;
            title = args.title || title;
            buttons = args.buttons || buttons;
            callback = args.callback || callback;
            popStyle = args.popStyle || popStyle;
            popClass = args.popClass || popClass;
            if (args.closeControl !== undefined) {
                closeControl = args.closeControl;
            }

            //第二个参数是一个对象的话,第一个参数就默认是一个Dialog类
            isClassContent = true;
            if (args.isClassContent !== undefined) {
                isClassContent = args.isClassContent;
            }
        }

        //如果现在内容是一个类,第三个参数是传递给对话框视力的所有参数
        var instanceArgs = null;
        if(isClassContent && !_.isFunction(title)&& _.isObject(title)){
            instanceArgs = title;
        }

        getDialogManagerInstance().pushDialog({
            type: type,
            title: title,
            content: content,
            buttons: buttons,
            callback: callback,
            popStyle: popStyle,
            popClass: popClass,
            closeControl: closeControl,
            isClassContent:isClassContent,
            instanceArgs:instanceArgs
        });
    }
}


var defaultButton_1 = [btnOK];
var defaultButton_2 = [btnCancel,btnOK];
var NULL = null;
module.exports = {

    showModal: createShowDialog(DIALOG_TYPE_MODAL,'标题', defaultButton_2,false),
    showAlertInfo: createShowDialog(DIALOG_TYPE_ALERT_INFO,'提示', defaultButton_1,false),
    showAlertError: createShowDialog(DIALOG_TYPE_ALERT_ERROR,'错误', defaultButton_1,false),
    showAlertSuccess: createShowDialog(DIALOG_TYPE_ALERT_SUCCESS,'成功', defaultButton_1,false),
    showAlertPrompt: createShowDialog(DIALOG_TYPE_ALERT_PROMPT,'请确认?', defaultButton_2,false),
    showFullScreen: createShowDialog(DIALOG_TYPE_FULL_SCREEN,'', defaultButton_1,false),
    showMsgInfo: createShowDialog(DIALOG_TYPE_MSG_INFO,NULL,NULL,false),
    showMsgSuccess: createShowDialog(DIALOG_TYPE_MSG_SUCCESS,NULL,NULL,false),
    showMsgError: createShowDialog(DIALOG_TYPE_MSG_ERROR,NULL,NULL,false),
    showNotification: createShowDialog(DIALOG_TYPE_NOTIFICATION,NULL,NULL,false),

    Dialog: Dialog

};
