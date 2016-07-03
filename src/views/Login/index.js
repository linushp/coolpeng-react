import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { login } from '../../actions/user'


import './index.less'

const propTypes = {
  user: PropTypes.string,
  loggingIn: PropTypes.bool,
  loginErrors: PropTypes.string
};

const contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

class Login extends React.Component {

  constructor (props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
      const error = nextProps.loginErrors;
      const isLoggingIn = nextProps.loggingIn;
      const user = nextProps.user

      if (error != this.props.loginErrors && error) {
          notification.error({
              message: 'Login Fail',
              description: error
          });
      }

      if (!isLoggingIn && !error && user)  {
          notification.success({
              message: 'Login Success',
              description: 'Welcome ' + user
          });
      }

      if (user) {
          this.context.router.replace('/home');
      }
  }

  handleSubmit (e) {
    e.preventDefault();
  }

  render () {
    return (
        <div></div>
    )
  }
}

Login.contextTypes = contextTypes;

Login.propTypes = propTypes;

function mapStateToProps(state) {
  const {user} = state;
  if (user.user) {
      return {user: user.user, loggingIn: user.loggingIn, loginErrors: ''};
  }

  return {user: null, loggingIn: user.loggingIn, loginErrors: user.loginErrors};
}

function mapDispatchToProps(dispatch) {
  return {
    login: bindActionCreators(login, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
