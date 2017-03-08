import React from 'react';
import Dialog from './Dialog';

import './FullScreenDialog.less';

export default class FullScreenDialog extends Dialog {
    constructor() {
        super(...arguments);
        this.className += ' dlg-fullscreen';
    }

    onCloseClick = () => this.close();

    renderHeader() {
        return (
            <div className="fs-btn-close" onClick={this.onCloseClick}>
                <div className="icon icon-global-button-action-esc"></div>
                esc
            </div>
        );
    }

    renderFooter() {
        return null;
    }
}
