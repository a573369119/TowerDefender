import { ui } from "../../ui/layaMaxUI";
import WebSocketManager from "../../Core/Net/WebSocketManager";
import { Protocol, GameConfig } from "../../Core/Const/GameConfig";
import MatchHandler from "../GameLobby/handler/MatchHandler";
import ClientSender from "../../Core/Net/ClientSender";
import WelComeController from "../WelCome/WelComeController";
import Player from "../WelCome/Player";
import MatchAcceptHandler from "./handler/MatchAcceptHandler";
export default class GameLobbyController extends ui.GameLobby.GameLobbyUI{
    /**分计数 */
    private minute:number;
    /**秒计数 */
    private second:number;
    constructor(){
        super();
    }

    /**启动 */
    onEnable(){
        this.second=0;
        this.minute=0;
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
        WebSocketManager.ins.registerHandler(Protocol.RES_MATCH_ACCEPT_INFO,new MatchAcceptHandler(this,this.onMatchAcceptHandler));
    }

    private removeEvents() : void
    {
        this.btn_PVP.off(Laya.Event.CLICK,this,this.onPVPMode);
        WebSocketManager.ins.unregisterHandler(Protocol.RES_MATCH_INFO,this);
        WebSocketManager.ins.unregisterHandler(Protocol.RES_MATCH_ACCEPT_INFO,this);
    }


    /**点击进入PVP选择界面 */
    private onPVPMode() : void
    {
        this.MenuItemPanel.visible = false;
        this.ModeChoosePanel.visible=true;
    }

    /**点击返回游戏大厅 */
    private onBack() : void
    {
        this.MenuItemPanel.visible = true;
        this.ModeChoosePanel.visible=false;
    }

    /**点击选择1V1模式，匹配界面只显示玩家和敌人两个头像 */
    private on1V1() : void
    {
        //发送匹配请求
        ClientSender.reqMatch(WelComeController.ins.ownPlayer.userId,1);
        Laya.timer.frameLoop(60,this,this.calTime);

        this.ModeChoosePanel.visible=false;
        this.MatchingPanel.visible=true;
        for(let i=0;i<5;i++)
        {
            this.red_group._children[i].visible=false;
            this.blue_group._children[i].visible=false;
        }
        this.icon_red_player_3.visible=true;
        this.icon_blue_player_3.visible=true;
        WelComeController.ins.mode="1V1";

    }

    /**点击选择5V5模式 */
    private on5V5() : void
    {
        //WelComeController.ins.mode="5V5";
    }

    /**Match获取到消息 */
    private onMatchHandler(data) : void
    {
        console.log(data+"匹配成功");
        if(data.status==1 )
        {
            this.chooseMatch();
            WelComeController.ins.enemyPlayer=new Player(data.matchInfoList[0].userName,data.matchInfoList[0].userId,"gameLobby/player_icon2.png");
            if(data.matchInfoList[0].teamNum==1)
            {
                WelComeController.ins.enemyPlayer.camp="red";
                WelComeController.ins.ownPlayer.camp="blue";
                this.icon_red_player_3.loadImage(WelComeController.ins.enemyPlayer.icon);
                this.icon_blue_player_3.loadImage(WelComeController.ins.ownPlayer.icon);
            }
            else
            {
                WelComeController.ins.enemyPlayer.camp="blue";
                WelComeController.ins.ownPlayer.camp="red";
                this.icon_red_player_3.loadImage(WelComeController.ins.ownPlayer.icon);
                this.icon_blue_player_3.loadImage(WelComeController.ins.enemyPlayer.icon);
            }
        }
    }

   

    /**计时，在等待队列等待了多长时间 */
    private calTime():void
    {
        let secondStr,minuteStr;
        this.second++;
        if(this.second<=9)
        {
            secondStr="0"+this.second;
        }
        else if(this.second>=60)
        {
            this.minute++;
            this.second=0;
            secondStr="0"+this.second;
        }
        else
        {
            secondStr=this.second.toString();
        }

        if(this.minute<=9)
        {
            minuteStr="0"+this.minute;
        }
        else
        {
            minuteStr=this.minute.toString();
        }
        this.text_time.text=minuteStr+":"+secondStr;
    }

    /**匹配过程中点击取消,返回模式选择界面，从等待房间退出 */       
    private onCancel():void
    {
        this.MatchingPanel.visible=false;
        this.ModeChoosePanel.visible=true;
        Laya.timer.clear(this,this.calTime);
        this.minute=0;
        this.second=0;
        ClientSender.reqMatchAccept(WelComeController.ins.ownPlayer.userId,2);//拒绝
    }

    /**匹配成功弹框，获取敌方玩家信息，选择是否进入游戏 */
    private chooseMatch():void
    {
        this.MatchingPanel.visible=false;
        this.MatchingSuccessPanel.visible=true;
        Laya.timer.clear(this,this.calTime);
        this.minute=0;
        this.second=0;
        
    }

    /**点击确定，等待房间内人都确定后跳转进入游戏场景 */            //--网络
    private onSure():void
    {
        /**我方玩家点击确定发送请求，等待敌方玩家确定 */
        //ClientSender.reqMatchAccept(WelComeController.ins.ownPlayer.userId,1);//接受
        Laya.Scene.open("PlayerLoading.scene");
    }

    /**点击拒绝，返回模式选择界面,发送拒绝请求 */                  //--网络
    private onRefuse():void
    {
        //其中一个人发送拒绝请求，直接解散房间
        this.ModeChoosePanel.visible=true;
        this.MatchingSuccessPanel.visible=false;
        ClientSender.reqMatchAccept(WelComeController.ins.ownPlayer.userId,2);//拒绝
    }

      /**MatchAccept获取到消息 */
    private onMatchAcceptHandler(data) : void
    {
        console.log(data+"这个");
        if(data.status==2)
        {
            //其中一个人发送拒绝请求，直接解散房间
            this.ModeChoosePanel.visible=true;
            this.MatchingSuccessPanel.visible=false;
        }
        else
        {
            console.log(data.userIdList.length+"咋回事啊");
            if(data.userIdList.length==0)
            {
                Laya.Scene.open("PlayerLoading.scene");
            }
        }
    }
}