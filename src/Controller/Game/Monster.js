"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameController_1 = require("./GameController");
var Monster = /** @class */ (function () {
    function Monster(view, x, y) {
        this.ani = new Laya.Animation();
        this.ani.zOrder = 1;
        this.ani.pos(x, y);
        view.addChild(this.ani);
    }
    /**根据方向选择动画 */
    Monster.prototype.typeAnimation = function (direction) {
        this.ani.stop();
        this.ani.loadAnimation("Game/anis/monster_" + direction + ".ani");
    };
    /**开启怪兽移动 */
    Monster.prototype.monster_OpenMoveByDir = function () {
        Laya.timer.frameLoop(1, this, this.monster_Move, [0]);
        this.typeAnimation(this.getAnimByDir(GameController_1.default.Instance.monsterFac.dirArray[0][0], GameController_1.default.Instance.monsterFac.dirArray[0][1]));
        this.ani.play(0, true);
    };
    /**怪兽移动 */
    Monster.prototype.monster_Move = function (i) {
        if ((Math.abs(this.ani.x - GameController_1.default.Instance.myFac.mudArray[i].sp.x) <= 100 && (this.ani.y - GameController_1.default.Instance.myFac.mudArray[i].sp.y == 0)) ||
            (Math.abs(this.ani.y - GameController_1.default.Instance.myFac.mudArray[i].sp.y) <= 100 && (this.ani.x - GameController_1.default.Instance.myFac.mudArray[i].sp.x == 0))) {
            this.moveDistance(5, GameController_1.default.Instance.monsterFac.dirArray[i][0], GameController_1.default.Instance.monsterFac.dirArray[i][1]);
        }
        else {
            this.ani.x = GameController_1.default.Instance.myFac.mudArray[i].sp.x + GameController_1.default.Instance.monsterFac.dirArray[i][0] * 100;
            this.ani.y = GameController_1.default.Instance.myFac.mudArray[i].sp.y + GameController_1.default.Instance.monsterFac.dirArray[i][1] * 100;
            Laya.timer.clear(this, this.monster_Move);
            if (i < GameController_1.default.Instance.myFac.mudArray.length - 2) {
                Laya.timer.frameLoop(1, this, this.monster_Move, [i + 1]);
                var dir = this.getAnimByDir(GameController_1.default.Instance.monsterFac.dirArray[i + 1][0], GameController_1.default.Instance.monsterFac.dirArray[i + 1][1]);
                this.typeAnimation(dir);
                this.ani.play(0, true);
            }
            else {
                this.goGetCrystalRoad();
            }
        }
    };
    /**根据怪兽计算路径方向决定动画播放 */
    Monster.prototype.getAnimByDir = function (x, y) {
        var dir;
        if (x == 1) {
            dir = "right";
        }
        else if (x == -1) {
            dir = "left";
        }
        if (y == 1) {
            dir = "down";
        }
        else if (y == -1) {
            dir = "up";
        }
        return dir;
    };
    /**开始前往抢夺水晶的道路 */
    Monster.prototype.goGetCrystalRoad = function () {
        var dirX;
        var type;
        if (GameController_1.default.Instance.camp == "red") {
            dirX = 1;
            type = "right";
        }
        else {
            dirX = -1;
            type = "left";
        }
        Laya.timer.frameLoop(1, this, this.moveDistance, [5, dirX, 0]);
        this.typeAnimation(type);
        this.ani.play(0, true);
    };
    /**移动距离 */
    Monster.prototype.moveDistance = function (speed, dirX, dirY) {
        this.ani.x += speed * dirX;
        this.ani.y += speed * dirY;
    };
    return Monster;
}());
exports.default = Monster;
