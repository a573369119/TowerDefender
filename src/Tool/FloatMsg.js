"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../ui/layaMaxUI");
var MessageManager_1 = require("../Core/MessageManager");
/**
 * 中间字
 */
var FloatMsg = /** @class */ (function (_super) {
    __extends(FloatMsg, _super);
    function FloatMsg() {
        return _super.call(this) || this;
    }
    FloatMsg.prototype.onEnable = function () {
        this.addEvent();
        this.init();
    };
    FloatMsg.prototype.init = function () {
        this.ani1.stop();
        this.sp_floatMsg.visible = false;
    };
    FloatMsg.prototype.addEvent = function () {
        this.on(Laya.Event.CLICK, this, this.onHidden);
        this.ani1.on(Laya.Event.COMPLETE, this, this.onHidden);
    };
    /**
     * 显示消息飘字
     * @param text 显示文本 【最多28个】
     * @param pos  位置{x:100,y:100}
     */
    FloatMsg.prototype.showMsg = function (text, pos) {
        this.visible = true;
        this.alpha = 1;
        this.sp_floatMsg.visible = true;
        this.lab_floatMsg.text = text;
        this.x = pos.x;
        this.y = pos.y;
        this.ani1.play(0, false);
    };
    FloatMsg.prototype.onHidden = function () {
        this.ani1.stop();
        this.sp_floatMsg.visible = false;
        this.visible = false;
        Laya.Pool.recover("FloatMsg", this);
        MessageManager_1.default.ins.countFloatMsg--;
    };
    return FloatMsg;
}(layaMaxUI_1.ui.Dialog_.FloatMsgUI));
exports.default = FloatMsg;
