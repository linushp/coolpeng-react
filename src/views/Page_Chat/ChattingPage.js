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
            isLoaded: false,
            timestamp:new Date().getTime()
        };
        this.setIntervalHandler = 0;
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


        this.setIntervalHandler = setInterval(function(){
            that.setState({timestamp:new Date().getTime()});
        },1000 * 60);
    }

    componentWillUnmount() {
        if (this.setIntervalHandler) {
            clearInterval(this.setIntervalHandler);
            this.setIntervalHandler = 0;
        }
    }


    render() {
        var {isLoaded,timestamp} = this.state;
        if (!isLoaded) {
            return <div>loading....</div>
        }

        return (
            <div className="ChattingPage">
                <SessionList timestamp={timestamp} />
                <div className="MessagePanel">
                    <MessageList timestamp={timestamp} />
                    <MessageInput timestamp={timestamp} />
                </div>
            </div>
        )
    }
}

//export default RebixFlux.connect(ChattingPage, function (store, props, context, connectState, that) {
//   //console.log('ChattingPage',store);
//    return {}
//},{componentName:'ChattingPage'});