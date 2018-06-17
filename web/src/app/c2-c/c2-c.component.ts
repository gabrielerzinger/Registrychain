import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast } from 'angular2-toaster';

import { User, Contract } from '../models';
import { ContractService } from '../services/contract.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-c2-c',
  templateUrl: './c2-c.component.html',
  styleUrls: ['./c2-c.component.css']
})
export class C2CComponent implements OnInit {

    public user: User;
    public counterpart: User;
    public userRole: string = "hirer";
    public counterpartkey: string;
    public description: string;


    constructor(public contractService: ContractService, public userService: UserService, public toasterService: ToasterService, public router: Router) {
        userService.userSubject.subscribe(u => this.user = u);
    }

    ngOnInit() {
    }

    getCounterpart(){
        this.userService.getUser(this.counterpartkey).subscribe((user) => {
            this.counterpart = user;
        }, (err) => {
            let toast: Toast = {
                type: 'error',
                title: 'Ops!',
                body: 'Chave Pública não encontrada!'
            };
            this.toasterService.pop(toast);
        });
    }

    onSubmit(){
        let errToast: Toast = {
            type: 'error',
            title: 'Ops!',
            body: 'Algo deu errado!'
        };
        let contract = new Contract({
            parties: [{
                user: this.user,
                role: this.userRole,
                accepted: true
            }, {
                user: this.counterpart,
                role: this.userRole == 'hirer' ? 'hired' : 'hirer',
                accepted: false
            }],
            description: this.description,
            status: 'pending',
            type: 'c2c'
        });
        this.userService.requestToken(this.user).subscribe( () => {
            this.contractService.send(contract).subscribe((c) => {
                let toast: Toast = {
                    type: 'success',
                    title: 'Successo!',
                    body: 'O contrato foi enviado para a contraparte analisar!'
                };
                this.toasterService.pop(toast);
                this.router.navigate(['/profile']);
            }, (err) => {
                this.toasterService.pop(errToast);
            });
        });
    }
}
