import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import  QRCode from 'qrcode';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
    public user: {
        _id?: string,
        username: string,
        cpf: string,
        name: string,
        email: string,
        rg?: string,
        address?: string,
        lat?: number,
        lng?: number,
        pubkey: string,
        password: string,
        pubkeyurl?: string
    };
    public userSubject: ReplaySubject<any> = new ReplaySubject<any>(1);



    constructor(public http: HttpClient, public router: Router) {
        if(localStorage.getItem('username')){
            this.getUser(localStorage.getItem('username')).subscribe();
        }
    }

    getUser(username: string): Observable<any> {
        return Observable.create(o => {
            this.http.get('http://localhost:3000/user/'+username, httpOptions).subscribe(u => {
                if(u){
                    this.user = JSON.parse(JSON.stringify(u));
                    QRCode.toDataURL(this.user.pubkey?this.user.pubkey:' ').then(url => {
                        this.user.pubkeyurl = url;
                        this.userSubject.next(this.user);
                        o.next(this.user);
                        o.complete();
                        this.router.navigate(['/']);
                    });
                }
                else o.err();
            });
        });
    }

    register(user: any): Observable<any> {
        return Observable.create(o => {
            this.http.post('http://localhost:3000/register', {user: user}, httpOptions).subscribe(u => {
                if(u){
                    this.user = JSON.parse(JSON.stringify(u));
                    QRCode.toDataURL(this.user.pubkey?this.user.pubkey:' ').then(url => {
                        this.user.pubkeyurl = url;
                        this.userSubject.next(this.user);
                        o.next(this.user);
                        o.complete();
                        this.router.navigate(['/']);
                    });
                }
                else o.err();
            });
        });
    }

    login(username: string, password: string): Observable<any> {
        return Observable.create(o => {
            this.http.post('http://localhost:3000/login', {
                username: username,
                password: password
            }, httpOptions).subscribe(u => {
                if(u){
                    this.user = JSON.parse(JSON.stringify(u));
                    QRCode.toDataURL(this.user.pubkey?this.user.pubkey:' ').then(url => {
                        this.user.pubkeyurl = url;
                        this.userSubject.next(this.user);
                        localStorage.setItem('username', this.user.username);
                        o.next(this.user);
                        o.complete();
                        this.router.navigate(['/']);
                    });
                }
                else o.err();
            });
        });
    }

    logout() {
        this.user = null;
        localStorage.removeItem('username');
        this.userSubject.next(null);
        this.router.navigate(['/']);
    }
}
