import WebSocketManager from "./WebSocketManager";

/*
* 打包
*/
export default class PackageOut extends Laya.Byte{
    // private PACKET_MARK = 0x0;
    // private module = 0;
    // private type = 0;
    // private formart = 0;
    private cmd;
    constructor(){
        super();
    }
    // public pack(module,cmd,data?:any):void
    // {
    //     this.endian = Laya.Byte.BIG_ENDIAN;//设置endian；
    //     this.module = module;
    //     this.cmd = cmd;
    //     this.writeInt16(this.PACKET_MARK);
    //     this.writeInt32(data.byteLength + 10);
    //     //包头
    //     this.writeInt32(this.module);
    //     this.writeInt32(this.cmd);
    //     this.writeByte(this.type);
    //     this.writeByte(this.formart);
    //     //消息体
    //     if(data)
    //     {
    //         this.writeArrayBuffer(data);
    //     }
    // }

    /**新通信 */
    public pack(cmd,data?:any):void
    {
        this.endian = Laya.Byte.BIG_ENDIAN;//设置endian；

        this.cmd = cmd;
        var len = (data ? data.byteLength : 0) + 12;
        var code:number = WebSocketManager.codeCount^len^512;
        
        this.writeInt32(len);
        console.log();
        this.writeInt32(code);
        this.writeInt32(this.cmd);
        if(data)
        {
            this.writeArrayBuffer(data);
        }

        WebSocketManager.codeCount++ ;
    }

}