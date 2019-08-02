import DefenderConfig from "../Data/Config/DefenderConfig";
import MonsterConfig from "../Data/Config/MosnterConfigr";

/**
 * 配置加载器
 */
export default class ConfigManager{
    public static ins : ConfigManager = new ConfigManager();
    /**
     * 防御塔总配置
     */
    public defenderConfig : any;
    /**
     * 怪物总配置
     */
    public monsterConfig : any;

    constructor(){

    }

    /**
     * 配置注册 
     * 
     * 1、写下json名字，对应的 配置类
     * 
     * 标识
     */
    public getClass(name,data) : any
    {
        switch(name){
            case "defender": return new DefenderConfig(data);
            case "monster": return new MonsterConfig(data);
        }
    }
    /**
     * Json配置获取
     * 
     * 写需要获取的配置文件
     */
    public loadConfig() : void
    {
        var arr=[
            {"defender":"outside/config/gameConfig/defender.json"},
            {"monster":"outside/config/gameConfig/monster.json"}
        ];
        this.loadObj(arr);
    }
    /**
     * 资源加载
     */
    private loadObj(arr) : void
    {
        let obj;
        let name;
        for(let i=0;i<arr.length;i++){
            obj = arr[i];
            name = Object.keys(obj)[0];
            this[name+"Config"] = Laya.loader.getRes(obj[name]);
        }
    }
    
    /**
     * 获取配置 @configNmae : Json文件名  @想获取什么怪物id
     */
    public getConfigById(configName:string,configId) : any
    {
        let configObj = this[configName + "Config"];
        let typeArr = [];
        for(let i=0;i<configObj.length;i++){
            let obj = configObj[i];
            if(obj[configName + "Id"] == configId){
                return this.getClass(configName,obj);
            }
        }
    }
    
    /**
     * 获取本配置文件含有的项数 @configNmae : Json文件名 
     */
    public getConfigLength(configName:string):number
    {
        let configObj = this[configName + "Config"];
        return configObj.length;
    }

    /**
     * 根据类型获取配置 1金2木3水4火5土
     */
    public getConfigByType(configName:string,typeNum) : any
    {
        let configObj = this[configName + "Config"];
        let typeArr = [];
        for(let i=0;i<configObj.length;i++){
            let obj = configObj[i];
            if(obj["type"] == typeNum){
                typeArr.push(this.getClass(configName,obj));
            }
        }
        return typeArr;
    }

}