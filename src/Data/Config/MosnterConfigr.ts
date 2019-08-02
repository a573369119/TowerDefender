import baseConfig from "./baseConfig";


/**
 * 怪物数据模型
 */
export default class MonsterConfig extends baseConfig{
    /**
     * 怪物id
     */
    public monsterId : number;
    /**
     * 怪物名字
     */
    public monsterName : string;
    /**
     * 攻击力
     */
    public power : number;
    /**
     * 移动速度
     */
    public speed : number;
    /**
     * 血量
     */
    public hp:number;
    /**
     * 价格
     */
    public price:number;

    /******************************即将开放*********************************** */
    /**
     * 防御力
     */
    //public def : number;

    /**
     * 怪物类型 1金2木3水4火5土
     */
    //public type : number;

    constructor(data){
        super(data);
    }
}