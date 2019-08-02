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
    
    /**
     * 两点间距离
     */
    public  static getDistance(sp1,sp2):number
    {
        return Math.sqrt(Math.pow(Math.abs(sp1.x-sp2.x),2)+Math.pow(Math.abs(sp1.y-sp2.y),2));
    }

}
