import { ui } from "../../ui/layaMaxUI";
import ConfigManager from "../../Core/ConfigManager";
export default class LoadingController extends ui.PlayerLoadingUI{
    /**是否连接上服务器 */
    private isConnectServer : boolean;
    constructor(){
        super();
    }

    onEnable(){
        this.isConnectServer = false; 
        this.loadAssets();
    }

    /**加载游戏场景资源 */
    private loadAssets() : void
    {
        let src = [
            //图集加载
            {url:"res/atlas/game.atlas"},      
        ];
        Laya.loader.load(src,Laya.Handler.create(this,this.onLoad),Laya.Handler.create(this,this.onProcess));
        this.onLoad();
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

    /**进入游戏 */
    private EnterGame() : void
    {
        Laya.Scene.open("Game/Game.scene");
    }
}