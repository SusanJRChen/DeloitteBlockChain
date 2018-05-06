import { Observable } from 'rxjs/Rx';

export class ServiceNode {
    constructor (url: string, uniqueID: Observable<string>) { 
        this.url = url;
        uniqueID.subscribe((response : any) => {
            this.uniqueID = response.uniqueID;
        });
    }

    public url: string;
    public uniqueID: string;
}