import Monster from "../Monster";
import Tool from "../../../Tool/Tool";
import Bullet from "./Bullet";
import GameController from "../GameController";
import WelComeController from "../../WelCome/WelComeController";
import DefenderConfig from "../../../Data/Config/DefenderConfig";
import ConfigManager from "../../../Core/ConfigManager";

export default class Defender{
    /**精灵 */
    public sp:Laya.Sprite;
    /**正对一个目标进行射击 */
    private isShootingByOne:boolean;
    /**正在射击的怪兽 */
    private currMonster:Monster;
    /**防御塔配置数据 */
    public data:DefenderConfig;
    /**view */
    private view:Laya.Sprite;
    
    constructor(){}

    /**初始化 */
    private init(view:Laya.Sprite,x,y,num):void
    {
        this.data=ConfigManager.ins.getConfigById("defender",num);
        this.view=view;
        this.isShootingByOne=false;

        this.sp=new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/"+this.data.defenderName+".png"));
        this.sp.autoSize=true;
        this.sp.pos(x,y);
        this.sp.zOrder=2;
        view.addChild(this.sp);
        Laya.timer.frameLoop(1,this,this.checkMonsterDistance,[GameController.Instance.monsterArray])
    }

    /**范围检测 */
    public checkMonsterDistance(monsterArray:Array<Monster>):void
    {
        if(GameController.Instance.isMonsterMove)
        {
            if(this.isShootingByOne)
            {
                if((Tool.getDistance(this.sp,this.currMonster.ani)>=this.data.dic)||this.currMonster.currHP<=0)
                {
                    Laya.timer.clear(this,this.createBullet);
                    this.isShootingByOne=false;
                }
    
            }
            else
            {
                for(let i=0;i<monsterArray.length;i++)
                {
                    if(Tool.getDistance(this.sp,monsterArray[i].ani)<this.data.dic)
                    {
                       Laya.timer.frameLoop(this.data.attackFrequency*60,this,this.createBullet,[monsterArray[i]]);
                       this.currMonster=monsterArray[i];
                       this.isShootingByOne=true;
                       break;
                    }
                }
            }
        }
    }

    /**生成子弹 */
    private createBullet(monster):void
    {
        let bullet=Laya.Pool.getItemByClass("bullet",Bullet);
        bullet.init(this.view,this.sp.x,this.sp.y);
        Laya.timer.frameLoop(1,bullet,bullet.followMonster,[monster,this.data.attackSpeed,this.data.power]);
    }

    /**销毁Defender */
    public Destroy():void
    {
        Laya.timer.clearAll(this);
        this.sp.visible=false;
        this.sp.y=-1000;
        Laya.Pool.recover("defender",this);
    }
}