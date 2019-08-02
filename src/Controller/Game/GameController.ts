import { ui } from "../../ui/layaMaxUI";
import GrassFactory from "./GrassFactory";
import MessageManager from "../../Core/MessageManager";
import WelComeController from "../WelCome/WelComeController";
import DefenderItemUI from "./Prefab/DefenderItemUI";
import Monster from "./Monster";
import ConfigManager from "../../Core/ConfigManager";
import MonsterItemUI from "./Prefab/MonsterItemUI";
export default class GameController extends ui.Game.GameUI{
    /**单例 */
    public static Instance:GameController;
    /**上次鼠标得位置 */
    private lastMousePosX:number;
    /**是否正在使用铲子 */
    private isUseShovel:boolean;
    /**计时器数 */
    private countDownNum:number;
    /**怪兽已开始移动 */
    public isMonsterMove:boolean;
    /**游戏回合数 */
    private round:number;
    /**怪兽出现计数器 */
    private monsterCount:number;
    /**菜单栏防御塔UI数组 */
    private defenderItemUIArray:Array<DefenderItemUI>;
    /**菜单栏怪兽UI数组 */
    private monsterItemUIArray:Array<MonsterItemUI>;
    /**怪兽标记数组 每次发送标记数组给对方，从而初始化怪兽*/
    private monsterSignArray:Array<number>;
    /**敌方怪兽数组 */
    public monsterArray:Array<Monster>;
    /**方向数组 */
    public dirArray:Array<Array<number>>;
    constructor(){
        super();
        
    }
    
    onEnable():void
    {
        GameController.Instance=this;
        WelComeController.ins.ownPlayer.ownGameInit();
        Laya.timer.frameLoop(1,this,this.mapMove);
    }

    /**地图移动 */
    private mapMove():void
    {
       this.game.x-=4;
       if(this.game.x<-1214)
       {
           this.game.x=-1214;
           Laya.timer.clear(this,this.mapMove);
           Laya.timer.frameOnce(60,this,this.resumePos);
       }
    } 

    /**回到玩家位置 */
    private resumePos():void
    {
        if(WelComeController.ins.ownPlayer.camp=="blue")
        {
           this.game.x=-1214;
        }
        else
        {
           this.game.x=0;
        }
        this.ownPlayerOpen();
        
    } 
     
    
    /*******************************************鼠标事件 **************************************/
    /**鼠标按下 */
    private onMouseDown():void
    {
        Laya.stage.on(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        if(!this.isUseShovel)
        {
            this.lastMousePosX=Laya.stage.mouseX;
        }
    }

    /**鼠标移动 */
    private onMouseMove():void
    {
        if(Laya.stage.mouseX<this.lastMousePosX)
        {
            this.game.x-=20;
            this.lastMousePosX=Laya.stage.mouseX;
        }
        else if(Laya.stage.mouseX>this.lastMousePosX)
        {
            this.game.x+=20;
            this.lastMousePosX=Laya.stage.mouseX;
        }
        if(this.game.x>=0)
        {
            this.game.x=0;
        }
        else if(this.game.x<=-1214)
        {
            this.game.x=-1214;
        }        
        
    }
    
    /**鼠标抬起 */
    private onMouseUp():void
    {
        Laya.stage.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
    }
    /***************************************************************************/
    /*******************************己方玩家********************************************/
    /**己方状态开始 */
    private ownPlayerOpen():void
    {
        MessageManager.ins.showFloatMsg("请先修建道路！");
        this.monsterArray=new Array<Monster>();
        this.dirArray=new Array<Array<number>>();
        this.monsterSignArray=new Array<number>();
        this.defenderItemUIArray=new Array<DefenderItemUI>();
        this.monsterItemUIArray=new Array<MonsterItemUI>();
        this.player_menuitem.visible=true;
        this.isUseShovel=false;
        this.isMonsterMove=false;
        this.countDownNum=30;
        this.round=1;
        this.menuAddDefenderUI();
        this.menuAddMonsterUI();
        WelComeController.ins.ownPlayer.defenderId=1;
        WelComeController.ins.ownPlayer.defenderCoin=this.defenderItemUIArray[0].data.price;
        this.addEvents();
        this.getEnemyMonsterPosNum();
    }

    /**事件绑定 */
    private addEvents() : void
    {
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this.shovelbg.on(Laya.Event.MOUSE_DOWN,this,this.onShovelDown);
        this.btn_build.on(Laya.Event.MOUSE_DOWN,this,this.clickBuild_checkCreateComplete);
        this.btn_buy.on(Laya.Event.MOUSE_DOWN,this,this.clickBuy_Monster);
    } 

    /**点击铲子框拾起铲子 */
    public onShovelDown():void
    {
        this.isUseShovel=!this.isUseShovel;
        this.shovel_off.visible=!this.shovel_off.visible;
        this.shovel_on.visible=!this.shovel_on.visible;
        WelComeController.ins.ownPlayer.group.mouseEnabled=this.isUseShovel; 
    }

    /**先由系统随机取0-70的数（每个玩家拥有70块草坪），发送请求给对方，在对方土地占领该土地 */
    private setRandomMonsterOccupy():void
    {
        let random=Math.ceil(Math.random()*70);                 //--网络
        //发送给敌方玩家这个位置标号
        //client.send(random);
        //发送后接收回调函数
        this.getEnemyMonsterPosNum();
        
    }

    /**获取敌方玩家的怪兽在我方草坪占的位置 */
    private getEnemyMonsterPosNum():void
    {
        //获得信息
        //let random=client.get(data)                           //--网络
        let random1=0,random2=1;
        WelComeController.ins.ownPlayer.monsterBornGrass=WelComeController.ins.ownPlayer.fac.grassArray[random1+random2*10];
        //随机取一个10号位草坪变为土块作为怪兽出生点
        WelComeController.ins.ownPlayer.monsterBornGrass.changeImg();
        WelComeController.ins.ownPlayer.monsterBornGrass.sp.off(Laya.Event.CLICK,WelComeController.ins.ownPlayer.monsterBornGrass,WelComeController.ins.ownPlayer.monsterBornGrass.Event1_changeState);
    }

    /**检查是否建好好路径 */
    private clickBuild_checkCreateComplete():void                  //--网络
    {
        if(WelComeController.ins.ownPlayer.fac.mudArray[WelComeController.ins.ownPlayer.fac.mudArray.length-1]==WelComeController.ins.ownPlayer.fac.grassArray[39])
        {
            //todo
            this.shovelbg.visible=false;
            this.btn_build.off(Laya.Event.MOUSE_DOWN,this,GameController.Instance.onShovelDown);
            this.btn_build.visible=false;
            this.btn_buy.visible=true;
            this.monster_uigroup.visible=true;
            WelComeController.ins.ownPlayer.group.mouseEnabled=false;
            MessageManager.ins.showFloatMsg("修建成功！");
            //发送修好路径的请求，等待对方确定修建好路径的请求，需等待时间
            //client.send();                                    //--需要回调函数
            
        }
        else
        {
            //否则就不能点击其他区域的草坪
            MessageManager.ins.showFloatMsg("请正确修建道路！");
        }
        
    }

    /**菜单栏添加可选择的怪兽 */                              //--需读取配置文件
    private menuAddMonsterUI():void
    {
        for(let i=0;i<ConfigManager.ins.getConfigLength("monster");i++)
        {
            let monsterItemUI=new MonsterItemUI(this.monster_uigroup,20+i*100,10,i+1);
            monsterItemUI.btn_buy.on(Laya.Event.CLICK,this,this.buy_MenuMonster,[i]);
            this.monsterItemUIArray.push(monsterItemUI);
        }
    }

    /**点击菜单栏中的怪兽购买 */
    private buy_MenuMonster(i:number)
    {
        WelComeController.ins.ownPlayer.coin-=this.monsterItemUIArray[i].data.price;
        this.text_coin.text=WelComeController.ins.ownPlayer.coin.toString();
        this.monsterSignArray.push(i+1);
    }

    /**每回合购买怪物数量加入数组发送请求给敌方 */
    private clickBuy_Monster():void
    {
        //注销变土事件，注册生成防御塔事件
        WelComeController.ins.ownPlayer.restGrassAddEvent();
        Laya.timer.frameLoop(60,this,this.countdownOpen);
        this.text_timer.visible=true;
        this.btn_buy.visible=false;
        this.monster_uigroup.visible=false;
        this.defender_uigroup.visible=true;
        WelComeController.ins.ownPlayer.group.mouseEnabled=true;
        //发送购买完成请求
        //send(this.monsterSignArray)
        this.getEnemyMonsterArray();
    }

    /**接收对方每回合的怪物数组 */
    private getEnemyMonsterArray():void
    {
        let monsterSignArray=[1,2,1,1,1];
        let player=WelComeController.ins.ownPlayer;
        for(let i=0;i<monsterSignArray.length;i++)
        {
            let monster:Monster=Laya.Pool.getItemByClass("monster",Monster);
            monster.init(player.group,player.monsterBornGrass.sp.x,player.monsterBornGrass.sp.y,monsterSignArray[i]);
            monster.ani.visible=false;
            this.monsterArray.push(monster);
        }
    }

    /**每回合倒计时 */
    public countdownOpen():void
    {
        this.countDownNum--;
        this.text_timer.text=this.countDownNum.toString();
        //倒计时完成后
        if(this.countDownNum==0)
        {
            this.countDownNum=30;
            this.text_timer.visible=false;
            Laya.timer.clear(this,this.countdownOpen);
            //开始怪兽出击
            this.isMonsterMove=true;
            this.monsterCount=1;
            //先让第一只怪物运动
            this.openMonsterMove();
            //开启后续怪物生成计时器
            Laya.timer.frameLoop(240,this,this.openMonsterMove);
            MessageManager.ins.showFloatMsg("第"+this.round+"回合");
        }
    }

    /**菜单栏添加可选择的防御塔 */                              //--需读取配置文件
    private menuAddDefenderUI():void
    {
        for(let i=0;i<ConfigManager.ins.getConfigLength("defender");i++)
        {
            let defenderItemUI=new DefenderItemUI(this.defender_uigroup,20+i*100,30,i+1);
            defenderItemUI.sp.on(Laya.Event.CLICK,this,this.click_MenuDefender,[i]);
            this.defenderItemUIArray.push(defenderItemUI);
        }
    }

    /**点击菜单栏中的防御塔 */
    private click_MenuDefender(i:number)
    {
        WelComeController.ins.ownPlayer.defenderId=i+1;
        WelComeController.ins.ownPlayer.defenderCoin=this.defenderItemUIArray[i].data.price;
    }

     /**怪物后续生成计时器 */
     public openMonsterMove():void
     {
         if(this.monsterCount<=this.monsterArray.length)
         {
             this.monsterArray[this.monsterCount-1].ani.visible=true;
             this.monsterArray[this.monsterCount-1].ani.play(0,true);
             this.monster_CalMoveDir(this.monsterArray[this.monsterCount-1]);
             this.monsterArray[this.monsterCount-1].monster_OpenMoveByDir();
             this.monsterCount++;
         }
         else
         {
             Laya.timer.clear(this,this.openMonsterMove);
         }
        
     }

    /**计算所有怪兽的公共路径方向 */
    public monster_CalMoveDir(monster:Monster):void
    {
        let dirX,dirY;
        for(let i=1;i<=WelComeController.ins.ownPlayer.fac.mudArray.length-1;i++)
        {
            if(WelComeController.ins.ownPlayer.fac.mudArray[i].sp.y-WelComeController.ins.ownPlayer.fac.mudArray[i-1].sp.y==0)
            {
                if(WelComeController.ins.ownPlayer.fac.mudArray[i].sp.x-WelComeController.ins.ownPlayer.fac.mudArray[i-1].sp.x==100)
                {
                    dirX=1;
                    dirY=0;
                }
                else
                {
                    dirX=-1;
                    dirY=0;
                }
            }
            else if(WelComeController.ins.ownPlayer.fac.mudArray[i].sp.x-WelComeController.ins.ownPlayer.fac.mudArray[i-1].sp.x==0)
            {
                if(WelComeController.ins.ownPlayer.fac.mudArray[i].sp.y-WelComeController.ins.ownPlayer.fac.mudArray[i-1].sp.y==100)
                {
                    dirX=0;
                    dirY=1;
                }
                else
                {
                    dirX=0;
                    dirY=-1;
                }
            }
            this.dirArray.push([dirX,dirY]);
        }
    }
    /***************************************************************************/
}
