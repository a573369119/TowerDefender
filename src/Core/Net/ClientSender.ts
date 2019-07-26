import WebSocketManager from "./WebSocketManager";
import { Protocol } from "../Const/GameConfig";

/*
* 客户端发送器
*/
export default class ClientSender{
    
    constructor(){
        
    }
    
    /**
    * 用户登录 101103
    * @param userName 
    * @param userPass 
    */
    public static reqUserLogin(userName:string,userKey:string):void
    {
        var ReqUserLogin:any = WebSocketManager.ins.defineProtoClass("ReqUserLogin");
        var message:any = {};
        message.userName = userName;
        message.userKey = userKey;
        var buffer = ReqUserLogin.encode(message).finish();
        WebSocketManager.ins.sendMsg(Protocol.REQ_USER_LOGIN,buffer);
    }
    
            
    /**
     * 用户注册 101104
     * @param userName 
    * @param userPass 
    * @param userNickName
    */
    public static reqUserRegister(userName:string,userKey:string,userNickName:string):void
    {
        var ReqUserRegister:any = WebSocketManager.ins.defineProtoClass("ReqUserRegister");
        var message:any = {};
        var userData:any = {};
        message.userName = userName;
        message.userKey = userKey;
        userData.nickName = userNickName;
        userData.lv = 1;
        message.userData = userData;
        var buffer = ReqUserRegister.encode(message).finish();
        WebSocketManager.ins.sendMsg(Protocol.REQ_USER_REGISTER,buffer);
    }

    /**
     * 请求匹配对局 102101
     * @param userId 
    * @param matchId 
    */
   public static reqMatch(userId:number,matchId:number):void
   {
       var ReqMatch:any = WebSocketManager.ins.defineProtoClass("ReqMatch");
       var message:any = {};
       message.userId = userId;
       message.matchId = matchId;
       var buffer = ReqMatch.encode(message).finish();
       WebSocketManager.ins.sendMsg(Protocol.REQ_MATCH,buffer);
   }

   /**
     * 请求 对局接受 返回102202
     * @param userId 
    * @param isAccepte 
    */
   public static reqMatchAccept(userId:number,isAccepte:number):void
   {
       var ReqMatchAccept:any = WebSocketManager.ins.defineProtoClass("ReqMatchAccept");
       var message:any = {};
       message.userId = userId;
       message.isAccepte = isAccepte;
       var buffer = ReqMatchAccept.encode(message).finish();
       WebSocketManager.ins.sendMsg(Protocol.REQ_MATCH_ACCEPT,buffer);
   }
    
    /***消息发送*/

    /**********************************webSocket */
    /**发送GM密令 */
//     public static reqGmMsg(gm:string):void
//     {
//         var ReqGMComm:any = WebSocketManager.ins.defineProtoClass("ReqGMComm");
//         var message:any = {};
//         message.comm = gm;
//         var buffer = ReqGMComm.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_GM_COM,buffer);
//     }

//     /**心跳包 */
//     public static servHeartReq():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_SERV_HERT);
//     }
//     /**
//      * 用户注册
//      */
//     public static registerReq(userName:string,userPass:string):void
//     {
//         var ReqRegisterUser:any = WebSocketManager.ins.defineProtoClass("ReqRegisterUser");
//         var message:any = {};
//         message.userName = userName;
//         message.userPass = userPass;
//         var buffer = ReqRegisterUser.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_USER_REGISTER,buffer);
//     }
//     /**
//      * 登录服务器
//      * @param token 
//      * @param servId 
//      */
//     public static loginServReq(servId:number):void
//     {
//         var ReqLogin:any = WebSocketManager.ins.defineProtoClass("ReqLogin");
//         var message:any = {};
//         message.code = GameDataManager.ins.loginAuthentication;
//         message.serverId = servId;
//         message.agentId = 1;
//         message.clientId = 1;
//         var buffer = ReqLogin.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_SERV_LOGIN,buffer);
//     }
//     /**
//      * 创建角色
//      * @param sex 
//      * @param playerName 
//      */
//     public static createPlayerReq(sex:number,playerName:string):void
//     {
//         var ReqCreatePlayer:any = WebSocketManager.ins.defineProtoClass("ReqCreatePlayer");
//         var message:any = {};
//         message.gender = sex;
//         message.playerName = playerName;
//         var buffer = ReqCreatePlayer.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_CREATE_PLAYER,buffer); 
//     }
//     /**请求所有技能信息 */
//     public static reqAllSkillInfo():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_ALL_SKILL_INFO);
//     }
//     /**请求出战技能信息 */
//     public static reqFightSkillList():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FIGHT_SKILL_LIST);   
//     }
//     /**请求升级技能 */
//     public static reqUpSkill(skillUpLvVos:Array<SkillUpLvVo>):void
//     {
//         var ReqUpSkill:any = WebSocketManager.ins.defineProtoClass("ReqUpSkill");
//         var message:any = {};
//         message.skillList = [];
//         var info:any;
//         for(var i = 0; i < skillUpLvVos.length;i++)
//         {
//             info = {};
//             info.skillId = skillUpLvVos[i].skillId;
//             info.toSkillId = skillUpLvVos[i].toSkillId;
//             message.skillList.push(info);
//         }
//         var buffer = ReqUpSkill.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_UP_SKILL,buffer); 
//     }
//     /**请求重置技能 */
//     public static reqResetSkill():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_RESET_SKILL);   
//     }
//     /**请求使用道具 */
//     public static reqUse(propId:Long,num:number,args?:string):void
//     {
//         var ReqUse:any = WebSocketManager.ins.defineProtoClass("ReqUse");
//         var message:any = {};
//         message.propId = propId;
//         message.num = num;
//         if(args)
//             message.args = args;
//         var buffer = ReqUse.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_USE,buffer);  
//     }
    
//     /**请求宠物合成 */
//     public static reqPetCompound(propId:Long)
//     {
//         var ReqPetCompound:any = WebSocketManager.ins.defineProtoClass("ReqPetCompound");
//         var message:any = {};
//         message.propId = propId;
//         var buffer = ReqPetCompound.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_COMPOUND,buffer); 
//     }

//     /**请求喂宠物吃饭*/
//     public static reqPetFeed(petId:Long,propList:Array<PropVo>):void
//     {
//         var ReqPetFeed:any = WebSocketManager.ins.defineProtoClass("ReqPetFeed");
//         var message:any = {};
//         message.petId = petId;
//         message.propList = propList;
//         var buffer = ReqPetFeed.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_FEED,buffer); 
//     }


//     /**请求改变格子技能 */
//     public static reqAlterGridSkill(type:number,skillUpGrid:SkillUpGridVo):void
//     {
//         var ReqAlterGridSkill:any = WebSocketManager.ins.defineProtoClass("ReqAlterGridSkill");
//         var message:any = {};
//         message.type = type;        
//         var vo:any = {};
//         vo.gridId = skillUpGrid.gridId;
//         vo.skillId = skillUpGrid.skillId;
//         message.grid = vo;        
//         var buffer = ReqAlterGridSkill.encode(message).finish();        
//         WebSocketManager.ins.sendMsg(Protocol.REQ_ALTER_GRID_SKILL,buffer);   
//     }
//     /**请求改变宠物阵型格子 */
//     public static reqPetAlterGrid(type:number,gridList:Array<LineupGridVo>):void
//     {
//         var ReqPetAlterGrid:any = WebSocketManager.ins.defineProtoClass("ReqPetAlterGrid");
//         var message:any = {};
//         message.type = type;
//         message.gridList = [];
//         var info:any;
//         for(var i = 0;i < gridList.length;i++)
//         {
//             info = {};
//             info.gridId = gridList[i].gridId;
//             info.petId = gridList[i].heroId;
//             message.gridList.push(info);
//         }
//         var buffer = ReqPetAlterGrid.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_ALTER_GRID,buffer);   
//     }
//     /**
//      * 请求扭蛋 msgId=102101
//      * @param moneyType // 扭蛋类型 0=金币抽 1=钻石抽
//      * @param numType 次数类型 0=免费单抽 1=单抽 2=十连抽
//      */
//     public static reqGacha(moneyType:number,numType:number):void
//     {
//         var ReqGacha:any = WebSocketManager.ins.defineProtoClass("ReqGacha");
//         var message:any = {};
//         message.type = moneyType;
//         message.numType = numType;
//         var buffer = ReqGacha.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_GACHA,buffer); 
//     }

//      /**请求地图关卡快速战斗 */
//      public static reqMapSpeedFight():void
//      {
//          WebSocketManager.ins.sendMsg(Protocol.REQ_MAP_SPEED_FIGHT);
//      }

//      /**请求地图关卡购买扫荡 */
//      public static reqMapBuySweep():void
//      {
//          WebSocketManager.ins.sendMsg(Protocol.REQ_MAP_BUY_SWEEP);
//      }   

//      /**请求地图关卡扫荡  */
//      public static reqMapSweepFight(sceneId:number):void
//      {
//          var  ReqMapSweepFight:any = WebSocketManager.ins.defineProtoClass("ReqMapSweepFight");
//          var message:any = {};
//          message.sceneId = sceneId;
//          var buffer = ReqMapSweepFight.encode(message).finish();
//          WebSocketManager.ins.sendMsg(Protocol.REQ_MAP_SWEEP_FIGHT,buffer);
//      }

//     /**随机创建一条龙 */
//     public static reqPetRandomCreate():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_RANDOM_CREATE);
//     }
//     /**请求地图普通战斗（客户端一场战斗结束之后发送此消息，再进行倒计时和本地假战斗） msgId=106101		-----返回消息msgId=106201 */
//     public static reqMapNormalFight():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAP_NORMAL_FIGHT);
//     }
//     /**请求关卡假战斗结束领取奖励 msgId=106109		-----返回消息 返回成功消息，code=106203 */
//     public static reqMapNormalFightEnd():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAP_NORMAL_FIGHT_END);
//     }
//     /**请求地图关卡boss战斗 msgId=106103		-----返回消息msgId=106204 */
//     public static reqMapSceneFight():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAP_SCENE_FIGHT);
//     }
//     /**请求告诉服务器战斗播放结束（仅仅应用于所有真战斗） msgId=106102		-----返回消息msgId=106203 */
//     public static reqTureFightEnd():void
//     {
//         WebSocketManager.ins.sendMsg(Protocol.REQ_TRUE_FIGHT_END);
//     }
//     /**
//      * 请求切换地图关卡 msgId=106108		-----返回消息 副本id和关卡id 属性变化消息
//      * @param sceneId 
//      */
//     public static reqMapChangeScene(sceneId:number):void
//     {
//         var ReqMapChangeScene:any = WebSocketManager.ins.defineProtoClass("ReqMapChangeScene");
//         var message:any = {};
//         message.sceneId = sceneId;
//         var buffer = ReqMapChangeScene.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAP_CHANGE_SCENE,buffer);
//     }
//     /**
//      * 请求宠物交配 msgId=105109		-----返回成功消息msgId=105209
//      * @param petId1 
//      * @param petId2 
//      */
//     public static reqPetMating(petId1:Long,petId2:Long):void
//     {
//         var ReqPetMating:any = WebSocketManager.ins.defineProtoClass("ReqPetMating");
//         var message:any = {};
//         message.petId1 = petId1;
//         message.petId2 = petId2;
//         var buffer = ReqPetMating.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_MATING,buffer);
//     }
//     /**
//      * 请求宠物进化 msgId=105110		-----返回成功消息msgId=105211
//      * @param petId1 进化宠物唯一id
//      * @param bePetIdList 消耗宠物id列表
//      * @param propId 消耗道具唯一id
//      * @param propNum 消耗道具数量
//      */
//     public static reqPetEvolve(petId:Long,bePetIdList:Array<Long>,propIdList:Array<Long>):void
//     {
//         var ReqPetEvolve:any = WebSocketManager.ins.defineProtoClass("ReqPetEvolve");
//         var message:any = {};
//         message.petId = petId;
//         if(bePetIdList.length > 0)
//             message.bePetIdList = bePetIdList;
//         if(propIdList.length > 0)
//             message.propIdList = propIdList;
//         var buffer = ReqPetEvolve.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_EVOLVE,buffer);
//     }
//     /**
//      * 请求宠物孵化 msgId=105111		-----返回成功消息msgId=105203
//      * @param eggId 宠物蛋唯一id
//      */
//     public static reqPetHatch(eggId:Long):void
//     {
//         var ReqPetHatch:any = WebSocketManager.ins.defineProtoClass("ReqPetHatch");
//         var message:any = {};
//         message.eggId = eggId;
//         var buffer = ReqPetHatch.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_HATCH,buffer);
//     }
//     /**
//      * 请求宠物繁衍登记 msgId=105112		-----返回成功消息msgId=105212
//      * @param eggId 宠物唯一id
//      * @param qualityId 需要品质条件id(0表示不限制)
//      */
//     public static reqPetRegister(petId:Long,qualityId:number):void
//     {
//         var ReqPetRegister:any = WebSocketManager.ins.defineProtoClass("ReqPetRegister");
//         var message:any = {};
//         message.petId = petId;
//         message.qualityId = qualityId;
//         var buffer = ReqPetRegister.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_REGISTER,buffer);
//     }
//     /**
//      * 请求宠物申请繁衍 msgId=105113		-----返回成功消息msgId=105213
//      * @param petId 请求方宠物唯一id
//      * @param toPetId 接收方宠物唯一id
//      */
//     public static reqPetReqMating(petId:Long,toPetId:Long):void
//     {
//         var ReqPetReqMating:any = WebSocketManager.ins.defineProtoClass("ReqPetReqMating");
//         var message:any = {};
//         message.petId = petId;
//         message.toPetId = toPetId;
//         var buffer = ReqPetReqMating.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_REQ_MATING,buffer);
//     }
//     /**
//      * 请求宠物繁衍所有信息 msgId=105114		-----返回成功消息msgId=105214
//      * @param petType  1=功，2=防，3=速，4=血（0=表示全部）
//      * @param configId 宠物配置id（0=表示全部）
//      * @param gender  宠物性别（0=表示全部）
//      * @param qualityIdList 宠物品质id（0=表示全部）
//      */
//     public static reqPetMatingAllInfo(petType:number,configId:number,gender:number,qualityIdList:Array<number>):void
//     {
//         var ReqPetMatingAllInfo:any = WebSocketManager.ins.defineProtoClass("ReqPetMatingAllInfo");
//         var message:any = {};
//         message.petType = petType;
//         message.configId = configId;
//         message.gender = gender;
//         if(qualityIdList.length > 0)
//             message.qualityIdList = qualityIdList;
//         var buffer = ReqPetMatingAllInfo.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_MATING_ALLINFO,buffer);
//     }
//     /**
//      * 请求宠物繁衍查看请求列表 msgId=105115		-----返回成功消息msgId=105215
//      * @param petId 宠物唯一id
//      */
//     public static reqPetSelectReqList(petId:Long):void
//     {
//         var ReqPetSelectReqList:any = WebSocketManager.ins.defineProtoClass("ReqPetSelectReqList");
//         var message:any = {};
//         message.petId = petId;
//         var buffer = ReqPetSelectReqList.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_SELECT_REQ_LIST,buffer);
//     }
//     /**
//      * 请求宠物繁衍同意或拒绝 msgId=105116		-----返回成功消息msgId=105216，如果是同意，对方玩家如果在线，会收到msgId=105210消息
//      * @param petId 我方宠物唯一id
//      * @param toPetId 对方宠物唯一id
//      * @param isConsent 是否同意 true=同意
//      */
//     public static reqPetMatingChoose(petId:Long,toPetId:Long,isConsent:boolean):void
//     {
//         var ReqPetMatingChoose:any = WebSocketManager.ins.defineProtoClass("ReqPetMatingChoose");
//         var message:any = {};
//         message.petId = petId;
//         message.toPetId = toPetId;
//         message.isConsent = isConsent;
//         var buffer = ReqPetMatingChoose.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_MATING_CHOOSE,buffer);
//     }
//     /**
//      * 请求宠物繁衍目标刷新 msgId=105117		-----返回成功消息msgId=105217
//      * @param petType 1=功，2=防，3=速，4=血（0=表示全部）
//      * @param configId 宠物配置id（0=表示全部）
//      * @param gender 宠物性别（0=表示全部）
//      * @param qualityIdList 宠物品质id（0=表示全部）
//      */
//     public static reqPetMatingTargetRefresh(petType:number,configId:number,gender:number,qualityIdList:Array<number>):void
//     {
//         var ReqPetMatingTargetRefresh:any = WebSocketManager.ins.defineProtoClass("ReqPetMatingTargetRefresh");
//         var message:any = {};
//         message.petType = petType;
//         message.configId = configId;
//         message.gender = gender;
//         if(qualityIdList.length > 0)
//             message.qualityIdList = qualityIdList;
//         var buffer = ReqPetMatingTargetRefresh.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_MATING_TARGET_REFRESH,buffer);
//     }
//     /**
//      * 请求宠物繁衍目标查看 msgId=105118		-----返回成功消息msgId=105218
//      * @param toPlayerId 被查看宠物的主人的id
//      * @param toPetId 被查看宠物唯一id
//      */
//     public static reqPetMatingTargetLook(toPlayerId:Long,toPetId:Long):void
//     {
//         var ReqPetMatingTargetLook:any = WebSocketManager.ins.defineProtoClass("ReqPetMatingTargetLook");
//         var message:any = {};
//         message.toPlayerId = toPlayerId;
//         message.toPetId = toPetId;
//         var buffer = ReqPetMatingTargetLook.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_MATING_CHOOSE,buffer);
//     }


//     /**请求装备打造 msgId=10901		-----返回成功消息msgId=109201 */
//     public static reqEquipMake(propId:Long):void
//     {
//         var ReqEquipMake:any = WebSocketManager.ins.defineProtoClass("ReqEquipMake");
//         var message:any = {};
//         message.propId = propId;        
//         var buffer = ReqEquipMake.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_EQUIP_MAKE,buffer);
//     }

//     /**请求装备分解 msgId=109106		-----返回成功消息msgId=109206 */
//     public static reqEquipSplit(equipId:Array<Long>):void
//     {
//         var ReqEquipSplit:any = WebSocketManager.ins.defineProtoClass("ReqEquipSplit");
//         var message:any = {};
//         message.equipId = equipId;        
//         var buffer = ReqEquipSplit.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_EQUIP_SPLIT,buffer); 
//     }

//     /**请求装备锁定或解锁 msgId=109104		-----返回成功消息msgId=109204 */
//     public static reqEquipLock(petId:Long,equipId:Long):void
//     {
//         var ReqEquipLock:any = WebSocketManager.ins.defineProtoClass("ReqEquipLock");
//         var message:any = {};
//         message.petId = petId;
//         message.equipId = equipId;        
//         var buffer = ReqEquipLock.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_EQUIP_LOCK,buffer); 
//     }

//     /**请求装备强化 msgId=109105		-----返回成功消息msgId=109205 */
//     public static reqEquipAttAdd(petId:Long,equipId:Long,luckNum:number):void
//     {
//         var ReqEquipLock:any = WebSocketManager.ins.defineProtoClass("ReqEquipLock");
//         var message:any = {};
//         message.petId = petId;
//         message.equipId = equipId; 
//         message.luckNum = luckNum;       
//         var buffer = ReqEquipLock.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_EQUIP_ATT_ADD,buffer); 
//     }
// 	/**请求装备穿戴 msgId=109102		-----返回成功消息msgId=109202 */
//     public static reqEquipLoading(petId:Long,equipId:Long)
//     {
//         var ReqEquipLoading:any = WebSocketManager.ins.defineProtoClass("ReqEquipLoading");
//         var message:any = {};
//         message.petId = petId;
//         message.equipId = equipId;               
//         var buffer = ReqEquipLoading.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_EQUIP_LOADING,buffer); 
//     }
//     /**请求装备卸载 msgId=109103		-----返回成功消息msgId=109203 */
//     public static reqEquipUnLoading(petId:Long,equipId:Long)
//     {
//         var ReqEquipUnLoading:any = WebSocketManager.ins.defineProtoClass("ReqEquipUnLoading");
//         var message:any = {};
//         message.petId = petId;
//         message.equipId = equipId;               
//         var buffer = ReqEquipUnLoading.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_EQUIP_UNLOADING,buffer); 
//     }
// 	/**请求宠物领悟技能 msgId=105106		-----返回成功消息msgId=105206 */
//     public static reqPetStudySkill(petId:Long):void
//     {
//         var ReqPetStudySkill:any = WebSocketManager.ins.defineProtoClass("ReqPetStudySkill");
//         var message:any = {};
//         message.petId = petId;
//         var buffer = ReqPetStudySkill.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_STUDY_SKILL,buffer); 
//     }
//     /**请求宠物重置技能 msgId=105107		-----返回成功消息msgId=105207*/
//     public static reqPetResetSkill(petId:Long,skillIdList:Array<number>):void
//     {
//         var ReqPetResetSkill:any = WebSocketManager.ins.defineProtoClass("ReqPetResetSkill");
//         var message:any = {};  
//         message.petId = petId;
//         if(skillIdList.length > 0)
//             message.skillIdList = skillIdList;
//         var buffer = ReqPetResetSkill.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_RESET_SKILL,buffer); 
//     }
//     /**请求宠物技能进阶 msgId=105108		-----返回成功消息msgId=105208 */
//     public static ReqPetSkillUp(petId:Long,skillId:number):void
//     {
//         var ReqPetSkillUp:any = WebSocketManager.ins.defineProtoClass("ReqPetSkillUp");
//         var message:any = {};
//         message.petId = petId;
//         message.skillId = skillId;
//         var buffer = ReqPetSkillUp.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_SKILL_UP,buffer); 
//     }

// /**请求宠物放生 msgId=105119		-----返回成功消息msgId=105218 */
//     public static reqPetFree(petId:Long):void
//     {
//         var ResPetFree:any = WebSocketManager.ins.defineProtoClass("ResPetFree");
//         var message:any = {};
//         message.petId = petId;
//         var buffer = ResPetFree.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_PET_FREE,buffer); 
//     }
// /**请求领取邮件奖励 msgId=111102		-----返回成功消息msgId=111202 */
//     public static ReqMailAward(mailId:Long):void
//     {
//         var ReqMailAward:any = WebSocketManager.ins.defineProtoClass("ReqMailAward");
//         var message:any = {};
//         message.mailId = mailId;
//         var buffer = ReqMailAward.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAIL_AWARD,buffer); 
//     }
//       /**请求删除邮件 msgId=111103		-----返回成功消息msgId=111203 */
//     public static ReqMailDelete(mailId:Long):void
//     {
//         var ReqMailDelete:any = WebSocketManager.ins.defineProtoClass("ReqMailDelete");
//         var message:any = {};
//         message.mailId = mailId;
//         var buffer = ReqMailDelete.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAIL_DELETE,buffer); 
//     }

//     /**请求打开邮件设置已读 msgId=111101 无返回消息 客户端打开无奖励邮件，自行设置已读状态 */
//     public static reqOpenMail(mailId:Long):void
//     {
//         var ReqOpenMail:any = WebSocketManager.ins.defineProtoClass("ReqOpenMail");
//         var message:any = {};
//         message.mailId = mailId;
//         var buffer = ReqOpenMail.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_OPEN_MAIL,buffer); 
//     }
//     /**请求领取邮件奖励 msgId=111102		-----返回消息  msgId=111202 */
//     public static ReqMailAward(mailId:Long):void
//     {
//         var ReqMailAward:any = WebSocketManager.ins.defineProtoClass("ReqMailAward");
//         var message:any = {};
//         message.mailId = mailId;
//         var buffer = ReqMailAward.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAIL_AWARD,buffer); 
//     }
//     /**请求删除邮件 msgId=111103		-----返回消息  msgId=111203 */
//     public static ReqMailDelete(mailId:Long):void
//     {
//         var ReqMailDelete:any = WebSocketManager.ins.defineProtoClass("ReqMailDelete");
//         var message:any = {};
//         message.mailId = mailId;
//         var buffer = ReqMailDelete.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_MAIL_DELETE,buffer); 
//     }
//     /**请求好友推荐 msgId=112101		-----返回成功消息msgId=112201 */
//     public static ReqFriendPush():void
//     {                        
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_PUSH); 
//     }
//     /**请求好友搜索 msgId=112102		-----返回成功消息msgId=112202 */
//     public static ReqFriendSearch(toPlayerId:Long):void
//     {
//         var ReqFriendSearch:any = WebSocketManager.ins.defineProtoClass("ReqFriendSearch");
//         var message:any = {};
//         message.toPlayerId = toPlayerId;
//         var buffer = ReqFriendSearch.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_SEARCH,buffer); 
//     }
//     /**请求好友申请 msgId=112103		-----返回成功消息msgId=112203 */
//     public static ReqFriendApply(toPlayerId:Long):void
//     {
//         var ReqFriendApply:any = WebSocketManager.ins.defineProtoClass("ReqFriendApply");
//         var message:any = {};
//         message.toPlayerId = toPlayerId;
//         var buffer = ReqFriendApply.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_APPLY,buffer); 
//     }
//     /**请求好友操作 msgId=112104		-----返回成功消息msgId=112204 */
//     public static ReqFriendOperation(type:number,toPlayerId:Long):void
//     {
//         var ReqFriendOperation:any = WebSocketManager.ins.defineProtoClass("ReqFriendOperation");
//         var message:any = {};
//         message.type = type;
//         message.toPlayerId = toPlayerId;
//         var buffer = ReqFriendOperation.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_OPERATION,buffer); 
//     }
//     /**请求好友详细信息 msgId=112105		-----返回成功消息msgId=112205 */
//     public static ReqFriendMoreInfo(toPlayerId:Long):void
//     {
//         var ReqFriendMoreInfo:any = WebSocketManager.ins.defineProtoClass("ReqFriendMoreInfo");
//         var message:any = {};        
//         message.toPlayerId = toPlayerId;
//         var buffer = ReqFriendMoreInfo.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_MORE_INFO,buffer); 
//     }
//     /**请求好友送礼 msgId=112106		-----返回成功消息msgId=112206 */
//     public static ReqFriendGift(giftId:number,toPlayerId:Long):void
//     {
//         var ReqFriendGift:any = WebSocketManager.ins.defineProtoClass("ReqFriendGift");
//         var message:any = {};        
//         message.giftId = giftId;
//         message.toPlayerId = toPlayerId;
//         var buffer = ReqFriendGift.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_GIFT,buffer); 
//     }
//     /**请求好友所有信息 msgId=112107		-----返回成功消息msgId=112207 */
//     public static ReqFriendAllInfo():void
//     {                        
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_All_Info); 
//     }
//     /**请求好友切磋 msgId=112108		-----返回成功消息msgId=108201 */
//     public static ReqFriendFight(toPlayerId:Long):void
//     {
//         var ReqFriendFight:any = WebSocketManager.ins.defineProtoClass("ReqFriendFight");
//         var message:any = {};        
//         message.toPlayerId = toPlayerId;
//         var buffer = ReqFriendFight.encode(message).finish();
//         WebSocketManager.ins.sendMsg(Protocol.REQ_FRIEND_FIGHT,buffer); 
//     }








    /**登录请求 */
    // public static loginReq(account:string):void
    // {
    //     var LoginRequest:any = WebSocketManager.ins.defineProtoClass("LoginRequest");
    //     var message:any = {};
    //     message.name = account;
    //     message.token = GameDataManager.ins.loginToken;
    //     message.nickname = "xielong";
    //     var buffer = LoginRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.USER_LOGIN,Protocol.USER_LOGIN_CMD,buffer);
    // }
    // /**获取英雄信息 */
    // public static getHeroInfoReq(statusCode:number):void
    // {
    //     var HeroInfoRequest:any = WebSocketManager.ins.defineProtoClass("HeroInfoRequest");
    //     var message:any = {};
    //     message.statusCode = statusCode;
    //     var buffer = HeroInfoRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.HERO,Protocol.HERO_GET_INFOS,buffer);
    // }
    // /**英雄上、下、更新阵型 */
    // public static heroLinuepUpdateReq(lineupId:number,heroId:string,isUp:boolean):void
    // {
    //     if(!isUp && GameDataManager.ins.selfPlayerData.heroLineupDic.values.length <= 1)
    //     {
    //         TipsManager.ins.showFloatMsg("阵上英雄不得少于一个",30,"#ff0000",LayerManager.ins.getLayer(LayerManager.TIP_LAYER),GameConfig.STAGE_WIDTH/2,GameConfig.STAGE_HEIGHT/2,1,0,200);
    //         return;
    //     }
    //     var UpdateFormationRequest:any = WebSocketManager.ins.defineProtoClass("UpdateFormationRequest");
    //     var message:any = {};
    //     message.siteIdx = lineupId;
    //     message.heroId = heroId;
    //     message.flag = isUp;
    //     var buffer = UpdateFormationRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.HERO,Protocol.HERO_UPDATE_FORMATION,buffer);
    // }
    // /**请求关卡信息 */
    // public static gateGateInfoReq():void
    // {
    //     var GateInfoRequest = WebSocketManager.ins.defineProtoClass("GateInfoRequest");
    //     var message:any = {};
    //     message.statusCode = 1;
    //     var buffer = GateInfoRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.GATE,Protocol.GATE_INFO,buffer);
    // }
    // /**挑战关卡 */
    // public static ballteGateReq(gateKey:string):void
    // {
    //     var BattleGateRequest = WebSocketManager.ins.defineProtoClass("BattleGateRequest");
    //     var message:any = {};
    //     message.gateKey = gateKey;
    //     var buffer = BattleGateRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.GATE,Protocol.GATE_BATTLE,buffer);
    // }

    // /**请求扫荡关卡 */
    // public static scanGateReq(gateKey:string):void
    // {
    //     var ScanGateRequest = WebSocketManager.ins.defineProtoClass("ScanGateRequest");
    //     var message:any = {};
    //     message.gateKey = gateKey;
    //     var buffer = ScanGateRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.GATE,Protocol.GATE_SCAN,buffer);
    // }
    // /**请求关卡挂机奖励信息 */
    // public static gateHangupStateReq():void
    // {
    //     var HangupStateRequest = WebSocketManager.ins.defineProtoClass("HangupStateRequest");
    //     var message:any = {};
    //     message.statusCode = 1;
    //     var buffer = HangupStateRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.GATE,Protocol.GATE_HANDUP_STATE,buffer);
    //     // WebSocketManager.ins.sendMsg(Protocol.GATE,Protocol.GATE_HANDUP_STATE);
    // }
    // /**请求关卡挂机信息 */
    // public static gateSwitchHangReq(gateKey:string):void
    // {
    //     var SwitchHangGateRequest = WebSocketManager.ins.defineProtoClass("SwitchHangGateRequest");
    //     var message:any = {};
    //     message.gateKey = gateKey;
    //     var buffer = SwitchHangGateRequest.encode(message).finish();
    //     WebSocketManager.ins.sendMsg(Protocol.GATE,Protocol.GATE_SWITCH_HANG_GATE,buffer);
    //     // WebSocketManager.ins.sendMsg(Protocol.GATE,Protocol.GATE_HANDUP_STATE);
    // }
    


    // /**********************************Http */
    // /**测试登录 */
    // public static httpLoginReq(account:string,pwd:string,caller?:any,callBack?:Function):void
    // {
    //     var params:any = {};
    //     params.account = account;
    //     params.password = pwd;
    //     HttpManager.ins.send(HTTPRequestUrl.testLoginURL,HTTPReqType.GET,params,caller,callBack);
    // }
    // /**获取服务器列表 */
    // public static httpGameServerReq(caller?:any,callBack?:Function):void
    // {
    //     HttpManager.ins.send(HTTPRequestUrl.gameServerURL,HTTPReqType.GET,null,caller,callBack);
    // }
    // /**进入游戏 */
    // public static httpEnterGameReq(sid:number,caller?:any,callBack?:Function):void
    // {
    //     var params:any = {};
    //     params.sid = sid;
    //     HttpManager.ins.send(HTTPRequestUrl.enterGameURL,HTTPReqType.GET,params,caller,callBack);
    // }
}