import { ui } from "../../ui/layaMaxUI";
import GrassFactory from "./GrassFactory";
export default class GameController extends ui.Game.GameUI{
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
    private myFac:GrassFactory;
    constructor(){
        super();
        this.redFac=new GrassFactory("red",this.game);
        this.blueFac=new GrassFactory("blue",this.game);
    }
    
    onEnable():void
    {
        this.camp="red";
        Laya.timer.frameLoop(1,this,this.mapMove);
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
           this.myFac=this.blueFac;
        }
        else
        {
           this.game.x=0;
           this.myFac=this.redFac;
        }
        this.MenuItem.visible=true;
        this.isUseShovel=false;
        this.addEvents();
        //this.isCickGrass();
        
        let sp=new Laya.Sprite();
        sp.graphics.drawTexture(Laya.loader.getRes("game/mud.png"));
        sp.autoSize=true;
        Laya.stage.addChild(sp);
        sp.on(Laya.Event.CLICK,this,this.check);
    } 
     
    /**事件绑定 */
    private addEvents() : void
    {
        //Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        //Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN,this,this.onShovelDown);
        
    } 

    check():void
    {
        console.log("是否可注册");
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
        //this.isCickGrass();
    }

    /**判断草坪块是否可点击 */
    private isCickGrass():void
    {
        /*for(let i=0;i<this.myFac.grassArray.length;i++)
        {
            //收起铲子就不能点击草坪块，相反则可
            if(this.isUseShovel)
            {
                this.myFac.grassArray[i].sp.mouseEnabled=true;
            }
            else
            {
                this.myFac.grassArray[i].sp.mouseEnabled=false;
            }
        }*/
    }

    
}