(function (root, factory) {
    //if (typeof define === 'function' && define.amd) {
    //    // AMD. Register as an anonymous module unless amdModuleId is set
    //    define('simditor-emoji', ["jquery","simditor"], function (a0,b1) {
    //        return (root['EmojiButton'] = factory(a0,b1));
    //    });
    //} else if (typeof exports === 'object') {
    //    // Node. Does not work with strict CommonJS, but
    //    // only CommonJS-like environments that support module.exports,
    //    // like Node.
    //    module.exports = factory(require("jquery"),require("Simditor"));
    //} else {
        root['SimditorEmoji'] = factory(jQuery,Simditor);
    //}
}(this, function ($, Simditor) {

    var EmojiButton,
        extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        hasProp = {}.hasOwnProperty,
        slice = [].slice;

    EmojiButton = (function(superClass) {
        extend(EmojiButton, superClass);

        EmojiButton.i18n = {
            'zh-CN': {
                emoji: '表情'
            },
            'en-US': {
                emoji: 'emoji'
            }
        };

        EmojiButton.images = ['smile', 'smiley', 'laughing'];

        EmojiButton.prototype.name = 'emoji';

        EmojiButton.prototype.icon = 'smile-o';

        EmojiButton.prototype.menu = true;

        //add by luanhaipeng
        EmojiButton.prototype.ubibiAutoFocus = true;
        //add by luanhaipeng , 返回一个jQuery对象，并且已经绑定了点击tab按钮的事件
        EmojiButton.prototype.emojiPanelRender = null;

        function EmojiButton() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            EmojiButton.__super__.constructor.apply(this, args);
            $.merge(this.editor.formatter._allowedAttributes['img'], ['data-emoji', 'alt']);
        }

        function toEmojiItem(dir,name) {
           return "<li data-name='" + name + "'><img src='" + dir + name + ".png' width='30' height='30' alt='" + name + "' /></li>";
        }

        EmojiButton.prototype.renderMenu = function() {
            var $list, dir, html, i, len, name, opts, ref, tpl;

            opts = $.extend({
                imagePath: 'images/emoji/',
                images: EmojiButton.images
            }, this.editor.opts.emoji || {});

            dir = opts.imagePath.replace(/\/$/, '') + '/';

            //add by luanhaipeng , 返回一个jQuery对象，并且已经绑定了点击tab按钮的事件
            if(opts.emojiPanelRender){
                $list = opts.emojiPanelRender(function (name) {
                    return toEmojiItem(dir,name);
                });
                $list.appendTo(this.menuWrapper);
            }else {
                tpl = '<ul class="emoji-list">\n</ul>';
                html = "";
                ref = opts.images;
                for (i = 0, len = ref.length; i < len; i++) {
                    name = ref[i];
                    html += toEmojiItem(dir,name);
                }
                $list = $(tpl);
                $list.html(html).appendTo(this.menuWrapper);
            }

            return $list.on('mousedown', 'li', (function(_this) {
                return function(e) {
                    var $img;
                    _this.wrapper.removeClass('menu-on');
                    if (!_this.editor.inputManager.focused) {
                        return;
                    }

                    var $oldImg = $(e.currentTarget).find('img');
                    var oldClass = $oldImg.attr("class");
                    $img = $oldImg.clone().attr({
                        'data-emoji': true,
                        'data-non-image': false,
                        'data-ubibiclass':oldClass||""
                    });

                    _this.editor.selection.insertNode($img);
                    _this.editor.trigger('valuechanged');
                    _this.editor.trigger('selectionchanged');
                    return false;
                };
            })(this));
        };

        EmojiButton.prototype.status = function() {};

        return EmojiButton;

    })(Simditor.Button);

    Simditor.Toolbar.addButton(EmojiButton);

    return EmojiButton;

}));