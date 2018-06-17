import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError }from 'rxjs/operators';
import  QRCode from 'qrcode';

import { User } from '../models';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Access-Control-Allow-Origin': '*'
    }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
    public user: User;
    public userSubject: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(public http: HttpClient, public router: Router) {
        if(sessionStorage.getItem('pubkey')){
            this.getUser(sessionStorage.getItem('pubkey')).subscribe(u => {
                this.userSubject.next(this.user);
            });
        }
    }

    authyRegister(user: any){
        return this.http.post('http://localhost:3000/authyRegister', user);
    }

    checkUser(cpf: string){
        return this.http.get('http://localhost:3000/checkUser/'+cpf);
    }

    checkToken(user: User, token: string){
        return this.http.get('http://localhost:3000/checkToken/'+token+'/'+user.authid, httpOptions);
    }

    getUser(pubkey: string): Observable<any> {
        return Observable.create(o => {
            this.http.get('http://localhost:3000/user/'+pubkey, httpOptions).subscribe(u => {
                if(u){
                    this.user = new User(JSON.parse(JSON.stringify(u)));
                    QRCode.toDataURL(this.user.pubkey).then(url => {
                        this.user.pubkeyurl = url;
                        o.next(this.user);
                        o.complete();
                    });
                }
                else o.error();
            }, (err) => o.error(err));
        });
    }

    register(user: any): Observable<any> {
        return Observable.create(o => {
            this.http.post('http://localhost:3000/register', {user: user}, httpOptions).subscribe(u => {
                if(u){
                    this.user = new User(JSON.parse(JSON.stringify(u)));
                    QRCode.toDataURL(this.user.pubkey).then(url => {
                        this.user.pubkeyurl = url;
                        this.userSubject.next(this.user);
                        o.next(this.user);
                        o.complete();
                    });
                }
                else o.error();
            }, (err) => o.error(err));
        });
    }

    login(pubkey: string, password: string): Observable<any> {
        return Observable.create(o => {
            this.http.post('http://localhost:3000/login', {
                pubkey: pubkey,
                password: password
            }, httpOptions).subscribe(u => {
                if(u){
                    this.user = new User(JSON.parse(JSON.stringify(u)));
                    QRCode.toDataURL(this.user.pubkey).then(url => {
                        this.user.pubkeyurl = url;
                        this.userSubject.next(this.user);
                        sessionStorage.setItem('pubkey', this.user.pubkey);
                        o.next(this.user);
                        o.complete();
                        this.router.navigate(['/']);
                    });
                }
                else o.error();
            }, (err) => o.error());
        });
    }

    logout() {
        this.user = null;
        sessionStorage.removeItem('pubkey');
        this.userSubject.next(null);
        this.router.navigate(['/']);
    }
}
