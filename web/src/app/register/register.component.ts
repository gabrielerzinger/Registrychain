import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToasterService, Toaster } from 'angular2-toaster';

import { User } from '../models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    public user: User = new User();
    public password: string = '';

    @ViewChild('regForm') regForm: NgForm;
    constructor(public userService: UserService, public toasterService: ToasterService) {
    }

    ngOnInit() {
    }

    onSubmit(){
        // check validity
        if(this.regForm.valid) {
            this.user.username = this.user.cpf;
            this.userService.register(Object.assign({password: this.password}, this.user)).subscribe((user) => {
                let toast: Toast = {
                    type: 'success',
                    title: 'Sucesso!',
                    body: 'Cadastro efetuado!'
                };
                this.toasterService.pop(toast);
            }, (err) => {
                let toast: Toast = {
                    type: 'error',
                    title: 'Ops!',
                    body: 'Você já está registrado!'
                };
                this.toasterService.pop(toast);
            });
        }
        else {
            let toast: Toast = {
                type: 'error',
                title: 'Ops!',
                body: 'Por favor, preencha todos os campos!'
            };
            this.toasterService.pop(toast);
        }
    }
}
