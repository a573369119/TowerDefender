import { ui } from "../../ui/layaMaxUI";
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
        this.btn_entergame.on(Laya.Event.CLICK,this,this.onEnterGame);
    }

    private removeEvents() : void
    {
        this.btn_PVP.off(Laya.Event.CLICK,this,this.onPVPMode);
    }


    /**点击进入PVP选择界面 */
    private onPVPMode() : void
    {
        this.MenuItemPanel.visible = false;
        this.ModeChoosePanel.visible=true;
    }

    /**点击选择1V1模式 */
    private on1V1() : void
    {
        this.MatchingSuccessPanel.visible=true;
        this.ModeChoosePanel.visible=false;
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

    /**进入游戏 */
    private onEnterGame():void
    {
        Laya.Scene.open("Game/Game.scene");
    }
}