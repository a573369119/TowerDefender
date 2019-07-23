import GameConfig from "./GameConfig";


/**
 * 游戏入口
 */
export default class GameEnter{
		//
    
    constructor(){
        this.init();
    }

    /**初始化 */
    private init() : void
    {
        this.load();
    }
    /**资源加载 */
    private load() : void
    {
        let asseteArr = [
            {url:"unpackage/welcome_bg.png"},
            {url:"Welcome/loginbox.png"},
            {url:"Welcome/progressBg.png"},

            {url:"res/atlas/comp.atlas"},
            {url:"res/atlas/welcome.atlas"}
        ]
        Laya.loader.load(asseteArr,Laya.Handler.create(this,this.onload));
    }

    private onload() : void
    {
        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    }
}