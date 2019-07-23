/**
 * 小工具
 */
export default class Tool{

    constructor(){

    }

    /**
     * 屏幕水平中心 横坐标
     */
    public static getCenterX() : any
    {
        return 750/(Laya.Browser.clientHeight/Laya.Browser.clientWidth)/2;//屏幕宽度
    }
}
