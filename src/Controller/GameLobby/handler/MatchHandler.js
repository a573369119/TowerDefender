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
