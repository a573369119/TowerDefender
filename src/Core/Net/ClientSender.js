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
