/**
    * 词典 key-value
    *
    *  
    *  keys : Array
    *  [read-only] 获取所有的子元素键名列表。
    *  Dictionary
    * 
    *  values : Array
    *  [read-only] 获取所有的子元素列表。
    *  Dictionary
    *  Public Methods
    *  
    *          
    *  clear():void
    *  清除此对象的键名列表和键值列表。
    *  Dictionary
    *          
    *  get(key:*):*
    *  返回指定键名的值。
    *  Dictionary
    *           
    *  indexOf(key:Object):int
    *  获取指定对象的键名索引。
    *  Dictionary
    *          
    *  remove(key:*):Boolean
    *  移除指定键名的值。
    *  Dictionary
    *          
    *  set(key:*, value:*):void
    *  给指定的键名设置值。
 */
export default class Dictionary {
    /**键名 */
    private keys : Array<any>;
    /**键值 */
    private values : Array<any>;

    constructor(){
        this.keys = new Array<any>();
        this.values = new Array<any>();
    }

    /**设置 键名 - 键值 */
    public set(key:any,value:any) : void
    {
        for(let i = 0;i<this.keys.length;i++)
        {
            if(this.keys[i]===undefined)
            {
                this.keys[i] = key;
                this.values[i] = value;
                return;
            }
        }
        this.keys.push(key);
        this.values.push(value);
        console.log("【Dictionary】 - 插入key["+ key +"]");
        console.log("value",value);
    }

    /**通过 键名key 获取键值value  */
    public get(key:any) : any
    {
        // this.getDicList(); 
        for(let i=0;i<this.keys.length;i++)
        {
            if(this.keys[i] === key)
            {
                return this.values[i];
            }
        }
        console.log("【Dictionary】 - 词典中没有key的值");
    }

    /**获取对象的索引值 */
    public indexOf(value : any) : number
    {
        for(let i = 0; i<this.values.length;i++)
        {
            if(this.values[i] === value)
            {
                return i;
            }
        }
        console.log("【Dictionary】 - 词典中没有该值");
        return undefined;
    }
    
    /**清除 词典中指定键名的剪 */
    public remove(key : any) : void
    {
        for(let i=0;i<this.keys.length;i++)
        {
            if(this.keys[i] === key)
            {
                this.keys[i] === undefined;
                this.values[i] === undefined;
                console.log("【Dictionary】 - 移除成功");
            }
        }
        console.log("【Dictionary】 - 移除失败");
    }

    /**清除所有的键 */
    public clear() : void
    {
        this.keys = [];
        this.values = [];
    }

    /**获取列表 */
    public getDicList() : void
    {
        for(let i=0;i<this.keys.length;i++)
        {
            console.log("【" + i + "】-----------key:" + this.keys[i]);
            console.log("value",this.values[i]);
        }
    }

    /**获取键值数组 */
    public getValuesArr() : Array<any>
    {
        return this.values;
    }

    /**获取键名数组 */
    public getKeysArr() : Array<any>
    {
        return this.keys;
    }
}