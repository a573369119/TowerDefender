/*
* 数据处理Hanlder
*/
export default class SocketHandler{
    // public statusCode:number = 0;
    public caller:any;
    private callBack:Function;
    constructor(caller?:any,callback?:Function){
        this.caller = caller;
        this.callBack = callback;
    }

    public explain(data?:any):void
    {
        // var statusCode = data.statusCode;
        // if(statusCode == 0)
        // {
        //     this.success(data);
        // }
        // else
        // {
        //     console.log("服务器返回：",data.statusCode);
        // }
        this.success(data);
    }
    protected success(data?:any):void
    {
        if(this.caller && this.callBack)
        {
            if(data)
            {
                this.callBack.call(this.caller,data);
                
            }
            else
            {
                this.callBack.call(this.caller);
            }
        }
    }
}