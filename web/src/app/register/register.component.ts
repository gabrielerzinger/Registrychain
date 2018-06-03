import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService, Toast } from 'angular2-toaster';

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
    @ViewChild('keyModal') keyModal: ModalDirective;

    constructor(public userService: UserService, public toasterService: ToasterService, public router: Router) {
    }

    ngOnInit() {
    }

    onSubmit(){
        // check validity
        if(this.regForm.valid) {
            // Capitalizes first letter of each word before saving it
            this.user.name = this.user.name.split(' ').map(x => x.substring(0,1).toUpperCase() + x.substring(1, x.length).toLowerCase()).join(' ');
            this.user.username = this.user.cpf;
            this.userService.register(Object.assign({password: this.password}, this.user)).subscribe((user) => {
                this.user = user;
                let toast: Toast = {
                    type: 'success',
                    title: 'Sucesso!',
                    body: 'Cadastro efetuado!'
                };
                this.toasterService.pop(toast);
                this.keyModal.show();
            }, (err) => {
                console.log(err);
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
