import GrassFactory from "../Game/GrassFactory";
import GameController from "../Game/GameController";
import Monster from "../Game/Monster";
import MessageManager from "../../Core/MessageManager";
import WelComeController from "./WelComeController";
import Grass from "../Game/Prefab/Grass";
export default class Player{
    /**用户Id */
    public userId:number;
    /**阵营 */
    public camp:string;
    /**名字 */
    public name:string;
    /**头像 */
    public icon:string;
    /**草坪组 */
    public fac:GrassFactory;
    /**草坪所属父类面板 */
    public group:Laya.Sprite;
    /**怪物出生点 */
    public enemy_MonsterBornGrass:Grass;
    /**当前选择放置的防御塔类型，默认选择1 */
    public defenderId:number;
    /**当前选择放置防御塔类型需要消耗的金币数 */
    public defenderCoin:number;
    /**金币 */
    public coin:number;
    constructor(name,userId,icon)
    {
        this.name=name
        this.icon=icon;
        this.userId=userId;
    }

    /*******************************己方玩家********************************************/
    /**己方玩家游戏场景信息初始化 */
    public ownGameInit():void
    {
        if(this.camp=="red")
        {
            this.group=GameController.Instance.red_group;
            GameController.Instance.blue_group.mouseEnabled=false;
        }
        else
        {
            this.group=GameController.Instance.blue_group;
            GameController.Instance.red_group.mouseEnabled=false;
        }
        this.group.mouseEnabled=false;
        this.fac=new GrassFactory(this.group);
        this.coin=500;
        GameController.Instance.text_coin.text=this.coin.toString();
        
    }

    /**敌方玩家初始化 */
    public enemyGameInit():void
    {
        if(this.camp=="red")
        {
            this.group=GameController.Instance.red_group;
        }
        else
        {
            this.group=GameController.Instance.blue_group;
        }
        this.fac=new GrassFactory(this.group);

    }

    /**为剩下的草坪注册新事件 */
    public restGrassAddEvent():void
    {
        for(let i=0;i<70;i++)
        {
            let grass=this.fac.grassArray[i];
                grass.sp.off(Laya.Event.CLICK,grass,grass.Event1_changeState);
                grass.sp.on(Laya.Event.CLICK,grass,grass.Event2_AddDefender);
                
        }
        for(let i=0;i<this.fac.mudArray.length;i++)
        {
            this.fac.mudArray[i].sp.off(Laya.Event.CLICK,this.fac.mudArray[i],this.fac.mudArray[i].Event2_AddDefender);
        }
    }

    /***************************************************************************/
   
}