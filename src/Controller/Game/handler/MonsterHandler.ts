import SocketHandler from "../../../Core/Net/SocketHandler";
import WebSocketManager from "../../../Core/Net/WebSocketManager";

/**
 * 返回给双方，每回合的怪物 
 */
export default class MonsterHandler extends SocketHandler{
    
    constructor(caller:any,callback:Function = null){
        super(caller,callback);
    }

     public explain(data):void
    {
        var ResMonsterInfo:any = WebSocketManager.ins.defineProtoClass("ResMonsterInfo");
        var message:any = ResMonsterInfo.decode(data);
        super.explain(message);
    }
    /**处理数据 */
    protected success(message):void
    {                
        super.success(message);
    }
}
    