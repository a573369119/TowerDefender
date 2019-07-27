import baseConfig from "./baseConfig";
import MapPos from "../Bean/MapPos";


/**
 * 防御塔数据模型
 */
export default class DefenderConfig extends baseConfig{
    /**
     * 防御塔id
     */
    public defenderId : number;
    /**
     * 防御塔名称
     */
    public defenderName : string;
    /**
     * 类型 1金2木3水4火5土
     */
    public type : number;
    /**
     * 防御塔攻击力
     */
    public power : number;
    /**
     * 攻击距离
     */
    public dic : number;
    /**
     * 攻击速度
     */
    public attackSpeed : number;

    constructor(data){
        super(data);
    }
}