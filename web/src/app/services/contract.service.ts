import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class ContractService {

    constructor(public http: HttpClient) { }

    send(contract: any){
        return Observable.create(o => {
            this.http.post('http://localhost:3000/c2c', contract, httpOptions).subscribe(c => {
                if(c) {
                    o.next(c);
                    o.complete();
                    return;
                }
                o.error();
            }, e => o.error());
        });
    }
}
