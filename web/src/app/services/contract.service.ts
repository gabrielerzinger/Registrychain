import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class ContractService {

    public myContractsSubject = new ReplaySubject<any>(1);
    public pendingContractsSubject = new ReplaySubject<any>(1);

    constructor(public http: HttpClient) { }

    send(contract: any){
        return Observable.create(o => {
            this.http.post('http://localhost:3000/contracts/c2c', contract, httpOptions).subscribe(c => {
                if(c) {
                    o.next(c);
                    o.complete();
                    return;
                }
                o.error();
            }, e => o.error());
        });
    }

    getMyContracts(user: any) {
        return Observable.create(o => {
            this.http.get('http://localhost:3000/contracts/c2c/celebrated/'+user._id, httpOptions).subscribe(c => {
                if(c) {
                    o.next(c);
                    o.complete();
                    return;
                }
                o.error();
            }, e => o.error());
        });
    }

    getPendingContracts(user: any) {
        return Observable.create(o => {
            this.http.get('http://localhost:3000/contracts/c2c/pending/'+user._id, httpOptions).subscribe(c =>  {
                if(c) {
                    o.next(c);
                    o.complete();
                    return;
                }
                o.error();
            }, e => o.error());
        });
    }

    accept(contract: any){
        this.http.put('http://localhost:3000/contracts/c2c', contract, httpOptions).subscribe(c => {

        });
    }

    refuse(contract: any) {
        this.http.delete('http://localhost:3000/contracts/c2c/'+contract._id, httpOptions).subscribe(c => {
        })
    }
}
