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
