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
},{"../../Core/Const/GameConfig":10,"../../Core/Net/WebSocketManager":16,"../../ui/layaMaxUI":26,"../GameLobby/handler/MatchHandler":2}],2:[function(require,module,exports){
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
},{"../../../Core/Net/SocketHandler":15,"../../../Core/Net/WebSocketManager":16}],3:[function(require,module,exports){
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
        var sp = new Laya.Sprite();
        sp.graphics.drawTexture(Laya.loader.getRes("game/mud.png"));
        sp.autoSize = true;
        Laya.stage.addChild(sp);
        sp.on(Laya.Event.CLICK, this, this.check);
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
},{"../../ui/layaMaxUI":26,"./GrassFactory":5}],4:[function(require,module,exports){
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
        this.sp.on(Laya.Event.CLICK, this, this.changeImg);
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
            }
        }
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
            //图集加载
            { url: "res/atlas/game.atlas" },
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
},{"../../ui/layaMaxUI":26}],7:[function(require,module,exports){
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
        //测试
        console.log(ConfigManager_1.default.ins.getConfigById("monster", 1));
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
},{"../../Core/ConfigManager":9,"../../Core/Const/GameConfig":10,"../../Core/MessageManager":11,"../../Core/Net/ClientSender":12,"../../Core/Net/WebSocketManager":16,"../../Tool/Tool":25,"../../ui/layaMaxUI":26,"./handler/UserLoginHandler":8}],8:[function(require,module,exports){
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
},{"../../../Core/Net/SocketHandler":15,"../../../Core/Net/WebSocketManager":16}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefenderConfig_1 = require("../Data/Config/DefenderConfig");
var MosnterConfigr_1 = require("../Data/Config/MosnterConfigr");
/**
 * 配置加载器
 */
var ConfigManager = /** @class */ (function () {
    function ConfigManager() {
    }
    /**
     * 配置注册
     *
     * 1、写下json名字，对应的 配置类
     *
     * 标识
     */
    ConfigManager.prototype.getClass = function (name, data) {
        switch (name) {
            case "defender": return new DefenderConfig_1.default(data);
            case "monster": return new MosnterConfigr_1.default(data);
        }
    };
    /**
     * Json配置获取
     *
     * 写需要获取的配置文件
     */
    ConfigManager.prototype.loadConfig = function () {
        var arr = [
            { "defender": "outside/config/gameConfig/defender.json" },
            { "monster": "outside/config/gameConfig/monster.json" }
        ];
        this.loadObj(arr);
    };
    /**
     * 资源加载
     */
    ConfigManager.prototype.loadObj = function (arr) {
        var obj;
        var name;
        for (var i = 0; i < arr.length; i++) {
            obj = arr[i];
            name = Object.keys(obj)[0];
            this[name + "Config"] = Laya.loader.getRes(obj[name]);
        }
    };
    /**
     * 获取配置 @configNmae : Json文件名  @想获取什么怪物id
     */
    ConfigManager.prototype.getConfigById = function (configName, configId) {
        var configObj = this[configName + "Config"];
        var typeArr = [];
        for (var i = 0; i < configObj.length; i++) {
            var obj = configObj[i];
            if (obj[configName + "Id"] == configId) {
                return this.getClass(configName, obj);
            }
        }
    };
    ConfigManager.ins = new ConfigManager();
    return ConfigManager;
}());
exports.default = ConfigManager;
},{"../Data/Config/DefenderConfig":17,"../Data/Config/MosnterConfigr":18}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 游戏配置
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    /**ip*/
    // public static IP : string = "47.107.169.244";
    /**端口 */
    // public static PORT : number = 7777  ;
    // /**ip - 本地测试*/
    GameConfig.IP = "127.0.0.1";
    // /**端口 - 本地测试*/
    GameConfig.PORT = 7777;
    return GameConfig;
}());
exports.GameConfig = GameConfig;
/**协议 */
var Protocol = /** @class */ (function () {
    function Protocol() {
    }
    //****************UserProto.proto
    /**请求 msgId = 101103 */
    Protocol.REQ_USER_LOGIN = 101103;
    /**101104 注册请求 */
    Protocol.REQ_USER_REGISTER = 101104;
    /**响应 msgId = 101203 */
    Protocol.RES_USER_LOGIN = 101203;
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
},{}],11:[function(require,module,exports){
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
},{"../Tool/FloatMsg":24,"../Tool/Tool":25}],12:[function(require,module,exports){
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
},{"../Const/GameConfig":10,"./WebSocketManager":16}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"./WebSocketManager":16}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"../../Tool/Dictionary":23,"./PackageIn":13,"./PackageOut":14}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseConfig_1 = require("./baseConfig");
/**
 * 防御塔数据模型
 */
var DefenderConfig = /** @class */ (function (_super) {
    __extends(DefenderConfig, _super);
    function DefenderConfig(data) {
        return _super.call(this, data) || this;
    }
    return DefenderConfig;
}(baseConfig_1.default));
exports.default = DefenderConfig;
},{"./baseConfig":19}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseConfig_1 = require("./baseConfig");
/**
 * 怪物数据模型
 */
var MonsterConfig = /** @class */ (function (_super) {
    __extends(MonsterConfig, _super);
    function MonsterConfig(data) {
        return _super.call(this, data) || this;
    }
    return MonsterConfig;
}(baseConfig_1.default));
exports.default = MonsterConfig;
},{"./baseConfig":19}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 基础数据结构
 */
var baseConfig = /** @class */ (function () {
    function baseConfig(data) {
        var arr = Object.keys(data);
        for (var i = 0; i < arr.length; i++) {
            this[arr[i]] = data[arr[i]];
        }
    }
    return baseConfig;
}());
exports.default = baseConfig;
},{}],20:[function(require,module,exports){
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
},{"./Controller/Game/GameController":3,"./Controller/GameLobby/GameLobbyController":1,"./Controller/Loading/LoadingController":6,"./Controller/WelCome/WelComeController":7}],21:[function(require,module,exports){
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
},{"./GameConfig":20}],22:[function(require,module,exports){
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
},{"./GameConfig":20,"./GameEnter":21}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{"../Core/MessageManager":11,"../ui/layaMaxUI":26}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}]},{},[22])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL+adgui0p+mTui9MYXlhQWlySURFX2JldGEvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9HcmFzcy50cyIsInNyYy9Db250cm9sbGVyL0dhbWUvR3Jhc3NGYWN0b3J5LnRzIiwic3JjL0NvbnRyb2xsZXIvTG9hZGluZy9Mb2FkaW5nQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9XZWxDb21lL2hhbmRsZXIvVXNlckxvZ2luSGFuZGxlci50cyIsInNyYy9Db3JlL0NvbmZpZ01hbmFnZXIudHMiLCJzcmMvQ29yZS9Db25zdC9HYW1lQ29uZmlnLnRzIiwic3JjL0NvcmUvTWVzc2FnZU1hbmFnZXIudHMiLCJzcmMvQ29yZS9OZXQvQ2xpZW50U2VuZGVyLnRzIiwic3JjL0NvcmUvTmV0L1BhY2thZ2VJbi50cyIsInNyYy9Db3JlL05ldC9QYWNrYWdlT3V0LnRzIiwic3JjL0NvcmUvTmV0L1NvY2tldEhhbmRsZXIudHMiLCJzcmMvQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlci50cyIsInNyYy9EYXRhL0NvbmZpZy9EZWZlbmRlckNvbmZpZy50cyIsInNyYy9EYXRhL0NvbmZpZy9Nb3NudGVyQ29uZmlnci50cyIsInNyYy9EYXRhL0NvbmZpZy9iYXNlQ29uZmlnLnRzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvR2FtZUVudGVyLnRzIiwic3JjL01haW4udHMiLCJzcmMvVG9vbC9EaWN0aW9uYXJ5LnRzIiwic3JjL1Rvb2wvRmxvYXRNc2cudHMiLCJzcmMvVG9vbC9Ub29sLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSxnREFBd0M7QUFDeEMsb0VBQStEO0FBQy9ELDBEQUFtRTtBQUNuRSxrRUFBNkQ7QUFFN0Q7SUFBaUQsdUNBQXdCO0lBQ3JFO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBRUQsUUFBUTtJQUNSLHNDQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELE9BQU87SUFDUCx1Q0FBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxVQUFVO0lBQ0YsdUNBQVMsR0FBakI7UUFFSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDakUsMEJBQWdCLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxxQkFBUSxDQUFDLGNBQWMsRUFBQyxJQUFJLHNCQUFZLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQzdHLENBQUM7SUFFTywwQ0FBWSxHQUFwQjtRQUVJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkQsMEJBQWdCLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLHFCQUFRLENBQUMsY0FBYyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFHRCxpQkFBaUI7SUFDVCx1Q0FBUyxHQUFqQjtRQUVJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUM7SUFDdEMsQ0FBQztJQUVELFdBQVc7SUFDSCw0Q0FBYyxHQUF0QixVQUF1QixJQUFJO1FBRXZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLElBQUcsSUFBSSxLQUFLLFNBQVMsRUFDckI7WUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUM5QztJQUNMLENBQUM7SUFFRCxlQUFlO0lBQ1AsbUNBQUssR0FBYjtRQUVHLDhCQUE4QjtRQUM5QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELGVBQWU7SUFDUCxtQ0FBSyxHQUFiO0lBR0EsQ0FBQztJQUVELGNBQWM7SUFDTixvQ0FBTSxHQUFkO1FBRUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFDLEtBQUssQ0FBQztJQUN2QyxDQUFDO0lBRUQscUJBQXFCO0lBQ2IseUNBQVcsR0FBbkI7UUFFSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQztRQUN2QyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBQyxLQUFLLENBQUM7SUFDdkMsQ0FBQztJQUVELFVBQVU7SUFDRiw0Q0FBYyxHQUF0QjtRQUVJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUdMLDBCQUFDO0FBQUQsQ0FwRkEsQUFvRkMsQ0FwRmdELGNBQUUsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQW9GeEU7Ozs7O0FDekZELGlFQUE0RDtBQUM1RCx1RUFBa0U7QUFFbEU7O0dBRUc7QUFDSDtJQUEwQyxnQ0FBYTtJQUVuRCxzQkFBWSxNQUFVLEVBQUMsUUFBd0I7UUFBeEIseUJBQUEsRUFBQSxlQUF3QjtlQUMzQyxrQkFBTSxNQUFNLEVBQUMsUUFBUSxDQUFDO0lBQzFCLENBQUM7SUFFTyw4QkFBTyxHQUFkLFVBQWUsSUFBSTtRQUVoQixJQUFJLFlBQVksR0FBTywwQkFBZ0IsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0UsSUFBSSxPQUFPLEdBQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxpQkFBTSxPQUFPLFlBQUMsT0FBTyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNELFVBQVU7SUFDQSw4QkFBTyxHQUFqQixVQUFrQixPQUFPO1FBRXJCLGlCQUFNLE9BQU8sWUFBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQWpCQSxBQWlCQyxDQWpCeUMsdUJBQWEsR0FpQnREOzs7OztBQ3ZCRCxnREFBd0M7QUFDeEMsK0NBQTBDO0FBQzFDO0lBQTRDLGtDQUFjO0lBYXREO1FBQUEsWUFDSSxpQkFBTyxTQUdWO1FBRkcsS0FBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLHNCQUFZLENBQUMsS0FBSyxFQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxLQUFJLENBQUMsT0FBTyxHQUFDLElBQUksc0JBQVksQ0FBQyxNQUFNLEVBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUNwRCxDQUFDO0lBRUQsaUNBQVEsR0FBUjtRQUVJLElBQUksQ0FBQyxJQUFJLEdBQUMsS0FBSyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxVQUFVO0lBQ0YsZ0NBQU8sR0FBZjtRQUVHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQztRQUNmLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUUsQ0FBQyxJQUFJLEVBQ3JCO1lBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoRDtJQUNKLENBQUM7SUFFRCxZQUFZO0lBQ0osa0NBQVMsR0FBakI7UUFFSSxJQUFHLElBQUksQ0FBQyxJQUFJLElBQUUsTUFBTSxFQUNwQjtZQUNHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUMxQjthQUVEO1lBQ0csSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUMsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUMsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixxQkFBcUI7UUFFckIsSUFBSSxFQUFFLEdBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM1RCxFQUFFLENBQUMsUUFBUSxHQUFDLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QixFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELFVBQVU7SUFDRixrQ0FBUyxHQUFqQjtRQUVJLDZEQUE2RDtRQUM3RCx5REFBeUQ7UUFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUVuRSxDQUFDO0lBRUQsOEJBQUssR0FBTDtRQUVJLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUNELHdGQUF3RjtJQUN4RixVQUFVO0lBQ0Ysb0NBQVcsR0FBbkI7UUFFSSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNELElBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUNwQjtZQUNJLElBQUksQ0FBQyxhQUFhLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDeEM7SUFDTCxDQUFDO0lBRUQsVUFBVTtJQUNGLG9DQUFXLEdBQW5CO1FBRUksZ0JBQWdCO1FBQ2hCLElBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUNwQjtZQUNJLElBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLGFBQWEsRUFDdkM7Z0JBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUUsRUFBRSxDQUFDO2dCQUNoQixJQUFJLENBQUMsYUFBYSxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2FBQ3hDO2lCQUNJLElBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLGFBQWEsRUFDNUM7Z0JBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUUsRUFBRSxDQUFDO2dCQUNoQixJQUFJLENBQUMsYUFBYSxHQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2FBQ3hDO1lBQ0QsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBRSxDQUFDLEVBQ2pCO2dCQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzthQUNqQjtpQkFDSSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFFLENBQUMsSUFBSSxFQUMxQjtnQkFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLElBQUksQ0FBQzthQUNyQjtTQUNKO0lBQ0wsQ0FBQztJQUVELFVBQVU7SUFDRixrQ0FBUyxHQUFqQjtRQUVJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELG1GQUFtRjtJQUNuRixlQUFlO0lBQ1AscUNBQVksR0FBcEI7UUFFSSxJQUFJLENBQUMsV0FBVyxHQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDL0MscUJBQXFCO0lBQ3pCLENBQUM7SUFFRCxnQkFBZ0I7SUFDUixvQ0FBVyxHQUFuQjtRQUVJOzs7Ozs7Ozs7OztXQVdHO0lBQ1AsQ0FBQztJQUdMLHFCQUFDO0FBQUQsQ0FuSkEsQUFtSkMsQ0FuSjJDLGNBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQW1KekQ7Ozs7O0FDckpEO0lBT0ksZUFBWSxHQUFVLEVBQUMsSUFBZ0I7UUFFbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELFNBQVM7SUFDRCxvQkFBSSxHQUFaLFVBQWEsR0FBVSxFQUFDLElBQWdCO1FBRXBDLElBQUksQ0FBQyxHQUFHLEdBQUMsR0FBRyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssR0FBQyxLQUFLLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFDLEdBQUcsR0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxHQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxrQkFBa0I7SUFDWCx5QkFBUyxHQUFoQjtRQUVJLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsSUFBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQ2Q7WUFDSSxJQUFJLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsS0FBSyxHQUFDLElBQUksQ0FBQztTQUNuQjthQUVEO1lBQ0ksSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBQyxJQUFJLENBQUMsR0FBRyxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDL0UsSUFBSSxDQUFDLEtBQUssR0FBQyxLQUFLLENBQUM7U0FDcEI7SUFDTCxDQUFDO0lBRUwsWUFBQztBQUFELENBekNBLEFBeUNDLElBQUE7Ozs7O0FDekNELGlDQUE0QjtBQUM1QjtJQUdJLHNCQUFZLElBQVcsRUFBQyxJQUFnQjtRQUVwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixFQUFDLGlCQUFpQixFQUFDLGNBQWMsQ0FBQyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZJLENBQUM7SUFFRCxVQUFVO0lBQ0YsdUNBQWdCLEdBQXhCLFVBQXlCLElBQVcsRUFBQyxJQUFnQjtRQUVqRCxJQUFJLENBQUMsVUFBVSxHQUFDLElBQUksS0FBSyxFQUFTLENBQUM7UUFDbkMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFDbkI7WUFDSSxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxFQUNwQjtnQkFDSSxJQUFJLEtBQUssU0FBQSxDQUFDO2dCQUNWLElBQUcsQ0FBQyxHQUFDLENBQUMsSUFBRSxDQUFDLEVBQ1Q7b0JBQ0ksS0FBSyxHQUFDLElBQUksZUFBSyxDQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDO2lCQUMvQjtxQkFFRDtvQkFDSSxLQUFLLEdBQUMsSUFBSSxlQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsQ0FBQztpQkFDbkM7Z0JBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzVCLElBQUcsSUFBSSxJQUFFLEtBQUssRUFDZDtvQkFDSSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUMsR0FBRyxHQUFDLENBQUMsRUFBQyxFQUFFLEdBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwQztxQkFFRDtvQkFDSSxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUMsR0FBRyxHQUFDLENBQUMsRUFBQyxFQUFFLEdBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNyQzthQUVKO1NBQ0o7SUFFTCxDQUFDO0lBQ0wsbUJBQUM7QUFBRCxDQXZDQSxBQXVDQyxJQUFBOzs7OztBQ3hDRCxnREFBd0M7QUFFeEM7SUFBK0MscUNBQWtCO0lBRzdEO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBRUQsb0NBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsY0FBYztJQUNOLHNDQUFVLEdBQWxCO1FBRUksSUFBSSxHQUFHLEdBQUc7WUFDTixNQUFNO1lBQ04sRUFBQyxHQUFHLEVBQUMsc0JBQXNCLEVBQUM7U0FDL0IsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNyRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELFVBQVU7SUFDRixxQ0FBUyxHQUFqQixVQUFrQixHQUFHO1FBRWpCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM3QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUM7UUFDOUIsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFDLEdBQUcsQ0FBQztRQUMxQixJQUFHLENBQUMsSUFBSSxDQUFDLGVBQWU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUMsR0FBRyxDQUFDLEdBQUcsaUJBQWlCLENBQUM7O1lBQzVGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBQyxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUM7SUFDdEYsQ0FBQztJQUVELFVBQVU7SUFDRixrQ0FBTSxHQUFkO1FBRUksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxVQUFVO0lBQ0YscUNBQVMsR0FBakI7UUFFSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDTCx3QkFBQztBQUFELENBOUNBLEFBOENDLENBOUM4QyxjQUFFLENBQUMsZUFBZSxHQThDaEU7Ozs7O0FDaERELGdEQUF3QztBQUN4QyxvRUFBK0Q7QUFDL0QsMERBQW1FO0FBQ25FLCtEQUEwRDtBQUMxRCw0REFBdUQ7QUFDdkQsd0NBQW1DO0FBQ25DLDREQUF1RDtBQUN2RCwwREFBcUQ7QUFFckQ7SUFBK0MscUNBQWtCO0lBRzdEO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBQ0QsaUJBQWlCO0lBQ2pCLFFBQVE7SUFDUixvQ0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUEsT0FBTztRQUM1QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELE9BQU87SUFDUCxxQ0FBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFHRCxjQUFjO0lBQ2QsV0FBVztJQUNILG9DQUFRLEdBQWhCO1FBRUksSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUNELFVBQVU7SUFDRixxQ0FBUyxHQUFqQjtRQUVJLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDL0QsMEJBQWdCLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxxQkFBUSxDQUFDLGNBQWMsRUFBQyxJQUFJLDBCQUFnQixDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNqSCxDQUFDO0lBRU8sd0NBQVksR0FBcEI7UUFFSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELDBCQUFnQixDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxxQkFBUSxDQUFDLGNBQWMsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsVUFBVTtJQUNGLHFDQUFTLEdBQWpCO1FBRUksSUFBSSxNQUFNLEdBQUcsY0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUEsTUFBTTtRQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLENBQUM7SUFFTyxzQ0FBVSxHQUFsQjtRQUVJLElBQUksR0FBRyxHQUFHO1lBQ04sRUFBQyxHQUFHLEVBQUMsOEJBQThCLEVBQUM7WUFDcEMsTUFBTTtZQUNOLEVBQUMsR0FBRyxFQUFDLHlDQUF5QyxFQUFDO1lBQy9DLEVBQUMsR0FBRyxFQUFDLHdDQUF3QyxFQUFDO1NBQ2pELENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUVELFVBQVU7SUFDRixxQ0FBUyxHQUFqQixVQUFrQixHQUFHO1FBRWpCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUM3QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUM7UUFDOUIsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFDLEdBQUcsQ0FBQztRQUMxQixJQUFHLENBQUMsSUFBSSxDQUFDLGVBQWU7WUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUMsR0FBRyxDQUFDLEdBQUcsaUJBQWlCLENBQUM7O1lBQzVGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBQyxHQUFHLENBQUMsR0FBRyxlQUFlLENBQUM7SUFDdEYsQ0FBQztJQUVELFVBQVU7SUFDRixrQ0FBTSxHQUFkO1FBRUksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLHdCQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2pDLE1BQU07UUFDTix1QkFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMvQixJQUFJO1FBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELFdBQVc7SUFDSCx3Q0FBWSxHQUFwQjtRQUVJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM3RSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDckMsQ0FBQztJQUVELFVBQVU7SUFDRixtQ0FBTyxHQUFmO1FBRUksOEVBQThFO1FBQzlFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELFVBQVU7SUFDRixzQ0FBVSxHQUFsQjtRQUVJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN2QyxDQUFDO0lBRUQsYUFBYTtJQUNMLHFDQUFTLEdBQWpCO1FBRUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxXQUFXO0lBQ0gsd0NBQVksR0FBcEI7UUFFSSxzQkFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BJLENBQUM7SUFFRCxXQUFXO0lBQ0gsMENBQWMsR0FBdEIsVUFBdUIsSUFBSTtRQUV2QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xCLElBQUcsSUFBSSxLQUFLLFNBQVMsRUFDckI7WUFDSSxJQUFJLElBQUksR0FBRyxZQUFZLENBQUE7WUFDdkIsSUFBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU87Z0JBQUUsSUFBSSxHQUFHLGVBQWUsQ0FBQztZQUN2RCx3QkFBYyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDN0M7SUFDTCxDQUFDO0lBRUQsV0FBVztJQUNILHlDQUFhLEdBQXJCO1FBRUksMEJBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBVSxDQUFDLEVBQUUsRUFBQyx1QkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCwwREFBMEQ7SUFDbEQsc0NBQVUsR0FBbEI7UUFFSSxlQUFlO1FBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQWxKQSxBQWtKQyxDQWxKOEMsY0FBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBa0poRTs7Ozs7QUMzSkQsaUVBQTREO0FBQzVELHVFQUFrRTtBQUVsRTs7R0FFRztBQUNIO0lBQThDLG9DQUFhO0lBRXZELDBCQUFZLE1BQVUsRUFBQyxRQUF3QjtRQUF4Qix5QkFBQSxFQUFBLGVBQXdCO2VBQzNDLGtCQUFNLE1BQU0sRUFBQyxRQUFRLENBQUM7SUFDMUIsQ0FBQztJQUVPLGtDQUFPLEdBQWQsVUFBZSxJQUFJO1FBRWhCLElBQUksWUFBWSxHQUFPLDBCQUFnQixDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RSxJQUFJLE9BQU8sR0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLGlCQUFNLE9BQU8sWUFBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0QsVUFBVTtJQUNBLGtDQUFPLEdBQWpCLFVBQWtCLE9BQU87UUFFckIsaUJBQU0sT0FBTyxZQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDTCx1QkFBQztBQUFELENBakJBLEFBaUJDLENBakI2Qyx1QkFBYSxHQWlCMUQ7Ozs7O0FDdkJELGdFQUEyRDtBQUMzRCxnRUFBMEQ7QUFFMUQ7O0dBRUc7QUFDSDtJQVdJO0lBRUEsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLGdDQUFRLEdBQWYsVUFBZ0IsSUFBSSxFQUFDLElBQUk7UUFFckIsUUFBTyxJQUFJLEVBQUM7WUFDUixLQUFLLFVBQVUsQ0FBQyxDQUFDLE9BQU8sSUFBSSx3QkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pELEtBQUssU0FBUyxDQUFDLENBQUMsT0FBTyxJQUFJLHdCQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEQ7SUFDTCxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNJLGtDQUFVLEdBQWpCO1FBRUksSUFBSSxHQUFHLEdBQUM7WUFDSixFQUFDLFVBQVUsRUFBQyx5Q0FBeUMsRUFBQztZQUN0RCxFQUFDLFNBQVMsRUFBQyx3Q0FBd0MsRUFBQztTQUN2RCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBQ0Q7O09BRUc7SUFDSywrQkFBTyxHQUFmLFVBQWdCLEdBQUc7UUFFZixJQUFJLEdBQUcsQ0FBQztRQUNSLElBQUksSUFBSSxDQUFDO1FBQ1QsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7WUFDekIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDdkQ7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxxQ0FBYSxHQUFwQixVQUFxQixVQUFVLEVBQUMsUUFBUTtRQUVwQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsU0FBUyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztZQUMvQixJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBRyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBQztnQkFDbEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBQyxHQUFHLENBQUMsQ0FBQzthQUN4QztTQUNKO0lBQ0wsQ0FBQztJQXBFYSxpQkFBRyxHQUFtQixJQUFJLGFBQWEsRUFBRSxDQUFDO0lBc0U1RCxvQkFBQztDQXZFRCxBQXVFQyxJQUFBO2tCQXZFb0IsYUFBYTs7OztBQ05sQzs7RUFFRTtBQUNGO0lBVUk7SUFFQSxDQUFDO0lBWEQsT0FBTztJQUNQLGdEQUFnRDtJQUNoRCxRQUFRO0lBQ1Isd0NBQXdDO0lBQ3hDLGlCQUFpQjtJQUNILGFBQUUsR0FBWSxXQUFXLENBQUM7SUFDeEMsaUJBQWlCO0lBQ0gsZUFBSSxHQUFZLElBQUksQ0FBQztJQUt2QyxpQkFBQztDQWJELEFBYUMsSUFBQTtBQWJZLGdDQUFVO0FBZXZCLFFBQVE7QUFDUjtJQUFBO0lBNlNBLENBQUM7SUE1U0ksaUNBQWlDO0lBQ2xDLHVCQUF1QjtJQUNULHVCQUFjLEdBQVksTUFBTSxDQUFDO0lBQy9DLGlCQUFpQjtJQUNILDBCQUFpQixHQUFZLE1BQU0sQ0FBQztJQUVsRCx1QkFBdUI7SUFDVCx1QkFBYyxHQUFZLE1BQU0sQ0FBQztJQU8vQyxnQ0FBZ0M7SUFDaEMsZUFBZTtJQUNmLDRDQUE0QztJQUU1QyxrQ0FBa0M7SUFDbEMsaUJBQWlCO0lBQ2pCLG1EQUFtRDtJQUNuRCxtQkFBbUI7SUFDbkIsZ0RBQWdEO0lBRWhELDJCQUEyQjtJQUMzQixtQkFBbUI7SUFDbkIsaURBQWlEO0lBQ2pELG9CQUFvQjtJQUNwQixrREFBa0Q7SUFDbEQsbUJBQW1CO0lBQ25CLG1EQUFtRDtJQUVuRCxtQ0FBbUM7SUFDbkMsZ0JBQWdCO0lBQ2hCLGdEQUFnRDtJQUNoRCxjQUFjO0lBQ2QsK0NBQStDO0lBQy9DLGVBQWU7SUFDZixtREFBbUQ7SUFDbkQsMkJBQTJCO0lBQzNCLGFBQWE7SUFDYixnREFBZ0Q7SUFDaEQsaUJBQWlCO0lBQ2pCLGlEQUFpRDtJQUNqRCxlQUFlO0lBQ2YsaURBQWlEO0lBSWpELGtCQUFrQjtJQUNKLGtCQUFTLEdBQVEsTUFBTSxDQUFDO0lBQ3RDLG1CQUFtQjtJQUNMLHlCQUFnQixHQUFRLE1BQU0sQ0FBQztJQUM3QyxtQ0FBbUM7SUFDckIsdUJBQWMsR0FBWSxNQUFNLENBQUM7SUFDL0MsOEJBQThCO0lBQ2hCLDhCQUFxQixHQUFZLEtBQUssQ0FBQztJQW9QekQsZUFBQztDQTdTRCxBQTZTQyxJQUFBO0FBN1NZLDRCQUFROzs7O0FDbkJyQiw2Q0FBd0M7QUFDeEMscUNBQWdDO0FBRWhDOztHQUVHO0FBQ0g7SUFLSTtRQUNJLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7T0FFRztJQUNJLG9DQUFXLEdBQWxCO1FBRUksSUFBSSxRQUFRLEdBQUcsSUFBSSxrQkFBUSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxxQ0FBWSxHQUFuQixVQUFvQixJQUFXO1FBRTNCLElBQUksUUFBUSxHQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkUsSUFBRyxRQUFRLEtBQU0sSUFBSSxFQUNyQjtZQUNJLFFBQVEsR0FBRyxJQUFJLGtCQUFRLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqQztRQUNELFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUMvQixRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBQyxFQUFDLENBQUMsRUFBQyxjQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFuQ0QsUUFBUTtJQUNNLGtCQUFHLEdBQW9CLElBQUksY0FBYyxDQUFDO0lBb0M1RCxxQkFBQztDQXRDRCxBQXNDQyxJQUFBO2tCQXRDb0IsY0FBYzs7OztBQ05uQyx1REFBa0Q7QUFDbEQsa0RBQStDO0FBRS9DOztFQUVFO0FBQ0Y7SUFFSTtJQUVBLENBQUM7SUFFRDs7OztNQUlFO0lBQ1kseUJBQVksR0FBMUIsVUFBMkIsUUFBZSxFQUFDLE9BQWM7UUFFckQsSUFBSSxZQUFZLEdBQU8sMEJBQWdCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdFLElBQUksT0FBTyxHQUFPLEVBQUUsQ0FBQztRQUNyQixPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUM1QixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMxQixJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25ELDBCQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQVEsQ0FBQyxjQUFjLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUdEOzs7OztNQUtFO0lBQ1ksNEJBQWUsR0FBN0IsVUFBOEIsUUFBZSxFQUFDLE9BQWMsRUFBQyxZQUFtQjtRQUU1RSxJQUFJLGVBQWUsR0FBTywwQkFBZ0IsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNuRixJQUFJLE9BQU8sR0FBTyxFQUFFLENBQUM7UUFDckIsSUFBSSxRQUFRLEdBQU8sRUFBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzFCLFFBQVEsQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO1FBQ2pDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdEQsMEJBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBUSxDQUFDLGlCQUFpQixFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRDs7OztNQUlFO0lBQ1cscUJBQVEsR0FBdEIsVUFBdUIsTUFBYSxFQUFDLE9BQWM7UUFFL0MsSUFBSSxRQUFRLEdBQU8sMEJBQWdCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksT0FBTyxHQUFPLEVBQUUsQ0FBQztRQUNyQixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN4QixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMxQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQy9DLDBCQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMscUJBQVEsQ0FBQyxTQUFTLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDVywyQkFBYyxHQUE1QixVQUE2QixNQUFhLEVBQUMsU0FBZ0I7UUFFdkQsSUFBSSxjQUFjLEdBQU8sMEJBQWdCLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakYsSUFBSSxPQUFPLEdBQU8sRUFBRSxDQUFDO1FBQ3JCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzlCLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckQsMEJBQWdCLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBUSxDQUFDLGdCQUFnQixFQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUErc0JKLG1CQUFDO0FBQUQsQ0FyeEJBLEFBcXhCQyxJQUFBOzs7OztBQzN4QkQ7O0VBRUU7QUFDRjtJQUF1Qyw2QkFBUztJQUs1QztlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUNELHNDQUFzQztJQUN0QyxJQUFJO0lBQ0oscURBQXFEO0lBQ3JELG9CQUFvQjtJQUNwQixrQ0FBa0M7SUFDbEMsb0JBQW9CO0lBQ3BCLGNBQWM7SUFDZCxrQ0FBa0M7SUFDbEMsaUNBQWlDO0lBQ2pDLFdBQVc7SUFDWCxxQ0FBcUM7SUFDckMsa0NBQWtDO0lBQ2xDLGlDQUFpQztJQUNqQyxtQ0FBbUM7SUFDbkMsV0FBVztJQUNYLGtEQUFrRDtJQUNsRCw0Q0FBNEM7SUFFNUMsSUFBSTtJQUVKLEtBQUs7SUFDTCxzQ0FBc0M7SUFDdEMsSUFBSTtJQUNKLHFEQUFxRDtJQUNyRCxvQkFBb0I7SUFDcEIsa0NBQWtDO0lBQ2xDLG9CQUFvQjtJQUVwQixpQ0FBaUM7SUFDakMsa0NBQWtDO0lBQ2xDLFdBQVc7SUFDWCxrREFBa0Q7SUFDbEQsNENBQTRDO0lBRTVDLElBQUk7SUFDSixVQUFVO0lBQ0gsd0JBQUksR0FBWCxVQUFZLFFBQVE7UUFFaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBLFdBQVc7UUFDOUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRWIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzNCLElBQUk7UUFDSixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV6QyxDQUFDO0lBRUwsZ0JBQUM7QUFBRCxDQTNEQSxBQTJEQyxDQTNEc0MsSUFBSSxDQUFDLElBQUksR0EyRC9DOzs7OztBQzlERCx1REFBa0Q7QUFFbEQ7O0VBRUU7QUFDRjtJQUF3Qyw4QkFBUztJQU03QztlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUNELHlDQUF5QztJQUN6QyxJQUFJO0lBQ0oscURBQXFEO0lBQ3JELDRCQUE0QjtJQUM1QixzQkFBc0I7SUFDdEIseUNBQXlDO0lBQ3pDLDZDQUE2QztJQUM3QyxXQUFXO0lBQ1gsb0NBQW9DO0lBQ3BDLGlDQUFpQztJQUNqQyxpQ0FBaUM7SUFDakMsb0NBQW9DO0lBQ3BDLFlBQVk7SUFDWixlQUFlO0lBQ2YsUUFBUTtJQUNSLHVDQUF1QztJQUN2QyxRQUFRO0lBQ1IsSUFBSTtJQUVKLFNBQVM7SUFDRix5QkFBSSxHQUFYLFVBQVksR0FBRyxFQUFDLElBQVM7UUFFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBLFdBQVc7UUFFOUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFVLDBCQUFnQixDQUFDLFNBQVMsR0FBQyxHQUFHLEdBQUMsR0FBRyxDQUFDO1FBRXJELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQixJQUFHLElBQUksRUFDUDtZQUNJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQjtRQUVELDBCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFFO0lBQ2xDLENBQUM7SUFFTCxpQkFBQztBQUFELENBakRBLEFBaURDLENBakR1QyxJQUFJLENBQUMsSUFBSSxHQWlEaEQ7Ozs7O0FDdEREOztFQUVFO0FBQ0Y7SUFJSSx1QkFBWSxNQUFXLEVBQUMsUUFBa0I7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVNLCtCQUFPLEdBQWQsVUFBZSxJQUFTO1FBRXBCLG9DQUFvQztRQUNwQyxzQkFBc0I7UUFDdEIsSUFBSTtRQUNKLDBCQUEwQjtRQUMxQixJQUFJO1FBQ0osT0FBTztRQUNQLElBQUk7UUFDSiw2Q0FBNkM7UUFDN0MsSUFBSTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQztJQUNTLCtCQUFPLEdBQWpCLFVBQWtCLElBQVM7UUFFdkIsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQy9CO1lBQ0ksSUFBRyxJQUFJLEVBQ1A7Z0JBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQyxJQUFJLENBQUMsQ0FBQzthQUV4QztpQkFFRDtnQkFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDbkM7U0FDSjtJQUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBckNBLEFBcUNDLElBQUE7Ozs7O0FDeENELG9EQUErQztBQUUvQyx5Q0FBb0M7QUFDcEMsMkNBQXNDO0FBS3RDOztHQUVHO0FBQ0g7SUFRRztRQUNJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLG9CQUFVLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsc0JBQWtCLHVCQUFHO2FBQXJCO1lBQ0ksSUFBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFDcEI7Z0JBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUM7YUFDdEM7WUFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFFTSxrQ0FBTyxHQUFkLFVBQWUsRUFBUyxFQUFDLElBQVc7UUFFaEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RCxNQUFNO1FBQ04sSUFBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7WUFDZixJQUFJLFlBQVksR0FBRyxDQUFDLCtCQUErQixFQUFDLGdDQUFnQyxDQUFDLENBQUM7WUFDdEYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FFMUU7YUFFRDtZQUNJLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUQ7SUFDTCxDQUFDO0lBQ0QsaUJBQWlCO0lBQ1Ysc0NBQVcsR0FBbEI7UUFFSSxJQUFHLElBQUksQ0FBQyxTQUFTLEVBQ2pCO1lBQ0ksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRU8sNENBQWlCLEdBQXpCLFVBQTBCLEtBQUssRUFBQyxJQUFJO1FBRWhDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFDLEdBQUcsR0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0csQ0FBQztJQUNPLHdDQUFhLEdBQXJCO1FBRUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQSxXQUFXO1FBQzNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7UUFFNUMsZ0JBQWdCLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUM5QixnRkFBZ0Y7SUFDckYsQ0FBQztJQU1PLDJDQUFnQixHQUF4QixVQUF5QixPQUFPO1FBRTVCLEtBQUs7UUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUN0QixNQUFNO1FBQ04sSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRyxpR0FBaUc7UUFDakcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQSxXQUFXO1FBRTNELEtBQUs7UUFDTCxJQUFJLFNBQVMsR0FBYSxJQUFJLG1CQUFTLEVBQUUsQ0FBQztRQUMxQyxpRUFBaUU7UUFDakUsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUMsU0FBUyxDQUFDLEdBQUcsRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25FLElBQUcsU0FBUyxDQUFDLEdBQUcsSUFBSSxNQUFNLEVBQzFCO1lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNuQjtRQUNELElBQUksR0FBRyxHQUFVLEVBQUUsR0FBRSxTQUFTLENBQUMsR0FBRyxDQUFDO1FBQ25DLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsSUFBRyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ2xDO1lBQ0ksS0FBSSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsRUFBRSxFQUMxQztnQkFDSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QztZQUNELHNDQUFzQztZQUN0Qyw2Q0FBNkM7WUFFN0MsTUFBTTtTQUNUO1FBRUQsWUFBWTtRQUNaLElBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUMvQjtZQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2QyxJQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLE9BQU8sRUFDdEM7Z0JBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1NBQ0o7SUFFTCxDQUFDO0lBQ0QsVUFBVTtJQUNGLDJDQUFnQixHQUF4QixVQUF5QixHQUFVO1FBRS9CLElBQUksR0FBRyxHQUFVLEVBQUUsR0FBRSxHQUFHLENBQUM7UUFDekIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QyxJQUFHLFFBQVEsRUFDWDtZQUNJLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxhQUFhO2dCQUMxQixhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDNUIsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7SUFFTywyQ0FBZ0IsR0FBeEIsVUFBeUIsSUFBSTtRQUV6QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM1QyxpREFBaUQ7UUFFakQsSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQzNCO1lBQ0ksSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBQyxJQUFJO2FBQ3JDO2dCQUNJLElBQUksR0FBRyxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsR0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEMsT0FBTzthQUNWO1NBQ0o7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELGlFQUFpRTtRQUVqRSxJQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDL0I7WUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN0QixJQUFJLE9BQU8sR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsRCxJQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLE9BQU8sRUFDdEM7Z0JBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1NBQ0o7UUFNRCw2Q0FBNkM7UUFDN0Msd0JBQXdCO1FBRXhCLGlEQUFpRDtRQUNqRCxzQ0FBc0M7UUFDdEMsaURBQWlEO1FBQ2pELHNDQUFzQztRQUN0Qyw2Q0FBNkM7UUFDN0MsTUFBTTtJQUVWLENBQUM7SUFDTyx5Q0FBYyxHQUF0QjtRQUVLLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ08seUNBQWMsR0FBdEI7UUFFSyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUNEOzs7O09BSUc7SUFDSSxrQ0FBTyxHQUFkLFVBQWUsR0FBVSxFQUFDLElBQVM7UUFFL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsR0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFJLFVBQVUsR0FBYyxJQUFJLG9CQUFVLEVBQUUsQ0FBQztRQUM3QyxvQ0FBb0M7UUFDcEMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDRDs7OztPQUlHO0lBQ0ksMkNBQWdCLEdBQXZCLFVBQXdCLFFBQWU7UUFFbkMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsUUFBUTtJQUNELDBDQUFlLEdBQXRCLFVBQXVCLEdBQVUsRUFBQyxPQUFxQjtRQUVuRCxxQ0FBcUM7UUFDckMsSUFBSSxHQUFHLEdBQVUsRUFBRSxHQUFDLEdBQUcsQ0FBQztRQUN4QixJQUFJLFFBQVEsR0FBd0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuRSxJQUFHLENBQUMsUUFBUSxFQUNaO1lBQ0ksUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNkLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsUUFBUSxDQUFDLENBQUM7U0FDM0M7YUFFRDtZQUNJLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBQ0QsUUFBUTtJQUNELDRDQUFpQixHQUF4QixVQUF5QixHQUFVLEVBQUMsTUFBVTtRQUUxQyxJQUFJLEdBQUcsR0FBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO1FBQzFCLElBQUksUUFBUSxHQUF3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLElBQUcsUUFBUSxFQUNYO1lBQ0ksSUFBSSxPQUFPLENBQUM7WUFDWixLQUFJLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQzNDO2dCQUNJLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUcsT0FBTyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQzVCO29CQUNJLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN4QjthQUNKO1lBQ0QsSUFBRyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsRUFDdkI7Z0JBQ0ksSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztTQUNKO0lBQ0wsQ0FBQztJQUNELGFBQWE7SUFDTixxQ0FBVSxHQUFqQjtRQUVDLGlGQUFpRjtRQUNqRixrQ0FBa0M7UUFDbEMsaURBQWlEO1FBQ2pELHNDQUFzQztRQUN0QyxTQUFTO0lBQ1YsQ0FBQztJQUNNLHlDQUFjLEdBQXJCO1FBRUMsMkRBQTJEO1FBQzNELGdDQUFnQztJQUNqQyxDQUFDO0lBMVFELGNBQWM7SUFDQSwwQkFBUyxHQUFVLENBQUMsQ0FBQztJQVNwQixxQkFBSSxHQUFvQixJQUFJLENBQUM7SUFpUS9DLHVCQUFDO0NBNVFELEFBNFFDLElBQUE7a0JBNVFvQixnQkFBZ0I7Ozs7QUNYckMsMkNBQXNDO0FBSXRDOztHQUVHO0FBQ0g7SUFBNEMsa0NBQVU7SUEwQmxELHdCQUFZLElBQUk7ZUFDWixrQkFBTSxJQUFJLENBQUM7SUFDZixDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQTdCQSxBQTZCQyxDQTdCMkMsb0JBQVUsR0E2QnJEOzs7OztBQ3BDRCwyQ0FBc0M7QUFHdEM7O0dBRUc7QUFDSDtJQUEyQyxpQ0FBVTtJQTBCakQsdUJBQVksSUFBSTtlQUNaLGtCQUFNLElBQUksQ0FBQztJQUNmLENBQUM7SUFDTCxvQkFBQztBQUFELENBN0JBLEFBNkJDLENBN0IwQyxvQkFBVSxHQTZCcEQ7Ozs7O0FDbkNEOztHQUVHO0FBQ0g7SUFFSSxvQkFBWSxJQUFJO1FBQ1osSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztZQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9CO0lBQ0wsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FSQSxBQVFDLElBQUE7Ozs7O0FDWEQsZ0dBQWdHO0FBQ2hHLG1FQUE2RDtBQUM3RCxrRkFBNEU7QUFDNUUsNEVBQXNFO0FBQ3RFLDRFQUFzRTtBQUN0RTs7RUFFRTtBQUNGO0lBYUk7SUFBYyxDQUFDO0lBQ1IsZUFBSSxHQUFYO1FBQ0ksSUFBSSxHQUFHLEdBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDN0MsR0FBRyxDQUFDLG1DQUFtQyxFQUFDLHdCQUFjLENBQUMsQ0FBQztRQUN4RCxHQUFHLENBQUMsNkNBQTZDLEVBQUMsNkJBQW1CLENBQUMsQ0FBQztRQUN2RSxHQUFHLENBQUMseUNBQXlDLEVBQUMsMkJBQWlCLENBQUMsQ0FBQztRQUNqRSxHQUFHLENBQUMseUNBQXlDLEVBQUMsMkJBQWlCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBbkJNLGdCQUFLLEdBQVEsSUFBSSxDQUFDO0lBQ2xCLGlCQUFNLEdBQVEsR0FBRyxDQUFDO0lBQ2xCLG9CQUFTLEdBQVEsYUFBYSxDQUFDO0lBQy9CLHFCQUFVLEdBQVEsTUFBTSxDQUFDO0lBQ3pCLGlCQUFNLEdBQVEsS0FBSyxDQUFDO0lBQ3BCLGlCQUFNLEdBQVEsTUFBTSxDQUFDO0lBQ3JCLHFCQUFVLEdBQUsscUJBQXFCLENBQUM7SUFDckMsb0JBQVMsR0FBUSxFQUFFLENBQUM7SUFDcEIsZ0JBQUssR0FBUyxLQUFLLENBQUM7SUFDcEIsZUFBSSxHQUFTLEtBQUssQ0FBQztJQUNuQix1QkFBWSxHQUFTLEtBQUssQ0FBQztJQUMzQiw0QkFBaUIsR0FBUyxJQUFJLENBQUM7SUFTMUMsaUJBQUM7Q0FyQkQsQUFxQkMsSUFBQTtrQkFyQm9CLFVBQVU7QUFzQi9CLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7OztBQzlCbEIsMkNBQXNDO0FBR3RDOztHQUVHO0FBQ0g7SUFDRSxFQUFFO0lBRUE7UUFDSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVM7SUFDRCx3QkFBSSxHQUFaO1FBRUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxVQUFVO0lBQ0Ysd0JBQUksR0FBWjtRQUVJLElBQUksU0FBUyxHQUFHO1lBQ1osRUFBQyxHQUFHLEVBQUMsMEJBQTBCLEVBQUM7WUFDaEMsRUFBQyxHQUFHLEVBQUMsc0JBQXNCLEVBQUM7WUFDNUIsRUFBQyxHQUFHLEVBQUMsd0JBQXdCLEVBQUM7WUFFOUIsRUFBQyxHQUFHLEVBQUMsc0JBQXNCLEVBQUM7WUFDNUIsRUFBQyxHQUFHLEVBQUMseUJBQXlCLEVBQUM7U0FDbEMsQ0FBQTtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVPLDBCQUFNLEdBQWQ7UUFFSSxvQkFBVSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxvQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDTCxnQkFBQztBQUFELENBOUJBLEFBOEJDLElBQUE7Ozs7O0FDcENELDJDQUFzQztBQUN0Qyx5Q0FBb0M7QUFDcEM7SUFDQztRQUNDLGdCQUFnQjtRQUNoQixJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFVLENBQUMsS0FBSyxFQUFFLG9CQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7O1lBQ2xFLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQVUsQ0FBQyxLQUFLLEVBQUUsb0JBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLG9CQUFVLENBQUMsU0FBUyxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLG9CQUFVLENBQUMsVUFBVSxDQUFDO1FBQzlDLG9CQUFvQjtRQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLG9CQUFVLENBQUMsaUJBQWlCLENBQUM7UUFFMUQsb0RBQW9EO1FBQ3BELElBQUksb0JBQVUsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTTtZQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzlGLElBQUksb0JBQVUsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDM0YsSUFBSSxvQkFBVSxDQUFDLElBQUk7WUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFN0IsZ0RBQWdEO1FBQ2hELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNySSxDQUFDO0lBRUQsOEJBQWUsR0FBZjtRQUNDLCtDQUErQztRQUMvQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRUQsNkJBQWMsR0FBZDtRQUNDLElBQUksbUJBQVMsRUFBRSxDQUFDO1FBQ2hCLFlBQVk7SUFDYixDQUFDO0lBQ0YsV0FBQztBQUFELENBL0JBLEFBK0JDLElBQUE7QUFDRCxPQUFPO0FBQ1AsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7OztBQ25DWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSDtJQU1JO1FBQ0ksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEtBQUssRUFBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQU8sQ0FBQztJQUNuQyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1Qsd0JBQUcsR0FBVixVQUFXLEdBQU8sRUFBQyxLQUFTO1FBRXhCLEtBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFDcEM7WUFDSSxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUcsU0FBUyxFQUMzQjtnQkFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLE9BQU87YUFDVjtTQUNKO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRSxHQUFHLEdBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELHlCQUF5QjtJQUNsQix3QkFBRyxHQUFWLFVBQVcsR0FBTztRQUVkLHNCQUFzQjtRQUN0QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQ2xDO1lBQ0ksSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFDdkI7Z0JBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0o7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELGNBQWM7SUFDUCw0QkFBTyxHQUFkLFVBQWUsS0FBVztRQUV0QixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQ3ZDO1lBQ0ksSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFDM0I7Z0JBQ0ksT0FBTyxDQUFDLENBQUM7YUFDWjtTQUNKO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxrQkFBa0I7SUFDWCwyQkFBTSxHQUFiLFVBQWMsR0FBUztRQUVuQixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQ2xDO1lBQ0ksSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFDdkI7Z0JBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDO2dCQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7YUFDdEM7U0FDSjtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsWUFBWTtJQUNMLDBCQUFLLEdBQVo7UUFFSSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxVQUFVO0lBQ0gsK0JBQVUsR0FBakI7UUFFSSxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQ2xDO1lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLGtCQUFrQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkM7SUFDTCxDQUFDO0lBRUQsWUFBWTtJQUNMLGlDQUFZLEdBQW5CO1FBRUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxZQUFZO0lBQ0wsK0JBQVUsR0FBakI7UUFFSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FwR0EsQUFvR0MsSUFBQTs7Ozs7QUNySUQsNkNBQXFDO0FBQ3JDLHlEQUFvRDtBQUVwRDs7R0FFRztBQUNIO0lBQXNDLDRCQUFxQjtJQUV2RDtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUVELDJCQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTyx1QkFBSSxHQUFaO1FBRUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFFckMsQ0FBQztJQUVPLDJCQUFRLEdBQWhCO1FBRUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDLElBQUksRUFBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSwwQkFBTyxHQUFkLFVBQWUsSUFBVyxFQUFDLEdBQU87UUFFOUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU8sMkJBQVEsR0FBaEI7UUFFSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsd0JBQWMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUNMLGVBQUM7QUFBRCxDQWhEQSxBQWdEQyxDQWhEcUMsY0FBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBZ0QxRDs7Ozs7QUN0REQ7O0dBRUc7QUFDSDtJQUVJO0lBRUEsQ0FBQztJQUVEOztPQUVHO0lBQ1csZUFBVSxHQUF4QjtRQUVJLE9BQU8sR0FBRyxHQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQSxNQUFNO0lBQzVFLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FiQSxBQWFDLElBQUE7Ozs7O0FDYkQsSUFBTyxLQUFLLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN4QixJQUFjLEVBQUUsQ0FXZjtBQVhELFdBQWMsRUFBRTtJQUFDLElBQUEsT0FBTyxDQVd2QjtJQVhnQixXQUFBLE9BQU87UUFDcEI7WUFBZ0MsOEJBQUs7WUFJakM7dUJBQWUsaUJBQU87WUFBQSxDQUFDO1lBQ3ZCLG1DQUFjLEdBQWQ7Z0JBQ0ksaUJBQU0sY0FBYyxXQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBQ0wsaUJBQUM7UUFBRCxDQVRBLEFBU0MsQ0FUK0IsS0FBSyxHQVNwQztRQVRZLGtCQUFVLGFBU3RCLENBQUE7SUFDTCxDQUFDLEVBWGdCLE9BQU8sR0FBUCxVQUFPLEtBQVAsVUFBTyxRQVd2QjtBQUFELENBQUMsRUFYYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUFXZjtBQUNELFdBQWMsRUFBRTtJQUFDLElBQUEsSUFBSSxDQTJCcEI7SUEzQmdCLFdBQUEsSUFBSTtRQUNqQjtZQUE0QiwwQkFBSztZQW9CN0I7dUJBQWUsaUJBQU87WUFBQSxDQUFDO1lBQ3ZCLCtCQUFjLEdBQWQ7Z0JBQ0ksaUJBQU0sY0FBYyxXQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEMsQ0FBQztZQUNMLGFBQUM7UUFBRCxDQXpCQSxBQXlCQyxDQXpCMkIsS0FBSyxHQXlCaEM7UUF6QlksV0FBTSxTQXlCbEIsQ0FBQTtJQUNMLENBQUMsRUEzQmdCLElBQUksR0FBSixPQUFJLEtBQUosT0FBSSxRQTJCcEI7QUFBRCxDQUFDLEVBM0JhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQTJCZjtBQUNELFdBQWMsRUFBRTtJQUFDLElBQUEsU0FBUyxDQStCekI7SUEvQmdCLFdBQUEsU0FBUztRQUN0QjtZQUFpQywrQkFBSztZQXdCbEM7dUJBQWUsaUJBQU87WUFBQSxDQUFDO1lBQ3ZCLG9DQUFjLEdBQWQ7Z0JBQ0ksaUJBQU0sY0FBYyxXQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUMxQyxDQUFDO1lBQ0wsa0JBQUM7UUFBRCxDQTdCQSxBQTZCQyxDQTdCZ0MsS0FBSyxHQTZCckM7UUE3QlkscUJBQVcsY0E2QnZCLENBQUE7SUFDTCxDQUFDLEVBL0JnQixTQUFTLEdBQVQsWUFBUyxLQUFULFlBQVMsUUErQnpCO0FBQUQsQ0FBQyxFQS9CYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUErQmY7QUFDRCxXQUFjLEVBQUU7SUFDWjtRQUFxQyxtQ0FBSztRQXNDdEM7bUJBQWUsaUJBQU87UUFBQSxDQUFDO1FBQ3ZCLHdDQUFjLEdBQWQ7WUFDSSxpQkFBTSxjQUFjLFdBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDTCxzQkFBQztJQUFELENBM0NBLEFBMkNDLENBM0NvQyxLQUFLLEdBMkN6QztJQTNDWSxrQkFBZSxrQkEyQzNCLENBQUE7QUFDTCxDQUFDLEVBN0NhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQTZDZjtBQUNELFdBQWMsRUFBRTtJQUFDLElBQUEsT0FBTyxDQTBCdkI7SUExQmdCLFdBQUEsT0FBTztRQUNwQjtZQUE2QiwyQkFBSztZQW1COUI7dUJBQWUsaUJBQU87WUFBQSxDQUFDO1lBQ3ZCLGdDQUFjLEdBQWQ7Z0JBQ0ksaUJBQU0sY0FBYyxXQUFFLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNMLGNBQUM7UUFBRCxDQXhCQSxBQXdCQyxDQXhCNEIsS0FBSyxHQXdCakM7UUF4QlksZUFBTyxVQXdCbkIsQ0FBQTtJQUNMLENBQUMsRUExQmdCLE9BQU8sR0FBUCxVQUFPLEtBQVAsVUFBTyxRQTBCdkI7QUFBRCxDQUFDLEVBMUJhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQTBCZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgUHJvdG9jb2wsIEdhbWVDb25maWcgfSBmcm9tIFwiLi4vLi4vQ29yZS9Db25zdC9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBNYXRjaEhhbmRsZXIgZnJvbSBcIi4uL0dhbWVMb2JieS9oYW5kbGVyL01hdGNoSGFuZGxlclwiO1xyXG5pbXBvcnQgQ2xpZW50U2VuZGVyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9DbGllbnRTZW5kZXJcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUxvYmJ5Q29udHJvbGxlciBleHRlbmRzIHVpLkdhbWVMb2JieS5HYW1lTG9iYnlVSXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlkK/liqggKi9cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirplIDmr4EqL1xyXG4gICAgb25EZXN0cm95KCl7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirkuovku7bnu5HlrpogKi9cclxuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5idG5fUFZQLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uUFZQTW9kZSk7XHJcbiAgICAgICAgdGhpcy5idG5fMVYxLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uMVYxKTtcclxuICAgICAgICB0aGlzLmJ0bl81VjUub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub241VjUpO1xyXG4gICAgICAgIHRoaXMuYnRuX2JhY2sub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25CYWNrKTtcclxuICAgICAgICB0aGlzLmJ0bl9lbnRlcmdhbWUub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25FbnRlckxvYWRpbmcpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfSU5GTyxuZXcgTWF0Y2hIYW5kbGVyKHRoaXMsdGhpcy5vbk1hdGNoSGFuZGxlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5idG5fUFZQLm9mZihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblBWUE1vZGUpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnVucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19NQVRDSF9JTkZPLHRoaXMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKirngrnlh7vov5vlhaVQVlDpgInmi6nnlYzpnaIgKi9cclxuICAgIHByaXZhdGUgb25QVlBNb2RlKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbVBhbmVsLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLk1vZGVDaG9vc2VQYW5lbC52aXNpYmxlPXRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I635Y+W5Yiw5raI5oGvICovXHJcbiAgICBwcml2YXRlIG9uTWF0Y2hIYW5kbGVyKGRhdGEpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGErXCLljLnphY3miJDlip9cIik7XHJcbiAgICAgICAgaWYoZGF0YSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDEwMCx0aGlzLHRoaXMuY2hvb3NlTWF0Y2gpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vpgInmi6kxVjHmqKHlvI8gKi9cclxuICAgIHByaXZhdGUgb24xVjEoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgIC8vIENsaWVudFNlbmRlci5yZXFNYXRjaCgxLDEpO1xyXG4gICAgICAgdGhpcy5jaG9vc2VNYXRjaCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+mAieaLqTVWNeaooeW8jyAqL1xyXG4gICAgcHJpdmF0ZSBvbjVWNSgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+i/lOWbnua4uOaIj+Wkp+WOhSAqL1xyXG4gICAgcHJpdmF0ZSBvbkJhY2soKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1lbnVJdGVtUGFuZWwudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirljLnphY3miJDlip/lvLnmoYbvvIzpgInmi6nmmK/lkKbov5vlhaXmuLjmiI8gKi9cclxuICAgIHByaXZhdGUgY2hvb3NlTWF0Y2goKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NYXRjaGluZ1N1Y2Nlc3NQYW5lbC52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirov5vlhaXmuLjmiI8gKi9cclxuICAgIHByaXZhdGUgb25FbnRlckxvYWRpbmcoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiUGxheWVyTG9hZGluZy5zY2VuZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAgXHJcbn0iLCJpbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvU29ja2V0SGFuZGxlclwiO1xyXG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOivt+axguWMuemFjeWvueWxgFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWF0Y2hIYW5kbGVyIGV4dGVuZHMgU29ja2V0SGFuZGxlcntcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoY2FsbGVyOmFueSxjYWxsYmFjazpGdW5jdGlvbiA9IG51bGwpe1xyXG4gICAgICAgIHN1cGVyKGNhbGxlcixjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgIHB1YmxpYyBleHBsYWluKGRhdGEpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB2YXIgUmVzTWF0Y2hJbmZvOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXNNYXRjaEluZm9cIik7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0gUmVzTWF0Y2hJbmZvLmRlY29kZShkYXRhKTtcclxuICAgICAgICBzdXBlci5leHBsYWluKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gICAgLyoq5aSE55CG5pWw5o2uICovXHJcbiAgICBwcm90ZWN0ZWQgc3VjY2VzcyhtZXNzYWdlKTp2b2lkXHJcbiAgICB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHN1cGVyLnN1Y2Nlc3MobWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuICAgICIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uLy4uL3VpL2xheWFNYXhVSVwiO1xyXG5pbXBvcnQgR3Jhc3NGYWN0b3J5IGZyb20gXCIuL0dyYXNzRmFjdG9yeVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29udHJvbGxlciBleHRlbmRzIHVpLkdhbWUuR2FtZVVJe1xyXG4gICAgLyoq5LiK5qyh6byg5qCH5b6X5L2N572uICovXHJcbiAgICBwcml2YXRlIGxhc3RNb3VzZVBvc1g6bnVtYmVyO1xyXG4gICAgLyoq5piv5ZCm5q2j5Zyo5L2/55So6ZOy5a2QICovXHJcbiAgICBwcml2YXRlIGlzVXNlU2hvdmVsOmJvb2xlYW47XHJcbiAgICAvKirpmLXokKUgKi9cclxuICAgIHB1YmxpYyBjYW1wOnN0cmluZztcclxuICAgIC8qKuiTneaWueiNieWdqiAqL1xyXG4gICAgcHJpdmF0ZSBibHVlRmFjOkdyYXNzRmFjdG9yeTtcclxuICAgIC8qKue6ouaWueiNieWdqiAqL1xyXG4gICAgcHJpdmF0ZSByZWRGYWM6R3Jhc3NGYWN0b3J5O1xyXG4gICAgLyoq5bex5pa56I2J5Z2qICovXHJcbiAgICBwcml2YXRlIG15RmFjOkdyYXNzRmFjdG9yeTtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnJlZEZhYz1uZXcgR3Jhc3NGYWN0b3J5KFwicmVkXCIsdGhpcy5nYW1lKTtcclxuICAgICAgICB0aGlzLmJsdWVGYWM9bmV3IEdyYXNzRmFjdG9yeShcImJsdWVcIix0aGlzLmdhbWUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNhbXA9XCJyZWRcIjtcclxuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5tYXBNb3ZlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlnLDlm77np7vliqggKi9cclxuICAgIHByaXZhdGUgbWFwTW92ZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgIHRoaXMuZ2FtZS54LT00O1xyXG4gICAgICAgaWYodGhpcy5nYW1lLng8PS0xMjE0KVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuZ2FtZS54PS0xMjE0O1xyXG4gICAgICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcyx0aGlzLm1hcE1vdmUpO1xyXG4gICAgICAgICAgIExheWEudGltZXIuZnJhbWVPbmNlKDYwLHRoaXMsdGhpcy5yZXN1bWVQb3MpO1xyXG4gICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICAvKirlm57liLDnjqnlrrbkvY3nva4gKi9cclxuICAgIHByaXZhdGUgcmVzdW1lUG9zKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuY2FtcD09XCJibHVlXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuZ2FtZS54PS0xMjMwO1xyXG4gICAgICAgICAgIHRoaXMubXlGYWM9dGhpcy5ibHVlRmFjO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuZ2FtZS54PTA7XHJcbiAgICAgICAgICAgdGhpcy5teUZhYz10aGlzLnJlZEZhYztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbS52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgdGhpcy5pc1VzZVNob3ZlbD1mYWxzZTtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50cygpO1xyXG4gICAgICAgIC8vdGhpcy5pc0NpY2tHcmFzcygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzcD1uZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICBzcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL211ZC5wbmdcIikpO1xyXG4gICAgICAgIHNwLmF1dG9TaXplPXRydWU7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChzcCk7XHJcbiAgICAgICAgc3Aub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMuY2hlY2spO1xyXG4gICAgfSBcclxuICAgICBcclxuICAgIC8qKuS6i+S7tue7keWumiAqL1xyXG4gICAgcHJpdmF0ZSBhZGRFdmVudHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICAvL0xheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vbk1vdXNlRG93bik7XHJcbiAgICAgICAgLy9MYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfVVAsdGhpcyx0aGlzLm9uTW91c2VVcCk7XHJcbiAgICAgICAgdGhpcy5zaG92ZWxiZy5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyx0aGlzLm9uU2hvdmVsRG93bik7XHJcbiAgICAgICAgXHJcbiAgICB9IFxyXG5cclxuICAgIGNoZWNrKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5piv5ZCm5Y+v5rOo5YaMXCIpO1xyXG4gICAgfVxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpvKDmoIfkuovku7YgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICAvKirpvKDmoIfmjInkuIsgKi9cclxuICAgIHByaXZhdGUgb25Nb3VzZURvd24oKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLm9uTW91c2VNb3ZlKTtcclxuICAgICAgICBpZighdGhpcy5pc1VzZVNob3ZlbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlUG9zWD1MYXlhLnN0YWdlLm1vdXNlWDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6byg5qCH56e75YqoICovXHJcbiAgICBwcml2YXRlIG9uTW91c2VNb3ZlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v5aaC5p6c5rKh5pyJ55So6ZOy5a2Q77yM5YiZ5Y+v5ouJ5Yqo5Zyw5Zu+XHJcbiAgICAgICAgaWYoIXRoaXMuaXNVc2VTaG92ZWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihMYXlhLnN0YWdlLm1vdXNlWDx0aGlzLmxhc3RNb3VzZVBvc1gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS54LT0yMDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlUG9zWD1MYXlhLnN0YWdlLm1vdXNlWDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKExheWEuc3RhZ2UubW91c2VYPnRoaXMubGFzdE1vdXNlUG9zWClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLngrPTIwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0TW91c2VQb3NYPUxheWEuc3RhZ2UubW91c2VYO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZ2FtZS54Pj0wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUueD0wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYodGhpcy5nYW1lLng8PS0xMjE0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUueD0tMTIxNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoq6byg5qCH5oqs6LW3ICovXHJcbiAgICBwcml2YXRlIG9uTW91c2VVcCgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnN0YWdlLm9mZihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLm9uTW91c2VNb3ZlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgLyoq54K55Ye76ZOy5a2Q5qGG5ou+6LW36ZOy5a2QICovXHJcbiAgICBwcml2YXRlIG9uU2hvdmVsRG93bigpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmlzVXNlU2hvdmVsPSF0aGlzLmlzVXNlU2hvdmVsO1xyXG4gICAgICAgIHRoaXMuc2hvdmVsX29mZi52aXNpYmxlPSF0aGlzLnNob3ZlbF9vZmYudmlzaWJsZTtcclxuICAgICAgICB0aGlzLnNob3ZlbF9vbi52aXNpYmxlPSF0aGlzLnNob3ZlbF9vbi52aXNpYmxlO1xyXG4gICAgICAgIC8vdGhpcy5pc0NpY2tHcmFzcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIpOaWreiNieWdquWdl+aYr+WQpuWPr+eCueWHuyAqL1xyXG4gICAgcHJpdmF0ZSBpc0NpY2tHcmFzcygpOnZvaWRcclxuICAgIHtcclxuICAgICAgICAvKmZvcihsZXQgaT0wO2k8dGhpcy5teUZhYy5ncmFzc0FycmF5Lmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+aUtui1t+mTsuWtkOWwseS4jeiDveeCueWHu+iNieWdquWdl++8jOebuOWPjeWImeWPr1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzVXNlU2hvdmVsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm15RmFjLmdyYXNzQXJyYXlbaV0uc3AubW91c2VFbmFibGVkPXRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm15RmFjLmdyYXNzQXJyYXlbaV0uc3AubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSovXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFzc3tcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgLyoq5piv5ZCm5Li65Zyf5Z2X5qCH6K6wICovXHJcbiAgICBwdWJsaWMgaXNNdWQ6Ym9vbGVhbjtcclxuICAgIC8qKuiNieWdquWbvuexu+WeiyAqL1xyXG4gICAgcHJpdmF0ZSBudW06bnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaW5pdChudW0sdmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5udW09bnVtO1xyXG4gICAgICAgIHRoaXMuaXNNdWQ9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcD1uZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICB0aGlzLnNwLmdyYXBoaWNzLmRyYXdUZXh0dXJlKExheWEubG9hZGVyLmdldFJlcyhcImdhbWUvZ3Jhc3NcIitudW0rXCIucG5nXCIpKTtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG4gICAgICAgIHRoaXMuc3AuYXV0b1NpemU9dHJ1ZTtcclxuICAgICAgICB0aGlzLnNwLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLmNoYW5nZUltZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L2s5o2i54q25oCB77yM5qCH6K6w5piv5ZCm5Li65Zyf5Z2XICovXHJcbiAgICBwdWJsaWMgY2hhbmdlSW1nKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pyJ5rKh5pyJ5pWI5p6cXCIpXHJcbiAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5jbGVhcigpO1xyXG4gICAgICAgIGlmKCF0aGlzLmlzTXVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL211ZC5wbmdcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVkPXRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9ncmFzc1wiK3RoaXMubnVtK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNdWQ9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBHcmFzcyBmcm9tIFwiLi9HcmFzc1wiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFzc0ZhY3Rvcnkge1xyXG4gICAgLyoq6I2J5Z2q5pWw57uEICovXHJcbiAgICBwdWJsaWMgZ3Jhc3NBcnJheTpBcnJheTxHcmFzcz47XHJcbiAgICBjb25zdHJ1Y3RvcihjYW1wOnN0cmluZyx2aWV3OkxheWEuU3ByaXRlKVxyXG4gICAge1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoW1wiZ2FtZS9ncmFzczEucG5nXCIsXCJnYW1lL2dyYXNzMi5wbmdcIixcImdhbWUvbXVkLnBuZ1wiXSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5jcmVhdGVHcmFzc0FycmF5LFtjYW1wLHZpZXddKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKueUn+aIkOiNieWdqiAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVHcmFzc0FycmF5KGNhbXA6c3RyaW5nLHZpZXc6TGF5YS5TcHJpdGUpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdyYXNzQXJyYXk9bmV3IEFycmF5PEdyYXNzPigpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8NztpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3IobGV0IGo9MDtqPDEwO2orKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGdyYXNzO1xyXG4gICAgICAgICAgICAgICAgaWYoaSUyPT0wKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXNzPW5ldyBHcmFzcyhqJTIrMSx2aWV3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcz1uZXcgR3Jhc3MoKGorMSklMisxLHZpZXcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5ncmFzc0FycmF5LnB1c2goZ3Jhc3MpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2FtcD09XCJyZWRcIilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcy5zcC5wb3MoMTIwKzEwMCpqLDI1KzEwMCppKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcy5zcC5wb3MoMTc1OSsxMDAqaiwyNSsxMDAqaSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IENvbmZpZ01hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvQ29uZmlnTWFuYWdlclwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkaW5nQ29udHJvbGxlciBleHRlbmRzIHVpLlBsYXllckxvYWRpbmdVSXtcclxuICAgIC8qKuaYr+WQpui/nuaOpeS4iuacjeWKoeWZqCAqL1xyXG4gICAgcHJpdmF0ZSBpc0Nvbm5lY3RTZXJ2ZXIgOiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RTZXJ2ZXIgPSBmYWxzZTsgXHJcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L295ri45oiP5Zy65pmv6LWE5rqQICovXHJcbiAgICBwcml2YXRlIGxvYWRBc3NldHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgc3JjID0gW1xyXG4gICAgICAgICAgICAvL+WbvumbhuWKoOi9vVxyXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL2dhbWUuYXRsYXNcIn0sICAgICAgXHJcbiAgICAgICAgXTtcclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHNyYyxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWQpLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uUHJvY2VzcykpO1xyXG4gICAgICAgIHRoaXMub25Mb2FkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L296L+b56iLICovXHJcbiAgICBwcml2YXRlIG9uUHJvY2Vzcyhwcm8pIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBwcm9Cb3ggPSB0aGlzLnNwX3Byb2dyZXNzO1xyXG4gICAgICAgIGxldCBwcm9XID0gdGhpcy5zcF9wcm9ncmVzc1c7XHJcbiAgICAgICAgbGV0IHByb0wgPSB0aGlzLnNwX3Byb2dyZXNzTDtcclxuICAgICAgICBwcm9XLndpZHRoID0gcHJvQm94LndpZHRoKnBybztcclxuICAgICAgICBwcm9MLnggPSBwcm9Cb3gud2lkdGgqcHJvO1xyXG4gICAgICAgIGlmKCF0aGlzLmlzQ29ubmVjdFNlcnZlcikgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmraPlnKjov57mjqXmnI3liqHlmajigKbigKZdXCI7XHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmnI3liqHlmajov57mjqXmiJDlip9dXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L295a6M5q+VICovXHJcbiAgICBwcml2YXRlIG9uTG9hZCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuRW50ZXJHYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L+b5YWl5ri45oiPICovXHJcbiAgICBwcml2YXRlIEVudGVyR2FtZSgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuU2NlbmUub3BlbihcIkdhbWUvR2FtZS5zY2VuZVwiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uLy4uL3VpL2xheWFNYXhVSVwiO1xyXG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBQcm90b2NvbCwgR2FtZUNvbmZpZyB9IGZyb20gXCIuLi8uLi9Db3JlL0NvbnN0L0dhbWVDb25maWdcIjtcclxuaW1wb3J0IFVzZXJMb2dpbkhhbmRsZXIgZnJvbSBcIi4vaGFuZGxlci9Vc2VyTG9naW5IYW5kbGVyXCI7XHJcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L0NsaWVudFNlbmRlclwiO1xyXG5pbXBvcnQgVG9vbCBmcm9tIFwiLi4vLi4vVG9vbC9Ub29sXCI7XHJcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xyXG5pbXBvcnQgQ29uZmlnTWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9Db25maWdNYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWxDb21lQ29udHJvbGxlciBleHRlbmRzIHVpLldlbGNvbWUuTG9naW5VSXtcclxuICAgIC8qKuaYr+WQpui/nuaOpeS4iuacjeWKoeWZqCAqL1xyXG4gICAgcHJpdmF0ZSBpc0Nvbm5lY3RTZXJ2ZXIgOiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vL+eUn+WRveWRqOacn1xyXG4gICAgLyoq5ZCv5YqoICovXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuZGF0YUluaXQoKTtcclxuICAgICAgICB0aGlzLnNldENlbnRlcigpO1xyXG4gICAgICAgIHRoaXMubG9hZEFzc2V0cygpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdFNlcnZlcigpOy8v6L+e5o6l5pyN5Yqh5ZmoXHJcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirplIDmr4EqL1xyXG4gICAgb25EZXN0cm95KCl7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8vLy8vLy8vLy8v6YC76L6RXHJcbiAgICAvKirmlbDmja7liJ3lp4vljJYgKi9cclxuICAgIHByaXZhdGUgZGF0YUluaXQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmlzQ29ubmVjdFNlcnZlciA9IGZhbHNlOyBcclxuICAgIH1cclxuICAgIC8qKuS6i+S7tue7keWumiAqL1xyXG4gICAgcHJpdmF0ZSBhZGRFdmVudHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmJ0bl9sb2dpbi5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkxvZ2luKTtcclxuICAgICAgICB0aGlzLmJ0bl9yZWdpc3Rlci5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblJlZ2lzdGVyKTtcclxuICAgICAgICB0aGlzLmJ0bl90b0xvZ2luLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uVG9Mb2dpbik7XHJcbiAgICAgICAgdGhpcy5idG5fdG9SZWdpc3Rlci5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblRvUmVnaXN0ZXIpXHJcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19VU0VSX0xPR0lOLG5ldyBVc2VyTG9naW5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvZ2luSGFuZGxlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5idG5fbG9naW4ub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uTG9naW4pO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnVucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19VU0VSX0xPR0lOLHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWxgOS4reaYvuekuiAqL1xyXG4gICAgcHJpdmF0ZSBzZXRDZW50ZXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgY2VudGVyID0gVG9vbC5nZXRDZW50ZXJYKCk7Ly/lsY/luZXpq5jluqZcclxuICAgICAgICB0aGlzLnNwX3Byb2dyZXNzLnggPSBjZW50ZXI7XHJcbiAgICAgICAgdGhpcy5zcF9nYW1lTmFtZS54ID0gY2VudGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZEFzc2V0cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBzcmMgPSBbXHJcbiAgICAgICAgICAgIHt1cmw6XCJ1bnBhY2thZ2Uvd2VsY29tZS9ib3hpbWcucG5nXCJ9LFxyXG4gICAgICAgICAgICAvL2pzb25cclxuICAgICAgICAgICAge3VybDpcIm91dHNpZGUvY29uZmlnL2dhbWVDb25maWcvZGVmZW5kZXIuanNvblwifSxcclxuICAgICAgICAgICAge3VybDpcIm91dHNpZGUvY29uZmlnL2dhbWVDb25maWcvbW9uc3Rlci5qc29uXCJ9ICBcclxuICAgICAgICBdO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc3JjLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Qcm9jZXNzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L296L+b56iLICovXHJcbiAgICBwcml2YXRlIG9uUHJvY2Vzcyhwcm8pIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBwcm9Cb3ggPSB0aGlzLnNwX3Byb2dyZXNzO1xyXG4gICAgICAgIGxldCBwcm9XID0gdGhpcy5zcF9wcm9ncmVzc1c7XHJcbiAgICAgICAgbGV0IHByb0wgPSB0aGlzLnNwX3Byb2dyZXNzTDtcclxuICAgICAgICBwcm9XLndpZHRoID0gcHJvQm94LndpZHRoKnBybztcclxuICAgICAgICBwcm9MLnggPSBwcm9Cb3gud2lkdGgqcHJvO1xyXG4gICAgICAgIGlmKCF0aGlzLmlzQ29ubmVjdFNlcnZlcikgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmraPlnKjov57mjqXmnI3liqHlmajigKbigKZdXCI7XHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmnI3liqHlmajov57mjqXmiJDlip9dXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L295a6M5q+VICovXHJcbiAgICBwcml2YXRlIG9uTG9hZCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIuWKoOi9veWujOavlei/m+WFpea4uOaIj1wiO1xyXG4gICAgICAgIExheWEudGltZXIub25jZSg4MDAsdGhpcyx0aGlzLnNob3dMb2dpbkJveCk7XHJcbiAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLm5ld0Zsb2F0TXNnKCk7XHJcbiAgICAgICAgLy/ojrflj5bphY3nva5cclxuICAgICAgICBDb25maWdNYW5hZ2VyLmlucy5sb2FkQ29uZmlnKCk7XHJcbiAgICAgICAgLy/mtYvor5VcclxuICAgICAgICBjb25zb2xlLmxvZyhDb25maWdNYW5hZ2VyLmlucy5nZXRDb25maWdCeUlkKFwibW9uc3RlclwiLDEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirmmL7npLrnmbvlvZXmoYYqKi9cclxuICAgIHByaXZhdGUgc2hvd0xvZ2luQm94KCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zcF9sb2dpbkJveC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmFuaTEucGxheSgwLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnNwX2dhbWVOYW1lLnggPSB0aGlzLnNwX2xvZ2luQm94LndpZHRoICsgdGhpcy5zcF9nYW1lTmFtZS53aWR0aC8yICsgMTAwO1xyXG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+eZu+mZhiAqL1xyXG4gICAgcHJpdmF0ZSBvbkxvZ2luKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy9DbGllbnRTZW5kZXIucmVxVXNlckxvZ2luKHRoaXMuaW5wdXRfdXNlck5hbWUudGV4dCx0aGlzLmlucHV0X3VzZXJLZXkudGV4dCk7XHJcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZUxvYmJ5L0dhbWVMb2JieS5zY2VuZVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vms6jlhowgKi9cclxuICAgIHByaXZhdGUgb25SZWdpc3RlcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye7IOW3suaciei0puWPtyAqL1xyXG4gICAgcHJpdmF0ZSBvblRvTG9naW4oKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNwX3JlZ2lzdGVyQm94LnZpc2libGUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7sg5rOo5YaMICovXHJcbiAgICBwcml2YXRlIG9uVG9SZWdpc3RlcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIENsaWVudFNlbmRlci5yZXFVc2VyUmVnaXN0ZXIodGhpcy5pbnB1dF9yZWdpc3RlclVzZXJOYW1lLnRleHQsdGhpcy5pbnB1dF9yZWdpc3RlclVzZXJLZXkudGV4dCx0aGlzLmlucHV0X3JlZ2lzdGVyTmlja05hbWUudGV4dCk7ICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirojrflj5bliLDmtojmga8gKi9cclxuICAgIHByaXZhdGUgb25Mb2dpbkhhbmRsZXIoZGF0YSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgaWYoZGF0YSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRleHQgPSBcIueZu+mZhuaIkOWKn++8jOi/m+WFpea4uOaIj++8gVwiXHJcbiAgICAgICAgICAgIGlmKHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSkgdGV4dCA9IFwi5rOo5YaM5oiQ5Yqf77yM5bCG55u05o6l6L+b5YWl5ri45oiP77yBXCI7XHJcbiAgICAgICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2codGV4dCk7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsdGhpcyx0aGlzLnRvR2FtZU1haW4pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirov57mjqXmnI3liqHlmaggKi9cclxuICAgIHByaXZhdGUgY29ubmVjdFNlcnZlcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLmNvbm5lY3QoR2FtZUNvbmZpZy5JUCxHYW1lQ29uZmlnLlBPUlQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIHByaXZhdGUgdG9HYW1lTWFpbigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8vVE8gRE8g6Lez6L2s6Iez5ri45oiP5aSn5Y6FXHJcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZUxvYmJ5L0dhbWVMb2JieS5zY2VuZVwiKTtcclxuICAgIH1cclxufSIsImltcG9ydCBTb2NrZXRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyXCI7XHJcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcblxyXG4vKipcclxuICog55So5oi355m76ZmG6K+35rGCIOi/lOWbnuWkhOeQhlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlckxvZ2luSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcclxuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlc1VzZXJMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzVXNlckxvZ2luXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc1VzZXJMb2dpbi5kZWNvZGUoZGF0YSk7XHJcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxyXG4gICAgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCJpbXBvcnQgRGVmZW5kZXJDb25maWcgZnJvbSBcIi4uL0RhdGEvQ29uZmlnL0RlZmVuZGVyQ29uZmlnXCI7XHJcbmltcG9ydCBNb25zdGVyQ29uZmlnIGZyb20gXCIuLi9EYXRhL0NvbmZpZy9Nb3NudGVyQ29uZmlnclwiO1xyXG5cclxuLyoqXHJcbiAqIOmFjee9ruWKoOi9veWZqFxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlnTWFuYWdlcntcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zIDogQ29uZmlnTWFuYWdlciA9IG5ldyBDb25maWdNYW5hZ2VyKCk7XHJcbiAgICAvKipcclxuICAgICAqIOmYsuW+oeWhlOaAu+mFjee9rlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVmZW5kZXJDb25maWcgOiBhbnk7XHJcbiAgICAvKipcclxuICAgICAqIOaAqueJqeaAu+mFjee9rlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbW9uc3RlckNvbmZpZyA6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmFjee9ruazqOWGjCBcclxuICAgICAqIFxyXG4gICAgICogMeOAgeWGmeS4i2pzb27lkI3lrZfvvIzlr7nlupTnmoQg6YWN572u57G7XHJcbiAgICAgKiBcclxuICAgICAqIOagh+ivhlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q2xhc3MobmFtZSxkYXRhKSA6IGFueVxyXG4gICAge1xyXG4gICAgICAgIHN3aXRjaChuYW1lKXtcclxuICAgICAgICAgICAgY2FzZSBcImRlZmVuZGVyXCI6IHJldHVybiBuZXcgRGVmZW5kZXJDb25maWcoZGF0YSk7XHJcbiAgICAgICAgICAgIGNhc2UgXCJtb25zdGVyXCI6IHJldHVybiBuZXcgTW9uc3RlckNvbmZpZyhkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEpzb27phY3nva7ojrflj5ZcclxuICAgICAqIFxyXG4gICAgICog5YaZ6ZyA6KaB6I635Y+W55qE6YWN572u5paH5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsb2FkQ29uZmlnKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIGFycj1bXHJcbiAgICAgICAgICAgIHtcImRlZmVuZGVyXCI6XCJvdXRzaWRlL2NvbmZpZy9nYW1lQ29uZmlnL2RlZmVuZGVyLmpzb25cIn0sXHJcbiAgICAgICAgICAgIHtcIm1vbnN0ZXJcIjpcIm91dHNpZGUvY29uZmlnL2dhbWVDb25maWcvbW9uc3Rlci5qc29uXCJ9XHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLmxvYWRPYmooYXJyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6LWE5rqQ5Yqg6L29XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbG9hZE9iaihhcnIpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBvYmo7XHJcbiAgICAgICAgbGV0IG5hbWU7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG9iaiA9IGFycltpXTtcclxuICAgICAgICAgICAgbmFtZSA9IE9iamVjdC5rZXlzKG9iailbMF07XHJcbiAgICAgICAgICAgIHRoaXNbbmFtZStcIkNvbmZpZ1wiXSA9IExheWEubG9hZGVyLmdldFJlcyhvYmpbbmFtZV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bphY3nva4gQGNvbmZpZ05tYWUgOiBKc29u5paH5Lu25ZCNICBA5oOz6I635Y+W5LuA5LmI5oCq54mpaWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbmZpZ0J5SWQoY29uZmlnTmFtZSxjb25maWdJZCkgOiBhbnlcclxuICAgIHtcclxuICAgICAgICBsZXQgY29uZmlnT2JqID0gdGhpc1tjb25maWdOYW1lICsgXCJDb25maWdcIl07XHJcbiAgICAgICAgbGV0IHR5cGVBcnIgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGNvbmZpZ09iai5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbGV0IG9iaiA9IGNvbmZpZ09ialtpXTtcclxuICAgICAgICAgICAgaWYob2JqW2NvbmZpZ05hbWUgKyBcIklkXCJdID09IGNvbmZpZ0lkKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldENsYXNzKGNvbmZpZ05hbWUsb2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCIvKlxyXG4qIOa4uOaIj+mFjee9rlxyXG4qL1xyXG5leHBvcnQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIC8qKmlwKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgSVAgOiBzdHJpbmcgPSBcIjQ3LjEwNy4xNjkuMjQ0XCI7XHJcbiAgICAvKirnq6/lj6MgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUE9SVCA6IG51bWJlciA9IDc3NzcgIDtcclxuICAgIC8vIC8qKmlwIC0g5pys5Zyw5rWL6K+VKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgSVAgOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiO1xyXG4gICAgLy8gLyoq56uv5Y+jIC0g5pys5Zyw5rWL6K+VKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUE9SVCA6IG51bWJlciA9IDc3Nzc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKuWNj+iuriAqL1xyXG5leHBvcnQgY2xhc3MgUHJvdG9jb2x7XHJcbiAgICAgLy8qKioqKioqKioqKioqKioqVXNlclByb3RvLnByb3RvXHJcbiAgICAvKiror7fmsYIgbXNnSWQgPSAxMDExMDMgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfTE9HSU4gOiBudW1iZXIgPSAxMDExMDM7XHJcbiAgICAvKioxMDExMDQg5rOo5YaM6K+35rGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX1JFR0lTVEVSIDogbnVtYmVyID0gMTAxMTA0O1xyXG5cclxuICAgIC8qKuWTjeW6lCBtc2dJZCA9IDEwMTIwMyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBSRVNfVVNFUl9MT0dJTiA6IG51bWJlciA9IDEwMTIwMztcclxuXHJcbiAgICBcclxuXHJcblxyXG5cclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKmdtTWVzc2FnZS5wcm90b1xyXG4gICAgLy8gLyoq5Y+R6YCBR03lr4bku6QgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0dNX0NPTTpudW1iZXIgPSAxOTkxMDE7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKip1c2VyTWVzc2FnZS5wcm90b1xyXG4gICAgLy8gLyoq5rOo5YaMIDIwMjEwMiovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX1JFR0lTVEVSOm51bWJlciA9IDIwMjEwMjtcclxuICAgIC8vIC8qKueZu+W9leivt+axgiAyMDIxMDMqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9MT0dJTjpudW1iZXIgPSAyMDIxMDM7XHJcblxyXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xyXG4gICAgLy8gLyoq55m75b2V6L+U5ZueIDIwMjIwMSovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVNFUl9MT0dJTjpudW1iZXIgPSAyMDIyMDE7XHJcbiAgICAvLyAvKirmnI3liqHlmajliJfooaggMjAyMjAzKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWRVJfTElTVDpudW1iZXIgPSAyMDIyMDM7XHJcbiAgICAvLyAvKirlhazlkYrpnaLmnb8gMjAyMjA0Ki9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9OT1RJQ0VfQk9BUkQ6bnVtYmVyID0gMjAyMjA0O1xyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqbG9naW5NZXNzYWdlLnByb3RvXHJcbiAgICAvLyAvKirmnI3liqHlmajnmbvlvZXor7fmsYIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfTE9HSU46bnVtYmVyID0gMTAxMTAxO1xyXG4gICAgLy8gLyoq5b+D6Lez5YyF6K+35rGCICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9TRVJWX0hFUlQ6bnVtYmVyID0gMTAxMTAyO1xyXG4gICAgLy8gLyoq6K+35rGC6KeS6Imy5L+h5oGvICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9DUkVBVEVfUExBWUVSOm51bWJlciA9IDEwMTEwMztcclxuICAgIC8vIC8qKuacjeWKoeWZqOi/lOWbnioqKioqKioqKioqKiogKi9cclxuICAgIC8vIC8qKuW/g+i3s+i/lOWbniAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NFUlZfSEVSVDpudW1iZXIgPSAxMDEyMDE7XHJcbiAgICAvLyAvKirov5Tlm57nmbvlvZXplJnor6/mtojmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0VSUk9SOm51bWJlciA9IDEwMTIwMjtcclxuICAgIC8vIC8qKui/lOWbnuiiq+mhtuS4i+e6vyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NVQlNUSVRVVEU6bnVtYmVyID0gMTAxMjAzO1xyXG5cclxuXHJcblxyXG4gICAgLyoq6K+35rGC5Yy56YWN5a+55bGAMTAyMTAxICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVRDSDpudW1iZXI9MTAyMTAxO1xyXG4gICAgLyoq6K+35rGCIOWvueWxgOaOpeWPlzEwMjEwMiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBSRVFfTUFUQ0hfQUNDRVBUOm51bWJlcj0xMDIxMDI7XHJcbiAgICAvKirlk43lupQg6L+U5Zue5Yy56YWN5L+h5oGvIOWPquWPkemAgeS4gOasoW1zZ0lkID0gMTAyMjAxICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFU19NQVRDSF9JTkZPIDogbnVtYmVyID0gMTAyMjAxO1xyXG4gICAgLyoq5ZON5bqUIOi/lOWbnuWvueWxgOaOpeWPl+a2iOaBr21zZ0lkID0gMTAyMDIgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUkVTX01BVENIX0FDQ0VQVF9JTkZPIDogbnVtYmVyID0gMTAyMDI7XHJcbiAgICAvLyAvLyoqKioqKioqKioqKnBsYXllck1lc3NhZ2UucHJvdG9cclxuICAgIC8vIC8v6K+35rGCXHJcbiAgICAvLyAvKiror7fmsYLmia3om4sgbXNnSWQ9MTAyMTAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9HQUNIQTpudW1iZXIgPSAxMDIxMDE7XHJcblxyXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xyXG4gICAgLy8gLyoq55m76ZmG6L+U5Zue6KeS6Imy5Z+65pys5L+h5oGvICBtc2dJZD0xMDIyMDEgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0lORk86bnVtYmVyID0gMTAyMjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5oiQ5YqfICBtc2dJZD0xMDIyMDIgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfT1BSRUFURV9TVUNDRVNTOm51bWJlciA9IDEwMjIwMjtcclxuICAgIC8vIC8qKui/lOWbnuaTjeS9nOWksei0pSAgbXNnSWQ9MTAyMjAzICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfRkFJTDpudW1iZXIgPSAxMDIyMDM7XHJcbiAgICAvLyAvKirov5Tlm57op5LoibLlj5HnlJ/lj5jljJblkI7nmoTlsZ7mgKfkv6Hmga8o5YiX6KGoKSAgbXNnSWQ9MTAyMjA0ICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BMQVlFUl9BVFRSSUJVVEVfRVFVQUw6bnVtYmVyID0gMTAyMjA0O1xyXG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNSAgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QTEFZRVJfQVRUUklCVVRFX1VQREFURTpudW1iZXIgPSAxMDIyMDU7XHJcbiAgICAvLyAvKirov5Tlm57mia3om4sgbXNnSWQ9MTAyMjA2ICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0dBQ0hBOm51bWJlciA9IDEwMjIwNjtcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKnNraWxsTWVzc2FnZS5wcm90b1xyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLeivt+axgua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKuivt+axguaJgOacieaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0FMTF9TS0lMTF9JTkZPOm51bWJlciA9IDEwNzEwMTtcclxuICAgIC8vIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZJR0hUX1NLSUxMX0xJU1Q6bnVtYmVyID0gMTA3MTAyO1xyXG4gICAgLy8gLyoq6K+35rGC5Y2H57qn5oqA6IO9IG1zZ0lkPTEwNzEwM1x0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVBfU0tJTEw6bnVtYmVyID0gMTA3MTAzO1xyXG4gICAgLy8gLyoq6K+35rGC6YeN572u5oqA6IO9IG1zZ0lkPTEwNzEwNFx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA3MTA0O1xyXG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9IG1zZ0lkPTEwNzEwNVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQUxURVJfR1JJRF9TS0lMTDpudW1iZXIgPSAxMDcxMDU7XHJcblxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuaJgOacieaKgOiDveS/oeaBryAgbXNnSWQ9MTA3MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue5Ye65oiY5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9GSUdIVF9TS0lMTF9MSVNUOm51bWJlciA9IDEwNzIwMjtcclxuICAgIC8vIC8qKui/lOWbnuWNh+e6p+aKgOiDvSAgbXNnSWQ9MTA3MjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVBfU0tJTEw6bnVtYmVyID0gMTA3MjAzO1xyXG4gICAgLy8gLyoq6L+U5Zue6YeN572u5oqA6IO95oiQ5Yqf77yM5a6i5oi356uv5pS25Yiw5q2k5raI5oGv77yM5pys5Zyw56e76Zmk5YWo6YOo5oqA6IO9ICBtc2dJZD0xMDcyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcyMDQ7XHJcbiAgICAvLyAvKirov5Tlm57mlLnlj5jmoLzlrZDmioDog70gIG1zZ0lkPTEwNzIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0FMVEVSX0dSSURfU0tJTEw6bnVtYmVyID0gMTA3MjA1O1xyXG5cclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBwZXRNZXNzYWdlXHJcbiAgICAvLyAvKiror7fmsYLlrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA1MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUxMDE7XHJcbiAgICAvLyAvKiror7fmsYLmlLnlj5jkuIrpmLXlrqDniankv6Hmga8gbXNnSWQ9MTA1MTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQUxURVJfR1JJRDpudW1iZXIgPSAxMDUxMDI7XHJcbiAgICAvLyAvKiror7fmsYLlloLlrqDnianlkIPppa0gbXNnSWQ9MTA1MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfRkVFRDpudW1iZXIgPSAxMDUxMDM7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianlkIjmiJAgbXNnSWQ9MTA1MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQ09NUE9VTkQ6bnVtYmVyID0gMTA1MTA0O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp6aKG5oKf5oqA6IO9IG1zZ0lkPTEwNTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1NUVURZX1NLSUxMOm51bWJlciA9IDEwNTEwNjtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDUxMDc7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianmioDog73ov5vpmLYgbXNnSWQ9MTA1MTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA4ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MTA4O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGNIG1zZ0lkPTEwNTEwOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElORzpudW1iZXIgPSAxMDUxMDk7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfRVZPTFZFOm51bWJlciA9IDEwNTExMDtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqeWtteWMliBtc2dJZD0xMDUxMTFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9IQVRDSDpudW1iZXIgPSAxMDUxMTE7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MTEyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVHSVNURVI6bnVtYmVyID0gMTA1MTEyO1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1JFUV9NQVRJTkc6bnVtYmVyID0gMTA1MTEzO1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5omA5pyJ5L+h5oGvIG1zZ0lkPTEwNTExNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNCDlpoLmnpzlrqDnianmnKzouqvmnInnmbvorrDmlbDmja7vvIzkvYbnuYHooY3mlbDmja7mib7kuI3liLDvvIjov5Tlm57mtojmga9tc2dJZD0xMDUyMTLlkoxtc2dJZD0xMDUyMTPmm7TmlrDlrqLmiLfnq6/mlbDmja7vvIkgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQUxMSU5GTzpudW1iZXIgPSAxMDUxMTQ7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MTE1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTExNTtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUxMTZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTbvvIzlpoLmnpzmmK/lkIzmhI/vvIzlr7nmlrnnjqnlrrblpoLmnpzlnKjnur/vvIzkvJrmlLbliLBtc2dJZD0xMDUyMTDmtojmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQ0hPT1NFOm51bWJlciA9IDEwNTExNjtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUxMTdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0g6bnVtYmVyID0gMTA1MTE3O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55uu5qCH5p+l55yLIG1zZ0lkPTEwNTExOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElOR19UQVJHRVRfTE9PSzpudW1iZXIgPSAxMDUxMTg7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianmlL7nlJ8gbXNnSWQ9MTA1MTE5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfRlJFRTpudW1iZXIgPSAxMDUxMTk7XHJcblxyXG5cclxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAvKirov5Tlm57lrqDnianmiYDmnInkv6Hmga/vvIjnmbvlvZXmiJDlip/kuLvliqjov5Tlm57vvIltc2dJZD0xMDUyMDEqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9BTExfSU5GTzpudW1iZXIgPSAxMDUyMDE7XHJcbiAgICAvLyAvLyDov5Tlm57lrqDnianmoLzlrZDkv6Hmga8gbXNnSWQ9MTA1MjAyXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX0dSSURfSU5GTzpudW1iZXIgPSAxMDUyMDI7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MjAzKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUyMDM7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannrYnnuqflkoznu4/pqozkv6Hmga/vvIjmraTmtojmga/lnKjlrqDniannu4/pqozlj5HnlJ/lj5jljJblsLHkvJrov5Tlm57nu5nlrqLmiLfnq6/vvIkgbXNnSWQ9MTA1MjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA0O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5oqA6IO9562J57qn5ZKM5oqA6IO957uP6aqM5L+h5oGv77yI5q2k5raI5oGv5Zyo5a6g54mp5oqA6IO957uP6aqM5Y+R55Sf5Y+Y5YyW5bCx5Lya6L+U5Zue57uZ5a6i5oi356uv77yJIG1zZ0lkPTEwNTIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NLSUxMX0xWX0VYUF9JTkZPOm51bWJlciA9IDEwNTIwNTtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUyMDYgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9TVFVEWV9TS0lMTDpudW1iZXIgPSAxMDUyMDY7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianph43nva7mioDog70gbXNnSWQ9MTA1MjA3ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MjA3O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5oqA6IO96L+b6Zi2IG1zZ0lkPTEwNTIwOCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NLSUxMX1VQOm51bWJlciA9IDEwNTIwODtcclxuXHJcbiAgICAvLyAvKirov5Tlm57lrqDniankuqTphY0gbXNnSWQ9MTA1MjA5ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HVDpudW1iZXIgPSAxMDUyMDk7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianlop7liqDnuYHooY3mrKHmlbAgbXNnSWQ9MTA1MjEwICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfQUREX01BVElOR19DT1VOVDpudW1iZXIgPSAxMDUyMTA7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianov5vljJYgbXNnSWQ9MTA1MjExICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfRVZPTFZFOm51bWJlciA9IDEwNTIxMTtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeeZu+iusCBtc2dJZD0xMDUyMTIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUyMTI7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MjEzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVRX01BVElORzpudW1iZXIgPSAxMDUyMTM7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MjE0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0FMTElORk86bnVtYmVyID0gMTA1MjE0O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp57mB6KGN5p+l55yL6K+35rGC5YiX6KGoIG1zZ0lkPTEwNTIxNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NFTEVDVF9SRVFfTElTVDpudW1iZXIgPSAxMDUyMTU7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MjE2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0NIT09TRTpudW1iZXIgPSAxMDUyMTY7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3nm67moIfliLfmlrAgbXNnSWQ9MTA1MjE3ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNIOm51bWJlciA9IDEwNTIxNztcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaUvueUnyBtc2dJZD0xMDUyMTggKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9GUkVFOm51bWJlciA9IDEwNTIxODtcclxuICAgIFxyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIGVxdWlwTWVzc2FnZVxyXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTUFLRTpudW1iZXIgPSAxMDkxMDE7XHJcbiAgICAvLyAvKiror7fmsYLoo4XlpIfliIbop6MgbXNnSWQ9MTA5MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9TUExJVDpudW1iZXIgPSAxMDkxMDZcclxuICAgIC8vIC8qKuivt+axguijheWkh+mUgeWumuaIluino+mUgSBtc2dJZD0xMDkxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0xPQ0s6bnVtYmVyID0gMTA5MTA0O1xyXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5by65YyWIG1zZ0lkPTEwOTEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfQVRUX0FERDpudW1iZXIgPSAxMDkxMDU7XHJcbiAgICAvLyAvKiror7fmsYLoo4XlpIfnqb/miLQgbXNnSWQ9MTA5MTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9MT0FESU5HOm51bWJlciA9IDEwOTEwMjtcclxuICAgIC8vIC8qKuivt+axguijheWkh+WNuOi9vSBtc2dJZD0xMDkxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX1VOTE9BRElORzpudW1iZXIgPSAxMDkxMDM7XHJcblxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuijheWkh+aJk+mAoCBtc2dJZD0xMDkyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX01BS0UgPSAxMDkyMDE7XHJcbiAgICAvLyAvKirov5Tlm57oo4XlpIfliIbop6MgbXNnSWQ9MTA5MjA2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9TUExJVCA9IDEwOTIwNjtcclxuICAgIC8vIC8qKui/lOWbnuijheWkh+W8uuWMliBtc2dJZD0xMDkyMDUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX0FUVF9BREQgPSAxMDkyMDU7XHJcbiAgICAvLyAvKirov5Tlm57oo4XlpIfnqb/miLQgbXNnSWQ9MTA5MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0FESU5HID0gMTA5MjAyO1xyXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5Y246L29IG1zZ0lkPTEwOTIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfVU5MT0FESU5HID0gMTA5MjAzO1xyXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfTE9DSyA9IDEwOTIwNDtcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBtYXBNZXNzYWdlXHJcbiAgICAvLyAvKiror7fmsYLlnLDlm77mma7pgJrmiJjmlpfvvIjlrqLmiLfnq6/kuIDlnLrmiJjmlpfnu5PmnZ/kuYvlkI7lj5HpgIHmraTmtojmga/vvIzlho3ov5vooYzlgJLorqHml7blkozmnKzlnLDlgYfmiJjmlpfvvIkgbXNnSWQ9MTA2MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfTk9STUFMX0ZJR0hUOm51bWJlciA9IDEwNjEwMTtcclxuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyBtc2dJZD0xMDYxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9TUEVFRF9GSUdIVDpudW1iZXIgPSAxMDYxMDQ7XHJcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaHmiavojaHmiJjmlpcgbXNnSWQ9MTA2MTA1XHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1dFRVBfRklHSFQ6bnVtYmVyID0gMTA2MTA1O1xyXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h6LSt5Lmw5omr6I2hIG1zZ0lkPTEwNjEwNlx0XHQtLS0tLei/lOWbnua2iOaBryDov5Tlm57miJDlip/mtojmga/vvIxjb2RlPTEwMDAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfQlVZX1NXRUVQOm51bWJlciA9IDEwNjEwNjtcclxuICAgIC8vIC8qKuivt+axguWFs+WNoeWBh+aImOaWl+e7k+adn+mihuWPluWlluWKsSBtc2dJZD0xMDYxMDlcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDYyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9OT1JNQUxfRklHSFRfRU5EOm51bWJlciA9IDEwNjEwOTtcclxuICAgIC8vIC8qKuivt+axguWRiuivieacjeWKoeWZqOaImOaWl+aSreaUvue7k+adn++8iOS7heS7heW6lOeUqOS6juaJgOacieecn+aImOaWl++8iSBtc2dJZD0xMDYxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDMqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVFJVRV9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTAyO1xyXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5YWz5Y2hYm9zc+aImOaWlyBtc2dJZD0xMDYxMDNcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9TQ0VORV9GSUdIVDpudW1iZXIgPSAxMDYxMDM7XHJcbiAgICAvLyAvKiror7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfQ0hBTkdFX1NDRU5FOm51bWJlciA9IDEwNjEwODtcclxuXHJcblxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuemu+e6v+WSjOaJq+iNoeaUtuebiuS/oeaBryBtc2dJZD0xMDYyMDIqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfT0ZGX0xJTkVfQVdBUkRfSU5GTzpudW1iZXIgPSAxMDYyMDI7XHJcbiAgICAvLyAvKirov5Tlm57miJjmlpfmkq3mlL7nu5PmnZ/lj5HmlL7lpZblirHvvIjlupTnlKjkuo7miYDmnInmiJjmlpfvvIkgbXNnSWQ9MTA2MjAzKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYyMDM7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogcGFja01lc3NhZ2VcclxuICAgIC8vIC8qKuS9v+eUqOmBk+WFt+a2iOaBryAgbXNnSWQ9MTA0MTAxIOi/lOWbnuaTjeS9nOaIkOWKn+a2iOaBryAgbXNnSWQ9MTAyMjAyIGNvZGU9MTAwMDHvvIjmmoLlrprvvIzmoLnmja7lrp7pmYXkvb/nlKjmlYjmnpzlho3lgZrvvIkqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFOm51bWJlciA9IDEwNDEwMTtcclxuXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6YGT5YW35Y+Y5YyW5L+h5oGvICBtc2dJZD0xMDQyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BST1BfSU5GTzpudW1iZXIgPSAxMDQyMDI7XHJcbiAgICAvLyAvKirov5Tlm57og4zljIXmiYDmnInkv6Hmga/vvIjnmbvlvZXmiJDlip/kuLvliqjov5Tlm57vvIkgIG1zZ0lkPTEwNDIwMSjmnInlj6/og73kuLrnqbrliJfooagpKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BBQ0tfQUxMX0lORk86bnVtYmVyID0gMTA0MjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6KOF5aSH5Y+Y5YyW5L+h5oGvIG1zZ0lkPTEwNDIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfSU5GTzpudW1iZXIgPSAxMDQyMDM7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmaWdodE1lc3NhZ2VcclxuICAgIC8vIC8qKuivt+axguaJk+W8gOmCruS7tuiuvue9ruW3suivuyBtc2dJZD0xMTExMDEg5peg6L+U5Zue5raI5oGvIOWuouaIt+err+aJk+W8gOaXoOWlluWKsemCruS7tu+8jOiHquihjOiuvue9ruW3suivu+eKtuaAgSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfT1BFTl9NQUlMOm51bWJlciA9IDExMTEwMTtcclxuICAgIC8vIC8qKuivt+axgumihuWPlumCruS7tuWlluWKsSBtc2dJZD0xMTExMDJcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFJTF9BV0FSRDpudW1iZXIgPSAxMTExMDI7XHJcbiAgICAvLyAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BSUxfREVMRVRFOm51bWJlciA9IDExMTEwMztcclxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAvKirov5Tlm57pgq7ku7bkv6Hmga8gbXNnSWQ9MTExMjAx77yI55m76ZmG5Li75Yqo6L+U5ZueIOaIluiAhSDlj5HnlJ/lj5jljJbov5Tlm57vvIkgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX01BSUxfSU5GTzpudW1iZXIgPSAxMTEyMDE7XHJcbiAgICAvLyAvKirov5Tlm57pgq7ku7blt7Lpooblj5bmiJDlip8gbXNnSWQ9MTExMjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0FXQVJEOm51bWJlciA9IDExMTIwMjtcclxuICAgIC8vIC8qKui/lOWbnuWIoOmZpOmCruS7tuaIkOWKnyBtc2dJZD0xMTEyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX01BSUxfREVMRVRFOm51bWJlciA9IDExMTIwMztcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKioqIGZpZ2h0TWVzc2FnZVxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuS4gOWcuuaImOaWl+aXpeW/lyBtc2dJZD0xMDgyMDEqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfVFJVRV9GSUdIVF9MT0dfSU5GTzpudW1iZXIgPSAxMDgyMDE7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmcmllbmRNZXNzYWdlXHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmjqjojZAgbXNnSWQ9MTEyMTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIxMDE7XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfU0VBUkNIOm51bWJlciA9IDExMjEwMjtcclxuICAgIC8vIC8qKuivt+axguWlveWPi+eUs+ivtyBtc2dJZD0xMTIxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BUFBMWTpudW1iZXIgPSAxMTIxMDM7XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmk43kvZwgbXNnSWQ9MTEyMTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjEwNDtcclxuICAgIC8vIC8qKuivt+axguWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9NT1JFX0lORk86bnVtYmVyID0gMTEyMTA1O1xyXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L6YCB56S8IG1zZ0lkPTExMjEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0dJRlQ6bnVtYmVyID0gMTEyMTA2XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA3ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfQWxsX0luZm86bnVtYmVyID0gMTEyMTA3O1xyXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0ZJR0hUOm51bWJlciA9IDExMjEwODtcclxuXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX1BVU0g6bnVtYmVyID0gMTEyMjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pCc57SiIG1zZ0lkPTExMjIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX1NFQVJDSDpudW1iZXIgPSAxMTIyMDI7XHJcbiAgICAvLyAvKirov5Tlm57lpb3lj4vnlLPor7cgbXNnSWQ9MTEyMjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfQVBQTFk6bnVtYmVyID0gMTEyMjAzO1xyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pON5L2cIG1zZ0lkPTExMjIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX09QRVJBVElPTjpudW1iZXIgPSAxMTIyMDQ7XHJcbiAgICAvLyAvKirov5Tlm57lpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMjA1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfTU9SRV9JTkZPOm51bWJlciA9IDExMjIwNTtcclxuICAgIC8vIC8qKui/lOWbnuWlveWPi+mAgeekvCBtc2dJZD0xMTIyMDYgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9HSUZUOm51bWJlciA9IDExMjIwNjtcclxuICAgIC8vIC8qKui/lOWbnuWlveWPi+aJgOacieS/oeaBryBtc2dJZD0xMTIyMDcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9BTExfSU5GTzpudW1iZXIgPSAxMTIyMDc7ICAgIFxyXG5cclxufSIsImltcG9ydCBGbG9hdE1zZyBmcm9tIFwiLi4vVG9vbC9GbG9hdE1zZ1wiO1xyXG5pbXBvcnQgVG9vbCBmcm9tIFwiLi4vVG9vbC9Ub29sXCI7XHJcblxyXG4vKipcclxuICog5raI5oGv5pi+56S6566h55CG5ZmoXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlTWFuYWdlciB7XHJcbiAgICAvKirljZXkvosgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zIDogTWVzc2FnZU1hbmFnZXIgPSBuZXcgTWVzc2FnZU1hbmFnZXI7XHJcbiAgICAvKirlsY/luZXmi6XmnInnmoTmta7liqjmtojmga/orqHmlbAqL1xyXG4gICAgcHVibGljIGNvdW50RmxvYXRNc2cgOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuY291bnRGbG9hdE1zZyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmta7liqjmtojmga/pooTng60s77yM5o+Q5YmN5paw5bu65LiA5LiqZmxvYXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIG5ld0Zsb2F0TXNnKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGZsb2F0TXNnID0gbmV3IEZsb2F0TXNnKCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmbG9hdE1zZyk7XHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJGbG9hdE1zZ1wiLGZsb2F0TXNnKTsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrmta7liqjmtojmga9cclxuICAgICAqIEBwYXJhbSB0ZXh0ICDmmL7npLrmtojmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dGbG9hdE1zZyh0ZXh0OnN0cmluZykgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGZsb2F0TXNnIDogRmxvYXRNc2cgPSBMYXlhLlBvb2wuZ2V0SXRlbShcIkZsb2F0TXNnXCIpO1xyXG4gICAgICAgIGlmKExheWEuUG9vbC5nZXRQb29sQnlTaWduKFwiRmxvYXRNc2dcIikubGVuZ3RoID09IDApIHRoaXMubmV3RmxvYXRNc2coKTtcclxuICAgICAgICBpZihmbG9hdE1zZyAgPT09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdE1zZyA9IG5ldyBGbG9hdE1zZygpO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZsb2F0TXNnKTsgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBmbG9hdE1zZy56T3JkZXIgPSAxMDAgKyB0aGlzLmNvdW50RmxvYXRNc2c7XHJcbiAgICAgICAgY29uc29sZS5sb2coVG9vbC5nZXRDZW50ZXJYKCkpO1xyXG4gICAgICAgIGZsb2F0TXNnLnNob3dNc2codGV4dCx7eDpUb29sLmdldENlbnRlclgoKSArIHRoaXMuY291bnRGbG9hdE1zZyoyMCx5OiAzNzUgKyB0aGlzLmNvdW50RmxvYXRNc2cqMjB9KTtcclxuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2crKztcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sIH0gZnJvbSBcIi4uL0NvbnN0L0dhbWVDb25maWdcIjtcclxuXHJcbi8qXHJcbiog5a6i5oi356uv5Y+R6YCB5ZmoXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNlbmRlcntcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAqIOeUqOaIt+eZu+W9lSAxMDExMDNcclxuICAgICogQHBhcmFtIHVzZXJOYW1lIFxyXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXHJcbiAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZXFVc2VyTG9naW4odXNlck5hbWU6c3RyaW5nLHVzZXJLZXk6c3RyaW5nKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlcVVzZXJMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxVXNlckxvZ2luXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcclxuICAgICAgICBtZXNzYWdlLnVzZXJLZXkgPSB1c2VyS2V5O1xyXG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyTG9naW4uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfTE9HSU4sYnVmZmVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICog55So5oi35rOo5YaMIDEwMTEwNFxyXG4gICAgICogQHBhcmFtIHVzZXJOYW1lIFxyXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXHJcbiAgICAqIEBwYXJhbSB1c2VyTmlja05hbWVcclxuICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcVVzZXJSZWdpc3Rlcih1c2VyTmFtZTpzdHJpbmcsdXNlcktleTpzdHJpbmcsdXNlck5pY2tOYW1lOnN0cmluZyk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHZhciBSZXFVc2VyUmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJSZWdpc3RlclwiKTtcclxuICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgICAgICB2YXIgdXNlckRhdGE6YW55ID0ge307XHJcbiAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xyXG4gICAgICAgIG1lc3NhZ2UudXNlcktleSA9IHVzZXJLZXk7XHJcbiAgICAgICAgdXNlckRhdGEubmlja05hbWUgPSB1c2VyTmlja05hbWU7XHJcbiAgICAgICAgdXNlckRhdGEubHYgPSAxO1xyXG4gICAgICAgIG1lc3NhZ2UudXNlckRhdGEgPSB1c2VyRGF0YTtcclxuICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXNlclJlZ2lzdGVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDor7fmsYLljLnphY3lr7nlsYAgMTAyMTAxXHJcbiAgICAgKiBAcGFyYW0gdXNlcklkIFxyXG4gICAgKiBAcGFyYW0gbWF0Y2hJZCBcclxuICAgICovXHJcbiAgIHB1YmxpYyBzdGF0aWMgcmVxTWF0Y2godXNlcklkOm51bWJlcixtYXRjaElkOm51bWJlcik6dm9pZFxyXG4gICB7XHJcbiAgICAgICB2YXIgUmVxTWF0Y2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hdGNoXCIpO1xyXG4gICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcclxuICAgICAgIG1lc3NhZ2UubWF0Y2hJZCA9IG1hdGNoSWQ7XHJcbiAgICAgICB2YXIgYnVmZmVyID0gUmVxTWF0Y2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0gsYnVmZmVyKTtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAgKiDor7fmsYIg5a+55bGA5o6l5Y+XIOi/lOWbnjEwMjIwMlxyXG4gICAgICogQHBhcmFtIHVzZXJJZCBcclxuICAgICogQHBhcmFtIGlzQWNjZXB0ZSBcclxuICAgICovXHJcbiAgIHB1YmxpYyBzdGF0aWMgcmVxTWF0Y2hBY2NlcHQodXNlcklkOm51bWJlcixpc0FjY2VwdGU6bnVtYmVyKTp2b2lkXHJcbiAgIHtcclxuICAgICAgIHZhciBSZXFNYXRjaEFjY2VwdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWF0Y2hBY2NlcHRcIik7XHJcbiAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgICAgIG1lc3NhZ2UudXNlcklkID0gdXNlcklkO1xyXG4gICAgICAgbWVzc2FnZS5pc0FjY2VwdGUgPSBpc0FjY2VwdGU7XHJcbiAgICAgICB2YXIgYnVmZmVyID0gUmVxTWF0Y2hBY2NlcHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0hfQUNDRVBULGJ1ZmZlcik7XHJcbiAgIH1cclxuICAgIFxyXG4gICAgLyoqKua2iOaBr+WPkemAgSovXHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKip3ZWJTb2NrZXQgKi9cclxuICAgIC8qKuWPkemAgUdN5a+G5LukICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUdtTXNnKGdtOnN0cmluZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFHTUNvbW06YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdNQ29tbVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLmNvbW0gPSBnbTtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR01Db21tLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9HTV9DT00sYnVmZmVyKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKirlv4Pot7PljIUgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgc2VydkhlYXJ0UmVxKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1NFUlZfSEVSVCk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOeUqOaIt+azqOWGjFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUmVxKHVzZXJOYW1lOnN0cmluZyx1c2VyUGFzczpzdHJpbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUmVnaXN0ZXJVc2VyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFSZWdpc3RlclVzZXJcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudXNlclBhc3MgPSB1c2VyUGFzcztcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUmVnaXN0ZXJVc2VyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOeZu+W9leacjeWKoeWZqFxyXG4vLyAgICAgICogQHBhcmFtIHRva2VuIFxyXG4vLyAgICAgICogQHBhcmFtIHNlcnZJZCBcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBsb2dpblNlcnZSZXEoc2VydklkOm51bWJlcik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTG9naW5cIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5jb2RlID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpbkF1dGhlbnRpY2F0aW9uO1xyXG4vLyAgICAgICAgIG1lc3NhZ2Uuc2VydmVySWQgPSBzZXJ2SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5hZ2VudElkID0gMTtcclxuLy8gICAgICAgICBtZXNzYWdlLmNsaWVudElkID0gMTtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTG9naW4uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1NFUlZfTE9HSU4sYnVmZmVyKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5Yib5bu66KeS6ImyXHJcbi8vICAgICAgKiBAcGFyYW0gc2V4IFxyXG4vLyAgICAgICogQHBhcmFtIHBsYXllck5hbWUgXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUGxheWVyUmVxKHNleDpudW1iZXIscGxheWVyTmFtZTpzdHJpbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxQ3JlYXRlUGxheWVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFDcmVhdGVQbGF5ZXJcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5nZW5kZXIgPSBzZXg7XHJcbi8vICAgICAgICAgbWVzc2FnZS5wbGF5ZXJOYW1lID0gcGxheWVyTmFtZTtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQ3JlYXRlUGxheWVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9DUkVBVEVfUExBWUVSLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5omA5pyJ5oqA6IO95L+h5oGvICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUFsbFNraWxsSW5mbygpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9BTExfU0tJTExfSU5GTyk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlh7rmiJjmioDog73kv6Hmga8gKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRmlnaHRTa2lsbExpc3QoKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRklHSFRfU0tJTExfTElTVCk7ICAgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLljYfnuqfmioDog70gKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXBTa2lsbChza2lsbFVwTHZWb3M6QXJyYXk8U2tpbGxVcEx2Vm8+KTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVVwU2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVwU2tpbGxcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QgPSBbXTtcclxuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XHJcbi8vICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNraWxsVXBMdlZvcy5sZW5ndGg7aSsrKVxyXG4vLyAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgaW5mbyA9IHt9O1xyXG4vLyAgICAgICAgICAgICBpbmZvLnNraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0uc2tpbGxJZDtcclxuLy8gICAgICAgICAgICAgaW5mby50b1NraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0udG9Ta2lsbElkO1xyXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnNraWxsTGlzdC5wdXNoKGluZm8pO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXBTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVBfU0tJTEwsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLph43nva7mioDog70gKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUmVzZXRTa2lsbCgpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9SRVNFVF9TS0lMTCk7ICAgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLkvb/nlKjpgZPlhbcgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXNlKHByb3BJZDpMb25nLG51bTpudW1iZXIsYXJncz86c3RyaW5nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVVzZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxVXNlXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UubnVtID0gbnVtO1xyXG4vLyAgICAgICAgIGlmKGFyZ3MpXHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuYXJncyA9IGFyZ3M7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFLGJ1ZmZlcik7ICBcclxuLy8gICAgIH1cclxuICAgIFxyXG4vLyAgICAgLyoq6K+35rGC5a6g54mp5ZCI5oiQICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldENvbXBvdW5kKHByb3BJZDpMb25nKVxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRDb21wb3VuZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0Q29tcG91bmRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wSWQgPSBwcm9wSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldENvbXBvdW5kLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfQ09NUE9VTkQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6K+35rGC5ZaC5a6g54mp5ZCD6aWtKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RmVlZChwZXRJZDpMb25nLHByb3BMaXN0OkFycmF5PFByb3BWbz4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0RmVlZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0RmVlZFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wTGlzdCA9IHByb3BMaXN0O1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRGZWVkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRkVFRCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuXHJcblxyXG4vLyAgICAgLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUFsdGVyR3JpZFNraWxsKHR5cGU6bnVtYmVyLHNraWxsVXBHcmlkOlNraWxsVXBHcmlkVm8pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxQWx0ZXJHcmlkU2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUFsdGVyR3JpZFNraWxsXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7ICAgICAgICBcclxuLy8gICAgICAgICB2YXIgdm86YW55ID0ge307XHJcbi8vICAgICAgICAgdm8uZ3JpZElkID0gc2tpbGxVcEdyaWQuZ3JpZElkO1xyXG4vLyAgICAgICAgIHZvLnNraWxsSWQgPSBza2lsbFVwR3JpZC5za2lsbElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ3JpZCA9IHZvOyAgICAgICAgXHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUFsdGVyR3JpZFNraWxsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTsgICAgICAgIFxyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0FMVEVSX0dSSURfU0tJTEwsYnVmZmVyKTsgICBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguaUueWPmOWuoOeJqemYteWei+agvOWtkCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRBbHRlckdyaWQodHlwZTpudW1iZXIsZ3JpZExpc3Q6QXJyYXk8TGluZXVwR3JpZFZvPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRBbHRlckdyaWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEFsdGVyR3JpZFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QgPSBbXTtcclxuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XHJcbi8vICAgICAgICAgZm9yKHZhciBpID0gMDtpIDwgZ3JpZExpc3QubGVuZ3RoO2krKylcclxuLy8gICAgICAgICB7XHJcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcclxuLy8gICAgICAgICAgICAgaW5mby5ncmlkSWQgPSBncmlkTGlzdFtpXS5ncmlkSWQ7XHJcbi8vICAgICAgICAgICAgIGluZm8ucGV0SWQgPSBncmlkTGlzdFtpXS5oZXJvSWQ7XHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QucHVzaChpbmZvKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEFsdGVyR3JpZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0FMVEVSX0dSSUQsYnVmZmVyKTsgICBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5omt6JuLIG1zZ0lkPTEwMjEwMVxyXG4vLyAgICAgICogQHBhcmFtIG1vbmV5VHlwZSAvLyDmia3om4vnsbvlnosgMD3ph5HluIHmir0gMT3pkrvnn7Pmir1cclxuLy8gICAgICAqIEBwYXJhbSBudW1UeXBlIOasoeaVsOexu+WeiyAwPeWFjei0ueWNleaKvSAxPeWNleaKvSAyPeWNgei/nuaKvVxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUdhY2hhKG1vbmV5VHlwZTpudW1iZXIsbnVtVHlwZTpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxR2FjaGE6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdhY2hhXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IG1vbmV5VHlwZTtcclxuLy8gICAgICAgICBtZXNzYWdlLm51bVR5cGUgPSBudW1UeXBlO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFHYWNoYS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfR0FDSEEsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyAqL1xyXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU3BlZWRGaWdodCgpOnZvaWRcclxuLy8gICAgICB7XHJcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TUEVFRF9GSUdIVCk7XHJcbi8vICAgICAgfVxyXG5cclxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHotK3kubDmiavojaEgKi9cclxuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcEJ1eVN3ZWVwKCk6dm9pZFxyXG4vLyAgICAgIHtcclxuLy8gICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX0JVWV9TV0VFUCk7XHJcbi8vICAgICAgfSAgIFxyXG5cclxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHmiavojaEgICovXHJcbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTd2VlcEZpZ2h0KHNjZW5lSWQ6bnVtYmVyKTp2b2lkXHJcbi8vICAgICAge1xyXG4vLyAgICAgICAgICB2YXIgIFJlcU1hcFN3ZWVwRmlnaHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hcFN3ZWVwRmlnaHRcIik7XHJcbi8vICAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgICBtZXNzYWdlLnNjZW5lSWQgPSBzY2VuZUlkO1xyXG4vLyAgICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFwU3dlZXBGaWdodC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TV0VFUF9GSUdIVCxidWZmZXIpO1xyXG4vLyAgICAgIH1cclxuXHJcbi8vICAgICAvKirpmo/mnLrliJvlu7rkuIDmnaHpvpkgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmFuZG9tQ3JlYXRlKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SQU5ET01fQ1JFQVRFKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWcsOWbvuaZrumAmuaImOaWl++8iOWuouaIt+err+S4gOWcuuaImOaWl+e7k+adn+S5i+WQjuWPkemAgeatpOa2iOaBr++8jOWGjei/m+ihjOWAkuiuoeaXtuWSjOacrOWcsOWBh+aImOaWl++8iSBtc2dJZD0xMDYxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDEgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHQoKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX05PUk1BTF9GSUdIVCk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlhbPljaHlgYfmiJjmlpfnu5PmnZ/pooblj5blpZblirEgbXNnSWQ9MTA2MTA5XHRcdC0tLS0t6L+U5Zue5raI5oGvIOi/lOWbnuaIkOWKn+a2iOaBr++8jGNvZGU9MTA2MjAzICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcE5vcm1hbEZpZ2h0RW5kKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9OT1JNQUxfRklHSFRfRU5EKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcFNjZW5lRmlnaHQoKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NDRU5FX0ZJR0hUKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWRiuivieacjeWKoeWZqOaImOaWl+aSreaUvue7k+adn++8iOS7heS7heW6lOeUqOS6juaJgOacieecn+aImOaWl++8iSBtc2dJZD0xMDYxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDMgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVHVyZUZpZ2h0RW5kKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1RSVUVfRklHSFRfRU5EKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5YiH5o2i5Zyw5Zu+5YWz5Y2hIG1zZ0lkPTEwNjEwOFx0XHQtLS0tLei/lOWbnua2iOaBryDlia/mnKxpZOWSjOWFs+WNoWlkIOWxnuaAp+WPmOWMlua2iOaBr1xyXG4vLyAgICAgICogQHBhcmFtIHNjZW5lSWQgXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwQ2hhbmdlU2NlbmUoc2NlbmVJZDpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTWFwQ2hhbmdlU2NlbmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hcENoYW5nZVNjZW5lXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2Uuc2NlbmVJZCA9IHNjZW5lSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1hcENoYW5nZVNjZW5lLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfQ0hBTkdFX1NDRU5FLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqeS6pOmFjSBtc2dJZD0xMDUxMDlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDlcclxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEgXHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQyIFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZyhwZXRJZDE6TG9uZyxwZXRJZDI6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ1wiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkMSA9IHBldElkMTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkMiA9IHBldElkMjtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqei/m+WMliBtc2dJZD0xMDUxMTBcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTFcclxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEg6L+b5YyW5a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSBiZVBldElkTGlzdCDmtojogJflrqDnialpZOWIl+ihqFxyXG4vLyAgICAgICogQHBhcmFtIHByb3BJZCDmtojogJfpgZPlhbfllK/kuIBpZFxyXG4vLyAgICAgICogQHBhcmFtIHByb3BOdW0g5raI6ICX6YGT5YW35pWw6YePXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RXZvbHZlKHBldElkOkxvbmcsYmVQZXRJZExpc3Q6QXJyYXk8TG9uZz4scHJvcElkTGlzdDpBcnJheTxMb25nPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRFdm9sdmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEV2b2x2ZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgaWYoYmVQZXRJZExpc3QubGVuZ3RoID4gMClcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5iZVBldElkTGlzdCA9IGJlUGV0SWRMaXN0O1xyXG4vLyAgICAgICAgIGlmKHByb3BJZExpc3QubGVuZ3RoID4gMClcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5wcm9wSWRMaXN0ID0gcHJvcElkTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0RXZvbHZlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRVZPTFZFLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqeWtteWMliBtc2dJZD0xMDUxMTFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDNcclxuLy8gICAgICAqIEBwYXJhbSBlZ2dJZCDlrqDnianom4vllK/kuIBpZFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEhhdGNoKGVnZ0lkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0SGF0Y2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEhhdGNoXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZWdnSWQgPSBlZ2dJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0SGF0Y2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9IQVRDSCxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MTEyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEyXHJcbi8vICAgICAgKiBAcGFyYW0gZWdnSWQg5a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWQg6ZyA6KaB5ZOB6LSo5p2h5Lu2aWQoMOihqOekuuS4jemZkOWItilcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZWdpc3RlcihwZXRJZDpMb25nLHF1YWxpdHlJZDpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0UmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlZ2lzdGVyXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZCA9IHF1YWxpdHlJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRUdJU1RFUixidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MTEzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEzXHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg6K+35rGC5pa55a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOaOpeaUtuaWueWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmVxTWF0aW5nKHBldElkOkxvbmcsdG9QZXRJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldFJlcU1hdGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVxTWF0aW5nXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGV0SWQgPSB0b1BldElkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRSZXFNYXRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRVFfTUFUSU5HLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUxMTRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTRcclxuLy8gICAgICAqIEBwYXJhbSBwZXRUeXBlICAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXHJcbi8vICAgICAgKiBAcGFyYW0gY29uZmlnSWQg5a6g54mp6YWN572uaWTvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciAg5a6g54mp5oCn5Yir77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWRMaXN0IOWuoOeJqeWTgei0qGlk77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdBbGxJbmZvKHBldFR5cGU6bnVtYmVyLGNvbmZpZ0lkOm51bWJlcixnZW5kZXI6bnVtYmVyLHF1YWxpdHlJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdBbGxJbmZvOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdBbGxJbmZvXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0VHlwZSA9IHBldFR5cGU7XHJcbi8vICAgICAgICAgbWVzc2FnZS5jb25maWdJZCA9IGNvbmZpZ0lkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gZ2VuZGVyO1xyXG4vLyAgICAgICAgIGlmKHF1YWxpdHlJZExpc3QubGVuZ3RoID4gMClcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWRMaXN0ID0gcXVhbGl0eUlkTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQWxsSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19BTExJTkZPLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUxMTVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTVcclxuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDlrqDnianllK/kuIBpZFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFNlbGVjdFJlcUxpc3QocGV0SWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRTZWxlY3RSZXFMaXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTZWxlY3RSZXFMaXN0XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2VsZWN0UmVxTGlzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NFTEVDVF9SRVFfTElTVCxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MTE2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE277yM5aaC5p6c5piv5ZCM5oSP77yM5a+55pa5546p5a625aaC5p6c5Zyo57q/77yM5Lya5pS25YiwbXNnSWQ9MTA1MjEw5raI5oGvXHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg5oiR5pa55a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOWvueaWueWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKiBAcGFyYW0gaXNDb25zZW50IOaYr+WQpuWQjOaEjyB0cnVlPeWQjOaEj1xyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ0Nob29zZShwZXRJZDpMb25nLHRvUGV0SWQ6TG9uZyxpc0NvbnNlbnQ6Ym9vbGVhbik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdDaG9vc2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ0Nob29zZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmlzQ29uc2VudCA9IGlzQ29uc2VudDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQ2hvb3NlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX0NIT09TRSxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nm67moIfliLfmlrAgbXNnSWQ9MTA1MTE3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE3XHJcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXHJcbi8vICAgICAgKiBAcGFyYW0gY29uZmlnSWQg5a6g54mp6YWN572uaWTvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciDlrqDnianmgKfliKvvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIHF1YWxpdHlJZExpc3Qg5a6g54mp5ZOB6LSoaWTvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2gocGV0VHlwZTpudW1iZXIsY29uZmlnSWQ6bnVtYmVyLGdlbmRlcjpudW1iZXIscXVhbGl0eUlkTGlzdDpBcnJheTxudW1iZXI+KTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2hcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRUeXBlID0gcGV0VHlwZTtcclxuLy8gICAgICAgICBtZXNzYWdlLmNvbmZpZ0lkID0gY29uZmlnSWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5nZW5kZXIgPSBnZW5kZXI7XHJcbi8vICAgICAgICAgaWYocXVhbGl0eUlkTGlzdC5sZW5ndGggPiAwKVxyXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZExpc3QgPSBxdWFsaXR5SWRMaXN0O1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNILGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMThcclxuLy8gICAgICAqIEBwYXJhbSB0b1BsYXllcklkIOiiq+afpeeci+WuoOeJqeeahOS4u+S6uueahGlkXHJcbi8vICAgICAgKiBAcGFyYW0gdG9QZXRJZCDooqvmn6XnnIvlrqDnianllK/kuIBpZFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ1RhcmdldExvb2sodG9QbGF5ZXJJZDpMb25nLHRvUGV0SWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRMb29rOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRMb29rXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nVGFyZ2V0TG9vay5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19DSE9PU0UsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuXHJcblxyXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAxICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwTWFrZShwcm9wSWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFFcXVpcE1ha2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTWFrZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDsgICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcE1ha2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX01BS0UsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKiror7fmsYLoo4XlpIfliIbop6MgbXNnSWQ9MTA5MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA2ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwU3BsaXQoZXF1aXBJZDpBcnJheTxMb25nPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFFcXVpcFNwbGl0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcFNwbGl0XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBTcGxpdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfU1BMSVQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvY2socGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRXF1aXBMb2NrOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcExvY2tcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2NrLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9MT0NLLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKuivt+axguijheWkh+W8uuWMliBtc2dJZD0xMDkxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDUgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBBdHRBZGQocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcsbHVja051bTpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRXF1aXBMb2NrOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcExvY2tcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7IFxyXG4vLyAgICAgICAgIG1lc3NhZ2UubHVja051bSA9IGx1Y2tOdW07ICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvY2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX0FUVF9BREQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vIFx0Lyoq6K+35rGC6KOF5aSH56m/5oi0IG1zZ0lkPTEwOTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvYWRpbmcocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2FkaW5nXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvYWRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX0xPQURJTkcsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLoo4XlpIfljbjovb0gbXNnSWQ9MTA5MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAzICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwVW5Mb2FkaW5nKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKVxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFFcXVpcFVuTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBVbkxvYWRpbmdcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICAgICAgICAgXHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwVW5Mb2FkaW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9VTkxPQURJTkcsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vIFx0Lyoq6K+35rGC5a6g54mp6aKG5oKf5oqA6IO9IG1zZ0lkPTEwNTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTdHVkeVNraWxsKHBldElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0U3R1ZHlTa2lsbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U3R1ZHlTa2lsbFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFN0dWR5U2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TVFVEWV9TS0lMTCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXNldFNraWxsKHBldElkOkxvbmcsc2tpbGxJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRSZXNldFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRSZXNldFNraWxsXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgXHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIGlmKHNraWxsSWRMaXN0Lmxlbmd0aCA+IDApXHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZExpc3QgPSBza2lsbElkTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVzZXRTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1JFU0VUX1NLSUxMLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5a6g54mp5oqA6IO96L+b6Zi2IG1zZ0lkPTEwNTEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFQZXRTa2lsbFVwKHBldElkOkxvbmcsc2tpbGxJZDpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0U2tpbGxVcDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U2tpbGxVcFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbElkID0gc2tpbGxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2tpbGxVcC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NLSUxMX1VQLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gLyoq6K+35rGC5a6g54mp5pS+55SfIG1zZ0lkPTEwNTExOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRGcmVlKHBldElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVzUGV0RnJlZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzUGV0RnJlZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlc1BldEZyZWUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9GUkVFLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAyICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxBd2FyZChtYWlsSWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFNYWlsQXdhcmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxBd2FyZFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbEF3YXJkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0FXQVJELGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAzICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxEZWxldGUobWFpbElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTWFpbERlbGV0ZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbERlbGV0ZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbERlbGV0ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9ERUxFVEUsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU9wZW5NYWlsKG1haWxJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcU9wZW5NYWlsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFPcGVuTWFpbFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxT3Blbk1haWwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX09QRU5fTUFJTCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axgumihuWPlumCruS7tuWlluWKsSBtc2dJZD0xMTExMDJcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsQXdhcmQobWFpbElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTWFpbEF3YXJkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsQXdhcmRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxBd2FyZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9BV0FSRCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWIoOmZpOmCruS7tiBtc2dJZD0xMTExMDNcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsRGVsZXRlKG1haWxJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcU1haWxEZWxldGU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxEZWxldGVcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxEZWxldGUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfREVMRVRFLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMSAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRQdXNoKCk6dm9pZFxyXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9QVVNIKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZFNlYXJjaCh0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kU2VhcmNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRTZWFyY2hcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kU2VhcmNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfU0VBUkNILGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRBcHBseSh0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kQXBwbHk6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEFwcGx5XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEFwcGx5LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfQVBQTFksYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vmk43kvZwgbXNnSWQ9MTEyMTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA0ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZE9wZXJhdGlvbih0eXBlOm51bWJlcix0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kT3BlcmF0aW9uOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRPcGVyYXRpb25cIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTtcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRPcGVyYXRpb24uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9PUEVSQVRJT04sYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA1ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZE1vcmVJbmZvKHRvUGxheWVySWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRNb3JlSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kTW9yZUluZm9cIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRNb3JlSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX01PUkVfSU5GTyxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWlveWPi+mAgeekvCBtc2dJZD0xMTIxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDYgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kR2lmdChnaWZ0SWQ6bnVtYmVyLHRvUGxheWVySWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRHaWZ0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRHaWZ0XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgICAgICAgXHJcbi8vICAgICAgICAgbWVzc2FnZS5naWZ0SWQgPSBnaWZ0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kR2lmdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0dJRlQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA3ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEFsbEluZm8oKTp2b2lkXHJcbi8vICAgICB7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0FsbF9JbmZvKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vliIfno4sgbXNnSWQ9MTEyMTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA4MjAxICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEZpZ2h0KHRvUGxheWVySWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRGaWdodDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kRmlnaHRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRGaWdodC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0ZJR0hULGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKirnmbvlvZXor7fmsYIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgbG9naW5SZXEoYWNjb3VudDpzdHJpbmcpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgTG9naW5SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJMb2dpblJlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5uYW1lID0gYWNjb3VudDtcclxuICAgIC8vICAgICBtZXNzYWdlLnRva2VuID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpblRva2VuO1xyXG4gICAgLy8gICAgIG1lc3NhZ2Uubmlja25hbWUgPSBcInhpZWxvbmdcIjtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gTG9naW5SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlVTRVJfTE9HSU4sUHJvdG9jb2wuVVNFUl9MT0dJTl9DTUQsYnVmZmVyKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKuiOt+WPluiLsembhOS/oeaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBnZXRIZXJvSW5mb1JlcShzdGF0dXNDb2RlOm51bWJlcik6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBIZXJvSW5mb1JlcXVlc3Q6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkhlcm9JbmZvUmVxdWVzdFwiKTtcclxuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xyXG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBIZXJvSW5mb1JlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX0dFVF9JTkZPUyxidWZmZXIpO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gLyoq6Iux6ZuE5LiK44CB5LiL44CB5pu05paw6Zi15Z6LICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGhlcm9MaW51ZXBVcGRhdGVSZXEobGluZXVwSWQ6bnVtYmVyLGhlcm9JZDpzdHJpbmcsaXNVcDpib29sZWFuKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgaWYoIWlzVXAgJiYgR2FtZURhdGFNYW5hZ2VyLmlucy5zZWxmUGxheWVyRGF0YS5oZXJvTGluZXVwRGljLnZhbHVlcy5sZW5ndGggPD0gMSlcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIFRpcHNNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2coXCLpmLXkuIroi7Hpm4TkuI3lvpflsJHkuo7kuIDkuKpcIiwzMCxcIiNmZjAwMDBcIixMYXllck1hbmFnZXIuaW5zLmdldExheWVyKExheWVyTWFuYWdlci5USVBfTEFZRVIpLEdhbWVDb25maWcuU1RBR0VfV0lEVEgvMixHYW1lQ29uZmlnLlNUQUdFX0hFSUdIVC8yLDEsMCwyMDApO1xyXG4gICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHZhciBVcGRhdGVGb3JtYXRpb25SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJVcGRhdGVGb3JtYXRpb25SZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2Uuc2l0ZUlkeCA9IGxpbmV1cElkO1xyXG4gICAgLy8gICAgIG1lc3NhZ2UuaGVyb0lkID0gaGVyb0lkO1xyXG4gICAgLy8gICAgIG1lc3NhZ2UuZmxhZyA9IGlzVXA7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFVwZGF0ZUZvcm1hdGlvblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX1VQREFURV9GT1JNQVRJT04sYnVmZmVyKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKuivt+axguWFs+WNoeS/oeaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlR2F0ZUluZm9SZXEoKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIEdhdGVJbmZvUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJHYXRlSW5mb1JlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gMTtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gR2F0ZUluZm9SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9JTkZPLGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKirmjJHmiJjlhbPljaEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgYmFsbHRlR2F0ZVJlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBCYXR0bGVHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJCYXR0bGVHYXRlUmVxdWVzdFwiKTtcclxuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xyXG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBCYXR0bGVHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfQkFUVExFLGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gLyoq6K+35rGC5omr6I2h5YWz5Y2hICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIHNjYW5HYXRlUmVxKGdhdGVLZXk6c3RyaW5nKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIFNjYW5HYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJTY2FuR2F0ZVJlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gU2NhbkdhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9TQ0FOLGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKiror7fmsYLlhbPljaHmjILmnLrlpZblirHkv6Hmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZUhhbmd1cFN0YXRlUmVxKCk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBIYW5ndXBTdGF0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiSGFuZ3VwU3RhdGVSZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IDE7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEhhbmd1cFN0YXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFLGJ1ZmZlcik7XHJcbiAgICAvLyAgICAgLy8gV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKuivt+axguWFs+WNoeaMguacuuS/oeaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlU3dpdGNoSGFuZ1JlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBTd2l0Y2hIYW5nR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFN3aXRjaEhhbmdHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfU1dJVENIX0hBTkdfR0FURSxidWZmZXIpO1xyXG4gICAgLy8gICAgIC8vIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0hBTkRVUF9TVEFURSk7XHJcbiAgICAvLyB9XHJcbiAgICBcclxuXHJcblxyXG4gICAgLy8gLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipIdHRwICovXHJcbiAgICAvLyAvKirmtYvor5XnmbvlvZUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgaHR0cExvZ2luUmVxKGFjY291bnQ6c3RyaW5nLHB3ZDpzdHJpbmcsY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIHBhcmFtczphbnkgPSB7fTtcclxuICAgIC8vICAgICBwYXJhbXMuYWNjb3VudCA9IGFjY291bnQ7XHJcbiAgICAvLyAgICAgcGFyYW1zLnBhc3N3b3JkID0gcHdkO1xyXG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLnRlc3RMb2dpblVSTCxIVFRQUmVxVHlwZS5HRVQscGFyYW1zLGNhbGxlcixjYWxsQmFjayk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKirojrflj5bmnI3liqHlmajliJfooaggKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgaHR0cEdhbWVTZXJ2ZXJSZXEoY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZ2FtZVNlcnZlclVSTCxIVFRQUmVxVHlwZS5HRVQsbnVsbCxjYWxsZXIsY2FsbEJhY2spO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gLyoq6L+b5YWl5ri45oiPICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBFbnRlckdhbWVSZXEoc2lkOm51bWJlcixjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgcGFyYW1zOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIHBhcmFtcy5zaWQgPSBzaWQ7XHJcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZW50ZXJHYW1lVVJMLEhUVFBSZXFUeXBlLkdFVCxwYXJhbXMsY2FsbGVyLGNhbGxCYWNrKTtcclxuICAgIC8vIH1cclxufSIsIi8qXHJcbiog5YyF6Kej5p6QXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VJbiBleHRlbmRzIExheWEuQnl0ZXtcclxuICAgIFxyXG4gICAgLy8gcHVibGljIG1vZHVsZTpudW1iZXI7XHJcbiAgICBwdWJsaWMgY21kOm51bWJlcjtcclxuICAgIHB1YmxpYyBib2R5O1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgLy8gcHVibGljIHJlYWQobXNnOk9iamVjdCA9IG51bGwpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXHJcbiAgICAvLyAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xyXG4gICAgLy8gICAgIHRoaXMucG9zID0gMDtcclxuICAgIC8vICAgICAvL+agh+iusOWSjOmVv+W6plxyXG4gICAgLy8gICAgIHZhciBtYXJrID0gdGhpcy5nZXRJbnQxNigpO1xyXG4gICAgLy8gICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAvLyAgICAgLy/ljIXlpLRcclxuICAgIC8vICAgICB0aGlzLm1vZHVsZSA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICB0aGlzLmNtZCA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICB2YXIgdHlwZSA9IHRoaXMuZ2V0Qnl0ZSgpO1xyXG4gICAgLy8gICAgIHZhciBmb3JtYXQgPSB0aGlzLmdldEJ5dGUoKTtcclxuICAgIC8vICAgICAvL+aVsOaNrlxyXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcclxuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgXHJcbiAgICAvL+aWsOmAmuS/oVxyXG4gICAgLy8gcHVibGljIHJlYWQobXNnOk9iamVjdCA9IG51bGwpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXHJcbiAgICAvLyAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xyXG4gICAgLy8gICAgIHRoaXMucG9zID0gMDtcclxuXHJcbiAgICAvLyAgICAgdmFyIGxlbiA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICB0aGlzLmNtZCA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICAvL+aVsOaNrlxyXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcclxuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgLy/mlrDpgJrkv6Eg57KY5YyF5aSE55CGXHJcbiAgICBwdWJsaWMgcmVhZChidWZmRGF0YSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGJ1ZmZEYXRhKTtcclxuICAgICAgICB0aGlzLnBvcyA9IDA7XHJcblxyXG4gICAgICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAgICAgLy/mlbDmja5cclxuICAgICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG59XHJcbiIsImltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuL1dlYlNvY2tldE1hbmFnZXJcIjtcclxuXHJcbi8qXHJcbiog5omT5YyFXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VPdXQgZXh0ZW5kcyBMYXlhLkJ5dGV7XHJcbiAgICAvLyBwcml2YXRlIFBBQ0tFVF9NQVJLID0gMHgwO1xyXG4gICAgLy8gcHJpdmF0ZSBtb2R1bGUgPSAwO1xyXG4gICAgLy8gcHJpdmF0ZSB0eXBlID0gMDtcclxuICAgIC8vIHByaXZhdGUgZm9ybWFydCA9IDA7XHJcbiAgICBwcml2YXRlIGNtZDtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIC8vIHB1YmxpYyBwYWNrKG1vZHVsZSxjbWQsZGF0YT86YW55KTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xyXG4gICAgLy8gICAgIHRoaXMubW9kdWxlID0gbW9kdWxlO1xyXG4gICAgLy8gICAgIHRoaXMuY21kID0gY21kO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQxNih0aGlzLlBBQ0tFVF9NQVJLKTtcclxuICAgIC8vICAgICB0aGlzLndyaXRlSW50MzIoZGF0YS5ieXRlTGVuZ3RoICsgMTApO1xyXG4gICAgLy8gICAgIC8v5YyF5aS0XHJcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDMyKHRoaXMubW9kdWxlKTtcclxuICAgIC8vICAgICB0aGlzLndyaXRlSW50MzIodGhpcy5jbWQpO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMudHlwZSk7XHJcbiAgICAvLyAgICAgdGhpcy53cml0ZUJ5dGUodGhpcy5mb3JtYXJ0KTtcclxuICAgIC8vICAgICAvL+a2iOaBr+S9k1xyXG4gICAgLy8gICAgIGlmKGRhdGEpXHJcbiAgICAvLyAgICAge1xyXG4gICAgLy8gICAgICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIoZGF0YSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKuaWsOmAmuS/oSAqL1xyXG4gICAgcHVibGljIHBhY2soY21kLGRhdGE/OmFueSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcclxuXHJcbiAgICAgICAgdGhpcy5jbWQgPSBjbWQ7XHJcbiAgICAgICAgdmFyIGxlbiA9IChkYXRhID8gZGF0YS5ieXRlTGVuZ3RoIDogMCkgKyAxMjtcclxuICAgICAgICB2YXIgY29kZTpudW1iZXIgPSBXZWJTb2NrZXRNYW5hZ2VyLmNvZGVDb3VudF5sZW5eNTEyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMihsZW4pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCk7XHJcbiAgICAgICAgdGhpcy53cml0ZUludDMyKGNvZGUpO1xyXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XHJcbiAgICAgICAgaWYoZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50KysgO1xyXG4gICAgfVxyXG5cclxufSIsIi8qXHJcbiog5pWw5o2u5aSE55CGSGFubGRlclxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRIYW5kbGVye1xyXG4gICAgLy8gcHVibGljIHN0YXR1c0NvZGU6bnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBjYWxsZXI6YW55O1xyXG4gICAgcHJpdmF0ZSBjYWxsQmFjazpGdW5jdGlvbjtcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcj86YW55LGNhbGxiYWNrPzpGdW5jdGlvbil7XHJcbiAgICAgICAgdGhpcy5jYWxsZXIgPSBjYWxsZXI7XHJcbiAgICAgICAgdGhpcy5jYWxsQmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHBsYWluKGRhdGE/OmFueSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8vIHZhciBzdGF0dXNDb2RlID0gZGF0YS5zdGF0dXNDb2RlO1xyXG4gICAgICAgIC8vIGlmKHN0YXR1c0NvZGUgPT0gMClcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuc3VjY2VzcyhkYXRhKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCLmnI3liqHlmajov5Tlm57vvJpcIixkYXRhLnN0YXR1c0NvZGUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICB0aGlzLnN1Y2Nlc3MoZGF0YSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc3VjY2VzcyhkYXRhPzphbnkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmNhbGxlciAmJiB0aGlzLmNhbGxCYWNrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsQmFjay5jYWxsKHRoaXMuY2FsbGVyLGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxCYWNrLmNhbGwodGhpcy5jYWxsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IERpY3Rpb25hcnkgZnJvbSBcIi4uLy4uL1Rvb2wvRGljdGlvbmFyeVwiO1xyXG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuLi9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IFBhY2thZ2VJbiBmcm9tIFwiLi9QYWNrYWdlSW5cIjtcclxuaW1wb3J0IFBhY2thZ2VPdXQgZnJvbSBcIi4vUGFja2FnZU91dFwiO1xyXG5pbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi9Tb2NrZXRIYW5kbGVyXCI7XHJcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4vQ2xpZW50U2VuZGVyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sIH0gZnJvbSBcIi4uL0NvbnN0L0dhbWVDb25maWdcIjtcclxuXHJcbi8qKlxyXG4gKiBzb2NrZXTkuK3lv4NcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlNvY2tldE1hbmFnZXIge1xyXG4gICAvKirpgJrkv6Fjb2Rl5qyh5pWwICovXHJcbiAgIHB1YmxpYyBzdGF0aWMgY29kZUNvdW50Om51bWJlciA9IDA7XHJcbiAgIHByaXZhdGUgaXA6c3RyaW5nO1xyXG4gICBwcml2YXRlIHBvcnQ6bnVtYmVyO1xyXG4gICBwcml2YXRlIHdlYlNvY2tldDpMYXlhLlNvY2tldDtcclxuICAgcHJpdmF0ZSBzb2NrZXRIYW5sZGVyRGljOkRpY3Rpb25hcnk7XHJcbiAgIHByaXZhdGUgcHJvdG9Sb290OmFueTtcclxuICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYyA9IG5ldyBEaWN0aW9uYXJ5KCk7XHJcbiAgIH1cclxuICAgcHJpdmF0ZSBzdGF0aWMgX2luczpXZWJTb2NrZXRNYW5hZ2VyID0gbnVsbDtcclxuICAgcHVibGljIHN0YXRpYyBnZXQgaW5zKCk6V2ViU29ja2V0TWFuYWdlcntcclxuICAgICAgIGlmKHRoaXMuX2lucyA9PSBudWxsKVxyXG4gICAgICAgeyAgXHJcbiAgICAgICAgICAgdGhpcy5faW5zID0gbmV3IFdlYlNvY2tldE1hbmFnZXIoKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0aGlzLl9pbnM7XHJcbiAgIH1cclxuXHJcbiAgIHB1YmxpYyBjb25uZWN0KGlwOnN0cmluZyxwb3J0Om51bWJlcik6dm9pZFxyXG4gICB7XHJcbiAgICAgICB0aGlzLmlwID0gaXA7XHJcbiAgICAgICB0aGlzLnBvcnQgPSBwb3J0O1xyXG5cclxuICAgICAgIHRoaXMud2ViU29ja2V0ID0gbmV3IExheWEuU29ja2V0KCk7XHJcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50Lk9QRU4sdGhpcyx0aGlzLndlYlNvY2tldE9wZW4pO1xyXG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5NRVNTQUdFLHRoaXMsdGhpcy53ZWJTb2NrZXRNZXNzYWdlKTtcclxuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuQ0xPU0UsdGhpcyx0aGlzLndlYlNvY2tldENsb3NlKTtcclxuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuRVJST1IsdGhpcyx0aGlzLndlYlNvY2tldEVycm9yKTtcclxuICAgICAgIC8v5Yqg6L295Y2P6K6uXHJcbiAgICAgICBpZighdGhpcy5wcm90b1Jvb3Qpe1xyXG4gICAgICAgICAgIHZhciBwcm90b0J1ZlVybHMgPSBbXCJvdXRzaWRlL3Byb3RvL1VzZXJQcm90by5wcm90b1wiLFwib3V0c2lkZS9wcm90by9NYXRjaFByb3RvLnByb3RvXCJdO1xyXG4gICAgICAgICAgIExheWEuQnJvd3Nlci53aW5kb3cucHJvdG9idWYubG9hZChwcm90b0J1ZlVybHMsdGhpcy5wcm90b0xvYWRDb21wbGV0ZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNvbm5lY3RCeVVybChcIndzOi8vXCIrdGhpcy5pcCtcIjpcIit0aGlzLnBvcnQpO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIC8qKuWFs+mXrXdlYnNvY2tldCAqL1xyXG4gICBwdWJsaWMgY2xvc2VTb2NrZXQoKTp2b2lkXHJcbiAgIHtcclxuICAgICAgIGlmKHRoaXMud2ViU29ja2V0KVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50Lk9QRU4sdGhpcyx0aGlzLndlYlNvY2tldE9wZW4pO1xyXG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50Lk1FU1NBR0UsdGhpcyx0aGlzLndlYlNvY2tldE1lc3NhZ2UpO1xyXG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XHJcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuRVJST1IsdGhpcyx0aGlzLndlYlNvY2tldEVycm9yKTtcclxuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5jbG9zZSgpO1xyXG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0ID0gbnVsbDtcclxuICAgICAgIH1cclxuICAgfVxyXG4gIFxyXG4gICBwcml2YXRlIHByb3RvTG9hZENvbXBsZXRlKGVycm9yLHJvb3QpOnZvaWRcclxuICAge1xyXG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMucHJvdG9Sb290ID0gcm9vdDtcclxuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLndlYlNvY2tldC5jb25uZWN0QnlVcmwoXCJ3czovL1wiK1dlYlNvY2tldE1hbmFnZXIuaW5zLmlwK1wiOlwiK1dlYlNvY2tldE1hbmFnZXIuaW5zLnBvcnQpO1xyXG4gICB9XHJcbiAgIHByaXZhdGUgd2ViU29ja2V0T3BlbigpOnZvaWRcclxuICAge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgb3Blbi4uLlwiKTtcclxuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhID0gbmV3IExheWEuQnl0ZSgpO1xyXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW47XHJcbiAgICAgICB0aGlzLnRlbXBCeXRlID0gbmV3IExheWEuQnl0ZSgpO1xyXG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcclxuXHJcbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmNvZGVDb3VudCA9IDE7XHJcbiAgICAgICAgLy8gICAgRXZlbnRNYW5hZ2VyLmlucy5kaXNwYXRjaEV2ZW50KEV2ZW50TWFuYWdlci5TRVJWRVJfQ09OTkVDVEVEKTvmmoLml7bkuI3pnIDopoHojrflj5bmnI3liqHlmajliJfooahcclxuICAgfVxyXG4gICAvL+e8k+WGsuWtl+iKguaVsOe7hFxyXG4gICBwcml2YXRlIGJ5dGVCdWZmRGF0YTpMYXlhLkJ5dGU7XHJcbiAgIC8v6ZW/5bqm5a2X6IqC5pWw57uEXHJcbiAgIHByaXZhdGUgdGVtcEJ5dGU6TGF5YS5CeXRlO1xyXG4gIFxyXG4gICBwcml2YXRlIHBhcnNlUGFja2FnZURhdGEocGFja0xlbik6dm9pZFxyXG4gICB7XHJcbiAgICAgICAvL+WujOaVtOWMhVxyXG4gICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xyXG4gICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLHBhY2tMZW4pO1xyXG4gICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xyXG4gICAgICAgLy/mlq3ljIXlpITnkIZcclxuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhID0gbmV3IExheWEuQnl0ZSh0aGlzLmJ5dGVCdWZmRGF0YS5nZXRVaW50OEFycmF5KHBhY2tMZW4sdGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoKSk7XHJcbiAgICAgICAvLyB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlcixwYWNrTGVuLHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XHJcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbjtcclxuXHJcbiAgICAgICAvL+ino+aekOWMhVxyXG4gICAgICAgdmFyIHBhY2thZ2VJbjpQYWNrYWdlSW4gPSBuZXcgUGFja2FnZUluKCk7XHJcbiAgICAgICAvLyB2YXIgYnVmZiA9IHRoaXMudGVtcEJ5dGUuYnVmZmVyLnNsaWNlKDAsdGhpcy50ZW1wQnl0ZS5sZW5ndGgpO1xyXG4gICAgICAgcGFja2FnZUluLnJlYWQodGhpcy50ZW1wQnl0ZS5idWZmZXIpO1xyXG5cclxuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG1zZy4uLlwiLHBhY2thZ2VJbi5jbWQsdGhpcy50ZW1wQnl0ZS5sZW5ndGgpO1xyXG4gICAgICAgaWYocGFja2FnZUluLmNtZCA9PSAxMDUyMDIpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XHJcbiAgICAgICB9XHJcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIrIHBhY2thZ2VJbi5jbWQ7XHJcbiAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XHJcbiAgICAgICBpZihoYW5kbGVycyAmJiBoYW5kbGVycy5sZW5ndGggPiAwKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIGZvcih2YXIgaSA9IGhhbmRsZXJzLmxlbmd0aCAtIDE7aSA+PSAwO2ktLSlcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIGhhbmRsZXJzW2ldLmV4cGxhaW4ocGFja2FnZUluLmJvZHkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICAvLyBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xyXG4gICAgICAgICAgIC8vICAgICBzb2NrZXRIYW5sZGVyLmV4cGxhaW4ocGFja2FnZUluLmJvZHkpO1xyXG5cclxuICAgICAgICAgICAvLyB9KTtcclxuICAgICAgIH1cclxuICAgICAgIFxyXG4gICAgICAgLy/pgJLlvZLmo4DmtYvmmK/lkKbmnInlrozmlbTljIVcclxuICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+IDQpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xyXG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIsMCw0KTtcclxuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XHJcbiAgICAgICAgICAgcGFja0xlbiA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XHJcbiAgICAgICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID49IHBhY2tMZW4pXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgXHJcbiAgIH1cclxuICAgLyoq6Kej5p6Q56m65YyFICovXHJcbiAgIHByaXZhdGUgcGFyc2VOdWxsUGFja2FnZShjbWQ6bnVtYmVyKTp2b2lkXHJcbiAgIHtcclxuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIisgY21kO1xyXG4gICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xyXG4gICAgICAgaWYoaGFuZGxlcnMpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcclxuICAgICAgICAgICAgICAgc29ja2V0SGFubGRlci5leHBsYWluKCk7XHJcbiAgICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgXHJcbiAgIHByaXZhdGUgd2ViU29ja2V0TWVzc2FnZShkYXRhKTp2b2lkXHJcbiAgIHtcclxuICAgICAgIHRoaXMudGVtcEJ5dGUgPSBuZXcgTGF5YS5CeXRlKGRhdGEpO1xyXG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLi4uLi50ZXN0d2ViXCIsdGhpcy50ZW1wQnl0ZS5wb3MpO1xyXG4gICAgICAgXHJcbiAgICAgICBpZih0aGlzLnRlbXBCeXRlLmxlbmd0aCA+IDQpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgaWYodGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpID09IDQpLy/nqbrljIVcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIHZhciBjbWQ6bnVtYmVyID0gdGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpO1xyXG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlTnVsbFBhY2thZ2UoY21kKTtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLnqbrljIUuLi4uLi4uLi4uLi4uLi4uXCIrY21kKTtcclxuICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLndyaXRlQXJyYXlCdWZmZXIoZGF0YSwwLGRhdGEuYnl0ZUxlbmd0aCk7XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIuWtl+iKguaAu+mVv+W6pi4uLi4uLi4uLi4uLi4uLi5cIit0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpO1xyXG4gICAgICAgXHJcbiAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPiA0KVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcclxuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAsNCk7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xyXG4gICAgICAgICAgIHZhciBwYWNrTGVuOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XHJcbiAgICAgICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID49IHBhY2tMZW4pXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG5cclxuICAgICAgIFxyXG5cclxuXHJcblxyXG4gICAgICAgLy8gdmFyIHBhY2thZ2VJbjpQYWNrYWdlSW4gPSBuZXcgUGFja2FnZUluKCk7XHJcbiAgICAgICAvLyBwYWNrYWdlSW4ucmVhZChkYXRhKTtcclxuXHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBtc2cuLi5cIixwYWNrYWdlSW4uY21kKTtcclxuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gXCJcIisgcGFja2FnZUluLmNtZDtcclxuICAgICAgIC8vIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcclxuICAgICAgIC8vIGhhbmRsZXJzLmZvckVhY2goc29ja2V0SGFubGRlciA9PiB7XHJcbiAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcclxuICAgICAgIC8vIH0pO1xyXG4gICAgICAgXHJcbiAgIH1cclxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRDbG9zZSgpOnZvaWRcclxuICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IGNsb3NlLi4uXCIpO1xyXG4gICB9XHJcbiAgIHByaXZhdGUgd2ViU29ja2V0RXJyb3IoKTp2b2lkXHJcbiAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBlcnJvci4uLlwiKTtcclxuICAgfVxyXG4gICAvKipcclxuICAgICog5Y+R6YCB5raI5oGvXHJcbiAgICAqIEBwYXJhbSBjbWQgXHJcbiAgICAqIEBwYXJhbSBkYXRhIFxyXG4gICAgKi9cclxuICAgcHVibGljIHNlbmRNc2coY21kOm51bWJlcixkYXRhPzphbnkpOnZvaWRcclxuICAge1xyXG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgcmVxLi4uXCIrY21kKTtcclxuICAgICAgIHZhciBwYWNrYWdlT3V0OlBhY2thZ2VPdXQgPSBuZXcgUGFja2FnZU91dCgpO1xyXG4gICAgICAgLy8gcGFja2FnZU91dC5wYWNrKG1vZHVsZSxjbWQsZGF0YSk7XHJcbiAgICAgICBwYWNrYWdlT3V0LnBhY2soY21kLGRhdGEpO1xyXG4gICAgICAgdGhpcy53ZWJTb2NrZXQuc2VuZChwYWNrYWdlT3V0LmJ1ZmZlcik7XHJcbiAgIH1cclxuICAgLyoqXHJcbiAgICAqIOWumuS5iXByb3RvYnVm57G7XHJcbiAgICAqIEBwYXJhbSBwcm90b1R5cGUg5Y2P6K6u5qih5Z2X57G75Z6LXHJcbiAgICAqIEBwYXJhbSBjbGFzc1N0ciDnsbtcclxuICAgICovXHJcbiAgIHB1YmxpYyBkZWZpbmVQcm90b0NsYXNzKGNsYXNzU3RyOnN0cmluZyk6YW55XHJcbiAgIHtcclxuICAgICAgIHJldHVybiB0aGlzLnByb3RvUm9vdC5sb29rdXAoY2xhc3NTdHIpO1xyXG4gICB9XHJcblxyXG4gICAvKirms6jlhowgKi9cclxuICAgcHVibGljIHJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGhhbmRsZXI6U29ja2V0SGFuZGxlcik6dm9pZFxyXG4gICB7XHJcbiAgICAgICAvLyB2YXIga2V5OnN0cmluZyA9IHByb3RvY29sK1wiX1wiK2NtZDtcclxuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIitjbWQ7XHJcbiAgICAgICB2YXIgaGFuZGxlcnM6QXJyYXk8U29ja2V0SGFuZGxlcj4gPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XHJcbiAgICAgICBpZighaGFuZGxlcnMpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgaGFuZGxlcnMgPSBbXTtcclxuICAgICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5zZXQoa2V5LGhhbmRsZXJzKTtcclxuICAgICAgIH1cclxuICAgICAgIGVsc2VcclxuICAgICAgIHtcclxuICAgICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIC8qKuWIoOmZpCAqL1xyXG4gICBwdWJsaWMgdW5yZWdpc3RlckhhbmRsZXIoY21kOm51bWJlcixjYWxsZXI6YW55KTp2b2lkXHJcbiAgIHtcclxuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIiArIGNtZDtcclxuICAgICAgIHZhciBoYW5kbGVyczpBcnJheTxTb2NrZXRIYW5kbGVyPiA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcclxuICAgICAgIGlmKGhhbmRsZXJzKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHZhciBoYW5kbGVyO1xyXG4gICAgICAgICAgIGZvcih2YXIgaSA9IGhhbmRsZXJzLmxlbmd0aCAtIDE7aSA+PSAwIDtpLS0pXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICBoYW5kbGVyID0gaGFuZGxlcnNbaV07XHJcbiAgICAgICAgICAgICAgIGlmKGhhbmRsZXIuY2FsbGVyID09PSBjYWxsZXIpXHJcbiAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmKGhhbmRsZXJzLmxlbmd0aCA9PSAwKVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgdGhpcy5zb2NrZXRIYW5sZGVyRGljLnJlbW92ZShrZXkpO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgfVxyXG4gICAvKirmt7vliqDmnI3liqHlmajlv4Pot7MgKi9cclxuICAgcHVibGljIGFkZEhlcnRSZXEoKTp2b2lkXHJcbiAgIHtcclxuICAgIC8vICAgIHRoaXMucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU1BfU0VSVl9IRVJULG5ldyBTZXJ2ZXJIZWFydEhhbmRsZXIodGhpcykpO1xyXG4gICAgLy8gICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xyXG4gICAgLy8gICAgTGF5YS50aW1lci5sb29wKDEwMDAwLHRoaXMsZnVuY3Rpb24oKTp2b2lke1xyXG4gICAgLy8gICAgICAgIENsaWVudFNlbmRlci5zZXJ2SGVhcnRSZXEoKTtcclxuICAgIC8vICAgIH0pO1xyXG4gICB9XHJcbiAgIHB1YmxpYyByZW1vdmVIZWFydFJlcSgpOnZvaWRcclxuICAge1xyXG4gICAgLy8gICAgdGhpcy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNQX1NFUlZfSEVSVCx0aGlzKTtcclxuICAgIC8vICAgIExheWEudGltZXIuY2xlYXJBbGwodGhpcyk7XHJcbiAgIH1cclxufSIsImltcG9ydCBiYXNlQ29uZmlnIGZyb20gXCIuL2Jhc2VDb25maWdcIjtcclxuaW1wb3J0IE1hcFBvcyBmcm9tIFwiLi4vTW9kZWwvTWFwUG9zXCI7XHJcblxyXG5cclxuLyoqXHJcbiAqIOmYsuW+oeWhlOaVsOaNruaooeWei1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVmZW5kZXJDb25maWcgZXh0ZW5kcyBiYXNlQ29uZmlne1xyXG4gICAgLyoqXHJcbiAgICAgKiDpmLLlvqHloZRpZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVmZW5kZXJJZCA6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog6Ziy5b6h5aGU5ZCN56ewXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWZlbmRlck5hbWUgOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOexu+WeiyAx6YeRMuacqDPmsLQ054GrNeWcn1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHlwZSA6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog6Ziy5b6h5aGU5pS75Ye75YqbXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3dlciA6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog5pS75Ye76Led56a7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaWMgOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOaUu+WHu+mAn+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXR0YWNrU3BlZWQgOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YSl7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgYmFzZUNvbmZpZyBmcm9tIFwiLi9iYXNlQ29uZmlnXCI7XHJcblxyXG5cclxuLyoqXHJcbiAqIOaAqueJqeaVsOaNruaooeWei1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9uc3RlckNvbmZpZyBleHRlbmRzIGJhc2VDb25maWd7XHJcbiAgICAvKipcclxuICAgICAqIOaAqueJqWlkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtb25zdGVySWQgOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOaAqueJqeWQjeWtl1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbW9uc3Rlck5hbWUgOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIOaAqueJqeexu+WeiyAx6YeRMuacqDPmsLQ054GrNeWcn1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHlwZSA6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog5pS75Ye75YqbXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3dlciA6IG51bWJlcjtcclxuICAgIC8qKlxyXG4gICAgICog6Ziy5b6h5YqbXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWYgOiBudW1iZXI7XHJcbiAgICAvKipcclxuICAgICAqIOenu+WKqOmAn+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3BlZWQgOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YSl7XHJcbiAgICAgICAgc3VwZXIoZGF0YSk7XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5Z+656GA5pWw5o2u57uT5p6EXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBiYXNlQ29uZmlne1xyXG4gIFxyXG4gICAgY29uc3RydWN0b3IoZGF0YSl7XHJcbiAgICAgICAgbGV0IGFyciA9IE9iamVjdC5rZXlzKGRhdGEpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB0aGlzW2FycltpXV0gPSBkYXRhW2FycltpXV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXHJcbmltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL0dhbWUvR2FtZUNvbnRyb2xsZXJcIlxuaW1wb3J0IEdhbWVMb2JieUNvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlci9HYW1lTG9iYnkvR2FtZUxvYmJ5Q29udHJvbGxlclwiXG5pbXBvcnQgTG9hZGluZ0NvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlci9Mb2FkaW5nL0xvYWRpbmdDb250cm9sbGVyXCJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIlxyXG4vKlxyXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9MTQ0MDtcclxuICAgIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTc1MDtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWRoZWlnaHRcIjtcclxuICAgIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cIm5vbmVcIjtcclxuICAgIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwidG9wXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25IOnN0cmluZz1cImxlZnRcIjtcclxuICAgIHN0YXRpYyBzdGFydFNjZW5lOmFueT1cIldlbGNvbWUvTG9naW4uc2NlbmVcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvR2FtZS9HYW1lQ29udHJvbGxlci50c1wiLEdhbWVDb250cm9sbGVyKTtcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9HYW1lTG9iYnkvR2FtZUxvYmJ5Q29udHJvbGxlci50c1wiLEdhbWVMb2JieUNvbnRyb2xsZXIpO1xuICAgICAgICByZWcoXCJDb250cm9sbGVyL0xvYWRpbmcvTG9hZGluZ0NvbnRyb2xsZXIudHNcIixMb2FkaW5nQ29udHJvbGxlcik7XG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50c1wiLFdlbENvbWVDb250cm9sbGVyKTtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcblxyXG5cclxuLyoqXHJcbiAqIOa4uOaIj+WFpeWPo1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUVudGVye1xyXG5cdFx0Ly9cclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliJ3lp4vljJYgKi9cclxuICAgIHByaXZhdGUgaW5pdCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgfVxyXG4gICAgLyoq6LWE5rqQ5Yqg6L29ICovXHJcbiAgICBwcml2YXRlIGxvYWQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgYXNzZXRlQXJyID0gW1xyXG4gICAgICAgICAgICB7dXJsOlwidW5wYWNrYWdlL3dlbGNvbWVfYmcucG5nXCJ9LFxyXG4gICAgICAgICAgICB7dXJsOlwiV2VsY29tZS9sb2dpbmJveC5wbmdcIn0sXHJcbiAgICAgICAgICAgIHt1cmw6XCJXZWxjb21lL3Byb2dyZXNzQmcucG5nXCJ9LFxyXG5cclxuICAgICAgICAgICAge3VybDpcInJlcy9hdGxhcy9jb21wLmF0bGFzXCJ9LFxyXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL3dlbGNvbWUuYXRsYXNcIn1cclxuICAgICAgICBdXHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChhc3NldGVBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25sb2FkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbmxvYWQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBHYW1lQ29uZmlnLnN0YXJ0U2NlbmUgJiYgTGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBHYW1lRW50ZXIgZnJvbSBcIi4vR2FtZUVudGVyXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG5cclxuXHRcdC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHRMYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xyXG5cdH1cclxuXHJcblx0b25Db25maWdMb2FkZWQoKTogdm9pZCB7XHJcblx0XHRuZXcgR2FtZUVudGVyKCk7XHJcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCIvKipcclxuICAgICog6K+N5YW4IGtleS12YWx1ZVxyXG4gICAgKlxyXG4gICAgKiAgXHJcbiAgICAqICBrZXlzIDogQXJyYXlcclxuICAgICogIFtyZWFkLW9ubHldIOiOt+WPluaJgOacieeahOWtkOWFg+e0oOmUruWQjeWIl+ihqOOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiBcclxuICAgICogIHZhbHVlcyA6IEFycmF5XHJcbiAgICAqICBbcmVhZC1vbmx5XSDojrflj5bmiYDmnInnmoTlrZDlhYPntKDliJfooajjgIJcclxuICAgICogIERpY3Rpb25hcnlcclxuICAgICogIFB1YmxpYyBNZXRob2RzXHJcbiAgICAqICBcclxuICAgICogICAgICAgICAgXHJcbiAgICAqICBjbGVhcigpOnZvaWRcclxuICAgICogIOa4hemZpOatpOWvueixoeeahOmUruWQjeWIl+ihqOWSjOmUruWAvOWIl+ihqOOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiAgICAgICAgICBcclxuICAgICogIGdldChrZXk6Kik6KlxyXG4gICAgKiAg6L+U5Zue5oyH5a6a6ZSu5ZCN55qE5YC844CCXHJcbiAgICAqICBEaWN0aW9uYXJ5XHJcbiAgICAqICAgICAgICAgICBcclxuICAgICogIGluZGV4T2Yoa2V5Ok9iamVjdCk6aW50XHJcbiAgICAqICDojrflj5bmjIflrprlr7nosaHnmoTplK7lkI3ntKLlvJXjgIJcclxuICAgICogIERpY3Rpb25hcnlcclxuICAgICogICAgICAgICAgXHJcbiAgICAqICByZW1vdmUoa2V5OiopOkJvb2xlYW5cclxuICAgICogIOenu+mZpOaMh+WumumUruWQjeeahOWAvOOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiAgICAgICAgICBcclxuICAgICogIHNldChrZXk6KiwgdmFsdWU6Kik6dm9pZFxyXG4gICAgKiAg57uZ5oyH5a6a55qE6ZSu5ZCN6K6+572u5YC844CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWN0aW9uYXJ5IHtcclxuICAgIC8qKumUruWQjSAqL1xyXG4gICAgcHJpdmF0ZSBrZXlzIDogQXJyYXk8YW55PjtcclxuICAgIC8qKumUruWAvCAqL1xyXG4gICAgcHJpdmF0ZSB2YWx1ZXMgOiBBcnJheTxhbnk+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5rZXlzID0gbmV3IEFycmF5PGFueT4oKTtcclxuICAgICAgICB0aGlzLnZhbHVlcyA9IG5ldyBBcnJheTxhbnk+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6K6+572uIOmUruWQjSAtIOmUruWAvCAqL1xyXG4gICAgcHVibGljIHNldChrZXk6YW55LHZhbHVlOmFueSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldPT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtleXNbaV0gPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g5o+S5YWla2V5W1wiKyBrZXkgK1wiXVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInZhbHVlXCIsdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKumAmui/hyDplK7lkI1rZXkg6I635Y+W6ZSu5YC8dmFsdWUgICovXHJcbiAgICBwdWJsaWMgZ2V0KGtleTphbnkpIDogYW55XHJcbiAgICB7XHJcbiAgICAgICAgLy8gdGhpcy5nZXREaWNMaXN0KCk7IFxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV0gPT09IGtleSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOivjeWFuOS4reayoeaciWtleeeahOWAvFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirojrflj5blr7nosaHnmoTntKLlvJXlgLwgKi9cclxuICAgIHB1YmxpYyBpbmRleE9mKHZhbHVlIDogYW55KSA6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy52YWx1ZXMubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudmFsdWVzW2ldID09PSB2YWx1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g6K+N5YW45Lit5rKh5pyJ6K+l5YC8XCIpO1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKua4hemZpCDor43lhbjkuK3mjIflrprplK7lkI3nmoTliaogKi9cclxuICAgIHB1YmxpYyByZW1vdmUoa2V5IDogYW55KSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldID09PSBrZXkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpXSA9PT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbaV0gPT09IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOenu+mZpOaIkOWKn1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDnp7vpmaTlpLHotKVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5riF6Zmk5omA5pyJ55qE6ZSuICovXHJcbiAgICBwdWJsaWMgY2xlYXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmtleXMgPSBbXTtcclxuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPluWIl+ihqCAqL1xyXG4gICAgcHVibGljIGdldERpY0xpc3QoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgJBcIiArIGkgKyBcIuOAkS0tLS0tLS0tLS0ta2V5OlwiICsgdGhpcy5rZXlzW2ldKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YWx1ZVwiLHRoaXMudmFsdWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I635Y+W6ZSu5YC85pWw57uEICovXHJcbiAgICBwdWJsaWMgZ2V0VmFsdWVzQXJyKCkgOiBBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPlumUruWQjeaVsOe7hCAqL1xyXG4gICAgcHVibGljIGdldEtleXNBcnIoKSA6IEFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5rZXlzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vdWkvbGF5YU1heFVJXCI7XHJcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOS4remXtOWtl1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXRNc2cgZXh0ZW5kcyB1aS5EaWFsb2dfLkZsb2F0TXNnVUl7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnQoKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmFuaTEuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkRXZlbnQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uSGlkZGVuKTtcclxuICAgICAgICB0aGlzLmFuaTEub24oTGF5YS5FdmVudC5DT01QTEVURSx0aGlzLHRoaXMub25IaWRkZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S65raI5oGv6aOY5a2XXHJcbiAgICAgKiBAcGFyYW0gdGV4dCDmmL7npLrmlofmnKwg44CQ5pyA5aSaMjjkuKrjgJFcclxuICAgICAqIEBwYXJhbSBwb3MgIOS9jee9rnt4OjEwMCx5OjEwMH1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dNc2codGV4dDpzdHJpbmcscG9zOmFueSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTsgXHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sYWJfZmxvYXRNc2cudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy54ID0gcG9zLng7XHJcbiAgICAgICAgdGhpcy55ID0gcG9zLnk7XHJcbiAgICAgICAgdGhpcy5hbmkxLnBsYXkoMCxmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkhpZGRlbigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYW5pMS5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zcF9mbG9hdE1zZy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJGbG9hdE1zZ1wiLHRoaXMpO1xyXG4gICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5jb3VudEZsb2F0TXNnLS07XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5bCP5bel5YW3XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29se1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bGP5bmV5rC05bmz5Lit5b+DIOaoquWdkOagh1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENlbnRlclgoKSA6IGFueVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiA3NTAvKExheWEuQnJvd3Nlci5jbGllbnRIZWlnaHQvTGF5YS5Ccm93c2VyLmNsaWVudFdpZHRoKS8yOy8v5bGP5bmV5a695bqmXHJcbiAgICB9XHJcbn1cclxuIiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXG5pbXBvcnQgVmlldz1MYXlhLlZpZXc7XHJcbmltcG9ydCBEaWFsb2c9TGF5YS5EaWFsb2c7XHJcbmltcG9ydCBTY2VuZT1MYXlhLlNjZW5lO1xuZXhwb3J0IG1vZHVsZSB1aS5EaWFsb2dfIHtcclxuICAgIGV4cG9ydCBjbGFzcyBGbG9hdE1zZ1VJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGFuaTE6TGF5YS5GcmFtZUFuaW1hdGlvbjtcblx0XHRwdWJsaWMgc3BfZmxvYXRNc2c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGxhYl9mbG9hdE1zZzpMYXlhLkxhYmVsO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiRGlhbG9nXy9GbG9hdE1zZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aS5HYW1lIHtcclxuICAgIGV4cG9ydCBjbGFzcyBHYW1lVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgZ2FtZTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZHM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2QxOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZDM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2Q0OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXYWxsczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgVXBXYWxsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBEb3duV2FsbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgR3JvdXBzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9kb29yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2Rvb3I6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJvYWQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxfb2ZmOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxfb246TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNob3ZlbGJnOkxheWEuU3ByaXRlO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiR2FtZS9HYW1lXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgbW9kdWxlIHVpLkdhbWVMb2JieSB7XHJcbiAgICBleHBvcnQgY2xhc3MgR2FtZUxvYmJ5VUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtUGFuZWw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJ0bl9QVlA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1vZGVDaG9vc2VQYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgdGV4dF8xVjE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGJ0bl8xVjE6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIHRleHRfNVY1OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBidG5fNVY1OkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fYmFjazpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTWF0Y2hpbmdTdWNjZXNzUGFuZWw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYnRuX2VudGVyZ2FtZTpMYXlhLkJ1dHRvbjtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIkdhbWVMb2JieS9HYW1lTG9iYnlcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFBsYXllckxvYWRpbmdVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBsb2FkaW5nYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfMTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzI6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl8zOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfNDpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl8yOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfMzpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzQ6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl81OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzTDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NUOkxheWEuTGFiZWw7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJQbGF5ZXJMb2FkaW5nXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgbW9kdWxlIHVpLldlbGNvbWUge1xyXG4gICAgZXhwb3J0IGNsYXNzIExvZ2luVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgYW5pMTpMYXlhLkZyYW1lQW5pbWF0aW9uO1xuXHRcdHB1YmxpYyBzcF9sb2dpbkJveDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaW5wdXRfdXNlck5hbWU6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGlucHV0X3VzZXJLZXk6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGxhYl90aXRsZTpMYXlhLkxhYmVsO1xuXHRcdHB1YmxpYyBidG5fbG9naW46TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl9yZWdpc3RlcjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3M6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NMOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1Q6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgc3BfZ2FtZU5hbWU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIHNwX3JlZ2lzdGVyQm94OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3RlclVzZXJOYW1lOkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3RlclVzZXJLZXk6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGJ0bl90b0xvZ2luOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fdG9SZWdpc3RlcjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgaW5wdXRfcmVnaXN0ZXJOaWNrTmFtZTpMYXlhLlRleHRJbnB1dDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIldlbGNvbWUvTG9naW5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHIiXX0=
