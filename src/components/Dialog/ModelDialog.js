import React from 'react';
import Dialog from './Dialog';

import './ModelDialog.less';

export default class ModelDialog extends Dialog {
    constructor() {
        super(...arguments);
        this.className += ' dlg-modelDialog';
    }

    onCloseClick = () => this.close();

    getDialogTitle() {
        return "";
    }

    renderHeader() {
        var title = this.getDialogTitle(this);
        return (
            <div className="dlg-header">
                <div className="dlg-btn-close" onClick={this.onCloseClick}>
                    <div className="dlg-btn-close-icon"></div>
                </div>
                <div className="dlg-header-title">
                    {title}
                </div>
            </div>
        );
    }

    renderFooter() {
        return null;
    }
}
