import SocketHandler from "../../../Core/Net/SocketHandler";
import WebSocketManager from "../../../Core/Net/WebSocketManager";

/**
 * 当所有人都加载好了之后返回游戏开始消息 
 */
export default class OnLoadHandler extends SocketHandler{
    
    constructor(caller:any,callback:Function = null){
        super(caller,callback);
    }

     public explain(data):void
    {
        var ResOnLoad:any = WebSocketManager.ins.defineProtoClass("ResOnLoad");
        var message:any = ResOnLoad.decode(data);
        super.explain(message);
    }
    /**处理数据 */
    protected success(message):void
    {                
        super.success(message);
    }
}
    