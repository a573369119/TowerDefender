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
        this.btn_entergame.on(Laya.Event.CLICK, this, this.onEnterGame);
    };
    GameLobbyController.prototype.removeEvents = function () {
        this.btn_PVP.off(Laya.Event.CLICK, this, this.onPVPMode);
    };
    /**点击进入PVP选择界面 */
    GameLobbyController.prototype.onPVPMode = function () {
        this.MenuItemPanel.visible = false;
        this.ModeChoosePanel.visible = true;
    };
    /**点击选择1V1模式 */
    GameLobbyController.prototype.on1V1 = function () {
        this.MatchingSuccessPanel.visible = true;
        this.ModeChoosePanel.visible = false;
    };
    /**点击选择5V5模式 */
    GameLobbyController.prototype.on5V5 = function () {
    };
    /**点击返回游戏大厅 */
    GameLobbyController.prototype.onBack = function () {
        this.MenuItemPanel.visible = true;
        this.ModeChoosePanel.visible = false;
    };
    /**进入游戏 */
    GameLobbyController.prototype.onEnterGame = function () {
        Laya.Scene.open("Game/Game.scene");
    };
    return GameLobbyController;
}(layaMaxUI_1.ui.GameLobby.GameLobbyUI));
exports.default = GameLobbyController;
},{"../../ui/layaMaxUI":18}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var GameController = /** @class */ (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        return _super.call(this) || this;
    }
    GameController.prototype.onEnable = function () {
        Laya.timer.frameLoop(1, this, this.mapMove);
        this.camp = "red";
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
            this.groupGrass = this.blue_Grass;
        }
        else {
            this.game.x = 0;
            this.groupGrass = this.red_Grass;
        }
        this.MenuItem.visible = true;
        this.isUseShovel = false;
        this.saveMudIntoArray();
        this.addEvents();
        this.isCickGrass();
    };
    /**事件绑定 */
    GameController.prototype.addEvents = function () {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN, this, this.onShovelDown);
        for (var i = 0; i < this.grassArray.length; i++) {
            this.grassArray[i].on(Laya.Event.MOUSE_DOWN, this, this.toBeMudOrCancel, [i]);
        }
    };
    /**将己方土地收入数组中 */
    GameController.prototype.saveMudIntoArray = function () {
        this.grassArray = new Array();
        for (var i = 0; i < this.groupGrass._children.length; i++) {
            this.grassArray.push(this.groupGrass._children[i]);
            this.grassIsMudArray[i] = false;
        }
    };
    /**鼠标按下 */
    GameController.prototype.onMouseDown = function () {
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        if (!this.isUseShovel) {
            this.lastMousePosX = Laya.stage.mouseX;
        }
        else {
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
    /**点击铲子框拾起铲子 */
    GameController.prototype.onShovelDown = function () {
        this.isUseShovel = !this.isUseShovel;
        this.shovel_off.visible = !this.shovel_off.visible;
        this.shovel_on.visible = !this.shovel_on.visible;
        this.isCickGrass();
    };
    /**判断草坪块是否可点击 */
    GameController.prototype.isCickGrass = function () {
        for (var i = 0; i < this.grassArray.length; i++) {
            //收起铲子就不能点击草坪块，相反则可
            if (this.isUseShovel) {
                this.grassArray[i].mouseEnabled = true;
            }
            else {
                this.grassArray[i].mouseEnabled = false;
            }
        }
    };
    /**变成土块与取消土块 */
    GameController.prototype.toBeMudOrCancel = function (i) {
        if (this.grassIsMudArray[i]) {
            this.grassArray[i].loadImage("game/mud.png");
        }
    };
    return GameController;
}(layaMaxUI_1.ui.Game.GameUI));
exports.default = GameController;
},{"../../ui/layaMaxUI":18}],3:[function(require,module,exports){
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
            Laya.timer.once(800, this, this.toGameMain);
        }
    };
    /**连接服务器 */
    WelComeController.prototype.connectServer = function () {
        WebSocketManager_1.default.ins.connect(GameConfig_1.GameConfig.IP, GameConfig_1.GameConfig.PORT);
    };
    //////////////////////////////////////////////////////////
    WelComeController.prototype.toGameMain = function () {
        //TO DO 跳转至游戏大厅
    };
    return WelComeController;
}(layaMaxUI_1.ui.Welcome.LoginUI));
exports.default = WelComeController;
},{"../../Core/Const/GameConfig":5,"../../Core/MessageManager":6,"../../Core/Net/ClientSender":7,"../../Core/Net/WebSocketManager":11,"../../Tool/Tool":17,"../../ui/layaMaxUI":18,"./handler/UserLoginHandler":4}],4:[function(require,module,exports){
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
},{"../../../Core/Net/SocketHandler":10,"../../../Core/Net/WebSocketManager":11}],5:[function(require,module,exports){
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
    return Protocol;
}());
exports.Protocol = Protocol;
},{}],6:[function(require,module,exports){
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
},{"../Tool/FloatMsg":16,"../Tool/Tool":17}],7:[function(require,module,exports){
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
    return ClientSender;
}());
exports.default = ClientSender;
},{"../Const/GameConfig":5,"./WebSocketManager":11}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{"./WebSocketManager":11}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
            var protoBufUrls = ["outside/proto/UserProto.proto"];
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
},{"../../Tool/Dictionary":15,"./PackageIn":8,"./PackageOut":9}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var GameController_1 = require("./Controller/Game/GameController");
var GameLobbyController_1 = require("./Controller/GameLobby/GameLobbyController");
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
},{"./Controller/Game/GameController":2,"./Controller/GameLobby/GameLobbyController":1,"./Controller/WelCome/WelComeController":3}],13:[function(require,module,exports){
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
},{"./GameConfig":12}],14:[function(require,module,exports){
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
},{"./GameConfig":12,"./GameEnter":13}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{"../Core/MessageManager":6,"../ui/layaMaxUI":18}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
},{}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIyLjAvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvaGFuZGxlci9Vc2VyTG9naW5IYW5kbGVyLnRzIiwic3JjL0NvcmUvQ29uc3QvR2FtZUNvbmZpZy50cyIsInNyYy9Db3JlL01lc3NhZ2VNYW5hZ2VyLnRzIiwic3JjL0NvcmUvTmV0L0NsaWVudFNlbmRlci50cyIsInNyYy9Db3JlL05ldC9QYWNrYWdlSW4udHMiLCJzcmMvQ29yZS9OZXQvUGFja2FnZU91dC50cyIsInNyYy9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyLnRzIiwic3JjL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXIudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9HYW1lRW50ZXIudHMiLCJzcmMvTWFpbi50cyIsInNyYy9Ub29sL0RpY3Rpb25hcnkudHMiLCJzcmMvVG9vbC9GbG9hdE1zZy50cyIsInNyYy9Ub29sL1Rvb2wudHMiLCJzcmMvdWkvbGF5YU1heFVJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBLGdEQUF3QztBQUN4QztJQUFpRCx1Q0FBd0I7SUFDckU7ZUFDSSxpQkFBTztJQUNYLENBQUM7SUFFRCxRQUFRO0lBQ1Isc0NBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsT0FBTztJQUNQLHVDQUFTLEdBQVQ7UUFDSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7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InNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uLy4uL3VpL2xheWFNYXhVSVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lTG9iYnlDb250cm9sbGVyIGV4dGVuZHMgdWkuR2FtZUxvYmJ5LkdhbWVMb2JieVVJe1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWQr+WKqCAqL1xyXG4gICAgb25FbmFibGUoKXtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKumUgOavgSovXHJcbiAgICBvbkRlc3Ryb3koKXtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuS6i+S7tue7keWumiAqL1xyXG4gICAgcHJpdmF0ZSBhZGRFdmVudHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmJ0bl9QVlAub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25QVlBNb2RlKTtcclxuICAgICAgICB0aGlzLmJ0bl8xVjEub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub24xVjEpO1xyXG4gICAgICAgIHRoaXMuYnRuXzVWNS5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbjVWNSk7XHJcbiAgICAgICAgdGhpcy5idG5fYmFjay5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkJhY2spO1xyXG4gICAgICAgIHRoaXMuYnRuX2VudGVyZ2FtZS5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkVudGVyR2FtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFdmVudHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmJ0bl9QVlAub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uUFZQTW9kZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKueCueWHu+i/m+WFpVBWUOmAieaLqeeVjOmdoiAqL1xyXG4gICAgcHJpdmF0ZSBvblBWUE1vZGUoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1lbnVJdGVtUGFuZWwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9dHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vpgInmi6kxVjHmqKHlvI8gKi9cclxuICAgIHByaXZhdGUgb24xVjEoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1hdGNoaW5nU3VjY2Vzc1BhbmVsLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICB0aGlzLk1vZGVDaG9vc2VQYW5lbC52aXNpYmxlPWZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+mAieaLqTVWNeaooeW8jyAqL1xyXG4gICAgcHJpdmF0ZSBvbjVWNSgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+i/lOWbnua4uOaIj+Wkp+WOhSAqL1xyXG4gICAgcHJpdmF0ZSBvbkJhY2soKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1lbnVJdGVtUGFuZWwudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirov5vlhaXmuLjmiI8gKi9cclxuICAgIHByaXZhdGUgb25FbnRlckdhbWUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZS9HYW1lLnNjZW5lXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb250cm9sbGVyIGV4dGVuZHMgdWkuR2FtZS5HYW1lVUl7XHJcbiAgICAvKirkuIrmrKHpvKDmoIflvpfkvY3nva4gKi9cclxuICAgIHByaXZhdGUgbGFzdE1vdXNlUG9zWDpudW1iZXI7XHJcbiAgICAvKirmmK/lkKbmraPlnKjkvb/nlKjpk7LlrZAgKi9cclxuICAgIHByaXZhdGUgaXNVc2VTaG92ZWw6Ym9vbGVhbjtcclxuICAgIC8qKueOqeWutumYteiQpSAqL1xyXG4gICAgcHVibGljIGNhbXA6c3RyaW5nO1xyXG4gICAgLyoq6I2J5Z2q5pWw57uEICovXHJcbiAgICBwdWJsaWMgZ3Jhc3NBcnJheTpBcnJheTxMYXlhLlNwcml0ZT47XHJcbiAgICAvKirmoIforrDmr4/kuKrojYnlnarmmK/lkKbkuLrlnJ/lnZcgKi9cclxuICAgIHB1YmxpYyBncmFzc0lzTXVkQXJyYXk6QXJyYXk8Ym9vbGVhbj47XHJcbiAgICAvKirpmLXokKXojYnlnarlnLDnm5ggKi9cclxuICAgIHB1YmxpYyBncm91cEdyYXNzOkxheWEuU3ByaXRlO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5tYXBNb3ZlKVxyXG4gICAgICAgIHRoaXMuY2FtcD1cInJlZFwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWcsOWbvuenu+WKqCAqL1xyXG4gICAgcHJpdmF0ZSBtYXBNb3ZlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgdGhpcy5nYW1lLngtPTQ7XHJcbiAgICAgICBpZih0aGlzLmdhbWUueDw9LTEyMTQpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5nYW1lLng9LTEyMTQ7XHJcbiAgICAgICAgICAgTGF5YS50aW1lci5jbGVhcih0aGlzLHRoaXMubWFwTW92ZSk7XHJcbiAgICAgICAgICAgTGF5YS50aW1lci5mcmFtZU9uY2UoNjAsdGhpcyx0aGlzLnJlc3VtZVBvcyk7XHJcbiAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKuWbnuWIsOeOqeWutuS9jee9riAqL1xyXG4gICAgcHJpdmF0ZSByZXN1bWVQb3MoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5jYW1wPT1cImJsdWVcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5nYW1lLng9LTEyMzA7XHJcbiAgICAgICAgICAgdGhpcy5ncm91cEdyYXNzPXRoaXMuYmx1ZV9HcmFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLmdhbWUueD0wO1xyXG4gICAgICAgICAgIHRoaXMuZ3JvdXBHcmFzcz10aGlzLnJlZF9HcmFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbS52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgdGhpcy5pc1VzZVNob3ZlbD1mYWxzZTtcclxuICAgICAgICB0aGlzLnNhdmVNdWRJbnRvQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMuaXNDaWNrR3Jhc3MoKTtcclxuICAgIH0gXHJcbiAgICAgXHJcbiAgICAvKirkuovku7bnu5HlrpogKi9cclxuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyx0aGlzLm9uTW91c2VEb3duKTtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfVVAsdGhpcyx0aGlzLm9uTW91c2VVcCk7XHJcbiAgICAgICAgdGhpcy5zaG92ZWxiZy5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyx0aGlzLm9uU2hvdmVsRG93bik7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmdyYXNzQXJyYXkubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhc3NBcnJheVtpXS5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyx0aGlzLnRvQmVNdWRPckNhbmNlbCxbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICAgLyoq5bCG5bex5pa55Zyf5Zyw5pS25YWl5pWw57uE5LitICovXHJcbiAgICBwcml2YXRlIHNhdmVNdWRJbnRvQXJyYXkoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5ncmFzc0FycmF5PW5ldyBBcnJheTxMYXlhLlNwcml0ZT4oKTtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMuZ3JvdXBHcmFzcy5fY2hpbGRyZW4ubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3Jhc3NBcnJheS5wdXNoKHRoaXMuZ3JvdXBHcmFzcy5fY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXNzSXNNdWRBcnJheVtpXT1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6byg5qCH5oyJ5LiLICovXHJcbiAgICBwcml2YXRlIG9uTW91c2VEb3duKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNVc2VTaG92ZWwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirpvKDmoIfnp7vliqggKi9cclxuICAgIHByaXZhdGUgb25Nb3VzZU1vdmUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy/lpoLmnpzmsqHmnInnlKjpk7LlrZDvvIzliJnlj6/mi4nliqjlnLDlm75cclxuICAgICAgICBpZighdGhpcy5pc1VzZVNob3ZlbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKExheWEuc3RhZ2UubW91c2VYPHRoaXMubGFzdE1vdXNlUG9zWClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLngtPTIwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0TW91c2VQb3NYPUxheWEuc3RhZ2UubW91c2VYO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoTGF5YS5zdGFnZS5tb3VzZVg+dGhpcy5sYXN0TW91c2VQb3NYKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUueCs9MjA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy5nYW1lLng+PTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS54PTA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLmdhbWUueDw9LTEyMTQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS54PS0xMjE0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKirpvKDmoIfmiqzotbcgKi9cclxuICAgIHByaXZhdGUgb25Nb3VzZVVwKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuc3RhZ2Uub2ZmKExheWEuRXZlbnQuTU9VU0VfTU9WRSx0aGlzLHRoaXMub25Nb3VzZU1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+mTsuWtkOahhuaLvui1t+mTsuWtkCAqL1xyXG4gICAgcHJpdmF0ZSBvblNob3ZlbERvd24oKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pc1VzZVNob3ZlbD0hdGhpcy5pc1VzZVNob3ZlbDtcclxuICAgICAgICB0aGlzLnNob3ZlbF9vZmYudmlzaWJsZT0hdGhpcy5zaG92ZWxfb2ZmLnZpc2libGU7XHJcbiAgICAgICAgdGhpcy5zaG92ZWxfb24udmlzaWJsZT0hdGhpcy5zaG92ZWxfb24udmlzaWJsZTtcclxuICAgICAgICB0aGlzLmlzQ2lja0dyYXNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yik5pat6I2J5Z2q5Z2X5piv5ZCm5Y+v54K55Ye7ICovXHJcbiAgICBwcml2YXRlIGlzQ2lja0dyYXNzKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5ncmFzc0FycmF5Lmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+aUtui1t+mTsuWtkOWwseS4jeiDveeCueWHu+iNieWdquWdl++8jOebuOWPjeWImeWPr1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzVXNlU2hvdmVsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXNzQXJyYXlbaV0ubW91c2VFbmFibGVkPXRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdyYXNzQXJyYXlbaV0ubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuWPmOaIkOWcn+Wdl+S4juWPlua2iOWcn+WdlyAqL1xyXG4gICAgcHJpdmF0ZSB0b0JlTXVkT3JDYW5jZWwoaSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuZ3Jhc3NJc011ZEFycmF5W2ldKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFzc0FycmF5W2ldLmxvYWRJbWFnZShcImdhbWUvbXVkLnBuZ1wiKTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uLy4uL3VpL2xheWFNYXhVSVwiO1xuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcbmltcG9ydCB7IFByb3RvY29sLCBHYW1lQ29uZmlnIH0gZnJvbSBcIi4uLy4uL0NvcmUvQ29uc3QvR2FtZUNvbmZpZ1wiO1xuaW1wb3J0IFVzZXJMb2dpbkhhbmRsZXIgZnJvbSBcIi4vaGFuZGxlci9Vc2VyTG9naW5IYW5kbGVyXCI7XG5pbXBvcnQgQ2xpZW50U2VuZGVyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9DbGllbnRTZW5kZXJcIjtcbmltcG9ydCBUb29sIGZyb20gXCIuLi8uLi9Ub29sL1Rvb2xcIjtcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWxDb21lQ29udHJvbGxlciBleHRlbmRzIHVpLldlbGNvbWUuTG9naW5VSXtcbiAgICAvKirmmK/lkKbov57mjqXkuIrmnI3liqHlmaggKi9cbiAgICBwcml2YXRlIGlzQ29ubmVjdFNlcnZlciA6IGJvb2xlYW47XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vL+eUn+WRveWRqOacn1xuICAgIC8qKuWQr+WKqCAqL1xuICAgIG9uRW5hYmxlKCl7XG4gICAgICAgIHRoaXMuZGF0YUluaXQoKTtcbiAgICAgICAgdGhpcy5zZXRDZW50ZXIoKTtcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdFNlcnZlcigpOy8v6L+e5o6l5pyN5Yqh5ZmoXG4gICAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgLyoq6ZSA5q+BKi9cbiAgICBvbkRlc3Ryb3koKXtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcbiAgICB9XG5cblxuICAgIC8vLy8vLy8vLy8vL+mAu+i+kVxuICAgIC8qKuaVsOaNruWIneWni+WMliAqL1xuICAgIHByaXZhdGUgZGF0YUluaXQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0U2VydmVyID0gZmFsc2U7IFxuICAgIH1cbiAgICAvKirkuovku7bnu5HlrpogKi9cbiAgICBwcml2YXRlIGFkZEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5idG5fbG9naW4ub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Mb2dpbik7XG4gICAgICAgIHRoaXMuYnRuX3JlZ2lzdGVyLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uUmVnaXN0ZXIpO1xuICAgICAgICB0aGlzLmJ0bl90b0xvZ2luLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uVG9Mb2dpbik7XG4gICAgICAgIHRoaXMuYnRuX3RvUmVnaXN0ZXIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Ub1JlZ2lzdGVyKVxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX1VTRVJfTE9HSU4sbmV3IFVzZXJMb2dpbkhhbmRsZXIodGhpcyx0aGlzLm9uTG9naW5IYW5kbGVyKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuYnRuX2xvZ2luLm9mZihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkxvZ2luKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMudW5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX1VTRVJfTE9HSU4sdGhpcyk7XG4gICAgfVxuXG4gICAgLyoq5bGA5Lit5pi+56S6ICovXG4gICAgcHJpdmF0ZSBzZXRDZW50ZXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBjZW50ZXIgPSBUb29sLmdldENlbnRlclgoKTsvL+Wxj+W5lemrmOW6plxuICAgICAgICB0aGlzLnNwX3Byb2dyZXNzLnggPSBjZW50ZXI7XG4gICAgICAgIHRoaXMuc3BfZ2FtZU5hbWUueCA9IGNlbnRlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRBc3NldHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBzcmMgPSBbXG4gICAgICAgICAgICB7dXJsOlwidW5wYWNrYWdlL3dlbGNvbWUvYm94aW1nLnBuZ1wifVxuICAgICAgICBdO1xuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHNyYyxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWQpLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uUHJvY2VzcykpO1xuICAgICAgICB0aGlzLm9uTG9hZCgpO1xuICAgIH1cblxuICAgIC8qKuWKoOi9vei/m+eoiyAqL1xuICAgIHByaXZhdGUgb25Qcm9jZXNzKHBybykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcHJvQm94ID0gdGhpcy5zcF9wcm9ncmVzcztcbiAgICAgICAgbGV0IHByb1cgPSB0aGlzLnNwX3Byb2dyZXNzVztcbiAgICAgICAgbGV0IHByb0wgPSB0aGlzLnNwX3Byb2dyZXNzTDtcbiAgICAgICAgcHJvVy53aWR0aCA9IHByb0JveC53aWR0aCpwcm87XG4gICAgICAgIHByb0wueCA9IHByb0JveC53aWR0aCpwcm87XG4gICAgICAgIGlmKCF0aGlzLmlzQ29ubmVjdFNlcnZlcikgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmraPlnKjov57mjqXmnI3liqHlmajigKbigKZdXCI7XG4gICAgICAgICAgICBlbHNlIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIui/m+W6puWKoOi9vSBcIiArIE1hdGguZmxvb3IocHJvKjEwMCkgKyBcIiUgICBb5pyN5Yqh5Zmo6L+e5o6l5oiQ5YqfXVwiO1xuICAgIH1cblxuICAgIC8qKuWKoOi9veWujOavlSAqL1xuICAgIHByaXZhdGUgb25Mb2FkKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLliqDovb3lrozmr5Xov5vlhaXmuLjmiI9cIjtcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDgwMCx0aGlzLHRoaXMuc2hvd0xvZ2luQm94KTtcbiAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLm5ld0Zsb2F0TXNnKCk7XG4gICAgfVxuXG4gICAgLyoq5pi+56S655m75b2V5qGGKiovXG4gICAgcHJpdmF0ZSBzaG93TG9naW5Cb3goKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfbG9naW5Cb3gudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuYW5pMS5wbGF5KDAsZmFsc2UpO1xuICAgICAgICB0aGlzLnNwX2dhbWVOYW1lLnggPSB0aGlzLnNwX2xvZ2luQm94LndpZHRoICsgdGhpcy5zcF9nYW1lTmFtZS53aWR0aC8yICsgMTAwO1xuICAgICAgICB0aGlzLnNwX3Byb2dyZXNzLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKirngrnlh7vnmbvpmYYgKi9cbiAgICBwcml2YXRlIG9uTG9naW4oKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8vQ2xpZW50U2VuZGVyLnJlcVVzZXJMb2dpbih0aGlzLmlucHV0X3VzZXJOYW1lLnRleHQsdGhpcy5pbnB1dF91c2VyS2V5LnRleHQpO1xuICAgICAgICBMYXlhLlNjZW5lLm9wZW4oXCJHYW1lTG9iYnkvR2FtZUxvYmJ5LnNjZW5lXCIpO1xuICAgIH1cblxuICAgIC8qKueCueWHu+azqOWGjCAqL1xuICAgIHByaXZhdGUgb25SZWdpc3RlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKirngrnlh7sg5bey5pyJ6LSm5Y+3ICovXG4gICAgcHJpdmF0ZSBvblRvTG9naW4oKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKueCueWHuyDms6jlhowgKi9cbiAgICBwcml2YXRlIG9uVG9SZWdpc3RlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgQ2xpZW50U2VuZGVyLnJlcVVzZXJSZWdpc3Rlcih0aGlzLmlucHV0X3JlZ2lzdGVyVXNlck5hbWUudGV4dCx0aGlzLmlucHV0X3JlZ2lzdGVyVXNlcktleS50ZXh0LHRoaXMuaW5wdXRfcmVnaXN0ZXJOaWNrTmFtZS50ZXh0KTsgICAgICAgIFxuICAgIH1cblxuICAgIC8qKuiOt+WPluWIsOa2iOaBryAqL1xuICAgIHByaXZhdGUgb25Mb2dpbkhhbmRsZXIoZGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgaWYoZGF0YSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IFwi55m76ZmG5oiQ5Yqf77yM6L+b5YWl5ri45oiP77yBXCJcbiAgICAgICAgICAgIGlmKHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSkgdGV4dCA9IFwi5rOo5YaM5oiQ5Yqf77yM5bCG55u05o6l6L+b5YWl5ri45oiP77yBXCI7XG4gICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKHRleHQpO1xuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDgwMCx0aGlzLHRoaXMudG9HYW1lTWFpbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKirov57mjqXmnI3liqHlmaggKi9cbiAgICBwcml2YXRlIGNvbm5lY3RTZXJ2ZXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLmNvbm5lY3QoR2FtZUNvbmZpZy5JUCxHYW1lQ29uZmlnLlBPUlQpO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBwcml2YXRlIHRvR2FtZU1haW4oKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8vVE8gRE8g6Lez6L2s6Iez5ri45oiP5aSn5Y6FXG4gICAgfVxufSIsImltcG9ydCBTb2NrZXRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyXCI7XG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xuXG4vKipcbiAqIOeUqOaIt+eZu+mZhuivt+axgiDov5Tlm57lpITnkIZcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlckxvZ2luSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XG4gICAgXG4gICAgY29uc3RydWN0b3IoY2FsbGVyOmFueSxjYWxsYmFjazpGdW5jdGlvbiA9IG51bGwpe1xuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xuICAgIH1cblxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXG4gICAge1xuICAgICAgICB2YXIgUmVzVXNlckxvZ2luOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXNVc2VyTG9naW5cIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc1VzZXJMb2dpbi5kZWNvZGUoZGF0YSk7XG4gICAgICAgIHN1cGVyLmV4cGxhaW4obWVzc2FnZSk7XG4gICAgfVxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xuICAgIHByb3RlY3RlZCBzdWNjZXNzKG1lc3NhZ2UpOnZvaWRcbiAgICB7ICAgICAgICAgICAgICAgIFxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xuICAgIH1cbn1cbiAgICAiLCIvKlxuKiDmuLjmiI/phY3nva5cbiovXG5leHBvcnQgY2xhc3MgR2FtZUNvbmZpZ3tcbiAgICAvKippcCovXG4gICAgcHVibGljIHN0YXRpYyBJUCA6IHN0cmluZyA9IFwiNDcuMTA3LjE2OS4yNDRcIjtcbiAgICAvKirnq6/lj6MgKi9cbiAgICBwdWJsaWMgc3RhdGljIFBPUlQgOiBudW1iZXIgPSA3Nzc3ICA7XG4gICAgLy8gLyoqaXAgLSDmnKzlnLDmtYvor5UqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgSVAgOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiO1xuICAgIC8vIC8qKuerr+WPoyAtIOacrOWcsOa1i+ivlSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBQT1JUIDogbnVtYmVyID0gNzc3NztcblxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICB9XG59XG5cbi8qKuWNj+iuriAqL1xuZXhwb3J0IGNsYXNzIFByb3RvY29se1xuICAgIC8vIC8vKioqKioqKioqKioqZ21NZXNzYWdlLnByb3RvXG4gICAgLy8gLyoq5Y+R6YCBR03lr4bku6QgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9HTV9DT006bnVtYmVyID0gMTk5MTAxO1xuXG4gICAgLy8gLy8qKioqKioqKioqKip1c2VyTWVzc2FnZS5wcm90b1xuICAgIC8vIC8qKuazqOWGjCAyMDIxMDIqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfUkVHSVNURVI6bnVtYmVyID0gMjAyMTAyO1xuICAgIC8vIC8qKueZu+W9leivt+axgiAyMDIxMDMqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfTE9HSU46bnVtYmVyID0gMjAyMTAzO1xuXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKueZu+W9lei/lOWbniAyMDIyMDEqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9VU0VSX0xPR0lOOm51bWJlciA9IDIwMjIwMTtcbiAgICAvLyAvKirmnI3liqHlmajliJfooaggMjAyMjAzKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU0VSVkVSX0xJU1Q6bnVtYmVyID0gMjAyMjAzO1xuICAgIC8vIC8qKuWFrOWRiumdouadvyAyMDIyMDQqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9OT1RJQ0VfQk9BUkQ6bnVtYmVyID0gMjAyMjA0O1xuXG4gICAgLy8gLy8qKioqKioqKioqKipsb2dpbk1lc3NhZ2UucHJvdG9cbiAgICAvLyAvKirmnI3liqHlmajnmbvlvZXor7fmsYIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9TRVJWX0xPR0lOOm51bWJlciA9IDEwMTEwMTtcbiAgICAvLyAvKirlv4Pot7PljIXor7fmsYIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9TRVJWX0hFUlQ6bnVtYmVyID0gMTAxMTAyO1xuICAgIC8vIC8qKuivt+axguinkuiJsuS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0NSRUFURV9QTEFZRVI6bnVtYmVyID0gMTAxMTAzO1xuICAgIC8vIC8qKuacjeWKoeWZqOi/lOWbnioqKioqKioqKioqKiogKi9cbiAgICAvLyAvKirlv4Pot7Pov5Tlm54gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU0VSVl9IRVJUOm51bWJlciA9IDEwMTIwMTtcbiAgICAvLyAvKirov5Tlm57nmbvlvZXplJnor6/mtojmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU0VSVl9FUlJPUjpudW1iZXIgPSAxMDEyMDI7XG4gICAgLy8gLyoq6L+U5Zue6KKr6aG25LiL57q/ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NVQlNUSVRVVEU6bnVtYmVyID0gMTAxMjAzO1xuXG4gICAgLy8qKioqKioqKioqKioqKioqVXNlclByb3RvLnByb3RvXG4gICAgLyoq6K+35rGCIG1zZ0lkID0gMTAxMTAzICovXG4gICAgcHVibGljIHN0YXRpYyBSRVFfVVNFUl9MT0dJTiA6IG51bWJlciA9IDEwMTEwMztcbiAgICAvKioxMDExMDQg5rOo5YaM6K+35rGCICovXG4gICAgcHVibGljIHN0YXRpYyBSRVFfVVNFUl9SRUdJU1RFUiA6IG51bWJlciA9IDEwMTEwNDtcbiAgICAvKirlk43lupQgbXNnSWQgPSAxMDEyMDMgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFU19VU0VSX0xPR0lOIDogbnVtYmVyID0gMTAxMjAzO1xuXG4gICAgLy8gLy8qKioqKioqKioqKipwbGF5ZXJNZXNzYWdlLnByb3RvXG4gICAgLy8gLy/or7fmsYJcbiAgICAvLyAvKiror7fmsYLmia3om4sgbXNnSWQ9MTAyMTAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfR0FDSEE6bnVtYmVyID0gMTAyMTAxO1xuXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKueZu+mZhui/lOWbnuinkuiJsuWfuuacrOS/oeaBryAgbXNnSWQ9MTAyMjAxICAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QTEFZRVJfSU5GTzpudW1iZXIgPSAxMDIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5oiQ5YqfICBtc2dJZD0xMDIyMDIgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfU1VDQ0VTUzpudW1iZXIgPSAxMDIyMDI7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5aSx6LSlICBtc2dJZD0xMDIyMDMgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfRkFJTDpudW1iZXIgPSAxMDIyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW5ZCO55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNCAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9FUVVBTDpudW1iZXIgPSAxMDIyMDQ7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNSAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9VUERBVEU6bnVtYmVyID0gMTAyMjA1O1xuICAgIC8vIC8qKui/lOWbnuaJreibiyBtc2dJZD0xMDIyMDYgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0dBQ0hBOm51bWJlciA9IDEwMjIwNjtcblxuICAgIC8vIC8vKioqKioqKioqKioqc2tpbGxNZXNzYWdlLnByb3RvXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLeivt+axgua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKiror7fmsYLmiYDmnInmioDog73kv6Hmga8gbXNnSWQ9MTA3MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MTAxO1xuICAgIC8vIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GSUdIVF9TS0lMTF9MSVNUOm51bWJlciA9IDEwNzEwMjtcbiAgICAvLyAvKiror7fmsYLljYfnuqfmioDog70gbXNnSWQ9MTA3MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVBfU0tJTEw6bnVtYmVyID0gMTA3MTAzO1xuICAgIC8vIC8qKuivt+axgumHjee9ruaKgOiDvSBtc2dJZD0xMDcxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcxMDQ7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9IG1zZ0lkPTEwNzEwNVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0FMVEVSX0dSSURfU0tJTEw6bnVtYmVyID0gMTA3MTA1O1xuXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57miYDmnInmioDog73kv6Hmga8gIG1zZ0lkPTEwNzIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTExfU0tJTExfSU5GTzpudW1iZXIgPSAxMDcyMDE7XG4gICAgLy8gLyoq6L+U5Zue5Ye65oiY5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfRklHSFRfU0tJTExfTElTVDpudW1iZXIgPSAxMDcyMDI7XG4gICAgLy8gLyoq6L+U5Zue5Y2H57qn5oqA6IO9ICBtc2dJZD0xMDcyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVBfU0tJTEw6bnVtYmVyID0gMTA3MjAzO1xuICAgIC8vIC8qKui/lOWbnumHjee9ruaKgOiDveaIkOWKn++8jOWuouaIt+err+aUtuWIsOatpOa2iOaBr++8jOacrOWcsOenu+mZpOWFqOmDqOaKgOiDvSAgbXNnSWQ9MTA3MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNzIwNDtcbiAgICAvLyAvKirov5Tlm57mlLnlj5jmoLzlrZDmioDog70gIG1zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTFRFUl9HUklEX1NLSUxMOm51bWJlciA9IDEwNzIwNTtcblxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogcGV0TWVzc2FnZVxuICAgIC8vIC8qKuivt+axguWuoOeJqeWIneWni+WIm+W7uu+8iOWIm+W7uuinkuiJsuiOt+W+l+WIneWni+WuoOeJqe+8iSBtc2dJZD0xMDUxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDUyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUxMDE7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5LiK6Zi15a6g54mp5L+h5oGvIG1zZ0lkPTEwNTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9BTFRFUl9HUklEOm51bWJlciA9IDEwNTEwMjtcbiAgICAvLyAvKiror7fmsYLlloLlrqDnianlkIPppa0gbXNnSWQ9MTA1MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZFRUQ6bnVtYmVyID0gMTA1MTAzO1xuICAgIC8vIC8qKuivt+axguWuoOeJqeWQiOaIkCBtc2dJZD0xMDUxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQ09NUE9VTkQ6bnVtYmVyID0gMTA1MTA0O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MTA2O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MTA3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MTA4O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjSBtc2dJZD0xMDUxMDlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HOm51bWJlciA9IDEwNTEwOTtcbiAgICAvLyAvKiror7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0VWT0xWRTpudW1iZXIgPSAxMDUxMTA7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9IQVRDSDpudW1iZXIgPSAxMDUxMTE7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTExMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUxMTI7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRVFfTUFUSU5HOm51bWJlciA9IDEwNTExMztcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MTE0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE0IOWmguaenOWuoOeJqeacrOi6q+acieeZu+iusOaVsOaNru+8jOS9hue5geihjeaVsOaNruaJvuS4jeWIsO+8iOi/lOWbnua2iOaBr21zZ0lkPTEwNTIxMuWSjG1zZ0lkPTEwNTIxM+abtOaWsOWuouaIt+err+aVsOaNru+8iSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQUxMSU5GTzpudW1iZXIgPSAxMDUxMTQ7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5p+l55yL6K+35rGC5YiX6KGoIG1zZ0lkPTEwNTExNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1Q6bnVtYmVyID0gMTA1MTE1O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUxMTZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTbvvIzlpoLmnpzmmK/lkIzmhI/vvIzlr7nmlrnnjqnlrrblpoLmnpzlnKjnur/vvIzkvJrmlLbliLBtc2dJZD0xMDUyMTDmtojmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX0NIT09TRTpudW1iZXIgPSAxMDUxMTY7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55uu5qCH5Yi35pawIG1zZ0lkPTEwNTExN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0g6bnVtYmVyID0gMTA1MTE3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX1RBUkdFVF9MT09LOm51bWJlciA9IDEwNTExODtcbiAgICAvLyAvKiror7fmsYLlrqDnianmlL7nlJ8gbXNnSWQ9MTA1MTE5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MTE5O1xuXG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iW1zZ0lkPTEwNTIwMSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9BTExfSU5GTzpudW1iZXIgPSAxMDUyMDE7XG4gICAgLy8gLy8g6L+U5Zue5a6g54mp5qC85a2Q5L+h5oGvIG1zZ0lkPTEwNTIwMlxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfR1JJRF9JTkZPOm51bWJlciA9IDEwNTIwMjtcbiAgICAvLyAvKirov5Tlm57lrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MjAzKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX1JBTkRPTV9DUkVBVEU6bnVtYmVyID0gMTA1MjAzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeetiee6p+WSjOe7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDveetiee6p+WSjOaKgOiDvee7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqeaKgOiDvee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA1O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MjA2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MjA3O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MjA4O1xuXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5Lqk6YWNIG1zZ0lkPTEwNTIwOSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdUOm51bWJlciA9IDEwNTIwOTtcbiAgICAvLyAvKirov5Tlm57lrqDnianlop7liqDnuYHooY3mrKHmlbAgbXNnSWQ9MTA1MjEwICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0FERF9NQVRJTkdfQ09VTlQ6bnVtYmVyID0gMTA1MjEwO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqei/m+WMliBtc2dJZD0xMDUyMTEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfRVZPTFZFOm51bWJlciA9IDEwNTIxMTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MjEyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFR0lTVEVSOm51bWJlciA9IDEwNTIxMjtcbiAgICAvLyAvKirov5Tlm57lrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MjEzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFUV9NQVRJTkc6bnVtYmVyID0gMTA1MjEzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUyMTQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0FMTElORk86bnVtYmVyID0gMTA1MjE0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUyMTUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTIxNTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MjE2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX01BVElOR19DSE9PU0U6bnVtYmVyID0gMTA1MjE2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUyMTcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNIOm51bWJlciA9IDEwNTIxNztcbiAgICAvLyAvKirov5Tlm57lrqDnianmlL7nlJ8gbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MjE4O1xuICAgIFxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogZXF1aXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX01BS0U6bnVtYmVyID0gMTA5MTAxO1xuICAgIC8vIC8qKuivt+axguijheWkh+WIhuinoyBtc2dJZD0xMDkxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9TUExJVDpudW1iZXIgPSAxMDkxMDZcbiAgICAvLyAvKiror7fmsYLoo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTE9DSzpudW1iZXIgPSAxMDkxMDQ7XG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5by65YyWIG1zZ0lkPTEwOTEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0FUVF9BREQ6bnVtYmVyID0gMTA5MTA1O1xuICAgIC8vIC8qKuivt+axguijheWkh+epv+aItCBtc2dJZD0xMDkxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9MT0FESU5HOm51bWJlciA9IDEwOTEwMjtcbiAgICAvLyAvKiror7fmsYLoo4XlpIfljbjovb0gbXNnSWQ9MTA5MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfVU5MT0FESU5HOm51bWJlciA9IDEwOTEwMztcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX01BS0UgPSAxMDkyMDE7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX1NQTElUID0gMTA5MjA2O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+W8uuWMliBtc2dJZD0xMDkyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9BVFRfQUREID0gMTA5MjA1O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+epv+aItCBtc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0FESU5HID0gMTA5MjAyO1xuICAgIC8vIC8qKui/lOWbnuijheWkh+WNuOi9vSBtc2dJZD0xMDkyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9VTkxPQURJTkcgPSAxMDkyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX0xPQ0sgPSAxMDkyMDQ7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBtYXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5pmu6YCa5oiY5paX77yI5a6i5oi356uv5LiA5Zy65oiY5paX57uT5p2f5LmL5ZCO5Y+R6YCB5q2k5raI5oGv77yM5YaN6L+b6KGM5YCS6K6h5pe25ZKM5pys5Zyw5YGH5oiY5paX77yJIG1zZ0lkPTEwNjEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9OT1JNQUxfRklHSFQ6bnVtYmVyID0gMTA2MTAxO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyBtc2dJZD0xMDYxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1BFRURfRklHSFQ6bnVtYmVyID0gMTA2MTA0O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoeaImOaWlyBtc2dJZD0xMDYxMDVcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1dFRVBfRklHSFQ6bnVtYmVyID0gMTA2MTA1O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoei0reS5sOaJq+iNoSBtc2dJZD0xMDYxMDZcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDAwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9CVVlfU1dFRVA6bnVtYmVyID0gMTA2MTA2O1xuICAgIC8vIC8qKuivt+axguWFs+WNoeWBh+aImOaWl+e7k+adn+mihuWPluWlluWKsSBtc2dJZD0xMDYxMDlcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDYyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYxMDk7XG4gICAgLy8gLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVFJVRV9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTAyO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NDRU5FX0ZJR0hUOm51bWJlciA9IDEwNjEwMztcbiAgICAvLyAvKiror7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX0NIQU5HRV9TQ0VORTpudW1iZXIgPSAxMDYxMDg7XG5cblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue56a757q/5ZKM5omr6I2h5pS255uK5L+h5oGvIG1zZ0lkPTEwNjIwMiovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfT0ZGX0xJTkVfQVdBUkRfSU5GTzpudW1iZXIgPSAxMDYyMDI7XG4gICAgLy8gLyoq6L+U5Zue5oiY5paX5pKt5pS+57uT5p2f5Y+R5pS+5aWW5Yqx77yI5bqU55So5LqO5omA5pyJ5oiY5paX77yJIG1zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRklHSFRfRU5EOm51bWJlciA9IDEwNjIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIHBhY2tNZXNzYWdlXG4gICAgLy8gLyoq5L2/55So6YGT5YW35raI5oGvICBtc2dJZD0xMDQxMDEg6L+U5Zue5pON5L2c5oiQ5Yqf5raI5oGvICBtc2dJZD0xMDIyMDIgY29kZT0xMDAwMe+8iOaaguWumu+8jOagueaNruWunumZheS9v+eUqOaViOaenOWGjeWBmu+8iSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFOm51bWJlciA9IDEwNDEwMTtcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6YGT5YW35Y+Y5YyW5L+h5oGvICBtc2dJZD0xMDQyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QUk9QX0lORk86bnVtYmVyID0gMTA0MjAyO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iSAgbXNnSWQ9MTA0MjAxKOacieWPr+iDveS4uuepuuWIl+ihqCkqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BBQ0tfQUxMX0lORk86bnVtYmVyID0gMTA0MjAxO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheWNleS4quijheWkh+WPmOWMluS/oeaBryBtc2dJZD0xMDQyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9JTkZPOm51bWJlciA9IDEwNDIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqKiogZmlnaHRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfT1BFTl9NQUlMOm51bWJlciA9IDExMTEwMTtcbiAgICAvLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0FXQVJEOm51bWJlciA9IDExMTEwMjtcbiAgICAvLyAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0RFTEVURTpudW1iZXIgPSAxMTExMDM7XG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57pgq7ku7bkv6Hmga8gbXNnSWQ9MTExMjAx77yI55m76ZmG5Li75Yqo6L+U5ZueIOaIluiAhSDlj5HnlJ/lj5jljJbov5Tlm57vvIkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0lORk86bnVtYmVyID0gMTExMjAxO1xuICAgIC8vIC8qKui/lOWbnumCruS7tuW3sumihuWPluaIkOWKnyBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0FXQVJEOm51bWJlciA9IDExMTIwMjtcbiAgICAvLyAvKirov5Tlm57liKDpmaTpgq7ku7bmiJDlip8gbXNnSWQ9MTExMjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9ERUxFVEU6bnVtYmVyID0gMTExMjAzO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmaWdodE1lc3NhZ2VcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuS4gOWcuuaImOaWl+aXpeW/lyBtc2dJZD0xMDgyMDEqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1RSVUVfRklHSFRfTE9HX0lORk86bnVtYmVyID0gMTA4MjAxO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmcmllbmRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9QVVNIOm51bWJlciA9IDExMjEwMTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX1NFQVJDSDpudW1iZXIgPSAxMTIxMDI7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BUFBMWTpudW1iZXIgPSAxMTIxMDM7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5pON5L2cIG1zZ0lkPTExMjEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9PUEVSQVRJT046bnVtYmVyID0gMTEyMTA0O1xuICAgIC8vIC8qKuivt+axguWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfTU9SRV9JTkZPOm51bWJlciA9IDExMjEwNTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0dJRlQ6bnVtYmVyID0gMTEyMTA2XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BbGxfSW5mbzpudW1iZXIgPSAxMTIxMDc7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9GSUdIVDpudW1iZXIgPSAxMTIxMDg7XG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWlveWPi+aOqOiNkCBtc2dJZD0xMTIyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pCc57SiIG1zZ0lkPTExMjIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9TRUFSQ0g6bnVtYmVyID0gMTEyMjAyO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+eUs+ivtyBtc2dJZD0xMTIyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfQVBQTFk6bnVtYmVyID0gMTEyMjAzO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+aTjeS9nCBtc2dJZD0xMTIyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjIwNDtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMjA1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX01PUkVfSU5GTzpudW1iZXIgPSAxMTIyMDU7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L6YCB56S8IG1zZ0lkPTExMjIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9HSUZUOm51bWJlciA9IDExMjIwNjtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMjA3ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX0FMTF9JTkZPOm51bWJlciA9IDExMjIwNzsgICAgXG5cbn0iLCJpbXBvcnQgRmxvYXRNc2cgZnJvbSBcIi4uL1Rvb2wvRmxvYXRNc2dcIjtcbmltcG9ydCBUb29sIGZyb20gXCIuLi9Ub29sL1Rvb2xcIjtcblxuLyoqXG4gKiDmtojmga/mmL7npLrnrqHnkIblmahcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZU1hbmFnZXIge1xuICAgIC8qKuWNleS+iyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zIDogTWVzc2FnZU1hbmFnZXIgPSBuZXcgTWVzc2FnZU1hbmFnZXI7XG4gICAgLyoq5bGP5bmV5oul5pyJ55qE5rWu5Yqo5raI5oGv6K6h5pWwKi9cbiAgICBwdWJsaWMgY291bnRGbG9hdE1zZyA6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2cgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa1ruWKqOa2iOaBr+mihOeDrSzvvIzmj5DliY3mlrDlu7rkuIDkuKpmbG9hdFxuICAgICAqL1xuICAgIHB1YmxpYyBuZXdGbG9hdE1zZygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGZsb2F0TXNnID0gbmV3IEZsb2F0TXNnKCk7XG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmxvYXRNc2cpO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsZmxvYXRNc2cpOyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrmta7liqjmtojmga9cbiAgICAgKiBAcGFyYW0gdGV4dCAg5pi+56S65raI5oGvXG4gICAgICovXG4gICAgcHVibGljIHNob3dGbG9hdE1zZyh0ZXh0OnN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgZmxvYXRNc2cgOiBGbG9hdE1zZyA9IExheWEuUG9vbC5nZXRJdGVtKFwiRmxvYXRNc2dcIik7XG4gICAgICAgIGlmKExheWEuUG9vbC5nZXRQb29sQnlTaWduKFwiRmxvYXRNc2dcIikubGVuZ3RoID09IDApIHRoaXMubmV3RmxvYXRNc2coKTtcbiAgICAgICAgaWYoZmxvYXRNc2cgID09PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBmbG9hdE1zZyA9IG5ldyBGbG9hdE1zZygpO1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmbG9hdE1zZyk7ICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBmbG9hdE1zZy56T3JkZXIgPSAxMDAgKyB0aGlzLmNvdW50RmxvYXRNc2c7XG4gICAgICAgIGNvbnNvbGUubG9nKFRvb2wuZ2V0Q2VudGVyWCgpKTtcbiAgICAgICAgZmxvYXRNc2cuc2hvd01zZyh0ZXh0LHt4OlRvb2wuZ2V0Q2VudGVyWCgpICsgdGhpcy5jb3VudEZsb2F0TXNnKjIwLHk6IDM3NSArIHRoaXMuY291bnRGbG9hdE1zZyoyMH0pO1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2crKztcbiAgICB9XG5cbn0iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XG5cbi8qXG4qIOWuouaIt+err+WPkemAgeWZqFxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNlbmRlcntcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgKiDnlKjmiLfnmbvlvZUgMTAxMTAzXG4gICAgKiBAcGFyYW0gdXNlck5hbWUgXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcVVzZXJMb2dpbih1c2VyTmFtZTpzdHJpbmcsdXNlcktleTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJMb2dpblwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbiAgICAgICAgbWVzc2FnZS51c2VyS2V5ID0gdXNlcktleTtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZXJMb2dpbi5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfTE9HSU4sYnVmZmVyKTtcbiAgICB9XG4gICAgXG4gICAgICAgICAgICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfms6jlhowgMTAxMTA0XG4gICAgICogQHBhcmFtIHVzZXJOYW1lIFxuICAgICogQHBhcmFtIHVzZXJQYXNzIFxuICAgICogQHBhcmFtIHVzZXJOaWNrTmFtZVxuICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXFVc2VyUmVnaXN0ZXIodXNlck5hbWU6c3RyaW5nLHVzZXJLZXk6c3RyaW5nLHVzZXJOaWNrTmFtZTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyUmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJSZWdpc3RlclwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIHZhciB1c2VyRGF0YTphbnkgPSB7fTtcbiAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xuICAgICAgICBtZXNzYWdlLnVzZXJLZXkgPSB1c2VyS2V5O1xuICAgICAgICB1c2VyRGF0YS5uaWNrTmFtZSA9IHVzZXJOaWNrTmFtZTtcbiAgICAgICAgdXNlckRhdGEubHYgPSAxO1xuICAgICAgICBtZXNzYWdlLnVzZXJEYXRhID0gdXNlckRhdGE7XG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyUmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XG4gICAgfVxuICAgIFxuICAgIC8qKirmtojmga/lj5HpgIEqL1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKip3ZWJTb2NrZXQgKi9cbiAgICAvKirlj5HpgIFHTeWvhuS7pCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxR21Nc2coZ206c3RyaW5nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxR01Db21tOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFHTUNvbW1cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLmNvbW0gPSBnbTtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUdNQ29tbS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0dNX0NPTSxidWZmZXIpO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKuW/g+i3s+WMhSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgc2VydkhlYXJ0UmVxKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfU0VSVl9IRVJUKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog55So5oi35rOo5YaMXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlclJlcSh1c2VyTmFtZTpzdHJpbmcsdXNlclBhc3M6c3RyaW5nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUmVnaXN0ZXJVc2VyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFSZWdpc3RlclVzZXJcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnVzZXJOYW1lID0gdXNlck5hbWU7XG4vLyAgICAgICAgIG1lc3NhZ2UudXNlclBhc3MgPSB1c2VyUGFzcztcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVJlZ2lzdGVyVXNlci5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfUkVHSVNURVIsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog55m75b2V5pyN5Yqh5ZmoXG4vLyAgICAgICogQHBhcmFtIHRva2VuIFxuLy8gICAgICAqIEBwYXJhbSBzZXJ2SWQgXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBsb2dpblNlcnZSZXEoc2VydklkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUxvZ2luOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFMb2dpblwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuY29kZSA9IEdhbWVEYXRhTWFuYWdlci5pbnMubG9naW5BdXRoZW50aWNhdGlvbjtcbi8vICAgICAgICAgbWVzc2FnZS5zZXJ2ZXJJZCA9IHNlcnZJZDtcbi8vICAgICAgICAgbWVzc2FnZS5hZ2VudElkID0gMTtcbi8vICAgICAgICAgbWVzc2FnZS5jbGllbnRJZCA9IDE7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFMb2dpbi5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1NFUlZfTE9HSU4sYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog5Yib5bu66KeS6ImyXG4vLyAgICAgICogQHBhcmFtIHNleCBcbi8vICAgICAgKiBAcGFyYW0gcGxheWVyTmFtZSBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVBsYXllclJlcShzZXg6bnVtYmVyLHBsYXllck5hbWU6c3RyaW5nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxQ3JlYXRlUGxheWVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFDcmVhdGVQbGF5ZXJcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLmdlbmRlciA9IHNleDtcbi8vICAgICAgICAgbWVzc2FnZS5wbGF5ZXJOYW1lID0gcGxheWVyTmFtZTtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUNyZWF0ZVBsYXllci5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0NSRUFURV9QTEFZRVIsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguaJgOacieaKgOiDveS/oeaBryAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxQWxsU2tpbGxJbmZvKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfQUxMX1NLSUxMX0lORk8pO1xuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlh7rmiJjmioDog73kv6Hmga8gKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUZpZ2h0U2tpbGxMaXN0KCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRklHSFRfU0tJTExfTElTVCk7ICAgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWNh+e6p+aKgOiDvSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXBTa2lsbChza2lsbFVwTHZWb3M6QXJyYXk8U2tpbGxVcEx2Vm8+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxVXBTa2lsbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxVXBTa2lsbFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2tpbGxMaXN0ID0gW107XG4vLyAgICAgICAgIHZhciBpbmZvOmFueTtcbi8vICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNraWxsVXBMdlZvcy5sZW5ndGg7aSsrKVxuLy8gICAgICAgICB7XG4vLyAgICAgICAgICAgICBpbmZvID0ge307XG4vLyAgICAgICAgICAgICBpbmZvLnNraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0uc2tpbGxJZDtcbi8vICAgICAgICAgICAgIGluZm8udG9Ta2lsbElkID0gc2tpbGxVcEx2Vm9zW2ldLnRvU2tpbGxJZDtcbi8vICAgICAgICAgICAgIG1lc3NhZ2Uuc2tpbGxMaXN0LnB1c2goaW5mbyk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVwU2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VUF9TS0lMTCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC6YeN572u5oqA6IO9ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFSZXNldFNraWxsKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUkVTRVRfU0tJTEwpOyAgIFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLkvb/nlKjpgZPlhbcgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVVzZShwcm9wSWQ6TG9uZyxudW06bnVtYmVyLGFyZ3M/OnN0cmluZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVVzZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxVXNlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wSWQgPSBwcm9wSWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UubnVtID0gbnVtO1xuLy8gICAgICAgICBpZihhcmdzKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5hcmdzID0gYXJncztcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRSxidWZmZXIpOyAgXG4vLyAgICAgfVxuICAgIFxuLy8gICAgIC8qKuivt+axguWuoOeJqeWQiOaIkCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0Q29tcG91bmQocHJvcElkOkxvbmcpXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0Q29tcG91bmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldENvbXBvdW5kXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wSWQgPSBwcm9wSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRDb21wb3VuZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9DT01QT1VORCxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLlloLlrqDnianlkIPppa0qL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RmVlZChwZXRJZDpMb25nLHByb3BMaXN0OkFycmF5PFByb3BWbz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRGZWVkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRGZWVkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BMaXN0ID0gcHJvcExpc3Q7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRGZWVkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0ZFRUQsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG5cbi8vICAgICAvKiror7fmsYLmlLnlj5jmoLzlrZDmioDog70gKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUFsdGVyR3JpZFNraWxsKHR5cGU6bnVtYmVyLHNraWxsVXBHcmlkOlNraWxsVXBHcmlkVm8pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFBbHRlckdyaWRTa2lsbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxQWx0ZXJHcmlkU2tpbGxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlOyAgICAgICAgXG4vLyAgICAgICAgIHZhciB2bzphbnkgPSB7fTtcbi8vICAgICAgICAgdm8uZ3JpZElkID0gc2tpbGxVcEdyaWQuZ3JpZElkO1xuLy8gICAgICAgICB2by5za2lsbElkID0gc2tpbGxVcEdyaWQuc2tpbGxJZDtcbi8vICAgICAgICAgbWVzc2FnZS5ncmlkID0gdm87ICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUFsdGVyR3JpZFNraWxsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTsgICAgICAgIFxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9BTFRFUl9HUklEX1NLSUxMLGJ1ZmZlcik7ICAgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguaUueWPmOWuoOeJqemYteWei+agvOWtkCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0QWx0ZXJHcmlkKHR5cGU6bnVtYmVyLGdyaWRMaXN0OkFycmF5PExpbmV1cEdyaWRWbz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRBbHRlckdyaWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEFsdGVyR3JpZFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7XG4vLyAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QgPSBbXTtcbi8vICAgICAgICAgdmFyIGluZm86YW55O1xuLy8gICAgICAgICBmb3IodmFyIGkgPSAwO2kgPCBncmlkTGlzdC5sZW5ndGg7aSsrKVxuLy8gICAgICAgICB7XG4vLyAgICAgICAgICAgICBpbmZvID0ge307XG4vLyAgICAgICAgICAgICBpbmZvLmdyaWRJZCA9IGdyaWRMaXN0W2ldLmdyaWRJZDtcbi8vICAgICAgICAgICAgIGluZm8ucGV0SWQgPSBncmlkTGlzdFtpXS5oZXJvSWQ7XG4vLyAgICAgICAgICAgICBtZXNzYWdlLmdyaWRMaXN0LnB1c2goaW5mbyk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEFsdGVyR3JpZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9BTFRFUl9HUklELGJ1ZmZlcik7ICAgXG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguaJreibiyBtc2dJZD0xMDIxMDFcbi8vICAgICAgKiBAcGFyYW0gbW9uZXlUeXBlIC8vIOaJreibi+exu+WeiyAwPemHkeW4geaKvSAxPemSu+efs+aKvVxuLy8gICAgICAqIEBwYXJhbSBudW1UeXBlIOasoeaVsOexu+WeiyAwPeWFjei0ueWNleaKvSAxPeWNleaKvSAyPeWNgei/nuaKvVxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxR2FjaGEobW9uZXlUeXBlOm51bWJlcixudW1UeXBlOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUdhY2hhOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFHYWNoYVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IG1vbmV5VHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5udW1UeXBlID0gbnVtVHlwZTtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUdhY2hhLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfR0FDSEEsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyAqL1xuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcFNwZWVkRmlnaHQoKTp2b2lkXG4vLyAgICAgIHtcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TUEVFRF9GSUdIVCk7XG4vLyAgICAgIH1cblxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHotK3kubDmiavojaEgKi9cbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBCdXlTd2VlcCgpOnZvaWRcbi8vICAgICAge1xuLy8gICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX0JVWV9TV0VFUCk7XG4vLyAgICAgIH0gICBcblxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHmiavojaEgICovXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU3dlZXBGaWdodChzY2VuZUlkOm51bWJlcik6dm9pZFxuLy8gICAgICB7XG4vLyAgICAgICAgICB2YXIgIFJlcU1hcFN3ZWVwRmlnaHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hcFN3ZWVwRmlnaHRcIik7XG4vLyAgICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgIG1lc3NhZ2Uuc2NlbmVJZCA9IHNjZW5lSWQ7XG4vLyAgICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFwU3dlZXBGaWdodC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfU1dFRVBfRklHSFQsYnVmZmVyKTtcbi8vICAgICAgfVxuXG4vLyAgICAgLyoq6ZqP5py65Yib5bu65LiA5p2h6b6ZICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSYW5kb21DcmVhdGUoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkFORE9NX0NSRUFURSk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWcsOWbvuaZrumAmuaImOaWl++8iOWuouaIt+err+S4gOWcuuaImOaWl+e7k+adn+S5i+WQjuWPkemAgeatpOa2iOaBr++8jOWGjei/m+ihjOWAkuiuoeaXtuWSjOacrOWcsOWBh+aImOaWl++8iSBtc2dJZD0xMDYxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDEgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcE5vcm1hbEZpZ2h0KCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX05PUk1BTF9GSUdIVCk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWFs+WNoeWBh+aImOaWl+e7k+adn+mihuWPluWlluWKsSBtc2dJZD0xMDYxMDlcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDYyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcE5vcm1hbEZpZ2h0RW5kKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX05PUk1BTF9GSUdIVF9FTkQpO1xuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlnLDlm77lhbPljaFib3Nz5oiY5paXIG1zZ0lkPTEwNjEwM1x0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwNCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU2NlbmVGaWdodCgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TQ0VORV9GSUdIVCk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWRiuivieacjeWKoeWZqOaImOaWl+aSreaUvue7k+adn++8iOS7heS7heW6lOeUqOS6juaJgOacieecn+aImOaWl++8iSBtc2dJZD0xMDYxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVR1cmVGaWdodEVuZCgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1RSVUVfRklHSFRfRU5EKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5YiH5o2i5Zyw5Zu+5YWz5Y2hIG1zZ0lkPTEwNjEwOFx0XHQtLS0tLei/lOWbnua2iOaBryDlia/mnKxpZOWSjOWFs+WNoWlkIOWxnuaAp+WPmOWMlua2iOaBr1xuLy8gICAgICAqIEBwYXJhbSBzY2VuZUlkIFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwQ2hhbmdlU2NlbmUoc2NlbmVJZDpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYXBDaGFuZ2VTY2VuZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFwQ2hhbmdlU2NlbmVcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnNjZW5lSWQgPSBzY2VuZUlkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFwQ2hhbmdlU2NlbmUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfQ0hBTkdFX1NDRU5FLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqeS6pOmFjSBtc2dJZD0xMDUxMDlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDlcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQxIFxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDIgXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmcocGV0SWQxOkxvbmcscGV0SWQyOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQxID0gcGV0SWQxO1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkMiA9IHBldElkMjtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkcsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp6L+b5YyWIG1zZ0lkPTEwNTExMFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMVxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEg6L+b5YyW5a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gYmVQZXRJZExpc3Qg5raI6ICX5a6g54mpaWTliJfooahcbi8vICAgICAgKiBAcGFyYW0gcHJvcElkIOa2iOiAl+mBk+WFt+WUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIHByb3BOdW0g5raI6ICX6YGT5YW35pWw6YePXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRFdm9sdmUocGV0SWQ6TG9uZyxiZVBldElkTGlzdDpBcnJheTxMb25nPixwcm9wSWRMaXN0OkFycmF5PExvbmc+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0RXZvbHZlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRFdm9sdmVcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIGlmKGJlUGV0SWRMaXN0Lmxlbmd0aCA+IDApXG4vLyAgICAgICAgICAgICBtZXNzYWdlLmJlUGV0SWRMaXN0ID0gYmVQZXRJZExpc3Q7XG4vLyAgICAgICAgIGlmKHByb3BJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2UucHJvcElkTGlzdCA9IHByb3BJZExpc3Q7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRFdm9sdmUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRVZPTFZFLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqeWtteWMliBtc2dJZD0xMDUxMTFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDNcbi8vICAgICAgKiBAcGFyYW0gZWdnSWQg5a6g54mp6JuL5ZSv5LiAaWRcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEhhdGNoKGVnZ0lkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRIYXRjaDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0SGF0Y2hcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLmVnZ0lkID0gZWdnSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRIYXRjaC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9IQVRDSCxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MTEyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEyXG4vLyAgICAgICogQHBhcmFtIGVnZ0lkIOWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIHF1YWxpdHlJZCDpnIDopoHlk4HotKjmnaHku7ZpZCgw6KGo56S65LiN6ZmQ5Yi2KVxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmVnaXN0ZXIocGV0SWQ6TG9uZyxxdWFsaXR5SWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0UmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlZ2lzdGVyXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZCA9IHF1YWxpdHlJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlZ2lzdGVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1JFR0lTVEVSLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqeeUs+ivt+e5geihjSBtc2dJZD0xMDUxMTNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTNcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg6K+35rGC5pa55a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gdG9QZXRJZCDmjqXmlLbmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmVxTWF0aW5nKHBldElkOkxvbmcsdG9QZXRJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0UmVxTWF0aW5nOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRSZXFNYXRpbmdcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QZXRJZCA9IHRvUGV0SWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRSZXFNYXRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVRX01BVElORyxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MTE0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE0XG4vLyAgICAgICogQHBhcmFtIHBldFR5cGUgIDE95Yqf77yMMj3pmLLvvIwzPemAn++8jDQ96KGA77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gY29uZmlnSWQg5a6g54mp6YWN572uaWTvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBnZW5kZXIgIOWuoOeJqeaAp+WIq++8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIHF1YWxpdHlJZExpc3Qg5a6g54mp5ZOB6LSoaWTvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nQWxsSW5mbyhwZXRUeXBlOm51bWJlcixjb25maWdJZDpudW1iZXIsZ2VuZGVyOm51bWJlcixxdWFsaXR5SWRMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdBbGxJbmZvOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdBbGxJbmZvXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRUeXBlID0gcGV0VHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5jb25maWdJZCA9IGNvbmZpZ0lkO1xuLy8gICAgICAgICBtZXNzYWdlLmdlbmRlciA9IGdlbmRlcjtcbi8vICAgICAgICAgaWYocXVhbGl0eUlkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWRMaXN0ID0gcXVhbGl0eUlkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ0FsbEluZm8uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX0FMTElORk8sYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN5p+l55yL6K+35rGC5YiX6KGoIG1zZ0lkPTEwNTExNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNVxuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDlrqDnianllK/kuIBpZFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0U2VsZWN0UmVxTGlzdChwZXRJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0U2VsZWN0UmVxTGlzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U2VsZWN0UmVxTGlzdFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFNlbGVjdFJlcUxpc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfU0VMRUNUX1JFUV9MSVNULGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUxMTZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTbvvIzlpoLmnpzmmK/lkIzmhI/vvIzlr7nmlrnnjqnlrrblpoLmnpzlnKjnur/vvIzkvJrmlLbliLBtc2dJZD0xMDUyMTDmtojmga9cbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg5oiR5pa55a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gdG9QZXRJZCDlr7nmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSBpc0NvbnNlbnQg5piv5ZCm5ZCM5oSPIHRydWU95ZCM5oSPXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdDaG9vc2UocGV0SWQ6TG9uZyx0b1BldElkOkxvbmcsaXNDb25zZW50OmJvb2xlYW4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdDaG9vc2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ0Nob29zZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5pc0NvbnNlbnQgPSBpc0NvbnNlbnQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRNYXRpbmdDaG9vc2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX0NIT09TRSxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nm67moIfliLfmlrAgbXNnSWQ9MTA1MTE3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE3XG4vLyAgICAgICogQHBhcmFtIHBldFR5cGUgMT3lip/vvIwyPemYsu+8jDM96YCf77yMND3ooYDvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBjb25maWdJZCDlrqDnianphY3nva5pZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciDlrqDnianmgKfliKvvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWRMaXN0IOWuoOeJqeWTgei0qGlk77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2gocGV0VHlwZTpudW1iZXIsY29uZmlnSWQ6bnVtYmVyLGdlbmRlcjpudW1iZXIscXVhbGl0eUlkTGlzdDpBcnJheTxudW1iZXI+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nVGFyZ2V0UmVmcmVzaDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nVGFyZ2V0UmVmcmVzaFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0VHlwZSA9IHBldFR5cGU7XG4vLyAgICAgICAgIG1lc3NhZ2UuY29uZmlnSWQgPSBjb25maWdJZDtcbi8vICAgICAgICAgbWVzc2FnZS5nZW5kZXIgPSBnZW5kZXI7XG4vLyAgICAgICAgIGlmKHF1YWxpdHlJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2UucXVhbGl0eUlkTGlzdCA9IHF1YWxpdHlJZExpc3Q7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19UQVJHRVRfUkVGUkVTSCxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nm67moIfmn6XnnIsgbXNnSWQ9MTA1MTE4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4XG4vLyAgICAgICogQHBhcmFtIHRvUGxheWVySWQg6KKr5p+l55yL5a6g54mp55qE5Li75Lq655qEaWRcbi8vICAgICAgKiBAcGFyYW0gdG9QZXRJZCDooqvmn6XnnIvlrqDnianllK/kuIBpZFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nVGFyZ2V0TG9vayh0b1BsYXllcklkOkxvbmcsdG9QZXRJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nVGFyZ2V0TG9vazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nVGFyZ2V0TG9va1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QZXRJZCA9IHRvUGV0SWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRNYXRpbmdUYXJnZXRMb29rLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19DSE9PU0UsYnVmZmVyKTtcbi8vICAgICB9XG5cblxuLy8gICAgIC8qKuivt+axguijheWkh+aJk+mAoCBtc2dJZD0xMDkwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBNYWtlKHByb3BJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBNYWtlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcE1ha2VcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBNYWtlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTUFLRSxidWZmZXIpO1xuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguijheWkh+WIhuinoyBtc2dJZD0xMDkxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDYgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwU3BsaXQoZXF1aXBJZDpBcnJheTxMb25nPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwU3BsaXQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwU3BsaXRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcFNwbGl0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfU1BMSVQsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBMb2NrKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBMb2NrOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcExvY2tcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwTG9jay5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX0xPQ0ssYnVmZmVyKTsgXG4vLyAgICAgfVxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5by65YyWIG1zZ0lkPTEwOTEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBBdHRBZGQocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcsbHVja051bTpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcExvY2s6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTG9ja1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgXG4vLyAgICAgICAgIG1lc3NhZ2UubHVja051bSA9IGx1Y2tOdW07ICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2NrLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfQVRUX0FERCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyBcdC8qKuivt+axguijheWkh+epv+aItCBtc2dJZD0xMDkxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDIgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwTG9hZGluZyhwZXRJZDpMb25nLGVxdWlwSWQ6TG9uZylcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcExvYWRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTG9hZGluZ1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgICAgICAgICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwTG9hZGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX0xPQURJTkcsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguijheWkh+WNuOi9vSBtc2dJZD0xMDkxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwVW5Mb2FkaW5nKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKVxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwVW5Mb2FkaW5nOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcFVuTG9hZGluZ1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgICAgICAgICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwVW5Mb2FkaW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfVU5MT0FESU5HLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vIFx0Lyoq6K+35rGC5a6g54mp6aKG5oKf5oqA6IO9IG1zZ0lkPTEwNTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0U3R1ZHlTa2lsbChwZXRJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0U3R1ZHlTa2lsbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U3R1ZHlTa2lsbFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFN0dWR5U2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfU1RVRFlfU0tJTEwsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmVzZXRTa2lsbChwZXRJZDpMb25nLHNraWxsSWRMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRSZXNldFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRSZXNldFNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgIFxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIGlmKHNraWxsSWRMaXN0Lmxlbmd0aCA+IDApXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnNraWxsSWRMaXN0ID0gc2tpbGxJZExpc3Q7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRSZXNldFNraWxsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1JFU0VUX1NLSUxMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlrqDnianmioDog73ov5vpmLYgbXNnSWQ9MTA1MTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA4ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFQZXRTa2lsbFVwKHBldElkOkxvbmcsc2tpbGxJZDpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRTa2lsbFVwOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTa2lsbFVwXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLnNraWxsSWQgPSBza2lsbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2tpbGxVcC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TS0lMTF9VUCxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vIC8qKuivt+axguWuoOeJqeaUvueUnyBtc2dJZD0xMDUxMTlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTggKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEZyZWUocGV0SWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlc1BldEZyZWU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlc1BldEZyZWVcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXNQZXRGcmVlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0ZSRUUsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gLyoq6K+35rGC6aKG5Y+W6YKu5Lu25aWW5YqxIG1zZ0lkPTExMTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMTIwMiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxTWFpbEF3YXJkKG1haWxJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTWFpbEF3YXJkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsQXdhcmRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxBd2FyZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfQVdBUkQsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgICAgLyoq6K+35rGC5Yig6Zmk6YKu5Lu2IG1zZ0lkPTExMTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMTIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxTWFpbERlbGV0ZShtYWlsSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1haWxEZWxldGU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxEZWxldGVcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxEZWxldGUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0RFTEVURSxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLmiZPlvIDpgq7ku7borr7nva7lt7Lor7sgbXNnSWQ9MTExMTAxIOaXoOi/lOWbnua2iOaBryDlrqLmiLfnq6/miZPlvIDml6DlpZblirHpgq7ku7bvvIzoh6rooYzorr7nva7lt7Lor7vnirbmgIEgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU9wZW5NYWlsKG1haWxJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxT3Blbk1haWw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU9wZW5NYWlsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFPcGVuTWFpbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX09QRU5fTUFJTCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC6aKG5Y+W6YKu5Lu25aWW5YqxIG1zZ0lkPTExMTEwMlx0XHQtLS0tLei/lOWbnua2iOaBryAgbXNnSWQ9MTExMjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsQXdhcmQobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsQXdhcmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxBd2FyZFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbEF3YXJkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9BV0FSRCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Yig6Zmk6YKu5Lu2IG1zZ0lkPTExMTEwM1x0XHQtLS0tLei/lOWbnua2iOaBryAgbXNnSWQ9MTExMjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsRGVsZXRlKG1haWxJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTWFpbERlbGV0ZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbERlbGV0ZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbERlbGV0ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfREVMRVRFLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmjqjojZAgbXNnSWQ9MTEyMTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAxICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRQdXNoKCk6dm9pZFxuLy8gICAgIHsgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX1BVU0gpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5pCc57SiIG1zZ0lkPTExMjEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kU2VhcmNoKHRvUGxheWVySWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZFNlYXJjaDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kU2VhcmNoXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZFNlYXJjaC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9TRUFSQ0gsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+eUs+ivtyBtc2dJZD0xMTIxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEFwcGx5KHRvUGxheWVySWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZEFwcGx5OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRBcHBseVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRBcHBseS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9BUFBMWSxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5pON5L2cIG1zZ0lkPTExMjEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kT3BlcmF0aW9uKHR5cGU6bnVtYmVyLHRvUGxheWVySWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZE9wZXJhdGlvbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kT3BlcmF0aW9uXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZE9wZXJhdGlvbi5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9PUEVSQVRJT04sYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDUgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZE1vcmVJbmZvKHRvUGxheWVySWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZE1vcmVJbmZvOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRNb3JlSW5mb1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZE1vcmVJbmZvLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX01PUkVfSU5GTyxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L6YCB56S8IG1zZ0lkPTExMjEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kR2lmdChnaWZ0SWQ6bnVtYmVyLHRvUGxheWVySWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZEdpZnQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEdpZnRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgICAgICAgXG4vLyAgICAgICAgIG1lc3NhZ2UuZ2lmdElkID0gZ2lmdElkO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kR2lmdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9HSUZULGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA3ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRBbGxJbmZvKCk6dm9pZFxuLy8gICAgIHsgICAgICAgICAgICAgICAgICAgICAgICBcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0FsbF9JbmZvKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+WIh+ejiyBtc2dJZD0xMTIxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDgyMDEgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEZpZ2h0KHRvUGxheWVySWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZEZpZ2h0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRGaWdodFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEZpZ2h0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0ZJR0hULGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuXG5cblxuXG5cblxuXG4gICAgLyoq55m75b2V6K+35rGCICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBsb2dpblJlcShhY2NvdW50OnN0cmluZyk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIExvZ2luUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiTG9naW5SZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5uYW1lID0gYWNjb3VudDtcbiAgICAvLyAgICAgbWVzc2FnZS50b2tlbiA9IEdhbWVEYXRhTWFuYWdlci5pbnMubG9naW5Ub2tlbjtcbiAgICAvLyAgICAgbWVzc2FnZS5uaWNrbmFtZSA9IFwieGllbG9uZ1wiO1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gTG9naW5SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5VU0VSX0xPR0lOLFByb3RvY29sLlVTRVJfTE9HSU5fQ01ELGJ1ZmZlcik7XG4gICAgLy8gfVxuICAgIC8vIC8qKuiOt+WPluiLsembhOS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2V0SGVyb0luZm9SZXEoc3RhdHVzQ29kZTpudW1iZXIpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBIZXJvSW5mb1JlcXVlc3Q6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkhlcm9JbmZvUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IHN0YXR1c0NvZGU7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBIZXJvSW5mb1JlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkhFUk8sUHJvdG9jb2wuSEVST19HRVRfSU5GT1MsYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6Iux6ZuE5LiK44CB5LiL44CB5pu05paw6Zi15Z6LICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBoZXJvTGludWVwVXBkYXRlUmVxKGxpbmV1cElkOm51bWJlcixoZXJvSWQ6c3RyaW5nLGlzVXA6Ym9vbGVhbik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgaWYoIWlzVXAgJiYgR2FtZURhdGFNYW5hZ2VyLmlucy5zZWxmUGxheWVyRGF0YS5oZXJvTGluZXVwRGljLnZhbHVlcy5sZW5ndGggPD0gMSlcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgVGlwc01hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyhcIumYteS4iuiLsembhOS4jeW+l+WwkeS6juS4gOS4qlwiLDMwLFwiI2ZmMDAwMFwiLExheWVyTWFuYWdlci5pbnMuZ2V0TGF5ZXIoTGF5ZXJNYW5hZ2VyLlRJUF9MQVlFUiksR2FtZUNvbmZpZy5TVEFHRV9XSURUSC8yLEdhbWVDb25maWcuU1RBR0VfSEVJR0hULzIsMSwwLDIwMCk7XG4gICAgLy8gICAgICAgICByZXR1cm47XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgdmFyIFVwZGF0ZUZvcm1hdGlvblJlcXVlc3Q6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlVwZGF0ZUZvcm1hdGlvblJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLnNpdGVJZHggPSBsaW5ldXBJZDtcbiAgICAvLyAgICAgbWVzc2FnZS5oZXJvSWQgPSBoZXJvSWQ7XG4gICAgLy8gICAgIG1lc3NhZ2UuZmxhZyA9IGlzVXA7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBVcGRhdGVGb3JtYXRpb25SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5IRVJPLFByb3RvY29sLkhFUk9fVVBEQVRFX0ZPUk1BVElPTixidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKiror7fmsYLlhbPljaHkv6Hmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGdhdGVHYXRlSW5mb1JlcSgpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBHYXRlSW5mb1JlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiR2F0ZUluZm9SZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gMTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEdhdGVJbmZvUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0lORk8sYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq5oyR5oiY5YWz5Y2hICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBiYWxsdGVHYXRlUmVxKGdhdGVLZXk6c3RyaW5nKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgQmF0dGxlR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiQmF0dGxlR2F0ZVJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gQmF0dGxlR2F0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9CQVRUTEUsYnVmZmVyKTtcbiAgICAvLyB9XG5cbiAgICAvLyAvKiror7fmsYLmiavojaHlhbPljaEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIHNjYW5HYXRlUmVxKGdhdGVLZXk6c3RyaW5nKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgU2NhbkdhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlNjYW5HYXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBTY2FuR2F0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9TQ0FOLGJ1ZmZlcik7XG4gICAgLy8gfVxuICAgIC8vIC8qKuivt+axguWFs+WNoeaMguacuuWlluWKseS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZUhhbmd1cFN0YXRlUmVxKCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEhhbmd1cFN0YXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJIYW5ndXBTdGF0ZVJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSAxO1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gSGFuZ3VwU3RhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFLGJ1ZmZlcik7XG4gICAgLy8gICAgIC8vIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0hBTkRVUF9TVEFURSk7XG4gICAgLy8gfVxuICAgIC8vIC8qKuivt+axguWFs+WNoeaMguacuuS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZVN3aXRjaEhhbmdSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBTd2l0Y2hIYW5nR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFN3aXRjaEhhbmdHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX1NXSVRDSF9IQU5HX0dBVEUsYnVmZmVyKTtcbiAgICAvLyAgICAgLy8gV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFKTtcbiAgICAvLyB9XG4gICAgXG5cblxuICAgIC8vIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqSHR0cCAqL1xuICAgIC8vIC8qKua1i+ivleeZu+W9lSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgaHR0cExvZ2luUmVxKGFjY291bnQ6c3RyaW5nLHB3ZDpzdHJpbmcsY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgcGFyYW1zOmFueSA9IHt9O1xuICAgIC8vICAgICBwYXJhbXMuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgLy8gICAgIHBhcmFtcy5wYXNzd29yZCA9IHB3ZDtcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwudGVzdExvZ2luVVJMLEhUVFBSZXFUeXBlLkdFVCxwYXJhbXMsY2FsbGVyLGNhbGxCYWNrKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6I635Y+W5pyN5Yqh5Zmo5YiX6KGoICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBodHRwR2FtZVNlcnZlclJlcShjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLmdhbWVTZXJ2ZXJVUkwsSFRUUFJlcVR5cGUuR0VULG51bGwsY2FsbGVyLGNhbGxCYWNrKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6L+b5YWl5ri45oiPICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBodHRwRW50ZXJHYW1lUmVxKHNpZDpudW1iZXIsY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgcGFyYW1zOmFueSA9IHt9O1xuICAgIC8vICAgICBwYXJhbXMuc2lkID0gc2lkO1xuICAgIC8vICAgICBIdHRwTWFuYWdlci5pbnMuc2VuZChIVFRQUmVxdWVzdFVybC5lbnRlckdhbWVVUkwsSFRUUFJlcVR5cGUuR0VULHBhcmFtcyxjYWxsZXIsY2FsbEJhY2spO1xuICAgIC8vIH1cbn0iLCIvKlxuKiDljIXop6PmnpBcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlSW4gZXh0ZW5kcyBMYXlhLkJ5dGV7XG4gICAgXG4gICAgLy8gcHVibGljIG1vZHVsZTpudW1iZXI7XG4gICAgcHVibGljIGNtZDpudW1iZXI7XG4gICAgcHVibGljIGJvZHk7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgLy8gcHVibGljIHJlYWQobXNnOk9iamVjdCA9IG51bGwpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcbiAgICAvLyAgICAgdGhpcy5jbGVhcigpO1xuICAgIC8vICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIobXNnKTtcbiAgICAvLyAgICAgdGhpcy5wb3MgPSAwO1xuICAgIC8vICAgICAvL+agh+iusOWSjOmVv+W6plxuICAgIC8vICAgICB2YXIgbWFyayA9IHRoaXMuZ2V0SW50MTYoKTtcbiAgICAvLyAgICAgdmFyIGxlbiA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgLy/ljIXlpLRcbiAgICAvLyAgICAgdGhpcy5tb2R1bGUgPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIHRoaXMuY21kID0gdGhpcy5nZXRJbnQzMigpO1xuICAgIC8vICAgICB2YXIgdHlwZSA9IHRoaXMuZ2V0Qnl0ZSgpO1xuICAgIC8vICAgICB2YXIgZm9ybWF0ID0gdGhpcy5nZXRCeXRlKCk7XG4gICAgLy8gICAgIC8v5pWw5o2uXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcbiAgICAvLyAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xuXG4gICAgLy8gfVxuICAgIFxuICAgIC8v5paw6YCa5L+hXG4gICAgLy8gcHVibGljIHJlYWQobXNnOk9iamVjdCA9IG51bGwpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcbiAgICAvLyAgICAgdGhpcy5jbGVhcigpO1xuICAgIC8vICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIobXNnKTtcbiAgICAvLyAgICAgdGhpcy5wb3MgPSAwO1xuXG4gICAgLy8gICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIHRoaXMuY21kID0gdGhpcy5nZXRJbnQzMigpO1xuICAgIC8vICAgICAvL+aVsOaNrlxuICAgIC8vICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XG4gICAgLy8gICAgIHRoaXMuYm9keSA9IG5ldyBVaW50OEFycmF5KHRlbXBCeXRlKTtcblxuICAgIC8vIH1cbiAgICAvL+aWsOmAmuS/oSDnspjljIXlpITnkIZcbiAgICBwdWJsaWMgcmVhZChidWZmRGF0YSk6dm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihidWZmRGF0YSk7XG4gICAgICAgIHRoaXMucG9zID0gMDtcblxuICAgICAgICB2YXIgbGVuID0gdGhpcy5nZXRJbnQzMigpO1xuICAgICAgICB0aGlzLmNtZCA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAgICAgLy/mlbDmja5cbiAgICAgICAgdmFyIHRlbXBCeXRlID0gdGhpcy5idWZmZXIuc2xpY2UodGhpcy5wb3MpO1xuICAgICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XG5cbiAgICB9XG4gICAgXG59XG4iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5cbi8qXG4qIOaJk+WMhVxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VPdXQgZXh0ZW5kcyBMYXlhLkJ5dGV7XG4gICAgLy8gcHJpdmF0ZSBQQUNLRVRfTUFSSyA9IDB4MDtcbiAgICAvLyBwcml2YXRlIG1vZHVsZSA9IDA7XG4gICAgLy8gcHJpdmF0ZSB0eXBlID0gMDtcbiAgICAvLyBwcml2YXRlIGZvcm1hcnQgPSAwO1xuICAgIHByaXZhdGUgY21kO1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIC8vIHB1YmxpYyBwYWNrKG1vZHVsZSxjbWQsZGF0YT86YW55KTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXG4gICAgLy8gICAgIHRoaXMubW9kdWxlID0gbW9kdWxlO1xuICAgIC8vICAgICB0aGlzLmNtZCA9IGNtZDtcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDE2KHRoaXMuUEFDS0VUX01BUkspO1xuICAgIC8vICAgICB0aGlzLndyaXRlSW50MzIoZGF0YS5ieXRlTGVuZ3RoICsgMTApO1xuICAgIC8vICAgICAvL+WMheWktFxuICAgIC8vICAgICB0aGlzLndyaXRlSW50MzIodGhpcy5tb2R1bGUpO1xuICAgIC8vICAgICB0aGlzLndyaXRlSW50MzIodGhpcy5jbWQpO1xuICAgIC8vICAgICB0aGlzLndyaXRlQnl0ZSh0aGlzLnR5cGUpO1xuICAgIC8vICAgICB0aGlzLndyaXRlQnl0ZSh0aGlzLmZvcm1hcnQpO1xuICAgIC8vICAgICAvL+a2iOaBr+S9k1xuICAgIC8vICAgICBpZihkYXRhKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIoZGF0YSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvKirmlrDpgJrkv6EgKi9cbiAgICBwdWJsaWMgcGFjayhjbWQsZGF0YT86YW55KTp2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXG5cbiAgICAgICAgdGhpcy5jbWQgPSBjbWQ7XG4gICAgICAgIHZhciBsZW4gPSAoZGF0YSA/IGRhdGEuYnl0ZUxlbmd0aCA6IDApICsgMTI7XG4gICAgICAgIHZhciBjb2RlOm51bWJlciA9IFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50Xmxlbl41MTI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLndyaXRlSW50MzIobGVuKTtcbiAgICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgICAgdGhpcy53cml0ZUludDMyKGNvZGUpO1xuICAgICAgICB0aGlzLndyaXRlSW50MzIodGhpcy5jbWQpO1xuICAgICAgICBpZihkYXRhKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmNvZGVDb3VudCsrIDtcbiAgICB9XG5cbn0iLCIvKlxuKiDmlbDmja7lpITnkIZIYW5sZGVyXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0SGFuZGxlcntcbiAgICAvLyBwdWJsaWMgc3RhdHVzQ29kZTpudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBjYWxsZXI6YW55O1xuICAgIHByaXZhdGUgY2FsbEJhY2s6RnVuY3Rpb247XG4gICAgY29uc3RydWN0b3IoY2FsbGVyPzphbnksY2FsbGJhY2s/OkZ1bmN0aW9uKXtcbiAgICAgICAgdGhpcy5jYWxsZXIgPSBjYWxsZXI7XG4gICAgICAgIHRoaXMuY2FsbEJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBwdWJsaWMgZXhwbGFpbihkYXRhPzphbnkpOnZvaWRcbiAgICB7XG4gICAgICAgIC8vIHZhciBzdGF0dXNDb2RlID0gZGF0YS5zdGF0dXNDb2RlO1xuICAgICAgICAvLyBpZihzdGF0dXNDb2RlID09IDApXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIHRoaXMuc3VjY2VzcyhkYXRhKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBlbHNlXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwi5pyN5Yqh5Zmo6L+U5Zue77yaXCIsZGF0YS5zdGF0dXNDb2RlKTtcbiAgICAgICAgLy8gfVxuICAgICAgICB0aGlzLnN1Y2Nlc3MoZGF0YSk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBzdWNjZXNzKGRhdGE/OmFueSk6dm9pZFxuICAgIHtcbiAgICAgICAgaWYodGhpcy5jYWxsZXIgJiYgdGhpcy5jYWxsQmFjaylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoZGF0YSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxCYWNrLmNhbGwodGhpcy5jYWxsZXIsZGF0YSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsQmFjay5jYWxsKHRoaXMuY2FsbGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgRGljdGlvbmFyeSBmcm9tIFwiLi4vLi4vVG9vbC9EaWN0aW9uYXJ5XCI7XG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuLi9FdmVudE1hbmFnZXJcIjtcbmltcG9ydCBQYWNrYWdlSW4gZnJvbSBcIi4vUGFja2FnZUluXCI7XG5pbXBvcnQgUGFja2FnZU91dCBmcm9tIFwiLi9QYWNrYWdlT3V0XCI7XG5pbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi9Tb2NrZXRIYW5kbGVyXCI7XG5pbXBvcnQgQ2xpZW50U2VuZGVyIGZyb20gXCIuL0NsaWVudFNlbmRlclwiO1xuaW1wb3J0IHsgUHJvdG9jb2wgfSBmcm9tIFwiLi4vQ29uc3QvR2FtZUNvbmZpZ1wiO1xuXG4vKipcbiAqIHNvY2tldOS4reW/g1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJTb2NrZXRNYW5hZ2VyIHtcbiAgIC8qKumAmuS/oWNvZGXmrKHmlbAgKi9cbiAgIHB1YmxpYyBzdGF0aWMgY29kZUNvdW50Om51bWJlciA9IDA7XG4gICBwcml2YXRlIGlwOnN0cmluZztcbiAgIHByaXZhdGUgcG9ydDpudW1iZXI7XG4gICBwcml2YXRlIHdlYlNvY2tldDpMYXlhLlNvY2tldDtcbiAgIHByaXZhdGUgc29ja2V0SGFubGRlckRpYzpEaWN0aW9uYXJ5O1xuICAgcHJpdmF0ZSBwcm90b1Jvb3Q6YW55O1xuICAgY29uc3RydWN0b3IoKXtcbiAgICAgICB0aGlzLnNvY2tldEhhbmxkZXJEaWMgPSBuZXcgRGljdGlvbmFyeSgpO1xuICAgfVxuICAgcHJpdmF0ZSBzdGF0aWMgX2luczpXZWJTb2NrZXRNYW5hZ2VyID0gbnVsbDtcbiAgIHB1YmxpYyBzdGF0aWMgZ2V0IGlucygpOldlYlNvY2tldE1hbmFnZXJ7XG4gICAgICAgaWYodGhpcy5faW5zID09IG51bGwpXG4gICAgICAgeyAgXG4gICAgICAgICAgIHRoaXMuX2lucyA9IG5ldyBXZWJTb2NrZXRNYW5hZ2VyKCk7XG4gICAgICAgfVxuICAgICAgIHJldHVybiB0aGlzLl9pbnM7XG4gICB9XG5cbiAgIHB1YmxpYyBjb25uZWN0KGlwOnN0cmluZyxwb3J0Om51bWJlcik6dm9pZFxuICAge1xuICAgICAgIHRoaXMuaXAgPSBpcDtcbiAgICAgICB0aGlzLnBvcnQgPSBwb3J0O1xuXG4gICAgICAgdGhpcy53ZWJTb2NrZXQgPSBuZXcgTGF5YS5Tb2NrZXQoKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50Lk9QRU4sdGhpcyx0aGlzLndlYlNvY2tldE9wZW4pO1xuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuTUVTU0FHRSx0aGlzLHRoaXMud2ViU29ja2V0TWVzc2FnZSk7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5DTE9TRSx0aGlzLHRoaXMud2ViU29ja2V0Q2xvc2UpO1xuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuRVJST1IsdGhpcyx0aGlzLndlYlNvY2tldEVycm9yKTtcbiAgICAgICAvL+WKoOi9veWNj+iurlxuICAgICAgIGlmKCF0aGlzLnByb3RvUm9vdCl7XG4gICAgICAgICAgIHZhciBwcm90b0J1ZlVybHMgPSBbXCJvdXRzaWRlL3Byb3RvL1VzZXJQcm90by5wcm90b1wiXTtcbiAgICAgICAgICAgTGF5YS5Ccm93c2VyLndpbmRvdy5wcm90b2J1Zi5sb2FkKHByb3RvQnVmVXJscyx0aGlzLnByb3RvTG9hZENvbXBsZXRlKTtcbiAgICAgICAgICAgIFxuICAgICAgIH1cbiAgICAgICBlbHNlXG4gICAgICAge1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5jb25uZWN0QnlVcmwoXCJ3czovL1wiK3RoaXMuaXArXCI6XCIrdGhpcy5wb3J0KTtcbiAgICAgICB9XG4gICB9XG4gICAvKirlhbPpl613ZWJzb2NrZXQgKi9cbiAgIHB1YmxpYyBjbG9zZVNvY2tldCgpOnZvaWRcbiAgIHtcbiAgICAgICBpZih0aGlzLndlYlNvY2tldClcbiAgICAgICB7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50Lk9QRU4sdGhpcyx0aGlzLndlYlNvY2tldE9wZW4pO1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5NRVNTQUdFLHRoaXMsdGhpcy53ZWJTb2NrZXRNZXNzYWdlKTtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuQ0xPU0UsdGhpcyx0aGlzLndlYlNvY2tldENsb3NlKTtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuRVJST1IsdGhpcyx0aGlzLndlYlNvY2tldEVycm9yKTtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQgPSBudWxsO1xuICAgICAgIH1cbiAgIH1cbiAgXG4gICBwcml2YXRlIHByb3RvTG9hZENvbXBsZXRlKGVycm9yLHJvb3QpOnZvaWRcbiAgIHtcbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5wcm90b1Jvb3QgPSByb290O1xuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLndlYlNvY2tldC5jb25uZWN0QnlVcmwoXCJ3czovL1wiK1dlYlNvY2tldE1hbmFnZXIuaW5zLmlwK1wiOlwiK1dlYlNvY2tldE1hbmFnZXIuaW5zLnBvcnQpO1xuICAgfVxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRPcGVuKCk6dm9pZFxuICAge1xuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG9wZW4uLi5cIik7XG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEgPSBuZXcgTGF5YS5CeXRlKCk7XG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW47XG4gICAgICAgdGhpcy50ZW1wQnl0ZSA9IG5ldyBMYXlhLkJ5dGUoKTtcbiAgICAgICB0aGlzLnRlbXBCeXRlLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOO1xuXG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5jb2RlQ291bnQgPSAxO1xuICAgICAgICAvLyAgICBFdmVudE1hbmFnZXIuaW5zLmRpc3BhdGNoRXZlbnQoRXZlbnRNYW5hZ2VyLlNFUlZFUl9DT05ORUNURUQpO+aaguaXtuS4jemcgOimgeiOt+WPluacjeWKoeWZqOWIl+ihqFxuICAgfVxuICAgLy/nvJPlhrLlrZfoioLmlbDnu4RcbiAgIHByaXZhdGUgYnl0ZUJ1ZmZEYXRhOkxheWEuQnl0ZTtcbiAgIC8v6ZW/5bqm5a2X6IqC5pWw57uEXG4gICBwcml2YXRlIHRlbXBCeXRlOkxheWEuQnl0ZTtcbiAgXG4gICBwcml2YXRlIHBhcnNlUGFja2FnZURhdGEocGFja0xlbik6dm9pZFxuICAge1xuICAgICAgIC8v5a6M5pW05YyFXG4gICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xuICAgICAgIHRoaXMudGVtcEJ5dGUud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIsMCxwYWNrTGVuKTtcbiAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XG4gICAgICAgLy/mlq3ljIXlpITnkIZcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YSA9IG5ldyBMYXlhLkJ5dGUodGhpcy5ieXRlQnVmZkRhdGEuZ2V0VWludDhBcnJheShwYWNrTGVuLHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCkpO1xuICAgICAgIC8vIHRoaXMuYnl0ZUJ1ZmZEYXRhLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLHBhY2tMZW4sdGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoKTtcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbjtcblxuICAgICAgIC8v6Kej5p6Q5YyFXG4gICAgICAgdmFyIHBhY2thZ2VJbjpQYWNrYWdlSW4gPSBuZXcgUGFja2FnZUluKCk7XG4gICAgICAgLy8gdmFyIGJ1ZmYgPSB0aGlzLnRlbXBCeXRlLmJ1ZmZlci5zbGljZSgwLHRoaXMudGVtcEJ5dGUubGVuZ3RoKTtcbiAgICAgICBwYWNrYWdlSW4ucmVhZCh0aGlzLnRlbXBCeXRlLmJ1ZmZlcik7XG5cbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBtc2cuLi5cIixwYWNrYWdlSW4uY21kLHRoaXMudGVtcEJ5dGUubGVuZ3RoKTtcbiAgICAgICBpZihwYWNrYWdlSW4uY21kID09IDEwNTIwMilcbiAgICAgICB7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xuICAgICAgIH1cbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIrIHBhY2thZ2VJbi5jbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKGhhbmRsZXJzICYmIGhhbmRsZXJzLmxlbmd0aCA+IDApXG4gICAgICAge1xuICAgICAgICAgICBmb3IodmFyIGkgPSBoYW5kbGVycy5sZW5ndGggLSAxO2kgPj0gMDtpLS0pXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIGhhbmRsZXJzW2ldLmV4cGxhaW4ocGFja2FnZUluLmJvZHkpO1xuICAgICAgICAgICB9XG4gICAgICAgICAgIC8vIGhhbmRsZXJzLmZvckVhY2goc29ja2V0SGFubGRlciA9PiB7XG4gICAgICAgICAgIC8vICAgICBzb2NrZXRIYW5sZGVyLmV4cGxhaW4ocGFja2FnZUluLmJvZHkpO1xuXG4gICAgICAgICAgIC8vIH0pO1xuICAgICAgIH1cbiAgICAgICBcbiAgICAgICAvL+mAkuW9kuajgOa1i+aYr+WQpuacieWujOaVtOWMhVxuICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+IDQpXG4gICAgICAge1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLmNsZWFyKCk7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIsMCw0KTtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xuICAgICAgICAgICBwYWNrTGVuID0gdGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpICsgNDtcbiAgICAgICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID49IHBhY2tMZW4pXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VQYWNrYWdlRGF0YShwYWNrTGVuKTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICBcbiAgIH1cbiAgIC8qKuino+aekOepuuWMhSAqL1xuICAgcHJpdmF0ZSBwYXJzZU51bGxQYWNrYWdlKGNtZDpudW1iZXIpOnZvaWRcbiAgIHtcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIrIGNtZDtcbiAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XG4gICAgICAgaWYoaGFuZGxlcnMpXG4gICAgICAge1xuICAgICAgICAgICBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xuICAgICAgICAgICAgICAgc29ja2V0SGFubGRlci5leHBsYWluKCk7XG4gICAgICAgICAgIH0pO1xuICAgICAgIH1cbiAgIH1cbiAgIFxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRNZXNzYWdlKGRhdGEpOnZvaWRcbiAgIHtcbiAgICAgICB0aGlzLnRlbXBCeXRlID0gbmV3IExheWEuQnl0ZShkYXRhKTtcbiAgICAgICB0aGlzLnRlbXBCeXRlLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLi4uLi50ZXN0d2ViXCIsdGhpcy50ZW1wQnl0ZS5wb3MpO1xuICAgICAgIFxuICAgICAgIGlmKHRoaXMudGVtcEJ5dGUubGVuZ3RoID4gNClcbiAgICAgICB7XG4gICAgICAgICAgIGlmKHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSA9PSA0KS8v56m65YyFXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIHZhciBjbWQ6bnVtYmVyID0gdGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpO1xuICAgICAgICAgICAgICAgdGhpcy5wYXJzZU51bGxQYWNrYWdlKGNtZCk7XG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuepuuWMhS4uLi4uLi4uLi4uLi4uLi5cIitjbWQpO1xuICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLndyaXRlQXJyYXlCdWZmZXIoZGF0YSwwLGRhdGEuYnl0ZUxlbmd0aCk7XG4gICAgICAgLy8gY29uc29sZS5sb2coXCLlrZfoioLmgLvplb/luqYuLi4uLi4uLi4uLi4uLi4uXCIrdGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoKTtcbiAgICAgICBcbiAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPiA0KVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAsNCk7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcbiAgICAgICAgICAgdmFyIHBhY2tMZW46bnVtYmVyID0gdGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpICsgNDtcbiAgICAgICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID49IHBhY2tMZW4pXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VQYWNrYWdlRGF0YShwYWNrTGVuKTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cblxuICAgICAgIFxuXG5cblxuICAgICAgIC8vIHZhciBwYWNrYWdlSW46UGFja2FnZUluID0gbmV3IFBhY2thZ2VJbigpO1xuICAgICAgIC8vIHBhY2thZ2VJbi5yZWFkKGRhdGEpO1xuXG4gICAgICAgLy8gY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgbXNnLi4uXCIscGFja2FnZUluLmNtZCk7XG4gICAgICAgLy8gdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBwYWNrYWdlSW4uY21kO1xuICAgICAgIC8vIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcbiAgICAgICAvLyBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xuICAgICAgIC8vICAgICBzb2NrZXRIYW5sZGVyLmV4cGxhaW4ocGFja2FnZUluLmJvZHkpO1xuICAgICAgIC8vIH0pO1xuICAgICAgIFxuICAgfVxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRDbG9zZSgpOnZvaWRcbiAgIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgY2xvc2UuLi5cIik7XG4gICB9XG4gICBwcml2YXRlIHdlYlNvY2tldEVycm9yKCk6dm9pZFxuICAge1xuICAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBlcnJvci4uLlwiKTtcbiAgIH1cbiAgIC8qKlxuICAgICog5Y+R6YCB5raI5oGvXG4gICAgKiBAcGFyYW0gY21kIFxuICAgICogQHBhcmFtIGRhdGEgXG4gICAgKi9cbiAgIHB1YmxpYyBzZW5kTXNnKGNtZDpudW1iZXIsZGF0YT86YW55KTp2b2lkXG4gICB7XG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgcmVxLi4uXCIrY21kKTtcbiAgICAgICB2YXIgcGFja2FnZU91dDpQYWNrYWdlT3V0ID0gbmV3IFBhY2thZ2VPdXQoKTtcbiAgICAgICAvLyBwYWNrYWdlT3V0LnBhY2sobW9kdWxlLGNtZCxkYXRhKTtcbiAgICAgICBwYWNrYWdlT3V0LnBhY2soY21kLGRhdGEpO1xuICAgICAgIHRoaXMud2ViU29ja2V0LnNlbmQocGFja2FnZU91dC5idWZmZXIpO1xuICAgfVxuICAgLyoqXG4gICAgKiDlrprkuYlwcm90b2J1Zuexu1xuICAgICogQHBhcmFtIHByb3RvVHlwZSDljY/orq7mqKHlnZfnsbvlnotcbiAgICAqIEBwYXJhbSBjbGFzc1N0ciDnsbtcbiAgICAqL1xuICAgcHVibGljIGRlZmluZVByb3RvQ2xhc3MoY2xhc3NTdHI6c3RyaW5nKTphbnlcbiAgIHtcbiAgICAgICByZXR1cm4gdGhpcy5wcm90b1Jvb3QubG9va3VwKGNsYXNzU3RyKTtcbiAgIH1cblxuICAgLyoq5rOo5YaMICovXG4gICBwdWJsaWMgcmVnaXN0ZXJIYW5kbGVyKGNtZDpudW1iZXIsaGFuZGxlcjpTb2NrZXRIYW5kbGVyKTp2b2lkXG4gICB7XG4gICAgICAgLy8gdmFyIGtleTpzdHJpbmcgPSBwcm90b2NvbCtcIl9cIitjbWQ7XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiK2NtZDtcbiAgICAgICB2YXIgaGFuZGxlcnM6QXJyYXk8U29ja2V0SGFuZGxlcj4gPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XG4gICAgICAgaWYoIWhhbmRsZXJzKVxuICAgICAgIHtcbiAgICAgICAgICAgaGFuZGxlcnMgPSBbXTtcbiAgICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgICAgdGhpcy5zb2NrZXRIYW5sZGVyRGljLnNldChrZXksaGFuZGxlcnMpO1xuICAgICAgIH1cbiAgICAgICBlbHNlXG4gICAgICAge1xuICAgICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgIH1cbiAgIH1cbiAgIC8qKuWIoOmZpCAqL1xuICAgcHVibGljIHVucmVnaXN0ZXJIYW5kbGVyKGNtZDpudW1iZXIsY2FsbGVyOmFueSk6dm9pZFxuICAge1xuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIiArIGNtZDtcbiAgICAgICB2YXIgaGFuZGxlcnM6QXJyYXk8U29ja2V0SGFuZGxlcj4gPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XG4gICAgICAgaWYoaGFuZGxlcnMpXG4gICAgICAge1xuICAgICAgICAgICB2YXIgaGFuZGxlcjtcbiAgICAgICAgICAgZm9yKHZhciBpID0gaGFuZGxlcnMubGVuZ3RoIC0gMTtpID49IDAgO2ktLSlcbiAgICAgICAgICAge1xuICAgICAgICAgICAgICAgaGFuZGxlciA9IGhhbmRsZXJzW2ldO1xuICAgICAgICAgICAgICAgaWYoaGFuZGxlci5jYWxsZXIgPT09IGNhbGxlcilcbiAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICBoYW5kbGVycy5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgfVxuICAgICAgICAgICBpZihoYW5kbGVycy5sZW5ndGggPT0gMClcbiAgICAgICAgICAge1xuICAgICAgICAgICAgICAgdGhpcy5zb2NrZXRIYW5sZGVyRGljLnJlbW92ZShrZXkpO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuICAgfVxuICAgLyoq5re75Yqg5pyN5Yqh5Zmo5b+D6LezICovXG4gICBwdWJsaWMgYWRkSGVydFJlcSgpOnZvaWRcbiAgIHtcbiAgICAvLyAgICB0aGlzLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNQX1NFUlZfSEVSVCxuZXcgU2VydmVySGVhcnRIYW5kbGVyKHRoaXMpKTtcbiAgICAvLyAgICBDbGllbnRTZW5kZXIuc2VydkhlYXJ0UmVxKCk7XG4gICAgLy8gICAgTGF5YS50aW1lci5sb29wKDEwMDAwLHRoaXMsZnVuY3Rpb24oKTp2b2lke1xuICAgIC8vICAgICAgICBDbGllbnRTZW5kZXIuc2VydkhlYXJ0UmVxKCk7XG4gICAgLy8gICAgfSk7XG4gICB9XG4gICBwdWJsaWMgcmVtb3ZlSGVhcnRSZXEoKTp2b2lkXG4gICB7XG4gICAgLy8gICAgdGhpcy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNQX1NFUlZfSEVSVCx0aGlzKTtcbiAgICAvLyAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xuICAgfVxufSIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xyXG5pbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyXCJcbmltcG9ydCBHYW1lTG9iYnlDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXJcIlxuaW1wb3J0IFdlbENvbWVDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj0xNDQwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9NzUwO1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZGhlaWdodFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJ0b3BcIjtcclxuICAgIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwiV2VsY29tZS9Mb2dpbi5zY2VuZVwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgdmFyIHJlZzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XHJcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzXCIsR2FtZUNvbnRyb2xsZXIpO1xuICAgICAgICByZWcoXCJDb250cm9sbGVyL0dhbWVMb2JieS9HYW1lTG9iYnlDb250cm9sbGVyLnRzXCIsR2FtZUxvYmJ5Q29udHJvbGxlcik7XG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50c1wiLFdlbENvbWVDb250cm9sbGVyKTtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XG5cblxuLyoqXG4gKiDmuLjmiI/lhaXlj6NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUVudGVye1xuXHRcdC8vXG4gICAgXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgLyoq5Yid5aeL5YyWICovXG4gICAgcHJpdmF0ZSBpbml0KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICB9XG4gICAgLyoq6LWE5rqQ5Yqg6L29ICovXG4gICAgcHJpdmF0ZSBsb2FkKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgYXNzZXRlQXJyID0gW1xuICAgICAgICAgICAge3VybDpcInVucGFja2FnZS93ZWxjb21lX2JnLnBuZ1wifSxcbiAgICAgICAgICAgIHt1cmw6XCJXZWxjb21lL2xvZ2luYm94LnBuZ1wifSxcbiAgICAgICAgICAgIHt1cmw6XCJXZWxjb21lL3Byb2dyZXNzQmcucG5nXCJ9LFxuXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL2NvbXAuYXRsYXNcIn0sXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL3dlbGNvbWUuYXRsYXNcIn1cbiAgICAgICAgXVxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKGFzc2V0ZUFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbmxvYWQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9ubG9hZCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgR2FtZUNvbmZpZy5zdGFydFNjZW5lICYmIExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUpO1xuICAgIH1cbn0iLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XG5pbXBvcnQgR2FtZUVudGVyIGZyb20gXCIuL0dhbWVFbnRlclwiO1xuY2xhc3MgTWFpbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pIExheWEzRC5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0KTtcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xuXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcblxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcblx0fVxuXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxuXHRcdExheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XG5cdH1cblxuXHRvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcblx0XHRuZXcgR2FtZUVudGVyKCk7XG5cdFx0Ly/liqDovb1JREXmjIflrprnmoTlnLrmma9cblx0fVxufVxuLy/mv4DmtLvlkK/liqjnsbtcbm5ldyBNYWluKCk7XG4iLCIvKipcbiAgICAqIOivjeWFuCBrZXktdmFsdWVcbiAgICAqXG4gICAgKiAgXG4gICAgKiAga2V5cyA6IEFycmF5XG4gICAgKiAgW3JlYWQtb25seV0g6I635Y+W5omA5pyJ55qE5a2Q5YWD57Sg6ZSu5ZCN5YiX6KGo44CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogXG4gICAgKiAgdmFsdWVzIDogQXJyYXlcbiAgICAqICBbcmVhZC1vbmx5XSDojrflj5bmiYDmnInnmoTlrZDlhYPntKDliJfooajjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiAgUHVibGljIE1ldGhvZHNcbiAgICAqICBcbiAgICAqICAgICAgICAgIFxuICAgICogIGNsZWFyKCk6dm9pZFxuICAgICogIOa4hemZpOatpOWvueixoeeahOmUruWQjeWIl+ihqOWSjOmUruWAvOWIl+ihqOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgIFxuICAgICogIGdldChrZXk6Kik6KlxuICAgICogIOi/lOWbnuaMh+WumumUruWQjeeahOWAvOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgICBcbiAgICAqICBpbmRleE9mKGtleTpPYmplY3QpOmludFxuICAgICogIOiOt+WPluaMh+WumuWvueixoeeahOmUruWQjee0ouW8leOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgIFxuICAgICogIHJlbW92ZShrZXk6Kik6Qm9vbGVhblxuICAgICogIOenu+mZpOaMh+WumumUruWQjeeahOWAvOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgIFxuICAgICogIHNldChrZXk6KiwgdmFsdWU6Kik6dm9pZFxuICAgICogIOe7meaMh+WumueahOmUruWQjeiuvue9ruWAvOOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWN0aW9uYXJ5IHtcbiAgICAvKirplK7lkI0gKi9cbiAgICBwcml2YXRlIGtleXMgOiBBcnJheTxhbnk+O1xuICAgIC8qKumUruWAvCAqL1xuICAgIHByaXZhdGUgdmFsdWVzIDogQXJyYXk8YW55PjtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMua2V5cyA9IG5ldyBBcnJheTxhbnk+KCk7XG4gICAgICAgIHRoaXMudmFsdWVzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgICB9XG5cbiAgICAvKirorr7nva4g6ZSu5ZCNIC0g6ZSu5YC8ICovXG4gICAgcHVibGljIHNldChrZXk6YW55LHZhbHVlOmFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICBmb3IobGV0IGkgPSAwO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMua2V5c1tpXT09PXVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXNbaV0gPSBrZXk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOaPkuWFpWtleVtcIisga2V5ICtcIl1cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidmFsdWVcIix2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoq6YCa6L+HIOmUruWQjWtleSDojrflj5bplK7lgLx2YWx1ZSAgKi9cbiAgICBwdWJsaWMgZ2V0KGtleTphbnkpIDogYW55XG4gICAge1xuICAgICAgICAvLyB0aGlzLmdldERpY0xpc3QoKTsgXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMua2V5c1tpXSA9PT0ga2V5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDor43lhbjkuK3msqHmnIlrZXnnmoTlgLxcIik7XG4gICAgfVxuXG4gICAgLyoq6I635Y+W5a+56LGh55qE57Si5byV5YC8ICovXG4gICAgcHVibGljIGluZGV4T2YodmFsdWUgOiBhbnkpIDogbnVtYmVyXG4gICAge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMudmFsdWVzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMudmFsdWVzW2ldID09PSB2YWx1ZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDor43lhbjkuK3msqHmnInor6XlgLxcIik7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIC8qKua4hemZpCDor43lhbjkuK3mjIflrprplK7lkI3nmoTliaogKi9cbiAgICBwdWJsaWMgcmVtb3ZlKGtleSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV0gPT09IGtleSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXNbaV0gPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOenu+mZpOaIkOWKn1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDnp7vpmaTlpLHotKVcIik7XG4gICAgfVxuXG4gICAgLyoq5riF6Zmk5omA5pyJ55qE6ZSuICovXG4gICAgcHVibGljIGNsZWFyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmtleXMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvKirojrflj5bliJfooaggKi9cbiAgICBwdWJsaWMgZ2V0RGljTGlzdCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgJBcIiArIGkgKyBcIuOAkS0tLS0tLS0tLS0ta2V5OlwiICsgdGhpcy5rZXlzW2ldKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmFsdWVcIix0aGlzLnZhbHVlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKirojrflj5bplK7lgLzmlbDnu4QgKi9cbiAgICBwdWJsaWMgZ2V0VmFsdWVzQXJyKCkgOiBBcnJheTxhbnk+XG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXM7XG4gICAgfVxuXG4gICAgLyoq6I635Y+W6ZSu5ZCN5pWw57uEICovXG4gICAgcHVibGljIGdldEtleXNBcnIoKSA6IEFycmF5PGFueT5cbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmtleXM7XG4gICAgfVxufSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uL3VpL2xheWFNYXhVSVwiO1xuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XG5cbi8qKlxuICog5Lit6Ze05a2XXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0TXNnIGV4dGVuZHMgdWkuRGlhbG9nXy5GbG9hdE1zZ1VJe1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgXG4gICAgb25FbmFibGUoKXtcbiAgICAgICAgdGhpcy5hZGRFdmVudCgpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuYW5pMS5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEV2ZW50KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uSGlkZGVuKTtcbiAgICAgICAgdGhpcy5hbmkxLm9uKExheWEuRXZlbnQuQ09NUExFVEUsdGhpcyx0aGlzLm9uSGlkZGVuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrmtojmga/po5jlrZdcbiAgICAgKiBAcGFyYW0gdGV4dCDmmL7npLrmlofmnKwg44CQ5pyA5aSaMjjkuKrjgJFcbiAgICAgKiBAcGFyYW0gcG9zICDkvY3nva57eDoxMDAseToxMDB9XG4gICAgICovXG4gICAgcHVibGljIHNob3dNc2codGV4dDpzdHJpbmcscG9zOmFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwX2Zsb2F0TXNnLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhYl9mbG9hdE1zZy50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy54ID0gcG9zLng7XG4gICAgICAgIHRoaXMueSA9IHBvcy55O1xuICAgICAgICB0aGlzLmFuaTEucGxheSgwLGZhbHNlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSGlkZGVuKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmFuaTEuc3RvcCgpO1xuICAgICAgICB0aGlzLnNwX2Zsb2F0TXNnLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJGbG9hdE1zZ1wiLHRoaXMpO1xuICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuY291bnRGbG9hdE1zZy0tO1xuICAgIH1cbn0iLCIvKipcbiAqIOWwj+W3peWFt1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29se1xuXG4gICAgY29uc3RydWN0b3IoKXtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWxj+W5leawtOW5s+S4reW/gyDmqKrlnZDmoIdcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldENlbnRlclgoKSA6IGFueVxuICAgIHtcbiAgICAgICAgcmV0dXJuIDc1MC8oTGF5YS5Ccm93c2VyLmNsaWVudEhlaWdodC9MYXlhLkJyb3dzZXIuY2xpZW50V2lkdGgpLzI7Ly/lsY/luZXlrr3luqZcbiAgICB9XG59XG4iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cbmltcG9ydCBWaWV3PUxheWEuVmlldztcbmltcG9ydCBEaWFsb2c9TGF5YS5EaWFsb2c7XG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbmV4cG9ydCBtb2R1bGUgdWkuRGlhbG9nXyB7XHJcbiAgICBleHBvcnQgY2xhc3MgRmxvYXRNc2dVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBhbmkxOkxheWEuRnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIHNwX2Zsb2F0TXNnOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBsYWJfZmxvYXRNc2c6TGF5YS5MYWJlbDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIkRpYWxvZ18vRmxvYXRNc2dcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuR2FtZSB7XHJcbiAgICBleHBvcnQgY2xhc3MgR2FtZVVJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGdhbWU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2RzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZDI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2QzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV2FsbHM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFVwV2FsbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgRG93bldhbGw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIEdyb3VwczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZG9vcjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX0dyYXNzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2Rvb3I6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfR3Jhc3M6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJvYWQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxfb2ZmOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxfb246TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNob3ZlbGJnOkxheWEuU3ByaXRlO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiR2FtZS9HYW1lXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgbW9kdWxlIHVpLkdhbWVMb2JieSB7XHJcbiAgICBleHBvcnQgY2xhc3MgR2FtZUxvYmJ5VUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtUGFuZWw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJ0bl9QVlA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1vZGVDaG9vc2VQYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgdGV4dF8xVjE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGJ0bl8xVjE6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIHRleHRfNVY1OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBidG5fNVY1OkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fYmFjazpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTWF0Y2hpbmdTdWNjZXNzUGFuZWw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYnRuX2VudGVyZ2FtZTpMYXlhLkJ1dHRvbjtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIkdhbWVMb2JieS9HYW1lTG9iYnlcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFBsYXllckxvYWRpbmdVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBsb2FkaW5nYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfMTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzI6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl8zOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfNDpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl8yOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfMzpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzQ6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl81OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGxvYWRpbmdCYXJCZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3ByaXRlX3Byb2dyZXNzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcHJpdGVfbGlnaHQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHRleHRfcHJvZ3Jlc3M6TGF5YS5MYWJlbDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIlBsYXllckxvYWRpbmdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuV2VsY29tZSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTG9naW5VSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBhbmkxOkxheWEuRnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIHNwX2xvZ2luQm94OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpbnB1dF91c2VyTmFtZTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgaW5wdXRfdXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgbGFiX3RpdGxlOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIGJ0bl9sb2dpbjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuX3JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NXOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc0w6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVDpMYXlhLkxhYmVsO1xuXHRcdHB1YmxpYyBzcF9nYW1lTmFtZTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgc3BfcmVnaXN0ZXJCb3g6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlck5hbWU6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgYnRuX3RvTG9naW46TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl90b1JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3Rlck5pY2tOYW1lOkxheWEuVGV4dElucHV0O1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiV2VsY29tZS9Mb2dpblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cciJdfQ==
