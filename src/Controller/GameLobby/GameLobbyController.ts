import { ui } from "../../ui/layaMaxUI";
import WebSocketManager from "../../Core/Net/WebSocketManager";
import { Protocol, GameConfig } from "../../Core/Const/GameConfig";
import MatchHandler from "../GameLobby/handler/MatchHandler";
import ClientSender from "../../Core/Net/ClientSender";
import MessageManager from "../../Core/MessageManager";
import WelComeController from "../WelCome/WelComeController";
import Player from "../WelCome/Player";
import ConfigManager from "../../Core/ConfigManager";
import MonsterConfig from "../../Data/Config/MosnterConfigr";
export default class GameLobbyController extends ui.GameLobby.GameLobbyUI{
    constructor(){
        super();
    }

    /**启动 */
    onEnable(){
        this.addEvents();
    }

    /**销毁*/
    onDestroy(){
        this.removeEvents();
    }

    /**事件绑定 */
    private addEvents() : void
    {
        this.btn_PVP.on(Laya.Event.CLICK,this,this.onPVPMode);
        this.btn_1V1.on(Laya.Event.CLICK,this,this.on1V1);
        this.btn_5V5.on(Laya.Event.CLICK,this,this.on5V5);
        this.btn_back.on(Laya.Event.CLICK,this,this.onBack);
        this.btn_cancel.on(Laya.Event.CLICK,this,this.onCancel);
        this.btn_entergame.on(Laya.Event.CLICK,this,this.onSure);
        WebSocketManager.ins.registerHandler(Protocol.RES_MATCH_INFO,new MatchHandler(this,this.onMatchHandler));
    }

    private removeEvents() : void
    {
        this.btn_PVP.off(Laya.Event.CLICK,this,this.onPVPMode);
        WebSocketManager.ins.unregisterHandler(Protocol.RES_MATCH_INFO,this);
    }


    /**点击进入PVP选择界面 */
    private onPVPMode() : void
    {
        this.MenuItemPanel.visible = false;
        this.ModeChoosePanel.visible=true;
    }

    /**获取到消息 */
    private onMatchHandler(data) : void
    {
        console.log(data+"匹配成功");
        if(data !== undefined)
        {
            Laya.timer.frameOnce(100,this,this.chooseMatch);
        }
    }

    /**点击选择1V1模式，匹配界面只显示玩家和敌人两个头像 */
    private on1V1() : void
    {
       this.ModeChoosePanel.visible=false;
       this.MatchingPanel.visible=true;
       //ClientSender.reqMatch(1,1);
       for(let i=0;i<5;i++)
       {
           this.red_group._children[i].visible=false;
           this.blue_group._children[i].visible=false;
       }
       this.icon_red_player_3.visible=true;
       this.icon_blue_player_3.visible=true;
       WelComeController.ins.mode="1V1";

       //暂时使用，联网后删去
       Laya.timer.frameOnce(60*2,this,this.chooseMatch);
       //Laya.timer.frameLoop(60,this,this.calTime);
    }

    /**点击选择5V5模式 */
    private on5V5() : void
    {
        //WelComeController.ins.mode="5V5";
    }

    /**点击返回游戏大厅 */
    private onBack() : void
    {
        this.MenuItemPanel.visible = true;
        this.ModeChoosePanel.visible=false;
    }

    /**计时，在等待队列等待了多长时间 */
    private calTime():void
    {
        //this.text_time.text=""
    }

    /**匹配过程中点击取消,返回模式选择界面，从等待房间退出 */       //--网络
    private onCancel():void
    {
        this.MatchingPanel.visible=false;
        this.ModeChoosePanel.visible=true;
    }

    /**匹配成功弹框，获取敌方玩家信息，选择是否进入游戏 */
    private chooseMatch():void
    {
        this.MatchingPanel.visible=false;
        this.MatchingSuccessPanel.visible=true;
        //暂时取一个给定的敌方玩家信息                              //--暂时
        WelComeController.ins.enemyPlayer=new Player("李四","gameLobby/player_icon2.png");
        //随机选择一个阵营
        //let random=Math.ceil(Math.random()*2);
        let random=0;
        if(random==0)
        {
            WelComeController.ins.ownPlayer.camp="red";
            WelComeController.ins.enemyPlayer.camp="blue";
            this.icon_red_player_3.loadImage(WelComeController.ins.ownPlayer.icon);
            this.icon_blue_player_3.loadImage(WelComeController.ins.enemyPlayer.icon);
        }
        else
        {
            WelComeController.ins.ownPlayer.camp="blue";
            WelComeController.ins.enemyPlayer.camp="red";
            this.icon_blue_player_3.loadImage(WelComeController.ins.ownPlayer.icon);
            this.icon_red_player_3.loadImage(WelComeController.ins.enemyPlayer.icon);
        }
    }

    /**点击确定，等待房间内人都确定后跳转进入游戏场景 */            //--网络
    private onSure():void
    {
        /**我方玩家点击确定发送请求，等待敌方玩家确定 */
        //todo
        Laya.Scene.open("PlayerLoading.scene");
    }

    /**点击拒绝，返回模式选择界面,发送拒绝请求 */                  //--网络
    private onRefuse():void
    {
        //其中一个人发送拒绝请求，直接解散房间
        //todo
        this.ModeChoosePanel.visible=true;
        this.MatchingSuccessPanel.visible=false;
    }

     
}