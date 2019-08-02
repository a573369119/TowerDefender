import GameController from "./GameController";
import WelComeController from "../WelCome/WelComeController";
import MonsterConfig from "../../Data/Config/MosnterConfigr";
import ConfigManager from "../../Core/ConfigManager";

export default class Monster{
    /**动画 */
    public ani:Laya.Animation;
    /**血量 */
    public currHP:number;
    /**血量图背景 */
    public hpbg:Laya.Sprite;
    /**血量图 */
    public hpSP:Laya.Sprite;
    /**怪兽配置数据 */
    public data:MonsterConfig;
    constructor()
    {
        
    }

    /**初始化 */
    public init(view:Laya.Sprite,x:number,y:number,num:number):void
    {
        this.data=ConfigManager.ins.getConfigById("monster",num);
        this.currHP=this.data.hp;
        this.ani=new Laya.Animation();
        this.ani.zOrder=1;
        this.ani.pos(x,y);
        view.addChild(this.ani);

        this.hpbg=new Laya.Sprite();
        this.hpbg.graphics.drawTexture(Laya.loader.getRes("game/hpbg.png"));
        this.ani.addChild(this.hpbg);
        this.hpbg.autoSize=true;
        this.hpbg.pos(0,-10);

        this.hpSP=new Laya.Sprite();
        this.hpSP.loadImage("game/hp.png");
        this.hpbg.addChild(this.hpSP);
        this.hpSP.pos(0,0);
    }
    /**根据方向选择动画 */
    public typeAnimation(direction:string):void
    {
        this.ani.stop();
        this.ani.loadAnimation("Game/anis/"+this.data.monsterName+"_"+direction+".ani");
    }

    /**开启怪兽移动 */
    public monster_OpenMoveByDir():void
    {
        Laya.timer.frameLoop(1,this,this.monster_Move,[0]);
        this.typeAnimation(this.getAnimByDir(GameController.Instance.dirArray[0][0],GameController.Instance.dirArray[0][1]));
        this.ani.play(0,true);
    }

    /**怪兽移动 */
    private monster_Move(i:number):void
    {
        if((Math.abs(this.ani.x-WelComeController.ins.ownPlayer.fac.mudArray[i].sp.x)<=100&&(this.ani.y-WelComeController.ins.ownPlayer.fac.mudArray[i].sp.y==0))||
           (Math.abs(this.ani.y-WelComeController.ins.ownPlayer.fac.mudArray[i].sp.y)<=100&&(this.ani.x-WelComeController.ins.ownPlayer.fac.mudArray[i].sp.x==0)))
        {
            this.moveDistance(1,GameController.Instance.dirArray[i][0],GameController.Instance.dirArray[i][1]);
        }
        else
        {
            this.ani.x=WelComeController.ins.ownPlayer.fac.mudArray[i].sp.x+GameController.Instance.dirArray[i][0]*100;
            this.ani.y=WelComeController.ins.ownPlayer.fac.mudArray[i].sp.y+GameController.Instance.dirArray[i][1]*100;
            Laya.timer.clear(this,this.monster_Move);
            if(i<WelComeController.ins.ownPlayer.fac.mudArray.length-2)
            {
                Laya.timer.frameLoop(1,this,this.monster_Move,[i+1]);
                let dir=this.getAnimByDir(GameController.Instance.dirArray[i+1][0],GameController.Instance.dirArray[i+1][1]);
                this.typeAnimation(dir);
                this.ani.play(0,true);
            }
            else
            {
                this.goGetCrystalRoad();
            }
        }
        
    }

    /**根据怪兽计算路径方向决定动画播放 */
    private getAnimByDir(x:number,y:number):string
    {
        let dir;
        if(x==1)
        {
            dir="right";
        }
        else if(x==-1)
        {
            dir="left";
        }
        if(y==1)
        {
            dir="down";
        }
        else if(y==-1)
        {
            dir="up";
        }
        return dir;
    }

    /**开始前往抢夺水晶的道路 */
    private goGetCrystalRoad():void
    {
        let dirX;
        let type;
        if(WelComeController.ins.ownPlayer.camp=="red")
        {
            dirX=1;
            type="right";
        }
        else
        {
            dirX=-1;
            type="left";
        }
        Laya.timer.frameLoop(1,this,this.moveDistance,[1,dirX,0]);
        this.typeAnimation(type);
        this.ani.play(0,true);
    }

    /**移动距离 */
    private moveDistance(speed:number,dirX:number,dirY:number):void
    {
        this.ani.x+=speed*dirX;
        this.ani.y+=speed*dirY;
    }

    /**抢夺水晶的道路上检测对方怪兽 */
    private checkEnemy():void
    {
        
    }
    
    /**销毁Monster */
    public Destroy():void
    {
        Laya.timer.clearAll(this);
        this.ani.visible=false;
        this.ani.y=-1000;
        Laya.Pool.recover("monster",this);
    }
}