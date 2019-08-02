"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var GrassFactory_1 = require("./GrassFactory");
var MessageManager_1 = require("../../Core/MessageManager");
var MonsterFactory_1 = require("./MonsterFactory");
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
        this.monsterCount = 1;
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
        if (this.game.x < -1214) {
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
        this.monsterFac = new MonsterFactory_1.default(this.game, 5, this.myFac.grassArray[10].sp.x, this.myFac.grassArray[10].sp.y);
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
            //先生成第一只怪物
            this.openMonsterMove();
            //开启后续怪物生成计时器
            Laya.timer.frameLoop(240, this, this.openMonsterMove);
        }
        else {
            //否则就不能点击其他区域的草坪
            MessageManager_1.default.ins.showFloatMsg("请正确修建道路！");
        }
    };
    /**怪物后续生成计时器 */
    GameController.prototype.openMonsterMove = function () {
        if (this.monsterCount <= this.monsterFac.monsterArray.length) {
            this.monsterFac.monsterArray[this.monsterCount - 1].typeAnimation("idle");
            this.monsterFac.monsterArray[this.monsterCount - 1].ani.visible = true;
            this.monsterFac.monsterArray[this.monsterCount - 1].ani.play(0, true);
            this.monsterFac.monster_CalMoveDir(this.monsterFac.monsterArray[this.monsterCount - 1]);
            this.monsterFac.monsterArray[this.monsterCount - 1].monster_OpenMoveByDir();
            this.monsterCount++;
        }
        else {
            Laya.timer.clear(this, this.openMonsterMove);
        }
    };
    return GameController;
}(layaMaxUI_1.ui.Game.GameUI));
exports.default = GameController;
