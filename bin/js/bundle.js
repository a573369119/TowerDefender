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
        ClientSender_1.default.reqUserLogin(this.input_userName.text, this.input_userKey.text);
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
},{"../../Core/Const/GameConfig":3,"../../Core/MessageManager":4,"../../Core/Net/ClientSender":5,"../../Core/Net/WebSocketManager":9,"../../Tool/Tool":15,"../../ui/layaMaxUI":16,"./handler/UserLoginHandler":2}],2:[function(require,module,exports){
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
},{"../../../Core/Net/SocketHandler":8,"../../../Core/Net/WebSocketManager":9}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
},{"../Tool/FloatMsg":14,"../Tool/Tool":15}],5:[function(require,module,exports){
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
},{"../Const/GameConfig":3,"./WebSocketManager":9}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{"./WebSocketManager":9}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{"../../Tool/Dictionary":13,"./PackageIn":6,"./PackageOut":7}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var WelComeController_1 = require("./Controller/WelCome/WelComeController");
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
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
},{"./Controller/WelCome/WelComeController":1}],11:[function(require,module,exports){
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
},{"./GameConfig":10}],12:[function(require,module,exports){
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
},{"./GameConfig":10,"./GameEnter":11}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{"../Core/MessageManager":4,"../ui/layaMaxUI":16}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL+adgui0p+mTui9MYXlhQWlySURFX2JldGEvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvaGFuZGxlci9Vc2VyTG9naW5IYW5kbGVyLnRzIiwic3JjL0NvcmUvQ29uc3QvR2FtZUNvbmZpZy50cyIsInNyYy9Db3JlL01lc3NhZ2VNYW5hZ2VyLnRzIiwic3JjL0NvcmUvTmV0L0NsaWVudFNlbmRlci50cyIsInNyYy9Db3JlL05ldC9QYWNrYWdlSW4udHMiLCJzcmMvQ29yZS9OZXQvUGFja2FnZU91dC50cyIsInNyYy9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyLnRzIiwic3JjL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXIudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9HYW1lRW50ZXIudHMiLCJzcmMvTWFpbi50cyIsInNyYy9Ub29sL0RpY3Rpb25hcnkudHMiLCJzcmMvVG9vbC9GbG9hdE1zZy50cyIsInNyYy9Ub29sL1Rvb2wudHMiLCJzcmMvdWkvbGF5YU1heFVJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBLGdEQUF3QztBQUN4QyxvRUFBK0Q7QUFDL0QsMERBQW1FO0FBQ25FLCtEQUEwRDtBQUMxRCw0REFBdUQ7QUFDdkQsd0NBQW1DO0FBQ25DLDREQUF1RDtBQUV2RDtJQUErQyxxQ0FBa0I7SUFHN0Q7ZUFDSSxpQkFBTztJQUNYLENBQUM7SUFDRCxpQkFBaUI7SUFDakIsUUFBUTtJQUNSLG9DQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxV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LFdBQUM7QUFBRCxDQWJBLEFBYUMsSUFBQTs7Ozs7QUNiRCxJQUFPLEtBQUssR0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hCLElBQWMsRUFBRSxDQVdmO0FBWEQsV0FBYyxFQUFFO0lBQUMsSUFBQSxPQUFPLENBV3ZCO0lBWGdCLFdBQUEsT0FBTztRQUNwQjtZQUFnQyw4QkFBSztZQUlqQzt1QkFBZSxpQkFBTztZQUFBLENBQUM7WUFDdkIsbUNBQWMsR0FBZDtnQkFDSSxpQkFBTSxjQUFjLFdBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFDTCxpQkFBQztRQUFELENBVEEsQUFTQyxDQVQrQixLQUFLLEdBU3BDO1FBVFksa0JBQVUsYUFTdEIsQ0FBQTtJQUNMLENBQUMsRUFYZ0IsT0FBTyxHQUFQLFVBQU8sS0FBUCxVQUFPLFFBV3ZCO0FBQUQsQ0FBQyxFQVhhLEVBQUUsR0FBRixVQUFFLEtBQUYsVUFBRSxRQVdmO0FBQ0QsV0FBYyxFQUFFO0lBQUMsSUFBQSxPQUFPLENBMEJ2QjtJQTFCZ0IsV0FBQSxPQUFPO1FBQ3BCO1lBQTZCLDJCQUFLO1lBbUI5Qjt1QkFBZSxpQkFBTztZQUFBLENBQUM7WUFDdkIsZ0NBQWMsR0FBZDtnQkFDSSxpQkFBTSxjQUFjLFdBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0wsY0FBQztRQUFELENBeEJBLEFBd0JDLENBeEI0QixLQUFLLEdBd0JqQztRQXhCWSxlQUFPLFVBd0JuQixDQUFBO0lBQ0wsQ0FBQyxFQTFCZ0IsT0FBTyxHQUFQLFVBQU8sS0FBUCxVQUFPLFFBMEJ2QjtBQUFELENBQUMsRUExQmEsRUFBRSxHQUFGLFVBQUUsS0FBRixVQUFFLFFBMEJmIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uLy4uL3VpL2xheWFNYXhVSVwiO1xyXG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xyXG5pbXBvcnQgeyBQcm90b2NvbCwgR2FtZUNvbmZpZyB9IGZyb20gXCIuLi8uLi9Db3JlL0NvbnN0L0dhbWVDb25maWdcIjtcclxuaW1wb3J0IFVzZXJMb2dpbkhhbmRsZXIgZnJvbSBcIi4vaGFuZGxlci9Vc2VyTG9naW5IYW5kbGVyXCI7XHJcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L0NsaWVudFNlbmRlclwiO1xyXG5pbXBvcnQgVG9vbCBmcm9tIFwiLi4vLi4vVG9vbC9Ub29sXCI7XHJcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VsQ29tZUNvbnRyb2xsZXIgZXh0ZW5kcyB1aS5XZWxjb21lLkxvZ2luVUl7XHJcbiAgICAvKirmmK/lkKbov57mjqXkuIrmnI3liqHlmaggKi9cclxuICAgIHByaXZhdGUgaXNDb25uZWN0U2VydmVyIDogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy/nlJ/lkb3lkajmnJ9cclxuICAgIC8qKuWQr+WKqCAqL1xyXG4gICAgb25FbmFibGUoKXtcclxuICAgICAgICB0aGlzLmRhdGFJbml0KCk7XHJcbiAgICAgICAgdGhpcy5zZXRDZW50ZXIoKTtcclxuICAgICAgICB0aGlzLmxvYWRBc3NldHMoKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RTZXJ2ZXIoKTsvL+i/nuaOpeacjeWKoeWZqFxyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6ZSA5q+BKi9cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vLy8vLy8vLy8vL+mAu+i+kVxyXG4gICAgLyoq5pWw5o2u5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGRhdGFJbml0KCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RTZXJ2ZXIgPSBmYWxzZTsgXHJcbiAgICB9XHJcbiAgICAvKirkuovku7bnu5HlrpogKi9cclxuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5idG5fbG9naW4ub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Mb2dpbik7XHJcbiAgICAgICAgdGhpcy5idG5fcmVnaXN0ZXIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25SZWdpc3Rlcik7XHJcbiAgICAgICAgdGhpcy5idG5fdG9Mb2dpbi5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblRvTG9naW4pO1xyXG4gICAgICAgIHRoaXMuYnRuX3RvUmVnaXN0ZXIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Ub1JlZ2lzdGVyKVxyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfVVNFUl9MT0dJTixuZXcgVXNlckxvZ2luSGFuZGxlcih0aGlzLHRoaXMub25Mb2dpbkhhbmRsZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYnRuX2xvZ2luLm9mZihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkxvZ2luKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfVVNFUl9MT0dJTix0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlsYDkuK3mmL7npLogKi9cclxuICAgIHByaXZhdGUgc2V0Q2VudGVyKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGNlbnRlciA9IFRvb2wuZ2V0Q2VudGVyWCgpOy8v5bGP5bmV6auY5bqmXHJcbiAgICAgICAgdGhpcy5zcF9wcm9ncmVzcy54ID0gY2VudGVyO1xyXG4gICAgICAgIHRoaXMuc3BfZ2FtZU5hbWUueCA9IGNlbnRlcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRBc3NldHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgc3JjID0gW1xyXG4gICAgICAgICAgICB7dXJsOlwidW5wYWNrYWdlL3dlbGNvbWUvYm94aW1nLnBuZ1wifVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChzcmMsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Mb2FkKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vblByb2Nlc3MpKTtcclxuICAgICAgICB0aGlzLm9uTG9hZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWKoOi9vei/m+eoiyAqL1xyXG4gICAgcHJpdmF0ZSBvblByb2Nlc3MocHJvKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgcHJvQm94ID0gdGhpcy5zcF9wcm9ncmVzcztcclxuICAgICAgICBsZXQgcHJvVyA9IHRoaXMuc3BfcHJvZ3Jlc3NXO1xyXG4gICAgICAgIGxldCBwcm9MID0gdGhpcy5zcF9wcm9ncmVzc0w7XHJcbiAgICAgICAgcHJvVy53aWR0aCA9IHByb0JveC53aWR0aCpwcm87XHJcbiAgICAgICAgcHJvTC54ID0gcHJvQm94LndpZHRoKnBybztcclxuICAgICAgICBpZighdGhpcy5pc0Nvbm5lY3RTZXJ2ZXIpIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIui/m+W6puWKoOi9vSBcIiArIE1hdGguZmxvb3IocHJvKjEwMCkgKyBcIiUgICBb5q2j5Zyo6L+e5o6l5pyN5Yqh5Zmo4oCm4oCmXVwiO1xyXG4gICAgICAgICAgICBlbHNlIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIui/m+W6puWKoOi9vSBcIiArIE1hdGguZmxvb3IocHJvKjEwMCkgKyBcIiUgICBb5pyN5Yqh5Zmo6L+e5o6l5oiQ5YqfXVwiO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWKoOi9veWujOavlSAqL1xyXG4gICAgcHJpdmF0ZSBvbkxvYWQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLliqDovb3lrozmr5Xov5vlhaXmuLjmiI9cIjtcclxuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODAwLHRoaXMsdGhpcy5zaG93TG9naW5Cb3gpO1xyXG4gICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5uZXdGbG9hdE1zZygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaYvuekuueZu+W9leahhioqL1xyXG4gICAgcHJpdmF0ZSBzaG93TG9naW5Cb3goKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNwX2xvZ2luQm94LnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuYW5pMS5wbGF5KDAsZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuc3BfZ2FtZU5hbWUueCA9IHRoaXMuc3BfbG9naW5Cb3gud2lkdGggKyB0aGlzLnNwX2dhbWVOYW1lLndpZHRoLzIgKyAxMDA7XHJcbiAgICAgICAgdGhpcy5zcF9wcm9ncmVzcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye755m76ZmGICovXHJcbiAgICBwcml2YXRlIG9uTG9naW4oKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBDbGllbnRTZW5kZXIucmVxVXNlckxvZ2luKHRoaXMuaW5wdXRfdXNlck5hbWUudGV4dCx0aGlzLmlucHV0X3VzZXJLZXkudGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye75rOo5YaMICovXHJcbiAgICBwcml2YXRlIG9uUmVnaXN0ZXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNwX3JlZ2lzdGVyQm94LnZpc2libGUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHuyDlt7LmnInotKblj7cgKi9cclxuICAgIHByaXZhdGUgb25Ub0xvZ2luKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye7IOazqOWGjCAqL1xyXG4gICAgcHJpdmF0ZSBvblRvUmVnaXN0ZXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBDbGllbnRTZW5kZXIucmVxVXNlclJlZ2lzdGVyKHRoaXMuaW5wdXRfcmVnaXN0ZXJVc2VyTmFtZS50ZXh0LHRoaXMuaW5wdXRfcmVnaXN0ZXJVc2VyS2V5LnRleHQsdGhpcy5pbnB1dF9yZWdpc3Rlck5pY2tOYW1lLnRleHQpOyAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I635Y+W5Yiw5raI5oGvICovXHJcbiAgICBwcml2YXRlIG9uTG9naW5IYW5kbGVyKGRhdGEpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgIGlmKGRhdGEgIT09IHVuZGVmaW5lZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gXCLnmbvpmYbmiJDlip/vvIzov5vlhaXmuLjmiI/vvIFcIlxyXG4gICAgICAgICAgICBpZih0aGlzLnNwX3JlZ2lzdGVyQm94LnZpc2libGUpIHRleHQgPSBcIuazqOWGjOaIkOWKn++8jOWwhuebtOaOpei/m+WFpea4uOaIj++8gVwiO1xyXG4gICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKHRleHQpO1xyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODAwLHRoaXMsdGhpcy50b0dhbWVNYWluKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L+e5o6l5pyN5Yqh5ZmoICovXHJcbiAgICBwcml2YXRlIGNvbm5lY3RTZXJ2ZXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5jb25uZWN0KEdhbWVDb25maWcuSVAsR2FtZUNvbmZpZy5QT1JUKTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICBwcml2YXRlIHRvR2FtZU1haW4oKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICAvL1RPIERPIOi3s+i9rOiHs+a4uOaIj+Wkp+WOhVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1NvY2tldEhhbmRsZXJcIjtcclxuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDnlKjmiLfnmbvpmYbor7fmsYIg6L+U5Zue5aSE55CGXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyTG9naW5IYW5kbGVyIGV4dGVuZHMgU29ja2V0SGFuZGxlcntcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoY2FsbGVyOmFueSxjYWxsYmFjazpGdW5jdGlvbiA9IG51bGwpe1xyXG4gICAgICAgIHN1cGVyKGNhbGxlcixjYWxsYmFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgIHB1YmxpYyBleHBsYWluKGRhdGEpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB2YXIgUmVzVXNlckxvZ2luOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXNVc2VyTG9naW5cIik7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0gUmVzVXNlckxvZ2luLmRlY29kZShkYXRhKTtcclxuICAgICAgICBzdXBlci5leHBsYWluKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gICAgLyoq5aSE55CG5pWw5o2uICovXHJcbiAgICBwcm90ZWN0ZWQgc3VjY2VzcyhtZXNzYWdlKTp2b2lkXHJcbiAgICB7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIHN1cGVyLnN1Y2Nlc3MobWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuICAgICIsIi8qXHJcbiog5ri45oiP6YWN572uXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgLyoqaXAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBJUCA6IHN0cmluZyA9IFwiNDcuMTA3LjE2OS4yNDRcIjtcclxuICAgIC8qKuerr+WPoyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBQT1JUIDogbnVtYmVyID0gNzc3NyAgO1xyXG4gICAgLy8gLyoqaXAgLSDmnKzlnLDmtYvor5UqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBJUCA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCI7XHJcbiAgICAvLyAvKirnq6/lj6MgLSDmnKzlnLDmtYvor5UqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBQT1JUIDogbnVtYmVyID0gNzc3NztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuLyoq5Y2P6K6uICovXHJcbmV4cG9ydCBjbGFzcyBQcm90b2NvbHtcclxuICAgIC8vIC8vKioqKioqKioqKioqZ21NZXNzYWdlLnByb3RvXHJcbiAgICAvLyAvKirlj5HpgIFHTeWvhuS7pCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfR01fQ09NOm51bWJlciA9IDE5OTEwMTtcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKnVzZXJNZXNzYWdlLnByb3RvXHJcbiAgICAvLyAvKirms6jlhowgMjAyMTAyKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfUkVHSVNURVI6bnVtYmVyID0gMjAyMTAyO1xyXG4gICAgLy8gLyoq55m75b2V6K+35rGCIDIwMjEwMyovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX0xPR0lOOm51bWJlciA9IDIwMjEwMztcclxuXHJcbiAgICAvLyAvKirmnI3liqHlmajov5Tlm54qKioqKioqKioqKioqICovXHJcbiAgICAvLyAvKirnmbvlvZXov5Tlm54gMjAyMjAxKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9VU0VSX0xPR0lOOm51bWJlciA9IDIwMjIwMTtcclxuICAgIC8vIC8qKuacjeWKoeWZqOWIl+ihqCAyMDIyMDMqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NFUlZFUl9MSVNUOm51bWJlciA9IDIwMjIwMztcclxuICAgIC8vIC8qKuWFrOWRiumdouadvyAyMDIyMDQqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX05PVElDRV9CT0FSRDpudW1iZXIgPSAyMDIyMDQ7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKipsb2dpbk1lc3NhZ2UucHJvdG9cclxuICAgIC8vIC8qKuacjeWKoeWZqOeZu+W9leivt+axgiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfU0VSVl9MT0dJTjpudW1iZXIgPSAxMDExMDE7XHJcbiAgICAvLyAvKirlv4Pot7PljIXor7fmsYIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfSEVSVDpudW1iZXIgPSAxMDExMDI7XHJcbiAgICAvLyAvKiror7fmsYLop5LoibLkv6Hmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0NSRUFURV9QTEFZRVI6bnVtYmVyID0gMTAxMTAzO1xyXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xyXG4gICAgLy8gLyoq5b+D6Lez6L+U5ZueICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU0VSVl9IRVJUOm51bWJlciA9IDEwMTIwMTtcclxuICAgIC8vIC8qKui/lOWbnueZu+W9lemUmeivr+a2iOaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NFUlZfRVJST1I6bnVtYmVyID0gMTAxMjAyO1xyXG4gICAgLy8gLyoq6L+U5Zue6KKr6aG25LiL57q/ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU1VCU1RJVFVURTpudW1iZXIgPSAxMDEyMDM7XHJcblxyXG4gICAgLy8qKioqKioqKioqKioqKioqVXNlclByb3RvLnByb3RvXHJcbiAgICAvKiror7fmsYIgbXNnSWQgPSAxMDExMDMgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfTE9HSU4gOiBudW1iZXIgPSAxMDExMDM7XHJcbiAgICAvKioxMDExMDQg5rOo5YaM6K+35rGCICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX1JFR0lTVEVSIDogbnVtYmVyID0gMTAxMTA0O1xyXG4gICAgLyoq5ZON5bqUIG1zZ0lkID0gMTAxMjAzICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFU19VU0VSX0xPR0lOIDogbnVtYmVyID0gMTAxMjAzO1xyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqcGxheWVyTWVzc2FnZS5wcm90b1xyXG4gICAgLy8gLy/or7fmsYJcclxuICAgIC8vIC8qKuivt+axguaJreibiyBtc2dJZD0xMDIxMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0dBQ0hBOm51bWJlciA9IDEwMjEwMTtcclxuXHJcbiAgICAvLyAvKirmnI3liqHlmajov5Tlm54qKioqKioqKioqKioqICovXHJcbiAgICAvLyAvKirnmbvpmYbov5Tlm57op5LoibLln7rmnKzkv6Hmga8gIG1zZ0lkPTEwMjIwMSAgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QTEFZRVJfSU5GTzpudW1iZXIgPSAxMDIyMDE7XHJcbiAgICAvLyAvKirov5Tlm57mk43kvZzmiJDlip8gIG1zZ0lkPTEwMjIwMiAgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9PUFJFQVRFX1NVQ0NFU1M6bnVtYmVyID0gMTAyMjAyO1xyXG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5aSx6LSlICBtc2dJZD0xMDIyMDMgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfT1BSRUFURV9GQUlMOm51bWJlciA9IDEwMjIwMztcclxuICAgIC8vIC8qKui/lOWbnuinkuiJsuWPkeeUn+WPmOWMluWQjueahOWxnuaAp+S/oeaBryjliJfooagpICBtc2dJZD0xMDIyMDQgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9FUVVBTDpudW1iZXIgPSAxMDIyMDQ7XHJcbiAgICAvLyAvKirov5Tlm57op5LoibLlj5HnlJ/lj5jljJbnmoTlsZ7mgKfkv6Hmga8o5YiX6KGoKSAgbXNnSWQ9MTAyMjA1ICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BMQVlFUl9BVFRSSUJVVEVfVVBEQVRFOm51bWJlciA9IDEwMjIwNTtcclxuICAgIC8vIC8qKui/lOWbnuaJreibiyBtc2dJZD0xMDIyMDYgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfR0FDSEE6bnVtYmVyID0gMTAyMjA2O1xyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqc2tpbGxNZXNzYWdlLnByb3RvXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6K+35rGC5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6K+35rGC5omA5pyJ5oqA6IO95L+h5oGvIG1zZ0lkPTEwNzEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MTAxO1xyXG4gICAgLy8gLyoq6K+35rGC5Ye65oiY5oqA6IO95L+h5oGvIG1zZ0lkPTEwNzEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRklHSFRfU0tJTExfTElTVDpudW1iZXIgPSAxMDcxMDI7XHJcbiAgICAvLyAvKiror7fmsYLljYfnuqfmioDog70gbXNnSWQ9MTA3MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9VUF9TS0lMTDpudW1iZXIgPSAxMDcxMDM7XHJcbiAgICAvLyAvKiror7fmsYLph43nva7mioDog70gbXNnSWQ9MTA3MTA0XHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcxMDQ7XHJcbiAgICAvLyAvKiror7fmsYLmlLnlj5jmoLzlrZDmioDog70gbXNnSWQ9MTA3MTA1XHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjA1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9BTFRFUl9HUklEX1NLSUxMOm51bWJlciA9IDEwNzEwNTtcclxuXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue5omA5pyJ5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTExfU0tJTExfSU5GTzpudW1iZXIgPSAxMDcyMDE7XHJcbiAgICAvLyAvKirov5Tlm57lh7rmiJjmioDog73kv6Hmga8gIG1zZ0lkPTEwNzIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0ZJR0hUX1NLSUxMX0xJU1Q6bnVtYmVyID0gMTA3MjAyO1xyXG4gICAgLy8gLyoq6L+U5Zue5Y2H57qn5oqA6IO9ICBtc2dJZD0xMDcyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9VUF9TS0lMTDpudW1iZXIgPSAxMDcyMDM7XHJcbiAgICAvLyAvKirov5Tlm57ph43nva7mioDog73miJDlip/vvIzlrqLmiLfnq6/mlLbliLDmraTmtojmga/vvIzmnKzlnLDnp7vpmaTlhajpg6jmioDog70gIG1zZ0lkPTEwNzIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNzIwNDtcclxuICAgIC8vIC8qKui/lOWbnuaUueWPmOagvOWtkOaKgOiDvSAgbXNnSWQ9MTA3MjA1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfQUxURVJfR1JJRF9TS0lMTDpudW1iZXIgPSAxMDcyMDU7XHJcblxyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIHBldE1lc3NhZ2VcclxuICAgIC8vIC8qKuivt+axguWuoOeJqeWIneWni+WIm+W7uu+8iOWIm+W7uuinkuiJsuiOt+W+l+WIneWni+WuoOeJqe+8iSBtc2dJZD0xMDUxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDUyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SQU5ET01fQ1JFQVRFOm51bWJlciA9IDEwNTEwMTtcclxuICAgIC8vIC8qKuivt+axguaUueWPmOS4iumYteWuoOeJqeS/oeaBryBtc2dJZD0xMDUxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9BTFRFUl9HUklEOm51bWJlciA9IDEwNTEwMjtcclxuICAgIC8vIC8qKuivt+axguWWguWuoOeJqeWQg+mlrSBtc2dJZD0xMDUxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9GRUVEOm51bWJlciA9IDEwNTEwMztcclxuICAgIC8vIC8qKuivt+axguWuoOeJqeWQiOaIkCBtc2dJZD0xMDUxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9DT01QT1VORDpudW1iZXIgPSAxMDUxMDQ7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianpoobmgp/mioDog70gbXNnSWQ9MTA1MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MTA2O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp6YeN572u5oqA6IO9IG1zZ0lkPTEwNTEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNTEwNztcclxuICAgIC8vIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9TS0lMTF9VUDpudW1iZXIgPSAxMDUxMDg7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY0gbXNnSWQ9MTA1MTA5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA5ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HOm51bWJlciA9IDEwNTEwOTtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqei/m+WMliBtc2dJZD0xMDUxMTBcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9FVk9MVkU6bnVtYmVyID0gMTA1MTEwO1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0hBVENIOm51bWJlciA9IDEwNTExMTtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeeZu+iusCBtc2dJZD0xMDUxMTJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUxMTI7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MTEzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVRX01BVElORzpudW1iZXIgPSAxMDUxMTM7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MTE0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE0IOWmguaenOWuoOeJqeacrOi6q+acieeZu+iusOaVsOaNru+8jOS9hue5geihjeaVsOaNruaJvuS4jeWIsO+8iOi/lOWbnua2iOaBr21zZ0lkPTEwNTIxMuWSjG1zZ0lkPTEwNTIxM+abtOaWsOWuouaIt+err+aVsOaNru+8iSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElOR19BTExJTkZPOm51bWJlciA9IDEwNTExNDtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUxMTVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1Q6bnVtYmVyID0gMTA1MTE1O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5ZCM5oSP5oiW5ouS57udIG1zZ0lkPTEwNTExNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNu+8jOWmguaenOaYr+WQjOaEj++8jOWvueaWueeOqeWutuWmguaenOWcqOe6v++8jOS8muaUtuWIsG1zZ0lkPTEwNTIxMOa2iOaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElOR19DSE9PU0U6bnVtYmVyID0gMTA1MTE2O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55uu5qCH5Yi35pawIG1zZ0lkPTEwNTExN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElOR19UQVJHRVRfUkVGUkVTSDpudW1iZXIgPSAxMDUxMTc7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3nm67moIfmn6XnnIsgbXNnSWQ9MTA1MTE4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX1RBUkdFVF9MT09LOm51bWJlciA9IDEwNTExODtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqeaUvueUnyBtc2dJZD0xMDUxMTlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTggKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9GUkVFOm51bWJlciA9IDEwNTExOTtcclxuXHJcblxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iW1zZ0lkPTEwNTIwMSovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX0FMTF9JTkZPOm51bWJlciA9IDEwNTIwMTtcclxuICAgIC8vIC8vIOi/lOWbnuWuoOeJqeagvOWtkOS/oeaBryBtc2dJZD0xMDUyMDJcclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfR1JJRF9JTkZPOm51bWJlciA9IDEwNTIwMjtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeWIneWni+WIm+W7uu+8iOWIm+W7uuinkuiJsuiOt+W+l+WIneWni+WuoOeJqe+8iSBtc2dJZD0xMDUyMDMqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9SQU5ET01fQ1JFQVRFOm51bWJlciA9IDEwNTIwMztcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeetiee6p+WSjOe7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9MVl9FWFBfSU5GTzpudW1iZXIgPSAxMDUyMDQ7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianmioDog73nrYnnuqflkozmioDog73nu4/pqozkv6Hmga/vvIjmraTmtojmga/lnKjlrqDnianmioDog73nu4/pqozlj5HnlJ/lj5jljJblsLHkvJrov5Tlm57nu5nlrqLmiLfnq6/vvIkgbXNnSWQ9MTA1MjA1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA1O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp6aKG5oKf5oqA6IO9IG1zZ0lkPTEwNTIwNiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NUVURZX1NLSUxMOm51bWJlciA9IDEwNTIwNjtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUyMDcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDUyMDc7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianmioDog73ov5vpmLYgbXNnSWQ9MTA1MjA4ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MjA4O1xyXG5cclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeS6pOmFjSBtc2dJZD0xMDUyMDkgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdUOm51bWJlciA9IDEwNTIwOTtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeWinuWKoOe5geihjeasoeaVsCBtc2dJZD0xMDUyMTAgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9BRERfTUFUSU5HX0NPVU5UOm51bWJlciA9IDEwNTIxMDtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqei/m+WMliBtc2dJZD0xMDUyMTEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9FVk9MVkU6bnVtYmVyID0gMTA1MjExO1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTIxMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFR0lTVEVSOm51bWJlciA9IDEwNTIxMjtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeeUs+ivt+e5geihjSBtc2dJZD0xMDUyMTMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9SRVFfTUFUSU5HOm51bWJlciA9IDEwNTIxMztcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUyMTQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdfQUxMSU5GTzpudW1iZXIgPSAxMDUyMTQ7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MjE1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTIxNTtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUyMTYgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdfQ0hPT1NFOm51bWJlciA9IDEwNTIxNjtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUyMTcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0g6bnVtYmVyID0gMTA1MjE3O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5pS+55SfIG1zZ0lkPTEwNTIxOCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MjE4O1xyXG4gICAgXHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogZXF1aXBNZXNzYWdlXHJcbiAgICAvLyAvKiror7fmsYLoo4XlpIfmiZPpgKAgbXNnSWQ9MTA5MTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9NQUtFOm51bWJlciA9IDEwOTEwMTtcclxuICAgIC8vIC8qKuivt+axguijheWkh+WIhuinoyBtc2dJZD0xMDkxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDYgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX1NQTElUOm51bWJlciA9IDEwOTEwNlxyXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTE9DSzpudW1iZXIgPSAxMDkxMDQ7XHJcbiAgICAvLyAvKiror7fmsYLoo4XlpIflvLrljJYgbXNnSWQ9MTA5MTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9BVFRfQUREOm51bWJlciA9IDEwOTEwNTtcclxuICAgIC8vIC8qKuivt+axguijheWkh+epv+aItCBtc2dJZD0xMDkxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0xPQURJTkc6bnVtYmVyID0gMTA5MTAyO1xyXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5Y246L29IG1zZ0lkPTEwOTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfVU5MT0FESU5HOm51bWJlciA9IDEwOTEwMztcclxuXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfTUFLRSA9IDEwOTIwMTtcclxuICAgIC8vIC8qKui/lOWbnuijheWkh+WIhuinoyBtc2dJZD0xMDkyMDYgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX1NQTElUID0gMTA5MjA2O1xyXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5by65YyWIG1zZ0lkPTEwOTIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfQVRUX0FERCA9IDEwOTIwNTtcclxuICAgIC8vIC8qKui/lOWbnuijheWkh+epv+aItCBtc2dJZD0xMDkyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX0xPQURJTkcgPSAxMDkyMDI7XHJcbiAgICAvLyAvKirov5Tlm57oo4XlpIfljbjovb0gbXNnSWQ9MTA5MjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9VTkxPQURJTkcgPSAxMDkyMDM7XHJcbiAgICAvLyAvKirov5Tlm57oo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0NLID0gMTA5MjA0O1xyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIG1hcE1lc3NhZ2VcclxuICAgIC8vIC8qKuivt+axguWcsOWbvuaZrumAmuaImOaWl++8iOWuouaIt+err+S4gOWcuuaImOaWl+e7k+adn+S5i+WQjuWPkemAgeatpOa2iOaBr++8jOWGjei/m+ihjOWAkuiuoeaXtuWSjOacrOWcsOWBh+aImOaWl++8iSBtc2dJZD0xMDYxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9OT1JNQUxfRklHSFQ6bnVtYmVyID0gMTA2MTAxO1xyXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h5b+r6YCf5oiY5paXIG1zZ0lkPTEwNjEwNFx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NQRUVEX0ZJR0hUOm51bWJlciA9IDEwNjEwNDtcclxuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoeaImOaWlyBtc2dJZD0xMDYxMDVcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9TV0VFUF9GSUdIVDpudW1iZXIgPSAxMDYxMDU7XHJcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaHotK3kubDmiavojaEgbXNnSWQ9MTA2MTA2XHRcdC0tLS0t6L+U5Zue5raI5oGvIOi/lOWbnuaIkOWKn+a2iOaBr++8jGNvZGU9MTAwMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9CVVlfU1dFRVA6bnVtYmVyID0gMTA2MTA2O1xyXG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5YGH5oiY5paX57uT5p2f6aKG5Y+W5aWW5YqxIG1zZ0lkPTEwNjEwOVx0XHQtLS0tLei/lOWbnua2iOaBryDov5Tlm57miJDlip/mtojmga/vvIxjb2RlPTEwNjIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX05PUk1BTF9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTA5O1xyXG4gICAgLy8gLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9UUlVFX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYxMDI7XHJcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaFib3Nz5oiY5paXIG1zZ0lkPTEwNjEwM1x0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NDRU5FX0ZJR0hUOm51bWJlciA9IDEwNjEwMztcclxuICAgIC8vIC8qKuivt+axguWIh+aNouWcsOWbvuWFs+WNoSBtc2dJZD0xMDYxMDhcdFx0LS0tLS3ov5Tlm57mtojmga8g5Ymv5pysaWTlkozlhbPljaFpZCDlsZ7mgKflj5jljJbmtojmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9DSEFOR0VfU0NFTkU6bnVtYmVyID0gMTA2MTA4O1xyXG5cclxuXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue56a757q/5ZKM5omr6I2h5pS255uK5L+h5oGvIG1zZ0lkPTEwNjIwMiovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19PRkZfTElORV9BV0FSRF9JTkZPOm51bWJlciA9IDEwNjIwMjtcclxuICAgIC8vIC8qKui/lOWbnuaImOaWl+aSreaUvue7k+adn+WPkeaUvuWlluWKse+8iOW6lOeUqOS6juaJgOacieaImOaWl++8iSBtc2dJZD0xMDYyMDMqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRklHSFRfRU5EOm51bWJlciA9IDEwNjIwMztcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBwYWNrTWVzc2FnZVxyXG4gICAgLy8gLyoq5L2/55So6YGT5YW35raI5oGvICBtc2dJZD0xMDQxMDEg6L+U5Zue5pON5L2c5oiQ5Yqf5raI5oGvICBtc2dJZD0xMDIyMDIgY29kZT0xMDAwMe+8iOaaguWumu+8jOagueaNruWunumZheS9v+eUqOaViOaenOWGjeWBmu+8iSovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9VU0U6bnVtYmVyID0gMTA0MTAxO1xyXG5cclxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAvKirov5Tlm57og4zljIXljZXkuKrpgZPlhbflj5jljJbkv6Hmga8gIG1zZ0lkPTEwNDIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUFJPUF9JTkZPOm51bWJlciA9IDEwNDIwMjtcclxuICAgIC8vIC8qKui/lOWbnuiDjOWMheaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iSAgbXNnSWQ9MTA0MjAxKOacieWPr+iDveS4uuepuuWIl+ihqCkqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEFDS19BTExfSU5GTzpudW1iZXIgPSAxMDQyMDE7XHJcbiAgICAvLyAvKirov5Tlm57og4zljIXljZXkuKroo4XlpIflj5jljJbkv6Hmga8gbXNnSWQ9MTA0MjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9JTkZPOm51bWJlciA9IDEwNDIwMztcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKioqIGZpZ2h0TWVzc2FnZVxyXG4gICAgLy8gLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9PUEVOX01BSUw6bnVtYmVyID0gMTExMTAxO1xyXG4gICAgLy8gLyoq6K+35rGC6aKG5Y+W6YKu5Lu25aWW5YqxIG1zZ0lkPTExMTEwMlx0XHQtLS0tLei/lOWbnua2iOaBryAgbXNnSWQ9MTExMjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0FXQVJEOm51bWJlciA9IDExMTEwMjtcclxuICAgIC8vIC8qKuivt+axguWIoOmZpOmCruS7tiBtc2dJZD0xMTExMDNcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFJTF9ERUxFVEU6bnVtYmVyID0gMTExMTAzO1xyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnumCruS7tuS/oeaBryBtc2dJZD0xMTEyMDHvvIjnmbvpmYbkuLvliqjov5Tlm54g5oiW6ICFIOWPkeeUn+WPmOWMlui/lOWbnu+8iSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9JTkZPOm51bWJlciA9IDExMTIwMTtcclxuICAgIC8vIC8qKui/lOWbnumCruS7tuW3sumihuWPluaIkOWKnyBtc2dJZD0xMTEyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX01BSUxfQVdBUkQ6bnVtYmVyID0gMTExMjAyO1xyXG4gICAgLy8gLyoq6L+U5Zue5Yig6Zmk6YKu5Lu25oiQ5YqfIG1zZ0lkPTExMTIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9ERUxFVEU6bnVtYmVyID0gMTExMjAzO1xyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqKiogZmlnaHRNZXNzYWdlXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue5LiA5Zy65oiY5paX5pel5b+XIG1zZ0lkPTEwODIwMSovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19UUlVFX0ZJR0hUX0xPR19JTkZPOm51bWJlciA9IDEwODIwMTtcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKioqIGZyaWVuZE1lc3NhZ2VcclxuICAgIC8vIC8qKuivt+axguWlveWPi+aOqOiNkCBtc2dJZD0xMTIxMDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9QVVNIOm51bWJlciA9IDExMjEwMTtcclxuICAgIC8vIC8qKuivt+axguWlveWPi+aQnOe0oiBtc2dJZD0xMTIxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9TRUFSQ0g6bnVtYmVyID0gMTEyMTAyO1xyXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0FQUExZOm51bWJlciA9IDExMjEwMztcclxuICAgIC8vIC8qKuivt+axguWlveWPi+aTjeS9nCBtc2dJZD0xMTIxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9PUEVSQVRJT046bnVtYmVyID0gMTEyMTA0O1xyXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L6K+m57uG5L+h5oGvIG1zZ0lkPTExMjEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX01PUkVfSU5GTzpudW1iZXIgPSAxMTIxMDU7XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfR0lGVDpudW1iZXIgPSAxMTIxMDZcclxuICAgIC8vIC8qKuivt+axguWlveWPi+aJgOacieS/oeaBryBtc2dJZD0xMTIxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BbGxfSW5mbzpudW1iZXIgPSAxMTIxMDc7XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vliIfno4sgbXNnSWQ9MTEyMTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA4MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfRklHSFQ6bnVtYmVyID0gMTEyMTA4O1xyXG5cclxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmjqjojZAgbXNnSWQ9MTEyMjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIyMDE7XHJcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmkJzntKIgbXNnSWQ9MTEyMjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfU0VBUkNIOm51bWJlciA9IDExMjIwMjtcclxuICAgIC8vIC8qKui/lOWbnuWlveWPi+eUs+ivtyBtc2dJZD0xMTIyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9BUFBMWTpudW1iZXIgPSAxMTIyMDM7XHJcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmk43kvZwgbXNnSWQ9MTEyMjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjIwNDtcclxuICAgIC8vIC8qKui/lOWbnuWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIyMDUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9NT1JFX0lORk86bnVtYmVyID0gMTEyMjA1O1xyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L6YCB56S8IG1zZ0lkPTExMjIwNiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX0dJRlQ6bnVtYmVyID0gMTEyMjA2O1xyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjIwNyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX0FMTF9JTkZPOm51bWJlciA9IDExMjIwNzsgICAgXHJcblxyXG59IiwiaW1wb3J0IEZsb2F0TXNnIGZyb20gXCIuLi9Ub29sL0Zsb2F0TXNnXCI7XHJcbmltcG9ydCBUb29sIGZyb20gXCIuLi9Ub29sL1Rvb2xcIjtcclxuXHJcbi8qKlxyXG4gKiDmtojmga/mmL7npLrnrqHnkIblmahcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2VNYW5hZ2VyIHtcclxuICAgIC8qKuWNleS+iyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnMgOiBNZXNzYWdlTWFuYWdlciA9IG5ldyBNZXNzYWdlTWFuYWdlcjtcclxuICAgIC8qKuWxj+W5leaLpeacieeahOa1ruWKqOa2iOaBr+iuoeaVsCovXHJcbiAgICBwdWJsaWMgY291bnRGbG9hdE1zZyA6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5jb3VudEZsb2F0TXNnID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa1ruWKqOa2iOaBr+mihOeDrSzvvIzmj5DliY3mlrDlu7rkuIDkuKpmbG9hdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbmV3RmxvYXRNc2coKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgZmxvYXRNc2cgPSBuZXcgRmxvYXRNc2coKTtcclxuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZsb2F0TXNnKTtcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsZmxvYXRNc2cpOyBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaYvuekuua1ruWKqOa2iOaBr1xyXG4gICAgICogQHBhcmFtIHRleHQgIOaYvuekuua2iOaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd0Zsb2F0TXNnKHRleHQ6c3RyaW5nKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgZmxvYXRNc2cgOiBGbG9hdE1zZyA9IExheWEuUG9vbC5nZXRJdGVtKFwiRmxvYXRNc2dcIik7XHJcbiAgICAgICAgaWYoTGF5YS5Qb29sLmdldFBvb2xCeVNpZ24oXCJGbG9hdE1zZ1wiKS5sZW5ndGggPT0gMCkgdGhpcy5uZXdGbG9hdE1zZygpO1xyXG4gICAgICAgIGlmKGZsb2F0TXNnICA9PT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZsb2F0TXNnID0gbmV3IEZsb2F0TXNnKCk7XHJcbiAgICAgICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmxvYXRNc2cpOyAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZsb2F0TXNnLnpPcmRlciA9IDEwMCArIHRoaXMuY291bnRGbG9hdE1zZztcclxuICAgICAgICBjb25zb2xlLmxvZyhUb29sLmdldENlbnRlclgoKSk7XHJcbiAgICAgICAgZmxvYXRNc2cuc2hvd01zZyh0ZXh0LHt4OlRvb2wuZ2V0Q2VudGVyWCgpICsgdGhpcy5jb3VudEZsb2F0TXNnKjIwLHk6IDM3NSArIHRoaXMuY291bnRGbG9hdE1zZyoyMH0pO1xyXG4gICAgICAgIHRoaXMuY291bnRGbG9hdE1zZysrO1xyXG4gICAgfVxyXG5cclxufSIsImltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuL1dlYlNvY2tldE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgUHJvdG9jb2wgfSBmcm9tIFwiLi4vQ29uc3QvR2FtZUNvbmZpZ1wiO1xyXG5cclxuLypcclxuKiDlrqLmiLfnq6/lj5HpgIHlmahcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50U2VuZGVye1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICog55So5oi355m75b2VIDEwMTEwM1xyXG4gICAgKiBAcGFyYW0gdXNlck5hbWUgXHJcbiAgICAqIEBwYXJhbSB1c2VyUGFzcyBcclxuICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcVVzZXJMb2dpbih1c2VyTmFtZTpzdHJpbmcsdXNlcktleTpzdHJpbmcpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB2YXIgUmVxVXNlckxvZ2luOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVc2VyTG9naW5cIik7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xyXG4gICAgICAgIG1lc3NhZ2UudXNlcktleSA9IHVzZXJLZXk7XHJcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZXJMb2dpbi5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFUl9MT0dJTixidWZmZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDnlKjmiLfms6jlhowgMTAxMTA0XHJcbiAgICAgKiBAcGFyYW0gdXNlck5hbWUgXHJcbiAgICAqIEBwYXJhbSB1c2VyUGFzcyBcclxuICAgICogQHBhcmFtIHVzZXJOaWNrTmFtZVxyXG4gICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVxVXNlclJlZ2lzdGVyKHVzZXJOYW1lOnN0cmluZyx1c2VyS2V5OnN0cmluZyx1c2VyTmlja05hbWU6c3RyaW5nKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlcVVzZXJSZWdpc3RlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxVXNlclJlZ2lzdGVyXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgICAgIHZhciB1c2VyRGF0YTphbnkgPSB7fTtcclxuICAgICAgICBtZXNzYWdlLnVzZXJOYW1lID0gdXNlck5hbWU7XHJcbiAgICAgICAgbWVzc2FnZS51c2VyS2V5ID0gdXNlcktleTtcclxuICAgICAgICB1c2VyRGF0YS5uaWNrTmFtZSA9IHVzZXJOaWNrTmFtZTtcclxuICAgICAgICB1c2VyRGF0YS5sdiA9IDE7XHJcbiAgICAgICAgbWVzc2FnZS51c2VyRGF0YSA9IHVzZXJEYXRhO1xyXG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyUmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfUkVHSVNURVIsYnVmZmVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqKua2iOaBr+WPkemAgSovXHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKip3ZWJTb2NrZXQgKi9cclxuICAgIC8qKuWPkemAgUdN5a+G5LukICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUdtTXNnKGdtOnN0cmluZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFHTUNvbW06YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdNQ29tbVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLmNvbW0gPSBnbTtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR01Db21tLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9HTV9DT00sYnVmZmVyKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKirlv4Pot7PljIUgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgc2VydkhlYXJ0UmVxKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1NFUlZfSEVSVCk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOeUqOaIt+azqOWGjFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUmVxKHVzZXJOYW1lOnN0cmluZyx1c2VyUGFzczpzdHJpbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUmVnaXN0ZXJVc2VyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFSZWdpc3RlclVzZXJcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudXNlclBhc3MgPSB1c2VyUGFzcztcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUmVnaXN0ZXJVc2VyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOeZu+W9leacjeWKoeWZqFxyXG4vLyAgICAgICogQHBhcmFtIHRva2VuIFxyXG4vLyAgICAgICogQHBhcmFtIHNlcnZJZCBcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBsb2dpblNlcnZSZXEoc2VydklkOm51bWJlcik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTG9naW5cIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5jb2RlID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpbkF1dGhlbnRpY2F0aW9uO1xyXG4vLyAgICAgICAgIG1lc3NhZ2Uuc2VydmVySWQgPSBzZXJ2SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5hZ2VudElkID0gMTtcclxuLy8gICAgICAgICBtZXNzYWdlLmNsaWVudElkID0gMTtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTG9naW4uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1NFUlZfTE9HSU4sYnVmZmVyKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog5Yib5bu66KeS6ImyXHJcbi8vICAgICAgKiBAcGFyYW0gc2V4IFxyXG4vLyAgICAgICogQHBhcmFtIHBsYXllck5hbWUgXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUGxheWVyUmVxKHNleDpudW1iZXIscGxheWVyTmFtZTpzdHJpbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxQ3JlYXRlUGxheWVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFDcmVhdGVQbGF5ZXJcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5nZW5kZXIgPSBzZXg7XHJcbi8vICAgICAgICAgbWVzc2FnZS5wbGF5ZXJOYW1lID0gcGxheWVyTmFtZTtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQ3JlYXRlUGxheWVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9DUkVBVEVfUExBWUVSLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5omA5pyJ5oqA6IO95L+h5oGvICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUFsbFNraWxsSW5mbygpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9BTExfU0tJTExfSU5GTyk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlh7rmiJjmioDog73kv6Hmga8gKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRmlnaHRTa2lsbExpc3QoKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRklHSFRfU0tJTExfTElTVCk7ICAgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLljYfnuqfmioDog70gKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXBTa2lsbChza2lsbFVwTHZWb3M6QXJyYXk8U2tpbGxVcEx2Vm8+KTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVVwU2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVwU2tpbGxcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QgPSBbXTtcclxuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XHJcbi8vICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHNraWxsVXBMdlZvcy5sZW5ndGg7aSsrKVxyXG4vLyAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgaW5mbyA9IHt9O1xyXG4vLyAgICAgICAgICAgICBpbmZvLnNraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0uc2tpbGxJZDtcclxuLy8gICAgICAgICAgICAgaW5mby50b1NraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0udG9Ta2lsbElkO1xyXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnNraWxsTGlzdC5wdXNoKGluZm8pO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXBTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVBfU0tJTEwsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLph43nva7mioDog70gKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUmVzZXRTa2lsbCgpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9SRVNFVF9TS0lMTCk7ICAgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLkvb/nlKjpgZPlhbcgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXNlKHByb3BJZDpMb25nLG51bTpudW1iZXIsYXJncz86c3RyaW5nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVVzZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxVXNlXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UubnVtID0gbnVtO1xyXG4vLyAgICAgICAgIGlmKGFyZ3MpXHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuYXJncyA9IGFyZ3M7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFLGJ1ZmZlcik7ICBcclxuLy8gICAgIH1cclxuICAgIFxyXG4vLyAgICAgLyoq6K+35rGC5a6g54mp5ZCI5oiQICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldENvbXBvdW5kKHByb3BJZDpMb25nKVxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRDb21wb3VuZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0Q29tcG91bmRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wSWQgPSBwcm9wSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldENvbXBvdW5kLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfQ09NUE9VTkQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6K+35rGC5ZaC5a6g54mp5ZCD6aWtKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RmVlZChwZXRJZDpMb25nLHByb3BMaXN0OkFycmF5PFByb3BWbz4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0RmVlZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0RmVlZFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wTGlzdCA9IHByb3BMaXN0O1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRGZWVkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRkVFRCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuXHJcblxyXG4vLyAgICAgLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUFsdGVyR3JpZFNraWxsKHR5cGU6bnVtYmVyLHNraWxsVXBHcmlkOlNraWxsVXBHcmlkVm8pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxQWx0ZXJHcmlkU2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUFsdGVyR3JpZFNraWxsXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7ICAgICAgICBcclxuLy8gICAgICAgICB2YXIgdm86YW55ID0ge307XHJcbi8vICAgICAgICAgdm8uZ3JpZElkID0gc2tpbGxVcEdyaWQuZ3JpZElkO1xyXG4vLyAgICAgICAgIHZvLnNraWxsSWQgPSBza2lsbFVwR3JpZC5za2lsbElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ3JpZCA9IHZvOyAgICAgICAgXHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUFsdGVyR3JpZFNraWxsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTsgICAgICAgIFxyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0FMVEVSX0dSSURfU0tJTEwsYnVmZmVyKTsgICBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguaUueWPmOWuoOeJqemYteWei+agvOWtkCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRBbHRlckdyaWQodHlwZTpudW1iZXIsZ3JpZExpc3Q6QXJyYXk8TGluZXVwR3JpZFZvPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRBbHRlckdyaWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEFsdGVyR3JpZFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QgPSBbXTtcclxuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XHJcbi8vICAgICAgICAgZm9yKHZhciBpID0gMDtpIDwgZ3JpZExpc3QubGVuZ3RoO2krKylcclxuLy8gICAgICAgICB7XHJcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcclxuLy8gICAgICAgICAgICAgaW5mby5ncmlkSWQgPSBncmlkTGlzdFtpXS5ncmlkSWQ7XHJcbi8vICAgICAgICAgICAgIGluZm8ucGV0SWQgPSBncmlkTGlzdFtpXS5oZXJvSWQ7XHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QucHVzaChpbmZvKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEFsdGVyR3JpZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0FMVEVSX0dSSUQsYnVmZmVyKTsgICBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5omt6JuLIG1zZ0lkPTEwMjEwMVxyXG4vLyAgICAgICogQHBhcmFtIG1vbmV5VHlwZSAvLyDmia3om4vnsbvlnosgMD3ph5HluIHmir0gMT3pkrvnn7Pmir1cclxuLy8gICAgICAqIEBwYXJhbSBudW1UeXBlIOasoeaVsOexu+WeiyAwPeWFjei0ueWNleaKvSAxPeWNleaKvSAyPeWNgei/nuaKvVxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUdhY2hhKG1vbmV5VHlwZTpudW1iZXIsbnVtVHlwZTpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxR2FjaGE6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdhY2hhXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IG1vbmV5VHlwZTtcclxuLy8gICAgICAgICBtZXNzYWdlLm51bVR5cGUgPSBudW1UeXBlO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFHYWNoYS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfR0FDSEEsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyAqL1xyXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU3BlZWRGaWdodCgpOnZvaWRcclxuLy8gICAgICB7XHJcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TUEVFRF9GSUdIVCk7XHJcbi8vICAgICAgfVxyXG5cclxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHotK3kubDmiavojaEgKi9cclxuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcEJ1eVN3ZWVwKCk6dm9pZFxyXG4vLyAgICAgIHtcclxuLy8gICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX0JVWV9TV0VFUCk7XHJcbi8vICAgICAgfSAgIFxyXG5cclxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHmiavojaEgICovXHJcbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTd2VlcEZpZ2h0KHNjZW5lSWQ6bnVtYmVyKTp2b2lkXHJcbi8vICAgICAge1xyXG4vLyAgICAgICAgICB2YXIgIFJlcU1hcFN3ZWVwRmlnaHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hcFN3ZWVwRmlnaHRcIik7XHJcbi8vICAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgICBtZXNzYWdlLnNjZW5lSWQgPSBzY2VuZUlkO1xyXG4vLyAgICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFwU3dlZXBGaWdodC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TV0VFUF9GSUdIVCxidWZmZXIpO1xyXG4vLyAgICAgIH1cclxuXHJcbi8vICAgICAvKirpmo/mnLrliJvlu7rkuIDmnaHpvpkgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmFuZG9tQ3JlYXRlKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SQU5ET01fQ1JFQVRFKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWcsOWbvuaZrumAmuaImOaWl++8iOWuouaIt+err+S4gOWcuuaImOaWl+e7k+adn+S5i+WQjuWPkemAgeatpOa2iOaBr++8jOWGjei/m+ihjOWAkuiuoeaXtuWSjOacrOWcsOWBh+aImOaWl++8iSBtc2dJZD0xMDYxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDEgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHQoKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX05PUk1BTF9GSUdIVCk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlhbPljaHlgYfmiJjmlpfnu5PmnZ/pooblj5blpZblirEgbXNnSWQ9MTA2MTA5XHRcdC0tLS0t6L+U5Zue5raI5oGvIOi/lOWbnuaIkOWKn+a2iOaBr++8jGNvZGU9MTA2MjAzICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcE5vcm1hbEZpZ2h0RW5kKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9OT1JNQUxfRklHSFRfRU5EKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcFNjZW5lRmlnaHQoKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NDRU5FX0ZJR0hUKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWRiuivieacjeWKoeWZqOaImOaWl+aSreaUvue7k+adn++8iOS7heS7heW6lOeUqOS6juaJgOacieecn+aImOaWl++8iSBtc2dJZD0xMDYxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDMgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVHVyZUZpZ2h0RW5kKCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1RSVUVfRklHSFRfRU5EKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5YiH5o2i5Zyw5Zu+5YWz5Y2hIG1zZ0lkPTEwNjEwOFx0XHQtLS0tLei/lOWbnua2iOaBryDlia/mnKxpZOWSjOWFs+WNoWlkIOWxnuaAp+WPmOWMlua2iOaBr1xyXG4vLyAgICAgICogQHBhcmFtIHNjZW5lSWQgXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwQ2hhbmdlU2NlbmUoc2NlbmVJZDpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTWFwQ2hhbmdlU2NlbmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hcENoYW5nZVNjZW5lXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2Uuc2NlbmVJZCA9IHNjZW5lSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1hcENoYW5nZVNjZW5lLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfQ0hBTkdFX1NDRU5FLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqeS6pOmFjSBtc2dJZD0xMDUxMDlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDlcclxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEgXHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQyIFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZyhwZXRJZDE6TG9uZyxwZXRJZDI6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ1wiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkMSA9IHBldElkMTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkMiA9IHBldElkMjtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqei/m+WMliBtc2dJZD0xMDUxMTBcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTFcclxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEg6L+b5YyW5a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSBiZVBldElkTGlzdCDmtojogJflrqDnialpZOWIl+ihqFxyXG4vLyAgICAgICogQHBhcmFtIHByb3BJZCDmtojogJfpgZPlhbfllK/kuIBpZFxyXG4vLyAgICAgICogQHBhcmFtIHByb3BOdW0g5raI6ICX6YGT5YW35pWw6YePXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RXZvbHZlKHBldElkOkxvbmcsYmVQZXRJZExpc3Q6QXJyYXk8TG9uZz4scHJvcElkTGlzdDpBcnJheTxMb25nPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRFdm9sdmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEV2b2x2ZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgaWYoYmVQZXRJZExpc3QubGVuZ3RoID4gMClcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5iZVBldElkTGlzdCA9IGJlUGV0SWRMaXN0O1xyXG4vLyAgICAgICAgIGlmKHByb3BJZExpc3QubGVuZ3RoID4gMClcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5wcm9wSWRMaXN0ID0gcHJvcElkTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0RXZvbHZlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRVZPTFZFLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqeWtteWMliBtc2dJZD0xMDUxMTFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDNcclxuLy8gICAgICAqIEBwYXJhbSBlZ2dJZCDlrqDnianom4vllK/kuIBpZFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEhhdGNoKGVnZ0lkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0SGF0Y2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEhhdGNoXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZWdnSWQgPSBlZ2dJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0SGF0Y2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9IQVRDSCxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MTEyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEyXHJcbi8vICAgICAgKiBAcGFyYW0gZWdnSWQg5a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWQg6ZyA6KaB5ZOB6LSo5p2h5Lu2aWQoMOihqOekuuS4jemZkOWItilcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZWdpc3RlcihwZXRJZDpMb25nLHF1YWxpdHlJZDpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0UmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlZ2lzdGVyXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZCA9IHF1YWxpdHlJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRUdJU1RFUixidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MTEzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEzXHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg6K+35rGC5pa55a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOaOpeaUtuaWueWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmVxTWF0aW5nKHBldElkOkxvbmcsdG9QZXRJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldFJlcU1hdGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVxTWF0aW5nXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGV0SWQgPSB0b1BldElkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRSZXFNYXRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRVFfTUFUSU5HLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUxMTRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTRcclxuLy8gICAgICAqIEBwYXJhbSBwZXRUeXBlICAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXHJcbi8vICAgICAgKiBAcGFyYW0gY29uZmlnSWQg5a6g54mp6YWN572uaWTvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciAg5a6g54mp5oCn5Yir77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWRMaXN0IOWuoOeJqeWTgei0qGlk77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdBbGxJbmZvKHBldFR5cGU6bnVtYmVyLGNvbmZpZ0lkOm51bWJlcixnZW5kZXI6bnVtYmVyLHF1YWxpdHlJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdBbGxJbmZvOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdBbGxJbmZvXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0VHlwZSA9IHBldFR5cGU7XHJcbi8vICAgICAgICAgbWVzc2FnZS5jb25maWdJZCA9IGNvbmZpZ0lkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gZ2VuZGVyO1xyXG4vLyAgICAgICAgIGlmKHF1YWxpdHlJZExpc3QubGVuZ3RoID4gMClcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWRMaXN0ID0gcXVhbGl0eUlkTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQWxsSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19BTExJTkZPLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUxMTVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTVcclxuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDlrqDnianllK/kuIBpZFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFNlbGVjdFJlcUxpc3QocGV0SWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRTZWxlY3RSZXFMaXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTZWxlY3RSZXFMaXN0XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2VsZWN0UmVxTGlzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NFTEVDVF9SRVFfTElTVCxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MTE2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE277yM5aaC5p6c5piv5ZCM5oSP77yM5a+55pa5546p5a625aaC5p6c5Zyo57q/77yM5Lya5pS25YiwbXNnSWQ9MTA1MjEw5raI5oGvXHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg5oiR5pa55a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOWvueaWueWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKiBAcGFyYW0gaXNDb25zZW50IOaYr+WQpuWQjOaEjyB0cnVlPeWQjOaEj1xyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ0Nob29zZShwZXRJZDpMb25nLHRvUGV0SWQ6TG9uZyxpc0NvbnNlbnQ6Ym9vbGVhbik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdDaG9vc2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ0Nob29zZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmlzQ29uc2VudCA9IGlzQ29uc2VudDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQ2hvb3NlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX0NIT09TRSxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nm67moIfliLfmlrAgbXNnSWQ9MTA1MTE3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE3XHJcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXHJcbi8vICAgICAgKiBAcGFyYW0gY29uZmlnSWQg5a6g54mp6YWN572uaWTvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciDlrqDnianmgKfliKvvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIHF1YWxpdHlJZExpc3Qg5a6g54mp5ZOB6LSoaWTvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2gocGV0VHlwZTpudW1iZXIsY29uZmlnSWQ6bnVtYmVyLGdlbmRlcjpudW1iZXIscXVhbGl0eUlkTGlzdDpBcnJheTxudW1iZXI+KTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2hcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRUeXBlID0gcGV0VHlwZTtcclxuLy8gICAgICAgICBtZXNzYWdlLmNvbmZpZ0lkID0gY29uZmlnSWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5nZW5kZXIgPSBnZW5kZXI7XHJcbi8vICAgICAgICAgaWYocXVhbGl0eUlkTGlzdC5sZW5ndGggPiAwKVxyXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZExpc3QgPSBxdWFsaXR5SWRMaXN0O1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNILGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMThcclxuLy8gICAgICAqIEBwYXJhbSB0b1BsYXllcklkIOiiq+afpeeci+WuoOeJqeeahOS4u+S6uueahGlkXHJcbi8vICAgICAgKiBAcGFyYW0gdG9QZXRJZCDooqvmn6XnnIvlrqDnianllK/kuIBpZFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ1RhcmdldExvb2sodG9QbGF5ZXJJZDpMb25nLHRvUGV0SWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRMb29rOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRMb29rXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nVGFyZ2V0TG9vay5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19DSE9PU0UsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuXHJcblxyXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAxICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwTWFrZShwcm9wSWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFFcXVpcE1ha2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTWFrZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDsgICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcE1ha2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX01BS0UsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKiror7fmsYLoo4XlpIfliIbop6MgbXNnSWQ9MTA5MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA2ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwU3BsaXQoZXF1aXBJZDpBcnJheTxMb25nPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFFcXVpcFNwbGl0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcFNwbGl0XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBTcGxpdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfU1BMSVQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvY2socGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRXF1aXBMb2NrOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcExvY2tcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2NrLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9MT0NLLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKuivt+axguijheWkh+W8uuWMliBtc2dJZD0xMDkxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDUgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBBdHRBZGQocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcsbHVja051bTpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRXF1aXBMb2NrOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcExvY2tcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7IFxyXG4vLyAgICAgICAgIG1lc3NhZ2UubHVja051bSA9IGx1Y2tOdW07ICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvY2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX0FUVF9BREQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vIFx0Lyoq6K+35rGC6KOF5aSH56m/5oi0IG1zZ0lkPTEwOTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvYWRpbmcocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2FkaW5nXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvYWRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX0xPQURJTkcsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLoo4XlpIfljbjovb0gbXNnSWQ9MTA5MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAzICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwVW5Mb2FkaW5nKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKVxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFFcXVpcFVuTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBVbkxvYWRpbmdcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICAgICAgICAgXHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwVW5Mb2FkaW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9VTkxPQURJTkcsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vIFx0Lyoq6K+35rGC5a6g54mp6aKG5oKf5oqA6IO9IG1zZ0lkPTEwNTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTdHVkeVNraWxsKHBldElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0U3R1ZHlTa2lsbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U3R1ZHlTa2lsbFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFN0dWR5U2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TVFVEWV9TS0lMTCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXNldFNraWxsKHBldElkOkxvbmcsc2tpbGxJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRSZXNldFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRSZXNldFNraWxsXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgXHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIGlmKHNraWxsSWRMaXN0Lmxlbmd0aCA+IDApXHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZExpc3QgPSBza2lsbElkTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVzZXRTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1JFU0VUX1NLSUxMLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5a6g54mp5oqA6IO96L+b6Zi2IG1zZ0lkPTEwNTEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFQZXRTa2lsbFVwKHBldElkOkxvbmcsc2tpbGxJZDpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0U2tpbGxVcDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U2tpbGxVcFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbElkID0gc2tpbGxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2tpbGxVcC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NLSUxMX1VQLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gLyoq6K+35rGC5a6g54mp5pS+55SfIG1zZ0lkPTEwNTExOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRGcmVlKHBldElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVzUGV0RnJlZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzUGV0RnJlZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlc1BldEZyZWUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9GUkVFLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAyICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxBd2FyZChtYWlsSWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFNYWlsQXdhcmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxBd2FyZFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbEF3YXJkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0FXQVJELGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAzICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxEZWxldGUobWFpbElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTWFpbERlbGV0ZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbERlbGV0ZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbERlbGV0ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9ERUxFVEUsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU9wZW5NYWlsKG1haWxJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcU9wZW5NYWlsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFPcGVuTWFpbFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxT3Blbk1haWwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX09QRU5fTUFJTCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axgumihuWPlumCruS7tuWlluWKsSBtc2dJZD0xMTExMDJcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsQXdhcmQobWFpbElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTWFpbEF3YXJkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsQXdhcmRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxBd2FyZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9BV0FSRCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWIoOmZpOmCruS7tiBtc2dJZD0xMTExMDNcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsRGVsZXRlKG1haWxJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcU1haWxEZWxldGU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxEZWxldGVcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxEZWxldGUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfREVMRVRFLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMSAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRQdXNoKCk6dm9pZFxyXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9QVVNIKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZFNlYXJjaCh0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kU2VhcmNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRTZWFyY2hcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kU2VhcmNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfU0VBUkNILGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRBcHBseSh0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kQXBwbHk6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEFwcGx5XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEFwcGx5LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfQVBQTFksYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vmk43kvZwgbXNnSWQ9MTEyMTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA0ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZE9wZXJhdGlvbih0eXBlOm51bWJlcix0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kT3BlcmF0aW9uOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRPcGVyYXRpb25cIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTtcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRPcGVyYXRpb24uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9PUEVSQVRJT04sYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA1ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZE1vcmVJbmZvKHRvUGxheWVySWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRNb3JlSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kTW9yZUluZm9cIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRNb3JlSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX01PUkVfSU5GTyxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWlveWPi+mAgeekvCBtc2dJZD0xMTIxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDYgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kR2lmdChnaWZ0SWQ6bnVtYmVyLHRvUGxheWVySWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRHaWZ0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRHaWZ0XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgICAgICAgXHJcbi8vICAgICAgICAgbWVzc2FnZS5naWZ0SWQgPSBnaWZ0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kR2lmdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0dJRlQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA3ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEFsbEluZm8oKTp2b2lkXHJcbi8vICAgICB7ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0FsbF9JbmZvKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vliIfno4sgbXNnSWQ9MTEyMTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA4MjAxICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEZpZ2h0KHRvUGxheWVySWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRGaWdodDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kRmlnaHRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRGaWdodC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0ZJR0hULGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKirnmbvlvZXor7fmsYIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgbG9naW5SZXEoYWNjb3VudDpzdHJpbmcpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgTG9naW5SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJMb2dpblJlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5uYW1lID0gYWNjb3VudDtcclxuICAgIC8vICAgICBtZXNzYWdlLnRva2VuID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpblRva2VuO1xyXG4gICAgLy8gICAgIG1lc3NhZ2Uubmlja25hbWUgPSBcInhpZWxvbmdcIjtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gTG9naW5SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlVTRVJfTE9HSU4sUHJvdG9jb2wuVVNFUl9MT0dJTl9DTUQsYnVmZmVyKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKuiOt+WPluiLsembhOS/oeaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBnZXRIZXJvSW5mb1JlcShzdGF0dXNDb2RlOm51bWJlcik6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBIZXJvSW5mb1JlcXVlc3Q6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkhlcm9JbmZvUmVxdWVzdFwiKTtcclxuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xyXG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBIZXJvSW5mb1JlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX0dFVF9JTkZPUyxidWZmZXIpO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gLyoq6Iux6ZuE5LiK44CB5LiL44CB5pu05paw6Zi15Z6LICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGhlcm9MaW51ZXBVcGRhdGVSZXEobGluZXVwSWQ6bnVtYmVyLGhlcm9JZDpzdHJpbmcsaXNVcDpib29sZWFuKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgaWYoIWlzVXAgJiYgR2FtZURhdGFNYW5hZ2VyLmlucy5zZWxmUGxheWVyRGF0YS5oZXJvTGluZXVwRGljLnZhbHVlcy5sZW5ndGggPD0gMSlcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIFRpcHNNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2coXCLpmLXkuIroi7Hpm4TkuI3lvpflsJHkuo7kuIDkuKpcIiwzMCxcIiNmZjAwMDBcIixMYXllck1hbmFnZXIuaW5zLmdldExheWVyKExheWVyTWFuYWdlci5USVBfTEFZRVIpLEdhbWVDb25maWcuU1RBR0VfV0lEVEgvMixHYW1lQ29uZmlnLlNUQUdFX0hFSUdIVC8yLDEsMCwyMDApO1xyXG4gICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHZhciBVcGRhdGVGb3JtYXRpb25SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJVcGRhdGVGb3JtYXRpb25SZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2Uuc2l0ZUlkeCA9IGxpbmV1cElkO1xyXG4gICAgLy8gICAgIG1lc3NhZ2UuaGVyb0lkID0gaGVyb0lkO1xyXG4gICAgLy8gICAgIG1lc3NhZ2UuZmxhZyA9IGlzVXA7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFVwZGF0ZUZvcm1hdGlvblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX1VQREFURV9GT1JNQVRJT04sYnVmZmVyKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKuivt+axguWFs+WNoeS/oeaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlR2F0ZUluZm9SZXEoKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIEdhdGVJbmZvUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJHYXRlSW5mb1JlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gMTtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gR2F0ZUluZm9SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9JTkZPLGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKirmjJHmiJjlhbPljaEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgYmFsbHRlR2F0ZVJlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBCYXR0bGVHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJCYXR0bGVHYXRlUmVxdWVzdFwiKTtcclxuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xyXG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBCYXR0bGVHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfQkFUVExFLGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gLyoq6K+35rGC5omr6I2h5YWz5Y2hICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIHNjYW5HYXRlUmVxKGdhdGVLZXk6c3RyaW5nKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIFNjYW5HYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJTY2FuR2F0ZVJlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gU2NhbkdhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9TQ0FOLGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKiror7fmsYLlhbPljaHmjILmnLrlpZblirHkv6Hmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZUhhbmd1cFN0YXRlUmVxKCk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBIYW5ndXBTdGF0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiSGFuZ3VwU3RhdGVSZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IDE7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEhhbmd1cFN0YXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFLGJ1ZmZlcik7XHJcbiAgICAvLyAgICAgLy8gV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKuivt+axguWFs+WNoeaMguacuuS/oeaBryAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlU3dpdGNoSGFuZ1JlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBTd2l0Y2hIYW5nR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFN3aXRjaEhhbmdHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfU1dJVENIX0hBTkdfR0FURSxidWZmZXIpO1xyXG4gICAgLy8gICAgIC8vIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0hBTkRVUF9TVEFURSk7XHJcbiAgICAvLyB9XHJcbiAgICBcclxuXHJcblxyXG4gICAgLy8gLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipIdHRwICovXHJcbiAgICAvLyAvKirmtYvor5XnmbvlvZUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgaHR0cExvZ2luUmVxKGFjY291bnQ6c3RyaW5nLHB3ZDpzdHJpbmcsY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIHBhcmFtczphbnkgPSB7fTtcclxuICAgIC8vICAgICBwYXJhbXMuYWNjb3VudCA9IGFjY291bnQ7XHJcbiAgICAvLyAgICAgcGFyYW1zLnBhc3N3b3JkID0gcHdkO1xyXG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLnRlc3RMb2dpblVSTCxIVFRQUmVxVHlwZS5HRVQscGFyYW1zLGNhbGxlcixjYWxsQmFjayk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKirojrflj5bmnI3liqHlmajliJfooaggKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgaHR0cEdhbWVTZXJ2ZXJSZXEoY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZ2FtZVNlcnZlclVSTCxIVFRQUmVxVHlwZS5HRVQsbnVsbCxjYWxsZXIsY2FsbEJhY2spO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gLyoq6L+b5YWl5ri45oiPICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBFbnRlckdhbWVSZXEoc2lkOm51bWJlcixjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgcGFyYW1zOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIHBhcmFtcy5zaWQgPSBzaWQ7XHJcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZW50ZXJHYW1lVVJMLEhUVFBSZXFUeXBlLkdFVCxwYXJhbXMsY2FsbGVyLGNhbGxCYWNrKTtcclxuICAgIC8vIH1cclxufSIsIi8qXHJcbiog5YyF6Kej5p6QXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VJbiBleHRlbmRzIExheWEuQnl0ZXtcclxuICAgIFxyXG4gICAgLy8gcHVibGljIG1vZHVsZTpudW1iZXI7XHJcbiAgICBwdWJsaWMgY21kOm51bWJlcjtcclxuICAgIHB1YmxpYyBib2R5O1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgLy8gcHVibGljIHJlYWQobXNnOk9iamVjdCA9IG51bGwpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXHJcbiAgICAvLyAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xyXG4gICAgLy8gICAgIHRoaXMucG9zID0gMDtcclxuICAgIC8vICAgICAvL+agh+iusOWSjOmVv+W6plxyXG4gICAgLy8gICAgIHZhciBtYXJrID0gdGhpcy5nZXRJbnQxNigpO1xyXG4gICAgLy8gICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAvLyAgICAgLy/ljIXlpLRcclxuICAgIC8vICAgICB0aGlzLm1vZHVsZSA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICB0aGlzLmNtZCA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICB2YXIgdHlwZSA9IHRoaXMuZ2V0Qnl0ZSgpO1xyXG4gICAgLy8gICAgIHZhciBmb3JtYXQgPSB0aGlzLmdldEJ5dGUoKTtcclxuICAgIC8vICAgICAvL+aVsOaNrlxyXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcclxuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgXHJcbiAgICAvL+aWsOmAmuS/oVxyXG4gICAgLy8gcHVibGljIHJlYWQobXNnOk9iamVjdCA9IG51bGwpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXHJcbiAgICAvLyAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xyXG4gICAgLy8gICAgIHRoaXMucG9zID0gMDtcclxuXHJcbiAgICAvLyAgICAgdmFyIGxlbiA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICB0aGlzLmNtZCA9IHRoaXMuZ2V0SW50MzIoKTtcclxuICAgIC8vICAgICAvL+aVsOaNrlxyXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcclxuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgLy/mlrDpgJrkv6Eg57KY5YyF5aSE55CGXHJcbiAgICBwdWJsaWMgcmVhZChidWZmRGF0YSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGJ1ZmZEYXRhKTtcclxuICAgICAgICB0aGlzLnBvcyA9IDA7XHJcblxyXG4gICAgICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAgICAgLy/mlbDmja5cclxuICAgICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xyXG5cclxuICAgIH1cclxuICAgIFxyXG59XHJcbiIsImltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuL1dlYlNvY2tldE1hbmFnZXJcIjtcclxuXHJcbi8qXHJcbiog5omT5YyFXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VPdXQgZXh0ZW5kcyBMYXlhLkJ5dGV7XHJcbiAgICAvLyBwcml2YXRlIFBBQ0tFVF9NQVJLID0gMHgwO1xyXG4gICAgLy8gcHJpdmF0ZSBtb2R1bGUgPSAwO1xyXG4gICAgLy8gcHJpdmF0ZSB0eXBlID0gMDtcclxuICAgIC8vIHByaXZhdGUgZm9ybWFydCA9IDA7XHJcbiAgICBwcml2YXRlIGNtZDtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIC8vIHB1YmxpYyBwYWNrKG1vZHVsZSxjbWQsZGF0YT86YW55KTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xyXG4gICAgLy8gICAgIHRoaXMubW9kdWxlID0gbW9kdWxlO1xyXG4gICAgLy8gICAgIHRoaXMuY21kID0gY21kO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQxNih0aGlzLlBBQ0tFVF9NQVJLKTtcclxuICAgIC8vICAgICB0aGlzLndyaXRlSW50MzIoZGF0YS5ieXRlTGVuZ3RoICsgMTApO1xyXG4gICAgLy8gICAgIC8v5YyF5aS0XHJcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDMyKHRoaXMubW9kdWxlKTtcclxuICAgIC8vICAgICB0aGlzLndyaXRlSW50MzIodGhpcy5jbWQpO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMudHlwZSk7XHJcbiAgICAvLyAgICAgdGhpcy53cml0ZUJ5dGUodGhpcy5mb3JtYXJ0KTtcclxuICAgIC8vICAgICAvL+a2iOaBr+S9k1xyXG4gICAgLy8gICAgIGlmKGRhdGEpXHJcbiAgICAvLyAgICAge1xyXG4gICAgLy8gICAgICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIoZGF0YSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKuaWsOmAmuS/oSAqL1xyXG4gICAgcHVibGljIHBhY2soY21kLGRhdGE/OmFueSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcclxuXHJcbiAgICAgICAgdGhpcy5jbWQgPSBjbWQ7XHJcbiAgICAgICAgdmFyIGxlbiA9IChkYXRhID8gZGF0YS5ieXRlTGVuZ3RoIDogMCkgKyAxMjtcclxuICAgICAgICB2YXIgY29kZTpudW1iZXIgPSBXZWJTb2NrZXRNYW5hZ2VyLmNvZGVDb3VudF5sZW5eNTEyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMihsZW4pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCk7XHJcbiAgICAgICAgdGhpcy53cml0ZUludDMyKGNvZGUpO1xyXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XHJcbiAgICAgICAgaWYoZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50KysgO1xyXG4gICAgfVxyXG5cclxufSIsIi8qXHJcbiog5pWw5o2u5aSE55CGSGFubGRlclxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRIYW5kbGVye1xyXG4gICAgLy8gcHVibGljIHN0YXR1c0NvZGU6bnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBjYWxsZXI6YW55O1xyXG4gICAgcHJpdmF0ZSBjYWxsQmFjazpGdW5jdGlvbjtcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcj86YW55LGNhbGxiYWNrPzpGdW5jdGlvbil7XHJcbiAgICAgICAgdGhpcy5jYWxsZXIgPSBjYWxsZXI7XHJcbiAgICAgICAgdGhpcy5jYWxsQmFjayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHBsYWluKGRhdGE/OmFueSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8vIHZhciBzdGF0dXNDb2RlID0gZGF0YS5zdGF0dXNDb2RlO1xyXG4gICAgICAgIC8vIGlmKHN0YXR1c0NvZGUgPT0gMClcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuc3VjY2VzcyhkYXRhKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCLmnI3liqHlmajov5Tlm57vvJpcIixkYXRhLnN0YXR1c0NvZGUpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICB0aGlzLnN1Y2Nlc3MoZGF0YSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc3VjY2VzcyhkYXRhPzphbnkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLmNhbGxlciAmJiB0aGlzLmNhbGxCYWNrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYoZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsQmFjay5jYWxsKHRoaXMuY2FsbGVyLGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxCYWNrLmNhbGwodGhpcy5jYWxsZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IERpY3Rpb25hcnkgZnJvbSBcIi4uLy4uL1Rvb2wvRGljdGlvbmFyeVwiO1xyXG5pbXBvcnQgRXZlbnRNYW5hZ2VyIGZyb20gXCIuLi9FdmVudE1hbmFnZXJcIjtcclxuaW1wb3J0IFBhY2thZ2VJbiBmcm9tIFwiLi9QYWNrYWdlSW5cIjtcclxuaW1wb3J0IFBhY2thZ2VPdXQgZnJvbSBcIi4vUGFja2FnZU91dFwiO1xyXG5pbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi9Tb2NrZXRIYW5kbGVyXCI7XHJcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4vQ2xpZW50U2VuZGVyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sIH0gZnJvbSBcIi4uL0NvbnN0L0dhbWVDb25maWdcIjtcclxuXHJcbi8qKlxyXG4gKiBzb2NrZXTkuK3lv4NcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlNvY2tldE1hbmFnZXIge1xyXG4gICAvKirpgJrkv6Fjb2Rl5qyh5pWwICovXHJcbiAgIHB1YmxpYyBzdGF0aWMgY29kZUNvdW50Om51bWJlciA9IDA7XHJcbiAgIHByaXZhdGUgaXA6c3RyaW5nO1xyXG4gICBwcml2YXRlIHBvcnQ6bnVtYmVyO1xyXG4gICBwcml2YXRlIHdlYlNvY2tldDpMYXlhLlNvY2tldDtcclxuICAgcHJpdmF0ZSBzb2NrZXRIYW5sZGVyRGljOkRpY3Rpb25hcnk7XHJcbiAgIHByaXZhdGUgcHJvdG9Sb290OmFueTtcclxuICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYyA9IG5ldyBEaWN0aW9uYXJ5KCk7XHJcbiAgIH1cclxuICAgcHJpdmF0ZSBzdGF0aWMgX2luczpXZWJTb2NrZXRNYW5hZ2VyID0gbnVsbDtcclxuICAgcHVibGljIHN0YXRpYyBnZXQgaW5zKCk6V2ViU29ja2V0TWFuYWdlcntcclxuICAgICAgIGlmKHRoaXMuX2lucyA9PSBudWxsKVxyXG4gICAgICAgeyAgXHJcbiAgICAgICAgICAgdGhpcy5faW5zID0gbmV3IFdlYlNvY2tldE1hbmFnZXIoKTtcclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiB0aGlzLl9pbnM7XHJcbiAgIH1cclxuXHJcbiAgIHB1YmxpYyBjb25uZWN0KGlwOnN0cmluZyxwb3J0Om51bWJlcik6dm9pZFxyXG4gICB7XHJcbiAgICAgICB0aGlzLmlwID0gaXA7XHJcbiAgICAgICB0aGlzLnBvcnQgPSBwb3J0O1xyXG5cclxuICAgICAgIHRoaXMud2ViU29ja2V0ID0gbmV3IExheWEuU29ja2V0KCk7XHJcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50Lk9QRU4sdGhpcyx0aGlzLndlYlNvY2tldE9wZW4pO1xyXG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5NRVNTQUdFLHRoaXMsdGhpcy53ZWJTb2NrZXRNZXNzYWdlKTtcclxuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuQ0xPU0UsdGhpcyx0aGlzLndlYlNvY2tldENsb3NlKTtcclxuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuRVJST1IsdGhpcyx0aGlzLndlYlNvY2tldEVycm9yKTtcclxuICAgICAgIC8v5Yqg6L295Y2P6K6uXHJcbiAgICAgICBpZighdGhpcy5wcm90b1Jvb3Qpe1xyXG4gICAgICAgICAgIHZhciBwcm90b0J1ZlVybHMgPSBbXCJvdXRzaWRlL3Byb3RvL1VzZXJQcm90by5wcm90b1wiXTtcclxuICAgICAgICAgICBMYXlhLkJyb3dzZXIud2luZG93LnByb3RvYnVmLmxvYWQocHJvdG9CdWZVcmxzLHRoaXMucHJvdG9Mb2FkQ29tcGxldGUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgIH1cclxuICAgICAgIGVsc2VcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5jb25uZWN0QnlVcmwoXCJ3czovL1wiK3RoaXMuaXArXCI6XCIrdGhpcy5wb3J0KTtcclxuICAgICAgIH1cclxuICAgfVxyXG4gICAvKirlhbPpl613ZWJzb2NrZXQgKi9cclxuICAgcHVibGljIGNsb3NlU29ja2V0KCk6dm9pZFxyXG4gICB7XHJcbiAgICAgICBpZih0aGlzLndlYlNvY2tldClcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5PUEVOLHRoaXMsdGhpcy53ZWJTb2NrZXRPcGVuKTtcclxuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5NRVNTQUdFLHRoaXMsdGhpcy53ZWJTb2NrZXRNZXNzYWdlKTtcclxuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5DTE9TRSx0aGlzLHRoaXMud2ViU29ja2V0Q2xvc2UpO1xyXG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkVSUk9SLHRoaXMsdGhpcy53ZWJTb2NrZXRFcnJvcik7XHJcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY2xvc2UoKTtcclxuICAgICAgICAgICB0aGlzLndlYlNvY2tldCA9IG51bGw7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICBcclxuICAgcHJpdmF0ZSBwcm90b0xvYWRDb21wbGV0ZShlcnJvcixyb290KTp2b2lkXHJcbiAgIHtcclxuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnByb3RvUm9vdCA9IHJvb3Q7XHJcbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5pcCtcIjpcIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5wb3J0KTtcclxuICAgfVxyXG4gICBwcml2YXRlIHdlYlNvY2tldE9wZW4oKTp2b2lkXHJcbiAgIHtcclxuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG9wZW4uLi5cIik7XHJcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YSA9IG5ldyBMYXlhLkJ5dGUoKTtcclxuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFuO1xyXG4gICAgICAgdGhpcy50ZW1wQnl0ZSA9IG5ldyBMYXlhLkJ5dGUoKTtcclxuICAgICAgIHRoaXMudGVtcEJ5dGUuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47XHJcblxyXG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5jb2RlQ291bnQgPSAxO1xyXG4gICAgICAgIC8vICAgIEV2ZW50TWFuYWdlci5pbnMuZGlzcGF0Y2hFdmVudChFdmVudE1hbmFnZXIuU0VSVkVSX0NPTk5FQ1RFRCk75pqC5pe25LiN6ZyA6KaB6I635Y+W5pyN5Yqh5Zmo5YiX6KGoXHJcbiAgIH1cclxuICAgLy/nvJPlhrLlrZfoioLmlbDnu4RcclxuICAgcHJpdmF0ZSBieXRlQnVmZkRhdGE6TGF5YS5CeXRlO1xyXG4gICAvL+mVv+W6puWtl+iKguaVsOe7hFxyXG4gICBwcml2YXRlIHRlbXBCeXRlOkxheWEuQnl0ZTtcclxuICBcclxuICAgcHJpdmF0ZSBwYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pOnZvaWRcclxuICAge1xyXG4gICAgICAgLy/lrozmlbTljIVcclxuICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcclxuICAgICAgIHRoaXMudGVtcEJ5dGUud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIsMCxwYWNrTGVuKTtcclxuICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcclxuICAgICAgIC8v5pat5YyF5aSE55CGXHJcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YSA9IG5ldyBMYXlhLkJ5dGUodGhpcy5ieXRlQnVmZkRhdGEuZ2V0VWludDhBcnJheShwYWNrTGVuLHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCkpO1xyXG4gICAgICAgLy8gdGhpcy5ieXRlQnVmZkRhdGEud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIscGFja0xlbix0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpO1xyXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW47XHJcblxyXG4gICAgICAgLy/op6PmnpDljIVcclxuICAgICAgIHZhciBwYWNrYWdlSW46UGFja2FnZUluID0gbmV3IFBhY2thZ2VJbigpO1xyXG4gICAgICAgLy8gdmFyIGJ1ZmYgPSB0aGlzLnRlbXBCeXRlLmJ1ZmZlci5zbGljZSgwLHRoaXMudGVtcEJ5dGUubGVuZ3RoKTtcclxuICAgICAgIHBhY2thZ2VJbi5yZWFkKHRoaXMudGVtcEJ5dGUuYnVmZmVyKTtcclxuXHJcbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBtc2cuLi5cIixwYWNrYWdlSW4uY21kLHRoaXMudGVtcEJ5dGUubGVuZ3RoKTtcclxuICAgICAgIGlmKHBhY2thZ2VJbi5jbWQgPT0gMTA1MjAyKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiXCIpO1xyXG4gICAgICAgfVxyXG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBwYWNrYWdlSW4uY21kO1xyXG4gICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xyXG4gICAgICAgaWYoaGFuZGxlcnMgJiYgaGFuZGxlcnMubGVuZ3RoID4gMClcclxuICAgICAgIHtcclxuICAgICAgICAgICBmb3IodmFyIGkgPSBoYW5kbGVycy5sZW5ndGggLSAxO2kgPj0gMDtpLS0pXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICBoYW5kbGVyc1tpXS5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgLy8gaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcclxuICAgICAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcclxuXHJcbiAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgIC8v6YCS5b2S5qOA5rWL5piv5ZCm5pyJ5a6M5pW05YyFXHJcbiAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPiA0KVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcclxuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAsNCk7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xyXG4gICAgICAgICAgIHBhY2tMZW4gPSB0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgKyA0O1xyXG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgdGhpcy5wYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIFxyXG4gICB9XHJcbiAgIC8qKuino+aekOepuuWMhSAqL1xyXG4gICBwcml2YXRlIHBhcnNlTnVsbFBhY2thZ2UoY21kOm51bWJlcik6dm9pZFxyXG4gICB7XHJcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIrIGNtZDtcclxuICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcclxuICAgICAgIGlmKGhhbmRsZXJzKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIGhhbmRsZXJzLmZvckVhY2goc29ja2V0SGFubGRlciA9PiB7XHJcbiAgICAgICAgICAgICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbigpO1xyXG4gICAgICAgICAgIH0pO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIFxyXG4gICBwcml2YXRlIHdlYlNvY2tldE1lc3NhZ2UoZGF0YSk6dm9pZFxyXG4gICB7XHJcbiAgICAgICB0aGlzLnRlbXBCeXRlID0gbmV3IExheWEuQnl0ZShkYXRhKTtcclxuICAgICAgIHRoaXMudGVtcEJ5dGUuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47XHJcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIi4uLi4udGVzdHdlYlwiLHRoaXMudGVtcEJ5dGUucG9zKTtcclxuICAgICAgIFxyXG4gICAgICAgaWYodGhpcy50ZW1wQnl0ZS5sZW5ndGggPiA0KVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIGlmKHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSA9PSA0KS8v56m65YyFXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICB2YXIgY21kOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKTtcclxuICAgICAgICAgICAgICAgdGhpcy5wYXJzZU51bGxQYWNrYWdlKGNtZCk7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi56m65YyFLi4uLi4uLi4uLi4uLi4uLlwiK2NtZCk7XHJcbiAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKGRhdGEsMCxkYXRhLmJ5dGVMZW5ndGgpO1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coXCLlrZfoioLmgLvplb/luqYuLi4uLi4uLi4uLi4uLi4uXCIrdGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoKTtcclxuICAgICAgIFxyXG4gICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID4gNClcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLDQpO1xyXG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcclxuICAgICAgICAgICB2YXIgcGFja0xlbjpudW1iZXIgPSB0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgKyA0O1xyXG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgdGhpcy5wYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pO1xyXG4gICAgICAgICAgIH1cclxuICAgICAgIH1cclxuXHJcbiAgICAgICBcclxuXHJcblxyXG5cclxuICAgICAgIC8vIHZhciBwYWNrYWdlSW46UGFja2FnZUluID0gbmV3IFBhY2thZ2VJbigpO1xyXG4gICAgICAgLy8gcGFja2FnZUluLnJlYWQoZGF0YSk7XHJcblxyXG4gICAgICAgLy8gY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgbXNnLi4uXCIscGFja2FnZUluLmNtZCk7XHJcbiAgICAgICAvLyB2YXIga2V5OnN0cmluZyA9IFwiXCIrIHBhY2thZ2VJbi5jbWQ7XHJcbiAgICAgICAvLyB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XHJcbiAgICAgICAvLyBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xyXG4gICAgICAgLy8gICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbihwYWNrYWdlSW4uYm9keSk7XHJcbiAgICAgICAvLyB9KTtcclxuICAgICAgIFxyXG4gICB9XHJcbiAgIHByaXZhdGUgd2ViU29ja2V0Q2xvc2UoKTp2b2lkXHJcbiAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBjbG9zZS4uLlwiKTtcclxuICAgfVxyXG4gICBwcml2YXRlIHdlYlNvY2tldEVycm9yKCk6dm9pZFxyXG4gICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgZXJyb3IuLi5cIik7XHJcbiAgIH1cclxuICAgLyoqXHJcbiAgICAqIOWPkemAgea2iOaBr1xyXG4gICAgKiBAcGFyYW0gY21kIFxyXG4gICAgKiBAcGFyYW0gZGF0YSBcclxuICAgICovXHJcbiAgIHB1YmxpYyBzZW5kTXNnKGNtZDpudW1iZXIsZGF0YT86YW55KTp2b2lkXHJcbiAgIHtcclxuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IHJlcS4uLlwiK2NtZCk7XHJcbiAgICAgICB2YXIgcGFja2FnZU91dDpQYWNrYWdlT3V0ID0gbmV3IFBhY2thZ2VPdXQoKTtcclxuICAgICAgIC8vIHBhY2thZ2VPdXQucGFjayhtb2R1bGUsY21kLGRhdGEpO1xyXG4gICAgICAgcGFja2FnZU91dC5wYWNrKGNtZCxkYXRhKTtcclxuICAgICAgIHRoaXMud2ViU29ja2V0LnNlbmQocGFja2FnZU91dC5idWZmZXIpO1xyXG4gICB9XHJcbiAgIC8qKlxyXG4gICAgKiDlrprkuYlwcm90b2J1Zuexu1xyXG4gICAgKiBAcGFyYW0gcHJvdG9UeXBlIOWNj+iuruaooeWdl+exu+Wei1xyXG4gICAgKiBAcGFyYW0gY2xhc3NTdHIg57G7XHJcbiAgICAqL1xyXG4gICBwdWJsaWMgZGVmaW5lUHJvdG9DbGFzcyhjbGFzc1N0cjpzdHJpbmcpOmFueVxyXG4gICB7XHJcbiAgICAgICByZXR1cm4gdGhpcy5wcm90b1Jvb3QubG9va3VwKGNsYXNzU3RyKTtcclxuICAgfVxyXG5cclxuICAgLyoq5rOo5YaMICovXHJcbiAgIHB1YmxpYyByZWdpc3RlckhhbmRsZXIoY21kOm51bWJlcixoYW5kbGVyOlNvY2tldEhhbmRsZXIpOnZvaWRcclxuICAge1xyXG4gICAgICAgLy8gdmFyIGtleTpzdHJpbmcgPSBwcm90b2NvbCtcIl9cIitjbWQ7XHJcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIrY21kO1xyXG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xyXG4gICAgICAgaWYoIWhhbmRsZXJzKVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIGhhbmRsZXJzID0gW107XHJcbiAgICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICAgICB0aGlzLnNvY2tldEhhbmxkZXJEaWMuc2V0KGtleSxoYW5kbGVycyk7XHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgIH1cclxuICAgfVxyXG4gICAvKirliKDpmaQgKi9cclxuICAgcHVibGljIHVucmVnaXN0ZXJIYW5kbGVyKGNtZDpudW1iZXIsY2FsbGVyOmFueSk6dm9pZFxyXG4gICB7XHJcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIgKyBjbWQ7XHJcbiAgICAgICB2YXIgaGFuZGxlcnM6QXJyYXk8U29ja2V0SGFuZGxlcj4gPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XHJcbiAgICAgICBpZihoYW5kbGVycylcclxuICAgICAgIHtcclxuICAgICAgICAgICB2YXIgaGFuZGxlcjtcclxuICAgICAgICAgICBmb3IodmFyIGkgPSBoYW5kbGVycy5sZW5ndGggLSAxO2kgPj0gMCA7aS0tKVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgaGFuZGxlciA9IGhhbmRsZXJzW2ldO1xyXG4gICAgICAgICAgICAgICBpZihoYW5kbGVyLmNhbGxlciA9PT0gY2FsbGVyKVxyXG4gICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICBoYW5kbGVycy5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZihoYW5kbGVycy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5yZW1vdmUoa2V5KTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgLyoq5re75Yqg5pyN5Yqh5Zmo5b+D6LezICovXHJcbiAgIHB1YmxpYyBhZGRIZXJ0UmVxKCk6dm9pZFxyXG4gICB7XHJcbiAgICAvLyAgICB0aGlzLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNQX1NFUlZfSEVSVCxuZXcgU2VydmVySGVhcnRIYW5kbGVyKHRoaXMpKTtcclxuICAgIC8vICAgIENsaWVudFNlbmRlci5zZXJ2SGVhcnRSZXEoKTtcclxuICAgIC8vICAgIExheWEudGltZXIubG9vcCgxMDAwMCx0aGlzLGZ1bmN0aW9uKCk6dm9pZHtcclxuICAgIC8vICAgICAgICBDbGllbnRTZW5kZXIuc2VydkhlYXJ0UmVxKCk7XHJcbiAgICAvLyAgICB9KTtcclxuICAgfVxyXG4gICBwdWJsaWMgcmVtb3ZlSGVhcnRSZXEoKTp2b2lkXHJcbiAgIHtcclxuICAgIC8vICAgIHRoaXMudW5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsdGhpcyk7XHJcbiAgICAvLyAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICB9XHJcbn0iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cclxuaW1wb3J0IFdlbENvbWVDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiXHJcbi8qXHJcbiog5ri45oiP5Yid5aeL5YyW6YWN572uO1xyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29uZmlne1xyXG4gICAgc3RhdGljIHdpZHRoOm51bWJlcj0xNDQwO1xyXG4gICAgc3RhdGljIGhlaWdodDpudW1iZXI9NzUwO1xyXG4gICAgc3RhdGljIHNjYWxlTW9kZTpzdHJpbmc9XCJmaXhlZGhlaWdodFwiO1xyXG4gICAgc3RhdGljIHNjcmVlbk1vZGU6c3RyaW5nPVwibm9uZVwiO1xyXG4gICAgc3RhdGljIGFsaWduVjpzdHJpbmc9XCJ0b3BcIjtcclxuICAgIHN0YXRpYyBhbGlnbkg6c3RyaW5nPVwibGVmdFwiO1xyXG4gICAgc3RhdGljIHN0YXJ0U2NlbmU6YW55PVwiV2VsY29tZS9Mb2dpbi5zY2VuZVwiO1xyXG4gICAgc3RhdGljIHNjZW5lUm9vdDpzdHJpbmc9XCJcIjtcclxuICAgIHN0YXRpYyBkZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHN0YXQ6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBwaHlzaWNzRGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBleHBvcnRTY2VuZVRvSnNvbjpib29sZWFuPXRydWU7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe31cclxuICAgIHN0YXRpYyBpbml0KCl7XHJcbiAgICAgICAgdmFyIHJlZzogRnVuY3Rpb24gPSBMYXlhLkNsYXNzVXRpbHMucmVnQ2xhc3M7XHJcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9XZWxDb21lL1dlbENvbWVDb250cm9sbGVyLnRzXCIsV2VsQ29tZUNvbnRyb2xsZXIpO1xyXG4gICAgfVxyXG59XHJcbkdhbWVDb25maWcuaW5pdCgpOyIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcclxuXHJcblxyXG4vKipcclxuICog5ri45oiP5YWl5Y+jXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lRW50ZXJ7XHJcblx0XHQvL1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWIneWni+WMliAqL1xyXG4gICAgcHJpdmF0ZSBpbml0KCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5sb2FkKCk7XHJcbiAgICB9XHJcbiAgICAvKirotYTmupDliqDovb0gKi9cclxuICAgIHByaXZhdGUgbG9hZCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBhc3NldGVBcnIgPSBbXHJcbiAgICAgICAgICAgIHt1cmw6XCJ1bnBhY2thZ2Uvd2VsY29tZV9iZy5wbmdcIn0sXHJcbiAgICAgICAgICAgIHt1cmw6XCJXZWxjb21lL2xvZ2luYm94LnBuZ1wifSxcclxuICAgICAgICAgICAge3VybDpcIldlbGNvbWUvcHJvZ3Jlc3NCZy5wbmdcIn0sXHJcblxyXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL2NvbXAuYXRsYXNcIn0sXHJcbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvd2VsY29tZS5hdGxhc1wifVxyXG4gICAgICAgIF1cclxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKGFzc2V0ZUFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbmxvYWQpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9ubG9hZCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIEdhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lQ29uZmlnIGZyb20gXCIuL0dhbWVDb25maWdcIjtcclxuaW1wb3J0IEdhbWVFbnRlciBmcm9tIFwiLi9HYW1lRW50ZXJcIjtcclxuY2xhc3MgTWFpbiB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHQvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcclxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pIExheWEzRC5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0KTtcclxuXHRcdGVsc2UgTGF5YS5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0LCBMYXlhW1wiV2ViR0xcIl0pO1xyXG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcclxuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gR2FtZUNvbmZpZy5zY2FsZU1vZGU7XHJcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHYW1lQ29uZmlnLnNjcmVlbk1vZGU7XHJcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcblx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcblx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcblx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcblx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG5cdH1cclxuXHJcblx0b25WZXJzaW9uTG9hZGVkKCk6IHZvaWQge1xyXG5cdFx0Ly/mv4DmtLvlpKflsI/lm77mmKDlsITvvIzliqDovb3lsI/lm77nmoTml7blgJnvvIzlpoLmnpzlj5HnjrDlsI/lm77lnKjlpKflm77lkIjpm4bph4zpnaLvvIzliJnkvJjlhYjliqDovb3lpKflm77lkIjpm4bvvIzogIzkuI3mmK/lsI/lm75cclxuXHRcdExheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XHJcblx0fVxyXG5cclxuXHRvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcclxuXHRcdG5ldyBHYW1lRW50ZXIoKTtcclxuXHRcdC8v5Yqg6L29SURF5oyH5a6a55qE5Zy65pmvXHJcblx0fVxyXG59XHJcbi8v5r+A5rS75ZCv5Yqo57G7XHJcbm5ldyBNYWluKCk7XHJcbiIsIi8qKlxyXG4gICAgKiDor43lhbgga2V5LXZhbHVlXHJcbiAgICAqXHJcbiAgICAqICBcclxuICAgICogIGtleXMgOiBBcnJheVxyXG4gICAgKiAgW3JlYWQtb25seV0g6I635Y+W5omA5pyJ55qE5a2Q5YWD57Sg6ZSu5ZCN5YiX6KGo44CCXHJcbiAgICAqICBEaWN0aW9uYXJ5XHJcbiAgICAqIFxyXG4gICAgKiAgdmFsdWVzIDogQXJyYXlcclxuICAgICogIFtyZWFkLW9ubHldIOiOt+WPluaJgOacieeahOWtkOWFg+e0oOWIl+ihqOOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiAgUHVibGljIE1ldGhvZHNcclxuICAgICogIFxyXG4gICAgKiAgICAgICAgICBcclxuICAgICogIGNsZWFyKCk6dm9pZFxyXG4gICAgKiAg5riF6Zmk5q2k5a+56LGh55qE6ZSu5ZCN5YiX6KGo5ZKM6ZSu5YC85YiX6KGo44CCXHJcbiAgICAqICBEaWN0aW9uYXJ5XHJcbiAgICAqICAgICAgICAgIFxyXG4gICAgKiAgZ2V0KGtleToqKToqXHJcbiAgICAqICDov5Tlm57mjIflrprplK7lkI3nmoTlgLzjgIJcclxuICAgICogIERpY3Rpb25hcnlcclxuICAgICogICAgICAgICAgIFxyXG4gICAgKiAgaW5kZXhPZihrZXk6T2JqZWN0KTppbnRcclxuICAgICogIOiOt+WPluaMh+WumuWvueixoeeahOmUruWQjee0ouW8leOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiAgICAgICAgICBcclxuICAgICogIHJlbW92ZShrZXk6Kik6Qm9vbGVhblxyXG4gICAgKiAg56e76Zmk5oyH5a6a6ZSu5ZCN55qE5YC844CCXHJcbiAgICAqICBEaWN0aW9uYXJ5XHJcbiAgICAqICAgICAgICAgIFxyXG4gICAgKiAgc2V0KGtleToqLCB2YWx1ZToqKTp2b2lkXHJcbiAgICAqICDnu5nmjIflrprnmoTplK7lkI3orr7nva7lgLzjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpY3Rpb25hcnkge1xyXG4gICAgLyoq6ZSu5ZCNICovXHJcbiAgICBwcml2YXRlIGtleXMgOiBBcnJheTxhbnk+O1xyXG4gICAgLyoq6ZSu5YC8ICovXHJcbiAgICBwcml2YXRlIHZhbHVlcyA6IEFycmF5PGFueT47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmtleXMgPSBuZXcgQXJyYXk8YW55PigpO1xyXG4gICAgICAgIHRoaXMudmFsdWVzID0gbmV3IEFycmF5PGFueT4oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirorr7nva4g6ZSu5ZCNIC0g6ZSu5YC8ICovXHJcbiAgICBwdWJsaWMgc2V0KGtleTphbnksdmFsdWU6YW55KSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGkgPSAwO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV09PT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpXSA9IGtleTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW2ldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcclxuICAgICAgICB0aGlzLnZhbHVlcy5wdXNoKHZhbHVlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDmj5LlhaVrZXlbXCIrIGtleSArXCJdXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidmFsdWVcIix2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6YCa6L+HIOmUruWQjWtleSDojrflj5bplK7lgLx2YWx1ZSAgKi9cclxuICAgIHB1YmxpYyBnZXQoa2V5OmFueSkgOiBhbnlcclxuICAgIHtcclxuICAgICAgICAvLyB0aGlzLmdldERpY0xpc3QoKTsgXHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMua2V5c1tpXSA9PT0ga2V5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g6K+N5YW45Lit5rKh5pyJa2V555qE5YC8XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPluWvueixoeeahOe0ouW8leWAvCAqL1xyXG4gICAgcHVibGljIGluZGV4T2YodmFsdWUgOiBhbnkpIDogbnVtYmVyXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLnZhbHVlcy5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy52YWx1ZXNbaV0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDor43lhbjkuK3msqHmnInor6XlgLxcIik7XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoq5riF6ZmkIOivjeWFuOS4reaMh+WumumUruWQjeeahOWJqiAqL1xyXG4gICAgcHVibGljIHJlbW92ZShrZXkgOiBhbnkpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV0gPT09IGtleSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzW2ldID09PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9PT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g56e76Zmk5oiQ5YqfXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOenu+mZpOWksei0pVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirmuIXpmaTmiYDmnInnmoTplK4gKi9cclxuICAgIHB1YmxpYyBjbGVhcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMua2V5cyA9IFtdO1xyXG4gICAgICAgIHRoaXMudmFsdWVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I635Y+W5YiX6KGoICovXHJcbiAgICBwdWJsaWMgZ2V0RGljTGlzdCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOAkFwiICsgaSArIFwi44CRLS0tLS0tLS0tLS1rZXk6XCIgKyB0aGlzLmtleXNbaV0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInZhbHVlXCIsdGhpcy52YWx1ZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirojrflj5bplK7lgLzmlbDnu4QgKi9cclxuICAgIHB1YmxpYyBnZXRWYWx1ZXNBcnIoKSA6IEFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I635Y+W6ZSu5ZCN5pWw57uEICovXHJcbiAgICBwdWJsaWMgZ2V0S2V5c0FycigpIDogQXJyYXk8YW55PlxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmtleXM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XHJcblxyXG4vKipcclxuICog5Lit6Ze05a2XXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG9hdE1zZyBleHRlbmRzIHVpLkRpYWxvZ18uRmxvYXRNc2dVSXtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYW5pMS5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zcF9mbG9hdE1zZy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRFdmVudCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25IaWRkZW4pO1xyXG4gICAgICAgIHRoaXMuYW5pMS5vbihMYXlhLkV2ZW50LkNPTVBMRVRFLHRoaXMsdGhpcy5vbkhpZGRlbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrmtojmga/po5jlrZdcclxuICAgICAqIEBwYXJhbSB0ZXh0IOaYvuekuuaWh+acrCDjgJDmnIDlpJoyOOS4quOAkVxyXG4gICAgICogQHBhcmFtIHBvcyAg5L2N572ue3g6MTAwLHk6MTAwfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2hvd01zZyh0ZXh0OnN0cmluZyxwb3M6YW55KSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNwX2Zsb2F0TXNnLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubGFiX2Zsb2F0TXNnLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMueCA9IHBvcy54O1xyXG4gICAgICAgIHRoaXMueSA9IHBvcy55O1xyXG4gICAgICAgIHRoaXMuYW5pMS5wbGF5KDAsZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25IaWRkZW4oKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmFuaTEuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIExheWEuUG9vbC5yZWNvdmVyKFwiRmxvYXRNc2dcIix0aGlzKTtcclxuICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuY291bnRGbG9hdE1zZy0tO1xyXG4gICAgfVxyXG59IiwiLyoqXHJcbiAqIOWwj+W3peWFt1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWxj+W5leawtOW5s+S4reW/gyDmqKrlnZDmoIdcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRDZW50ZXJYKCkgOiBhbnlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gNzUwLyhMYXlhLkJyb3dzZXIuY2xpZW50SGVpZ2h0L0xheWEuQnJvd3Nlci5jbGllbnRXaWR0aCkvMjsvL+Wxj+W5leWuveW6plxyXG4gICAgfVxyXG59XHJcbiIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xyXG5pbXBvcnQgRGlhbG9nPUxheWEuRGlhbG9nO1xyXG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbmV4cG9ydCBtb2R1bGUgdWkuRGlhbG9nXyB7XHJcbiAgICBleHBvcnQgY2xhc3MgRmxvYXRNc2dVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBhbmkxOkxheWEuRnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIHNwX2Zsb2F0TXNnOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBsYWJfZmxvYXRNc2c6TGF5YS5MYWJlbDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIkRpYWxvZ18vRmxvYXRNc2dcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuV2VsY29tZSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTG9naW5VSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBhbmkxOkxheWEuRnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIHNwX2xvZ2luQm94OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpbnB1dF91c2VyTmFtZTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgaW5wdXRfdXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgbGFiX3RpdGxlOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIGJ0bl9sb2dpbjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuX3JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NXOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc0w6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVDpMYXlhLkxhYmVsO1xuXHRcdHB1YmxpYyBzcF9nYW1lTmFtZTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgc3BfcmVnaXN0ZXJCb3g6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlck5hbWU6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgYnRuX3RvTG9naW46TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl90b1JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3Rlck5pY2tOYW1lOkxheWEuVGV4dElucHV0O1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiV2VsY29tZS9Mb2dpblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cciJdfQ==
