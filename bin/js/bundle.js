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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL+adgui0p+mTui9MYXlhQWlySURFX2JldGEvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvaGFuZGxlci9Vc2VyTG9naW5IYW5kbGVyLnRzIiwic3JjL0NvcmUvQ29uc3QvR2FtZUNvbmZpZy50cyIsInNyYy9Db3JlL01lc3NhZ2VNYW5hZ2VyLnRzIiwic3JjL0NvcmUvTmV0L0NsaWVudFNlbmRlci50cyIsInNyYy9Db3JlL05ldC9QYWNrYWdlSW4udHMiLCJzcmMvQ29yZS9OZXQvUGFja2FnZU91dC50cyIsInNyYy9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyLnRzIiwic3JjL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXIudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9HYW1lRW50ZXIudHMiLCJzcmMvTWFpbi50cyIsInNyYy9Ub29sL0RpY3Rpb25hcnkudHMiLCJzcmMvVG9vbC9GbG9hdE1zZy50cyIsInNyYy9Ub29sL1Rvb2wudHMiLCJzcmMvdWkvbGF5YU1heFVJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBLGdEQUF3QztBQUN4QyxvRUFBK0Q7QUFDL0QsMERBQW1FO0FBQ25FLCtEQUEwRDtBQUMxRCw0REFBdUQ7QUFDdkQsd0NBQW1DO0FBQ25DLDREQUF1RDtBQUV2RDtJQUErQyxxQ0FBa0I7SUFHN0Q7ZUFDSSxpQkFBTztJQUNYLENBQUM7SUFDRCxpQkFBaUI7SUFDakIsUUFBUTtJQUNSLG9DQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxV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VUFBRSxRQTBCZiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcclxuaW1wb3J0IHsgUHJvdG9jb2wsIEdhbWVDb25maWcgfSBmcm9tIFwiLi4vLi4vQ29yZS9Db25zdC9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBVc2VyTG9naW5IYW5kbGVyIGZyb20gXCIuL2hhbmRsZXIvVXNlckxvZ2luSGFuZGxlclwiO1xyXG5pbXBvcnQgQ2xpZW50U2VuZGVyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9DbGllbnRTZW5kZXJcIjtcclxuaW1wb3J0IFRvb2wgZnJvbSBcIi4uLy4uL1Rvb2wvVG9vbFwiO1xyXG5pbXBvcnQgTWVzc2FnZU1hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvTWVzc2FnZU1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlbENvbWVDb250cm9sbGVyIGV4dGVuZHMgdWkuV2VsY29tZS5Mb2dpblVJe1xyXG4gICAgLyoq5piv5ZCm6L+e5o6l5LiK5pyN5Yqh5ZmoICovXHJcbiAgICBwcml2YXRlIGlzQ29ubmVjdFNlcnZlciA6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8v55Sf5ZG95ZGo5pyfXHJcbiAgICAvKirlkK/liqggKi9cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5kYXRhSW5pdCgpO1xyXG4gICAgICAgIHRoaXMuc2V0Q2VudGVyKCk7XHJcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0U2VydmVyKCk7Ly/ov57mjqXmnI3liqHlmahcclxuICAgICAgICB0aGlzLmFkZEV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKumUgOavgSovXHJcbiAgICBvbkRlc3Ryb3koKXtcclxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLy8vLy8vLy8vLy/pgLvovpFcclxuICAgIC8qKuaVsOaNruWIneWni+WMliAqL1xyXG4gICAgcHJpdmF0ZSBkYXRhSW5pdCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaXNDb25uZWN0U2VydmVyID0gZmFsc2U7IFxyXG4gICAgfVxyXG4gICAgLyoq5LqL5Lu257uR5a6aICovXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYnRuX2xvZ2luLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uTG9naW4pO1xyXG4gICAgICAgIHRoaXMuYnRuX3JlZ2lzdGVyLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uUmVnaXN0ZXIpO1xyXG4gICAgICAgIHRoaXMuYnRuX3RvTG9naW4ub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Ub0xvZ2luKTtcclxuICAgICAgICB0aGlzLmJ0bl90b1JlZ2lzdGVyLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uVG9SZWdpc3RlcilcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX1VTRVJfTE9HSU4sbmV3IFVzZXJMb2dpbkhhbmRsZXIodGhpcyx0aGlzLm9uTG9naW5IYW5kbGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVFdmVudHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmJ0bl9sb2dpbi5vZmYoTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Mb2dpbik7XHJcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMudW5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX1VTRVJfTE9HSU4sdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5bGA5Lit5pi+56S6ICovXHJcbiAgICBwcml2YXRlIHNldENlbnRlcigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBjZW50ZXIgPSBUb29sLmdldENlbnRlclgoKTsvL+Wxj+W5lemrmOW6plxyXG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MueCA9IGNlbnRlcjtcclxuICAgICAgICB0aGlzLnNwX2dhbWVOYW1lLnggPSBjZW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBsb2FkQXNzZXRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHNyYyA9IFtcclxuICAgICAgICAgICAge3VybDpcInVucGFja2FnZS93ZWxjb21lL2JveGltZy5wbmdcIn1cclxuICAgICAgICBdO1xyXG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc3JjLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Qcm9jZXNzKSk7XHJcbiAgICAgICAgdGhpcy5vbkxvYWQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3ov5vnqIsgKi9cclxuICAgIHByaXZhdGUgb25Qcm9jZXNzKHBybykgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHByb0JveCA9IHRoaXMuc3BfcHJvZ3Jlc3M7XHJcbiAgICAgICAgbGV0IHByb1cgPSB0aGlzLnNwX3Byb2dyZXNzVztcclxuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xyXG4gICAgICAgIHByb1cud2lkdGggPSBwcm9Cb3gud2lkdGgqcHJvO1xyXG4gICAgICAgIHByb0wueCA9IHByb0JveC53aWR0aCpwcm87XHJcbiAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0U2VydmVyKSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+ato+WcqOi/nuaOpeacjeWKoeWZqOKApuKApl1cIjtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+acjeWKoeWZqOi/nuaOpeaIkOWKn11cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3lrozmr5UgKi9cclxuICAgIHByaXZhdGUgb25Mb2FkKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi5Yqg6L295a6M5q+V6L+b5YWl5ri45oiPXCI7XHJcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDgwMCx0aGlzLHRoaXMuc2hvd0xvZ2luQm94KTtcclxuICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMubmV3RmxvYXRNc2coKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirmmL7npLrnmbvlvZXmoYYqKi9cclxuICAgIHByaXZhdGUgc2hvd0xvZ2luQm94KCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zcF9sb2dpbkJveC52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmFuaTEucGxheSgwLGZhbHNlKTtcclxuICAgICAgICB0aGlzLnNwX2dhbWVOYW1lLnggPSB0aGlzLnNwX2xvZ2luQm94LndpZHRoICsgdGhpcy5zcF9nYW1lTmFtZS53aWR0aC8yICsgMTAwO1xyXG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+eZu+mZhiAqL1xyXG4gICAgcHJpdmF0ZSBvbkxvZ2luKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgQ2xpZW50U2VuZGVyLnJlcVVzZXJMb2dpbih0aGlzLmlucHV0X3VzZXJOYW1lLnRleHQsdGhpcy5pbnB1dF91c2VyS2V5LnRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+azqOWGjCAqL1xyXG4gICAgcHJpdmF0ZSBvblJlZ2lzdGVyKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7sg5bey5pyJ6LSm5Y+3ICovXHJcbiAgICBwcml2YXRlIG9uVG9Mb2dpbigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHuyDms6jlhowgKi9cclxuICAgIHByaXZhdGUgb25Ub1JlZ2lzdGVyKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgQ2xpZW50U2VuZGVyLnJlcVVzZXJSZWdpc3Rlcih0aGlzLmlucHV0X3JlZ2lzdGVyVXNlck5hbWUudGV4dCx0aGlzLmlucHV0X3JlZ2lzdGVyVXNlcktleS50ZXh0LHRoaXMuaW5wdXRfcmVnaXN0ZXJOaWNrTmFtZS50ZXh0KTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPluWIsOa2iOaBryAqL1xyXG4gICAgcHJpdmF0ZSBvbkxvZ2luSGFuZGxlcihkYXRhKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICBpZihkYXRhICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdGV4dCA9IFwi55m76ZmG5oiQ5Yqf77yM6L+b5YWl5ri45oiP77yBXCJcclxuICAgICAgICAgICAgaWYodGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlKSB0ZXh0ID0gXCLms6jlhozmiJDlip/vvIzlsIbnm7TmjqXov5vlhaXmuLjmiI/vvIFcIjtcclxuICAgICAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyh0ZXh0KTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5vbmNlKDgwMCx0aGlzLHRoaXMudG9HYW1lTWFpbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKui/nuaOpeacjeWKoeWZqCAqL1xyXG4gICAgcHJpdmF0ZSBjb25uZWN0U2VydmVyKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuY29ubmVjdChHYW1lQ29uZmlnLklQLEdhbWVDb25maWcuUE9SVCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgcHJpdmF0ZSB0b0dhbWVNYWluKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy9UTyBETyDot7Povazoh7PmuLjmiI/lpKfljoVcclxuICAgIH1cclxufSIsImltcG9ydCBTb2NrZXRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyXCI7XHJcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcblxyXG4vKipcclxuICog55So5oi355m76ZmG6K+35rGCIOi/lOWbnuWkhOeQhlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlckxvZ2luSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcclxuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlc1VzZXJMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzVXNlckxvZ2luXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc1VzZXJMb2dpbi5kZWNvZGUoZGF0YSk7XHJcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxyXG4gICAgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCIvKlxyXG4qIOa4uOaIj+mFjee9rlxyXG4qL1xyXG5leHBvcnQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIC8qKmlwKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgSVAgOiBzdHJpbmcgPSBcIjQ3LjEwNy4xNjkuMjQ0XCI7XHJcbiAgICAvKirnq6/lj6MgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUE9SVCA6IG51bWJlciA9IDc3NzcgIDtcclxuICAgIC8vIC8qKmlwIC0g5pys5Zyw5rWL6K+VKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgSVAgOiBzdHJpbmcgPSBcIjEyNy4wLjAuMVwiO1xyXG4gICAgLy8gLyoq56uv5Y+jIC0g5pys5Zyw5rWL6K+VKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgUE9SVCA6IG51bWJlciA9IDc3Nzc7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKuWNj+iuriAqL1xyXG5leHBvcnQgY2xhc3MgUHJvdG9jb2x7XHJcbiAgICAvLyAvLyoqKioqKioqKioqKmdtTWVzc2FnZS5wcm90b1xyXG4gICAgLy8gLyoq5Y+R6YCBR03lr4bku6QgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0dNX0NPTTpudW1iZXIgPSAxOTkxMDE7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKip1c2VyTWVzc2FnZS5wcm90b1xyXG4gICAgLy8gLyoq5rOo5YaMIDIwMjEwMiovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX1JFR0lTVEVSOm51bWJlciA9IDIwMjEwMjtcclxuICAgIC8vIC8qKueZu+W9leivt+axgiAyMDIxMDMqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9MT0dJTjpudW1iZXIgPSAyMDIxMDM7XHJcblxyXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xyXG4gICAgLy8gLyoq55m75b2V6L+U5ZueIDIwMjIwMSovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVNFUl9MT0dJTjpudW1iZXIgPSAyMDIyMDE7XHJcbiAgICAvLyAvKirmnI3liqHlmajliJfooaggMjAyMjAzKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWRVJfTElTVDpudW1iZXIgPSAyMDIyMDM7XHJcbiAgICAvLyAvKirlhazlkYrpnaLmnb8gMjAyMjA0Ki9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9OT1RJQ0VfQk9BUkQ6bnVtYmVyID0gMjAyMjA0O1xyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqbG9naW5NZXNzYWdlLnByb3RvXHJcbiAgICAvLyAvKirmnI3liqHlmajnmbvlvZXor7fmsYIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfTE9HSU46bnVtYmVyID0gMTAxMTAxO1xyXG4gICAgLy8gLyoq5b+D6Lez5YyF6K+35rGCICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9TRVJWX0hFUlQ6bnVtYmVyID0gMTAxMTAyO1xyXG4gICAgLy8gLyoq6K+35rGC6KeS6Imy5L+h5oGvICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9DUkVBVEVfUExBWUVSOm51bWJlciA9IDEwMTEwMztcclxuICAgIC8vIC8qKuacjeWKoeWZqOi/lOWbnioqKioqKioqKioqKiogKi9cclxuICAgIC8vIC8qKuW/g+i3s+i/lOWbniAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NFUlZfSEVSVDpudW1iZXIgPSAxMDEyMDE7XHJcbiAgICAvLyAvKirov5Tlm57nmbvlvZXplJnor6/mtojmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0VSUk9SOm51bWJlciA9IDEwMTIwMjtcclxuICAgIC8vIC8qKui/lOWbnuiiq+mhtuS4i+e6vyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NVQlNUSVRVVEU6bnVtYmVyID0gMTAxMjAzO1xyXG5cclxuICAgIC8vKioqKioqKioqKioqKioqKlVzZXJQcm90by5wcm90b1xyXG4gICAgLyoq6K+35rGCIG1zZ0lkID0gMTAxMTAzICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX0xPR0lOIDogbnVtYmVyID0gMTAxMTAzO1xyXG4gICAgLyoqMTAxMTA0IOazqOWGjOivt+axgiAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBSRVFfVVNFUl9SRUdJU1RFUiA6IG51bWJlciA9IDEwMTEwNDtcclxuICAgIC8qKuWTjeW6lCBtc2dJZCA9IDEwMTIwMyAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBSRVNfVVNFUl9MT0dJTiA6IG51bWJlciA9IDEwMTIwMztcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKnBsYXllck1lc3NhZ2UucHJvdG9cclxuICAgIC8vIC8v6K+35rGCXHJcbiAgICAvLyAvKiror7fmsYLmia3om4sgbXNnSWQ9MTAyMTAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9HQUNIQTpudW1iZXIgPSAxMDIxMDE7XHJcblxyXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xyXG4gICAgLy8gLyoq55m76ZmG6L+U5Zue6KeS6Imy5Z+65pys5L+h5oGvICBtc2dJZD0xMDIyMDEgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0lORk86bnVtYmVyID0gMTAyMjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5oiQ5YqfICBtc2dJZD0xMDIyMDIgICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfT1BSRUFURV9TVUNDRVNTOm51bWJlciA9IDEwMjIwMjtcclxuICAgIC8vIC8qKui/lOWbnuaTjeS9nOWksei0pSAgbXNnSWQ9MTAyMjAzICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfRkFJTDpudW1iZXIgPSAxMDIyMDM7XHJcbiAgICAvLyAvKirov5Tlm57op5LoibLlj5HnlJ/lj5jljJblkI7nmoTlsZ7mgKfkv6Hmga8o5YiX6KGoKSAgbXNnSWQ9MTAyMjA0ICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BMQVlFUl9BVFRSSUJVVEVfRVFVQUw6bnVtYmVyID0gMTAyMjA0O1xyXG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNSAgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QTEFZRVJfQVRUUklCVVRFX1VQREFURTpudW1iZXIgPSAxMDIyMDU7XHJcbiAgICAvLyAvKirov5Tlm57mia3om4sgbXNnSWQ9MTAyMjA2ICAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0dBQ0hBOm51bWJlciA9IDEwMjIwNjtcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKnNraWxsTWVzc2FnZS5wcm90b1xyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLeivt+axgua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKuivt+axguaJgOacieaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0FMTF9TS0lMTF9JTkZPOm51bWJlciA9IDEwNzEwMTtcclxuICAgIC8vIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZJR0hUX1NLSUxMX0xJU1Q6bnVtYmVyID0gMTA3MTAyO1xyXG4gICAgLy8gLyoq6K+35rGC5Y2H57qn5oqA6IO9IG1zZ0lkPTEwNzEwM1x0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVBfU0tJTEw6bnVtYmVyID0gMTA3MTAzO1xyXG4gICAgLy8gLyoq6K+35rGC6YeN572u5oqA6IO9IG1zZ0lkPTEwNzEwNFx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA3MTA0O1xyXG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9IG1zZ0lkPTEwNzEwNVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQUxURVJfR1JJRF9TS0lMTDpudW1iZXIgPSAxMDcxMDU7XHJcblxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuaJgOacieaKgOiDveS/oeaBryAgbXNnSWQ9MTA3MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue5Ye65oiY5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9GSUdIVF9TS0lMTF9MSVNUOm51bWJlciA9IDEwNzIwMjtcclxuICAgIC8vIC8qKui/lOWbnuWNh+e6p+aKgOiDvSAgbXNnSWQ9MTA3MjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVBfU0tJTEw6bnVtYmVyID0gMTA3MjAzO1xyXG4gICAgLy8gLyoq6L+U5Zue6YeN572u5oqA6IO95oiQ5Yqf77yM5a6i5oi356uv5pS25Yiw5q2k5raI5oGv77yM5pys5Zyw56e76Zmk5YWo6YOo5oqA6IO9ICBtc2dJZD0xMDcyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcyMDQ7XHJcbiAgICAvLyAvKirov5Tlm57mlLnlj5jmoLzlrZDmioDog70gIG1zZ0lkPTEwNzIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0FMVEVSX0dSSURfU0tJTEw6bnVtYmVyID0gMTA3MjA1O1xyXG5cclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBwZXRNZXNzYWdlXHJcbiAgICAvLyAvKiror7fmsYLlrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA1MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUxMDE7XHJcbiAgICAvLyAvKiror7fmsYLmlLnlj5jkuIrpmLXlrqDniankv6Hmga8gbXNnSWQ9MTA1MTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQUxURVJfR1JJRDpudW1iZXIgPSAxMDUxMDI7XHJcbiAgICAvLyAvKiror7fmsYLlloLlrqDnianlkIPppa0gbXNnSWQ9MTA1MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfRkVFRDpudW1iZXIgPSAxMDUxMDM7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianlkIjmiJAgbXNnSWQ9MTA1MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQ09NUE9VTkQ6bnVtYmVyID0gMTA1MTA0O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp6aKG5oKf5oqA6IO9IG1zZ0lkPTEwNTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1NUVURZX1NLSUxMOm51bWJlciA9IDEwNTEwNjtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDUxMDc7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianmioDog73ov5vpmLYgbXNnSWQ9MTA1MTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA4ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MTA4O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGNIG1zZ0lkPTEwNTEwOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElORzpudW1iZXIgPSAxMDUxMDk7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfRVZPTFZFOm51bWJlciA9IDEwNTExMDtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqeWtteWMliBtc2dJZD0xMDUxMTFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9IQVRDSDpudW1iZXIgPSAxMDUxMTE7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MTEyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVHSVNURVI6bnVtYmVyID0gMTA1MTEyO1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1JFUV9NQVRJTkc6bnVtYmVyID0gMTA1MTEzO1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5omA5pyJ5L+h5oGvIG1zZ0lkPTEwNTExNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNCDlpoLmnpzlrqDnianmnKzouqvmnInnmbvorrDmlbDmja7vvIzkvYbnuYHooY3mlbDmja7mib7kuI3liLDvvIjov5Tlm57mtojmga9tc2dJZD0xMDUyMTLlkoxtc2dJZD0xMDUyMTPmm7TmlrDlrqLmiLfnq6/mlbDmja7vvIkgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQUxMSU5GTzpudW1iZXIgPSAxMDUxMTQ7XHJcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MTE1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTExNTtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUxMTZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTbvvIzlpoLmnpzmmK/lkIzmhI/vvIzlr7nmlrnnjqnlrrblpoLmnpzlnKjnur/vvIzkvJrmlLbliLBtc2dJZD0xMDUyMTDmtojmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQ0hPT1NFOm51bWJlciA9IDEwNTExNjtcclxuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUxMTdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0g6bnVtYmVyID0gMTA1MTE3O1xyXG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55uu5qCH5p+l55yLIG1zZ0lkPTEwNTExOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElOR19UQVJHRVRfTE9PSzpudW1iZXIgPSAxMDUxMTg7XHJcbiAgICAvLyAvKiror7fmsYLlrqDnianmlL7nlJ8gbXNnSWQ9MTA1MTE5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfRlJFRTpudW1iZXIgPSAxMDUxMTk7XHJcblxyXG5cclxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAvKirov5Tlm57lrqDnianmiYDmnInkv6Hmga/vvIjnmbvlvZXmiJDlip/kuLvliqjov5Tlm57vvIltc2dJZD0xMDUyMDEqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9BTExfSU5GTzpudW1iZXIgPSAxMDUyMDE7XHJcbiAgICAvLyAvLyDov5Tlm57lrqDnianmoLzlrZDkv6Hmga8gbXNnSWQ9MTA1MjAyXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX0dSSURfSU5GTzpudW1iZXIgPSAxMDUyMDI7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MjAzKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUyMDM7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannrYnnuqflkoznu4/pqozkv6Hmga/vvIjmraTmtojmga/lnKjlrqDniannu4/pqozlj5HnlJ/lj5jljJblsLHkvJrov5Tlm57nu5nlrqLmiLfnq6/vvIkgbXNnSWQ9MTA1MjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA0O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5oqA6IO9562J57qn5ZKM5oqA6IO957uP6aqM5L+h5oGv77yI5q2k5raI5oGv5Zyo5a6g54mp5oqA6IO957uP6aqM5Y+R55Sf5Y+Y5YyW5bCx5Lya6L+U5Zue57uZ5a6i5oi356uv77yJIG1zZ0lkPTEwNTIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NLSUxMX0xWX0VYUF9JTkZPOm51bWJlciA9IDEwNTIwNTtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUyMDYgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9TVFVEWV9TS0lMTDpudW1iZXIgPSAxMDUyMDY7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianph43nva7mioDog70gbXNnSWQ9MTA1MjA3ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MjA3O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5oqA6IO96L+b6Zi2IG1zZ0lkPTEwNTIwOCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NLSUxMX1VQOm51bWJlciA9IDEwNTIwODtcclxuXHJcbiAgICAvLyAvKirov5Tlm57lrqDniankuqTphY0gbXNnSWQ9MTA1MjA5ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HVDpudW1iZXIgPSAxMDUyMDk7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianlop7liqDnuYHooY3mrKHmlbAgbXNnSWQ9MTA1MjEwICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfQUREX01BVElOR19DT1VOVDpudW1iZXIgPSAxMDUyMTA7XHJcbiAgICAvLyAvKirov5Tlm57lrqDnianov5vljJYgbXNnSWQ9MTA1MjExICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfRVZPTFZFOm51bWJlciA9IDEwNTIxMTtcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeeZu+iusCBtc2dJZD0xMDUyMTIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUyMTI7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MjEzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVRX01BVElORzpudW1iZXIgPSAxMDUyMTM7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MjE0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0FMTElORk86bnVtYmVyID0gMTA1MjE0O1xyXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp57mB6KGN5p+l55yL6K+35rGC5YiX6KGoIG1zZ0lkPTEwNTIxNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NFTEVDVF9SRVFfTElTVDpudW1iZXIgPSAxMDUyMTU7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MjE2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0NIT09TRTpudW1iZXIgPSAxMDUyMTY7XHJcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3nm67moIfliLfmlrAgbXNnSWQ9MTA1MjE3ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNIOm51bWJlciA9IDEwNTIxNztcclxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaUvueUnyBtc2dJZD0xMDUyMTggKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9GUkVFOm51bWJlciA9IDEwNTIxODtcclxuICAgIFxyXG5cclxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIGVxdWlwTWVzc2FnZVxyXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTUFLRTpudW1iZXIgPSAxMDkxMDE7XHJcbiAgICAvLyAvKiror7fmsYLoo4XlpIfliIbop6MgbXNnSWQ9MTA5MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9TUExJVDpudW1iZXIgPSAxMDkxMDZcclxuICAgIC8vIC8qKuivt+axguijheWkh+mUgeWumuaIluino+mUgSBtc2dJZD0xMDkxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0xPQ0s6bnVtYmVyID0gMTA5MTA0O1xyXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5by65YyWIG1zZ0lkPTEwOTEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfQVRUX0FERDpudW1iZXIgPSAxMDkxMDU7XHJcbiAgICAvLyAvKiror7fmsYLoo4XlpIfnqb/miLQgbXNnSWQ9MTA5MTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9MT0FESU5HOm51bWJlciA9IDEwOTEwMjtcclxuICAgIC8vIC8qKuivt+axguijheWkh+WNuOi9vSBtc2dJZD0xMDkxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX1VOTE9BRElORzpudW1iZXIgPSAxMDkxMDM7XHJcblxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuijheWkh+aJk+mAoCBtc2dJZD0xMDkyMDEgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX01BS0UgPSAxMDkyMDE7XHJcbiAgICAvLyAvKirov5Tlm57oo4XlpIfliIbop6MgbXNnSWQ9MTA5MjA2ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9TUExJVCA9IDEwOTIwNjtcclxuICAgIC8vIC8qKui/lOWbnuijheWkh+W8uuWMliBtc2dJZD0xMDkyMDUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX0FUVF9BREQgPSAxMDkyMDU7XHJcbiAgICAvLyAvKirov5Tlm57oo4XlpIfnqb/miLQgbXNnSWQ9MTA5MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0FESU5HID0gMTA5MjAyO1xyXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5Y246L29IG1zZ0lkPTEwOTIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfVU5MT0FESU5HID0gMTA5MjAzO1xyXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfTE9DSyA9IDEwOTIwNDtcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBtYXBNZXNzYWdlXHJcbiAgICAvLyAvKiror7fmsYLlnLDlm77mma7pgJrmiJjmlpfvvIjlrqLmiLfnq6/kuIDlnLrmiJjmlpfnu5PmnZ/kuYvlkI7lj5HpgIHmraTmtojmga/vvIzlho3ov5vooYzlgJLorqHml7blkozmnKzlnLDlgYfmiJjmlpfvvIkgbXNnSWQ9MTA2MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfTk9STUFMX0ZJR0hUOm51bWJlciA9IDEwNjEwMTtcclxuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyBtc2dJZD0xMDYxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9TUEVFRF9GSUdIVDpudW1iZXIgPSAxMDYxMDQ7XHJcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaHmiavojaHmiJjmlpcgbXNnSWQ9MTA2MTA1XHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1dFRVBfRklHSFQ6bnVtYmVyID0gMTA2MTA1O1xyXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h6LSt5Lmw5omr6I2hIG1zZ0lkPTEwNjEwNlx0XHQtLS0tLei/lOWbnua2iOaBryDov5Tlm57miJDlip/mtojmga/vvIxjb2RlPTEwMDAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfQlVZX1NXRUVQOm51bWJlciA9IDEwNjEwNjtcclxuICAgIC8vIC8qKuivt+axguWFs+WNoeWBh+aImOaWl+e7k+adn+mihuWPluWlluWKsSBtc2dJZD0xMDYxMDlcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDYyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9OT1JNQUxfRklHSFRfRU5EOm51bWJlciA9IDEwNjEwOTtcclxuICAgIC8vIC8qKuivt+axguWRiuivieacjeWKoeWZqOaImOaWl+aSreaUvue7k+adn++8iOS7heS7heW6lOeUqOS6juaJgOacieecn+aImOaWl++8iSBtc2dJZD0xMDYxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDMqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVFJVRV9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTAyO1xyXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5YWz5Y2hYm9zc+aImOaWlyBtc2dJZD0xMDYxMDNcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDQgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9TQ0VORV9GSUdIVDpudW1iZXIgPSAxMDYxMDM7XHJcbiAgICAvLyAvKiror7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfQ0hBTkdFX1NDRU5FOm51bWJlciA9IDEwNjEwODtcclxuXHJcblxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuemu+e6v+WSjOaJq+iNoeaUtuebiuS/oeaBryBtc2dJZD0xMDYyMDIqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfT0ZGX0xJTkVfQVdBUkRfSU5GTzpudW1iZXIgPSAxMDYyMDI7XHJcbiAgICAvLyAvKirov5Tlm57miJjmlpfmkq3mlL7nu5PmnZ/lj5HmlL7lpZblirHvvIjlupTnlKjkuo7miYDmnInmiJjmlpfvvIkgbXNnSWQ9MTA2MjAzKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYyMDM7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogcGFja01lc3NhZ2VcclxuICAgIC8vIC8qKuS9v+eUqOmBk+WFt+a2iOaBryAgbXNnSWQ9MTA0MTAxIOi/lOWbnuaTjeS9nOaIkOWKn+a2iOaBryAgbXNnSWQ9MTAyMjAyIGNvZGU9MTAwMDHvvIjmmoLlrprvvIzmoLnmja7lrp7pmYXkvb/nlKjmlYjmnpzlho3lgZrvvIkqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFOm51bWJlciA9IDEwNDEwMTtcclxuXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6YGT5YW35Y+Y5YyW5L+h5oGvICBtc2dJZD0xMDQyMDIgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BST1BfSU5GTzpudW1iZXIgPSAxMDQyMDI7XHJcbiAgICAvLyAvKirov5Tlm57og4zljIXmiYDmnInkv6Hmga/vvIjnmbvlvZXmiJDlip/kuLvliqjov5Tlm57vvIkgIG1zZ0lkPTEwNDIwMSjmnInlj6/og73kuLrnqbrliJfooagpKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BBQ0tfQUxMX0lORk86bnVtYmVyID0gMTA0MjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6KOF5aSH5Y+Y5YyW5L+h5oGvIG1zZ0lkPTEwNDIwMyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfSU5GTzpudW1iZXIgPSAxMDQyMDM7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmaWdodE1lc3NhZ2VcclxuICAgIC8vIC8qKuivt+axguaJk+W8gOmCruS7tuiuvue9ruW3suivuyBtc2dJZD0xMTExMDEg5peg6L+U5Zue5raI5oGvIOWuouaIt+err+aJk+W8gOaXoOWlluWKsemCruS7tu+8jOiHquihjOiuvue9ruW3suivu+eKtuaAgSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfT1BFTl9NQUlMOm51bWJlciA9IDExMTEwMTtcclxuICAgIC8vIC8qKuivt+axgumihuWPlumCruS7tuWlluWKsSBtc2dJZD0xMTExMDJcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFJTF9BV0FSRDpudW1iZXIgPSAxMTExMDI7XHJcbiAgICAvLyAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BSUxfREVMRVRFOm51bWJlciA9IDExMTEwMztcclxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAvKirov5Tlm57pgq7ku7bkv6Hmga8gbXNnSWQ9MTExMjAx77yI55m76ZmG5Li75Yqo6L+U5ZueIOaIluiAhSDlj5HnlJ/lj5jljJbov5Tlm57vvIkgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX01BSUxfSU5GTzpudW1iZXIgPSAxMTEyMDE7XHJcbiAgICAvLyAvKirov5Tlm57pgq7ku7blt7Lpooblj5bmiJDlip8gbXNnSWQ9MTExMjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0FXQVJEOm51bWJlciA9IDExMTIwMjtcclxuICAgIC8vIC8qKui/lOWbnuWIoOmZpOmCruS7tuaIkOWKnyBtc2dJZD0xMTEyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX01BSUxfREVMRVRFOm51bWJlciA9IDExMTIwMztcclxuXHJcbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKioqIGZpZ2h0TWVzc2FnZVxyXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIC8qKui/lOWbnuS4gOWcuuaImOaWl+aXpeW/lyBtc2dJZD0xMDgyMDEqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfVFJVRV9GSUdIVF9MT0dfSU5GTzpudW1iZXIgPSAxMDgyMDE7XHJcblxyXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmcmllbmRNZXNzYWdlXHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmjqjojZAgbXNnSWQ9MTEyMTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAxICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIxMDE7XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfU0VBUkNIOm51bWJlciA9IDExMjEwMjtcclxuICAgIC8vIC8qKuivt+axguWlveWPi+eUs+ivtyBtc2dJZD0xMTIxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDMgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BUFBMWTpudW1iZXIgPSAxMTIxMDM7XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmk43kvZwgbXNnSWQ9MTEyMTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA0ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjEwNDtcclxuICAgIC8vIC8qKuivt+axguWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDUgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9NT1JFX0lORk86bnVtYmVyID0gMTEyMTA1O1xyXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L6YCB56S8IG1zZ0lkPTExMjEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0dJRlQ6bnVtYmVyID0gMTEyMTA2XHJcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA3ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfQWxsX0luZm86bnVtYmVyID0gMTEyMTA3O1xyXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0ZJR0hUOm51bWJlciA9IDExMjEwODtcclxuXHJcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjIwMSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX1BVU0g6bnVtYmVyID0gMTEyMjAxO1xyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pCc57SiIG1zZ0lkPTExMjIwMiAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX1NFQVJDSDpudW1iZXIgPSAxMTIyMDI7XHJcbiAgICAvLyAvKirov5Tlm57lpb3lj4vnlLPor7cgbXNnSWQ9MTEyMjAzICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfQVBQTFk6bnVtYmVyID0gMTEyMjAzO1xyXG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pON5L2cIG1zZ0lkPTExMjIwNCAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX09QRVJBVElPTjpudW1iZXIgPSAxMTIyMDQ7XHJcbiAgICAvLyAvKirov5Tlm57lpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMjA1ICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfTU9SRV9JTkZPOm51bWJlciA9IDExMjIwNTtcclxuICAgIC8vIC8qKui/lOWbnuWlveWPi+mAgeekvCBtc2dJZD0xMTIyMDYgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9HSUZUOm51bWJlciA9IDExMjIwNjtcclxuICAgIC8vIC8qKui/lOWbnuWlveWPi+aJgOacieS/oeaBryBtc2dJZD0xMTIyMDcgKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9BTExfSU5GTzpudW1iZXIgPSAxMTIyMDc7ICAgIFxyXG5cclxufSIsImltcG9ydCBGbG9hdE1zZyBmcm9tIFwiLi4vVG9vbC9GbG9hdE1zZ1wiO1xyXG5pbXBvcnQgVG9vbCBmcm9tIFwiLi4vVG9vbC9Ub29sXCI7XHJcblxyXG4vKipcclxuICog5raI5oGv5pi+56S6566h55CG5ZmoXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlTWFuYWdlciB7XHJcbiAgICAvKirljZXkvosgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zIDogTWVzc2FnZU1hbmFnZXIgPSBuZXcgTWVzc2FnZU1hbmFnZXI7XHJcbiAgICAvKirlsY/luZXmi6XmnInnmoTmta7liqjmtojmga/orqHmlbAqL1xyXG4gICAgcHVibGljIGNvdW50RmxvYXRNc2cgOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuY291bnRGbG9hdE1zZyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmta7liqjmtojmga/pooTng60s77yM5o+Q5YmN5paw5bu65LiA5LiqZmxvYXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIG5ld0Zsb2F0TXNnKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGZsb2F0TXNnID0gbmV3IEZsb2F0TXNnKCk7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmbG9hdE1zZyk7XHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJGbG9hdE1zZ1wiLGZsb2F0TXNnKTsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmmL7npLrmta7liqjmtojmga9cclxuICAgICAqIEBwYXJhbSB0ZXh0ICDmmL7npLrmtojmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dGbG9hdE1zZyh0ZXh0OnN0cmluZykgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGZsb2F0TXNnIDogRmxvYXRNc2cgPSBMYXlhLlBvb2wuZ2V0SXRlbShcIkZsb2F0TXNnXCIpO1xyXG4gICAgICAgIGlmKExheWEuUG9vbC5nZXRQb29sQnlTaWduKFwiRmxvYXRNc2dcIikubGVuZ3RoID09IDApIHRoaXMubmV3RmxvYXRNc2coKTtcclxuICAgICAgICBpZihmbG9hdE1zZyAgPT09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmbG9hdE1zZyA9IG5ldyBGbG9hdE1zZygpO1xyXG4gICAgICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZsb2F0TXNnKTsgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBmbG9hdE1zZy56T3JkZXIgPSAxMDAgKyB0aGlzLmNvdW50RmxvYXRNc2c7XHJcbiAgICAgICAgY29uc29sZS5sb2coVG9vbC5nZXRDZW50ZXJYKCkpO1xyXG4gICAgICAgIGZsb2F0TXNnLnNob3dNc2codGV4dCx7eDpUb29sLmdldENlbnRlclgoKSArIHRoaXMuY291bnRGbG9hdE1zZyoyMCx5OiAzNzUgKyB0aGlzLmNvdW50RmxvYXRNc2cqMjB9KTtcclxuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2crKztcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sIH0gZnJvbSBcIi4uL0NvbnN0L0dhbWVDb25maWdcIjtcclxuXHJcbi8qXHJcbiog5a6i5oi356uv5Y+R6YCB5ZmoXHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNlbmRlcntcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAqIOeUqOaIt+eZu+W9lSAxMDExMDNcclxuICAgICogQHBhcmFtIHVzZXJOYW1lIFxyXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXHJcbiAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZXFVc2VyTG9naW4odXNlck5hbWU6c3RyaW5nLHVzZXJLZXk6c3RyaW5nKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlcVVzZXJMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxVXNlckxvZ2luXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcclxuICAgICAgICBtZXNzYWdlLnVzZXJLZXkgPSB1c2VyS2V5O1xyXG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyTG9naW4uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfTE9HSU4sYnVmZmVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICBcclxuICAgIC8qKlxyXG4gICAgICog55So5oi35rOo5YaMIDEwMTEwNFxyXG4gICAgICogQHBhcmFtIHVzZXJOYW1lIFxyXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXHJcbiAgICAqIEBwYXJhbSB1c2VyTmlja05hbWVcclxuICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlcVVzZXJSZWdpc3Rlcih1c2VyTmFtZTpzdHJpbmcsdXNlcktleTpzdHJpbmcsdXNlck5pY2tOYW1lOnN0cmluZyk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHZhciBSZXFVc2VyUmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJSZWdpc3RlclwiKTtcclxuICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgICAgICB2YXIgdXNlckRhdGE6YW55ID0ge307XHJcbiAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xyXG4gICAgICAgIG1lc3NhZ2UudXNlcktleSA9IHVzZXJLZXk7XHJcbiAgICAgICAgdXNlckRhdGEubmlja05hbWUgPSB1c2VyTmlja05hbWU7XHJcbiAgICAgICAgdXNlckRhdGEubHYgPSAxO1xyXG4gICAgICAgIG1lc3NhZ2UudXNlckRhdGEgPSB1c2VyRGF0YTtcclxuICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXNlclJlZ2lzdGVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKirmtojmga/lj5HpgIEqL1xyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqd2ViU29ja2V0ICovXHJcbiAgICAvKirlj5HpgIFHTeWvhuS7pCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHbU1zZyhnbTpzdHJpbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxR01Db21tOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFHTUNvbW1cIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5jb21tID0gZ207XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUdNQ29tbS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfR01fQ09NLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq5b+D6Lez5YyFICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHNlcnZIZWFydFJlcSgpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9TRVJWX0hFUlQpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDnlKjmiLfms6jlhoxcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlclJlcSh1c2VyTmFtZTpzdHJpbmcsdXNlclBhc3M6c3RyaW5nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVJlZ2lzdGVyVXNlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUmVnaXN0ZXJVc2VyXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcclxuLy8gICAgICAgICBtZXNzYWdlLnVzZXJQYXNzID0gdXNlclBhc3M7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVJlZ2lzdGVyVXNlci5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFUl9SRUdJU1RFUixidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDnmbvlvZXmnI3liqHlmahcclxuLy8gICAgICAqIEBwYXJhbSB0b2tlbiBcclxuLy8gICAgICAqIEBwYXJhbSBzZXJ2SWQgXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgbG9naW5TZXJ2UmVxKHNlcnZJZDpudW1iZXIpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUxvZ2luXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuY29kZSA9IEdhbWVEYXRhTWFuYWdlci5pbnMubG9naW5BdXRoZW50aWNhdGlvbjtcclxuLy8gICAgICAgICBtZXNzYWdlLnNlcnZlcklkID0gc2VydklkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuYWdlbnRJZCA9IDE7XHJcbi8vICAgICAgICAgbWVzc2FnZS5jbGllbnRJZCA9IDE7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUxvZ2luLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9TRVJWX0xPR0lOLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOWIm+W7uuinkuiJslxyXG4vLyAgICAgICogQHBhcmFtIHNleCBcclxuLy8gICAgICAqIEBwYXJhbSBwbGF5ZXJOYW1lIFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZVBsYXllclJlcShzZXg6bnVtYmVyLHBsYXllck5hbWU6c3RyaW5nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUNyZWF0ZVBsYXllcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxQ3JlYXRlUGxheWVyXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gc2V4O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGxheWVyTmFtZSA9IHBsYXllck5hbWU7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUNyZWF0ZVBsYXllci5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfQ1JFQVRFX1BMQVlFUixidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguaJgOacieaKgOiDveS/oeaBryAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFBbGxTa2lsbEluZm8oKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfQUxMX1NLSUxMX0lORk8pO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5Ye65oiY5oqA6IO95L+h5oGvICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUZpZ2h0U2tpbGxMaXN0KCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZJR0hUX1NLSUxMX0xJU1QpOyAgIFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5Y2H57qn5oqA6IO9ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVVwU2tpbGwoc2tpbGxVcEx2Vm9zOkFycmF5PFNraWxsVXBMdlZvPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFVcFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVcFNraWxsXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2Uuc2tpbGxMaXN0ID0gW107XHJcbi8vICAgICAgICAgdmFyIGluZm86YW55O1xyXG4vLyAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBza2lsbFVwTHZWb3MubGVuZ3RoO2krKylcclxuLy8gICAgICAgICB7XHJcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcclxuLy8gICAgICAgICAgICAgaW5mby5za2lsbElkID0gc2tpbGxVcEx2Vm9zW2ldLnNraWxsSWQ7XHJcbi8vICAgICAgICAgICAgIGluZm8udG9Ta2lsbElkID0gc2tpbGxVcEx2Vm9zW2ldLnRvU2tpbGxJZDtcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QucHVzaChpbmZvKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVwU2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VQX1NLSUxMLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC6YeN572u5oqA6IO9ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVJlc2V0U2tpbGwoKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUkVTRVRfU0tJTEwpOyAgIFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5L2/55So6YGT5YW3ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVVzZShwcm9wSWQ6TG9uZyxudW06bnVtYmVyLGFyZ3M/OnN0cmluZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFVc2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLm51bSA9IG51bTtcclxuLy8gICAgICAgICBpZihhcmdzKVxyXG4vLyAgICAgICAgICAgICBtZXNzYWdlLmFyZ3MgPSBhcmdzO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRSxidWZmZXIpOyAgXHJcbi8vICAgICB9XHJcbiAgICBcclxuLy8gICAgIC8qKuivt+axguWuoOeJqeWQiOaIkCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRDb21wb3VuZChwcm9wSWQ6TG9uZylcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0Q29tcG91bmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldENvbXBvdW5kXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRDb21wb3VuZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0NPTVBPVU5ELGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKuivt+axguWWguWuoOeJqeWQg+mlrSovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEZlZWQocGV0SWQ6TG9uZyxwcm9wTGlzdDpBcnJheTxQcm9wVm8+KTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldEZlZWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEZlZWRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcExpc3QgPSBwcm9wTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0RmVlZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0ZFRUQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcblxyXG5cclxuLy8gICAgIC8qKuivt+axguaUueWPmOagvOWtkOaKgOiDvSAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFBbHRlckdyaWRTa2lsbCh0eXBlOm51bWJlcixza2lsbFVwR3JpZDpTa2lsbFVwR3JpZFZvKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUFsdGVyR3JpZFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFBbHRlckdyaWRTa2lsbFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlOyAgICAgICAgXHJcbi8vICAgICAgICAgdmFyIHZvOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIHZvLmdyaWRJZCA9IHNraWxsVXBHcmlkLmdyaWRJZDtcclxuLy8gICAgICAgICB2by5za2lsbElkID0gc2tpbGxVcEdyaWQuc2tpbGxJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmdyaWQgPSB2bzsgICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFBbHRlckdyaWRTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7ICAgICAgICBcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9BTFRFUl9HUklEX1NLSUxMLGJ1ZmZlcik7ICAgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLmlLnlj5jlrqDnianpmLXlnovmoLzlrZAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0QWx0ZXJHcmlkKHR5cGU6bnVtYmVyLGdyaWRMaXN0OkFycmF5PExpbmV1cEdyaWRWbz4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0QWx0ZXJHcmlkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRBbHRlckdyaWRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTtcclxuLy8gICAgICAgICBtZXNzYWdlLmdyaWRMaXN0ID0gW107XHJcbi8vICAgICAgICAgdmFyIGluZm86YW55O1xyXG4vLyAgICAgICAgIGZvcih2YXIgaSA9IDA7aSA8IGdyaWRMaXN0Lmxlbmd0aDtpKyspXHJcbi8vICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICBpbmZvID0ge307XHJcbi8vICAgICAgICAgICAgIGluZm8uZ3JpZElkID0gZ3JpZExpc3RbaV0uZ3JpZElkO1xyXG4vLyAgICAgICAgICAgICBpbmZvLnBldElkID0gZ3JpZExpc3RbaV0uaGVyb0lkO1xyXG4vLyAgICAgICAgICAgICBtZXNzYWdlLmdyaWRMaXN0LnB1c2goaW5mbyk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRBbHRlckdyaWQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9BTFRFUl9HUklELGJ1ZmZlcik7ICAgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguaJreibiyBtc2dJZD0xMDIxMDFcclxuLy8gICAgICAqIEBwYXJhbSBtb25leVR5cGUgLy8g5omt6JuL57G75Z6LIDA96YeR5biB5oq9IDE96ZK755+z5oq9XHJcbi8vICAgICAgKiBAcGFyYW0gbnVtVHlwZSDmrKHmlbDnsbvlnosgMD3lhY3otLnljZXmir0gMT3ljZXmir0gMj3ljYHov57mir1cclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHYWNoYShtb25leVR5cGU6bnVtYmVyLG51bVR5cGU6bnVtYmVyKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUdhY2hhOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFHYWNoYVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSBtb25leVR5cGU7XHJcbi8vICAgICAgICAgbWVzc2FnZS5udW1UeXBlID0gbnVtVHlwZTtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR2FjaGEuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0dBQ0hBLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHlv6vpgJ/miJjmlpcgKi9cclxuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcFNwZWVkRmlnaHQoKTp2b2lkXHJcbi8vICAgICAge1xyXG4vLyAgICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfU1BFRURfRklHSFQpO1xyXG4vLyAgICAgIH1cclxuXHJcbi8vICAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h6LSt5Lmw5omr6I2hICovXHJcbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBCdXlTd2VlcCgpOnZvaWRcclxuLy8gICAgICB7XHJcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9CVVlfU1dFRVApO1xyXG4vLyAgICAgIH0gICBcclxuXHJcbi8vICAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h5omr6I2hICAqL1xyXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU3dlZXBGaWdodChzY2VuZUlkOm51bWJlcik6dm9pZFxyXG4vLyAgICAgIHtcclxuLy8gICAgICAgICAgdmFyICBSZXFNYXBTd2VlcEZpZ2h0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXBTd2VlcEZpZ2h0XCIpO1xyXG4vLyAgICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICAgbWVzc2FnZS5zY2VuZUlkID0gc2NlbmVJZDtcclxuLy8gICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1hcFN3ZWVwRmlnaHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfU1dFRVBfRklHSFQsYnVmZmVyKTtcclxuLy8gICAgICB9XHJcblxyXG4vLyAgICAgLyoq6ZqP5py65Yib5bu65LiA5p2h6b6ZICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJhbmRvbUNyZWF0ZSgpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkFORE9NX0NSRUFURSk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlnLDlm77mma7pgJrmiJjmlpfvvIjlrqLmiLfnq6/kuIDlnLrmiJjmlpfnu5PmnZ/kuYvlkI7lj5HpgIHmraTmtojmga/vvIzlho3ov5vooYzlgJLorqHml7blkozmnKzlnLDlgYfmiJjmlpfvvIkgbXNnSWQ9MTA2MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAxICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcE5vcm1hbEZpZ2h0KCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9OT1JNQUxfRklHSFQpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5YWz5Y2h5YGH5oiY5paX57uT5p2f6aKG5Y+W5aWW5YqxIG1zZ0lkPTEwNjEwOVx0XHQtLS0tLei/lOWbnua2iOaBryDov5Tlm57miJDlip/mtojmga/vvIxjb2RlPTEwNjIwMyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBOb3JtYWxGaWdodEVuZCgpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORCk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlnLDlm77lhbPljaFib3Nz5oiY5paXIG1zZ0lkPTEwNjEwM1x0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwNCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTY2VuZUZpZ2h0KCk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TQ0VORV9GSUdIVCk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlkYror4nmnI3liqHlmajmiJjmlpfmkq3mlL7nu5PmnZ/vvIjku4Xku4XlupTnlKjkuo7miYDmnInnnJ/miJjmlpfvvIkgbXNnSWQ9MTA2MTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAzICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVR1cmVGaWdodEVuZCgpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9UUlVFX0ZJR0hUX0VORCk7XHJcbi8vICAgICB9XHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIOivt+axguWIh+aNouWcsOWbvuWFs+WNoSBtc2dJZD0xMDYxMDhcdFx0LS0tLS3ov5Tlm57mtojmga8g5Ymv5pysaWTlkozlhbPljaFpZCDlsZ7mgKflj5jljJbmtojmga9cclxuLy8gICAgICAqIEBwYXJhbSBzY2VuZUlkIFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcENoYW5nZVNjZW5lKHNjZW5lSWQ6bnVtYmVyKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcU1hcENoYW5nZVNjZW5lOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXBDaGFuZ2VTY2VuZVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnNjZW5lSWQgPSBzY2VuZUlkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBDaGFuZ2VTY2VuZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX0NIQU5HRV9TQ0VORSxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniankuqTphY0gbXNnSWQ9MTA1MTA5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA5XHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQxIFxyXG4vLyAgICAgICogQHBhcmFtIHBldElkMiBcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmcocGV0SWQxOkxvbmcscGV0SWQyOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZDEgPSBwZXRJZDE7XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZDIgPSBwZXRJZDI7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElORyxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExXHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQxIOi/m+WMluWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKiBAcGFyYW0gYmVQZXRJZExpc3Qg5raI6ICX5a6g54mpaWTliJfooahcclxuLy8gICAgICAqIEBwYXJhbSBwcm9wSWQg5raI6ICX6YGT5YW35ZSv5LiAaWRcclxuLy8gICAgICAqIEBwYXJhbSBwcm9wTnVtIOa2iOiAl+mBk+WFt+aVsOmHj1xyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEV2b2x2ZShwZXRJZDpMb25nLGJlUGV0SWRMaXN0OkFycmF5PExvbmc+LHByb3BJZExpc3Q6QXJyYXk8TG9uZz4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0RXZvbHZlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRFdm9sdmVcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIGlmKGJlUGV0SWRMaXN0Lmxlbmd0aCA+IDApXHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuYmVQZXRJZExpc3QgPSBiZVBldElkTGlzdDtcclxuLy8gICAgICAgICBpZihwcm9wSWRMaXN0Lmxlbmd0aCA+IDApXHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2UucHJvcElkTGlzdCA9IHByb3BJZExpc3Q7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEV2b2x2ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0VWT0xWRSxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDnianlrbXljJYgbXNnSWQ9MTA1MTExXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjAzXHJcbi8vICAgICAgKiBAcGFyYW0gZWdnSWQg5a6g54mp6JuL5ZSv5LiAaWRcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRIYXRjaChlZ2dJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldEhhdGNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRIYXRjaFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLmVnZ0lkID0gZWdnSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEhhdGNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfSEFUQ0gsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTExMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMlxyXG4vLyAgICAgICogQHBhcmFtIGVnZ0lkIOWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkIOmcgOimgeWTgei0qOadoeS7tmlkKDDooajnpLrkuI3pmZDliLYpXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmVnaXN0ZXIocGV0SWQ6TG9uZyxxdWFsaXR5SWQ6bnVtYmVyKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldFJlZ2lzdGVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRSZWdpc3RlclwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWQgPSBxdWFsaXR5SWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlZ2lzdGVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVHSVNURVIsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxM1xyXG4vLyAgICAgICogQHBhcmFtIHBldElkIOivt+axguaWueWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKiBAcGFyYW0gdG9QZXRJZCDmjqXmlLbmlrnlrqDnianllK/kuIBpZFxyXG4vLyAgICAgICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJlcU1hdGluZyhwZXRJZDpMb25nLHRvUGV0SWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRSZXFNYXRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlcU1hdGluZ1wiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVxTWF0aW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVRX01BVElORyxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MTE0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE0XHJcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAgMT3lip/vvIwyPemYsu+8jDM96YCf77yMND3ooYDvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIGNvbmZpZ0lkIOWuoOeJqemFjee9rmlk77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqIEBwYXJhbSBnZW5kZXIgIOWuoOeJqeaAp+WIq++8iDA96KGo56S65YWo6YOo77yJXHJcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkTGlzdCDlrqDnianlk4HotKhpZO+8iDA96KGo56S65YWo6YOo77yJXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nQWxsSW5mbyhwZXRUeXBlOm51bWJlcixjb25maWdJZDpudW1iZXIsZ2VuZGVyOm51bWJlcixxdWFsaXR5SWRMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nQWxsSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nQWxsSW5mb1wiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldFR5cGUgPSBwZXRUeXBlO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuY29uZmlnSWQgPSBjb25maWdJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmdlbmRlciA9IGdlbmRlcjtcclxuLy8gICAgICAgICBpZihxdWFsaXR5SWRMaXN0Lmxlbmd0aCA+IDApXHJcbi8vICAgICAgICAgICAgIG1lc3NhZ2UucXVhbGl0eUlkTGlzdCA9IHF1YWxpdHlJZExpc3Q7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ0FsbEluZm8uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQUxMSU5GTyxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MTE1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE1XHJcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg5a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTZWxlY3RSZXFMaXN0KHBldElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0U2VsZWN0UmVxTGlzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U2VsZWN0UmVxTGlzdFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFNlbGVjdFJlcUxpc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1QsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN5ZCM5oSP5oiW5ouS57udIG1zZ0lkPTEwNTExNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNu+8jOWmguaenOaYr+WQjOaEj++8jOWvueaWueeOqeWutuWmguaenOWcqOe6v++8jOS8muaUtuWIsG1zZ0lkPTEwNTIxMOa2iOaBr1xyXG4vLyAgICAgICogQHBhcmFtIHBldElkIOaIkeaWueWuoOeJqeWUr+S4gGlkXHJcbi8vICAgICAgKiBAcGFyYW0gdG9QZXRJZCDlr7nmlrnlrqDnianllK/kuIBpZFxyXG4vLyAgICAgICogQHBhcmFtIGlzQ29uc2VudCDmmK/lkKblkIzmhI8gdHJ1ZT3lkIzmhI9cclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdDaG9vc2UocGV0SWQ6TG9uZyx0b1BldElkOkxvbmcsaXNDb25zZW50OmJvb2xlYW4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nQ2hvb3NlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdDaG9vc2VcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QZXRJZCA9IHRvUGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5pc0NvbnNlbnQgPSBpc0NvbnNlbnQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ0Nob29zZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19DSE9PU0UsYnVmZmVyKTtcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN55uu5qCH5Yi35pawIG1zZ0lkPTEwNTExN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxN1xyXG4vLyAgICAgICogQHBhcmFtIHBldFR5cGUgMT3lip/vvIwyPemYsu+8jDM96YCf77yMND3ooYDvvIgwPeihqOekuuWFqOmDqO+8iVxyXG4vLyAgICAgICogQHBhcmFtIGNvbmZpZ0lkIOWuoOeJqemFjee9rmlk77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqIEBwYXJhbSBnZW5kZXIg5a6g54mp5oCn5Yir77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWRMaXN0IOWuoOeJqeWTgei0qGlk77yIMD3ooajnpLrlhajpg6jvvIlcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoKHBldFR5cGU6bnVtYmVyLGNvbmZpZ0lkOm51bWJlcixnZW5kZXI6bnVtYmVyLHF1YWxpdHlJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0VHlwZSA9IHBldFR5cGU7XHJcbi8vICAgICAgICAgbWVzc2FnZS5jb25maWdJZCA9IGNvbmZpZ0lkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gZ2VuZGVyO1xyXG4vLyAgICAgICAgIGlmKHF1YWxpdHlJZExpc3QubGVuZ3RoID4gMClcclxuLy8gICAgICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWRMaXN0ID0gcXVhbGl0eUlkTGlzdDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nVGFyZ2V0UmVmcmVzaC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19UQVJHRVRfUkVGUkVTSCxidWZmZXIpO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3nm67moIfmn6XnnIsgbXNnSWQ9MTA1MTE4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4XHJcbi8vICAgICAgKiBAcGFyYW0gdG9QbGF5ZXJJZCDooqvmn6XnnIvlrqDniannmoTkuLvkurrnmoRpZFxyXG4vLyAgICAgICogQHBhcmFtIHRvUGV0SWQg6KKr5p+l55yL5a6g54mp5ZSv5LiAaWRcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdUYXJnZXRMb29rKHRvUGxheWVySWQ6TG9uZyx0b1BldElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nVGFyZ2V0TG9vazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nVGFyZ2V0TG9va1wiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QZXRJZCA9IHRvUGV0SWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ1RhcmdldExvb2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQ0hPT1NFLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcblxyXG5cclxuLy8gICAgIC8qKuivt+axguijheWkh+aJk+mAoCBtc2dJZD0xMDkwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcE1ha2UocHJvcElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRXF1aXBNYWtlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcE1ha2VcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wSWQgPSBwcm9wSWQ7ICAgICAgICBcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBNYWtlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9NQUtFLGJ1ZmZlcik7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcFNwbGl0KGVxdWlwSWQ6QXJyYXk8TG9uZz4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRXF1aXBTcGxpdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBTcGxpdFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgXHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwU3BsaXQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX1NQTElULGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKuivt+axguijheWkh+mUgeWumuaIluino+mUgSBtc2dJZD0xMDkxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDQgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBMb2NrKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9jazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2NrXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgXHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwTG9jay5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTE9DSyxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKiror7fmsYLoo4XlpIflvLrljJYgbXNnSWQ9MTA5MTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA1ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwQXR0QWRkKHBldElkOkxvbmcsZXF1aXBJZDpMb25nLGx1Y2tOdW06bnVtYmVyKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9jazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2NrXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyBcclxuLy8gICAgICAgICBtZXNzYWdlLmx1Y2tOdW0gPSBsdWNrTnVtOyAgICAgICBcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2NrLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9BVFRfQURELGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyBcdC8qKuivt+axguijheWkh+epv+aItCBtc2dJZD0xMDkxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDIgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBMb2FkaW5nKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKVxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFFcXVpcExvYWRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTG9hZGluZ1wiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XHJcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgICAgICAgICAgICAgICBcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2FkaW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9MT0FESU5HLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5Y246L29IG1zZ0lkPTEwOTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcFVuTG9hZGluZyhwZXRJZDpMb25nLGVxdWlwSWQ6TG9uZylcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRXF1aXBVbkxvYWRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwVW5Mb2FkaW5nXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcFVuTG9hZGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfVU5MT0FESU5HLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyBcdC8qKuivt+axguWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDYgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0U3R1ZHlTa2lsbChwZXRJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldFN0dWR5U2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFN0dWR5U2tpbGxcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRTdHVkeVNraWxsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfU1RVRFlfU0tJTEwsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlrqDnianph43nva7mioDog70gbXNnSWQ9MTA1MTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA3Ki9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmVzZXRTa2lsbChwZXRJZDpMb25nLHNraWxsSWRMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxUGV0UmVzZXRTa2lsbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVzZXRTa2lsbFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgIFxyXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcclxuLy8gICAgICAgICBpZihza2lsbElkTGlzdC5sZW5ndGggPiAwKVxyXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnNraWxsSWRMaXN0ID0gc2tpbGxJZExpc3Q7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlc2V0U2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRVNFVF9TS0lMTCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxUGV0U2tpbGxVcChwZXRJZDpMb25nLHNraWxsSWQ6bnVtYmVyKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcVBldFNraWxsVXA6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFNraWxsVXBcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZCA9IHNraWxsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFNraWxsVXAuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TS0lMTF9VUCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuXHJcbi8vIC8qKuivt+axguWuoOeJqeaUvueUnyBtc2dJZD0xMDUxMTlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTggKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RnJlZShwZXRJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlc1BldEZyZWU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlc1BldEZyZWVcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXNQZXRGcmVlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRlJFRSxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gLyoq6K+35rGC6aKG5Y+W6YKu5Lu25aWW5YqxIG1zZ0lkPTExMTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMTIwMiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsQXdhcmQobWFpbElkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxTWFpbEF3YXJkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsQXdhcmRcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxBd2FyZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9BV0FSRCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgICAgLyoq6K+35rGC5Yig6Zmk6YKu5Lu2IG1zZ0lkPTExMTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMTIwMyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsRGVsZXRlKG1haWxJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcU1haWxEZWxldGU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxEZWxldGVcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxEZWxldGUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfREVMRVRFLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKuivt+axguaJk+W8gOmCruS7tuiuvue9ruW3suivuyBtc2dJZD0xMTExMDEg5peg6L+U5Zue5raI5oGvIOWuouaIt+err+aJk+W8gOaXoOWlluWKsemCruS7tu+8jOiHquihjOiuvue9ruW3suivu+eKtuaAgSAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFPcGVuTWFpbChtYWlsSWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFPcGVuTWFpbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxT3Blbk1haWxcIik7XHJcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU9wZW5NYWlsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9PUEVOX01BSUwsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxTWFpbEF3YXJkKG1haWxJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcU1haWxBd2FyZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbEF3YXJkXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsQXdhcmQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfQVdBUkQsYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxTWFpbERlbGV0ZShtYWlsSWQ6TG9uZyk6dm9pZFxyXG4vLyAgICAge1xyXG4vLyAgICAgICAgIHZhciBSZXFNYWlsRGVsZXRlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsRGVsZXRlXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsRGVsZXRlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0RFTEVURSxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWlveWPi+aOqOiNkCBtc2dJZD0xMTIxMDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDEgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kUHVzaCgpOnZvaWRcclxuLy8gICAgIHsgICAgICAgICAgICAgICAgICAgICAgICBcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfUFVTSCk7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5pCc57SiIG1zZ0lkPTExMjEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMiAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRTZWFyY2godG9QbGF5ZXJJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZFNlYXJjaDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kU2VhcmNoXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZFNlYXJjaC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX1NFQVJDSCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuLy8gICAgIC8qKuivt+axguWlveWPi+eUs+ivtyBtc2dJZD0xMTIxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDMgKi9cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kQXBwbHkodG9QbGF5ZXJJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZEFwcGx5OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRBcHBseVwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xyXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRBcHBseS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0FQUExZLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5pON5L2cIG1zZ0lkPTExMjEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNCAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRPcGVyYXRpb24odHlwZTpudW1iZXIsdG9QbGF5ZXJJZDpMb25nKTp2b2lkXHJcbi8vICAgICB7XHJcbi8vICAgICAgICAgdmFyIFJlcUZyaWVuZE9wZXJhdGlvbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kT3BlcmF0aW9uXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7XHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kT3BlcmF0aW9uLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfT1BFUkFUSU9OLGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L6K+m57uG5L+h5oGvIG1zZ0lkPTExMjEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNSAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRNb3JlSW5mbyh0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kTW9yZUluZm86YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZE1vcmVJbmZvXCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgICAgICAgXHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kTW9yZUluZm8uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9NT1JFX0lORk8sYnVmZmVyKTsgXHJcbi8vICAgICB9XHJcbi8vICAgICAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEdpZnQoZ2lmdElkOm51bWJlcix0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kR2lmdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kR2lmdFwiKTtcclxuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxyXG4vLyAgICAgICAgIG1lc3NhZ2UuZ2lmdElkID0gZ2lmdElkO1xyXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XHJcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEdpZnQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9HSUZULGJ1ZmZlcik7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNyAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRBbGxJbmZvKCk6dm9pZFxyXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9BbGxfSW5mbyk7IFxyXG4vLyAgICAgfVxyXG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRGaWdodCh0b1BsYXllcklkOkxvbmcpOnZvaWRcclxuLy8gICAgIHtcclxuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kRmlnaHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEZpZ2h0XCIpO1xyXG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgICAgICAgXHJcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcclxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kRmlnaHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9GSUdIVCxidWZmZXIpOyBcclxuLy8gICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoq55m75b2V6K+35rGCICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGxvZ2luUmVxKGFjY291bnQ6c3RyaW5nKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIExvZ2luUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiTG9naW5SZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2UubmFtZSA9IGFjY291bnQ7XHJcbiAgICAvLyAgICAgbWVzc2FnZS50b2tlbiA9IEdhbWVEYXRhTWFuYWdlci5pbnMubG9naW5Ub2tlbjtcclxuICAgIC8vICAgICBtZXNzYWdlLm5pY2tuYW1lID0gXCJ4aWVsb25nXCI7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IExvZ2luUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5VU0VSX0xPR0lOLFByb3RvY29sLlVTRVJfTE9HSU5fQ01ELGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKirojrflj5boi7Hpm4Tkv6Hmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2V0SGVyb0luZm9SZXEoc3RhdHVzQ29kZTpudW1iZXIpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgSGVyb0luZm9SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJIZXJvSW5mb1JlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gSGVyb0luZm9SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkhFUk8sUHJvdG9jb2wuSEVST19HRVRfSU5GT1MsYnVmZmVyKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKuiLsembhOS4iuOAgeS4i+OAgeabtOaWsOmYteWeiyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBoZXJvTGludWVwVXBkYXRlUmVxKGxpbmV1cElkOm51bWJlcixoZXJvSWQ6c3RyaW5nLGlzVXA6Ym9vbGVhbik6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIGlmKCFpc1VwICYmIEdhbWVEYXRhTWFuYWdlci5pbnMuc2VsZlBsYXllckRhdGEuaGVyb0xpbmV1cERpYy52YWx1ZXMubGVuZ3RoIDw9IDEpXHJcbiAgICAvLyAgICAge1xyXG4gICAgLy8gICAgICAgICBUaXBzTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi6Zi15LiK6Iux6ZuE5LiN5b6X5bCR5LqO5LiA5LiqXCIsMzAsXCIjZmYwMDAwXCIsTGF5ZXJNYW5hZ2VyLmlucy5nZXRMYXllcihMYXllck1hbmFnZXIuVElQX0xBWUVSKSxHYW1lQ29uZmlnLlNUQUdFX1dJRFRILzIsR2FtZUNvbmZpZy5TVEFHRV9IRUlHSFQvMiwxLDAsMjAwKTtcclxuICAgIC8vICAgICAgICAgcmV0dXJuO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICB2YXIgVXBkYXRlRm9ybWF0aW9uUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiVXBkYXRlRm9ybWF0aW9uUmVxdWVzdFwiKTtcclxuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgIC8vICAgICBtZXNzYWdlLnNpdGVJZHggPSBsaW5ldXBJZDtcclxuICAgIC8vICAgICBtZXNzYWdlLmhlcm9JZCA9IGhlcm9JZDtcclxuICAgIC8vICAgICBtZXNzYWdlLmZsYWcgPSBpc1VwO1xyXG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBVcGRhdGVGb3JtYXRpb25SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcclxuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkhFUk8sUHJvdG9jb2wuSEVST19VUERBVEVfRk9STUFUSU9OLGJ1ZmZlcik7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKiror7fmsYLlhbPljaHkv6Hmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZUdhdGVJbmZvUmVxKCk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBHYXRlSW5mb1JlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiR2F0ZUluZm9SZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IDE7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEdhdGVJbmZvUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSU5GTyxidWZmZXIpO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gLyoq5oyR5oiY5YWz5Y2hICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGJhbGx0ZUdhdGVSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgQmF0dGxlR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiQmF0dGxlR2F0ZVJlcXVlc3RcIik7XHJcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XHJcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcclxuICAgIC8vICAgICB2YXIgYnVmZmVyID0gQmF0dGxlR2F0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0JBVFRMRSxidWZmZXIpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIC8qKuivt+axguaJq+iNoeWFs+WNoSAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBzY2FuR2F0ZVJlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBTY2FuR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiU2NhbkdhdGVSZXF1ZXN0XCIpO1xyXG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xyXG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XHJcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFNjYW5HYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XHJcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfU0NBTixidWZmZXIpO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5oyC5py65aWW5Yqx5L+h5oGvICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGdhdGVIYW5ndXBTdGF0ZVJlcSgpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgSGFuZ3VwU3RhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkhhbmd1cFN0YXRlUmVxdWVzdFwiKTtcclxuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSAxO1xyXG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBIYW5ndXBTdGF0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0hBTkRVUF9TVEFURSxidWZmZXIpO1xyXG4gICAgLy8gICAgIC8vIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0hBTkRVUF9TVEFURSk7XHJcbiAgICAvLyB9XHJcbiAgICAvLyAvKiror7fmsYLlhbPljaHmjILmnLrkv6Hmga8gKi9cclxuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZVN3aXRjaEhhbmdSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB2YXIgU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlN3aXRjaEhhbmdHYXRlUmVxdWVzdFwiKTtcclxuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcclxuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xyXG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBTd2l0Y2hIYW5nR2F0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xyXG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX1NXSVRDSF9IQU5HX0dBVEUsYnVmZmVyKTtcclxuICAgIC8vICAgICAvLyBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUpO1xyXG4gICAgLy8gfVxyXG4gICAgXHJcblxyXG5cclxuICAgIC8vIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqSHR0cCAqL1xyXG4gICAgLy8gLyoq5rWL6K+V55m75b2VICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBMb2dpblJlcShhY2NvdW50OnN0cmluZyxwd2Q6c3RyaW5nLGNhbGxlcj86YW55LGNhbGxCYWNrPzpGdW5jdGlvbik6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHZhciBwYXJhbXM6YW55ID0ge307XHJcbiAgICAvLyAgICAgcGFyYW1zLmFjY291bnQgPSBhY2NvdW50O1xyXG4gICAgLy8gICAgIHBhcmFtcy5wYXNzd29yZCA9IHB3ZDtcclxuICAgIC8vICAgICBIdHRwTWFuYWdlci5pbnMuc2VuZChIVFRQUmVxdWVzdFVybC50ZXN0TG9naW5VUkwsSFRUUFJlcVR5cGUuR0VULHBhcmFtcyxjYWxsZXIsY2FsbEJhY2spO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gLyoq6I635Y+W5pyN5Yqh5Zmo5YiX6KGoICovXHJcbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBHYW1lU2VydmVyUmVxKGNhbGxlcj86YW55LGNhbGxCYWNrPzpGdW5jdGlvbik6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLmdhbWVTZXJ2ZXJVUkwsSFRUUFJlcVR5cGUuR0VULG51bGwsY2FsbGVyLGNhbGxCYWNrKTtcclxuICAgIC8vIH1cclxuICAgIC8vIC8qKui/m+WFpea4uOaIjyAqL1xyXG4gICAgLy8gcHVibGljIHN0YXRpYyBodHRwRW50ZXJHYW1lUmVxKHNpZDpudW1iZXIsY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdmFyIHBhcmFtczphbnkgPSB7fTtcclxuICAgIC8vICAgICBwYXJhbXMuc2lkID0gc2lkO1xyXG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLmVudGVyR2FtZVVSTCxIVFRQUmVxVHlwZS5HRVQscGFyYW1zLGNhbGxlcixjYWxsQmFjayk7XHJcbiAgICAvLyB9XHJcbn0iLCIvKlxyXG4qIOWMheino+aekFxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlSW4gZXh0ZW5kcyBMYXlhLkJ5dGV7XHJcbiAgICBcclxuICAgIC8vIHB1YmxpYyBtb2R1bGU6bnVtYmVyO1xyXG4gICAgcHVibGljIGNtZDpudW1iZXI7XHJcbiAgICBwdWJsaWMgYm9keTtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIC8vIHB1YmxpYyByZWFkKG1zZzpPYmplY3QgPSBudWxsKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xyXG4gICAgLy8gICAgIHRoaXMuY2xlYXIoKTtcclxuICAgIC8vICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIobXNnKTtcclxuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XHJcbiAgICAvLyAgICAgLy/moIforrDlkozplb/luqZcclxuICAgIC8vICAgICB2YXIgbWFyayA9IHRoaXMuZ2V0SW50MTYoKTtcclxuICAgIC8vICAgICB2YXIgbGVuID0gdGhpcy5nZXRJbnQzMigpO1xyXG4gICAgLy8gICAgIC8v5YyF5aS0XHJcbiAgICAvLyAgICAgdGhpcy5tb2R1bGUgPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAvLyAgICAgdmFyIHR5cGUgPSB0aGlzLmdldEJ5dGUoKTtcclxuICAgIC8vICAgICB2YXIgZm9ybWF0ID0gdGhpcy5nZXRCeXRlKCk7XHJcbiAgICAvLyAgICAgLy/mlbDmja5cclxuICAgIC8vICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XHJcbiAgICAvLyAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xyXG5cclxuICAgIC8vIH1cclxuICAgIFxyXG4gICAgLy/mlrDpgJrkv6FcclxuICAgIC8vIHB1YmxpYyByZWFkKG1zZzpPYmplY3QgPSBudWxsKTp2b2lkXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xyXG4gICAgLy8gICAgIHRoaXMuY2xlYXIoKTtcclxuICAgIC8vICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIobXNnKTtcclxuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XHJcblxyXG4gICAgLy8gICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XHJcbiAgICAvLyAgICAgLy/mlbDmja5cclxuICAgIC8vICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XHJcbiAgICAvLyAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xyXG5cclxuICAgIC8vIH1cclxuICAgIC8v5paw6YCa5L+hIOeymOWMheWkhOeQhlxyXG4gICAgcHVibGljIHJlYWQoYnVmZkRhdGEpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihidWZmRGF0YSk7XHJcbiAgICAgICAgdGhpcy5wb3MgPSAwO1xyXG5cclxuICAgICAgICB2YXIgbGVuID0gdGhpcy5nZXRJbnQzMigpO1xyXG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5nZXRJbnQzMigpO1xyXG4gICAgICAgIC8v5pWw5o2uXHJcbiAgICAgICAgdmFyIHRlbXBCeXRlID0gdGhpcy5idWZmZXIuc2xpY2UodGhpcy5wb3MpO1xyXG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBVaW50OEFycmF5KHRlbXBCeXRlKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxufVxyXG4iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcblxyXG4vKlxyXG4qIOaJk+WMhVxyXG4qL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlT3V0IGV4dGVuZHMgTGF5YS5CeXRle1xyXG4gICAgLy8gcHJpdmF0ZSBQQUNLRVRfTUFSSyA9IDB4MDtcclxuICAgIC8vIHByaXZhdGUgbW9kdWxlID0gMDtcclxuICAgIC8vIHByaXZhdGUgdHlwZSA9IDA7XHJcbiAgICAvLyBwcml2YXRlIGZvcm1hcnQgPSAwO1xyXG4gICAgcHJpdmF0ZSBjbWQ7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICAvLyBwdWJsaWMgcGFjayhtb2R1bGUsY21kLGRhdGE/OmFueSk6dm9pZFxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcclxuICAgIC8vICAgICB0aGlzLm1vZHVsZSA9IG1vZHVsZTtcclxuICAgIC8vICAgICB0aGlzLmNtZCA9IGNtZDtcclxuICAgIC8vICAgICB0aGlzLndyaXRlSW50MTYodGhpcy5QQUNLRVRfTUFSSyk7XHJcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDMyKGRhdGEuYnl0ZUxlbmd0aCArIDEwKTtcclxuICAgIC8vICAgICAvL+WMheWktFxyXG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLm1vZHVsZSk7XHJcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDMyKHRoaXMuY21kKTtcclxuICAgIC8vICAgICB0aGlzLndyaXRlQnl0ZSh0aGlzLnR5cGUpO1xyXG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMuZm9ybWFydCk7XHJcbiAgICAvLyAgICAgLy/mtojmga/kvZNcclxuICAgIC8vICAgICBpZihkYXRhKVxyXG4gICAgLy8gICAgIHtcclxuICAgIC8vICAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGRhdGEpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAvKirmlrDpgJrkv6EgKi9cclxuICAgIHB1YmxpYyBwYWNrKGNtZCxkYXRhPzphbnkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXHJcblxyXG4gICAgICAgIHRoaXMuY21kID0gY21kO1xyXG4gICAgICAgIHZhciBsZW4gPSAoZGF0YSA/IGRhdGEuYnl0ZUxlbmd0aCA6IDApICsgMTI7XHJcbiAgICAgICAgdmFyIGNvZGU6bnVtYmVyID0gV2ViU29ja2V0TWFuYWdlci5jb2RlQ291bnRebGVuXjUxMjtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLndyaXRlSW50MzIobGVuKTtcclxuICAgICAgICBjb25zb2xlLmxvZygpO1xyXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMihjb2RlKTtcclxuICAgICAgICB0aGlzLndyaXRlSW50MzIodGhpcy5jbWQpO1xyXG4gICAgICAgIGlmKGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIoZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmNvZGVDb3VudCsrIDtcclxuICAgIH1cclxuXHJcbn0iLCIvKlxyXG4qIOaVsOaNruWkhOeQhkhhbmxkZXJcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0SGFuZGxlcntcclxuICAgIC8vIHB1YmxpYyBzdGF0dXNDb2RlOm51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgY2FsbGVyOmFueTtcclxuICAgIHByaXZhdGUgY2FsbEJhY2s6RnVuY3Rpb247XHJcbiAgICBjb25zdHJ1Y3RvcihjYWxsZXI/OmFueSxjYWxsYmFjaz86RnVuY3Rpb24pe1xyXG4gICAgICAgIHRoaXMuY2FsbGVyID0gY2FsbGVyO1xyXG4gICAgICAgIHRoaXMuY2FsbEJhY2sgPSBjYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhwbGFpbihkYXRhPzphbnkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICAvLyB2YXIgc3RhdHVzQ29kZSA9IGRhdGEuc3RhdHVzQ29kZTtcclxuICAgICAgICAvLyBpZihzdGF0dXNDb2RlID09IDApXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICB0aGlzLnN1Y2Nlc3MoZGF0YSk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2VcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKFwi5pyN5Yqh5Zmo6L+U5Zue77yaXCIsZGF0YS5zdGF0dXNDb2RlKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdGhpcy5zdWNjZXNzKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MoZGF0YT86YW55KTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5jYWxsZXIgJiYgdGhpcy5jYWxsQmFjaylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbEJhY2suY2FsbCh0aGlzLmNhbGxlcixkYXRhKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsQmFjay5jYWxsKHRoaXMuY2FsbGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBEaWN0aW9uYXJ5IGZyb20gXCIuLi8uLi9Ub29sL0RpY3Rpb25hcnlcIjtcclxuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi4vRXZlbnRNYW5hZ2VyXCI7XHJcbmltcG9ydCBQYWNrYWdlSW4gZnJvbSBcIi4vUGFja2FnZUluXCI7XHJcbmltcG9ydCBQYWNrYWdlT3V0IGZyb20gXCIuL1BhY2thZ2VPdXRcIjtcclxuaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4vU29ja2V0SGFuZGxlclwiO1xyXG5pbXBvcnQgQ2xpZW50U2VuZGVyIGZyb20gXCIuL0NsaWVudFNlbmRlclwiO1xyXG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XHJcblxyXG4vKipcclxuICogc29ja2V05Lit5b+DXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJTb2NrZXRNYW5hZ2VyIHtcclxuICAgLyoq6YCa5L+hY29kZeasoeaVsCAqL1xyXG4gICBwdWJsaWMgc3RhdGljIGNvZGVDb3VudDpudW1iZXIgPSAwO1xyXG4gICBwcml2YXRlIGlwOnN0cmluZztcclxuICAgcHJpdmF0ZSBwb3J0Om51bWJlcjtcclxuICAgcHJpdmF0ZSB3ZWJTb2NrZXQ6TGF5YS5Tb2NrZXQ7XHJcbiAgIHByaXZhdGUgc29ja2V0SGFubGRlckRpYzpEaWN0aW9uYXJ5O1xyXG4gICBwcml2YXRlIHByb3RvUm9vdDphbnk7XHJcbiAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICB0aGlzLnNvY2tldEhhbmxkZXJEaWMgPSBuZXcgRGljdGlvbmFyeSgpO1xyXG4gICB9XHJcbiAgIHByaXZhdGUgc3RhdGljIF9pbnM6V2ViU29ja2V0TWFuYWdlciA9IG51bGw7XHJcbiAgIHB1YmxpYyBzdGF0aWMgZ2V0IGlucygpOldlYlNvY2tldE1hbmFnZXJ7XHJcbiAgICAgICBpZih0aGlzLl9pbnMgPT0gbnVsbClcclxuICAgICAgIHsgIFxyXG4gICAgICAgICAgIHRoaXMuX2lucyA9IG5ldyBXZWJTb2NrZXRNYW5hZ2VyKCk7XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4gdGhpcy5faW5zO1xyXG4gICB9XHJcblxyXG4gICBwdWJsaWMgY29ubmVjdChpcDpzdHJpbmcscG9ydDpudW1iZXIpOnZvaWRcclxuICAge1xyXG4gICAgICAgdGhpcy5pcCA9IGlwO1xyXG4gICAgICAgdGhpcy5wb3J0ID0gcG9ydDtcclxuXHJcbiAgICAgICB0aGlzLndlYlNvY2tldCA9IG5ldyBMYXlhLlNvY2tldCgpO1xyXG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5PUEVOLHRoaXMsdGhpcy53ZWJTb2NrZXRPcGVuKTtcclxuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuTUVTU0FHRSx0aGlzLHRoaXMud2ViU29ja2V0TWVzc2FnZSk7XHJcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XHJcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50LkVSUk9SLHRoaXMsdGhpcy53ZWJTb2NrZXRFcnJvcik7XHJcbiAgICAgICAvL+WKoOi9veWNj+iurlxyXG4gICAgICAgaWYoIXRoaXMucHJvdG9Sb290KXtcclxuICAgICAgICAgICB2YXIgcHJvdG9CdWZVcmxzID0gW1wib3V0c2lkZS9wcm90by9Vc2VyUHJvdG8ucHJvdG9cIl07XHJcbiAgICAgICAgICAgTGF5YS5Ccm93c2VyLndpbmRvdy5wcm90b2J1Zi5sb2FkKHByb3RvQnVmVXJscyx0aGlzLnByb3RvTG9hZENvbXBsZXRlKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICB9XHJcbiAgICAgICBlbHNlXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIit0aGlzLmlwK1wiOlwiK3RoaXMucG9ydCk7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgLyoq5YWz6Zetd2Vic29ja2V0ICovXHJcbiAgIHB1YmxpYyBjbG9zZVNvY2tldCgpOnZvaWRcclxuICAge1xyXG4gICAgICAgaWYodGhpcy53ZWJTb2NrZXQpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuT1BFTix0aGlzLHRoaXMud2ViU29ja2V0T3Blbik7XHJcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuTUVTU0FHRSx0aGlzLHRoaXMud2ViU29ja2V0TWVzc2FnZSk7XHJcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuQ0xPU0UsdGhpcyx0aGlzLndlYlNvY2tldENsb3NlKTtcclxuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5FUlJPUix0aGlzLHRoaXMud2ViU29ja2V0RXJyb3IpO1xyXG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQgPSBudWxsO1xyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgXHJcbiAgIHByaXZhdGUgcHJvdG9Mb2FkQ29tcGxldGUoZXJyb3Iscm9vdCk6dm9pZFxyXG4gICB7XHJcbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5wcm90b1Jvb3QgPSByb290O1xyXG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMud2ViU29ja2V0LmNvbm5lY3RCeVVybChcIndzOi8vXCIrV2ViU29ja2V0TWFuYWdlci5pbnMuaXArXCI6XCIrV2ViU29ja2V0TWFuYWdlci5pbnMucG9ydCk7XHJcbiAgIH1cclxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRPcGVuKCk6dm9pZFxyXG4gICB7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBvcGVuLi4uXCIpO1xyXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEgPSBuZXcgTGF5YS5CeXRlKCk7XHJcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbjtcclxuICAgICAgIHRoaXMudGVtcEJ5dGUgPSBuZXcgTGF5YS5CeXRlKCk7XHJcbiAgICAgICB0aGlzLnRlbXBCeXRlLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOO1xyXG5cclxuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50ID0gMTtcclxuICAgICAgICAvLyAgICBFdmVudE1hbmFnZXIuaW5zLmRpc3BhdGNoRXZlbnQoRXZlbnRNYW5hZ2VyLlNFUlZFUl9DT05ORUNURUQpO+aaguaXtuS4jemcgOimgeiOt+WPluacjeWKoeWZqOWIl+ihqFxyXG4gICB9XHJcbiAgIC8v57yT5Yay5a2X6IqC5pWw57uEXHJcbiAgIHByaXZhdGUgYnl0ZUJ1ZmZEYXRhOkxheWEuQnl0ZTtcclxuICAgLy/plb/luqblrZfoioLmlbDnu4RcclxuICAgcHJpdmF0ZSB0ZW1wQnl0ZTpMYXlhLkJ5dGU7XHJcbiAgXHJcbiAgIHByaXZhdGUgcGFyc2VQYWNrYWdlRGF0YShwYWNrTGVuKTp2b2lkXHJcbiAgIHtcclxuICAgICAgIC8v5a6M5pW05YyFXHJcbiAgICAgICB0aGlzLnRlbXBCeXRlLmNsZWFyKCk7XHJcbiAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAscGFja0xlbik7XHJcbiAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XHJcbiAgICAgICAvL+aWreWMheWkhOeQhlxyXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEgPSBuZXcgTGF5YS5CeXRlKHRoaXMuYnl0ZUJ1ZmZEYXRhLmdldFVpbnQ4QXJyYXkocGFja0xlbix0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpKTtcclxuICAgICAgIC8vIHRoaXMuYnl0ZUJ1ZmZEYXRhLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLHBhY2tMZW4sdGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoKTtcclxuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFuO1xyXG5cclxuICAgICAgIC8v6Kej5p6Q5YyFXHJcbiAgICAgICB2YXIgcGFja2FnZUluOlBhY2thZ2VJbiA9IG5ldyBQYWNrYWdlSW4oKTtcclxuICAgICAgIC8vIHZhciBidWZmID0gdGhpcy50ZW1wQnl0ZS5idWZmZXIuc2xpY2UoMCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XHJcbiAgICAgICBwYWNrYWdlSW4ucmVhZCh0aGlzLnRlbXBCeXRlLmJ1ZmZlcik7XHJcblxyXG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgbXNnLi4uXCIscGFja2FnZUluLmNtZCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XHJcbiAgICAgICBpZihwYWNrYWdlSW4uY21kID09IDEwNTIwMilcclxuICAgICAgIHtcclxuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuICAgICAgIH1cclxuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIisgcGFja2FnZUluLmNtZDtcclxuICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcclxuICAgICAgIGlmKGhhbmRsZXJzICYmIGhhbmRsZXJzLmxlbmd0aCA+IDApXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgZm9yKHZhciBpID0gaGFuZGxlcnMubGVuZ3RoIC0gMTtpID49IDA7aS0tKVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgaGFuZGxlcnNbaV0uZXhwbGFpbihwYWNrYWdlSW4uYm9keSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIC8vIGhhbmRsZXJzLmZvckVhY2goc29ja2V0SGFubGRlciA9PiB7XHJcbiAgICAgICAgICAgLy8gICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbihwYWNrYWdlSW4uYm9keSk7XHJcblxyXG4gICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgfVxyXG4gICAgICAgXHJcbiAgICAgICAvL+mAkuW9kuajgOa1i+aYr+WQpuacieWujOaVtOWMhVxyXG4gICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID4gNClcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLDQpO1xyXG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcclxuICAgICAgICAgICBwYWNrTGVuID0gdGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpICsgNDtcclxuICAgICAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPj0gcGFja0xlbilcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VQYWNrYWdlRGF0YShwYWNrTGVuKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICBcclxuICAgfVxyXG4gICAvKirop6PmnpDnqbrljIUgKi9cclxuICAgcHJpdmF0ZSBwYXJzZU51bGxQYWNrYWdlKGNtZDpudW1iZXIpOnZvaWRcclxuICAge1xyXG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBjbWQ7XHJcbiAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XHJcbiAgICAgICBpZihoYW5kbGVycylcclxuICAgICAgIHtcclxuICAgICAgICAgICBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xyXG4gICAgICAgICAgICAgICBzb2NrZXRIYW5sZGVyLmV4cGxhaW4oKTtcclxuICAgICAgICAgICB9KTtcclxuICAgICAgIH1cclxuICAgfVxyXG4gICBcclxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRNZXNzYWdlKGRhdGEpOnZvaWRcclxuICAge1xyXG4gICAgICAgdGhpcy50ZW1wQnl0ZSA9IG5ldyBMYXlhLkJ5dGUoZGF0YSk7XHJcbiAgICAgICB0aGlzLnRlbXBCeXRlLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOO1xyXG4gICAgICAgLy8gY29uc29sZS5sb2coXCIuLi4uLnRlc3R3ZWJcIix0aGlzLnRlbXBCeXRlLnBvcyk7XHJcbiAgICAgICBcclxuICAgICAgIGlmKHRoaXMudGVtcEJ5dGUubGVuZ3RoID4gNClcclxuICAgICAgIHtcclxuICAgICAgICAgICBpZih0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgPT0gNCkvL+epuuWMhVxyXG4gICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgdmFyIGNtZDpudW1iZXIgPSB0aGlzLnRlbXBCeXRlLmdldEludDMyKCk7XHJcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VOdWxsUGFja2FnZShjbWQpO1xyXG4gICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuepuuWMhS4uLi4uLi4uLi4uLi4uLi5cIitjbWQpO1xyXG4gICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEud3JpdGVBcnJheUJ1ZmZlcihkYXRhLDAsZGF0YS5ieXRlTGVuZ3RoKTtcclxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5a2X6IqC5oC76ZW/5bqmLi4uLi4uLi4uLi4uLi4uLlwiK3RoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XHJcbiAgICAgICBcclxuICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+IDQpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xyXG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIsMCw0KTtcclxuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XHJcbiAgICAgICAgICAgdmFyIHBhY2tMZW46bnVtYmVyID0gdGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpICsgNDtcclxuICAgICAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPj0gcGFja0xlbilcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VQYWNrYWdlRGF0YShwYWNrTGVuKTtcclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcblxyXG4gICAgICAgXHJcblxyXG5cclxuXHJcbiAgICAgICAvLyB2YXIgcGFja2FnZUluOlBhY2thZ2VJbiA9IG5ldyBQYWNrYWdlSW4oKTtcclxuICAgICAgIC8vIHBhY2thZ2VJbi5yZWFkKGRhdGEpO1xyXG5cclxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG1zZy4uLlwiLHBhY2thZ2VJbi5jbWQpO1xyXG4gICAgICAgLy8gdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBwYWNrYWdlSW4uY21kO1xyXG4gICAgICAgLy8gdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xyXG4gICAgICAgLy8gaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcclxuICAgICAgIC8vICAgICBzb2NrZXRIYW5sZGVyLmV4cGxhaW4ocGFja2FnZUluLmJvZHkpO1xyXG4gICAgICAgLy8gfSk7XHJcbiAgICAgICBcclxuICAgfVxyXG4gICBwcml2YXRlIHdlYlNvY2tldENsb3NlKCk6dm9pZFxyXG4gICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgY2xvc2UuLi5cIik7XHJcbiAgIH1cclxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRFcnJvcigpOnZvaWRcclxuICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IGVycm9yLi4uXCIpO1xyXG4gICB9XHJcbiAgIC8qKlxyXG4gICAgKiDlj5HpgIHmtojmga9cclxuICAgICogQHBhcmFtIGNtZCBcclxuICAgICogQHBhcmFtIGRhdGEgXHJcbiAgICAqL1xyXG4gICBwdWJsaWMgc2VuZE1zZyhjbWQ6bnVtYmVyLGRhdGE/OmFueSk6dm9pZFxyXG4gICB7XHJcbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCByZXEuLi5cIitjbWQpO1xyXG4gICAgICAgdmFyIHBhY2thZ2VPdXQ6UGFja2FnZU91dCA9IG5ldyBQYWNrYWdlT3V0KCk7XHJcbiAgICAgICAvLyBwYWNrYWdlT3V0LnBhY2sobW9kdWxlLGNtZCxkYXRhKTtcclxuICAgICAgIHBhY2thZ2VPdXQucGFjayhjbWQsZGF0YSk7XHJcbiAgICAgICB0aGlzLndlYlNvY2tldC5zZW5kKHBhY2thZ2VPdXQuYnVmZmVyKTtcclxuICAgfVxyXG4gICAvKipcclxuICAgICog5a6a5LmJcHJvdG9idWbnsbtcclxuICAgICogQHBhcmFtIHByb3RvVHlwZSDljY/orq7mqKHlnZfnsbvlnotcclxuICAgICogQHBhcmFtIGNsYXNzU3RyIOexu1xyXG4gICAgKi9cclxuICAgcHVibGljIGRlZmluZVByb3RvQ2xhc3MoY2xhc3NTdHI6c3RyaW5nKTphbnlcclxuICAge1xyXG4gICAgICAgcmV0dXJuIHRoaXMucHJvdG9Sb290Lmxvb2t1cChjbGFzc1N0cik7XHJcbiAgIH1cclxuXHJcbiAgIC8qKuazqOWGjCAqL1xyXG4gICBwdWJsaWMgcmVnaXN0ZXJIYW5kbGVyKGNtZDpudW1iZXIsaGFuZGxlcjpTb2NrZXRIYW5kbGVyKTp2b2lkXHJcbiAgIHtcclxuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gcHJvdG9jb2wrXCJfXCIrY21kO1xyXG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiK2NtZDtcclxuICAgICAgIHZhciBoYW5kbGVyczpBcnJheTxTb2NrZXRIYW5kbGVyPiA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcclxuICAgICAgIGlmKCFoYW5kbGVycylcclxuICAgICAgIHtcclxuICAgICAgICAgICBoYW5kbGVycyA9IFtdO1xyXG4gICAgICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgICAgdGhpcy5zb2NrZXRIYW5sZGVyRGljLnNldChrZXksaGFuZGxlcnMpO1xyXG4gICAgICAgfVxyXG4gICAgICAgZWxzZVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgLyoq5Yig6ZmkICovXHJcbiAgIHB1YmxpYyB1bnJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGNhbGxlcjphbnkpOnZvaWRcclxuICAge1xyXG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiICsgY21kO1xyXG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xyXG4gICAgICAgaWYoaGFuZGxlcnMpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdmFyIGhhbmRsZXI7XHJcbiAgICAgICAgICAgZm9yKHZhciBpID0gaGFuZGxlcnMubGVuZ3RoIC0gMTtpID49IDAgO2ktLSlcclxuICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tpXTtcclxuICAgICAgICAgICAgICAgaWYoaGFuZGxlci5jYWxsZXIgPT09IGNhbGxlcilcclxuICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgaGFuZGxlcnMuc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICAgICAgaWYoaGFuZGxlcnMubGVuZ3RoID09IDApXHJcbiAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICB0aGlzLnNvY2tldEhhbmxkZXJEaWMucmVtb3ZlKGtleSk7XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICB9XHJcbiAgIC8qKua3u+WKoOacjeWKoeWZqOW/g+i3syAqL1xyXG4gICBwdWJsaWMgYWRkSGVydFJlcSgpOnZvaWRcclxuICAge1xyXG4gICAgLy8gICAgdGhpcy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsbmV3IFNlcnZlckhlYXJ0SGFuZGxlcih0aGlzKSk7XHJcbiAgICAvLyAgICBDbGllbnRTZW5kZXIuc2VydkhlYXJ0UmVxKCk7XHJcbiAgICAvLyAgICBMYXlhLnRpbWVyLmxvb3AoMTAwMDAsdGhpcyxmdW5jdGlvbigpOnZvaWR7XHJcbiAgICAvLyAgICAgICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xyXG4gICAgLy8gICAgfSk7XHJcbiAgIH1cclxuICAgcHVibGljIHJlbW92ZUhlYXJ0UmVxKCk6dm9pZFxyXG4gICB7XHJcbiAgICAvLyAgICB0aGlzLnVucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU1BfU0VSVl9IRVJULHRoaXMpO1xyXG4gICAgLy8gICAgTGF5YS50aW1lci5jbGVhckFsbCh0aGlzKTtcclxuICAgfVxyXG59IiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXHJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIlxyXG4vKlxyXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9MTQ0MDtcclxuICAgIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTc1MDtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWRoZWlnaHRcIjtcclxuICAgIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cIm5vbmVcIjtcclxuICAgIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwidG9wXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25IOnN0cmluZz1cImxlZnRcIjtcclxuICAgIHN0YXRpYyBzdGFydFNjZW5lOmFueT1cIldlbGNvbWUvTG9naW4uc2NlbmVcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50c1wiLFdlbENvbWVDb250cm9sbGVyKTtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcblxyXG5cclxuLyoqXHJcbiAqIOa4uOaIj+WFpeWPo1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUVudGVye1xyXG5cdFx0Ly9cclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliJ3lp4vljJYgKi9cclxuICAgIHByaXZhdGUgaW5pdCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgfVxyXG4gICAgLyoq6LWE5rqQ5Yqg6L29ICovXHJcbiAgICBwcml2YXRlIGxvYWQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgYXNzZXRlQXJyID0gW1xyXG4gICAgICAgICAgICB7dXJsOlwidW5wYWNrYWdlL3dlbGNvbWVfYmcucG5nXCJ9LFxyXG4gICAgICAgICAgICB7dXJsOlwiV2VsY29tZS9sb2dpbmJveC5wbmdcIn0sXHJcbiAgICAgICAgICAgIHt1cmw6XCJXZWxjb21lL3Byb2dyZXNzQmcucG5nXCJ9LFxyXG5cclxuICAgICAgICAgICAge3VybDpcInJlcy9hdGxhcy9jb21wLmF0bGFzXCJ9LFxyXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL3dlbGNvbWUuYXRsYXNcIn1cclxuICAgICAgICBdXHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChhc3NldGVBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25sb2FkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbmxvYWQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBHYW1lQ29uZmlnLnN0YXJ0U2NlbmUgJiYgTGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbmltcG9ydCBHYW1lRW50ZXIgZnJvbSBcIi4vR2FtZUVudGVyXCI7XHJcbmNsYXNzIE1haW4ge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG5cdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xyXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xyXG5cclxuXHRcdC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxyXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcclxuXHRcdGlmIChHYW1lQ29uZmlnLnBoeXNpY3NEZWJ1ZyAmJiBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXSkgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0uZW5hYmxlKCk7XHJcblx0XHRpZiAoR2FtZUNvbmZpZy5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xyXG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcclxuXHJcblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xyXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcclxuXHR9XHJcblxyXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcclxuXHRcdC8v5r+A5rS75aSn5bCP5Zu+5pig5bCE77yM5Yqg6L295bCP5Zu+55qE5pe25YCZ77yM5aaC5p6c5Y+R546w5bCP5Zu+5Zyo5aSn5Zu+5ZCI6ZuG6YeM6Z2i77yM5YiZ5LyY5YWI5Yqg6L295aSn5Zu+5ZCI6ZuG77yM6ICM5LiN5piv5bCP5Zu+XHJcblx0XHRMYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xyXG5cdH1cclxuXHJcblx0b25Db25maWdMb2FkZWQoKTogdm9pZCB7XHJcblx0XHRuZXcgR2FtZUVudGVyKCk7XHJcblx0XHQvL+WKoOi9vUlEReaMh+WumueahOWcuuaZr1xyXG5cdH1cclxufVxyXG4vL+a/gOa0u+WQr+WKqOexu1xyXG5uZXcgTWFpbigpO1xyXG4iLCIvKipcclxuICAgICog6K+N5YW4IGtleS12YWx1ZVxyXG4gICAgKlxyXG4gICAgKiAgXHJcbiAgICAqICBrZXlzIDogQXJyYXlcclxuICAgICogIFtyZWFkLW9ubHldIOiOt+WPluaJgOacieeahOWtkOWFg+e0oOmUruWQjeWIl+ihqOOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiBcclxuICAgICogIHZhbHVlcyA6IEFycmF5XHJcbiAgICAqICBbcmVhZC1vbmx5XSDojrflj5bmiYDmnInnmoTlrZDlhYPntKDliJfooajjgIJcclxuICAgICogIERpY3Rpb25hcnlcclxuICAgICogIFB1YmxpYyBNZXRob2RzXHJcbiAgICAqICBcclxuICAgICogICAgICAgICAgXHJcbiAgICAqICBjbGVhcigpOnZvaWRcclxuICAgICogIOa4hemZpOatpOWvueixoeeahOmUruWQjeWIl+ihqOWSjOmUruWAvOWIl+ihqOOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiAgICAgICAgICBcclxuICAgICogIGdldChrZXk6Kik6KlxyXG4gICAgKiAg6L+U5Zue5oyH5a6a6ZSu5ZCN55qE5YC844CCXHJcbiAgICAqICBEaWN0aW9uYXJ5XHJcbiAgICAqICAgICAgICAgICBcclxuICAgICogIGluZGV4T2Yoa2V5Ok9iamVjdCk6aW50XHJcbiAgICAqICDojrflj5bmjIflrprlr7nosaHnmoTplK7lkI3ntKLlvJXjgIJcclxuICAgICogIERpY3Rpb25hcnlcclxuICAgICogICAgICAgICAgXHJcbiAgICAqICByZW1vdmUoa2V5OiopOkJvb2xlYW5cclxuICAgICogIOenu+mZpOaMh+WumumUruWQjeeahOWAvOOAglxyXG4gICAgKiAgRGljdGlvbmFyeVxyXG4gICAgKiAgICAgICAgICBcclxuICAgICogIHNldChrZXk6KiwgdmFsdWU6Kik6dm9pZFxyXG4gICAgKiAg57uZ5oyH5a6a55qE6ZSu5ZCN6K6+572u5YC844CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWN0aW9uYXJ5IHtcclxuICAgIC8qKumUruWQjSAqL1xyXG4gICAgcHJpdmF0ZSBrZXlzIDogQXJyYXk8YW55PjtcclxuICAgIC8qKumUruWAvCAqL1xyXG4gICAgcHJpdmF0ZSB2YWx1ZXMgOiBBcnJheTxhbnk+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5rZXlzID0gbmV3IEFycmF5PGFueT4oKTtcclxuICAgICAgICB0aGlzLnZhbHVlcyA9IG5ldyBBcnJheTxhbnk+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6K6+572uIOmUruWQjSAtIOmUruWAvCAqL1xyXG4gICAgcHVibGljIHNldChrZXk6YW55LHZhbHVlOmFueSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldPT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtleXNbaV0gPSBrZXk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XHJcbiAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g5o+S5YWla2V5W1wiKyBrZXkgK1wiXVwiKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInZhbHVlXCIsdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKumAmui/hyDplK7lkI1rZXkg6I635Y+W6ZSu5YC8dmFsdWUgICovXHJcbiAgICBwdWJsaWMgZ2V0KGtleTphbnkpIDogYW55XHJcbiAgICB7XHJcbiAgICAgICAgLy8gdGhpcy5nZXREaWNMaXN0KCk7IFxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV0gPT09IGtleSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOivjeWFuOS4reayoeaciWtleeeahOWAvFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirojrflj5blr7nosaHnmoTntKLlvJXlgLwgKi9cclxuICAgIHB1YmxpYyBpbmRleE9mKHZhbHVlIDogYW55KSA6IG51bWJlclxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGk8dGhpcy52YWx1ZXMubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudmFsdWVzW2ldID09PSB2YWx1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g6K+N5YW45Lit5rKh5pyJ6K+l5YC8XCIpO1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKua4hemZpCDor43lhbjkuK3mjIflrprplK7lkI3nmoTliaogKi9cclxuICAgIHB1YmxpYyByZW1vdmUoa2V5IDogYW55KSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldID09PSBrZXkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua2V5c1tpXSA9PT0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbaV0gPT09IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOenu+mZpOaIkOWKn1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDnp7vpmaTlpLHotKVcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5riF6Zmk5omA5pyJ55qE6ZSuICovXHJcbiAgICBwdWJsaWMgY2xlYXIoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmtleXMgPSBbXTtcclxuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPluWIl+ihqCAqL1xyXG4gICAgcHVibGljIGdldERpY0xpc3QoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgJBcIiArIGkgKyBcIuOAkS0tLS0tLS0tLS0ta2V5OlwiICsgdGhpcy5rZXlzW2ldKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YWx1ZVwiLHRoaXMudmFsdWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I635Y+W6ZSu5YC85pWw57uEICovXHJcbiAgICBwdWJsaWMgZ2V0VmFsdWVzQXJyKCkgOiBBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuiOt+WPlumUruWQjeaVsOe7hCAqL1xyXG4gICAgcHVibGljIGdldEtleXNBcnIoKSA6IEFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5rZXlzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vdWkvbGF5YU1heFVJXCI7XHJcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOS4remXtOWtl1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXRNc2cgZXh0ZW5kcyB1aS5EaWFsb2dfLkZsb2F0TXNnVUl7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnQoKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmFuaTEuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkRXZlbnQoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uSGlkZGVuKTtcclxuICAgICAgICB0aGlzLmFuaTEub24oTGF5YS5FdmVudC5DT01QTEVURSx0aGlzLHRoaXMub25IaWRkZW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pi+56S65raI5oGv6aOY5a2XXHJcbiAgICAgKiBAcGFyYW0gdGV4dCDmmL7npLrmlofmnKwg44CQ5pyA5aSaMjjkuKrjgJFcclxuICAgICAqIEBwYXJhbSBwb3MgIOS9jee9rnt4OjEwMCx5OjEwMH1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dNc2codGV4dDpzdHJpbmcscG9zOmFueSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTsgXHJcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7ICAgICAgIFxyXG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sYWJfZmxvYXRNc2cudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy54ID0gcG9zLng7XHJcbiAgICAgICAgdGhpcy55ID0gcG9zLnk7XHJcbiAgICAgICAgdGhpcy5hbmkxLnBsYXkoMCxmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkhpZGRlbigpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYW5pMS5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zcF9mbG9hdE1zZy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJGbG9hdE1zZ1wiLHRoaXMpO1xyXG4gICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5jb3VudEZsb2F0TXNnLS07XHJcbiAgICB9XHJcbn0iLCIvKipcclxuICog5bCP5bel5YW3XHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29se1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bGP5bmV5rC05bmz5Lit5b+DIOaoquWdkOagh1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldENlbnRlclgoKSA6IGFueVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiA3NTAvKExheWEuQnJvd3Nlci5jbGllbnRIZWlnaHQvTGF5YS5Ccm93c2VyLmNsaWVudFdpZHRoKS8yOy8v5bGP5bmV5a695bqmXHJcbiAgICB9XHJcbn1cclxuIiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXG5pbXBvcnQgVmlldz1MYXlhLlZpZXc7XHJcbmltcG9ydCBEaWFsb2c9TGF5YS5EaWFsb2c7XHJcbmltcG9ydCBTY2VuZT1MYXlhLlNjZW5lO1xuZXhwb3J0IG1vZHVsZSB1aS5EaWFsb2dfIHtcclxuICAgIGV4cG9ydCBjbGFzcyBGbG9hdE1zZ1VJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGFuaTE6TGF5YS5GcmFtZUFuaW1hdGlvbjtcblx0XHRwdWJsaWMgc3BfZmxvYXRNc2c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGxhYl9mbG9hdE1zZzpMYXlhLkxhYmVsO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiRGlhbG9nXy9GbG9hdE1zZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aS5XZWxjb21lIHtcclxuICAgIGV4cG9ydCBjbGFzcyBMb2dpblVJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGFuaTE6TGF5YS5GcmFtZUFuaW1hdGlvbjtcblx0XHRwdWJsaWMgc3BfbG9naW5Cb3g6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGlucHV0X3VzZXJOYW1lOkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBpbnB1dF91c2VyS2V5OkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBsYWJfdGl0bGU6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgYnRuX2xvZ2luOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fcmVnaXN0ZXI6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzTDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NUOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIHNwX2dhbWVOYW1lOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBzcF9yZWdpc3RlckJveDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaW5wdXRfcmVnaXN0ZXJVc2VyTmFtZTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgaW5wdXRfcmVnaXN0ZXJVc2VyS2V5OkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBidG5fdG9Mb2dpbjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuX3RvUmVnaXN0ZXI6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyTmlja05hbWU6TGF5YS5UZXh0SW5wdXQ7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJXZWxjb21lL0xvZ2luXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyIl19
