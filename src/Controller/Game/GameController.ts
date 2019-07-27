import { ui } from "../../ui/layaMaxUI";
import GrassFactory from "./GrassFactory";
import MessageManager from "../../Core/MessageManager";
export default class GameController extends ui.Game.GameUI{
    /**单例 */
    public static Instance:GameController;
    /**上次鼠标得位置 */
    private lastMousePosX:number;
    /**是否正在使用铲子 */
    private isUseShovel:boolean;
    /**阵营 */
    public camp:string;
    /**蓝方草坪 */
    private blueFac:GrassFactory;
    /**红方草坪 */
    private redFac:GrassFactory;
    /**己方草坪 */
    public myFac:GrassFactory;
    constructor(){
        super();
        
    }
    
    onEnable():void
    {
        
        GameController.Instance=this;
        this.redFac=new GrassFactory("red",this.game);
        this.blueFac=new GrassFactory("blue",this.game);
        this.camp="red";
        this.isCickGrass();
        Laya.timer.frameLoop(1,this,this.mapMove);
        if(this.camp=="blue")
        {
           this.myFac=this.blueFac;
        }
        else
        {
           this.myFac=this.redFac;
        }
    }

    /**地图移动 */
    private mapMove():void
    {
       this.game.x-=4;
       if(this.game.x<=-1214)
       {
           this.game.x=-1214;
           Laya.timer.clear(this,this.mapMove);
           Laya.timer.frameOnce(60,this,this.resumePos);
       }
    } 

    /**回到玩家位置 */
    private resumePos():void
    {
        if(this.camp=="blue")
        {
           this.game.x=-1230;
        }
        else
        {
           this.game.x=0;
        }
        this.MenuItem.visible=true;
        this.isUseShovel=false;
        this.addEvents();
        this.monsterOccupy();
    } 
     
    /**事件绑定 */
    private addEvents() : void
    {
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN,this,this.onShovelDown);
        this.btn_check.on(Laya.Event.MOUSE_DOWN,this,this.checkCreateComplete);
    } 

    /*******************************************鼠标事件 **************************************/
    /**鼠标按下 */
    private onMouseDown():void
    {
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        if(!this.isUseShovel)
        {
            this.lastMousePosX=Laya.stage.mouseX;
        }
    }

    /**鼠标移动 */
    private onMouseMove():void
    {
        //如果没有用铲子，则可拉动地图
        if(!this.isUseShovel)
        {
            if(Laya.stage.mouseX<this.lastMousePosX)
            {
                this.game.x-=20;
                this.lastMousePosX=Laya.stage.mouseX;
            }
            else if(Laya.stage.mouseX>this.lastMousePosX)
            {
                this.game.x+=20;
                this.lastMousePosX=Laya.stage.mouseX;
            }
            if(this.game.x>=0)
            {
                this.game.x=0;
            }
            else if(this.game.x<=-1214)
            {
                this.game.x=-1214;
            }
        }
    }
    
    /**鼠标抬起 */
    private onMouseUp():void
    {
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
    }

    /*********************************************************************************/
    /**点击铲子框拾起铲子 */
    private onShovelDown():void
    {
        this.isUseShovel=!this.isUseShovel;
        this.shovel_off.visible=!this.shovel_off.visible;
        this.shovel_on.visible=!this.shovel_on.visible;
        this.isCickGrass();
    }

    /**判断草坪块是否可点击 */
    private isCickGrass():void
    {
        //收起铲子就不能点击草坪块，相反则可
        if(this.isUseShovel)
        {
            this.game.mouseEnabled=true;
        }
        else
        {
            this.game.mouseEnabled=false;
        }    
    }

    /**怪物最先占领一个土块 */
    private monsterOccupy():void
    {
        //随机取一个10号位草坪变为土块作为怪兽出生点
        this.myFac.grassArray[10].changeImg();
        this.myFac.grassArray[10].sp.off(Laya.Event.CLICK,this.myFac.grassArray[10],this.myFac.grassArray[10].changeState);
    }

    /**检查是否建好好路径 */
    private checkCreateComplete():void
    {
        if(this.myFac.mudArray[this.myFac.mudArray.length-1]==this.myFac.grassArray[39])
        {
            //todo
            this.onShovelDown();
            this.shovelbg.visible=false;
            this.game.mouseEnabled=false;
            this.isCickGrass();       
            this.btn_check.off(Laya.Event.MOUSE_DOWN,this,this.onShovelDown);
            this.btn_check.visible=false;
            MessageManager.ins.showFloatMsg("修建成功！");
        }
        else
        {
            //否则就不能点击其他区域的草坪
            MessageManager.ins.showFloatMsg("请正确修建道路！");
        }
    }
}