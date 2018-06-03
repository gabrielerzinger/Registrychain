import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast } from 'angular2-toaster';

import { User } from '../models';
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
        this.contractService.send({
            userId: this.user._id,
            userRole: this.userRole,
            counterpart: this.counterpart.pubkey,
            description: this.description,
            hirerOk: this.userRole == 'hirer' ? true : false,
            hiredOk: this.userRole == 'hired' ? true : false,
            status: 'pending'
        }).subscribe((c) => {
            if(c) {
                this.userRole = "hirer";
                delete this.counterpart;
                delete this.description;
                let toast: Toast = {
                    type: 'success',
                    title: 'Successo!',
                    body: 'O contrato foi enviado para a contraparte analisar!'
                };
                this.toasterService.pop(toast);
                this.router.navigate(['/']);
            }
            else this.toasterService.pop(errToast);
        }, (err) => {
            this.toasterService.pop(errToast);
        });
    }
}
