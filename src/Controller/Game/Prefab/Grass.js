"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameController_1 = require("./GameController");
var MessageManager_1 = require("../../Core/MessageManager");
var Grass = /** @class */ (function () {
    function Grass(num, view) {
        this.init(num, view);
    }
    /**初始化 */
    Grass.prototype.init = function (num, view) {
        this.num = num;
        this.isMud = false;
        this.sp = new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass" + num + ".png"));
        view.addChild(this.sp);
        this.sp.autoSize = true;
        this.sp.on(Laya.Event.CLICK, this, this.changeState);
    };
    /**转换状态，标记是否为土块 */
    Grass.prototype.changeState = function () {
        //如果是草坪,则变成土块
        if (!this.isMud) {
            //如果此草坪在上一个最后一次记录土块的周围的话，则可变为土块
            var mudsp = GameController_1.default.Instance.myFac.mudArray[GameController_1.default.Instance.myFac.mudArray.length - 1].sp;
            if ((Math.abs(mudsp.x - this.sp.x) == 100 && (mudsp.y == this.sp.y)) ||
                (Math.abs(mudsp.y - this.sp.y) == 100 && (mudsp.x == this.sp.x))) {
                this.changeImg();
            }
            else {
                //否则就不能点击其他区域的草坪
                MessageManager_1.default.ins.showFloatMsg("请在土块周围建立道路！");
            }
        }
        else {
            this.changeImg();
        }
    };
    /**切换图片 */
    Grass.prototype.changeImg = function () {
        this.sp.graphics.clear();
        //如果是草坪,则变成土块
        if (!this.isMud) {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/mud.png"));
            this.isMud = true;
            if (GameController_1.default.Instance.myFac.mudArray[0] != null) {
                GameController_1.default.Instance.myFac.mudArray[GameController_1.default.Instance.myFac.mudArray.length - 1].sp.mouseEnabled = false;
            }
            else {
                this.sp.mouseEnabled = false;
            }
            GameController_1.default.Instance.myFac.mudArray.push(this);
        }
        else //如果是土块,则变成草坪
         {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass" + this.num + ".png"));
            this.isMud = false;
            GameController_1.default.Instance.myFac.mudArray[GameController_1.default.Instance.myFac.mudArray.length - 2].sp.mouseEnabled = true;
            GameController_1.default.Instance.myFac.mudArray.pop();
        }
    };
    return Grass;
}());
exports.default = Grass;
