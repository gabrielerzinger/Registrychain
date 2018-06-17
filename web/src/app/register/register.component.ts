import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition, keyframe } from '@angular/animations';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService, Toast } from 'angular2-toaster';

import { User } from '../models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('0.3s ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('0.3s ease-out', style({opacity: 0}))
      ])
    ]
  ]
})
export class RegisterComponent implements OnInit {
    public user: User = new User();
    public password: string = '';
    public step: number = 1;
    public token: string = '';
    @ViewChild('regForm') regForm: NgForm;
    @ViewChild('phoneForm') phoneForm: NgForm;
    @ViewChild('tokenForm') tokenForm: NgForm;
    @ViewChild('keyModal') keyModal: ModalDirective;

    constructor(public userService: UserService, public toasterService: ToasterService, public router: Router) {
    }

    ngOnInit() {
    }

    onSubmit(){
        switch(this.step) {
          case 1:
            // check validity
            if(this.regForm.valid) {
                if(!this.checkEmail(this.user.email)) return this.errToast('Insira um endereço de email válido!');
                if(!this.checkCPF(this.user.cpf)) return this.errToast('Insira um CPF válido!');
                this.userService.checkUser(this.user.cpf).subscribe(res => {
                    if(!res.available) return this.errToast('Você já está cadastrado!');
                    // Capitalizes first letter of each word before saving it
                    this.user.name = this.user.name.split(' ').map(x => x.substring(0,1).toUpperCase() + x.substring(1, x.length).toLowerCase()).join(' ');
                    this.user.username = this.user.cpf;
                    this.step = 2;
                }, err => {
                    this.errToast('Algo deu errado!');
                })
            } else {
                this.errToast('Por favor, preencha todos os campos!');
            }
            break;
          case 2:
            if(this.phoneForm.valid){
                this.userService.authyRegister(this.user).subscribe(u => {
                    if(!u.success) return this.errToast('Insira um número de telefone válido!');
                    this.user.authid = u['user']['id'];
                    this.step = 3;
                }, err => {
                    this.errToast('Algo deu errado!')
                });
            } else {
                this.errToast('Insira um número de telefone!');
            }
            break;
          case 3:
            if(this.tokenForm.valid){
                this.userService.checkToken(this.user, this.token).subscribe(res => {
                    if(res['token'] == 'is valid'){
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
                            this.errToast('Você já está registrado!')
                        });
                    }
                    else this.errToast('Token Inválido!');
                });
            } else {
                this.errToast('Insira o seu token do Authy!');
            }
        }
    }


    checkEmail(email: string): boolean {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    checkCPF(cpf: string){
        let re = /[0-9]{3}.?[0-9]{3}.?[0-9]{3}[.\-]?[0-9]{2}/;
        if(!re.test(cpf)) return false;
        cpf = cpf.replace(/[.\-]/g,'');
        console.log(cpf);
        let soma = 0;
        let resto;
        if(cpf == "00000000000") return false;
        for(let i=1; i<=9; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11)) resto = 0;
        if (resto != parseInt(cpf.substring(9, 10)) ) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11))  resto = 0;
        if (resto != parseInt(cpf.substring(10, 11) ) ) return false;
        return true;
    }

    errToast(msg: string){
        let toast: Toast = {
            type: 'error',
            title: 'Ops!',
            body: msg
        };
        this.toasterService.pop(toast);
    }
}
