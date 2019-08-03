import Grass from "./Prefab/Grass";

export default class GrassFactory {
    /**草坪数组 */
    public grassArray:Array<Grass>;
    /**土坑数组 */
    public mudArray:Array<Grass>;
    constructor(view:Laya.Sprite)
    {
        this.grassArray = new Array<Grass>();
        this.mudArray=new Array<Grass>();
        this.createGrassArray(view);
    }
    
    /**生成草坪 */
    private createGrassArray(view:Laya.Sprite):void
    {
        for(let i=0;i<7;i++)
        {
            for(let j=0;j<10;j++)
            {
                let grass:Grass;
                if(i%2==0)
                {
                    grass=new Grass(j%2+1,view);
                }
                else
                {
                    grass=new Grass((j+1)%2+1,view);
                }
                this.grassArray.push(grass);
                grass.Pos(i,j);
            }
        }    
        
    }
}