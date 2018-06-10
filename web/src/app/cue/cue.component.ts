import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast } from 'angular2-toaster';

import { User, Contract, Address } from '../models';
import { ContractService } from '../services/contract.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-cue',
  templateUrl: './cue.component.html',
  styleUrls: ['./cue.component.css']
})
export class CUEComponent implements OnInit {

    public user: User;
    public counterpart: User;
    public userRole: string = "residentOne";
    public counterpartkey: string;
    public description: string = '';
    public address: Address = new Address();

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
                role: 'residentTwo',
                accepted: false
            }],
            description: this.description,
            address: this.address,
            status: 'pending',
            type: 'cue'
        });
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
    }
}
