export default function (name, icon, title, onClickCallback) {

    var Simditor = window.Simditor;

    var extend = Simditor.__$$functions_extend;

    var UbibiExtendButton = (function (superClass) {
        extend(UbibiExtendButton, superClass);

        function UbibiExtendButton() {
            return UbibiExtendButton.__super__.constructor.apply(this, arguments);
        }

        UbibiExtendButton.prototype.name = name;

        UbibiExtendButton.prototype.icon = icon;

        UbibiExtendButton.prototype.ubibiAutoFocus = true;

        UbibiExtendButton.prototype._init = function () {
            this.title = this.title + ' ( ' + title + ' )';
            return UbibiExtendButton.__super__._init.call(this);
        };

        UbibiExtendButton.prototype._activeStatus = function () {
        };

        UbibiExtendButton.prototype.command = function () {
            onClickCallback&&onClickCallback(name);
        };

        return UbibiExtendButton;

    })(Simditor.Button);

    Simditor.Toolbar.addButton(UbibiExtendButton);

}