import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;

const AppNavMenuItem = createPureComponent(function(props){
    return (
        <div className="AppNavMenuItem">

        </div>
    );
});

class AppNav extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    goToMessage =()=>{

    };

    goToContact =()=>{

    };

    render(){
        var that = this;
        return (
            <div className="AppNav">
                <AppNavMenuItem icon="chat" text="消息" onClick={that.goToMessage}/>
                <AppNavMenuItem icon="contact" text="联系人" onClick={that.goToContact} />
            </div>
        )
    }
}

export default RebixFlux.connect(AppNav,function(store, props, context, connectState, that){
    return {

    }
});