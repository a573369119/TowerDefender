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
var MatchHandler_1 = require("../GameLobby/handler/MatchHandler");
var WelComeController_1 = require("../WelCome/WelComeController");
var Player_1 = require("../WelCome/Player");
var GameLobbyController = /** @class */ (function (_super) {
    __extends(GameLobbyController, _super);
    function GameLobbyController() {
        return _super.call(this) || this;
    }
    /**启动 */
    GameLobbyController.prototype.onEnable = function () {
        this.addEvents();
    };
    /**销毁*/
    GameLobbyController.prototype.onDestroy = function () {
        this.removeEvents();
    };
    /**事件绑定 */
    GameLobbyController.prototype.addEvents = function () {
        this.btn_PVP.on(Laya.Event.CLICK, this, this.onPVPMode);
        this.btn_1V1.on(Laya.Event.CLICK, this, this.on1V1);
        this.btn_5V5.on(Laya.Event.CLICK, this, this.on5V5);
        this.btn_back.on(Laya.Event.CLICK, this, this.onBack);
        this.btn_cancel.on(Laya.Event.CLICK, this, this.onCancel);
        this.btn_entergame.on(Laya.Event.CLICK, this, this.onSure);
        WebSocketManager_1.default.ins.registerHandler(GameConfig_1.Protocol.RES_MATCH_INFO, new MatchHandler_1.default(this, this.onMatchHandler));
    };
    GameLobbyController.prototype.removeEvents = function () {
        this.btn_PVP.off(Laya.Event.CLICK, this, this.onPVPMode);
        WebSocketManager_1.default.ins.unregisterHandler(GameConfig_1.Protocol.RES_MATCH_INFO, this);
    };
    /**点击进入PVP选择界面 */
    GameLobbyController.prototype.onPVPMode = function () {
        this.MenuItemPanel.visible = false;
        this.ModeChoosePanel.visible = true;
    };
    /**获取到消息 */
    GameLobbyController.prototype.onMatchHandler = function (data) {
        console.log(data + "匹配成功");
        if (data !== undefined) {
            Laya.timer.frameOnce(100, this, this.chooseMatch);
        }
    };
    /**点击选择1V1模式，匹配界面只显示玩家和敌人两个头像 */
    GameLobbyController.prototype.on1V1 = function () {
        this.ModeChoosePanel.visible = false;
        this.MatchingPanel.visible = true;
        //ClientSender.reqMatch(1,1);
        for (var i = 0; i < 5; i++) {
            this.red_group._children[i].visible = false;
            this.blue_group._children[i].visible = false;
        }
        this.icon_red_player_3.visible = true;
        this.icon_blue_player_3.visible = true;
        WelComeController_1.default.ins.mode = "1V1";
        //暂时使用，联网后删去
        Laya.timer.frameOnce(60 * 2, this, this.chooseMatch);
        //Laya.timer.frameLoop(60,this,this.calTime);
    };
    /**点击选择5V5模式 */
    GameLobbyController.prototype.on5V5 = function () {
        //WelComeController.ins.mode="5V5";
    };
    /**点击返回游戏大厅 */
    GameLobbyController.prototype.onBack = function () {
        this.MenuItemPanel.visible = true;
        this.ModeChoosePanel.visible = false;
    };
    /**计时，在等待队列等待了多长时间 */
    GameLobbyController.prototype.calTime = function () {
        //this.text_time.text=""
    };
    /**匹配过程中点击取消,返回模式选择界面，从等待房间退出 */ //--网络
    GameLobbyController.prototype.onCancel = function () {
        this.MatchingPanel.visible = false;
        this.ModeChoosePanel.visible = true;
    };
    /**匹配成功弹框，获取敌方玩家信息，选择是否进入游戏 */
    GameLobbyController.prototype.chooseMatch = function () {
        this.MatchingPanel.visible = false;
        this.MatchingSuccessPanel.visible = true;
        //暂时取一个给定的敌方玩家信息                              //--暂时
        WelComeController_1.default.ins.enemyPlayer = new Player_1.default("李四", "gameLobby/player_icon2.png");
        //随机选择一个阵营
        //let random=Math.ceil(Math.random()*2);
        var random = 0;
        if (random == 0) {
            WelComeController_1.default.ins.ownPlayer.camp = "red";
            WelComeController_1.default.ins.enemyPlayer.camp = "blue";
            this.icon_red_player_3.loadImage(WelComeController_1.default.ins.ownPlayer.icon);
            this.icon_blue_player_3.loadImage(WelComeController_1.default.ins.enemyPlayer.icon);
        }
        else {
            WelComeController_1.default.ins.ownPlayer.camp = "blue";
            WelComeController_1.default.ins.enemyPlayer.camp = "red";
            this.icon_blue_player_3.loadImage(WelComeController_1.default.ins.ownPlayer.icon);
            this.icon_red_player_3.loadImage(WelComeController_1.default.ins.enemyPlayer.icon);
        }
    };
    /**点击确定，等待房间内人都确定后跳转进入游戏场景 */ //--网络
    GameLobbyController.prototype.onSure = function () {
        /**我方玩家点击确定发送请求，等待敌方玩家确定 */
        //todo
        Laya.Scene.open("PlayerLoading.scene");
    };
    /**点击拒绝，返回模式选择界面,发送拒绝请求 */ //--网络
    GameLobbyController.prototype.onRefuse = function () {
        //其中一个人发送拒绝请求，直接解散房间
        //todo
        this.ModeChoosePanel.visible = true;
        this.MatchingSuccessPanel.visible = false;
    };
    return GameLobbyController;
}(layaMaxUI_1.ui.GameLobby.GameLobbyUI));
exports.default = GameLobbyController;
},{"../../Core/Const/GameConfig":16,"../../Core/Net/WebSocketManager":22,"../../ui/layaMaxUI":32,"../GameLobby/handler/MatchHandler":2,"../WelCome/Player":12,"../WelCome/WelComeController":13}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketHandler_1 = require("../../../Core/Net/SocketHandler");
var WebSocketManager_1 = require("../../../Core/Net/WebSocketManager");
/**
 * 返回匹配信息 只发送一次
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
},{"../../../Core/Net/SocketHandler":21,"../../../Core/Net/WebSocketManager":22}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var MessageManager_1 = require("../../Core/MessageManager");
var WelComeController_1 = require("../WelCome/WelComeController");
var DefenderItemUI_1 = require("./Prefab/DefenderItemUI");
var Monster_1 = require("./Monster");
var ConfigManager_1 = require("../../Core/ConfigManager");
var MonsterItemUI_1 = require("./Prefab/MonsterItemUI");
var GameController = /** @class */ (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        return _super.call(this) || this;
    }
    GameController.prototype.onEnable = function () {
        GameController.Instance = this;
        WelComeController_1.default.ins.ownPlayer.ownGameInit();
        Laya.timer.frameLoop(1, this, this.mapMove);
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
        if (WelComeController_1.default.ins.ownPlayer.camp == "blue") {
            this.game.x = -1214;
        }
        else {
            this.game.x = 0;
        }
        this.ownPlayerOpen();
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
    };
    /**鼠标抬起 */
    GameController.prototype.onMouseUp = function () {
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
    };
    /***************************************************************************/
    /*******************************己方玩家********************************************/
    /**己方状态开始 */
    GameController.prototype.ownPlayerOpen = function () {
        MessageManager_1.default.ins.showFloatMsg("请先修建道路！");
        this.monsterArray = new Array();
        this.dirArray = new Array();
        this.monsterSignArray = new Array();
        this.defenderItemUIArray = new Array();
        this.monsterItemUIArray = new Array();
        this.player_menuitem.visible = true;
        this.isUseShovel = false;
        this.isMonsterMove = false;
        this.countDownNum = 30;
        this.round = 1;
        this.menuAddDefenderUI();
        this.menuAddMonsterUI();
        WelComeController_1.default.ins.ownPlayer.defenderId = 1;
        WelComeController_1.default.ins.ownPlayer.defenderCoin = this.defenderItemUIArray[0].data.price;
        this.addEvents();
        this.getEnemyMonsterPosNum();
    };
    /**事件绑定 */
    GameController.prototype.addEvents = function () {
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN, this, this.onShovelDown);
        this.btn_build.on(Laya.Event.MOUSE_DOWN, this, this.clickBuild_checkCreateComplete);
        this.btn_buy.on(Laya.Event.MOUSE_DOWN, this, this.clickBuy_Monster);
    };
    /**点击铲子框拾起铲子 */
    GameController.prototype.onShovelDown = function () {
        this.isUseShovel = !this.isUseShovel;
        this.shovel_off.visible = !this.shovel_off.visible;
        this.shovel_on.visible = !this.shovel_on.visible;
        WelComeController_1.default.ins.ownPlayer.group.mouseEnabled = this.isUseShovel;
    };
    /**先由系统随机取0-70的数（每个玩家拥有70块草坪），发送请求给对方，在对方土地占领该土地 */
    GameController.prototype.setRandomMonsterOccupy = function () {
        var random = Math.ceil(Math.random() * 70); //--网络
        //发送给敌方玩家这个位置标号
        //client.send(random);
        //发送后接收回调函数
        this.getEnemyMonsterPosNum();
    };
    /**获取敌方玩家的怪兽在我方草坪占的位置 */
    GameController.prototype.getEnemyMonsterPosNum = function () {
        //获得信息
        //let random=client.get(data)                           //--网络
        var random1 = 0, random2 = 1;
        WelComeController_1.default.ins.ownPlayer.monsterBornGrass = WelComeController_1.default.ins.ownPlayer.fac.grassArray[random1 + random2 * 10];
        //随机取一个10号位草坪变为土块作为怪兽出生点
        WelComeController_1.default.ins.ownPlayer.monsterBornGrass.changeImg();
        WelComeController_1.default.ins.ownPlayer.monsterBornGrass.sp.off(Laya.Event.CLICK, WelComeController_1.default.ins.ownPlayer.monsterBornGrass, WelComeController_1.default.ins.ownPlayer.monsterBornGrass.Event1_changeState);
    };
    /**检查是否建好好路径 */
    GameController.prototype.clickBuild_checkCreateComplete = function () {
        if (WelComeController_1.default.ins.ownPlayer.fac.mudArray[WelComeController_1.default.ins.ownPlayer.fac.mudArray.length - 1] == WelComeController_1.default.ins.ownPlayer.fac.grassArray[39]) {
            //todo
            this.shovelbg.visible = false;
            this.btn_build.off(Laya.Event.MOUSE_DOWN, this, GameController.Instance.onShovelDown);
            this.btn_build.visible = false;
            this.btn_buy.visible = true;
            this.monster_uigroup.visible = true;
            WelComeController_1.default.ins.ownPlayer.group.mouseEnabled = false;
            MessageManager_1.default.ins.showFloatMsg("修建成功！");
            //发送修好路径的请求，等待对方确定修建好路径的请求，需等待时间
            //client.send();                                    //--需要回调函数
        }
        else {
            //否则就不能点击其他区域的草坪
            MessageManager_1.default.ins.showFloatMsg("请正确修建道路！");
        }
    };
    /**菜单栏添加可选择的怪兽 */ //--需读取配置文件
    GameController.prototype.menuAddMonsterUI = function () {
        for (var i = 0; i < ConfigManager_1.default.ins.getConfigLength("monster"); i++) {
            var monsterItemUI = new MonsterItemUI_1.default(this.monster_uigroup, 20 + i * 100, 10, i + 1);
            monsterItemUI.btn_buy.on(Laya.Event.CLICK, this, this.buy_MenuMonster, [i]);
            this.monsterItemUIArray.push(monsterItemUI);
        }
    };
    /**点击菜单栏中的怪兽购买 */
    GameController.prototype.buy_MenuMonster = function (i) {
        WelComeController_1.default.ins.ownPlayer.coin -= this.monsterItemUIArray[i].data.price;
        this.text_coin.text = WelComeController_1.default.ins.ownPlayer.coin.toString();
        this.monsterSignArray.push(i + 1);
    };
    /**每回合购买怪物数量加入数组发送请求给敌方 */
    GameController.prototype.clickBuy_Monster = function () {
        //注销变土事件，注册生成防御塔事件
        WelComeController_1.default.ins.ownPlayer.restGrassAddEvent();
        Laya.timer.frameLoop(60, this, this.countdownOpen);
        this.text_timer.visible = true;
        this.btn_buy.visible = false;
        this.monster_uigroup.visible = false;
        this.defender_uigroup.visible = true;
        WelComeController_1.default.ins.ownPlayer.group.mouseEnabled = true;
        //发送购买完成请求
        //send(this.monsterSignArray)
        this.getEnemyMonsterArray();
    };
    /**接收对方每回合的怪物数组 */
    GameController.prototype.getEnemyMonsterArray = function () {
        var monsterSignArray = [1, 2, 1, 1, 1];
        var player = WelComeController_1.default.ins.ownPlayer;
        for (var i = 0; i < monsterSignArray.length; i++) {
            var monster = Laya.Pool.getItemByClass("monster", Monster_1.default);
            monster.init(player.group, player.monsterBornGrass.sp.x, player.monsterBornGrass.sp.y, monsterSignArray[i]);
            monster.ani.visible = false;
            this.monsterArray.push(monster);
        }
    };
    /**每回合倒计时 */
    GameController.prototype.countdownOpen = function () {
        this.countDownNum--;
        this.text_timer.text = this.countDownNum.toString();
        //倒计时完成后
        if (this.countDownNum == 0) {
            this.countDownNum = 30;
            this.text_timer.visible = false;
            Laya.timer.clear(this, this.countdownOpen);
            //开始怪兽出击
            this.isMonsterMove = true;
            this.monsterCount = 1;
            //先让第一只怪物运动
            this.openMonsterMove();
            //开启后续怪物生成计时器
            Laya.timer.frameLoop(240, this, this.openMonsterMove);
            MessageManager_1.default.ins.showFloatMsg("第" + this.round + "回合");
        }
    };
    /**菜单栏添加可选择的防御塔 */ //--需读取配置文件
    GameController.prototype.menuAddDefenderUI = function () {
        for (var i = 0; i < ConfigManager_1.default.ins.getConfigLength("defender"); i++) {
            var defenderItemUI = new DefenderItemUI_1.default(this.defender_uigroup, 20 + i * 100, 30, i + 1);
            defenderItemUI.sp.on(Laya.Event.CLICK, this, this.click_MenuDefender, [i]);
            this.defenderItemUIArray.push(defenderItemUI);
        }
    };
    /**点击菜单栏中的防御塔 */
    GameController.prototype.click_MenuDefender = function (i) {
        WelComeController_1.default.ins.ownPlayer.defenderId = i + 1;
        WelComeController_1.default.ins.ownPlayer.defenderCoin = this.defenderItemUIArray[i].data.price;
    };
    /**怪物后续生成计时器 */
    GameController.prototype.openMonsterMove = function () {
        if (this.monsterCount <= this.monsterArray.length) {
            this.monsterArray[this.monsterCount - 1].ani.visible = true;
            this.monsterArray[this.monsterCount - 1].ani.play(0, true);
            this.monster_CalMoveDir(this.monsterArray[this.monsterCount - 1]);
            this.monsterArray[this.monsterCount - 1].monster_OpenMoveByDir();
            this.monsterCount++;
        }
        else {
            Laya.timer.clear(this, this.openMonsterMove);
        }
    };
    /**计算所有怪兽的公共路径方向 */
    GameController.prototype.monster_CalMoveDir = function (monster) {
        var dirX, dirY;
        for (var i = 1; i <= WelComeController_1.default.ins.ownPlayer.fac.mudArray.length - 1; i++) {
            if (WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.y - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i - 1].sp.y == 0) {
                if (WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.x - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i - 1].sp.x == 100) {
                    dirX = 1;
                    dirY = 0;
                }
                else {
                    dirX = -1;
                    dirY = 0;
                }
            }
            else if (WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.x - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i - 1].sp.x == 0) {
                if (WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.y - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i - 1].sp.y == 100) {
                    dirX = 0;
                    dirY = 1;
                }
                else {
                    dirX = 0;
                    dirY = -1;
                }
            }
            this.dirArray.push([dirX, dirY]);
        }
    };
    return GameController;
}(layaMaxUI_1.ui.Game.GameUI));
exports.default = GameController;
},{"../../Core/ConfigManager":15,"../../Core/MessageManager":17,"../../ui/layaMaxUI":32,"../WelCome/WelComeController":13,"./Monster":5,"./Prefab/DefenderItemUI":8,"./Prefab/MonsterItemUI":10}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grass_1 = require("./Prefab/Grass");
var GrassFactory = /** @class */ (function () {
    function GrassFactory(camp, view) {
        this.grassArray = new Array();
        this.mudArray = new Array();
        this.createGrassArray(camp, view);
    }
    /**生成草坪 */
    GrassFactory.prototype.createGrassArray = function (camp, view) {
        for (var i = 0; i < 7; i++) {
            for (var j = 0; j < 10; j++) {
                var grass = void 0;
                if (i % 2 == 0) {
                    grass = new Grass_1.default(j % 2 + 1, view);
                }
                else {
                    grass = new Grass_1.default((j + 1) % 2 + 1, view);
                }
                this.grassArray.push(grass);
                grass.Pos(i, j);
            }
        }
    };
    return GrassFactory;
}());
exports.default = GrassFactory;
},{"./Prefab/Grass":9}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameController_1 = require("./GameController");
var WelComeController_1 = require("../WelCome/WelComeController");
var ConfigManager_1 = require("../../Core/ConfigManager");
var Monster = /** @class */ (function () {
    function Monster() {
    }
    /**初始化 */
    Monster.prototype.init = function (view, x, y, num) {
        this.data = ConfigManager_1.default.ins.getConfigById("monster", num);
        this.currHP = this.data.hp;
        this.ani = new Laya.Animation();
        this.ani.zOrder = 1;
        this.ani.pos(x, y);
        view.addChild(this.ani);
        this.hpbg = new Laya.Sprite();
        this.hpbg.graphics.drawTexture(Laya.loader.getRes("game/hpbg.png"));
        this.ani.addChild(this.hpbg);
        this.hpbg.autoSize = true;
        this.hpbg.pos(0, -10);
        this.hpSP = new Laya.Sprite();
        this.hpSP.loadImage("game/hp.png");
        this.hpbg.addChild(this.hpSP);
        this.hpSP.pos(0, 0);
    };
    /**根据方向选择动画 */
    Monster.prototype.typeAnimation = function (direction) {
        this.ani.stop();
        this.ani.loadAnimation("Game/anis/" + this.data.monsterName + "_" + direction + ".ani");
    };
    /**开启怪兽移动 */
    Monster.prototype.monster_OpenMoveByDir = function () {
        Laya.timer.frameLoop(1, this, this.monster_Move, [0]);
        this.typeAnimation(this.getAnimByDir(GameController_1.default.Instance.dirArray[0][0], GameController_1.default.Instance.dirArray[0][1]));
        this.ani.play(0, true);
    };
    /**怪兽移动 */
    Monster.prototype.monster_Move = function (i) {
        if ((Math.abs(this.ani.x - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.x) <= 100 && (this.ani.y - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.y == 0)) ||
            (Math.abs(this.ani.y - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.y) <= 100 && (this.ani.x - WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.x == 0))) {
            this.moveDistance(1, GameController_1.default.Instance.dirArray[i][0], GameController_1.default.Instance.dirArray[i][1]);
        }
        else {
            this.ani.x = WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.x + GameController_1.default.Instance.dirArray[i][0] * 100;
            this.ani.y = WelComeController_1.default.ins.ownPlayer.fac.mudArray[i].sp.y + GameController_1.default.Instance.dirArray[i][1] * 100;
            Laya.timer.clear(this, this.monster_Move);
            if (i < WelComeController_1.default.ins.ownPlayer.fac.mudArray.length - 2) {
                Laya.timer.frameLoop(1, this, this.monster_Move, [i + 1]);
                var dir = this.getAnimByDir(GameController_1.default.Instance.dirArray[i + 1][0], GameController_1.default.Instance.dirArray[i + 1][1]);
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
        if (WelComeController_1.default.ins.ownPlayer.camp == "red") {
            dirX = 1;
            type = "right";
        }
        else {
            dirX = -1;
            type = "left";
        }
        Laya.timer.frameLoop(1, this, this.moveDistance, [1, dirX, 0]);
        this.typeAnimation(type);
        this.ani.play(0, true);
    };
    /**移动距离 */
    Monster.prototype.moveDistance = function (speed, dirX, dirY) {
        this.ani.x += speed * dirX;
        this.ani.y += speed * dirY;
    };
    /**抢夺水晶的道路上检测对方怪兽 */
    Monster.prototype.checkEnemy = function () {
    };
    /**销毁Monster */
    Monster.prototype.Destroy = function () {
        Laya.timer.clearAll(this);
        this.ani.visible = false;
        this.ani.y = -1000;
        Laya.Pool.recover("monster", this);
    };
    return Monster;
}());
exports.default = Monster;
},{"../../Core/ConfigManager":15,"../WelCome/WelComeController":13,"./GameController":3}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tool_1 = require("../../../Tool/Tool");
var Bullet = /** @class */ (function () {
    function Bullet() {
    }
    /**初始化 */
    Bullet.prototype.init = function (view, x, y) {
        this.sp = new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/bullet.png"));
        this.sp.autoSize = true;
        this.sp.pos(x, y);
        this.sp.zOrder = 3;
        view.addChild(this.sp);
    };
    /**追随怪物方向进行移动发射 */
    Bullet.prototype.followMonster = function (monster, speed, damage) {
        if (Tool_1.default.getDistance(this.sp, monster.ani) >= 40) {
            var dirX = (monster.ani.x - this.sp.x) / Tool_1.default.getDistance(this.sp, monster.ani);
            var dirY = (monster.ani.y - this.sp.y) / Tool_1.default.getDistance(this.sp, monster.ani);
            this.sp.x += dirX * speed;
            this.sp.y += dirY * speed;
        }
        else {
            monster.currHP -= damage;
            monster.hpSP.width -= damage / monster.data.hp * monster.hpSP.width;
            if (monster.currHP <= 0) {
                monster.Destroy();
            }
            //碰撞到怪兽
            this.Destroy();
        }
    };
    /**销毁子弹 */
    Bullet.prototype.Destroy = function () {
        Laya.timer.clearAll(this);
        this.sp.visible = false;
        Laya.Pool.recover("bullet", this);
    };
    return Bullet;
}());
exports.default = Bullet;
},{"../../../Tool/Tool":31}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tool_1 = require("../../../Tool/Tool");
var Bullet_1 = require("./Bullet");
var GameController_1 = require("../GameController");
var ConfigManager_1 = require("../../../Core/ConfigManager");
var Defender = /** @class */ (function () {
    function Defender() {
    }
    /**初始化 */
    Defender.prototype.init = function (view, x, y, num) {
        this.data = ConfigManager_1.default.ins.getConfigById("defender", num);
        this.view = view;
        this.isShootingByOne = false;
        this.sp = new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/" + this.data.defenderName + ".png"));
        this.sp.autoSize = true;
        this.sp.pos(x, y);
        this.sp.zOrder = 2;
        view.addChild(this.sp);
        Laya.timer.frameLoop(1, this, this.checkMonsterDistance, [GameController_1.default.Instance.monsterArray]);
    };
    /**范围检测 */
    Defender.prototype.checkMonsterDistance = function (monsterArray) {
        if (GameController_1.default.Instance.isMonsterMove) {
            if (this.isShootingByOne) {
                if ((Tool_1.default.getDistance(this.sp, this.currMonster.ani) >= this.data.dic) || this.currMonster.currHP <= 0) {
                    Laya.timer.clear(this, this.createBullet);
                    this.isShootingByOne = false;
                }
            }
            else {
                for (var i = 0; i < monsterArray.length; i++) {
                    if (Tool_1.default.getDistance(this.sp, monsterArray[i].ani) < this.data.dic) {
                        Laya.timer.frameLoop(this.data.attackFrequency * 60, this, this.createBullet, [monsterArray[i]]);
                        this.currMonster = monsterArray[i];
                        this.isShootingByOne = true;
                        break;
                    }
                }
            }
        }
    };
    /**生成子弹 */
    Defender.prototype.createBullet = function (monster) {
        var bullet = Laya.Pool.getItemByClass("bullet", Bullet_1.default);
        bullet.init(this.view, this.sp.x, this.sp.y);
        Laya.timer.frameLoop(1, bullet, bullet.followMonster, [monster, this.data.attackSpeed, this.data.power]);
    };
    /**销毁Defender */
    Defender.prototype.Destroy = function () {
        Laya.timer.clearAll(this);
        this.sp.visible = false;
        this.sp.y = -1000;
        Laya.Pool.recover("defender", this);
    };
    return Defender;
}());
exports.default = Defender;
},{"../../../Core/ConfigManager":15,"../../../Tool/Tool":31,"../GameController":3,"./Bullet":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigManager_1 = require("../../../Core/ConfigManager");
var DefenderItemUI = /** @class */ (function () {
    function DefenderItemUI(view, x, y, num) {
        this.init(view, x, y, num);
    }
    /**初始化 */
    DefenderItemUI.prototype.init = function (view, x, y, num) {
        this.data = ConfigManager_1.default.ins.getConfigById("defender", num);
        this.sp = new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/" + this.data.defenderName + ".png"));
        this.sp.autoSize = true;
        this.sp.pos(x, y);
        this.sp.zOrder = 2;
        view.addChild(this.sp);
        this.coinText = new Laya.Text();
        this.coinText.pos(0, this.sp.height + 20);
        this.coinText.text = this.data.price.toString();
        this.sp.addChild(this.coinText);
    };
    return DefenderItemUI;
}());
exports.default = DefenderItemUI;
},{"../../../Core/ConfigManager":15}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameController_1 = require("../GameController");
var Defender_1 = require("./Defender");
var MessageManager_1 = require("../../../Core/MessageManager");
var WelComeController_1 = require("../../WelCome/WelComeController");
var Grass = /** @class */ (function () {
    function Grass(num, view) {
        this.init(num, view);
        this.view = view;
    }
    /**初始化 */
    Grass.prototype.init = function (num, view) {
        this.num = num;
        this.isMud = false;
        this.sp = new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass" + num + ".png"));
        view.addChild(this.sp);
        this.sp.autoSize = true;
        this.sp.on(Laya.Event.CLICK, this, this.Event1_changeState);
    };
    /**格子位置 */
    Grass.prototype.Pos = function (X, Y) {
        this.X = Y;
        this.Y = X;
        this.sp.pos(100 * Y, 25 + 100 * X);
    };
    /**注册第一种事件：转换状态，标记是否为土块 */
    Grass.prototype.Event1_changeState = function () {
        //如果是草坪,则变成土块
        if (!this.isMud) {
            //如果此草坪在上一个最后一次记录土块的周围的话，则可变为土块
            var mudsp = WelComeController_1.default.ins.ownPlayer.fac.mudArray[WelComeController_1.default.ins.ownPlayer.fac.mudArray.length - 1].sp;
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
            if (WelComeController_1.default.ins.ownPlayer.fac.mudArray[0] != null) {
                WelComeController_1.default.ins.ownPlayer.fac.mudArray[WelComeController_1.default.ins.ownPlayer.fac.mudArray.length - 1].sp.mouseEnabled = false;
            }
            else {
                this.sp.mouseEnabled = false;
            }
            WelComeController_1.default.ins.ownPlayer.fac.mudArray.push(this);
        }
        else //如果是土块,则变成草坪
         {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass" + this.num + ".png"));
            this.isMud = false;
            WelComeController_1.default.ins.ownPlayer.fac.mudArray[WelComeController_1.default.ins.ownPlayer.fac.mudArray.length - 2].sp.mouseEnabled = true;
            WelComeController_1.default.ins.ownPlayer.fac.mudArray.pop();
        }
    };
    /**注册第二种事件：往草坪上添加炮塔 */
    Grass.prototype.Event2_AddDefender = function () {
        var defender = Laya.Pool.getItemByClass("defender", Defender_1.default);
        defender.init(this.view, this.sp.x, this.sp.y, WelComeController_1.default.ins.ownPlayer.defenderId);
        WelComeController_1.default.ins.ownPlayer.coin -= WelComeController_1.default.ins.ownPlayer.defenderCoin;
        GameController_1.default.Instance.text_coin.text = WelComeController_1.default.ins.ownPlayer.coin.toString();
        this.sp.off(Laya.Event.CLICK, this, this.Event2_AddDefender);
    };
    return Grass;
}());
exports.default = Grass;
},{"../../../Core/MessageManager":17,"../../WelCome/WelComeController":13,"../GameController":3,"./Defender":7}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigManager_1 = require("../../../Core/ConfigManager");
var MonsterItemUI = /** @class */ (function () {
    function MonsterItemUI(view, x, y, num) {
        this.init(view, x, y, num);
    }
    /**初始化 */
    MonsterItemUI.prototype.init = function (view, x, y, num) {
        this.data = ConfigManager_1.default.ins.getConfigById("monster", num);
        this.sp = new Laya.Sprite();
        this.sp.loadImage("game/ani/" + this.data.monsterName + "_down1.png");
        this.sp.width = 50;
        this.sp.height = 60;
        this.sp.pos(x, y);
        view.addChild(this.sp);
        this.coinText = new Laya.Text();
        this.coinText.pos(0, this.sp.height + 10);
        this.coinText.text = this.data.price.toString();
        this.coinText.align = "middle";
        this.sp.addChild(this.coinText);
        this.btn_buy = new Laya.Sprite();
        this.btn_buy.loadImage("game/buy.png");
        this.btn_buy.pos(0, this.sp.height + 20);
        this.sp.addChild(this.btn_buy);
    };
    return MonsterItemUI;
}());
exports.default = MonsterItemUI;
},{"../../../Core/ConfigManager":15}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var WelComeController_1 = require("../WelCome/WelComeController");
var LoadingController = /** @class */ (function (_super) {
    __extends(LoadingController, _super);
    function LoadingController() {
        return _super.call(this) || this;
    }
    LoadingController.prototype.onEnable = function () {
        this.isConnectServer = false;
        this.selectMode();
        this.loadAssets();
    };
    /**加载游戏场景资源 */
    LoadingController.prototype.loadAssets = function () {
        var src = [
            //图集加载
            { url: "res/atlas/game.atlas" },
            { url: "res/atlas/game/ani.atlas" }
        ];
        Laya.loader.load(src, Laya.Handler.create(this, this.onLoad), Laya.Handler.create(this, this.onProcess));
    };
    /**加载进程 */
    LoadingController.prototype.onProcess = function (pro) {
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
    LoadingController.prototype.onLoad = function () {
        this.EnterGame();
    };
    /**确定游戏模式，显示玩家信息，界面上方显示红方玩家，下方显示蓝方玩家*/
    LoadingController.prototype.selectMode = function () {
        if (WelComeController_1.default.ins.mode == "1V1") {
            for (var i = 0; i < 5; i++) {
                this.red_group._children[i].visible = false;
                this.blue_group._children[i].visible = false;
            }
            this.red_player_3.visible = true;
            this.blue_player_3.visible = true;
        }
        if (WelComeController_1.default.ins.ownPlayer.camp == "red") {
            this.icon_red_player_3.loadImage(WelComeController_1.default.ins.ownPlayer.icon);
            this.name_red_player_3.text = WelComeController_1.default.ins.ownPlayer.name;
            this.icon_blue_player_3.loadImage(WelComeController_1.default.ins.enemyPlayer.icon);
            this.name_blue_player_3.text = WelComeController_1.default.ins.enemyPlayer.name;
        }
        else {
            this.icon_blue_player_3.loadImage(WelComeController_1.default.ins.ownPlayer.icon);
            this.name_blue_player_3.text = WelComeController_1.default.ins.ownPlayer.name;
            this.icon_red_player_3.loadImage(WelComeController_1.default.ins.enemyPlayer.icon);
            this.name_red_player_3.text = WelComeController_1.default.ins.enemyPlayer.name;
        }
    };
    /**进入游戏 */
    LoadingController.prototype.EnterGame = function () {
        Laya.Scene.open("Game/Game.scene");
    };
    return LoadingController;
}(layaMaxUI_1.ui.PlayerLoadingUI));
exports.default = LoadingController;
},{"../../ui/layaMaxUI":32,"../WelCome/WelComeController":13}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GrassFactory_1 = require("../Game/GrassFactory");
var GameController_1 = require("../Game/GameController");
var Player = /** @class */ (function () {
    function Player(name, icon) {
        this.name = name;
        this.icon = icon;
    }
    /*******************************己方玩家********************************************/
    /**己方玩家游戏场景信息初始化 */
    Player.prototype.ownGameInit = function () {
        if (this.camp == "red") {
            this.group = GameController_1.default.Instance.red_group;
            GameController_1.default.Instance.blue_group.mouseEnabled = false;
        }
        else {
            this.group = GameController_1.default.Instance.blue_group;
            GameController_1.default.Instance.red_group.mouseEnabled = false;
        }
        this.group.mouseEnabled = false;
        this.fac = new GrassFactory_1.default(this.camp, this.group);
        this.coin = 500;
        GameController_1.default.Instance.text_coin.text = this.coin.toString();
        this.addEvent();
    };
    /**添加事件 */
    Player.prototype.addEvent = function () {
    };
    /**为剩下的草坪注册新事件 */
    Player.prototype.restGrassAddEvent = function () {
        for (var i = 0; i < 70; i++) {
            var grass = this.fac.grassArray[i];
            grass.sp.off(Laya.Event.CLICK, grass, grass.Event1_changeState);
            grass.sp.on(Laya.Event.CLICK, grass, grass.Event2_AddDefender);
        }
        for (var i = 0; i < this.fac.mudArray.length; i++) {
            this.fac.mudArray[i].sp.off(Laya.Event.CLICK, this.fac.mudArray[i], this.fac.mudArray[i].Event2_AddDefender);
        }
    };
    return Player;
}());
exports.default = Player;
},{"../Game/GameController":3,"../Game/GrassFactory":4}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var WebSocketManager_1 = require("../../Core/Net/WebSocketManager");
var GameConfig_1 = require("../../Core/Const/GameConfig");
var UserLoginHandler_1 = require("./handler/UserLoginHandler");
var ClientSender_1 = require("../../Core/Net/ClientSender");
var Tool_1 = require("../../Tool/Tool");
var MessageManager_1 = require("../../Core/MessageManager");
var ConfigManager_1 = require("../../Core/ConfigManager");
var Player_1 = require("./Player");
var WelComeController = /** @class */ (function (_super) {
    __extends(WelComeController, _super);
    function WelComeController() {
        return _super.call(this) || this;
    }
    /////////////生命周期
    /**启动 */
    WelComeController.prototype.onEnable = function () {
        WelComeController.ins = this;
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
            { url: "unpackage/welcome/boximg.png" },
            //json
            { url: "outside/config/gameConfig/defender.json" },
            { url: "outside/config/gameConfig/monster.json" }
        ];
        Laya.loader.load(src, Laya.Handler.create(this, this.onLoad), Laya.Handler.create(this, this.onProcess));
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
        //获取配置
        ConfigManager_1.default.ins.loadConfig();
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
        //ClientSender.reqUserLogin(this.input_userName.text,this.input_userKey.text);
        this.ownPlayer = new Player_1.default("张三", "gameLobby/player_icon.png");
        Laya.Scene.open("GameLobby/GameLobby.scene");
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
            Laya.timer.once(100, this, this.toGameMain);
        }
    };
    /**连接服务器 */
    WelComeController.prototype.connectServer = function () {
        WebSocketManager_1.default.ins.connect(GameConfig_1.GameConfig.IP, GameConfig_1.GameConfig.PORT);
    };
    //////////////////////////////////////////////////////////
    WelComeController.prototype.toGameMain = function () {
        //TO DO 跳转至游戏大厅
        Laya.Scene.open("GameLobby/GameLobby.scene");
    };
    return WelComeController;
}(layaMaxUI_1.ui.Welcome.LoginUI));
exports.default = WelComeController;
},{"../../Core/ConfigManager":15,"../../Core/Const/GameConfig":16,"../../Core/MessageManager":17,"../../Core/Net/ClientSender":18,"../../Core/Net/WebSocketManager":22,"../../Tool/Tool":31,"../../ui/layaMaxUI":32,"./Player":12,"./handler/UserLoginHandler":14}],14:[function(require,module,exports){
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
},{"../../../Core/Net/SocketHandler":21,"../../../Core/Net/WebSocketManager":22}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefenderConfig_1 = require("../Data/Config/DefenderConfig");
var MosnterConfigr_1 = require("../Data/Config/MosnterConfigr");
/**
 * 配置加载器
 */
var ConfigManager = /** @class */ (function () {
    function ConfigManager() {
    }
    /**
     * 配置注册
     *
     * 1、写下json名字，对应的 配置类
     *
     * 标识
     */
    ConfigManager.prototype.getClass = function (name, data) {
        switch (name) {
            case "defender": return new DefenderConfig_1.default(data);
            case "monster": return new MosnterConfigr_1.default(data);
        }
    };
    /**
     * Json配置获取
     *
     * 写需要获取的配置文件
     */
    ConfigManager.prototype.loadConfig = function () {
        var arr = [
            { "defender": "outside/config/gameConfig/defender.json" },
            { "monster": "outside/config/gameConfig/monster.json" }
        ];
        this.loadObj(arr);
    };
    /**
     * 资源加载
     */
    ConfigManager.prototype.loadObj = function (arr) {
        var obj;
        var name;
        for (var i = 0; i < arr.length; i++) {
            obj = arr[i];
            name = Object.keys(obj)[0];
            this[name + "Config"] = Laya.loader.getRes(obj[name]);
        }
    };
    /**
     * 获取配置 @configNmae : Json文件名  @想获取什么怪物id
     */
    ConfigManager.prototype.getConfigById = function (configName, configId) {
        var configObj = this[configName + "Config"];
        var typeArr = [];
        for (var i = 0; i < configObj.length; i++) {
            var obj = configObj[i];
            if (obj[configName + "Id"] == configId) {
                return this.getClass(configName, obj);
            }
        }
    };
    /**
     * 获取本配置文件含有的项数 @configNmae : Json文件名
     */
    ConfigManager.prototype.getConfigLength = function (configName) {
        var configObj = this[configName + "Config"];
        return configObj.length;
    };
    /**
     * 根据类型获取配置 1金2木3水4火5土
     */
    ConfigManager.prototype.getConfigByType = function (configName, typeNum) {
        var configObj = this[configName + "Config"];
        var typeArr = [];
        for (var i = 0; i < configObj.length; i++) {
            var obj = configObj[i];
            if (obj["type"] == typeNum) {
                typeArr.push(this.getClass(configName, obj));
            }
        }
        return typeArr;
    };
    ConfigManager.ins = new ConfigManager();
    return ConfigManager;
}());
exports.default = ConfigManager;
},{"../Data/Config/DefenderConfig":23,"../Data/Config/MosnterConfigr":24}],16:[function(require,module,exports){
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
    //--------------------配置类型------------
    GameConfig.CONFIG_NAME_MONSTER = "monster";
    GameConfig.CONFIG_NAME_DEFENDER = "defender";
    //-------------------属性 类型-----------   
    /**金 1 */
    GameConfig.TYPE_GOLD = 1;
    /**木 2 */
    GameConfig.TYPE_WOOD = 2;
    /**水 3*/
    GameConfig.TYPE_WATER = 3;
    /**火 */
    GameConfig.TYPE_FIRE = 4;
    /**土*/
    GameConfig.TYPE_GROUND = 5;
    return GameConfig;
}());
exports.GameConfig = GameConfig;
/**协议 */
var Protocol = /** @class */ (function () {
    function Protocol() {
    }
    //****************UserProto.proto
    /**请求 msgId = 101103 */
    Protocol.REQ_USER_LOGIN = 101103;
    /**101104 注册请求 */
    Protocol.REQ_USER_REGISTER = 101104;
    /**响应 msgId = 101203 */
    Protocol.RES_USER_LOGIN = 101203;
    //****************MatchProto.proto
    /**请求匹配对局102101 */
    Protocol.REQ_MATCH = 102101;
    /**请求 对局接受102102 */
    Protocol.REQ_MATCH_ACCEPT = 102102;
    /**响应 返回匹配信息 只发送一次msgId = 102201 */
    Protocol.RES_MATCH_INFO = 102201;
    /**响应 返回对局接受消息msgId = 10202 */
    Protocol.RES_MATCH_ACCEPT_INFO = 10202;
    //****************GameProto.proto
    /**请求资源加载完毕  返回103201 */
    Protocol.REQ_ONLOAD = 103201;
    /**请求地图垒好 返回103202 */
    Protocol.REQ_MAPOVER = 103202;
    /**每回合怪物投放好之后 或者时间到了请求完成  103103*/
    Protocol.REQ_PUTMONSTEROVER = 103103;
    /**当所有人都加载好了之后返回游戏开始消息 103201 */
    Protocol.RES_ONLOAD = 103201;
    /**返回 所有的地图路径信息 103202 */
    Protocol.RES_ALLMAPINFO = 103202;
    /**返回给双方，每回合的怪物 103203 */
    Protocol.RES_MONSTERINFO = 103203;
    return Protocol;
}());
exports.Protocol = Protocol;
},{}],17:[function(require,module,exports){
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
},{"../Tool/FloatMsg":30,"../Tool/Tool":31}],18:[function(require,module,exports){
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
    //****************UserProto.proto
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
    //****************MatchProto.proto
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
    //****************GameProto.proto
    /**
     * 请求资源加载完毕 返回103201
     * @param userId
    * @param isAccepte
    */
    ClientSender.reqOnLoad = function (userId) {
        var ReqOnLoad = WebSocketManager_1.default.ins.defineProtoClass("ReqOnLoad");
        var message = {};
        message.userId = userId;
        var buffer = ReqOnLoad.encode(message).finish();
        WebSocketManager_1.default.ins.sendMsg(GameConfig_1.Protocol.REQ_ONLOAD, buffer);
    };
    /**
     * 请求资源加载完毕 返回103202
     * @param userId
    * @param isAccepte
    */
    ClientSender.reqMapOver = function (userId, status, mapChunkList) {
        var ReqMapOver = WebSocketManager_1.default.ins.defineProtoClass("ReqMapOver");
        var message = {};
        message.userId = userId;
        message.status = status;
        message.mapChunkList = mapChunkList;
        var buffer = ReqMapOver.encode(message).finish();
        WebSocketManager_1.default.ins.sendMsg(GameConfig_1.Protocol.REQ_MAPOVER, buffer);
    };
    /**
     * 每回合怪物投放好之后 或者时间到了请求完成 返回103103
     * @param userId
    * @param isAccepte
    */
    ClientSender.reqPutMonsterOver = function (userId, monsterList) {
        var ReqPutMonsterOver = WebSocketManager_1.default.ins.defineProtoClass("ReqPutMonsterOver");
        var message = {};
        message.userId = userId;
        message.monsterList = monsterList;
        var buffer = ReqPutMonsterOver.encode(message).finish();
        WebSocketManager_1.default.ins.sendMsg(GameConfig_1.Protocol.REQ_PUTMONSTEROVER, buffer);
    };
    return ClientSender;
}());
exports.default = ClientSender;
},{"../Const/GameConfig":16,"./WebSocketManager":22}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{"./WebSocketManager":22}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
            var protoBufUrls = ["outside/proto/UserProto.proto", "outside/proto/MatchProto.proto", "outside/proto/GameProto.proto"];
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
},{"../../Tool/Dictionary":29,"./PackageIn":19,"./PackageOut":20}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseConfig_1 = require("./baseConfig");
/**
 * 防御塔数据模型
 */
var DefenderConfig = /** @class */ (function (_super) {
    __extends(DefenderConfig, _super);
    /******************************即将开放*********************************** */
    /**
     * 类型 1金2木3水4火5土
     */
    //public type : number;
    function DefenderConfig(data) {
        return _super.call(this, data) || this;
    }
    return DefenderConfig;
}(baseConfig_1.default));
exports.default = DefenderConfig;
},{"./baseConfig":25}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var baseConfig_1 = require("./baseConfig");
/**
 * 怪物数据模型
 */
var MonsterConfig = /** @class */ (function (_super) {
    __extends(MonsterConfig, _super);
    /******************************即将开放*********************************** */
    /**
     * 防御力
     */
    //public def : number;
    /**
     * 怪物类型 1金2木3水4火5土
     */
    //public type : number;
    function MonsterConfig(data) {
        return _super.call(this, data) || this;
    }
    return MonsterConfig;
}(baseConfig_1.default));
exports.default = MonsterConfig;
},{"./baseConfig":25}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
var GameController_1 = require("./Controller/Game/GameController");
var GameLobbyController_1 = require("./Controller/GameLobby/GameLobbyController");
var LoadingController_1 = require("./Controller/Loading/LoadingController");
var WelComeController_1 = require("./Controller/WelCome/WelComeController");
/*
* 游戏初始化配置;
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    GameConfig.init = function () {
        var reg = Laya.ClassUtils.regClass;
        reg("Controller/Game/GameController.ts", GameController_1.default);
        reg("Controller/GameLobby/GameLobbyController.ts", GameLobbyController_1.default);
        reg("Controller/Loading/LoadingController.ts", LoadingController_1.default);
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
},{"./Controller/Game/GameController":3,"./Controller/GameLobby/GameLobbyController":1,"./Controller/Loading/LoadingController":11,"./Controller/WelCome/WelComeController":13}],27:[function(require,module,exports){
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
},{"./GameConfig":26}],28:[function(require,module,exports){
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
},{"./GameConfig":26,"./GameEnter":27}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{"../Core/MessageManager":17,"../ui/layaMaxUI":32}],31:[function(require,module,exports){
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
    /**
     * 两点间距离
     */
    Tool.getDistance = function (sp1, sp2) {
        return Math.sqrt(Math.pow(Math.abs(sp1.x - sp2.x), 2) + Math.pow(Math.abs(sp1.y - sp2.y), 2));
    };
    return Tool;
}());
exports.default = Tool;
},{}],32:[function(require,module,exports){
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
    var Game;
    (function (Game) {
        var GameUI = /** @class */ (function (_super) {
            __extends(GameUI, _super);
            function GameUI() {
                return _super.call(this) || this;
            }
            GameUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("Game/Game");
            };
            return GameUI;
        }(Scene));
        Game.GameUI = GameUI;
    })(Game = ui.Game || (ui.Game = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var GameLobby;
    (function (GameLobby) {
        var GameLobbyUI = /** @class */ (function (_super) {
            __extends(GameLobbyUI, _super);
            function GameLobbyUI() {
                return _super.call(this) || this;
            }
            GameLobbyUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.loadScene("GameLobby/GameLobby");
            };
            return GameLobbyUI;
        }(Scene));
        GameLobby.GameLobbyUI = GameLobbyUI;
    })(GameLobby = ui.GameLobby || (ui.GameLobby = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var PlayerLoadingUI = /** @class */ (function (_super) {
        __extends(PlayerLoadingUI, _super);
        function PlayerLoadingUI() {
            return _super.call(this) || this;
        }
        PlayerLoadingUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.loadScene("PlayerLoading");
        };
        return PlayerLoadingUI;
    }(Scene));
    ui.PlayerLoadingUI = PlayerLoadingUI;
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
},{}]},{},[28])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIyLjAvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9HcmFzc0ZhY3RvcnkudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL01vbnN0ZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL1ByZWZhYi9CdWxsZXQudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL1ByZWZhYi9EZWZlbmRlci50cyIsInNyYy9Db250cm9sbGVyL0dhbWUvUHJlZmFiL0RlZmVuZGVySXRlbVVJLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9QcmVmYWIvR3Jhc3MudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL1ByZWZhYi9Nb25zdGVySXRlbVVJLnRzIiwic3JjL0NvbnRyb2xsZXIvTG9hZGluZy9Mb2FkaW5nQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvUGxheWVyLnRzIiwic3JjL0NvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50cyIsInNyYy9Db250cm9sbGVyL1dlbENvbWUvaGFuZGxlci9Vc2VyTG9naW5IYW5kbGVyLnRzIiwic3JjL0NvcmUvQ29uZmlnTWFuYWdlci50cyIsInNyYy9Db3JlL0NvbnN0L0dhbWVDb25maWcudHMiLCJzcmMvQ29yZS9NZXNzYWdlTWFuYWdlci50cyIsInNyYy9Db3JlL05ldC9DbGllbnRTZW5kZXIudHMiLCJzcmMvQ29yZS9OZXQvUGFja2FnZUluLnRzIiwic3JjL0NvcmUvTmV0L1BhY2thZ2VPdXQudHMiLCJzcmMvQ29yZS9OZXQvU29ja2V0SGFuZGxlci50cyIsInNyYy9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyLnRzIiwic3JjL0RhdGEvQ29uZmlnL0RlZmVuZGVyQ29uZmlnLnRzIiwic3JjL0RhdGEvQ29uZmlnL01vc250ZXJDb25maWdyLnRzIiwic3JjL0RhdGEvQ29uZmlnL2Jhc2VDb25maWcudHMiLCJzcmMvR2FtZUNvbmZpZy50cyIsInNyYy9HYW1lRW50ZXIudHMiLCJzcmMvTWFpbi50cyIsInNyYy9Ub29sL0RpY3Rpb25hcnkudHMiLCJzcmMvVG9vbC9GbG9hdE1zZy50cyIsInNyYy9Ub29sL1Rvb2wudHMiLCJzcmMvdWkvbGF5YU1heFVJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ1ZBLGdEQUF3QztBQUN4QyxvRUFBK0Q7QUFDL0QsMERBQW1FO0FBQ25FLGtFQUE2RDtBQUc3RCxrRUFBNkQ7QUFDN0QsNENBQXVDO0FBR3ZDO0lBQWlELHVDQUF3QjtJQUNyRTtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUVELFFBQVE7SUFDUixzQ0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxPQUFPO0lBQ1AsdUNBQVMsR0FBVDtRQUNJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsVUFBVTtJQUNGLHVDQUFTLEdBQWpCO1FBRUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFL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WUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0wsc0JBQUM7SUFBRCxDQTNDQSxBQTJDQyxDQTNDb0MsS0FBSyxHQTJDekM7SUEzQ1ksa0JBQWUsa0JBMkMzQixDQUFBO0FBQ0wsQ0FBQyxFQTdDYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUE2Q2Y7QUFDRCxXQUFjLEVBQUU7SUFBQyxJQUFBLE9BQU8sQ0EwQnZCO0lBMUJnQixXQUFBLE9BQU87UUFDcEI7WUFBNkIsMkJBQUs7WUFtQjlCO3VCQUFlLGlCQUFPO1lBQUEsQ0FBQztZQUN2QixnQ0FBYyxHQUFkO2dCQUNJLGlCQUFNLGNBQWMsV0FBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDTCxjQUFDO1FBQUQsQ0F4QkEsQUF3QkMsQ0F4QjRCLEtBQUssR0F3QmpDO1FBeEJZLGVBQU8sVUF3Qm5CLENBQUE7SUFDTCxDQUFDLEVBMUJnQixPQUFPLEdBQVAsVUFBTyxLQUFQLFVBQU8sUUEwQnZCO0FBQUQsQ0FBQyxFQTFCYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUEwQmYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XHJcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sLCBHYW1lQ29uZmlnIH0gZnJvbSBcIi4uLy4uL0NvcmUvQ29uc3QvR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgTWF0Y2hIYW5kbGVyIGZyb20gXCIuLi9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXJcIjtcclxuaW1wb3J0IENsaWVudFNlbmRlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvQ2xpZW50U2VuZGVyXCI7XHJcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xyXG5pbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vV2VsQ29tZS9QbGF5ZXJcIjtcclxuaW1wb3J0IENvbmZpZ01hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvQ29uZmlnTWFuYWdlclwiO1xyXG5pbXBvcnQgTW9uc3RlckNvbmZpZyBmcm9tIFwiLi4vLi4vRGF0YS9Db25maWcvTW9zbnRlckNvbmZpZ3JcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUxvYmJ5Q29udHJvbGxlciBleHRlbmRzIHVpLkdhbWVMb2JieS5HYW1lTG9iYnlVSXtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlkK/liqggKi9cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirplIDmr4EqL1xyXG4gICAgb25EZXN0cm95KCl7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirkuovku7bnu5HlrpogKi9cclxuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5idG5fUFZQLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uUFZQTW9kZSk7XHJcbiAgICAgICAgdGhpcy5idG5fMVYxLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uMVYxKTtcclxuICAgICAgICB0aGlzLmJ0bl81VjUub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub241VjUpO1xyXG4gICAgICAgIHRoaXMuYnRuX2JhY2sub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25CYWNrKTtcclxuICAgICAgICB0aGlzLmJ0bl9jYW5jZWwub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25DYW5jZWwpO1xyXG4gICAgICAgIHRoaXMuYnRuX2VudGVyZ2FtZS5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblN1cmUpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfSU5GTyxuZXcgTWF0Y2hIYW5kbGVyKHRoaXMsdGhpcy5vbk1hdGNoSGFuZGxlcikpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5idG5fUFZQLm9mZihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblBWUE1vZGUpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnVucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19NQVRDSF9JTkZPLHRoaXMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKirngrnlh7vov5vlhaVQVlDpgInmi6nnlYzpnaIgKi9cclxuICAgIHByaXZhdGUgb25QVlBNb2RlKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbVBhbmVsLnZpc2libGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLk1vZGVDaG9vc2VQYW5lbC52aXNpYmxlPXRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I635Y+W5Yiw5raI5oGvICovXHJcbiAgICBwcml2YXRlIG9uTWF0Y2hIYW5kbGVyKGRhdGEpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGErXCLljLnphY3miJDlip9cIik7XHJcbiAgICAgICAgaWYoZGF0YSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5mcmFtZU9uY2UoMTAwLHRoaXMsdGhpcy5jaG9vc2VNYXRjaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+mAieaLqTFWMeaooeW8j++8jOWMuemFjeeVjOmdouWPquaYvuekuueOqeWutuWSjOaVjOS6uuS4pOS4quWktOWDjyAqL1xyXG4gICAgcHJpdmF0ZSBvbjFWMSgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgICAgIHRoaXMuTWF0Y2hpbmdQYW5lbC52aXNpYmxlPXRydWU7XHJcbiAgICAgICAvL0NsaWVudFNlbmRlci5yZXFNYXRjaCgxLDEpO1xyXG4gICAgICAgZm9yKGxldCBpPTA7aTw1O2krKylcclxuICAgICAgIHtcclxuICAgICAgICAgICB0aGlzLnJlZF9ncm91cC5fY2hpbGRyZW5baV0udmlzaWJsZT1mYWxzZTtcclxuICAgICAgICAgICB0aGlzLmJsdWVfZ3JvdXAuX2NoaWxkcmVuW2ldLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICB9XHJcbiAgICAgICB0aGlzLmljb25fcmVkX3BsYXllcl8zLnZpc2libGU9dHJ1ZTtcclxuICAgICAgIHRoaXMuaWNvbl9ibHVlX3BsYXllcl8zLnZpc2libGU9dHJ1ZTtcclxuICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5tb2RlPVwiMVYxXCI7XHJcblxyXG4gICAgICAgLy/mmoLml7bkvb/nlKjvvIzogZTnvZHlkI7liKDljrtcclxuICAgICAgIExheWEudGltZXIuZnJhbWVPbmNlKDYwKjIsdGhpcyx0aGlzLmNob29zZU1hdGNoKTtcclxuICAgICAgIC8vTGF5YS50aW1lci5mcmFtZUxvb3AoNjAsdGhpcyx0aGlzLmNhbFRpbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+mAieaLqTVWNeaooeW8jyAqL1xyXG4gICAgcHJpdmF0ZSBvbjVWNSgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8vV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm1vZGU9XCI1VjVcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vov5Tlm57muLjmiI/lpKfljoUgKi9cclxuICAgIHByaXZhdGUgb25CYWNrKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbVBhbmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9ZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6K6h5pe277yM5Zyo562J5b6F6Zif5YiX562J5b6F5LqG5aSa6ZW/5pe26Ze0ICovXHJcbiAgICBwcml2YXRlIGNhbFRpbWUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy90aGlzLnRleHRfdGltZS50ZXh0PVwiXCJcclxuICAgIH1cclxuXHJcbiAgICAvKirljLnphY3ov4fnqIvkuK3ngrnlh7vlj5bmtogs6L+U5Zue5qih5byP6YCJ5oup55WM6Z2i77yM5LuO562J5b6F5oi/6Ze06YCA5Ye6ICovICAgICAgIC8vLS3nvZHnu5xcclxuICAgIHByaXZhdGUgb25DYW5jZWwoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NYXRjaGluZ1BhbmVsLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT10cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWMuemFjeaIkOWKn+W8ueahhu+8jOiOt+WPluaVjOaWueeOqeWutuS/oeaBr++8jOmAieaLqeaYr+WQpui/m+WFpea4uOaIjyAqL1xyXG4gICAgcHJpdmF0ZSBjaG9vc2VNYXRjaCgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1hdGNoaW5nUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICB0aGlzLk1hdGNoaW5nU3VjY2Vzc1BhbmVsLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICAvL+aaguaXtuWPluS4gOS4que7meWumueahOaVjOaWueeOqeWutuS/oeaBryAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLS3mmoLml7ZcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXI9bmV3IFBsYXllcihcIuadjuWbm1wiLFwiZ2FtZUxvYmJ5L3BsYXllcl9pY29uMi5wbmdcIik7XHJcbiAgICAgICAgLy/pmo/mnLrpgInmi6nkuIDkuKrpmLXokKVcclxuICAgICAgICAvL2xldCByYW5kb209TWF0aC5jZWlsKE1hdGgucmFuZG9tKCkqMik7XHJcbiAgICAgICAgbGV0IHJhbmRvbT0wO1xyXG4gICAgICAgIGlmKHJhbmRvbT09MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY2FtcD1cInJlZFwiO1xyXG4gICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuY2FtcD1cImJsdWVcIjtcclxuICAgICAgICAgICAgdGhpcy5pY29uX3JlZF9wbGF5ZXJfMy5sb2FkSW1hZ2UoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5pY29uKTtcclxuICAgICAgICAgICAgdGhpcy5pY29uX2JsdWVfcGxheWVyXzMubG9hZEltYWdlKFdlbENvbWVDb250cm9sbGVyLmlucy5lbmVteVBsYXllci5pY29uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5jYW1wPVwiYmx1ZVwiO1xyXG4gICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuY2FtcD1cInJlZFwiO1xyXG4gICAgICAgICAgICB0aGlzLmljb25fYmx1ZV9wbGF5ZXJfMy5sb2FkSW1hZ2UoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5pY29uKTtcclxuICAgICAgICAgICAgdGhpcy5pY29uX3JlZF9wbGF5ZXJfMy5sb2FkSW1hZ2UoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLmVuZW15UGxheWVyLmljb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vnoa7lrprvvIznrYnlvoXmiL/pl7TlhoXkurrpg73noa7lrprlkI7ot7Povazov5vlhaXmuLjmiI/lnLrmma8gKi8gICAgICAgICAgICAvLy0t572R57ucXHJcbiAgICBwcml2YXRlIG9uU3VyZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICAvKirmiJHmlrnnjqnlrrbngrnlh7vnoa7lrprlj5HpgIHor7fmsYLvvIznrYnlvoXmlYzmlrnnjqnlrrbnoa7lrpogKi9cclxuICAgICAgICAvL3RvZG9cclxuICAgICAgICBMYXlhLlNjZW5lLm9wZW4oXCJQbGF5ZXJMb2FkaW5nLnNjZW5lXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+aLkue7ne+8jOi/lOWbnuaooeW8j+mAieaLqeeVjOmdoizlj5HpgIHmi5Lnu53or7fmsYIgKi8gICAgICAgICAgICAgICAgICAvLy0t572R57ucXHJcbiAgICBwcml2YXRlIG9uUmVmdXNlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v5YW25Lit5LiA5Liq5Lq65Y+R6YCB5ouS57ud6K+35rGC77yM55u05o6l6Kej5pWj5oi/6Ze0XHJcbiAgICAgICAgLy90b2RvXHJcbiAgICAgICAgdGhpcy5Nb2RlQ2hvb3NlUGFuZWwudmlzaWJsZT10cnVlO1xyXG4gICAgICAgIHRoaXMuTWF0Y2hpbmdTdWNjZXNzUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAgXHJcbn0iLCJpbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvU29ja2V0SGFuZGxlclwiO1xyXG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOi/lOWbnuWMuemFjeS/oeaBryDlj6rlj5HpgIHkuIDmrKFcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcclxuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlc01hdGNoSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzTWF0Y2hJbmZvXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc01hdGNoSW5mby5kZWNvZGUoZGF0YSk7XHJcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxyXG4gICAgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IEdyYXNzRmFjdG9yeSBmcm9tIFwiLi9HcmFzc0ZhY3RvcnlcIjtcclxuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi4vV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgRGVmZW5kZXJJdGVtVUkgZnJvbSBcIi4vUHJlZmFiL0RlZmVuZGVySXRlbVVJXCI7XHJcbmltcG9ydCBNb25zdGVyIGZyb20gXCIuL01vbnN0ZXJcIjtcclxuaW1wb3J0IENvbmZpZ01hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvQ29uZmlnTWFuYWdlclwiO1xyXG5pbXBvcnQgTW9uc3Rlckl0ZW1VSSBmcm9tIFwiLi9QcmVmYWIvTW9uc3Rlckl0ZW1VSVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29udHJvbGxlciBleHRlbmRzIHVpLkdhbWUuR2FtZVVJe1xyXG4gICAgLyoq5Y2V5L6LICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOkdhbWVDb250cm9sbGVyO1xyXG4gICAgLyoq5LiK5qyh6byg5qCH5b6X5L2N572uICovXHJcbiAgICBwcml2YXRlIGxhc3RNb3VzZVBvc1g6bnVtYmVyO1xyXG4gICAgLyoq5piv5ZCm5q2j5Zyo5L2/55So6ZOy5a2QICovXHJcbiAgICBwcml2YXRlIGlzVXNlU2hvdmVsOmJvb2xlYW47XHJcbiAgICAvKirorqHml7blmajmlbAgKi9cclxuICAgIHByaXZhdGUgY291bnREb3duTnVtOm51bWJlcjtcclxuICAgIC8qKuaAquWFveW3suW8gOWni+enu+WKqCAqL1xyXG4gICAgcHVibGljIGlzTW9uc3Rlck1vdmU6Ym9vbGVhbjtcclxuICAgIC8qKua4uOaIj+WbnuWQiOaVsCAqL1xyXG4gICAgcHJpdmF0ZSByb3VuZDpudW1iZXI7XHJcbiAgICAvKirmgKrlhb3lh7rnjrDorqHmlbDlmaggKi9cclxuICAgIHByaXZhdGUgbW9uc3RlckNvdW50Om51bWJlcjtcclxuICAgIC8qKuiPnOWNleagj+mYsuW+oeWhlFVJ5pWw57uEICovXHJcbiAgICBwcml2YXRlIGRlZmVuZGVySXRlbVVJQXJyYXk6QXJyYXk8RGVmZW5kZXJJdGVtVUk+O1xyXG4gICAgLyoq6I+c5Y2V5qCP5oCq5YW9VUnmlbDnu4QgKi9cclxuICAgIHByaXZhdGUgbW9uc3Rlckl0ZW1VSUFycmF5OkFycmF5PE1vbnN0ZXJJdGVtVUk+O1xyXG4gICAgLyoq5oCq5YW95qCH6K6w5pWw57uEIOavj+asoeWPkemAgeagh+iusOaVsOe7hOe7meWvueaWue+8jOS7juiAjOWIneWni+WMluaAquWFvSovXHJcbiAgICBwcml2YXRlIG1vbnN0ZXJTaWduQXJyYXk6QXJyYXk8bnVtYmVyPjtcclxuICAgIC8qKuaVjOaWueaAquWFveaVsOe7hCAqL1xyXG4gICAgcHVibGljIG1vbnN0ZXJBcnJheTpBcnJheTxNb25zdGVyPjtcclxuICAgIC8qKuaWueWQkeaVsOe7hCAqL1xyXG4gICAgcHVibGljIGRpckFycmF5OkFycmF5PEFycmF5PG51bWJlcj4+O1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBHYW1lQ29udHJvbGxlci5JbnN0YW5jZT10aGlzO1xyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIub3duR2FtZUluaXQoKTtcclxuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5tYXBNb3ZlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirlnLDlm77np7vliqggKi9cclxuICAgIHByaXZhdGUgbWFwTW92ZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgIHRoaXMuZ2FtZS54LT00O1xyXG4gICAgICAgaWYodGhpcy5nYW1lLng8LTEyMTQpXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5nYW1lLng9LTEyMTQ7XHJcbiAgICAgICAgICAgTGF5YS50aW1lci5jbGVhcih0aGlzLHRoaXMubWFwTW92ZSk7XHJcbiAgICAgICAgICAgTGF5YS50aW1lci5mcmFtZU9uY2UoNjAsdGhpcyx0aGlzLnJlc3VtZVBvcyk7XHJcbiAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKuWbnuWIsOeOqeWutuS9jee9riAqL1xyXG4gICAgcHJpdmF0ZSByZXN1bWVQb3MoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5jYW1wPT1cImJsdWVcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5nYW1lLng9LTEyMTQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgdGhpcy5nYW1lLng9MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vd25QbGF5ZXJPcGVuKCk7XHJcbiAgICAgICAgXHJcbiAgICB9IFxyXG4gICAgIFxyXG4gICAgXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKum8oOagh+S6i+S7tiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIC8qKum8oOagh+aMieS4iyAqL1xyXG4gICAgcHJpdmF0ZSBvbk1vdXNlRG93bigpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfTU9WRSx0aGlzLHRoaXMub25Nb3VzZU1vdmUpO1xyXG4gICAgICAgIGlmKCF0aGlzLmlzVXNlU2hvdmVsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0TW91c2VQb3NYPUxheWEuc3RhZ2UubW91c2VYO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirpvKDmoIfnp7vliqggKi9cclxuICAgIHByaXZhdGUgb25Nb3VzZU1vdmUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYoTGF5YS5zdGFnZS5tb3VzZVg8dGhpcy5sYXN0TW91c2VQb3NYKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLngtPTIwO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoTGF5YS5zdGFnZS5tb3VzZVg+dGhpcy5sYXN0TW91c2VQb3NYKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLngrPTIwO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVBvc1g9TGF5YS5zdGFnZS5tb3VzZVg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuZ2FtZS54Pj0wKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLng9MDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0aGlzLmdhbWUueDw9LTEyMTQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUueD0tMTIxNDtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoq6byg5qCH5oqs6LW3ICovXHJcbiAgICBwcml2YXRlIG9uTW91c2VVcCgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnN0YWdlLm9mZihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLm9uTW91c2VNb3ZlKTtcclxuICAgIH1cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuW3seaWueeOqeWutioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgLyoq5bex5pa554q25oCB5byA5aeLICovXHJcbiAgICBwcml2YXRlIG93blBsYXllck9wZW4oKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyhcIuivt+WFiOS/ruW7uumBk+i3r++8gVwiKTtcclxuICAgICAgICB0aGlzLm1vbnN0ZXJBcnJheT1uZXcgQXJyYXk8TW9uc3Rlcj4oKTtcclxuICAgICAgICB0aGlzLmRpckFycmF5PW5ldyBBcnJheTxBcnJheTxudW1iZXI+PigpO1xyXG4gICAgICAgIHRoaXMubW9uc3RlclNpZ25BcnJheT1uZXcgQXJyYXk8bnVtYmVyPigpO1xyXG4gICAgICAgIHRoaXMuZGVmZW5kZXJJdGVtVUlBcnJheT1uZXcgQXJyYXk8RGVmZW5kZXJJdGVtVUk+KCk7XHJcbiAgICAgICAgdGhpcy5tb25zdGVySXRlbVVJQXJyYXk9bmV3IEFycmF5PE1vbnN0ZXJJdGVtVUk+KCk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJfbWVudWl0ZW0udmlzaWJsZT10cnVlO1xyXG4gICAgICAgIHRoaXMuaXNVc2VTaG92ZWw9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5pc01vbnN0ZXJNb3ZlPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuY291bnREb3duTnVtPTMwO1xyXG4gICAgICAgIHRoaXMucm91bmQ9MTtcclxuICAgICAgICB0aGlzLm1lbnVBZGREZWZlbmRlclVJKCk7XHJcbiAgICAgICAgdGhpcy5tZW51QWRkTW9uc3RlclVJKCk7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5kZWZlbmRlcklkPTE7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5kZWZlbmRlckNvaW49dGhpcy5kZWZlbmRlckl0ZW1VSUFycmF5WzBdLmRhdGEucHJpY2U7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcclxuICAgICAgICB0aGlzLmdldEVuZW15TW9uc3RlclBvc051bSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuS6i+S7tue7keWumiAqL1xyXG4gICAgcHJpdmF0ZSBhZGRFdmVudHMoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnN0YWdlLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMub25Nb3VzZURvd24pO1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9VUCx0aGlzLHRoaXMub25Nb3VzZVVwKTtcclxuICAgICAgICB0aGlzLnNob3ZlbGJnLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMub25TaG92ZWxEb3duKTtcclxuICAgICAgICB0aGlzLmJ0bl9idWlsZC5vbihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyx0aGlzLmNsaWNrQnVpbGRfY2hlY2tDcmVhdGVDb21wbGV0ZSk7XHJcbiAgICAgICAgdGhpcy5idG5fYnV5Lm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMuY2xpY2tCdXlfTW9uc3Rlcik7XHJcbiAgICB9IFxyXG5cclxuICAgIC8qKueCueWHu+mTsuWtkOahhuaLvui1t+mTsuWtkCAqL1xyXG4gICAgcHVibGljIG9uU2hvdmVsRG93bigpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmlzVXNlU2hvdmVsPSF0aGlzLmlzVXNlU2hvdmVsO1xyXG4gICAgICAgIHRoaXMuc2hvdmVsX29mZi52aXNpYmxlPSF0aGlzLnNob3ZlbF9vZmYudmlzaWJsZTtcclxuICAgICAgICB0aGlzLnNob3ZlbF9vbi52aXNpYmxlPSF0aGlzLnNob3ZlbF9vbi52aXNpYmxlO1xyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZ3JvdXAubW91c2VFbmFibGVkPXRoaXMuaXNVc2VTaG92ZWw7IFxyXG4gICAgfVxyXG5cclxuICAgIC8qKuWFiOeUseezu+e7n+maj+acuuWPljAtNzDnmoTmlbDvvIjmr4/kuKrnjqnlrrbmi6XmnIk3MOWdl+iNieWdqu+8ie+8jOWPkemAgeivt+axgue7meWvueaWue+8jOWcqOWvueaWueWcn+WcsOWNoOmihuivpeWcn+WcsCAqL1xyXG4gICAgcHJpdmF0ZSBzZXRSYW5kb21Nb25zdGVyT2NjdXB5KCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCByYW5kb209TWF0aC5jZWlsKE1hdGgucmFuZG9tKCkqNzApOyAgICAgICAgICAgICAgICAgLy8tLee9kee7nFxyXG4gICAgICAgIC8v5Y+R6YCB57uZ5pWM5pa5546p5a626L+Z5Liq5L2N572u5qCH5Y+3XHJcbiAgICAgICAgLy9jbGllbnQuc2VuZChyYW5kb20pO1xyXG4gICAgICAgIC8v5Y+R6YCB5ZCO5o6l5pS25Zue6LCD5Ye95pWwXHJcbiAgICAgICAgdGhpcy5nZXRFbmVteU1vbnN0ZXJQb3NOdW0oKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirojrflj5bmlYzmlrnnjqnlrrbnmoTmgKrlhb3lnKjmiJHmlrnojYnlnarljaDnmoTkvY3nva4gKi9cclxuICAgIHByaXZhdGUgZ2V0RW5lbXlNb25zdGVyUG9zTnVtKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v6I635b6X5L+h5oGvXHJcbiAgICAgICAgLy9sZXQgcmFuZG9tPWNsaWVudC5nZXQoZGF0YSkgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy0t572R57ucXHJcbiAgICAgICAgbGV0IHJhbmRvbTE9MCxyYW5kb20yPTE7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5tb25zdGVyQm9ybkdyYXNzPVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLmdyYXNzQXJyYXlbcmFuZG9tMStyYW5kb20yKjEwXTtcclxuICAgICAgICAvL+maj+acuuWPluS4gOS4qjEw5Y+35L2N6I2J5Z2q5Y+Y5Li65Zyf5Z2X5L2c5Li65oCq5YW95Ye655Sf54K5XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5tb25zdGVyQm9ybkdyYXNzLmNoYW5nZUltZygpO1xyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIubW9uc3RlckJvcm5HcmFzcy5zcC5vZmYoTGF5YS5FdmVudC5DTElDSyxXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLm1vbnN0ZXJCb3JuR3Jhc3MsV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5tb25zdGVyQm9ybkdyYXNzLkV2ZW50MV9jaGFuZ2VTdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5qOA5p+l5piv5ZCm5bu65aW95aW96Lev5b6EICovXHJcbiAgICBwcml2YXRlIGNsaWNrQnVpbGRfY2hlY2tDcmVhdGVDb21wbGV0ZSgpOnZvaWQgICAgICAgICAgICAgICAgICAvLy0t572R57ucXHJcbiAgICB7XHJcbiAgICAgICAgaWYoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXkubGVuZ3RoLTFdPT1XZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5ncmFzc0FycmF5WzM5XSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8vdG9kb1xyXG4gICAgICAgICAgICB0aGlzLnNob3ZlbGJnLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX2J1aWxkLm9mZihMYXlhLkV2ZW50Lk1PVVNFX0RPV04sdGhpcyxHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5vblNob3ZlbERvd24pO1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9idWlsZC52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmJ0bl9idXkudmlzaWJsZT10cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm1vbnN0ZXJfdWlncm91cC52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZ3JvdXAubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi5L+u5bu65oiQ5Yqf77yBXCIpO1xyXG4gICAgICAgICAgICAvL+WPkemAgeS/ruWlvei3r+W+hOeahOivt+axgu+8jOetieW+heWvueaWueehruWumuS/ruW7uuWlvei3r+W+hOeahOivt+axgu+8jOmcgOetieW+heaXtumXtFxyXG4gICAgICAgICAgICAvL2NsaWVudC5zZW5kKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8tLemcgOimgeWbnuiwg+WHveaVsFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/lkKbliJnlsLHkuI3og73ngrnlh7vlhbbku5bljLrln5/nmoTojYnlnapcclxuICAgICAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyhcIuivt+ato+ehruS/ruW7uumBk+i3r++8gVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I+c5Y2V5qCP5re75Yqg5Y+v6YCJ5oup55qE5oCq5YW9ICovICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8tLemcgOivu+WPlumFjee9ruaWh+S7tlxyXG4gICAgcHJpdmF0ZSBtZW51QWRkTW9uc3RlclVJKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8Q29uZmlnTWFuYWdlci5pbnMuZ2V0Q29uZmlnTGVuZ3RoKFwibW9uc3RlclwiKTtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgbW9uc3Rlckl0ZW1VST1uZXcgTW9uc3Rlckl0ZW1VSSh0aGlzLm1vbnN0ZXJfdWlncm91cCwyMCtpKjEwMCwxMCxpKzEpO1xyXG4gICAgICAgICAgICBtb25zdGVySXRlbVVJLmJ0bl9idXkub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMuYnV5X01lbnVNb25zdGVyLFtpXSk7XHJcbiAgICAgICAgICAgIHRoaXMubW9uc3Rlckl0ZW1VSUFycmF5LnB1c2gobW9uc3Rlckl0ZW1VSSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+iPnOWNleagj+S4reeahOaAquWFvei0reS5sCAqL1xyXG4gICAgcHJpdmF0ZSBidXlfTWVudU1vbnN0ZXIoaTpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5jb2luLT10aGlzLm1vbnN0ZXJJdGVtVUlBcnJheVtpXS5kYXRhLnByaWNlO1xyXG4gICAgICAgIHRoaXMudGV4dF9jb2luLnRleHQ9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5jb2luLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5tb25zdGVyU2lnbkFycmF5LnB1c2goaSsxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirmr4/lm57lkIjotK3kubDmgKrnianmlbDph4/liqDlhaXmlbDnu4Tlj5HpgIHor7fmsYLnu5nmlYzmlrkgKi9cclxuICAgIHByaXZhdGUgY2xpY2tCdXlfTW9uc3RlcigpOnZvaWRcclxuICAgIHtcclxuICAgICAgICAvL+azqOmUgOWPmOWcn+S6i+S7tu+8jOazqOWGjOeUn+aIkOmYsuW+oeWhlOS6i+S7tlxyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIucmVzdEdyYXNzQWRkRXZlbnQoKTtcclxuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCg2MCx0aGlzLHRoaXMuY291bnRkb3duT3Blbik7XHJcbiAgICAgICAgdGhpcy50ZXh0X3RpbWVyLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICB0aGlzLmJ0bl9idXkudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICB0aGlzLm1vbnN0ZXJfdWlncm91cC52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVmZW5kZXJfdWlncm91cC52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5ncm91cC5tb3VzZUVuYWJsZWQ9dHJ1ZTtcclxuICAgICAgICAvL+WPkemAgei0reS5sOWujOaIkOivt+axglxyXG4gICAgICAgIC8vc2VuZCh0aGlzLm1vbnN0ZXJTaWduQXJyYXkpXHJcbiAgICAgICAgdGhpcy5nZXRFbmVteU1vbnN0ZXJBcnJheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaOpeaUtuWvueaWueavj+WbnuWQiOeahOaAqueJqeaVsOe7hCAqL1xyXG4gICAgcHJpdmF0ZSBnZXRFbmVteU1vbnN0ZXJBcnJheSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgbW9uc3RlclNpZ25BcnJheT1bMSwyLDEsMSwxXTtcclxuICAgICAgICBsZXQgcGxheWVyPVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXI7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxtb25zdGVyU2lnbkFycmF5Lmxlbmd0aDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgbW9uc3RlcjpNb25zdGVyPUxheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyhcIm1vbnN0ZXJcIixNb25zdGVyKTtcclxuICAgICAgICAgICAgbW9uc3Rlci5pbml0KHBsYXllci5ncm91cCxwbGF5ZXIubW9uc3RlckJvcm5HcmFzcy5zcC54LHBsYXllci5tb25zdGVyQm9ybkdyYXNzLnNwLnksbW9uc3RlclNpZ25BcnJheVtpXSk7XHJcbiAgICAgICAgICAgIG1vbnN0ZXIuYW5pLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMubW9uc3RlckFycmF5LnB1c2gobW9uc3Rlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuavj+WbnuWQiOWAkuiuoeaXtiAqL1xyXG4gICAgcHVibGljIGNvdW50ZG93bk9wZW4oKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb3VudERvd25OdW0tLTtcclxuICAgICAgICB0aGlzLnRleHRfdGltZXIudGV4dD10aGlzLmNvdW50RG93bk51bS50b1N0cmluZygpO1xyXG4gICAgICAgIC8v5YCS6K6h5pe25a6M5oiQ5ZCOXHJcbiAgICAgICAgaWYodGhpcy5jb3VudERvd25OdW09PTApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNvdW50RG93bk51bT0zMDtcclxuICAgICAgICAgICAgdGhpcy50ZXh0X3RpbWVyLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcyx0aGlzLmNvdW50ZG93bk9wZW4pO1xyXG4gICAgICAgICAgICAvL+W8gOWni+aAquWFveWHuuWHu1xyXG4gICAgICAgICAgICB0aGlzLmlzTW9uc3Rlck1vdmU9dHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5tb25zdGVyQ291bnQ9MTtcclxuICAgICAgICAgICAgLy/lhYjorqnnrKzkuIDlj6rmgKrnianov5DliqhcclxuICAgICAgICAgICAgdGhpcy5vcGVuTW9uc3Rlck1vdmUoKTtcclxuICAgICAgICAgICAgLy/lvIDlkK/lkI7nu63mgKrniannlJ/miJDorqHml7blmahcclxuICAgICAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMjQwLHRoaXMsdGhpcy5vcGVuTW9uc3Rlck1vdmUpO1xyXG4gICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi56ysXCIrdGhpcy5yb3VuZCtcIuWbnuWQiFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6I+c5Y2V5qCP5re75Yqg5Y+v6YCJ5oup55qE6Ziy5b6h5aGUICovICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8tLemcgOivu+WPlumFjee9ruaWh+S7tlxyXG4gICAgcHJpdmF0ZSBtZW51QWRkRGVmZW5kZXJVSSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPENvbmZpZ01hbmFnZXIuaW5zLmdldENvbmZpZ0xlbmd0aChcImRlZmVuZGVyXCIpO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkZWZlbmRlckl0ZW1VST1uZXcgRGVmZW5kZXJJdGVtVUkodGhpcy5kZWZlbmRlcl91aWdyb3VwLDIwK2kqMTAwLDMwLGkrMSk7XHJcbiAgICAgICAgICAgIGRlZmVuZGVySXRlbVVJLnNwLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLmNsaWNrX01lbnVEZWZlbmRlcixbaV0pO1xyXG4gICAgICAgICAgICB0aGlzLmRlZmVuZGVySXRlbVVJQXJyYXkucHVzaChkZWZlbmRlckl0ZW1VSSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKueCueWHu+iPnOWNleagj+S4reeahOmYsuW+oeWhlCAqL1xyXG4gICAgcHJpdmF0ZSBjbGlja19NZW51RGVmZW5kZXIoaTpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5kZWZlbmRlcklkPWkrMTtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmRlZmVuZGVyQ29pbj10aGlzLmRlZmVuZGVySXRlbVVJQXJyYXlbaV0uZGF0YS5wcmljZTtcclxuICAgIH1cclxuXHJcbiAgICAgLyoq5oCq54mp5ZCO57ut55Sf5oiQ6K6h5pe25ZmoICovXHJcbiAgICAgcHVibGljIG9wZW5Nb25zdGVyTW92ZSgpOnZvaWRcclxuICAgICB7XHJcbiAgICAgICAgIGlmKHRoaXMubW9uc3RlckNvdW50PD10aGlzLm1vbnN0ZXJBcnJheS5sZW5ndGgpXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICAgIHRoaXMubW9uc3RlckFycmF5W3RoaXMubW9uc3RlckNvdW50LTFdLmFuaS52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgICAgICB0aGlzLm1vbnN0ZXJBcnJheVt0aGlzLm1vbnN0ZXJDb3VudC0xXS5hbmkucGxheSgwLHRydWUpO1xyXG4gICAgICAgICAgICAgdGhpcy5tb25zdGVyX0NhbE1vdmVEaXIodGhpcy5tb25zdGVyQXJyYXlbdGhpcy5tb25zdGVyQ291bnQtMV0pO1xyXG4gICAgICAgICAgICAgdGhpcy5tb25zdGVyQXJyYXlbdGhpcy5tb25zdGVyQ291bnQtMV0ubW9uc3Rlcl9PcGVuTW92ZUJ5RGlyKCk7XHJcbiAgICAgICAgICAgICB0aGlzLm1vbnN0ZXJDb3VudCsrO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgIGVsc2VcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhcih0aGlzLHRoaXMub3Blbk1vbnN0ZXJNb3ZlKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgIH1cclxuXHJcbiAgICAvKirorqHnrpfmiYDmnInmgKrlhb3nmoTlhazlhbHot6/lvoTmlrnlkJEgKi9cclxuICAgIHB1YmxpYyBtb25zdGVyX0NhbE1vdmVEaXIobW9uc3RlcjpNb25zdGVyKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGRpclgsZGlyWTtcclxuICAgICAgICBmb3IobGV0IGk9MTtpPD1XZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheS5sZW5ndGgtMTtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZihXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtpXS5zcC55LVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ktMV0uc3AueT09MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueC1XZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtpLTFdLnNwLng9PTEwMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJYPTE7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyWT0wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpclg9LTE7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyWT0wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueC1XZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtpLTFdLnNwLng9PTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ldLnNwLnktV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaS0xXS5zcC55PT0xMDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyWD0wO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpclk9MTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJYPTA7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyWT0tMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRpckFycmF5LnB1c2goW2RpclgsZGlyWV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbn1cclxuIiwiaW1wb3J0IEdyYXNzIGZyb20gXCIuL1ByZWZhYi9HcmFzc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3Jhc3NGYWN0b3J5IHtcclxuICAgIC8qKuiNieWdquaVsOe7hCAqL1xyXG4gICAgcHVibGljIGdyYXNzQXJyYXk6QXJyYXk8R3Jhc3M+O1xyXG4gICAgLyoq5Zyf5Z2R5pWw57uEICovXHJcbiAgICBwdWJsaWMgbXVkQXJyYXk6QXJyYXk8R3Jhc3M+O1xyXG4gICAgY29uc3RydWN0b3IoY2FtcDpzdHJpbmcsdmlldzpMYXlhLlNwcml0ZSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLmdyYXNzQXJyYXkgPSBuZXcgQXJyYXk8R3Jhc3M+KCk7XHJcbiAgICAgICAgdGhpcy5tdWRBcnJheT1uZXcgQXJyYXk8R3Jhc3M+KCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVHcmFzc0FycmF5KGNhbXAsdmlldyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKueUn+aIkOiNieWdqiAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVHcmFzc0FycmF5KGNhbXA6c3RyaW5nLHZpZXc6TGF5YS5TcHJpdGUpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPDc7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7ajwxMDtqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBncmFzczpHcmFzcztcclxuICAgICAgICAgICAgICAgIGlmKGklMj09MClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcz1uZXcgR3Jhc3MoaiUyKzEsdmlldyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3Jhc3M9bmV3IEdyYXNzKChqKzEpJTIrMSx2aWV3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZ3Jhc3NBcnJheS5wdXNoKGdyYXNzKTtcclxuICAgICAgICAgICAgICAgIGdyYXNzLlBvcyhpLGopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi9HYW1lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IE1vbnN0ZXJDb25maWcgZnJvbSBcIi4uLy4uL0RhdGEvQ29uZmlnL01vc250ZXJDb25maWdyXCI7XHJcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbnN0ZXJ7XHJcbiAgICAvKirliqjnlLsgKi9cclxuICAgIHB1YmxpYyBhbmk6TGF5YS5BbmltYXRpb247XHJcbiAgICAvKirooYDph48gKi9cclxuICAgIHB1YmxpYyBjdXJySFA6bnVtYmVyO1xyXG4gICAgLyoq6KGA6YeP5Zu+6IOM5pmvICovXHJcbiAgICBwdWJsaWMgaHBiZzpMYXlhLlNwcml0ZTtcclxuICAgIC8qKuihgOmHj+WbviAqL1xyXG4gICAgcHVibGljIGhwU1A6TGF5YS5TcHJpdGU7XHJcbiAgICAvKirmgKrlhb3phY3nva7mlbDmja4gKi9cclxuICAgIHB1YmxpYyBkYXRhOk1vbnN0ZXJDb25maWc7XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwdWJsaWMgaW5pdCh2aWV3OkxheWEuU3ByaXRlLHg6bnVtYmVyLHk6bnVtYmVyLG51bTpudW1iZXIpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRhdGE9Q29uZmlnTWFuYWdlci5pbnMuZ2V0Q29uZmlnQnlJZChcIm1vbnN0ZXJcIixudW0pO1xyXG4gICAgICAgIHRoaXMuY3VyckhQPXRoaXMuZGF0YS5ocDtcclxuICAgICAgICB0aGlzLmFuaT1uZXcgTGF5YS5BbmltYXRpb24oKTtcclxuICAgICAgICB0aGlzLmFuaS56T3JkZXI9MTtcclxuICAgICAgICB0aGlzLmFuaS5wb3MoeCx5KTtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuYW5pKTtcclxuXHJcbiAgICAgICAgdGhpcy5ocGJnPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuaHBiZy5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL2hwYmcucG5nXCIpKTtcclxuICAgICAgICB0aGlzLmFuaS5hZGRDaGlsZCh0aGlzLmhwYmcpO1xyXG4gICAgICAgIHRoaXMuaHBiZy5hdXRvU2l6ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuaHBiZy5wb3MoMCwtMTApO1xyXG5cclxuICAgICAgICB0aGlzLmhwU1A9bmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5ocFNQLmxvYWRJbWFnZShcImdhbWUvaHAucG5nXCIpO1xyXG4gICAgICAgIHRoaXMuaHBiZy5hZGRDaGlsZCh0aGlzLmhwU1ApO1xyXG4gICAgICAgIHRoaXMuaHBTUC5wb3MoMCwwKTtcclxuICAgIH1cclxuICAgIC8qKuagueaNruaWueWQkemAieaLqeWKqOeUuyAqL1xyXG4gICAgcHVibGljIHR5cGVBbmltYXRpb24oZGlyZWN0aW9uOnN0cmluZyk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYW5pLnN0b3AoKTtcclxuICAgICAgICB0aGlzLmFuaS5sb2FkQW5pbWF0aW9uKFwiR2FtZS9hbmlzL1wiK3RoaXMuZGF0YS5tb25zdGVyTmFtZStcIl9cIitkaXJlY3Rpb24rXCIuYW5pXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuW8gOWQr+aAquWFveenu+WKqCAqL1xyXG4gICAgcHVibGljIG1vbnN0ZXJfT3Blbk1vdmVCeURpcigpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5tb25zdGVyX01vdmUsWzBdKTtcclxuICAgICAgICB0aGlzLnR5cGVBbmltYXRpb24odGhpcy5nZXRBbmltQnlEaXIoR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UuZGlyQXJyYXlbMF1bMF0sR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UuZGlyQXJyYXlbMF1bMV0pKTtcclxuICAgICAgICB0aGlzLmFuaS5wbGF5KDAsdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5oCq5YW956e75YqoICovXHJcbiAgICBwcml2YXRlIG1vbnN0ZXJfTW92ZShpOm51bWJlcik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKChNYXRoLmFicyh0aGlzLmFuaS54LVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ldLnNwLngpPD0xMDAmJih0aGlzLmFuaS55LVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ldLnNwLnk9PTApKXx8XHJcbiAgICAgICAgICAgKE1hdGguYWJzKHRoaXMuYW5pLnktV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueSk8PTEwMCYmKHRoaXMuYW5pLngtV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueD09MCkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlRGlzdGFuY2UoMSxHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVswXSxHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pLng9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueCtHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVswXSoxMDA7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pLnk9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueStHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVsxXSoxMDA7XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcyx0aGlzLm1vbnN0ZXJfTW92ZSk7XHJcbiAgICAgICAgICAgIGlmKGk8V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXkubGVuZ3RoLTIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLm1vbnN0ZXJfTW92ZSxbaSsxXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlyPXRoaXMuZ2V0QW5pbUJ5RGlyKEdhbWVDb250cm9sbGVyLkluc3RhbmNlLmRpckFycmF5W2krMV1bMF0sR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UuZGlyQXJyYXlbaSsxXVsxXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVBbmltYXRpb24oZGlyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pLnBsYXkoMCx0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ29HZXRDcnlzdGFsUm9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKuagueaNruaAquWFveiuoeeul+i3r+W+hOaWueWQkeWGs+WumuWKqOeUu+aSreaUviAqL1xyXG4gICAgcHJpdmF0ZSBnZXRBbmltQnlEaXIoeDpudW1iZXIseTpudW1iZXIpOnN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIGxldCBkaXI7XHJcbiAgICAgICAgaWYoeD09MSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpcj1cInJpZ2h0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoeD09LTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXI9XCJsZWZ0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHk9PTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXI9XCJkb3duXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoeT09LTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXI9XCJ1cFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGlyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuW8gOWni+WJjeW+gOaKouWkuuawtOaZtueahOmBk+i3ryAqL1xyXG4gICAgcHJpdmF0ZSBnb0dldENyeXN0YWxSb2FkKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBkaXJYO1xyXG4gICAgICAgIGxldCB0eXBlO1xyXG4gICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY2FtcD09XCJyZWRcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpclg9MTtcclxuICAgICAgICAgICAgdHlwZT1cInJpZ2h0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpclg9LTE7XHJcbiAgICAgICAgICAgIHR5cGU9XCJsZWZ0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLm1vdmVEaXN0YW5jZSxbMSxkaXJYLDBdKTtcclxuICAgICAgICB0aGlzLnR5cGVBbmltYXRpb24odHlwZSk7XHJcbiAgICAgICAgdGhpcy5hbmkucGxheSgwLHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuenu+WKqOi3neemuyAqL1xyXG4gICAgcHJpdmF0ZSBtb3ZlRGlzdGFuY2Uoc3BlZWQ6bnVtYmVyLGRpclg6bnVtYmVyLGRpclk6bnVtYmVyKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5hbmkueCs9c3BlZWQqZGlyWDtcclxuICAgICAgICB0aGlzLmFuaS55Kz1zcGVlZCpkaXJZO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaKouWkuuawtOaZtueahOmBk+i3r+S4iuajgOa1i+WvueaWueaAquWFvSAqL1xyXG4gICAgcHJpdmF0ZSBjaGVja0VuZW15KCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKirplIDmr4FNb25zdGVyICovXHJcbiAgICBwdWJsaWMgRGVzdHJveSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYW5pLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hbmkueT0tMTAwMDtcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIm1vbnN0ZXJcIix0aGlzKTtcclxuICAgIH1cclxufSIsImltcG9ydCBNb25zdGVyIGZyb20gXCIuLi9Nb25zdGVyXCI7XHJcbmltcG9ydCBUb29sIGZyb20gXCIuLi8uLi8uLi9Ub29sL1Rvb2xcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1bGxldHtcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgY29uc3RydWN0b3IoKVxyXG4gICAge1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQodmlldzpMYXlhLlNwcml0ZSx4LHkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9idWxsZXQucG5nXCIpKTtcclxuICAgICAgICB0aGlzLnNwLmF1dG9TaXplPXRydWU7XHJcbiAgICAgICAgdGhpcy5zcC5wb3MoeCx5KTtcclxuICAgICAgICB0aGlzLnNwLnpPcmRlcj0zO1xyXG4gICAgICAgIHZpZXcuYWRkQ2hpbGQodGhpcy5zcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L+96ZqP5oCq54mp5pa55ZCR6L+b6KGM56e75Yqo5Y+R5bCEICovXHJcbiAgICBwdWJsaWMgZm9sbG93TW9uc3Rlcihtb25zdGVyOk1vbnN0ZXIsc3BlZWQ6bnVtYmVyLGRhbWFnZTpudW1iZXIpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZihUb29sLmdldERpc3RhbmNlKHRoaXMuc3AsbW9uc3Rlci5hbmkpPj00MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkaXJYPShtb25zdGVyLmFuaS54LXRoaXMuc3AueCkvVG9vbC5nZXREaXN0YW5jZSh0aGlzLnNwLG1vbnN0ZXIuYW5pKTtcclxuICAgICAgICAgICAgbGV0IGRpclk9KG1vbnN0ZXIuYW5pLnktdGhpcy5zcC55KS9Ub29sLmdldERpc3RhbmNlKHRoaXMuc3AsbW9uc3Rlci5hbmkpO1xyXG4gICAgICAgICAgICB0aGlzLnNwLngrPWRpclgqc3BlZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3AueSs9ZGlyWSpzcGVlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbW9uc3Rlci5jdXJySFAtPWRhbWFnZTtcclxuICAgICAgICAgICAgbW9uc3Rlci5ocFNQLndpZHRoLT1kYW1hZ2UvbW9uc3Rlci5kYXRhLmhwKm1vbnN0ZXIuaHBTUC53aWR0aDtcclxuICAgICAgICAgICAgaWYobW9uc3Rlci5jdXJySFA8PTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1vbnN0ZXIuRGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8v56Kw5pKe5Yiw5oCq5YW9XHJcbiAgICAgICAgICAgIHRoaXMuRGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirplIDmr4HlrZDlvLkgKi9cclxuICAgIHByaXZhdGUgRGVzdHJveSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc3AudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcImJ1bGxldFwiLHRoaXMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IE1vbnN0ZXIgZnJvbSBcIi4uL01vbnN0ZXJcIjtcclxuaW1wb3J0IFRvb2wgZnJvbSBcIi4uLy4uLy4uL1Rvb2wvVG9vbFwiO1xyXG5pbXBvcnQgQnVsbGV0IGZyb20gXCIuL0J1bGxldFwiO1xyXG5pbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4uL0dhbWVDb250cm9sbGVyXCI7XHJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi4vLi4vV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgRGVmZW5kZXJDb25maWcgZnJvbSBcIi4uLy4uLy4uL0RhdGEvQ29uZmlnL0RlZmVuZGVyQ29uZmlnXCI7XHJcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlZmVuZGVye1xyXG4gICAgLyoq57K+54G1ICovXHJcbiAgICBwdWJsaWMgc3A6TGF5YS5TcHJpdGU7XHJcbiAgICAvKirmraPlr7nkuIDkuKrnm67moIfov5vooYzlsITlh7sgKi9cclxuICAgIHByaXZhdGUgaXNTaG9vdGluZ0J5T25lOmJvb2xlYW47XHJcbiAgICAvKirmraPlnKjlsITlh7vnmoTmgKrlhb0gKi9cclxuICAgIHByaXZhdGUgY3Vyck1vbnN0ZXI6TW9uc3RlcjtcclxuICAgIC8qKumYsuW+oeWhlOmFjee9ruaVsOaNriAqL1xyXG4gICAgcHVibGljIGRhdGE6RGVmZW5kZXJDb25maWc7XHJcbiAgICAvKip2aWV3ICovXHJcbiAgICBwcml2YXRlIHZpZXc6TGF5YS5TcHJpdGU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG5cclxuICAgIC8qKuWIneWni+WMliAqL1xyXG4gICAgcHJpdmF0ZSBpbml0KHZpZXc6TGF5YS5TcHJpdGUseCx5LG51bSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGF0YT1Db25maWdNYW5hZ2VyLmlucy5nZXRDb25maWdCeUlkKFwiZGVmZW5kZXJcIixudW0pO1xyXG4gICAgICAgIHRoaXMudmlldz12aWV3O1xyXG4gICAgICAgIHRoaXMuaXNTaG9vdGluZ0J5T25lPWZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9cIit0aGlzLmRhdGEuZGVmZW5kZXJOYW1lK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgdGhpcy5zcC5hdXRvU2l6ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuc3AucG9zKHgseSk7XHJcbiAgICAgICAgdGhpcy5zcC56T3JkZXI9MjtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG4gICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLmNoZWNrTW9uc3RlckRpc3RhbmNlLFtHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5tb25zdGVyQXJyYXldKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuiMg+WbtOajgOa1iyAqL1xyXG4gICAgcHVibGljIGNoZWNrTW9uc3RlckRpc3RhbmNlKG1vbnN0ZXJBcnJheTpBcnJheTxNb25zdGVyPik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKEdhbWVDb250cm9sbGVyLkluc3RhbmNlLmlzTW9uc3Rlck1vdmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzU2hvb3RpbmdCeU9uZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoKFRvb2wuZ2V0RGlzdGFuY2UodGhpcy5zcCx0aGlzLmN1cnJNb25zdGVyLmFuaSk+PXRoaXMuZGF0YS5kaWMpfHx0aGlzLmN1cnJNb25zdGVyLmN1cnJIUDw9MClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyKHRoaXMsdGhpcy5jcmVhdGVCdWxsZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTaG9vdGluZ0J5T25lPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPG1vbnN0ZXJBcnJheS5sZW5ndGg7aSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKFRvb2wuZ2V0RGlzdGFuY2UodGhpcy5zcCxtb25zdGVyQXJyYXlbaV0uYW5pKTx0aGlzLmRhdGEuZGljKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCh0aGlzLmRhdGEuYXR0YWNrRnJlcXVlbmN5KjYwLHRoaXMsdGhpcy5jcmVhdGVCdWxsZXQsW21vbnN0ZXJBcnJheVtpXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyck1vbnN0ZXI9bW9uc3RlckFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTaG9vdGluZ0J5T25lPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKueUn+aIkOWtkOW8uSAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVCdWxsZXQobW9uc3Rlcik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBidWxsZXQ9TGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFwiYnVsbGV0XCIsQnVsbGV0KTtcclxuICAgICAgICBidWxsZXQuaW5pdCh0aGlzLnZpZXcsdGhpcy5zcC54LHRoaXMuc3AueSk7XHJcbiAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMSxidWxsZXQsYnVsbGV0LmZvbGxvd01vbnN0ZXIsW21vbnN0ZXIsdGhpcy5kYXRhLmF0dGFja1NwZWVkLHRoaXMuZGF0YS5wb3dlcl0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKumUgOavgURlZmVuZGVyICovXHJcbiAgICBwdWJsaWMgRGVzdHJveSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc3AudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICB0aGlzLnNwLnk9LTEwMDA7XHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJkZWZlbmRlclwiLHRoaXMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENvbmZpZ01hbmFnZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvQ29uZmlnTWFuYWdlclwiO1xyXG5pbXBvcnQgRGVmZW5kZXJDb25maWcgZnJvbSBcIi4uLy4uLy4uL0RhdGEvQ29uZmlnL0RlZmVuZGVyQ29uZmlnXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWZlbmRlckl0ZW1VSXtcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgLyoq6YeR5biB5paH5pysICovXHJcbiAgICBwdWJsaWMgY29pblRleHQ6TGF5YS5UZXh0O1xyXG4gICAgLyoq6Ziy5b6h5aGU6YWN572u5pWw5o2uICovXHJcbiAgICBwdWJsaWMgZGF0YTpEZWZlbmRlckNvbmZpZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2aWV3OkxheWEuU3ByaXRlLHg6bnVtYmVyLHk6bnVtYmVyLG51bTpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pbml0KHZpZXcseCx5LG51bSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQodmlldzpMYXlhLlNwcml0ZSx4LHksbnVtOm51bWJlcik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGF0YT1Db25maWdNYW5hZ2VyLmlucy5nZXRDb25maWdCeUlkKFwiZGVmZW5kZXJcIixudW0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9cIit0aGlzLmRhdGEuZGVmZW5kZXJOYW1lK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgdGhpcy5zcC5hdXRvU2l6ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuc3AucG9zKHgseSk7XHJcbiAgICAgICAgdGhpcy5zcC56T3JkZXI9MjtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG5cclxuICAgICAgICB0aGlzLmNvaW5UZXh0PW5ldyBMYXlhLlRleHQoKTtcclxuICAgICAgICB0aGlzLmNvaW5UZXh0LnBvcygwLHRoaXMuc3AuaGVpZ2h0KzIwKTtcclxuICAgICAgICB0aGlzLmNvaW5UZXh0LnRleHQ9dGhpcy5kYXRhLnByaWNlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5zcC5hZGRDaGlsZCh0aGlzLmNvaW5UZXh0KTtcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi4vR2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IERlZmVuZGVyIGZyb20gXCIuL0RlZmVuZGVyXCI7XHJcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xyXG5pbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uLy4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXNze1xyXG4gICAgLyoq5qiq5Z2Q5qCH5L2N572uICovXHJcbiAgICBwdWJsaWMgWDpudW1iZXI7XHJcbiAgICAvKirnurXlnZDmoIfkvY3nva4gKi9cclxuICAgIHB1YmxpYyBZOm51bWJlcjtcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgLyoq5piv5ZCm5Li65Zyf5Z2X5qCH6K6wICovXHJcbiAgICBwdWJsaWMgaXNNdWQ6Ym9vbGVhbjtcclxuICAgIC8qKuiNieWdquWbvuexu+WeiyAqL1xyXG4gICAgcHJpdmF0ZSBudW06bnVtYmVyO1xyXG4gICAgLyoqdmlldyAqL1xyXG4gICAgcHJpdmF0ZSB2aWV3OkxheWEuU3ByaXRlO1xyXG4gICAgY29uc3RydWN0b3IobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaW5pdChudW0sdmlldyk7XHJcbiAgICAgICAgdGhpcy52aWV3PXZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5udW09bnVtO1xyXG4gICAgICAgIHRoaXMuaXNNdWQ9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcD1uZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICB0aGlzLnNwLmdyYXBoaWNzLmRyYXdUZXh0dXJlKExheWEubG9hZGVyLmdldFJlcyhcImdhbWUvZ3Jhc3NcIitudW0rXCIucG5nXCIpKTtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG4gICAgICAgIHRoaXMuc3AuYXV0b1NpemU9dHJ1ZTtcclxuICAgICAgICB0aGlzLnNwLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLkV2ZW50MV9jaGFuZ2VTdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5qC85a2Q5L2N572uICovXHJcbiAgICBwdWJsaWMgUG9zKFg6bnVtYmVyLFk6bnVtYmVyKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5YPVk7XHJcbiAgICAgICAgdGhpcy5ZPVg7XHJcbiAgICAgICAgdGhpcy5zcC5wb3MoMTAwKlksMjUrMTAwKlgpO1xyXG4gICAgfVxyXG4gICAgLyoq5rOo5YaM56ys5LiA56eN5LqL5Lu277ya6L2s5o2i54q25oCB77yM5qCH6K6w5piv5ZCm5Li65Zyf5Z2XICovXHJcbiAgICBwdWJsaWMgRXZlbnQxX2NoYW5nZVN0YXRlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v5aaC5p6c5piv6I2J5Z2qLOWImeWPmOaIkOWcn+Wdl1xyXG4gICAgICAgIGlmKCF0aGlzLmlzTXVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/lpoLmnpzmraTojYnlnarlnKjkuIrkuIDkuKrmnIDlkI7kuIDmrKHorrDlvZXlnJ/lnZfnmoTlkajlm7TnmoTor53vvIzliJnlj6/lj5jkuLrlnJ/lnZdcclxuICAgICAgICAgICAgbGV0IG11ZHNwPVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W1dlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5Lmxlbmd0aC0xXS5zcDtcclxuICAgICAgICAgICAgaWYoKE1hdGguYWJzKG11ZHNwLngtdGhpcy5zcC54KT09MTAwJiYobXVkc3AueT09dGhpcy5zcC55KSl8fFxyXG4gICAgICAgICAgICAgICAoTWF0aC5hYnMobXVkc3AueS10aGlzLnNwLnkpPT0xMDAmJihtdWRzcC54PT10aGlzLnNwLngpKSlcclxuICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VJbWcoKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v5ZCm5YiZ5bCx5LiN6IO954K55Ye75YW25LuW5Yy65Z+f55qE6I2J5Z2qXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi6K+35Zyo5Zyf5Z2X5ZGo5Zu05bu656uL6YGT6Lev77yBXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUltZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirliIfmjaLlm77niYcgKi9cclxuICAgIHB1YmxpYyBjaGFuZ2VJbWcoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5jbGVhcigpO1xyXG4gICAgICAgIC8v5aaC5p6c5piv6I2J5Z2qLOWImeWPmOaIkOWcn+Wdl1xyXG4gICAgICAgIGlmKCF0aGlzLmlzTXVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL211ZC5wbmdcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVkPXRydWU7XHJcbiAgICAgICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5WzBdIT1udWxsKVxyXG4gICAgICAgICAgICB7ICAgXHJcbiAgICAgICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheS5sZW5ndGgtMV0uc3AubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcC5tb3VzZUVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXkucHVzaCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZS8v5aaC5p6c5piv5Zyf5Z2XLOWImeWPmOaIkOiNieWdqlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL2dyYXNzXCIrdGhpcy5udW0rXCIucG5nXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5pc011ZD1mYWxzZTtcclxuICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXkubGVuZ3RoLTJdLnNwLm1vdXNlRW5hYmxlZD10cnVlO1xyXG4gICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheS5wb3AoKTtcclxuICAgICAgICB9ICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirms6jlhoznrKzkuoznp43kuovku7bvvJrlvoDojYnlnarkuIrmt7vliqDngq7loZQgKi9cclxuICAgIHB1YmxpYyBFdmVudDJfQWRkRGVmZW5kZXIoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGRlZmVuZGVyPUxheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyhcImRlZmVuZGVyXCIsRGVmZW5kZXIpO1xyXG4gICAgICAgIGRlZmVuZGVyLmluaXQodGhpcy52aWV3LHRoaXMuc3AueCx0aGlzLnNwLnksV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5kZWZlbmRlcklkKTtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmNvaW4tPVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZGVmZW5kZXJDb2luO1xyXG4gICAgICAgIEdhbWVDb250cm9sbGVyLkluc3RhbmNlLnRleHRfY29pbi50ZXh0PVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY29pbi50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuc3Aub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLkV2ZW50Ml9BZGREZWZlbmRlcik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uLy4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IE1vbnN0ZXJDb25maWcgZnJvbSBcIi4uLy4uLy4uL0RhdGEvQ29uZmlnL01vc250ZXJDb25maWdyXCI7XHJcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbnN0ZXJJdGVtVUl7XHJcbiAgICAvKirnsr7ngbUgKi9cclxuICAgIHByaXZhdGUgc3A6TGF5YS5TcHJpdGU7XHJcbiAgICAvKirotK3kubDmjInpkq4gKi9cclxuICAgIHB1YmxpYyBidG5fYnV5OkxheWEuU3ByaXRlO1xyXG4gICAgLyoq6YeR5biB5paH5pysICovXHJcbiAgICBwdWJsaWMgY29pblRleHQ6TGF5YS5UZXh0O1xyXG4gICAgLyoq5oCq5YW96YWN572u5pWw5o2uICovXHJcbiAgICBwdWJsaWMgZGF0YTpNb25zdGVyQ29uZmlnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZpZXc6TGF5YS5TcHJpdGUseDpudW1iZXIseTpudW1iZXIsbnVtOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0aGlzLmluaXQodmlldyx4LHksbnVtKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliJ3lp4vljJYgKi9cclxuICAgIHByaXZhdGUgaW5pdCh2aWV3OkxheWEuU3ByaXRlLHg6bnVtYmVyLHk6bnVtYmVyLG51bTpudW1iZXIpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRhdGE9Q29uZmlnTWFuYWdlci5pbnMuZ2V0Q29uZmlnQnlJZChcIm1vbnN0ZXJcIixudW0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AubG9hZEltYWdlKFwiZ2FtZS9hbmkvXCIrdGhpcy5kYXRhLm1vbnN0ZXJOYW1lK1wiX2Rvd24xLnBuZ1wiKTtcclxuICAgICAgICB0aGlzLnNwLndpZHRoPTUwO1xyXG4gICAgICAgIHRoaXMuc3AuaGVpZ2h0PTYwO1xyXG4gICAgICAgIHRoaXMuc3AucG9zKHgseSk7XHJcbiAgICAgICAgdmlldy5hZGRDaGlsZCh0aGlzLnNwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2luVGV4dD1uZXcgTGF5YS5UZXh0KCk7XHJcbiAgICAgICAgdGhpcy5jb2luVGV4dC5wb3MoMCx0aGlzLnNwLmhlaWdodCsxMCk7XHJcbiAgICAgICAgdGhpcy5jb2luVGV4dC50ZXh0PXRoaXMuZGF0YS5wcmljZS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuY29pblRleHQuYWxpZ249XCJtaWRkbGVcIjtcclxuICAgICAgICB0aGlzLnNwLmFkZENoaWxkKHRoaXMuY29pblRleHQpO1xyXG5cclxuICAgICAgICB0aGlzLmJ0bl9idXk9bmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5idG5fYnV5LmxvYWRJbWFnZShcImdhbWUvYnV5LnBuZ1wiKTtcclxuICAgICAgICB0aGlzLmJ0bl9idXkucG9zKDAsdGhpcy5zcC5oZWlnaHQrMjApO1xyXG4gICAgICAgIHRoaXMuc3AuYWRkQ2hpbGQodGhpcy5idG5fYnV5KTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IENvbmZpZ01hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvQ29uZmlnTWFuYWdlclwiO1xyXG5pbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9hZGluZ0NvbnRyb2xsZXIgZXh0ZW5kcyB1aS5QbGF5ZXJMb2FkaW5nVUl7XHJcbiAgICAvKirmmK/lkKbov57mjqXkuIrmnI3liqHlmaggKi9cclxuICAgIHByaXZhdGUgaXNDb25uZWN0U2VydmVyIDogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuaXNDb25uZWN0U2VydmVyID0gZmFsc2U7IFxyXG4gICAgICAgIHRoaXMuc2VsZWN0TW9kZSgpO1xyXG4gICAgICAgIHRoaXMubG9hZEFzc2V0cygpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKirliqDovb3muLjmiI/lnLrmma/otYTmupAgKi9cclxuICAgIHByaXZhdGUgbG9hZEFzc2V0cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBzcmMgPSBbXHJcbiAgICAgICAgICAgIC8v5Zu+6ZuG5Yqg6L29XHJcbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvZ2FtZS5hdGxhc1wifSwgXHJcbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvZ2FtZS9hbmkuYXRsYXNcIn0gICAgIFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChzcmMsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Mb2FkKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vblByb2Nlc3MpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3ov5vnqIsgKi9cclxuICAgIHByaXZhdGUgb25Qcm9jZXNzKHBybykgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHByb0JveCA9IHRoaXMuc3BfcHJvZ3Jlc3M7XHJcbiAgICAgICAgbGV0IHByb1cgPSB0aGlzLnNwX3Byb2dyZXNzVztcclxuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xyXG4gICAgICAgIHByb1cud2lkdGggPSBwcm9Cb3gud2lkdGgqcHJvO1xyXG4gICAgICAgIHByb0wueCA9IHByb0JveC53aWR0aCpwcm87XHJcbiAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0U2VydmVyKSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+ato+WcqOi/nuaOpeacjeWKoeWZqOKApuKApl1cIjtcclxuICAgICAgICAgICAgZWxzZSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+acjeWKoeWZqOi/nuaOpeaIkOWKn11cIjtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3lrozmr5UgKi9cclxuICAgIHByaXZhdGUgb25Mb2FkKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5FbnRlckdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirnoa7lrprmuLjmiI/mqKHlvI/vvIzmmL7npLrnjqnlrrbkv6Hmga/vvIznlYzpnaLkuIrmlrnmmL7npLrnuqLmlrnnjqnlrrbvvIzkuIvmlrnmmL7npLrok53mlrnnjqnlrrYqL1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RNb2RlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5tb2RlPT1cIjFWMVwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBpPTA7aTw1O2krKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWRfZ3JvdXAuX2NoaWxkcmVuW2ldLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsdWVfZ3JvdXAuX2NoaWxkcmVuW2ldLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZWRfcGxheWVyXzMudmlzaWJsZT10cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmJsdWVfcGxheWVyXzMudmlzaWJsZT10cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5jYW1wPT1cInJlZFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5pY29uX3JlZF9wbGF5ZXJfMy5sb2FkSW1hZ2UoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5pY29uKTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lX3JlZF9wbGF5ZXJfMy50ZXh0PVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIubmFtZTtcclxuICAgICAgICAgICAgdGhpcy5pY29uX2JsdWVfcGxheWVyXzMubG9hZEltYWdlKFdlbENvbWVDb250cm9sbGVyLmlucy5lbmVteVBsYXllci5pY29uKTtcclxuICAgICAgICAgICAgdGhpcy5uYW1lX2JsdWVfcGxheWVyXzMudGV4dD1XZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIubmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5pY29uX2JsdWVfcGxheWVyXzMubG9hZEltYWdlKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuaWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZV9ibHVlX3BsYXllcl8zLnRleHQ9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLmljb25fcmVkX3BsYXllcl8zLmxvYWRJbWFnZShXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuaWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZV9yZWRfcGxheWVyXzMudGV4dD1XZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIubmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKirov5vlhaXmuLjmiI8gKi9cclxuICAgIHByaXZhdGUgRW50ZXJHYW1lKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZS9HYW1lLnNjZW5lXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEdyYXNzRmFjdG9yeSBmcm9tIFwiLi4vR2FtZS9HcmFzc0ZhY3RvcnlcIjtcclxuaW1wb3J0IEdhbWVDb250cm9sbGVyIGZyb20gXCIuLi9HYW1lL0dhbWVDb250cm9sbGVyXCI7XHJcbmltcG9ydCBNb25zdGVyIGZyb20gXCIuLi9HYW1lL01vbnN0ZXJcIjtcclxuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi9XZWxDb21lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgR3Jhc3MgZnJvbSBcIi4uL0dhbWUvUHJlZmFiL0dyYXNzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllcntcclxuICAgIC8qKumYteiQpSAqL1xyXG4gICAgcHVibGljIGNhbXA6c3RyaW5nO1xyXG4gICAgLyoq5ZCN5a2XICovXHJcbiAgICBwdWJsaWMgbmFtZTpzdHJpbmc7XHJcbiAgICAvKirlpLTlg48gKi9cclxuICAgIHB1YmxpYyBpY29uOnN0cmluZztcclxuICAgIC8qKueOqeWutuaWueiNieWdqiAqL1xyXG4gICAgcHVibGljIGZhYzpHcmFzc0ZhY3Rvcnk7XHJcbiAgICAvKirojYnlnarmiYDlsZ7nu4QgKi9cclxuICAgIHB1YmxpYyBncm91cDpMYXlhLlNwcml0ZTtcclxuICAgIC8qKuaAqueJqeWHuueUn+eCuSAqL1xyXG4gICAgcHVibGljIG1vbnN0ZXJCb3JuR3Jhc3M6R3Jhc3M7XHJcbiAgICAvKirlvZPliY3pgInmi6nmlL7nva7nmoTpmLLlvqHloZTnsbvlnovvvIzpu5jorqTpgInmi6kxICovXHJcbiAgICBwdWJsaWMgZGVmZW5kZXJJZDpudW1iZXI7XHJcbiAgICAvKirlvZPliY3pgInmi6nmlL7nva7pmLLlvqHloZTnsbvlnovpnIDopoHmtojogJfnmoTph5HluIHmlbAgKi9cclxuICAgIHB1YmxpYyBkZWZlbmRlckNvaW46bnVtYmVyO1xyXG4gICAgLyoq6YeR5biBICovXHJcbiAgICBwdWJsaWMgY29pbjpudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLGljb24pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5uYW1lPW5hbWVcclxuICAgICAgICB0aGlzLmljb249aWNvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuW3seaWueeOqeWutioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgLyoq5bex5pa5546p5a625ri45oiP5Zy65pmv5L+h5oGv5Yid5aeL5YyWICovXHJcbiAgICBwdWJsaWMgb3duR2FtZUluaXQoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5jYW1wPT1cInJlZFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cD1HYW1lQ29udHJvbGxlci5JbnN0YW5jZS5yZWRfZ3JvdXA7XHJcbiAgICAgICAgICAgIEdhbWVDb250cm9sbGVyLkluc3RhbmNlLmJsdWVfZ3JvdXAubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwPUdhbWVDb250cm9sbGVyLkluc3RhbmNlLmJsdWVfZ3JvdXA7XHJcbiAgICAgICAgICAgIEdhbWVDb250cm9sbGVyLkluc3RhbmNlLnJlZF9ncm91cC5tb3VzZUVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JvdXAubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuZmFjPW5ldyBHcmFzc0ZhY3RvcnkodGhpcy5jYW1wLHRoaXMuZ3JvdXApO1xyXG4gICAgICAgIHRoaXMuY29pbj01MDA7XHJcbiAgICAgICAgR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UudGV4dF9jb2luLnRleHQ9dGhpcy5jb2luLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudCgpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKua3u+WKoOS6i+S7tiAqL1xyXG4gICAgcHVibGljIGFkZEV2ZW50KClcclxuICAgIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgXHJcblxyXG4gICAgLyoq5Li65Ymp5LiL55qE6I2J5Z2q5rOo5YaM5paw5LqL5Lu2ICovXHJcbiAgICBwdWJsaWMgcmVzdEdyYXNzQWRkRXZlbnQoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTw3MDtpKyspXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgZ3Jhc3M9dGhpcy5mYWMuZ3Jhc3NBcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGdyYXNzLnNwLm9mZihMYXlhLkV2ZW50LkNMSUNLLGdyYXNzLGdyYXNzLkV2ZW50MV9jaGFuZ2VTdGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBncmFzcy5zcC5vbihMYXlhLkV2ZW50LkNMSUNLLGdyYXNzLGdyYXNzLkV2ZW50Ml9BZGREZWZlbmRlcik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmZhYy5tdWRBcnJheS5sZW5ndGg7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5mYWMubXVkQXJyYXlbaV0uc3Aub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcy5mYWMubXVkQXJyYXlbaV0sdGhpcy5mYWMubXVkQXJyYXlbaV0uRXZlbnQyX0FkZERlZmVuZGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgXHJcbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCwgR2FtZUNvbmZpZyB9IGZyb20gXCIuLi8uLi9Db3JlL0NvbnN0L0dhbWVDb25maWdcIjtcbmltcG9ydCBVc2VyTG9naW5IYW5kbGVyIGZyb20gXCIuL2hhbmRsZXIvVXNlckxvZ2luSGFuZGxlclwiO1xuaW1wb3J0IENsaWVudFNlbmRlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvQ2xpZW50U2VuZGVyXCI7XG5pbXBvcnQgVG9vbCBmcm9tIFwiLi4vLi4vVG9vbC9Ub29sXCI7XG5pbXBvcnQgTWVzc2FnZU1hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvTWVzc2FnZU1hbmFnZXJcIjtcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlbENvbWVDb250cm9sbGVyIGV4dGVuZHMgdWkuV2VsY29tZS5Mb2dpblVJe1xuICAgIC8qKuWNleS+iyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zOldlbENvbWVDb250cm9sbGVyO1xuICAgIC8qKuaYr+WQpui/nuaOpeS4iuacjeWKoeWZqCAqL1xuICAgIHByaXZhdGUgaXNDb25uZWN0U2VydmVyIDogYm9vbGVhbjtcbiAgICAvKirnjqnlrrbkv6Hmga8gKi9cbiAgICBwdWJsaWMgb3duUGxheWVyOlBsYXllcjtcbiAgICAvKirmlYzmlrnnjqnlrrbkv6Hmga8gKi9cbiAgICBwdWJsaWMgZW5lbXlQbGF5ZXI6UGxheWVyO1xuICAgIC8qKua4uOaIj+aooeW8jyAqL1xuICAgIHB1YmxpYyBtb2RlOnN0cmluZztcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8v55Sf5ZG95ZGo5pyfXG4gICAgLyoq5ZCv5YqoICovXG4gICAgb25FbmFibGUoKXtcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zPXRoaXM7XG4gICAgICAgIHRoaXMuZGF0YUluaXQoKTtcbiAgICAgICAgdGhpcy5zZXRDZW50ZXIoKTtcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdFNlcnZlcigpOy8v6L+e5o6l5pyN5Yqh5ZmoXG4gICAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgLyoq6ZSA5q+BKi9cbiAgICBvbkRlc3Ryb3koKXtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcbiAgICB9XG5cblxuICAgIC8vLy8vLy8vLy8vL+mAu+i+kVxuICAgIC8qKuaVsOaNruWIneWni+WMliAqL1xuICAgIHByaXZhdGUgZGF0YUluaXQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0U2VydmVyID0gZmFsc2U7IFxuICAgIH1cbiAgICAvKirkuovku7bnu5HlrpogKi9cbiAgICBwcml2YXRlIGFkZEV2ZW50cygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5idG5fbG9naW4ub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Mb2dpbik7XG4gICAgICAgIHRoaXMuYnRuX3JlZ2lzdGVyLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uUmVnaXN0ZXIpO1xuICAgICAgICB0aGlzLmJ0bl90b0xvZ2luLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uVG9Mb2dpbik7XG4gICAgICAgIHRoaXMuYnRuX3RvUmVnaXN0ZXIub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Ub1JlZ2lzdGVyKVxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX1VTRVJfTE9HSU4sbmV3IFVzZXJMb2dpbkhhbmRsZXIodGhpcyx0aGlzLm9uTG9naW5IYW5kbGVyKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuYnRuX2xvZ2luLm9mZihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkxvZ2luKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMudW5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTX1VTRVJfTE9HSU4sdGhpcyk7XG4gICAgfVxuXG4gICAgLyoq5bGA5Lit5pi+56S6ICovXG4gICAgcHJpdmF0ZSBzZXRDZW50ZXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBjZW50ZXIgPSBUb29sLmdldENlbnRlclgoKTsvL+Wxj+W5lemrmOW6plxuICAgICAgICB0aGlzLnNwX3Byb2dyZXNzLnggPSBjZW50ZXI7XG4gICAgICAgIHRoaXMuc3BfZ2FtZU5hbWUueCA9IGNlbnRlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRBc3NldHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBzcmMgPSBbXG4gICAgICAgICAgICB7dXJsOlwidW5wYWNrYWdlL3dlbGNvbWUvYm94aW1nLnBuZ1wifSxcbiAgICAgICAgICAgIC8vanNvblxuICAgICAgICAgICAge3VybDpcIm91dHNpZGUvY29uZmlnL2dhbWVDb25maWcvZGVmZW5kZXIuanNvblwifSxcbiAgICAgICAgICAgIHt1cmw6XCJvdXRzaWRlL2NvbmZpZy9nYW1lQ29uZmlnL21vbnN0ZXIuanNvblwifSAgXG4gICAgICAgIF07XG4gICAgICAgIExheWEubG9hZGVyLmxvYWQoc3JjLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uTG9hZCksTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Qcm9jZXNzKSk7XG4gICAgfVxuXG4gICAgLyoq5Yqg6L296L+b56iLICovXG4gICAgcHJpdmF0ZSBvblByb2Nlc3MocHJvKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBwcm9Cb3ggPSB0aGlzLnNwX3Byb2dyZXNzO1xuICAgICAgICBsZXQgcHJvVyA9IHRoaXMuc3BfcHJvZ3Jlc3NXO1xuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xuICAgICAgICBwcm9XLndpZHRoID0gcHJvQm94LndpZHRoKnBybztcbiAgICAgICAgcHJvTC54ID0gcHJvQm94LndpZHRoKnBybztcbiAgICAgICAgaWYoIXRoaXMuaXNDb25uZWN0U2VydmVyKSB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLov5vluqbliqDovb0gXCIgKyBNYXRoLmZsb29yKHBybyoxMDApICsgXCIlICAgW+ato+WcqOi/nuaOpeacjeWKoeWZqOKApuKApl1cIjtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmnI3liqHlmajov57mjqXmiJDlip9dXCI7XG4gICAgfVxuXG4gICAgLyoq5Yqg6L295a6M5q+VICovXG4gICAgcHJpdmF0ZSBvbkxvYWQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIuWKoOi9veWujOavlei/m+WFpea4uOaIj1wiO1xuICAgICAgICBMYXlhLnRpbWVyLm9uY2UoODAwLHRoaXMsdGhpcy5zaG93TG9naW5Cb3gpO1xuICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMubmV3RmxvYXRNc2coKTtcbiAgICAgICAgLy/ojrflj5bphY3nva5cbiAgICAgICAgQ29uZmlnTWFuYWdlci5pbnMubG9hZENvbmZpZygpO1xuICAgIH1cblxuICAgIC8qKuaYvuekuueZu+W9leahhioqL1xuICAgIHByaXZhdGUgc2hvd0xvZ2luQm94KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwX2xvZ2luQm94LnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmFuaTEucGxheSgwLGZhbHNlKTtcbiAgICAgICAgdGhpcy5zcF9nYW1lTmFtZS54ID0gdGhpcy5zcF9sb2dpbkJveC53aWR0aCArIHRoaXMuc3BfZ2FtZU5hbWUud2lkdGgvMiArIDEwMDtcbiAgICAgICAgdGhpcy5zcF9wcm9ncmVzcy52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoq54K55Ye755m76ZmGICovXG4gICAgcHJpdmF0ZSBvbkxvZ2luKCkgOiB2b2lkXG4gICAge1xuICAgICAgICAvL0NsaWVudFNlbmRlci5yZXFVc2VyTG9naW4odGhpcy5pbnB1dF91c2VyTmFtZS50ZXh0LHRoaXMuaW5wdXRfdXNlcktleS50ZXh0KTtcbiAgICAgICAgdGhpcy5vd25QbGF5ZXI9bmV3IFBsYXllcihcIuW8oOS4iVwiLFwiZ2FtZUxvYmJ5L3BsYXllcl9pY29uLnBuZ1wiKTtcbiAgICAgICAgTGF5YS5TY2VuZS5vcGVuKFwiR2FtZUxvYmJ5L0dhbWVMb2JieS5zY2VuZVwiKTtcbiAgICB9XG5cbiAgICAvKirngrnlh7vms6jlhowgKi9cbiAgICBwcml2YXRlIG9uUmVnaXN0ZXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoq54K55Ye7IOW3suaciei0puWPtyAqL1xuICAgIHByaXZhdGUgb25Ub0xvZ2luKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwX3JlZ2lzdGVyQm94LnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvKirngrnlh7sg5rOo5YaMICovXG4gICAgcHJpdmF0ZSBvblRvUmVnaXN0ZXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIENsaWVudFNlbmRlci5yZXFVc2VyUmVnaXN0ZXIodGhpcy5pbnB1dF9yZWdpc3RlclVzZXJOYW1lLnRleHQsdGhpcy5pbnB1dF9yZWdpc3RlclVzZXJLZXkudGV4dCx0aGlzLmlucHV0X3JlZ2lzdGVyTmlja05hbWUudGV4dCk7ICAgICAgICBcbiAgICB9XG5cbiAgICAvKirojrflj5bliLDmtojmga8gKi9cbiAgICBwcml2YXRlIG9uTG9naW5IYW5kbGVyKGRhdGEpIDogdm9pZFxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIGlmKGRhdGEgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgbGV0IHRleHQgPSBcIueZu+mZhuaIkOWKn++8jOi/m+WFpea4uOaIj++8gVwiXG4gICAgICAgICAgICBpZih0aGlzLnNwX3JlZ2lzdGVyQm94LnZpc2libGUpIHRleHQgPSBcIuazqOWGjOaIkOWKn++8jOWwhuebtOaOpei/m+WFpea4uOaIj++8gVwiO1xuICAgICAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLnNob3dGbG9hdE1zZyh0ZXh0KTtcbiAgICAgICAgICAgIExheWEudGltZXIub25jZSgxMDAsdGhpcyx0aGlzLnRvR2FtZU1haW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoq6L+e5o6l5pyN5Yqh5ZmoICovXG4gICAgcHJpdmF0ZSBjb25uZWN0U2VydmVyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5jb25uZWN0KEdhbWVDb25maWcuSVAsR2FtZUNvbmZpZy5QT1JUKTtcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgcHJpdmF0ZSB0b0dhbWVNYWluKCkgOiB2b2lkXG4gICAge1xuICAgICAgICAvL1RPIERPIOi3s+i9rOiHs+a4uOaIj+Wkp+WOhVxuICAgICAgICBMYXlhLlNjZW5lLm9wZW4oXCJHYW1lTG9iYnkvR2FtZUxvYmJ5LnNjZW5lXCIpO1xuICAgIH1cbn0iLCJpbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvU29ja2V0SGFuZGxlclwiO1xuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcblxuLyoqXG4gKiDnlKjmiLfnmbvpmYbor7fmsYIg6L+U5Zue5aSE55CGXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVzZXJMb2dpbkhhbmRsZXIgZXh0ZW5kcyBTb2NrZXRIYW5kbGVye1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcbiAgICAgICAgc3VwZXIoY2FsbGVyLGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAgcHVibGljIGV4cGxhaW4oZGF0YSk6dm9pZFxuICAgIHtcbiAgICAgICAgdmFyIFJlc1VzZXJMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzVXNlckxvZ2luXCIpO1xuICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSBSZXNVc2VyTG9naW4uZGVjb2RlKGRhdGEpO1xuICAgICAgICBzdXBlci5leHBsYWluKG1lc3NhZ2UpO1xuICAgIH1cbiAgICAvKirlpITnkIbmlbDmja4gKi9cbiAgICBwcm90ZWN0ZWQgc3VjY2VzcyhtZXNzYWdlKTp2b2lkXG4gICAgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgc3VwZXIuc3VjY2VzcyhtZXNzYWdlKTtcbiAgICB9XG59XG4gICAgIiwiaW1wb3J0IERlZmVuZGVyQ29uZmlnIGZyb20gXCIuLi9EYXRhL0NvbmZpZy9EZWZlbmRlckNvbmZpZ1wiO1xuaW1wb3J0IE1vbnN0ZXJDb25maWcgZnJvbSBcIi4uL0RhdGEvQ29uZmlnL01vc250ZXJDb25maWdyXCI7XG5cbi8qKlxuICog6YWN572u5Yqg6L295ZmoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZ01hbmFnZXJ7XG4gICAgcHVibGljIHN0YXRpYyBpbnMgOiBDb25maWdNYW5hZ2VyID0gbmV3IENvbmZpZ01hbmFnZXIoKTtcbiAgICAvKipcbiAgICAgKiDpmLLlvqHloZTmgLvphY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmZW5kZXJDb25maWcgOiBhbnk7XG4gICAgLyoqXG4gICAgICog5oCq54mp5oC76YWN572uXG4gICAgICovXG4gICAgcHVibGljIG1vbnN0ZXJDb25maWcgOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YWN572u5rOo5YaMIFxuICAgICAqIFxuICAgICAqIDHjgIHlhpnkuItqc29u5ZCN5a2X77yM5a+55bqU55qEIOmFjee9ruexu1xuICAgICAqIFxuICAgICAqIOagh+ivhlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDbGFzcyhuYW1lLGRhdGEpIDogYW55XG4gICAge1xuICAgICAgICBzd2l0Y2gobmFtZSl7XG4gICAgICAgICAgICBjYXNlIFwiZGVmZW5kZXJcIjogcmV0dXJuIG5ldyBEZWZlbmRlckNvbmZpZyhkYXRhKTtcbiAgICAgICAgICAgIGNhc2UgXCJtb25zdGVyXCI6IHJldHVybiBuZXcgTW9uc3RlckNvbmZpZyhkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBKc29u6YWN572u6I635Y+WXG4gICAgICogXG4gICAgICog5YaZ6ZyA6KaB6I635Y+W55qE6YWN572u5paH5Lu2XG4gICAgICovXG4gICAgcHVibGljIGxvYWRDb25maWcoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHZhciBhcnI9W1xuICAgICAgICAgICAge1wiZGVmZW5kZXJcIjpcIm91dHNpZGUvY29uZmlnL2dhbWVDb25maWcvZGVmZW5kZXIuanNvblwifSxcbiAgICAgICAgICAgIHtcIm1vbnN0ZXJcIjpcIm91dHNpZGUvY29uZmlnL2dhbWVDb25maWcvbW9uc3Rlci5qc29uXCJ9XG4gICAgICAgIF07XG4gICAgICAgIHRoaXMubG9hZE9iaihhcnIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDotYTmupDliqDovb1cbiAgICAgKi9cbiAgICBwcml2YXRlIGxvYWRPYmooYXJyKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBvYmo7XG4gICAgICAgIGxldCBuYW1lO1xuICAgICAgICBmb3IobGV0IGk9MDtpPGFyci5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIG9iaiA9IGFycltpXTtcbiAgICAgICAgICAgIG5hbWUgPSBPYmplY3Qua2V5cyhvYmopWzBdO1xuICAgICAgICAgICAgdGhpc1tuYW1lK1wiQ29uZmlnXCJdID0gTGF5YS5sb2FkZXIuZ2V0UmVzKG9ialtuYW1lXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICog6I635Y+W6YWN572uIEBjb25maWdObWFlIDogSnNvbuaWh+S7tuWQjSAgQOaDs+iOt+WPluS7gOS5iOaAqueJqWlkXG4gICAgICovXG4gICAgcHVibGljIGdldENvbmZpZ0J5SWQoY29uZmlnTmFtZTpzdHJpbmcsY29uZmlnSWQpIDogYW55XG4gICAge1xuICAgICAgICBsZXQgY29uZmlnT2JqID0gdGhpc1tjb25maWdOYW1lICsgXCJDb25maWdcIl07XG4gICAgICAgIGxldCB0eXBlQXJyID0gW107XG4gICAgICAgIGZvcihsZXQgaT0wO2k8Y29uZmlnT2JqLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbGV0IG9iaiA9IGNvbmZpZ09ialtpXTtcbiAgICAgICAgICAgIGlmKG9ialtjb25maWdOYW1lICsgXCJJZFwiXSA9PSBjb25maWdJZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q2xhc3MoY29uZmlnTmFtZSxvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIOiOt+WPluacrOmFjee9ruaWh+S7tuWQq+acieeahOmhueaVsCBAY29uZmlnTm1hZSA6IEpzb27mlofku7blkI0gXG4gICAgICovXG4gICAgcHVibGljIGdldENvbmZpZ0xlbmd0aChjb25maWdOYW1lOnN0cmluZyk6bnVtYmVyXG4gICAge1xuICAgICAgICBsZXQgY29uZmlnT2JqID0gdGhpc1tjb25maWdOYW1lICsgXCJDb25maWdcIl07XG4gICAgICAgIHJldHVybiBjb25maWdPYmoubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOagueaNruexu+Wei+iOt+WPlumFjee9riAx6YeRMuacqDPmsLQ054GrNeWcn1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDb25maWdCeVR5cGUoY29uZmlnTmFtZTpzdHJpbmcsdHlwZU51bSkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBjb25maWdPYmogPSB0aGlzW2NvbmZpZ05hbWUgKyBcIkNvbmZpZ1wiXTtcbiAgICAgICAgbGV0IHR5cGVBcnIgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxjb25maWdPYmoubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBsZXQgb2JqID0gY29uZmlnT2JqW2ldO1xuICAgICAgICAgICAgaWYob2JqW1widHlwZVwiXSA9PSB0eXBlTnVtKXtcbiAgICAgICAgICAgICAgICB0eXBlQXJyLnB1c2godGhpcy5nZXRDbGFzcyhjb25maWdOYW1lLG9iaikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlQXJyO1xuICAgIH1cblxufSIsIi8qXG4qIOa4uOaIj+mFjee9rlxuKi9cbmV4cG9ydCBjbGFzcyBHYW1lQ29uZmlne1xuICAgIC8qKmlwKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIElQIDogc3RyaW5nID0gXCI0Ny4xMDcuMTY5LjI0NFwiO1xuICAgIC8qKuerr+WPoyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUE9SVCA6IG51bWJlciA9IDc3NzcgIDtcbiAgICAvLyAvKippcCAtIOacrOWcsOa1i+ivlSovXG4gICAgcHVibGljIHN0YXRpYyBJUCA6IHN0cmluZyA9IFwiMTI3LjAuMC4xXCI7XG4gICAgLy8gLyoq56uv5Y+jIC0g5pys5Zyw5rWL6K+VKi9cbiAgICBwdWJsaWMgc3RhdGljIFBPUlQgOiBudW1iZXIgPSA3Nzc3O1xuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLemFjee9ruexu+Weiy0tLS0tLS0tLS0tLVxuICAgIHB1YmxpYyBzdGF0aWMgQ09ORklHX05BTUVfTU9OU1RFUiA6IHN0cmluZyA9IFwibW9uc3RlclwiO1xuICAgIHB1YmxpYyBzdGF0aWMgQ09ORklHX05BTUVfREVGRU5ERVIgOiBzdHJpbmcgPSBcImRlZmVuZGVyXCI7XG4gICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0t5bGe5oCnIOexu+Weiy0tLS0tLS0tLS0tICAgXG4gICAgLyoq6YeRIDEgKi9cbiAgICBwdWJsaWMgc3RhdGljIFRZUEVfR09MRCA6IG51bWJlciA9IDEgO1xuICAgIC8qKuacqCAyICovXG4gICAgcHVibGljIHN0YXRpYyBUWVBFX1dPT0QgOiBudW1iZXIgPSAyO1xuICAgIC8qKuawtCAzKi9cbiAgICBwdWJsaWMgc3RhdGljIFRZUEVfV0FURVIgOiBudW1iZXIgPSAzO1xuICAgIC8qKueBqyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgVFlQRV9GSVJFIDogbnVtYmVyID0gNDtcbiAgICAvKirlnJ8qL1xuICAgIHB1YmxpYyBzdGF0aWMgVFlQRV9HUk9VTkQgOiBudW1iZXIgPSA1OyBcblxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICB9XG59XG5cbi8qKuWNj+iuriAqL1xuZXhwb3J0IGNsYXNzIFByb3RvY29se1xuICAgIC8vKioqKioqKioqKioqKioqKlVzZXJQcm90by5wcm90b1xuICAgIC8qKuivt+axgiBtc2dJZCA9IDEwMTEwMyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfTE9HSU4gOiBudW1iZXIgPSAxMDExMDM7XG4gICAgLyoqMTAxMTA0IOazqOWGjOivt+axgiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfUkVHSVNURVIgOiBudW1iZXIgPSAxMDExMDQ7XG5cbiAgICAvKirlk43lupQgbXNnSWQgPSAxMDEyMDMgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFU19VU0VSX0xPR0lOIDogbnVtYmVyID0gMTAxMjAzO1xuXG4gICAgXG4gICAgLy8qKioqKioqKioqKioqKioqTWF0Y2hQcm90by5wcm90b1xuICAgIC8qKuivt+axguWMuemFjeWvueWxgDEwMjEwMSAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVRX01BVENIOm51bWJlcj0xMDIxMDE7XG4gICAgLyoq6K+35rGCIOWvueWxgOaOpeWPlzEwMjEwMiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVRX01BVENIX0FDQ0VQVDpudW1iZXI9MTAyMTAyO1xuXG4gICAgLyoq5ZON5bqUIOi/lOWbnuWMuemFjeS/oeaBryDlj6rlj5HpgIHkuIDmrKFtc2dJZCA9IDEwMjIwMSAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTX01BVENIX0lORk8gOiBudW1iZXIgPSAxMDIyMDE7XG4gICAgLyoq5ZON5bqUIOi/lOWbnuWvueWxgOaOpeWPl+a2iOaBr21zZ0lkID0gMTAyMDIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFU19NQVRDSF9BQ0NFUFRfSU5GTyA6IG51bWJlciA9IDEwMjAyO1xuXG5cbiAgICAvLyoqKioqKioqKioqKioqKipHYW1lUHJvdG8ucHJvdG9cbiAgICAvKiror7fmsYLotYTmupDliqDovb3lrozmr5UgIOi/lOWbnjEwMzIwMSAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVRX09OTE9BRDpudW1iZXI9MTAzMjAxO1xuICAgIC8qKuivt+axguWcsOWbvuWekuWlvSDov5Tlm54xMDMyMDIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVBPVkVSOm51bWJlcj0xMDMyMDI7XG4gICAgLyoq5q+P5Zue5ZCI5oCq54mp5oqV5pS+5aW95LmL5ZCOIOaIluiAheaXtumXtOWIsOS6huivt+axguWujOaIkCAgMTAzMTAzKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9QVVRNT05TVEVST1ZFUjpudW1iZXI9MTAzMTAzO1xuXG4gICAgLyoq5b2T5omA5pyJ5Lq66YO95Yqg6L295aW95LqG5LmL5ZCO6L+U5Zue5ri45oiP5byA5aeL5raI5oGvIDEwMzIwMSAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTX09OTE9BRDpudW1iZXI9MTAzMjAxO1xuICAgIC8qKui/lOWbniDmiYDmnInnmoTlnLDlm77ot6/lvoTkv6Hmga8gMTAzMjAyICovXG4gICAgcHVibGljIHN0YXRpYyBSRVNfQUxMTUFQSU5GTzpudW1iZXI9MTAzMjAyO1xuICAgIC8qKui/lOWbnue7meWPjOaWue+8jOavj+WbnuWQiOeahOaAqueJqSAxMDMyMDMgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFU19NT05TVEVSSU5GTzpudW1iZXI9MTAzMjAzO1xuICAgIC8vIC8vKioqKioqKioqKioqZ21NZXNzYWdlLnByb3RvXG4gICAgLy8gLyoq5Y+R6YCBR03lr4bku6QgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9HTV9DT006bnVtYmVyID0gMTk5MTAxO1xuXG4gICAgLy8gLy8qKioqKioqKioqKip1c2VyTWVzc2FnZS5wcm90b1xuICAgIC8vIC8qKuazqOWGjCAyMDIxMDIqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfUkVHSVNURVI6bnVtYmVyID0gMjAyMTAyO1xuICAgIC8vIC8qKueZu+W9leivt+axgiAyMDIxMDMqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1VTRVJfTE9HSU46bnVtYmVyID0gMjAyMTAzO1xuXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKueZu+W9lei/lOWbniAyMDIyMDEqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9VU0VSX0xPR0lOOm51bWJlciA9IDIwMjIwMTtcbiAgICAvLyAvKirmnI3liqHlmajliJfooaggMjAyMjAzKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU0VSVkVSX0xJU1Q6bnVtYmVyID0gMjAyMjAzO1xuICAgIC8vIC8qKuWFrOWRiumdouadvyAyMDIyMDQqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9OT1RJQ0VfQk9BUkQ6bnVtYmVyID0gMjAyMjA0O1xuXG4gICAgLy8gLy8qKioqKioqKioqKipsb2dpbk1lc3NhZ2UucHJvdG9cbiAgICAvLyAvKirmnI3liqHlmajnmbvlvZXor7fmsYIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9TRVJWX0xPR0lOOm51bWJlciA9IDEwMTEwMTtcbiAgICAvLyAvKirlv4Pot7PljIXor7fmsYIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9TRVJWX0hFUlQ6bnVtYmVyID0gMTAxMTAyO1xuICAgIC8vIC8qKuivt+axguinkuiJsuS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0NSRUFURV9QTEFZRVI6bnVtYmVyID0gMTAxMTAzO1xuICAgIC8vIC8qKuacjeWKoeWZqOi/lOWbnioqKioqKioqKioqKiogKi9cbiAgICAvLyAvKirlv4Pot7Pov5Tlm54gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU0VSVl9IRVJUOm51bWJlciA9IDEwMTIwMTtcbiAgICAvLyAvKirov5Tlm57nmbvlvZXplJnor6/mtojmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU0VSVl9FUlJPUjpudW1iZXIgPSAxMDEyMDI7XG4gICAgLy8gLyoq6L+U5Zue6KKr6aG25LiL57q/ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1NVQlNUSVRVVEU6bnVtYmVyID0gMTAxMjAzO1xuXG5cblxuICAgIFxuICAgIC8vIC8vKioqKioqKioqKioqcGxheWVyTWVzc2FnZS5wcm90b1xuICAgIC8vIC8v6K+35rGCXG4gICAgLy8gLyoq6K+35rGC5omt6JuLIG1zZ0lkPTEwMjEwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0dBQ0hBOm51bWJlciA9IDEwMjEwMTtcblxuICAgIC8vIC8qKuacjeWKoeWZqOi/lOWbnioqKioqKioqKioqKiogKi9cbiAgICAvLyAvKirnmbvpmYbov5Tlm57op5LoibLln7rmnKzkv6Hmga8gIG1zZ0lkPTEwMjIwMSAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0lORk86bnVtYmVyID0gMTAyMjAxO1xuICAgIC8vIC8qKui/lOWbnuaTjeS9nOaIkOWKnyAgbXNnSWQ9MTAyMjAyICAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9PUFJFQVRFX1NVQ0NFU1M6bnVtYmVyID0gMTAyMjAyO1xuICAgIC8vIC8qKui/lOWbnuaTjeS9nOWksei0pSAgbXNnSWQ9MTAyMjAzICAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9PUFJFQVRFX0ZBSUw6bnVtYmVyID0gMTAyMjAzO1xuICAgIC8vIC8qKui/lOWbnuinkuiJsuWPkeeUn+WPmOWMluWQjueahOWxnuaAp+S/oeaBryjliJfooagpICBtc2dJZD0xMDIyMDQgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BMQVlFUl9BVFRSSUJVVEVfRVFVQUw6bnVtYmVyID0gMTAyMjA0O1xuICAgIC8vIC8qKui/lOWbnuinkuiJsuWPkeeUn+WPmOWMlueahOWxnuaAp+S/oeaBryjliJfooagpICBtc2dJZD0xMDIyMDUgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BMQVlFUl9BVFRSSUJVVEVfVVBEQVRFOm51bWJlciA9IDEwMjIwNTtcbiAgICAvLyAvKirov5Tlm57mia3om4sgbXNnSWQ9MTAyMjA2ICAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9HQUNIQTpudW1iZXIgPSAxMDIyMDY7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKnNraWxsTWVzc2FnZS5wcm90b1xuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3or7fmsYLmtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6K+35rGC5omA5pyJ5oqA6IO95L+h5oGvIG1zZ0lkPTEwNzEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0FMTF9TS0lMTF9JTkZPOm51bWJlciA9IDEwNzEwMTtcbiAgICAvLyAvKiror7fmsYLlh7rmiJjmioDog73kv6Hmga8gbXNnSWQ9MTA3MTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRklHSFRfU0tJTExfTElTVDpudW1iZXIgPSAxMDcxMDI7XG4gICAgLy8gLyoq6K+35rGC5Y2H57qn5oqA6IO9IG1zZ0lkPTEwNzEwM1x0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1VQX1NLSUxMOm51bWJlciA9IDEwNzEwMztcbiAgICAvLyAvKiror7fmsYLph43nva7mioDog70gbXNnSWQ9MTA3MTA0XHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA3MTA0O1xuICAgIC8vIC8qKuivt+axguaUueWPmOagvOWtkOaKgOiDvSBtc2dJZD0xMDcxMDVcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9BTFRFUl9HUklEX1NLSUxMOm51bWJlciA9IDEwNzEwNTtcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue5omA5pyJ5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MjAxO1xuICAgIC8vIC8qKui/lOWbnuWHuuaImOaKgOiDveS/oeaBryAgbXNnSWQ9MTA3MjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0ZJR0hUX1NLSUxMX0xJU1Q6bnVtYmVyID0gMTA3MjAyO1xuICAgIC8vIC8qKui/lOWbnuWNh+e6p+aKgOiDvSAgbXNnSWQ9MTA3MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1VQX1NLSUxMOm51bWJlciA9IDEwNzIwMztcbiAgICAvLyAvKirov5Tlm57ph43nva7mioDog73miJDlip/vvIzlrqLmiLfnq6/mlLbliLDmraTmtojmga/vvIzmnKzlnLDnp7vpmaTlhajpg6jmioDog70gIG1zZ0lkPTEwNzIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcyMDQ7XG4gICAgLy8gLyoq6L+U5Zue5pS55Y+Y5qC85a2Q5oqA6IO9ICBtc2dJZD0xMDcyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfQUxURVJfR1JJRF9TS0lMTDpudW1iZXIgPSAxMDcyMDU7XG5cblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIHBldE1lc3NhZ2VcbiAgICAvLyAvKiror7fmsYLlrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA1MjAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1JBTkRPTV9DUkVBVEU6bnVtYmVyID0gMTA1MTAxO1xuICAgIC8vIC8qKuivt+axguaUueWPmOS4iumYteWuoOeJqeS/oeaBryBtc2dJZD0xMDUxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQUxURVJfR1JJRDpudW1iZXIgPSAxMDUxMDI7XG4gICAgLy8gLyoq6K+35rGC5ZaC5a6g54mp5ZCD6aWtIG1zZ0lkPTEwNTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9GRUVEOm51bWJlciA9IDEwNTEwMztcbiAgICAvLyAvKiror7fmsYLlrqDnianlkIjmiJAgbXNnSWQ9MTA1MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0NPTVBPVU5EOm51bWJlciA9IDEwNTEwNDtcbiAgICAvLyAvKiror7fmsYLlrqDnianpoobmgp/mioDog70gbXNnSWQ9MTA1MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1NUVURZX1NLSUxMOm51bWJlciA9IDEwNTEwNjtcbiAgICAvLyAvKiror7fmsYLlrqDnianph43nva7mioDog70gbXNnSWQ9MTA1MTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA3ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNTEwNztcbiAgICAvLyAvKiror7fmsYLlrqDnianmioDog73ov5vpmLYgbXNnSWQ9MTA1MTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX1NLSUxMX1VQOm51bWJlciA9IDEwNTEwODtcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY0gbXNnSWQ9MTA1MTA5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA5ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElORzpudW1iZXIgPSAxMDUxMDk7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp6L+b5YyWIG1zZ0lkPTEwNTExMFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9FVk9MVkU6bnVtYmVyID0gMTA1MTEwO1xuICAgIC8vIC8qKuivt+axguWuoOeJqeWtteWMliBtc2dJZD0xMDUxMTFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfSEFUQ0g6bnVtYmVyID0gMTA1MTExO1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeeZu+iusCBtc2dJZD0xMDUxMTJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVHSVNURVI6bnVtYmVyID0gMTA1MTEyO1xuICAgIC8vIC8qKuivt+axguWuoOeJqeeUs+ivt+e5geihjSBtc2dJZD0xMDUxMTNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVRX01BVElORzpudW1iZXIgPSAxMDUxMTM7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5omA5pyJ5L+h5oGvIG1zZ0lkPTEwNTExNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNCDlpoLmnpzlrqDnianmnKzouqvmnInnmbvorrDmlbDmja7vvIzkvYbnuYHooY3mlbDmja7mib7kuI3liLDvvIjov5Tlm57mtojmga9tc2dJZD0xMDUyMTLlkoxtc2dJZD0xMDUyMTPmm7TmlrDlrqLmiLfnq6/mlbDmja7vvIkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX0FMTElORk86bnVtYmVyID0gMTA1MTE0O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUxMTVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTExNTtcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MTE2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE277yM5aaC5p6c5piv5ZCM5oSP77yM5a+55pa5546p5a625aaC5p6c5Zyo57q/77yM5Lya5pS25YiwbXNnSWQ9MTA1MjEw5raI5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElOR19DSE9PU0U6bnVtYmVyID0gMTA1MTE2O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUxMTdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNIOm51bWJlciA9IDEwNTExNztcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3nm67moIfmn6XnnIsgbXNnSWQ9MTA1MTE4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX01BVElOR19UQVJHRVRfTE9PSzpudW1iZXIgPSAxMDUxMTg7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp5pS+55SfIG1zZ0lkPTEwNTExOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9GUkVFOm51bWJlciA9IDEwNTExOTtcblxuXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57lrqDnianmiYDmnInkv6Hmga/vvIjnmbvlvZXmiJDlip/kuLvliqjov5Tlm57vvIltc2dJZD0xMDUyMDEqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfQUxMX0lORk86bnVtYmVyID0gMTA1MjAxO1xuICAgIC8vIC8vIOi/lOWbnuWuoOeJqeagvOWtkOS/oeaBryBtc2dJZD0xMDUyMDJcbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX0dSSURfSU5GTzpudW1iZXIgPSAxMDUyMDI7XG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5Yid5aeL5Yib5bu677yI5Yib5bu66KeS6Imy6I635b6X5Yid5aeL5a6g54mp77yJIG1zZ0lkPTEwNTIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9SQU5ET01fQ1JFQVRFOm51bWJlciA9IDEwNTIwMztcbiAgICAvLyAvKirov5Tlm57lrqDniannrYnnuqflkoznu4/pqozkv6Hmga/vvIjmraTmtojmga/lnKjlrqDniannu4/pqozlj5HnlJ/lj5jljJblsLHkvJrov5Tlm57nu5nlrqLmiLfnq6/vvIkgbXNnSWQ9MTA1MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0xWX0VYUF9JTkZPOm51bWJlciA9IDEwNTIwNDtcbiAgICAvLyAvKirov5Tlm57lrqDnianmioDog73nrYnnuqflkozmioDog73nu4/pqozkv6Hmga/vvIjmraTmtojmga/lnKjlrqDnianmioDog73nu4/pqozlj5HnlJ/lj5jljJblsLHkvJrov5Tlm57nu5nlrqLmiLfnq6/vvIkgbXNnSWQ9MTA1MjA1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NLSUxMX0xWX0VYUF9JTkZPOm51bWJlciA9IDEwNTIwNTtcbiAgICAvLyAvKirov5Tlm57lrqDnianpoobmgp/mioDog70gbXNnSWQ9MTA1MjA2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NUVURZX1NLSUxMOm51bWJlciA9IDEwNTIwNjtcbiAgICAvLyAvKirov5Tlm57lrqDnianph43nva7mioDog70gbXNnSWQ9MTA1MjA3ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNTIwNztcbiAgICAvLyAvKirov5Tlm57lrqDnianmioDog73ov5vpmLYgbXNnSWQ9MTA1MjA4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NLSUxMX1VQOm51bWJlciA9IDEwNTIwODtcblxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeS6pOmFjSBtc2dJZD0xMDUyMDkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HVDpudW1iZXIgPSAxMDUyMDk7XG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5aKe5Yqg57mB6KGN5qyh5pWwIG1zZ0lkPTEwNTIxMCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9BRERfTUFUSU5HX0NPVU5UOm51bWJlciA9IDEwNTIxMDtcbiAgICAvLyAvKirov5Tlm57lrqDnianov5vljJYgbXNnSWQ9MTA1MjExICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0VWT0xWRTpudW1iZXIgPSAxMDUyMTE7XG4gICAgLy8gLyoq6L+U5Zue5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTIxMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUyMTI7XG4gICAgLy8gLyoq6L+U5Zue5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTIxMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9SRVFfTUFUSU5HOm51bWJlciA9IDEwNTIxMztcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MjE0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX01BVElOR19BTExJTkZPOm51bWJlciA9IDEwNTIxNDtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MjE1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1NFTEVDVF9SRVFfTElTVDpudW1iZXIgPSAxMDUyMTU7XG4gICAgLy8gLyoq6L+U5Zue5a6g54mp57mB6KGN5ZCM5oSP5oiW5ouS57udIG1zZ0lkPTEwNTIxNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdfQ0hPT1NFOm51bWJlciA9IDEwNTIxNjtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3nm67moIfliLfmlrAgbXNnSWQ9MTA1MjE3ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX01BVElOR19UQVJHRVRfUkVGUkVTSDpudW1iZXIgPSAxMDUyMTc7XG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5pS+55SfIG1zZ0lkPTEwNTIxOCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9GUkVFOm51bWJlciA9IDEwNTIxODtcbiAgICBcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIGVxdWlwTWVzc2FnZVxuICAgIC8vIC8qKuivt+axguijheWkh+aJk+mAoCBtc2dJZD0xMDkxMDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9NQUtFOm51bWJlciA9IDEwOTEwMTtcbiAgICAvLyAvKiror7fmsYLoo4XlpIfliIbop6MgbXNnSWQ9MTA5MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfU1BMSVQ6bnVtYmVyID0gMTA5MTA2XG4gICAgLy8gLyoq6K+35rGC6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0xPQ0s6bnVtYmVyID0gMTA5MTA0O1xuICAgIC8vIC8qKuivt+axguijheWkh+W8uuWMliBtc2dJZD0xMDkxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9BVFRfQUREOm51bWJlciA9IDEwOTEwNTtcbiAgICAvLyAvKiror7fmsYLoo4XlpIfnqb/miLQgbXNnSWQ9MTA5MTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTE9BRElORzpudW1iZXIgPSAxMDkxMDI7XG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5Y246L29IG1zZ0lkPTEwOTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX1VOTE9BRElORzpudW1iZXIgPSAxMDkxMDM7XG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuijheWkh+aJk+mAoCBtc2dJZD0xMDkyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9NQUtFID0gMTA5MjAxO1xuICAgIC8vIC8qKui/lOWbnuijheWkh+WIhuinoyBtc2dJZD0xMDkyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9TUExJVCA9IDEwOTIwNjtcbiAgICAvLyAvKirov5Tlm57oo4XlpIflvLrljJYgbXNnSWQ9MTA5MjA1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfQVRUX0FERCA9IDEwOTIwNTtcbiAgICAvLyAvKirov5Tlm57oo4XlpIfnqb/miLQgbXNnSWQ9MTA5MjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfTE9BRElORyA9IDEwOTIwMjtcbiAgICAvLyAvKirov5Tlm57oo4XlpIfljbjovb0gbXNnSWQ9MTA5MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfVU5MT0FESU5HID0gMTA5MjAzO1xuICAgIC8vIC8qKui/lOWbnuijheWkh+mUgeWumuaIluino+mUgSBtc2dJZD0xMDkyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0NLID0gMTA5MjA0O1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogbWFwTWVzc2FnZVxuICAgIC8vIC8qKuivt+axguWcsOWbvuaZrumAmuaImOaWl++8iOWuouaIt+err+S4gOWcuuaImOaWl+e7k+adn+S5i+WQjuWPkemAgeatpOa2iOaBr++8jOWGjei/m+ihjOWAkuiuoeaXtuWSjOacrOWcsOWBh+aImOaWl++8iSBtc2dJZD0xMDYxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfTk9STUFMX0ZJR0hUOm51bWJlciA9IDEwNjEwMTtcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaHlv6vpgJ/miJjmlpcgbXNnSWQ9MTA2MTA0XHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NQRUVEX0ZJR0hUOm51bWJlciA9IDEwNjEwNDtcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaHmiavojaHmiJjmlpcgbXNnSWQ9MTA2MTA1XHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NXRUVQX0ZJR0hUOm51bWJlciA9IDEwNjEwNTtcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaHotK3kubDmiavojaEgbXNnSWQ9MTA2MTA2XHRcdC0tLS0t6L+U5Zue5raI5oGvIOi/lOWbnuaIkOWKn+a2iOaBr++8jGNvZGU9MTAwMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfQlVZX1NXRUVQOm51bWJlciA9IDEwNjEwNjtcbiAgICAvLyAvKiror7fmsYLlhbPljaHlgYfmiJjmlpfnu5PmnZ/pooblj5blpZblirEgbXNnSWQ9MTA2MTA5XHRcdC0tLS0t6L+U5Zue5raI5oGvIOi/lOWbnuaIkOWKn+a2iOaBr++8jGNvZGU9MTA2MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX05PUk1BTF9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTA5O1xuICAgIC8vIC8qKuivt+axguWRiuivieacjeWKoeWZqOaImOaWl+aSreaUvue7k+adn++8iOS7heS7heW6lOeUqOS6juaJgOacieecn+aImOaWl++8iSBtc2dJZD0xMDYxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDMqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1RSVUVfRklHSFRfRU5EOm51bWJlciA9IDEwNjEwMjtcbiAgICAvLyAvKiror7fmsYLlnLDlm77lhbPljaFib3Nz5oiY5paXIG1zZ0lkPTEwNjEwM1x0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9TQ0VORV9GSUdIVDpudW1iZXIgPSAxMDYxMDM7XG4gICAgLy8gLyoq6K+35rGC5YiH5o2i5Zyw5Zu+5YWz5Y2hIG1zZ0lkPTEwNjEwOFx0XHQtLS0tLei/lOWbnua2iOaBryDlia/mnKxpZOWSjOWFs+WNoWlkIOWxnuaAp+WPmOWMlua2iOaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9DSEFOR0VfU0NFTkU6bnVtYmVyID0gMTA2MTA4O1xuXG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuemu+e6v+WSjOaJq+iNoeaUtuebiuS/oeaBryBtc2dJZD0xMDYyMDIqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX09GRl9MSU5FX0FXQVJEX0lORk86bnVtYmVyID0gMTA2MjAyO1xuICAgIC8vIC8qKui/lOWbnuaImOaWl+aSreaUvue7k+adn+WPkeaUvuWlluWKse+8iOW6lOeUqOS6juaJgOacieaImOaWl++8iSBtc2dJZD0xMDYyMDMqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYyMDM7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBwYWNrTWVzc2FnZVxuICAgIC8vIC8qKuS9v+eUqOmBk+WFt+a2iOaBryAgbXNnSWQ9MTA0MTAxIOi/lOWbnuaTjeS9nOaIkOWKn+a2iOaBryAgbXNnSWQ9MTAyMjAyIGNvZGU9MTAwMDHvvIjmmoLlrprvvIzmoLnmja7lrp7pmYXkvb/nlKjmlYjmnpzlho3lgZrvvIkqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1VTRTpudW1iZXIgPSAxMDQxMDE7XG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuiDjOWMheWNleS4qumBk+WFt+WPmOWMluS/oeaBryAgbXNnSWQ9MTA0MjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUFJPUF9JTkZPOm51bWJlciA9IDEwNDIwMjtcbiAgICAvLyAvKirov5Tlm57og4zljIXmiYDmnInkv6Hmga/vvIjnmbvlvZXmiJDlip/kuLvliqjov5Tlm57vvIkgIG1zZ0lkPTEwNDIwMSjmnInlj6/og73kuLrnqbrliJfooagpKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QQUNLX0FMTF9JTkZPOm51bWJlciA9IDEwNDIwMTtcbiAgICAvLyAvKirov5Tlm57og4zljIXljZXkuKroo4XlpIflj5jljJbkv6Hmga8gbXNnSWQ9MTA0MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRVFVSVBfSU5GTzpudW1iZXIgPSAxMDQyMDM7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKioqIGZpZ2h0TWVzc2FnZVxuICAgIC8vIC8qKuivt+axguaJk+W8gOmCruS7tuiuvue9ruW3suivuyBtc2dJZD0xMTExMDEg5peg6L+U5Zue5raI5oGvIOWuouaIt+err+aJk+W8gOaXoOWlluWKsemCruS7tu+8jOiHquihjOiuvue9ruW3suivu+eKtuaAgSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX09QRU5fTUFJTDpudW1iZXIgPSAxMTExMDE7XG4gICAgLy8gLyoq6K+35rGC6aKG5Y+W6YKu5Lu25aWW5YqxIG1zZ0lkPTExMTEwMlx0XHQtLS0tLei/lOWbnua2iOaBryAgbXNnSWQ9MTExMjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFJTF9BV0FSRDpudW1iZXIgPSAxMTExMDI7XG4gICAgLy8gLyoq6K+35rGC5Yig6Zmk6YKu5Lu2IG1zZ0lkPTExMTEwM1x0XHQtLS0tLei/lOWbnua2iOaBryAgbXNnSWQ9MTExMjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFJTF9ERUxFVEU6bnVtYmVyID0gMTExMTAzO1xuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6YKu5Lu25L+h5oGvIG1zZ0lkPTExMTIwMe+8iOeZu+mZhuS4u+WKqOi/lOWbniDmiJbogIUg5Y+R55Sf5Y+Y5YyW6L+U5Zue77yJICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9JTkZPOm51bWJlciA9IDExMTIwMTtcbiAgICAvLyAvKirov5Tlm57pgq7ku7blt7Lpooblj5bmiJDlip8gbXNnSWQ9MTExMjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9BV0FSRDpudW1iZXIgPSAxMTEyMDI7XG4gICAgLy8gLyoq6L+U5Zue5Yig6Zmk6YKu5Lu25oiQ5YqfIG1zZ0lkPTExMTIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX01BSUxfREVMRVRFOm51bWJlciA9IDExMTIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqKiogZmlnaHRNZXNzYWdlXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57kuIDlnLrmiJjmlpfml6Xlv5cgbXNnSWQ9MTA4MjAxKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19UUlVFX0ZJR0hUX0xPR19JTkZPOm51bWJlciA9IDEwODIwMTtcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqKiogZnJpZW5kTWVzc2FnZVxuICAgIC8vIC8qKuivt+axguWlveWPi+aOqOiNkCBtc2dJZD0xMTIxMDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIxMDE7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5pCc57SiIG1zZ0lkPTExMjEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9TRUFSQ0g6bnVtYmVyID0gMTEyMTAyO1xuICAgIC8vIC8qKuivt+axguWlveWPi+eUs+ivtyBtc2dJZD0xMTIxMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfQVBQTFk6bnVtYmVyID0gMTEyMTAzO1xuICAgIC8vIC8qKuivt+axguWlveWPi+aTjeS9nCBtc2dJZD0xMTIxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjEwNDtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX01PUkVfSU5GTzpudW1iZXIgPSAxMTIxMDU7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L6YCB56S8IG1zZ0lkPTExMjEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9HSUZUOm51bWJlciA9IDExMjEwNlxuICAgIC8vIC8qKuivt+axguWlveWPi+aJgOacieS/oeaBryBtc2dJZD0xMTIxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfQWxsX0luZm86bnVtYmVyID0gMTEyMTA3O1xuICAgIC8vIC8qKuivt+axguWlveWPi+WIh+ejiyBtc2dJZD0xMTIxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDgyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfRklHSFQ6bnVtYmVyID0gMTEyMTA4O1xuXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57lpb3lj4vmjqjojZAgbXNnSWQ9MTEyMjAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX1BVU0g6bnVtYmVyID0gMTEyMjAxO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+aQnOe0oiBtc2dJZD0xMTIyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfU0VBUkNIOm51bWJlciA9IDExMjIwMjtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vnlLPor7cgbXNnSWQ9MTEyMjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX0FQUExZOm51bWJlciA9IDExMjIwMztcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmk43kvZwgbXNnSWQ9MTEyMjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX09QRVJBVElPTjpudW1iZXIgPSAxMTIyMDQ7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L6K+m57uG5L+h5oGvIG1zZ0lkPTExMjIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9NT1JFX0lORk86bnVtYmVyID0gMTEyMjA1O1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+mAgeekvCBtc2dJZD0xMTIyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfR0lGVDpudW1iZXIgPSAxMTIyMDY7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjIwNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9BTExfSU5GTzpudW1iZXIgPSAxMTIyMDc7ICAgIFxuXG59IiwiaW1wb3J0IEZsb2F0TXNnIGZyb20gXCIuLi9Ub29sL0Zsb2F0TXNnXCI7XG5pbXBvcnQgVG9vbCBmcm9tIFwiLi4vVG9vbC9Ub29sXCI7XG5cbi8qKlxuICog5raI5oGv5pi+56S6566h55CG5ZmoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lc3NhZ2VNYW5hZ2VyIHtcbiAgICAvKirljZXkvosgKi9cbiAgICBwdWJsaWMgc3RhdGljIGlucyA6IE1lc3NhZ2VNYW5hZ2VyID0gbmV3IE1lc3NhZ2VNYW5hZ2VyO1xuICAgIC8qKuWxj+W5leaLpeacieeahOa1ruWKqOa2iOaBr+iuoeaVsCovXG4gICAgcHVibGljIGNvdW50RmxvYXRNc2cgOiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5jb3VudEZsb2F0TXNnID0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmta7liqjmtojmga/pooTng60s77yM5o+Q5YmN5paw5bu65LiA5LiqZmxvYXRcbiAgICAgKi9cbiAgICBwdWJsaWMgbmV3RmxvYXRNc2coKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGxldCBmbG9hdE1zZyA9IG5ldyBGbG9hdE1zZygpO1xuICAgICAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZsb2F0TXNnKTtcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJGbG9hdE1zZ1wiLGZsb2F0TXNnKTsgXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pi+56S65rWu5Yqo5raI5oGvXG4gICAgICogQHBhcmFtIHRleHQgIOaYvuekuua2iOaBr1xuICAgICAqL1xuICAgIHB1YmxpYyBzaG93RmxvYXRNc2codGV4dDpzdHJpbmcpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGZsb2F0TXNnIDogRmxvYXRNc2cgPSBMYXlhLlBvb2wuZ2V0SXRlbShcIkZsb2F0TXNnXCIpO1xuICAgICAgICBpZihMYXlhLlBvb2wuZ2V0UG9vbEJ5U2lnbihcIkZsb2F0TXNnXCIpLmxlbmd0aCA9PSAwKSB0aGlzLm5ld0Zsb2F0TXNnKCk7XG4gICAgICAgIGlmKGZsb2F0TXNnICA9PT0gbnVsbClcbiAgICAgICAge1xuICAgICAgICAgICAgZmxvYXRNc2cgPSBuZXcgRmxvYXRNc2coKTtcbiAgICAgICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmxvYXRNc2cpOyAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgZmxvYXRNc2cuek9yZGVyID0gMTAwICsgdGhpcy5jb3VudEZsb2F0TXNnO1xuICAgICAgICBjb25zb2xlLmxvZyhUb29sLmdldENlbnRlclgoKSk7XG4gICAgICAgIGZsb2F0TXNnLnNob3dNc2codGV4dCx7eDpUb29sLmdldENlbnRlclgoKSArIHRoaXMuY291bnRGbG9hdE1zZyoyMCx5OiAzNzUgKyB0aGlzLmNvdW50RmxvYXRNc2cqMjB9KTtcbiAgICAgICAgdGhpcy5jb3VudEZsb2F0TXNnKys7XG4gICAgfVxuXG59IiwiaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4vV2ViU29ja2V0TWFuYWdlclwiO1xuaW1wb3J0IHsgUHJvdG9jb2wgfSBmcm9tIFwiLi4vQ29uc3QvR2FtZUNvbmZpZ1wiO1xuXG4vKlxuKiDlrqLmiLfnq6/lj5HpgIHlmahcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTZW5kZXJ7XG4gICAgXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgXG4gICAgfVxuICAgIC8vKioqKioqKioqKioqKioqKlVzZXJQcm90by5wcm90b1xuICAgIC8qKlxuICAgICog55So5oi355m75b2VIDEwMTEwM1xuICAgICogQHBhcmFtIHVzZXJOYW1lIFxuICAgICogQHBhcmFtIHVzZXJQYXNzIFxuICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXFVc2VyTG9naW4odXNlck5hbWU6c3RyaW5nLHVzZXJLZXk6c3RyaW5nKTp2b2lkXG4gICAge1xuICAgICAgICB2YXIgUmVxVXNlckxvZ2luOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVc2VyTG9naW5cIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICBtZXNzYWdlLnVzZXJOYW1lID0gdXNlck5hbWU7XG4gICAgICAgIG1lc3NhZ2UudXNlcktleSA9IHVzZXJLZXk7XG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyTG9naW4uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX0xPR0lOLGJ1ZmZlcik7XG4gICAgfVxuICAgIFxuICAgICAgICAgICAgXG4gICAgLyoqXG4gICAgICog55So5oi35rOo5YaMIDEwMTEwNFxuICAgICAqIEBwYXJhbSB1c2VyTmFtZSBcbiAgICAqIEBwYXJhbSB1c2VyUGFzcyBcbiAgICAqIEBwYXJhbSB1c2VyTmlja05hbWVcbiAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVxVXNlclJlZ2lzdGVyKHVzZXJOYW1lOnN0cmluZyx1c2VyS2V5OnN0cmluZyx1c2VyTmlja05hbWU6c3RyaW5nKTp2b2lkXG4gICAge1xuICAgICAgICB2YXIgUmVxVXNlclJlZ2lzdGVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVc2VyUmVnaXN0ZXJcIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICB2YXIgdXNlckRhdGE6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbiAgICAgICAgbWVzc2FnZS51c2VyS2V5ID0gdXNlcktleTtcbiAgICAgICAgdXNlckRhdGEubmlja05hbWUgPSB1c2VyTmlja05hbWU7XG4gICAgICAgIHVzZXJEYXRhLmx2ID0gMTtcbiAgICAgICAgbWVzc2FnZS51c2VyRGF0YSA9IHVzZXJEYXRhO1xuICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXNlclJlZ2lzdGVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFUl9SRUdJU1RFUixidWZmZXIpO1xuICAgIH1cblxuXG4gICAgLy8qKioqKioqKioqKioqKioqTWF0Y2hQcm90by5wcm90b1xuICAgIC8qKlxuICAgICAqIOivt+axguWMuemFjeWvueWxgCAxMDIxMDFcbiAgICAgKiBAcGFyYW0gdXNlcklkIFxuICAgICogQHBhcmFtIG1hdGNoSWQgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcU1hdGNoKHVzZXJJZDpudW1iZXIsbWF0Y2hJZDpudW1iZXIpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFNYXRjaDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWF0Y2hcIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgbWVzc2FnZS5tYXRjaElkID0gbWF0Y2hJZDtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1hdGNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0gsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDor7fmsYIg5a+55bGA5o6l5Y+XIOi/lOWbnjEwMjIwMlxuICAgICAqIEBwYXJhbSB1c2VySWQgXG4gICAgKiBAcGFyYW0gaXNBY2NlcHRlIFxuICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXFNYXRjaEFjY2VwdCh1c2VySWQ6bnVtYmVyLGlzQWNjZXB0ZTpudW1iZXIpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFNYXRjaEFjY2VwdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWF0Y2hBY2NlcHRcIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgbWVzc2FnZS5pc0FjY2VwdGUgPSBpc0FjY2VwdGU7XG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXRjaEFjY2VwdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BVENIX0FDQ0VQVCxidWZmZXIpO1xuICAgIH1cbiAgICBcblxuICAgIC8vKioqKioqKioqKioqKioqKkdhbWVQcm90by5wcm90b1xuICAgIC8qKlxuICAgICAqIOivt+axgui1hOa6kOWKoOi9veWujOavlSDov5Tlm54xMDMyMDFcbiAgICAgKiBAcGFyYW0gdXNlcklkIFxuICAgICogQHBhcmFtIGlzQWNjZXB0ZSBcbiAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVxT25Mb2FkKHVzZXJJZDpudW1iZXIpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFPbkxvYWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU9uTG9hZFwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlcklkID0gdXNlcklkO1xuICAgICAgICB2YXIgYnVmZmVyID0gUmVxT25Mb2FkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfT05MT0FELGJ1ZmZlcik7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIOivt+axgui1hOa6kOWKoOi9veWujOavlSDov5Tlm54xMDMyMDJcbiAgICAgKiBAcGFyYW0gdXNlcklkIFxuICAgICogQHBhcmFtIGlzQWNjZXB0ZSBcbiAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwT3Zlcih1c2VySWQ6bnVtYmVyLHN0YXR1czpudW1iZXIsbWFwQ2h1bmtMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFNYXBPdmVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXBPdmVyXCIpO1xuICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAgICAgbWVzc2FnZS51c2VySWQgPSB1c2VySWQ7XG4gICAgICAgIG1lc3NhZ2Uuc3RhdHVzID0gc3RhdHVzO1xuICAgICAgICBtZXNzYWdlLm1hcENodW5rTGlzdD1tYXBDaHVua0xpc3Q7XG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBPdmVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQT1ZFUixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOavj+WbnuWQiOaAqueJqeaKleaUvuWlveS5i+WQjiDmiJbogIXml7bpl7TliLDkuobor7fmsYLlrozmiJAg6L+U5ZueMTAzMTAzXG4gICAgICogQHBhcmFtIHVzZXJJZCBcbiAgICAqIEBwYXJhbSBpc0FjY2VwdGUgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcVB1dE1vbnN0ZXJPdmVyKHVzZXJJZDpudW1iZXIsbW9uc3Rlckxpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuICAgIHtcbiAgICAgICAgdmFyIFJlcVB1dE1vbnN0ZXJPdmVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQdXRNb25zdGVyT3ZlclwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlcklkID0gdXNlcklkO1xuICAgICAgICBtZXNzYWdlLm1vbnN0ZXJMaXN0PW1vbnN0ZXJMaXN0O1xuICAgICAgICB2YXIgYnVmZmVyID0gUmVxUHV0TW9uc3Rlck92ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QVVRNT05TVEVST1ZFUixidWZmZXIpO1xuICAgIH1cbiAgICAvKioq5raI5oGv5Y+R6YCBKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqd2ViU29ja2V0ICovXG4gICAgLyoq5Y+R6YCBR03lr4bku6QgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUdtTXNnKGdtOnN0cmluZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUdNQ29tbTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxR01Db21tXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5jb21tID0gZ207XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFHTUNvbW0uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9HTV9DT00sYnVmZmVyKTtcbi8vICAgICB9XG5cbi8vICAgICAvKirlv4Pot7PljIUgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHNlcnZIZWFydFJlcSgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1NFUlZfSEVSVCk7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOeUqOaIt+azqOWGjFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJSZXEodXNlck5hbWU6c3RyaW5nLHVzZXJQYXNzOnN0cmluZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVJlZ2lzdGVyVXNlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUmVnaXN0ZXJVc2VyXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xuLy8gICAgICAgICBtZXNzYWdlLnVzZXJQYXNzID0gdXNlclBhc3M7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFSZWdpc3RlclVzZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOeZu+W9leacjeWKoeWZqFxuLy8gICAgICAqIEBwYXJhbSB0b2tlbiBcbi8vICAgICAgKiBAcGFyYW0gc2VydklkIFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgbG9naW5TZXJ2UmVxKHNlcnZJZDpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFMb2dpbjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTG9naW5cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLmNvZGUgPSBHYW1lRGF0YU1hbmFnZXIuaW5zLmxvZ2luQXV0aGVudGljYXRpb247XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2VydmVySWQgPSBzZXJ2SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuYWdlbnRJZCA9IDE7XG4vLyAgICAgICAgIG1lc3NhZ2UuY2xpZW50SWQgPSAxO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTG9naW4uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9TRVJWX0xPR0lOLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOWIm+W7uuinkuiJslxuLy8gICAgICAqIEBwYXJhbSBzZXggXG4vLyAgICAgICogQHBhcmFtIHBsYXllck5hbWUgXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBjcmVhdGVQbGF5ZXJSZXEoc2V4Om51bWJlcixwbGF5ZXJOYW1lOnN0cmluZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUNyZWF0ZVBsYXllcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxQ3JlYXRlUGxheWVyXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5nZW5kZXIgPSBzZXg7XG4vLyAgICAgICAgIG1lc3NhZ2UucGxheWVyTmFtZSA9IHBsYXllck5hbWU7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFDcmVhdGVQbGF5ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9DUkVBVEVfUExBWUVSLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLmiYDmnInmioDog73kv6Hmga8gKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUFsbFNraWxsSW5mbygpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0FMTF9TS0lMTF9JTkZPKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Ye65oiY5oqA6IO95L+h5oGvICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFGaWdodFNraWxsTGlzdCgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZJR0hUX1NLSUxMX0xJU1QpOyAgIFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLljYfnuqfmioDog70gKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVVwU2tpbGwoc2tpbGxVcEx2Vm9zOkFycmF5PFNraWxsVXBMdlZvPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVVwU2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVwU2tpbGxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnNraWxsTGlzdCA9IFtdO1xuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XG4vLyAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBza2lsbFVwTHZWb3MubGVuZ3RoO2krKylcbi8vICAgICAgICAge1xuLy8gICAgICAgICAgICAgaW5mbyA9IHt9O1xuLy8gICAgICAgICAgICAgaW5mby5za2lsbElkID0gc2tpbGxVcEx2Vm9zW2ldLnNraWxsSWQ7XG4vLyAgICAgICAgICAgICBpbmZvLnRvU2tpbGxJZCA9IHNraWxsVXBMdlZvc1tpXS50b1NraWxsSWQ7XG4vLyAgICAgICAgICAgICBtZXNzYWdlLnNraWxsTGlzdC5wdXNoKGluZm8pO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFVcFNraWxsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVBfU0tJTEwsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axgumHjee9ruaKgOiDvSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUmVzZXRTa2lsbCgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1JFU0VUX1NLSUxMKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5L2/55So6YGT5YW3ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFVc2UocHJvcElkOkxvbmcsbnVtOm51bWJlcixhcmdzPzpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFVc2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkO1xuLy8gICAgICAgICBtZXNzYWdlLm51bSA9IG51bTtcbi8vICAgICAgICAgaWYoYXJncylcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuYXJncyA9IGFyZ3M7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0UsYnVmZmVyKTsgIFxuLy8gICAgIH1cbiAgICBcbi8vICAgICAvKiror7fmsYLlrqDnianlkIjmiJAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldENvbXBvdW5kKHByb3BJZDpMb25nKVxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldENvbXBvdW5kOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRDb21wb3VuZFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0Q29tcG91bmQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfQ09NUE9VTkQsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG4vLyAgICAgLyoq6K+35rGC5ZaC5a6g54mp5ZCD6aWtKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEZlZWQocGV0SWQ6TG9uZyxwcm9wTGlzdDpBcnJheTxQcm9wVm8+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0RmVlZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0RmVlZFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wTGlzdCA9IHByb3BMaXN0O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0RmVlZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9GRUVELGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuXG4vLyAgICAgLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFBbHRlckdyaWRTa2lsbCh0eXBlOm51bWJlcixza2lsbFVwR3JpZDpTa2lsbFVwR3JpZFZvKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxQWx0ZXJHcmlkU2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUFsdGVyR3JpZFNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTsgICAgICAgIFxuLy8gICAgICAgICB2YXIgdm86YW55ID0ge307XG4vLyAgICAgICAgIHZvLmdyaWRJZCA9IHNraWxsVXBHcmlkLmdyaWRJZDtcbi8vICAgICAgICAgdm8uc2tpbGxJZCA9IHNraWxsVXBHcmlkLnNraWxsSWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZ3JpZCA9IHZvOyAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFBbHRlckdyaWRTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7ICAgICAgICBcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfQUxURVJfR1JJRF9TS0lMTCxidWZmZXIpOyAgIFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLmlLnlj5jlrqDnianpmLXlnovmoLzlrZAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEFsdGVyR3JpZCh0eXBlOm51bWJlcixncmlkTGlzdDpBcnJheTxMaW5ldXBHcmlkVm8+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0QWx0ZXJHcmlkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRBbHRlckdyaWRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlO1xuLy8gICAgICAgICBtZXNzYWdlLmdyaWRMaXN0ID0gW107XG4vLyAgICAgICAgIHZhciBpbmZvOmFueTtcbi8vICAgICAgICAgZm9yKHZhciBpID0gMDtpIDwgZ3JpZExpc3QubGVuZ3RoO2krKylcbi8vICAgICAgICAge1xuLy8gICAgICAgICAgICAgaW5mbyA9IHt9O1xuLy8gICAgICAgICAgICAgaW5mby5ncmlkSWQgPSBncmlkTGlzdFtpXS5ncmlkSWQ7XG4vLyAgICAgICAgICAgICBpbmZvLnBldElkID0gZ3JpZExpc3RbaV0uaGVyb0lkO1xuLy8gICAgICAgICAgICAgbWVzc2FnZS5ncmlkTGlzdC5wdXNoKGluZm8pO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRBbHRlckdyaWQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfQUxURVJfR1JJRCxidWZmZXIpOyAgIFxuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLmia3om4sgbXNnSWQ9MTAyMTAxXG4vLyAgICAgICogQHBhcmFtIG1vbmV5VHlwZSAvLyDmia3om4vnsbvlnosgMD3ph5HluIHmir0gMT3pkrvnn7Pmir1cbi8vICAgICAgKiBAcGFyYW0gbnVtVHlwZSDmrKHmlbDnsbvlnosgMD3lhY3otLnljZXmir0gMT3ljZXmir0gMj3ljYHov57mir1cbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUdhY2hhKG1vbmV5VHlwZTpudW1iZXIsbnVtVHlwZTpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFHYWNoYTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxR2FjaGFcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSBtb25leVR5cGU7XG4vLyAgICAgICAgIG1lc3NhZ2UubnVtVHlwZSA9IG51bVR5cGU7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFHYWNoYS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0dBQ0hBLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgICAvKiror7fmsYLlnLDlm77lhbPljaHlv6vpgJ/miJjmlpcgKi9cbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTcGVlZEZpZ2h0KCk6dm9pZFxuLy8gICAgICB7XG4vLyAgICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfU1BFRURfRklHSFQpO1xuLy8gICAgICB9XG5cbi8vICAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h6LSt5Lmw5omr6I2hICovXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwQnV5U3dlZXAoKTp2b2lkXG4vLyAgICAgIHtcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9CVVlfU1dFRVApO1xuLy8gICAgICB9ICAgXG5cbi8vICAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h5omr6I2hICAqL1xuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcFN3ZWVwRmlnaHQoc2NlbmVJZDpudW1iZXIpOnZvaWRcbi8vICAgICAge1xuLy8gICAgICAgICAgdmFyICBSZXFNYXBTd2VlcEZpZ2h0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXBTd2VlcEZpZ2h0XCIpO1xuLy8gICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgICBtZXNzYWdlLnNjZW5lSWQgPSBzY2VuZUlkO1xuLy8gICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1hcFN3ZWVwRmlnaHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NXRUVQX0ZJR0hULGJ1ZmZlcik7XG4vLyAgICAgIH1cblxuLy8gICAgIC8qKumaj+acuuWIm+W7uuS4gOadoem+mSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0UmFuZG9tQ3JlYXRlKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1JBTkRPTV9DUkVBVEUpO1xuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlnLDlm77mma7pgJrmiJjmlpfvvIjlrqLmiLfnq6/kuIDlnLrmiJjmlpfnu5PmnZ/kuYvlkI7lj5HpgIHmraTmtojmga/vvIzlho3ov5vooYzlgJLorqHml7blkozmnKzlnLDlgYfmiJjmlpfvvIkgbXNnSWQ9MTA2MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAxICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBOb3JtYWxGaWdodCgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9OT1JNQUxfRklHSFQpO1xuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlhbPljaHlgYfmiJjmlpfnu5PmnZ/pooblj5blpZblirEgbXNnSWQ9MTA2MTA5XHRcdC0tLS0t6L+U5Zue5raI5oGvIOi/lOWbnuaIkOWKn+a2iOaBr++8jGNvZGU9MTA2MjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBOb3JtYWxGaWdodEVuZCgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9OT1JNQUxfRklHSFRfRU5EKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2hYm9zc+aImOaWlyBtc2dJZD0xMDYxMDNcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDQgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcFNjZW5lRmlnaHQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfU0NFTkVfRklHSFQpO1xuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlkYror4nmnI3liqHlmajmiJjmlpfmkq3mlL7nu5PmnZ/vvIjku4Xku4XlupTnlKjkuo7miYDmnInnnJ/miJjmlpfvvIkgbXNnSWQ9MTA2MTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFUdXJlRmlnaHRFbmQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9UUlVFX0ZJR0hUX0VORCk7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWIh+aNouWcsOWbvuWFs+WNoSBtc2dJZD0xMDYxMDhcdFx0LS0tLS3ov5Tlm57mtojmga8g5Ymv5pysaWTlkozlhbPljaFpZCDlsZ7mgKflj5jljJbmtojmga9cbi8vICAgICAgKiBAcGFyYW0gc2NlbmVJZCBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcENoYW5nZVNjZW5lKHNjZW5lSWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTWFwQ2hhbmdlU2NlbmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1hcENoYW5nZVNjZW5lXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5zY2VuZUlkID0gc2NlbmVJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1hcENoYW5nZVNjZW5lLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX0NIQU5HRV9TQ0VORSxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniankuqTphY0gbXNnSWQ9MTA1MTA5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA5XG4vLyAgICAgICogQHBhcmFtIHBldElkMSBcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQyIFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nKHBldElkMTpMb25nLHBldElkMjpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkMSA9IHBldElkMTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZDIgPSBwZXRJZDI7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRNYXRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqei/m+WMliBtc2dJZD0xMDUxMTBcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTFcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQxIOi/m+WMluWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIGJlUGV0SWRMaXN0IOa2iOiAl+WuoOeJqWlk5YiX6KGoXG4vLyAgICAgICogQHBhcmFtIHByb3BJZCDmtojogJfpgZPlhbfllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSBwcm9wTnVtIOa2iOiAl+mBk+WFt+aVsOmHj1xuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RXZvbHZlKHBldElkOkxvbmcsYmVQZXRJZExpc3Q6QXJyYXk8TG9uZz4scHJvcElkTGlzdDpBcnJheTxMb25nPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEV2b2x2ZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0RXZvbHZlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBpZihiZVBldElkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5iZVBldElkTGlzdCA9IGJlUGV0SWRMaXN0O1xuLy8gICAgICAgICBpZihwcm9wSWRMaXN0Lmxlbmd0aCA+IDApXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnByb3BJZExpc3QgPSBwcm9wSWRMaXN0O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0RXZvbHZlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0VWT0xWRSxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDnianlrbXljJYgbXNnSWQ9MTA1MTExXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjAzXG4vLyAgICAgICogQHBhcmFtIGVnZ0lkIOWuoOeJqeibi+WUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRIYXRjaChlZ2dJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0SGF0Y2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEhhdGNoXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5lZ2dJZCA9IGVnZ0lkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0SGF0Y2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfSEFUQ0gsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTExMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMlxuLy8gICAgICAqIEBwYXJhbSBlZ2dJZCDlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWQg6ZyA6KaB5ZOB6LSo5p2h5Lu2aWQoMOihqOekuuS4jemZkOWItilcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJlZ2lzdGVyKHBldElkOkxvbmcscXVhbGl0eUlkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFJlZ2lzdGVyOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRSZWdpc3RlclwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWQgPSBxdWFsaXR5SWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRSZWdpc3Rlci5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRUdJU1RFUixidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MTEzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjEzXG4vLyAgICAgICogQHBhcmFtIHBldElkIOivt+axguaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIHRvUGV0SWQg5o6l5pS25pa55a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJlcU1hdGluZyhwZXRJZDpMb25nLHRvUGV0SWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFJlcU1hdGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVxTWF0aW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGV0SWQgPSB0b1BldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVxTWF0aW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1JFUV9NQVRJTkcsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN5omA5pyJ5L+h5oGvIG1zZ0lkPTEwNTExNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNFxuLy8gICAgICAqIEBwYXJhbSBwZXRUeXBlICAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGNvbmZpZ0lkIOWuoOeJqemFjee9rmlk77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gZ2VuZGVyICDlrqDnianmgKfliKvvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBxdWFsaXR5SWRMaXN0IOWuoOeJqeWTgei0qGlk77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ0FsbEluZm8ocGV0VHlwZTpudW1iZXIsY29uZmlnSWQ6bnVtYmVyLGdlbmRlcjpudW1iZXIscXVhbGl0eUlkTGlzdDpBcnJheTxudW1iZXI+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nQWxsSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nQWxsSW5mb1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0VHlwZSA9IHBldFR5cGU7XG4vLyAgICAgICAgIG1lc3NhZ2UuY29uZmlnSWQgPSBjb25maWdJZDtcbi8vICAgICAgICAgbWVzc2FnZS5nZW5kZXIgPSBnZW5kZXI7XG4vLyAgICAgICAgIGlmKHF1YWxpdHlJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2UucXVhbGl0eUlkTGlzdCA9IHF1YWxpdHlJZExpc3Q7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRNYXRpbmdBbGxJbmZvLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19BTExJTkZPLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUxMTVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTVcbi8vICAgICAgKiBAcGFyYW0gcGV0SWQg5a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFNlbGVjdFJlcUxpc3QocGV0SWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFNlbGVjdFJlcUxpc3Q6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFNlbGVjdFJlcUxpc3RcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRTZWxlY3RSZXFMaXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NFTEVDVF9SRVFfTElTVCxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MTE2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE277yM5aaC5p6c5piv5ZCM5oSP77yM5a+55pa5546p5a625aaC5p6c5Zyo57q/77yM5Lya5pS25YiwbXNnSWQ9MTA1MjEw5raI5oGvXG4vLyAgICAgICogQHBhcmFtIHBldElkIOaIkeaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIHRvUGV0SWQg5a+55pa55a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gaXNDb25zZW50IOaYr+WQpuWQjOaEjyB0cnVlPeWQjOaEj1xuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nQ2hvb3NlKHBldElkOkxvbmcsdG9QZXRJZDpMb25nLGlzQ29uc2VudDpib29sZWFuKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0TWF0aW5nQ2hvb3NlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdDaG9vc2VcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QZXRJZCA9IHRvUGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuaXNDb25zZW50ID0gaXNDb25zZW50O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQ2hvb3NlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElOR19DSE9PU0UsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN55uu5qCH5Yi35pawIG1zZ0lkPTEwNTExN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxN1xuLy8gICAgICAqIEBwYXJhbSBwZXRUeXBlIDE95Yqf77yMMj3pmLLvvIwzPemAn++8jDQ96KGA77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gY29uZmlnSWQg5a6g54mp6YWN572uaWTvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBnZW5kZXIg5a6g54mp5oCn5Yir77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkTGlzdCDlrqDnianlk4HotKhpZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoKHBldFR5cGU6bnVtYmVyLGNvbmZpZ0lkOm51bWJlcixnZW5kZXI6bnVtYmVyLHF1YWxpdHlJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2hcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldFR5cGUgPSBwZXRUeXBlO1xuLy8gICAgICAgICBtZXNzYWdlLmNvbmZpZ0lkID0gY29uZmlnSWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gZ2VuZGVyO1xuLy8gICAgICAgICBpZihxdWFsaXR5SWRMaXN0Lmxlbmd0aCA+IDApXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZExpc3QgPSBxdWFsaXR5SWRMaXN0O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nVGFyZ2V0UmVmcmVzaC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0gsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN55uu5qCH5p+l55yLIG1zZ0lkPTEwNTExOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOFxuLy8gICAgICAqIEBwYXJhbSB0b1BsYXllcklkIOiiq+afpeeci+WuoOeJqeeahOS4u+S6uueahGlkXG4vLyAgICAgICogQHBhcmFtIHRvUGV0SWQg6KKr5p+l55yL5a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ1RhcmdldExvb2sodG9QbGF5ZXJJZDpMb25nLHRvUGV0SWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ1RhcmdldExvb2s6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ1RhcmdldExvb2tcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGV0SWQgPSB0b1BldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nVGFyZ2V0TG9vay5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQ0hPT1NFLGJ1ZmZlcik7XG4vLyAgICAgfVxuXG5cbi8vICAgICAvKiror7fmsYLoo4XlpIfmiZPpgKAgbXNnSWQ9MTA5MDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDEgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwTWFrZShwcm9wSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTWFrZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBNYWtlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wcm9wSWQgPSBwcm9wSWQ7ICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwTWFrZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX01BS0UsYnVmZmVyKTtcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLoo4XlpIfliIbop6MgbXNnSWQ9MTA5MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA2ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcFNwbGl0KGVxdWlwSWQ6QXJyYXk8TG9uZz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcFNwbGl0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcFNwbGl0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBTcGxpdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX1NQTElULGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguijheWkh+mUgeWumuaIluino+mUgSBtc2dJZD0xMDkxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDQgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwTG9jayhwZXRJZDpMb25nLGVxdWlwSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9jazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2NrXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvY2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9MT0NLLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguijheWkh+W8uuWMliBtc2dJZD0xMDkxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDUgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcUVxdWlwQXR0QWRkKHBldElkOkxvbmcsZXF1aXBJZDpMb25nLGx1Y2tOdW06bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBMb2NrOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcExvY2tcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7IFxuLy8gICAgICAgICBtZXNzYWdlLmx1Y2tOdW0gPSBsdWNrTnVtOyAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwTG9jay5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX0FUVF9BREQsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gXHQvKiror7fmsYLoo4XlpIfnqb/miLQgbXNnSWQ9MTA5MTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvYWRpbmcocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBMb2FkaW5nOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFFcXVpcExvYWRpbmdcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvYWRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9MT0FESU5HLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLoo4XlpIfljbjovb0gbXNnSWQ9MTA5MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcFVuTG9hZGluZyhwZXRJZDpMb25nLGVxdWlwSWQ6TG9uZylcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcFVuTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBVbkxvYWRpbmdcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcFVuTG9hZGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0VRVUlQX1VOTE9BRElORyxidWZmZXIpOyBcbi8vICAgICB9XG4vLyBcdC8qKuivt+axguWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDYgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFN0dWR5U2tpbGwocGV0SWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFN0dWR5U2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFN0dWR5U2tpbGxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRTdHVkeVNraWxsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NUVURZX1NLSUxMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlrqDnianph43nva7mioDog70gbXNnSWQ9MTA1MTA3XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA3Ki9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJlc2V0U2tpbGwocGV0SWQ6TG9uZyxza2lsbElkTGlzdDpBcnJheTxudW1iZXI+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0UmVzZXRTa2lsbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVzZXRTa2lsbFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICBcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBpZihza2lsbElkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5za2lsbElkTGlzdCA9IHNraWxsSWRMaXN0O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVzZXRTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRVNFVF9TS0lMTCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5a6g54mp5oqA6IO96L+b6Zi2IG1zZ0lkPTEwNTEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxUGV0U2tpbGxVcChwZXRJZDpMb25nLHNraWxsSWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxUGV0U2tpbGxVcDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0U2tpbGxVcFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbElkID0gc2tpbGxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFNraWxsVXAuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfU0tJTExfVVAsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG4vLyAvKiror7fmsYLlrqDnianmlL7nlJ8gbXNnSWQ9MTA1MTE5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRGcmVlKHBldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXNQZXRGcmVlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXNQZXRGcmVlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVzUGV0RnJlZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9GUkVFLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vIC8qKuivt+axgumihuWPlumCruS7tuWlluWKsSBtc2dJZD0xMTExMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTEyMDIgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxBd2FyZChtYWlsSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1haWxBd2FyZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbEF3YXJkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsQXdhcmQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0FXQVJELGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAgIC8qKuivt+axguWIoOmZpOmCruS7tiBtc2dJZD0xMTExMDNcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTEyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxEZWxldGUobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsRGVsZXRlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsRGVsZXRlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsRGVsZXRlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9ERUxFVEUsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG4vLyAgICAgLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFPcGVuTWFpbChtYWlsSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU9wZW5NYWlsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFPcGVuTWFpbFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxT3Blbk1haWwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9PUEVOX01BSUwsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axgumihuWPlumCruS7tuWlluWKsSBtc2dJZD0xMTExMDJcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxTWFpbEF3YXJkKG1haWxJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTWFpbEF3YXJkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsQXdhcmRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxBd2FyZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfQVdBUkQsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWIoOmZpOmCruS7tiBtc2dJZD0xMTExMDNcdFx0LS0tLS3ov5Tlm57mtojmga8gIG1zZ0lkPTExMTIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxTWFpbERlbGV0ZShtYWlsSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1haWxEZWxldGU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxEZWxldGVcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1haWxEZWxldGUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0RFTEVURSxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kUHVzaCgpOnZvaWRcbi8vICAgICB7ICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9QVVNIKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aQnOe0oiBtc2dJZD0xMTIxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDIgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZFNlYXJjaCh0b1BsYXllcklkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRTZWFyY2g6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZFNlYXJjaFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRTZWFyY2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfU0VBUkNILGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vnlLPor7cgbXNnSWQ9MTEyMTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRBcHBseSh0b1BsYXllcklkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRBcHBseTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kQXBwbHlcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kQXBwbHkuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfQVBQTFksYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aTjeS9nCBtc2dJZD0xMTIxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDQgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZE9wZXJhdGlvbih0eXBlOm51bWJlcix0b1BsYXllcklkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRPcGVyYXRpb246YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZE9wZXJhdGlvblwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRPcGVyYXRpb24uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfT1BFUkFUSU9OLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA1ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRNb3JlSW5mbyh0b1BsYXllcklkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRNb3JlSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kTW9yZUluZm9cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgICAgICAgXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRNb3JlSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9NT1JFX0lORk8sYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+mAgeekvCBtc2dJZD0xMTIxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDYgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEdpZnQoZ2lmdElkOm51bWJlcix0b1BsYXllcklkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRHaWZ0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRHaWZ0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxuLy8gICAgICAgICBtZXNzYWdlLmdpZnRJZCA9IGdpZnRJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEdpZnQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfR0lGVCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kQWxsSW5mbygpOnZvaWRcbi8vICAgICB7ICAgICAgICAgICAgICAgICAgICAgICAgXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9BbGxfSW5mbyk7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vliIfno4sgbXNnSWQ9MTEyMTA4XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA4MjAxICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRGaWdodCh0b1BsYXllcklkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFGcmllbmRGaWdodDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kRmlnaHRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgICAgICAgXG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRGaWdodC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0ZSSUVORF9GSUdIVCxidWZmZXIpOyBcbi8vICAgICB9XG5cblxuXG5cblxuXG5cblxuICAgIC8qKueZu+W9leivt+axgiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgbG9naW5SZXEoYWNjb3VudDpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBMb2dpblJlcXVlc3Q6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkxvZ2luUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2UubmFtZSA9IGFjY291bnQ7XG4gICAgLy8gICAgIG1lc3NhZ2UudG9rZW4gPSBHYW1lRGF0YU1hbmFnZXIuaW5zLmxvZ2luVG9rZW47XG4gICAgLy8gICAgIG1lc3NhZ2Uubmlja25hbWUgPSBcInhpZWxvbmdcIjtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IExvZ2luUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuVVNFUl9MT0dJTixQcm90b2NvbC5VU0VSX0xPR0lOX0NNRCxidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKirojrflj5boi7Hpm4Tkv6Hmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGdldEhlcm9JbmZvUmVxKHN0YXR1c0NvZGU6bnVtYmVyKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgSGVyb0luZm9SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJIZXJvSW5mb1JlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSBzdGF0dXNDb2RlO1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gSGVyb0luZm9SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5IRVJPLFByb3RvY29sLkhFUk9fR0VUX0lORk9TLGJ1ZmZlcik7XG4gICAgLy8gfVxuICAgIC8vIC8qKuiLsembhOS4iuOAgeS4i+OAgeabtOaWsOmYteWeiyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgaGVyb0xpbnVlcFVwZGF0ZVJlcShsaW5ldXBJZDpudW1iZXIsaGVyb0lkOnN0cmluZyxpc1VwOmJvb2xlYW4pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIGlmKCFpc1VwICYmIEdhbWVEYXRhTWFuYWdlci5pbnMuc2VsZlBsYXllckRhdGEuaGVyb0xpbmV1cERpYy52YWx1ZXMubGVuZ3RoIDw9IDEpXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIFRpcHNNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2coXCLpmLXkuIroi7Hpm4TkuI3lvpflsJHkuo7kuIDkuKpcIiwzMCxcIiNmZjAwMDBcIixMYXllck1hbmFnZXIuaW5zLmdldExheWVyKExheWVyTWFuYWdlci5USVBfTEFZRVIpLEdhbWVDb25maWcuU1RBR0VfV0lEVEgvMixHYW1lQ29uZmlnLlNUQUdFX0hFSUdIVC8yLDEsMCwyMDApO1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIHZhciBVcGRhdGVGb3JtYXRpb25SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJVcGRhdGVGb3JtYXRpb25SZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5zaXRlSWR4ID0gbGluZXVwSWQ7XG4gICAgLy8gICAgIG1lc3NhZ2UuaGVyb0lkID0gaGVyb0lkO1xuICAgIC8vICAgICBtZXNzYWdlLmZsYWcgPSBpc1VwO1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gVXBkYXRlRm9ybWF0aW9uUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX1VQREFURV9GT1JNQVRJT04sYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlR2F0ZUluZm9SZXEoKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgR2F0ZUluZm9SZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkdhdGVJbmZvUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IDE7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBHYXRlSW5mb1JlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9JTkZPLGJ1ZmZlcik7XG4gICAgLy8gfVxuICAgIC8vIC8qKuaMkeaImOWFs+WNoSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgYmFsbHRlR2F0ZVJlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEJhdHRsZUdhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkJhdHRsZUdhdGVSZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEJhdHRsZUdhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfQkFUVExFLGJ1ZmZlcik7XG4gICAgLy8gfVxuXG4gICAgLy8gLyoq6K+35rGC5omr6I2h5YWz5Y2hICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBzY2FuR2F0ZVJlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIFNjYW5HYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJTY2FuR2F0ZVJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gU2NhbkdhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfU0NBTixidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKiror7fmsYLlhbPljaHmjILmnLrlpZblirHkv6Hmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGdhdGVIYW5ndXBTdGF0ZVJlcSgpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBIYW5ndXBTdGF0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiSGFuZ3VwU3RhdGVSZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gMTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEhhbmd1cFN0YXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0hBTkRVUF9TVEFURSxidWZmZXIpO1xuICAgIC8vICAgICAvLyBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUpO1xuICAgIC8vIH1cbiAgICAvLyAvKiror7fmsYLlhbPljaHmjILmnLrkv6Hmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGdhdGVTd2l0Y2hIYW5nUmVxKGdhdGVLZXk6c3RyaW5nKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlN3aXRjaEhhbmdHYXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBTd2l0Y2hIYW5nR2F0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9TV0lUQ0hfSEFOR19HQVRFLGJ1ZmZlcik7XG4gICAgLy8gICAgIC8vIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0hBTkRVUF9TVEFURSk7XG4gICAgLy8gfVxuICAgIFxuXG5cbiAgICAvLyAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKkh0dHAgKi9cbiAgICAvLyAvKirmtYvor5XnmbvlvZUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBMb2dpblJlcShhY2NvdW50OnN0cmluZyxwd2Q6c3RyaW5nLGNhbGxlcj86YW55LGNhbGxCYWNrPzpGdW5jdGlvbik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIHBhcmFtczphbnkgPSB7fTtcbiAgICAvLyAgICAgcGFyYW1zLmFjY291bnQgPSBhY2NvdW50O1xuICAgIC8vICAgICBwYXJhbXMucGFzc3dvcmQgPSBwd2Q7XG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLnRlc3RMb2dpblVSTCxIVFRQUmVxVHlwZS5HRVQscGFyYW1zLGNhbGxlcixjYWxsQmFjayk7XG4gICAgLy8gfVxuICAgIC8vIC8qKuiOt+WPluacjeWKoeWZqOWIl+ihqCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgaHR0cEdhbWVTZXJ2ZXJSZXEoY2FsbGVyPzphbnksY2FsbEJhY2s/OkZ1bmN0aW9uKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICBIdHRwTWFuYWdlci5pbnMuc2VuZChIVFRQUmVxdWVzdFVybC5nYW1lU2VydmVyVVJMLEhUVFBSZXFUeXBlLkdFVCxudWxsLGNhbGxlcixjYWxsQmFjayk7XG4gICAgLy8gfVxuICAgIC8vIC8qKui/m+WFpea4uOaIjyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgaHR0cEVudGVyR2FtZVJlcShzaWQ6bnVtYmVyLGNhbGxlcj86YW55LGNhbGxCYWNrPzpGdW5jdGlvbik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIHBhcmFtczphbnkgPSB7fTtcbiAgICAvLyAgICAgcGFyYW1zLnNpZCA9IHNpZDtcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZW50ZXJHYW1lVVJMLEhUVFBSZXFUeXBlLkdFVCxwYXJhbXMsY2FsbGVyLGNhbGxCYWNrKTtcbiAgICAvLyB9XG59IiwiLypcbiog5YyF6Kej5p6QXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZUluIGV4dGVuZHMgTGF5YS5CeXRle1xuICAgIFxuICAgIC8vIHB1YmxpYyBtb2R1bGU6bnVtYmVyO1xuICAgIHB1YmxpYyBjbWQ6bnVtYmVyO1xuICAgIHB1YmxpYyBib2R5O1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIC8vIHB1YmxpYyByZWFkKG1zZzpPYmplY3QgPSBudWxsKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXG4gICAgLy8gICAgIHRoaXMuY2xlYXIoKTtcbiAgICAvLyAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKG1zZyk7XG4gICAgLy8gICAgIHRoaXMucG9zID0gMDtcbiAgICAvLyAgICAgLy/moIforrDlkozplb/luqZcbiAgICAvLyAgICAgdmFyIG1hcmsgPSB0aGlzLmdldEludDE2KCk7XG4gICAgLy8gICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIC8v5YyF5aS0XG4gICAgLy8gICAgIHRoaXMubW9kdWxlID0gdGhpcy5nZXRJbnQzMigpO1xuICAgIC8vICAgICB0aGlzLmNtZCA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgdmFyIHR5cGUgPSB0aGlzLmdldEJ5dGUoKTtcbiAgICAvLyAgICAgdmFyIGZvcm1hdCA9IHRoaXMuZ2V0Qnl0ZSgpO1xuICAgIC8vICAgICAvL+aVsOaNrlxuICAgIC8vICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XG4gICAgLy8gICAgIHRoaXMuYm9keSA9IG5ldyBVaW50OEFycmF5KHRlbXBCeXRlKTtcblxuICAgIC8vIH1cbiAgICBcbiAgICAvL+aWsOmAmuS/oVxuICAgIC8vIHB1YmxpYyByZWFkKG1zZzpPYmplY3QgPSBudWxsKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXG4gICAgLy8gICAgIHRoaXMuY2xlYXIoKTtcbiAgICAvLyAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKG1zZyk7XG4gICAgLy8gICAgIHRoaXMucG9zID0gMDtcblxuICAgIC8vICAgICB2YXIgbGVuID0gdGhpcy5nZXRJbnQzMigpO1xuICAgIC8vICAgICB0aGlzLmNtZCA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgLy/mlbDmja5cbiAgICAvLyAgICAgdmFyIHRlbXBCeXRlID0gdGhpcy5idWZmZXIuc2xpY2UodGhpcy5wb3MpO1xuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XG5cbiAgICAvLyB9XG4gICAgLy/mlrDpgJrkv6Eg57KY5YyF5aSE55CGXG4gICAgcHVibGljIHJlYWQoYnVmZkRhdGEpOnZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLndyaXRlQXJyYXlCdWZmZXIoYnVmZkRhdGEpO1xuICAgICAgICB0aGlzLnBvcyA9IDA7XG5cbiAgICAgICAgdmFyIGxlbiA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XG4gICAgICAgIC8v5pWw5o2uXG4gICAgICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xuXG4gICAgfVxuICAgIFxufVxuIiwiaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4vV2ViU29ja2V0TWFuYWdlclwiO1xuXG4vKlxuKiDmiZPljIVcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlT3V0IGV4dGVuZHMgTGF5YS5CeXRle1xuICAgIC8vIHByaXZhdGUgUEFDS0VUX01BUksgPSAweDA7XG4gICAgLy8gcHJpdmF0ZSBtb2R1bGUgPSAwO1xuICAgIC8vIHByaXZhdGUgdHlwZSA9IDA7XG4gICAgLy8gcHJpdmF0ZSBmb3JtYXJ0ID0gMDtcbiAgICBwcml2YXRlIGNtZDtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvLyBwdWJsaWMgcGFjayhtb2R1bGUsY21kLGRhdGE/OmFueSk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgIC8vICAgICB0aGlzLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAvLyAgICAgdGhpcy5jbWQgPSBjbWQ7XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQxNih0aGlzLlBBQ0tFVF9NQVJLKTtcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDMyKGRhdGEuYnl0ZUxlbmd0aCArIDEwKTtcbiAgICAvLyAgICAgLy/ljIXlpLRcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDMyKHRoaXMubW9kdWxlKTtcbiAgICAvLyAgICAgdGhpcy53cml0ZUludDMyKHRoaXMuY21kKTtcbiAgICAvLyAgICAgdGhpcy53cml0ZUJ5dGUodGhpcy50eXBlKTtcbiAgICAvLyAgICAgdGhpcy53cml0ZUJ5dGUodGhpcy5mb3JtYXJ0KTtcbiAgICAvLyAgICAgLy/mtojmga/kvZNcbiAgICAvLyAgICAgaWYoZGF0YSlcbiAgICAvLyAgICAge1xuICAgIC8vICAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGRhdGEpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuXG4gICAgLyoq5paw6YCa5L+hICovXG4gICAgcHVibGljIHBhY2soY21kLGRhdGE/OmFueSk6dm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuXG4gICAgICAgIHRoaXMuY21kID0gY21kO1xuICAgICAgICB2YXIgbGVuID0gKGRhdGEgPyBkYXRhLmJ5dGVMZW5ndGggOiAwKSArIDEyO1xuICAgICAgICB2YXIgY29kZTpudW1iZXIgPSBXZWJTb2NrZXRNYW5hZ2VyLmNvZGVDb3VudF5sZW5eNTEyO1xuICAgICAgICBcbiAgICAgICAgdGhpcy53cml0ZUludDMyKGxlbik7XG4gICAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICAgIHRoaXMud3JpdGVJbnQzMihjb2RlKTtcbiAgICAgICAgdGhpcy53cml0ZUludDMyKHRoaXMuY21kKTtcbiAgICAgICAgaWYoZGF0YSlcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5jb2RlQ291bnQrKyA7XG4gICAgfVxuXG59IiwiLypcbiog5pWw5o2u5aSE55CGSGFubGRlclxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldEhhbmRsZXJ7XG4gICAgLy8gcHVibGljIHN0YXR1c0NvZGU6bnVtYmVyID0gMDtcbiAgICBwdWJsaWMgY2FsbGVyOmFueTtcbiAgICBwcml2YXRlIGNhbGxCYWNrOkZ1bmN0aW9uO1xuICAgIGNvbnN0cnVjdG9yKGNhbGxlcj86YW55LGNhbGxiYWNrPzpGdW5jdGlvbil7XG4gICAgICAgIHRoaXMuY2FsbGVyID0gY2FsbGVyO1xuICAgICAgICB0aGlzLmNhbGxCYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgcHVibGljIGV4cGxhaW4oZGF0YT86YW55KTp2b2lkXG4gICAge1xuICAgICAgICAvLyB2YXIgc3RhdHVzQ29kZSA9IGRhdGEuc3RhdHVzQ29kZTtcbiAgICAgICAgLy8gaWYoc3RhdHVzQ29kZSA9PSAwKVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICB0aGlzLnN1Y2Nlc3MoZGF0YSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gZWxzZVxuICAgICAgICAvLyB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhcIuacjeWKoeWZqOi/lOWbnu+8mlwiLGRhdGEuc3RhdHVzQ29kZSk7XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5zdWNjZXNzKGRhdGEpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgc3VjY2VzcyhkYXRhPzphbnkpOnZvaWRcbiAgICB7XG4gICAgICAgIGlmKHRoaXMuY2FsbGVyICYmIHRoaXMuY2FsbEJhY2spXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKGRhdGEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsQmFjay5jYWxsKHRoaXMuY2FsbGVyLGRhdGEpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsbEJhY2suY2FsbCh0aGlzLmNhbGxlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IERpY3Rpb25hcnkgZnJvbSBcIi4uLy4uL1Rvb2wvRGljdGlvbmFyeVwiO1xuaW1wb3J0IEV2ZW50TWFuYWdlciBmcm9tIFwiLi4vRXZlbnRNYW5hZ2VyXCI7XG5pbXBvcnQgUGFja2FnZUluIGZyb20gXCIuL1BhY2thZ2VJblwiO1xuaW1wb3J0IFBhY2thZ2VPdXQgZnJvbSBcIi4vUGFja2FnZU91dFwiO1xuaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4vU29ja2V0SGFuZGxlclwiO1xuaW1wb3J0IENsaWVudFNlbmRlciBmcm9tIFwiLi9DbGllbnRTZW5kZXJcIjtcbmltcG9ydCB7IFByb3RvY29sIH0gZnJvbSBcIi4uL0NvbnN0L0dhbWVDb25maWdcIjtcblxuLyoqXG4gKiBzb2NrZXTkuK3lv4NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2ViU29ja2V0TWFuYWdlciB7XG4gICAvKirpgJrkv6Fjb2Rl5qyh5pWwICovXG4gICBwdWJsaWMgc3RhdGljIGNvZGVDb3VudDpudW1iZXIgPSAwO1xuICAgcHJpdmF0ZSBpcDpzdHJpbmc7XG4gICBwcml2YXRlIHBvcnQ6bnVtYmVyO1xuICAgcHJpdmF0ZSB3ZWJTb2NrZXQ6TGF5YS5Tb2NrZXQ7XG4gICBwcml2YXRlIHNvY2tldEhhbmxkZXJEaWM6RGljdGlvbmFyeTtcbiAgIHByaXZhdGUgcHJvdG9Sb290OmFueTtcbiAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgdGhpcy5zb2NrZXRIYW5sZGVyRGljID0gbmV3IERpY3Rpb25hcnkoKTtcbiAgIH1cbiAgIHByaXZhdGUgc3RhdGljIF9pbnM6V2ViU29ja2V0TWFuYWdlciA9IG51bGw7XG4gICBwdWJsaWMgc3RhdGljIGdldCBpbnMoKTpXZWJTb2NrZXRNYW5hZ2Vye1xuICAgICAgIGlmKHRoaXMuX2lucyA9PSBudWxsKVxuICAgICAgIHsgIFxuICAgICAgICAgICB0aGlzLl9pbnMgPSBuZXcgV2ViU29ja2V0TWFuYWdlcigpO1xuICAgICAgIH1cbiAgICAgICByZXR1cm4gdGhpcy5faW5zO1xuICAgfVxuXG4gICBwdWJsaWMgY29ubmVjdChpcDpzdHJpbmcscG9ydDpudW1iZXIpOnZvaWRcbiAgIHtcbiAgICAgICB0aGlzLmlwID0gaXA7XG4gICAgICAgdGhpcy5wb3J0ID0gcG9ydDtcblxuICAgICAgIHRoaXMud2ViU29ja2V0ID0gbmV3IExheWEuU29ja2V0KCk7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5PUEVOLHRoaXMsdGhpcy53ZWJTb2NrZXRPcGVuKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50Lk1FU1NBR0UsdGhpcyx0aGlzLndlYlNvY2tldE1lc3NhZ2UpO1xuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuQ0xPU0UsdGhpcyx0aGlzLndlYlNvY2tldENsb3NlKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50LkVSUk9SLHRoaXMsdGhpcy53ZWJTb2NrZXRFcnJvcik7XG4gICAgICAgLy/liqDovb3ljY/orq5cbiAgICAgICBpZighdGhpcy5wcm90b1Jvb3Qpe1xuICAgICAgICAgICB2YXIgcHJvdG9CdWZVcmxzID0gW1wib3V0c2lkZS9wcm90by9Vc2VyUHJvdG8ucHJvdG9cIixcIm91dHNpZGUvcHJvdG8vTWF0Y2hQcm90by5wcm90b1wiLFwib3V0c2lkZS9wcm90by9HYW1lUHJvdG8ucHJvdG9cIl07XG4gICAgICAgICAgIExheWEuQnJvd3Nlci53aW5kb3cucHJvdG9idWYubG9hZChwcm90b0J1ZlVybHMsdGhpcy5wcm90b0xvYWRDb21wbGV0ZSk7XG4gICAgICAgICAgICBcbiAgICAgICB9XG4gICAgICAgZWxzZVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIit0aGlzLmlwK1wiOlwiK3RoaXMucG9ydCk7XG4gICAgICAgfVxuICAgfVxuICAgLyoq5YWz6Zetd2Vic29ja2V0ICovXG4gICBwdWJsaWMgY2xvc2VTb2NrZXQoKTp2b2lkXG4gICB7XG4gICAgICAgaWYodGhpcy53ZWJTb2NrZXQpXG4gICAgICAge1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5PUEVOLHRoaXMsdGhpcy53ZWJTb2NrZXRPcGVuKTtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuTUVTU0FHRSx0aGlzLHRoaXMud2ViU29ja2V0TWVzc2FnZSk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50LkVSUk9SLHRoaXMsdGhpcy53ZWJTb2NrZXRFcnJvcik7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNsb3NlKCk7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0ID0gbnVsbDtcbiAgICAgICB9XG4gICB9XG4gIFxuICAgcHJpdmF0ZSBwcm90b0xvYWRDb21wbGV0ZShlcnJvcixyb290KTp2b2lkXG4gICB7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMucHJvdG9Sb290ID0gcm9vdDtcbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy53ZWJTb2NrZXQuY29ubmVjdEJ5VXJsKFwid3M6Ly9cIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5pcCtcIjpcIitXZWJTb2NrZXRNYW5hZ2VyLmlucy5wb3J0KTtcbiAgIH1cbiAgIHByaXZhdGUgd2ViU29ja2V0T3BlbigpOnZvaWRcbiAgIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBvcGVuLi4uXCIpO1xuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhID0gbmV3IExheWEuQnl0ZSgpO1xuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFuO1xuICAgICAgIHRoaXMudGVtcEJ5dGUgPSBuZXcgTGF5YS5CeXRlKCk7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcblxuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50ID0gMTtcbiAgICAgICAgLy8gICAgRXZlbnRNYW5hZ2VyLmlucy5kaXNwYXRjaEV2ZW50KEV2ZW50TWFuYWdlci5TRVJWRVJfQ09OTkVDVEVEKTvmmoLml7bkuI3pnIDopoHojrflj5bmnI3liqHlmajliJfooahcbiAgIH1cbiAgIC8v57yT5Yay5a2X6IqC5pWw57uEXG4gICBwcml2YXRlIGJ5dGVCdWZmRGF0YTpMYXlhLkJ5dGU7XG4gICAvL+mVv+W6puWtl+iKguaVsOe7hFxuICAgcHJpdmF0ZSB0ZW1wQnl0ZTpMYXlhLkJ5dGU7XG4gIFxuICAgcHJpdmF0ZSBwYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pOnZvaWRcbiAgIHtcbiAgICAgICAvL+WujOaVtOWMhVxuICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcbiAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAscGFja0xlbik7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xuICAgICAgIC8v5pat5YyF5aSE55CGXG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEgPSBuZXcgTGF5YS5CeXRlKHRoaXMuYnl0ZUJ1ZmZEYXRhLmdldFVpbnQ4QXJyYXkocGFja0xlbix0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpKTtcbiAgICAgICAvLyB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlcixwYWNrTGVuLHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW47XG5cbiAgICAgICAvL+ino+aekOWMhVxuICAgICAgIHZhciBwYWNrYWdlSW46UGFja2FnZUluID0gbmV3IFBhY2thZ2VJbigpO1xuICAgICAgIC8vIHZhciBidWZmID0gdGhpcy50ZW1wQnl0ZS5idWZmZXIuc2xpY2UoMCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XG4gICAgICAgcGFja2FnZUluLnJlYWQodGhpcy50ZW1wQnl0ZS5idWZmZXIpO1xuXG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgbXNnLi4uXCIscGFja2FnZUluLmNtZCx0aGlzLnRlbXBCeXRlLmxlbmd0aCk7XG4gICAgICAgaWYocGFja2FnZUluLmNtZCA9PSAxMDUyMDIpXG4gICAgICAge1xuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcbiAgICAgICB9XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBwYWNrYWdlSW4uY21kO1xuICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcbiAgICAgICBpZihoYW5kbGVycyAmJiBoYW5kbGVycy5sZW5ndGggPiAwKVxuICAgICAgIHtcbiAgICAgICAgICAgZm9yKHZhciBpID0gaGFuZGxlcnMubGVuZ3RoIC0gMTtpID49IDA7aS0tKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBoYW5kbGVyc1tpXS5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcbiAgICAgICAgICAgfVxuICAgICAgICAgICAvLyBoYW5kbGVycy5mb3JFYWNoKHNvY2tldEhhbmxkZXIgPT4ge1xuICAgICAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcblxuICAgICAgICAgICAvLyB9KTtcbiAgICAgICB9XG4gICAgICAgXG4gICAgICAgLy/pgJLlvZLmo4DmtYvmmK/lkKbmnInlrozmlbTljIVcbiAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPiA0KVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5jbGVhcigpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLndyaXRlQXJyYXlCdWZmZXIodGhpcy5ieXRlQnVmZkRhdGEuYnVmZmVyLDAsNCk7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcbiAgICAgICAgICAgcGFja0xlbiA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgXG4gICB9XG4gICAvKirop6PmnpDnqbrljIUgKi9cbiAgIHByaXZhdGUgcGFyc2VOdWxsUGFja2FnZShjbWQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiKyBjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKGhhbmRsZXJzKVxuICAgICAgIHtcbiAgICAgICAgICAgaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcbiAgICAgICAgICAgICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbigpO1xuICAgICAgICAgICB9KTtcbiAgICAgICB9XG4gICB9XG4gICBcbiAgIHByaXZhdGUgd2ViU29ja2V0TWVzc2FnZShkYXRhKTp2b2lkXG4gICB7XG4gICAgICAgdGhpcy50ZW1wQnl0ZSA9IG5ldyBMYXlhLkJ5dGUoZGF0YSk7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjtcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIi4uLi4udGVzdHdlYlwiLHRoaXMudGVtcEJ5dGUucG9zKTtcbiAgICAgICBcbiAgICAgICBpZih0aGlzLnRlbXBCeXRlLmxlbmd0aCA+IDQpXG4gICAgICAge1xuICAgICAgICAgICBpZih0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgPT0gNCkvL+epuuWMhVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB2YXIgY21kOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKTtcbiAgICAgICAgICAgICAgIHRoaXMucGFyc2VOdWxsUGFja2FnZShjbWQpO1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCLnqbrljIUuLi4uLi4uLi4uLi4uLi4uXCIrY21kKTtcbiAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS53cml0ZUFycmF5QnVmZmVyKGRhdGEsMCxkYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgIC8vIGNvbnNvbGUubG9nKFwi5a2X6IqC5oC76ZW/5bqmLi4uLi4uLi4uLi4uLi4uLlwiK3RoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCk7XG4gICAgICAgXG4gICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID4gNClcbiAgICAgICB7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLDQpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XG4gICAgICAgICAgIHZhciBwYWNrTGVuOm51bWJlciA9IHRoaXMudGVtcEJ5dGUuZ2V0SW50MzIoKSArIDQ7XG4gICAgICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+PSBwYWNrTGVuKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlUGFja2FnZURhdGEocGFja0xlbik7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG5cbiAgICAgICBcblxuXG5cbiAgICAgICAvLyB2YXIgcGFja2FnZUluOlBhY2thZ2VJbiA9IG5ldyBQYWNrYWdlSW4oKTtcbiAgICAgICAvLyBwYWNrYWdlSW4ucmVhZChkYXRhKTtcblxuICAgICAgIC8vIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG1zZy4uLlwiLHBhY2thZ2VJbi5jbWQpO1xuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gXCJcIisgcGFja2FnZUluLmNtZDtcbiAgICAgICAvLyB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XG4gICAgICAgLy8gaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcbiAgICAgICAvLyAgICAgc29ja2V0SGFubGRlci5leHBsYWluKHBhY2thZ2VJbi5ib2R5KTtcbiAgICAgICAvLyB9KTtcbiAgICAgICBcbiAgIH1cbiAgIHByaXZhdGUgd2ViU29ja2V0Q2xvc2UoKTp2b2lkXG4gICB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IGNsb3NlLi4uXCIpO1xuICAgfVxuICAgcHJpdmF0ZSB3ZWJTb2NrZXRFcnJvcigpOnZvaWRcbiAgIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgZXJyb3IuLi5cIik7XG4gICB9XG4gICAvKipcbiAgICAqIOWPkemAgea2iOaBr1xuICAgICogQHBhcmFtIGNtZCBcbiAgICAqIEBwYXJhbSBkYXRhIFxuICAgICovXG4gICBwdWJsaWMgc2VuZE1zZyhjbWQ6bnVtYmVyLGRhdGE/OmFueSk6dm9pZFxuICAge1xuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IHJlcS4uLlwiK2NtZCk7XG4gICAgICAgdmFyIHBhY2thZ2VPdXQ6UGFja2FnZU91dCA9IG5ldyBQYWNrYWdlT3V0KCk7XG4gICAgICAgLy8gcGFja2FnZU91dC5wYWNrKG1vZHVsZSxjbWQsZGF0YSk7XG4gICAgICAgcGFja2FnZU91dC5wYWNrKGNtZCxkYXRhKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5zZW5kKHBhY2thZ2VPdXQuYnVmZmVyKTtcbiAgIH1cbiAgIC8qKlxuICAgICog5a6a5LmJcHJvdG9idWbnsbtcbiAgICAqIEBwYXJhbSBwcm90b1R5cGUg5Y2P6K6u5qih5Z2X57G75Z6LXG4gICAgKiBAcGFyYW0gY2xhc3NTdHIg57G7XG4gICAgKi9cbiAgIHB1YmxpYyBkZWZpbmVQcm90b0NsYXNzKGNsYXNzU3RyOnN0cmluZyk6YW55XG4gICB7XG4gICAgICAgcmV0dXJuIHRoaXMucHJvdG9Sb290Lmxvb2t1cChjbGFzc1N0cik7XG4gICB9XG5cbiAgIC8qKuazqOWGjCAqL1xuICAgcHVibGljIHJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGhhbmRsZXI6U29ja2V0SGFuZGxlcik6dm9pZFxuICAge1xuICAgICAgIC8vIHZhciBrZXk6c3RyaW5nID0gcHJvdG9jb2wrXCJfXCIrY21kO1xuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIitjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKCFoYW5kbGVycylcbiAgICAgICB7XG4gICAgICAgICAgIGhhbmRsZXJzID0gW107XG4gICAgICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5zZXQoa2V5LGhhbmRsZXJzKTtcbiAgICAgICB9XG4gICAgICAgZWxzZVxuICAgICAgIHtcbiAgICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICB9XG4gICB9XG4gICAvKirliKDpmaQgKi9cbiAgIHB1YmxpYyB1bnJlZ2lzdGVySGFuZGxlcihjbWQ6bnVtYmVyLGNhbGxlcjphbnkpOnZvaWRcbiAgIHtcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIgKyBjbWQ7XG4gICAgICAgdmFyIGhhbmRsZXJzOkFycmF5PFNvY2tldEhhbmRsZXI+ID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIGlmKGhhbmRsZXJzKVxuICAgICAgIHtcbiAgICAgICAgICAgdmFyIGhhbmRsZXI7XG4gICAgICAgICAgIGZvcih2YXIgaSA9IGhhbmRsZXJzLmxlbmd0aCAtIDE7aSA+PSAwIDtpLS0pXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tpXTtcbiAgICAgICAgICAgICAgIGlmKGhhbmRsZXIuY2FsbGVyID09PSBjYWxsZXIpXG4gICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgaGFuZGxlcnMuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgaWYoaGFuZGxlcnMubGVuZ3RoID09IDApXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYy5yZW1vdmUoa2V5KTtcbiAgICAgICAgICAgfVxuICAgICAgIH1cbiAgIH1cbiAgIC8qKua3u+WKoOacjeWKoeWZqOW/g+i3syAqL1xuICAgcHVibGljIGFkZEhlcnRSZXEoKTp2b2lkXG4gICB7XG4gICAgLy8gICAgdGhpcy5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsbmV3IFNlcnZlckhlYXJ0SGFuZGxlcih0aGlzKSk7XG4gICAgLy8gICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xuICAgIC8vICAgIExheWEudGltZXIubG9vcCgxMDAwMCx0aGlzLGZ1bmN0aW9uKCk6dm9pZHtcbiAgICAvLyAgICAgICAgQ2xpZW50U2VuZGVyLnNlcnZIZWFydFJlcSgpO1xuICAgIC8vICAgIH0pO1xuICAgfVxuICAgcHVibGljIHJlbW92ZUhlYXJ0UmVxKCk6dm9pZFxuICAge1xuICAgIC8vICAgIHRoaXMudW5yZWdpc3RlckhhbmRsZXIoUHJvdG9jb2wuUkVTUF9TRVJWX0hFUlQsdGhpcyk7XG4gICAgLy8gICAgTGF5YS50aW1lci5jbGVhckFsbCh0aGlzKTtcbiAgIH1cbn0iLCJpbXBvcnQgYmFzZUNvbmZpZyBmcm9tIFwiLi9iYXNlQ29uZmlnXCI7XG5pbXBvcnQgTWFwUG9zIGZyb20gXCIuLi9CZWFuL01hcFBvc1wiO1xuXG5cbi8qKlxuICog6Ziy5b6h5aGU5pWw5o2u5qih5Z6LXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlZmVuZGVyQ29uZmlnIGV4dGVuZHMgYmFzZUNvbmZpZ3tcbiAgICAvKipcbiAgICAgKiDpmLLlvqHloZRpZFxuICAgICAqL1xuICAgIHB1YmxpYyBkZWZlbmRlcklkIDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIOmYsuW+oeWhlOWQjeensFxuICAgICAqL1xuICAgIHB1YmxpYyBkZWZlbmRlck5hbWUgOiBzdHJpbmc7XG4gICAgLyoqXG4gICAgICog6Ziy5b6h5aGU5pS75Ye75YqbXG4gICAgICovXG4gICAgcHVibGljIHBvd2VyIDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIOaUu+WHu+i3neemu1xuICAgICAqL1xuICAgIHB1YmxpYyBkaWMgOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICog5pS75Ye76YCf5bqmXG4gICAgICovXG4gICAgcHVibGljIGF0dGFja1NwZWVkIDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIOaUu+WHu+mikeeOh1xuICAgICAqL1xuICAgIHB1YmxpYyBhdHRhY2tGcmVxdWVuY3kgOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICog5Lu35qC8XG4gICAgICovXG4gICAgcHVibGljIHByaWNlIDogbnVtYmVyO1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKirljbPlsIblvIDmlL4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8qKlxuICAgICAqIOexu+WeiyAx6YeRMuacqDPmsLQ054GrNeWcn1xuICAgICAqL1xuICAgIC8vcHVibGljIHR5cGUgOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihkYXRhKXtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgfVxufSIsImltcG9ydCBiYXNlQ29uZmlnIGZyb20gXCIuL2Jhc2VDb25maWdcIjtcblxuXG4vKipcbiAqIOaAqueJqeaVsOaNruaooeWei1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25zdGVyQ29uZmlnIGV4dGVuZHMgYmFzZUNvbmZpZ3tcbiAgICAvKipcbiAgICAgKiDmgKrnialpZFxuICAgICAqL1xuICAgIHB1YmxpYyBtb25zdGVySWQgOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICog5oCq54mp5ZCN5a2XXG4gICAgICovXG4gICAgcHVibGljIG1vbnN0ZXJOYW1lIDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIOaUu+WHu+WKm1xuICAgICAqL1xuICAgIHB1YmxpYyBwb3dlciA6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiDnp7vliqjpgJ/luqZcbiAgICAgKi9cbiAgICBwdWJsaWMgc3BlZWQgOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICog6KGA6YePXG4gICAgICovXG4gICAgcHVibGljIGhwOm51bWJlcjtcbiAgICAvKipcbiAgICAgKiDku7fmoLxcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJpY2U6bnVtYmVyO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKuWNs+WwhuW8gOaUvioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgLyoqXG4gICAgICog6Ziy5b6h5YqbXG4gICAgICovXG4gICAgLy9wdWJsaWMgZGVmIDogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICog5oCq54mp57G75Z6LIDHph5Ey5pyoM+awtDTngas15ZyfXG4gICAgICovXG4gICAgLy9wdWJsaWMgdHlwZSA6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGRhdGEpe1xuICAgICAgICBzdXBlcihkYXRhKTtcbiAgICB9XG59IiwiLyoqXG4gKiDln7rnoYDmlbDmja7nu5PmnoRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgYmFzZUNvbmZpZ3tcbiAgXG4gICAgY29uc3RydWN0b3IoZGF0YSl7XG4gICAgICAgIGxldCBhcnIgPSBPYmplY3Qua2V5cyhkYXRhKTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnIubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICB0aGlzW2FycltpXV0gPSBkYXRhW2FycltpXV07XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqVGhpcyBjbGFzcyBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBieSBMYXlhQWlySURFLCBwbGVhc2UgZG8gbm90IG1ha2UgYW55IG1vZGlmaWNhdGlvbnMuICovXHJcbmltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL0dhbWUvR2FtZUNvbnRyb2xsZXJcIlxuaW1wb3J0IEdhbWVMb2JieUNvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlci9HYW1lTG9iYnkvR2FtZUxvYmJ5Q29udHJvbGxlclwiXG5pbXBvcnQgTG9hZGluZ0NvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlci9Mb2FkaW5nL0xvYWRpbmdDb250cm9sbGVyXCJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi9Db250cm9sbGVyL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIlxyXG4vKlxyXG4qIOa4uOaIj+WIneWni+WMlumFjee9rjtcclxuKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNvbmZpZ3tcclxuICAgIHN0YXRpYyB3aWR0aDpudW1iZXI9MTQ0MDtcclxuICAgIHN0YXRpYyBoZWlnaHQ6bnVtYmVyPTc1MDtcclxuICAgIHN0YXRpYyBzY2FsZU1vZGU6c3RyaW5nPVwiZml4ZWRoZWlnaHRcIjtcclxuICAgIHN0YXRpYyBzY3JlZW5Nb2RlOnN0cmluZz1cIm5vbmVcIjtcclxuICAgIHN0YXRpYyBhbGlnblY6c3RyaW5nPVwidG9wXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25IOnN0cmluZz1cImxlZnRcIjtcclxuICAgIHN0YXRpYyBzdGFydFNjZW5lOmFueT1cIldlbGNvbWUvTG9naW4uc2NlbmVcIjtcclxuICAgIHN0YXRpYyBzY2VuZVJvb3Q6c3RyaW5nPVwiXCI7XHJcbiAgICBzdGF0aWMgZGVidWc6Ym9vbGVhbj1mYWxzZTtcclxuICAgIHN0YXRpYyBzdGF0OmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgcGh5c2ljc0RlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgZXhwb3J0U2NlbmVUb0pzb246Ym9vbGVhbj10cnVlO1xyXG4gICAgY29uc3RydWN0b3IoKXt9XHJcbiAgICBzdGF0aWMgaW5pdCgpe1xyXG4gICAgICAgIHZhciByZWc6IEZ1bmN0aW9uID0gTGF5YS5DbGFzc1V0aWxzLnJlZ0NsYXNzO1xyXG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvR2FtZS9HYW1lQ29udHJvbGxlci50c1wiLEdhbWVDb250cm9sbGVyKTtcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9HYW1lTG9iYnkvR2FtZUxvYmJ5Q29udHJvbGxlci50c1wiLEdhbWVMb2JieUNvbnRyb2xsZXIpO1xuICAgICAgICByZWcoXCJDb250cm9sbGVyL0xvYWRpbmcvTG9hZGluZ0NvbnRyb2xsZXIudHNcIixMb2FkaW5nQ29udHJvbGxlcik7XG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlci50c1wiLFdlbENvbWVDb250cm9sbGVyKTtcclxuICAgIH1cclxufVxyXG5HYW1lQ29uZmlnLmluaXQoKTsiLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XG5cblxuLyoqXG4gKiDmuLjmiI/lhaXlj6NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUVudGVye1xuXHRcdC8vXG4gICAgXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgLyoq5Yid5aeL5YyWICovXG4gICAgcHJpdmF0ZSBpbml0KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICB9XG4gICAgLyoq6LWE5rqQ5Yqg6L29ICovXG4gICAgcHJpdmF0ZSBsb2FkKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgYXNzZXRlQXJyID0gW1xuICAgICAgICAgICAge3VybDpcInVucGFja2FnZS93ZWxjb21lX2JnLnBuZ1wifSxcbiAgICAgICAgICAgIHt1cmw6XCJXZWxjb21lL2xvZ2luYm94LnBuZ1wifSxcbiAgICAgICAgICAgIHt1cmw6XCJXZWxjb21lL3Byb2dyZXNzQmcucG5nXCJ9LFxuXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL2NvbXAuYXRsYXNcIn0sXG4gICAgICAgICAgICB7dXJsOlwicmVzL2F0bGFzL3dlbGNvbWUuYXRsYXNcIn1cbiAgICAgICAgXVxuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKGFzc2V0ZUFycixMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbmxvYWQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9ubG9hZCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgR2FtZUNvbmZpZy5zdGFydFNjZW5lICYmIExheWEuU2NlbmUub3BlbihHYW1lQ29uZmlnLnN0YXJ0U2NlbmUpO1xuICAgIH1cbn0iLCJpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XG5pbXBvcnQgR2FtZUVudGVyIGZyb20gXCIuL0dhbWVFbnRlclwiO1xuY2xhc3MgTWFpbiB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdC8v5qC55o2uSURF6K6+572u5Yid5aeL5YyW5byV5pOOXHRcdFxuXHRcdGlmICh3aW5kb3dbXCJMYXlhM0RcIl0pIExheWEzRC5pbml0KEdhbWVDb25maWcud2lkdGgsIEdhbWVDb25maWcuaGVpZ2h0KTtcblx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcblx0XHRMYXlhW1wiUGh5c2ljc1wiXSAmJiBMYXlhW1wiUGh5c2ljc1wiXS5lbmFibGUoKTtcblx0XHRMYXlhW1wiRGVidWdQYW5lbFwiXSAmJiBMYXlhW1wiRGVidWdQYW5lbFwiXS5lbmFibGUoKTtcblx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xuXHRcdExheWEuc3RhZ2Uuc2NyZWVuTW9kZSA9IEdhbWVDb25maWcuc2NyZWVuTW9kZTtcblx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXG5cdFx0TGF5YS5VUkwuZXhwb3J0U2NlbmVUb0pzb24gPSBHYW1lQ29uZmlnLmV4cG9ydFNjZW5lVG9Kc29uO1xuXG5cdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXG5cdFx0aWYgKEdhbWVDb25maWcuZGVidWcgfHwgTGF5YS5VdGlscy5nZXRRdWVyeVN0cmluZyhcImRlYnVnXCIpID09IFwidHJ1ZVwiKSBMYXlhLmVuYWJsZURlYnVnUGFuZWwoKTtcblx0XHRpZiAoR2FtZUNvbmZpZy5waHlzaWNzRGVidWcgJiYgTGF5YVtcIlBoeXNpY3NEZWJ1Z0RyYXdcIl0pIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdLmVuYWJsZSgpO1xuXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XG5cdFx0TGF5YS5hbGVydEdsb2JhbEVycm9yID0gdHJ1ZTtcblxuXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXG5cdFx0TGF5YS5SZXNvdXJjZVZlcnNpb24uZW5hYmxlKFwidmVyc2lvbi5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vblZlcnNpb25Mb2FkZWQpLCBMYXlhLlJlc291cmNlVmVyc2lvbi5GSUxFTkFNRV9WRVJTSU9OKTtcblx0fVxuXG5cdG9uVmVyc2lvbkxvYWRlZCgpOiB2b2lkIHtcblx0XHQvL+a/gOa0u+Wkp+Wwj+WbvuaYoOWwhO+8jOWKoOi9veWwj+WbvueahOaXtuWAme+8jOWmguaenOWPkeeOsOWwj+WbvuWcqOWkp+WbvuWQiOmbhumHjOmdou+8jOWImeS8mOWFiOWKoOi9veWkp+WbvuWQiOmbhu+8jOiAjOS4jeaYr+Wwj+WbvlxuXHRcdExheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XG5cdH1cblxuXHRvbkNvbmZpZ0xvYWRlZCgpOiB2b2lkIHtcblx0XHRuZXcgR2FtZUVudGVyKCk7XG5cdFx0Ly/liqDovb1JREXmjIflrprnmoTlnLrmma9cblx0fVxufVxuLy/mv4DmtLvlkK/liqjnsbtcbm5ldyBNYWluKCk7XG4iLCIvKipcbiAgICAqIOivjeWFuCBrZXktdmFsdWVcbiAgICAqXG4gICAgKiAgXG4gICAgKiAga2V5cyA6IEFycmF5XG4gICAgKiAgW3JlYWQtb25seV0g6I635Y+W5omA5pyJ55qE5a2Q5YWD57Sg6ZSu5ZCN5YiX6KGo44CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogXG4gICAgKiAgdmFsdWVzIDogQXJyYXlcbiAgICAqICBbcmVhZC1vbmx5XSDojrflj5bmiYDmnInnmoTlrZDlhYPntKDliJfooajjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiAgUHVibGljIE1ldGhvZHNcbiAgICAqICBcbiAgICAqICAgICAgICAgIFxuICAgICogIGNsZWFyKCk6dm9pZFxuICAgICogIOa4hemZpOatpOWvueixoeeahOmUruWQjeWIl+ihqOWSjOmUruWAvOWIl+ihqOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgIFxuICAgICogIGdldChrZXk6Kik6KlxuICAgICogIOi/lOWbnuaMh+WumumUruWQjeeahOWAvOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgICBcbiAgICAqICBpbmRleE9mKGtleTpPYmplY3QpOmludFxuICAgICogIOiOt+WPluaMh+WumuWvueixoeeahOmUruWQjee0ouW8leOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgIFxuICAgICogIHJlbW92ZShrZXk6Kik6Qm9vbGVhblxuICAgICogIOenu+mZpOaMh+WumumUruWQjeeahOWAvOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqICAgICAgICAgIFxuICAgICogIHNldChrZXk6KiwgdmFsdWU6Kik6dm9pZFxuICAgICogIOe7meaMh+WumueahOmUruWQjeiuvue9ruWAvOOAglxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWN0aW9uYXJ5IHtcbiAgICAvKirplK7lkI0gKi9cbiAgICBwcml2YXRlIGtleXMgOiBBcnJheTxhbnk+O1xuICAgIC8qKumUruWAvCAqL1xuICAgIHByaXZhdGUgdmFsdWVzIDogQXJyYXk8YW55PjtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMua2V5cyA9IG5ldyBBcnJheTxhbnk+KCk7XG4gICAgICAgIHRoaXMudmFsdWVzID0gbmV3IEFycmF5PGFueT4oKTtcbiAgICB9XG5cbiAgICAvKirorr7nva4g6ZSu5ZCNIC0g6ZSu5YC8ICovXG4gICAgcHVibGljIHNldChrZXk6YW55LHZhbHVlOmFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICBmb3IobGV0IGkgPSAwO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMua2V5c1tpXT09PXVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXNbaV0gPSBrZXk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbaV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlzLnB1c2goa2V5KTtcbiAgICAgICAgdGhpcy52YWx1ZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOaPkuWFpWtleVtcIisga2V5ICtcIl1cIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidmFsdWVcIix2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoq6YCa6L+HIOmUruWQjWtleSDojrflj5bplK7lgLx2YWx1ZSAgKi9cbiAgICBwdWJsaWMgZ2V0KGtleTphbnkpIDogYW55XG4gICAge1xuICAgICAgICAvLyB0aGlzLmdldERpY0xpc3QoKTsgXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMua2V5c1tpXSA9PT0ga2V5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDor43lhbjkuK3msqHmnIlrZXnnmoTlgLxcIik7XG4gICAgfVxuXG4gICAgLyoq6I635Y+W5a+56LGh55qE57Si5byV5YC8ICovXG4gICAgcHVibGljIGluZGV4T2YodmFsdWUgOiBhbnkpIDogbnVtYmVyXG4gICAge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpPHRoaXMudmFsdWVzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHRoaXMudmFsdWVzW2ldID09PSB2YWx1ZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDor43lhbjkuK3msqHmnInor6XlgLxcIik7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIFxuICAgIC8qKua4hemZpCDor43lhbjkuK3mjIflrprplK7lkI3nmoTliaogKi9cbiAgICBwdWJsaWMgcmVtb3ZlKGtleSA6IGFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV0gPT09IGtleSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtleXNbaV0gPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tpXSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44CQRGljdGlvbmFyeeOAkSAtIOenu+mZpOaIkOWKn1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDnp7vpmaTlpLHotKVcIik7XG4gICAgfVxuXG4gICAgLyoq5riF6Zmk5omA5pyJ55qE6ZSuICovXG4gICAgcHVibGljIGNsZWFyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmtleXMgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSBbXTtcbiAgICB9XG5cbiAgICAvKirojrflj5bliJfooaggKi9cbiAgICBwdWJsaWMgZ2V0RGljTGlzdCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCLjgJBcIiArIGkgKyBcIuOAkS0tLS0tLS0tLS0ta2V5OlwiICsgdGhpcy5rZXlzW2ldKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidmFsdWVcIix0aGlzLnZhbHVlc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKirojrflj5bplK7lgLzmlbDnu4QgKi9cbiAgICBwdWJsaWMgZ2V0VmFsdWVzQXJyKCkgOiBBcnJheTxhbnk+XG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXM7XG4gICAgfVxuXG4gICAgLyoq6I635Y+W6ZSu5ZCN5pWw57uEICovXG4gICAgcHVibGljIGdldEtleXNBcnIoKSA6IEFycmF5PGFueT5cbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLmtleXM7XG4gICAgfVxufSIsImltcG9ydCB7IHVpIH0gZnJvbSBcIi4uL3VpL2xheWFNYXhVSVwiO1xuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XG5cbi8qKlxuICog5Lit6Ze05a2XXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0TXNnIGV4dGVuZHMgdWkuRGlhbG9nXy5GbG9hdE1zZ1VJe1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgXG4gICAgb25FbmFibGUoKXtcbiAgICAgICAgdGhpcy5hZGRFdmVudCgpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuYW5pMS5zdG9wKCk7XG4gICAgICAgIHRoaXMuc3BfZmxvYXRNc2cudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEV2ZW50KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uSGlkZGVuKTtcbiAgICAgICAgdGhpcy5hbmkxLm9uKExheWEuRXZlbnQuQ09NUExFVEUsdGhpcyx0aGlzLm9uSGlkZGVuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrmtojmga/po5jlrZdcbiAgICAgKiBAcGFyYW0gdGV4dCDmmL7npLrmlofmnKwg44CQ5pyA5aSaMjjkuKrjgJFcbiAgICAgKiBAcGFyYW0gcG9zICDkvY3nva57eDoxMDAseToxMDB9XG4gICAgICovXG4gICAgcHVibGljIHNob3dNc2codGV4dDpzdHJpbmcscG9zOmFueSkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlOyBcbiAgICAgICAgdGhpcy5hbHBoYSA9IDE7ICAgICAgIFxuICAgICAgICB0aGlzLnNwX2Zsb2F0TXNnLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhYl9mbG9hdE1zZy50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy54ID0gcG9zLng7XG4gICAgICAgIHRoaXMueSA9IHBvcy55O1xuICAgICAgICB0aGlzLmFuaTEucGxheSgwLGZhbHNlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uSGlkZGVuKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmFuaTEuc3RvcCgpO1xuICAgICAgICB0aGlzLnNwX2Zsb2F0TXNnLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIExheWEuUG9vbC5yZWNvdmVyKFwiRmxvYXRNc2dcIix0aGlzKTtcbiAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLmNvdW50RmxvYXRNc2ctLTtcbiAgICB9XG59IiwiLyoqXG4gKiDlsI/lt6XlhbdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbHtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlsY/luZXmsLTlubPkuK3lv4Mg5qiq5Z2Q5qCHXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBnZXRDZW50ZXJYKCkgOiBhbnlcbiAgICB7XG4gICAgICAgIHJldHVybiA3NTAvKExheWEuQnJvd3Nlci5jbGllbnRIZWlnaHQvTGF5YS5Ccm93c2VyLmNsaWVudFdpZHRoKS8yOy8v5bGP5bmV5a695bqmXG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIOS4pOeCuemXtOi3neemu1xuICAgICAqL1xuICAgIHB1YmxpYyAgc3RhdGljIGdldERpc3RhbmNlKHNwMSxzcDIpOm51bWJlclxuICAgIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyhNYXRoLmFicyhzcDEueC1zcDIueCksMikrTWF0aC5wb3coTWF0aC5hYnMoc3AxLnktc3AyLnkpLDIpKTtcbiAgICB9XG5cbn1cbiIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xuaW1wb3J0IFZpZXc9TGF5YS5WaWV3O1xuaW1wb3J0IERpYWxvZz1MYXlhLkRpYWxvZztcbmltcG9ydCBTY2VuZT1MYXlhLlNjZW5lO1xuZXhwb3J0IG1vZHVsZSB1aS5EaWFsb2dfIHtcclxuICAgIGV4cG9ydCBjbGFzcyBGbG9hdE1zZ1VJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGFuaTE6TGF5YS5GcmFtZUFuaW1hdGlvbjtcblx0XHRwdWJsaWMgc3BfZmxvYXRNc2c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGxhYl9mbG9hdE1zZzpMYXlhLkxhYmVsO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiRGlhbG9nXy9GbG9hdE1zZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aS5HYW1lIHtcclxuICAgIGV4cG9ydCBjbGFzcyBHYW1lVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgZ2FtZTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZHM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2QxOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZDM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2Q0OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXYWxsczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgVXBXYWxsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBEb3duV2FsbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgR3JvdXBzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9kb29yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX2Rvb3I6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJvYWQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyX2ljb246TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfaWNvbjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcGxheWVyX21lbnVpdGVtOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzaG92ZWxiZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc2hvdmVsX29mZjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc2hvdmVsX29uOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBidG5fYnV5OkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fYnVpbGQ6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGRlZmVuZGVyX3VpZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG1vbnN0ZXJfdWlncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgdGV4dF90aW1lcjpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgY29pbkJnOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyB0ZXh0X2NvaW46bGF5YS5kaXNwbGF5LlRleHQ7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJHYW1lL0dhbWVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuR2FtZUxvYmJ5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBHYW1lTG9iYnlVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBiZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTWVudUl0ZW1QYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYnRuX1BWUDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTW9kZUNob29zZVBhbmVsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyB0ZXh0XzFWMTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgYnRuXzFWMTpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgdGV4dF81VjU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGJ0bl81VjU6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl9iYWNrOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBNYXRjaGluZ1BhbmVsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBidG5fY2FuY2VsOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyB0ZXh0X3RpbWU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIE1hdGNoaW5nU3VjY2Vzc1BhbmVsOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJ0bl9lbnRlcmdhbWU6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl9yZWZ1c2U6TGF5YS5CdXR0b247XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJHYW1lTG9iYnkvR2FtZUxvYmJ5XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgbW9kdWxlIHVpIHtcclxuICAgIGV4cG9ydCBjbGFzcyBQbGF5ZXJMb2FkaW5nVUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgbG9hZGluZ2JnOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl8yOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfMzpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzQ6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl81OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl8xOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfMjpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzM6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl80OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfNTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NXOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc0w6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVDpMYXlhLkxhYmVsO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiUGxheWVyTG9hZGluZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aS5XZWxjb21lIHtcclxuICAgIGV4cG9ydCBjbGFzcyBMb2dpblVJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGFuaTE6TGF5YS5GcmFtZUFuaW1hdGlvbjtcblx0XHRwdWJsaWMgc3BfbG9naW5Cb3g6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGlucHV0X3VzZXJOYW1lOkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBpbnB1dF91c2VyS2V5OkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBsYWJfdGl0bGU6TGF5YS5MYWJlbDtcblx0XHRwdWJsaWMgYnRuX2xvZ2luOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fcmVnaXN0ZXI6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1c6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzTDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NUOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIHNwX2dhbWVOYW1lOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBzcF9yZWdpc3RlckJveDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaW5wdXRfcmVnaXN0ZXJVc2VyTmFtZTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgaW5wdXRfcmVnaXN0ZXJVc2VyS2V5OkxheWEuVGV4dElucHV0O1xuXHRcdHB1YmxpYyBidG5fdG9Mb2dpbjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuX3RvUmVnaXN0ZXI6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyTmlja05hbWU6TGF5YS5UZXh0SW5wdXQ7XG4gICAgICAgIGNvbnN0cnVjdG9yKCl7IHN1cGVyKCl9XHJcbiAgICAgICAgY3JlYXRlQ2hpbGRyZW4oKTp2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIuY3JlYXRlQ2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkU2NlbmUoXCJXZWxjb21lL0xvZ2luXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyIl19
