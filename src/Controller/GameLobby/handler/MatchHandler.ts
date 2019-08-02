import SocketHandler from "../../../Core/Net/SocketHandler";
import WebSocketManager from "../../../Core/Net/WebSocketManager";

/**
 * 返回匹配信息 只发送一次
 */
export default class MatchHandler extends SocketHandler{
    
    constructor(caller:any,callback:Function = null){
        super(caller,callback);
    }

     public explain(data):void
    {
        var ResMatchInfo:any = WebSocketManager.ins.defineProtoClass("ResMatchInfo");
        var message:any = ResMatchInfo.decode(data);
        super.explain(message);
    }
    /**处理数据 */
    protected success(message):void
    {                
        super.success(message);
    }
}
    