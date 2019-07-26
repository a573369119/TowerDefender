import { ui } from "../ui/layaMaxUI";
import MessageManager from "../Core/MessageManager";

/**
 * 中间字
 */
export default class FloatMsg extends ui.Dialog_.FloatMsgUI{

    constructor(){
        super();
    }
    
    onEnable(){
        this.addEvent();
        this.init();
    }

    private init() : void
    {
        this.ani1.stop();
        this.sp_floatMsg.visible = false;
        
    }

    private addEvent() : void
    {
        this.on(Laya.Event.CLICK,this,this.onHidden);
        this.ani1.on(Laya.Event.COMPLETE,this,this.onHidden);
    }

    /**
     * 显示消息飘字
     * @param text 显示文本 【最多28个】
     * @param pos  位置{x:100,y:100}
     */
    public showMsg(text:string,pos:any) : void
    {
        this.visible = true; 
        this.alpha = 1;       
        this.sp_floatMsg.visible = true;
        this.lab_floatMsg.text = text;
        this.x = pos.x;
        this.y = pos.y;
        this.ani1.play(0,false);
    }

    private onHidden() : void
    {
        this.ani1.stop();
        this.sp_floatMsg.visible = false;
        this.visible = false;
        Laya.Pool.recover("FloatMsg",this);
        MessageManager.ins.countFloatMsg--;
    }
}