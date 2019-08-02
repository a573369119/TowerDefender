import SocketHandler from "../../../Core/Net/SocketHandler";
import WebSocketManager from "../../../Core/Net/WebSocketManager";

/**
 * 返回 所有的地图路径信息
 */
export default class AllMapHandler extends SocketHandler{
    
    constructor(caller:any,callback:Function = null){
        super(caller,callback);
    }

     public explain(data):void
    {
        var ResAllMapInfo:any = WebSocketManager.ins.defineProtoClass("ResAllMapInfo");
        var message:any = ResAllMapInfo.decode(data);
        super.explain(message);
    }
    /**处理数据 */
    protected success(message):void
    {                
        super.success(message);
    }
}
    