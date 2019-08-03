import { ui } from "../../ui/layaMaxUI";
import WebSocketManager from "../../Core/Net/WebSocketManager";
import { Protocol, GameConfig } from "../../Core/Const/GameConfig";
import UserLoginHandler from "./handler/UserLoginHandler";
import ClientSender from "../../Core/Net/ClientSender";
import Tool from "../../Tool/Tool";
import MessageManager from "../../Core/MessageManager";
import ConfigManager from "../../Core/ConfigManager";
import Player from "./Player";

export default class WelComeController extends ui.Welcome.LoginUI{
    /**单例 */
    public static ins:WelComeController;
    /**是否连接上服务器 */
    private isConnectServer : boolean;
    /**玩家信息 */
    public ownPlayer:Player;
    /**敌方玩家信息 */
    public enemyPlayer:Player;
    /**游戏模式 */
    public mode:string;
    constructor(){
        super();
    }
    /////////////生命周期
    /**启动 */
    onEnable(){
        WelComeController.ins=this;
        this.dataInit();
        this.setCenter();
        this.loadAssets();
        this.connectServer();//连接服务器
        this.addEvents();
    }

    /**销毁*/
    onDestroy(){
        this.removeEvents();
    }


    ////////////逻辑
    /**数据初始化 */
    private dataInit() : void
    {
        this.isConnectServer = false; 
    }
    /**事件绑定 */
    private addEvents() : void
    {
        this.btn_login.on(Laya.Event.CLICK,this,this.onLogin);
        this.btn_register.on(Laya.Event.CLICK,this,this.onRegister);
        this.btn_toLogin.on(Laya.Event.CLICK,this,this.onToLogin);
        this.btn_toRegister.on(Laya.Event.CLICK,this,this.onToRegister)
        WebSocketManager.ins.registerHandler(Protocol.RES_USER_LOGIN,new UserLoginHandler(this,this.onLoginHandler));
    }

    private removeEvents() : void
    {
        this.btn_login.off(Laya.Event.CLICK,this,this.onLogin);
        WebSocketManager.ins.unregisterHandler(Protocol.RES_USER_LOGIN,this);
    }

    /**局中显示 */
    private setCenter() : void
    {
        let center = Tool.getCenterX();//屏幕高度
        this.sp_progress.x = center;
        this.sp_gameName.x = center;
    }

    private loadAssets() : void
    {
        let src = [
            {url:"unpackage/welcome/boximg.png"},
            //json
            {url:"outside/config/gameConfig/defender.json"},
            {url:"outside/config/gameConfig/monster.json"}  
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
        this.sp_progressT.text = "加载完毕进入游戏";
        Laya.timer.once(800,this,this.showLoginBox);
        MessageManager.ins.newFloatMsg();
        //获取配置
        ConfigManager.ins.loadConfig();
    }

    /**显示登录框**/
    private showLoginBox() : void
    {
        this.sp_loginBox.visible = true;
        this.ani1.play(0,false);
        this.sp_gameName.x = this.sp_loginBox.width + this.sp_gameName.width/2 + 100;
        this.sp_progress.visible = false;
    }

    /**点击登陆 */
    private onLogin() : void
    {
        ClientSender.reqUserLogin(this.input_userName.text,this.input_userKey.text);
    }

    /**点击注册 */
    private onRegister() : void
    {
        this.sp_registerBox.visible = true;
    }

    /**点击 已有账号 */
    private onToLogin() : void
    {
        this.sp_registerBox.visible = false;
    }

    /**点击 注册 */
    private onToRegister() : void
    {
        ClientSender.reqUserRegister(this.input_registerUserName.text,this.input_registerUserKey.text,this.input_registerNickName.text);        
    }

    /**获取到消息 */
    private onLoginHandler(data) : void
    {
        console.log(data);
        if(data !== undefined)
        {
            this.ownPlayer=new Player(data.userName,data.userId,"gameLobby/player_icon.png");

            let text = "登陆成功，进入游戏！"
            if(this.sp_registerBox.visible) text = "注册成功，将直接进入游戏！";
            MessageManager.ins.showFloatMsg(text);
            this.toGameMain();
        }
    }

    /**连接服务器 */
    private connectServer() : void
    {
        WebSocketManager.ins.connect(GameConfig.IP,GameConfig.PORT);
    }

    //////////////////////////////////////////////////////////
    private toGameMain() : void
    {
        //TO DO 跳转至游戏大厅
        Laya.Scene.open("GameLobby/GameLobby.scene");
    }
}