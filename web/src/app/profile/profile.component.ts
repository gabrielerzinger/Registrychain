import { Component, OnInit } from '@angular/core';

import { User } from '../models';
import {UserService} from '../services/user.service';
import {ContractService} from '../services/contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    public user: User;
    public myContracts;
    public pendingContracts;
    public selectedContract;

    constructor(public userService: UserService, public contractService: ContractService) {
        userService.userSubject.subscribe(u => {
            this.user = u;
            if(u) {
                contractService.getMyContracts(u).subscribe(c => {
                    this.myContracts = c;
                });
                contractService.getPendingContracts(u).subscribe(c => {
                    this.pendingContracts = c;
                });
            }
        });
    }

    accept(contract: any){
        if(contract.hired == this.user._id){
            contract.hiredOk = true;
        }
        if(contract.hirer == this.user._id) {
            contract.hirerOk = true;
        }
        if(contract.hirerOk && contract.hiredOk) contract.status = 'celebrated';
        this.contractService.accept(contract);
        if(contract.status == 'celebrated'){
            this.pendingContracts.splice(this.pendingContracts.findIndex(x => x._id == contract._id), 1);
            this.myContracts.push(contract);
        }
    }

    refuse(contract: any){
        this.contractService.refuse(contract);
        this.pendingContracts.splice(this.pendingContracts.findIndex(x => x._id == contract._id), 1);
    }

    ngOnInit() {
    }

}
