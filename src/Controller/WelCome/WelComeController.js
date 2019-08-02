"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var WebSocketManager_1 = require("../../Core/Net/WebSocketManager");
var GameConfig_1 = require("../../Core/Const/GameConfig");
var UserLoginHandler_1 = require("./handler/UserLoginHandler");
var ClientSender_1 = require("../../Core/Net/ClientSender");
var Tool_1 = require("../../Tool/Tool");
var MessageManager_1 = require("../../Core/MessageManager");
var ConfigManager_1 = require("../../Core/ConfigManager");
var WelComeController = /** @class */ (function (_super) {
    __extends(WelComeController, _super);
    function WelComeController() {
        return _super.call(this) || this;
    }
    /////////////生命周期
    /**启动 */
    WelComeController.prototype.onEnable = function () {
        this.dataInit();
        this.setCenter();
        this.loadAssets();
        this.connectServer(); //连接服务器
        this.addEvents();
    };
    /**销毁*/
    WelComeController.prototype.onDestroy = function () {
        this.removeEvents();
    };
    ////////////逻辑
    /**数据初始化 */
    WelComeController.prototype.dataInit = function () {
        this.isConnectServer = false;
    };
    /**事件绑定 */
    WelComeController.prototype.addEvents = function () {
        this.btn_login.on(Laya.Event.CLICK, this, this.onLogin);
        this.btn_register.on(Laya.Event.CLICK, this, this.onRegister);
        this.btn_toLogin.on(Laya.Event.CLICK, this, this.onToLogin);
        this.btn_toRegister.on(Laya.Event.CLICK, this, this.onToRegister);
        WebSocketManager_1.default.ins.registerHandler(GameConfig_1.Protocol.RES_USER_LOGIN, new UserLoginHandler_1.default(this, this.onLoginHandler));
    };
    WelComeController.prototype.removeEvents = function () {
        this.btn_login.off(Laya.Event.CLICK, this, this.onLogin);
        WebSocketManager_1.default.ins.unregisterHandler(GameConfig_1.Protocol.RES_USER_LOGIN, this);
    };
    /**局中显示 */
    WelComeController.prototype.setCenter = function () {
        var center = Tool_1.default.getCenterX(); //屏幕高度
        this.sp_progress.x = center;
        this.sp_gameName.x = center;
    };
    WelComeController.prototype.loadAssets = function () {
        var src = [
            { url: "unpackage/welcome/boximg.png" },
            //json
            { url: "outside/config/gameConfig/defender.json" },
            { url: "outside/config/gameConfig/monster.json" }
        ];
        Laya.loader.load(src, Laya.Handler.create(this, this.onLoad), Laya.Handler.create(this, this.onProcess));
    };
    /**加载进程 */
    WelComeController.prototype.onProcess = function (pro) {
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
    WelComeController.prototype.onLoad = function () {
        this.sp_progressT.text = "加载完毕进入游戏";
        Laya.timer.once(800, this, this.showLoginBox);
        MessageManager_1.default.ins.newFloatMsg();
        //获取配置
        ConfigManager_1.default.ins.loadConfig();
    };
    /**显示登录框**/
    WelComeController.prototype.showLoginBox = function () {
        this.sp_loginBox.visible = true;
        this.ani1.play(0, false);
        this.sp_gameName.x = this.sp_loginBox.width + this.sp_gameName.width / 2 + 100;
        this.sp_progress.visible = false;
    };
    /**点击登陆 */
    WelComeController.prototype.onLogin = function () {
        //ClientSender.reqUserLogin(this.input_userName.text,this.input_userKey.text);
        Laya.Scene.open("GameLobby/GameLobby.scene");
    };
    /**点击注册 */
    WelComeController.prototype.onRegister = function () {
        this.sp_registerBox.visible = true;
    };
    /**点击 已有账号 */
    WelComeController.prototype.onToLogin = function () {
        this.sp_registerBox.visible = false;
    };
    /**点击 注册 */
    WelComeController.prototype.onToRegister = function () {
        ClientSender_1.default.reqUserRegister(this.input_registerUserName.text, this.input_registerUserKey.text, this.input_registerNickName.text);
    };
    /**获取到消息 */
    WelComeController.prototype.onLoginHandler = function (data) {
        console.log(data);
        if (data !== undefined) {
            var text = "登陆成功，进入游戏！";
            if (this.sp_registerBox.visible)
                text = "注册成功，将直接进入游戏！";
            MessageManager_1.default.ins.showFloatMsg(text);
            Laya.timer.once(100, this, this.toGameMain);
        }
    };
    /**连接服务器 */
    WelComeController.prototype.connectServer = function () {
        WebSocketManager_1.default.ins.connect(GameConfig_1.GameConfig.IP, GameConfig_1.GameConfig.PORT);
    };
    //////////////////////////////////////////////////////////
    WelComeController.prototype.toGameMain = function () {
        //TO DO 跳转至游戏大厅
        Laya.Scene.open("GameLobby/GameLobby.scene");
    };
    return WelComeController;
}(layaMaxUI_1.ui.Welcome.LoginUI));
exports.default = WelComeController;
