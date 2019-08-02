import { ui } from "../../ui/layaMaxUI";
import ConfigManager from "../../Core/ConfigManager";
import WelComeController from "../WelCome/WelComeController";
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
        if(!this.isConnectServer) this.sp_progressT.text = "进度加载 " + Math.floor(pro*100) + "%   [正在连接服务器……]";
            else this.sp_progressT.text = "进度加载 " + Math.floor(pro*100) + "%   [服务器连接成功]";
    }

    /**加载完毕 */
    private onLoad() : void
    {
        this.EnterGame();
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
    /**进入游戏 */
    private EnterGame() : void
    {
        Laya.Scene.open("Game/Game.scene");
    }
}