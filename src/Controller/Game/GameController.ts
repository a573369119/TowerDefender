import { ui } from "../../ui/layaMaxUI";
export default class GameController extends ui.Game.GameUI{
    /**上次鼠标得位置 */
    private lastMousePosX:number;
    /**是否正在使用铲子 */
    private isUseShovel:boolean;
    /**玩家阵营 */
    public camp:string;
    /**草坪数组 */
    public grassArray:Array<Laya.Sprite>;
    /**标记每个草坪是否为土块 */
    public grassIsMudArray:Array<boolean>;
    /**阵营草坪地盘 */
    public groupGrass:Laya.Sprite;
    constructor(){
        super();
    }
    
    onEnable():void
    {
        Laya.timer.frameLoop(1,this,this.mapMove)
        this.camp="red";
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
           this.groupGrass=this.blue_Grass;
        }
        else
        {
           this.game.x=0;
           this.groupGrass=this.red_Grass;
        }
        this.MenuItem.visible=true;
        this.isUseShovel=false;
        this.saveMudIntoArray();
        this.addEvents();
        this.isCickGrass();
    } 
     
    /**事件绑定 */
    private addEvents() : void
    {
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN,this,this.onShovelDown);
        for(let i=0;i<this.grassArray.length;i++)
        {
            this.grassArray[i].on(Laya.Event.MOUSE_DOWN,this,this.toBeMudOrCancel,[i]);
        }
    } 

    /**将己方土地收入数组中 */
    private saveMudIntoArray():void
    {
        this.grassArray=new Array<Laya.Sprite>();
        for(let i=0;i<this.groupGrass._children.length;i++)
        {
            this.grassArray.push(this.groupGrass._children[i]);
            this.grassIsMudArray[i]=false;
        }
    }

    /**鼠标按下 */
    private onMouseDown():void
    {
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        if(!this.isUseShovel)
        {
            this.lastMousePosX=Laya.stage.mouseX;
        }
        else
        {
            
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
        for(let i=0;i<this.grassArray.length;i++)
        {
            //收起铲子就不能点击草坪块，相反则可
            if(this.isUseShovel)
            {
                this.grassArray[i].mouseEnabled=true;
            }
            else
            {
                this.grassArray[i].mouseEnabled=false;
            }
        }
    }

    /**变成土块与取消土块 */
    private toBeMudOrCancel(i):void
    {
        if(this.grassIsMudArray[i])
        {
            this.grassArray[i].loadImage("game/mud.png");           
        }
    }
}