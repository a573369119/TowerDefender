/*
* 游戏配置
*/
export class GameConfig{
    /**ip*/
    // public static IP : string = "47.107.169.244";
    /**端口 */
    // public static PORT : number = 7777  ;
    // /**ip - 本地测试*/
    public static IP : string = "127.0.0.1";
    // /**端口 - 本地测试*/
    public static PORT : number = 7777;

    constructor(){

    }
}

/**协议 */
export class Protocol{
     //****************UserProto.proto
    /**请求 msgId = 101103 */
    public static REQ_USER_LOGIN : number = 101103;
    /**101104 注册请求 */
    public static REQ_USER_REGISTER : number = 101104;

    /**响应 msgId = 101203 */
    public static RES_USER_LOGIN : number = 101203;

    




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



    // //************playerMessage.proto
    // //请求
    // /**请求扭蛋 msgId=102101 */
    // public static REQ_GACHA:number = 102101;

    // /**服务器返回************* */
    // /**登陆返回角色基本信息  msgId=102201  */
    // public static RESP_PLAYER_INFO:number = 102201;
    // /**返回操作成功  msgId=102202  */
    // public static RESP_OPREATE_SUCCESS:number = 102202;
    // /**返回操作失败  msgId=102203  */
    // public static RESP_OPREATE_FAIL:number = 102203;
    // /**返回角色发生变化后的属性信息(列表)  msgId=102204  */
    // public static RESP_PLAYER_ATTRIBUTE_EQUAL:number = 102204;
    // /**返回角色发生变化的属性信息(列表)  msgId=102205  */
    // public static RESP_PLAYER_ATTRIBUTE_UPDATE:number = 102205;
    // /**返回扭蛋 msgId=102206  */
    // public static RESP_GACHA:number = 102206;

    // //************skillMessage.proto
    // // -------------------------------------请求消息-------------------------------------
    // /**请求所有技能信息 msgId=107101		-----返回消息msgId=107201 */
    // public static REQ_ALL_SKILL_INFO:number = 107101;
    // /**请求出战技能信息 msgId=107102		-----返回消息msgId=107202 */
    // public static REQ_FIGHT_SKILL_LIST:number = 107102;
    // /**请求升级技能 msgId=107103		-----返回消息msgId=107203 */
    // public static REQ_UP_SKILL:number = 107103;
    // /**请求重置技能 msgId=107104		-----返回消息msgId=107204 */
    // public static REQ_RESET_SKILL:number = 107104;
    // /**请求改变格子技能 msgId=107105		-----返回消息msgId=107205 */
    // public static REQ_ALTER_GRID_SKILL:number = 107105;

    // // -------------------------------------返回消息-------------------------------------
    // /**返回所有技能信息  msgId=107201 */
    // public static RESP_ALL_SKILL_INFO:number = 107201;
    // /**返回出战技能信息  msgId=107202 */
    // public static RESP_FIGHT_SKILL_LIST:number = 107202;
    // /**返回升级技能  msgId=107203 */
    // public static RESP_UP_SKILL:number = 107203;
    // /**返回重置技能成功，客户端收到此消息，本地移除全部技能  msgId=107204 */
    // public static RESP_RESET_SKILL:number = 107204;
    // /**返回改变格子技能  msgId=107205 */
    // public static RESP_ALTER_GRID_SKILL:number = 107205;


    // //********************* petMessage
    // /**请求宠物初始创建（创建角色获得初始宠物） msgId=105101		-----返回消息msgId=105201 */
    // public static REQ_PET_RANDOM_CREATE:number = 105101;
    // /**请求改变上阵宠物信息 msgId=105102		-----返回成功消息msgId=105202 */
    // public static REQ_PET_ALTER_GRID:number = 105102;
    // /**请求喂宠物吃饭 msgId=105103		-----返回成功消息msgId=105204 */
    // public static REQ_PET_FEED:number = 105103;
    // /**请求宠物合成 msgId=105104		-----返回成功消息msgId=105203 */
    // public static REQ_PET_COMPOUND:number = 105104;
    // /**请求宠物领悟技能 msgId=105106		-----返回成功消息msgId=105206 */
    // public static REQ_PET_STUDY_SKILL:number = 105106;
    // /**请求宠物重置技能 msgId=105107		-----返回成功消息msgId=105207 */
    // public static REQ_PET_RESET_SKILL:number = 105107;
    // /**请求宠物技能进阶 msgId=105108		-----返回成功消息msgId=105208 */
    // public static REQ_PET_SKILL_UP:number = 105108;
    // /**请求宠物繁衍 msgId=105109		-----返回成功消息msgId=105209 */
    // public static REQ_PET_MATING:number = 105109;
    // /**请求宠物进化 msgId=105110		-----返回成功消息msgId=105211 */
    // public static REQ_PET_EVOLVE:number = 105110;
    // /**请求宠物孵化 msgId=105111		-----返回成功消息msgId=105203 */
    // public static REQ_PET_HATCH:number = 105111;
    // /**请求宠物繁衍登记 msgId=105112		-----返回成功消息msgId=105212 */
    // public static REQ_PET_REGISTER:number = 105112;
    // /**请求宠物申请繁衍 msgId=105113		-----返回成功消息msgId=105213 */
    // public static REQ_PET_REQ_MATING:number = 105113;
    // /**请求宠物繁衍所有信息 msgId=105114		-----返回成功消息msgId=105214 如果宠物本身有登记数据，但繁衍数据找不到（返回消息msgId=105212和msgId=105213更新客户端数据） */
    // public static REQ_PET_MATING_ALLINFO:number = 105114;
    // /**请求宠物繁衍查看请求列表 msgId=105115		-----返回成功消息msgId=105215 */
    // public static REQ_PET_SELECT_REQ_LIST:number = 105115;
    // /**请求宠物繁衍同意或拒绝 msgId=105116		-----返回成功消息msgId=105216，如果是同意，对方玩家如果在线，会收到msgId=105210消息 */
    // public static REQ_PET_MATING_CHOOSE:number = 105116;
    // /**请求宠物繁衍目标刷新 msgId=105117		-----返回成功消息msgId=105217 */
    // public static REQ_PET_MATING_TARGET_REFRESH:number = 105117;
    // /**请求宠物繁衍目标查看 msgId=105118		-----返回成功消息msgId=105218 */
    // public static REQ_PET_MATING_TARGET_LOOK:number = 105118;
    // /**请求宠物放生 msgId=105119		-----返回成功消息msgId=105218 */
    // public static REQ_PET_FREE:number = 105119;


    // // -------------------------------------返回消息-------------------------------------
    // /**返回宠物所有信息（登录成功主动返回）msgId=105201*/
    // public static RESP_PET_ALL_INFO:number = 105201;
    // // 返回宠物格子信息 msgId=105202
    // public static RESP_PET_GRID_INFO:number = 105202;
    // /**返回宠物初始创建（创建角色获得初始宠物） msgId=105203*/
    // public static RESP_PET_RANDOM_CREATE:number = 105203;
    // /**返回宠物等级和经验信息（此消息在宠物经验发生变化就会返回给客户端） msgId=105204 */
    // public static RES_PET_LV_EXP_INFO:number = 105204;
    // /**返回宠物技能等级和技能经验信息（此消息在宠物技能经验发生变化就会返回给客户端） msgId=105205 */
    // public static RES_PET_SKILL_LV_EXP_INFO:number = 105205;
    // /**返回宠物领悟技能 msgId=105206 */
    // public static RES_PET_STUDY_SKILL:number = 105206;
    // /**返回宠物重置技能 msgId=105207 */
    // public static RES_PET_RESET_SKILL:number = 105207;
    // /**返回宠物技能进阶 msgId=105208 */
    // public static RES_PET_SKILL_UP:number = 105208;

    // /**返回宠物交配 msgId=105209 */
    // public static RES_PET_MATINGT:number = 105209;
    // /**返回宠物增加繁衍次数 msgId=105210 */
    // public static RES_PET_ADD_MATING_COUNT:number = 105210;
    // /**返回宠物进化 msgId=105211 */
    // public static RES_PET_EVOLVE:number = 105211;
    // /**返回宠物繁衍登记 msgId=105212 */
    // public static RES_PET_REGISTER:number = 105212;
    // /**返回宠物申请繁衍 msgId=105213 */
    // public static RES_PET_REQ_MATING:number = 105213;
    // /**返回宠物繁衍所有信息 msgId=105214 */
    // public static RES_PET_MATING_ALLINFO:number = 105214;
    // /**返回宠物繁衍查看请求列表 msgId=105215 */
    // public static RES_PET_SELECT_REQ_LIST:number = 105215;
    // /**返回宠物繁衍同意或拒绝 msgId=105216 */
    // public static RES_PET_MATING_CHOOSE:number = 105216;
    // /**返回宠物繁衍目标刷新 msgId=105217 */
    // public static RES_PET_MATING_TARGET_REFRESH:number = 105217;
    // /**返回宠物放生 msgId=105218 */
    // public static RES_PET_FREE:number = 105218;
    

    // //********************* equipMessage
    // /**请求装备打造 msgId=109101		-----返回成功消息msgId=109201 */
    // public static REQ_EQUIP_MAKE:number = 109101;
    // /**请求装备分解 msgId=109106		-----返回成功消息msgId=109206 */
    // public static REQ_EQUIP_SPLIT:number = 109106
    // /**请求装备锁定或解锁 msgId=109104		-----返回成功消息msgId=109204 */
    // public static REQ_EQUIP_LOCK:number = 109104;
    // /**请求装备强化 msgId=109105		-----返回成功消息msgId=109205 */
    // public static REQ_EQUIP_ATT_ADD:number = 109105;
    // /**请求装备穿戴 msgId=109102		-----返回成功消息msgId=109202 */
    // public static REQ_EQUIP_LOADING:number = 109102;
    // /**请求装备卸载 msgId=109103		-----返回成功消息msgId=109203 */
    // public static REQ_EQUIP_UNLOADING:number = 109103;

    // // -------------------------------------返回消息-------------------------------------
    // /**返回装备打造 msgId=109201 */
    // public static RES_EQUIP_MAKE = 109201;
    // /**返回装备分解 msgId=109206 */
    // public static RES_EQUIP_SPLIT = 109206;
    // /**返回装备强化 msgId=109205 */
    // public static RES_EQUIP_ATT_ADD = 109205;
    // /**返回装备穿戴 msgId=109202 */
    // public static RES_EQUIP_LOADING = 109202;
    // /**返回装备卸载 msgId=109203 */
    // public static RES_EQUIP_UNLOADING = 109203;
    // /**返回装备锁定或解锁 msgId=109204 */
    // public static RES_EQUIP_LOCK = 109204;

    // //********************* mapMessage
    // /**请求地图普通战斗（客户端一场战斗结束之后发送此消息，再进行倒计时和本地假战斗） msgId=106101		-----返回消息msgId=106201 */
    // public static REQ_MAP_NORMAL_FIGHT:number = 106101;
    // /**请求地图关卡快速战斗 msgId=106104		-----返回消息msgId=106202 */
    // public static REQ_MAP_SPEED_FIGHT:number = 106104;
    // /**请求地图关卡扫荡战斗 msgId=106105		-----返回消息msgId=106202 */
    // public static REQ_MAP_SWEEP_FIGHT:number = 106105;
    // /**请求地图关卡购买扫荡 msgId=106106		-----返回消息 返回成功消息，code=10002 */
    // public static REQ_MAP_BUY_SWEEP:number = 106106;
    // /**请求关卡假战斗结束领取奖励 msgId=106109		-----返回消息 返回成功消息，code=106203 */
    // public static REQ_MAP_NORMAL_FIGHT_END:number = 106109;
    // /**请求告诉服务器战斗播放结束（仅仅应用于所有真战斗） msgId=106102		-----返回消息msgId=106203*/
    // public static REQ_TRUE_FIGHT_END:number = 106102;
    // /**请求地图关卡boss战斗 msgId=106103		-----返回消息msgId=106204 */
    // public static REQ_MAP_SCENE_FIGHT:number = 106103;
    // /**请求切换地图关卡 msgId=106108		-----返回消息 副本id和关卡id 属性变化消息 */
    // public static REQ_MAP_CHANGE_SCENE:number = 106108;


    // // -------------------------------------返回消息-------------------------------------
    // /**返回离线和扫荡收益信息 msgId=106202*/
    // public static RES_OFF_LINE_AWARD_INFO:number = 106202;
    // /**返回战斗播放结束发放奖励（应用于所有战斗） msgId=106203*/
    // public static RES_FIGHT_END:number = 106203;

    // //********************* packMessage
    // /**使用道具消息  msgId=104101 返回操作成功消息  msgId=102202 code=10001（暂定，根据实际使用效果再做）*/
    // public static REQ_USE:number = 104101;

    // // -------------------------------------返回消息-------------------------------------
    // /**返回背包单个道具变化信息  msgId=104202 */
    // public static RES_PROP_INFO:number = 104202;
    // /**返回背包所有信息（登录成功主动返回）  msgId=104201(有可能为空列表)*/
    // public static RES_PACK_ALL_INFO:number = 104201;
    // /**返回背包单个装备变化信息 msgId=104203 */
    // public static RES_EQUIP_INFO:number = 104203;

    // //*********************** fightMessage
    // /**请求打开邮件设置已读 msgId=111101 无返回消息 客户端打开无奖励邮件，自行设置已读状态 */
    // public static REQ_OPEN_MAIL:number = 111101;
    // /**请求领取邮件奖励 msgId=111102		-----返回消息  msgId=111202 */
    // public static REQ_MAIL_AWARD:number = 111102;
    // /**请求删除邮件 msgId=111103		-----返回消息  msgId=111203 */
    // public static REQ_MAIL_DELETE:number = 111103;
    // // -------------------------------------返回消息-------------------------------------
    // /**返回邮件信息 msgId=111201（登陆主动返回 或者 发生变化返回） */
    // public static RES_MAIL_INFO:number = 111201;
    // /**返回邮件已领取成功 msgId=111202 */
    // public static RES_MAIL_AWARD:number = 111202;
    // /**返回删除邮件成功 msgId=111203 */
    // public static RES_MAIL_DELETE:number = 111203;

    // //*********************** fightMessage
    // // -------------------------------------返回消息-------------------------------------
    // /**返回一场战斗日志 msgId=108201*/
    // public static RES_TRUE_FIGHT_LOG_INFO:number = 108201;

    // //*********************** friendMessage
    // /**请求好友推荐 msgId=112101		-----返回成功消息msgId=112201 */
    // public static REQ_FRIEND_PUSH:number = 112101;
    // /**请求好友搜索 msgId=112102		-----返回成功消息msgId=112202 */
    // public static REQ_FRIEND_SEARCH:number = 112102;
    // /**请求好友申请 msgId=112103		-----返回成功消息msgId=112203 */
    // public static REQ_FRIEND_APPLY:number = 112103;
    // /**请求好友操作 msgId=112104		-----返回成功消息msgId=112204 */
    // public static REQ_FRIEND_OPERATION:number = 112104;
    // /**请求好友详细信息 msgId=112105		-----返回成功消息msgId=112205 */
    // public static REQ_FRIEND_MORE_INFO:number = 112105;
    // /**请求好友送礼 msgId=112106		-----返回成功消息msgId=112206 */
    // public static REQ_FRIEND_GIFT:number = 112106
    // /**请求好友所有信息 msgId=112107		-----返回成功消息msgId=112207 */
    // public static REQ_FRIEND_All_Info:number = 112107;
    // /**请求好友切磋 msgId=112108		-----返回成功消息msgId=108201 */
    // public static REQ_FRIEND_FIGHT:number = 112108;

    // // -------------------------------------返回消息-------------------------------------
    // /**返回好友推荐 msgId=112201 */
    // public static RES_FRIEND_PUSH:number = 112201;
    // /**返回好友搜索 msgId=112202 */
    // public static RES_FRIEND_SEARCH:number = 112202;
    // /**返回好友申请 msgId=112203 */
    // public static RES_FRIEND_APPLY:number = 112203;
    // /**返回好友操作 msgId=112204 */
    // public static RES_FRIEND_OPERATION:number = 112204;
    // /**返回好友详细信息 msgId=112205 */
    // public static RES_FRIEND_MORE_INFO:number = 112205;
    // /**返回好友送礼 msgId=112206 */
    // public static RES_FRIEND_GIFT:number = 112206;
    // /**返回好友所有信息 msgId=112207 */
    // public static RES_FRIEND_ALL_INFO:number = 112207;    

}