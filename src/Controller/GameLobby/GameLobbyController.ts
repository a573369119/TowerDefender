import { ui } from "../../ui/layaMaxUI";
import WebSocketManager from "../../Core/Net/WebSocketManager";
import { Protocol, GameConfig } from "../../Core/Const/GameConfig";
import MatchHandler from "../GameLobby/handler/MatchHandler";
import ClientSender from "../../Core/Net/ClientSender";
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
        this.btn_entergame.on(Laya.Event.CLICK,this,this.onEnterLoading);
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
            Laya.timer.once(100,this,this.chooseMatch);
        }
    }

    /**点击选择1V1模式 */
    private on1V1() : void
    {
       // ClientSender.reqMatch(1,1);
       this.chooseMatch();
    }

    /**点击选择5V5模式 */
    private on5V5() : void
    {
        
    }

    /**点击返回游戏大厅 */
    private onBack() : void
    {
        this.MenuItemPanel.visible = true;
        this.ModeChoosePanel.visible=false;
    }

    /**匹配成功弹框，选择是否进入游戏 */
    private chooseMatch():void
    {
        this.MatchingSuccessPanel.visible=true;
        this.ModeChoosePanel.visible=false;
    }

    /**进入游戏 */
    private onEnterLoading():void
    {
        Laya.Scene.open("PlayerLoading.scene");
    }

     
}