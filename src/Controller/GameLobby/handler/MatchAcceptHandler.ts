import SocketHandler from "../../../Core/Net/SocketHandler";
import WebSocketManager from "../../../Core/Net/WebSocketManager";

/**
 * 返回对局接受消息
 */
export default class MatchAcceptHandler extends SocketHandler{
    
    constructor(caller:any,callback:Function = null){
        super(caller,callback);
    }

     public explain(data):void
    {
        var ResMatchAccepteInfo:any = WebSocketManager.ins.defineProtoClass("ResMatchAccepteInfo");
        var message:any = ResMatchAccepteInfo.decode(data);
        super.explain(message);
    }
    /**处理数据 */
    protected success(message):void
    {                
        super.success(message);
    }
}
    