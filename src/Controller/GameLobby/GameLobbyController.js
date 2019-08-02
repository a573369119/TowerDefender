"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var WebSocketManager_1 = require("../../Core/Net/WebSocketManager");
var GameConfig_1 = require("../../Core/Const/GameConfig");
var MatchHandler_1 = require("../GameLobby/handler/MatchHandler");
var GameLobbyController = /** @class */ (function (_super) {
    __extends(GameLobbyController, _super);
    function GameLobbyController() {
        return _super.call(this) || this;
    }
    /**启动 */
    GameLobbyController.prototype.onEnable = function () {
        this.addEvents();
    };
    /**销毁*/
    GameLobbyController.prototype.onDestroy = function () {
        this.removeEvents();
    };
    /**事件绑定 */
    GameLobbyController.prototype.addEvents = function () {
        this.btn_PVP.on(Laya.Event.CLICK, this, this.onPVPMode);
        this.btn_1V1.on(Laya.Event.CLICK, this, this.on1V1);
        this.btn_5V5.on(Laya.Event.CLICK, this, this.on5V5);
        this.btn_back.on(Laya.Event.CLICK, this, this.onBack);
        this.btn_entergame.on(Laya.Event.CLICK, this, this.onEnterLoading);
        WebSocketManager_1.default.ins.registerHandler(GameConfig_1.Protocol.RES_MATCH_INFO, new MatchHandler_1.default(this, this.onMatchHandler));
    };
    GameLobbyController.prototype.removeEvents = function () {
        this.btn_PVP.off(Laya.Event.CLICK, this, this.onPVPMode);
        WebSocketManager_1.default.ins.unregisterHandler(GameConfig_1.Protocol.RES_MATCH_INFO, this);
    };
    /**点击进入PVP选择界面 */
    GameLobbyController.prototype.onPVPMode = function () {
        this.MenuItemPanel.visible = false;
        this.ModeChoosePanel.visible = true;
    };
    /**获取到消息 */
    GameLobbyController.prototype.onMatchHandler = function (data) {
        console.log(data + "匹配成功");
        if (data !== undefined) {
            Laya.timer.once(100, this, this.chooseMatch);
        }
    };
    /**点击选择1V1模式 */
    GameLobbyController.prototype.on1V1 = function () {
        // ClientSender.reqMatch(1,1);
        this.chooseMatch();
    };
    /**点击选择5V5模式 */
    GameLobbyController.prototype.on5V5 = function () {
    };
    /**点击返回游戏大厅 */
    GameLobbyController.prototype.onBack = function () {
        this.MenuItemPanel.visible = true;
        this.ModeChoosePanel.visible = false;
    };
    /**匹配成功弹框，选择是否进入游戏 */
    GameLobbyController.prototype.chooseMatch = function () {
        this.MatchingSuccessPanel.visible = true;
        this.ModeChoosePanel.visible = false;
    };
    /**进入游戏 */
    GameLobbyController.prototype.onEnterLoading = function () {
        Laya.Scene.open("PlayerLoading.scene");
    };
    return GameLobbyController;
}(layaMaxUI_1.ui.GameLobby.GameLobbyUI));
exports.default = GameLobbyController;
