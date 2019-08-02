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
