import Grass from "./Grass";
export default class GrassFactory {
    /**草坪数组 */
    public grassArray:Array<Grass>;
    /**土坑数组 */
    public mudArray:Array<Grass>;
    constructor(camp:string,view:Laya.Sprite)
    {
        this.grassArray=new Array<Grass>();
        this.mudArray=new Array<Grass>();
        this.createGrassArray(camp,view);
    }
    
    /**生成草坪 */
    private createGrassArray(camp:string,view:Laya.Sprite):void
    {
        for(let i=0;i<7;i++)
        {
            for(let j=0;j<10;j++)
            {
                let grass;
                if(i%2==0)
                {
                    grass=new Grass(j%2+1,view);
                }
                else
                {
                    grass=new Grass((j+1)%2+1,view);
                }
                this.grassArray.push(grass);
                if(camp=="red")
                {
                    grass.sp.pos(120+100*j,25+100*i);
                }
                else
                {
                    grass.sp.pos(1759+100*j,25+100*i);
                }
                
            }
        }    
        
    }
}