import Dictionary from "../../Tool/Dictionary";
import EventManager from "../EventManager";
import PackageIn from "./PackageIn";
import PackageOut from "./PackageOut";
import SocketHandler from "./SocketHandler";
import ClientSender from "./ClientSender";
import { Protocol } from "../Const/GameConfig";

/**
 * socket中心
 */
export default class WebSocketManager {
   /**通信code次数 */
   public static codeCount:number = 0;
   private ip:string;
   private port:number;
   private webSocket:Laya.Socket;
   private socketHanlderDic:Dictionary;
   private protoRoot:any;
   constructor(){
       this.socketHanlderDic = new Dictionary();
   }
   private static _ins:WebSocketManager = null;
   public static get ins():WebSocketManager{
       if(this._ins == null)
       {  
           this._ins = new WebSocketManager();
       }
       return this._ins;
   }

   public connect(ip:string,port:number):void
   {
       this.ip = ip;
       this.port = port;

       this.webSocket = new Laya.Socket();
       this.webSocket.on(Laya.Event.OPEN,this,this.webSocketOpen);
       this.webSocket.on(Laya.Event.MESSAGE,this,this.webSocketMessage);
       this.webSocket.on(Laya.Event.CLOSE,this,this.webSocketClose);
       this.webSocket.on(Laya.Event.ERROR,this,this.webSocketError);
       //加载协议
       if(!this.protoRoot){
           var protoBufUrls = ["outside/proto/UserProto.proto","outside/proto/MatchProto.proto"];
           Laya.Browser.window.protobuf.load(protoBufUrls,this.protoLoadComplete);
            
       }
       else
       {
           this.webSocket.connectByUrl("ws://"+this.ip+":"+this.port);
       }
   }
   /**关闭websocket */
   public closeSocket():void
   {
       if(this.webSocket)
       {
           this.webSocket.off(Laya.Event.OPEN,this,this.webSocketOpen);
           this.webSocket.off(Laya.Event.MESSAGE,this,this.webSocketMessage);
           this.webSocket.off(Laya.Event.CLOSE,this,this.webSocketClose);
           this.webSocket.off(Laya.Event.ERROR,this,this.webSocketError);
           this.webSocket.close();
           this.webSocket = null;
       }
   }
  
   private protoLoadComplete(error,root):void
   {
       WebSocketManager.ins.protoRoot = root;
       WebSocketManager.ins.webSocket.connectByUrl("ws://"+WebSocketManager.ins.ip+":"+WebSocketManager.ins.port);
   }
   private webSocketOpen():void
   {
       console.log("websocket open...");
       this.byteBuffData = new Laya.Byte();
       this.byteBuffData.endian = Laya.Byte.BIG_ENDIAN;//设置endian;
       this.tempByte = new Laya.Byte();
       this.tempByte.endian = Laya.Byte.BIG_ENDIAN;

       WebSocketManager.codeCount = 1;
        //    EventManager.ins.dispatchEvent(EventManager.SERVER_CONNECTED);暂时不需要获取服务器列表
   }
   //缓冲字节数组
   private byteBuffData:Laya.Byte;
   //长度字节数组
   private tempByte:Laya.Byte;
  
   private parsePackageData(packLen):void
   {
       //完整包
       this.tempByte.clear();
       this.tempByte.writeArrayBuffer(this.byteBuffData.buffer,0,packLen);
       this.tempByte.pos = 0;
       //断包处理
       this.byteBuffData = new Laya.Byte(this.byteBuffData.getUint8Array(packLen,this.byteBuffData.length));
       // this.byteBuffData.writeArrayBuffer(this.byteBuffData.buffer,packLen,this.byteBuffData.length);
       this.byteBuffData.endian = Laya.Byte.BIG_ENDIAN;//设置endian;

       //解析包
       var packageIn:PackageIn = new PackageIn();
       // var buff = this.tempByte.buffer.slice(0,this.tempByte.length);
       packageIn.read(this.tempByte.buffer);

       console.log("websocket msg...",packageIn.cmd,this.tempByte.length);
       if(packageIn.cmd == 105202)
       {
           console.log("");
       }
       var key:string = ""+ packageIn.cmd;
       var handlers = this.socketHanlderDic.get(key);
       if(handlers && handlers.length > 0)
       {
           for(var i = handlers.length - 1;i >= 0;i--)
           {
               handlers[i].explain(packageIn.body);
           }
           // handlers.forEach(socketHanlder => {
           //     socketHanlder.explain(packageIn.body);

           // });
       }
       
       //递归检测是否有完整包
       if(this.byteBuffData.length > 4)
       {
           this.tempByte.clear();
           this.tempByte.writeArrayBuffer(this.byteBuffData.buffer,0,4);
           this.tempByte.pos = 0;
           packLen = this.tempByte.getInt32() + 4;
           if(this.byteBuffData.length >= packLen)
           {
               this.parsePackageData(packLen);
           }
       }
       
   }
   /**解析空包 */
   private parseNullPackage(cmd:number):void
   {
       var key:string = ""+ cmd;
       var handlers = this.socketHanlderDic.get(key);
       if(handlers)
       {
           handlers.forEach(socketHanlder => {
               socketHanlder.explain();
           });
       }
   }
   
   private webSocketMessage(data):void
   {
       this.tempByte = new Laya.Byte(data);
       this.tempByte.endian = Laya.Byte.BIG_ENDIAN;
       // console.log(".....testweb",this.tempByte.pos);
       
       if(this.tempByte.length > 4)
       {
           if(this.tempByte.getInt32() == 4)//空包
           {
               var cmd:number = this.tempByte.getInt32();
               this.parseNullPackage(cmd);
               console.log("空包................"+cmd);
               return;
           }
       }
       this.byteBuffData.writeArrayBuffer(data,0,data.byteLength);
       // console.log("字节总长度................"+this.byteBuffData.length);
       
       if(this.byteBuffData.length > 4)
       {
           this.tempByte.clear();
           this.tempByte.writeArrayBuffer(this.byteBuffData.buffer,0,4);
           this.tempByte.pos = 0;
           var packLen:number = this.tempByte.getInt32() + 4;
           if(this.byteBuffData.length >= packLen)
           {
               this.parsePackageData(packLen);
           }
       }

       



       // var packageIn:PackageIn = new PackageIn();
       // packageIn.read(data);

       // console.log("websocket msg...",packageIn.cmd);
       // var key:string = ""+ packageIn.cmd;
       // var handlers = this.socketHanlderDic.get(key);
       // handlers.forEach(socketHanlder => {
       //     socketHanlder.explain(packageIn.body);
       // });
       
   }
   private webSocketClose():void
   {
        console.log("websocket close...");
   }
   private webSocketError():void
   {
        console.log("websocket error...");
   }
   /**
    * 发送消息
    * @param cmd 
    * @param data 
    */
   public sendMsg(cmd:number,data?:any):void
   {
       console.log("websocket req..."+cmd);
       var packageOut:PackageOut = new PackageOut();
       // packageOut.pack(module,cmd,data);
       packageOut.pack(cmd,data);
       this.webSocket.send(packageOut.buffer);
   }
   /**
    * 定义protobuf类
    * @param protoType 协议模块类型
    * @param classStr 类
    */
   public defineProtoClass(classStr:string):any
   {
       return this.protoRoot.lookup(classStr);
   }

   /**注册 */
   public registerHandler(cmd:number,handler:SocketHandler):void
   {
       // var key:string = protocol+"_"+cmd;
       var key:string = ""+cmd;
       var handlers:Array<SocketHandler> = this.socketHanlderDic.get(key);
       if(!handlers)
       {
           handlers = [];
           handlers.push(handler);
           this.socketHanlderDic.set(key,handlers);
       }
       else
       {
           handlers.push(handler);
       }
   }
   /**删除 */
   public unregisterHandler(cmd:number,caller:any):void
   {
       var key:string = "" + cmd;
       var handlers:Array<SocketHandler> = this.socketHanlderDic.get(key);
       if(handlers)
       {
           var handler;
           for(var i = handlers.length - 1;i >= 0 ;i--)
           {
               handler = handlers[i];
               if(handler.caller === caller)
               {
                   handlers.splice(i,1);
               }
           }
           if(handlers.length == 0)
           {
               this.socketHanlderDic.remove(key);
           }
       }
   }
   /**添加服务器心跳 */
   public addHertReq():void
   {
    //    this.registerHandler(Protocol.RESP_SERV_HERT,new ServerHeartHandler(this));
    //    ClientSender.servHeartReq();
    //    Laya.timer.loop(10000,this,function():void{
    //        ClientSender.servHeartReq();
    //    });
   }
   public removeHeartReq():void
   {
    //    this.unregisterHandler(Protocol.RESP_SERV_HERT,this);
    //    Laya.timer.clearAll(this);
   }
}