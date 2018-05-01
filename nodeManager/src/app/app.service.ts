import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Transaction } from './model/transaction.model'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var $: any;

@Injectable()
export class AppService {

     constructor (private http: Http) {}

     getTable(url: string) : Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        
        return this.http.get(url + "/chain", {headers: headers})
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     addTransaction(url: string, transaction: Transaction) : Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        let body = {
            'id': transaction.id,
            'date': transaction.date,
            'description': transaction.description,
            'debit': '$' + transaction.debit + ' ' + transaction.debitType,
            'credit': '$' + transaction.credit + ' ' + transaction.creditType
        }

        let options = new RequestOptions({headers: headers});
        
        return this.http.post(url + "/newTransaction", body, options)
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     getPendingTransactions(url: string) : Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        
        return this.http.get(url + "/getPendingTransactions", {headers: headers})
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     mineBlock(url: string) : Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        
        return this.http.get(url + "/mineBlock", {headers: headers})
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     getPeers(url: string) : Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        
        return this.http.get(url + "/getPeers", {headers: headers})
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     handleNode(url: string) : Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        
        return this.http.get(url + "/handleNode", {headers: headers})
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     getNodes() {
        return [
            'http://localhost:5000',
            'http://localhost:5001',
            'http://localhost:5002',
            'http://localhost:5003',
            'http://localhost:5004',
            'http://localhost:5005',
            'http://localhost:5006',
            'http://localhost:5007',
            'http://localhost:5008',
            'http://localhost:5009',
            'http://localhost:5010'
        ];
     }

     getCurrencies() {
        return [
            'USD',
            'CAD',
            'GBP',
            'BTC',
            'ETH'
        ];
     }
}