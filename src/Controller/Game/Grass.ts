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
        this.sp.on(Laya.Event.CLICK,this,this.changeImg);
    }

    /**转换状态，标记是否为土块 */
    public changeImg():void
    {
        console.log("有没有效果")
        this.sp.graphics.clear();
        if(!this.isMud)
        {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/mud.png"));
            this.isMud=true;
        }
        else
        {
            this.sp.graphics.drawTexture(Laya.loader.getRes("game/grass"+this.num+".png"));
            this.isMud=false;
        }
    }

}