import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';

import { Contract, User } from '../models';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class ContractService {

    public myContractsSubject = new ReplaySubject<Contract>(1);
    public pendingContractsSubject = new ReplaySubject<Contract>(1);

    constructor(public http: HttpClient) { }

    send(contract: Contract){
        console.log(contract);
        if(contract.type == 'c2c'){
            return Observable.create(o => {
                this.http.post('http://localhost:3000/contracts/c2c', contract, httpOptions).subscribe(() => {
                    o.next();
                    o.complete();
                }, e => o.error(e));
            });
        }
        if(contract.type == 'cev'){
            return Observable.create(o => {
                this.http.post('http://localhost:3000/contracts/cev', contract, httpOptions).subscribe(() => {
                    o.next();
                    o.complete();
                }, e => o.error(e));
            });
        }
    }

    getMyContracts(user: User) {
        return Observable.create(o => {
            this.http.get('http://localhost:3000/contracts/celebrated/'+user._id, httpOptions).subscribe(c => {
                if(c) {
                    let contracts = [];
                    JSON.parse(JSON.stringify(c)).forEach(x => contracts.push(new Contract(x)));
                    o.next(contracts);
                    o.complete();
                    return;
                }
                o.error();
            }, e => o.error());
        });
    }

    getPendingContracts(user: User) {
        return Observable.create(o => {
            this.http.get('http://localhost:3000/contracts/pending/'+user._id, httpOptions).subscribe(c =>  {
                if(c) {
                    let contracts = [];
                    JSON.parse(JSON.stringify(c)).forEach(x => contracts.push(new Contract(x)));
                    o.next(contracts);
                    o.complete();
                    return;
                }
                o.error();
            }, e => o.error());
        });
    }

    accept(contract: Contract){
        return this.http.put('http://localhost:3000/contracts/'+contract.type, contract, httpOptions);
    }

    refuse(contract: Contract) {
        return this.http.delete('http://localhost:3000/contracts/'+contract.type+'/'+contract._id, httpOptions);
    }
}
