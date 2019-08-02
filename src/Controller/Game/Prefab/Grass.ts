import GameController from "../GameController";
import Defender from "./Defender";
import MessageManager from "../../../Core/MessageManager";
import WelComeController from "../../WelCome/WelComeController";

export default class Grass{
    /**横坐标位置 */
    public X:number;
    /**纵坐标位置 */
    public Y:number;
    /**精灵 */
    public sp:Laya.Sprite;
    /**是否为土块标记 */
    public isMud:boolean;
    /**草坪图类型 */
    private num:number;
    /**view */
    private view:Laya.Sprite;
    constructor(num:number,view:Laya.Sprite)
    {
        this.init(num,view);
        this.view=view;
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
        this.sp.on(Laya.Event.CLICK,this,this.Event1_changeState);
    }

    /**格子位置 */
    public Pos(X:number,Y:number):void
    {
        this.X=Y;
        this.Y=X;
        this.sp.pos(100*Y,25+100*X);
    }
    /**注册第一种事件：转换状态，标记是否为土块 */
    public Event1_changeState():void
    {
        //如果是草坪,则变成土块
        if(!this.isMud)
        {
            //如果此草坪在上一个最后一次记录土块的周围的话，则可变为土块
            let mudsp=WelComeController.ins.ownPlayer.fac.mudArray[WelComeController.ins.ownPlayer.fac.mudArray.length-1].sp;
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
            if(WelComeController.ins.ownPlayer.fac.mudArray[0]!=null)
            {   
                WelComeController.ins.ownPlayer.fac.mudArray[WelComeController.ins.ownPlayer.fac.mudArray.length-1].sp.mouseEnabled=false;
            }
            else
            {
                this.sp.mouseEnabled=false;
            }
            WelComeController.ins.ownPlayer.fac.mudArray.push(this);
        }
        else//如果是土块,则变成草坪
        {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass"+this.num+".png"));
            this.isMud=false;
            WelComeController.ins.ownPlayer.fac.mudArray[WelComeController.ins.ownPlayer.fac.mudArray.length-2].sp.mouseEnabled=true;
            WelComeController.ins.ownPlayer.fac.mudArray.pop();
        }           
        
        
    }

    /**注册第二种事件：往草坪上添加炮塔 */
    public Event2_AddDefender():void
    {
        let defender=Laya.Pool.getItemByClass("defender",Defender);
        defender.init(this.view,this.sp.x,this.sp.y,WelComeController.ins.ownPlayer.defenderId);
        WelComeController.ins.ownPlayer.coin-=WelComeController.ins.ownPlayer.defenderCoin;
        GameController.Instance.text_coin.text=WelComeController.ins.ownPlayer.coin.toString();
        this.sp.off(Laya.Event.CLICK,this,this.Event2_AddDefender);
    }
}