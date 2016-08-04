import React, {PropTypes} from 'react';
import { Modal } from 'antd';

export default class FullScreenDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal:false
        };
    }

    setModal1Visible(isShow){
        this.setState({
            showModal:isShow
        });
    }

    open(){
        this.setModal1Visible(true);
    }

    close(){
        this.setModal1Visible(false);
    }

    render(){

        return (
            <div>
                <Modal
                    width="100%"
                    style={{top: 0}}
                    title=""
                    wrapClassName="cp-fullscreen-dialog"
                    visible={this.state.showModal}
                    footer = {<div></div>}
                    onOk={() => this.setModal1Visible(false)}
                    onCancel={() => this.setModal1Visible(false)}
                >
                    {this.props.children}
                </Modal>
            </div>
        );
    }

}

