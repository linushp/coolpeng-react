import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import './index.less';
var document = window.document;


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


var uniqueIdNumber = 0;
var styleZIndex = 1000;
function uniqueId(prefix) {
    uniqueIdNumber++;
    return prefix + '' + uniqueIdNumber;
}


var dialogUniqueId = function () {
    return uniqueId('');
};

class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            positionX: null,
            positionY: null
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
        this.setState({show: false});
        var data = this.props.data;
        var doCloseDialog = this.doCloseDialog.bind(this);
        if (data.callback) {
            data.callback('close', null, data, btn,function(){
                doCloseDialog();
            });
        }else {
            doCloseDialog();
        }
    }


    getPopStyle(popStyle) {
        popStyle = popStyle || {};

        var newStyle={'zIndex': (this.styleZIndex + 1)};
        if(this.state.positionY!==null){
            newStyle['top'] = this.state.positionY;
        }
        if(this.state.positionX!==null){
            newStyle['left'] = this.state.positionX;
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

    render() {
        var {type,title, content,callback,id,buttons,popStyle,popClass} = this.props.data;
        id = id || dialogUniqueId();
        popClass = popClass || '';
        var popClassDisplay = this.state.show?'':'cp-dialog-hidden';
        //draggable={true} onDragEnd={this.ondragend.bind(this)}
        return (
            <div className="cp-dialog">
                <div data-mid={id} className={`cp-dialog-${type}`}>
                    <div className="cp-dialog-mask" style={{'zIndex':this.styleZIndex}}></div>
                    <div className={`cp-dialog-pop ${popClassDisplay} ${popClass}`} style={this.getPopStyle(popStyle)} >
                        <div className="cp-dialog-header"> {title} </div>
                        <div className="cp-dialog-ico cp-dialog-close" onClick={this.onClickClose.bind(this)}
                             style={{'zIndex':(this.styleZIndex+2)}}></div>
                        <div className="cp-dialog-content">
                            <i className={this.getIconClass(type)}></i>
                            <div className="cp-dialog-inner">{content}&nbsp;</div>
                        </div>
                        <div className="cp-dialog-footer">
                            {this.renderFooter(buttons)}
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


function createShowDialog(type,defaultTitle, defaultButtons) {
    return function (content,callback,title, buttons, popStyle, popClass) {
        buttons = buttons || defaultButtons;
        title = title || defaultTitle;
        getDialogManagerInstance().pushDialog({
            type: type,
            title: title,
            content: content,
            buttons: buttons,
            callback: callback,
            popStyle: popStyle,
            popClass: popClass
        });
    }
}

var btnOK = {text: '确定', name:'ok', cls: 'primary', action: 'close'};
var btnCancel = {text: '取消', name:'cancel', cls: '', action: 'close'};

var defaultButton_1 = [btnOK];
var defaultButton_2 = [btnCancel,btnOK];

module.exports = {

    showModal: createShowDialog(DIALOG_TYPE_MODAL,'标题', defaultButton_2),

    showAlertInfo: createShowDialog(DIALOG_TYPE_ALERT_INFO,'提示', defaultButton_1),
    showAlertError: createShowDialog(DIALOG_TYPE_ALERT_ERROR,'错误', defaultButton_1),
    showAlertSuccess: createShowDialog(DIALOG_TYPE_ALERT_SUCCESS,'成功', defaultButton_1),
    showAlertPrompt: createShowDialog(DIALOG_TYPE_ALERT_PROMPT,'请确认?', defaultButton_2),

    showFullScreen: createShowDialog(DIALOG_TYPE_FULL_SCREEN,'', defaultButton_1),

    showMsgInfo: createShowDialog(DIALOG_TYPE_MSG_INFO),
    showMsgSuccess: createShowDialog(DIALOG_TYPE_MSG_SUCCESS),
    showMsgError: createShowDialog(DIALOG_TYPE_MSG_ERROR),

    showNotification: createShowDialog(DIALOG_TYPE_NOTIFICATION),


    Dialog: Dialog

};
