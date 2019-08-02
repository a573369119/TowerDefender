"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var LoadingController = /** @class */ (function (_super) {
    __extends(LoadingController, _super);
    function LoadingController() {
        return _super.call(this) || this;
    }
    LoadingController.prototype.onEnable = function () {
        this.isConnectServer = false;
        this.loadAssets();
    };
    /**加载游戏场景资源 */
    LoadingController.prototype.loadAssets = function () {
        var src = [
            //图集加载
            { url: "res/atlas/game.atlas" },
            { url: "res/atlas/game/ani.atlas" }
        ];
        Laya.loader.load(src, Laya.Handler.create(this, this.onLoad), Laya.Handler.create(this, this.onProcess));
    };
    /**加载进程 */
    LoadingController.prototype.onProcess = function (pro) {
        var proBox = this.sp_progress;
        var proW = this.sp_progressW;
        var proL = this.sp_progressL;
        proW.width = proBox.width * pro;
        proL.x = proBox.width * pro;
        if (!this.isConnectServer)
            this.sp_progressT.text = "进度加载 " + Math.floor(pro * 100) + "%   [正在连接服务器……]";
        else
            this.sp_progressT.text = "进度加载 " + Math.floor(pro * 100) + "%   [服务器连接成功]";
    };
    /**加载完毕 */
    LoadingController.prototype.onLoad = function () {
        this.EnterGame();
    };
    /**进入游戏 */
    LoadingController.prototype.EnterGame = function () {
        Laya.Scene.open("Game/Game.scene");
    };
    return LoadingController;
}(layaMaxUI_1.ui.PlayerLoadingUI));
exports.default = LoadingController;
