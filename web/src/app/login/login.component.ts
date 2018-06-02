import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService, Toaster } from 'angular2-toaster';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public username: string;
    public password: string;
    @ViewChild('loginForm') loginForm: NgForm;

    constructor(public userService: UserService, public router: Router, public toasterService: ToasterService) { }

    ngOnInit() {
    }

    onSubmit(){
        // check validity
        if(this.loginForm.valid) {
            this.userService.login(this.username, this.password).subscribe((user) => {
                this.router.navigate(['/']);
            }, () => {
                let toast: Toast = {
                    type: 'error',
                    title: 'Erro!',
                    body: 'Credenciais incorretas!'
                }
                this.toasterService.pop(toast);
            });
        }
        else {
            let toast: Toast = {
                type: 'error',
                title: 'Erro!',
                body: 'Por favor, preencha todos os campos!'
            };
            this.toasterService.pop(toast);
        }

    }

}
