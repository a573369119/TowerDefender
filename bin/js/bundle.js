var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"../../Core/Const/GameConfig":9,"../../Core/Net/WebSocketManager":15,"../../ui/layaMaxUI":22,"../GameLobby/handler/MatchHandler":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketHandler_1 = require("../../../Core/Net/SocketHandler");
var WebSocketManager_1 = require("../../../Core/Net/WebSocketManager");
/**
 * 请求匹配对局
 */
var MatchHandler = /** @class */ (function (_super) {
    __extends(MatchHandler, _super);
    function MatchHandler(caller, callback) {
        if (callback === void 0) { callback = null; }
        return _super.call(this, caller, callback) || this;
    }
    MatchHandler.prototype.explain = function (data) {
        var ResMatchInfo = WebSocketManager_1.default.ins.defineProtoClass("ResMatchInfo");
        var message = ResMatchInfo.decode(data);
        _super.prototype.explain.call(this, message);
    };
    /**处理数据 */
    MatchHandler.prototype.success = function (message) {
        _super.prototype.success.call(this, message);
    };
    return MatchHandler;
}(SocketHandler_1.default));
exports.default = MatchHandler;
},{"../../../Core/Net/SocketHandler":14,"../../../Core/Net/WebSocketManager":15}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var GrassFactory_1 = require("./GrassFactory");
var GameController = /** @class */ (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        var _this = _super.call(this) || this;
        _this.redFac = new GrassFactory_1.default("red", _this.game);
        _this.blueFac = new GrassFactory_1.default("blue", _this.game);
        return _this;
    }
    GameController.prototype.onEnable = function () {
        this.camp = "red";
        Laya.timer.frameLoop(1, this, this.mapMove);
    };
    /**地图移动 */
    GameController.prototype.mapMove = function () {
        this.game.x -= 4;
        if (this.game.x <= -1214) {
            this.game.x = -1214;
            Laya.timer.clear(this, this.mapMove);
            Laya.timer.frameOnce(60, this, this.resumePos);
        }
    };
    /**回到玩家位置 */
    GameController.prototype.resumePos = function () {
        if (this.camp == "blue") {
            this.game.x = -1230;
            this.myFac = this.blueFac;
        }
        else {
            this.game.x = 0;
            this.myFac = this.redFac;
        }
        this.MenuItem.visible = true;
        this.isUseShovel = false;
        this.addEvents();
        //this.isCickGrass();
    };
    /**事件绑定 */
    GameController.prototype.addEvents = function () {
        //Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        //Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN, this, this.onShovelDown);
    };
    GameController.prototype.check = function () {
        console.log("是否可注册");
    };
    /*******************************************鼠标事件 **************************************/
    /**鼠标按下 */
    GameController.prototype.onMouseDown = function () {
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        if (!this.isUseShovel) {
            this.lastMousePosX = Laya.stage.mouseX;
        }
    };
    /**鼠标移动 */
    GameController.prototype.onMouseMove = function () {
        //如果没有用铲子，则可拉动地图
        if (!this.isUseShovel) {
            if (Laya.stage.mouseX < this.lastMousePosX) {
                this.game.x -= 20;
                this.lastMousePosX = Laya.stage.mouseX;
            }
            else if (Laya.stage.mouseX > this.lastMousePosX) {
                this.game.x += 20;
                this.lastMousePosX = Laya.stage.mouseX;
            }
            if (this.game.x >= 0) {
                this.game.x = 0;
            }
            else if (this.game.x <= -1214) {
                this.game.x = -1214;
            }
        }
    };
    /**鼠标抬起 */
    GameController.prototype.onMouseUp = function () {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    };
    /*********************************************************************************/
    /**点击铲子框拾起铲子 */
    GameController.prototype.onShovelDown = function () {
        this.isUseShovel = !this.isUseShovel;
        this.shovel_off.visible = !this.shovel_off.visible;
        this.shovel_on.visible = !this.shovel_on.visible;
        //this.isCickGrass();
    };
    /**判断草坪块是否可点击 */
    GameController.prototype.isCickGrass = function () {
        /*for(let i=0;i<this.myFac.grassArray.length;i++)
        {
            //收起铲子就不能点击草坪块，相反则可
            if(this.isUseShovel)
            {
                this.myFac.grassArray[i].sp.mouseEnabled=true;
            }
            else
            {
                this.myFac.grassArray[i].sp.mouseEnabled=false;
            }
        }*/
    };
    return GameController;
}(layaMaxUI_1.ui.Game.GameUI));
exports.default = GameController;
},{"../../ui/layaMaxUI":22,"./GrassFactory":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grass = /** @class */ (function () {
    function Grass(num, view) {
        this.init(num, view);
    }
    /**初始化 */
    Grass.prototype.init = function (num, view) {
        this.num = num;
        this.isMud = false;
        this.sp = new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass" + num + ".png"));
        view.addChild(this.sp);
        this.sp.autoSize = true;
    };
    /**转换状态，标记是否为土块 */
    Grass.prototype.changeImg = function () {
        console.log("有没有效果");
        this.sp.graphics.clear();
        if (!this.isMud) {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/mud.png"));
            this.isMud = true;
        }
        else {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass" + this.num + ".png"));
            this.isMud = false;
        }
    };
    return Grass;
}());
exports.default = Grass;
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grass_1 = require("./Grass");
var GrassFactory = /** @class */ (function () {
    function GrassFactory(camp, view) {
        Laya.loader.load(["game/grass1.png", "game/grass2.png", "game/mud.png"], Laya.Handler.create(this, this.createGrassArray, [camp, view]));
    }
    /**生成草坪 */
    GrassFactory.prototype.createGrassArray = function (camp, view) {
        this.grassArray = new Array();
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 10; j++) {
                var grass = void 0;
                if (i % 2 == 0) {
                    grass = new Grass_1.default(j % 2 + 1, view);
                }
                else {
                    grass = new Grass_1.default((j + 1) % 2 + 1, view);
                }
                this.grassArray.push(grass);
                if (camp == "red") {
                    grass.sp.pos(120 + 100 * j, 25 + 100 * i);
                }
                else {
                    grass.sp.pos(1759 + 100 * j, 25 + 100 * i);
                }
                grass.on(Laya.Event.CLICK, this, this.check);
            }
        }
    };
    GrassFactory.prototype.check = function () {
        console.log("有没有效果");
    };
    return GrassFactory;
}());
exports.default = GrassFactory;
},{"./Grass":4}],6:[function(require,module,exports){
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
            { url: "res/atlas/game.atlas" }
        ];
        Laya.loader.load(src, Laya.Handler.create(this, this.onLoad), Laya.Handler.create(this, this.onProcess));
        this.onLoad();
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
},{"../../ui/layaMaxUI":22}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var WebSocketManager_1 = require("../../Core/Net/WebSocketManager");
var GameConfig_1 = require("../../Core/Const/GameConfig");
var UserLoginHandler_1 = require("./handler/UserLoginHandler");
var ClientSender_1 = require("../../Core/Net/ClientSender");
var Tool_1 = require("../../Tool/Tool");
var MessageManager_1 = require("../../Core/MessageManager");
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
            { url: "unpackage/welcome/boximg.png" }
        ];
        Laya.loader.load(src, Laya.Handler.create(this, this.onLoad), Laya.Handler.create(this, this.onProcess));
        this.onLoad();
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
},{"../../Core/Const/GameConfig":9,"../../Core/MessageManager":10,"../../Core/Net/ClientSender":11,"../../Core/Net/WebSocketManager":15,"../../Tool/Tool":21,"../../ui/layaMaxUI":22,"./handler/UserLoginHandler":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketHandler_1 = require("../../../Core/Net/SocketHandler");
var WebSocketManager_1 = require("../../../Core/Net/WebSocketManager");
/**
 * 用户登陆请求 返回处理
 */
var UserLoginHandler = /** @class */ (function (_super) {
    __extends(UserLoginHandler, _super);
    function UserLoginHandler(caller, callback) {
        if (callback === void 0) { callback = null; }
        return _super.call(this, caller, callback) || this;
    }
    UserLoginHandler.prototype.explain = function (data) {
        var ResUserLogin = WebSocketManager_1.default.ins.defineProtoClass("ResUserLogin");
        var message = ResUserLogin.decode(data);
        _super.prototype.explain.call(this, message);
    };
    /**处理数据 */
    UserLoginHandler.prototype.success = function (message) {
        _super.prototype.success.call(this, message);
    };
    return UserLoginHandler;
}(SocketHandler_1.default));
exports.default = UserLoginHandler;
},{"../../../Core/Net/SocketHandler":14,"../../../Core/Net/WebSocketManager":15}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 游戏配置
*/
var GameConfig = /** @class */ (function () {
    // /**ip - 本地测试*/
    // public static IP : string = "127.0.0.1";
    // /**端口 - 本地测试*/
    // public static PORT : number = 7777;
    function GameConfig() {
    }
    /**ip*/
    GameConfig.IP = "47.107.169.244";
    /**端口 */
    GameConfig.PORT = 7777;
    return GameConfig;
}());
exports.GameConfig = GameConfig;
/**协议 */
var Protocol = /** @class */ (function () {
    function Protocol() {
    }
    // //************gmMessage.proto
    // /**发送GM密令 */
    // public static REQ_GM_COM:number = 199101;
    // //************userMessage.proto
    // /**注册 202102*/
    // public static REQ_USER_REGISTER:number = 202102;
    // /**登录请求 202103*/
    // public static REQ_USER_LOGIN:number = 202103;
    // /**服务器返回************* */
    // /**登录返回 202201*/
    // public static RESP_USER_LOGIN:number = 202201;
    // /**服务器列表 202203*/
    // public static RESP_SERVER_LIST:number = 202203;
    // /**公告面板 202204*/
    // public static RESP_NOTICE_BOARD:number = 202204;
    // //************loginMessage.proto
    // /**服务器登录请求 */
    // public static REQ_SERV_LOGIN:number = 101101;
    // /**心跳包请求 */
    // public static REQ_SERV_HERT:number = 101102;
    // /**请求角色信息 */
    // public static REQ_CREATE_PLAYER:number = 101103;
    // /**服务器返回************* */
    // /**心跳返回 */
    // public static RESP_SERV_HERT:number = 101201;
    // /**返回登录错误消息 */
    // public static RESP_SERV_ERROR:number = 101202;
    // /**返回被顶下线 */
    // public static RESP_SUBSTITUTE:number = 101203;
    //****************UserProto.proto
    /**请求 msgId = 101103 */
    Protocol.REQ_USER_LOGIN = 101103;
    /**101104 注册请求 */
    Protocol.REQ_USER_REGISTER = 101104;
    /**响应 msgId = 101203 */
    Protocol.RES_USER_LOGIN = 101203;
    /**请求匹配对局102101 */
    Protocol.REQ_MATCH = 102101;
    /**请求 对局接受102102 */
    Protocol.REQ_MATCH_ACCEPT = 102102;
    /**响应 返回匹配信息 只发送一次msgId = 102201 */
    Protocol.RES_MATCH_INFO = 102201;
    /**响应 返回对局接受消息msgId = 10202 */
    Protocol.RES_MATCH_ACCEPT_INFO = 10202;
    return Protocol;
}());
exports.Protocol = Protocol;
},{}],10:[function(require,module,exports){
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
},{"../Tool/FloatMsg":20,"../Tool/Tool":21}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketManager_1 = require("./WebSocketManager");
var GameConfig_1 = require("../Const/GameConfig");
/*
* 客户端发送器
*/
var ClientSender = /** @class */ (function () {
    function ClientSender() {
    }
    /**
    * 用户登录 101103
    * @param userName
    * @param userPass
    */
    ClientSender.reqUserLogin = function (userName, userKey) {
        var ReqUserLogin = WebSocketManager_1.default.ins.defineProtoClass("ReqUserLogin");
        var message = {};
        message.userName = userName;
        message.userKey = userKey;
        var buffer = ReqUserLogin.encode(message).finish();
        WebSocketManager_1.default.ins.sendMsg(GameConfig_1.Protocol.REQ_USER_LOGIN, buffer);
    };
    /**
     * 用户注册 101104
     * @param userName
    * @param userPass
    * @param userNickName
    */
    ClientSender.reqUserRegister = function (userName, userKey, userNickName) {
        var ReqUserRegister = WebSocketManager_1.default.ins.defineProtoClass("ReqUserRegister");
        var message = {};
        var userData = {};
        message.userName = userName;
        message.userKey = userKey;
        userData.nickName = userNickName;
        userData.lv = 1;
        message.userData = userData;
        var buffer = ReqUserRegister.encode(message).finish();
        WebSocketManager_1.default.ins.sendMsg(GameConfig_1.Protocol.REQ_USER_REGISTER, buffer);
    };
    /**
     * 请求匹配对局 102101
     * @param userId
    * @param matchId
    */
    ClientSender.reqMatch = function (userId, matchId) {
        var ReqMatch = WebSocketManager_1.default.ins.defineProtoClass("ReqMatch");
        var message = {};
        message.userId = userId;
        message.matchId = matchId;
        var buffer = ReqMatch.encode(message).finish();
        WebSocketManager_1.default.ins.sendMsg(GameConfig_1.Protocol.REQ_MATCH, buffer);
    };
    /**
      * 请求 对局接受 返回102202
      * @param userId
     * @param isAccepte
     */
    ClientSender.reqMatchAccept = function (userId, isAccepte) {
        var ReqMatchAccept = WebSocketManager_1.default.ins.defineProtoClass("ReqMatchAccept");
        var message = {};
        message.userId = userId;
        message.isAccepte = isAccepte;
        var buffer = ReqMatchAccept.encode(message).finish();
        WebSocketManager_1.default.ins.sendMsg(GameConfig_1.Protocol.REQ_MATCH_ACCEPT, buffer);
    };
    return ClientSender;
}());
exports.default = ClientSender;
},{"../Const/GameConfig":9,"./WebSocketManager":15}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 包解析
*/
var PackageIn = /** @class */ (function (_super) {
    __extends(PackageIn, _super);
    function PackageIn() {
        return _super.call(this) || this;
    }
    // public read(msg:Object = null):void
    // {
    //     this.endian = Laya.Byte.BIG_ENDIAN;//设置endian；
    //     this.clear();
    //     this.writeArrayBuffer(msg);
    //     this.pos = 0;
    //     //标记和长度
    //     var mark = this.getInt16();
    //     var len = this.getInt32();
    //     //包头
    //     this.module = this.getInt32();
    //     this.cmd = this.getInt32();
    //     var type = this.getByte();
    //     var format = this.getByte();
    //     //数据
    //     var tempByte = this.buffer.slice(this.pos);
    //     this.body = new Uint8Array(tempByte);
    // }
    //新通信
    // public read(msg:Object = null):void
    // {
    //     this.endian = Laya.Byte.BIG_ENDIAN;//设置endian；
    //     this.clear();
    //     this.writeArrayBuffer(msg);
    //     this.pos = 0;
    //     var len = this.getInt32();
    //     this.cmd = this.getInt32();
    //     //数据
    //     var tempByte = this.buffer.slice(this.pos);
    //     this.body = new Uint8Array(tempByte);
    // }
    //新通信 粘包处理
    PackageIn.prototype.read = function (buffData) {
        this.endian = Laya.Byte.BIG_ENDIAN; //设置endian；
        this.clear();
        this.writeArrayBuffer(buffData);
        this.pos = 0;
        var len = this.getInt32();
        this.cmd = this.getInt32();
        //数据
        var tempByte = this.buffer.slice(this.pos);
        this.body = new Uint8Array(tempByte);
    };
    return PackageIn;
}(Laya.Byte));
exports.default = PackageIn;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocketManager_1 = require("./WebSocketManager");
/*
* 打包
*/
var PackageOut = /** @class */ (function (_super) {
    __extends(PackageOut, _super);
    function PackageOut() {
        return _super.call(this) || this;
    }
    // public pack(module,cmd,data?:any):void
    // {
    //     this.endian = Laya.Byte.BIG_ENDIAN;//设置endian；
    //     this.module = module;
    //     this.cmd = cmd;
    //     this.writeInt16(this.PACKET_MARK);
    //     this.writeInt32(data.byteLength + 10);
    //     //包头
    //     this.writeInt32(this.module);
    //     this.writeInt32(this.cmd);
    //     this.writeByte(this.type);
    //     this.writeByte(this.formart);
    //     //消息体
    //     if(data)
    //     {
    //         this.writeArrayBuffer(data);
    //     }
    // }
    /**新通信 */
    PackageOut.prototype.pack = function (cmd, data) {
        this.endian = Laya.Byte.BIG_ENDIAN; //设置endian；
        this.cmd = cmd;
        var len = (data ? data.byteLength : 0) + 12;
        var code = WebSocketManager_1.default.codeCount ^ len ^ 512;
        this.writeInt32(len);
        console.log();
        this.writeInt32(code);
        this.writeInt32(this.cmd);
        if (data) {
            this.writeArrayBuffer(data);
        }
        WebSocketManager_1.default.codeCount++;
    };
    return PackageOut;
}(Laya.Byte));
exports.default = PackageOut;
},{"./WebSocketManager":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 数据处理Hanlder
*/
var SocketHandler = /** @class */ (function () {
    function SocketHandler(caller, callback) {
        this.caller = caller;
        this.callBack = callback;
    }
    SocketHandler.prototype.explain = function (data) {
        // var statusCode = data.statusCode;
        // if(statusCode == 0)
        // {
        //     this.success(data);
        // }
        // else
        // {
        //     console.log("服务器返回：",data.statusCode);
        // }
        this.success(data);
    };
    SocketHandler.prototype.success = function (data) {
        if (this.caller && this.callBack) {
            if (data) {
                this.callBack.call(this.caller, data);
            }
            else {
                this.callBack.call(this.caller);
            }
        }
    };
    return SocketHandler;
}());
exports.default = SocketHandler;
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dictionary_1 = require("../../Tool/Dictionary");
var PackageIn_1 = require("./PackageIn");
var PackageOut_1 = require("./PackageOut");
/**
 * socket中心
 */
var WebSocketManager = /** @class */ (function () {
    function WebSocketManager() {
        this.socketHanlderDic = new Dictionary_1.default();
    }
    Object.defineProperty(WebSocketManager, "ins", {
        get: function () {
            if (this._ins == null) {
                this._ins = new WebSocketManager();
            }
            return this._ins;
        },
        enumerable: true,
        configurable: true
    });
    WebSocketManager.prototype.connect = function (ip, port) {
        this.ip = ip;
        this.port = port;
        this.webSocket = new Laya.Socket();
        this.webSocket.on(Laya.Event.OPEN, this, this.webSocketOpen);
        this.webSocket.on(Laya.Event.MESSAGE, this, this.webSocketMessage);
        this.webSocket.on(Laya.Event.CLOSE, this, this.webSocketClose);
        this.webSocket.on(Laya.Event.ERROR, this, this.webSocketError);
        //加载协议
        if (!this.protoRoot) {
            var protoBufUrls = ["outside/proto/UserProto.proto", "outside/proto/MatchProto.proto"];
            Laya.Browser.window.protobuf.load(protoBufUrls, this.protoLoadComplete);
        }
        else {
            this.webSocket.connectByUrl("ws://" + this.ip + ":" + this.port);
        }
    };
    /**关闭websocket */
    WebSocketManager.prototype.closeSocket = function () {
        if (this.webSocket) {
            this.webSocket.off(Laya.Event.OPEN, this, this.webSocketOpen);
            this.webSocket.off(Laya.Event.MESSAGE, this, this.webSocketMessage);
            this.webSocket.off(Laya.Event.CLOSE, this, this.webSocketClose);
            this.webSocket.off(Laya.Event.ERROR, this, this.webSocketError);
            this.webSocket.close();
            this.webSocket = null;
        }
    };
    WebSocketManager.prototype.protoLoadComplete = function (error, root) {
        WebSocketManager.ins.protoRoot = root;
        WebSocketManager.ins.webSocket.connectByUrl("ws://" + WebSocketManager.ins.ip + ":" + WebSocketManager.ins.port);
    };
    WebSocketManager.prototype.webSocketOpen = function () {
        console.log("websocket open...");
        this.byteBuffData = new Laya.Byte();
        this.byteBuffData.endian = Laya.Byte.BIG_ENDIAN; //设置endian;
        this.tempByte = new Laya.Byte();
        this.tempByte.endian = Laya.Byte.BIG_ENDIAN;
        WebSocketManager.codeCount = 1;
        //    EventManager.ins.dispatchEvent(EventManager.SERVER_CONNECTED);暂时不需要获取服务器列表
    };
    WebSocketManager.prototype.parsePackageData = function (packLen) {
        //完整包
        this.tempByte.clear();
        this.tempByte.writeArrayBuffer(this.byteBuffData.buffer, 0, packLen);
        this.tempByte.pos = 0;
        //断包处理
        this.byteBuffData = new Laya.Byte(this.byteBuffData.getUint8Array(packLen, this.byteBuffData.length));
        // this.byteBuffData.writeArrayBuffer(this.byteBuffData.buffer,packLen,this.byteBuffData.length);
        this.byteBuffData.endian = Laya.Byte.BIG_ENDIAN; //设置endian;
        //解析包
        var packageIn = new PackageIn_1.default();
        // var buff = this.tempByte.buffer.slice(0,this.tempByte.length);
        packageIn.read(this.tempByte.buffer);
        console.log("websocket msg...", packageIn.cmd, this.tempByte.length);
        if (packageIn.cmd == 105202) {
            console.log("");
        }
        var key = "" + packageIn.cmd;
        var handlers = this.socketHanlderDic.get(key);
        if (handlers && handlers.length > 0) {
            for (var i = handlers.length - 1; i >= 0; i--) {
                handlers[i].explain(packageIn.body);
            }
            // handlers.forEach(socketHanlder => {
            //     socketHanlder.explain(packageIn.body);
            // });
        }
        //递归检测是否有完整包
        if (this.byteBuffData.length > 4) {
            this.tempByte.clear();
            this.tempByte.writeArrayBuffer(this.byteBuffData.buffer, 0, 4);
            this.tempByte.pos = 0;
            packLen = this.tempByte.getInt32() + 4;
            if (this.byteBuffData.length >= packLen) {
                this.parsePackageData(packLen);
            }
        }
    };
    /**解析空包 */
    WebSocketManager.prototype.parseNullPackage = function (cmd) {
        var key = "" + cmd;
        var handlers = this.socketHanlderDic.get(key);
        if (handlers) {
            handlers.forEach(function (socketHanlder) {
                socketHanlder.explain();
            });
        }
    };
    WebSocketManager.prototype.webSocketMessage = function (data) {
        this.tempByte = new Laya.Byte(data);
        this.tempByte.endian = Laya.Byte.BIG_ENDIAN;
        // console.log(".....testweb",this.tempByte.pos);
        if (this.tempByte.length > 4) {
            if (this.tempByte.getInt32() == 4) //空包
             {
                var cmd = this.tempByte.getInt32();
                this.parseNullPackage(cmd);
                console.log("空包................" + cmd);
                return;
            }
        }
        this.byteBuffData.writeArrayBuffer(data, 0, data.byteLength);
        // console.log("字节总长度................"+this.byteBuffData.length);
        if (this.byteBuffData.length > 4) {
            this.tempByte.clear();
            this.tempByte.writeArrayBuffer(this.byteBuffData.buffer, 0, 4);
            this.tempByte.pos = 0;
            var packLen = this.tempByte.getInt32() + 4;
            if (this.byteBuffData.length >= packLen) {
                this.parsePackageData(packLen);
            }
        }
        // var packageIn:PackageIn = new PackageIn();
        // packageIn.read(data);
        // console.log("websocket msg...",packageIn.cmd);
        // var key:string = ""+ packageIn.cmd;
        // var handlers = this.socketHanlderDic.get(key);
        // handlers.forEach(socketHanlder => {
        //     socketHanlder.explain(packageIn.body);
        // });
    };
    WebSocketManager.prototype.webSocketClose = function () {
        console.log("websocket close...");
    };
    WebSocketManager.prototype.webSocketError = function () {
        console.log("websocket error...");
    };
    /**
     * 发送消息
     * @param cmd
     * @param data
     */
    WebSocketManager.prototype.sendMsg = function (cmd, data) {
        console.log("websocket req..." + cmd);
        var packageOut = new PackageOut_1.default();
        // packageOut.pack(module,cmd,data);
        packageOut.pack(cmd, data);
        this.webSocket.send(packageOut.buffer);
    };
    /**
     * 定义protobuf类
     * @param protoType 协议模块类型
     * @param classStr 类
     */
    WebSocketManager.prototype.defineProtoClass = function (classStr) {
        return this.protoRoot.lookup(classStr);
    };
    /**注册 */
    WebSocketManager.prototype.registerHandler = function (cmd, handler) {
        // var key:string = protocol+"_"+cmd;
        var key = "" + cmd;
        var handlers = this.socketHanlderDic.get(key);
        if (!handlers) {
            handlers = [];
            handlers.push(handler);
            this.socketHanlderDic.set(key, handlers);
        }
        else {
            handlers.push(handler);
        }
    };
    /**删除 */
    WebSocketManager.prototype.unregisterHandler = function (cmd, caller) {
        var key = "" + cmd;
        var handlers = this.socketHanlderDic.get(key);
        if (handlers) {
            var handler;
            for (var i = handlers.length - 1; i >= 0; i--) {
                handler = handlers[i];
                if (handler.caller === caller) {
                    handlers.splice(i, 1);
                }
            }
            if (handlers.length == 0) {
                this.socketHanlderDic.remove(key);
            }
        }
    };
    /**添加服务器心跳 */
    WebSocketManager.prototype.addHertReq = function () {
        //    this.registerHandler(Protocol.RESP_SERV_HERT,new ServerHeartHandler(this));
        //    ClientSender.servHeartReq();
        //    Laya.timer.loop(10000,this,function():void{
        //        ClientSender.servHeartReq();
        //    });
    };
    WebSocketManager.prototype.removeHeartReq = function () {
        //    this.unregisterHandler(Protocol.RESP_SERV_HERT,this);
        //    Laya.timer.clearAll(this);
    };
    /**通信code次数 */
    WebSocketManager.codeCount = 0;
    WebSocketManager._ins = null;
    return WebSocketManager;
}());
exports.default = WebSocketManager;
},{"../../Tool/Dictionary":19,"./PackageIn":12,"./PackageOut":13}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var GameController_1 = require("./Controller/Game/GameController");
var GameLobbyController_1 = require("./Controller/GameLobby/GameLobbyController");
var LoadingController_1 = require("./Controller/Loading/LoadingController");
var WelComeController_1 = require("./Controller/WelCome/WelComeController");
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
        reg("Controller/Game/GameController.ts", GameController_1.default);
        reg("Controller/GameLobby/GameLobbyController.ts", GameLobbyController_1.default);
        reg("Controller/Loading/LoadingController.ts", LoadingController_1.default);
        reg("Controller/WelCome/WelComeController.ts", WelComeController_1.default);
    };
    GameConfig.width = 1440;
    GameConfig.height = 750;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Welcome/Login.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    return GameConfig;
}());
exports.default = GameConfig;
GameConfig.init();
},{"./Controller/Game/GameController":3,"./Controller/GameLobby/GameLobbyController":1,"./Controller/Loading/LoadingController":6,"./Controller/WelCome/WelComeController":7}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
/**
 * 游戏入口
 */
var GameEnter = /** @class */ (function () {
    //
    function GameEnter() {
        this.init();
    }
    /**初始化 */
    GameEnter.prototype.init = function () {
        this.load();
    };
    /**资源加载 */
    GameEnter.prototype.load = function () {
        var asseteArr = [
            { url: "unpackage/welcome_bg.png" },
            { url: "Welcome/loginbox.png" },
            { url: "Welcome/progressBg.png" },
            { url: "res/atlas/comp.atlas" },
            { url: "res/atlas/welcome.atlas" }
        ];
        Laya.loader.load(asseteArr, Laya.Handler.create(this, this.onload));
    };
    GameEnter.prototype.onload = function () {
        GameConfig_1.default.startScene && Laya.Scene.open(GameConfig_1.default.startScene);
    };
    return GameEnter;
}());
exports.default = GameEnter;
},{"./GameConfig":16}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameConfig_1 = require("./GameConfig");
var GameEnter_1 = require("./GameEnter");
var Main = /** @class */ (function () {
    function Main() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"])
            Laya3D.init(GameConfig_1.default.width, GameConfig_1.default.height);
        else
            Laya.init(GameConfig_1.default.width, GameConfig_1.default.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig_1.default.scaleMode;
        Laya.stage.screenMode = GameConfig_1.default.screenMode;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig_1.default.exportSceneToJson;
        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig_1.default.debug || Laya.Utils.getQueryString("debug") == "true")
            Laya.enableDebugPanel();
        if (GameConfig_1.default.physicsDebug && Laya["PhysicsDebugDraw"])
            Laya["PhysicsDebugDraw"].enable();
        if (GameConfig_1.default.stat)
            Laya.Stat.show();
        Laya.alertGlobalError = true;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    }
    Main.prototype.onVersionLoaded = function () {
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    };
    Main.prototype.onConfigLoaded = function () {
        new GameEnter_1.default();
        //加载IDE指定的场景
    };
    return Main;
}());
//激活启动类
new Main();
},{"./GameConfig":16,"./GameEnter":17}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
    * 词典 key-value
    *
    *
    *  keys : Array
    *  [read-only] 获取所有的子元素键名列表。
    *  Dictionary
    *
    *  values : Array
    *  [read-only] 获取所有的子元素列表。
    *  Dictionary
    *  Public Methods
    *
    *
    *  clear():void
    *  清除此对象的键名列表和键值列表。
    *  Dictionary
    *
    *  get(key:*):*
    *  返回指定键名的值。
    *  Dictionary
    *
    *  indexOf(key:Object):int
    *  获取指定对象的键名索引。
    *  Dictionary
    *
    *  remove(key:*):Boolean
    *  移除指定键名的值。
    *  Dictionary
    *
    *  set(key:*, value:*):void
    *  给指定的键名设置值。
 */
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this.keys = new Array();
        this.values = new Array();
    }
    /**设置 键名 - 键值 */
    Dictionary.prototype.set = function (key, value) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === undefined) {
                this.keys[i] = key;
                this.values[i] = value;
                return;
            }
        }
        this.keys.push(key);
        this.values.push(value);
        console.log("【Dictionary】 - 插入key[" + key + "]");
        console.log("value", value);
    };
    /**通过 键名key 获取键值value  */
    Dictionary.prototype.get = function (key) {
        // this.getDicList(); 
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === key) {
                return this.values[i];
            }
        }
        console.log("【Dictionary】 - 词典中没有key的值");
    };
    /**获取对象的索引值 */
    Dictionary.prototype.indexOf = function (value) {
        for (var i = 0; i < this.values.length; i++) {
            if (this.values[i] === value) {
                return i;
            }
        }
        console.log("【Dictionary】 - 词典中没有该值");
        return undefined;
    };
    /**清除 词典中指定键名的剪 */
    Dictionary.prototype.remove = function (key) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === key) {
                this.keys[i] === undefined;
                this.values[i] === undefined;
                console.log("【Dictionary】 - 移除成功");
            }
        }
        console.log("【Dictionary】 - 移除失败");
    };
    /**清除所有的键 */
    Dictionary.prototype.clear = function () {
        this.keys = [];
        this.values = [];
    };
    /**获取列表 */
    Dictionary.prototype.getDicList = function () {
        for (var i = 0; i < this.keys.length; i++) {
            console.log("【" + i + "】-----------key:" + this.keys[i]);
            console.log("value", this.values[i]);
        }
    };
    /**获取键值数组 */
    Dictionary.prototype.getValuesArr = function () {
        return this.values;
    };
    /**获取键名数组 */
    Dictionary.prototype.getKeysArr = function () {
        return this.keys;
    };
    return Dictionary;
}());
exports.default = Dictionary;
},{}],20:[function(require,module,exports){
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
        this.sp_floatMsg.visible = true;
        this.lab_floatMsg.text = text;
        this.x = pos.x;
        this.y = pos.y;
        this.ani1.play(0, false);
    };
    FloatMsg.prototype.onHidden = function () {
        this.ani1.stop();
        this.sp_floatMsg.visible = false;
        Laya.Pool.recover("FloatMsg", this);
        MessageManager_1.default.ins.countFloatMsg--;
    };
    return FloatMsg;
}(layaMaxUI_1.ui.Dialog_.FloatMsgUI));
exports.default = FloatMsg;
},{"../Core/MessageManager":10,"../ui/layaMaxUI":22}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 小工具
 */
var Tool = /** @class */ (function () {
    function Tool() {
    }
    /**
     * 屏幕水平中心 横坐标
     */
    Tool.getCenterX = function () {
        return 750 / (Laya.Browser.clientHeight / Laya.Browser.clientWidth) / 2; //屏幕宽度
    };
    return Tool;
}());
exports.default = Tool;
},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Scene = Laya.Scene;
var ui;
(function (ui) {
    var Dialog_;
    (function (Dialog_) {
        var FloatMsgUI = /** @class */ (function (_super) {
            __extends(FloatMsgUI, _super);
            function FloatMsgUI() {
                return _super.call(this) || this;
            }
            FloatMsgUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("Dialog_/FloatMsg");
            };
            return FloatMsgUI;
        }(Scene));
        Dialog_.FloatMsgUI = FloatMsgUI;
    })(Dialog_ = ui.Dialog_ || (ui.Dialog_ = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var Game;
    (function (Game) {
        var GameUI = /** @class */ (function (_super) {
            __extends(GameUI, _super);
            function GameUI() {
                return _super.call(this) || this;
            }
            GameUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("Game/Game");
            };
            return GameUI;
        }(Scene));
        Game.GameUI = GameUI;
    })(Game = ui.Game || (ui.Game = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var GameLobby;
    (function (GameLobby) {
        var GameLobbyUI = /** @class */ (function (_super) {
            __extends(GameLobbyUI, _super);
            function GameLobbyUI() {
                return _super.call(this) || this;
            }
            GameLobbyUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("GameLobby/GameLobby");
            };
            return GameLobbyUI;
        }(Scene));
        GameLobby.GameLobbyUI = GameLobbyUI;
    })(GameLobby = ui.GameLobby || (ui.GameLobby = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var PlayerLoadingUI = /** @class */ (function (_super) {
        __extends(PlayerLoadingUI, _super);
        function PlayerLoadingUI() {
            return _super.call(this) || this;
        }
        PlayerLoadingUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.loadScene("PlayerLoading");
        };
        return PlayerLoadingUI;
    }(Scene));
    ui.PlayerLoadingUI = PlayerLoadingUI;
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var Welcome;
    (function (Welcome) {
        var LoginUI = /** @class */ (function (_super) {
            __extends(LoginUI, _super);
            function LoginUI() {
                return _super.call(this) || this;
            }
            LoginUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("Welcome/Login");
            };
            return LoginUI;
        }(Scene));
        Welcome.LoginUI = LoginUI;
    })(Welcome = ui.Welcome || (ui.Welcome = {}));
})(ui = exports.ui || (exports.ui = {}));
},{}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIyLjAvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9HcmFzcy50cyIsInNyYy9Db250cm9sbGVyL0dhbWUvR3Jhc3NGYWN0b3J5LnRzIiwic3JjL0NvbnRyb2xsZXIvTG9hZGluZy9Mb2FkaW5nQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9XZWxDb21lL2hhbmRsZXIvVXNlckxvZ2luSGFuZGxlci50cyIsInNyYy9Db3JlL0NvbnN0L0dhbWVDb25maWcudHMiLCJzcmMvQ29yZS9NZXNzYWdlTWFuYWdlci50cyIsInNyYy9Db3JlL05ldC9DbGllbnRTZW5kZXIudHMiLCJzcmMvQ29yZS9OZXQvUGFja2FnZUluLnRzIiwic3JjL0NvcmUvTmV0L1BhY2thZ2VPdXQudHMiLCJzcmMvQ29yZS9OZXQvU29ja2V0SGFuZGxlci50cyIsInNyYy9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyLnRzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvR2FtZUVudGVyLnRzIiwic3JjL01haW4udHMiLCJzcmMvVG9vbC9EaWN0aW9uYXJ5LnRzIiwic3JjL1Rvb2wvRmxvYXRNc2cudHMiLCJzcmMvVG9vbC9Ub29sLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSxnREFBd0M7QUFD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UyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDTCxjQUFDO1FBQUQsQ0F4QkEsQUF3QkMsQ0F4QjRCLEtBQUssR0F3QmpDO1FBeEJZLGVBQU8sVUF3Qm5CLENBQUE7SUFDTCxDQUFDLEVBMUJnQixPQUFPLEdBQVAsVUFBTyxLQUFQLFVBQU8sUUEwQnZCO0FBQUQsQ0FBQyxFQTFCYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUEwQmYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XHJcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sLCBHYW1lQ29uZmlnIH0gZnJvbSBcIi4uLy4uL0NvcmUvQ29uc3QvR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgTWF0Y2hIYW5kbGVyIGZyb20gXCIuLi9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXJcIjtcclxuaW1wb3J0IENsaWVudFNlbmRlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvQ2xpZW50U2VuZGVyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVMb2JieUNvbnRyb2xsZXIgZXh0ZW5kcyB1aS5HYW1lTG9iYnkuR2FtZUxvYmJ5VUl7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5ZCv5YqoICovXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6ZSA5q+BKi9cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu257uR5a6aICovXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYnRuX1BWUC5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblBWUE1vZGUpO1xyXG4gICAgICAgIHRoaXMuYnRuXzFWMS5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbjFWMSk7XHJcbiAgICAgICAgdGhpcy5idG5fNVY1Lm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uNVY1KTtcclxuICAgICAgICB0aGlzLmJ0bl9iYWNrLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uQmFjayk7XHJcbiAgICAgICAgdGhpcy5idG5fZW50ZXJnYW1lLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uRW50ZXJMb2FkaW5nKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX01BVENIX0lORk8sbmV3IE1hdGNoSGFuZGxlcih0aGlzLHRoaXMub25NYXRjaEhhbmRsZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYnRuX1BWUC5vZmYoTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25QVlBNb2RlKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfSU5GTyx0aGlzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoq54K55Ye76L+b5YWlUFZQ6YCJ5oup55WM6Z2iICovXHJcbiAgICBwcml2YXRlIG9uUFZQTW9kZSgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuTWVudUl0ZW1QYW5lbC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT10cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPluWIsOa2iOaBryAqL1xyXG4gICAgcHJpdmF0ZSBvbk1hdGNoSGFuZGxlcihkYXRhKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhK1wi5Yy56YWN5oiQ5YqfXCIpO1xyXG4gICAgICAgIGlmKGRhdGEgIT09IHVuZGVmaW5lZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsdGhpcyx0aGlzLmNob29zZU1hdGNoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye76YCJ5oupMVYx5qih5byPICovXHJcbiAgICBwcml2YXRlIG9uMVYxKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAvLyBDbGllbnRTZW5kZXIucmVxTWF0Y2goMSwxKTtcclxuICAgICAgIHRoaXMuY2hvb3NlTWF0Y2goKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vpgInmi6k1VjXmqKHlvI8gKi9cclxuICAgIHByaXZhdGUgb241VjUoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vov5Tlm57muLjmiI/lpKfljoUgKi9cclxuICAgIHByaXZhdGUgb25CYWNrKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbVBhbmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9ZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yy56YWN5oiQ5Yqf5by55qGG77yM6YCJ5oup5piv5ZCm6L+b5YWl5ri45oiPICovXHJcbiAgICBwcml2YXRlIGNob29zZU1hdGNoKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuTWF0Y2hpbmdTdWNjZXNzUGFuZWwudmlzaWJsZT10cnVlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9ZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L+b5YWl5ri45oiPICovXHJcbiAgICBwcml2YXRlIG9uRW50ZXJMb2FkaW5nKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuU2NlbmUub3BlbihcIlBsYXllckxvYWRpbmcuc2NlbmVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgIFxyXG59IiwiaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1NvY2tldEhhbmRsZXJcIjtcclxuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDor7fmsYLljLnphY3lr7nlsYBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcclxuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlc01hdGNoSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzTWF0Y2hJbmZvXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc01hdGNoSW5mby5kZWNvZGUoZGF0YSk7XHJcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxyXG4gICAgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IEdyYXNzRmFjdG9yeSBmcm9tIFwiLi9HcmFzc0ZhY3RvcnlcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbnRyb2xsZXIgZXh0ZW5kcyB1aS5HYW1lLkdhbWVVSXtcclxuICAgIC8qKuS4iuasoem8oOagh+W+l+S9jee9riAqL1xyXG4gICAgcHJpdmF0ZSBsYXN0TW91c2VQb3NYOm51bWJlcjtcclxuICAgIC8qKuaYr+WQpuato+WcqOS9v+eUqOmTsuWtkCAqL1xyXG4gICAgcHJpdmF0ZSBpc1VzZVNob3ZlbDpib29sZWFuO1xyXG4gICAgLyoq6Zi16JClICovXHJcbiAgICBwdWJsaWMgY2FtcDpzdHJpbmc7XHJcbiAgICAvKirok53mlrnojYnlnaogKi9cclxuICAgIHByaXZhdGUgYmx1ZUZhYzpHcmFzc0ZhY3Rvcnk7XHJcbiAgICAvKirnuqLmlrnojYnlnaogKi9cclxuICAgIHByaXZhdGUgcmVkRmFjOkdyYXNzRmFjdG9yeTtcclxuICAgIC8qKuW3seaWueiNieWdqiAqL1xyXG4gICAgcHJpdmF0ZSBteUZhYzpHcmFzc0ZhY3Rvcnk7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5yZWRGYWM9bmV3IEdyYXNzRmFjdG9yeShcInJlZFwiLHRoaXMuZ2FtZSk7XHJcbiAgICAgICAgdGhpcy5ibHVlRmFjPW5ldyBHcmFzc0ZhY3RvcnkoXCJibHVlXCIsdGhpcy5nYW1lKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgb25FbmFibGUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jYW1wPVwicmVkXCI7XHJcbiAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMSx0aGlzLHRoaXMubWFwTW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Zyw5Zu+56e75YqoICovXHJcbiAgICBwcml2YXRlIG1hcE1vdmUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICB0aGlzLmdhbWUueC09NDtcclxuICAgICAgIGlmKHRoaXMuZ2FtZS54PD0tMTIxNClcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLmdhbWUueD0tMTIxNDtcclxuICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyKHRoaXMsdGhpcy5tYXBNb3ZlKTtcclxuICAgICAgICAgICBMYXlhLnRpbWVyLmZyYW1lT25jZSg2MCx0aGlzLHRoaXMucmVzdW1lUG9zKTtcclxuICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICAgLyoq5Zue5Yiw546p5a625L2N572uICovXHJcbiAgICBwcml2YXRlIHJlc3VtZVBvcygpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmNhbXA9PVwiYmx1ZVwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLmdhbWUueD0tMTIzMDtcclxuICAgICAgICAgICB0aGlzLm15RmFjPXRoaXMuYmx1ZUZhYztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLmdhbWUueD0wO1xyXG4gICAgICAgICAgIHRoaXMubXlGYWM9dGhpcy5yZWRGYWM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuTWVudUl0ZW0udmlzaWJsZT10cnVlO1xyXG4gICAgICAgIHRoaXMuaXNVc2VTaG92ZWw9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcclxuICAgICAgICAvL3RoaXMuaXNDaWNrR3Jhc3MoKTtcclxuICAgIH0gXHJcbiAgICAgXHJcbiAgICAvKirkuovku7bnu5HlrpogKi9cclxuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy9MYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMub25Nb3VzZURvd24pO1xyXG4gICAgICAgIC8vTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX1VQLHRoaXMsdGhpcy5vbk1vdXNlVXApO1xyXG4gICAgICAgIHRoaXMuc2hvdmVsYmcub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vblNob3ZlbERvd24pO1xyXG4gICAgICAgIFxyXG4gICAgfSBcclxuXHJcbiAgICBjaGVjaygpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIuaYr+WQpuWPr+azqOWGjFwiKTtcclxuICAgIH1cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6byg5qCH5LqL5Lu2ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgLyoq6byg5qCH5oyJ5LiLICovXHJcbiAgICBwcml2YXRlIG9uTW91c2VEb3duKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNVc2VTaG92ZWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKum8oOagh+enu+WKqCAqL1xyXG4gICAgcHJpdmF0ZSBvbk1vdXNlTW92ZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICAvL+WmguaenOayoeacieeUqOmTsuWtkO+8jOWImeWPr+aLieWKqOWcsOWbvlxyXG4gICAgICAgIGlmKCF0aGlzLmlzVXNlU2hvdmVsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoTGF5YS5zdGFnZS5tb3VzZVg8dGhpcy5sYXN0TW91c2VQb3NYKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUueC09MjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihMYXlhLnN0YWdlLm1vdXNlWD50aGlzLmxhc3RNb3VzZVBvc1gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS54Kz0yMDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlUG9zWD1MYXlhLnN0YWdlLm1vdXNlWDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWUueD49MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLng9MDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuZ2FtZS54PD0tMTIxNClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLng9LTEyMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKum8oOagh+aKrOi1tyAqL1xyXG4gICAgcHJpdmF0ZSBvbk1vdXNlVXAoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIC8qKueCueWHu+mTsuWtkOahhuaLvui1t+mTsuWtkCAqL1xyXG4gICAgcHJpdmF0ZSBvblNob3ZlbERvd24oKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pc1VzZVNob3ZlbD0hdGhpcy5pc1VzZVNob3ZlbDtcclxuICAgICAgICB0aGlzLnNob3ZlbF9vZmYudmlzaWJsZT0hdGhpcy5zaG92ZWxfb2ZmLnZpc2libGU7XHJcbiAgICAgICAgdGhpcy5zaG92ZWxfb24udmlzaWJsZT0hdGhpcy5zaG92ZWxfb24udmlzaWJsZTtcclxuICAgICAgICAvL3RoaXMuaXNDaWNrR3Jhc3MoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliKTmlq3ojYnlnarlnZfmmK/lkKblj6/ngrnlh7sgKi9cclxuICAgIHByaXZhdGUgaXNDaWNrR3Jhc3MoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLypmb3IobGV0IGk9MDtpPHRoaXMubXlGYWMuZ3Jhc3NBcnJheS5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/mlLbotbfpk7LlrZDlsLHkuI3og73ngrnlh7vojYnlnarlnZfvvIznm7jlj43liJnlj69cclxuICAgICAgICAgICAgaWYodGhpcy5pc1VzZVNob3ZlbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5teUZhYy5ncmFzc0FycmF5W2ldLnNwLm1vdXNlRW5hYmxlZD10cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5teUZhYy5ncmFzc0FycmF5W2ldLnNwLm1vdXNlRW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0qL1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3Jhc3N7XHJcbiAgICAvKirnsr7ngbUgKi9cclxuICAgIHB1YmxpYyBzcDpMYXlhLlNwcml0ZTtcclxuICAgIC8qKuaYr+WQpuS4uuWcn+Wdl+agh+iusCAqL1xyXG4gICAgcHVibGljIGlzTXVkOmJvb2xlYW47XHJcbiAgICAvKirojYnlnarlm77nsbvlnosgKi9cclxuICAgIHByaXZhdGUgbnVtOm51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG51bTpudW1iZXIsdmlldzpMYXlhLlNwcml0ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmluaXQobnVtLHZpZXcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIneWni+WMliAqL1xyXG4gICAgcHJpdmF0ZSBpbml0KG51bTpudW1iZXIsdmlldzpMYXlhLlNwcml0ZSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubnVtPW51bTtcclxuICAgICAgICB0aGlzLmlzTXVkPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3A9bmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL2dyYXNzXCIrbnVtK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgdmlldy5hZGRDaGlsZCh0aGlzLnNwKTtcclxuICAgICAgICB0aGlzLnNwLmF1dG9TaXplPXRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L2s5o2i54q25oCB77yM5qCH6K6w5piv5ZCm5Li65Zyf5Z2XICovXHJcbiAgICBwdWJsaWMgY2hhbmdlSW1nKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pyJ5rKh5pyJ5pWI5p6cXCIpXHJcbiAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5jbGVhcigpO1xyXG4gICAgICAgIGlmKCF0aGlzLmlzTXVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL211ZC5wbmdcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVkPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9ncmFzc1wiK3RoaXMubnVtK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNdWQ9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBHcmFzcyBmcm9tIFwiLi9HcmFzc1wiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFzc0ZhY3Rvcnkge1xyXG4gICAgLyoq6I2J5Z2q5pWw57uEICovXHJcbiAgICBwdWJsaWMgZ3Jhc3NBcnJheTpBcnJheTxHcmFzcz47XHJcbiAgICBjb25zdHJ1Y3RvcihjYW1wOnN0cmluZyx2aWV3OkxheWEuU3ByaXRlKVxyXG4gICAge1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoW1wiZ2FtZS9ncmFzczEucG5nXCIsXCJnYW1lL2dyYXNzMi5wbmdcIixcImdhbWUvbXVkLnBuZ1wiXSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5jcmVhdGVHcmFzc0FycmF5LFtjYW1wLHZpZXddKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKueUn+aIkOiNieWdqiAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVHcmFzc0FycmF5KGNhbXA6c3RyaW5nLHZpZXc6TGF5YS5TcHJpdGUpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdyYXNzQXJyYXk9bmV3IEFycmF5PEdyYXNzPigpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8NztpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPDEwO2orKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyYXNzO1xyXG4gICAgICAgICAgICAgICAgaWYoaSUyPT0wKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXNzPW5ldyBHcmFzcyhqJTIrMSx2aWV3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcz1uZXcgR3Jhc3MoKGorMSklMisxLHZpZXcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFzc0FycmF5LnB1c2goZ3Jhc3MpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FtcD09XCJyZWRcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcy5zcC5wb3MoMTIwKzEwMCpqLDI1KzEwMCppKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcy5zcC5wb3MoMTc1OSsxMDAqaiwyNSsxMDAqaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBncmFzcy5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5jaGVjayk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2soKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLmnInmsqHmnInmlYjmnpxcIilcclxuICAgIH1cclxufSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uLy4uL3VpL2xheWFNYXhVSVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkaW5nQ29udHJvbGxlciBleHRlbmRzIHVpLlBsYXllckxvYWRpbmdVSXtcclxuICAgIC8qKuaYr+WQpui/nuaOpeS4iuacjeWKoeWZqCAqL1xyXG4gICAgcHJpdmF0ZSBpc0Nvbm5lY3RTZXJ2ZXIgOiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RTZXJ2ZXIgPSBmYWxzZTsgXHJcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L295ri45oiP5Zy65pmv6LWE5rqQICovXHJcbiAgICBwcml2YXRlIGxvYWRBc3NldHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgc3JjID0gW1xyXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL2dhbWUuYXRsYXNcIn1cclxuICAgICAgICBdO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc3JjLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Qcm9jZXNzKSk7XHJcbiAgICAgICAgdGhpcy5vbkxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3ov5vnqIsgKi9cclxuICAgIHByaXZhdGUgb25Qcm9jZXNzKHBybykgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHByb0JveCA9IHRoaXMuc3BfcHJvZ3Jlc3M7XHJcbiAgICAgICAgbGV0IHByb1cgPSB0aGlzLnNwX3Byb2dyZXNzVztcclxuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xyXG4gICAgICAgIHByb1cud2lkdGggPSBwcm9Cb3gud2lkdGgqcHJvO1xyXG4gICAgICAgIHByb0wueCA9IHByb0JveC53aWR0aCpwcm87XHJcbiAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0U2VydmVyKSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+ato+WcqOi/nuaOpeacjeWKoeWZqOKApuKApl1cIjtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+acjeWKoeWZqOi/nuaOpeaIkOWKn11cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3lrozmr5UgKi9cclxuICAgIHByaXZhdGUgb25Mb2FkKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5FbnRlckdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirov5vlhaXmuLjmiI8gKi9cclxuICAgIHByaXZhdGUgRW50ZXJHYW1lKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZS9HYW1lLnNjZW5lXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xuaW1wb3J0IHsgUHJvdG9jb2wsIEdhbWVDb25maWcgfSBmcm9tIFwiLi4vLi4vQ29yZS9Db25zdC9HYW1lQ29uZmlnXCI7XG5pbXBvcnQgVXNlckxvZ2luSGFuZGxlciBmcm9tIFwiLi9oYW5kbGVyL1VzZXJMb2dpbkhhbmRsZXJcIjtcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L0NsaWVudFNlbmRlclwiO1xuaW1wb3J0IFRvb2wgZnJvbSBcIi4uLy4uL1Rvb2wvVG9vbFwiO1xuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlbENvbWVDb250cm9sbGVyIGV4dGVuZHMgdWkuV2VsY29tZS5Mb2dpblVJe1xuICAgIC8qKuaYr+WQpui/nuaOpeS4iuacjeWKoeWZqCAqL1xuICAgIHByaXZhdGUgaXNDb25uZWN0U2VydmVyIDogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8v55Sf5ZG95ZGo5pyfXG4gICAgLyoq5ZCv5YqoICovXG4gICAgb25FbmFibGUoKXtcbiAgICAgICAgdGhpcy5kYXRhSW5pdCgpO1xuICAgICAgICB0aGlzLnNldENlbnRlcigpO1xuICAgICAgICB0aGlzLmxvYWRBc3NldHMoKTtcbiAgICAgICAgdGhpcy5jb25uZWN0U2VydmVyKCk7Ly/ov57mjqXmnI3liqHlmahcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcbiAgICB9XG5cbiAgICAvKirplIDmr4EqL1xuICAgIG9uRGVzdHJveSgpe1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50cygpO1xuICAgIH1cblxuXG4gICAgLy8vLy8vLy8vLy8v6YC76L6RXG4gICAgLyoq5pWw5o2u5Yid5aeL5YyWICovXG4gICAgcHJpdmF0ZSBkYXRhSW5pdCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RTZXJ2ZXIgPSBmYWxzZTsgXG4gICAgfVxuICAgIC8qKuS6i+S7tue7keWumiAqL1xuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmJ0bl9sb2dpbi5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkxvZ2luKTtcbiAgICAgICAgdGhpcy5idG5fcmVnaXN0ZXIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25SZWdpc3Rlcik7XG4gICAgICAgIHRoaXMuYnRuX3RvTG9naW4ub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Ub0xvZ2luKTtcbiAgICAgICAgdGhpcy5idG5fdG9SZWdpc3Rlci5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblRvUmVnaXN0ZXIpXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfVVNFUl9MT0dJTixuZXcgVXNlckxvZ2luSGFuZGxlcih0aGlzLHRoaXMub25Mb2dpbkhhbmRsZXIpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5idG5fbG9naW4ub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uTG9naW4pO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfVVNFUl9MT0dJTix0aGlzKTtcbiAgICB9XG5cbiAgICAvKirlsYDkuK3mmL7npLogKi9cbiAgICBwcml2YXRlIHNldENlbnRlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGNlbnRlciA9IFRvb2wuZ2V0Q2VudGVyWCgpOy8v5bGP5bmV6auY5bqmXG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MueCA9IGNlbnRlcjtcbiAgICAgICAgdGhpcy5zcF9nYW1lTmFtZS54ID0gY2VudGVyO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEFzc2V0cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHNyYyA9IFtcbiAgICAgICAgICAgIHt1cmw6XCJ1bnBhY2thZ2Uvd2VsY29tZS9ib3hpbWcucG5nXCJ9XG4gICAgICAgIF07XG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc3JjLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Qcm9jZXNzKSk7XG4gICAgICAgIHRoaXMub25Mb2FkKCk7XG4gICAgfVxuXG4gICAgLyoq5Yqg6L296L+b56iLICovXG4gICAgcHJpdmF0ZSBvblByb2Nlc3MocHJvKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBwcm9Cb3ggPSB0aGlzLnNwX3Byb2dyZXNzO1xuICAgICAgICBsZXQgcHJvVyA9IHRoaXMuc3BfcHJvZ3Jlc3NXO1xuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xuICAgICAgICBwcm9XLndpZHRoID0gcHJvQm94LndpZHRoKnBybztcbiAgICAgICAgcHJvTC54ID0gcHJvQm94LndpZHRoKnBybztcbiAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0U2VydmVyKSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+ato+WcqOi/nuaOpeacjeWKoeWZqOKApuKApl1cIjtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmnI3liqHlmajov57mjqXmiJDlip9dXCI7XG4gICAgfVxuXG4gICAgLyoq5Yqg6L295a6M5q+VICovXG4gICAgcHJpdmF0ZSBvbkxvYWQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIuWKoOi9veWujOavlei/m+WFpea4uOaIj1wiO1xuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODAwLHRoaXMsdGhpcy5zaG93TG9naW5Cb3gpO1xuICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMubmV3RmxvYXRNc2coKTtcbiAgICB9XG5cbiAgICAvKirmmL7npLrnmbvlvZXmoYYqKi9cbiAgICBwcml2YXRlIHNob3dMb2dpbkJveCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcF9sb2dpbkJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hbmkxLnBsYXkoMCxmYWxzZSk7XG4gICAgICAgIHRoaXMuc3BfZ2FtZU5hbWUueCA9IHRoaXMuc3BfbG9naW5Cb3gud2lkdGggKyB0aGlzLnNwX2dhbWVOYW1lLndpZHRoLzIgKyAxMDA7XG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKueCueWHu+eZu+mZhiAqL1xuICAgIHByaXZhdGUgb25Mb2dpbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLy9DbGllbnRTZW5kZXIucmVxVXNlckxvZ2luKHRoaXMuaW5wdXRfdXNlck5hbWUudGV4dCx0aGlzLmlucHV0X3VzZXJLZXkudGV4dCk7XG4gICAgICAgIExheWEuU2NlbmUub3BlbihcIkdhbWVMb2JieS9HYW1lTG9iYnkuc2NlbmVcIik7XG4gICAgfVxuXG4gICAgLyoq54K55Ye75rOo5YaMICovXG4gICAgcHJpdmF0ZSBvblJlZ2lzdGVyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwX3JlZ2lzdGVyQm94LnZpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKueCueWHuyDlt7LmnInotKblj7cgKi9cbiAgICBwcml2YXRlIG9uVG9Mb2dpbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoq54K55Ye7IOazqOWGjCAqL1xuICAgIHByaXZhdGUgb25Ub1JlZ2lzdGVyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBDbGllbnRTZW5kZXIucmVxVXNlclJlZ2lzdGVyKHRoaXMuaW5wdXRfcmVnaXN0ZXJVc2VyTmFtZS50ZXh0LHRoaXMuaW5wdXRfcmVnaXN0ZXJVc2VyS2V5LnRleHQsdGhpcy5pbnB1dF9yZWdpc3Rlck5pY2tOYW1lLnRleHQpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLyoq6I635Y+W5Yiw5raI5oGvICovXG4gICAgcHJpdmF0ZSBvbkxvZ2luSGFuZGxlcihkYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICBpZihkYXRhICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gXCLnmbvpmYbmiJDlip/vvIzov5vlhaXmuLjmiI/vvIFcIlxuICAgICAgICAgICAgaWYodGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlKSB0ZXh0ID0gXCLms6jlhozmiJDlip/vvIzlsIbnm7TmjqXov5vlhaXmuLjmiI/vvIFcIjtcbiAgICAgICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2codGV4dCk7XG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLHRoaXMsdGhpcy50b0dhbWVNYWluKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKui/nuaOpeacjeWKoeWZqCAqL1xuICAgIHByaXZhdGUgY29ubmVjdFNlcnZlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuY29ubmVjdChHYW1lQ29uZmlnLklQLEdhbWVDb25maWcuUE9SVCk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIHByaXZhdGUgdG9HYW1lTWFpbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLy9UTyBETyDot7Povazoh7PmuLjmiI/lpKfljoVcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZUxvYmJ5L0dhbWVMb2JieS5zY2VuZVwiKTtcbiAgICB9XG59IiwiaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1NvY2tldEhhbmRsZXJcIjtcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5cbi8qKlxuICog55So5oi355m76ZmG6K+35rGCIOi/lOWbnuWkhOeQhlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyTG9naW5IYW5kbGVyIGV4dGVuZHMgU29ja2V0SGFuZGxlcntcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihjYWxsZXI6YW55LGNhbGxiYWNrOkZ1bmN0aW9uID0gbnVsbCl7XG4gICAgICAgIHN1cGVyKGNhbGxlcixjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgIHB1YmxpYyBleHBsYWluKGRhdGEpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXNVc2VyTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlc1VzZXJMb2dpblwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0gUmVzVXNlckxvZ2luLmRlY29kZShkYXRhKTtcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcbiAgICB9XG4gICAgLyoq5aSE55CG5pWw5o2uICovXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxuICAgIHsgICAgICAgICAgICAgICAgXG4gICAgICAgIHN1cGVyLnN1Y2Nlc3MobWVzc2FnZSk7XG4gICAgfVxufVxuICAgICIsIi8qXG4qIOa4uOaIj+mFjee9rlxuKi9cbmV4cG9ydCBjbGFzcyBHYW1lQ29uZmlne1xuICAgIC8qKmlwKi9cbiAgICBwdWJsaWMgc3RhdGljIElQIDogc3RyaW5nID0gXCI0Ny4xMDcuMTY5LjI0NFwiO1xuICAgIC8qKuerr+WPoyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUE9SVCA6IG51bWJlciA9IDc3NzcgIDtcbiAgICAvLyAvKippcCAtIOacrOWcsOa1i+ivlSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBJUCA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCI7XG4gICAgLy8gLyoq56uv5Y+jIC0g5pys5Zyw5rWL6K+VKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFBPUlQgOiBudW1iZXIgPSA3Nzc3O1xuXG4gICAgY29uc3RydWN0b3IoKXtcblxuICAgIH1cbn1cblxuLyoq5Y2P6K6uICovXG5leHBvcnQgY2xhc3MgUHJvdG9jb2x7XG4gICAgLy8gLy8qKioqKioqKioqKipnbU1lc3NhZ2UucHJvdG9cbiAgICAvLyAvKirlj5HpgIFHTeWvhuS7pCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0dNX0NPTTpudW1iZXIgPSAxOTkxMDE7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKnVzZXJNZXNzYWdlLnByb3RvXG4gICAgLy8gLyoq5rOo5YaMIDIwMjEwMiovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9SRUdJU1RFUjpudW1iZXIgPSAyMDIxMDI7XG4gICAgLy8gLyoq55m75b2V6K+35rGCIDIwMjEwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9MT0dJTjpudW1iZXIgPSAyMDIxMDM7XG5cbiAgICAvLyAvKirmnI3liqHlmajov5Tlm54qKioqKioqKioqKioqICovXG4gICAgLy8gLyoq55m75b2V6L+U5ZueIDIwMjIwMSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1VTRVJfTE9HSU46bnVtYmVyID0gMjAyMjAxO1xuICAgIC8vIC8qKuacjeWKoeWZqOWIl+ihqCAyMDIyMDMqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWRVJfTElTVDpudW1iZXIgPSAyMDIyMDM7XG4gICAgLy8gLyoq5YWs5ZGK6Z2i5p2/IDIwMjIwNCovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX05PVElDRV9CT0FSRDpudW1iZXIgPSAyMDIyMDQ7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKmxvZ2luTWVzc2FnZS5wcm90b1xuICAgIC8vIC8qKuacjeWKoeWZqOeZu+W9leivt+axgiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfTE9HSU46bnVtYmVyID0gMTAxMTAxO1xuICAgIC8vIC8qKuW/g+i3s+WMheivt+axgiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfSEVSVDpudW1iZXIgPSAxMDExMDI7XG4gICAgLy8gLyoq6K+35rGC6KeS6Imy5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQ1JFQVRFX1BMQVlFUjpudW1iZXIgPSAxMDExMDM7XG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKuW/g+i3s+i/lOWbniAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0hFUlQ6bnVtYmVyID0gMTAxMjAxO1xuICAgIC8vIC8qKui/lOWbnueZu+W9lemUmeivr+a2iOaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0VSUk9SOm51bWJlciA9IDEwMTIwMjtcbiAgICAvLyAvKirov5Tlm57ooqvpobbkuIvnur8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU1VCU1RJVFVURTpudW1iZXIgPSAxMDEyMDM7XG5cbiAgICAvLyoqKioqKioqKioqKioqKipVc2VyUHJvdG8ucHJvdG9cbiAgICAvKiror7fmsYIgbXNnSWQgPSAxMDExMDMgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX0xPR0lOIDogbnVtYmVyID0gMTAxMTAzO1xuICAgIC8qKjEwMTEwNCDms6jlhozor7fmsYIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX1JFR0lTVEVSIDogbnVtYmVyID0gMTAxMTA0O1xuICAgIC8qKuWTjeW6lCBtc2dJZCA9IDEwMTIwMyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTX1VTRVJfTE9HSU4gOiBudW1iZXIgPSAxMDEyMDM7XG5cbiAgICAvKiror7fmsYLljLnphY3lr7nlsYAxMDIxMDEgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVRDSDpudW1iZXI9MTAyMTAxO1xuICAgIC8qKuivt+axgiDlr7nlsYDmjqXlj5cxMDIxMDIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVRDSF9BQ0NFUFQ6bnVtYmVyPTEwMjEwMjtcbiAgICAvKirlk43lupQg6L+U5Zue5Yy56YWN5L+h5oGvIOWPquWPkemAgeS4gOasoW1zZ0lkID0gMTAyMjAxICovXG4gICAgcHVibGljIHN0YXRpYyBSRVNfTUFUQ0hfSU5GTyA6IG51bWJlciA9IDEwMjIwMTtcbiAgICAvKirlk43lupQg6L+U5Zue5a+55bGA5o6l5Y+X5raI5oGvbXNnSWQgPSAxMDIwMiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTX01BVENIX0FDQ0VQVF9JTkZPIDogbnVtYmVyID0gMTAyMDI7XG4gICAgLy8gLy8qKioqKioqKioqKipwbGF5ZXJNZXNzYWdlLnByb3RvXG4gICAgLy8gLy/or7fmsYJcbiAgICAvLyAvKiror7fmsYLmia3om4sgbXNnSWQ9MTAyMTAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfR0FDSEE6bnVtYmVyID0gMTAyMTAxO1xuXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKueZu+mZhui/lOWbnuinkuiJsuWfuuacrOS/oeaBryAgbXNnSWQ9MTAyMjAxICAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QTEFZRVJfSU5GTzpudW1iZXIgPSAxMDIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5oiQ5YqfICBtc2dJZD0xMDIyMDIgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfU1VDQ0VTUzpudW1iZXIgPSAxMDIyMDI7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5aSx6LSlICBtc2dJZD0xMDIyMDMgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfRkFJTDpudW1iZXIgPSAxMDIyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW5ZCO55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNCAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9FUVVBTDpudW1iZXIgPSAxMDIyMDQ7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNSAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9VUERBVEU6bnVtYmVyID0gMTAyMjA1O1xuICAgIC8vIC8qKui/lOWbnuaJreibiyBtc2dJZD0xMDIyMDYgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0dBQ0hBOm51bWJlciA9IDEwMjIwNjtcblxuICAgIC8vIC8vKioqKioqKioqKioqc2tpbGxNZXNzYWdlLnByb3RvXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLeivt+axgua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKiror7fmsYLmiYDmnInmioDog73kv6Hmga8gbXNnSWQ9MTA3MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MTAxO1xuICAgIC8vIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GSUdIVF9TS0lMTF9MSVNUOm51bWJlciA9IDEwNzEwMjtcbiAgICAvLyAvKiror7fmsYLljYfnuqfmioDog70gbXNnSWQ9MTA3MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVBfU0tJTEw6bnVtYmVyID0gMTA3MTAzO1xuICAgIC8vIC8qKuivt+axgumHjee9ruaKgOiDvSBtc2dJZD0xMDcxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcxMDQ7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9IG1zZ0lkPTEwNzEwNVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0FMVEVSX0dSSURfU0tJTEw6bnVtYmVyID0gMTA3MTA1O1xuXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57miYDmnInmioDog73kv6Hmga8gIG1zZ0lkPTEwNzIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTExfU0tJTExfSU5GTzpudW1iZXIgPSAxMDcyMDE7XG4gICAgLy8gLyoq6L+U5Zue5Ye65oiY5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfRklHSFRfU0tJTExfTElTVDpudW1iZXIgPSAxMDcyMDI7XG4gICAgLy8gLyoq6L+U5Zue5Y2H57qn5oqA6IO9ICBtc2dJZD0xMDcyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVBfU0tJTEw6bnVtYmVyID0gMTA3MjAzO1xuICAgIC8vIC8qKui/lOWbnumHjee9ruaKgOiDveaIkOWKn++8jOWuouaIt+err+aUtuWIsOatpOa2iOaBr++8jOacrOWcsOenu+mZpOWFqOmDqOaKgOiDvSAgbXNnSWQ9MTA3MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNzIwNDtcbiAgICAvLyAvKirov5Tlm57mlLnlj5jmoLzlrZDmioDog70gIG1zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTFRFUl9HUklEX1NLSUxMOm51bWJlciA9IDEwNzIwNTtcblxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogcGV0TWVzc2FnZVxuICAgIC8vIC8qKuivt+axguWuoOeJqeWIneWni+WIm+W7uu+8iOWIm+W7uuinkuiJsuiOt+W+l+WIneWni+WuoOeJqe+8iSBtc2dJZD0xMDUxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDUyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUxMDE7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5LiK6Zi15a6g54mp5L+h5oGvIG1zZ0lkPTEwNTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9BTFRFUl9HUklEOm51bWJlciA9IDEwNTEwMjtcbiAgICAvLyAvKiror7fmsYLlloLlrqDnianlkIPppa0gbXNnSWQ9MTA1MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZFRUQ6bnVtYmVyID0gMTA1MTAzO1xuICAgIC8vIC8qKuivt+axguWuoOeJqeWQiOaIkCBtc2dJZD0xMDUxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQ09NUE9VTkQ6bnVtYmVyID0gMTA1MTA0O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MTA2O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MTA3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MTA4O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjSBtc2dJZD0xMDUxMDlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HOm51bWJlciA9IDEwNTEwOTtcbiAgICAvLyAvKiror7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0VWT0xWRTpudW1iZXIgPSAxMDUxMTA7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9IQVRDSDpudW1iZXIgPSAxMDUxMTE7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTExMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUxMTI7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRVFfTUFUSU5HOm51bWJlciA9IDEwNTExMztcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MTE0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE0IOWmguaenOWuoOeJqeacrOi6q+acieeZu+iusOaVsOaNru+8jOS9hue5geihjeaVsOaNruaJvuS4jeWIsO+8iOi/lOWbnua2iOaBr21zZ0lkPTEwNTIxMuWSjG1zZ0lkPTEwNTIxM+abtOaWsOWuouaIt+err+aVsOaNru+8iSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQUxMSU5GTzpudW1iZXIgPSAxMDUxMTQ7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5p+l55yL6K+35rGC5YiX6KGoIG1zZ0lkPTEwNTExNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1Q6bnVtYmVyID0gMTA1MTE1O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUxMTZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTbvvIzlpoLmnpzmmK/lkIzmhI/vvIzlr7nmlrnnjqnlrrblpoLmnpzlnKjnur/vvIzkvJrmlLbliLBtc2dJZD0xMDUyMTDmtojmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX0NIT09TRTpudW1iZXIgPSAxMDUxMTY7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55uu5qCH5Yi35pawIG1zZ0lkPTEwNTExN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0g6bnVtYmVyID0gMTA1MTE3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX1RBUkdFVF9MT09LOm51bWJlciA9IDEwNTExODtcbiAgICAvLyAvKiror7fmsYLlrqDnianmlL7nlJ8gbXNnSWQ9MTA1MTE5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MTE5O1xuXG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iW1zZ0lkPTEwNTIwMSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9BTExfSU5GTzpudW1iZXIgPSAxMDUyMDE7XG4gICAgLy8gLy8g6L+U5Zue5a6g54mp5qC85a2Q5L+h5oGvIG1zZ0lkPTEwNTIwMlxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfR1JJRF9JTkZPOm51bWJlciA9IDEwNTIwMjtcbiAgICAvLyAvKirov5Tlm57lrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MjAzKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX1JBTkRPTV9DUkVBVEU6bnVtYmVyID0gMTA1MjAzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeetiee6p+WSjOe7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDveetiee6p+WSjOaKgOiDvee7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqeaKgOiDvee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA1O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MjA2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MjA3O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MjA4O1xuXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5Lqk6YWNIG1zZ0lkPTEwNTIwOSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdUOm51bWJlciA9IDEwNTIwOTtcbiAgICAvLyAvKirov5Tlm57lrqDnianlop7liqDnuYHooY3mrKHmlbAgbXNnSWQ9MTA1MjEwICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0FERF9NQVRJTkdfQ09VTlQ6bnVtYmVyID0gMTA1MjEwO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqei/m+WMliBtc2dJZD0xMDUyMTEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfRVZPTFZFOm51bWJlciA9IDEwNTIxMTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MjEyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFR0lTVEVSOm51bWJlciA9IDEwNTIxMjtcbiAgICAvLyAvKirov5Tlm57lrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MjEzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFUV9NQVRJTkc6bnVtYmVyID0gMTA1MjEzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUyMTQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0FMTElORk86bnVtYmVyID0gMTA1MjE0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUyMTUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTIxNTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MjE2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX01BVElOR19DSE9PU0U6bnVtYmVyID0gMTA1MjE2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUyMTcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNIOm51bWJlciA9IDEwNTIxNztcbiAgICAvLyAvKirov5Tlm57lrqDnianmlL7nlJ8gbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MjE4O1xuICAgIFxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogZXF1aXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX01BS0U6bnVtYmVyID0gMTA5MTAxO1xuICAgIC8vIC8qKuivt+axguijheWkh+WIhuinoyBtc2dJZD0xMDkxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9TUExJVDpudW1iZXIgPSAxMDkxMDZcbiAgICAvLyAvKiror7fmsYLoo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTE9DSzpudW1iZXIgPSAxMDkxMDQ7XG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5by65YyWIG1zZ0lkPTEwOTEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0FUVF9BREQ6bnVtYmVyID0gMTA5MTA1O1xuICAgIC8vIC8qKuivt+axguijheWkh+epv+aItCBtc2dJZD0xMDkxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9MT0FESU5HOm51bWJlciA9IDEwOTEwMjtcbiAgICAvLyAvKiror7fmsYLoo4XlpIfljbjovb0gbXNnSWQ9MTA5MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfVU5MT0FESU5HOm51bWJlciA9IDEwOTEwMztcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX01BS0UgPSAxMDkyMDE7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX1NQTElUID0gMTA5MjA2O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+W8uuWMliBtc2dJZD0xMDkyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9BVFRfQUREID0gMTA5MjA1O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+epv+aItCBtc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0FESU5HID0gMTA5MjAyO1xuICAgIC8vIC8qKui/lOWbnuijheWkh+WNuOi9vSBtc2dJZD0xMDkyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9VTkxPQURJTkcgPSAxMDkyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX0xPQ0sgPSAxMDkyMDQ7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBtYXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5pmu6YCa5oiY5paX77yI5a6i5oi356uv5LiA5Zy65oiY5paX57uT5p2f5LmL5ZCO5Y+R6YCB5q2k5raI5oGv77yM5YaN6L+b6KGM5YCS6K6h5pe25ZKM5pys5Zyw5YGH5oiY5paX77yJIG1zZ0lkPTEwNjEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9OT1JNQUxfRklHSFQ6bnVtYmVyID0gMTA2MTAxO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyBtc2dJZD0xMDYxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1BFRURfRklHSFQ6bnVtYmVyID0gMTA2MTA0O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoeaImOaWlyBtc2dJZD0xMDYxMDVcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1dFRVBfRklHSFQ6bnVtYmVyID0gMTA2MTA1O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoei0reS5sOaJq+iNoSBtc2dJZD0xMDYxMDZcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDAwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9CVVlfU1dFRVA6bnVtYmVyID0gMTA2MTA2O1xuICAgIC8vIC8qKuivt+axguWFs+WNoeWBh+aImOaWl+e7k+adn+mihuWPluWlluWKsSBtc2dJZD0xMDYxMDlcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDYyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYxMDk7XG4gICAgLy8gLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVFJVRV9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTAyO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NDRU5FX0ZJR0hUOm51bWJlciA9IDEwNjEwMztcbiAgICAvLyAvKiror7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX0NIQU5HRV9TQ0VORTpudW1iZXIgPSAxMDYxMDg7XG5cblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue56a757q/5ZKM5omr6I2h5pS255uK5L+h5oGvIG1zZ0lkPTEwNjIwMiovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfT0ZGX0xJTkVfQVdBUkRfSU5GTzpudW1iZXIgPSAxMDYyMDI7XG4gICAgLy8gLyoq6L+U5Zue5oiY5paX5pKt5pS+57uT5p2f5Y+R5pS+5aWW5Yqx77yI5bqU55So5LqO5omA5pyJ5oiY5paX77yJIG1zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRklHSFRfRU5EOm51bWJlciA9IDEwNjIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIHBhY2tNZXNzYWdlXG4gICAgLy8gLyoq5L2/55So6YGT5YW35raI5oGvICBtc2dJZD0xMDQxMDEg6L+U5Zue5pON5L2c5oiQ5Yqf5raI5oGvICBtc2dJZD0xMDIyMDIgY29kZT0xMDAwMe+8iOaaguWumu+8jOagueaNruWunumZheS9v+eUqOaViOaenOWGjeWBmu+8iSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFOm51bWJlciA9IDEwNDEwMTtcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6YGT5YW35Y+Y5YyW5L+h5oGvICBtc2dJZD0xMDQyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QUk9QX0lORk86bnVtYmVyID0gMTA0MjAyO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iSAgbXNnSWQ9MTA0MjAxKOacieWPr+iDveS4uuepuuWIl+ihqCkqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BBQ0tfQUxMX0lORk86bnVtYmVyID0gMTA0MjAxO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheWNleS4quijheWkh+WPmOWMluS/oeaBryBtc2dJZD0xMDQyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9JTkZPOm51bWJlciA9IDEwNDIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqKiogZmlnaHRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfT1BFTl9NQUlMOm51bWJlciA9IDExMTEwMTtcbiAgICAvLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0FXQVJEOm51bWJlciA9IDExMTEwMjtcbiAgICAvLyAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0RFTEVURTpudW1iZXIgPSAxMTExMDM7XG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57pgq7ku7bkv6Hmga8gbXNnSWQ9MTExMjAx77yI55m76ZmG5Li75Yqo6L+U5ZueIOaIluiAhSDlj5HnlJ/lj5jljJbov5Tlm57vvIkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0lORk86bnVtYmVyID0gMTExMjAxO1xuICAgIC8vIC8qKui/lOWbnumCruS7tuW3sumihuWPluaIkOWKnyBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0FXQVJEOm51bWJlciA9IDExMTIwMjtcbiAgICAvLyAvKirov5Tlm57liKDpmaTpgq7ku7bmiJDlip8gbXNnSWQ9MTExMjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9ERUxFVEU6bnVtYmVyID0gMTExMjAzO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmaWdodE1lc3NhZ2VcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuS4gOWcuuaImOaWl+aXpeW/lyBtc2dJZD0xMDgyMDEqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1RSVUVfRklHSFRfTE9HX0lORk86bnVtYmVyID0gMTA4MjAxO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmcmllbmRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9QVVNIOm51bWJlciA9IDExMjEwMTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX1NFQVJDSDpudW1iZXIgPSAxMTIxMDI7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BUFBMWTpudW1iZXIgPSAxMTIxMDM7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5pON5L2cIG1zZ0lkPTExMjEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9PUEVSQVRJT046bnVtYmVyID0gMTEyMTA0O1xuICAgIC8vIC8qKuivt+axguWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfTU9SRV9JTkZPOm51bWJlciA9IDExMjEwNTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0dJRlQ6bnVtYmVyID0gMTEyMTA2XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BbGxfSW5mbzpudW1iZXIgPSAxMTIxMDc7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9GSUdIVDpudW1iZXIgPSAxMTIxMDg7XG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWlveWPi+aOqOiNkCBtc2dJZD0xMTIyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pCc57SiIG1zZ0lkPTExMjIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9TRUFSQ0g6bnVtYmVyID0gMTEyMjAyO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+eUs+ivtyBtc2dJZD0xMTIyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfQVBQTFk6bnVtYmVyID0gMTEyMjAzO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+aTjeS9nCBtc2dJZD0xMTIyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjIwNDtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMjA1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX01PUkVfSU5GTzpudW1iZXIgPSAxMTIyMDU7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L6YCB56S8IG1zZ0lkPTExMjIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9HSUZUOm51bWJlciA9IDExMjIwNjtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMjA3ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX0FMTF9JTkZPOm51bWJlciA9IDExMjIwNzsgICAgXG5cbn0iLCJpbXBvcnQgRmxvYXRNc2cgZnJvbSBcIi4uL1Rvb2wvRmxvYXRNc2dcIjtcbmltcG9ydCBUb29sIGZyb20gXCIuLi9Ub29sL1Rvb2xcIjtcblxuLyoqXG4gKiDmtojmga/mmL7npLrnrqHnkIblmahcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZU1hbmFnZXIge1xuICAgIC8qKuWNleS+iyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zIDogTWVzc2FnZU1hbmFnZXIgPSBuZXcgTWVzc2FnZU1hbmFnZXI7XG4gICAgLyoq5bGP5bmV5oul5pyJ55qE5rWu5Yqo5raI5oGv6K6h5pWwKi9cbiAgICBwdWJsaWMgY291bnRGbG9hdE1zZyA6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2cgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa1ruWKqOa2iOaBr+mihOeDrSzvvIzmj5DliY3mlrDlu7rkuIDkuKpmbG9hdFxuICAgICAqL1xuICAgIHB1YmxpYyBuZXdGbG9hdE1zZygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGZsb2F0TXNnID0gbmV3IEZsb2F0TXNnKCk7XG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmxvYXRNc2cpO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsZmxvYXRNc2cpOyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrmta7liqjmtojmga9cbiAgICAgKiBAcGFyYW0gdGV4dCAg5pi+56S65raI5oGvXG4gICAgICovXG4gICAgcHVibGljIHNob3dGbG9hdE1zZyh0ZXh0OnN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgZmxvYXRNc2cgOiBGbG9hdE1zZyA9IExheWEuUG9vbC5nZXRJdGVtKFwiRmxvYXRNc2dcIik7XG4gICAgICAgIGlmKExheWEuUG9vbC5nZXRQb29sQnlTaWduKFwiRmxvYXRNc2dcIikubGVuZ3RoID09IDApIHRoaXMubmV3RmxvYXRNc2coKTtcbiAgICAgICAgaWYoZmxvYXRNc2cgID09PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBmbG9hdE1zZyA9IG5ldyBGbG9hdE1zZygpO1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmbG9hdE1zZyk7ICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBmbG9hdE1zZy56T3JkZXIgPSAxMDAgKyB0aGlzLmNvdW50RmxvYXRNc2c7XG4gICAgICAgIGNvbnNvbGUubG9nKFRvb2wuZ2V0Q2VudGVyWCgpKTtcbiAgICAgICAgZmxvYXRNc2cuc2hvd01zZyh0ZXh0LHt4OlRvb2wuZ2V0Q2VudGVyWCgpICsgdGhpcy5jb3VudEZsb2F0TXNnKjIwLHk6IDM3NSArIHRoaXMuY291bnRGbG9hdE1zZyoyMH0pO1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2crKztcbiAgICB9XG5cbn0iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XG5cbi8qXG4qIOWuouaIt+err+WPkemAgeWZqFxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNlbmRlcntcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgKiDnlKjmiLfnmbvlvZUgMTAxMTAzXG4gICAgKiBAcGFyYW0gdXNlck5hbWUgXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcVVzZXJMb2dpbih1c2VyTmFtZTpzdHJpbmcsdXNlcktleTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJMb2dpblwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbiAgICAgICAgbWVzc2FnZS51c2VyS2V5ID0gdXNlcktleTtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZXJMb2dpbi5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfTE9HSU4sYnVmZmVyKTtcbiAgICB9XG4gICAgXG4gICAgICAgICAgICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfms6jlhowgMTAxMTA0XG4gICAgICogQHBhcmFtIHVzZXJOYW1lIFxuICAgICogQHBhcmFtIHVzZXJQYXNzIFxuICAgICogQHBhcmFtIHVzZXJOaWNrTmFtZVxuICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXFVc2VyUmVnaXN0ZXIodXNlck5hbWU6c3RyaW5nLHVzZXJLZXk6c3RyaW5nLHVzZXJOaWNrTmFtZTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyUmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJSZWdpc3RlclwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIHZhciB1c2VyRGF0YTphbnkgPSB7fTtcbiAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xuICAgICAgICBtZXNzYWdlLnVzZXJLZXkgPSB1c2VyS2V5O1xuICAgICAgICB1c2VyRGF0YS5uaWNrTmFtZSA9IHVzZXJOaWNrTmFtZTtcbiAgICAgICAgdXNlckRhdGEubHYgPSAxO1xuICAgICAgICBtZXNzYWdlLnVzZXJEYXRhID0gdXNlckRhdGE7XG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyUmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6K+35rGC5Yy56YWN5a+55bGAIDEwMjEwMVxuICAgICAqIEBwYXJhbSB1c2VySWQgXG4gICAgKiBAcGFyYW0gbWF0Y2hJZCBcbiAgICAqL1xuICAgcHVibGljIHN0YXRpYyByZXFNYXRjaCh1c2VySWQ6bnVtYmVyLG1hdGNoSWQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdmFyIFJlcU1hdGNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXRjaFwiKTtcbiAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICBtZXNzYWdlLm1hdGNoSWQgPSBtYXRjaElkO1xuICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXRjaC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0gsYnVmZmVyKTtcbiAgIH1cblxuICAgLyoqXG4gICAgICog6K+35rGCIOWvueWxgOaOpeWPlyDov5Tlm54xMDIyMDJcbiAgICAgKiBAcGFyYW0gdXNlcklkIFxuICAgICogQHBhcmFtIGlzQWNjZXB0ZSBcbiAgICAqL1xuICAgcHVibGljIHN0YXRpYyByZXFNYXRjaEFjY2VwdCh1c2VySWQ6bnVtYmVyLGlzQWNjZXB0ZTpudW1iZXIpOnZvaWRcbiAgIHtcbiAgICAgICB2YXIgUmVxTWF0Y2hBY2NlcHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hdGNoQWNjZXB0XCIpO1xuICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgIG1lc3NhZ2UudXNlcklkID0gdXNlcklkO1xuICAgICAgIG1lc3NhZ2UuaXNBY2NlcHRlID0gaXNBY2NlcHRlO1xuICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXRjaEFjY2VwdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0hfQUNDRVBULGJ1ZmZlcik7XG4gICB9XG4gICAgXG4gICAgLyoqKua2iOaBr+WPkemAgSovXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKndlYlNvY2tldCAqL1xuICAgIC8qKuWPkemAgUdN5a+G5LukICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHbU1zZyhnbTpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFHTUNvbW06YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdNQ29tbVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuY29tbSA9IGdtO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR01Db21tLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfR01fQ09NLGJ1ZmZlcik7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoq5b+D6Lez5YyFICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBzZXJ2SGVhcnRSZXEoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9TRVJWX0hFUlQpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDnlKjmiLfms6jlhoxcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUmVxKHVzZXJOYW1lOnN0cmluZyx1c2VyUGFzczpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFSZWdpc3RlclVzZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVJlZ2lzdGVyVXNlclwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbi8vICAgICAgICAgbWVzc2FnZS51c2VyUGFzcyA9IHVzZXJQYXNzO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUmVnaXN0ZXJVc2VyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFUl9SRUdJU1RFUixidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDnmbvlvZXmnI3liqHlmahcbi8vICAgICAgKiBAcGFyYW0gdG9rZW4gXG4vLyAgICAgICogQHBhcmFtIHNlcnZJZCBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIGxvZ2luU2VydlJlcShzZXJ2SWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUxvZ2luXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5jb2RlID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpbkF1dGhlbnRpY2F0aW9uO1xuLy8gICAgICAgICBtZXNzYWdlLnNlcnZlcklkID0gc2VydklkO1xuLy8gICAgICAgICBtZXNzYWdlLmFnZW50SWQgPSAxO1xuLy8gICAgICAgICBtZXNzYWdlLmNsaWVudElkID0gMTtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUxvZ2luLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfU0VSVl9MT0dJTixidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDliJvlu7rop5LoibJcbi8vICAgICAgKiBAcGFyYW0gc2V4IFxuLy8gICAgICAqIEBwYXJhbSBwbGF5ZXJOYW1lIFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUGxheWVyUmVxKHNleDpudW1iZXIscGxheWVyTmFtZTpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFDcmVhdGVQbGF5ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUNyZWF0ZVBsYXllclwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gc2V4O1xuLy8gICAgICAgICBtZXNzYWdlLnBsYXllck5hbWUgPSBwbGF5ZXJOYW1lO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQ3JlYXRlUGxheWVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfQ1JFQVRFX1BMQVlFUixidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5omA5pyJ5oqA6IO95L+h5oGvICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFBbGxTa2lsbEluZm8oKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9BTExfU0tJTExfSU5GTyk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRmlnaHRTa2lsbExpc3QoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GSUdIVF9TS0lMTF9MSVNUKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Y2H57qn5oqA6IO9ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFVcFNraWxsKHNraWxsVXBMdlZvczpBcnJheTxTa2lsbFVwTHZWbz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFVcFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVcFNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QgPSBbXTtcbi8vICAgICAgICAgdmFyIGluZm86YW55O1xuLy8gICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2tpbGxVcEx2Vm9zLmxlbmd0aDtpKyspXG4vLyAgICAgICAgIHtcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcbi8vICAgICAgICAgICAgIGluZm8uc2tpbGxJZCA9IHNraWxsVXBMdlZvc1tpXS5za2lsbElkO1xuLy8gICAgICAgICAgICAgaW5mby50b1NraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0udG9Ta2lsbElkO1xuLy8gICAgICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QucHVzaChpbmZvKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXBTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VQX1NLSUxMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLph43nva7mioDog70gKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVJlc2V0U2tpbGwoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9SRVNFVF9TS0lMTCk7ICAgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguS9v+eUqOmBk+WFtyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXNlKHByb3BJZDpMb25nLG51bTpudW1iZXIsYXJncz86c3RyaW5nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxVXNlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVc2VcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDtcbi8vICAgICAgICAgbWVzc2FnZS5udW0gPSBudW07XG4vLyAgICAgICAgIGlmKGFyZ3MpXG4vLyAgICAgICAgICAgICBtZXNzYWdlLmFyZ3MgPSBhcmdzO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXNlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFLGJ1ZmZlcik7ICBcbi8vICAgICB9XG4gICAgXG4vLyAgICAgLyoq6K+35rGC5a6g54mp5ZCI5oiQICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRDb21wb3VuZChwcm9wSWQ6TG9uZylcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRDb21wb3VuZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0Q29tcG91bmRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldENvbXBvdW5kLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0NPTVBPVU5ELGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguWWguWuoOeJqeWQg+mlrSovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRGZWVkKHBldElkOkxvbmcscHJvcExpc3Q6QXJyYXk8UHJvcFZvPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEZlZWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEZlZWRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcExpc3QgPSBwcm9wTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEZlZWQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRkVFRCxidWZmZXIpOyBcbi8vICAgICB9XG5cblxuLy8gICAgIC8qKuivt+axguaUueWPmOagvOWtkOaKgOiDvSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxQWx0ZXJHcmlkU2tpbGwodHlwZTpudW1iZXIsc2tpbGxVcEdyaWQ6U2tpbGxVcEdyaWRWbyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUFsdGVyR3JpZFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFBbHRlckdyaWRTa2lsbFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7ICAgICAgICBcbi8vICAgICAgICAgdmFyIHZvOmFueSA9IHt9O1xuLy8gICAgICAgICB2by5ncmlkSWQgPSBza2lsbFVwR3JpZC5ncmlkSWQ7XG4vLyAgICAgICAgIHZvLnNraWxsSWQgPSBza2lsbFVwR3JpZC5za2lsbElkO1xuLy8gICAgICAgICBtZXNzYWdlLmdyaWQgPSB2bzsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQWx0ZXJHcmlkU2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpOyAgICAgICAgXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0FMVEVSX0dSSURfU0tJTEwsYnVmZmVyKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5pS55Y+Y5a6g54mp6Zi15Z6L5qC85a2QICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRBbHRlckdyaWQodHlwZTpudW1iZXIsZ3JpZExpc3Q6QXJyYXk8TGluZXVwR3JpZFZvPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEFsdGVyR3JpZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0QWx0ZXJHcmlkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5ncmlkTGlzdCA9IFtdO1xuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XG4vLyAgICAgICAgIGZvcih2YXIgaSA9IDA7aSA8IGdyaWRMaXN0Lmxlbmd0aDtpKyspXG4vLyAgICAgICAgIHtcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcbi8vICAgICAgICAgICAgIGluZm8uZ3JpZElkID0gZ3JpZExpc3RbaV0uZ3JpZElkO1xuLy8gICAgICAgICAgICAgaW5mby5wZXRJZCA9IGdyaWRMaXN0W2ldLmhlcm9JZDtcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QucHVzaChpbmZvKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0QWx0ZXJHcmlkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0FMVEVSX0dSSUQsYnVmZmVyKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5omt6JuLIG1zZ0lkPTEwMjEwMVxuLy8gICAgICAqIEBwYXJhbSBtb25leVR5cGUgLy8g5omt6JuL57G75Z6LIDA96YeR5biB5oq9IDE96ZK755+z5oq9XG4vLyAgICAgICogQHBhcmFtIG51bVR5cGUg5qyh5pWw57G75Z6LIDA95YWN6LS55Y2V5oq9IDE95Y2V5oq9IDI95Y2B6L+e5oq9XG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHYWNoYShtb25leVR5cGU6bnVtYmVyLG51bVR5cGU6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxR2FjaGE6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdhY2hhXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gbW9uZXlUeXBlO1xuLy8gICAgICAgICBtZXNzYWdlLm51bVR5cGUgPSBudW1UeXBlO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR2FjaGEuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9HQUNIQSxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h5b+r6YCf5oiY5paXICovXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU3BlZWRGaWdodCgpOnZvaWRcbi8vICAgICAge1xuLy8gICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NQRUVEX0ZJR0hUKTtcbi8vICAgICAgfVxuXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoei0reS5sOaJq+iNoSAqL1xuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcEJ1eVN3ZWVwKCk6dm9pZFxuLy8gICAgICB7XG4vLyAgICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfQlVZX1NXRUVQKTtcbi8vICAgICAgfSAgIFxuXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoSAgKi9cbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTd2VlcEZpZ2h0KHNjZW5lSWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAgIHtcbi8vICAgICAgICAgIHZhciAgUmVxTWFwU3dlZXBGaWdodDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFwU3dlZXBGaWdodFwiKTtcbi8vICAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICAgbWVzc2FnZS5zY2VuZUlkID0gc2NlbmVJZDtcbi8vICAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBTd2VlcEZpZ2h0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TV0VFUF9GSUdIVCxidWZmZXIpO1xuLy8gICAgICB9XG5cbi8vICAgICAvKirpmo/mnLrliJvlu7rkuIDmnaHpvpkgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJhbmRvbUNyZWF0ZSgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SQU5ET01fQ1JFQVRFKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Zyw5Zu+5pmu6YCa5oiY5paX77yI5a6i5oi356uv5LiA5Zy65oiY5paX57uT5p2f5LmL5ZCO5Y+R6YCB5q2k5raI5oGv77yM5YaN6L+b6KGM5YCS6K6h5pe25ZKM5pys5Zyw5YGH5oiY5paX77yJIG1zZ0lkPTEwNjEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfTk9STUFMX0ZJR0hUKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5YWz5Y2h5YGH5oiY5paX57uT5p2f6aKG5Y+W5aWW5YqxIG1zZ0lkPTEwNjEwOVx0XHQtLS0tLei/lOWbnua2iOaBryDov5Tlm57miJDlip/mtojmga/vvIxjb2RlPTEwNjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHRFbmQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORCk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTY2VuZUZpZ2h0KCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NDRU5FX0ZJR0hUKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVHVyZUZpZ2h0RW5kKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVFJVRV9GSUdIVF9FTkQpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvXG4vLyAgICAgICogQHBhcmFtIHNjZW5lSWQgXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBDaGFuZ2VTY2VuZShzY2VuZUlkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1hcENoYW5nZVNjZW5lOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXBDaGFuZ2VTY2VuZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2NlbmVJZCA9IHNjZW5lSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBDaGFuZ2VTY2VuZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9DSEFOR0VfU0NFTkUsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp5Lqk6YWNIG1zZ0lkPTEwNTEwOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOVxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEgXG4vLyAgICAgICogQHBhcmFtIHBldElkMiBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZyhwZXRJZDE6TG9uZyxwZXRJZDI6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZDEgPSBwZXRJZDE7XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQyID0gcGV0SWQyO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElORyxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExXG4vLyAgICAgICogQHBhcmFtIHBldElkMSDov5vljJblrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSBiZVBldElkTGlzdCDmtojogJflrqDnialpZOWIl+ihqFxuLy8gICAgICAqIEBwYXJhbSBwcm9wSWQg5raI6ICX6YGT5YW35ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gcHJvcE51bSDmtojogJfpgZPlhbfmlbDph49cbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEV2b2x2ZShwZXRJZDpMb25nLGJlUGV0SWRMaXN0OkFycmF5PExvbmc+LHByb3BJZExpc3Q6QXJyYXk8TG9uZz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRFdm9sdmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEV2b2x2ZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgaWYoYmVQZXRJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuYmVQZXRJZExpc3QgPSBiZVBldElkTGlzdDtcbi8vICAgICAgICAgaWYocHJvcElkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5wcm9wSWRMaXN0ID0gcHJvcElkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEV2b2x2ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9FVk9MVkUsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwM1xuLy8gICAgICAqIEBwYXJhbSBlZ2dJZCDlrqDnianom4vllK/kuIBpZFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0SGF0Y2goZWdnSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEhhdGNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRIYXRjaFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZWdnSWQgPSBlZ2dJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEhhdGNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0hBVENILGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeeZu+iusCBtc2dJZD0xMDUxMTJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTJcbi8vICAgICAgKiBAcGFyYW0gZWdnSWQg5a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkIOmcgOimgeWTgei0qOadoeS7tmlkKDDooajnpLrkuI3pmZDliLYpXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZWdpc3RlcihwZXRJZDpMb25nLHF1YWxpdHlJZDpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRSZWdpc3RlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVnaXN0ZXJcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UucXVhbGl0eUlkID0gcXVhbGl0eUlkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVHSVNURVIsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxM1xuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDor7fmsYLmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOaOpeaUtuaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXFNYXRpbmcocGV0SWQ6TG9uZyx0b1BldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRSZXFNYXRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlcU1hdGluZ1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlcU1hdGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRVFfTUFUSU5HLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUxMTRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTRcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAgMT3lip/vvIwyPemYsu+8jDM96YCf77yMND3ooYDvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBjb25maWdJZCDlrqDnianphY3nva5pZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciAg5a6g54mp5oCn5Yir77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkTGlzdCDlrqDnianlk4HotKhpZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdBbGxJbmZvKHBldFR5cGU6bnVtYmVyLGNvbmZpZ0lkOm51bWJlcixnZW5kZXI6bnVtYmVyLHF1YWxpdHlJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ0FsbEluZm86YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ0FsbEluZm9cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldFR5cGUgPSBwZXRUeXBlO1xuLy8gICAgICAgICBtZXNzYWdlLmNvbmZpZ0lkID0gY29uZmlnSWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gZ2VuZGVyO1xuLy8gICAgICAgICBpZihxdWFsaXR5SWRMaXN0Lmxlbmd0aCA+IDApXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZExpc3QgPSBxdWFsaXR5SWRMaXN0O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQWxsSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQUxMSU5GTyxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MTE1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE1XG4vLyAgICAgICogQHBhcmFtIHBldElkIOWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTZWxlY3RSZXFMaXN0KHBldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRTZWxlY3RSZXFMaXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTZWxlY3RSZXFMaXN0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2VsZWN0UmVxTGlzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1QsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN5ZCM5oSP5oiW5ouS57udIG1zZ0lkPTEwNTExNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNu+8jOWmguaenOaYr+WQjOaEj++8jOWvueaWueeOqeWutuWmguaenOWcqOe6v++8jOS8muaUtuWIsG1zZ0lkPTEwNTIxMOa2iOaBr1xuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDmiJHmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOWvueaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIGlzQ29uc2VudCDmmK/lkKblkIzmhI8gdHJ1ZT3lkIzmhI9cbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ0Nob29zZShwZXRJZDpMb25nLHRvUGV0SWQ6TG9uZyxpc0NvbnNlbnQ6Ym9vbGVhbik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ0Nob29zZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nQ2hvb3NlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGV0SWQgPSB0b1BldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmlzQ29uc2VudCA9IGlzQ29uc2VudDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ0Nob29zZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQ0hPT1NFLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUxMTdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTdcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGNvbmZpZ0lkIOWuoOeJqemFjee9rmlk77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gZ2VuZGVyIOWuoOeJqeaAp+WIq++8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIHF1YWxpdHlJZExpc3Qg5a6g54mp5ZOB6LSoaWTvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nVGFyZ2V0UmVmcmVzaChwZXRUeXBlOm51bWJlcixjb25maWdJZDpudW1iZXIsZ2VuZGVyOm51bWJlcixxdWFsaXR5SWRMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRUeXBlID0gcGV0VHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5jb25maWdJZCA9IGNvbmZpZ0lkO1xuLy8gICAgICAgICBtZXNzYWdlLmdlbmRlciA9IGdlbmRlcjtcbi8vICAgICAgICAgaWYocXVhbGl0eUlkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWRMaXN0ID0gcXVhbGl0eUlkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNILGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMThcbi8vICAgICAgKiBAcGFyYW0gdG9QbGF5ZXJJZCDooqvmn6XnnIvlrqDniannmoTkuLvkurrnmoRpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOiiq+afpeeci+WuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdUYXJnZXRMb29rKHRvUGxheWVySWQ6TG9uZyx0b1BldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRMb29rOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRMb29rXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ1RhcmdldExvb2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX0NIT09TRSxidWZmZXIpO1xuLy8gICAgIH1cblxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAxICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcE1ha2UocHJvcElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcE1ha2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTWFrZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkOyAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcE1ha2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9NQUtFLGJ1ZmZlcik7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBTcGxpdChlcXVpcElkOkFycmF5PExvbmc+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBTcGxpdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBTcGxpdFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwU3BsaXQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9TUExJVCxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLoo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvY2socGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcExvY2s6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTG9ja1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2NrLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTE9DSyxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLoo4XlpIflvLrljJYgbXNnSWQ9MTA5MTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA1ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcEF0dEFkZChwZXRJZDpMb25nLGVxdWlwSWQ6TG9uZyxsdWNrTnVtOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9jazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2NrXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyBcbi8vICAgICAgICAgbWVzc2FnZS5sdWNrTnVtID0gbHVja051bTsgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvY2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9BVFRfQURELGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vIFx0Lyoq6K+35rGC6KOF5aSH56m/5oi0IG1zZ0lkPTEwOTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBMb2FkaW5nKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKVxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2FkaW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2FkaW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTE9BRElORyxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5Y246L29IG1zZ0lkPTEwOTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBVbkxvYWRpbmcocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBVbkxvYWRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwVW5Mb2FkaW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBVbkxvYWRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9VTkxPQURJTkcsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gXHQvKiror7fmsYLlrqDnianpoobmgp/mioDog70gbXNnSWQ9MTA1MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA2ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTdHVkeVNraWxsKHBldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRTdHVkeVNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTdHVkeVNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U3R1ZHlTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TVFVEWV9TS0lMTCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5a6g54mp6YeN572u5oqA6IO9IG1zZ0lkPTEwNTEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNyovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXNldFNraWxsKHBldElkOkxvbmcsc2tpbGxJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFJlc2V0U2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlc2V0U2tpbGxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgaWYoc2tpbGxJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZExpc3QgPSBza2lsbElkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlc2V0U2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVTRVRfU0tJTEwsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcVBldFNraWxsVXAocGV0SWQ6TG9uZyxza2lsbElkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFNraWxsVXA6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFNraWxsVXBcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZCA9IHNraWxsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRTa2lsbFVwLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NLSUxMX1VQLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gLyoq6K+35rGC5a6g54mp5pS+55SfIG1zZ0lkPTEwNTExOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RnJlZShwZXRJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVzUGV0RnJlZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzUGV0RnJlZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlc1BldEZyZWUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRlJFRSxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsQXdhcmQobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsQXdhcmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxBd2FyZFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbEF3YXJkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9BV0FSRCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsRGVsZXRlKG1haWxJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTWFpbERlbGV0ZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbERlbGV0ZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbERlbGV0ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfREVMRVRFLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguaJk+W8gOmCruS7tuiuvue9ruW3suivuyBtc2dJZD0xMTExMDEg5peg6L+U5Zue5raI5oGvIOWuouaIt+err+aJk+W8gOaXoOWlluWKsemCruS7tu+8jOiHquihjOiuvue9ruW3suivu+eKtuaAgSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxT3Blbk1haWwobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFPcGVuTWFpbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxT3Blbk1haWxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU9wZW5NYWlsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfT1BFTl9NQUlMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxBd2FyZChtYWlsSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1haWxBd2FyZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbEF3YXJkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsQXdhcmQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0FXQVJELGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxEZWxldGUobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsRGVsZXRlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsRGVsZXRlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsRGVsZXRlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9ERUxFVEUsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aOqOiNkCBtc2dJZD0xMTIxMDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDEgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZFB1c2goKTp2b2lkXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfUFVTSCk7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRTZWFyY2godG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kU2VhcmNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRTZWFyY2hcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kU2VhcmNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX1NFQVJDSCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kQXBwbHkodG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kQXBwbHk6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEFwcGx5XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEFwcGx5LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0FQUExZLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmk43kvZwgbXNnSWQ9MTEyMTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRPcGVyYXRpb24odHlwZTpudW1iZXIsdG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kT3BlcmF0aW9uOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRPcGVyYXRpb25cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kT3BlcmF0aW9uLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX09QRVJBVElPTixidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L6K+m57uG5L+h5oGvIG1zZ0lkPTExMjEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kTW9yZUluZm8odG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kTW9yZUluZm86YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZE1vcmVJbmZvXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kTW9yZUluZm8uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfTU9SRV9JTkZPLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRHaWZ0KGdpZnRJZDpudW1iZXIsdG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kR2lmdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kR2lmdFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcbi8vICAgICAgICAgbWVzc2FnZS5naWZ0SWQgPSBnaWZ0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRHaWZ0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0dJRlQsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aJgOacieS/oeaBryBtc2dJZD0xMTIxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDcgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEFsbEluZm8oKTp2b2lkXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfQWxsX0luZm8pOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kRmlnaHQodG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kRmlnaHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEZpZ2h0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kRmlnaHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfRklHSFQsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG5cblxuXG5cblxuXG5cbiAgICAvKirnmbvlvZXor7fmsYIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGxvZ2luUmVxKGFjY291bnQ6c3RyaW5nKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgTG9naW5SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJMb2dpblJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLm5hbWUgPSBhY2NvdW50O1xuICAgIC8vICAgICBtZXNzYWdlLnRva2VuID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpblRva2VuO1xuICAgIC8vICAgICBtZXNzYWdlLm5pY2tuYW1lID0gXCJ4aWVsb25nXCI7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBMb2dpblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlVTRVJfTE9HSU4sUHJvdG9jb2wuVVNFUl9MT0dJTl9DTUQsYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6I635Y+W6Iux6ZuE5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnZXRIZXJvSW5mb1JlcShzdGF0dXNDb2RlOm51bWJlcik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEhlcm9JbmZvUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiSGVyb0luZm9SZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEhlcm9JbmZvUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX0dFVF9JTkZPUyxidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKiroi7Hpm4TkuIrjgIHkuIvjgIHmm7TmlrDpmLXlnosgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGhlcm9MaW51ZXBVcGRhdGVSZXEobGluZXVwSWQ6bnVtYmVyLGhlcm9JZDpzdHJpbmcsaXNVcDpib29sZWFuKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICBpZighaXNVcCAmJiBHYW1lRGF0YU1hbmFnZXIuaW5zLnNlbGZQbGF5ZXJEYXRhLmhlcm9MaW5ldXBEaWMudmFsdWVzLmxlbmd0aCA8PSAxKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICBUaXBzTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi6Zi15LiK6Iux6ZuE5LiN5b6X5bCR5LqO5LiA5LiqXCIsMzAsXCIjZmYwMDAwXCIsTGF5ZXJNYW5hZ2VyLmlucy5nZXRMYXllcihMYXllck1hbmFnZXIuVElQX0xBWUVSKSxHYW1lQ29uZmlnLlNUQUdFX1dJRFRILzIsR2FtZUNvbmZpZy5TVEFHRV9IRUlHSFQvMiwxLDAsMjAwKTtcbiAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICB2YXIgVXBkYXRlRm9ybWF0aW9uUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiVXBkYXRlRm9ybWF0aW9uUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc2l0ZUlkeCA9IGxpbmV1cElkO1xuICAgIC8vICAgICBtZXNzYWdlLmhlcm9JZCA9IGhlcm9JZDtcbiAgICAvLyAgICAgbWVzc2FnZS5mbGFnID0gaXNVcDtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFVwZGF0ZUZvcm1hdGlvblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkhFUk8sUHJvdG9jb2wuSEVST19VUERBVEVfRk9STUFUSU9OLGJ1ZmZlcik7XG4gICAgLy8gfVxuICAgIC8vIC8qKuivt+axguWFs+WNoeS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZUdhdGVJbmZvUmVxKCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEdhdGVJbmZvUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJHYXRlSW5mb1JlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSAxO1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gR2F0ZUluZm9SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSU5GTyxidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKirmjJHmiJjlhbPljaEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGJhbGx0ZUdhdGVSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBCYXR0bGVHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJCYXR0bGVHYXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBCYXR0bGVHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0JBVFRMRSxidWZmZXIpO1xuICAgIC8vIH1cblxuICAgIC8vIC8qKuivt+axguaJq+iNoeWFs+WNoSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgc2NhbkdhdGVSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBTY2FuR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiU2NhbkdhdGVSZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFNjYW5HYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX1NDQU4sYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5oyC5py65aWW5Yqx5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlSGFuZ3VwU3RhdGVSZXEoKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgSGFuZ3VwU3RhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkhhbmd1cFN0YXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IDE7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBIYW5ndXBTdGF0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUsYnVmZmVyKTtcbiAgICAvLyAgICAgLy8gV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5oyC5py65L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlU3dpdGNoSGFuZ1JlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIFN3aXRjaEhhbmdHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJTd2l0Y2hIYW5nR2F0ZVJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfU1dJVENIX0hBTkdfR0FURSxidWZmZXIpO1xuICAgIC8vICAgICAvLyBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUpO1xuICAgIC8vIH1cbiAgICBcblxuXG4gICAgLy8gLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipIdHRwICovXG4gICAgLy8gLyoq5rWL6K+V55m75b2VICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBodHRwTG9naW5SZXEoYWNjb3VudDpzdHJpbmcscHdkOnN0cmluZyxjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBwYXJhbXM6YW55ID0ge307XG4gICAgLy8gICAgIHBhcmFtcy5hY2NvdW50ID0gYWNjb3VudDtcbiAgICAvLyAgICAgcGFyYW1zLnBhc3N3b3JkID0gcHdkO1xuICAgIC8vICAgICBIdHRwTWFuYWdlci5pbnMuc2VuZChIVFRQUmVxdWVzdFVybC50ZXN0TG9naW5VUkwsSFRUUFJlcVR5cGUuR0VULHBhcmFtcyxjYWxsZXIsY2FsbEJhY2spO1xuICAgIC8vIH1cbiAgICAvLyAvKirojrflj5bmnI3liqHlmajliJfooaggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBHYW1lU2VydmVyUmVxKGNhbGxlcj86YW55LGNhbGxCYWNrPzpGdW5jdGlvbik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZ2FtZVNlcnZlclVSTCxIVFRQUmVxVHlwZS5HRVQsbnVsbCxjYWxsZXIsY2FsbEJhY2spO1xuICAgIC8vIH1cbiAgICAvLyAvKirov5vlhaXmuLjmiI8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBFbnRlckdhbWVSZXEoc2lkOm51bWJlcixjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBwYXJhbXM6YW55ID0ge307XG4gICAgLy8gICAgIHBhcmFtcy5zaWQgPSBzaWQ7XG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLmVudGVyR2FtZVVSTCxIVFRQUmVxVHlwZS5HRVQscGFyYW1zLGNhbGxlcixjYWxsQmFjayk7XG4gICAgLy8gfVxufSIsIi8qXG4qIOWMheino+aekFxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VJbiBleHRlbmRzIExheWEuQnl0ZXtcbiAgICBcbiAgICAvLyBwdWJsaWMgbW9kdWxlOm51bWJlcjtcbiAgICBwdWJsaWMgY21kOm51bWJlcjtcbiAgICBwdWJsaWMgYm9keTtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvLyBwdWJsaWMgcmVhZChtc2c6T2JqZWN0ID0gbnVsbCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgIC8vICAgICB0aGlzLmNsZWFyKCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XG4gICAgLy8gICAgIC8v5qCH6K6w5ZKM6ZW/5bqmXG4gICAgLy8gICAgIHZhciBtYXJrID0gdGhpcy5nZXRJbnQxNigpO1xuICAgIC8vICAgICB2YXIgbGVuID0gdGhpcy5nZXRJbnQzMigpO1xuICAgIC8vICAgICAvL+WMheWktFxuICAgIC8vICAgICB0aGlzLm1vZHVsZSA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIHZhciB0eXBlID0gdGhpcy5nZXRCeXRlKCk7XG4gICAgLy8gICAgIHZhciBmb3JtYXQgPSB0aGlzLmdldEJ5dGUoKTtcbiAgICAvLyAgICAgLy/mlbDmja5cbiAgICAvLyAgICAgdmFyIHRlbXBCeXRlID0gdGhpcy5idWZmZXIuc2xpY2UodGhpcy5wb3MpO1xuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XG5cbiAgICAvLyB9XG4gICAgXG4gICAgLy/mlrDpgJrkv6FcbiAgICAvLyBwdWJsaWMgcmVhZChtc2c6T2JqZWN0ID0gbnVsbCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgIC8vICAgICB0aGlzLmNsZWFyKCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XG5cbiAgICAvLyAgICAgdmFyIGxlbiA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIC8v5pWw5o2uXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcbiAgICAvLyAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xuXG4gICAgLy8gfVxuICAgIC8v5paw6YCa5L+hIOeymOWMheWkhOeQhlxuICAgIHB1YmxpYyByZWFkKGJ1ZmZEYXRhKTp2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGJ1ZmZEYXRhKTtcbiAgICAgICAgdGhpcy5wb3MgPSAwO1xuXG4gICAgICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5nZXRJbnQzMigpO1xuICAgICAgICAvL+aVsOaNrlxuICAgICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBVaW50OEFycmF5KHRlbXBCeXRlKTtcblxuICAgIH1cbiAgICBcbn1cbiIsImltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuL1dlYlNvY2tldE1hbmFnZXJcIjtcblxuLypcbiog5omT5YyFXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZU91dCBleHRlbmRzIExheWEuQnl0ZXtcbiAgICAvLyBwcml2YXRlIFBBQ0tFVF9NQVJLID0gMHgwO1xuICAgIC8vIHByaXZhdGUgbW9kdWxlID0gMDtcbiAgICAvLyBwcml2YXRlIHR5cGUgPSAwO1xuICAgIC8vIHByaXZhdGUgZm9ybWFydCA9IDA7XG4gICAgcHJpdmF0ZSBjbWQ7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgLy8gcHVibGljIHBhY2sobW9kdWxlLGNtZCxkYXRhPzphbnkpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcbiAgICAvLyAgICAgdGhpcy5tb2R1bGUgPSBtb2R1bGU7XG4gICAgLy8gICAgIHRoaXMuY21kID0gY21kO1xuICAgIC8vICAgICB0aGlzLndyaXRlSW50MTYodGhpcy5QQUNLRVRfTUFSSyk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMihkYXRhLmJ5dGVMZW5ndGggKyAxMCk7XG4gICAgLy8gICAgIC8v5YyF5aS0XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLm1vZHVsZSk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMudHlwZSk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMuZm9ybWFydCk7XG4gICAgLy8gICAgIC8v5raI5oGv5L2TXG4gICAgLy8gICAgIGlmKGRhdGEpXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIC8qKuaWsOmAmuS/oSAqL1xuICAgIHB1YmxpYyBwYWNrKGNtZCxkYXRhPzphbnkpOnZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcblxuICAgICAgICB0aGlzLmNtZCA9IGNtZDtcbiAgICAgICAgdmFyIGxlbiA9IChkYXRhID8gZGF0YS5ieXRlTGVuZ3RoIDogMCkgKyAxMjtcbiAgICAgICAgdmFyIGNvZGU6bnVtYmVyID0gV2ViU29ja2V0TWFuYWdlci5jb2RlQ291bnRebGVuXjUxMjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMihsZW4pO1xuICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICB0aGlzLndyaXRlSW50MzIoY29kZSk7XG4gICAgICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XG4gICAgICAgIGlmKGRhdGEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50KysgO1xuICAgIH1cblxufSIsIi8qXG4qIOaVsOaNruWkhOeQhkhhbmxkZXJcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRIYW5kbGVye1xuICAgIC8vIHB1YmxpYyBzdGF0dXNDb2RlOm51bWJlciA9IDA7XG4gICAgcHVibGljIGNhbGxlcjphbnk7XG4gICAgcHJpdmF0ZSBjYWxsQmFjazpGdW5jdGlvbjtcbiAgICBjb25zdHJ1Y3RvcihjYWxsZXI/OmFueSxjYWxsYmFjaz86RnVuY3Rpb24pe1xuICAgICAgICB0aGlzLmNhbGxlciA9IGNhbGxlcjtcbiAgICAgICAgdGhpcy5jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHBsYWluKGRhdGE/OmFueSk6dm9pZFxuICAgIHtcbiAgICAgICAgLy8gdmFyIHN0YXR1c0NvZGUgPSBkYXRhLnN0YXR1c0NvZGU7XG4gICAgICAgIC8vIGlmKHN0YXR1c0NvZGUgPT0gMClcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgdGhpcy5zdWNjZXNzKGRhdGEpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGVsc2VcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCLmnI3liqHlmajov5Tlm57vvJpcIixkYXRhLnN0YXR1c0NvZGUpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuc3VjY2VzcyhkYXRhKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MoZGF0YT86YW55KTp2b2lkXG4gICAge1xuICAgICAgICBpZih0aGlzLmNhbGxlciAmJiB0aGlzLmNhbGxCYWNrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihkYXRhKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsbEJhY2suY2FsbCh0aGlzLmNhbGxlcixkYXRhKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxCYWNrLmNhbGwodGhpcy5jYWxsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBEaWN0aW9uYXJ5IGZyb20gXCIuLi8uLi9Ub29sL0RpY3Rpb25hcnlcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4uL0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IFBhY2thZ2VJbiBmcm9tIFwiLi9QYWNrYWdlSW5cIjtcbmltcG9ydCBQYWNrYWdlT3V0IGZyb20gXCIuL1BhY2thZ2VPdXRcIjtcbmltcG9ydCBTb2NrZXRIYW5kbGVyIGZyb20gXCIuL1NvY2tldEhhbmRsZXJcIjtcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4vQ2xpZW50U2VuZGVyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XG5cbi8qKlxuICogc29ja2V05Lit5b+DXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlNvY2tldE1hbmFnZXIge1xuICAgLyoq6YCa5L+hY29kZeasoeaVsCAqL1xuICAgcHVibGljIHN0YXRpYyBjb2RlQ291bnQ6bnVtYmVyID0gMDtcbiAgIHByaXZhdGUgaXA6c3RyaW5nO1xuICAgcHJpdmF0ZSBwb3J0Om51bWJlcjtcbiAgIHByaXZhdGUgd2ViU29ja2V0OkxheWEuU29ja2V0O1xuICAgcHJpdmF0ZSBzb2NrZXRIYW5sZGVyRGljOkRpY3Rpb25hcnk7XG4gICBwcml2YXRlIHByb3RvUm9vdDphbnk7XG4gICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICB9XG4gICBwcml2YXRlIHN0YXRpYyBfaW5zOldlYlNvY2tldE1hbmFnZXIgPSBudWxsO1xuICAgcHVibGljIHN0YXRpYyBnZXQgaW5zKCk6V2ViU29ja2V0TWFuYWdlcntcbiAgICAgICBpZih0aGlzLl9pbnMgPT0gbnVsbClcbiAgICAgICB7ICBcbiAgICAgICAgICAgdGhpcy5faW5zID0gbmV3IFdlYlNvY2tldE1hbmFnZXIoKTtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHRoaXMuX2lucztcbiAgIH1cblxuICAgcHVibGljIGNvbm5lY3QoaXA6c3RyaW5nLHBvcnQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdGhpcy5pcCA9IGlwO1xuICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XG5cbiAgICAgICB0aGlzLndlYlNvY2tldCA9IG5ldyBMYXlhLlNvY2tldCgpO1xuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuT1BFTix0aGlzLHRoaXMud2ViU29ja2V0T3Blbik7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5NRVNTQUdFLHRoaXMsdGhpcy53ZWJTb2NrZXRNZXNzYWdlKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5FUlJPUix0aGlzLHRoaXMud2ViU29ja2V0RXJyb3IpO1xuICAgICAgIC8v5Yqg6L295Y2P6K6uXG4gICAgICAgaWYoIXRoaXMucHJvdG9Sb290KXtcbiAgICAgICAgICAgdmFyIHByb3RvQnVmVXJscyA9IFtcIm91dHNpZGUvcHJvdG8vVXNlclByb3RvLnByb3RvXCIsXCJvdXRzaWRlL3Byb3RvL01hdGNoUHJvdG8ucHJvdG9cIl07XG4gICAgICAgICAgIExheWEuQnJvd3Nlci53aW5kb3cucHJvdG9idWYubG9hZChwcm90b0J1ZlVybHMsdGhpcy5wcm90b0xvYWRDb21wbGV0ZSk7XG4gICAgICAgICAgICBcbiAgICAgICB9XG4gICAgICAgZWxzZVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIit0aGlzLmlwK1wiOlwiK3RoaXMucG9ydCk7XG4gICAgICAgfVxuICAgfVxuICAgLyoq5YWz6Zetd2Vic29ja2V0ICovXG4gICBwdWJsaWMgY2xvc2VTb2NrZXQoKTp2b2lkXG4gICB7XG4gICAgICAgaWYodGhpcy53ZWJTb2NrZXQpXG4gICAgICAge1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5PUEVOLHRoaXMsdGhpcy53ZWJTb2NrZXRPcGVuKTtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuTUVTU0FHRSx0aGlzLHRoaXMud2ViU29ja2V0TWVzc2FnZSk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkVSUk9SLHRoaXMsdGhpcy53ZWJTb2NrZXRFcnJvcik7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0ID0gbnVsbDtcbiAgICAgICB9XG4gICB9XG4gIFxuICAgcHJpdmF0ZSBwcm90b0xvYWRDb21wbGV0ZShlcnJvcixyb290KTp2b2lkXG4gICB7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMucHJvdG9Sb290ID0gcm9vdDtcbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5pcCtcIjpcIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5wb3J0KTtcbiAgIH1cbiAgIHByaXZhdGUgd2ViU29ja2V0T3BlbigpOnZvaWRcbiAgIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBvcGVuLi4uXCIpO1xuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhID0gbmV3IExheWEuQnl0ZSgpO1xuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFuO1xuICAgICAgIHRoaXMudGVtcEJ5dGUgPSBuZXcgTGF5YS5CeXRlKCk7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcblxuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50ID0gMTtcbiAgICAgICAgLy8gICAgRXZlbnRNYW5hZ2VyLmlucy5kaXNwYXRjaEV2ZW50KEV2ZW50TWFuYWdlci5TRVJWRVJfQ09OTkVDVEVEKTvmmoLml7bkuI3pnIDopoHojrflj5bmnI3liqHlmajliJfooahcbiAgIH1cbiAgIC8v57yT5Yay5a2X6IqC5pWw57uEXG4gICBwcml2YXRlIGJ5dGVCdWZmRGF0YTpMYXlhLkJ5dGU7XG4gICAvL+mVv+W6puWtl+iKguaVsOe7hFxuICAgcHJpdmF0ZSB0ZW1wQnl0ZTpMYXlhLkJ5dGU7XG4gIFxuICAgcHJpdmF0ZSBwYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pOnZvaWRcbiAgIHtcbiAgICAgICAvL+WujOaVtOWMhVxuICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcbiAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAscGFja0xlbik7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xuICAgICAgIC8v5pat5YyF5aSE55CGXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEgPSBuZXcgTGF5YS5CeXRlKHRoaXMuYnl0ZUJ1ZmZEYXRhLmdldFVpbnQ4QXJyYXkocGFja0xlbix0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpKTtcbiAgICAgICAvLyB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlcixwYWNrTGVuLHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW47XG5cbiAgICAgICAvL+ino+aekOWMhVxuICAgICAgIHZhciBwYWNrYWdlSW46UGFja2FnZUluID0gbmV3IFBhY2thZ2VJbigpO1xuICAgICAgIC8vIHZhciBidWZmID0gdGhpcy50ZW1wQnl0ZS5idWZmZXIuc2xpY2UoMCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XG4gICAgICAgcGFja2FnZUluLnJlYWQodGhpcy50ZW1wQnl0ZS5idWZmZXIpO1xuXG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgbXNnLi4uXCIscGFja2FnZUluLmNtZCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XG4gICAgICAgaWYocGFja2FnZUluLmNtZCA9PSAxMDUyMDIpXG4gICAgICAge1xuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcbiAgICAgICB9XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBwYWNrYWdlSW4uY21kO1xuICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcbiAgICAgICBpZihoYW5kbGVycyAmJiBoYW5kbGVycy5sZW5ndGggPiAwKVxuICAgICAgIHtcbiAgICAgICAgICAgZm9yKHZhciBpID0gaGFuZGxlcnMubGVuZ3RoIC0gMTtpID49IDA7aS0tKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBoYW5kbGVyc1tpXS5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICAvLyBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xuICAgICAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcblxuICAgICAgICAgICAvLyB9KTtcbiAgICAgICB9XG4gICAgICAgXG4gICAgICAgLy/pgJLlvZLmo4DmtYvmmK/lkKbmnInlrozmlbTljIVcbiAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPiA0KVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAsNCk7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcbiAgICAgICAgICAgcGFja0xlbiA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgXG4gICB9XG4gICAvKirop6PmnpDnqbrljIUgKi9cbiAgIHByaXZhdGUgcGFyc2VOdWxsUGFja2FnZShjbWQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKGhhbmRsZXJzKVxuICAgICAgIHtcbiAgICAgICAgICAgaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcbiAgICAgICAgICAgICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbigpO1xuICAgICAgICAgICB9KTtcbiAgICAgICB9XG4gICB9XG4gICBcbiAgIHByaXZhdGUgd2ViU29ja2V0TWVzc2FnZShkYXRhKTp2b2lkXG4gICB7XG4gICAgICAgdGhpcy50ZW1wQnl0ZSA9IG5ldyBMYXlhLkJ5dGUoZGF0YSk7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIi4uLi4udGVzdHdlYlwiLHRoaXMudGVtcEJ5dGUucG9zKTtcbiAgICAgICBcbiAgICAgICBpZih0aGlzLnRlbXBCeXRlLmxlbmd0aCA+IDQpXG4gICAgICAge1xuICAgICAgICAgICBpZih0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgPT0gNCkvL+epuuWMhVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB2YXIgY21kOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKTtcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VOdWxsUGFja2FnZShjbWQpO1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLnqbrljIUuLi4uLi4uLi4uLi4uLi4uXCIrY21kKTtcbiAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKGRhdGEsMCxkYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5a2X6IqC5oC76ZW/5bqmLi4uLi4uLi4uLi4uLi4uLlwiK3RoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XG4gICAgICAgXG4gICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID4gNClcbiAgICAgICB7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLDQpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XG4gICAgICAgICAgIHZhciBwYWNrTGVuOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICBcblxuXG5cbiAgICAgICAvLyB2YXIgcGFja2FnZUluOlBhY2thZ2VJbiA9IG5ldyBQYWNrYWdlSW4oKTtcbiAgICAgICAvLyBwYWNrYWdlSW4ucmVhZChkYXRhKTtcblxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG1zZy4uLlwiLHBhY2thZ2VJbi5jbWQpO1xuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gXCJcIisgcGFja2FnZUluLmNtZDtcbiAgICAgICAvLyB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XG4gICAgICAgLy8gaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcbiAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcbiAgICAgICAvLyB9KTtcbiAgICAgICBcbiAgIH1cbiAgIHByaXZhdGUgd2ViU29ja2V0Q2xvc2UoKTp2b2lkXG4gICB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IGNsb3NlLi4uXCIpO1xuICAgfVxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRFcnJvcigpOnZvaWRcbiAgIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgZXJyb3IuLi5cIik7XG4gICB9XG4gICAvKipcbiAgICAqIOWPkemAgea2iOaBr1xuICAgICogQHBhcmFtIGNtZCBcbiAgICAqIEBwYXJhbSBkYXRhIFxuICAgICovXG4gICBwdWJsaWMgc2VuZE1zZyhjbWQ6bnVtYmVyLGRhdGE/OmFueSk6dm9pZFxuICAge1xuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IHJlcS4uLlwiK2NtZCk7XG4gICAgICAgdmFyIHBhY2thZ2VPdXQ6UGFja2FnZU91dCA9IG5ldyBQYWNrYWdlT3V0KCk7XG4gICAgICAgLy8gcGFja2FnZU91dC5wYWNrKG1vZHVsZSxjbWQsZGF0YSk7XG4gICAgICAgcGFja2FnZU91dC5wYWNrKGNtZCxkYXRhKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5zZW5kKHBhY2thZ2VPdXQuYnVmZmVyKTtcbiAgIH1cbiAgIC8qKlxuICAgICog5a6a5LmJcHJvdG9idWbnsbtcbiAgICAqIEBwYXJhbSBwcm90b1R5cGUg5Y2P6K6u5qih5Z2X57G75Z6LXG4gICAgKiBAcGFyYW0gY2xhc3NTdHIg57G7XG4gICAgKi9cbiAgIHB1YmxpYyBkZWZpbmVQcm90b0NsYXNzKGNsYXNzU3RyOnN0cmluZyk6YW55XG4gICB7XG4gICAgICAgcmV0dXJuIHRoaXMucHJvdG9Sb290Lmxvb2t1cChjbGFzc1N0cik7XG4gICB9XG5cbiAgIC8qKuazqOWGjCAqL1xuICAgcHVibGljIHJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGhhbmRsZXI6U29ja2V0SGFuZGxlcik6dm9pZFxuICAge1xuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gcHJvdG9jb2wrXCJfXCIrY21kO1xuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIitjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKCFoYW5kbGVycylcbiAgICAgICB7XG4gICAgICAgICAgIGhhbmRsZXJzID0gW107XG4gICAgICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5zZXQoa2V5LGhhbmRsZXJzKTtcbiAgICAgICB9XG4gICAgICAgZWxzZVxuICAgICAgIHtcbiAgICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICB9XG4gICB9XG4gICAvKirliKDpmaQgKi9cbiAgIHB1YmxpYyB1bnJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGNhbGxlcjphbnkpOnZvaWRcbiAgIHtcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIgKyBjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKGhhbmRsZXJzKVxuICAgICAgIHtcbiAgICAgICAgICAgdmFyIGhhbmRsZXI7XG4gICAgICAgICAgIGZvcih2YXIgaSA9IGhhbmRsZXJzLmxlbmd0aCAtIDE7aSA+PSAwIDtpLS0pXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tpXTtcbiAgICAgICAgICAgICAgIGlmKGhhbmRsZXIuY2FsbGVyID09PSBjYWxsZXIpXG4gICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgaGFuZGxlcnMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYoaGFuZGxlcnMubGVuZ3RoID09IDApXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5yZW1vdmUoa2V5KTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgIH1cbiAgIC8qKua3u+WKoOacjeWKoeWZqOW/g+i3syAqL1xuICAgcHVibGljIGFkZEhlcnRSZXEoKTp2b2lkXG4gICB7XG4gICAgLy8gICAgdGhpcy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsbmV3IFNlcnZlckhlYXJ0SGFuZGxlcih0aGlzKSk7XG4gICAgLy8gICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xuICAgIC8vICAgIExheWEudGltZXIubG9vcCgxMDAwMCx0aGlzLGZ1bmN0aW9uKCk6dm9pZHtcbiAgICAvLyAgICAgICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xuICAgIC8vICAgIH0pO1xuICAgfVxuICAgcHVibGljIHJlbW92ZUhlYXJ0UmVxKCk6dm9pZFxuICAge1xuICAgIC8vICAgIHRoaXMudW5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsdGhpcyk7XG4gICAgLy8gICAgTGF5YS50aW1lci5jbGVhckFsbCh0aGlzKTtcbiAgIH1cbn0iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cclxuaW1wb3J0IEdhbWVDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvR2FtZS9HYW1lQ29udHJvbGxlclwiXG5pbXBvcnQgR2FtZUxvYmJ5Q29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL0dhbWVMb2JieS9HYW1lTG9iYnlDb250cm9sbGVyXCJcbmltcG9ydCBMb2FkaW5nQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL0xvYWRpbmcvTG9hZGluZ0NvbnRyb2xsZXJcIlxuaW1wb3J0IFdlbENvbWVDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj0xNDQwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9NzUwO1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZGhlaWdodFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJ0b3BcIjtcclxuICAgIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwiV2VsY29tZS9Mb2dpbi5zY2VuZVwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgdmFyIHJlZzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XHJcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzXCIsR2FtZUNvbnRyb2xsZXIpO1xuICAgICAgICByZWcoXCJDb250cm9sbGVyL0dhbWVMb2JieS9HYW1lTG9iYnlDb250cm9sbGVyLnRzXCIsR2FtZUxvYmJ5Q29udHJvbGxlcik7XG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvTG9hZGluZy9Mb2FkaW5nQ29udHJvbGxlci50c1wiLExvYWRpbmdDb250cm9sbGVyKTtcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9XZWxDb21lL1dlbENvbWVDb250cm9sbGVyLnRzXCIsV2VsQ29tZUNvbnRyb2xsZXIpO1xyXG4gICAgfVxyXG59XHJcbkdhbWVDb25maWcuaW5pdCgpOyIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcblxuXG4vKipcbiAqIOa4uOaIj+WFpeWPo1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lRW50ZXJ7XG5cdFx0Ly9cbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICAvKirliJ3lp4vljJYgKi9cbiAgICBwcml2YXRlIGluaXQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMubG9hZCgpO1xuICAgIH1cbiAgICAvKirotYTmupDliqDovb0gKi9cbiAgICBwcml2YXRlIGxvYWQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBhc3NldGVBcnIgPSBbXG4gICAgICAgICAgICB7dXJsOlwidW5wYWNrYWdlL3dlbGNvbWVfYmcucG5nXCJ9LFxuICAgICAgICAgICAge3VybDpcIldlbGNvbWUvbG9naW5ib3gucG5nXCJ9LFxuICAgICAgICAgICAge3VybDpcIldlbGNvbWUvcHJvZ3Jlc3NCZy5wbmdcIn0sXG5cbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvY29tcC5hdGxhc1wifSxcbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvd2VsY29tZS5hdGxhc1wifVxuICAgICAgICBdXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoYXNzZXRlQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9ubG9hZCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25sb2FkKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBHYW1lQ29uZmlnLnN0YXJ0U2NlbmUgJiYgTGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSk7XG4gICAgfVxufSIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcbmltcG9ydCBHYW1lRW50ZXIgZnJvbSBcIi4vR2FtZUVudGVyXCI7XG5jbGFzcyBNYWluIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSkgTGF5YTNELmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQpO1xuXHRcdGVsc2UgTGF5YS5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0LCBMYXlhW1wiV2ViR0xcIl0pO1xuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2FtZUNvbmZpZy5zY2FsZU1vZGU7XG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XG5cblx0XHQvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XG5cdFx0aWYgKEdhbWVDb25maWcuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xuXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xuXHR9XG5cblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XG5cdFx0TGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcblx0fVxuXG5cdG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xuXHRcdG5ldyBHYW1lRW50ZXIoKTtcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xuXHR9XG59XG4vL+a/gOa0u+WQr+WKqOexu1xubmV3IE1haW4oKTtcbiIsIi8qKlxuICAgICog6K+N5YW4IGtleS12YWx1ZVxuICAgICpcbiAgICAqICBcbiAgICAqICBrZXlzIDogQXJyYXlcbiAgICAqICBbcmVhZC1vbmx5XSDojrflj5bmiYDmnInnmoTlrZDlhYPntKDplK7lkI3liJfooajjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiBcbiAgICAqICB2YWx1ZXMgOiBBcnJheVxuICAgICogIFtyZWFkLW9ubHldIOiOt+WPluaJgOacieeahOWtkOWFg+e0oOWIl+ihqOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICBQdWJsaWMgTWV0aG9kc1xuICAgICogIFxuICAgICogICAgICAgICAgXG4gICAgKiAgY2xlYXIoKTp2b2lkXG4gICAgKiAg5riF6Zmk5q2k5a+56LGh55qE6ZSu5ZCN5YiX6KGo5ZKM6ZSu5YC85YiX6KGo44CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgXG4gICAgKiAgZ2V0KGtleToqKToqXG4gICAgKiAg6L+U5Zue5oyH5a6a6ZSu5ZCN55qE5YC844CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgIFxuICAgICogIGluZGV4T2Yoa2V5Ok9iamVjdCk6aW50XG4gICAgKiAg6I635Y+W5oyH5a6a5a+56LGh55qE6ZSu5ZCN57Si5byV44CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgXG4gICAgKiAgcmVtb3ZlKGtleToqKTpCb29sZWFuXG4gICAgKiAg56e76Zmk5oyH5a6a6ZSu5ZCN55qE5YC844CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgXG4gICAgKiAgc2V0KGtleToqLCB2YWx1ZToqKTp2b2lkXG4gICAgKiAg57uZ5oyH5a6a55qE6ZSu5ZCN6K6+572u5YC844CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpY3Rpb25hcnkge1xuICAgIC8qKumUruWQjSAqL1xuICAgIHByaXZhdGUga2V5cyA6IEFycmF5PGFueT47XG4gICAgLyoq6ZSu5YC8ICovXG4gICAgcHJpdmF0ZSB2YWx1ZXMgOiBBcnJheTxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5rZXlzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBuZXcgQXJyYXk8YW55PigpO1xuICAgIH1cblxuICAgIC8qKuiuvue9riDplK7lkI0gLSDplK7lgLwgKi9cbiAgICBwdWJsaWMgc2V0KGtleTphbnksdmFsdWU6YW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldPT09dW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpXSA9IGtleTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g5o+S5YWla2V5W1wiKyBrZXkgK1wiXVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJ2YWx1ZVwiLHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKirpgJrov4cg6ZSu5ZCNa2V5IOiOt+WPlumUruWAvHZhbHVlICAqL1xuICAgIHB1YmxpYyBnZXQoa2V5OmFueSkgOiBhbnlcbiAgICB7XG4gICAgICAgIC8vIHRoaXMuZ2V0RGljTGlzdCgpOyBcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldID09PSBrZXkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOivjeWFuOS4reayoeaciWtleeeahOWAvFwiKTtcbiAgICB9XG5cbiAgICAvKirojrflj5blr7nosaHnmoTntKLlvJXlgLwgKi9cbiAgICBwdWJsaWMgaW5kZXhPZih2YWx1ZSA6IGFueSkgOiBudW1iZXJcbiAgICB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy52YWx1ZXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy52YWx1ZXNbaV0gPT09IHZhbHVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOivjeWFuOS4reayoeacieivpeWAvFwiKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLyoq5riF6ZmkIOivjeWFuOS4reaMh+WumumUruWQjeeahOWJqiAqL1xuICAgIHB1YmxpYyByZW1vdmUoa2V5IDogYW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMua2V5c1tpXSA9PT0ga2V5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpXSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW2ldID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g56e76Zmk5oiQ5YqfXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOenu+mZpOWksei0pVwiKTtcbiAgICB9XG5cbiAgICAvKirmuIXpmaTmiYDmnInnmoTplK4gKi9cbiAgICBwdWJsaWMgY2xlYXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuICAgIH1cblxuICAgIC8qKuiOt+WPluWIl+ihqCAqL1xuICAgIHB1YmxpYyBnZXREaWNMaXN0KCkgOiB2b2lkXG4gICAge1xuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOAkFwiICsgaSArIFwi44CRLS0tLS0tLS0tLS1rZXk6XCIgKyB0aGlzLmtleXNbaV0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YWx1ZVwiLHRoaXMudmFsdWVzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKuiOt+WPlumUruWAvOaVsOe7hCAqL1xuICAgIHB1YmxpYyBnZXRWYWx1ZXNBcnIoKSA6IEFycmF5PGFueT5cbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcztcbiAgICB9XG5cbiAgICAvKirojrflj5bplK7lkI3mlbDnu4QgKi9cbiAgICBwdWJsaWMgZ2V0S2V5c0FycigpIDogQXJyYXk8YW55PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5cztcbiAgICB9XG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vdWkvbGF5YU1heFVJXCI7XG5pbXBvcnQgTWVzc2FnZU1hbmFnZXIgZnJvbSBcIi4uL0NvcmUvTWVzc2FnZU1hbmFnZXJcIjtcblxuLyoqXG4gKiDkuK3pl7TlrZdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXRNc2cgZXh0ZW5kcyB1aS5EaWFsb2dfLkZsb2F0TXNnVUl7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBcbiAgICBvbkVuYWJsZSgpe1xuICAgICAgICB0aGlzLmFkZEV2ZW50KCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5hbmkxLnN0b3AoKTtcbiAgICAgICAgdGhpcy5zcF9mbG9hdE1zZy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRXZlbnQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25IaWRkZW4pO1xuICAgICAgICB0aGlzLmFuaTEub24oTGF5YS5FdmVudC5DT01QTEVURSx0aGlzLHRoaXMub25IaWRkZW4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOaYvuekuua2iOaBr+mjmOWtl1xuICAgICAqIEBwYXJhbSB0ZXh0IOaYvuekuuaWh+acrCDjgJDmnIDlpJoyOOS4quOAkVxuICAgICAqIEBwYXJhbSBwb3MgIOS9jee9rnt4OjEwMCx5OjEwMH1cbiAgICAgKi9cbiAgICBwdWJsaWMgc2hvd01zZyh0ZXh0OnN0cmluZyxwb3M6YW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubGFiX2Zsb2F0TXNnLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnggPSBwb3MueDtcbiAgICAgICAgdGhpcy55ID0gcG9zLnk7XG4gICAgICAgIHRoaXMuYW5pMS5wbGF5KDAsZmFsc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25IaWRkZW4oKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuYW5pMS5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsdGhpcyk7XG4gICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5jb3VudEZsb2F0TXNnLS07XG4gICAgfVxufSIsIi8qKlxuICog5bCP5bel5YW3XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2x7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5bGP5bmV5rC05bmz5Lit5b+DIOaoquWdkOagh1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2VudGVyWCgpIDogYW55XG4gICAge1xuICAgICAgICByZXR1cm4gNzUwLyhMYXlhLkJyb3dzZXIuY2xpZW50SGVpZ2h0L0xheWEuQnJvd3Nlci5jbGllbnRXaWR0aCkvMjsvL+Wxj+W5leWuveW6plxuICAgIH1cbn1cbiIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xuaW1wb3J0IERpYWxvZz1MYXlhLkRpYWxvZztcbmltcG9ydCBTY2VuZT1MYXlhLlNjZW5lO1xuZXhwb3J0IG1vZHVsZSB1aS5EaWFsb2dfIHtcclxuICAgIGV4cG9ydCBjbGFzcyBGbG9hdE1zZ1VJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGFuaTE6TGF5YS5GcmFtZUFuaW1hdGlvbjtcblx0XHRwdWJsaWMgc3BfZmxvYXRNc2c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGxhYl9mbG9hdE1zZzpMYXlhLkxhYmVsO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiRGlhbG9nXy9GbG9hdE1zZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aS5HYW1lIHtcclxuICAgIGV4cG9ydCBjbGFzcyBHYW1lVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgZ2FtZTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZHM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2QxOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZDM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2Q0OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXYWxsczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgVXBXYWxsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBEb3duV2FsbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgR3JvdXBzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9kb29yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2Rvb3I6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJvYWQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxfb2ZmOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxfb246TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNob3ZlbGJnOkxheWEuU3ByaXRlO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiR2FtZS9HYW1lXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgbW9kdWxlIHVpLkdhbWVMb2JieSB7XHJcbiAgICBleHBvcnQgY2xhc3MgR2FtZUxvYmJ5VUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtUGFuZWw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJ0bl9QVlA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1vZGVDaG9vc2VQYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgdGV4dF8xVjE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGJ0bl8xVjE6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIHRleHRfNVY1OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBidG5fNVY1OkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fYmFjazpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTWF0Y2hpbmdTdWNjZXNzUGFuZWw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYnRuX2VudGVyZ2FtZTpMYXlhLkJ1dHRvbjtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIkdhbWVMb2JieS9HYW1lTG9iYnlcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFBsYXllckxvYWRpbmdVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBsb2FkaW5nYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfMTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzI6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl8zOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfNDpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl8yOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfMzpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzQ6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl81OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzTDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NUOkxheWEuTGFiZWw7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJQbGF5ZXJMb2FkaW5nXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgbW9kdWxlIHVpLldlbGNvbWUge1xyXG4gICAgZXhwb3J0IGNsYXNzIExvZ2luVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgYW5pMTpMYXlhLkZyYW1lQW5pbWF0aW9uO1xuXHRcdHB1YmxpYyBzcF9sb2dpbkJveDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaW5wdXRfdXNlck5hbWU6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGlucHV0X3VzZXJLZXk6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGxhYl90aXRsZTpMYXlhLkxhYmVsO1xuXHRcdHB1YmxpYyBidG5fbG9naW46TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl9yZWdpc3RlcjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3M6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NMOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1Q6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgc3BfZ2FtZU5hbWU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIHNwX3JlZ2lzdGVyQm94OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3RlclVzZXJOYW1lOkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3RlclVzZXJLZXk6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGJ0bl90b0xvZ2luOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fdG9SZWdpc3RlcjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgaW5wdXRfcmVnaXN0ZXJOaWNrTmFtZTpMYXlhLlRleHRJbnB1dDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIldlbGNvbWUvTG9naW5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHIiXX0=
