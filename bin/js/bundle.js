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
var ClientSender_1 = require("../../Core/Net/ClientSender");
var WelComeController_1 = require("../WelCome/WelComeController");
var Player_1 = require("../WelCome/Player");
var MatchAcceptHandler_1 = require("./handler/MatchAcceptHandler");
var GameLobbyController = /** @class */ (function (_super) {
    __extends(GameLobbyController, _super);
    function GameLobbyController() {
        return _super.call(this) || this;
    }
    /**启动 */
    GameLobbyController.prototype.onEnable = function () {
        this.second = 0;
        this.minute = 0;
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
        WebSocketManager_1.default.ins.registerHandler(GameConfig_1.Protocol.RES_MATCH_ACCEPT_INFO, new MatchAcceptHandler_1.default(this, this.onMatchAcceptHandler));
    };
    GameLobbyController.prototype.removeEvents = function () {
        this.btn_PVP.off(Laya.Event.CLICK, this, this.onPVPMode);
        WebSocketManager_1.default.ins.unregisterHandler(GameConfig_1.Protocol.RES_MATCH_INFO, this);
        WebSocketManager_1.default.ins.unregisterHandler(GameConfig_1.Protocol.RES_MATCH_ACCEPT_INFO, this);
    };
    /**点击进入PVP选择界面 */
    GameLobbyController.prototype.onPVPMode = function () {
        this.MenuItemPanel.visible = false;
        this.ModeChoosePanel.visible = true;
    };
    /**点击返回游戏大厅 */
    GameLobbyController.prototype.onBack = function () {
        this.MenuItemPanel.visible = true;
        this.ModeChoosePanel.visible = false;
    };
    /**点击选择1V1模式，匹配界面只显示玩家和敌人两个头像 */
    GameLobbyController.prototype.on1V1 = function () {
        //发送匹配请求
        ClientSender_1.default.reqMatch(WelComeController_1.default.ins.ownPlayer.userId, 1);
        Laya.timer.frameLoop(60, this, this.calTime);
        this.ModeChoosePanel.visible = false;
        this.MatchingPanel.visible = true;
        for (var i = 0; i < 5; i++) {
            this.red_group._children[i].visible = false;
            this.blue_group._children[i].visible = false;
        }
        this.icon_red_player_3.visible = true;
        this.icon_blue_player_3.visible = true;
        WelComeController_1.default.ins.mode = "1V1";
    };
    /**点击选择5V5模式 */
    GameLobbyController.prototype.on5V5 = function () {
        //WelComeController.ins.mode="5V5";
    };
    /**Match获取到消息 */
    GameLobbyController.prototype.onMatchHandler = function (data) {
        console.log(data + "匹配成功");
        if (data.status == 1) {
            this.chooseMatch();
            WelComeController_1.default.ins.enemyPlayer = new Player_1.default(data.matchInfoList[0].userName, data.matchInfoList[0].userId, "gameLobby/player_icon2.png");
            if (data.matchInfoList[0].teamNum == 1) {
                WelComeController_1.default.ins.enemyPlayer.camp = "red";
                WelComeController_1.default.ins.ownPlayer.camp = "blue";
                this.icon_red_player_3.loadImage(WelComeController_1.default.ins.enemyPlayer.icon);
                this.icon_blue_player_3.loadImage(WelComeController_1.default.ins.ownPlayer.icon);
            }
            else {
                WelComeController_1.default.ins.enemyPlayer.camp = "blue";
                WelComeController_1.default.ins.ownPlayer.camp = "red";
                this.icon_red_player_3.loadImage(WelComeController_1.default.ins.ownPlayer.icon);
                this.icon_blue_player_3.loadImage(WelComeController_1.default.ins.enemyPlayer.icon);
            }
        }
    };
    /**计时，在等待队列等待了多长时间 */
    GameLobbyController.prototype.calTime = function () {
        var secondStr, minuteStr;
        this.second++;
        if (this.second <= 9) {
            secondStr = "0" + this.second;
        }
        else if (this.second >= 60) {
            this.minute++;
            this.second = 0;
            secondStr = "0" + this.second;
        }
        else {
            secondStr = this.second.toString();
        }
        if (this.minute <= 9) {
            minuteStr = "0" + this.minute;
        }
        else {
            minuteStr = this.minute.toString();
        }
        this.text_time.text = minuteStr + ":" + secondStr;
    };
    /**匹配过程中点击取消,返回模式选择界面，从等待房间退出 */
    GameLobbyController.prototype.onCancel = function () {
        this.MatchingPanel.visible = false;
        this.ModeChoosePanel.visible = true;
        Laya.timer.clear(this, this.calTime);
        this.minute = 0;
        this.second = 0;
        ClientSender_1.default.reqMatchAccept(WelComeController_1.default.ins.ownPlayer.userId, 2); //拒绝
    };
    /**匹配成功弹框，获取敌方玩家信息，选择是否进入游戏 */
    GameLobbyController.prototype.chooseMatch = function () {
        this.MatchingPanel.visible = false;
        this.MatchingSuccessPanel.visible = true;
        Laya.timer.clear(this, this.calTime);
        this.minute = 0;
        this.second = 0;
    };
    /**点击确定，等待房间内人都确定后跳转进入游戏场景 */ //--网络
    GameLobbyController.prototype.onSure = function () {
        /**我方玩家点击确定发送请求，等待敌方玩家确定 */
        ClientSender_1.default.reqMatchAccept(WelComeController_1.default.ins.ownPlayer.userId, 1); //接受
    };
    /**点击拒绝，返回模式选择界面,发送拒绝请求 */ //--网络
    GameLobbyController.prototype.onRefuse = function () {
        //其中一个人发送拒绝请求，直接解散房间
        this.ModeChoosePanel.visible = true;
        this.MatchingSuccessPanel.visible = false;
        ClientSender_1.default.reqMatchAccept(WelComeController_1.default.ins.ownPlayer.userId, 2); //拒绝
    };
    /**MatchAccept获取到消息 */
    GameLobbyController.prototype.onMatchAcceptHandler = function (data) {
        console.log(data + "这个");
        if (data.status == 2) {
            //其中一个人发送拒绝请求，直接解散房间
            this.ModeChoosePanel.visible = true;
            this.MatchingSuccessPanel.visible = false;
        }
        else {
            console.log(data.userIdList.length + "咋回事啊");
            if (data.userIdList.length == 0) {
                Laya.Scene.open("PlayerLoading.scene");
            }
        }
    };
    return GameLobbyController;
}(layaMaxUI_1.ui.GameLobby.GameLobbyUI));
exports.default = GameLobbyController;
},{"../../Core/Const/GameConfig":18,"../../Core/Net/ClientSender":20,"../../Core/Net/WebSocketManager":24,"../../ui/layaMaxUI":34,"../GameLobby/handler/MatchHandler":3,"../WelCome/Player":14,"../WelCome/WelComeController":15,"./handler/MatchAcceptHandler":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketHandler_1 = require("../../../Core/Net/SocketHandler");
var WebSocketManager_1 = require("../../../Core/Net/WebSocketManager");
/**
 * 返回对局接受消息
 */
var MatchAcceptHandler = /** @class */ (function (_super) {
    __extends(MatchAcceptHandler, _super);
    function MatchAcceptHandler(caller, callback) {
        if (callback === void 0) { callback = null; }
        return _super.call(this, caller, callback) || this;
    }
    MatchAcceptHandler.prototype.explain = function (data) {
        var ResMatchAcceptInfo = WebSocketManager_1.default.ins.defineProtoClass("ResMatchAcceptInfo");
        var message = ResMatchAcceptInfo.decode(data);
        _super.prototype.explain.call(this, message);
    };
    /**处理数据 */
    MatchAcceptHandler.prototype.success = function (message) {
        _super.prototype.success.call(this, message);
    };
    return MatchAcceptHandler;
}(SocketHandler_1.default));
exports.default = MatchAcceptHandler;
},{"../../../Core/Net/SocketHandler":23,"../../../Core/Net/WebSocketManager":24}],3:[function(require,module,exports){
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
},{"../../../Core/Net/SocketHandler":23,"../../../Core/Net/WebSocketManager":24}],4:[function(require,module,exports){
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
        WelComeController_1.default.ins.enemyPlayer.fac;
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
        this.players_SetMonsterBornPos();
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
    /**设置怪兽出生点 */
    GameController.prototype.players_SetMonsterBornPos = function () {
        //获取敌方玩家的怪兽在我方草坪占的位置，变成土块
        WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass.changeImg();
        WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass.sp.off(Laya.Event.CLICK, WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass, WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass.Event1_changeState);
        WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass.changeImg();
        WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass.sp.off(Laya.Event.CLICK, WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass, WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass.Event1_changeState);
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
            monster.init(player.group, player.enemy_MonsterBornGrass.sp.x, player.enemy_MonsterBornGrass.sp.y, monsterSignArray[i]);
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
},{"../../Core/ConfigManager":17,"../../Core/MessageManager":19,"../../ui/layaMaxUI":34,"../WelCome/WelComeController":15,"./Monster":6,"./Prefab/DefenderItemUI":9,"./Prefab/MonsterItemUI":11}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Grass_1 = require("./Prefab/Grass");
var GrassFactory = /** @class */ (function () {
    function GrassFactory(view) {
        this.grassArray = new Array();
        this.mudArray = new Array();
        this.createGrassArray(view);
    }
    /**生成草坪 */
    GrassFactory.prototype.createGrassArray = function (view) {
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
},{"./Prefab/Grass":10}],6:[function(require,module,exports){
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
},{"../../Core/ConfigManager":17,"../WelCome/WelComeController":15,"./GameController":4}],7:[function(require,module,exports){
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
},{"../../../Tool/Tool":33}],8:[function(require,module,exports){
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
},{"../../../Core/ConfigManager":17,"../../../Tool/Tool":33,"../GameController":4,"./Bullet":7}],9:[function(require,module,exports){
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
},{"../../../Core/ConfigManager":17}],10:[function(require,module,exports){
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
},{"../../../Core/MessageManager":19,"../../WelCome/WelComeController":15,"../GameController":4,"./Defender":8}],11:[function(require,module,exports){
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
},{"../../../Core/ConfigManager":17}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketHandler_1 = require("../../../Core/Net/SocketHandler");
var WebSocketManager_1 = require("../../../Core/Net/WebSocketManager");
/**
 * 当所有人都加载好了之后返回游戏开始消息
 */
var OnLoadHandler = /** @class */ (function (_super) {
    __extends(OnLoadHandler, _super);
    function OnLoadHandler(caller, callback) {
        if (callback === void 0) { callback = null; }
        return _super.call(this, caller, callback) || this;
    }
    OnLoadHandler.prototype.explain = function (data) {
        var ResOnLoad = WebSocketManager_1.default.ins.defineProtoClass("ResOnLoad");
        var message = ResOnLoad.decode(data);
        _super.prototype.explain.call(this, message);
    };
    /**处理数据 */
    OnLoadHandler.prototype.success = function (message) {
        _super.prototype.success.call(this, message);
    };
    return OnLoadHandler;
}(SocketHandler_1.default));
exports.default = OnLoadHandler;
},{"../../../Core/Net/SocketHandler":23,"../../../Core/Net/WebSocketManager":24}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var layaMaxUI_1 = require("../../ui/layaMaxUI");
var WelComeController_1 = require("../WelCome/WelComeController");
var WebSocketManager_1 = require("../../Core/Net/WebSocketManager");
var GameConfig_1 = require("../../Core/Const/GameConfig");
var OnLoadHandler_1 = require("../Game/handler/OnLoadHandler");
var ClientSender_1 = require("../../Core/Net/ClientSender");
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
    /**事件绑定 */
    LoadingController.prototype.addEvents = function () {
        WebSocketManager_1.default.ins.registerHandler(GameConfig_1.Protocol.RES_ONLOAD, new OnLoadHandler_1.default(this, this.onLoadHandler));
    };
    LoadingController.prototype.removeEvents = function () {
        WebSocketManager_1.default.ins.unregisterHandler(GameConfig_1.Protocol.RES_ONLOAD, this);
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
        this.sp_progressT.text = "进度加载 " + Math.floor(pro * 100) + "%   [正在连接服务器……]";
    };
    /**加载完毕 */
    LoadingController.prototype.onLoad = function () {
        ClientSender_1.default.reqOnLoad(WelComeController_1.default.ins.ownPlayer.userId);
    };
    LoadingController.prototype.onLoadHandler = function (data) {
        //都加载完毕游戏可以开始 
        if (data.status == 1) {
            if (WelComeController_1.default.ins.ownPlayer.camp == "red") {
                WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass =
                    WelComeController_1.default.ins.ownPlayer.fac.grassArray[data.team1StartPoint.x + data.team1Start.y * 10];
                WelComeController_1.default.ins.enemyPlayer.enemy_MonsterBornGrass =
                    WelComeController_1.default.ins.enemyPlayer.fac.grassArray[data.team2StartPoint.x + data.team2Start.y * 10];
            }
            else {
                WelComeController_1.default.ins.enemyPlayer.enemy_MonsterBornGrass =
                    WelComeController_1.default.ins.enemyPlayer.fac.grassArray[data.team1StartPoint.x + data.team1Start.y * 10];
                WelComeController_1.default.ins.ownPlayer.enemy_MonsterBornGrass =
                    WelComeController_1.default.ins.ownPlayer.fac.grassArray[data.team2StartPoint.x + data.team2Start.y * 10];
            }
            this.EnterGame();
        }
    };
    /**进入游戏 */
    LoadingController.prototype.EnterGame = function () {
        Laya.Scene.open("Game/Game.scene");
    };
    return LoadingController;
}(layaMaxUI_1.ui.PlayerLoadingUI));
exports.default = LoadingController;
},{"../../Core/Const/GameConfig":18,"../../Core/Net/ClientSender":20,"../../Core/Net/WebSocketManager":24,"../../ui/layaMaxUI":34,"../Game/handler/OnLoadHandler":12,"../WelCome/WelComeController":15}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GrassFactory_1 = require("../Game/GrassFactory");
var GameController_1 = require("../Game/GameController");
var Player = /** @class */ (function () {
    function Player(name, userId, icon) {
        this.name = name;
        this.icon = icon;
        this.userId = userId;
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
        this.fac = new GrassFactory_1.default(this.group);
        this.coin = 500;
        GameController_1.default.Instance.text_coin.text = this.coin.toString();
        this.addEvent();
    };
    /**敌方玩家初始化 */
    Player.prototype.enemyGameInit = function () {
        if (this.camp == "red") {
            this.group = GameController_1.default.Instance.red_group;
        }
        else {
            this.group = GameController_1.default.Instance.blue_group;
        }
        this.fac = new GrassFactory_1.default(this.group);
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
},{"../Game/GameController":4,"../Game/GrassFactory":5}],15:[function(require,module,exports){
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
            this.ownPlayer = new Player_1.default(data.userName, data.userId, "gameLobby/player_icon.png");
            var text = "登陆成功，进入游戏！";
            if (this.sp_registerBox.visible)
                text = "注册成功，将直接进入游戏！";
            MessageManager_1.default.ins.showFloatMsg(text);
            this.toGameMain();
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
},{"../../Core/ConfigManager":17,"../../Core/Const/GameConfig":18,"../../Core/MessageManager":19,"../../Core/Net/ClientSender":20,"../../Core/Net/WebSocketManager":24,"../../Tool/Tool":33,"../../ui/layaMaxUI":34,"./Player":14,"./handler/UserLoginHandler":16}],16:[function(require,module,exports){
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
},{"../../../Core/Net/SocketHandler":23,"../../../Core/Net/WebSocketManager":24}],17:[function(require,module,exports){
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
},{"../Data/Config/DefenderConfig":25,"../Data/Config/MosnterConfigr":26}],18:[function(require,module,exports){
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
    GameConfig.IP = "47.107.169.244";
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
    Protocol.RES_MATCH_ACCEPT_INFO = 102202;
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
},{}],19:[function(require,module,exports){
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
},{"../Tool/FloatMsg":32,"../Tool/Tool":33}],20:[function(require,module,exports){
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
    * @param matchId 1为1V1
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
    * @param isAccept
    */
    ClientSender.reqMatchAccept = function (userId, isAccept) {
        var ReqMatchAccept = WebSocketManager_1.default.ins.defineProtoClass("ReqMatchAccept");
        var message = {};
        message.userId = userId;
        message.isAccept = isAccept;
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
},{"../Const/GameConfig":18,"./WebSocketManager":24}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{"./WebSocketManager":24}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{"../../Tool/Dictionary":31,"./PackageIn":21,"./PackageOut":22}],25:[function(require,module,exports){
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
},{"./baseConfig":27}],26:[function(require,module,exports){
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
},{"./baseConfig":27}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{"./Controller/Game/GameController":4,"./Controller/GameLobby/GameLobbyController":1,"./Controller/Loading/LoadingController":13,"./Controller/WelCome/WelComeController":15}],29:[function(require,module,exports){
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
},{"./GameConfig":28}],30:[function(require,module,exports){
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
},{"./GameConfig":28,"./GameEnter":29}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{"../Core/MessageManager":19,"../ui/layaMaxUI":34}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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
},{}]},{},[30])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6L0xheWFBaXIyLjAvcmVzb3VyY2VzL2FwcC9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEFjY2VwdEhhbmRsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9HcmFzc0ZhY3RvcnkudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL01vbnN0ZXIudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL1ByZWZhYi9CdWxsZXQudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL1ByZWZhYi9EZWZlbmRlci50cyIsInNyYy9Db250cm9sbGVyL0dhbWUvUHJlZmFiL0RlZmVuZGVySXRlbVVJLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9QcmVmYWIvR3Jhc3MudHMiLCJzcmMvQ29udHJvbGxlci9HYW1lL1ByZWZhYi9Nb25zdGVySXRlbVVJLnRzIiwic3JjL0NvbnRyb2xsZXIvR2FtZS9oYW5kbGVyL09uTG9hZEhhbmRsZXIudHMiLCJzcmMvQ29udHJvbGxlci9Mb2FkaW5nL0xvYWRpbmdDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvV2VsQ29tZS9QbGF5ZXIudHMiLCJzcmMvQ29udHJvbGxlci9XZWxDb21lL1dlbENvbWVDb250cm9sbGVyLnRzIiwic3JjL0NvbnRyb2xsZXIvV2VsQ29tZS9oYW5kbGVyL1VzZXJMb2dpbkhhbmRsZXIudHMiLCJzcmMvQ29yZS9Db25maWdNYW5hZ2VyLnRzIiwic3JjL0NvcmUvQ29uc3QvR2FtZUNvbmZpZy50cyIsInNyYy9Db3JlL01lc3NhZ2VNYW5hZ2VyLnRzIiwic3JjL0NvcmUvTmV0L0NsaWVudFNlbmRlci50cyIsInNyYy9Db3JlL05ldC9QYWNrYWdlSW4udHMiLCJzcmMvQ29yZS9OZXQvUGFja2FnZU91dC50cyIsInNyYy9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyLnRzIiwic3JjL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXIudHMiLCJzcmMvRGF0YS9Db25maWcvRGVmZW5kZXJDb25maWcudHMiLCJzcmMvRGF0YS9Db25maWcvTW9zbnRlckNvbmZpZ3IudHMiLCJzcmMvRGF0YS9Db25maWcvYmFzZUNvbmZpZy50cyIsInNyYy9HYW1lQ29uZmlnLnRzIiwic3JjL0dhbWVFbnRlci50cyIsInNyYy9NYWluLnRzIiwic3JjL1Rvb2wvRGljdGlvbmFyeS50cyIsInNyYy9Ub29sL0Zsb2F0TXNnLnRzIiwic3JjL1Rvb2wvVG9vbC50cyIsInNyYy91aS9sYXlhTWF4VUkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDVkEsZ0RBQXdDO0FBQ3hDLG9FQUErRDtBQUMvRCwwREFBbUU7QUFDbkUsa0VBQTZEO0FBQzdELDREQUF1RDtBQUN2RCxrRUFBNkQ7QUFDN0QsNENBQXVDO0FBQ3ZDLG1FQUE4RDtBQUM5RDtJQUFpRCx1Q0FBd0I7SUFLckU7ZUFDSSxpQkFBTztJQUNYLENBQUM7SUFFRCxRQUFRO0lBQ1Isc0NBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELE9BQU87SUFDUCx1Q0FBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxVQUFVO0lBQ0YsdUNBQVMsR0FBakI7UUFFSSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxD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R0FBcEIsVUFBcUIsQ0FBUTtRQUV6QixJQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBQywyQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsSUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLDJCQUFpQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RKLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBQywyQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFFLEdBQUcsSUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFDLDJCQUFpQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQyxDQUFDLEVBQ3pKO1lBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUMsd0JBQWMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLHdCQUFjLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RHO2FBRUQ7WUFDSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBQywyQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENB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QU87UUFDcEI7WUFBNkIsMkJBQUs7WUFtQjlCO3VCQUFlLGlCQUFPO1lBQUEsQ0FBQztZQUN2QixnQ0FBYyxHQUFkO2dCQUNJLGlCQUFNLGNBQWMsV0FBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7WUFDTCxjQUFDO1FBQUQsQ0F4QkEsQUF3QkMsQ0F4QjRCLEtBQUssR0F3QmpDO1FBeEJZLGVBQU8sVUF3Qm5CLENBQUE7SUFDTCxDQUFDLEVBMUJnQixPQUFPLEdBQVAsVUFBTyxLQUFQLFVBQU8sUUEwQnZCO0FBQUQsQ0FBQyxFQTFCYSxFQUFFLEdBQUYsVUFBRSxLQUFGLFVBQUUsUUEwQmYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XHJcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sLCBHYW1lQ29uZmlnIH0gZnJvbSBcIi4uLy4uL0NvcmUvQ29uc3QvR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgTWF0Y2hIYW5kbGVyIGZyb20gXCIuLi9HYW1lTG9iYnkvaGFuZGxlci9NYXRjaEhhbmRsZXJcIjtcclxuaW1wb3J0IENsaWVudFNlbmRlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvQ2xpZW50U2VuZGVyXCI7XHJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi4vV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9XZWxDb21lL1BsYXllclwiO1xyXG5pbXBvcnQgTWF0Y2hBY2NlcHRIYW5kbGVyIGZyb20gXCIuL2hhbmRsZXIvTWF0Y2hBY2NlcHRIYW5kbGVyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVMb2JieUNvbnRyb2xsZXIgZXh0ZW5kcyB1aS5HYW1lTG9iYnkuR2FtZUxvYmJ5VUl7XHJcbiAgICAvKirliIborqHmlbAgKi9cclxuICAgIHByaXZhdGUgbWludXRlOm51bWJlcjtcclxuICAgIC8qKuenkuiuoeaVsCAqL1xyXG4gICAgcHJpdmF0ZSBzZWNvbmQ6bnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWQr+WKqCAqL1xyXG4gICAgb25FbmFibGUoKXtcclxuICAgICAgICB0aGlzLnNlY29uZD0wO1xyXG4gICAgICAgIHRoaXMubWludXRlPTA7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirplIDmr4EqL1xyXG4gICAgb25EZXN0cm95KCl7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirkuovku7bnu5HlrpogKi9cclxuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5idG5fUFZQLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uUFZQTW9kZSk7XHJcbiAgICAgICAgdGhpcy5idG5fMVYxLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uMVYxKTtcclxuICAgICAgICB0aGlzLmJ0bl81VjUub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub241VjUpO1xyXG4gICAgICAgIHRoaXMuYnRuX2JhY2sub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25CYWNrKTtcclxuICAgICAgICB0aGlzLmJ0bl9jYW5jZWwub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25DYW5jZWwpO1xyXG4gICAgICAgIHRoaXMuYnRuX2VudGVyZ2FtZS5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblN1cmUpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfSU5GTyxuZXcgTWF0Y2hIYW5kbGVyKHRoaXMsdGhpcy5vbk1hdGNoSGFuZGxlcikpO1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfQUNDRVBUX0lORk8sbmV3IE1hdGNoQWNjZXB0SGFuZGxlcih0aGlzLHRoaXMub25NYXRjaEFjY2VwdEhhbmRsZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYnRuX1BWUC5vZmYoTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25QVlBNb2RlKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfSU5GTyx0aGlzKTtcclxuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy51bnJlZ2lzdGVySGFuZGxlcihQcm90b2NvbC5SRVNfTUFUQ0hfQUNDRVBUX0lORk8sdGhpcyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKueCueWHu+i/m+WFpVBWUOmAieaLqeeVjOmdoiAqL1xyXG4gICAgcHJpdmF0ZSBvblBWUE1vZGUoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1lbnVJdGVtUGFuZWwudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9dHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vov5Tlm57muLjmiI/lpKfljoUgKi9cclxuICAgIHByaXZhdGUgb25CYWNrKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5NZW51SXRlbVBhbmVsLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9ZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye76YCJ5oupMVYx5qih5byP77yM5Yy56YWN55WM6Z2i5Y+q5pi+56S6546p5a625ZKM5pWM5Lq65Lik5Liq5aS05YOPICovXHJcbiAgICBwcml2YXRlIG9uMVYxKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy/lj5HpgIHljLnphY3or7fmsYJcclxuICAgICAgICBDbGllbnRTZW5kZXIucmVxTWF0Y2goV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci51c2VySWQsMSk7XHJcbiAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoNjAsdGhpcyx0aGlzLmNhbFRpbWUpO1xyXG5cclxuICAgICAgICB0aGlzLk1vZGVDaG9vc2VQYW5lbC52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuTWF0Y2hpbmdQYW5lbC52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTw1O2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVkX2dyb3VwLl9jaGlsZHJlbltpXS52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmJsdWVfZ3JvdXAuX2NoaWxkcmVuW2ldLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaWNvbl9yZWRfcGxheWVyXzMudmlzaWJsZT10cnVlO1xyXG4gICAgICAgIHRoaXMuaWNvbl9ibHVlX3BsYXllcl8zLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMubW9kZT1cIjFWMVwiO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKirngrnlh7vpgInmi6k1VjXmqKHlvI8gKi9cclxuICAgIHByaXZhdGUgb241VjUoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICAvL1dlbENvbWVDb250cm9sbGVyLmlucy5tb2RlPVwiNVY1XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqTWF0Y2jojrflj5bliLDmtojmga8gKi9cclxuICAgIHByaXZhdGUgb25NYXRjaEhhbmRsZXIoZGF0YSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YStcIuWMuemFjeaIkOWKn1wiKTtcclxuICAgICAgICBpZihkYXRhLnN0YXR1cz09MSApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNob29zZU1hdGNoKCk7XHJcbiAgICAgICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5lbmVteVBsYXllcj1uZXcgUGxheWVyKGRhdGEubWF0Y2hJbmZvTGlzdFswXS51c2VyTmFtZSxkYXRhLm1hdGNoSW5mb0xpc3RbMF0udXNlcklkLFwiZ2FtZUxvYmJ5L3BsYXllcl9pY29uMi5wbmdcIik7XHJcbiAgICAgICAgICAgIGlmKGRhdGEubWF0Y2hJbmZvTGlzdFswXS50ZWFtTnVtPT0xKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuY2FtcD1cInJlZFwiO1xyXG4gICAgICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5jYW1wPVwiYmx1ZVwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pY29uX3JlZF9wbGF5ZXJfMy5sb2FkSW1hZ2UoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLmVuZW15UGxheWVyLmljb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pY29uX2JsdWVfcGxheWVyXzMubG9hZEltYWdlKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuaWNvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuY2FtcD1cImJsdWVcIjtcclxuICAgICAgICAgICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY2FtcD1cInJlZFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pY29uX3JlZF9wbGF5ZXJfMy5sb2FkSW1hZ2UoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5pY29uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaWNvbl9ibHVlX3BsYXllcl8zLmxvYWRJbWFnZShXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuaWNvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICBcclxuXHJcbiAgICAvKirorqHml7bvvIzlnKjnrYnlvoXpmJ/liJfnrYnlvoXkuoblpJrplb/ml7bpl7QgKi9cclxuICAgIHByaXZhdGUgY2FsVGltZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgc2Vjb25kU3RyLG1pbnV0ZVN0cjtcclxuICAgICAgICB0aGlzLnNlY29uZCsrO1xyXG4gICAgICAgIGlmKHRoaXMuc2Vjb25kPD05KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2Vjb25kU3RyPVwiMFwiK3RoaXMuc2Vjb25kO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHRoaXMuc2Vjb25kPj02MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubWludXRlKys7XHJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kPTA7XHJcbiAgICAgICAgICAgIHNlY29uZFN0cj1cIjBcIit0aGlzLnNlY29uZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc2Vjb25kU3RyPXRoaXMuc2Vjb25kLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLm1pbnV0ZTw9OSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG1pbnV0ZVN0cj1cIjBcIit0aGlzLm1pbnV0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbWludXRlU3RyPXRoaXMubWludXRlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudGV4dF90aW1lLnRleHQ9bWludXRlU3RyK1wiOlwiK3NlY29uZFN0cjtcclxuICAgIH1cclxuXHJcbiAgICAvKirljLnphY3ov4fnqIvkuK3ngrnlh7vlj5bmtogs6L+U5Zue5qih5byP6YCJ5oup55WM6Z2i77yM5LuO562J5b6F5oi/6Ze06YCA5Ye6ICovICAgICAgIFxyXG4gICAgcHJpdmF0ZSBvbkNhbmNlbCgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1hdGNoaW5nUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICB0aGlzLk1vZGVDaG9vc2VQYW5lbC52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgTGF5YS50aW1lci5jbGVhcih0aGlzLHRoaXMuY2FsVGltZSk7XHJcbiAgICAgICAgdGhpcy5taW51dGU9MDtcclxuICAgICAgICB0aGlzLnNlY29uZD0wO1xyXG4gICAgICAgIENsaWVudFNlbmRlci5yZXFNYXRjaEFjY2VwdChXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLnVzZXJJZCwyKTsvL+aLkue7nVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuWMuemFjeaIkOWKn+W8ueahhu+8jOiOt+WPluaVjOaWueeOqeWutuS/oeaBr++8jOmAieaLqeaYr+WQpui/m+WFpea4uOaIjyAqL1xyXG4gICAgcHJpdmF0ZSBjaG9vc2VNYXRjaCgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLk1hdGNoaW5nUGFuZWwudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICB0aGlzLk1hdGNoaW5nU3VjY2Vzc1BhbmVsLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyKHRoaXMsdGhpcy5jYWxUaW1lKTtcclxuICAgICAgICB0aGlzLm1pbnV0ZT0wO1xyXG4gICAgICAgIHRoaXMuc2Vjb25kPTA7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye756Gu5a6a77yM562J5b6F5oi/6Ze05YaF5Lq66YO956Gu5a6a5ZCO6Lez6L2s6L+b5YWl5ri45oiP5Zy65pmvICovICAgICAgICAgICAgLy8tLee9kee7nFxyXG4gICAgcHJpdmF0ZSBvblN1cmUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLyoq5oiR5pa5546p5a6254K55Ye756Gu5a6a5Y+R6YCB6K+35rGC77yM562J5b6F5pWM5pa5546p5a6256Gu5a6aICovXHJcbiAgICAgICAgQ2xpZW50U2VuZGVyLnJlcU1hdGNoQWNjZXB0KFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIudXNlcklkLDEpOy8v5o6l5Y+XXHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye75ouS57ud77yM6L+U5Zue5qih5byP6YCJ5oup55WM6Z2iLOWPkemAgeaLkue7neivt+axgiAqLyAgICAgICAgICAgICAgICAgIC8vLS3nvZHnu5xcclxuICAgIHByaXZhdGUgb25SZWZ1c2UoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy/lhbbkuK3kuIDkuKrkurrlj5HpgIHmi5Lnu53or7fmsYLvvIznm7TmjqXop6PmlaPmiL/pl7RcclxuICAgICAgICB0aGlzLk1vZGVDaG9vc2VQYW5lbC52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgdGhpcy5NYXRjaGluZ1N1Y2Nlc3NQYW5lbC52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgIENsaWVudFNlbmRlci5yZXFNYXRjaEFjY2VwdChXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLnVzZXJJZCwyKTsvL+aLkue7nVxyXG4gICAgfVxyXG5cclxuICAgICAgLyoqTWF0Y2hBY2NlcHTojrflj5bliLDmtojmga8gKi9cclxuICAgIHByaXZhdGUgb25NYXRjaEFjY2VwdEhhbmRsZXIoZGF0YSkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YStcIui/meS4qlwiKTtcclxuICAgICAgICBpZihkYXRhLnN0YXR1cz09MilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8v5YW25Lit5LiA5Liq5Lq65Y+R6YCB5ouS57ud6K+35rGC77yM55u05o6l6Kej5pWj5oi/6Ze0XHJcbiAgICAgICAgICAgIHRoaXMuTW9kZUNob29zZVBhbmVsLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5NYXRjaGluZ1N1Y2Nlc3NQYW5lbC52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLnVzZXJJZExpc3QubGVuZ3RoK1wi5ZKL5Zue5LqL5ZWKXCIpO1xyXG4gICAgICAgICAgICBpZihkYXRhLnVzZXJJZExpc3QubGVuZ3RoPT0wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBMYXlhLlNjZW5lLm9wZW4oXCJQbGF5ZXJMb2FkaW5nLnNjZW5lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IFNvY2tldEhhbmRsZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1NvY2tldEhhbmRsZXJcIjtcclxuaW1wb3J0IFdlYlNvY2tldE1hbmFnZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvTmV0L1dlYlNvY2tldE1hbmFnZXJcIjtcclxuXHJcbi8qKlxyXG4gKiDov5Tlm57lr7nlsYDmjqXlj5fmtojmga9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoQWNjZXB0SGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcclxuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlc01hdGNoQWNjZXB0SW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzTWF0Y2hBY2NlcHRJbmZvXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc01hdGNoQWNjZXB0SW5mby5kZWNvZGUoZGF0YSk7XHJcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxyXG4gICAgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCJpbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvU29ja2V0SGFuZGxlclwiO1xyXG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOi/lOWbnuWMuemFjeS/oeaBryDlj6rlj5HpgIHkuIDmrKFcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdGNoSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKGNhbGxlcjphbnksY2FsbGJhY2s6RnVuY3Rpb24gPSBudWxsKXtcclxuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFJlc01hdGNoSW5mbzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzTWF0Y2hJbmZvXCIpO1xyXG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc01hdGNoSW5mby5kZWNvZGUoZGF0YSk7XHJcbiAgICAgICAgc3VwZXIuZXhwbGFpbihtZXNzYWdlKTtcclxuICAgIH1cclxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xyXG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MobWVzc2FnZSk6dm9pZFxyXG4gICAgeyAgICAgICAgICAgICAgICBcclxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59XHJcbiAgICAiLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi8uLi91aS9sYXlhTWF4VUlcIjtcclxuaW1wb3J0IEdyYXNzRmFjdG9yeSBmcm9tIFwiLi9HcmFzc0ZhY3RvcnlcIjtcclxuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XHJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi4vV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgRGVmZW5kZXJJdGVtVUkgZnJvbSBcIi4vUHJlZmFiL0RlZmVuZGVySXRlbVVJXCI7XHJcbmltcG9ydCBNb25zdGVyIGZyb20gXCIuL01vbnN0ZXJcIjtcclxuaW1wb3J0IENvbmZpZ01hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvQ29uZmlnTWFuYWdlclwiO1xyXG5pbXBvcnQgTW9uc3Rlckl0ZW1VSSBmcm9tIFwiLi9QcmVmYWIvTW9uc3Rlckl0ZW1VSVwiO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lQ29udHJvbGxlciBleHRlbmRzIHVpLkdhbWUuR2FtZVVJe1xyXG4gICAgLyoq5Y2V5L6LICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOkdhbWVDb250cm9sbGVyO1xyXG4gICAgLyoq5LiK5qyh6byg5qCH5b6X5L2N572uICovXHJcbiAgICBwcml2YXRlIGxhc3RNb3VzZVBvc1g6bnVtYmVyO1xyXG4gICAgLyoq5piv5ZCm5q2j5Zyo5L2/55So6ZOy5a2QICovXHJcbiAgICBwcml2YXRlIGlzVXNlU2hvdmVsOmJvb2xlYW47XHJcbiAgICAvKirorqHml7blmajmlbAgKi9cclxuICAgIHByaXZhdGUgY291bnREb3duTnVtOm51bWJlcjtcclxuICAgIC8qKuaAquWFveW3suW8gOWni+enu+WKqCAqL1xyXG4gICAgcHVibGljIGlzTW9uc3Rlck1vdmU6Ym9vbGVhbjtcclxuICAgIC8qKua4uOaIj+WbnuWQiOaVsCAqL1xyXG4gICAgcHJpdmF0ZSByb3VuZDpudW1iZXI7XHJcbiAgICAvKirmgKrlhb3lh7rnjrDorqHmlbDlmaggKi9cclxuICAgIHByaXZhdGUgbW9uc3RlckNvdW50Om51bWJlcjtcclxuICAgIC8qKuiPnOWNleagj+mYsuW+oeWhlFVJ5pWw57uEICovXHJcbiAgICBwcml2YXRlIGRlZmVuZGVySXRlbVVJQXJyYXk6QXJyYXk8RGVmZW5kZXJJdGVtVUk+O1xyXG4gICAgLyoq6I+c5Y2V5qCP5oCq5YW9VUnmlbDnu4QgKi9cclxuICAgIHByaXZhdGUgbW9uc3Rlckl0ZW1VSUFycmF5OkFycmF5PE1vbnN0ZXJJdGVtVUk+O1xyXG4gICAgLyoq5oCq5YW95qCH6K6w5pWw57uEIOavj+asoeWPkemAgeagh+iusOaVsOe7hOe7meWvueaWue+8jOS7juiAjOWIneWni+WMluaAquWFvSovXHJcbiAgICBwcml2YXRlIG1vbnN0ZXJTaWduQXJyYXk6QXJyYXk8bnVtYmVyPjtcclxuICAgIC8qKuaVjOaWueaAquWFveaVsOe7hCAqL1xyXG4gICAgcHVibGljIG1vbnN0ZXJBcnJheTpBcnJheTxNb25zdGVyPjtcclxuICAgIC8qKuaWueWQkeaVsOe7hCAqL1xyXG4gICAgcHVibGljIGRpckFycmF5OkFycmF5PEFycmF5PG51bWJlcj4+O1xyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvbkVuYWJsZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBHYW1lQ29udHJvbGxlci5JbnN0YW5jZT10aGlzO1xyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIub3duR2FtZUluaXQoKTtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuZmFjXHJcbiAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMSx0aGlzLHRoaXMubWFwTW92ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Zyw5Zu+56e75YqoICovXHJcbiAgICBwcml2YXRlIG1hcE1vdmUoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICB0aGlzLmdhbWUueC09NDtcclxuICAgICAgIGlmKHRoaXMuZ2FtZS54PC0xMjE0KVxyXG4gICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuZ2FtZS54PS0xMjE0O1xyXG4gICAgICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcyx0aGlzLm1hcE1vdmUpO1xyXG4gICAgICAgICAgIExheWEudGltZXIuZnJhbWVPbmNlKDYwLHRoaXMsdGhpcy5yZXN1bWVQb3MpO1xyXG4gICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICAvKirlm57liLDnjqnlrrbkvY3nva4gKi9cclxuICAgIHByaXZhdGUgcmVzdW1lUG9zKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY2FtcD09XCJibHVlXCIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuZ2FtZS54PS0xMjE0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgIHRoaXMuZ2FtZS54PTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub3duUGxheWVyT3BlbigpO1xyXG4gICAgICAgIFxyXG4gICAgfSBcclxuICAgICBcclxuICAgIFxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirpvKDmoIfkuovku7YgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICAvKirpvKDmoIfmjInkuIsgKi9cclxuICAgIHByaXZhdGUgb25Nb3VzZURvd24oKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX01PVkUsdGhpcyx0aGlzLm9uTW91c2VNb3ZlKTtcclxuICAgICAgICBpZighdGhpcy5pc1VzZVNob3ZlbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlUG9zWD1MYXlhLnN0YWdlLm1vdXNlWDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6byg5qCH56e75YqoICovXHJcbiAgICBwcml2YXRlIG9uTW91c2VNb3ZlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKExheWEuc3RhZ2UubW91c2VYPHRoaXMubGFzdE1vdXNlUG9zWClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS54LT0yMDtcclxuICAgICAgICAgICAgdGhpcy5sYXN0TW91c2VQb3NYPUxheWEuc3RhZ2UubW91c2VYO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKExheWEuc3RhZ2UubW91c2VYPnRoaXMubGFzdE1vdXNlUG9zWClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS54Kz0yMDtcclxuICAgICAgICAgICAgdGhpcy5sYXN0TW91c2VQb3NYPUxheWEuc3RhZ2UubW91c2VYO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmdhbWUueD49MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZS54PTA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5nYW1lLng8PS0xMjE0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLng9LTEyMTQ7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKum8oOagh+aKrOi1tyAqL1xyXG4gICAgcHJpdmF0ZSBvbk1vdXNlVXAoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vZmYoTGF5YS5FdmVudC5NT1VTRV9NT1ZFLHRoaXMsdGhpcy5vbk1vdXNlTW92ZSk7XHJcbiAgICB9XHJcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirlt7HmlrnnjqnlrrYqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIC8qKuW3seaWueeKtuaAgeW8gOWniyAqL1xyXG4gICAgcHJpdmF0ZSBvd25QbGF5ZXJPcGVuKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2coXCLor7flhYjkv67lu7rpgZPot6/vvIFcIik7XHJcbiAgICAgICAgdGhpcy5tb25zdGVyQXJyYXk9bmV3IEFycmF5PE1vbnN0ZXI+KCk7XHJcbiAgICAgICAgdGhpcy5kaXJBcnJheT1uZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4oKTtcclxuICAgICAgICB0aGlzLm1vbnN0ZXJTaWduQXJyYXk9bmV3IEFycmF5PG51bWJlcj4oKTtcclxuICAgICAgICB0aGlzLmRlZmVuZGVySXRlbVVJQXJyYXk9bmV3IEFycmF5PERlZmVuZGVySXRlbVVJPigpO1xyXG4gICAgICAgIHRoaXMubW9uc3Rlckl0ZW1VSUFycmF5PW5ldyBBcnJheTxNb25zdGVySXRlbVVJPigpO1xyXG4gICAgICAgIHRoaXMucGxheWVyX21lbnVpdGVtLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICB0aGlzLmlzVXNlU2hvdmVsPWZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNNb25zdGVyTW92ZT1mYWxzZTtcclxuICAgICAgICB0aGlzLmNvdW50RG93bk51bT0zMDtcclxuICAgICAgICB0aGlzLnJvdW5kPTE7XHJcbiAgICAgICAgdGhpcy5tZW51QWRkRGVmZW5kZXJVSSgpO1xyXG4gICAgICAgIHRoaXMubWVudUFkZE1vbnN0ZXJVSSgpO1xyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZGVmZW5kZXJJZD0xO1xyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZGVmZW5kZXJDb2luPXRoaXMuZGVmZW5kZXJJdGVtVUlBcnJheVswXS5kYXRhLnByaWNlO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzX1NldE1vbnN0ZXJCb3JuUG9zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu257uR5a6aICovXHJcbiAgICBwcml2YXRlIGFkZEV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIExheWEuc3RhZ2Uub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vbk1vdXNlRG93bik7XHJcbiAgICAgICAgTGF5YS5zdGFnZS5vbihMYXlhLkV2ZW50Lk1PVVNFX1VQLHRoaXMsdGhpcy5vbk1vdXNlVXApO1xyXG4gICAgICAgIHRoaXMuc2hvdmVsYmcub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5vblNob3ZlbERvd24pO1xyXG4gICAgICAgIHRoaXMuYnRuX2J1aWxkLm9uKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLHRoaXMuY2xpY2tCdWlsZF9jaGVja0NyZWF0ZUNvbXBsZXRlKTtcclxuICAgICAgICB0aGlzLmJ0bl9idXkub24oTGF5YS5FdmVudC5NT1VTRV9ET1dOLHRoaXMsdGhpcy5jbGlja0J1eV9Nb25zdGVyKTtcclxuICAgIH0gXHJcblxyXG4gICAgLyoq54K55Ye76ZOy5a2Q5qGG5ou+6LW36ZOy5a2QICovXHJcbiAgICBwdWJsaWMgb25TaG92ZWxEb3duKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaXNVc2VTaG92ZWw9IXRoaXMuaXNVc2VTaG92ZWw7XHJcbiAgICAgICAgdGhpcy5zaG92ZWxfb2ZmLnZpc2libGU9IXRoaXMuc2hvdmVsX29mZi52aXNpYmxlO1xyXG4gICAgICAgIHRoaXMuc2hvdmVsX29uLnZpc2libGU9IXRoaXMuc2hvdmVsX29uLnZpc2libGU7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5ncm91cC5tb3VzZUVuYWJsZWQ9dGhpcy5pc1VzZVNob3ZlbDsgXHJcbiAgICB9XHJcblxyXG4gICAgLyoq6K6+572u5oCq5YW95Ye655Sf54K5ICovXHJcbiAgICBwcml2YXRlIHBsYXllcnNfU2V0TW9uc3RlckJvcm5Qb3MoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgLy/ojrflj5bmlYzmlrnnjqnlrrbnmoTmgKrlhb3lnKjmiJHmlrnojYnlnarljaDnmoTkvY3nva7vvIzlj5jmiJDlnJ/lnZdcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmVuZW15X01vbnN0ZXJCb3JuR3Jhc3MuY2hhbmdlSW1nKCk7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5lbmVteV9Nb25zdGVyQm9ybkdyYXNzLnNwLm9mZihMYXlhLkV2ZW50LkNMSUNLLFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZW5lbXlfTW9uc3RlckJvcm5HcmFzcyxXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmVuZW15X01vbnN0ZXJCb3JuR3Jhc3MuRXZlbnQxX2NoYW5nZVN0YXRlKTtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmVuZW15X01vbnN0ZXJCb3JuR3Jhc3MuY2hhbmdlSW1nKCk7XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5lbmVteV9Nb25zdGVyQm9ybkdyYXNzLnNwLm9mZihMYXlhLkV2ZW50LkNMSUNLLFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZW5lbXlfTW9uc3RlckJvcm5HcmFzcyxXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmVuZW15X01vbnN0ZXJCb3JuR3Jhc3MuRXZlbnQxX2NoYW5nZVN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirmo4Dmn6XmmK/lkKblu7rlpb3lpb3ot6/lvoQgKi9cclxuICAgIHByaXZhdGUgY2xpY2tCdWlsZF9jaGVja0NyZWF0ZUNvbXBsZXRlKCk6dm9pZCAgICAgICAgICAgICAgICAgIC8vLS3nvZHnu5xcclxuICAgIHtcclxuICAgICAgICBpZihXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheS5sZW5ndGgtMV09PVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLmdyYXNzQXJyYXlbMzldKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy90b2RvXHJcbiAgICAgICAgICAgIHRoaXMuc2hvdmVsYmcudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5idG5fYnVpbGQub2ZmKExheWEuRXZlbnQuTU9VU0VfRE9XTix0aGlzLEdhbWVDb250cm9sbGVyLkluc3RhbmNlLm9uU2hvdmVsRG93bik7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX2J1aWxkLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYnRuX2J1eS52aXNpYmxlPXRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubW9uc3Rlcl91aWdyb3VwLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5ncm91cC5tb3VzZUVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2coXCLkv67lu7rmiJDlip/vvIFcIik7XHJcbiAgICAgICAgICAgIC8v5Y+R6YCB5L+u5aW96Lev5b6E55qE6K+35rGC77yM562J5b6F5a+55pa556Gu5a6a5L+u5bu65aW96Lev5b6E55qE6K+35rGC77yM6ZyA562J5b6F5pe26Ze0XHJcbiAgICAgICAgICAgIC8vY2xpZW50LnNlbmQoKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy0t6ZyA6KaB5Zue6LCD5Ye95pWwXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+WQpuWImeWwseS4jeiDveeCueWHu+WFtuS7luWMuuWfn+eahOiNieWdqlxyXG4gICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi6K+35q2j56Gu5L+u5bu66YGT6Lev77yBXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKiroj5zljZXmoI/mt7vliqDlj6/pgInmi6nnmoTmgKrlhb0gKi8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy0t6ZyA6K+75Y+W6YWN572u5paH5Lu2XHJcbiAgICBwcml2YXRlIG1lbnVBZGRNb25zdGVyVUkoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7aTxDb25maWdNYW5hZ2VyLmlucy5nZXRDb25maWdMZW5ndGgoXCJtb25zdGVyXCIpO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBtb25zdGVySXRlbVVJPW5ldyBNb25zdGVySXRlbVVJKHRoaXMubW9uc3Rlcl91aWdyb3VwLDIwK2kqMTAwLDEwLGkrMSk7XHJcbiAgICAgICAgICAgIG1vbnN0ZXJJdGVtVUkuYnRuX2J1eS5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5idXlfTWVudU1vbnN0ZXIsW2ldKTtcclxuICAgICAgICAgICAgdGhpcy5tb25zdGVySXRlbVVJQXJyYXkucHVzaChtb25zdGVySXRlbVVJKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye76I+c5Y2V5qCP5Lit55qE5oCq5YW96LSt5LmwICovXHJcbiAgICBwcml2YXRlIGJ1eV9NZW51TW9uc3RlcihpOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmNvaW4tPXRoaXMubW9uc3Rlckl0ZW1VSUFycmF5W2ldLmRhdGEucHJpY2U7XHJcbiAgICAgICAgdGhpcy50ZXh0X2NvaW4udGV4dD1XZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmNvaW4udG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLm1vbnN0ZXJTaWduQXJyYXkucHVzaChpKzEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuavj+WbnuWQiOi0reS5sOaAqueJqeaVsOmHj+WKoOWFpeaVsOe7hOWPkemAgeivt+axgue7meaVjOaWuSAqL1xyXG4gICAgcHJpdmF0ZSBjbGlja0J1eV9Nb25zdGVyKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v5rOo6ZSA5Y+Y5Zyf5LqL5Lu277yM5rOo5YaM55Sf5oiQ6Ziy5b6h5aGU5LqL5Lu2XHJcbiAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5yZXN0R3Jhc3NBZGRFdmVudCgpO1xyXG4gICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDYwLHRoaXMsdGhpcy5jb3VudGRvd25PcGVuKTtcclxuICAgICAgICB0aGlzLnRleHRfdGltZXIudmlzaWJsZT10cnVlO1xyXG4gICAgICAgIHRoaXMuYnRuX2J1eS52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgIHRoaXMubW9uc3Rlcl91aWdyb3VwLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZWZlbmRlcl91aWdyb3VwLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmdyb3VwLm1vdXNlRW5hYmxlZD10cnVlO1xyXG4gICAgICAgIC8v5Y+R6YCB6LSt5Lmw5a6M5oiQ6K+35rGCXHJcbiAgICAgICAgLy9zZW5kKHRoaXMubW9uc3RlclNpZ25BcnJheSlcclxuICAgICAgICB0aGlzLmdldEVuZW15TW9uc3RlckFycmF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5o6l5pS25a+55pa55q+P5Zue5ZCI55qE5oCq54mp5pWw57uEICovXHJcbiAgICBwcml2YXRlIGdldEVuZW15TW9uc3RlckFycmF5KCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBtb25zdGVyU2lnbkFycmF5PVsxLDIsMSwxLDFdO1xyXG4gICAgICAgIGxldCBwbGF5ZXI9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllcjtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPG1vbnN0ZXJTaWduQXJyYXkubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBtb25zdGVyOk1vbnN0ZXI9TGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFwibW9uc3RlclwiLE1vbnN0ZXIpO1xyXG4gICAgICAgICAgICBtb25zdGVyLmluaXQocGxheWVyLmdyb3VwLHBsYXllci5lbmVteV9Nb25zdGVyQm9ybkdyYXNzLnNwLngscGxheWVyLmVuZW15X01vbnN0ZXJCb3JuR3Jhc3Muc3AueSxtb25zdGVyU2lnbkFycmF5W2ldKTtcclxuICAgICAgICAgICAgbW9uc3Rlci5hbmkudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5tb25zdGVyQXJyYXkucHVzaChtb25zdGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5q+P5Zue5ZCI5YCS6K6h5pe2ICovXHJcbiAgICBwdWJsaWMgY291bnRkb3duT3BlbigpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmNvdW50RG93bk51bS0tO1xyXG4gICAgICAgIHRoaXMudGV4dF90aW1lci50ZXh0PXRoaXMuY291bnREb3duTnVtLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgLy/lgJLorqHml7blrozmiJDlkI5cclxuICAgICAgICBpZih0aGlzLmNvdW50RG93bk51bT09MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnREb3duTnVtPTMwO1xyXG4gICAgICAgICAgICB0aGlzLnRleHRfdGltZXIudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICAgICAgTGF5YS50aW1lci5jbGVhcih0aGlzLHRoaXMuY291bnRkb3duT3Blbik7XHJcbiAgICAgICAgICAgIC8v5byA5aeL5oCq5YW95Ye65Ye7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNb25zdGVyTW92ZT10cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm1vbnN0ZXJDb3VudD0xO1xyXG4gICAgICAgICAgICAvL+WFiOiuqeesrOS4gOWPquaAqueJqei/kOWKqFxyXG4gICAgICAgICAgICB0aGlzLm9wZW5Nb25zdGVyTW92ZSgpO1xyXG4gICAgICAgICAgICAvL+W8gOWQr+WQjue7reaAqueJqeeUn+aIkOiuoeaXtuWZqFxyXG4gICAgICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgyNDAsdGhpcyx0aGlzLm9wZW5Nb25zdGVyTW92ZSk7XHJcbiAgICAgICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5zaG93RmxvYXRNc2coXCLnrKxcIit0aGlzLnJvdW5kK1wi5Zue5ZCIXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiroj5zljZXmoI/mt7vliqDlj6/pgInmi6nnmoTpmLLlvqHloZQgKi8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy0t6ZyA6K+75Y+W6YWN572u5paH5Lu2XHJcbiAgICBwcml2YXRlIG1lbnVBZGREZWZlbmRlclVJKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8Q29uZmlnTWFuYWdlci5pbnMuZ2V0Q29uZmlnTGVuZ3RoKFwiZGVmZW5kZXJcIik7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGRlZmVuZGVySXRlbVVJPW5ldyBEZWZlbmRlckl0ZW1VSSh0aGlzLmRlZmVuZGVyX3VpZ3JvdXAsMjAraSoxMDAsMzAsaSsxKTtcclxuICAgICAgICAgICAgZGVmZW5kZXJJdGVtVUkuc3Aub24oTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMuY2xpY2tfTWVudURlZmVuZGVyLFtpXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVmZW5kZXJJdGVtVUlBcnJheS5wdXNoKGRlZmVuZGVySXRlbVVJKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq54K55Ye76I+c5Y2V5qCP5Lit55qE6Ziy5b6h5aGUICovXHJcbiAgICBwcml2YXRlIGNsaWNrX01lbnVEZWZlbmRlcihpOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmRlZmVuZGVySWQ9aSsxO1xyXG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZGVmZW5kZXJDb2luPXRoaXMuZGVmZW5kZXJJdGVtVUlBcnJheVtpXS5kYXRhLnByaWNlO1xyXG4gICAgfVxyXG5cclxuICAgICAvKirmgKrnianlkI7nu63nlJ/miJDorqHml7blmaggKi9cclxuICAgICBwdWJsaWMgb3Blbk1vbnN0ZXJNb3ZlKCk6dm9pZFxyXG4gICAgIHtcclxuICAgICAgICAgaWYodGhpcy5tb25zdGVyQ291bnQ8PXRoaXMubW9uc3RlckFycmF5Lmxlbmd0aClcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICAgdGhpcy5tb25zdGVyQXJyYXlbdGhpcy5tb25zdGVyQ291bnQtMV0uYW5pLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICAgICAgIHRoaXMubW9uc3RlckFycmF5W3RoaXMubW9uc3RlckNvdW50LTFdLmFuaS5wbGF5KDAsdHJ1ZSk7XHJcbiAgICAgICAgICAgICB0aGlzLm1vbnN0ZXJfQ2FsTW92ZURpcih0aGlzLm1vbnN0ZXJBcnJheVt0aGlzLm1vbnN0ZXJDb3VudC0xXSk7XHJcbiAgICAgICAgICAgICB0aGlzLm1vbnN0ZXJBcnJheVt0aGlzLm1vbnN0ZXJDb3VudC0xXS5tb25zdGVyX09wZW5Nb3ZlQnlEaXIoKTtcclxuICAgICAgICAgICAgIHRoaXMubW9uc3RlckNvdW50Kys7XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgZWxzZVxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyKHRoaXMsdGhpcy5vcGVuTW9uc3Rlck1vdmUpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgfVxyXG5cclxuICAgIC8qKuiuoeeul+aJgOacieaAquWFveeahOWFrOWFsei3r+W+hOaWueWQkSAqL1xyXG4gICAgcHVibGljIG1vbnN0ZXJfQ2FsTW92ZURpcihtb25zdGVyOk1vbnN0ZXIpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBsZXQgZGlyWCxkaXJZO1xyXG4gICAgICAgIGZvcihsZXQgaT0xO2k8PVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5Lmxlbmd0aC0xO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ldLnNwLnktV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaS0xXS5zcC55PT0wKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZihXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtpXS5zcC54LVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ktMV0uc3AueD09MTAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpclg9MTtcclxuICAgICAgICAgICAgICAgICAgICBkaXJZPTA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyWD0tMTtcclxuICAgICAgICAgICAgICAgICAgICBkaXJZPTA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZihXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtpXS5zcC54LVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ktMV0uc3AueD09MClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueS1XZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtpLTFdLnNwLnk9PTEwMClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJYPTA7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyWT0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpclg9MDtcclxuICAgICAgICAgICAgICAgICAgICBkaXJZPS0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGlyQXJyYXkucHVzaChbZGlyWCxkaXJZXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxufVxyXG4iLCJpbXBvcnQgR3Jhc3MgZnJvbSBcIi4vUHJlZmFiL0dyYXNzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFzc0ZhY3Rvcnkge1xyXG4gICAgLyoq6I2J5Z2q5pWw57uEICovXHJcbiAgICBwdWJsaWMgZ3Jhc3NBcnJheTpBcnJheTxHcmFzcz47XHJcbiAgICAvKirlnJ/lnZHmlbDnu4QgKi9cclxuICAgIHB1YmxpYyBtdWRBcnJheTpBcnJheTxHcmFzcz47XHJcbiAgICBjb25zdHJ1Y3Rvcih2aWV3OkxheWEuU3ByaXRlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZ3Jhc3NBcnJheSA9IG5ldyBBcnJheTxHcmFzcz4oKTtcclxuICAgICAgICB0aGlzLm11ZEFycmF5PW5ldyBBcnJheTxHcmFzcz4oKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUdyYXNzQXJyYXkodmlldyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKueUn+aIkOiNieWdqiAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVHcmFzc0FycmF5KHZpZXc6TGF5YS5TcHJpdGUpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBmb3IobGV0IGk9MDtpPDc7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqPTA7ajwxMDtqKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBncmFzczpHcmFzcztcclxuICAgICAgICAgICAgICAgIGlmKGklMj09MClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBncmFzcz1uZXcgR3Jhc3MoaiUyKzEsdmlldyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3Jhc3M9bmV3IEdyYXNzKChqKzEpJTIrMSx2aWV3KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZ3Jhc3NBcnJheS5wdXNoKGdyYXNzKTtcclxuICAgICAgICAgICAgICAgIGdyYXNzLlBvcyhpLGopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICBcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi9HYW1lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IE1vbnN0ZXJDb25maWcgZnJvbSBcIi4uLy4uL0RhdGEvQ29uZmlnL01vc250ZXJDb25maWdyXCI7XHJcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbnN0ZXJ7XHJcbiAgICAvKirliqjnlLsgKi9cclxuICAgIHB1YmxpYyBhbmk6TGF5YS5BbmltYXRpb247XHJcbiAgICAvKirooYDph48gKi9cclxuICAgIHB1YmxpYyBjdXJySFA6bnVtYmVyO1xyXG4gICAgLyoq6KGA6YeP5Zu+6IOM5pmvICovXHJcbiAgICBwdWJsaWMgaHBiZzpMYXlhLlNwcml0ZTtcclxuICAgIC8qKuihgOmHj+WbviAqL1xyXG4gICAgcHVibGljIGhwU1A6TGF5YS5TcHJpdGU7XHJcbiAgICAvKirmgKrlhb3phY3nva7mlbDmja4gKi9cclxuICAgIHB1YmxpYyBkYXRhOk1vbnN0ZXJDb25maWc7XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwdWJsaWMgaW5pdCh2aWV3OkxheWEuU3ByaXRlLHg6bnVtYmVyLHk6bnVtYmVyLG51bTpudW1iZXIpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRhdGE9Q29uZmlnTWFuYWdlci5pbnMuZ2V0Q29uZmlnQnlJZChcIm1vbnN0ZXJcIixudW0pO1xyXG4gICAgICAgIHRoaXMuY3VyckhQPXRoaXMuZGF0YS5ocDtcclxuICAgICAgICB0aGlzLmFuaT1uZXcgTGF5YS5BbmltYXRpb24oKTtcclxuICAgICAgICB0aGlzLmFuaS56T3JkZXI9MTtcclxuICAgICAgICB0aGlzLmFuaS5wb3MoeCx5KTtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuYW5pKTtcclxuXHJcbiAgICAgICAgdGhpcy5ocGJnPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuaHBiZy5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL2hwYmcucG5nXCIpKTtcclxuICAgICAgICB0aGlzLmFuaS5hZGRDaGlsZCh0aGlzLmhwYmcpO1xyXG4gICAgICAgIHRoaXMuaHBiZy5hdXRvU2l6ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuaHBiZy5wb3MoMCwtMTApO1xyXG5cclxuICAgICAgICB0aGlzLmhwU1A9bmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5ocFNQLmxvYWRJbWFnZShcImdhbWUvaHAucG5nXCIpO1xyXG4gICAgICAgIHRoaXMuaHBiZy5hZGRDaGlsZCh0aGlzLmhwU1ApO1xyXG4gICAgICAgIHRoaXMuaHBTUC5wb3MoMCwwKTtcclxuICAgIH1cclxuICAgIC8qKuagueaNruaWueWQkemAieaLqeWKqOeUuyAqL1xyXG4gICAgcHVibGljIHR5cGVBbmltYXRpb24oZGlyZWN0aW9uOnN0cmluZyk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuYW5pLnN0b3AoKTtcclxuICAgICAgICB0aGlzLmFuaS5sb2FkQW5pbWF0aW9uKFwiR2FtZS9hbmlzL1wiK3RoaXMuZGF0YS5tb25zdGVyTmFtZStcIl9cIitkaXJlY3Rpb24rXCIuYW5pXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuW8gOWQr+aAquWFveenu+WKqCAqL1xyXG4gICAgcHVibGljIG1vbnN0ZXJfT3Blbk1vdmVCeURpcigpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLHRoaXMsdGhpcy5tb25zdGVyX01vdmUsWzBdKTtcclxuICAgICAgICB0aGlzLnR5cGVBbmltYXRpb24odGhpcy5nZXRBbmltQnlEaXIoR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UuZGlyQXJyYXlbMF1bMF0sR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UuZGlyQXJyYXlbMF1bMV0pKTtcclxuICAgICAgICB0aGlzLmFuaS5wbGF5KDAsdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5oCq5YW956e75YqoICovXHJcbiAgICBwcml2YXRlIG1vbnN0ZXJfTW92ZShpOm51bWJlcik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKChNYXRoLmFicyh0aGlzLmFuaS54LVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ldLnNwLngpPD0xMDAmJih0aGlzLmFuaS55LVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W2ldLnNwLnk9PTApKXx8XHJcbiAgICAgICAgICAgKE1hdGguYWJzKHRoaXMuYW5pLnktV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueSk8PTEwMCYmKHRoaXMuYW5pLngtV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueD09MCkpKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlRGlzdGFuY2UoMSxHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVswXSxHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVsxXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pLng9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueCtHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVswXSoxMDA7XHJcbiAgICAgICAgICAgIHRoaXMuYW5pLnk9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbaV0uc3AueStHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5kaXJBcnJheVtpXVsxXSoxMDA7XHJcbiAgICAgICAgICAgIExheWEudGltZXIuY2xlYXIodGhpcyx0aGlzLm1vbnN0ZXJfTW92ZSk7XHJcbiAgICAgICAgICAgIGlmKGk8V2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXkubGVuZ3RoLTIpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLm1vbnN0ZXJfTW92ZSxbaSsxXSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGlyPXRoaXMuZ2V0QW5pbUJ5RGlyKEdhbWVDb250cm9sbGVyLkluc3RhbmNlLmRpckFycmF5W2krMV1bMF0sR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UuZGlyQXJyYXlbaSsxXVsxXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVBbmltYXRpb24oZGlyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5pLnBsYXkoMCx0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ29HZXRDcnlzdGFsUm9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKuagueaNruaAquWFveiuoeeul+i3r+W+hOaWueWQkeWGs+WumuWKqOeUu+aSreaUviAqL1xyXG4gICAgcHJpdmF0ZSBnZXRBbmltQnlEaXIoeDpudW1iZXIseTpudW1iZXIpOnN0cmluZ1xyXG4gICAge1xyXG4gICAgICAgIGxldCBkaXI7XHJcbiAgICAgICAgaWYoeD09MSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpcj1cInJpZ2h0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoeD09LTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXI9XCJsZWZ0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHk9PTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXI9XCJkb3duXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYoeT09LTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBkaXI9XCJ1cFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGlyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuW8gOWni+WJjeW+gOaKouWkuuawtOaZtueahOmBk+i3ryAqL1xyXG4gICAgcHJpdmF0ZSBnb0dldENyeXN0YWxSb2FkKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBkaXJYO1xyXG4gICAgICAgIGxldCB0eXBlO1xyXG4gICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY2FtcD09XCJyZWRcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpclg9MTtcclxuICAgICAgICAgICAgdHlwZT1cInJpZ2h0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGRpclg9LTE7XHJcbiAgICAgICAgICAgIHR5cGU9XCJsZWZ0XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLm1vdmVEaXN0YW5jZSxbMSxkaXJYLDBdKTtcclxuICAgICAgICB0aGlzLnR5cGVBbmltYXRpb24odHlwZSk7XHJcbiAgICAgICAgdGhpcy5hbmkucGxheSgwLHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuenu+WKqOi3neemuyAqL1xyXG4gICAgcHJpdmF0ZSBtb3ZlRGlzdGFuY2Uoc3BlZWQ6bnVtYmVyLGRpclg6bnVtYmVyLGRpclk6bnVtYmVyKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5hbmkueCs9c3BlZWQqZGlyWDtcclxuICAgICAgICB0aGlzLmFuaS55Kz1zcGVlZCpkaXJZO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaKouWkuuawtOaZtueahOmBk+i3r+S4iuajgOa1i+WvueaWueaAquWFvSAqL1xyXG4gICAgcHJpdmF0ZSBjaGVja0VuZW15KCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKirplIDmr4FNb25zdGVyICovXHJcbiAgICBwdWJsaWMgRGVzdHJveSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYW5pLnZpc2libGU9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hbmkueT0tMTAwMDtcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIm1vbnN0ZXJcIix0aGlzKTtcclxuICAgIH1cclxufSIsImltcG9ydCBNb25zdGVyIGZyb20gXCIuLi9Nb25zdGVyXCI7XHJcbmltcG9ydCBUb29sIGZyb20gXCIuLi8uLi8uLi9Ub29sL1Rvb2xcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1bGxldHtcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgY29uc3RydWN0b3IoKVxyXG4gICAge1xyXG5cclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQodmlldzpMYXlhLlNwcml0ZSx4LHkpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9idWxsZXQucG5nXCIpKTtcclxuICAgICAgICB0aGlzLnNwLmF1dG9TaXplPXRydWU7XHJcbiAgICAgICAgdGhpcy5zcC5wb3MoeCx5KTtcclxuICAgICAgICB0aGlzLnNwLnpPcmRlcj0zO1xyXG4gICAgICAgIHZpZXcuYWRkQ2hpbGQodGhpcy5zcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq6L+96ZqP5oCq54mp5pa55ZCR6L+b6KGM56e75Yqo5Y+R5bCEICovXHJcbiAgICBwdWJsaWMgZm9sbG93TW9uc3Rlcihtb25zdGVyOk1vbnN0ZXIsc3BlZWQ6bnVtYmVyLGRhbWFnZTpudW1iZXIpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZihUb29sLmdldERpc3RhbmNlKHRoaXMuc3AsbW9uc3Rlci5hbmkpPj00MClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBkaXJYPShtb25zdGVyLmFuaS54LXRoaXMuc3AueCkvVG9vbC5nZXREaXN0YW5jZSh0aGlzLnNwLG1vbnN0ZXIuYW5pKTtcclxuICAgICAgICAgICAgbGV0IGRpclk9KG1vbnN0ZXIuYW5pLnktdGhpcy5zcC55KS9Ub29sLmdldERpc3RhbmNlKHRoaXMuc3AsbW9uc3Rlci5hbmkpO1xyXG4gICAgICAgICAgICB0aGlzLnNwLngrPWRpclgqc3BlZWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3AueSs9ZGlyWSpzcGVlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbW9uc3Rlci5jdXJySFAtPWRhbWFnZTtcclxuICAgICAgICAgICAgbW9uc3Rlci5ocFNQLndpZHRoLT1kYW1hZ2UvbW9uc3Rlci5kYXRhLmhwKm1vbnN0ZXIuaHBTUC53aWR0aDtcclxuICAgICAgICAgICAgaWYobW9uc3Rlci5jdXJySFA8PTApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1vbnN0ZXIuRGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8v56Kw5pKe5Yiw5oCq5YW9XHJcbiAgICAgICAgICAgIHRoaXMuRGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirplIDmr4HlrZDlvLkgKi9cclxuICAgIHByaXZhdGUgRGVzdHJveSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc3AudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcImJ1bGxldFwiLHRoaXMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IE1vbnN0ZXIgZnJvbSBcIi4uL01vbnN0ZXJcIjtcclxuaW1wb3J0IFRvb2wgZnJvbSBcIi4uLy4uLy4uL1Rvb2wvVG9vbFwiO1xyXG5pbXBvcnQgQnVsbGV0IGZyb20gXCIuL0J1bGxldFwiO1xyXG5pbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4uL0dhbWVDb250cm9sbGVyXCI7XHJcbmltcG9ydCBXZWxDb21lQ29udHJvbGxlciBmcm9tIFwiLi4vLi4vV2VsQ29tZS9XZWxDb21lQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgRGVmZW5kZXJDb25maWcgZnJvbSBcIi4uLy4uLy4uL0RhdGEvQ29uZmlnL0RlZmVuZGVyQ29uZmlnXCI7XHJcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlZmVuZGVye1xyXG4gICAgLyoq57K+54G1ICovXHJcbiAgICBwdWJsaWMgc3A6TGF5YS5TcHJpdGU7XHJcbiAgICAvKirmraPlr7nkuIDkuKrnm67moIfov5vooYzlsITlh7sgKi9cclxuICAgIHByaXZhdGUgaXNTaG9vdGluZ0J5T25lOmJvb2xlYW47XHJcbiAgICAvKirmraPlnKjlsITlh7vnmoTmgKrlhb0gKi9cclxuICAgIHByaXZhdGUgY3Vyck1vbnN0ZXI6TW9uc3RlcjtcclxuICAgIC8qKumYsuW+oeWhlOmFjee9ruaVsOaNriAqL1xyXG4gICAgcHVibGljIGRhdGE6RGVmZW5kZXJDb25maWc7XHJcbiAgICAvKip2aWV3ICovXHJcbiAgICBwcml2YXRlIHZpZXc6TGF5YS5TcHJpdGU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG5cclxuICAgIC8qKuWIneWni+WMliAqL1xyXG4gICAgcHJpdmF0ZSBpbml0KHZpZXc6TGF5YS5TcHJpdGUseCx5LG51bSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGF0YT1Db25maWdNYW5hZ2VyLmlucy5nZXRDb25maWdCeUlkKFwiZGVmZW5kZXJcIixudW0pO1xyXG4gICAgICAgIHRoaXMudmlldz12aWV3O1xyXG4gICAgICAgIHRoaXMuaXNTaG9vdGluZ0J5T25lPWZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9cIit0aGlzLmRhdGEuZGVmZW5kZXJOYW1lK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgdGhpcy5zcC5hdXRvU2l6ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuc3AucG9zKHgseSk7XHJcbiAgICAgICAgdGhpcy5zcC56T3JkZXI9MjtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG4gICAgICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsdGhpcyx0aGlzLmNoZWNrTW9uc3RlckRpc3RhbmNlLFtHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5tb25zdGVyQXJyYXldKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuiMg+WbtOajgOa1iyAqL1xyXG4gICAgcHVibGljIGNoZWNrTW9uc3RlckRpc3RhbmNlKG1vbnN0ZXJBcnJheTpBcnJheTxNb25zdGVyPik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKEdhbWVDb250cm9sbGVyLkluc3RhbmNlLmlzTW9uc3Rlck1vdmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzU2hvb3RpbmdCeU9uZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYoKFRvb2wuZ2V0RGlzdGFuY2UodGhpcy5zcCx0aGlzLmN1cnJNb25zdGVyLmFuaSk+PXRoaXMuZGF0YS5kaWMpfHx0aGlzLmN1cnJNb25zdGVyLmN1cnJIUDw9MClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLmNsZWFyKHRoaXMsdGhpcy5jcmVhdGVCdWxsZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTaG9vdGluZ0J5T25lPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPG1vbnN0ZXJBcnJheS5sZW5ndGg7aSsrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKFRvb2wuZ2V0RGlzdGFuY2UodGhpcy5zcCxtb25zdGVyQXJyYXlbaV0uYW5pKTx0aGlzLmRhdGEuZGljKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBMYXlhLnRpbWVyLmZyYW1lTG9vcCh0aGlzLmRhdGEuYXR0YWNrRnJlcXVlbmN5KjYwLHRoaXMsdGhpcy5jcmVhdGVCdWxsZXQsW21vbnN0ZXJBcnJheVtpXV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3Vyck1vbnN0ZXI9bW9uc3RlckFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTaG9vdGluZ0J5T25lPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKueUn+aIkOWtkOW8uSAqL1xyXG4gICAgcHJpdmF0ZSBjcmVhdGVCdWxsZXQobW9uc3Rlcik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBidWxsZXQ9TGF5YS5Qb29sLmdldEl0ZW1CeUNsYXNzKFwiYnVsbGV0XCIsQnVsbGV0KTtcclxuICAgICAgICBidWxsZXQuaW5pdCh0aGlzLnZpZXcsdGhpcy5zcC54LHRoaXMuc3AueSk7XHJcbiAgICAgICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMSxidWxsZXQsYnVsbGV0LmZvbGxvd01vbnN0ZXIsW21vbnN0ZXIsdGhpcy5kYXRhLmF0dGFja1NwZWVkLHRoaXMuZGF0YS5wb3dlcl0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKumUgOavgURlZmVuZGVyICovXHJcbiAgICBwdWJsaWMgRGVzdHJveSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLnRpbWVyLmNsZWFyQWxsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc3AudmlzaWJsZT1mYWxzZTtcclxuICAgICAgICB0aGlzLnNwLnk9LTEwMDA7XHJcbiAgICAgICAgTGF5YS5Qb29sLnJlY292ZXIoXCJkZWZlbmRlclwiLHRoaXMpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IENvbmZpZ01hbmFnZXIgZnJvbSBcIi4uLy4uLy4uL0NvcmUvQ29uZmlnTWFuYWdlclwiO1xyXG5pbXBvcnQgRGVmZW5kZXJDb25maWcgZnJvbSBcIi4uLy4uLy4uL0RhdGEvQ29uZmlnL0RlZmVuZGVyQ29uZmlnXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWZlbmRlckl0ZW1VSXtcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgLyoq6YeR5biB5paH5pysICovXHJcbiAgICBwdWJsaWMgY29pblRleHQ6TGF5YS5UZXh0O1xyXG4gICAgLyoq6Ziy5b6h5aGU6YWN572u5pWw5o2uICovXHJcbiAgICBwdWJsaWMgZGF0YTpEZWZlbmRlckNvbmZpZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2aWV3OkxheWEuU3ByaXRlLHg6bnVtYmVyLHk6bnVtYmVyLG51bTpudW1iZXIpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5pbml0KHZpZXcseCx5LG51bSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQodmlldzpMYXlhLlNwcml0ZSx4LHksbnVtOm51bWJlcik6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuZGF0YT1Db25maWdNYW5hZ2VyLmlucy5nZXRDb25maWdCeUlkKFwiZGVmZW5kZXJcIixudW0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AuZ3JhcGhpY3MuZHJhd1RleHR1cmUoTGF5YS5sb2FkZXIuZ2V0UmVzKFwiZ2FtZS9cIit0aGlzLmRhdGEuZGVmZW5kZXJOYW1lK1wiLnBuZ1wiKSk7XHJcbiAgICAgICAgdGhpcy5zcC5hdXRvU2l6ZT10cnVlO1xyXG4gICAgICAgIHRoaXMuc3AucG9zKHgseSk7XHJcbiAgICAgICAgdGhpcy5zcC56T3JkZXI9MjtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG5cclxuICAgICAgICB0aGlzLmNvaW5UZXh0PW5ldyBMYXlhLlRleHQoKTtcclxuICAgICAgICB0aGlzLmNvaW5UZXh0LnBvcygwLHRoaXMuc3AuaGVpZ2h0KzIwKTtcclxuICAgICAgICB0aGlzLmNvaW5UZXh0LnRleHQ9dGhpcy5kYXRhLnByaWNlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5zcC5hZGRDaGlsZCh0aGlzLmNvaW5UZXh0KTtcclxuICAgIH1cclxufSIsImltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi4vR2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IERlZmVuZGVyIGZyb20gXCIuL0RlZmVuZGVyXCI7XHJcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xyXG5pbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uLy4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYXNze1xyXG4gICAgLyoq5qiq5Z2Q5qCH5L2N572uICovXHJcbiAgICBwdWJsaWMgWDpudW1iZXI7XHJcbiAgICAvKirnurXlnZDmoIfkvY3nva4gKi9cclxuICAgIHB1YmxpYyBZOm51bWJlcjtcclxuICAgIC8qKueyvueBtSAqL1xyXG4gICAgcHVibGljIHNwOkxheWEuU3ByaXRlO1xyXG4gICAgLyoq5piv5ZCm5Li65Zyf5Z2X5qCH6K6wICovXHJcbiAgICBwdWJsaWMgaXNNdWQ6Ym9vbGVhbjtcclxuICAgIC8qKuiNieWdquWbvuexu+WeiyAqL1xyXG4gICAgcHJpdmF0ZSBudW06bnVtYmVyO1xyXG4gICAgLyoqdmlldyAqL1xyXG4gICAgcHJpdmF0ZSB2aWV3OkxheWEuU3ByaXRlO1xyXG4gICAgY29uc3RydWN0b3IobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuaW5pdChudW0sdmlldyk7XHJcbiAgICAgICAgdGhpcy52aWV3PXZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yid5aeL5YyWICovXHJcbiAgICBwcml2YXRlIGluaXQobnVtOm51bWJlcix2aWV3OkxheWEuU3ByaXRlKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5udW09bnVtO1xyXG4gICAgICAgIHRoaXMuaXNNdWQ9ZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zcD1uZXcgTGF5YS5TcHJpdGUoKTtcclxuICAgICAgICB0aGlzLnNwLmdyYXBoaWNzLmRyYXdUZXh0dXJlKExheWEubG9hZGVyLmdldFJlcyhcImdhbWUvZ3Jhc3NcIitudW0rXCIucG5nXCIpKTtcclxuICAgICAgICB2aWV3LmFkZENoaWxkKHRoaXMuc3ApO1xyXG4gICAgICAgIHRoaXMuc3AuYXV0b1NpemU9dHJ1ZTtcclxuICAgICAgICB0aGlzLnNwLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLkV2ZW50MV9jaGFuZ2VTdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5qC85a2Q5L2N572uICovXHJcbiAgICBwdWJsaWMgUG9zKFg6bnVtYmVyLFk6bnVtYmVyKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5YPVk7XHJcbiAgICAgICAgdGhpcy5ZPVg7XHJcbiAgICAgICAgdGhpcy5zcC5wb3MoMTAwKlksMjUrMTAwKlgpO1xyXG4gICAgfVxyXG4gICAgLyoq5rOo5YaM56ys5LiA56eN5LqL5Lu277ya6L2s5o2i54q25oCB77yM5qCH6K6w5piv5ZCm5Li65Zyf5Z2XICovXHJcbiAgICBwdWJsaWMgRXZlbnQxX2NoYW5nZVN0YXRlKCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIC8v5aaC5p6c5piv6I2J5Z2qLOWImeWPmOaIkOWcn+Wdl1xyXG4gICAgICAgIGlmKCF0aGlzLmlzTXVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/lpoLmnpzmraTojYnlnarlnKjkuIrkuIDkuKrmnIDlkI7kuIDmrKHorrDlvZXlnJ/lnZfnmoTlkajlm7TnmoTor53vvIzliJnlj6/lj5jkuLrlnJ/lnZdcclxuICAgICAgICAgICAgbGV0IG11ZHNwPVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5W1dlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5Lmxlbmd0aC0xXS5zcDtcclxuICAgICAgICAgICAgaWYoKE1hdGguYWJzKG11ZHNwLngtdGhpcy5zcC54KT09MTAwJiYobXVkc3AueT09dGhpcy5zcC55KSl8fFxyXG4gICAgICAgICAgICAgICAoTWF0aC5hYnMobXVkc3AueS10aGlzLnNwLnkpPT0xMDAmJihtdWRzcC54PT10aGlzLnNwLngpKSlcclxuICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VJbWcoKTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIC8v5ZCm5YiZ5bCx5LiN6IO954K55Ye75YW25LuW5Yy65Z+f55qE6I2J5Z2qXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi6K+35Zyo5Zyf5Z2X5ZGo5Zu05bu656uL6YGT6Lev77yBXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUltZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirliIfmjaLlm77niYcgKi9cclxuICAgIHB1YmxpYyBjaGFuZ2VJbWcoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5jbGVhcigpO1xyXG4gICAgICAgIC8v5aaC5p6c5piv6I2J5Z2qLOWImeWPmOaIkOWcn+Wdl1xyXG4gICAgICAgIGlmKCF0aGlzLmlzTXVkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL211ZC5wbmdcIikpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVkPXRydWU7XHJcbiAgICAgICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZmFjLm11ZEFycmF5WzBdIT1udWxsKVxyXG4gICAgICAgICAgICB7ICAgXHJcbiAgICAgICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheVtXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheS5sZW5ndGgtMV0uc3AubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcC5tb3VzZUVuYWJsZWQ9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXkucHVzaCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZS8v5aaC5p6c5piv5Zyf5Z2XLOWImeWPmOaIkOiNieWdqlxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5zcC5ncmFwaGljcy5kcmF3VGV4dHVyZShMYXlhLmxvYWRlci5nZXRSZXMoXCJnYW1lL2dyYXNzXCIrdGhpcy5udW0rXCIucG5nXCIpKTtcclxuICAgICAgICAgICAgdGhpcy5pc011ZD1mYWxzZTtcclxuICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXlbV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMubXVkQXJyYXkubGVuZ3RoLTJdLnNwLm1vdXNlRW5hYmxlZD10cnVlO1xyXG4gICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5tdWRBcnJheS5wb3AoKTtcclxuICAgICAgICB9ICAgICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirms6jlhoznrKzkuoznp43kuovku7bvvJrlvoDojYnlnarkuIrmt7vliqDngq7loZQgKi9cclxuICAgIHB1YmxpYyBFdmVudDJfQWRkRGVmZW5kZXIoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGRlZmVuZGVyPUxheWEuUG9vbC5nZXRJdGVtQnlDbGFzcyhcImRlZmVuZGVyXCIsRGVmZW5kZXIpO1xyXG4gICAgICAgIGRlZmVuZGVyLmluaXQodGhpcy52aWV3LHRoaXMuc3AueCx0aGlzLnNwLnksV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5kZWZlbmRlcklkKTtcclxuICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmNvaW4tPVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuZGVmZW5kZXJDb2luO1xyXG4gICAgICAgIEdhbWVDb250cm9sbGVyLkluc3RhbmNlLnRleHRfY29pbi50ZXh0PVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY29pbi50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuc3Aub2ZmKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLkV2ZW50Ml9BZGREZWZlbmRlcik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4uLy4uL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IE1vbnN0ZXJDb25maWcgZnJvbSBcIi4uLy4uLy4uL0RhdGEvQ29uZmlnL01vc250ZXJDb25maWdyXCI7XHJcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbnN0ZXJJdGVtVUl7XHJcbiAgICAvKirnsr7ngbUgKi9cclxuICAgIHByaXZhdGUgc3A6TGF5YS5TcHJpdGU7XHJcbiAgICAvKirotK3kubDmjInpkq4gKi9cclxuICAgIHB1YmxpYyBidG5fYnV5OkxheWEuU3ByaXRlO1xyXG4gICAgLyoq6YeR5biB5paH5pysICovXHJcbiAgICBwdWJsaWMgY29pblRleHQ6TGF5YS5UZXh0O1xyXG4gICAgLyoq5oCq5YW96YWN572u5pWw5o2uICovXHJcbiAgICBwdWJsaWMgZGF0YTpNb25zdGVyQ29uZmlnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZpZXc6TGF5YS5TcHJpdGUseDpudW1iZXIseTpudW1iZXIsbnVtOm51bWJlcilcclxuICAgIHtcclxuICAgICAgICB0aGlzLmluaXQodmlldyx4LHksbnVtKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliJ3lp4vljJYgKi9cclxuICAgIHByaXZhdGUgaW5pdCh2aWV3OkxheWEuU3ByaXRlLHg6bnVtYmVyLHk6bnVtYmVyLG51bTpudW1iZXIpOnZvaWRcclxuICAgIHtcclxuICAgICAgICB0aGlzLmRhdGE9Q29uZmlnTWFuYWdlci5pbnMuZ2V0Q29uZmlnQnlJZChcIm1vbnN0ZXJcIixudW0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwPW5ldyBMYXlhLlNwcml0ZSgpO1xyXG4gICAgICAgIHRoaXMuc3AubG9hZEltYWdlKFwiZ2FtZS9hbmkvXCIrdGhpcy5kYXRhLm1vbnN0ZXJOYW1lK1wiX2Rvd24xLnBuZ1wiKTtcclxuICAgICAgICB0aGlzLnNwLndpZHRoPTUwO1xyXG4gICAgICAgIHRoaXMuc3AuaGVpZ2h0PTYwO1xyXG4gICAgICAgIHRoaXMuc3AucG9zKHgseSk7XHJcbiAgICAgICAgdmlldy5hZGRDaGlsZCh0aGlzLnNwKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2luVGV4dD1uZXcgTGF5YS5UZXh0KCk7XHJcbiAgICAgICAgdGhpcy5jb2luVGV4dC5wb3MoMCx0aGlzLnNwLmhlaWdodCsxMCk7XHJcbiAgICAgICAgdGhpcy5jb2luVGV4dC50ZXh0PXRoaXMuZGF0YS5wcmljZS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuY29pblRleHQuYWxpZ249XCJtaWRkbGVcIjtcclxuICAgICAgICB0aGlzLnNwLmFkZENoaWxkKHRoaXMuY29pblRleHQpO1xyXG5cclxuICAgICAgICB0aGlzLmJ0bl9idXk9bmV3IExheWEuU3ByaXRlKCk7XHJcbiAgICAgICAgdGhpcy5idG5fYnV5LmxvYWRJbWFnZShcImdhbWUvYnV5LnBuZ1wiKTtcclxuICAgICAgICB0aGlzLmJ0bl9idXkucG9zKDAsdGhpcy5zcC5oZWlnaHQrMjApO1xyXG4gICAgICAgIHRoaXMuc3AuYWRkQ2hpbGQodGhpcy5idG5fYnV5KTtcclxuICAgIH1cclxuXHJcbn0iLCJpbXBvcnQgU29ja2V0SGFuZGxlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvU29ja2V0SGFuZGxlclwiO1xyXG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xyXG5cclxuLyoqXHJcbiAqIOW9k+aJgOacieS6uumDveWKoOi9veWlveS6huS5i+WQjui/lOWbnua4uOaIj+W8gOWni+a2iOaBryBcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9uTG9hZEhhbmRsZXIgZXh0ZW5kcyBTb2NrZXRIYW5kbGVye1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihjYWxsZXI6YW55LGNhbGxiYWNrOkZ1bmN0aW9uID0gbnVsbCl7XHJcbiAgICAgICAgc3VwZXIoY2FsbGVyLGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICAgcHVibGljIGV4cGxhaW4oZGF0YSk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIHZhciBSZXNPbkxvYWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlc09uTG9hZFwiKTtcclxuICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSBSZXNPbkxvYWQuZGVjb2RlKGRhdGEpO1xyXG4gICAgICAgIHN1cGVyLmV4cGxhaW4obWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgICAvKirlpITnkIbmlbDmja4gKi9cclxuICAgIHByb3RlY3RlZCBzdWNjZXNzKG1lc3NhZ2UpOnZvaWRcclxuICAgIHsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgc3VwZXIuc3VjY2VzcyhtZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG4gICAgIiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XHJcbmltcG9ydCBDb25maWdNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL0NvbmZpZ01hbmFnZXJcIjtcclxuaW1wb3J0IFdlbENvbWVDb250cm9sbGVyIGZyb20gXCIuLi9XZWxDb21lL1dlbENvbWVDb250cm9sbGVyXCI7XHJcbmltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL05ldC9XZWJTb2NrZXRNYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFByb3RvY29sIH0gZnJvbSBcIi4uLy4uL0NvcmUvQ29uc3QvR2FtZUNvbmZpZ1wiO1xyXG5pbXBvcnQgT25Mb2FkSGFuZGxlciBmcm9tIFwiLi4vR2FtZS9oYW5kbGVyL09uTG9hZEhhbmRsZXJcIjtcclxuaW1wb3J0IENsaWVudFNlbmRlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvQ2xpZW50U2VuZGVyXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmdDb250cm9sbGVyIGV4dGVuZHMgdWkuUGxheWVyTG9hZGluZ1VJe1xyXG4gICAgLyoq5piv5ZCm6L+e5o6l5LiK5pyN5Yqh5ZmoICovXHJcbiAgICBwcml2YXRlIGlzQ29ubmVjdFNlcnZlciA6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25FbmFibGUoKXtcclxuICAgICAgICB0aGlzLmlzQ29ubmVjdFNlcnZlciA9IGZhbHNlOyBcclxuICAgICAgICB0aGlzLnNlbGVjdE1vZGUoKTtcclxuICAgICAgICB0aGlzLmxvYWRBc3NldHMoKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKirkuovku7bnu5HlrpogKi9cclxuICAgIHByaXZhdGUgYWRkRXZlbnRzKCkgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19PTkxPQUQsbmV3IE9uTG9hZEhhbmRsZXIodGhpcyx0aGlzLm9uTG9hZEhhbmRsZXIpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUV2ZW50cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnVucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19PTkxPQUQsdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq56Gu5a6a5ri45oiP5qih5byP77yM5pi+56S6546p5a625L+h5oGv77yM55WM6Z2i5LiK5pa55pi+56S657qi5pa5546p5a6277yM5LiL5pa55pi+56S66JOd5pa5546p5a62Ki9cclxuICAgIHByaXZhdGUgc2VsZWN0TW9kZSgpOnZvaWRcclxuICAgIHtcclxuICAgICAgICBpZihXZWxDb21lQ29udHJvbGxlci5pbnMubW9kZT09XCIxVjFcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8NTtpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVkX2dyb3VwLl9jaGlsZHJlbltpXS52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibHVlX2dyb3VwLl9jaGlsZHJlbltpXS52aXNpYmxlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVkX3BsYXllcl8zLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5ibHVlX3BsYXllcl8zLnZpc2libGU9dHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY2FtcD09XCJyZWRcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbl9yZWRfcGxheWVyXzMubG9hZEltYWdlKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuaWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZV9yZWRfcGxheWVyXzMudGV4dD1XZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLm5hbWU7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbl9ibHVlX3BsYXllcl8zLmxvYWRJbWFnZShXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuaWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZV9ibHVlX3BsYXllcl8zLnRleHQ9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLmVuZW15UGxheWVyLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbl9ibHVlX3BsYXllcl8zLmxvYWRJbWFnZShXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmljb24pO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWVfYmx1ZV9wbGF5ZXJfMy50ZXh0PVdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIubmFtZTtcclxuICAgICAgICAgICAgdGhpcy5pY29uX3JlZF9wbGF5ZXJfMy5sb2FkSW1hZ2UoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLmVuZW15UGxheWVyLmljb24pO1xyXG4gICAgICAgICAgICB0aGlzLm5hbWVfcmVkX3BsYXllcl8zLnRleHQ9V2VsQ29tZUNvbnRyb2xsZXIuaW5zLmVuZW15UGxheWVyLm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKirliqDovb3muLjmiI/lnLrmma/otYTmupAgKi9cclxuICAgIHByaXZhdGUgbG9hZEFzc2V0cygpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIGxldCBzcmMgPSBbXHJcbiAgICAgICAgICAgIC8v5Zu+6ZuG5Yqg6L29XHJcbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvZ2FtZS5hdGxhc1wifSwgXHJcbiAgICAgICAgICAgIHt1cmw6XCJyZXMvYXRsYXMvZ2FtZS9hbmkuYXRsYXNcIn0gICAgIFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChzcmMsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25Mb2FkKSxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vblByb2Nlc3MpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirliqDovb3ov5vnqIsgKi9cclxuICAgIHByaXZhdGUgb25Qcm9jZXNzKHBybykgOiB2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHByb0JveCA9IHRoaXMuc3BfcHJvZ3Jlc3M7XHJcbiAgICAgICAgbGV0IHByb1cgPSB0aGlzLnNwX3Byb2dyZXNzVztcclxuICAgICAgICBsZXQgcHJvTCA9IHRoaXMuc3BfcHJvZ3Jlc3NMO1xyXG4gICAgICAgIHByb1cud2lkdGggPSBwcm9Cb3gud2lkdGgqcHJvO1xyXG4gICAgICAgIHByb0wueCA9IHByb0JveC53aWR0aCpwcm87XHJcbiAgICAgICAgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmraPlnKjov57mjqXmnI3liqHlmajigKbigKZdXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yqg6L295a6M5q+VICovXHJcbiAgICBwcml2YXRlIG9uTG9hZCgpIDogdm9pZFxyXG4gICAge1xyXG4gICAgICAgIENsaWVudFNlbmRlci5yZXFPbkxvYWQoV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci51c2VySWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Mb2FkSGFuZGxlcihkYXRhKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICAvL+mDveWKoOi9veWujOavlea4uOaIj+WPr+S7peW8gOWniyBcclxuICAgICAgICBpZihkYXRhLnN0YXR1cz09MSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKFdlbENvbWVDb250cm9sbGVyLmlucy5vd25QbGF5ZXIuY2FtcD09XCJyZWRcIilcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5lbmVteV9Nb25zdGVyQm9ybkdyYXNzPVxyXG4gICAgICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLm93blBsYXllci5mYWMuZ3Jhc3NBcnJheVtkYXRhLnRlYW0xU3RhcnRQb2ludC54K2RhdGEudGVhbTFTdGFydC55KjEwXTtcclxuICAgICAgICAgICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucy5lbmVteVBsYXllci5lbmVteV9Nb25zdGVyQm9ybkdyYXNzPVxyXG4gICAgICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLmVuZW15UGxheWVyLmZhYy5ncmFzc0FycmF5W2RhdGEudGVhbTJTdGFydFBvaW50LngrZGF0YS50ZWFtMlN0YXJ0LnkqMTBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgV2VsQ29tZUNvbnRyb2xsZXIuaW5zLmVuZW15UGxheWVyLmVuZW15X01vbnN0ZXJCb3JuR3Jhc3M9XHJcbiAgICAgICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMuZW5lbXlQbGF5ZXIuZmFjLmdyYXNzQXJyYXlbZGF0YS50ZWFtMVN0YXJ0UG9pbnQueCtkYXRhLnRlYW0xU3RhcnQueSoxMF07XHJcbiAgICAgICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmVuZW15X01vbnN0ZXJCb3JuR3Jhc3M9XHJcbiAgICAgICAgICAgICAgICBXZWxDb21lQ29udHJvbGxlci5pbnMub3duUGxheWVyLmZhYy5ncmFzc0FycmF5W2RhdGEudGVhbTJTdGFydFBvaW50LngrZGF0YS50ZWFtMlN0YXJ0LnkqMTBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuRW50ZXJHYW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKui/m+WFpea4uOaIjyAqL1xyXG4gICAgcHJpdmF0ZSBFbnRlckdhbWUoKSA6IHZvaWRcclxuICAgIHtcclxuICAgICAgICBMYXlhLlNjZW5lLm9wZW4oXCJHYW1lL0dhbWUuc2NlbmVcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgR3Jhc3NGYWN0b3J5IGZyb20gXCIuLi9HYW1lL0dyYXNzRmFjdG9yeVwiO1xyXG5pbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4uL0dhbWUvR2FtZUNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IE1vbnN0ZXIgZnJvbSBcIi4uL0dhbWUvTW9uc3RlclwiO1xyXG5pbXBvcnQgTWVzc2FnZU1hbmFnZXIgZnJvbSBcIi4uLy4uL0NvcmUvTWVzc2FnZU1hbmFnZXJcIjtcclxuaW1wb3J0IFdlbENvbWVDb250cm9sbGVyIGZyb20gXCIuL1dlbENvbWVDb250cm9sbGVyXCI7XHJcbmltcG9ydCBHcmFzcyBmcm9tIFwiLi4vR2FtZS9QcmVmYWIvR3Jhc3NcIjtcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVye1xyXG4gICAgLyoq55So5oi3SWQgKi9cclxuICAgIHB1YmxpYyB1c2VySWQ6bnVtYmVyO1xyXG4gICAgLyoq6Zi16JClICovXHJcbiAgICBwdWJsaWMgY2FtcDpzdHJpbmc7XHJcbiAgICAvKirlkI3lrZcgKi9cclxuICAgIHB1YmxpYyBuYW1lOnN0cmluZztcclxuICAgIC8qKuWktOWDjyAqL1xyXG4gICAgcHVibGljIGljb246c3RyaW5nO1xyXG4gICAgLyoq6I2J5Z2q57uEICovXHJcbiAgICBwdWJsaWMgZmFjOkdyYXNzRmFjdG9yeTtcclxuICAgIC8qKuiNieWdquaJgOWxnueItuexu+mdouadvyAqL1xyXG4gICAgcHVibGljIGdyb3VwOkxheWEuU3ByaXRlO1xyXG4gICAgLyoq5oCq54mp5Ye655Sf54K5ICovXHJcbiAgICBwdWJsaWMgZW5lbXlfTW9uc3RlckJvcm5HcmFzczpHcmFzcztcclxuICAgIC8qKuW9k+WJjemAieaLqeaUvue9rueahOmYsuW+oeWhlOexu+Wei++8jOm7mOiupOmAieaLqTEgKi9cclxuICAgIHB1YmxpYyBkZWZlbmRlcklkOm51bWJlcjtcclxuICAgIC8qKuW9k+WJjemAieaLqeaUvue9rumYsuW+oeWhlOexu+Wei+mcgOimgea2iOiAl+eahOmHkeW4geaVsCAqL1xyXG4gICAgcHVibGljIGRlZmVuZGVyQ29pbjpudW1iZXI7XHJcbiAgICAvKirph5HluIEgKi9cclxuICAgIHB1YmxpYyBjb2luOm51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsdXNlcklkLGljb24pXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5uYW1lPW5hbWVcclxuICAgICAgICB0aGlzLmljb249aWNvbjtcclxuICAgICAgICB0aGlzLnVzZXJJZD11c2VySWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKirlt7HmlrnnjqnlrrYqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgIC8qKuW3seaWueeOqeWutua4uOaIj+WcuuaZr+S/oeaBr+WIneWni+WMliAqL1xyXG4gICAgcHVibGljIG93bkdhbWVJbml0KCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuY2FtcD09XCJyZWRcIilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXA9R2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UucmVkX2dyb3VwO1xyXG4gICAgICAgICAgICBHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5ibHVlX2dyb3VwLm1vdXNlRW5hYmxlZD1mYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cD1HYW1lQ29udHJvbGxlci5JbnN0YW5jZS5ibHVlX2dyb3VwO1xyXG4gICAgICAgICAgICBHYW1lQ29udHJvbGxlci5JbnN0YW5jZS5yZWRfZ3JvdXAubW91c2VFbmFibGVkPWZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyb3VwLm1vdXNlRW5hYmxlZD1mYWxzZTtcclxuICAgICAgICB0aGlzLmZhYz1uZXcgR3Jhc3NGYWN0b3J5KHRoaXMuZ3JvdXApO1xyXG4gICAgICAgIHRoaXMuY29pbj01MDA7XHJcbiAgICAgICAgR2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UudGV4dF9jb2luLnRleHQ9dGhpcy5jb2luLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudCgpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKuaVjOaWueeOqeWutuWIneWni+WMliAqL1xyXG4gICAgcHVibGljIGVuZW15R2FtZUluaXQoKTp2b2lkXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5jYW1wPT1cInJlZFwiKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5ncm91cD1HYW1lQ29udHJvbGxlci5JbnN0YW5jZS5yZWRfZ3JvdXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JvdXA9R2FtZUNvbnRyb2xsZXIuSW5zdGFuY2UuYmx1ZV9ncm91cDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5mYWM9bmV3IEdyYXNzRmFjdG9yeSh0aGlzLmdyb3VwKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKirmt7vliqDkuovku7YgKi9cclxuICAgIHB1YmxpYyBhZGRFdmVudCgpXHJcbiAgICB7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgIFxyXG5cclxuICAgIC8qKuS4uuWJqeS4i+eahOiNieWdquazqOWGjOaWsOS6i+S7tiAqL1xyXG4gICAgcHVibGljIHJlc3RHcmFzc0FkZEV2ZW50KCk6dm9pZFxyXG4gICAge1xyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8NzA7aSsrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGdyYXNzPXRoaXMuZmFjLmdyYXNzQXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBncmFzcy5zcC5vZmYoTGF5YS5FdmVudC5DTElDSyxncmFzcyxncmFzcy5FdmVudDFfY2hhbmdlU3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgZ3Jhc3Muc3Aub24oTGF5YS5FdmVudC5DTElDSyxncmFzcyxncmFzcy5FdmVudDJfQWRkRGVmZW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5mYWMubXVkQXJyYXkubGVuZ3RoO2krKylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjLm11ZEFycmF5W2ldLnNwLm9mZihMYXlhLkV2ZW50LkNMSUNLLHRoaXMuZmFjLm11ZEFycmF5W2ldLHRoaXMuZmFjLm11ZEFycmF5W2ldLkV2ZW50Ml9BZGREZWZlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgIFxyXG59IiwiaW1wb3J0IHsgdWkgfSBmcm9tIFwiLi4vLi4vdWkvbGF5YU1heFVJXCI7XG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xuaW1wb3J0IHsgUHJvdG9jb2wsIEdhbWVDb25maWcgfSBmcm9tIFwiLi4vLi4vQ29yZS9Db25zdC9HYW1lQ29uZmlnXCI7XG5pbXBvcnQgVXNlckxvZ2luSGFuZGxlciBmcm9tIFwiLi9oYW5kbGVyL1VzZXJMb2dpbkhhbmRsZXJcIjtcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4uLy4uL0NvcmUvTmV0L0NsaWVudFNlbmRlclwiO1xuaW1wb3J0IFRvb2wgZnJvbSBcIi4uLy4uL1Rvb2wvVG9vbFwiO1xuaW1wb3J0IE1lc3NhZ2VNYW5hZ2VyIGZyb20gXCIuLi8uLi9Db3JlL01lc3NhZ2VNYW5hZ2VyXCI7XG5pbXBvcnQgQ29uZmlnTWFuYWdlciBmcm9tIFwiLi4vLi4vQ29yZS9Db25maWdNYW5hZ2VyXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWxDb21lQ29udHJvbGxlciBleHRlbmRzIHVpLldlbGNvbWUuTG9naW5VSXtcbiAgICAvKirljZXkvosgKi9cbiAgICBwdWJsaWMgc3RhdGljIGluczpXZWxDb21lQ29udHJvbGxlcjtcbiAgICAvKirmmK/lkKbov57mjqXkuIrmnI3liqHlmaggKi9cbiAgICBwcml2YXRlIGlzQ29ubmVjdFNlcnZlciA6IGJvb2xlYW47XG4gICAgLyoq546p5a625L+h5oGvICovXG4gICAgcHVibGljIG93blBsYXllcjpQbGF5ZXI7XG4gICAgLyoq5pWM5pa5546p5a625L+h5oGvICovXG4gICAgcHVibGljIGVuZW15UGxheWVyOlBsYXllcjtcbiAgICAvKirmuLjmiI/mqKHlvI8gKi9cbiAgICBwdWJsaWMgbW9kZTpzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vL+eUn+WRveWRqOacn1xuICAgIC8qKuWQr+WKqCAqL1xuICAgIG9uRW5hYmxlKCl7XG4gICAgICAgIFdlbENvbWVDb250cm9sbGVyLmlucz10aGlzO1xuICAgICAgICB0aGlzLmRhdGFJbml0KCk7XG4gICAgICAgIHRoaXMuc2V0Q2VudGVyKCk7XG4gICAgICAgIHRoaXMubG9hZEFzc2V0cygpO1xuICAgICAgICB0aGlzLmNvbm5lY3RTZXJ2ZXIoKTsvL+i/nuaOpeacjeWKoeWZqFxuICAgICAgICB0aGlzLmFkZEV2ZW50cygpO1xuICAgIH1cblxuICAgIC8qKumUgOavgSovXG4gICAgb25EZXN0cm95KCl7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRzKCk7XG4gICAgfVxuXG5cbiAgICAvLy8vLy8vLy8vLy/pgLvovpFcbiAgICAvKirmlbDmja7liJ3lp4vljJYgKi9cbiAgICBwcml2YXRlIGRhdGFJbml0KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmlzQ29ubmVjdFNlcnZlciA9IGZhbHNlOyBcbiAgICB9XG4gICAgLyoq5LqL5Lu257uR5a6aICovXG4gICAgcHJpdmF0ZSBhZGRFdmVudHMoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuYnRuX2xvZ2luLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uTG9naW4pO1xuICAgICAgICB0aGlzLmJ0bl9yZWdpc3Rlci5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblJlZ2lzdGVyKTtcbiAgICAgICAgdGhpcy5idG5fdG9Mb2dpbi5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vblRvTG9naW4pO1xuICAgICAgICB0aGlzLmJ0bl90b1JlZ2lzdGVyLm9uKExheWEuRXZlbnQuQ0xJQ0ssdGhpcyx0aGlzLm9uVG9SZWdpc3RlcilcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19VU0VSX0xPR0lOLG5ldyBVc2VyTG9naW5IYW5kbGVyKHRoaXMsdGhpcy5vbkxvZ2luSGFuZGxlcikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVtb3ZlRXZlbnRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmJ0bl9sb2dpbi5vZmYoTGF5YS5FdmVudC5DTElDSyx0aGlzLHRoaXMub25Mb2dpbik7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnVucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU19VU0VSX0xPR0lOLHRoaXMpO1xuICAgIH1cblxuICAgIC8qKuWxgOS4reaYvuekuiAqL1xuICAgIHByaXZhdGUgc2V0Q2VudGVyKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgY2VudGVyID0gVG9vbC5nZXRDZW50ZXJYKCk7Ly/lsY/luZXpq5jluqZcbiAgICAgICAgdGhpcy5zcF9wcm9ncmVzcy54ID0gY2VudGVyO1xuICAgICAgICB0aGlzLnNwX2dhbWVOYW1lLnggPSBjZW50ZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBsb2FkQXNzZXRzKCkgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgc3JjID0gW1xuICAgICAgICAgICAge3VybDpcInVucGFja2FnZS93ZWxjb21lL2JveGltZy5wbmdcIn0sXG4gICAgICAgICAgICAvL2pzb25cbiAgICAgICAgICAgIHt1cmw6XCJvdXRzaWRlL2NvbmZpZy9nYW1lQ29uZmlnL2RlZmVuZGVyLmpzb25cIn0sXG4gICAgICAgICAgICB7dXJsOlwib3V0c2lkZS9jb25maWcvZ2FtZUNvbmZpZy9tb25zdGVyLmpzb25cIn0gIFxuICAgICAgICBdO1xuICAgICAgICBMYXlhLmxvYWRlci5sb2FkKHNyYyxMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsdGhpcy5vbkxvYWQpLExheWEuSGFuZGxlci5jcmVhdGUodGhpcyx0aGlzLm9uUHJvY2VzcykpO1xuICAgIH1cblxuICAgIC8qKuWKoOi9vei/m+eoiyAqL1xuICAgIHByaXZhdGUgb25Qcm9jZXNzKHBybykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgcHJvQm94ID0gdGhpcy5zcF9wcm9ncmVzcztcbiAgICAgICAgbGV0IHByb1cgPSB0aGlzLnNwX3Byb2dyZXNzVztcbiAgICAgICAgbGV0IHByb0wgPSB0aGlzLnNwX3Byb2dyZXNzTDtcbiAgICAgICAgcHJvVy53aWR0aCA9IHByb0JveC53aWR0aCpwcm87XG4gICAgICAgIHByb0wueCA9IHByb0JveC53aWR0aCpwcm87XG4gICAgICAgIGlmKCF0aGlzLmlzQ29ubmVjdFNlcnZlcikgdGhpcy5zcF9wcm9ncmVzc1QudGV4dCA9IFwi6L+b5bqm5Yqg6L29IFwiICsgTWF0aC5mbG9vcihwcm8qMTAwKSArIFwiJSAgIFvmraPlnKjov57mjqXmnI3liqHlmajigKbigKZdXCI7XG4gICAgICAgICAgICBlbHNlIHRoaXMuc3BfcHJvZ3Jlc3NULnRleHQgPSBcIui/m+W6puWKoOi9vSBcIiArIE1hdGguZmxvb3IocHJvKjEwMCkgKyBcIiUgICBb5pyN5Yqh5Zmo6L+e5o6l5oiQ5YqfXVwiO1xuICAgIH1cblxuICAgIC8qKuWKoOi9veWujOavlSAqL1xuICAgIHByaXZhdGUgb25Mb2FkKCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLnNwX3Byb2dyZXNzVC50ZXh0ID0gXCLliqDovb3lrozmr5Xov5vlhaXmuLjmiI9cIjtcbiAgICAgICAgTGF5YS50aW1lci5vbmNlKDgwMCx0aGlzLHRoaXMuc2hvd0xvZ2luQm94KTtcbiAgICAgICAgTWVzc2FnZU1hbmFnZXIuaW5zLm5ld0Zsb2F0TXNnKCk7XG4gICAgICAgIC8v6I635Y+W6YWN572uXG4gICAgICAgIENvbmZpZ01hbmFnZXIuaW5zLmxvYWRDb25maWcoKTtcbiAgICB9XG5cbiAgICAvKirmmL7npLrnmbvlvZXmoYYqKi9cbiAgICBwcml2YXRlIHNob3dMb2dpbkJveCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcF9sb2dpbkJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hbmkxLnBsYXkoMCxmYWxzZSk7XG4gICAgICAgIHRoaXMuc3BfZ2FtZU5hbWUueCA9IHRoaXMuc3BfbG9naW5Cb3gud2lkdGggKyB0aGlzLnNwX2dhbWVOYW1lLndpZHRoLzIgKyAxMDA7XG4gICAgICAgIHRoaXMuc3BfcHJvZ3Jlc3MudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKueCueWHu+eZu+mZhiAqL1xuICAgIHByaXZhdGUgb25Mb2dpbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgQ2xpZW50U2VuZGVyLnJlcVVzZXJMb2dpbih0aGlzLmlucHV0X3VzZXJOYW1lLnRleHQsdGhpcy5pbnB1dF91c2VyS2V5LnRleHQpO1xuICAgIH1cblxuICAgIC8qKueCueWHu+azqOWGjCAqL1xuICAgIHByaXZhdGUgb25SZWdpc3RlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5zcF9yZWdpc3RlckJveC52aXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKirngrnlh7sg5bey5pyJ6LSm5Y+3ICovXG4gICAgcHJpdmF0ZSBvblRvTG9naW4oKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKueCueWHuyDms6jlhowgKi9cbiAgICBwcml2YXRlIG9uVG9SZWdpc3RlcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgQ2xpZW50U2VuZGVyLnJlcVVzZXJSZWdpc3Rlcih0aGlzLmlucHV0X3JlZ2lzdGVyVXNlck5hbWUudGV4dCx0aGlzLmlucHV0X3JlZ2lzdGVyVXNlcktleS50ZXh0LHRoaXMuaW5wdXRfcmVnaXN0ZXJOaWNrTmFtZS50ZXh0KTsgICAgICAgIFxuICAgIH1cblxuICAgIC8qKuiOt+WPluWIsOa2iOaBryAqL1xuICAgIHByaXZhdGUgb25Mb2dpbkhhbmRsZXIoZGF0YSkgOiB2b2lkXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgaWYoZGF0YSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm93blBsYXllcj1uZXcgUGxheWVyKGRhdGEudXNlck5hbWUsZGF0YS51c2VySWQsXCJnYW1lTG9iYnkvcGxheWVyX2ljb24ucG5nXCIpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dCA9IFwi55m76ZmG5oiQ5Yqf77yM6L+b5YWl5ri45oiP77yBXCJcbiAgICAgICAgICAgIGlmKHRoaXMuc3BfcmVnaXN0ZXJCb3gudmlzaWJsZSkgdGV4dCA9IFwi5rOo5YaM5oiQ5Yqf77yM5bCG55u05o6l6L+b5YWl5ri45oiP77yBXCI7XG4gICAgICAgICAgICBNZXNzYWdlTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKHRleHQpO1xuICAgICAgICAgICAgdGhpcy50b0dhbWVNYWluKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKirov57mjqXmnI3liqHlmaggKi9cbiAgICBwcml2YXRlIGNvbm5lY3RTZXJ2ZXIoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLmNvbm5lY3QoR2FtZUNvbmZpZy5JUCxHYW1lQ29uZmlnLlBPUlQpO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICBwcml2YXRlIHRvR2FtZU1haW4oKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIC8vVE8gRE8g6Lez6L2s6Iez5ri45oiP5aSn5Y6FXG4gICAgICAgIExheWEuU2NlbmUub3BlbihcIkdhbWVMb2JieS9HYW1lTG9iYnkuc2NlbmVcIik7XG4gICAgfVxufSIsImltcG9ydCBTb2NrZXRIYW5kbGVyIGZyb20gXCIuLi8uLi8uLi9Db3JlL05ldC9Tb2NrZXRIYW5kbGVyXCI7XG5pbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi4vLi4vLi4vQ29yZS9OZXQvV2ViU29ja2V0TWFuYWdlclwiO1xuXG4vKipcbiAqIOeUqOaIt+eZu+mZhuivt+axgiDov5Tlm57lpITnkIZcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlckxvZ2luSGFuZGxlciBleHRlbmRzIFNvY2tldEhhbmRsZXJ7XG4gICAgXG4gICAgY29uc3RydWN0b3IoY2FsbGVyOmFueSxjYWxsYmFjazpGdW5jdGlvbiA9IG51bGwpe1xuICAgICAgICBzdXBlcihjYWxsZXIsY2FsbGJhY2spO1xuICAgIH1cblxuICAgICBwdWJsaWMgZXhwbGFpbihkYXRhKTp2b2lkXG4gICAge1xuICAgICAgICB2YXIgUmVzVXNlckxvZ2luOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXNVc2VyTG9naW5cIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IFJlc1VzZXJMb2dpbi5kZWNvZGUoZGF0YSk7XG4gICAgICAgIHN1cGVyLmV4cGxhaW4obWVzc2FnZSk7XG4gICAgfVxuICAgIC8qKuWkhOeQhuaVsOaNriAqL1xuICAgIHByb3RlY3RlZCBzdWNjZXNzKG1lc3NhZ2UpOnZvaWRcbiAgICB7ICAgICAgICAgICAgICAgIFxuICAgICAgICBzdXBlci5zdWNjZXNzKG1lc3NhZ2UpO1xuICAgIH1cbn1cbiAgICAiLCJpbXBvcnQgRGVmZW5kZXJDb25maWcgZnJvbSBcIi4uL0RhdGEvQ29uZmlnL0RlZmVuZGVyQ29uZmlnXCI7XG5pbXBvcnQgTW9uc3RlckNvbmZpZyBmcm9tIFwiLi4vRGF0YS9Db25maWcvTW9zbnRlckNvbmZpZ3JcIjtcblxuLyoqXG4gKiDphY3nva7liqDovb3lmahcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlnTWFuYWdlcntcbiAgICBwdWJsaWMgc3RhdGljIGlucyA6IENvbmZpZ01hbmFnZXIgPSBuZXcgQ29uZmlnTWFuYWdlcigpO1xuICAgIC8qKlxuICAgICAqIOmYsuW+oeWhlOaAu+mFjee9rlxuICAgICAqL1xuICAgIHB1YmxpYyBkZWZlbmRlckNvbmZpZyA6IGFueTtcbiAgICAvKipcbiAgICAgKiDmgKrnianmgLvphY3nva5cbiAgICAgKi9cbiAgICBwdWJsaWMgbW9uc3RlckNvbmZpZyA6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDphY3nva7ms6jlhowgXG4gICAgICogXG4gICAgICogMeOAgeWGmeS4i2pzb27lkI3lrZfvvIzlr7nlupTnmoQg6YWN572u57G7XG4gICAgICogXG4gICAgICog5qCH6K+GXG4gICAgICovXG4gICAgcHVibGljIGdldENsYXNzKG5hbWUsZGF0YSkgOiBhbnlcbiAgICB7XG4gICAgICAgIHN3aXRjaChuYW1lKXtcbiAgICAgICAgICAgIGNhc2UgXCJkZWZlbmRlclwiOiByZXR1cm4gbmV3IERlZmVuZGVyQ29uZmlnKGRhdGEpO1xuICAgICAgICAgICAgY2FzZSBcIm1vbnN0ZXJcIjogcmV0dXJuIG5ldyBNb25zdGVyQ29uZmlnKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEpzb27phY3nva7ojrflj5ZcbiAgICAgKiBcbiAgICAgKiDlhpnpnIDopoHojrflj5bnmoTphY3nva7mlofku7ZcbiAgICAgKi9cbiAgICBwdWJsaWMgbG9hZENvbmZpZygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdmFyIGFycj1bXG4gICAgICAgICAgICB7XCJkZWZlbmRlclwiOlwib3V0c2lkZS9jb25maWcvZ2FtZUNvbmZpZy9kZWZlbmRlci5qc29uXCJ9LFxuICAgICAgICAgICAge1wibW9uc3RlclwiOlwib3V0c2lkZS9jb25maWcvZ2FtZUNvbmZpZy9tb25zdGVyLmpzb25cIn1cbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5sb2FkT2JqKGFycik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOi1hOa6kOWKoOi9vVxuICAgICAqL1xuICAgIHByaXZhdGUgbG9hZE9iaihhcnIpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IG9iajtcbiAgICAgICAgbGV0IG5hbWU7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgb2JqID0gYXJyW2ldO1xuICAgICAgICAgICAgbmFtZSA9IE9iamVjdC5rZXlzKG9iailbMF07XG4gICAgICAgICAgICB0aGlzW25hbWUrXCJDb25maWdcIl0gPSBMYXlhLmxvYWRlci5nZXRSZXMob2JqW25hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiDojrflj5bphY3nva4gQGNvbmZpZ05tYWUgOiBKc29u5paH5Lu25ZCNICBA5oOz6I635Y+W5LuA5LmI5oCq54mpaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q29uZmlnQnlJZChjb25maWdOYW1lOnN0cmluZyxjb25maWdJZCkgOiBhbnlcbiAgICB7XG4gICAgICAgIGxldCBjb25maWdPYmogPSB0aGlzW2NvbmZpZ05hbWUgKyBcIkNvbmZpZ1wiXTtcbiAgICAgICAgbGV0IHR5cGVBcnIgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxjb25maWdPYmoubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBsZXQgb2JqID0gY29uZmlnT2JqW2ldO1xuICAgICAgICAgICAgaWYob2JqW2NvbmZpZ05hbWUgKyBcIklkXCJdID09IGNvbmZpZ0lkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDbGFzcyhjb25maWdOYW1lLG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICog6I635Y+W5pys6YWN572u5paH5Lu25ZCr5pyJ55qE6aG55pWwIEBjb25maWdObWFlIDogSnNvbuaWh+S7tuWQjSBcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q29uZmlnTGVuZ3RoKGNvbmZpZ05hbWU6c3RyaW5nKTpudW1iZXJcbiAgICB7XG4gICAgICAgIGxldCBjb25maWdPYmogPSB0aGlzW2NvbmZpZ05hbWUgKyBcIkNvbmZpZ1wiXTtcbiAgICAgICAgcmV0dXJuIGNvbmZpZ09iai5sZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5qC55o2u57G75Z6L6I635Y+W6YWN572uIDHph5Ey5pyoM+awtDTngas15ZyfXG4gICAgICovXG4gICAgcHVibGljIGdldENvbmZpZ0J5VHlwZShjb25maWdOYW1lOnN0cmluZyx0eXBlTnVtKSA6IGFueVxuICAgIHtcbiAgICAgICAgbGV0IGNvbmZpZ09iaiA9IHRoaXNbY29uZmlnTmFtZSArIFwiQ29uZmlnXCJdO1xuICAgICAgICBsZXQgdHlwZUFyciA9IFtdO1xuICAgICAgICBmb3IobGV0IGk9MDtpPGNvbmZpZ09iai5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGxldCBvYmogPSBjb25maWdPYmpbaV07XG4gICAgICAgICAgICBpZihvYmpbXCJ0eXBlXCJdID09IHR5cGVOdW0pe1xuICAgICAgICAgICAgICAgIHR5cGVBcnIucHVzaCh0aGlzLmdldENsYXNzKGNvbmZpZ05hbWUsb2JqKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVBcnI7XG4gICAgfVxuXG59IiwiLypcbiog5ri45oiP6YWN572uXG4qL1xuZXhwb3J0IGNsYXNzIEdhbWVDb25maWd7XG4gICAgLyoqaXAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgSVAgOiBzdHJpbmcgPSBcIjQ3LjEwNy4xNjkuMjQ0XCI7XG4gICAgLyoq56uv5Y+jICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBQT1JUIDogbnVtYmVyID0gNzc3NyAgO1xuICAgIC8vIC8qKmlwIC0g5pys5Zyw5rWL6K+VKi9cbiAgICBwdWJsaWMgc3RhdGljIElQIDogc3RyaW5nID0gXCI0Ny4xMDcuMTY5LjI0NFwiO1xuICAgIC8vIC8qKuerr+WPoyAtIOacrOWcsOa1i+ivlSovXG4gICAgcHVibGljIHN0YXRpYyBQT1JUIDogbnVtYmVyID0gNzc3NztcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS3phY3nva7nsbvlnostLS0tLS0tLS0tLS1cbiAgICBwdWJsaWMgc3RhdGljIENPTkZJR19OQU1FX01PTlNURVIgOiBzdHJpbmcgPSBcIm1vbnN0ZXJcIjtcbiAgICBwdWJsaWMgc3RhdGljIENPTkZJR19OQU1FX0RFRkVOREVSIDogc3RyaW5nID0gXCJkZWZlbmRlclwiO1xuICAgIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLeWxnuaApyDnsbvlnostLS0tLS0tLS0tLSAgIFxuICAgIC8qKumHkSAxICovXG4gICAgcHVibGljIHN0YXRpYyBUWVBFX0dPTEQgOiBudW1iZXIgPSAxIDtcbiAgICAvKirmnKggMiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgVFlQRV9XT09EIDogbnVtYmVyID0gMjtcbiAgICAvKirmsLQgMyovXG4gICAgcHVibGljIHN0YXRpYyBUWVBFX1dBVEVSIDogbnVtYmVyID0gMztcbiAgICAvKirngasgKi9cbiAgICBwdWJsaWMgc3RhdGljIFRZUEVfRklSRSA6IG51bWJlciA9IDQ7XG4gICAgLyoq5ZyfKi9cbiAgICBwdWJsaWMgc3RhdGljIFRZUEVfR1JPVU5EIDogbnVtYmVyID0gNTsgXG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgfVxufVxuXG4vKirljY/orq4gKi9cbmV4cG9ydCBjbGFzcyBQcm90b2NvbHtcbiAgICAvLyoqKioqKioqKioqKioqKipVc2VyUHJvdG8ucHJvdG9cbiAgICAvKiror7fmsYIgbXNnSWQgPSAxMDExMDMgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX0xPR0lOIDogbnVtYmVyID0gMTAxMTAzO1xuICAgIC8qKjEwMTEwNCDms6jlhozor7fmsYIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9VU0VSX1JFR0lTVEVSIDogbnVtYmVyID0gMTAxMTA0O1xuXG4gICAgLyoq5ZON5bqUIG1zZ0lkID0gMTAxMjAzICovXG4gICAgcHVibGljIHN0YXRpYyBSRVNfVVNFUl9MT0dJTiA6IG51bWJlciA9IDEwMTIwMztcblxuICAgIFxuICAgIC8vKioqKioqKioqKioqKioqKk1hdGNoUHJvdG8ucHJvdG9cbiAgICAvKiror7fmsYLljLnphY3lr7nlsYAxMDIxMDEgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVRDSDpudW1iZXI9MTAyMTAxO1xuICAgIC8qKuivt+axgiDlr7nlsYDmjqXlj5cxMDIxMDIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFUV9NQVRDSF9BQ0NFUFQ6bnVtYmVyPTEwMjEwMjtcblxuICAgIC8qKuWTjeW6lCDov5Tlm57ljLnphY3kv6Hmga8g5Y+q5Y+R6YCB5LiA5qyhbXNnSWQgPSAxMDIyMDEgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFU19NQVRDSF9JTkZPIDogbnVtYmVyID0gMTAyMjAxO1xuICAgIC8qKuWTjeW6lCDov5Tlm57lr7nlsYDmjqXlj5fmtojmga9tc2dJZCA9IDEwMjAyICovXG4gICAgcHVibGljIHN0YXRpYyBSRVNfTUFUQ0hfQUNDRVBUX0lORk8gOiBudW1iZXIgPSAxMDIyMDI7XG5cblxuICAgIC8vKioqKioqKioqKioqKioqKkdhbWVQcm90by5wcm90b1xuICAgIC8qKuivt+axgui1hOa6kOWKoOi9veWujOavlSAg6L+U5ZueMTAzMjAxICovXG4gICAgcHVibGljIHN0YXRpYyBSRVFfT05MT0FEOm51bWJlcj0xMDMyMDE7XG4gICAgLyoq6K+35rGC5Zyw5Zu+5Z6S5aW9IOi/lOWbnjEwMzIwMiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVRX01BUE9WRVI6bnVtYmVyPTEwMzIwMjtcbiAgICAvKirmr4/lm57lkIjmgKrnianmipXmlL7lpb3kuYvlkI4g5oiW6ICF5pe26Ze05Yiw5LqG6K+35rGC5a6M5oiQICAxMDMxMDMqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVRX1BVVE1PTlNURVJPVkVSOm51bWJlcj0xMDMxMDM7XG5cbiAgICAvKirlvZPmiYDmnInkurrpg73liqDovb3lpb3kuobkuYvlkI7ov5Tlm57muLjmiI/lvIDlp4vmtojmga8gMTAzMjAxICovXG4gICAgcHVibGljIHN0YXRpYyBSRVNfT05MT0FEOm51bWJlcj0xMDMyMDE7XG4gICAgLyoq6L+U5ZueIOaJgOacieeahOWcsOWbvui3r+W+hOS/oeaBryAxMDMyMDIgKi9cbiAgICBwdWJsaWMgc3RhdGljIFJFU19BTExNQVBJTkZPOm51bWJlcj0xMDMyMDI7XG4gICAgLyoq6L+U5Zue57uZ5Y+M5pa577yM5q+P5Zue5ZCI55qE5oCq54mpIDEwMzIwMyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgUkVTX01PTlNURVJJTkZPOm51bWJlcj0xMDMyMDM7XG4gICAgLy8gLy8qKioqKioqKioqKipnbU1lc3NhZ2UucHJvdG9cbiAgICAvLyAvKirlj5HpgIFHTeWvhuS7pCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0dNX0NPTTpudW1iZXIgPSAxOTkxMDE7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKnVzZXJNZXNzYWdlLnByb3RvXG4gICAgLy8gLyoq5rOo5YaMIDIwMjEwMiovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9SRUdJU1RFUjpudW1iZXIgPSAyMDIxMDI7XG4gICAgLy8gLyoq55m75b2V6K+35rGCIDIwMjEwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFUl9MT0dJTjpudW1iZXIgPSAyMDIxMDM7XG5cbiAgICAvLyAvKirmnI3liqHlmajov5Tlm54qKioqKioqKioqKioqICovXG4gICAgLy8gLyoq55m75b2V6L+U5ZueIDIwMjIwMSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1VTRVJfTE9HSU46bnVtYmVyID0gMjAyMjAxO1xuICAgIC8vIC8qKuacjeWKoeWZqOWIl+ihqCAyMDIyMDMqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWRVJfTElTVDpudW1iZXIgPSAyMDIyMDM7XG4gICAgLy8gLyoq5YWs5ZGK6Z2i5p2/IDIwMjIwNCovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX05PVElDRV9CT0FSRDpudW1iZXIgPSAyMDIyMDQ7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKmxvZ2luTWVzc2FnZS5wcm90b1xuICAgIC8vIC8qKuacjeWKoeWZqOeZu+W9leivt+axgiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfTE9HSU46bnVtYmVyID0gMTAxMTAxO1xuICAgIC8vIC8qKuW/g+i3s+WMheivt+axgiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1NFUlZfSEVSVDpudW1iZXIgPSAxMDExMDI7XG4gICAgLy8gLyoq6K+35rGC6KeS6Imy5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQ1JFQVRFX1BMQVlFUjpudW1iZXIgPSAxMDExMDM7XG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKuW/g+i3s+i/lOWbniAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0hFUlQ6bnVtYmVyID0gMTAxMjAxO1xuICAgIC8vIC8qKui/lOWbnueZu+W9lemUmeivr+a2iOaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9TRVJWX0VSUk9SOm51bWJlciA9IDEwMTIwMjtcbiAgICAvLyAvKirov5Tlm57ooqvpobbkuIvnur8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfU1VCU1RJVFVURTpudW1iZXIgPSAxMDEyMDM7XG5cblxuXG4gICAgXG4gICAgLy8gLy8qKioqKioqKioqKipwbGF5ZXJNZXNzYWdlLnByb3RvXG4gICAgLy8gLy/or7fmsYJcbiAgICAvLyAvKiror7fmsYLmia3om4sgbXNnSWQ9MTAyMTAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfR0FDSEE6bnVtYmVyID0gMTAyMTAxO1xuXG4gICAgLy8gLyoq5pyN5Yqh5Zmo6L+U5ZueKioqKioqKioqKioqKiAqL1xuICAgIC8vIC8qKueZu+mZhui/lOWbnuinkuiJsuWfuuacrOS/oeaBryAgbXNnSWQ9MTAyMjAxICAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QTEFZRVJfSU5GTzpudW1iZXIgPSAxMDIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5oiQ5YqfICBtc2dJZD0xMDIyMDIgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfU1VDQ0VTUzpudW1iZXIgPSAxMDIyMDI7XG4gICAgLy8gLyoq6L+U5Zue5pON5L2c5aSx6LSlICBtc2dJZD0xMDIyMDMgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX09QUkVBVEVfRkFJTDpudW1iZXIgPSAxMDIyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW5ZCO55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNCAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9FUVVBTDpudW1iZXIgPSAxMDIyMDQ7XG4gICAgLy8gLyoq6L+U5Zue6KeS6Imy5Y+R55Sf5Y+Y5YyW55qE5bGe5oCn5L+h5oGvKOWIl+ihqCkgIG1zZ0lkPTEwMjIwNSAgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUExBWUVSX0FUVFJJQlVURV9VUERBVEU6bnVtYmVyID0gMTAyMjA1O1xuICAgIC8vIC8qKui/lOWbnuaJreibiyBtc2dJZD0xMDIyMDYgICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX0dBQ0hBOm51bWJlciA9IDEwMjIwNjtcblxuICAgIC8vIC8vKioqKioqKioqKioqc2tpbGxNZXNzYWdlLnByb3RvXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLeivt+axgua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKiror7fmsYLmiYDmnInmioDog73kv6Hmga8gbXNnSWQ9MTA3MTAxXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAxICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfQUxMX1NLSUxMX0lORk86bnVtYmVyID0gMTA3MTAxO1xuICAgIC8vIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryBtc2dJZD0xMDcxMDJcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GSUdIVF9TS0lMTF9MSVNUOm51bWJlciA9IDEwNzEwMjtcbiAgICAvLyAvKiror7fmsYLljYfnuqfmioDog70gbXNnSWQ9MTA3MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA3MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVBfU0tJTEw6bnVtYmVyID0gMTA3MTAzO1xuICAgIC8vIC8qKuivt+axgumHjee9ruaKgOiDvSBtc2dJZD0xMDcxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDcyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9SRVNFVF9TS0lMTDpudW1iZXIgPSAxMDcxMDQ7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5qC85a2Q5oqA6IO9IG1zZ0lkPTEwNzEwNVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0FMVEVSX0dSSURfU0tJTEw6bnVtYmVyID0gMTA3MTA1O1xuXG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57miYDmnInmioDog73kv6Hmga8gIG1zZ0lkPTEwNzIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTExfU0tJTExfSU5GTzpudW1iZXIgPSAxMDcyMDE7XG4gICAgLy8gLyoq6L+U5Zue5Ye65oiY5oqA6IO95L+h5oGvICBtc2dJZD0xMDcyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfRklHSFRfU0tJTExfTElTVDpudW1iZXIgPSAxMDcyMDI7XG4gICAgLy8gLyoq6L+U5Zue5Y2H57qn5oqA6IO9ICBtc2dJZD0xMDcyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfVVBfU0tJTEw6bnVtYmVyID0gMTA3MjAzO1xuICAgIC8vIC8qKui/lOWbnumHjee9ruaKgOiDveaIkOWKn++8jOWuouaIt+err+aUtuWIsOatpOa2iOaBr++8jOacrOWcsOenu+mZpOWFqOmDqOaKgOiDvSAgbXNnSWQ9MTA3MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1JFU0VUX1NLSUxMOm51bWJlciA9IDEwNzIwNDtcbiAgICAvLyAvKirov5Tlm57mlLnlj5jmoLzlrZDmioDog70gIG1zZ0lkPTEwNzIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9BTFRFUl9HUklEX1NLSUxMOm51bWJlciA9IDEwNzIwNTtcblxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogcGV0TWVzc2FnZVxuICAgIC8vIC8qKuivt+axguWuoOeJqeWIneWni+WIm+W7uu+8iOWIm+W7uuinkuiJsuiOt+W+l+WIneWni+WuoOeJqe+8iSBtc2dJZD0xMDUxMDFcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDUyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkFORE9NX0NSRUFURTpudW1iZXIgPSAxMDUxMDE7XG4gICAgLy8gLyoq6K+35rGC5pS55Y+Y5LiK6Zi15a6g54mp5L+h5oGvIG1zZ0lkPTEwNTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9BTFRFUl9HUklEOm51bWJlciA9IDEwNTEwMjtcbiAgICAvLyAvKiror7fmsYLlloLlrqDnianlkIPppa0gbXNnSWQ9MTA1MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZFRUQ6bnVtYmVyID0gMTA1MTAzO1xuICAgIC8vIC8qKuivt+axguWuoOeJqeWQiOaIkCBtc2dJZD0xMDUxMDRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfQ09NUE9VTkQ6bnVtYmVyID0gMTA1MTA0O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MTA2O1xuICAgIC8vIC8qKuivt+axguWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MTA3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MTA4O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjSBtc2dJZD0xMDUxMDlcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HOm51bWJlciA9IDEwNTEwOTtcbiAgICAvLyAvKiror7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0VWT0xWRTpudW1iZXIgPSAxMDUxMTA7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9IQVRDSDpudW1iZXIgPSAxMDUxMTE7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55m76K6wIG1zZ0lkPTEwNTExMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRUdJU1RFUjpudW1iZXIgPSAxMDUxMTI7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9SRVFfTUFUSU5HOm51bWJlciA9IDEwNTExMztcbiAgICAvLyAvKiror7fmsYLlrqDniannuYHooY3miYDmnInkv6Hmga8gbXNnSWQ9MTA1MTE0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE0IOWmguaenOWuoOeJqeacrOi6q+acieeZu+iusOaVsOaNru+8jOS9hue5geihjeaVsOaNruaJvuS4jeWIsO+8iOi/lOWbnua2iOaBr21zZ0lkPTEwNTIxMuWSjG1zZ0lkPTEwNTIxM+abtOaWsOWuouaIt+err+aVsOaNru+8iSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfQUxMSU5GTzpudW1iZXIgPSAxMDUxMTQ7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN5p+l55yL6K+35rGC5YiX6KGoIG1zZ0lkPTEwNTExNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1Q6bnVtYmVyID0gMTA1MTE1O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeWQjOaEj+aIluaLkue7nSBtc2dJZD0xMDUxMTZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTbvvIzlpoLmnpzmmK/lkIzmhI/vvIzlr7nmlrnnjqnlrrblpoLmnpzlnKjnur/vvIzkvJrmlLbliLBtc2dJZD0xMDUyMTDmtojmga8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX0NIT09TRTpudW1iZXIgPSAxMDUxMTY7XG4gICAgLy8gLyoq6K+35rGC5a6g54mp57mB6KGN55uu5qCH5Yi35pawIG1zZ0lkPTEwNTExN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX1BFVF9NQVRJTkdfVEFSR0VUX1JFRlJFU0g6bnVtYmVyID0gMTA1MTE3O1xuICAgIC8vIC8qKuivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9QRVRfTUFUSU5HX1RBUkdFVF9MT09LOm51bWJlciA9IDEwNTExODtcbiAgICAvLyAvKiror7fmsYLlrqDnianmlL7nlJ8gbXNnSWQ9MTA1MTE5XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MTE5O1xuXG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iW1zZ0lkPTEwNTIwMSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNQX1BFVF9BTExfSU5GTzpudW1iZXIgPSAxMDUyMDE7XG4gICAgLy8gLy8g6L+U5Zue5a6g54mp5qC85a2Q5L+h5oGvIG1zZ0lkPTEwNTIwMlxuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTUF9QRVRfR1JJRF9JTkZPOm51bWJlciA9IDEwNTIwMjtcbiAgICAvLyAvKirov5Tlm57lrqDnianliJ3lp4vliJvlu7rvvIjliJvlu7rop5LoibLojrflvpfliJ3lp4vlrqDnianvvIkgbXNnSWQ9MTA1MjAzKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU1BfUEVUX1JBTkRPTV9DUkVBVEU6bnVtYmVyID0gMTA1MjAzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeetiee6p+WSjOe7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDveetiee6p+WSjOaKgOiDvee7j+mqjOS/oeaBr++8iOatpOa2iOaBr+WcqOWuoOeJqeaKgOiDvee7j+mqjOWPkeeUn+WPmOWMluWwseS8mui/lOWbnue7meWuouaIt+err++8iSBtc2dJZD0xMDUyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfTFZfRVhQX0lORk86bnVtYmVyID0gMTA1MjA1O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemihuaCn+aKgOiDvSBtc2dJZD0xMDUyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU1RVRFlfU0tJTEw6bnVtYmVyID0gMTA1MjA2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqemHjee9ruaKgOiDvSBtc2dJZD0xMDUyMDcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfUkVTRVRfU0tJTEw6bnVtYmVyID0gMTA1MjA3O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUyMDggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0tJTExfVVA6bnVtYmVyID0gMTA1MjA4O1xuXG4gICAgLy8gLyoq6L+U5Zue5a6g54mp5Lqk6YWNIG1zZ0lkPTEwNTIwOSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BFVF9NQVRJTkdUOm51bWJlciA9IDEwNTIwOTtcbiAgICAvLyAvKirov5Tlm57lrqDnianlop7liqDnuYHooY3mrKHmlbAgbXNnSWQ9MTA1MjEwICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0FERF9NQVRJTkdfQ09VTlQ6bnVtYmVyID0gMTA1MjEwO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqei/m+WMliBtc2dJZD0xMDUyMTEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfRVZPTFZFOm51bWJlciA9IDEwNTIxMTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3nmbvorrAgbXNnSWQ9MTA1MjEyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFR0lTVEVSOm51bWJlciA9IDEwNTIxMjtcbiAgICAvLyAvKirov5Tlm57lrqDniannlLPor7fnuYHooY0gbXNnSWQ9MTA1MjEzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX1JFUV9NQVRJTkc6bnVtYmVyID0gMTA1MjEzO1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUyMTQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX0FMTElORk86bnVtYmVyID0gMTA1MjE0O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeafpeeci+ivt+axguWIl+ihqCBtc2dJZD0xMDUyMTUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfU0VMRUNUX1JFUV9MSVNUOm51bWJlciA9IDEwNTIxNTtcbiAgICAvLyAvKirov5Tlm57lrqDniannuYHooY3lkIzmhI/miJbmi5Lnu50gbXNnSWQ9MTA1MjE2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX01BVElOR19DSE9PU0U6bnVtYmVyID0gMTA1MjE2O1xuICAgIC8vIC8qKui/lOWbnuWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUyMTcgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNIOm51bWJlciA9IDEwNTIxNztcbiAgICAvLyAvKirov5Tlm57lrqDnianmlL7nlJ8gbXNnSWQ9MTA1MjE4ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfUEVUX0ZSRUU6bnVtYmVyID0gMTA1MjE4O1xuICAgIFxuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKiogZXF1aXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX01BS0U6bnVtYmVyID0gMTA5MTAxO1xuICAgIC8vIC8qKuivt+axguijheWkh+WIhuinoyBtc2dJZD0xMDkxMDZcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDYgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9TUExJVDpudW1iZXIgPSAxMDkxMDZcbiAgICAvLyAvKiror7fmsYLoo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfTE9DSzpudW1iZXIgPSAxMDkxMDQ7XG4gICAgLy8gLyoq6K+35rGC6KOF5aSH5by65YyWIG1zZ0lkPTEwOTEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0VRVUlQX0FUVF9BREQ6bnVtYmVyID0gMTA5MTA1O1xuICAgIC8vIC8qKuivt+axguijheWkh+epv+aItCBtc2dJZD0xMDkxMDJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9FUVVJUF9MT0FESU5HOm51bWJlciA9IDEwOTEwMjtcbiAgICAvLyAvKiror7fmsYLoo4XlpIfljbjovb0gbXNnSWQ9MTA5MTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRVFVSVBfVU5MT0FESU5HOm51bWJlciA9IDEwOTEwMztcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX01BS0UgPSAxMDkyMDE7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX1NQTElUID0gMTA5MjA2O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+W8uuWMliBtc2dJZD0xMDkyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9BVFRfQUREID0gMTA5MjA1O1xuICAgIC8vIC8qKui/lOWbnuijheWkh+epv+aItCBtc2dJZD0xMDkyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9MT0FESU5HID0gMTA5MjAyO1xuICAgIC8vIC8qKui/lOWbnuijheWkh+WNuOi9vSBtc2dJZD0xMDkyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9VTkxPQURJTkcgPSAxMDkyMDM7XG4gICAgLy8gLyoq6L+U5Zue6KOF5aSH6ZSB5a6a5oiW6Kej6ZSBIG1zZ0lkPTEwOTIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0VRVUlQX0xPQ0sgPSAxMDkyMDQ7XG5cbiAgICAvLyAvLyoqKioqKioqKioqKioqKioqKioqKiBtYXBNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5Zyw5Zu+5pmu6YCa5oiY5paX77yI5a6i5oi356uv5LiA5Zy65oiY5paX57uT5p2f5LmL5ZCO5Y+R6YCB5q2k5raI5oGv77yM5YaN6L+b6KGM5YCS6K6h5pe25ZKM5pys5Zyw5YGH5oiY5paX77yJIG1zZ0lkPTEwNjEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9OT1JNQUxfRklHSFQ6bnVtYmVyID0gMTA2MTAxO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeW/q+mAn+aImOaWlyBtc2dJZD0xMDYxMDRcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1BFRURfRklHSFQ6bnVtYmVyID0gMTA2MTA0O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoeaImOaWlyBtc2dJZD0xMDYxMDVcdFx0LS0tLS3ov5Tlm57mtojmga9tc2dJZD0xMDYyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfU1dFRVBfRklHSFQ6bnVtYmVyID0gMTA2MTA1O1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoei0reS5sOaJq+iNoSBtc2dJZD0xMDYxMDZcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDAwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX01BUF9CVVlfU1dFRVA6bnVtYmVyID0gMTA2MTA2O1xuICAgIC8vIC8qKuivt+axguWFs+WNoeWBh+aImOaWl+e7k+adn+mihuWPluWlluWKsSBtc2dJZD0xMDYxMDlcdFx0LS0tLS3ov5Tlm57mtojmga8g6L+U5Zue5oiQ5Yqf5raI5oGv77yMY29kZT0xMDYyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORDpudW1iZXIgPSAxMDYxMDk7XG4gICAgLy8gLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVFJVRV9GSUdIVF9FTkQ6bnVtYmVyID0gMTA2MTAyO1xuICAgIC8vIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX1NDRU5FX0ZJR0hUOm51bWJlciA9IDEwNjEwMztcbiAgICAvLyAvKiror7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfTUFQX0NIQU5HRV9TQ0VORTpudW1iZXIgPSAxMDYxMDg7XG5cblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue56a757q/5ZKM5omr6I2h5pS255uK5L+h5oGvIG1zZ0lkPTEwNjIwMiovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfT0ZGX0xJTkVfQVdBUkRfSU5GTzpudW1iZXIgPSAxMDYyMDI7XG4gICAgLy8gLyoq6L+U5Zue5oiY5paX5pKt5pS+57uT5p2f5Y+R5pS+5aWW5Yqx77yI5bqU55So5LqO5omA5pyJ5oiY5paX77yJIG1zZ0lkPTEwNjIwMyovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRklHSFRfRU5EOm51bWJlciA9IDEwNjIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqIHBhY2tNZXNzYWdlXG4gICAgLy8gLyoq5L2/55So6YGT5YW35raI5oGvICBtc2dJZD0xMDQxMDEg6L+U5Zue5pON5L2c5oiQ5Yqf5raI5oGvICBtc2dJZD0xMDIyMDIgY29kZT0xMDAwMe+8iOaaguWumu+8jOagueaNruWunumZheS9v+eUqOaViOaenOWGjeWBmu+8iSovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfVVNFOm51bWJlciA9IDEwNDEwMTtcblxuICAgIC8vIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS3ov5Tlm57mtojmga8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gLyoq6L+U5Zue6IOM5YyF5Y2V5Liq6YGT5YW35Y+Y5YyW5L+h5oGvICBtc2dJZD0xMDQyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19QUk9QX0lORk86bnVtYmVyID0gMTA0MjAyO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheaJgOacieS/oeaBr++8iOeZu+W9leaIkOWKn+S4u+WKqOi/lOWbnu+8iSAgbXNnSWQ9MTA0MjAxKOacieWPr+iDveS4uuepuuWIl+ihqCkqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1BBQ0tfQUxMX0lORk86bnVtYmVyID0gMTA0MjAxO1xuICAgIC8vIC8qKui/lOWbnuiDjOWMheWNleS4quijheWkh+WPmOWMluS/oeaBryBtc2dJZD0xMDQyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19FUVVJUF9JTkZPOm51bWJlciA9IDEwNDIwMztcblxuICAgIC8vIC8vKioqKioqKioqKioqKioqKioqKioqKiogZmlnaHRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5omT5byA6YKu5Lu26K6+572u5bey6K+7IG1zZ0lkPTExMTEwMSDml6Dov5Tlm57mtojmga8g5a6i5oi356uv5omT5byA5peg5aWW5Yqx6YKu5Lu277yM6Ieq6KGM6K6+572u5bey6K+754q25oCBICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfT1BFTl9NQUlMOm51bWJlciA9IDExMTEwMTtcbiAgICAvLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0FXQVJEOm51bWJlciA9IDExMTEwMjtcbiAgICAvLyAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9NQUlMX0RFTEVURTpudW1iZXIgPSAxMTExMDM7XG4gICAgLy8gLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLei/lOWbnua2iOaBry0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAvKirov5Tlm57pgq7ku7bkv6Hmga8gbXNnSWQ9MTExMjAx77yI55m76ZmG5Li75Yqo6L+U5ZueIOaIluiAhSDlj5HnlJ/lj5jljJbov5Tlm57vvIkgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0lORk86bnVtYmVyID0gMTExMjAxO1xuICAgIC8vIC8qKui/lOWbnumCruS7tuW3sumihuWPluaIkOWKnyBtc2dJZD0xMTEyMDIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19NQUlMX0FXQVJEOm51bWJlciA9IDExMTIwMjtcbiAgICAvLyAvKirov5Tlm57liKDpmaTpgq7ku7bmiJDlip8gbXNnSWQ9MTExMjAzICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfTUFJTF9ERUxFVEU6bnVtYmVyID0gMTExMjAzO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmaWdodE1lc3NhZ2VcbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuS4gOWcuuaImOaWl+aXpeW/lyBtc2dJZD0xMDgyMDEqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX1RSVUVfRklHSFRfTE9HX0lORk86bnVtYmVyID0gMTA4MjAxO1xuXG4gICAgLy8gLy8qKioqKioqKioqKioqKioqKioqKioqKiBmcmllbmRNZXNzYWdlXG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5o6o6I2QIG1zZ0lkPTExMjEwMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9QVVNIOm51bWJlciA9IDExMjEwMTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX1NFQVJDSDpudW1iZXIgPSAxMTIxMDI7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BUFBMWTpudW1iZXIgPSAxMTIxMDM7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5pON5L2cIG1zZ0lkPTExMjEwNFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNCAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9PUEVSQVRJT046bnVtYmVyID0gMTEyMTA0O1xuICAgIC8vIC8qKuivt+axguWlveWPi+ivpue7huS/oeaBryBtc2dJZD0xMTIxMDVcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDUgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFUV9GUklFTkRfTU9SRV9JTkZPOm51bWJlciA9IDExMjEwNTtcbiAgICAvLyAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVFfRlJJRU5EX0dJRlQ6bnVtYmVyID0gMTEyMTA2XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5omA5pyJ5L+h5oGvIG1zZ0lkPTExMjEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNyAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9BbGxfSW5mbzpudW1iZXIgPSAxMTIxMDc7XG4gICAgLy8gLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVRX0ZSSUVORF9GSUdIVDpudW1iZXIgPSAxMTIxMDg7XG5cbiAgICAvLyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t6L+U5Zue5raI5oGvLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIC8qKui/lOWbnuWlveWPi+aOqOiNkCBtc2dJZD0xMTIyMDEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfUFVTSDpudW1iZXIgPSAxMTIyMDE7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L5pCc57SiIG1zZ0lkPTExMjIwMiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9TRUFSQ0g6bnVtYmVyID0gMTEyMjAyO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+eUs+ivtyBtc2dJZD0xMTIyMDMgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfQVBQTFk6bnVtYmVyID0gMTEyMjAzO1xuICAgIC8vIC8qKui/lOWbnuWlveWPi+aTjeS9nCBtc2dJZD0xMTIyMDQgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIFJFU19GUklFTkRfT1BFUkFUSU9OOm51bWJlciA9IDExMjIwNDtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vor6bnu4bkv6Hmga8gbXNnSWQ9MTEyMjA1ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX01PUkVfSU5GTzpudW1iZXIgPSAxMTIyMDU7XG4gICAgLy8gLyoq6L+U5Zue5aW95Y+L6YCB56S8IG1zZ0lkPTExMjIwNiAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgUkVTX0ZSSUVORF9HSUZUOm51bWJlciA9IDExMjIwNjtcbiAgICAvLyAvKirov5Tlm57lpb3lj4vmiYDmnInkv6Hmga8gbXNnSWQ9MTEyMjA3ICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBSRVNfRlJJRU5EX0FMTF9JTkZPOm51bWJlciA9IDExMjIwNzsgICAgXG5cbn0iLCJpbXBvcnQgRmxvYXRNc2cgZnJvbSBcIi4uL1Rvb2wvRmxvYXRNc2dcIjtcbmltcG9ydCBUb29sIGZyb20gXCIuLi9Ub29sL1Rvb2xcIjtcblxuLyoqXG4gKiDmtojmga/mmL7npLrnrqHnkIblmahcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZU1hbmFnZXIge1xuICAgIC8qKuWNleS+iyAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zIDogTWVzc2FnZU1hbmFnZXIgPSBuZXcgTWVzc2FnZU1hbmFnZXI7XG4gICAgLyoq5bGP5bmV5oul5pyJ55qE5rWu5Yqo5raI5oGv6K6h5pWwKi9cbiAgICBwdWJsaWMgY291bnRGbG9hdE1zZyA6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2cgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOa1ruWKqOa2iOaBr+mihOeDrSzvvIzmj5DliY3mlrDlu7rkuIDkuKpmbG9hdFxuICAgICAqL1xuICAgIHB1YmxpYyBuZXdGbG9hdE1zZygpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGZsb2F0TXNnID0gbmV3IEZsb2F0TXNnKCk7XG4gICAgICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoZmxvYXRNc2cpO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsZmxvYXRNc2cpOyBcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrmta7liqjmtojmga9cbiAgICAgKiBAcGFyYW0gdGV4dCAg5pi+56S65raI5oGvXG4gICAgICovXG4gICAgcHVibGljIHNob3dGbG9hdE1zZyh0ZXh0OnN0cmluZykgOiB2b2lkXG4gICAge1xuICAgICAgICBsZXQgZmxvYXRNc2cgOiBGbG9hdE1zZyA9IExheWEuUG9vbC5nZXRJdGVtKFwiRmxvYXRNc2dcIik7XG4gICAgICAgIGlmKExheWEuUG9vbC5nZXRQb29sQnlTaWduKFwiRmxvYXRNc2dcIikubGVuZ3RoID09IDApIHRoaXMubmV3RmxvYXRNc2coKTtcbiAgICAgICAgaWYoZmxvYXRNc2cgID09PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBmbG9hdE1zZyA9IG5ldyBGbG9hdE1zZygpO1xuICAgICAgICAgICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmbG9hdE1zZyk7ICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICBmbG9hdE1zZy56T3JkZXIgPSAxMDAgKyB0aGlzLmNvdW50RmxvYXRNc2c7XG4gICAgICAgIGNvbnNvbGUubG9nKFRvb2wuZ2V0Q2VudGVyWCgpKTtcbiAgICAgICAgZmxvYXRNc2cuc2hvd01zZyh0ZXh0LHt4OlRvb2wuZ2V0Q2VudGVyWCgpICsgdGhpcy5jb3VudEZsb2F0TXNnKjIwLHk6IDM3NSArIHRoaXMuY291bnRGbG9hdE1zZyoyMH0pO1xuICAgICAgICB0aGlzLmNvdW50RmxvYXRNc2crKztcbiAgICB9XG5cbn0iLCJpbXBvcnQgV2ViU29ja2V0TWFuYWdlciBmcm9tIFwiLi9XZWJTb2NrZXRNYW5hZ2VyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XG5cbi8qXG4qIOWuouaIt+err+WPkemAgeWZqFxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNlbmRlcntcbiAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBcbiAgICB9XG4gICAgLy8qKioqKioqKioqKioqKioqVXNlclByb3RvLnByb3RvXG4gICAgLyoqXG4gICAgKiDnlKjmiLfnmbvlvZUgMTAxMTAzXG4gICAgKiBAcGFyYW0gdXNlck5hbWUgXG4gICAgKiBAcGFyYW0gdXNlclBhc3MgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcVVzZXJMb2dpbih1c2VyTmFtZTpzdHJpbmcsdXNlcktleTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJMb2dpblwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbiAgICAgICAgbWVzc2FnZS51c2VyS2V5ID0gdXNlcktleTtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVVzZXJMb2dpbi5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VTRVJfTE9HSU4sYnVmZmVyKTtcbiAgICB9XG4gICAgXG4gICAgICAgICAgICBcbiAgICAvKipcbiAgICAgKiDnlKjmiLfms6jlhowgMTAxMTA0XG4gICAgICogQHBhcmFtIHVzZXJOYW1lIFxuICAgICogQHBhcmFtIHVzZXJQYXNzIFxuICAgICogQHBhcmFtIHVzZXJOaWNrTmFtZVxuICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXFVc2VyUmVnaXN0ZXIodXNlck5hbWU6c3RyaW5nLHVzZXJLZXk6c3RyaW5nLHVzZXJOaWNrTmFtZTpzdHJpbmcpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFVc2VyUmVnaXN0ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVVzZXJSZWdpc3RlclwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIHZhciB1c2VyRGF0YTphbnkgPSB7fTtcbiAgICAgICAgbWVzc2FnZS51c2VyTmFtZSA9IHVzZXJOYW1lO1xuICAgICAgICBtZXNzYWdlLnVzZXJLZXkgPSB1c2VyS2V5O1xuICAgICAgICB1c2VyRGF0YS5uaWNrTmFtZSA9IHVzZXJOaWNrTmFtZTtcbiAgICAgICAgdXNlckRhdGEubHYgPSAxO1xuICAgICAgICBtZXNzYWdlLnVzZXJEYXRhID0gdXNlckRhdGE7XG4gICAgICAgIHZhciBidWZmZXIgPSBSZXFVc2VyUmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9VU0VSX1JFR0lTVEVSLGJ1ZmZlcik7XG4gICAgfVxuXG5cbiAgICAvLyoqKioqKioqKioqKioqKipNYXRjaFByb3RvLnByb3RvXG4gICAgLyoqXG4gICAgICog6K+35rGC5Yy56YWN5a+55bGAIDEwMjEwMVxuICAgICAqIEBwYXJhbSB1c2VySWQgXG4gICAgKiBAcGFyYW0gbWF0Y2hJZCAx5Li6MVYxXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcU1hdGNoKHVzZXJJZDpudW1iZXIsbWF0Y2hJZDpudW1iZXIpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFNYXRjaDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWF0Y2hcIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgbWVzc2FnZS5tYXRjaElkID0gbWF0Y2hJZDtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU1hdGNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFUQ0gsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDor7fmsYIg5a+55bGA5o6l5Y+XIOi/lOWbnjEwMjIwMlxuICAgICAqIEBwYXJhbSB1c2VySWQgXG4gICAgKiBAcGFyYW0gaXNBY2NlcHRcbiAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVxTWF0Y2hBY2NlcHQodXNlcklkOm51bWJlcixpc0FjY2VwdDpudW1iZXIpOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFNYXRjaEFjY2VwdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWF0Y2hBY2NlcHRcIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgbWVzc2FnZS5pc0FjY2VwdCA9IGlzQWNjZXB0O1xuICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWF0Y2hBY2NlcHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVRDSF9BQ0NFUFQsYnVmZmVyKTtcbiAgICB9XG4gICAgXG5cbiAgICAvLyoqKioqKioqKioqKioqKipHYW1lUHJvdG8ucHJvdG9cbiAgICAvKipcbiAgICAgKiDor7fmsYLotYTmupDliqDovb3lrozmr5Ug6L+U5ZueMTAzMjAxXG4gICAgICogQHBhcmFtIHVzZXJJZCBcbiAgICAqIEBwYXJhbSBpc0FjY2VwdGUgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcU9uTG9hZCh1c2VySWQ6bnVtYmVyKTp2b2lkXG4gICAge1xuICAgICAgICB2YXIgUmVxT25Mb2FkOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFPbkxvYWRcIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU9uTG9hZC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX09OTE9BRCxidWZmZXIpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiDor7fmsYLotYTmupDliqDovb3lrozmr5Ug6L+U5ZueMTAzMjAyXG4gICAgICogQHBhcmFtIHVzZXJJZCBcbiAgICAqIEBwYXJhbSBpc0FjY2VwdGUgXG4gICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcU1hcE92ZXIodXNlcklkOm51bWJlcixzdGF0dXM6bnVtYmVyLG1hcENodW5rTGlzdDpBcnJheTxudW1iZXI+KTp2b2lkXG4gICAge1xuICAgICAgICB2YXIgUmVxTWFwT3ZlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFwT3ZlclwiKTtcbiAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgICAgIG1lc3NhZ2UudXNlcklkID0gdXNlcklkO1xuICAgICAgICBtZXNzYWdlLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgICAgbWVzc2FnZS5tYXBDaHVua0xpc3Q9bWFwQ2h1bmtMaXN0O1xuICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFwT3Zlci5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUE9WRVIsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmr4/lm57lkIjmgKrnianmipXmlL7lpb3kuYvlkI4g5oiW6ICF5pe26Ze05Yiw5LqG6K+35rGC5a6M5oiQIOi/lOWbnjEwMzEwM1xuICAgICAqIEBwYXJhbSB1c2VySWQgXG4gICAgKiBAcGFyYW0gaXNBY2NlcHRlIFxuICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXFQdXRNb25zdGVyT3Zlcih1c2VySWQ6bnVtYmVyLG1vbnN0ZXJMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcbiAgICB7XG4gICAgICAgIHZhciBSZXFQdXRNb25zdGVyT3ZlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUHV0TW9uc3Rlck92ZXJcIik7XG4gICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgICAgICBtZXNzYWdlLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgbWVzc2FnZS5tb25zdGVyTGlzdD1tb25zdGVyTGlzdDtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVB1dE1vbnN0ZXJPdmVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUFVUTU9OU1RFUk9WRVIsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqKua2iOaBr+WPkemAgSovXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKndlYlNvY2tldCAqL1xuICAgIC8qKuWPkemAgUdN5a+G5LukICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHbU1zZyhnbTpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFHTUNvbW06YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdNQ29tbVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuY29tbSA9IGdtO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR01Db21tLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfR01fQ09NLGJ1ZmZlcik7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoq5b+D6Lez5YyFICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBzZXJ2SGVhcnRSZXEoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9TRVJWX0hFUlQpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDnlKjmiLfms6jlhoxcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUmVxKHVzZXJOYW1lOnN0cmluZyx1c2VyUGFzczpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFSZWdpc3RlclVzZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVJlZ2lzdGVyVXNlclwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudXNlck5hbWUgPSB1c2VyTmFtZTtcbi8vICAgICAgICAgbWVzc2FnZS51c2VyUGFzcyA9IHVzZXJQYXNzO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUmVnaXN0ZXJVc2VyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFUl9SRUdJU1RFUixidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDnmbvlvZXmnI3liqHlmahcbi8vICAgICAgKiBAcGFyYW0gdG9rZW4gXG4vLyAgICAgICogQHBhcmFtIHNlcnZJZCBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIGxvZ2luU2VydlJlcShzZXJ2SWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTG9naW46YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUxvZ2luXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5jb2RlID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpbkF1dGhlbnRpY2F0aW9uO1xuLy8gICAgICAgICBtZXNzYWdlLnNlcnZlcklkID0gc2VydklkO1xuLy8gICAgICAgICBtZXNzYWdlLmFnZW50SWQgPSAxO1xuLy8gICAgICAgICBtZXNzYWdlLmNsaWVudElkID0gMTtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUxvZ2luLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfU0VSVl9MT0dJTixidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDliJvlu7rop5LoibJcbi8vICAgICAgKiBAcGFyYW0gc2V4IFxuLy8gICAgICAqIEBwYXJhbSBwbGF5ZXJOYW1lIFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlUGxheWVyUmVxKHNleDpudW1iZXIscGxheWVyTmFtZTpzdHJpbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFDcmVhdGVQbGF5ZXI6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUNyZWF0ZVBsYXllclwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gc2V4O1xuLy8gICAgICAgICBtZXNzYWdlLnBsYXllck5hbWUgPSBwbGF5ZXJOYW1lO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQ3JlYXRlUGxheWVyLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfQ1JFQVRFX1BMQVlFUixidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5omA5pyJ5oqA6IO95L+h5oGvICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFBbGxTa2lsbEluZm8oKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9BTExfU0tJTExfSU5GTyk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWHuuaImOaKgOiDveS/oeaBryAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRmlnaHRTa2lsbExpc3QoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GSUdIVF9TS0lMTF9MSVNUKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Y2H57qn5oqA6IO9ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFVcFNraWxsKHNraWxsVXBMdlZvczpBcnJheTxTa2lsbFVwTHZWbz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFVcFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVcFNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QgPSBbXTtcbi8vICAgICAgICAgdmFyIGluZm86YW55O1xuLy8gICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgc2tpbGxVcEx2Vm9zLmxlbmd0aDtpKyspXG4vLyAgICAgICAgIHtcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcbi8vICAgICAgICAgICAgIGluZm8uc2tpbGxJZCA9IHNraWxsVXBMdlZvc1tpXS5za2lsbElkO1xuLy8gICAgICAgICAgICAgaW5mby50b1NraWxsSWQgPSBza2lsbFVwTHZWb3NbaV0udG9Ta2lsbElkO1xuLy8gICAgICAgICAgICAgbWVzc2FnZS5za2lsbExpc3QucHVzaChpbmZvKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXBTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1VQX1NLSUxMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLph43nva7mioDog70gKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVJlc2V0U2tpbGwoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9SRVNFVF9TS0lMTCk7ICAgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguS9v+eUqOmBk+WFtyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVXNlKHByb3BJZDpMb25nLG51bTpudW1iZXIsYXJncz86c3RyaW5nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxVXNlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFVc2VcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDtcbi8vICAgICAgICAgbWVzc2FnZS5udW0gPSBudW07XG4vLyAgICAgICAgIGlmKGFyZ3MpXG4vLyAgICAgICAgICAgICBtZXNzYWdlLmFyZ3MgPSBhcmdzO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxVXNlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVVNFLGJ1ZmZlcik7ICBcbi8vICAgICB9XG4gICAgXG4vLyAgICAgLyoq6K+35rGC5a6g54mp5ZCI5oiQICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRDb21wb3VuZChwcm9wSWQ6TG9uZylcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRDb21wb3VuZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0Q29tcG91bmRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnByb3BJZCA9IHByb3BJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldENvbXBvdW5kLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0NPTVBPVU5ELGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguWWguWuoOeJqeWQg+mlrSovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRGZWVkKHBldElkOkxvbmcscHJvcExpc3Q6QXJyYXk8UHJvcFZvPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEZlZWQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEZlZWRcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcExpc3QgPSBwcm9wTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEZlZWQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRkVFRCxidWZmZXIpOyBcbi8vICAgICB9XG5cblxuLy8gICAgIC8qKuivt+axguaUueWPmOagvOWtkOaKgOiDvSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxQWx0ZXJHcmlkU2tpbGwodHlwZTpudW1iZXIsc2tpbGxVcEdyaWQ6U2tpbGxVcEdyaWRWbyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUFsdGVyR3JpZFNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFBbHRlckdyaWRTa2lsbFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UudHlwZSA9IHR5cGU7ICAgICAgICBcbi8vICAgICAgICAgdmFyIHZvOmFueSA9IHt9O1xuLy8gICAgICAgICB2by5ncmlkSWQgPSBza2lsbFVwR3JpZC5ncmlkSWQ7XG4vLyAgICAgICAgIHZvLnNraWxsSWQgPSBza2lsbFVwR3JpZC5za2lsbElkO1xuLy8gICAgICAgICBtZXNzYWdlLmdyaWQgPSB2bzsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxQWx0ZXJHcmlkU2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpOyAgICAgICAgXG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX0FMVEVSX0dSSURfU0tJTEwsYnVmZmVyKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5pS55Y+Y5a6g54mp6Zi15Z6L5qC85a2QICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRBbHRlckdyaWQodHlwZTpudW1iZXIsZ3JpZExpc3Q6QXJyYXk8TGluZXVwR3JpZFZvPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEFsdGVyR3JpZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0QWx0ZXJHcmlkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gdHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5ncmlkTGlzdCA9IFtdO1xuLy8gICAgICAgICB2YXIgaW5mbzphbnk7XG4vLyAgICAgICAgIGZvcih2YXIgaSA9IDA7aSA8IGdyaWRMaXN0Lmxlbmd0aDtpKyspXG4vLyAgICAgICAgIHtcbi8vICAgICAgICAgICAgIGluZm8gPSB7fTtcbi8vICAgICAgICAgICAgIGluZm8uZ3JpZElkID0gZ3JpZExpc3RbaV0uZ3JpZElkO1xuLy8gICAgICAgICAgICAgaW5mby5wZXRJZCA9IGdyaWRMaXN0W2ldLmhlcm9JZDtcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuZ3JpZExpc3QucHVzaChpbmZvKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0QWx0ZXJHcmlkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0FMVEVSX0dSSUQsYnVmZmVyKTsgICBcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5omt6JuLIG1zZ0lkPTEwMjEwMVxuLy8gICAgICAqIEBwYXJhbSBtb25leVR5cGUgLy8g5omt6JuL57G75Z6LIDA96YeR5biB5oq9IDE96ZK755+z5oq9XG4vLyAgICAgICogQHBhcmFtIG51bVR5cGUg5qyh5pWw57G75Z6LIDA95YWN6LS55Y2V5oq9IDE95Y2V5oq9IDI95Y2B6L+e5oq9XG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFHYWNoYShtb25leVR5cGU6bnVtYmVyLG51bVR5cGU6bnVtYmVyKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxR2FjaGE6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUdhY2hhXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50eXBlID0gbW9uZXlUeXBlO1xuLy8gICAgICAgICBtZXNzYWdlLm51bVR5cGUgPSBudW1UeXBlO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxR2FjaGEuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9HQUNIQSxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAgLyoq6K+35rGC5Zyw5Zu+5YWz5Y2h5b+r6YCf5oiY5paXICovXG4vLyAgICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwU3BlZWRGaWdodCgpOnZvaWRcbi8vICAgICAge1xuLy8gICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NQRUVEX0ZJR0hUKTtcbi8vICAgICAgfVxuXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoei0reS5sOaJq+iNoSAqL1xuLy8gICAgICBwdWJsaWMgc3RhdGljIHJlcU1hcEJ1eVN3ZWVwKCk6dm9pZFxuLy8gICAgICB7XG4vLyAgICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfQlVZX1NXRUVQKTtcbi8vICAgICAgfSAgIFxuXG4vLyAgICAgIC8qKuivt+axguWcsOWbvuWFs+WNoeaJq+iNoSAgKi9cbi8vICAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTd2VlcEZpZ2h0KHNjZW5lSWQ6bnVtYmVyKTp2b2lkXG4vLyAgICAgIHtcbi8vICAgICAgICAgIHZhciAgUmVxTWFwU3dlZXBGaWdodDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFwU3dlZXBGaWdodFwiKTtcbi8vICAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICAgbWVzc2FnZS5zY2VuZUlkID0gc2NlbmVJZDtcbi8vICAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBTd2VlcEZpZ2h0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9TV0VFUF9GSUdIVCxidWZmZXIpO1xuLy8gICAgICB9XG5cbi8vICAgICAvKirpmo/mnLrliJvlu7rkuIDmnaHpvpkgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldFJhbmRvbUNyZWF0ZSgpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SQU5ET01fQ1JFQVRFKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5Zyw5Zu+5pmu6YCa5oiY5paX77yI5a6i5oi356uv5LiA5Zy65oiY5paX57uT5p2f5LmL5ZCO5Y+R6YCB5q2k5raI5oGv77yM5YaN6L+b6KGM5YCS6K6h5pe25ZKM5pys5Zyw5YGH5oiY5paX77yJIG1zZ0lkPTEwNjEwMVx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfTk9STUFMX0ZJR0hUKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5YWz5Y2h5YGH5oiY5paX57uT5p2f6aKG5Y+W5aWW5YqxIG1zZ0lkPTEwNjEwOVx0XHQtLS0tLei/lOWbnua2iOaBryDov5Tlm57miJDlip/mtojmga/vvIxjb2RlPTEwNjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxTWFwTm9ybWFsRmlnaHRFbmQoKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQVBfTk9STUFMX0ZJR0hUX0VORCk7XG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWcsOWbvuWFs+WNoWJvc3PmiJjmlpcgbXNnSWQ9MTA2MTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvbXNnSWQ9MTA2MjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBTY2VuZUZpZ2h0KCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFQX1NDRU5FX0ZJR0hUKTtcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5ZGK6K+J5pyN5Yqh5Zmo5oiY5paX5pKt5pS+57uT5p2f77yI5LuF5LuF5bqU55So5LqO5omA5pyJ55yf5oiY5paX77yJIG1zZ0lkPTEwNjEwMlx0XHQtLS0tLei/lOWbnua2iOaBr21zZ0lkPTEwNjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxVHVyZUZpZ2h0RW5kKCk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfVFJVRV9GSUdIVF9FTkQpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLliIfmjaLlnLDlm77lhbPljaEgbXNnSWQ9MTA2MTA4XHRcdC0tLS0t6L+U5Zue5raI5oGvIOWJr+acrGlk5ZKM5YWz5Y2haWQg5bGe5oCn5Y+Y5YyW5raI5oGvXG4vLyAgICAgICogQHBhcmFtIHNjZW5lSWQgXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFNYXBDaGFuZ2VTY2VuZShzY2VuZUlkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1hcENoYW5nZVNjZW5lOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYXBDaGFuZ2VTY2VuZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2NlbmVJZCA9IHNjZW5lSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYXBDaGFuZ2VTY2VuZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BUF9DSEFOR0VfU0NFTkUsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp5Lqk6YWNIG1zZ0lkPTEwNTEwOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwOVxuLy8gICAgICAqIEBwYXJhbSBwZXRJZDEgXG4vLyAgICAgICogQHBhcmFtIHBldElkMiBcbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZyhwZXRJZDE6TG9uZyxwZXRJZDI6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZDEgPSBwZXRJZDE7XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQyID0gcGV0SWQyO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX01BVElORyxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDnianov5vljJYgbXNnSWQ9MTA1MTEwXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjExXG4vLyAgICAgICogQHBhcmFtIHBldElkMSDov5vljJblrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSBiZVBldElkTGlzdCDmtojogJflrqDnialpZOWIl+ihqFxuLy8gICAgICAqIEBwYXJhbSBwcm9wSWQg5raI6ICX6YGT5YW35ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gcHJvcE51bSDmtojogJfpgZPlhbfmlbDph49cbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldEV2b2x2ZShwZXRJZDpMb25nLGJlUGV0SWRMaXN0OkFycmF5PExvbmc+LHByb3BJZExpc3Q6QXJyYXk8TG9uZz4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRFdm9sdmU6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldEV2b2x2ZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgaWYoYmVQZXRJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2UuYmVQZXRJZExpc3QgPSBiZVBldElkTGlzdDtcbi8vICAgICAgICAgaWYocHJvcElkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5wcm9wSWRMaXN0ID0gcHJvcElkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEV2b2x2ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9FVk9MVkUsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp5a215YyWIG1zZ0lkPTEwNTExMVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwM1xuLy8gICAgICAqIEBwYXJhbSBlZ2dJZCDlrqDnianom4vllK/kuIBpZFxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0SGF0Y2goZWdnSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldEhhdGNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRIYXRjaFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZWdnSWQgPSBlZ2dJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldEhhdGNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX0hBVENILGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeeZu+iusCBtc2dJZD0xMDUxMTJcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTJcbi8vICAgICAgKiBAcGFyYW0gZWdnSWQg5a6g54mp5ZSv5LiAaWRcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkIOmcgOimgeWTgei0qOadoeS7tmlkKDDooajnpLrkuI3pmZDliLYpXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZWdpc3RlcihwZXRJZDpMb25nLHF1YWxpdHlJZDpudW1iZXIpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRSZWdpc3RlcjphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0UmVnaXN0ZXJcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UucXVhbGl0eUlkID0gcXVhbGl0eUlkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0UmVnaXN0ZXIuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVHSVNURVIsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp55Sz6K+357mB6KGNIG1zZ0lkPTEwNTExM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxM1xuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDor7fmsYLmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOaOpeaUtuaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXFNYXRpbmcocGV0SWQ6TG9uZyx0b1BldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRSZXFNYXRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlcU1hdGluZ1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlcU1hdGluZy5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9SRVFfTUFUSU5HLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeaJgOacieS/oeaBryBtc2dJZD0xMDUxMTRcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTRcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAgMT3lip/vvIwyPemYsu+8jDM96YCf77yMND3ooYDvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqIEBwYXJhbSBjb25maWdJZCDlrqDnianphY3nva5pZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGdlbmRlciAg5a6g54mp5oCn5Yir77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gcXVhbGl0eUlkTGlzdCDlrqDnianlk4HotKhpZO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdBbGxJbmZvKHBldFR5cGU6bnVtYmVyLGNvbmZpZ0lkOm51bWJlcixnZW5kZXI6bnVtYmVyLHF1YWxpdHlJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ0FsbEluZm86YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldE1hdGluZ0FsbEluZm9cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldFR5cGUgPSBwZXRUeXBlO1xuLy8gICAgICAgICBtZXNzYWdlLmNvbmZpZ0lkID0gY29uZmlnSWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UuZ2VuZGVyID0gZ2VuZGVyO1xuLy8gICAgICAgICBpZihxdWFsaXR5SWRMaXN0Lmxlbmd0aCA+IDApXG4vLyAgICAgICAgICAgICBtZXNzYWdlLnF1YWxpdHlJZExpc3QgPSBxdWFsaXR5SWRMaXN0O1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0TWF0aW5nQWxsSW5mby5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQUxMSU5GTyxidWZmZXIpO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDor7fmsYLlrqDniannuYHooY3mn6XnnIvor7fmsYLliJfooaggbXNnSWQ9MTA1MTE1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjE1XG4vLyAgICAgICogQHBhcmFtIHBldElkIOWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTZWxlY3RSZXFMaXN0KHBldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRTZWxlY3RSZXFMaXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTZWxlY3RSZXFMaXN0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U2VsZWN0UmVxTGlzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TRUxFQ1RfUkVRX0xJU1QsYnVmZmVyKTtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog6K+35rGC5a6g54mp57mB6KGN5ZCM5oSP5oiW5ouS57udIG1zZ0lkPTEwNTExNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxNu+8jOWmguaenOaYr+WQjOaEj++8jOWvueaWueeOqeWutuWmguaenOWcqOe6v++8jOS8muaUtuWIsG1zZ0lkPTEwNTIxMOa2iOaBr1xuLy8gICAgICAqIEBwYXJhbSBwZXRJZCDmiJHmlrnlrqDnianllK/kuIBpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOWvueaWueWuoOeJqeWUr+S4gGlkXG4vLyAgICAgICogQHBhcmFtIGlzQ29uc2VudCDmmK/lkKblkIzmhI8gdHJ1ZT3lkIzmhI9cbi8vICAgICAgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIHJlcVBldE1hdGluZ0Nob29zZShwZXRJZDpMb25nLHRvUGV0SWQ6TG9uZyxpc0NvbnNlbnQ6Ym9vbGVhbik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldE1hdGluZ0Nob29zZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxUGV0TWF0aW5nQ2hvb3NlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGV0SWQgPSB0b1BldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmlzQ29uc2VudCA9IGlzQ29uc2VudDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ0Nob29zZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9NQVRJTkdfQ0hPT1NFLGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+WIt+aWsCBtc2dJZD0xMDUxMTdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMTdcbi8vICAgICAgKiBAcGFyYW0gcGV0VHlwZSAxPeWKn++8jDI96Ziy77yMMz3pgJ/vvIw0PeihgO+8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIGNvbmZpZ0lkIOWuoOeJqemFjee9rmlk77yIMD3ooajnpLrlhajpg6jvvIlcbi8vICAgICAgKiBAcGFyYW0gZ2VuZGVyIOWuoOeJqeaAp+WIq++8iDA96KGo56S65YWo6YOo77yJXG4vLyAgICAgICogQHBhcmFtIHF1YWxpdHlJZExpc3Qg5a6g54mp5ZOB6LSoaWTvvIgwPeihqOekuuWFqOmDqO+8iVxuLy8gICAgICAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0TWF0aW5nVGFyZ2V0UmVmcmVzaChwZXRUeXBlOm51bWJlcixjb25maWdJZDpudW1iZXIsZ2VuZGVyOm51bWJlcixxdWFsaXR5SWRMaXN0OkFycmF5PG51bWJlcj4pOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRSZWZyZXNoXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRUeXBlID0gcGV0VHlwZTtcbi8vICAgICAgICAgbWVzc2FnZS5jb25maWdJZCA9IGNvbmZpZ0lkO1xuLy8gICAgICAgICBtZXNzYWdlLmdlbmRlciA9IGdlbmRlcjtcbi8vICAgICAgICAgaWYocXVhbGl0eUlkTGlzdC5sZW5ndGggPiAwKVxuLy8gICAgICAgICAgICAgbWVzc2FnZS5xdWFsaXR5SWRMaXN0ID0gcXVhbGl0eUlkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ1RhcmdldFJlZnJlc2guZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX1RBUkdFVF9SRUZSRVNILGJ1ZmZlcik7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIOivt+axguWuoOeJqee5geihjeebruagh+afpeeciyBtc2dJZD0xMDUxMThcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMThcbi8vICAgICAgKiBAcGFyYW0gdG9QbGF5ZXJJZCDooqvmn6XnnIvlrqDniannmoTkuLvkurrnmoRpZFxuLy8gICAgICAqIEBwYXJhbSB0b1BldElkIOiiq+afpeeci+WuoOeJqeWUr+S4gGlkXG4vLyAgICAgICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRNYXRpbmdUYXJnZXRMb29rKHRvUGxheWVySWQ6TG9uZyx0b1BldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRNYXRpbmdUYXJnZXRMb29rOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRNYXRpbmdUYXJnZXRMb29rXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgbWVzc2FnZS50b1BldElkID0gdG9QZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldE1hdGluZ1RhcmdldExvb2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfTUFUSU5HX0NIT09TRSxidWZmZXIpO1xuLy8gICAgIH1cblxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5omT6YCgIG1zZ0lkPTEwOTAxXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjAxICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcE1ha2UocHJvcElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcE1ha2U6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTWFrZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucHJvcElkID0gcHJvcElkOyAgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcE1ha2UuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9NQUtFLGJ1ZmZlcik7XG4vLyAgICAgfVxuXG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5YiG6KejIG1zZ0lkPTEwOTEwNlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwNiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBTcGxpdChlcXVpcElkOkFycmF5PExvbmc+KTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBTcGxpdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBTcGxpdFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UuZXF1aXBJZCA9IGVxdWlwSWQ7ICAgICAgICBcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUVxdWlwU3BsaXQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9TUExJVCxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLoo4XlpIfplIHlrprmiJbop6PplIEgbXNnSWQ9MTA5MTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcExvY2socGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFFcXVpcExvY2s6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwTG9ja1wiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgbWVzc2FnZS5lcXVpcElkID0gZXF1aXBJZDsgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2NrLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTE9DSyxidWZmZXIpOyBcbi8vICAgICB9XG5cbi8vICAgICAvKiror7fmsYLoo4XlpIflvLrljJYgbXNnSWQ9MTA5MTA1XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA5MjA1ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFFcXVpcEF0dEFkZChwZXRJZDpMb25nLGVxdWlwSWQ6TG9uZyxsdWNrTnVtOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9jazphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2NrXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyBcbi8vICAgICAgICAgbWVzc2FnZS5sdWNrTnVtID0gbHVja051bTsgICAgICAgXG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFFcXVpcExvY2suZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9BVFRfQURELGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vIFx0Lyoq6K+35rGC6KOF5aSH56m/5oi0IG1zZ0lkPTEwOTEwMlx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMiAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBMb2FkaW5nKHBldElkOkxvbmcsZXF1aXBJZDpMb25nKVxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcUVxdWlwTG9hZGluZzphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRXF1aXBMb2FkaW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBMb2FkaW5nLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRVFVSVBfTE9BRElORyxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC6KOF5aSH5Y246L29IG1zZ0lkPTEwOTEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwOTIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxRXF1aXBVbkxvYWRpbmcocGV0SWQ6TG9uZyxlcXVpcElkOkxvbmcpXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRXF1aXBVbkxvYWRpbmc6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUVxdWlwVW5Mb2FkaW5nXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICBtZXNzYWdlLmVxdWlwSWQgPSBlcXVpcElkOyAgICAgICAgICAgICAgIFxuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRXF1aXBVbkxvYWRpbmcuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9FUVVJUF9VTkxPQURJTkcsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gXHQvKiror7fmsYLlrqDnianpoobmgp/mioDog70gbXNnSWQ9MTA1MTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTA1MjA2ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRTdHVkeVNraWxsKHBldElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFQZXRTdHVkeVNraWxsOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFQZXRTdHVkeVNraWxsXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5wZXRJZCA9IHBldElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxUGV0U3R1ZHlTa2lsbC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX1BFVF9TVFVEWV9TS0lMTCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5a6g54mp6YeN572u5oqA6IO9IG1zZ0lkPTEwNTEwN1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIwNyovXG4vLyAgICAgcHVibGljIHN0YXRpYyByZXFQZXRSZXNldFNraWxsKHBldElkOkxvbmcsc2tpbGxJZExpc3Q6QXJyYXk8bnVtYmVyPik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFJlc2V0U2tpbGw6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFJlc2V0U2tpbGxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9OyAgXG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgaWYoc2tpbGxJZExpc3QubGVuZ3RoID4gMClcbi8vICAgICAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZExpc3QgPSBza2lsbElkTGlzdDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcVBldFJlc2V0U2tpbGwuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfUkVTRVRfU0tJTEwsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWuoOeJqeaKgOiDvei/m+mYtiBtc2dJZD0xMDUxMDhcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMDUyMDggKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcVBldFNraWxsVXAocGV0SWQ6TG9uZyxza2lsbElkOm51bWJlcik6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcVBldFNraWxsVXA6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcVBldFNraWxsVXBcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnBldElkID0gcGV0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2Uuc2tpbGxJZCA9IHNraWxsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFQZXRTa2lsbFVwLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfUEVUX1NLSUxMX1VQLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gLyoq6K+35rGC5a6g54mp5pS+55SfIG1zZ0lkPTEwNTExOVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwNTIxOCAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxUGV0RnJlZShwZXRJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVzUGV0RnJlZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVzUGV0RnJlZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UucGV0SWQgPSBwZXRJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlc1BldEZyZWUuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9QRVRfRlJFRSxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsQXdhcmQobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsQXdhcmQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcU1haWxBd2FyZFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbEF3YXJkLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9BV0FSRCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTExMjAzICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFNYWlsRGVsZXRlKG1haWxJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxTWFpbERlbGV0ZTphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbERlbGV0ZVwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4vLyAgICAgICAgIG1lc3NhZ2UubWFpbElkID0gbWFpbElkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxTWFpbERlbGV0ZS5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4vLyAgICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuUkVRX01BSUxfREVMRVRFLGJ1ZmZlcik7IFxuLy8gICAgIH1cblxuLy8gICAgIC8qKuivt+axguaJk+W8gOmCruS7tuiuvue9ruW3suivuyBtc2dJZD0xMTExMDEg5peg6L+U5Zue5raI5oGvIOWuouaIt+err+aJk+W8gOaXoOWlluWKsemCruS7tu+8jOiHquihjOiuvue9ruW3suivu+eKtuaAgSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgcmVxT3Blbk1haWwobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFPcGVuTWFpbDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxT3Blbk1haWxcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLm1haWxJZCA9IG1haWxJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcU9wZW5NYWlsLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfT1BFTl9NQUlMLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLpooblj5bpgq7ku7blpZblirEgbXNnSWQ9MTExMTAyXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDIgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxBd2FyZChtYWlsSWQ6TG9uZyk6dm9pZFxuLy8gICAgIHtcbi8vICAgICAgICAgdmFyIFJlcU1haWxBd2FyZDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxTWFpbEF3YXJkXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsQXdhcmQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9NQUlMX0FXQVJELGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLliKDpmaTpgq7ku7YgbXNnSWQ9MTExMTAzXHRcdC0tLS0t6L+U5Zue5raI5oGvICBtc2dJZD0xMTEyMDMgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcU1haWxEZWxldGUobWFpbElkOkxvbmcpOnZvaWRcbi8vICAgICB7XG4vLyAgICAgICAgIHZhciBSZXFNYWlsRGVsZXRlOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFNYWlsRGVsZXRlXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS5tYWlsSWQgPSBtYWlsSWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFNYWlsRGVsZXRlLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfTUFJTF9ERUxFVEUsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aOqOiNkCBtc2dJZD0xMTIxMDFcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDEgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZFB1c2goKTp2b2lkXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfUFVTSCk7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmkJzntKIgbXNnSWQ9MTEyMTAyXHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjAyICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRTZWFyY2godG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kU2VhcmNoOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRTZWFyY2hcIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kU2VhcmNoLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX1NFQVJDSCxidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L55Sz6K+3IG1zZ0lkPTExMjEwM1x0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwMyAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kQXBwbHkodG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kQXBwbHk6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEFwcGx5XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbi8vICAgICAgICAgbWVzc2FnZS50b1BsYXllcklkID0gdG9QbGF5ZXJJZDtcbi8vICAgICAgICAgdmFyIGJ1ZmZlciA9IFJlcUZyaWVuZEFwcGx5LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0FQUExZLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vmk43kvZwgbXNnSWQ9MTEyMTA0XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA0ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRPcGVyYXRpb24odHlwZTpudW1iZXIsdG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kT3BlcmF0aW9uOmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJSZXFGcmllbmRPcGVyYXRpb25cIik7XG4vLyAgICAgICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuLy8gICAgICAgICBtZXNzYWdlLnR5cGUgPSB0eXBlO1xuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kT3BlcmF0aW9uLmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX09QRVJBVElPTixidWZmZXIpOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L6K+m57uG5L+h5oGvIG1zZ0lkPTExMjEwNVx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTExMjIwNSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kTW9yZUluZm8odG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kTW9yZUluZm86YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZE1vcmVJbmZvXCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kTW9yZUluZm8uZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfTU9SRV9JTkZPLGJ1ZmZlcik7IFxuLy8gICAgIH1cbi8vICAgICAvKiror7fmsYLlpb3lj4vpgIHnpLwgbXNnSWQ9MTEyMTA2XHRcdC0tLS0t6L+U5Zue5oiQ5Yqf5raI5oGvbXNnSWQ9MTEyMjA2ICovXG4vLyAgICAgcHVibGljIHN0YXRpYyBSZXFGcmllbmRHaWZ0KGdpZnRJZDpudW1iZXIsdG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kR2lmdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiUmVxRnJpZW5kR2lmdFwiKTtcbi8vICAgICAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307ICAgICAgICBcbi8vICAgICAgICAgbWVzc2FnZS5naWZ0SWQgPSBnaWZ0SWQ7XG4vLyAgICAgICAgIG1lc3NhZ2UudG9QbGF5ZXJJZCA9IHRvUGxheWVySWQ7XG4vLyAgICAgICAgIHZhciBidWZmZXIgPSBSZXFGcmllbmRHaWZ0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbi8vICAgICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5SRVFfRlJJRU5EX0dJRlQsYnVmZmVyKTsgXG4vLyAgICAgfVxuLy8gICAgIC8qKuivt+axguWlveWPi+aJgOacieS/oeaBryBtc2dJZD0xMTIxMDdcdFx0LS0tLS3ov5Tlm57miJDlip/mtojmga9tc2dJZD0xMTIyMDcgKi9cbi8vICAgICBwdWJsaWMgc3RhdGljIFJlcUZyaWVuZEFsbEluZm8oKTp2b2lkXG4vLyAgICAgeyAgICAgICAgICAgICAgICAgICAgICAgIFxuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfQWxsX0luZm8pOyBcbi8vICAgICB9XG4vLyAgICAgLyoq6K+35rGC5aW95Y+L5YiH56OLIG1zZ0lkPTExMjEwOFx0XHQtLS0tLei/lOWbnuaIkOWKn+a2iOaBr21zZ0lkPTEwODIwMSAqL1xuLy8gICAgIHB1YmxpYyBzdGF0aWMgUmVxRnJpZW5kRmlnaHQodG9QbGF5ZXJJZDpMb25nKTp2b2lkXG4vLyAgICAge1xuLy8gICAgICAgICB2YXIgUmVxRnJpZW5kRmlnaHQ6YW55ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIlJlcUZyaWVuZEZpZ2h0XCIpO1xuLy8gICAgICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTsgICAgICAgIFxuLy8gICAgICAgICBtZXNzYWdlLnRvUGxheWVySWQgPSB0b1BsYXllcklkO1xuLy8gICAgICAgICB2YXIgYnVmZmVyID0gUmVxRnJpZW5kRmlnaHQuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuLy8gICAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlJFUV9GUklFTkRfRklHSFQsYnVmZmVyKTsgXG4vLyAgICAgfVxuXG5cblxuXG5cblxuXG5cbiAgICAvKirnmbvlvZXor7fmsYIgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGxvZ2luUmVxKGFjY291bnQ6c3RyaW5nKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgTG9naW5SZXF1ZXN0OmFueSA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJMb2dpblJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLm5hbWUgPSBhY2NvdW50O1xuICAgIC8vICAgICBtZXNzYWdlLnRva2VuID0gR2FtZURhdGFNYW5hZ2VyLmlucy5sb2dpblRva2VuO1xuICAgIC8vICAgICBtZXNzYWdlLm5pY2tuYW1lID0gXCJ4aWVsb25nXCI7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBMb2dpblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLlVTRVJfTE9HSU4sUHJvdG9jb2wuVVNFUl9MT0dJTl9DTUQsYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6I635Y+W6Iux6ZuE5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnZXRIZXJvSW5mb1JlcShzdGF0dXNDb2RlOm51bWJlcik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEhlcm9JbmZvUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiSGVyb0luZm9SZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5zdGF0dXNDb2RlID0gc3RhdHVzQ29kZTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IEhlcm9JbmZvUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuSEVSTyxQcm90b2NvbC5IRVJPX0dFVF9JTkZPUyxidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKiroi7Hpm4TkuIrjgIHkuIvjgIHmm7TmlrDpmLXlnosgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGhlcm9MaW51ZXBVcGRhdGVSZXEobGluZXVwSWQ6bnVtYmVyLGhlcm9JZDpzdHJpbmcsaXNVcDpib29sZWFuKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICBpZighaXNVcCAmJiBHYW1lRGF0YU1hbmFnZXIuaW5zLnNlbGZQbGF5ZXJEYXRhLmhlcm9MaW5ldXBEaWMudmFsdWVzLmxlbmd0aCA8PSAxKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICBUaXBzTWFuYWdlci5pbnMuc2hvd0Zsb2F0TXNnKFwi6Zi15LiK6Iux6ZuE5LiN5b6X5bCR5LqO5LiA5LiqXCIsMzAsXCIjZmYwMDAwXCIsTGF5ZXJNYW5hZ2VyLmlucy5nZXRMYXllcihMYXllck1hbmFnZXIuVElQX0xBWUVSKSxHYW1lQ29uZmlnLlNUQUdFX1dJRFRILzIsR2FtZUNvbmZpZy5TVEFHRV9IRUlHSFQvMiwxLDAsMjAwKTtcbiAgICAvLyAgICAgICAgIHJldHVybjtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICB2YXIgVXBkYXRlRm9ybWF0aW9uUmVxdWVzdDphbnkgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiVXBkYXRlRm9ybWF0aW9uUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc2l0ZUlkeCA9IGxpbmV1cElkO1xuICAgIC8vICAgICBtZXNzYWdlLmhlcm9JZCA9IGhlcm9JZDtcbiAgICAvLyAgICAgbWVzc2FnZS5mbGFnID0gaXNVcDtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFVwZGF0ZUZvcm1hdGlvblJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkhFUk8sUHJvdG9jb2wuSEVST19VUERBVEVfRk9STUFUSU9OLGJ1ZmZlcik7XG4gICAgLy8gfVxuICAgIC8vIC8qKuivt+axguWFs+WNoeS/oeaBryAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgZ2F0ZUdhdGVJbmZvUmVxKCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIEdhdGVJbmZvUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJHYXRlSW5mb1JlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLnN0YXR1c0NvZGUgPSAxO1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gR2F0ZUluZm9SZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSU5GTyxidWZmZXIpO1xuICAgIC8vIH1cbiAgICAvLyAvKirmjJHmiJjlhbPljaEgKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGJhbGx0ZUdhdGVSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBCYXR0bGVHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJCYXR0bGVHYXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2UuZ2F0ZUtleSA9IGdhdGVLZXk7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBCYXR0bGVHYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX0JBVFRMRSxidWZmZXIpO1xuICAgIC8vIH1cblxuICAgIC8vIC8qKuivt+axguaJq+iNoeWFs+WNoSAqL1xuICAgIC8vIHB1YmxpYyBzdGF0aWMgc2NhbkdhdGVSZXEoZ2F0ZUtleTpzdHJpbmcpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBTY2FuR2F0ZVJlcXVlc3QgPSBXZWJTb2NrZXRNYW5hZ2VyLmlucy5kZWZpbmVQcm90b0NsYXNzKFwiU2NhbkdhdGVSZXF1ZXN0XCIpO1xuICAgIC8vICAgICB2YXIgbWVzc2FnZTphbnkgPSB7fTtcbiAgICAvLyAgICAgbWVzc2FnZS5nYXRlS2V5ID0gZ2F0ZUtleTtcbiAgICAvLyAgICAgdmFyIGJ1ZmZlciA9IFNjYW5HYXRlUmVxdWVzdC5lbmNvZGUobWVzc2FnZSkuZmluaXNoKCk7XG4gICAgLy8gICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnNlbmRNc2coUHJvdG9jb2wuR0FURSxQcm90b2NvbC5HQVRFX1NDQU4sYnVmZmVyKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5oyC5py65aWW5Yqx5L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlSGFuZ3VwU3RhdGVSZXEoKTp2b2lkXG4gICAgLy8ge1xuICAgIC8vICAgICB2YXIgSGFuZ3VwU3RhdGVSZXF1ZXN0ID0gV2ViU29ja2V0TWFuYWdlci5pbnMuZGVmaW5lUHJvdG9DbGFzcyhcIkhhbmd1cFN0YXRlUmVxdWVzdFwiKTtcbiAgICAvLyAgICAgdmFyIG1lc3NhZ2U6YW55ID0ge307XG4gICAgLy8gICAgIG1lc3NhZ2Uuc3RhdHVzQ29kZSA9IDE7XG4gICAgLy8gICAgIHZhciBidWZmZXIgPSBIYW5ndXBTdGF0ZVJlcXVlc3QuZW5jb2RlKG1lc3NhZ2UpLmZpbmlzaCgpO1xuICAgIC8vICAgICBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUsYnVmZmVyKTtcbiAgICAvLyAgICAgLy8gV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfSEFORFVQX1NUQVRFKTtcbiAgICAvLyB9XG4gICAgLy8gLyoq6K+35rGC5YWz5Y2h5oyC5py65L+h5oGvICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBnYXRlU3dpdGNoSGFuZ1JlcShnYXRlS2V5OnN0cmluZyk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdmFyIFN3aXRjaEhhbmdHYXRlUmVxdWVzdCA9IFdlYlNvY2tldE1hbmFnZXIuaW5zLmRlZmluZVByb3RvQ2xhc3MoXCJTd2l0Y2hIYW5nR2F0ZVJlcXVlc3RcIik7XG4gICAgLy8gICAgIHZhciBtZXNzYWdlOmFueSA9IHt9O1xuICAgIC8vICAgICBtZXNzYWdlLmdhdGVLZXkgPSBnYXRlS2V5O1xuICAgIC8vICAgICB2YXIgYnVmZmVyID0gU3dpdGNoSGFuZ0dhdGVSZXF1ZXN0LmVuY29kZShtZXNzYWdlKS5maW5pc2goKTtcbiAgICAvLyAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMuc2VuZE1zZyhQcm90b2NvbC5HQVRFLFByb3RvY29sLkdBVEVfU1dJVENIX0hBTkdfR0FURSxidWZmZXIpO1xuICAgIC8vICAgICAvLyBXZWJTb2NrZXRNYW5hZ2VyLmlucy5zZW5kTXNnKFByb3RvY29sLkdBVEUsUHJvdG9jb2wuR0FURV9IQU5EVVBfU1RBVEUpO1xuICAgIC8vIH1cbiAgICBcblxuXG4gICAgLy8gLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipIdHRwICovXG4gICAgLy8gLyoq5rWL6K+V55m75b2VICovXG4gICAgLy8gcHVibGljIHN0YXRpYyBodHRwTG9naW5SZXEoYWNjb3VudDpzdHJpbmcscHdkOnN0cmluZyxjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBwYXJhbXM6YW55ID0ge307XG4gICAgLy8gICAgIHBhcmFtcy5hY2NvdW50ID0gYWNjb3VudDtcbiAgICAvLyAgICAgcGFyYW1zLnBhc3N3b3JkID0gcHdkO1xuICAgIC8vICAgICBIdHRwTWFuYWdlci5pbnMuc2VuZChIVFRQUmVxdWVzdFVybC50ZXN0TG9naW5VUkwsSFRUUFJlcVR5cGUuR0VULHBhcmFtcyxjYWxsZXIsY2FsbEJhY2spO1xuICAgIC8vIH1cbiAgICAvLyAvKirojrflj5bmnI3liqHlmajliJfooaggKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBHYW1lU2VydmVyUmVxKGNhbGxlcj86YW55LGNhbGxCYWNrPzpGdW5jdGlvbik6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgSHR0cE1hbmFnZXIuaW5zLnNlbmQoSFRUUFJlcXVlc3RVcmwuZ2FtZVNlcnZlclVSTCxIVFRQUmVxVHlwZS5HRVQsbnVsbCxjYWxsZXIsY2FsbEJhY2spO1xuICAgIC8vIH1cbiAgICAvLyAvKirov5vlhaXmuLjmiI8gKi9cbiAgICAvLyBwdWJsaWMgc3RhdGljIGh0dHBFbnRlckdhbWVSZXEoc2lkOm51bWJlcixjYWxsZXI/OmFueSxjYWxsQmFjaz86RnVuY3Rpb24pOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHZhciBwYXJhbXM6YW55ID0ge307XG4gICAgLy8gICAgIHBhcmFtcy5zaWQgPSBzaWQ7XG4gICAgLy8gICAgIEh0dHBNYW5hZ2VyLmlucy5zZW5kKEhUVFBSZXF1ZXN0VXJsLmVudGVyR2FtZVVSTCxIVFRQUmVxVHlwZS5HRVQscGFyYW1zLGNhbGxlcixjYWxsQmFjayk7XG4gICAgLy8gfVxufSIsIi8qXG4qIOWMheino+aekFxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2thZ2VJbiBleHRlbmRzIExheWEuQnl0ZXtcbiAgICBcbiAgICAvLyBwdWJsaWMgbW9kdWxlOm51bWJlcjtcbiAgICBwdWJsaWMgY21kOm51bWJlcjtcbiAgICBwdWJsaWMgYm9keTtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICAvLyBwdWJsaWMgcmVhZChtc2c6T2JqZWN0ID0gbnVsbCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgIC8vICAgICB0aGlzLmNsZWFyKCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XG4gICAgLy8gICAgIC8v5qCH6K6w5ZKM6ZW/5bqmXG4gICAgLy8gICAgIHZhciBtYXJrID0gdGhpcy5nZXRJbnQxNigpO1xuICAgIC8vICAgICB2YXIgbGVuID0gdGhpcy5nZXRJbnQzMigpO1xuICAgIC8vICAgICAvL+WMheWktFxuICAgIC8vICAgICB0aGlzLm1vZHVsZSA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIHZhciB0eXBlID0gdGhpcy5nZXRCeXRlKCk7XG4gICAgLy8gICAgIHZhciBmb3JtYXQgPSB0aGlzLmdldEJ5dGUoKTtcbiAgICAvLyAgICAgLy/mlbDmja5cbiAgICAvLyAgICAgdmFyIHRlbXBCeXRlID0gdGhpcy5idWZmZXIuc2xpY2UodGhpcy5wb3MpO1xuICAgIC8vICAgICB0aGlzLmJvZHkgPSBuZXcgVWludDhBcnJheSh0ZW1wQnl0ZSk7XG5cbiAgICAvLyB9XG4gICAgXG4gICAgLy/mlrDpgJrkv6FcbiAgICAvLyBwdWJsaWMgcmVhZChtc2c6T2JqZWN0ID0gbnVsbCk6dm9pZFxuICAgIC8vIHtcbiAgICAvLyAgICAgdGhpcy5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbu+8m1xuICAgIC8vICAgICB0aGlzLmNsZWFyKCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihtc2cpO1xuICAgIC8vICAgICB0aGlzLnBvcyA9IDA7XG5cbiAgICAvLyAgICAgdmFyIGxlbiA9IHRoaXMuZ2V0SW50MzIoKTtcbiAgICAvLyAgICAgdGhpcy5jbWQgPSB0aGlzLmdldEludDMyKCk7XG4gICAgLy8gICAgIC8v5pWw5o2uXG4gICAgLy8gICAgIHZhciB0ZW1wQnl0ZSA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zKTtcbiAgICAvLyAgICAgdGhpcy5ib2R5ID0gbmV3IFVpbnQ4QXJyYXkodGVtcEJ5dGUpO1xuXG4gICAgLy8gfVxuICAgIC8v5paw6YCa5L+hIOeymOWMheWkhOeQhlxuICAgIHB1YmxpYyByZWFkKGJ1ZmZEYXRhKTp2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFu77ybXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy53cml0ZUFycmF5QnVmZmVyKGJ1ZmZEYXRhKTtcbiAgICAgICAgdGhpcy5wb3MgPSAwO1xuXG4gICAgICAgIHZhciBsZW4gPSB0aGlzLmdldEludDMyKCk7XG4gICAgICAgIHRoaXMuY21kID0gdGhpcy5nZXRJbnQzMigpO1xuICAgICAgICAvL+aVsOaNrlxuICAgICAgICB2YXIgdGVtcEJ5dGUgPSB0aGlzLmJ1ZmZlci5zbGljZSh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMuYm9keSA9IG5ldyBVaW50OEFycmF5KHRlbXBCeXRlKTtcblxuICAgIH1cbiAgICBcbn1cbiIsImltcG9ydCBXZWJTb2NrZXRNYW5hZ2VyIGZyb20gXCIuL1dlYlNvY2tldE1hbmFnZXJcIjtcblxuLypcbiog5omT5YyFXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2FnZU91dCBleHRlbmRzIExheWEuQnl0ZXtcbiAgICAvLyBwcml2YXRlIFBBQ0tFVF9NQVJLID0gMHgwO1xuICAgIC8vIHByaXZhdGUgbW9kdWxlID0gMDtcbiAgICAvLyBwcml2YXRlIHR5cGUgPSAwO1xuICAgIC8vIHByaXZhdGUgZm9ybWFydCA9IDA7XG4gICAgcHJpdmF0ZSBjbWQ7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgLy8gcHVibGljIHBhY2sobW9kdWxlLGNtZCxkYXRhPzphbnkpOnZvaWRcbiAgICAvLyB7XG4gICAgLy8gICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcbiAgICAvLyAgICAgdGhpcy5tb2R1bGUgPSBtb2R1bGU7XG4gICAgLy8gICAgIHRoaXMuY21kID0gY21kO1xuICAgIC8vICAgICB0aGlzLndyaXRlSW50MTYodGhpcy5QQUNLRVRfTUFSSyk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMihkYXRhLmJ5dGVMZW5ndGggKyAxMCk7XG4gICAgLy8gICAgIC8v5YyF5aS0XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLm1vZHVsZSk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMudHlwZSk7XG4gICAgLy8gICAgIHRoaXMud3JpdGVCeXRlKHRoaXMuZm9ybWFydCk7XG4gICAgLy8gICAgIC8v5raI5oGv5L2TXG4gICAgLy8gICAgIGlmKGRhdGEpXG4gICAgLy8gICAgIHtcbiAgICAvLyAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH1cblxuICAgIC8qKuaWsOmAmuS/oSAqL1xuICAgIHB1YmxpYyBwYWNrKGNtZCxkYXRhPzphbnkpOnZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47Ly/orr7nva5lbmRpYW7vvJtcblxuICAgICAgICB0aGlzLmNtZCA9IGNtZDtcbiAgICAgICAgdmFyIGxlbiA9IChkYXRhID8gZGF0YS5ieXRlTGVuZ3RoIDogMCkgKyAxMjtcbiAgICAgICAgdmFyIGNvZGU6bnVtYmVyID0gV2ViU29ja2V0TWFuYWdlci5jb2RlQ291bnRebGVuXjUxMjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMud3JpdGVJbnQzMihsZW4pO1xuICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICB0aGlzLndyaXRlSW50MzIoY29kZSk7XG4gICAgICAgIHRoaXMud3JpdGVJbnQzMih0aGlzLmNtZCk7XG4gICAgICAgIGlmKGRhdGEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVBcnJheUJ1ZmZlcihkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFdlYlNvY2tldE1hbmFnZXIuY29kZUNvdW50KysgO1xuICAgIH1cblxufSIsIi8qXG4qIOaVsOaNruWkhOeQhkhhbmxkZXJcbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXRIYW5kbGVye1xuICAgIC8vIHB1YmxpYyBzdGF0dXNDb2RlOm51bWJlciA9IDA7XG4gICAgcHVibGljIGNhbGxlcjphbnk7XG4gICAgcHJpdmF0ZSBjYWxsQmFjazpGdW5jdGlvbjtcbiAgICBjb25zdHJ1Y3RvcihjYWxsZXI/OmFueSxjYWxsYmFjaz86RnVuY3Rpb24pe1xuICAgICAgICB0aGlzLmNhbGxlciA9IGNhbGxlcjtcbiAgICAgICAgdGhpcy5jYWxsQmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIHB1YmxpYyBleHBsYWluKGRhdGE/OmFueSk6dm9pZFxuICAgIHtcbiAgICAgICAgLy8gdmFyIHN0YXR1c0NvZGUgPSBkYXRhLnN0YXR1c0NvZGU7XG4gICAgICAgIC8vIGlmKHN0YXR1c0NvZGUgPT0gMClcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgdGhpcy5zdWNjZXNzKGRhdGEpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGVsc2VcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCLmnI3liqHlmajov5Tlm57vvJpcIixkYXRhLnN0YXR1c0NvZGUpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuc3VjY2VzcyhkYXRhKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHN1Y2Nlc3MoZGF0YT86YW55KTp2b2lkXG4gICAge1xuICAgICAgICBpZih0aGlzLmNhbGxlciAmJiB0aGlzLmNhbGxCYWNrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZihkYXRhKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsbEJhY2suY2FsbCh0aGlzLmNhbGxlcixkYXRhKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxCYWNrLmNhbGwodGhpcy5jYWxsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBEaWN0aW9uYXJ5IGZyb20gXCIuLi8uLi9Ub29sL0RpY3Rpb25hcnlcIjtcbmltcG9ydCBFdmVudE1hbmFnZXIgZnJvbSBcIi4uL0V2ZW50TWFuYWdlclwiO1xuaW1wb3J0IFBhY2thZ2VJbiBmcm9tIFwiLi9QYWNrYWdlSW5cIjtcbmltcG9ydCBQYWNrYWdlT3V0IGZyb20gXCIuL1BhY2thZ2VPdXRcIjtcbmltcG9ydCBTb2NrZXRIYW5kbGVyIGZyb20gXCIuL1NvY2tldEhhbmRsZXJcIjtcbmltcG9ydCBDbGllbnRTZW5kZXIgZnJvbSBcIi4vQ2xpZW50U2VuZGVyXCI7XG5pbXBvcnQgeyBQcm90b2NvbCB9IGZyb20gXCIuLi9Db25zdC9HYW1lQ29uZmlnXCI7XG5cbi8qKlxuICogc29ja2V05Lit5b+DXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlYlNvY2tldE1hbmFnZXIge1xuICAgLyoq6YCa5L+hY29kZeasoeaVsCAqL1xuICAgcHVibGljIHN0YXRpYyBjb2RlQ291bnQ6bnVtYmVyID0gMDtcbiAgIHByaXZhdGUgaXA6c3RyaW5nO1xuICAgcHJpdmF0ZSBwb3J0Om51bWJlcjtcbiAgIHByaXZhdGUgd2ViU29ja2V0OkxheWEuU29ja2V0O1xuICAgcHJpdmF0ZSBzb2NrZXRIYW5sZGVyRGljOkRpY3Rpb25hcnk7XG4gICBwcml2YXRlIHByb3RvUm9vdDphbnk7XG4gICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgIHRoaXMuc29ja2V0SGFubGRlckRpYyA9IG5ldyBEaWN0aW9uYXJ5KCk7XG4gICB9XG4gICBwcml2YXRlIHN0YXRpYyBfaW5zOldlYlNvY2tldE1hbmFnZXIgPSBudWxsO1xuICAgcHVibGljIHN0YXRpYyBnZXQgaW5zKCk6V2ViU29ja2V0TWFuYWdlcntcbiAgICAgICBpZih0aGlzLl9pbnMgPT0gbnVsbClcbiAgICAgICB7ICBcbiAgICAgICAgICAgdGhpcy5faW5zID0gbmV3IFdlYlNvY2tldE1hbmFnZXIoKTtcbiAgICAgICB9XG4gICAgICAgcmV0dXJuIHRoaXMuX2lucztcbiAgIH1cblxuICAgcHVibGljIGNvbm5lY3QoaXA6c3RyaW5nLHBvcnQ6bnVtYmVyKTp2b2lkXG4gICB7XG4gICAgICAgdGhpcy5pcCA9IGlwO1xuICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XG5cbiAgICAgICB0aGlzLndlYlNvY2tldCA9IG5ldyBMYXlhLlNvY2tldCgpO1xuICAgICAgIHRoaXMud2ViU29ja2V0Lm9uKExheWEuRXZlbnQuT1BFTix0aGlzLHRoaXMud2ViU29ja2V0T3Blbik7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5NRVNTQUdFLHRoaXMsdGhpcy53ZWJTb2NrZXRNZXNzYWdlKTtcbiAgICAgICB0aGlzLndlYlNvY2tldC5vbihMYXlhLkV2ZW50LkNMT1NFLHRoaXMsdGhpcy53ZWJTb2NrZXRDbG9zZSk7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQub24oTGF5YS5FdmVudC5FUlJPUix0aGlzLHRoaXMud2ViU29ja2V0RXJyb3IpO1xuICAgICAgIC8v5Yqg6L295Y2P6K6uXG4gICAgICAgaWYoIXRoaXMucHJvdG9Sb290KXtcbiAgICAgICAgICAgdmFyIHByb3RvQnVmVXJscyA9IFtcIm91dHNpZGUvcHJvdG8vVXNlclByb3RvLnByb3RvXCIsXCJvdXRzaWRlL3Byb3RvL01hdGNoUHJvdG8ucHJvdG9cIixcIm91dHNpZGUvcHJvdG8vR2FtZVByb3RvLnByb3RvXCJdO1xuICAgICAgICAgICBMYXlhLkJyb3dzZXIud2luZG93LnByb3RvYnVmLmxvYWQocHJvdG9CdWZVcmxzLHRoaXMucHJvdG9Mb2FkQ29tcGxldGUpO1xuICAgICAgICAgICAgXG4gICAgICAgfVxuICAgICAgIGVsc2VcbiAgICAgICB7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0LmNvbm5lY3RCeVVybChcIndzOi8vXCIrdGhpcy5pcCtcIjpcIit0aGlzLnBvcnQpO1xuICAgICAgIH1cbiAgIH1cbiAgIC8qKuWFs+mXrXdlYnNvY2tldCAqL1xuICAgcHVibGljIGNsb3NlU29ja2V0KCk6dm9pZFxuICAge1xuICAgICAgIGlmKHRoaXMud2ViU29ja2V0KVxuICAgICAgIHtcbiAgICAgICAgICAgdGhpcy53ZWJTb2NrZXQub2ZmKExheWEuRXZlbnQuT1BFTix0aGlzLHRoaXMud2ViU29ja2V0T3Blbik7XG4gICAgICAgICAgIHRoaXMud2ViU29ja2V0Lm9mZihMYXlhLkV2ZW50Lk1FU1NBR0UsdGhpcyx0aGlzLndlYlNvY2tldE1lc3NhZ2UpO1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5DTE9TRSx0aGlzLHRoaXMud2ViU29ja2V0Q2xvc2UpO1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5vZmYoTGF5YS5FdmVudC5FUlJPUix0aGlzLHRoaXMud2ViU29ja2V0RXJyb3IpO1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldC5jbG9zZSgpO1xuICAgICAgICAgICB0aGlzLndlYlNvY2tldCA9IG51bGw7XG4gICAgICAgfVxuICAgfVxuICBcbiAgIHByaXZhdGUgcHJvdG9Mb2FkQ29tcGxldGUoZXJyb3Iscm9vdCk6dm9pZFxuICAge1xuICAgICAgIFdlYlNvY2tldE1hbmFnZXIuaW5zLnByb3RvUm9vdCA9IHJvb3Q7XG4gICAgICAgV2ViU29ja2V0TWFuYWdlci5pbnMud2ViU29ja2V0LmNvbm5lY3RCeVVybChcIndzOi8vXCIrV2ViU29ja2V0TWFuYWdlci5pbnMuaXArXCI6XCIrV2ViU29ja2V0TWFuYWdlci5pbnMucG9ydCk7XG4gICB9XG4gICBwcml2YXRlIHdlYlNvY2tldE9wZW4oKTp2b2lkXG4gICB7XG4gICAgICAgY29uc29sZS5sb2coXCJ3ZWJzb2NrZXQgb3Blbi4uLlwiKTtcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YSA9IG5ldyBMYXlhLkJ5dGUoKTtcbiAgICAgICB0aGlzLmJ5dGVCdWZmRGF0YS5lbmRpYW4gPSBMYXlhLkJ5dGUuQklHX0VORElBTjsvL+iuvue9rmVuZGlhbjtcbiAgICAgICB0aGlzLnRlbXBCeXRlID0gbmV3IExheWEuQnl0ZSgpO1xuICAgICAgIHRoaXMudGVtcEJ5dGUuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47XG5cbiAgICAgICBXZWJTb2NrZXRNYW5hZ2VyLmNvZGVDb3VudCA9IDE7XG4gICAgICAgIC8vICAgIEV2ZW50TWFuYWdlci5pbnMuZGlzcGF0Y2hFdmVudChFdmVudE1hbmFnZXIuU0VSVkVSX0NPTk5FQ1RFRCk75pqC5pe25LiN6ZyA6KaB6I635Y+W5pyN5Yqh5Zmo5YiX6KGoXG4gICB9XG4gICAvL+e8k+WGsuWtl+iKguaVsOe7hFxuICAgcHJpdmF0ZSBieXRlQnVmZkRhdGE6TGF5YS5CeXRlO1xuICAgLy/plb/luqblrZfoioLmlbDnu4RcbiAgIHByaXZhdGUgdGVtcEJ5dGU6TGF5YS5CeXRlO1xuICBcbiAgIHByaXZhdGUgcGFyc2VQYWNrYWdlRGF0YShwYWNrTGVuKTp2b2lkXG4gICB7XG4gICAgICAgLy/lrozmlbTljIVcbiAgICAgICB0aGlzLnRlbXBCeXRlLmNsZWFyKCk7XG4gICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLHBhY2tMZW4pO1xuICAgICAgIHRoaXMudGVtcEJ5dGUucG9zID0gMDtcbiAgICAgICAvL+aWreWMheWkhOeQhlxuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhID0gbmV3IExheWEuQnl0ZSh0aGlzLmJ5dGVCdWZmRGF0YS5nZXRVaW50OEFycmF5KHBhY2tMZW4sdGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoKSk7XG4gICAgICAgLy8gdGhpcy5ieXRlQnVmZkRhdGEud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIscGFja0xlbix0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpO1xuICAgICAgIHRoaXMuYnl0ZUJ1ZmZEYXRhLmVuZGlhbiA9IExheWEuQnl0ZS5CSUdfRU5ESUFOOy8v6K6+572uZW5kaWFuO1xuXG4gICAgICAgLy/op6PmnpDljIVcbiAgICAgICB2YXIgcGFja2FnZUluOlBhY2thZ2VJbiA9IG5ldyBQYWNrYWdlSW4oKTtcbiAgICAgICAvLyB2YXIgYnVmZiA9IHRoaXMudGVtcEJ5dGUuYnVmZmVyLnNsaWNlKDAsdGhpcy50ZW1wQnl0ZS5sZW5ndGgpO1xuICAgICAgIHBhY2thZ2VJbi5yZWFkKHRoaXMudGVtcEJ5dGUuYnVmZmVyKTtcblxuICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IG1zZy4uLlwiLHBhY2thZ2VJbi5jbWQsdGhpcy50ZW1wQnl0ZS5sZW5ndGgpO1xuICAgICAgIGlmKHBhY2thZ2VJbi5jbWQgPT0gMTA1MjAyKVxuICAgICAgIHtcbiAgICAgICAgICAgY29uc29sZS5sb2coXCJcIik7XG4gICAgICAgfVxuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIisgcGFja2FnZUluLmNtZDtcbiAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLnNvY2tldEhhbmxkZXJEaWMuZ2V0KGtleSk7XG4gICAgICAgaWYoaGFuZGxlcnMgJiYgaGFuZGxlcnMubGVuZ3RoID4gMClcbiAgICAgICB7XG4gICAgICAgICAgIGZvcih2YXIgaSA9IGhhbmRsZXJzLmxlbmd0aCAtIDE7aSA+PSAwO2ktLSlcbiAgICAgICAgICAge1xuICAgICAgICAgICAgICAgaGFuZGxlcnNbaV0uZXhwbGFpbihwYWNrYWdlSW4uYm9keSk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgLy8gaGFuZGxlcnMuZm9yRWFjaChzb2NrZXRIYW5sZGVyID0+IHtcbiAgICAgICAgICAgLy8gICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbihwYWNrYWdlSW4uYm9keSk7XG5cbiAgICAgICAgICAgLy8gfSk7XG4gICAgICAgfVxuICAgICAgIFxuICAgICAgIC8v6YCS5b2S5qOA5rWL5piv5ZCm5pyJ5a6M5pW05YyFXG4gICAgICAgaWYodGhpcy5ieXRlQnVmZkRhdGEubGVuZ3RoID4gNClcbiAgICAgICB7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUuY2xlYXIoKTtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS53cml0ZUFycmF5QnVmZmVyKHRoaXMuYnl0ZUJ1ZmZEYXRhLmJ1ZmZlciwwLDQpO1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLnBvcyA9IDA7XG4gICAgICAgICAgIHBhY2tMZW4gPSB0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgKyA0O1xuICAgICAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPj0gcGFja0xlbilcbiAgICAgICAgICAge1xuICAgICAgICAgICAgICAgdGhpcy5wYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIFxuICAgfVxuICAgLyoq6Kej5p6Q56m65YyFICovXG4gICBwcml2YXRlIHBhcnNlTnVsbFBhY2thZ2UoY21kOm51bWJlcik6dm9pZFxuICAge1xuICAgICAgIHZhciBrZXk6c3RyaW5nID0gXCJcIisgY21kO1xuICAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcbiAgICAgICBpZihoYW5kbGVycylcbiAgICAgICB7XG4gICAgICAgICAgIGhhbmRsZXJzLmZvckVhY2goc29ja2V0SGFubGRlciA9PiB7XG4gICAgICAgICAgICAgICBzb2NrZXRIYW5sZGVyLmV4cGxhaW4oKTtcbiAgICAgICAgICAgfSk7XG4gICAgICAgfVxuICAgfVxuICAgXG4gICBwcml2YXRlIHdlYlNvY2tldE1lc3NhZ2UoZGF0YSk6dm9pZFxuICAge1xuICAgICAgIHRoaXMudGVtcEJ5dGUgPSBuZXcgTGF5YS5CeXRlKGRhdGEpO1xuICAgICAgIHRoaXMudGVtcEJ5dGUuZW5kaWFuID0gTGF5YS5CeXRlLkJJR19FTkRJQU47XG4gICAgICAgLy8gY29uc29sZS5sb2coXCIuLi4uLnRlc3R3ZWJcIix0aGlzLnRlbXBCeXRlLnBvcyk7XG4gICAgICAgXG4gICAgICAgaWYodGhpcy50ZW1wQnl0ZS5sZW5ndGggPiA0KVxuICAgICAgIHtcbiAgICAgICAgICAgaWYodGhpcy50ZW1wQnl0ZS5nZXRJbnQzMigpID09IDQpLy/nqbrljIVcbiAgICAgICAgICAge1xuICAgICAgICAgICAgICAgdmFyIGNtZDpudW1iZXIgPSB0aGlzLnRlbXBCeXRlLmdldEludDMyKCk7XG4gICAgICAgICAgICAgICB0aGlzLnBhcnNlTnVsbFBhY2thZ2UoY21kKTtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi56m65YyFLi4uLi4uLi4uLi4uLi4uLlwiK2NtZCk7XG4gICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgdGhpcy5ieXRlQnVmZkRhdGEud3JpdGVBcnJheUJ1ZmZlcihkYXRhLDAsZGF0YS5ieXRlTGVuZ3RoKTtcbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIuWtl+iKguaAu+mVv+W6pi4uLi4uLi4uLi4uLi4uLi5cIit0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGgpO1xuICAgICAgIFxuICAgICAgIGlmKHRoaXMuYnl0ZUJ1ZmZEYXRhLmxlbmd0aCA+IDQpXG4gICAgICAge1xuICAgICAgICAgICB0aGlzLnRlbXBCeXRlLmNsZWFyKCk7XG4gICAgICAgICAgIHRoaXMudGVtcEJ5dGUud3JpdGVBcnJheUJ1ZmZlcih0aGlzLmJ5dGVCdWZmRGF0YS5idWZmZXIsMCw0KTtcbiAgICAgICAgICAgdGhpcy50ZW1wQnl0ZS5wb3MgPSAwO1xuICAgICAgICAgICB2YXIgcGFja0xlbjpudW1iZXIgPSB0aGlzLnRlbXBCeXRlLmdldEludDMyKCkgKyA0O1xuICAgICAgICAgICBpZih0aGlzLmJ5dGVCdWZmRGF0YS5sZW5ndGggPj0gcGFja0xlbilcbiAgICAgICAgICAge1xuICAgICAgICAgICAgICAgdGhpcy5wYXJzZVBhY2thZ2VEYXRhKHBhY2tMZW4pO1xuICAgICAgICAgICB9XG4gICAgICAgfVxuXG4gICAgICAgXG5cblxuXG4gICAgICAgLy8gdmFyIHBhY2thZ2VJbjpQYWNrYWdlSW4gPSBuZXcgUGFja2FnZUluKCk7XG4gICAgICAgLy8gcGFja2FnZUluLnJlYWQoZGF0YSk7XG5cbiAgICAgICAvLyBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBtc2cuLi5cIixwYWNrYWdlSW4uY21kKTtcbiAgICAgICAvLyB2YXIga2V5OnN0cmluZyA9IFwiXCIrIHBhY2thZ2VJbi5jbWQ7XG4gICAgICAgLy8gdmFyIGhhbmRsZXJzID0gdGhpcy5zb2NrZXRIYW5sZGVyRGljLmdldChrZXkpO1xuICAgICAgIC8vIGhhbmRsZXJzLmZvckVhY2goc29ja2V0SGFubGRlciA9PiB7XG4gICAgICAgLy8gICAgIHNvY2tldEhhbmxkZXIuZXhwbGFpbihwYWNrYWdlSW4uYm9keSk7XG4gICAgICAgLy8gfSk7XG4gICAgICAgXG4gICB9XG4gICBwcml2YXRlIHdlYlNvY2tldENsb3NlKCk6dm9pZFxuICAge1xuICAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCBjbG9zZS4uLlwiKTtcbiAgIH1cbiAgIHByaXZhdGUgd2ViU29ja2V0RXJyb3IoKTp2b2lkXG4gICB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwid2Vic29ja2V0IGVycm9yLi4uXCIpO1xuICAgfVxuICAgLyoqXG4gICAgKiDlj5HpgIHmtojmga9cbiAgICAqIEBwYXJhbSBjbWQgXG4gICAgKiBAcGFyYW0gZGF0YSBcbiAgICAqL1xuICAgcHVibGljIHNlbmRNc2coY21kOm51bWJlcixkYXRhPzphbnkpOnZvaWRcbiAgIHtcbiAgICAgICBjb25zb2xlLmxvZyhcIndlYnNvY2tldCByZXEuLi5cIitjbWQpO1xuICAgICAgIHZhciBwYWNrYWdlT3V0OlBhY2thZ2VPdXQgPSBuZXcgUGFja2FnZU91dCgpO1xuICAgICAgIC8vIHBhY2thZ2VPdXQucGFjayhtb2R1bGUsY21kLGRhdGEpO1xuICAgICAgIHBhY2thZ2VPdXQucGFjayhjbWQsZGF0YSk7XG4gICAgICAgdGhpcy53ZWJTb2NrZXQuc2VuZChwYWNrYWdlT3V0LmJ1ZmZlcik7XG4gICB9XG4gICAvKipcbiAgICAqIOWumuS5iXByb3RvYnVm57G7XG4gICAgKiBAcGFyYW0gcHJvdG9UeXBlIOWNj+iuruaooeWdl+exu+Wei1xuICAgICogQHBhcmFtIGNsYXNzU3RyIOexu1xuICAgICovXG4gICBwdWJsaWMgZGVmaW5lUHJvdG9DbGFzcyhjbGFzc1N0cjpzdHJpbmcpOmFueVxuICAge1xuICAgICAgIHJldHVybiB0aGlzLnByb3RvUm9vdC5sb29rdXAoY2xhc3NTdHIpO1xuICAgfVxuXG4gICAvKirms6jlhowgKi9cbiAgIHB1YmxpYyByZWdpc3RlckhhbmRsZXIoY21kOm51bWJlcixoYW5kbGVyOlNvY2tldEhhbmRsZXIpOnZvaWRcbiAgIHtcbiAgICAgICAvLyB2YXIga2V5OnN0cmluZyA9IHByb3RvY29sK1wiX1wiK2NtZDtcbiAgICAgICB2YXIga2V5OnN0cmluZyA9IFwiXCIrY21kO1xuICAgICAgIHZhciBoYW5kbGVyczpBcnJheTxTb2NrZXRIYW5kbGVyPiA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcbiAgICAgICBpZighaGFuZGxlcnMpXG4gICAgICAge1xuICAgICAgICAgICBoYW5kbGVycyA9IFtdO1xuICAgICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICAgICB0aGlzLnNvY2tldEhhbmxkZXJEaWMuc2V0KGtleSxoYW5kbGVycyk7XG4gICAgICAgfVxuICAgICAgIGVsc2VcbiAgICAgICB7XG4gICAgICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XG4gICAgICAgfVxuICAgfVxuICAgLyoq5Yig6ZmkICovXG4gICBwdWJsaWMgdW5yZWdpc3RlckhhbmRsZXIoY21kOm51bWJlcixjYWxsZXI6YW55KTp2b2lkXG4gICB7XG4gICAgICAgdmFyIGtleTpzdHJpbmcgPSBcIlwiICsgY21kO1xuICAgICAgIHZhciBoYW5kbGVyczpBcnJheTxTb2NrZXRIYW5kbGVyPiA9IHRoaXMuc29ja2V0SGFubGRlckRpYy5nZXQoa2V5KTtcbiAgICAgICBpZihoYW5kbGVycylcbiAgICAgICB7XG4gICAgICAgICAgIHZhciBoYW5kbGVyO1xuICAgICAgICAgICBmb3IodmFyIGkgPSBoYW5kbGVycy5sZW5ndGggLSAxO2kgPj0gMCA7aS0tKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBoYW5kbGVyID0gaGFuZGxlcnNbaV07XG4gICAgICAgICAgICAgICBpZihoYW5kbGVyLmNhbGxlciA9PT0gY2FsbGVyKVxuICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICB9XG4gICAgICAgICAgIGlmKGhhbmRsZXJzLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICB0aGlzLnNvY2tldEhhbmxkZXJEaWMucmVtb3ZlKGtleSk7XG4gICAgICAgICAgIH1cbiAgICAgICB9XG4gICB9XG4gICAvKirmt7vliqDmnI3liqHlmajlv4Pot7MgKi9cbiAgIHB1YmxpYyBhZGRIZXJ0UmVxKCk6dm9pZFxuICAge1xuICAgIC8vICAgIHRoaXMucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU1BfU0VSVl9IRVJULG5ldyBTZXJ2ZXJIZWFydEhhbmRsZXIodGhpcykpO1xuICAgIC8vICAgIENsaWVudFNlbmRlci5zZXJ2SGVhcnRSZXEoKTtcbiAgICAvLyAgICBMYXlhLnRpbWVyLmxvb3AoMTAwMDAsdGhpcyxmdW5jdGlvbigpOnZvaWR7XG4gICAgLy8gICAgICAgIENsaWVudFNlbmRlci5zZXJ2SGVhcnRSZXEoKTtcbiAgICAvLyAgICB9KTtcbiAgIH1cbiAgIHB1YmxpYyByZW1vdmVIZWFydFJlcSgpOnZvaWRcbiAgIHtcbiAgICAvLyAgICB0aGlzLnVucmVnaXN0ZXJIYW5kbGVyKFByb3RvY29sLlJFU1BfU0VSVl9IRVJULHRoaXMpO1xuICAgIC8vICAgIExheWEudGltZXIuY2xlYXJBbGwodGhpcyk7XG4gICB9XG59IiwiaW1wb3J0IGJhc2VDb25maWcgZnJvbSBcIi4vYmFzZUNvbmZpZ1wiO1xuaW1wb3J0IE1hcFBvcyBmcm9tIFwiLi4vQmVhbi9NYXBQb3NcIjtcblxuXG4vKipcbiAqIOmYsuW+oeWhlOaVsOaNruaooeWei1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWZlbmRlckNvbmZpZyBleHRlbmRzIGJhc2VDb25maWd7XG4gICAgLyoqXG4gICAgICog6Ziy5b6h5aGUaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmZW5kZXJJZCA6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiDpmLLlvqHloZTlkI3np7BcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVmZW5kZXJOYW1lIDogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIOmYsuW+oeWhlOaUu+WHu+WKm1xuICAgICAqL1xuICAgIHB1YmxpYyBwb3dlciA6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiDmlLvlh7vot53nprtcbiAgICAgKi9cbiAgICBwdWJsaWMgZGljIDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIOaUu+WHu+mAn+W6plxuICAgICAqL1xuICAgIHB1YmxpYyBhdHRhY2tTcGVlZCA6IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiDmlLvlh7vpopHnjodcbiAgICAgKi9cbiAgICBwdWJsaWMgYXR0YWNrRnJlcXVlbmN5IDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIOS7t+agvFxuICAgICAqL1xuICAgIHB1YmxpYyBwcmljZSA6IG51bWJlcjtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioq5Y2z5bCG5byA5pS+KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAvKipcbiAgICAgKiDnsbvlnosgMemHkTLmnKgz5rC0NOeBqzXlnJ9cbiAgICAgKi9cbiAgICAvL3B1YmxpYyB0eXBlIDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoZGF0YSl7XG4gICAgICAgIHN1cGVyKGRhdGEpO1xuICAgIH1cbn0iLCJpbXBvcnQgYmFzZUNvbmZpZyBmcm9tIFwiLi9iYXNlQ29uZmlnXCI7XG5cblxuLyoqXG4gKiDmgKrnianmlbDmja7mqKHlnotcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9uc3RlckNvbmZpZyBleHRlbmRzIGJhc2VDb25maWd7XG4gICAgLyoqXG4gICAgICog5oCq54mpaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgbW9uc3RlcklkIDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIOaAqueJqeWQjeWtl1xuICAgICAqL1xuICAgIHB1YmxpYyBtb25zdGVyTmFtZSA6IHN0cmluZztcbiAgICAvKipcbiAgICAgKiDmlLvlh7vliptcbiAgICAgKi9cbiAgICBwdWJsaWMgcG93ZXIgOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICog56e75Yqo6YCf5bqmXG4gICAgICovXG4gICAgcHVibGljIHNwZWVkIDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIOihgOmHj1xuICAgICAqL1xuICAgIHB1YmxpYyBocDpudW1iZXI7XG4gICAgLyoqXG4gICAgICog5Lu35qC8XG4gICAgICovXG4gICAgcHVibGljIHByaWNlOm51bWJlcjtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKirljbPlsIblvIDmlL4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIC8qKlxuICAgICAqIOmYsuW+oeWKm1xuICAgICAqL1xuICAgIC8vcHVibGljIGRlZiA6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIOaAqueJqeexu+WeiyAx6YeRMuacqDPmsLQ054GrNeWcn1xuICAgICAqL1xuICAgIC8vcHVibGljIHR5cGUgOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihkYXRhKXtcbiAgICAgICAgc3VwZXIoZGF0YSk7XG4gICAgfVxufSIsIi8qKlxuICog5Z+656GA5pWw5o2u57uT5p6EXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGJhc2VDb25maWd7XG4gIFxuICAgIGNvbnN0cnVjdG9yKGRhdGEpe1xuICAgICAgICBsZXQgYXJyID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8YXJyLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgdGhpc1thcnJbaV1dID0gZGF0YVthcnJbaV1dO1xuICAgICAgICB9XG4gICAgfVxufSIsIi8qKlRoaXMgY2xhc3MgaXMgYXV0b21hdGljYWxseSBnZW5lcmF0ZWQgYnkgTGF5YUFpcklERSwgcGxlYXNlIGRvIG5vdCBtYWtlIGFueSBtb2RpZmljYXRpb25zLiAqL1xyXG5pbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlci9HYW1lL0dhbWVDb250cm9sbGVyXCJcbmltcG9ydCBHYW1lTG9iYnlDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXJcIlxuaW1wb3J0IExvYWRpbmdDb250cm9sbGVyIGZyb20gXCIuL0NvbnRyb2xsZXIvTG9hZGluZy9Mb2FkaW5nQ29udHJvbGxlclwiXG5pbXBvcnQgV2VsQ29tZUNvbnRyb2xsZXIgZnJvbSBcIi4vQ29udHJvbGxlci9XZWxDb21lL1dlbENvbWVDb250cm9sbGVyXCJcclxuLypcclxuKiDmuLjmiI/liJ3lp4vljJbphY3nva47XHJcbiovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDb25maWd7XHJcbiAgICBzdGF0aWMgd2lkdGg6bnVtYmVyPTE0NDA7XHJcbiAgICBzdGF0aWMgaGVpZ2h0Om51bWJlcj03NTA7XHJcbiAgICBzdGF0aWMgc2NhbGVNb2RlOnN0cmluZz1cImZpeGVkaGVpZ2h0XCI7XHJcbiAgICBzdGF0aWMgc2NyZWVuTW9kZTpzdHJpbmc9XCJub25lXCI7XHJcbiAgICBzdGF0aWMgYWxpZ25WOnN0cmluZz1cInRvcFwiO1xyXG4gICAgc3RhdGljIGFsaWduSDpzdHJpbmc9XCJsZWZ0XCI7XHJcbiAgICBzdGF0aWMgc3RhcnRTY2VuZTphbnk9XCJXZWxjb21lL0xvZ2luLnNjZW5lXCI7XHJcbiAgICBzdGF0aWMgc2NlbmVSb290OnN0cmluZz1cIlwiO1xyXG4gICAgc3RhdGljIGRlYnVnOmJvb2xlYW49ZmFsc2U7XHJcbiAgICBzdGF0aWMgc3RhdDpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIHBoeXNpY3NEZWJ1Zzpib29sZWFuPWZhbHNlO1xyXG4gICAgc3RhdGljIGV4cG9ydFNjZW5lVG9Kc29uOmJvb2xlYW49dHJ1ZTtcclxuICAgIGNvbnN0cnVjdG9yKCl7fVxyXG4gICAgc3RhdGljIGluaXQoKXtcclxuICAgICAgICB2YXIgcmVnOiBGdW5jdGlvbiA9IExheWEuQ2xhc3NVdGlscy5yZWdDbGFzcztcclxuICAgICAgICByZWcoXCJDb250cm9sbGVyL0dhbWUvR2FtZUNvbnRyb2xsZXIudHNcIixHYW1lQ29udHJvbGxlcik7XG4gICAgICAgIHJlZyhcIkNvbnRyb2xsZXIvR2FtZUxvYmJ5L0dhbWVMb2JieUNvbnRyb2xsZXIudHNcIixHYW1lTG9iYnlDb250cm9sbGVyKTtcbiAgICAgICAgcmVnKFwiQ29udHJvbGxlci9Mb2FkaW5nL0xvYWRpbmdDb250cm9sbGVyLnRzXCIsTG9hZGluZ0NvbnRyb2xsZXIpO1xuICAgICAgICByZWcoXCJDb250cm9sbGVyL1dlbENvbWUvV2VsQ29tZUNvbnRyb2xsZXIudHNcIixXZWxDb21lQ29udHJvbGxlcik7XHJcbiAgICB9XHJcbn1cclxuR2FtZUNvbmZpZy5pbml0KCk7IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xuXG5cbi8qKlxuICog5ri45oiP5YWl5Y+jXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVFbnRlcntcblx0XHQvL1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIC8qKuWIneWni+WMliAqL1xuICAgIHByaXZhdGUgaW5pdCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5sb2FkKCk7XG4gICAgfVxuICAgIC8qKui1hOa6kOWKoOi9vSAqL1xuICAgIHByaXZhdGUgbG9hZCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgbGV0IGFzc2V0ZUFyciA9IFtcbiAgICAgICAgICAgIHt1cmw6XCJ1bnBhY2thZ2Uvd2VsY29tZV9iZy5wbmdcIn0sXG4gICAgICAgICAgICB7dXJsOlwiV2VsY29tZS9sb2dpbmJveC5wbmdcIn0sXG4gICAgICAgICAgICB7dXJsOlwiV2VsY29tZS9wcm9ncmVzc0JnLnBuZ1wifSxcblxuICAgICAgICAgICAge3VybDpcInJlcy9hdGxhcy9jb21wLmF0bGFzXCJ9LFxuICAgICAgICAgICAge3VybDpcInJlcy9hdGxhcy93ZWxjb21lLmF0bGFzXCJ9XG4gICAgICAgIF1cbiAgICAgICAgTGF5YS5sb2FkZXIubG9hZChhc3NldGVBcnIsTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLHRoaXMub25sb2FkKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbmxvYWQoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIEdhbWVDb25maWcuc3RhcnRTY2VuZSAmJiBMYXlhLlNjZW5lLm9wZW4oR2FtZUNvbmZpZy5zdGFydFNjZW5lKTtcbiAgICB9XG59IiwiaW1wb3J0IEdhbWVDb25maWcgZnJvbSBcIi4vR2FtZUNvbmZpZ1wiO1xuaW1wb3J0IEdhbWVFbnRlciBmcm9tIFwiLi9HYW1lRW50ZXJcIjtcbmNsYXNzIE1haW4ge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHQvL+agueaNrklEReiuvue9ruWIneWni+WMluW8leaTjlx0XHRcblx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XG5cdFx0ZWxzZSBMYXlhLmluaXQoR2FtZUNvbmZpZy53aWR0aCwgR2FtZUNvbmZpZy5oZWlnaHQsIExheWFbXCJXZWJHTFwiXSk7XG5cdFx0TGF5YVtcIlBoeXNpY3NcIl0gJiYgTGF5YVtcIlBoeXNpY3NcIl0uZW5hYmxlKCk7XG5cdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBHYW1lQ29uZmlnLnNjYWxlTW9kZTtcblx0XHRMYXlhLnN0YWdlLnNjcmVlbk1vZGUgPSBHYW1lQ29uZmlnLnNjcmVlbk1vZGU7XG5cdFx0Ly/lhbzlrrnlvq7kv6HkuI3mlK/mjIHliqDovb1zY2VuZeWQjue8gOWcuuaZr1xuXHRcdExheWEuVVJMLmV4cG9ydFNjZW5lVG9Kc29uID0gR2FtZUNvbmZpZy5leHBvcnRTY2VuZVRvSnNvbjtcblxuXHRcdC8v5omT5byA6LCD6K+V6Z2i5p2/77yI6YCa6L+HSURF6K6+572u6LCD6K+V5qih5byP77yM5oiW6ICFdXJs5Zyw5Z2A5aKe5YqgZGVidWc9dHJ1ZeWPguaVsO+8jOWdh+WPr+aJk+W8gOiwg+ivlemdouadv++8iVxuXHRcdGlmIChHYW1lQ29uZmlnLmRlYnVnIHx8IExheWEuVXRpbHMuZ2V0UXVlcnlTdHJpbmcoXCJkZWJ1Z1wiKSA9PSBcInRydWVcIikgTGF5YS5lbmFibGVEZWJ1Z1BhbmVsKCk7XG5cdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcblx0XHRpZiAoR2FtZUNvbmZpZy5zdGF0KSBMYXlhLlN0YXQuc2hvdygpO1xuXHRcdExheWEuYWxlcnRHbG9iYWxFcnJvciA9IHRydWU7XG5cblx0XHQvL+a/gOa0u+i1hOa6kOeJiOacrOaOp+WItu+8jHZlcnNpb24uanNvbueUsUlEReWPkeW4g+WKn+iDveiHquWKqOeUn+aIkO+8jOWmguaenOayoeacieS5n+S4jeW9seWTjeWQjue7rea1geeoi1xuXHRcdExheWEuUmVzb3VyY2VWZXJzaW9uLmVuYWJsZShcInZlcnNpb24uanNvblwiLCBMYXlhLkhhbmRsZXIuY3JlYXRlKHRoaXMsIHRoaXMub25WZXJzaW9uTG9hZGVkKSwgTGF5YS5SZXNvdXJjZVZlcnNpb24uRklMRU5BTUVfVkVSU0lPTik7XG5cdH1cblxuXHRvblZlcnNpb25Mb2FkZWQoKTogdm9pZCB7XG5cdFx0Ly/mv4DmtLvlpKflsI/lm77mmKDlsITvvIzliqDovb3lsI/lm77nmoTml7blgJnvvIzlpoLmnpzlj5HnjrDlsI/lm77lnKjlpKflm77lkIjpm4bph4zpnaLvvIzliJnkvJjlhYjliqDovb3lpKflm77lkIjpm4bvvIzogIzkuI3mmK/lsI/lm75cblx0XHRMYXlhLkF0bGFzSW5mb01hbmFnZXIuZW5hYmxlKFwiZmlsZWNvbmZpZy5qc29uXCIsIExheWEuSGFuZGxlci5jcmVhdGUodGhpcywgdGhpcy5vbkNvbmZpZ0xvYWRlZCkpO1xuXHR9XG5cblx0b25Db25maWdMb2FkZWQoKTogdm9pZCB7XG5cdFx0bmV3IEdhbWVFbnRlcigpO1xuXHRcdC8v5Yqg6L29SURF5oyH5a6a55qE5Zy65pmvXG5cdH1cbn1cbi8v5r+A5rS75ZCv5Yqo57G7XG5uZXcgTWFpbigpO1xuIiwiLyoqXG4gICAgKiDor43lhbgga2V5LXZhbHVlXG4gICAgKlxuICAgICogIFxuICAgICogIGtleXMgOiBBcnJheVxuICAgICogIFtyZWFkLW9ubHldIOiOt+WPluaJgOacieeahOWtkOWFg+e0oOmUruWQjeWIl+ihqOOAglxuICAgICogIERpY3Rpb25hcnlcbiAgICAqIFxuICAgICogIHZhbHVlcyA6IEFycmF5XG4gICAgKiAgW3JlYWQtb25seV0g6I635Y+W5omA5pyJ55qE5a2Q5YWD57Sg5YiX6KGo44CCXG4gICAgKiAgRGljdGlvbmFyeVxuICAgICogIFB1YmxpYyBNZXRob2RzXG4gICAgKiAgXG4gICAgKiAgICAgICAgICBcbiAgICAqICBjbGVhcigpOnZvaWRcbiAgICAqICDmuIXpmaTmraTlr7nosaHnmoTplK7lkI3liJfooajlkozplK7lgLzliJfooajjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiAgICAgICAgICBcbiAgICAqICBnZXQoa2V5OiopOipcbiAgICAqICDov5Tlm57mjIflrprplK7lkI3nmoTlgLzjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiAgICAgICAgICAgXG4gICAgKiAgaW5kZXhPZihrZXk6T2JqZWN0KTppbnRcbiAgICAqICDojrflj5bmjIflrprlr7nosaHnmoTplK7lkI3ntKLlvJXjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiAgICAgICAgICBcbiAgICAqICByZW1vdmUoa2V5OiopOkJvb2xlYW5cbiAgICAqICDnp7vpmaTmjIflrprplK7lkI3nmoTlgLzjgIJcbiAgICAqICBEaWN0aW9uYXJ5XG4gICAgKiAgICAgICAgICBcbiAgICAqICBzZXQoa2V5OiosIHZhbHVlOiopOnZvaWRcbiAgICAqICDnu5nmjIflrprnmoTplK7lkI3orr7nva7lgLzjgIJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGljdGlvbmFyeSB7XG4gICAgLyoq6ZSu5ZCNICovXG4gICAgcHJpdmF0ZSBrZXlzIDogQXJyYXk8YW55PjtcbiAgICAvKirplK7lgLwgKi9cbiAgICBwcml2YXRlIHZhbHVlcyA6IEFycmF5PGFueT47XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmtleXMgPSBuZXcgQXJyYXk8YW55PigpO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IG5ldyBBcnJheTxhbnk+KCk7XG4gICAgfVxuXG4gICAgLyoq6K6+572uIOmUruWQjSAtIOmUruWAvCAqL1xuICAgIHB1YmxpYyBzZXQoa2V5OmFueSx2YWx1ZTphbnkpIDogdm9pZFxuICAgIHtcbiAgICAgICAgZm9yKGxldCBpID0gMDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV09PT11bmRlZmluZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzW2ldID0ga2V5O1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW2ldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMua2V5cy5wdXNoKGtleSk7XG4gICAgICAgIHRoaXMudmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDmj5LlhaVrZXlbXCIrIGtleSArXCJdXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInZhbHVlXCIsdmFsdWUpO1xuICAgIH1cblxuICAgIC8qKumAmui/hyDplK7lkI1rZXkg6I635Y+W6ZSu5YC8dmFsdWUgICovXG4gICAgcHVibGljIGdldChrZXk6YW55KSA6IGFueVxuICAgIHtcbiAgICAgICAgLy8gdGhpcy5nZXREaWNMaXN0KCk7IFxuICAgICAgICBmb3IobGV0IGk9MDtpPHRoaXMua2V5cy5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLmtleXNbaV0gPT09IGtleSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g6K+N5YW45Lit5rKh5pyJa2V555qE5YC8XCIpO1xuICAgIH1cblxuICAgIC8qKuiOt+WPluWvueixoeeahOe0ouW8leWAvCAqL1xuICAgIHB1YmxpYyBpbmRleE9mKHZhbHVlIDogYW55KSA6IG51bWJlclxuICAgIHtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLnZhbHVlcy5sZW5ndGg7aSsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0aGlzLnZhbHVlc1tpXSA9PT0gdmFsdWUpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g6K+N5YW45Lit5rKh5pyJ6K+l5YC8XCIpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICAvKirmuIXpmaQg6K+N5YW45Lit5oyH5a6a6ZSu5ZCN55qE5YmqICovXG4gICAgcHVibGljIHJlbW92ZShrZXkgOiBhbnkpIDogdm9pZFxuICAgIHtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx0aGlzLmtleXMubGVuZ3RoO2krKylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodGhpcy5rZXlzW2ldID09PSBrZXkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5rZXlzW2ldID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbaV0gPT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIuOAkERpY3Rpb25hcnnjgJEgLSDnp7vpmaTmiJDlip9cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coXCLjgJBEaWN0aW9uYXJ544CRIC0g56e76Zmk5aSx6LSlXCIpO1xuICAgIH1cblxuICAgIC8qKua4hemZpOaJgOacieeahOmUriAqL1xuICAgIHB1YmxpYyBjbGVhcigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5rZXlzID0gW107XG4gICAgICAgIHRoaXMudmFsdWVzID0gW107XG4gICAgfVxuXG4gICAgLyoq6I635Y+W5YiX6KGoICovXG4gICAgcHVibGljIGdldERpY0xpc3QoKSA6IHZvaWRcbiAgICB7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dGhpcy5rZXlzLmxlbmd0aDtpKyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi44CQXCIgKyBpICsgXCLjgJEtLS0tLS0tLS0tLWtleTpcIiArIHRoaXMua2V5c1tpXSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInZhbHVlXCIsdGhpcy52YWx1ZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoq6I635Y+W6ZSu5YC85pWw57uEICovXG4gICAgcHVibGljIGdldFZhbHVlc0FycigpIDogQXJyYXk8YW55PlxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzO1xuICAgIH1cblxuICAgIC8qKuiOt+WPlumUruWQjeaVsOe7hCAqL1xuICAgIHB1YmxpYyBnZXRLZXlzQXJyKCkgOiBBcnJheTxhbnk+XG4gICAge1xuICAgICAgICByZXR1cm4gdGhpcy5rZXlzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyB1aSB9IGZyb20gXCIuLi91aS9sYXlhTWF4VUlcIjtcbmltcG9ydCBNZXNzYWdlTWFuYWdlciBmcm9tIFwiLi4vQ29yZS9NZXNzYWdlTWFuYWdlclwiO1xuXG4vKipcbiAqIOS4remXtOWtl1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGbG9hdE1zZyBleHRlbmRzIHVpLkRpYWxvZ18uRmxvYXRNc2dVSXtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIFxuICAgIG9uRW5hYmxlKCl7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0KCkgOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLmFuaTEuc3RvcCgpO1xuICAgICAgICB0aGlzLnNwX2Zsb2F0TXNnLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRFdmVudCgpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5vbihMYXlhLkV2ZW50LkNMSUNLLHRoaXMsdGhpcy5vbkhpZGRlbik7XG4gICAgICAgIHRoaXMuYW5pMS5vbihMYXlhLkV2ZW50LkNPTVBMRVRFLHRoaXMsdGhpcy5vbkhpZGRlbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pi+56S65raI5oGv6aOY5a2XXG4gICAgICogQHBhcmFtIHRleHQg5pi+56S65paH5pysIOOAkOacgOWkmjI45Liq44CRXG4gICAgICogQHBhcmFtIHBvcyAg5L2N572ue3g6MTAwLHk6MTAwfVxuICAgICAqL1xuICAgIHB1YmxpYyBzaG93TXNnKHRleHQ6c3RyaW5nLHBvczphbnkpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTsgXG4gICAgICAgIHRoaXMuYWxwaGEgPSAxOyAgICAgICBcbiAgICAgICAgdGhpcy5zcF9mbG9hdE1zZy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJfZmxvYXRNc2cudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMueCA9IHBvcy54O1xuICAgICAgICB0aGlzLnkgPSBwb3MueTtcbiAgICAgICAgdGhpcy5hbmkxLnBsYXkoMCxmYWxzZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkhpZGRlbigpIDogdm9pZFxuICAgIHtcbiAgICAgICAgdGhpcy5hbmkxLnN0b3AoKTtcbiAgICAgICAgdGhpcy5zcF9mbG9hdE1zZy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBMYXlhLlBvb2wucmVjb3ZlcihcIkZsb2F0TXNnXCIsdGhpcyk7XG4gICAgICAgIE1lc3NhZ2VNYW5hZ2VyLmlucy5jb3VudEZsb2F0TXNnLS07XG4gICAgfVxufSIsIi8qKlxuICog5bCP5bel5YW3XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2x7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5bGP5bmV5rC05bmz5Lit5b+DIOaoquWdkOagh1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q2VudGVyWCgpIDogYW55XG4gICAge1xuICAgICAgICByZXR1cm4gNzUwLyhMYXlhLkJyb3dzZXIuY2xpZW50SGVpZ2h0L0xheWEuQnJvd3Nlci5jbGllbnRXaWR0aCkvMjsvL+Wxj+W5leWuveW6plxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiDkuKTngrnpl7Tot53nprtcbiAgICAgKi9cbiAgICBwdWJsaWMgIHN0YXRpYyBnZXREaXN0YW5jZShzcDEsc3AyKTpudW1iZXJcbiAgICB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coTWF0aC5hYnMoc3AxLngtc3AyLngpLDIpK01hdGgucG93KE1hdGguYWJzKHNwMS55LXNwMi55KSwyKSk7XG4gICAgfVxuXG59XG4iLCIvKipUaGlzIGNsYXNzIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIGJ5IExheWFBaXJJREUsIHBsZWFzZSBkbyBub3QgbWFrZSBhbnkgbW9kaWZpY2F0aW9ucy4gKi9cbmltcG9ydCBWaWV3PUxheWEuVmlldztcbmltcG9ydCBEaWFsb2c9TGF5YS5EaWFsb2c7XG5pbXBvcnQgU2NlbmU9TGF5YS5TY2VuZTtcbmV4cG9ydCBtb2R1bGUgdWkuRGlhbG9nXyB7XHJcbiAgICBleHBvcnQgY2xhc3MgRmxvYXRNc2dVSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBhbmkxOkxheWEuRnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIHNwX2Zsb2F0TXNnOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBsYWJfZmxvYXRNc2c6TGF5YS5MYWJlbDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIkRpYWxvZ18vRmxvYXRNc2dcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuR2FtZSB7XHJcbiAgICBleHBvcnQgY2xhc3MgR2FtZVVJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGdhbWU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2RzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV29vZDI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFdvb2QzOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBXb29kNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgV2FsbHM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIFVwV2FsbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgRG93bldhbGw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIEdyb3VwczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfZG9vcjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9ncm91cDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9kb29yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByb2FkOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl9pY29uOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyX2ljb246TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHBsYXllcl9tZW51aXRlbTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc2hvdmVsYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNob3ZlbF9vZmY6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNob3ZlbF9vbjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYnRuX2J1eTpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuX2J1aWxkOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBkZWZlbmRlcl91aWdyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBtb25zdGVyX3VpZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHRleHRfdGltZXI6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGNvaW5CZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgdGV4dF9jb2luOmxheWEuZGlzcGxheS5UZXh0O1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiR2FtZS9HYW1lXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgbW9kdWxlIHVpLkdhbWVMb2JieSB7XHJcbiAgICBleHBvcnQgY2xhc3MgR2FtZUxvYmJ5VUkgZXh0ZW5kcyBTY2VuZSB7XHJcblx0XHRwdWJsaWMgYmc6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1lbnVJdGVtUGFuZWw6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJ0bl9QVlA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIE1vZGVDaG9vc2VQYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgdGV4dF8xVjE6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGJ0bl8xVjE6TGF5YS5CdXR0b247XG5cdFx0cHVibGljIHRleHRfNVY1OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBidG5fNVY1OkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fYmFjazpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgTWF0Y2hpbmdQYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYnRuX2NhbmNlbDpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgdGV4dF90aW1lOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBNYXRjaGluZ1N1Y2Nlc3NQYW5lbDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBidG5fZW50ZXJnYW1lOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBidG5fcmVmdXNlOkxheWEuQnV0dG9uO1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiR2FtZUxvYmJ5L0dhbWVMb2JieVwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IG1vZHVsZSB1aSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUGxheWVyTG9hZGluZ1VJIGV4dGVuZHMgU2NlbmUge1xyXG5cdFx0cHVibGljIGxvYWRpbmdiZzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX2dyb3VwOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl8xOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfMTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfMjpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzI6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHJlZF9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9yZWRfcGxheWVyXzM6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fcmVkX3BsYXllcl8zOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyByZWRfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfcmVkX3BsYXllcl80OmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX3JlZF9wbGF5ZXJfNDpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgcmVkX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX3JlZF9wbGF5ZXJfNTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9yZWRfcGxheWVyXzU6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfZ3JvdXA6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzE6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfMTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl8xOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl8yOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzI6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfMjpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgYmx1ZV9wbGF5ZXJfMzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgbmFtZV9ibHVlX3BsYXllcl8zOmxheWEuZGlzcGxheS5UZXh0O1xuXHRcdHB1YmxpYyBpY29uX2JsdWVfcGxheWVyXzM6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGJsdWVfcGxheWVyXzQ6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIG5hbWVfYmx1ZV9wbGF5ZXJfNDpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgaWNvbl9ibHVlX3BsYXllcl80OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBibHVlX3BsYXllcl81OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBuYW1lX2JsdWVfcGxheWVyXzU6bGF5YS5kaXNwbGF5LlRleHQ7XG5cdFx0cHVibGljIGljb25fYmx1ZV9wbGF5ZXJfNTpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3M6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVzpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NMOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc1Q6TGF5YS5MYWJlbDtcbiAgICAgICAgY29uc3RydWN0b3IoKXsgc3VwZXIoKX1cclxuICAgICAgICBjcmVhdGVDaGlsZHJlbigpOnZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5jcmVhdGVDaGlsZHJlbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRTY2VuZShcIlBsYXllckxvYWRpbmdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBtb2R1bGUgdWkuV2VsY29tZSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTG9naW5VSSBleHRlbmRzIFNjZW5lIHtcclxuXHRcdHB1YmxpYyBhbmkxOkxheWEuRnJhbWVBbmltYXRpb247XG5cdFx0cHVibGljIHNwX2xvZ2luQm94OkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBpbnB1dF91c2VyTmFtZTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgaW5wdXRfdXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgbGFiX3RpdGxlOkxheWEuTGFiZWw7XG5cdFx0cHVibGljIGJ0bl9sb2dpbjpMYXlhLkJ1dHRvbjtcblx0XHRwdWJsaWMgYnRuX3JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzczpMYXlhLlNwcml0ZTtcblx0XHRwdWJsaWMgc3BfcHJvZ3Jlc3NXOkxheWEuU3ByaXRlO1xuXHRcdHB1YmxpYyBzcF9wcm9ncmVzc0w6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIHNwX3Byb2dyZXNzVDpMYXlhLkxhYmVsO1xuXHRcdHB1YmxpYyBzcF9nYW1lTmFtZTpsYXlhLmRpc3BsYXkuVGV4dDtcblx0XHRwdWJsaWMgc3BfcmVnaXN0ZXJCb3g6TGF5YS5TcHJpdGU7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlck5hbWU6TGF5YS5UZXh0SW5wdXQ7XG5cdFx0cHVibGljIGlucHV0X3JlZ2lzdGVyVXNlcktleTpMYXlhLlRleHRJbnB1dDtcblx0XHRwdWJsaWMgYnRuX3RvTG9naW46TGF5YS5CdXR0b247XG5cdFx0cHVibGljIGJ0bl90b1JlZ2lzdGVyOkxheWEuQnV0dG9uO1xuXHRcdHB1YmxpYyBpbnB1dF9yZWdpc3Rlck5pY2tOYW1lOkxheWEuVGV4dElucHV0O1xuICAgICAgICBjb25zdHJ1Y3RvcigpeyBzdXBlcigpfVxyXG4gICAgICAgIGNyZWF0ZUNoaWxkcmVuKCk6dm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLmNyZWF0ZUNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZFNjZW5lKFwiV2VsY29tZS9Mb2dpblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cciJdfQ==
