import { ThisReceiver } from "@angular/compiler";

export class UtilService {

    constructor() { }

    static removeNull(obj: any): any {
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === '') {
              delete obj[key];
            }
            else if(obj[key] === Object(obj[key])){
                let res = this.ObjectNull(Object(obj[key]));
                if(res){
              	    delete obj[key];
                }
            }
        });
        return obj;
    }

    static ObjectNull(obj: any): boolean {
        let res = false;
        Object.keys(obj).forEach(key => {
            if (obj[key] === null || obj[key] === '') {
                res = true;
            }            
        });
        return res;
    }
}