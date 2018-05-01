import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Transaction } from './model/transaction.model'
import { ServiceNode } from './model/servicenode.model'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var $: any;

@Injectable()
export class AppService {

     constructor (private http: Http) {}

     getTable(url: string) : Observable<any> {
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

        let debit = this.getDebitString(transaction);
        let credit = this.getCreditString(transaction);
        let body = {
            'id': transaction.id,
            'date': transaction.date,
            'description': transaction.description,
            'debit': debit,
            'credit': credit
        }

        let options = new RequestOptions({headers: headers});
        
        return this.http.post(url + "/newTransaction", body, options)
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     getPendingTransactions(url: string) : Observable<Array<Transaction>> {
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

     getUniqueID(url: string) : Observable<string> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        
        return this.http.get(url + "/getUniqueID", {headers: headers})
        .map((res: Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
     }

     getNodes() : Observable<Array<ServiceNode>> {
        let nodeURLs = [
            'http://localhost:5000',
            'http://localhost:5001',
            'http://localhost:5002',
            'http://localhost:5003',
            'http://localhost:5004',
            'http://localhost:5005',
            'http://localhost:5006',
            'http://localhost:5007',
            'http://localhost:5008',
            'http://localhost:5009'
        ];

        let nodes: Array<ServiceNode> = [];

        for (var i = 0; i < nodeURLs.length; i ++) {
            let url = nodeURLs[i];
            let uniqueID = this.getUniqueID(url);
            nodes.push(new ServiceNode(url, uniqueID));
        }

        let response: BehaviorSubject<Array<ServiceNode>> = new BehaviorSubject<Array<ServiceNode>>(nodes);

        return response.asObservable();
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

    generateTransactions() : Observable<Array<Transaction>> {
        return this.http.get("./assets/generatedTransactions.json")
        .map((res:any) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getDebitString(transaction: Transaction) {
        if (transaction.debitType != undefined && transaction.debitType != null)
            return transaction.debit != transaction ? '$' + transaction.debit + ' ' + transaction.debitType : '';
        else return transaction.debit;
    }

    getCreditString(transaction: Transaction) {
        if (transaction.creditType != undefined && transaction.creditType != null)
            return transaction.credit != undefined ? '$' + transaction.credit + ' ' + transaction.creditType : '';
        else return transaction.credit;
    }
}