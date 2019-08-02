import WelComeController from "../../WelCome/WelComeController";
import MonsterConfig from "../../../Data/Config/MosnterConfigr";
import ConfigManager from "../../../Core/ConfigManager";

export default class MonsterItemUI{
    /**精灵 */
    private sp:Laya.Sprite;
    /**购买按钮 */
    public btn_buy:Laya.Sprite;
    /**金币文本 */
    public coinText:Laya.Text;
    /**怪兽配置数据 */
    public data:MonsterConfig;

    constructor(view:Laya.Sprite,x:number,y:number,num:number)
    {
        this.init(view,x,y,num);
    }

    /**初始化 */
    private init(view:Laya.Sprite,x:number,y:number,num:number):void
    {
        this.data=ConfigManager.ins.getConfigById("monster",num);

        this.sp=new Laya.Sprite();
        this.sp.loadImage("game/ani/"+this.data.monsterName+"_down1.png");
        this.sp.width=50;
        this.sp.height=60;
        this.sp.pos(x,y);
        view.addChild(this.sp);

        this.coinText=new Laya.Text();
        this.coinText.pos(0,this.sp.height+10);
        this.coinText.text=this.data.price.toString();
        this.coinText.align="middle";
        this.sp.addChild(this.coinText);

        this.btn_buy=new Laya.Sprite();
        this.btn_buy.loadImage("game/buy.png");
        this.btn_buy.pos(0,this.sp.height+20);
        this.sp.addChild(this.btn_buy);
    }

}