import GameController from "./GameController";
import MessageManager from "../../Core/MessageManager";

export default class Grass{
    /**精灵 */
    public sp:Laya.Sprite;
    /**是否为土块标记 */
    public isMud:boolean;
    /**草坪图类型 */
    private num:number;
    constructor(num:number,view:Laya.Sprite)
    {
        this.init(num,view);
    }

    /**初始化 */
    private init(num:number,view:Laya.Sprite):void
    {
        this.num=num;
        this.isMud=false;
        this.sp=new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass"+num+".png"));
        view.addChild(this.sp);
        this.sp.autoSize=true;
        this.sp.on(Laya.Event.CLICK,this,this.changeState);
    }

    /**转换状态，标记是否为土块 */
    public changeState():void
    {
        //如果是草坪,则变成土块
        if(!this.isMud)
        {
            //如果此草坪在上一个最后一次记录土块的周围的话，则可变为土块
            let mudsp=GameController.Instance.myFac.mudArray[GameController.Instance.myFac.mudArray.length-1].sp;
            if((Math.abs(mudsp.x-this.sp.x)==100&&(mudsp.y==this.sp.y))||
               (Math.abs(mudsp.y-this.sp.y)==100&&(mudsp.x==this.sp.x)))
               {
                   this.changeImg();
               }
            else
            {
                //否则就不能点击其他区域的草坪
                MessageManager.ins.showFloatMsg("请在土块周围建立道路！");
            }
            
        }
        else
        {
            this.changeImg();
        }
        
    }

    /**切换图片 */
    public changeImg():void
    {
        this.sp.graphics.clear();
        //如果是草坪,则变成土块
        if(!this.isMud)
        {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/mud.png"));
            this.isMud=true;
            if(GameController.Instance.myFac.mudArray[0]!=null)
            {   
                GameController.Instance.myFac.mudArray[GameController.Instance.myFac.mudArray.length-1].sp.mouseEnabled=false;
            }
            else
            {
                this.sp.mouseEnabled=false;
            }
            GameController.Instance.myFac.mudArray.push(this);
        }
        else//如果是土块,则变成草坪
        {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass"+this.num+".png"));
            this.isMud=false;
            GameController.Instance.myFac.mudArray[GameController.Instance.myFac.mudArray.length-2].sp.mouseEnabled=true;
            GameController.Instance.myFac.mudArray.pop();
        }           
        
        
    }
}