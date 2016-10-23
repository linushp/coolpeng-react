import Dialog from '../../../components/dialog/Dialog';
import {createUUID,isEmpty,getStaticImages,StringUtils,StaticConfig,uniqueId} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';
import ReactForm,{getReactFormValues,createReactFormUniqueId} from '../../../components/form/ReactForm';
import _ from 'underscore';
import $ from 'jquery';
import './CodeInputDialog.less';


function toSelectOptions(optionList) {
    return _.map(optionList, function (name) {
        return {id: name, text: name};
    });
}

class CodeInputDialog extends PureRenderComponent {
    constructor(props) {
        super(props);
        var that = this;
        that.reactFormUniqueId = createReactFormUniqueId();
        that.reactFormLayout = [
            {name: 'title', type: 'input', placeholder: "代码标题"},
            {
                name: 'language', type: 'select', options: toSelectOptions([
                "Apache",
                "Bash",
                "C#",
                "C++",
                "CSS",
                "CoffeeScript",
                "Diff",
                "HTML, XML",
                "HTTP",
                "Ini",
                "JSON",
                "Java",
                "JavaScript",
                "Makefile",
                "Markdown",
                "Nginx",
                "Objective-C",
                "PHP",
                "Perl",
                "Python",
                "Ruby",
                "SQL"
            ])
            }
        ];
        
        that.state={
            reactFormValues:{
                title:(new Date().getTime())+".code",
                language:"Java"
            }
        };
    }


    render() {
        var {id} = this.props;
        var {reactFormValues} = this.state;
        return (
            <div id={id} className="CodeInputDialog">
                <div className="line1">
                    <ReactForm id={this.reactFormUniqueId} layout={this.reactFormLayout} values={reactFormValues}></ReactForm>
                </div>
                <textarea name="content" className="codeTextArea formInput" placeholder="插入代码" cols="30"
                          rows="10"></textarea>
            </div>
        );
    }

}


export function showCodeInputDialog(outCallback) {

    var popStyle = {
        width: 650,
        height: 430
    };
    var popClass = "dialogs-CodeInputDialog";
    var id = uniqueId(popClass);
    var buttons = [
        {text: '确定', name: 'ok', cls: 'primary', action: 'close'},
        {text: '关闭', name: 'cancel', cls: '', action: 'close'}
    ];

    function callback(btn, d, doCloseDialog) {
        var name = btn.name;

        if (name == 'ok') {
            var data = {};
            $("#" + id).find(".formInput").each(function () {
                var $this = $(this);
                var v = $this.val();
                var key = $this.attr('name');
                data[key] = v;
            });
            outCallback(data);
        }

        setTimeout(function () {
            if (name == 'ok' || name === 'cancel') {
                doCloseDialog();
            }
        }, 10);
    }

    window.setTimeout(function () {
        //content,callback,title, buttons, popStyle, popClass,closeControl
        Dialog.showModal(<CodeInputDialog id={id}/>, callback, "插入代码", buttons, popStyle, popClass, true);
    }, 0);
}