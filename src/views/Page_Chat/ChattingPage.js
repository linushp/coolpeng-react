import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const map = RebixUtils.map;
const forEach = RebixUtils.forEach;
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
import SessionActions from '../../actions/SessionActions';
import UserAccountActions from '../../actions/UserAccountActions';
import SessionList from './SessionList/SessionList';
import MessageList from './MessageList/MessageList';
import MessageInput from './MessageInput/MessageInput';
import './ChattingPage.less';

export default class ChattingPage extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }

    componentDidMount() {
        var that = this;

        SessionActions.getMySessions().then(function (result) {

            var toUidArray = [];
            forEach(result, function (v) {
                if (v.session_type === 1) { //P2P
                    var to_sid = parseInt(v.to_sid, 10);
                    toUidArray.push(to_sid);
                }
            });

            if (toUidArray.length > 0) {
                UserAccountActions.getUserByUidInList(toUidArray).then(()=> {
                    setTimeout(()=> {
                        that.setState({isLoaded: true});
                    }, 10);
                });
            } else {
                setTimeout(()=> {
                    that.setState({isLoaded: true});
                }, 10);
            }

        });
    }

    render() {
        var {isLoaded} = this.state;
        if (!isLoaded) {
            return <div>loading....</div>
        }

        return (
            <div className="ChattingPage">
                <SessionList />
                <div className="MessagePanel">
                    <MessageList />
                    <MessageInput />
                </div>
            </div>
        )
    }
}

//export default RebixFlux.connect(ChattingPage, function (store, props, context, connectState, that) {
//   //console.log('ChattingPage',store);
//    return {}
//},{componentName:'ChattingPage'});