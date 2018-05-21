import { Component, OnInit } from '@angular/core';

import { ContractService } from '../services/contract.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-c2-c',
  templateUrl: './c2-c.component.html',
  styleUrls: ['./c2-c.component.css']
})
export class C2CComponent implements OnInit {

    public user: any;
    public userRole: string;
    public counterpart: string;
    public description: string;

    public success;

    constructor(public contractService: ContractService, public userService: UserService) {
        userService.userSubject.subscribe(u => this.user = u);
    }

    ngOnInit() {
    }

    onSubmit(){
        this.contractService.send({
            userId: this.user._id,
            userRole: this.userRole,
            counterpart: this.counterpart,
            description: this.description
        }).subscribe((c) => {
            if(c) {
                this.success = true;
                delete this.userRole;
                delete this.counterpart;
                delete this.description;
            }
            else this.success = false;
        }, (err) => {
            this.success = false;
        });
    }

    closeAlert(){
        delete this.success;
    }
}
