import ConfigManager from "../../../Core/ConfigManager";
import DefenderConfig from "../../../Data/Config/DefenderConfig";

export default class DefenderItemUI{
    /**精灵 */
    public sp:Laya.Sprite;
    /**金币文本 */
    public coinText:Laya.Text;
    /**防御塔配置数据 */
    public data:DefenderConfig;

    constructor(view:Laya.Sprite,x:number,y:number,num:number)
    {
        this.init(view,x,y,num);
    }

    /**初始化 */
    private init(view:Laya.Sprite,x,y,num:number):void
    {
        this.data=ConfigManager.ins.getConfigById("defender",num);

        this.sp=new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/"+this.data.defenderName+".png"));
        this.sp.autoSize=true;
        this.sp.pos(x,y);
        this.sp.zOrder=2;
        view.addChild(this.sp);

        this.coinText=new Laya.Text();
        this.coinText.pos(0,this.sp.height+20);
        this.coinText.text=this.data.price.toString();
        this.sp.addChild(this.coinText);
    }
}