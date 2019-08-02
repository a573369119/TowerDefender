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
