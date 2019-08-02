"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FloatMsg_1 = require("../Tool/FloatMsg");
var Tool_1 = require("../Tool/Tool");
/**
 * 消息显示管理器
 */
var MessageManager = /** @class */ (function () {
    function MessageManager() {
        this.countFloatMsg = 0;
    }
    /**
     * 浮动消息预热,，提前新建一个float
     */
    MessageManager.prototype.newFloatMsg = function () {
        var floatMsg = new FloatMsg_1.default();
        Laya.stage.addChild(floatMsg);
        Laya.Pool.recover("FloatMsg", floatMsg);
    };
    /**
     * 显示浮动消息
     * @param text  显示消息
     */
    MessageManager.prototype.showFloatMsg = function (text) {
        var floatMsg = Laya.Pool.getItem("FloatMsg");
        if (Laya.Pool.getPoolBySign("FloatMsg").length == 0)
            this.newFloatMsg();
        if (floatMsg === null) {
            floatMsg = new FloatMsg_1.default();
            Laya.stage.addChild(floatMsg);
        }
        floatMsg.zOrder = 100 + this.countFloatMsg;
        console.log(Tool_1.default.getCenterX());
        floatMsg.showMsg(text, { x: Tool_1.default.getCenterX() + this.countFloatMsg * 20, y: 375 + this.countFloatMsg * 20 });
        this.countFloatMsg++;
    };
    /**单例 */
    MessageManager.ins = new MessageManager;
    return MessageManager;
}());
exports.default = MessageManager;
