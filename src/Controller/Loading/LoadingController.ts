import { ui } from "../../ui/layaMaxUI";
import ConfigManager from "../../Core/ConfigManager";
import WelComeController from "../WelCome/WelComeController";
import WebSocketManager from "../../Core/Net/WebSocketManager";
import { Protocol } from "../../Core/Const/GameConfig";
import OnLoadHandler from "../Game/handler/OnLoadHandler";
import ClientSender from "../../Core/Net/ClientSender";
export default class LoadingController extends ui.PlayerLoadingUI{
    /**是否连接上服务器 */
    private isConnectServer : boolean;
    constructor(){
        super();
    }

    onEnable(){
        this.isConnectServer = false; 
        this.selectMode();
        this.loadAssets();
        
    }

    /**事件绑定 */
    private addEvents() : void
    {
        WebSocketManager.ins.registerHandler(Protocol.RES_ONLOAD,new OnLoadHandler(this,this.onLoadHandler));
    }

    private removeEvents() : void
    {
        WebSocketManager.ins.unregisterHandler(Protocol.RES_ONLOAD,this);
    }

    /**确定游戏模式，显示玩家信息，界面上方显示红方玩家，下方显示蓝方玩家*/
    private selectMode():void
    {
        if(WelComeController.ins.mode=="1V1")
        {
            for(let i=0;i<5;i++)
            {
                this.red_group._children[i].visible=false;
                this.blue_group._children[i].visible=false;
            }
            this.red_player_3.visible=true;
            this.blue_player_3.visible=true;
        }

        if(WelComeController.ins.ownPlayer.camp=="red")
        {
            this.icon_red_player_3.loadImage(WelComeController.ins.ownPlayer.icon);
            this.name_red_player_3.text=WelComeController.ins.ownPlayer.name;
            this.icon_blue_player_3.loadImage(WelComeController.ins.enemyPlayer.icon);
            this.name_blue_player_3.text=WelComeController.ins.enemyPlayer.name;
        }
        else
        {
            this.icon_blue_player_3.loadImage(WelComeController.ins.ownPlayer.icon);
            this.name_blue_player_3.text=WelComeController.ins.ownPlayer.name;
            this.icon_red_player_3.loadImage(WelComeController.ins.enemyPlayer.icon);
            this.name_red_player_3.text=WelComeController.ins.enemyPlayer.name;
        }
    }
    
    /**加载游戏场景资源 */
    private loadAssets() : void
    {
        let src = [
            //图集加载
            {url:"res/atlas/game.atlas"}, 
            {url:"res/atlas/game/ani.atlas"}     
        ];
        Laya.loader.load(src,Laya.Handler.create(this,this.onLoad),Laya.Handler.create(this,this.onProcess));
    }

    /**加载进程 */
    private onProcess(pro) : void
    {
        let proBox = this.sp_progress;
        let proW = this.sp_progressW;
        let proL = this.sp_progressL;
        proW.width = proBox.width*pro;
        proL.x = proBox.width*pro;
        this.sp_progressT.text = "进度加载 " + Math.floor(pro*100) + "%   [正在连接服务器……]";
    }

    /**加载完毕 */
    private onLoad() : void
    {
        ClientSender.reqOnLoad(WelComeController.ins.ownPlayer.userId);
    }

    private onLoadHandler(data) : void
    {
        //都加载完毕游戏可以开始 
        if(data.status==1)
        {
            if(WelComeController.ins.ownPlayer.camp=="red")
            {
                WelComeController.ins.ownPlayer.enemy_MonsterBornGrass=
                WelComeController.ins.ownPlayer.fac.grassArray[data.team1StartPoint.x+data.team1Start.y*10];
                WelComeController.ins.enemyPlayer.enemy_MonsterBornGrass=
                WelComeController.ins.enemyPlayer.fac.grassArray[data.team2StartPoint.x+data.team2Start.y*10];
            }
            else
            {
                WelComeController.ins.enemyPlayer.enemy_MonsterBornGrass=
                WelComeController.ins.enemyPlayer.fac.grassArray[data.team1StartPoint.x+data.team1Start.y*10];
                WelComeController.ins.ownPlayer.enemy_MonsterBornGrass=
                WelComeController.ins.ownPlayer.fac.grassArray[data.team2StartPoint.x+data.team2Start.y*10];
            }
            this.EnterGame();
        }
    }

    /**进入游戏 */
    private EnterGame() : void
    {
        Laya.Scene.open("Game/Game.scene");
    }
}