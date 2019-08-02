import Monster from "../Monster";
import Tool from "../../../Tool/Tool";

export default class Bullet{
    /**精灵 */
    public sp:Laya.Sprite;
    constructor()
    {

    }
    
    /**初始化 */
    private init(view:Laya.Sprite,x,y):void
    {
        this.sp=new Laya.Sprite();
        this.sp.graphics.drawTexture(Laya.loader.getRes("game/bullet.png"));
        this.sp.autoSize=true;
        this.sp.pos(x,y);
        this.sp.zOrder=3;
        view.addChild(this.sp);
    }

    /**追随怪物方向进行移动发射 */
    public followMonster(monster:Monster,speed:number,damage:number):void
    {
        if(Tool.getDistance(this.sp,monster.ani)>=40)
        {
            let dirX=(monster.ani.x-this.sp.x)/Tool.getDistance(this.sp,monster.ani);
            let dirY=(monster.ani.y-this.sp.y)/Tool.getDistance(this.sp,monster.ani);
            this.sp.x+=dirX*speed;
            this.sp.y+=dirY*speed;
        }
        else
        {
            monster.currHP-=damage;
            monster.hpSP.width-=damage/monster.data.hp*monster.hpSP.width;
            if(monster.currHP<=0)
            {
                monster.Destroy();
            }
            //碰撞到怪兽
            this.Destroy();
        }
    }

    /**销毁子弹 */
    private Destroy():void
    {
        Laya.timer.clearAll(this);
        this.sp.visible=false;
        Laya.Pool.recover("bullet",this);
    }
}