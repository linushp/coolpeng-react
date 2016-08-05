import { Button, Form, Input, Modal } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { login } from '../../actions/user'

var LoginModal = React.createClass({
    getInitialState() {
        return {};
    },

    componentWillMount() {
    },

    handleSubmit() {
        var that = this;
        var data = this.props.form.getFieldsValue();
        var username = data.username;
        var password = data.password;
        this.props.login(username, password, function (action,res) {
            debugger;
            if (res && res.responseCode === 0) {
                var parent = that.props.parent;
                parent.close();
            }
        });
    },

    hideModal() {
        var parent = this.props.parent;
        parent.close();
    },

    render() {
        const { getFieldProps } = this.props.form;

        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 10}
        };

        var visible = this.props.visible;

        return (
            <div>
                <Modal title="用户登录" visible={visible} onOk={this.handleSubmit} onCancel={this.hideModal}>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                        >
                            <Input {...getFieldProps('username', {})} type="text" autoComplete="off"/>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                        >
                            <Input {...getFieldProps('password', {})} type="password" autoComplete="off"/>
                        </FormItem>
                        {this.props.loginErrors}
                    </Form>
                </Modal>
            </div>
        );
    }
});


function mapStateToProps(state) {
    const {user} = state;
    if (user.user) {
        return {user: user.user, loggingIn: user.loggingIn, loginErrors: '', loggingShow: user.loggingShow};
    }
    return {user: null, loggingIn: user.loggingIn, loginErrors: user.loginErrors, loggingShow: false};
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch)
    }
}

LoginModal = connect(mapStateToProps, mapDispatchToProps)(LoginModal);

LoginModal = createForm()(LoginModal);


export default class LoginDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    open() {
        this.setState({visible: true});
    }

    close() {
        this.setState({visible: false});
    }

    render() {
        var visible = this.state.visible;
        return (
            <LoginModal visible={visible} parent={this}></LoginModal>
        );
    }
}
