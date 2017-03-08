import React from 'react';
import Dialog from './Dialog';

import './ModelDialog.less';

export default class ModelDialog extends Dialog {
    constructor() {
        super(...arguments);
        this.className += ' dlg-modelDialog';
    }

    onCloseClick = () => this.close();

    renderHeader() {
        return (
            <div className="ficon_delete btn_close" onClick={this.onCloseClick}></div>
        );
    }

    renderFooter() {
        return null;
    }
}
