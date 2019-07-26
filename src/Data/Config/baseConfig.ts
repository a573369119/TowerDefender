/**
 * 基础数据结构
 */
export default class baseConfig{
  
    constructor(data){
        let arr = Object.keys(data);
        for(let i=0;i<arr.length;i++){
            this[arr[i]] = data[arr[i]];
        }
    }
}