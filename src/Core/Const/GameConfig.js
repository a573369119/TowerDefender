"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
* 游戏配置
*/
var GameConfig = /** @class */ (function () {
    function GameConfig() {
    }
    /**ip*/
    // public static IP : string = "47.107.169.244";
    /**端口 */
    // public static PORT : number = 7777  ;
    // /**ip - 本地测试*/
    GameConfig.IP = "127.0.0.1";
    // /**端口 - 本地测试*/
    GameConfig.PORT = 7777;
    //--------------------配置类型------------
    GameConfig.CONFIG_NAME_MONSTER = "monster";
    GameConfig.CONFIG_NAME_DEFENDER = "defender";
    //-------------------属性 类型-----------   
    /**金 1 */
    GameConfig.TYPE_GOLD = 1;
    /**木 2 */
    GameConfig.TYPE_WOOD = 2;
    /**水 3*/
    GameConfig.TYPE_WATER = 3;
    /**火 */
    GameConfig.TYPE_FIRE = 4;
    /**土*/
    GameConfig.TYPE_GROUND = 5;
    return GameConfig;
}());
exports.GameConfig = GameConfig;
/**协议 */
var Protocol = /** @class */ (function () {
    function Protocol() {
    }
    //****************UserProto.proto
    /**请求 msgId = 101103 */
    Protocol.REQ_USER_LOGIN = 101103;
    /**101104 注册请求 */
    Protocol.REQ_USER_REGISTER = 101104;
    /**响应 msgId = 101203 */
    Protocol.RES_USER_LOGIN = 101203;
    // //************gmMessage.proto
    // /**发送GM密令 */
    // public static REQ_GM_COM:number = 199101;
    // //************userMessage.proto
    // /**注册 202102*/
    // public static REQ_USER_REGISTER:number = 202102;
    // /**登录请求 202103*/
    // public static REQ_USER_LOGIN:number = 202103;
    // /**服务器返回************* */
    // /**登录返回 202201*/
    // public static RESP_USER_LOGIN:number = 202201;
    // /**服务器列表 202203*/
    // public static RESP_SERVER_LIST:number = 202203;
    // /**公告面板 202204*/
    // public static RESP_NOTICE_BOARD:number = 202204;
    // //************loginMessage.proto
    // /**服务器登录请求 */
    // public static REQ_SERV_LOGIN:number = 101101;
    // /**心跳包请求 */
    // public static REQ_SERV_HERT:number = 101102;
    // /**请求角色信息 */
    // public static REQ_CREATE_PLAYER:number = 101103;
    // /**服务器返回************* */
    // /**心跳返回 */
    // public static RESP_SERV_HERT:number = 101201;
    // /**返回登录错误消息 */
    // public static RESP_SERV_ERROR:number = 101202;
    // /**返回被顶下线 */
    // public static RESP_SUBSTITUTE:number = 101203;
    /**请求匹配对局102101 */
    Protocol.REQ_MATCH = 102101;
    /**请求 对局接受102102 */
    Protocol.REQ_MATCH_ACCEPT = 102102;
    /**响应 返回匹配信息 只发送一次msgId = 102201 */
    Protocol.RES_MATCH_INFO = 102201;
    /**响应 返回对局接受消息msgId = 10202 */
    Protocol.RES_MATCH_ACCEPT_INFO = 10202;
    return Protocol;
}());
exports.Protocol = Protocol;
