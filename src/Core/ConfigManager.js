"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefenderConfig_1 = require("../Data/Config/DefenderConfig");
var MosnterConfigr_1 = require("../Data/Config/MosnterConfigr");
/**
 * 配置加载器
 */
var ConfigManager = /** @class */ (function () {
    function ConfigManager() {
    }
    /**
     * 配置注册
     *
     * 1、写下json名字，对应的 配置类
     *
     * 标识
     */
    ConfigManager.prototype.getClass = function (name, data) {
        switch (name) {
            case "defender": return new DefenderConfig_1.default(data);
            case "monster": return new MosnterConfigr_1.default(data);
        }
    };
    /**
     * Json配置获取
     *
     * 写需要获取的配置文件
     */
    ConfigManager.prototype.loadConfig = function () {
        var arr = [
            { "defender": "outside/config/gameConfig/defender.json" },
            { "monster": "outside/config/gameConfig/monster.json" }
        ];
        this.loadObj(arr);
    };
    /**
     * 资源加载
     */
    ConfigManager.prototype.loadObj = function (arr) {
        var obj;
        var name;
        for (var i = 0; i < arr.length; i++) {
            obj = arr[i];
            name = Object.keys(obj)[0];
            this[name + "Config"] = Laya.loader.getRes(obj[name]);
        }
    };
    /**
     * 获取配置 @configNmae : Json文件名  @想获取什么怪物id
     */
    ConfigManager.prototype.getConfigById = function (configName, configId) {
        var configObj = this[configName + "Config"];
        var typeArr = [];
        for (var i = 0; i < configObj.length; i++) {
            var obj = configObj[i];
            if (obj[configName + "Id"] == configId) {
                return this.getClass(configName, obj);
            }
        }
    };
    /**
     * 根据类型获取配置 1金2木3水4火5土
     */
    ConfigManager.prototype.getConfigByType = function (configName, typeNum) {
        var configObj = this[configName + "Config"];
        var typeArr = [];
        for (var i = 0; i < configObj.length; i++) {
            var obj = configObj[i];
            if (obj["type"] == typeNum) {
                typeArr.push(this.getClass(configName, obj));
            }
        }
        return typeArr;
    };
    ConfigManager.ins = new ConfigManager();
    return ConfigManager;
}());
exports.default = ConfigManager;
