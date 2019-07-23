import FloatMsg from "../Tool/FloatMsg";
import Tool from "../Tool/Tool";

/**
 * 消息显示管理器
 */
export default class MessageManager {
    /**单例 */
    public static ins : MessageManager = new MessageManager;
    /**屏幕拥有的浮动消息计数*/
    public countFloatMsg : number;
    constructor(){
        this.countFloatMsg = 0;
    }

    /**
     * 浮动消息预热,，提前新建一个float
     */
    public newFloatMsg() : void
    {
        let floatMsg = new FloatMsg();
        Laya.stage.addChild(floatMsg);
        Laya.Pool.recover("FloatMsg",floatMsg); 
    }

    /**
     * 显示浮动消息
     * @param text  显示消息
     */
    public showFloatMsg(text:string) : void
    {
        let floatMsg : FloatMsg = Laya.Pool.getItem("FloatMsg");
        if(Laya.Pool.getPoolBySign("FloatMsg").length == 0) this.newFloatMsg();
        if(floatMsg  === null)
        {
            floatMsg = new FloatMsg();
            Laya.stage.addChild(floatMsg);        
        }
        floatMsg.zOrder = 100 + this.countFloatMsg;
        console.log(Tool.getCenterX());
        floatMsg.showMsg(text,{x:Tool.getCenterX() + this.countFloatMsg*20,y: 375 + this.countFloatMsg*20});
        this.countFloatMsg++;
    }

}