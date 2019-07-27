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
var MessageManager_1 = require("../../Core/MessageManager");
var GameController = /** @class */ (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        return _super.call(this) || this;
    }
    GameController.prototype.onEnable = function () {
        GameController.Instance = this;
        this.redFac = new GrassFactory_1.default("red", this.game);
        this.blueFac = new GrassFactory_1.default("blue", this.game);
        this.camp = "red";
        this.isCickGrass();
        Laya.timer.frameLoop(1, this, this.mapMove);
        if (this.camp == "blue") {
            this.myFac = this.blueFac;
        }
        else {
            this.myFac = this.redFac;
        }
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
        }
        else {
            this.game.x = 0;
        }
        this.MenuItem.visible = true;
        this.isUseShovel = false;
        this.addEvents();
        this.monsterOccupy();
    };
    /**事件绑定 */
    GameController.prototype.addEvents = function () {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN, this, this.onShovelDown);
        this.btn_check.on(Laya.Event.MOUSE_DOWN, this, this.checkCreateComplete);
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
        this.isCickGrass();
    };
    /**判断草坪块是否可点击 */
    GameController.prototype.isCickGrass = function () {
        //收起铲子就不能点击草坪块，相反则可
        if (this.isUseShovel) {
            this.game.mouseEnabled = true;
        }
        else {
            this.game.mouseEnabled = false;
        }
    };
    /**怪物最先占领一个土块 */
    GameController.prototype.monsterOccupy = function () {
        //随机取一个10号位草坪变为土块作为怪兽出生点
        this.myFac.grassArray[10].changeImg();
        this.myFac.grassArray[10].sp.off(Laya.Event.CLICK, this.myFac.grassArray[10], this.myFac.grassArray[10].changeState);
    };
    /**检查是否建好好路径 */
    GameController.prototype.checkCreateComplete = function () {
        if (this.myFac.mudArray[this.myFac.mudArray.length - 1] == this.myFac.grassArray[39]) {
            //todo
            this.onShovelDown();
            this.shovelbg.visible = false;
            this.game.mouseEnabled = false;
            this.isCickGrass();
            this.btn_check.off(Laya.Event.MOUSE_DOWN, this, this.onShovelDown);
            this.btn_check.visible = false;
            MessageManager_1.default.ins.showFloatMsg("修建成功！");
        }
        else {
            //否则就不能点击其他区域的草坪
            MessageManager_1.default.ins.showFloatMsg("请正确修建道路！");
        }
    };
    return GameController;
}(layaMaxUI_1.ui.Game.GameUI));
exports.default = GameController;
},{"../../Core/MessageManager":10,"../../ui/layaMaxUI":22,"./GrassFactory":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameController_1 = require("./GameController");
var MessageManager_1 = require("../../Core/MessageManager");
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
        this.sp.on(Laya.Event.CLICK, this, this.changeState);
    };
    /**转换状态，标记是否为土块 */
    Grass.prototype.changeState = function () {
        //如果是草坪,则变成土块
        if (!this.isMud) {
            //如果此草坪在上一个最后一次记录土块的周围的话，则可变为土块
            var mudsp = GameController_1.default.Instance.myFac.mudArray[GameController_1.default.Instance.myFac.mudArray.length - 1].sp;
            if ((Math.abs(mudsp.x - this.sp.x) == 100 && (mudsp.y == this.sp.y)) ||
                (Math.abs(mudsp.y - this.sp.y) == 100 && (mudsp.x == this.sp.x))) {
                this.changeImg();
            }
            else {
                //否则就不能点击其他区域的草坪
                MessageManager_1.default.ins.showFloatMsg("请在土块周围建立道路！");
            }
        }
        else {
            this.changeImg();
        }
    };
    /**切换图片 */
    Grass.prototype.changeImg = function () {
        this.sp.graphics.clear();
        //如果是草坪,则变成土块
        if (!this.isMud) {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/mud.png"));
            this.isMud = true;
            if (GameController_1.default.Instance.myFac.mudArray[0] != null) {
                GameController_1.default.Instance.myFac.mudArray[GameController_1.default.Instance.myFac.mudArray.length - 1].sp.mouseEnabled = false;
            }
            else {
                this.sp.mouseEnabled = false;
            }
            GameController_1.default.Instance.myFac.mudArray.push(this);
        }
        else //如果是土块,则变成草坪
         {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass" + this.num + ".png"));
            this.isMud = false;
            GameController_1.default.Instance.myFac.mudArray[GameController_1.default.Instance.myFac.mudArray.length - 2].sp.mouseEnabled = true;
            GameController_1.default.Instance.myFac.mudArray.pop();
        }
    };
    return Grass;
}());
exports.default = Grass;
},{"../../Core/MessageManager":10,"./GameController":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grass_1 = require("./Grass");
var GrassFactory = /** @class */ (function () {
    function GrassFactory(camp, view) {
        this.grassArray = new Array();
        this.mudArray = new Array();
        this.createGrassArray(camp, view);
    }
    /**生成草坪 */
    GrassFactory.prototype.createGrassArray = function (camp, view) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIyLjAvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9HcmFzcy50cyIsInNyYy9Db250cm9sbGVyL0dhbWUvR3Jhc3NGYWN0b3J5LnRzIiwic3JjL0NvbnRyb2xsZXIvTG9hZGluZy9Mb2FkaW5nQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9XZWxDb21lL2hhbmRsZXIvVXNlckxvZ2luSGFuZGxlci50cyIsInNyYy9Db3JlL0NvbnN0L0dhbWVDb25maWcudHMiLCJzcmMvQ29yZS9NZXNzYWdlTWFuYWdlci50cyIsInNyYy9Db3JlL05ldC9DbGllbnRTZW5kZXIudHMiLCJzcmMvQ29yZS9OZXQvUGFja2FnZUluLnRzIiwic3JjL0NvcmUvTmV0L1BhY2thZ2VPdXQudHMiLCJzcmMvQ29yZS9OZXQvU29ja2V0SGFuZGxlci50cyIsInNyYy9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyLnRzIiwic3JjL0dhbWVDb25maWcudHMiLCJzcmMvR2FtZUVudGVyLnRzIiwic3JjL01haW4udHMiLCJzcmMvVG9vbC9EaWN0aW9uYXJ5LnRzIiwic3JjL1Rvb2wvRmxvYXRNc2cudHMiLCJzcmMvVG9vbC9Ub29sLnRzIiwic3JjL3VpL2xheWFNYXhVSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNWQSxnREFBd0M7QUFD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LENBQUMsRUExQmdCLE9BQU8sR0FBUCxVQUFPLEtBQVAsVUFBTyxRQTBCdkI7QUFBRCxDQUFDLEVBMUJhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQTBCZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgUHJvdG9jb2wsIEdhbWVDb25maWcgfSBmcm9tIFwiLi4vLi4vQ29yZS9Db25zdC9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBNYXRjaEhhbmRsZXIgZnJvbSBcIi4uL0dhbWVMb2JieS9oYW5kbGVyL01hdGNoSGFuZGxlclwiO1xyXG5pbXBvcnQgQ2xpZW50U2VuZGVyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9DbGllbnRTZW5kZXJcIjtcclxuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVMb2JieUNvbnRyb2xsZXIgZXh0ZW5kcyB1aS5HYW1lTG9iYnkuR2FtZUxvYmJ5VUl7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5ZCv5YqoICovXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6ZSA5q+BKi9cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu257uR5a6aICovXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYnRuX1BWUC5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblBWUE1vZGUpO1xyXG4gICAgICAgIHRoaXMuYnRuXzFWMS5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbjFWMSk7XHJcbiAgICAgICAgdGhpcy5idG5fNVY1Lm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uNVY1KTtcclxuICAgICAgICB0aGlzLmJ0bl9iYWNrLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uQmFjayk7XHJcbiAgICAgICAgdGhpcy5idG5fZW50ZXJnYW1lLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uRW50ZXJMb2FkaW5nKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX01BVENIX0lORk8sbmV3IE1hdGNoSGFuZGxlcih0aGlzLHRoaXMub25NYXRjaEhhbmRsZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYnRuX1BWUC5vZmYoTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25QVlBNb2RlKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfSU5GTyx0aGlzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoq54K55Ye76L+b5YWlUFZQ6YCJ5oup55WM6Z2iICovXHJcbiAgICBwcml2YXRlIG9uUFZQTW9kZSgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuTWVudUl0ZW1QYW5lbC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT10cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPluWIsOa2iOaBryAqL1xyXG4gICAgcHJpdmF0ZSBvbk1hdGNoSGFuZGxlcihkYXRhKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhK1wi5Yy56YWN5oiQ5YqfXCIpO1xyXG4gICAgICAgIGlmKGRhdGEgIT09IHVuZGVmaW5lZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsdGhpcyx0aGlzLmNob29zZU1hdGNoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye76YCJ5oupMVYx5qih5byPICovXHJcbiAgICBwcml2YXRlIG9uMVYxKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAvLyBDbGllbnRTZW5kZXIucmVxTWF0Y2goMSwxKTtcclxuICAgICAgIHRoaXMuY2hvb3NlTWF0Y2goKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vpgInmi6k1VjXmqKHlvI8gKi9cclxuICAgIHByaXZhdGUgb241VjUoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vov5Tlm57muLjmiI/lpKfljoUgKi9cclxuICAgIHByaXZhdGUgb25CYWNrKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbVBhbmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9ZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yy56YWN5oiQ5Yqf5by55qGG77yM6YCJ5oup5piv5ZCm6L+b5YWl5ri45oiPICovXHJcbiAgICBwcml2YXRlIGNob29zZU1hdGNoKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuTWF0Y2hpbmdTdWNjZXNzUGFuZWwudmlzaWJsZT10cnVlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9ZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L+b5YWl5ri45oiPICovXHJcbiAgICBwcml2YXRlIG9uRW50ZXJMb2FkaW5nKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuU2NlbmUub3BlbihcIlBsYXllckxvYWRpbmcuc2NlbmVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgIFxyXG59IiwiaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1NvY2tldEhhbmRsZXJcIjtcclxuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDor7fmsYLljLnphY3lr7nlsYBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcclxuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlc01hdGNoSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzTWF0Y2hJbmZvXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc01hdGNoSW5mby5kZWNvZGUoZGF0YSk7XHJcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxyXG4gICAgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IEdyYXNzRmFjdG9yeSBmcm9tIFwiLi9HcmFzc0ZhY3RvcnlcIjtcclxuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb250cm9sbGVyIGV4dGVuZHMgdWkuR2FtZS5HYW1lVUl7XHJcbiAgICAvKirljZXkvosgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgSW5zdGFuY2U6R2FtZUNvbnRyb2xsZXI7XHJcbiAgICAvKirkuIrmrKHpvKDmoIflvpfkvY3nva4gKi9cclxuICAgIHByaXZhdGUgbGFzdE1vdXNlUG9zWDpudW1iZXI7XHJcbiAgICAvKirmmK/lkKbmraPlnKjkvb/nlKjpk7LlrZAgKi9cclxuICAgIHByaXZhdGUgaXNVc2VTaG92ZWw6Ym9vbGVhbjtcclxuICAgIC8qKumYteiQpSAqL1xyXG4gICAgcHVibGljIGNhbXA6c3RyaW5nO1xyXG4gICAgLyoq6JOd5pa56I2J5Z2qICovXHJcbiAgICBwcml2YXRlIGJsdWVGYWM6R3Jhc3NGYWN0b3J5O1xyXG4gICAgLyoq57qi5pa56I2J5Z2qICovXHJcbiAgICBwcml2YXRlIHJlZEZhYzpHcmFzc0ZhY3Rvcnk7XHJcbiAgICAvKirlt7HmlrnojYnlnaogKi9cclxuICAgIHB1YmxpYyBteUZhYzpHcmFzc0ZhY3Rvcnk7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIFxyXG4gICAgICAgIEdhbWVDb250cm9sbGVyLkluc3RhbmNlPXRoaXM7XHJcbiAgICAgICAgdGhpcy5yZWRGYWM9bmV3IEdyYXNzRmFjdG9yeShcInJlZFwiLHRoaXMuZ2FtZSk7XHJcbiAgICAgICAgdGhpcy5ibHVlRmFjPW5ldyBHcmFzc0ZhY3RvcnkoXCJibHVlXCIsdGhpcy5nYW1lKTtcclxuICAgICAgICB0aGlzLmNhbXA9XCJyZWRcIjtcclxuICAgICAgICB0aGlzLmlzQ2lja0dyYXNzKCk7XHJcbiAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMSx0aGlzLHRoaXMubWFwTW92ZSk7XHJcbiAgICAgICAgaWYodGhpcy5jYW1wPT1cImJsdWVcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5teUZhYz10aGlzLmJsdWVGYWM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5teUZhYz10aGlzLnJlZEZhYztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Zyw5Zu+56e75YqoICovXHJcbiAgICBwcml2YXRlIG1hcE1vdmUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICB0aGlzLmdhbWUueC09NDtcclxuICAgICAgIGlmKHRoaXMuZ2FtZS54PD0tMTIxNClcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLmdhbWUueD0tMTIxNDtcclxuICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyKHRoaXMsdGhpcy5tYXBNb3ZlKTtcclxuICAgICAgICAgICBMYXlhLnRpbWVyLmZyYW1lT25jZSg2MCx0aGlzLHRoaXMucmVzdW1lUG9zKTtcclxuICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICAgLyoq5Zue5Yiw546p5a625L2N572uICovXHJcbiAgICBwcml2YXRlIHJlc3VtZVBvcygpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmNhbXA9PVwiYmx1ZVwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLmdhbWUueD0tMTIzMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLmdhbWUueD0wO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLk1lbnVJdGVtLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICB0aGlzLmlzVXNlU2hvdmVsPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy5tb25zdGVyT2NjdXB5KCk7XHJcbiAgICB9IFxyXG4gICAgIFxyXG4gICAgLyoq5LqL5Lu257uR5a6aICovXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vbk1vdXNlRG93bik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX1VQLHRoaXMsdGhpcy5vbk1vdXNlVXApO1xyXG4gICAgICAgIHRoaXMuc2hvdmVsYmcub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vblNob3ZlbERvd24pO1xyXG4gICAgICAgIHRoaXMuYnRuX2NoZWNrLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMuY2hlY2tDcmVhdGVDb21wbGV0ZSk7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq6byg5qCH5LqL5Lu2ICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgLyoq6byg5qCH5oyJ5LiLICovXHJcbiAgICBwcml2YXRlIG9uTW91c2VEb3duKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNVc2VTaG92ZWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKum8oOagh+enu+WKqCAqL1xyXG4gICAgcHJpdmF0ZSBvbk1vdXNlTW92ZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICAvL+WmguaenOayoeacieeUqOmTsuWtkO+8jOWImeWPr+aLieWKqOWcsOWbvlxyXG4gICAgICAgIGlmKCF0aGlzLmlzVXNlU2hvdmVsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoTGF5YS5zdGFnZS5tb3VzZVg8dGhpcy5sYXN0TW91c2VQb3NYKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUueC09MjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihMYXlhLnN0YWdlLm1vdXNlWD50aGlzLmxhc3RNb3VzZVBvc1gpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS54Kz0yMDtcclxuICAgICAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlUG9zWD1MYXlhLnN0YWdlLm1vdXNlWDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLmdhbWUueD49MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLng9MDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuZ2FtZS54PD0tMTIxNClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLng9LTEyMTQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKum8oOagh+aKrOi1tyAqL1xyXG4gICAgcHJpdmF0ZSBvbk1vdXNlVXAoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIC8qKueCueWHu+mTsuWtkOahhuaLvui1t+mTsuWtkCAqL1xyXG4gICAgcHJpdmF0ZSBvblNob3ZlbERvd24oKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pc1VzZVNob3ZlbD0hdGhpcy5pc1VzZVNob3ZlbDtcclxuICAgICAgICB0aGlzLnNob3ZlbF9vZmYudmlzaWJsZT0hdGhpcy5zaG92ZWxfb2ZmLnZpc2libGU7XHJcbiAgICAgICAgdGhpcy5zaG92ZWxfb24udmlzaWJsZT0hdGhpcy5zaG92ZWxfb24udmlzaWJsZTtcclxuICAgICAgICB0aGlzLmlzQ2lja0dyYXNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yik5pat6I2J5Z2q5Z2X5piv5ZCm5Y+v54K55Ye7ICovXHJcbiAgICBwcml2YXRlIGlzQ2lja0dyYXNzKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v5pS26LW36ZOy5a2Q5bCx5LiN6IO954K55Ye76I2J5Z2q5Z2X77yM55u45Y+N5YiZ5Y+vXHJcbiAgICAgICAgaWYodGhpcy5pc1VzZVNob3ZlbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5tb3VzZUVuYWJsZWQ9dHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLm1vdXNlRW5hYmxlZD1mYWxzZTtcclxuICAgICAgICB9ICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKuaAqueJqeacgOWFiOWNoOmihuS4gOS4quWcn+WdlyAqL1xyXG4gICAgcHJpdmF0ZSBtb25zdGVyT2NjdXB5KCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v6ZqP5py65Y+W5LiA5LiqMTDlj7fkvY3ojYnlnarlj5jkuLrlnJ/lnZfkvZzkuLrmgKrlhb3lh7rnlJ/ngrlcclxuICAgICAgICB0aGlzLm15RmFjLmdyYXNzQXJyYXlbMTBdLmNoYW5nZUltZygpO1xyXG4gICAgICAgIHRoaXMubXlGYWMuZ3Jhc3NBcnJheVsxMF0uc3Aub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcy5teUZhYy5ncmFzc0FycmF5WzEwXSx0aGlzLm15RmFjLmdyYXNzQXJyYXlbMTBdLmNoYW5nZVN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirmo4Dmn6XmmK/lkKblu7rlpb3lpb3ot6/lvoQgKi9cclxuICAgIHByaXZhdGUgY2hlY2tDcmVhdGVDb21wbGV0ZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLm15RmFjLm11ZEFycmF5W3RoaXMubXlGYWMubXVkQXJyYXkubGVuZ3RoLTFdPT10aGlzLm15RmFjLmdyYXNzQXJyYXlbMzldKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90b2RvXHJcbiAgICAgICAgICAgIHRoaXMub25TaG92ZWxEb3duKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdmVsYmcudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLm1vdXNlRW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5pc0NpY2tHcmFzcygpOyAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5idG5fY2hlY2sub2ZmKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMub25TaG92ZWxEb3duKTtcclxuICAgICAgICAgICAgdGhpcy5idG5fY2hlY2sudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyhcIuS/ruW7uuaIkOWKn++8gVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/lkKbliJnlsLHkuI3og73ngrnlh7vlhbbku5bljLrln5/nmoTojYnlnapcclxuICAgICAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyhcIuivt+ato+ehruS/ruW7uumBk+i3r++8gVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vR2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFzc3tcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgLyoq5piv5ZCm5Li65Zyf5Z2X5qCH6K6wICovXHJcbiAgICBwdWJsaWMgaXNNdWQ6Ym9vbGVhbjtcclxuICAgIC8qKuiNieWdquWbvuexu+WeiyAqL1xyXG4gICAgcHJpdmF0ZSBudW06bnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaW5pdChudW0sdmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5udW09bnVtO1xyXG4gICAgICAgIHRoaXMuaXNNdWQ9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcD1uZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICB0aGlzLnNwLmdyYXBoaWNzLmRyYXdUZXh0dXJlKExheWEubG9hZGVyLmdldFJlcyhcImdhbWUvZ3Jhc3NcIitudW0rXCIucG5nXCIpKTtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG4gICAgICAgIHRoaXMuc3AuYXV0b1NpemU9dHJ1ZTtcclxuICAgICAgICB0aGlzLnNwLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLmNoYW5nZVN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirovazmjaLnirbmgIHvvIzmoIforrDmmK/lkKbkuLrlnJ/lnZcgKi9cclxuICAgIHB1YmxpYyBjaGFuZ2VTdGF0ZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICAvL+WmguaenOaYr+iNieWdqizliJnlj5jmiJDlnJ/lnZdcclxuICAgICAgICBpZighdGhpcy5pc011ZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8v5aaC5p6c5q2k6I2J5Z2q5Zyo5LiK5LiA5Liq5pyA5ZCO5LiA5qyh6K6w5b2V5Zyf5Z2X55qE5ZGo5Zu055qE6K+d77yM5YiZ5Y+v5Y+Y5Li65Zyf5Z2XXHJcbiAgICAgICAgICAgIGxldCBtdWRzcD1HYW1lQ29udHJvbGxlci5JbnN0YW5jZS5teUZhYy5tdWRBcnJheVtHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5teUZhYy5tdWRBcnJheS5sZW5ndGgtMV0uc3A7XHJcbiAgICAgICAgICAgIGlmKChNYXRoLmFicyhtdWRzcC54LXRoaXMuc3AueCk9PTEwMCYmKG11ZHNwLnk9PXRoaXMuc3AueSkpfHxcclxuICAgICAgICAgICAgICAgKE1hdGguYWJzKG11ZHNwLnktdGhpcy5zcC55KT09MTAwJiYobXVkc3AueD09dGhpcy5zcC54KSkpXHJcbiAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlSW1nKCk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+WQpuWImeWwseS4jeiDveeCueWHu+WFtuS7luWMuuWfn+eahOiNieWdqlxyXG4gICAgICAgICAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyhcIuivt+WcqOWcn+Wdl+WRqOWbtOW7uueri+mBk+i3r++8gVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VJbWcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoq5YiH5o2i5Zu+54mHICovXHJcbiAgICBwdWJsaWMgY2hhbmdlSW1nKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuY2xlYXIoKTtcclxuICAgICAgICAvL+WmguaenOaYr+iNieWdqizliJnlj5jmiJDlnJ/lnZdcclxuICAgICAgICBpZighdGhpcy5pc011ZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9tdWQucG5nXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5pc011ZD10cnVlO1xyXG4gICAgICAgICAgICBpZihHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5teUZhYy5tdWRBcnJheVswXSE9bnVsbClcclxuICAgICAgICAgICAgeyAgIFxyXG4gICAgICAgICAgICAgICAgR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UubXlGYWMubXVkQXJyYXlbR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UubXlGYWMubXVkQXJyYXkubGVuZ3RoLTFdLnNwLm1vdXNlRW5hYmxlZD1mYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3AubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIEdhbWVDb250cm9sbGVyLkluc3RhbmNlLm15RmFjLm11ZEFycmF5LnB1c2godGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UvL+WmguaenOaYr+Wcn+WdlyzliJnlj5jmiJDojYnlnapcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9ncmFzc1wiK3RoaXMubnVtK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNdWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIEdhbWVDb250cm9sbGVyLkluc3RhbmNlLm15RmFjLm11ZEFycmF5W0dhbWVDb250cm9sbGVyLkluc3RhbmNlLm15RmFjLm11ZEFycmF5Lmxlbmd0aC0yXS5zcC5tb3VzZUVuYWJsZWQ9dHJ1ZTtcclxuICAgICAgICAgICAgR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UubXlGYWMubXVkQXJyYXkucG9wKCk7XHJcbiAgICAgICAgfSAgICAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR3Jhc3MgZnJvbSBcIi4vR3Jhc3NcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3Jhc3NGYWN0b3J5IHtcclxuICAgIC8qKuiNieWdquaVsOe7hCAqL1xyXG4gICAgcHVibGljIGdyYXNzQXJyYXk6QXJyYXk8R3Jhc3M+O1xyXG4gICAgLyoq5Zyf5Z2R5pWw57uEICovXHJcbiAgICBwdWJsaWMgbXVkQXJyYXk6QXJyYXk8R3Jhc3M+O1xyXG4gICAgY29uc3RydWN0b3IoY2FtcDpzdHJpbmcsdmlldzpMYXlhLlNwcml0ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdyYXNzQXJyYXk9bmV3IEFycmF5PEdyYXNzPigpO1xyXG4gICAgICAgIHRoaXMubXVkQXJyYXk9bmV3IEFycmF5PEdyYXNzPigpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlR3Jhc3NBcnJheShjYW1wLHZpZXcpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKirnlJ/miJDojYnlnaogKi9cclxuICAgIHByaXZhdGUgY3JlYXRlR3Jhc3NBcnJheShjYW1wOnN0cmluZyx2aWV3OkxheWEuU3ByaXRlKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTw3O2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaj0wO2o8MTA7aisrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3Jhc3M7XHJcbiAgICAgICAgICAgICAgICBpZihpJTI9PTApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3Jhc3M9bmV3IEdyYXNzKGolMisxLHZpZXcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXNzPW5ldyBHcmFzcygoaisxKSUyKzEsdmlldyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXNzQXJyYXkucHVzaChncmFzcyk7XHJcbiAgICAgICAgICAgICAgICBpZihjYW1wPT1cInJlZFwiKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXNzLnNwLnBvcygxMjArMTAwKmosMjUrMTAwKmkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyYXNzLnNwLnBvcygxNzU5KzEwMCpqLDI1KzEwMCppKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uLy4uL3VpL2xheWFNYXhVSVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkaW5nQ29udHJvbGxlciBleHRlbmRzIHVpLlBsYXllckxvYWRpbmdVSXtcclxuICAgIC8qKuaYr+WQpui/nuaOpeS4iuacjeWKoeWZqCAqL1xyXG4gICAgcHJpdmF0ZSBpc0Nvbm5lY3RTZXJ2ZXIgOiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RTZXJ2ZXIgPSBmYWxzZTsgXHJcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L295ri45oiP5Zy65pmv6LWE5rqQICovXHJcbiAgICBwcml2YXRlIGxvYWRBc3NldHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgc3JjID0gW1xyXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL2dhbWUuYXRsYXNcIn1cclxuICAgICAgICBdO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc3JjLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Qcm9jZXNzKSk7XHJcbiAgICAgICAgdGhpcy5vbkxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3ov5vnqIsgKi9cclxuICAgIHByaXZhdGUgb25Qcm9jZXNzKHBybykgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHByb0JveCA9IHRoaXMuc3BfcHJvZ3Jlc3M7XHJcbiAgICAgICAgbGV0IHByb1cgPSB0aGlzLnNwX3Byb2dyZXNzVztcclxuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xyXG4gICAgICAgIHByb1cud2lkdGggPSBwcm9Cb3gud2lkdGgqcHJvO1xyXG4gICAgICAgIHByb0wueCA9IHByb0JveC53aWR0aCpwcm87XHJcbiAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0U2VydmVyKSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+ato+WcqOi/nuaOpeacjeWKoeWZqOKApuKApl1cIjtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+acjeWKoeWZqOi/nuaOpeaIkOWKn11cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3lrozmr5UgKi9cclxuICAgIHByaXZhdGUgb25Mb2FkKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5FbnRlckdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirov5vlhaXmuLjmiI8gKi9cclxuICAgIHByaXZhdGUgRW50ZXJHYW1lKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZS9HYW1lLnNjZW5lXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xuaW1wb3J0IHsgUHJvdG9jb2wsIEdhbWVDb25maWcgfSBmcm9tIFwiLi4vLi4vQ29yZS9Db25zdC9HYW1lQ29uZmlnXCI7XG5pbXBvcnQgVXNlckxvZ2luSGFuZGxlciBmcm9tIFwiLi9oYW5kbGVyL1VzZXJMb2dpbkhhbmRsZXJcIjtcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L0NsaWVudFNlbmRlclwiO1xuaW1wb3J0IFRvb2wgZnJvbSBcIi4uLy4uL1Rvb2wvVG9vbFwiO1xuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlbENvbWVDb250cm9sbGVyIGV4dGVuZHMgdWkuV2VsY29tZS5Mb2dpblVJe1xuICAgIC8qKuaYr+WQpui/nuaOpeS4iuacjeWKoeWZqCAqL1xuICAgIHByaXZhdGUgaXNDb25uZWN0U2VydmVyIDogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8v55Sf5ZG95ZGo5pyfXG4gICAgLyoq5ZCv5YqoICovXG4gICAgb25FbmFibGUoKXtcbiAgICAgICAgdGhpcy5kYXRhSW5pdCgpO1xuICAgICAgICB0aGlzLnNldENlbnRlcigpO1xuICAgICAgICB0aGlzLmxvYWRBc3NldHMoKTtcbiAgICAgICAgdGhpcy5jb25uZWN0U2VydmVyKCk7Ly/ov57mjqXmnI3liqHlmahcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcbiAgICB9XG5cbiAgICAvKirplIDmr4EqL1xuICAgIG9uRGVzdHJveSgpe1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50cygpO1xuICAgIH1cblxuXG4gICAgLy8vLy8vLy8vLy8v6YC76L6RXG4gICAgLyoq5pWw5o2u5Yid5aeL5YyWICovXG4gICAgcHJpdmF0ZSBkYXRhSW5pdCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RTZXJ2ZXIgPSBmYWxzZTsgXG4gICAgfVxuICAgIC8qKuS6i+S7tue7keWumiAqL1xuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmJ0bl9sb2dpbi5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkxvZ2luKTtcbiAgICAgICAgdGhpcy5idG5fcmVnaXN0ZXIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25SZWdpc3Rlcik7XG4gICAgICAgIHRoaXMuYnRuX3RvTG9naW4ub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Ub0xvZ2luKTtcbiAgICAgICAgdGhpcy5idG5fdG9SZWdpc3Rlci5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblRvUmVnaXN0ZXIpXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfVVNFUl9MT0dJTixuZXcgVXNlckxvZ2luSGFuZGxlcih0aGlzLHRoaXMub25Mb2dpbkhhbmRsZXIpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5idG5fbG9naW4ub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uTG9naW4pO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfVVNFUl9MT0dJTix0aGlzKTtcbiAgICB9XG5cbiAgICAvKirlsYDkuK3mmL7npLogKi9cbiAgICBwcml2YXRlIHNldENlbnRlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGNlbnRlciA9IFRvb2wuZ2V0Q2VudGVyWCgpOy8v5bGP5bmV6auY5bqmXG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MueCA9IGNlbnRlcjtcbiAgICAgICAgdGhpcy5zcF9nYW1lTmFtZS54ID0gY2VudGVyO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9hZEFzc2V0cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IHNyYyA9IFtcbiAgICAgICAgICAgIHt1cmw6XCJ1bnBhY2thZ2Uvd2VsY29tZS9ib3hpbWcucG5nXCJ9XG4gICAgICAgIF07XG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc3JjLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Qcm9jZXNzKSk7XG4gICAgICAgIHRoaXMub25Mb2FkKCk7XG4gICAgfVxuXG4gICAgLyoq5Yqg6L296L+b56iLICovXG4gICAgcHJpdmF0ZSBvblByb2Nlc3MocHJvKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBwcm9Cb3ggPSB0aGlzLnNwX3Byb2dyZXNzO1xuICAgICAgICBsZXQgcHJvVyA9IHRoaXMuc3BfcHJvZ3Jlc3NXO1xuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xuICAgICAgICBwcm9XLndpZHRoID0gcHJvQm94LndpZHRoKnBybztcbiAgICAgICAgcHJvTC54ID0gcHJvQm94LndpZHRoKnBybztcbiAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0U2VydmVyKSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+ato+WcqOi/nuaOpeacjeWKoeWZqOKApuKApl1cIjtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmnI3liqHlmajov57mjqXmiJDlip9dXCI7XG4gICAgfVxuXG4gICAgLyoq5Yqg6L295a6M5q+VICovXG4gICAgcHJpdmF0ZSBvbkxvYWQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIuWKoOi9veWujOavlei/m+WFpea4uOaIj1wiO1xuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODAwLHRoaXMsdGhpcy5zaG93TG9naW5Cb3gpO1xuICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMubmV3RmxvYXRNc2coKTtcbiAgICB9XG5cbiAgICAvKirmmL7npLrnmbvlvZXmoYYqKi9cbiAgICBwcml2YXRlIHNob3dMb2dpbkJveCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcF9sb2dpbkJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hbmkxLnBsYXkoMCxmYWxzZSk7XG4gICAgICAgIHRoaXMuc3BfZ2FtZU5hbWUueCA9IHRoaXMuc3BfbG9naW5Cb3gud2lkdGggKyB0aGlzLnNwX2dhbWVOYW1lLndpZHRoLzIgKyAxMDA7XG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKueCueWHu+eZu+mZhiAqL1xuICAgIHByaXZhdGUgb25Mb2dpbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLy9DbGllbnRTZW5kZXIucmVxVXNlckxvZ2luKHRoaXMuaW5wdXRfdXNlck5hbWUudGV4dCx0aGlzLmlucHV0X3VzZXJLZXkudGV4dCk7XG4gICAgICAgIExheWEuU2NlbmUub3BlbihcIkdhbWVMb2JieS9HYW1lTG9iYnkuc2NlbmVcIik7XG4gICAgfVxuXG4gICAgLyoq54K55Ye75rOo5YaMICovXG4gICAgcHJpdmF0ZSBvblJlZ2lzdGVyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwX3JlZ2lzdGVyQm94LnZpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKueCueWHuyDlt7LmnInotKblj7cgKi9cbiAgICBwcml2YXRlIG9uVG9Mb2dpbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoq54K55Ye7IOazqOWGjCAqL1xuICAgIHByaXZhdGUgb25Ub1JlZ2lzdGVyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBDbGllbnRTZW5kZXIucmVxVXNlclJlZ2lzdGVyKHRoaXMuaW5wdXRfcmVnaXN0ZXJVc2VyTmFtZS50ZXh0LHRoaXMuaW5wdXRfcmVnaXN0ZXJVc2VyS2V5LnRleHQsdGhpcy5pbnB1dF9yZWdpc3Rlck5pY2tOYW1lLnRleHQpOyAgICAgICAgXG4gICAgfVxuXG4gICAgLyoq6I635Y+W5Yiw5raI5oGvICovXG4gICAgcHJpdmF0ZSBvbkxvZ2luSGFuZGxlcihkYXRhKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICBpZihkYXRhICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gXCLnmbvpmYbmiJDlip/vvIzov5vlhaXmuLjmiI/vvIFcIlxuICAgICAgICAgICAgaWYodGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlKSB0ZXh0ID0gXCLms6jlhozmiJDlip/vvIzlsIbnm7TmjqXov5vlhaXmuLjmiI/vvIFcIjtcbiAgICAgICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2codGV4dCk7XG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoMTAwLHRoaXMsdGhpcy50b0dhbWVNYWluKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKui/nuaOpeacjeWKoeWZqCAqL1xuICAgIHByaXZhdGUgY29ubmVjdFNlcnZlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuY29ubmVjdChHYW1lQ29uZmlnLklQLEdhbWVDb25maWcuUE9SVCk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIHByaXZhdGUgdG9HYW1lTWFpbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgLy9UTyBETyDot7Povazoh7PmuLjmiI/lpKfljoVcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZUxvYmJ5L0dhbWVMb2JieS5zY2VuZVwiKTtcbiAgICB9XG59IiwiaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1NvY2tldEhhbmRsZXJcIjtcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5cbi8qKlxuICog55So5oi355m76ZmG6K+35rGCIOi/lOWbnuWkhOeQhlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyTG9naW5IYW5kbGVyIGV4dGVuZHMgU29ja2V0SGFuZGxlcntcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihjYWxsZXI6YW55LGNhbGxiYWNrOkZ1bmN0aW9uID0gbnVsbCl7XG4gICAgICAgIHN1cGVyKGNhbGxlcixjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgIHB1YmxpYyBleHBsYWluKGRhdGEpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXNVc2VyTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlc1VzZXJMb2dpblwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0gUmVzVXNlckxvZ2luLmRlY29kZShkYXRhKTtcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcbiAgICB9XG4gICAgLyoq5aSE55CG5pWw5o2uICovXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxuICAgIHsgICAgICAgICAgICAgICAgXG4gICAgICAgIHN1cGVyLnN1Y2Nlc3MobWVzc2FnZSk7XG4gICAgfVxufVxuICAgICIsIi8qXG4qIOa4uOaIj+mFjee9rlxuKi9cbmV4cG9ydCBjbGFzcyBHYW1lQ29uZmlne1xuICAgIC8qKmlwKi9cbiAgICBwdWJsaWMgc3RhdGljIElQIDogc3RyaW5nID0gXCI0Ny4xMDcuMTY5LjI0NFwiO1xuICAgIC8qKuerr+WPoyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUE9SVCA6IG51bWJlciA9IDc3NzcgIDtcbiAgICAvLyAvKippcCAtIOacrOWcsOa1i+ivlSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBJUCA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCI7XG4gICAgLy8gLyoq56uv5Y+jIC0g5pys5Zyw5rWL6K+VKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFBPUlQgOiBudW1iZXIgPSA3Nzc3O1xuXG4gICAgY29uc3RydWN0b3IoKXtcblxuICAgIH1cbn1cblxuLyoq5Y2P6K6uICovXG5leHBvcnQgY2xhc3MgUHJvdG9jb2x7XG4gICAgLy8gLy8qKioqKioqKioqKipnbU1lc3NhZ2UucHJvdG9cbiAgICAvLyAvKirlj5HpgIFHTeWvhuS7pCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0dNX0NPTTpudW1iZXIgPSAxOTkxMDE7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKnVzZXJNZXNzYWdlLnByb3RvXG4gICAgLy8gLyoq5rOo5YaMIDIwMjEwMiovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9SRUdJU1RFUjpudW1iZXIgPSAyMDIxMDI7XG4gICAgLy8gLyoq55m75b2V6K+35rGCIDIwMjEwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9MT0dJTjpudW1iZXIgPSAyMDIxMDM7XG5cbiAgICAvLyAvKirmnI3liqHlmajov5Tlm54qKioqKioqKioqKioqICovXG4gICAgLy8gLyoq55m75b2V6L+U5ZueIDIwMjIwMSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1VTRVJfTE9HSU46bnVtYmVyID0gMjAyMjAxO1xuICAgIC8vIC8qKuacjeWKoeWZqOWIl+ihqCAyMDIyMDMqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWRVJfTElTVDpudW1iZXIgPSAyMDIyMDM7XG4gICAgLy8gLyoq5YWs5ZGK6Z2i5p2/IDIwMjIwNCovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX05PVElDRV9CT0FSRDpudW1iZXIgPSAyMDIyMDQ7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKmxvZ2luTWVzc2FnZS5wcm90b1xuICAgIC8vIC8qKuacjeWKoeWZqOeZu+W9leivt+axgiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfTE9HSU46bnVtYmVyID0gMTAxMTAxO1xuICAgIC8vIC8qKuW/g+i3s+WMheivt+axgiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfSEVSVDpudW1iZXIgPSAxMDExMDI7XG4gICAgLy8gLyoq6K+35rGC6KeS6Imy5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQ1JFQVRFX1BMQVlFUjpudW1iZXIgPSAxMDExMDM7XG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKuW/g+i3s+i/lOWbniAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0hFUlQ6bnVtYmVyID0gMTAxMjAxO1xuICAgIC8vIC8qKui/lOWbnueZu+W9lemUmeivr+a2iOaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0VSUk9SOm51bWJlciA9IDEwMTIwMjtcbiAgICAvLyAvKirov5Tlm57ooqvpobbkuIvnur8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU1VCU1RJVFVURTpudW1iZXIgPSAxMDEyMDM7XG5cbiAgICAvLyoqKioqKioqKioqKioqKipVc2VyUHJvdG8ucHJvdG9cbiAgICAvKiror7fmsYIgbXNnSWQgPSAxMDExMDMgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX0xPR0lOIDogbnVtYmVyID0gMTAxMTAzO1xuICAgIC8qKjEwMTEwNCDms6jlhozor7fmsYIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX1JFR0lTVEVSIDogbnVtYmVyID0gMTAxMTA0O1xuICAgIC8qKuWTjeW6lCBtc2dJZCA9IDEwMTIwMyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTX1VTRVJfTE9HSU4gOiBudW1iZXIgPSAxMDEyMDM7XG5cbiAgICAvKiror7fmsYLljLnphY3lr7nlsYAxMDIxMDEgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVRDSDpudW1iZXI9MTAyMTAxO1xuICAgIC8qKuivt+axgiDlr7nlsYDmjqXlj5cxMDIxMDIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVRDSF9BQ0NFUFQ6bnVtYmVyPTEwMjEwMjtcbiAgICAvKirlk43lupQg6L+U5Zue5Yy56YWN5L+h5oGvIOWPquWPkemAgeS4gOasoW1zZ0lkID0gMTAyMjAxICovXG4gICAgcHVibGljIHN0YXRpYyBSRVNfTUFUQ0hfSU5GTyA6IG51bWJlciA9IDEwMjIwMTtcbiAgICAvKirlk43lupQg6L+U5Zue5a+55bGA5o6l5Y+X5raI5oGvbXNnSWQgPSAxMDIwMiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTX01BVENIX0FDQ0VQVF9JTkZPIDogbnVtYmVyID0gMTAyMDI7XG4gICAgLy8gLy8qKioqKioqKioqKipwbGF5ZXJNZXNzYWdlLnByb3RvXG4gICAgLy8gLy/or7fmsYJcbiAgICAvLyAvKiror7fmsYLmia3om4sgbXNnSWQ9MTAyMTAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfR0FDSEE6bnVtYmVyID0gMTAyMTAxO1xuXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKueZu+mZhui/lOWbnuinkuiJsuWfuuacrOS/oeaBryAgbXNnSWQ9MTAyMjAxICAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QTEFZRVJfSU5GTzpudW1iZXIgPSAxMDIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5oiQ5YqfICBtc2dJZD0xMDIyMDIgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfU1VDQ0VTUzpudW1iZXIgPSAxMDIyMDI7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5aSx6LSlICBtc2dJZD0xMDIyMDMgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfRkFJTDpudW1iZXIgPSAxMDIyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW5ZCO55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNCAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9FUVVBTDpudW1iZXIgPSAxMDIyMDQ7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNSAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9VUERBVEU6bnVtYmVyID0gMTAyMjA1O1xuICAgIC8vIC8qKui/lOWbnuaJreibiyBtc2dJZD0xMDIyMDYgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0dBQ0hBOm51bWJlciA9IDEwMjIwNjtcblxuICAgIC8vIC8vKioqKioqKioqKioqc2tpbGxNZXNzYWdlLnByb3RvXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLeivt+axgua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKiror7fmsYLmiYDmnInmioDog73kv6Hmga8gbXNnSWQ9MTA3MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MTAxO1xuICAgIC8vIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GSUdIVF9TS0lMTF9MSVNUOm51bWJlciA9IDEwNzEwMjtcbiAgICAvLyAvKiror7fmsYLljYfnuqfmioDog70gbXNnSWQ9MTA3MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVBfU0tJTEw6bnVtYmVyID0gMTA3MTAzO1xuICAgIC8vIC8qKuivt+axgumHjee9ruaKgOiDvSBtc2dJZD0xMDcxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcxMDQ7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9IG1zZ0lkPTEwNzEwNVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0FMVEVSX0dSSURfU0tJTEw6bnVtYmVyID0gMTA3MTA1O1xuXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57miYDmnInmioDog73kv6Hmga8gIG1zZ0lkPTEwNzIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTExfU0tJTExfSU5GTzpudW1iZXIgPSAxMDcyMDE7XG4gICAgLy8gLyoq6L+U5Zue5Ye65oiY5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfRklHSFRfU0tJTExfTElTVDpudW1iZXIgPSAxMDcyMDI7XG4gICAgLy8gLyoq6L+U5Zue5Y2H57qn5oqA6IO9ICBtc2dJZD0xMDcyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVBfU0tJTEw6bnVtYmVyID0gMTA3MjAzO1xuICAgIC8vIC8qKui/lOWbnumHjee9ruaKgOiDveaIkOWKn++8jOWuouaIt+err+aUtuWIsOatpOa2iOaBr++8jOacrOWcsOenu+mZpOWFqOmDqOaKgOiDvSAgbXNnSWQ9MTA3MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNzIwNDtcbiAgICAvLyAvKirov5Tlm57mlLnlj5jmoLzlrZDmioDog70gIG1zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTFRFUl9HUklEX1NLSUxMOm51bWJlciA9IDEwNzIwNTtcblxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogcGV0TWVzc2FnZVxuICAgIC8vIC8qKuivt+axguWuoOeJqeWIneWni+WIm+W7uu+8iOWIm+W7uuinkuiJsuiOt+W+l+WIneWni+WuoOeJqe+8iSBtc2dJZD0xMDUxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDUyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUxMDE7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5LiK6Zi15a6g54mp5L+h5oGvIG1zZ0lkPTEwNTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9BTFRFUl9HUklEOm51bWJlciA9IDEwNTEwMjtcbiAgICAvLyAvKiror7fmsYLlloLlrqDnianlkIPppa0gbXNnSWQ9MTA1MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZFRUQ6bnVtYmVyID0gMTA1MTAzO1xuICAgIC8vIC8qKuivt+axguWuoOeJqeWQiOaIkCBtc2dJZD0xMDUxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQ09NUE9VTkQ6bnVtYmVyID0gMTA1MTA0O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MTA2O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MTA3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MTA4O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjSBtc2dJZD0xMDUxMDlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HOm51bWJlciA9IDEwNTEwOTtcbiAgICAvLyAvKiror7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0VWT0xWRTpudW1iZXIgPSAxMDUxMTA7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9IQVRDSDpudW1iZXIgPSAxMDUxMTE7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTExMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUxMTI7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRVFfTUFUSU5HOm51bWJlciA9IDEwNTExMztcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MTE0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE0IOWmguaenOWuoOeJqeacrOi6q+acieeZu+iusOaVsOaNru+8jOS9hue5geihjeaVsOaNruaJvuS4jeWIsO+8iOi/lOWbnua2iOaBr21zZ0lkPTEwNTIxMuWSjG1zZ0lkPTEwNTIxM+abtOaWsOWuouaIt+err+aVsOaNru+8iSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQUxMSU5GTzpudW1iZXIgPSAxMDUxMTQ7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5p+l55yL6K+35rGC5YiX6KGoIG1zZ0lkPTEwNTExNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1Q6bnVtYmVyID0gMTA1MTE1O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUxMTZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTbvvIzlpoLmnpzmmK/lkIzmhI/vvIzlr7nmlrnnjqnlrrblpoLmnpzlnKjnur/vvIzkvJrmlLbliLBtc2dJZD0xMDUyMTDmtojmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX0NIT09TRTpudW1iZXIgPSAxMDUxMTY7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55uu5qCH5Yi35pawIG1zZ0lkPTEwNTExN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0g6bnVtYmVyID0gMTA1MTE3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX1RBUkdFVF9MT09LOm51bWJlciA9IDEwNTExODtcbiAgICAvLyAvKiror7fmsYLlrqDnianmlL7nlJ8gbXNnSWQ9MTA1MTE5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MTE5O1xuXG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iW1zZ0lkPTEwNTIwMSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9BTExfSU5GTzpudW1iZXIgPSAxMDUyMDE7XG4gICAgLy8gLy8g6L+U5Zue5a6g54mp5qC85a2Q5L+h5oGvIG1zZ0lkPTEwNTIwMlxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfR1JJRF9JTkZPOm51bWJlciA9IDEwNTIwMjtcbiAgICAvLyAvKirov5Tlm57lrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MjAzKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX1JBTkRPTV9DUkVBVEU6bnVtYmVyID0gMTA1MjAzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeetiee6p+WSjOe7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDveetiee6p+WSjOaKgOiDvee7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqeaKgOiDvee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA1O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MjA2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MjA3O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MjA4O1xuXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5Lqk6YWNIG1zZ0lkPTEwNTIwOSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdUOm51bWJlciA9IDEwNTIwOTtcbiAgICAvLyAvKirov5Tlm57lrqDnianlop7liqDnuYHooY3mrKHmlbAgbXNnSWQ9MTA1MjEwICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0FERF9NQVRJTkdfQ09VTlQ6bnVtYmVyID0gMTA1MjEwO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqei/m+WMliBtc2dJZD0xMDUyMTEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfRVZPTFZFOm51bWJlciA9IDEwNTIxMTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MjEyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFR0lTVEVSOm51bWJlciA9IDEwNTIxMjtcbiAgICAvLyAvKirov5Tlm57lrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MjEzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFUV9NQVRJTkc6bnVtYmVyID0gMTA1MjEzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUyMTQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0FMTElORk86bnVtYmVyID0gMTA1MjE0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUyMTUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTIxNTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MjE2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX01BVElOR19DSE9PU0U6bnVtYmVyID0gMTA1MjE2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUyMTcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNIOm51bWJlciA9IDEwNTIxNztcbiAgICAvLyAvKirov5Tlm57lrqDnianmlL7nlJ8gbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MjE4O1xuICAgIFxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogZXF1aXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX01BS0U6bnVtYmVyID0gMTA5MTAxO1xuICAgIC8vIC8qKuivt+axguijheWkh+WIhuinoyBtc2dJZD0xMDkxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9TUExJVDpudW1iZXIgPSAxMDkxMDZcbiAgICAvLyAvKiror7fmsYLoo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTE9DSzpudW1iZXIgPSAxMDkxMDQ7XG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5by65YyWIG1zZ0lkPTEwOTEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0FUVF9BREQ6bnVtYmVyID0gMTA5MTA1O1xuICAgIC8vIC8qKuivt+axguijheWkh+epv+aItCBtc2dJZD0xMDkxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9MT0FESU5HOm51bWJlciA9IDEwOTEwMjtcbiAgICAvLyAvKiror7fmsYLoo4XlpIfljbjovb0gbXNnSWQ9MTA5MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfVU5MT0FESU5HOm51bWJlciA9IDEwOTEwMztcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX01BS0UgPSAxMDkyMDE7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX1NQTElUID0gMTA5MjA2O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+W8uuWMliBtc2dJZD0xMDkyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9BVFRfQUREID0gMTA5MjA1O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+epv+aItCBtc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0FESU5HID0gMTA5MjAyO1xuICAgIC8vIC8qKui/lOWbnuijheWkh+WNuOi9vSBtc2dJZD0xMDkyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9VTkxPQURJTkcgPSAxMDkyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX0xPQ0sgPSAxMDkyMDQ7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBtYXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5pmu6YCa5oiY5paX77yI5a6i5oi356uv5LiA5Zy65oiY5paX57uT5p2f5LmL5ZCO5Y+R6YCB5q2k5raI5oGv77yM5YaN6L+b6KGM5YCS6K6h5pe25ZKM5pys5Zyw5YGH5oiY5paX77yJIG1zZ0lkPTEwNjEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9OT1JNQUxfRklHSFQ6bnVtYmVyID0gMTA2MTAxO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyBtc2dJZD0xMDYxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1BFRURfRklHSFQ6bnVtYmVyID0gMTA2MTA0O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoeaImOaWlyBtc2dJZD0xMDYxMDVcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1dFRVBfRklHSFQ6bnVtYmVyID0gMTA2MTA1O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoei0reS5sOaJq+iNoSBtc2dJZD0xMDYxMDZcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDAwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9CVVlfU1dFRVA6bnVtYmVyID0gMTA2MTA2O1xuICAgIC8vIC8qKuivt+axguWFs+WNoeWBh+aImOaWl+e7k+adn+mihuWPluWlluWKsSBtc2dJZD0xMDYxMDlcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDYyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYxMDk7XG4gICAgLy8gLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVFJVRV9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTAyO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NDRU5FX0ZJR0hUOm51bWJlciA9IDEwNjEwMztcbiAgICAvLyAvKiror7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX0NIQU5HRV9TQ0VORTpudW1iZXIgPSAxMDYxMDg7XG5cblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue56a757q/5ZKM5omr6I2h5pS255uK5L+h5oGvIG1zZ0lkPTEwNjIwMiovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfT0ZGX0xJTkVfQVdBUkRfSU5GTzpudW1iZXIgPSAxMDYyMDI7XG4gICAgLy8gLyoq6L+U5Zue5oiY5paX5pKt5pS+57uT5p2f5Y+R5pS+5aWW5Yqx77yI5bqU55So5LqO5omA5pyJ5oiY5paX77yJIG1zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRklHSFRfRU5EOm51bWJlciA9IDEwNjIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIHBhY2tNZXNzYWdlXG4gICAgLy8gLyoq5L2/55So6YGT5YW35raI5oGvICBtc2dJZD0xMDQxMDEg6L+U5Zue5pON5L2c5oiQ5Yqf5raI5oGvICBtc2dJZD0xMDIyMDIgY29kZT0xMDAwMe+8iOaaguWumu+8jOagueaNruWunumZheS9v+eUqOaViOaenOWGjeWBmu+8iSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFOm51bWJlciA9IDEwNDEwMTtcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6YGT5YW35Y+Y5YyW5L+h5oGvICBtc2dJZD0xMDQyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QUk9QX0lORk86bnVtYmVyID0gMTA0MjAyO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iSAgbXNnSWQ9MTA0MjAxKOacieWPr+iDveS4uuepuuWIl+ihqCkqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BBQ0tfQUxMX0lORk86bnVtYmVyID0gMTA0MjAxO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheWNleS4quijheWkh+WPmOWMluS/oeaBryBtc2dJZD0xMDQyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9JTkZPOm51bWJlciA9IDEwNDIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqKiogZmlnaHRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfT1BFTl9NQUlMOm51bWJlciA9IDExMTEwMTtcbiAgICAvLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0FXQVJEOm51bWJlciA9IDExMTEwMjtcbiAgICAvLyAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0RFTEVURTpudW1iZXIgPSAxMTExMDM7XG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57pgq7ku7bkv6Hmga8gbXNnSWQ9MTExMjAx77yI55m76ZmG5Li75Yqo6L+U5ZueIOaIluiAhSDlj5HnlJ/lj5jljJbov5Tlm57vvIkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0lORk86bnVtYmVyID0gMTExMjAxO1xuICAgIC8vIC8qKui/lOWbnumCruS7tuW3sumihuWPluaIkOWKnyBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0FXQVJEOm51bWJlciA9IDExMTIwMjtcbiAgICAvLyAvKirov5Tlm57liKDpmaTpgq7ku7bmiJDlip8gbXNnSWQ9MTExMjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9ERUxFVEU6bnVtYmVyID0gMTExMjAzO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmaWdodE1lc3NhZ2VcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuS4gOWcuuaImOaWl+aXpeW/lyBtc2dJZD0xMDgyMDEqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1RSVUVfRklHSFRfTE9HX0lORk86bnVtYmVyID0gMTA4MjAxO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmcmllbmRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9QVVNIOm51bWJlciA9IDExMjEwMTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX1NFQVJDSDpudW1iZXIgPSAxMTIxMDI7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BUFBMWTpudW1iZXIgPSAxMTIxMDM7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5pON5L2cIG1zZ0lkPTExMjEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9PUEVSQVRJT046bnVtYmVyID0gMTEyMTA0O1xuICAgIC8vIC8qKuivt+axguWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfTU9SRV9JTkZPOm51bWJlciA9IDExMjEwNTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0dJRlQ6bnVtYmVyID0gMTEyMTA2XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BbGxfSW5mbzpudW1iZXIgPSAxMTIxMDc7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9GSUdIVDpudW1iZXIgPSAxMTIxMDg7XG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWlveWPi+aOqOiNkCBtc2dJZD0xMTIyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pCc57SiIG1zZ0lkPTExMjIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9TRUFSQ0g6bnVtYmVyID0gMTEyMjAyO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+eUs+ivtyBtc2dJZD0xMTIyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfQVBQTFk6bnVtYmVyID0gMTEyMjAzO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+aTjeS9nCBtc2dJZD0xMTIyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjIwNDtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMjA1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX01PUkVfSU5GTzpudW1iZXIgPSAxMTIyMDU7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L6YCB56S8IG1zZ0lkPTExMjIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9HSUZUOm51bWJlciA9IDExMjIwNjtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMjA3ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX0FMTF9JTkZPOm51bWJlciA9IDExMjIwNzsgICAgXG5cbn0iLCJpbXBvcnQgRmxvYXRNc2cgZnJvbSBcIi4uL1Rvb2wvRmxvYXRNc2dcIjtcbmltcG9ydCBUb29sIGZyb20gXCIuLi9Ub29sL1Rvb2xcIjtcblxuLyoqXG4gKiDmtojmga/mmL7npLrnrqHnkIblmahcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZU1hbmFnZXIge1xuICAgIC8qKuWNleS+iyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zIDogTWVzc2FnZU1hbmFnZXIgPSBuZXcgTWVzc2FnZU1hbmFnZXI7XG4gICAgLyoq5bGP5bmV5oul5pyJ55qE5rWu5Yqo5raI5oGv6K6h5pWwKi9cbiAgICBwdWJsaWMgY291bnRGbG9hdE1zZyA6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2cgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa1ruWKqOa2iOaBr+mihOeDrSzvvIzmj5DliY3mlrDlu7rkuIDkuKpmbG9hdFxuICAgICAqL1xuICAgIHB1YmxpYyBuZXdGbG9hdE1zZygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGZsb2F0TXNnID0gbmV3IEZsb2F0TXNnKCk7XG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmxvYXRNc2cpO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsZmxvYXRNc2cpOyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrmta7liqjmtojmga9cbiAgICAgKiBAcGFyYW0gdGV4dCAg5pi+56S65raI5oGvXG4gICAgICovXG4gICAgcHVibGljIHNob3dGbG9hdE1zZyh0ZXh0OnN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgZmxvYXRNc2cgOiBGbG9hdE1zZyA9IExheWEuUG9vbC5nZXRJdGVtKFwiRmxvYXRNc2dcIik7XG4gICAgICAgIGlmKExheWEuUG9vbC5nZXRQb29sQnlTaWduKFwiRmxvYXRNc2dcIikubGVuZ3RoID09IDApIHRoaXMubmV3RmxvYXRNc2coKTtcbiAgICAgICAgaWYoZmxvYXRNc2cgID09PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBmbG9hdE1zZyA9IG5ldyBGbG9hdE1zZygpO1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmbG9hdE1zZyk7ICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBmbG9hdE1zZy56T3JkZXIgPSAxMDAgKyB0aGlzLmNvdW50RmxvYXRNc2c7XG4gICAgICAgIGNvbnNvbGUubG9nKFRvb2wuZ2V0Q2VudGVyWCgpKTtcbiAgICAgICAgZmxvYXRNc2cuc2hvd01zZyh0ZXh0LHt4OlRvb2wuZ2V0Q2VudGVyWCgpICsgdGhpcy5jb3VudEZsb2F0TXNnKjIwLHk6IDM3NSArIHRoaXMuY291bnRGbG9hdE1zZyoyMH0pO1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2crKztcbiAgICB9XG5cbn0iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XG5cbi8qXG4qIOWuouaIt+err+WPkemAgeWZqFxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNlbmRlcntcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgKiDnlKjmiLfnmbvlvZUgMTAxMTAzXG4gICAgKiBAcGFyYW0gdXNlck5hbWUgXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcVVzZXJMb2dpbih1c2VyTmFtZTpzdHJpbmcsdXNlcktleTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJMb2dpblwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbiAgICAgICAgbWVzc2FnZS51c2VyS2V5ID0gdXNlcktleTtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZXJMb2dpbi5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfTE9HSU4sYnVmZmVyKTtcbiAgICB9XG4gICAgXG4gICAgICAgICAgICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfms6jlhowgMTAxMTA0XG4gICAgICogQHBhcmFtIHVzZXJOYW1lIFxuICAgICogQHBhcmFtIHVzZXJQYXNzIFxuICAgICogQHBhcmFtIHVzZXJOaWNrTmFtZVxuICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXFVc2VyUmVnaXN0ZXIodXNlck5hbWU6c3RyaW5nLHVzZXJLZXk6c3RyaW5nLHVzZXJOaWNrTmFtZTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyUmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJSZWdpc3RlclwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIHZhciB1c2VyRGF0YTphbnkgPSB7fTtcbiAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xuICAgICAgICBtZXNzYWdlLnVzZXJLZXkgPSB1c2VyS2V5O1xuICAgICAgICB1c2VyRGF0YS5uaWNrTmFtZSA9IHVzZXJOaWNrTmFtZTtcbiAgICAgICAgdXNlckRhdGEubHYgPSAxO1xuICAgICAgICBtZXNzYWdlLnVzZXJEYXRhID0gdXNlckRhdGE7XG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyUmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6K+35rGC5Yy56YWN5a+55bGAIDEwMjEwMVxuICAgICAqIEBwYXJhbSB1c2VySWQgXG4gICAgKiBAcGFyYW0gbWF0Y2hJZCBcbiAgICAqL1xuICAgcHVibGljIHN0YXRpYyByZXFNYXRjaCh1c2VySWQ6bnVtYmVyLG1hdGNoSWQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdmFyIFJlcU1hdGNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXRjaFwiKTtcbiAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICBtZXNzYWdlLm1hdGNoSWQgPSBtYXRjaElkO1xuICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXRjaC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0gsYnVmZmVyKTtcbiAgIH1cblxuICAgLyoqXG4gICAgICog6K+35rGCIOWvueWxgOaOpeWPlyDov5Tlm54xMDIyMDJcbiAgICAgKiBAcGFyYW0gdXNlcklkIFxuICAgICogQHBhcmFtIGlzQWNjZXB0ZSBcbiAgICAqL1xuICAgcHVibGljIHN0YXRpYyByZXFNYXRjaEFjY2VwdCh1c2VySWQ6bnVtYmVyLGlzQWNjZXB0ZTpudW1iZXIpOnZvaWRcbiAgIHtcbiAgICAgICB2YXIgUmVxTWF0Y2hBY2NlcHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hdGNoQWNjZXB0XCIpO1xuICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgIG1lc3NhZ2UudXNlcklkID0gdXNlcklkO1xuICAgICAgIG1lc3NhZ2UuaXNBY2NlcHRlID0gaXNBY2NlcHRlO1xuICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXRjaEFjY2VwdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0hfQUNDRVBULGJ1ZmZlcik7XG4gICB9XG4gICAgXG4gICAgLyoqKua2iOaBr+WPkemAgSovXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKndlYlNvY2tldCAqL1xuICAgIC8qKuWPkemAgUdN5a+G5LukICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHbU1zZyhnbTpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFHTUNvbW06YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdNQ29tbVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuY29tbSA9IGdtO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR01Db21tLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfR01fQ09NLGJ1ZmZlcik7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoq5b+D6Lez5YyFICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBzZXJ2SGVhcnRSZXEoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9TRVJWX0hFUlQpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDnlKjmiLfms6jlhoxcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUmVxKHVzZXJOYW1lOnN0cmluZyx1c2VyUGFzczpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFSZWdpc3RlclVzZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVJlZ2lzdGVyVXNlclwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbi8vICAgICAgICAgbWVzc2FnZS51c2VyUGFzcyA9IHVzZXJQYXNzO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUmVnaXN0ZXJVc2VyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFUl9SRUdJU1RFUixidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDnmbvlvZXmnI3liqHlmahcbi8vICAgICAgKiBAcGFyYW0gdG9rZW4gXG4vLyAgICAgICogQHBhcmFtIHNlcnZJZCBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIGxvZ2luU2VydlJlcShzZXJ2SWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUxvZ2luXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5jb2RlID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpbkF1dGhlbnRpY2F0aW9uO1xuLy8gICAgICAgICBtZXNzYWdlLnNlcnZlcklkID0gc2VydklkO1xuLy8gICAgICAgICBtZXNzYWdlLmFnZW50SWQgPSAxO1xuLy8gICAgICAgICBtZXNzYWdlLmNsaWVudElkID0gMTtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUxvZ2luLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfU0VSVl9MT0dJTixidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDliJvlu7rop5LoibJcbi8vICAgICAgKiBAcGFyYW0gc2V4IFxuLy8gICAgICAqIEBwYXJhbSBwbGF5ZXJOYW1lIFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUGxheWVyUmVxKHNleDpudW1iZXIscGxheWVyTmFtZTpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFDcmVhdGVQbGF5ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUNyZWF0ZVBsYXllclwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gc2V4O1xuLy8gICAgICAgICBtZXNzYWdlLnBsYXllck5hbWUgPSBwbGF5ZXJOYW1lO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQ3JlYXRlUGxheWVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfQ1JFQVRFX1BMQVlFUixidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5omA5pyJ5oqA6IO95L+h5oGvICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFBbGxTa2lsbEluZm8oKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9BTExfU0tJTExfSU5GTyk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRmlnaHRTa2lsbExpc3QoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GSUdIVF9TS0lMTF9MSVNUKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Y2H57qn5oqA6IO9ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFVcFNraWxsKHNraWxsVXBMdlZvczpBcnJheTxTa2lsbFVwTHZWbz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFVcFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVcFNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QgPSBbXTtcbi8vICAgICAgICAgdmFyIGluZm86YW55O1xuLy8gICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2tpbGxVcEx2Vm9zLmxlbmd0aDtpKyspXG4vLyAgICAgICAgIHtcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcbi8vICAgICAgICAgICAgIGluZm8uc2tpbGxJZCA9IHNraWxsVXBMdlZvc1tpXS5za2lsbElkO1xuLy8gICAgICAgICAgICAgaW5mby50b1NraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0udG9Ta2lsbElkO1xuLy8gICAgICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QucHVzaChpbmZvKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXBTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VQX1NLSUxMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLph43nva7mioDog70gKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVJlc2V0U2tpbGwoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9SRVNFVF9TS0lMTCk7ICAgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguS9v+eUqOmBk+WFtyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXNlKHByb3BJZDpMb25nLG51bTpudW1iZXIsYXJncz86c3RyaW5nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxVXNlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVc2VcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDtcbi8vICAgICAgICAgbWVzc2FnZS5udW0gPSBudW07XG4vLyAgICAgICAgIGlmKGFyZ3MpXG4vLyAgICAgICAgICAgICBtZXNzYWdlLmFyZ3MgPSBhcmdzO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXNlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFLGJ1ZmZlcik7ICBcbi8vICAgICB9XG4gICAgXG4vLyAgICAgLyoq6K+35rGC5a6g54mp5ZCI5oiQICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRDb21wb3VuZChwcm9wSWQ6TG9uZylcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRDb21wb3VuZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0Q29tcG91bmRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldENvbXBvdW5kLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0NPTVBPVU5ELGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguWWguWuoOeJqeWQg+mlrSovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRGZWVkKHBldElkOkxvbmcscHJvcExpc3Q6QXJyYXk8UHJvcFZvPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEZlZWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEZlZWRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcExpc3QgPSBwcm9wTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEZlZWQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRkVFRCxidWZmZXIpOyBcbi8vICAgICB9XG5cblxuLy8gICAgIC8qKuivt+axguaUueWPmOagvOWtkOaKgOiDvSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxQWx0ZXJHcmlkU2tpbGwodHlwZTpudW1iZXIsc2tpbGxVcEdyaWQ6U2tpbGxVcEdyaWRWbyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUFsdGVyR3JpZFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFBbHRlckdyaWRTa2lsbFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7ICAgICAgICBcbi8vICAgICAgICAgdmFyIHZvOmFueSA9IHt9O1xuLy8gICAgICAgICB2by5ncmlkSWQgPSBza2lsbFVwR3JpZC5ncmlkSWQ7XG4vLyAgICAgICAgIHZvLnNraWxsSWQgPSBza2lsbFVwR3JpZC5za2lsbElkO1xuLy8gICAgICAgICBtZXNzYWdlLmdyaWQgPSB2bzsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQWx0ZXJHcmlkU2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpOyAgICAgICAgXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0FMVEVSX0dSSURfU0tJTEwsYnVmZmVyKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5pS55Y+Y5a6g54mp6Zi15Z6L5qC85a2QICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRBbHRlckdyaWQodHlwZTpudW1iZXIsZ3JpZExpc3Q6QXJyYXk8TGluZXVwR3JpZFZvPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEFsdGVyR3JpZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0QWx0ZXJHcmlkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5ncmlkTGlzdCA9IFtdO1xuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XG4vLyAgICAgICAgIGZvcih2YXIgaSA9IDA7aSA8IGdyaWRMaXN0Lmxlbmd0aDtpKyspXG4vLyAgICAgICAgIHtcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcbi8vICAgICAgICAgICAgIGluZm8uZ3JpZElkID0gZ3JpZExpc3RbaV0uZ3JpZElkO1xuLy8gICAgICAgICAgICAgaW5mby5wZXRJZCA9IGdyaWRMaXN0W2ldLmhlcm9JZDtcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QucHVzaChpbmZvKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0QWx0ZXJHcmlkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0FMVEVSX0dSSUQsYnVmZmVyKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5omt6JuLIG1zZ0lkPTEwMjEwMVxuLy8gICAgICAqIEBwYXJhbSBtb25leVR5cGUgLy8g5omt6JuL57G75Z6LIDA96YeR5biB5oq9IDE96ZK755+z5oq9XG4vLyAgICAgICogQHBhcmFtIG51bVR5cGUg5qyh5pWw57G75Z6LIDA95YWN6LS55Y2V5oq9IDE95Y2V5oq9IDI95Y2B6L+e5oq9XG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHYWNoYShtb25leVR5cGU6bnVtYmVyLG51bVR5cGU6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxR2FjaGE6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdhY2hhXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gbW9uZXlUeXBlO1xuLy8gICAgICAgICBtZXNzYWdlLm51bVR5cGUgPSBudW1UeXBlO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR2FjaGEuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9HQUNIQSxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h5b+r6YCf5oiY5paXICovXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU3BlZWRGaWdodCgpOnZvaWRcbi8vICAgICAge1xuLy8gICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NQRUVEX0ZJR0hUKTtcbi8vICAgICAgfVxuXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoei0reS5sOaJq+iNoSAqL1xuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcEJ1eVN3ZWVwKCk6dm9pZFxuLy8gICAgICB7XG4vLyAgICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfQlVZX1NXRUVQKTtcbi8vICAgICAgfSAgIFxuXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoSAgKi9cbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTd2VlcEZpZ2h0KHNjZW5lSWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAgIHtcbi8vICAgICAgICAgIHZhciAgUmVxTWFwU3dlZXBGaWdodDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFwU3dlZXBGaWdodFwiKTtcbi8vICAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICAgbWVzc2FnZS5zY2VuZUlkID0gc2NlbmVJZDtcbi8vICAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBTd2VlcEZpZ2h0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TV0VFUF9GSUdIVCxidWZmZXIpO1xuLy8gICAgICB9XG5cbi8vICAgICAvKirpmo/mnLrliJvlu7rkuIDmnaHpvpkgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJhbmRvbUNyZWF0ZSgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SQU5ET01fQ1JFQVRFKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Zyw5Zu+5pmu6YCa5oiY5paX77yI5a6i5oi356uv5LiA5Zy65oiY5paX57uT5p2f5LmL5ZCO5Y+R6YCB5q2k5raI5oGv77yM5YaN6L+b6KGM5YCS6K6h5pe25ZKM5pys5Zyw5YGH5oiY5paX77yJIG1zZ0lkPTEwNjEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfTk9STUFMX0ZJR0hUKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5YWz5Y2h5YGH5oiY5paX57uT5p2f6aKG5Y+W5aWW5YqxIG1zZ0lkPTEwNjEwOVx0XHQtLS0tLei/lOWbnua2iOaBryDov5Tlm57miJDlip/mtojmga/vvIxjb2RlPTEwNjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHRFbmQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORCk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTY2VuZUZpZ2h0KCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NDRU5FX0ZJR0hUKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVHVyZUZpZ2h0RW5kKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVFJVRV9GSUdIVF9FTkQpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvXG4vLyAgICAgICogQHBhcmFtIHNjZW5lSWQgXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBDaGFuZ2VTY2VuZShzY2VuZUlkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1hcENoYW5nZVNjZW5lOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXBDaGFuZ2VTY2VuZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2NlbmVJZCA9IHNjZW5lSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBDaGFuZ2VTY2VuZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9DSEFOR0VfU0NFTkUsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp5Lqk6YWNIG1zZ0lkPTEwNTEwOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOVxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEgXG4vLyAgICAgICogQHBhcmFtIHBldElkMiBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZyhwZXRJZDE6TG9uZyxwZXRJZDI6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZDEgPSBwZXRJZDE7XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQyID0gcGV0SWQyO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElORyxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExXG4vLyAgICAgICogQHBhcmFtIHBldElkMSDov5vljJblrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSBiZVBldElkTGlzdCDmtojogJflrqDnialpZOWIl+ihqFxuLy8gICAgICAqIEBwYXJhbSBwcm9wSWQg5raI6ICX6YGT5YW35ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gcHJvcE51bSDmtojogJfpgZPlhbfmlbDph49cbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEV2b2x2ZShwZXRJZDpMb25nLGJlUGV0SWRMaXN0OkFycmF5PExvbmc+LHByb3BJZExpc3Q6QXJyYXk8TG9uZz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRFdm9sdmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEV2b2x2ZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgaWYoYmVQZXRJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuYmVQZXRJZExpc3QgPSBiZVBldElkTGlzdDtcbi8vICAgICAgICAgaWYocHJvcElkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5wcm9wSWRMaXN0ID0gcHJvcElkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEV2b2x2ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9FVk9MVkUsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwM1xuLy8gICAgICAqIEBwYXJhbSBlZ2dJZCDlrqDnianom4vllK/kuIBpZFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0SGF0Y2goZWdnSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEhhdGNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRIYXRjaFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZWdnSWQgPSBlZ2dJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEhhdGNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0hBVENILGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeeZu+iusCBtc2dJZD0xMDUxMTJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTJcbi8vICAgICAgKiBAcGFyYW0gZWdnSWQg5a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkIOmcgOimgeWTgei0qOadoeS7tmlkKDDooajnpLrkuI3pmZDliLYpXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZWdpc3RlcihwZXRJZDpMb25nLHF1YWxpdHlJZDpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRSZWdpc3RlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVnaXN0ZXJcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UucXVhbGl0eUlkID0gcXVhbGl0eUlkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVHSVNURVIsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxM1xuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDor7fmsYLmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOaOpeaUtuaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXFNYXRpbmcocGV0SWQ6TG9uZyx0b1BldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRSZXFNYXRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlcU1hdGluZ1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlcU1hdGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRVFfTUFUSU5HLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUxMTRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTRcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAgMT3lip/vvIwyPemYsu+8jDM96YCf77yMND3ooYDvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBjb25maWdJZCDlrqDnianphY3nva5pZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciAg5a6g54mp5oCn5Yir77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkTGlzdCDlrqDnianlk4HotKhpZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdBbGxJbmZvKHBldFR5cGU6bnVtYmVyLGNvbmZpZ0lkOm51bWJlcixnZW5kZXI6bnVtYmVyLHF1YWxpdHlJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ0FsbEluZm86YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ0FsbEluZm9cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldFR5cGUgPSBwZXRUeXBlO1xuLy8gICAgICAgICBtZXNzYWdlLmNvbmZpZ0lkID0gY29uZmlnSWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gZ2VuZGVyO1xuLy8gICAgICAgICBpZihxdWFsaXR5SWRMaXN0Lmxlbmd0aCA+IDApXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZExpc3QgPSBxdWFsaXR5SWRMaXN0O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQWxsSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQUxMSU5GTyxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MTE1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE1XG4vLyAgICAgICogQHBhcmFtIHBldElkIOWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTZWxlY3RSZXFMaXN0KHBldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRTZWxlY3RSZXFMaXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTZWxlY3RSZXFMaXN0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2VsZWN0UmVxTGlzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1QsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN5ZCM5oSP5oiW5ouS57udIG1zZ0lkPTEwNTExNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNu+8jOWmguaenOaYr+WQjOaEj++8jOWvueaWueeOqeWutuWmguaenOWcqOe6v++8jOS8muaUtuWIsG1zZ0lkPTEwNTIxMOa2iOaBr1xuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDmiJHmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOWvueaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIGlzQ29uc2VudCDmmK/lkKblkIzmhI8gdHJ1ZT3lkIzmhI9cbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ0Nob29zZShwZXRJZDpMb25nLHRvUGV0SWQ6TG9uZyxpc0NvbnNlbnQ6Ym9vbGVhbik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ0Nob29zZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nQ2hvb3NlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGV0SWQgPSB0b1BldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmlzQ29uc2VudCA9IGlzQ29uc2VudDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ0Nob29zZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQ0hPT1NFLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUxMTdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTdcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGNvbmZpZ0lkIOWuoOeJqemFjee9rmlk77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gZ2VuZGVyIOWuoOeJqeaAp+WIq++8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIHF1YWxpdHlJZExpc3Qg5a6g54mp5ZOB6LSoaWTvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nVGFyZ2V0UmVmcmVzaChwZXRUeXBlOm51bWJlcixjb25maWdJZDpudW1iZXIsZ2VuZGVyOm51bWJlcixxdWFsaXR5SWRMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRUeXBlID0gcGV0VHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5jb25maWdJZCA9IGNvbmZpZ0lkO1xuLy8gICAgICAgICBtZXNzYWdlLmdlbmRlciA9IGdlbmRlcjtcbi8vICAgICAgICAgaWYocXVhbGl0eUlkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWRMaXN0ID0gcXVhbGl0eUlkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNILGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMThcbi8vICAgICAgKiBAcGFyYW0gdG9QbGF5ZXJJZCDooqvmn6XnnIvlrqDniannmoTkuLvkurrnmoRpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOiiq+afpeeci+WuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdUYXJnZXRMb29rKHRvUGxheWVySWQ6TG9uZyx0b1BldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRMb29rOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRMb29rXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ1RhcmdldExvb2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX0NIT09TRSxidWZmZXIpO1xuLy8gICAgIH1cblxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAxICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcE1ha2UocHJvcElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcE1ha2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTWFrZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkOyAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcE1ha2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9NQUtFLGJ1ZmZlcik7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBTcGxpdChlcXVpcElkOkFycmF5PExvbmc+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBTcGxpdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBTcGxpdFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwU3BsaXQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9TUExJVCxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLoo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvY2socGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcExvY2s6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTG9ja1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2NrLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTE9DSyxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLoo4XlpIflvLrljJYgbXNnSWQ9MTA5MTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA1ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcEF0dEFkZChwZXRJZDpMb25nLGVxdWlwSWQ6TG9uZyxsdWNrTnVtOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9jazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2NrXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyBcbi8vICAgICAgICAgbWVzc2FnZS5sdWNrTnVtID0gbHVja051bTsgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvY2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9BVFRfQURELGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vIFx0Lyoq6K+35rGC6KOF5aSH56m/5oi0IG1zZ0lkPTEwOTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBMb2FkaW5nKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKVxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2FkaW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2FkaW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTE9BRElORyxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5Y246L29IG1zZ0lkPTEwOTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBVbkxvYWRpbmcocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBVbkxvYWRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwVW5Mb2FkaW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBVbkxvYWRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9VTkxPQURJTkcsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gXHQvKiror7fmsYLlrqDnianpoobmgp/mioDog70gbXNnSWQ9MTA1MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA2ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTdHVkeVNraWxsKHBldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRTdHVkeVNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTdHVkeVNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U3R1ZHlTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TVFVEWV9TS0lMTCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5a6g54mp6YeN572u5oqA6IO9IG1zZ0lkPTEwNTEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNyovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXNldFNraWxsKHBldElkOkxvbmcsc2tpbGxJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFJlc2V0U2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlc2V0U2tpbGxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgaWYoc2tpbGxJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZExpc3QgPSBza2lsbElkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlc2V0U2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVTRVRfU0tJTEwsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcVBldFNraWxsVXAocGV0SWQ6TG9uZyxza2lsbElkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFNraWxsVXA6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFNraWxsVXBcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZCA9IHNraWxsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRTa2lsbFVwLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NLSUxMX1VQLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gLyoq6K+35rGC5a6g54mp5pS+55SfIG1zZ0lkPTEwNTExOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RnJlZShwZXRJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVzUGV0RnJlZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzUGV0RnJlZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlc1BldEZyZWUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRlJFRSxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsQXdhcmQobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsQXdhcmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxBd2FyZFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbEF3YXJkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9BV0FSRCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsRGVsZXRlKG1haWxJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTWFpbERlbGV0ZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbERlbGV0ZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbERlbGV0ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfREVMRVRFLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguaJk+W8gOmCruS7tuiuvue9ruW3suivuyBtc2dJZD0xMTExMDEg5peg6L+U5Zue5raI5oGvIOWuouaIt+err+aJk+W8gOaXoOWlluWKsemCruS7tu+8jOiHquihjOiuvue9ruW3suivu+eKtuaAgSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxT3Blbk1haWwobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFPcGVuTWFpbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxT3Blbk1haWxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU9wZW5NYWlsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfT1BFTl9NQUlMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxBd2FyZChtYWlsSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1haWxBd2FyZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbEF3YXJkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsQXdhcmQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0FXQVJELGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxEZWxldGUobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsRGVsZXRlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsRGVsZXRlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsRGVsZXRlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9ERUxFVEUsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aOqOiNkCBtc2dJZD0xMTIxMDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDEgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZFB1c2goKTp2b2lkXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfUFVTSCk7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRTZWFyY2godG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kU2VhcmNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRTZWFyY2hcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kU2VhcmNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX1NFQVJDSCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kQXBwbHkodG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kQXBwbHk6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEFwcGx5XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEFwcGx5LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0FQUExZLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmk43kvZwgbXNnSWQ9MTEyMTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRPcGVyYXRpb24odHlwZTpudW1iZXIsdG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kT3BlcmF0aW9uOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRPcGVyYXRpb25cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kT3BlcmF0aW9uLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX09QRVJBVElPTixidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L6K+m57uG5L+h5oGvIG1zZ0lkPTExMjEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kTW9yZUluZm8odG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kTW9yZUluZm86YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZE1vcmVJbmZvXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kTW9yZUluZm8uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfTU9SRV9JTkZPLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRHaWZ0KGdpZnRJZDpudW1iZXIsdG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kR2lmdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kR2lmdFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcbi8vICAgICAgICAgbWVzc2FnZS5naWZ0SWQgPSBnaWZ0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRHaWZ0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0dJRlQsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aJgOacieS/oeaBryBtc2dJZD0xMTIxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDcgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEFsbEluZm8oKTp2b2lkXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfQWxsX0luZm8pOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kRmlnaHQodG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kRmlnaHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEZpZ2h0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kRmlnaHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfRklHSFQsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG5cblxuXG5cblxuXG5cbiAgICAvKirnmbvlvZXor7fmsYIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGxvZ2luUmVxKGFjY291bnQ6c3RyaW5nKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgTG9naW5SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJMb2dpblJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLm5hbWUgPSBhY2NvdW50O1xuICAgIC8vICAgICBtZXNzYWdlLnRva2VuID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpblRva2VuO1xuICAgIC8vICAgICBtZXNzYWdlLm5pY2tuYW1lID0gXCJ4aWVsb25nXCI7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBMb2dpblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlVTRVJfTE9HSU4sUHJvdG9jb2wuVVNFUl9MT0dJTl9DTUQsYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6I635Y+W6Iux6ZuE5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnZXRIZXJvSW5mb1JlcShzdGF0dXNDb2RlOm51bWJlcik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEhlcm9JbmZvUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiSGVyb0luZm9SZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEhlcm9JbmZvUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX0dFVF9JTkZPUyxidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKiroi7Hpm4TkuIrjgIHkuIvjgIHmm7TmlrDpmLXlnosgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGhlcm9MaW51ZXBVcGRhdGVSZXEobGluZXVwSWQ6bnVtYmVyLGhlcm9JZDpzdHJpbmcsaXNVcDpib29sZWFuKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICBpZighaXNVcCAmJiBHYW1lRGF0YU1hbmFnZXIuaW5zLnNlbGZQbGF5ZXJEYXRhLmhlcm9MaW5ldXBEaWMudmFsdWVzLmxlbmd0aCA8PSAxKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICBUaXBzTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi6Zi15LiK6Iux6ZuE5LiN5b6X5bCR5LqO5LiA5LiqXCIsMzAsXCIjZmYwMDAwXCIsTGF5ZXJNYW5hZ2VyLmlucy5nZXRMYXllcihMYXllck1hbmFnZXIuVElQX0xBWUVSKSxHYW1lQ29uZmlnLlNUQUdFX1dJRFRILzIsR2FtZUNvbmZpZy5TVEFHRV9IRUlHSFQvMiwxLDAsMjAwKTtcbiAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICB2YXIgVXBkYXRlRm9ybWF0aW9uUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiVXBkYXRlRm9ybWF0aW9uUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc2l0ZUlkeCA9IGxpbmV1cElkO1xuICAgIC8vICAgICBtZXNzYWdlLmhlcm9JZCA9IGhlcm9JZDtcbiAgICAvLyAgICAgbWVzc2FnZS5mbGFnID0gaXNVcDtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFVwZGF0ZUZvcm1hdGlvblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkhFUk8sUHJvdG9jb2wuSEVST19VUERBVEVfRk9STUFUSU9OLGJ1ZmZlcik7XG4gICAgLy8gfVxuICAgIC8vIC8qKuivt+axguWFs+WNoeS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZUdhdGVJbmZvUmVxKCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEdhdGVJbmZvUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJHYXRlSW5mb1JlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSAxO1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gR2F0ZUluZm9SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSU5GTyxidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKirmjJHmiJjlhbPljaEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGJhbGx0ZUdhdGVSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBCYXR0bGVHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJCYXR0bGVHYXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBCYXR0bGVHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0JBVFRMRSxidWZmZXIpO1xuICAgIC8vIH1cblxuICAgIC8vIC8qKuivt+axguaJq+iNoeWFs+WNoSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgc2NhbkdhdGVSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBTY2FuR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiU2NhbkdhdGVSZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFNjYW5HYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX1NDQU4sYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5oyC5py65aWW5Yqx5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlSGFuZ3VwU3RhdGVSZXEoKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgSGFuZ3VwU3RhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkhhbmd1cFN0YXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IDE7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBIYW5ndXBTdGF0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUsYnVmZmVyKTtcbiAgICAvLyAgICAgLy8gV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5oyC5py65L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlU3dpdGNoSGFuZ1JlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIFN3aXRjaEhhbmdHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJTd2l0Y2hIYW5nR2F0ZVJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfU1dJVENIX0hBTkdfR0FURSxidWZmZXIpO1xuICAgIC8vICAgICAvLyBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUpO1xuICAgIC8vIH1cbiAgICBcblxuXG4gICAgLy8gLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipIdHRwICovXG4gICAgLy8gLyoq5rWL6K+V55m75b2VICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBodHRwTG9naW5SZXEoYWNjb3VudDpzdHJpbmcscHdkOnN0cmluZyxjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBwYXJhbXM6YW55ID0ge307XG4gICAgLy8gICAgIHBhcmFtcy5hY2NvdW50ID0gYWNjb3VudDtcbiAgICAvLyAgICAgcGFyYW1zLnBhc3N3b3JkID0gcHdkO1xuICAgIC8vICAgICBIdHRwTWFuYWdlci5pbnMuc2VuZChIVFRQUmVxdWVzdFVybC50ZXN0TG9naW5VUkwsSFRUUFJlcVR5cGUuR0VULHBhcmFtcyxjYWxsZXIsY2FsbEJhY2spO1xuICAgIC8vIH1cbiAgICAvLyAvKirojrflj5bmnI3liqHlmajliJfooaggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBHYW1lU2VydmVyUmVxKGNhbGxlcj86YW55LGNhbGxCYWNrPzpGdW5jdGlvbik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZ2FtZVNlcnZlclVSTCxIVFRQUmVxVHlwZS5HRVQsbnVsbCxjYWxsZXIsY2FsbEJhY2spO1xuICAgIC8vIH1cbiAgICAvLyAvKirov5vlhaXmuLjmiI8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBFbnRlckdhbWVSZXEoc2lkOm51bWJlcixjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBwYXJhbXM6YW55ID0ge307XG4gICAgLy8gICAgIHBhcmFtcy5zaWQgPSBzaWQ7XG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLmVudGVyR2FtZVVSTCxIVFRQUmVxVHlwZS5HRVQscGFyYW1zLGNhbGxlcixjYWxsQmFjayk7XG4gICAgLy8gfVxufSIsIi8qXG4qIOWMheino+aekFxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VJbiBleHRlbmRzIExheWEuQnl0ZXtcbiAgICBcbiAgICAvLyBwdWJsaWMgbW9kdWxlOm51bWJlcjtcbiAgICBwdWJsaWMgY21kOm51bWJlcjtcbiAgICBwdWJsaWMgYm9keTtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvLyBwdWJsaWMgcmVhZChtc2c6T2JqZWN0ID0gbnVsbCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgIC8vICAgICB0aGlzLmNsZWFyKCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XG4gICAgLy8gICAgIC8v5qCH6K6w5ZKM6ZW/5bqmXG4gICAgLy8gICAgIHZhciBtYXJrID0gdGhpcy5nZXRJbnQxNigpO1xuICAgIC8vICAgICB2YXIgbGVuID0gdGhpcy5nZXRJbnQzMigpO1xuICAgIC8vICAgICAvL+WMheWktFxuICAgIC8vICAgICB0aGlzLm1vZHVsZSA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIHZhciB0eXBlID0gdGhpcy5nZXRCeXRlKCk7XG4gICAgLy8gICAgIHZhciBmb3JtYXQgPSB0aGlzLmdldEJ5dGUoKTtcbiAgICAvLyAgICAgLy/mlbDmja5cbiAgICAvLyAgICAgdmFyIHRlbXBCeXRlID0gdGhpcy5idWZmZXIuc2xpY2UodGhpcy5wb3MpO1xuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XG5cbiAgICAvLyB9XG4gICAgXG4gICAgLy/mlrDpgJrkv6FcbiAgICAvLyBwdWJsaWMgcmVhZChtc2c6T2JqZWN0ID0gbnVsbCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgIC8vICAgICB0aGlzLmNsZWFyKCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XG5cbiAgICAvLyAgICAgdmFyIGxlbiA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIC8v5pWw5o2uXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcbiAgICAvLyAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xuXG4gICAgLy8gfVxuICAgIC8v5paw6YCa5L+hIOeymOWMheWkhOeQhlxuICAgIHB1YmxpYyByZWFkKGJ1ZmZEYXRhKTp2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGJ1ZmZEYXRhKTtcbiAgICAgICAgdGhpcy5wb3MgPSAwO1xuXG4gICAgICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5nZXRJbnQzMigpO1xuICAgICAgICAvL+aVsOaNrlxuICAgICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBVaW50OEFycmF5KHRlbXBCeXRlKTtcblxuICAgIH1cbiAgICBcbn1cbiIsImltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuL1dlYlNvY2tldE1hbmFnZXJcIjtcblxuLypcbiog5omT5YyFXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZU91dCBleHRlbmRzIExheWEuQnl0ZXtcbiAgICAvLyBwcml2YXRlIFBBQ0tFVF9NQVJLID0gMHgwO1xuICAgIC8vIHByaXZhdGUgbW9kdWxlID0gMDtcbiAgICAvLyBwcml2YXRlIHR5cGUgPSAwO1xuICAgIC8vIHByaXZhdGUgZm9ybWFydCA9IDA7XG4gICAgcHJpdmF0ZSBjbWQ7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgLy8gcHVibGljIHBhY2sobW9kdWxlLGNtZCxkYXRhPzphbnkpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcbiAgICAvLyAgICAgdGhpcy5tb2R1bGUgPSBtb2R1bGU7XG4gICAgLy8gICAgIHRoaXMuY21kID0gY21kO1xuICAgIC8vICAgICB0aGlzLndyaXRlSW50MTYodGhpcy5QQUNLRVRfTUFSSyk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMihkYXRhLmJ5dGVMZW5ndGggKyAxMCk7XG4gICAgLy8gICAgIC8v5YyF5aS0XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLm1vZHVsZSk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMudHlwZSk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMuZm9ybWFydCk7XG4gICAgLy8gICAgIC8v5raI5oGv5L2TXG4gICAgLy8gICAgIGlmKGRhdGEpXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIC8qKuaWsOmAmuS/oSAqL1xuICAgIHB1YmxpYyBwYWNrKGNtZCxkYXRhPzphbnkpOnZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcblxuICAgICAgICB0aGlzLmNtZCA9IGNtZDtcbiAgICAgICAgdmFyIGxlbiA9IChkYXRhID8gZGF0YS5ieXRlTGVuZ3RoIDogMCkgKyAxMjtcbiAgICAgICAgdmFyIGNvZGU6bnVtYmVyID0gV2ViU29ja2V0TWFuYWdlci5jb2RlQ291bnRebGVuXjUxMjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMihsZW4pO1xuICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICB0aGlzLndyaXRlSW50MzIoY29kZSk7XG4gICAgICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XG4gICAgICAgIGlmKGRhdGEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50KysgO1xuICAgIH1cblxufSIsIi8qXG4qIOaVsOaNruWkhOeQhkhhbmxkZXJcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRIYW5kbGVye1xuICAgIC8vIHB1YmxpYyBzdGF0dXNDb2RlOm51bWJlciA9IDA7XG4gICAgcHVibGljIGNhbGxlcjphbnk7XG4gICAgcHJpdmF0ZSBjYWxsQmFjazpGdW5jdGlvbjtcbiAgICBjb25zdHJ1Y3RvcihjYWxsZXI/OmFueSxjYWxsYmFjaz86RnVuY3Rpb24pe1xuICAgICAgICB0aGlzLmNhbGxlciA9IGNhbGxlcjtcbiAgICAgICAgdGhpcy5jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHBsYWluKGRhdGE/OmFueSk6dm9pZFxuICAgIHtcbiAgICAgICAgLy8gdmFyIHN0YXR1c0NvZGUgPSBkYXRhLnN0YXR1c0NvZGU7XG4gICAgICAgIC8vIGlmKHN0YXR1c0NvZGUgPT0gMClcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgdGhpcy5zdWNjZXNzKGRhdGEpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGVsc2VcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCLmnI3liqHlmajov5Tlm57vvJpcIixkYXRhLnN0YXR1c0NvZGUpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuc3VjY2VzcyhkYXRhKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MoZGF0YT86YW55KTp2b2lkXG4gICAge1xuICAgICAgICBpZih0aGlzLmNhbGxlciAmJiB0aGlzLmNhbGxCYWNrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihkYXRhKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsbEJhY2suY2FsbCh0aGlzLmNhbGxlcixkYXRhKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxCYWNrLmNhbGwodGhpcy5jYWxsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBEaWN0aW9uYXJ5IGZyb20gXCIuLi8uLi9Ub29sL0RpY3Rpb25hcnlcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4uL0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IFBhY2thZ2VJbiBmcm9tIFwiLi9QYWNrYWdlSW5cIjtcbmltcG9ydCBQYWNrYWdlT3V0IGZyb20gXCIuL1BhY2thZ2VPdXRcIjtcbmltcG9ydCBTb2NrZXRIYW5kbGVyIGZyb20gXCIuL1NvY2tldEhhbmRsZXJcIjtcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4vQ2xpZW50U2VuZGVyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XG5cbi8qKlxuICogc29ja2V05Lit5b+DXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlNvY2tldE1hbmFnZXIge1xuICAgLyoq6YCa5L+hY29kZeasoeaVsCAqL1xuICAgcHVibGljIHN0YXRpYyBjb2RlQ291bnQ6bnVtYmVyID0gMDtcbiAgIHByaXZhdGUgaXA6c3RyaW5nO1xuICAgcHJpdmF0ZSBwb3J0Om51bWJlcjtcbiAgIHByaXZhdGUgd2ViU29ja2V0OkxheWEuU29ja2V0O1xuICAgcHJpdmF0ZSBzb2NrZXRIYW5sZGVyRGljOkRpY3Rpb25hcnk7XG4gICBwcml2YXRlIHByb3RvUm9vdDphbnk7XG4gICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICB9XG4gICBwcml2YXRlIHN0YXRpYyBfaW5zOldlYlNvY2tldE1hbmFnZXIgPSBudWxsO1xuICAgcHVibGljIHN0YXRpYyBnZXQgaW5zKCk6V2ViU29ja2V0TWFuYWdlcntcbiAgICAgICBpZih0aGlzLl9pbnMgPT0gbnVsbClcbiAgICAgICB7ICBcbiAgICAgICAgICAgdGhpcy5faW5zID0gbmV3IFdlYlNvY2tldE1hbmFnZXIoKTtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHRoaXMuX2lucztcbiAgIH1cblxuICAgcHVibGljIGNvbm5lY3QoaXA6c3RyaW5nLHBvcnQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdGhpcy5pcCA9IGlwO1xuICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XG5cbiAgICAgICB0aGlzLndlYlNvY2tldCA9IG5ldyBMYXlhLlNvY2tldCgpO1xuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuT1BFTix0aGlzLHRoaXMud2ViU29ja2V0T3Blbik7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5NRVNTQUdFLHRoaXMsdGhpcy53ZWJTb2NrZXRNZXNzYWdlKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5FUlJPUix0aGlzLHRoaXMud2ViU29ja2V0RXJyb3IpO1xuICAgICAgIC8v5Yqg6L295Y2P6K6uXG4gICAgICAgaWYoIXRoaXMucHJvdG9Sb290KXtcbiAgICAgICAgICAgdmFyIHByb3RvQnVmVXJscyA9IFtcIm91dHNpZGUvcHJvdG8vVXNlclByb3RvLnByb3RvXCIsXCJvdXRzaWRlL3Byb3RvL01hdGNoUHJvdG8ucHJvdG9cIl07XG4gICAgICAgICAgIExheWEuQnJvd3Nlci53aW5kb3cucHJvdG9idWYubG9hZChwcm90b0J1ZlVybHMsdGhpcy5wcm90b0xvYWRDb21wbGV0ZSk7XG4gICAgICAgICAgICBcbiAgICAgICB9XG4gICAgICAgZWxzZVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIit0aGlzLmlwK1wiOlwiK3RoaXMucG9ydCk7XG4gICAgICAgfVxuICAgfVxuICAgLyoq5YWz6Zetd2Vic29ja2V0ICovXG4gICBwdWJsaWMgY2xvc2VTb2NrZXQoKTp2b2lkXG4gICB7XG4gICAgICAgaWYodGhpcy53ZWJTb2NrZXQpXG4gICAgICAge1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5PUEVOLHRoaXMsdGhpcy53ZWJTb2NrZXRPcGVuKTtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuTUVTU0FHRSx0aGlzLHRoaXMud2ViU29ja2V0TWVzc2FnZSk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkVSUk9SLHRoaXMsdGhpcy53ZWJTb2NrZXRFcnJvcik7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0ID0gbnVsbDtcbiAgICAgICB9XG4gICB9XG4gIFxuICAgcHJpdmF0ZSBwcm90b0xvYWRDb21wbGV0ZShlcnJvcixyb290KTp2b2lkXG4gICB7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMucHJvdG9Sb290ID0gcm9vdDtcbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5pcCtcIjpcIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5wb3J0KTtcbiAgIH1cbiAgIHByaXZhdGUgd2ViU29ja2V0T3BlbigpOnZvaWRcbiAgIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBvcGVuLi4uXCIpO1xuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhID0gbmV3IExheWEuQnl0ZSgpO1xuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFuO1xuICAgICAgIHRoaXMudGVtcEJ5dGUgPSBuZXcgTGF5YS5CeXRlKCk7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcblxuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50ID0gMTtcbiAgICAgICAgLy8gICAgRXZlbnRNYW5hZ2VyLmlucy5kaXNwYXRjaEV2ZW50KEV2ZW50TWFuYWdlci5TRVJWRVJfQ09OTkVDVEVEKTvmmoLml7bkuI3pnIDopoHojrflj5bmnI3liqHlmajliJfooahcbiAgIH1cbiAgIC8v57yT5Yay5a2X6IqC5pWw57uEXG4gICBwcml2YXRlIGJ5dGVCdWZmRGF0YTpMYXlhLkJ5dGU7XG4gICAvL+mVv+W6puWtl+iKguaVsOe7hFxuICAgcHJpdmF0ZSB0ZW1wQnl0ZTpMYXlhLkJ5dGU7XG4gIFxuICAgcHJpdmF0ZSBwYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pOnZvaWRcbiAgIHtcbiAgICAgICAvL+WujOaVtOWMhVxuICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcbiAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAscGFja0xlbik7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xuICAgICAgIC8v5pat5YyF5aSE55CGXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEgPSBuZXcgTGF5YS5CeXRlKHRoaXMuYnl0ZUJ1ZmZEYXRhLmdldFVpbnQ4QXJyYXkocGFja0xlbix0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpKTtcbiAgICAgICAvLyB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlcixwYWNrTGVuLHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW47XG5cbiAgICAgICAvL+ino+aekOWMhVxuICAgICAgIHZhciBwYWNrYWdlSW46UGFja2FnZUluID0gbmV3IFBhY2thZ2VJbigpO1xuICAgICAgIC8vIHZhciBidWZmID0gdGhpcy50ZW1wQnl0ZS5idWZmZXIuc2xpY2UoMCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XG4gICAgICAgcGFja2FnZUluLnJlYWQodGhpcy50ZW1wQnl0ZS5idWZmZXIpO1xuXG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgbXNnLi4uXCIscGFja2FnZUluLmNtZCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XG4gICAgICAgaWYocGFja2FnZUluLmNtZCA9PSAxMDUyMDIpXG4gICAgICAge1xuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcbiAgICAgICB9XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBwYWNrYWdlSW4uY21kO1xuICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcbiAgICAgICBpZihoYW5kbGVycyAmJiBoYW5kbGVycy5sZW5ndGggPiAwKVxuICAgICAgIHtcbiAgICAgICAgICAgZm9yKHZhciBpID0gaGFuZGxlcnMubGVuZ3RoIC0gMTtpID49IDA7aS0tKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBoYW5kbGVyc1tpXS5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICAvLyBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xuICAgICAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcblxuICAgICAgICAgICAvLyB9KTtcbiAgICAgICB9XG4gICAgICAgXG4gICAgICAgLy/pgJLlvZLmo4DmtYvmmK/lkKbmnInlrozmlbTljIVcbiAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPiA0KVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAsNCk7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcbiAgICAgICAgICAgcGFja0xlbiA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgXG4gICB9XG4gICAvKirop6PmnpDnqbrljIUgKi9cbiAgIHByaXZhdGUgcGFyc2VOdWxsUGFja2FnZShjbWQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKGhhbmRsZXJzKVxuICAgICAgIHtcbiAgICAgICAgICAgaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcbiAgICAgICAgICAgICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbigpO1xuICAgICAgICAgICB9KTtcbiAgICAgICB9XG4gICB9XG4gICBcbiAgIHByaXZhdGUgd2ViU29ja2V0TWVzc2FnZShkYXRhKTp2b2lkXG4gICB7XG4gICAgICAgdGhpcy50ZW1wQnl0ZSA9IG5ldyBMYXlhLkJ5dGUoZGF0YSk7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIi4uLi4udGVzdHdlYlwiLHRoaXMudGVtcEJ5dGUucG9zKTtcbiAgICAgICBcbiAgICAgICBpZih0aGlzLnRlbXBCeXRlLmxlbmd0aCA+IDQpXG4gICAgICAge1xuICAgICAgICAgICBpZih0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgPT0gNCkvL+epuuWMhVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB2YXIgY21kOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKTtcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VOdWxsUGFja2FnZShjbWQpO1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLnqbrljIUuLi4uLi4uLi4uLi4uLi4uXCIrY21kKTtcbiAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKGRhdGEsMCxkYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5a2X6IqC5oC76ZW/5bqmLi4uLi4uLi4uLi4uLi4uLlwiK3RoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XG4gICAgICAgXG4gICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID4gNClcbiAgICAgICB7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLDQpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XG4gICAgICAgICAgIHZhciBwYWNrTGVuOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICBcblxuXG5cbiAgICAgICAvLyB2YXIgcGFja2FnZUluOlBhY2thZ2VJbiA9IG5ldyBQYWNrYWdlSW4oKTtcbiAgICAgICAvLyBwYWNrYWdlSW4ucmVhZChkYXRhKTtcblxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG1zZy4uLlwiLHBhY2thZ2VJbi5jbWQpO1xuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gXCJcIisgcGFja2FnZUluLmNtZDtcbiAgICAgICAvLyB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XG4gICAgICAgLy8gaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcbiAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcbiAgICAgICAvLyB9KTtcbiAgICAgICBcbiAgIH1cbiAgIHByaXZhdGUgd2ViU29ja2V0Q2xvc2UoKTp2b2lkXG4gICB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IGNsb3NlLi4uXCIpO1xuICAgfVxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRFcnJvcigpOnZvaWRcbiAgIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgZXJyb3IuLi5cIik7XG4gICB9XG4gICAvKipcbiAgICAqIOWPkemAgea2iOaBr1xuICAgICogQHBhcmFtIGNtZCBcbiAgICAqIEBwYXJhbSBkYXRhIFxuICAgICovXG4gICBwdWJsaWMgc2VuZE1zZyhjbWQ6bnVtYmVyLGRhdGE/OmFueSk6dm9pZFxuICAge1xuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IHJlcS4uLlwiK2NtZCk7XG4gICAgICAgdmFyIHBhY2thZ2VPdXQ6UGFja2FnZU91dCA9IG5ldyBQYWNrYWdlT3V0KCk7XG4gICAgICAgLy8gcGFja2FnZU91dC5wYWNrKG1vZHVsZSxjbWQsZGF0YSk7XG4gICAgICAgcGFja2FnZU91dC5wYWNrKGNtZCxkYXRhKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5zZW5kKHBhY2thZ2VPdXQuYnVmZmVyKTtcbiAgIH1cbiAgIC8qKlxuICAgICog5a6a5LmJcHJvdG9idWbnsbtcbiAgICAqIEBwYXJhbSBwcm90b1R5cGUg5Y2P6K6u5qih5Z2X57G75Z6LXG4gICAgKiBAcGFyYW0gY2xhc3NTdHIg57G7XG4gICAgKi9cbiAgIHB1YmxpYyBkZWZpbmVQcm90b0NsYXNzKGNsYXNzU3RyOnN0cmluZyk6YW55XG4gICB7XG4gICAgICAgcmV0dXJuIHRoaXMucHJvdG9Sb290Lmxvb2t1cChjbGFzc1N0cik7XG4gICB9XG5cbiAgIC8qKuazqOWGjCAqL1xuICAgcHVibGljIHJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGhhbmRsZXI6U29ja2V0SGFuZGxlcik6dm9pZFxuICAge1xuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gcHJvdG9jb2wrXCJfXCIrY21kO1xuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIitjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKCFoYW5kbGVycylcbiAgICAgICB7XG4gICAgICAgICAgIGhhbmRsZXJzID0gW107XG4gICAgICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5zZXQoa2V5LGhhbmRsZXJzKTtcbiAgICAgICB9XG4gICAgICAgZWxzZVxuICAgICAgIHtcbiAgICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICB9XG4gICB9XG4gICAvKirliKDpmaQgKi9cbiAgIHB1YmxpYyB1bnJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGNhbGxlcjphbnkpOnZvaWRcbiAgIHtcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIgKyBjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKGhhbmRsZXJzKVxuICAgICAgIHtcbiAgICAgICAgICAgdmFyIGhhbmRsZXI7XG4gICAgICAgICAgIGZvcih2YXIgaSA9IGhhbmRsZXJzLmxlbmd0aCAtIDE7aSA+PSAwIDtpLS0pXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tpXTtcbiAgICAgICAgICAgICAgIGlmKGhhbmRsZXIuY2FsbGVyID09PSBjYWxsZXIpXG4gICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgaGFuZGxlcnMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYoaGFuZGxlcnMubGVuZ3RoID09IDApXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5yZW1vdmUoa2V5KTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgIH1cbiAgIC8qKua3u+WKoOacjeWKoeWZqOW/g+i3syAqL1xuICAgcHVibGljIGFkZEhlcnRSZXEoKTp2b2lkXG4gICB7XG4gICAgLy8gICAgdGhpcy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsbmV3IFNlcnZlckhlYXJ0SGFuZGxlcih0aGlzKSk7XG4gICAgLy8gICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xuICAgIC8vICAgIExheWEudGltZXIubG9vcCgxMDAwMCx0aGlzLGZ1bmN0aW9uKCk6dm9pZHtcbiAgICAvLyAgICAgICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xuICAgIC8vICAgIH0pO1xuICAgfVxuICAgcHVibGljIHJlbW92ZUhlYXJ0UmVxKCk6dm9pZFxuICAge1xuICAgIC8vICAgIHRoaXMudW5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsdGhpcyk7XG4gICAgLy8gICAgTGF5YS50aW1lci5jbGVhckFsbCh0aGlzKTtcbiAgIH1cbn0iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cclxuaW1wb3J0IEdhbWVDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvR2FtZS9HYW1lQ29udHJvbGxlclwiXG5pbXBvcnQgR2FtZUxvYmJ5Q29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL0dhbWVMb2JieS9HYW1lTG9iYnlDb250cm9sbGVyXCJcbmltcG9ydCBMb2FkaW5nQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL0xvYWRpbmcvTG9hZGluZ0NvbnRyb2xsZXJcIlxuaW1wb3J0IFdlbENvbWVDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj0xNDQwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9NzUwO1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZGhlaWdodFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJ0b3BcIjtcclxuICAgIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwiV2VsY29tZS9Mb2dpbi5zY2VuZVwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgdmFyIHJlZzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XHJcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzXCIsR2FtZUNvbnRyb2xsZXIpO1xuICAgICAgICByZWcoXCJDb250cm9sbGVyL0dhbWVMb2JieS9HYW1lTG9iYnlDb250cm9sbGVyLnRzXCIsR2FtZUxvYmJ5Q29udHJvbGxlcik7XG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvTG9hZGluZy9Mb2FkaW5nQ29udHJvbGxlci50c1wiLExvYWRpbmdDb250cm9sbGVyKTtcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9XZWxDb21lL1dlbENvbWVDb250cm9sbGVyLnRzXCIsV2VsQ29tZUNvbnRyb2xsZXIpO1xyXG4gICAgfVxyXG59XHJcbkdhbWVDb25maWcuaW5pdCgpOyIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcblxuXG4vKipcbiAqIOa4uOaIj+WFpeWPo1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lRW50ZXJ7XG5cdFx0Ly9cbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICAvKirliJ3lp4vljJYgKi9cbiAgICBwcml2YXRlIGluaXQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMubG9hZCgpO1xuICAgIH1cbiAgICAvKirotYTmupDliqDovb0gKi9cbiAgICBwcml2YXRlIGxvYWQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBhc3NldGVBcnIgPSBbXG4gICAgICAgICAgICB7dXJsOlwidW5wYWNrYWdlL3dlbGNvbWVfYmcucG5nXCJ9LFxuICAgICAgICAgICAge3VybDpcIldlbGNvbWUvbG9naW5ib3gucG5nXCJ9LFxuICAgICAgICAgICAge3VybDpcIldlbGNvbWUvcHJvZ3Jlc3NCZy5wbmdcIn0sXG5cbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvY29tcC5hdGxhc1wifSxcbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvd2VsY29tZS5hdGxhc1wifVxuICAgICAgICBdXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoYXNzZXRlQXJyLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9ubG9hZCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25sb2FkKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBHYW1lQ29uZmlnLnN0YXJ0U2NlbmUgJiYgTGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSk7XG4gICAgfVxufSIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcbmltcG9ydCBHYW1lRW50ZXIgZnJvbSBcIi4vR2FtZUVudGVyXCI7XG5jbGFzcyBNYWluIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XG5cdFx0aWYgKHdpbmRvd1tcIkxheWEzRFwiXSkgTGF5YTNELmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQpO1xuXHRcdGVsc2UgTGF5YS5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0LCBMYXlhW1wiV2ViR0xcIl0pO1xuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xuXHRcdExheWFbXCJEZWJ1Z1BhbmVsXCJdICYmIExheWFbXCJEZWJ1Z1BhbmVsXCJdLmVuYWJsZSgpO1xuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2FtZUNvbmZpZy5zY2FsZU1vZGU7XG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xuXHRcdC8v5YW85a655b6u5L+h5LiN5pSv5oyB5Yqg6L29c2NlbmXlkI7nvIDlnLrmma9cblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XG5cblx0XHQvL+aJk+W8gOiwg+ivlemdouadv++8iOmAmui/h0lEReiuvue9ruiwg+ivleaooeW8j++8jOaIluiAhXVybOWcsOWdgOWinuWKoGRlYnVnPXRydWXlj4LmlbDvvIzlnYflj6/miZPlvIDosIPor5XpnaLmnb/vvIlcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XG5cdFx0aWYgKEdhbWVDb25maWcuc3RhdCkgTGF5YS5TdGF0LnNob3coKTtcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xuXG5cdFx0Ly/mv4DmtLvotYTmupDniYjmnKzmjqfliLbvvIx2ZXJzaW9uLmpzb27nlLFJREXlj5HluIPlip/og73oh6rliqjnlJ/miJDvvIzlpoLmnpzmsqHmnInkuZ/kuI3lvbHlk43lkI7nu63mtYHnqItcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xuXHR9XG5cblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XG5cdFx0TGF5YS5BdGxhc0luZm9NYW5hZ2VyLmVuYWJsZShcImZpbGVjb25maWcuanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25Db25maWdMb2FkZWQpKTtcblx0fVxuXG5cdG9uQ29uZmlnTG9hZGVkKCk6IHZvaWQge1xuXHRcdG5ldyBHYW1lRW50ZXIoKTtcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xuXHR9XG59XG4vL+a/gOa0u+WQr+WKqOexu1xubmV3IE1haW4oKTtcbiIsIi8qKlxuICAgICog6K+N5YW4IGtleS12YWx1ZVxuICAgICpcbiAgICAqICBcbiAgICAqICBrZXlzIDogQXJyYXlcbiAgICAqICBbcmVhZC1vbmx5XSDojrflj5bmiYDmnInnmoTlrZDlhYPntKDplK7lkI3liJfooajjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiBcbiAgICAqICB2YWx1ZXMgOiBBcnJheVxuICAgICogIFtyZWFkLW9ubHldIOiOt+WPluaJgOacieeahOWtkOWFg+e0oOWIl+ihqOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICBQdWJsaWMgTWV0aG9kc1xuICAgICogIFxuICAgICogICAgICAgICAgXG4gICAgKiAgY2xlYXIoKTp2b2lkXG4gICAgKiAg5riF6Zmk5q2k5a+56LGh55qE6ZSu5ZCN5YiX6KGo5ZKM6ZSu5YC85YiX6KGo44CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgXG4gICAgKiAgZ2V0KGtleToqKToqXG4gICAgKiAg6L+U5Zue5oyH5a6a6ZSu5ZCN55qE5YC844CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgIFxuICAgICogIGluZGV4T2Yoa2V5Ok9iamVjdCk6aW50XG4gICAgKiAg6I635Y+W5oyH5a6a5a+56LGh55qE6ZSu5ZCN57Si5byV44CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgXG4gICAgKiAgcmVtb3ZlKGtleToqKTpCb29sZWFuXG4gICAgKiAg56e76Zmk5oyH5a6a6ZSu5ZCN55qE5YC844CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogICAgICAgICAgXG4gICAgKiAgc2V0KGtleToqLCB2YWx1ZToqKTp2b2lkXG4gICAgKiAg57uZ5oyH5a6a55qE6ZSu5ZCN6K6+572u5YC844CCXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpY3Rpb25hcnkge1xuICAgIC8qKumUruWQjSAqL1xuICAgIHByaXZhdGUga2V5cyA6IEFycmF5PGFueT47XG4gICAgLyoq6ZSu5YC8ICovXG4gICAgcHJpdmF0ZSB2YWx1ZXMgOiBBcnJheTxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5rZXlzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBuZXcgQXJyYXk8YW55PigpO1xuICAgIH1cblxuICAgIC8qKuiuvue9riDplK7lkI0gLSDplK7lgLwgKi9cbiAgICBwdWJsaWMgc2V0KGtleTphbnksdmFsdWU6YW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldPT09dW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpXSA9IGtleTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtleXMucHVzaChrZXkpO1xuICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g5o+S5YWla2V5W1wiKyBrZXkgK1wiXVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJ2YWx1ZVwiLHZhbHVlKTtcbiAgICB9XG5cbiAgICAvKirpgJrov4cg6ZSu5ZCNa2V5IOiOt+WPlumUruWAvHZhbHVlICAqL1xuICAgIHB1YmxpYyBnZXQoa2V5OmFueSkgOiBhbnlcbiAgICB7XG4gICAgICAgIC8vIHRoaXMuZ2V0RGljTGlzdCgpOyBcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldID09PSBrZXkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOivjeWFuOS4reayoeaciWtleeeahOWAvFwiKTtcbiAgICB9XG5cbiAgICAvKirojrflj5blr7nosaHnmoTntKLlvJXlgLwgKi9cbiAgICBwdWJsaWMgaW5kZXhPZih2YWx1ZSA6IGFueSkgOiBudW1iZXJcbiAgICB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy52YWx1ZXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy52YWx1ZXNbaV0gPT09IHZhbHVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOivjeWFuOS4reayoeacieivpeWAvFwiKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgXG4gICAgLyoq5riF6ZmkIOivjeWFuOS4reaMh+WumumUruWQjeeahOWJqiAqL1xuICAgIHB1YmxpYyByZW1vdmUoa2V5IDogYW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMua2V5c1tpXSA9PT0ga2V5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpXSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW2ldID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g56e76Zmk5oiQ5YqfXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOenu+mZpOWksei0pVwiKTtcbiAgICB9XG5cbiAgICAvKirmuIXpmaTmiYDmnInnmoTplK4gKi9cbiAgICBwdWJsaWMgY2xlYXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuICAgIH1cblxuICAgIC8qKuiOt+WPluWIl+ihqCAqL1xuICAgIHB1YmxpYyBnZXREaWNMaXN0KCkgOiB2b2lkXG4gICAge1xuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOAkFwiICsgaSArIFwi44CRLS0tLS0tLS0tLS1rZXk6XCIgKyB0aGlzLmtleXNbaV0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YWx1ZVwiLHRoaXMudmFsdWVzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKuiOt+WPlumUruWAvOaVsOe7hCAqL1xuICAgIHB1YmxpYyBnZXRWYWx1ZXNBcnIoKSA6IEFycmF5PGFueT5cbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcztcbiAgICB9XG5cbiAgICAvKirojrflj5bplK7lkI3mlbDnu4QgKi9cbiAgICBwdWJsaWMgZ2V0S2V5c0FycigpIDogQXJyYXk8YW55PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMua2V5cztcbiAgICB9XG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vdWkvbGF5YU1heFVJXCI7XG5pbXBvcnQgTWVzc2FnZU1hbmFnZXIgZnJvbSBcIi4uL0NvcmUvTWVzc2FnZU1hbmFnZXJcIjtcblxuLyoqXG4gKiDkuK3pl7TlrZdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXRNc2cgZXh0ZW5kcyB1aS5EaWFsb2dfLkZsb2F0TXNnVUl7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBcbiAgICBvbkVuYWJsZSgpe1xuICAgICAgICB0aGlzLmFkZEV2ZW50KCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5hbmkxLnN0b3AoKTtcbiAgICAgICAgdGhpcy5zcF9mbG9hdE1zZy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRXZlbnQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25IaWRkZW4pO1xuICAgICAgICB0aGlzLmFuaTEub24oTGF5YS5FdmVudC5DT01QTEVURSx0aGlzLHRoaXMub25IaWRkZW4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOaYvuekuua2iOaBr+mjmOWtl1xuICAgICAqIEBwYXJhbSB0ZXh0IOaYvuekuuaWh+acrCDjgJDmnIDlpJoyOOS4quOAkVxuICAgICAqIEBwYXJhbSBwb3MgIOS9jee9rnt4OjEwMCx5OjEwMH1cbiAgICAgKi9cbiAgICBwdWJsaWMgc2hvd01zZyh0ZXh0OnN0cmluZyxwb3M6YW55KSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubGFiX2Zsb2F0TXNnLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnggPSBwb3MueDtcbiAgICAgICAgdGhpcy55ID0gcG9zLnk7XG4gICAgICAgIHRoaXMuYW5pMS5wbGF5KDAsZmFsc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25IaWRkZW4oKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuYW5pMS5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsdGhpcyk7XG4gICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5jb3VudEZsb2F0TXNnLS07XG4gICAgfVxufSIsIi8qKlxuICog5bCP5bel5YW3XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2x7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5bGP5bmV5rC05bmz5Lit5b+DIOaoquWdkOagh1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2VudGVyWCgpIDogYW55XG4gICAge1xuICAgICAgICByZXR1cm4gNzUwLyhMYXlhLkJyb3dzZXIuY2xpZW50SGVpZ2h0L0xheWEuQnJvd3Nlci5jbGllbnRXaWR0aCkvMjsvL+Wxj+W5leWuveW6plxuICAgIH1cbn1cbiIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xuaW1wb3J0IERpYWxvZz1MYXlhLkRpYWxvZztcbmltcG9ydCBTY2VuZT1MYXlhLlNjZW5lO1xuZXhwb3J0IG1vZHVsZSB1aS5EaWFsb2dfIHtcclxuICAgIGV4cG9ydCBjbGFzcyBGbG9hdE1zZ1VJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGFuaTE6TGF5YS5GcmFtZUFuaW1hdGlvbjtcblx0XHRwdWJsaWMgc3BfZmxvYXRNc2c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGxhYl9mbG9hdE1zZzpMYXlhLkxhYmVsO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiRGlhbG9nXy9GbG9hdE1zZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aS5HYW1lIHtcclxuICAgIGV4cG9ydCBjbGFzcyBHYW1lVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgZ2FtZTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZHM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2QxOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZDM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2Q0OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXYWxsczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgVXBXYWxsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBEb3duV2FsbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgR3JvdXBzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9kb29yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2Rvb3I6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJvYWQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxiZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc2hvdmVsX29mZjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc2hvdmVsX29uOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBidG5fY2hlY2s6TGF5YS5TcHJpdGU7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJHYW1lL0dhbWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuR2FtZUxvYmJ5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBHYW1lTG9iYnlVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBiZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTWVudUl0ZW1QYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYnRuX1BWUDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTW9kZUNob29zZVBhbmVsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyB0ZXh0XzFWMTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgYnRuXzFWMTpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgdGV4dF81VjU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGJ0bl81VjU6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl9iYWNrOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBNYXRjaGluZ1N1Y2Nlc3NQYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBidG5fZW50ZXJnYW1lOkxheWEuQnV0dG9uO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiR2FtZUxvYmJ5L0dhbWVMb2JieVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUGxheWVyTG9hZGluZ1VJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGxvYWRpbmdiZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl8xOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfMjpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzM6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl80OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfNTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfMTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzI6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl8zOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfNDpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3M6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NMOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1Q6TGF5YS5MYWJlbDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIlBsYXllckxvYWRpbmdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuV2VsY29tZSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTG9naW5VSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBhbmkxOkxheWEuRnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIHNwX2xvZ2luQm94OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpbnB1dF91c2VyTmFtZTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgaW5wdXRfdXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgbGFiX3RpdGxlOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIGJ0bl9sb2dpbjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuX3JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NXOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc0w6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVDpMYXlhLkxhYmVsO1xuXHRcdHB1YmxpYyBzcF9nYW1lTmFtZTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgc3BfcmVnaXN0ZXJCb3g6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlck5hbWU6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgYnRuX3RvTG9naW46TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl90b1JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3Rlck5pY2tOYW1lOkxheWEuVGV4dElucHV0O1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiV2VsY29tZS9Mb2dpblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cciJdfQ==
