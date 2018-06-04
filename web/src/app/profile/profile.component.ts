import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast } from 'angular2-toaster';
import * as moment from 'moment';

import { User, Contract } from '../models';
import {UserService} from '../services/user.service';
import {ContractService} from '../services/contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    public user: User;
    public myContracts: Contract[] = [];
    public pendingContracts: Contract[] = [];
    public selectedContract: Contract;
    public selectedPart1: User;
    public selectedPart2: User;

    public loadingPending: boolean = true;
    public loadingCelebrated: boolean = true;

    constructor(public userService: UserService, public contractService: ContractService, public toasterService: ToasterService) {
        userService.userSubject.subscribe(u => {
            this.user = u;
            if(u) {
                contractService.getMyContracts(u).subscribe(c => {
                    this.myContracts = c;
                    setTimeout(()=>this.loadingCelebrated = false, 500);
                });
                contractService.getPendingContracts(u).subscribe(c => {
                    this.pendingContracts = c;
                    setTimeout(()=>this.loadingPending = false, 500);
                });
            }
        });
    }

    accept(contract: Contract){
        contract.parties.find(x => x.user._id == this.user._id).accepted = true;
        if(contract.parties.every(x => x.accepted)) {
            contract.status = 'celebrated';
            contract.celebrationDate = moment().format('DD-MM-YYYY');
        };
        this.contractService.accept(contract).subscribe(() => {
            if(contract.status == 'celebrated'){
                this.pendingContracts.splice(this.pendingContracts.findIndex(x => x._id == contract._id), 1);
                this.myContracts.push(contract);
            }
        }, () => {
            let toast: Toast = {
                type: 'error',
                title: 'Ops!',
                body: 'Não foi possível efetuar essa ação!'
            };
            this.toasterService.pop(toast);
        });
    }

    refuse(contract: Contract){
        this.contractService.refuse(contract).subscribe(()=>{
            this.pendingContracts.splice(this.pendingContracts.findIndex(x => x._id == contract._id), 1);
        }, () => {
            let toast: Toast = {
                type: 'error',
                title: 'Ops!',
                body: 'Não foi possível efetuar essa ação!'
            };
            this.toasterService.pop(toast);
        });
    }

    getCounterpart(contract: Contract){
        return contract.parties.find(x => x.user._id != this.user._id);
    }

    getMe(contract: Contract){
        return contract.parties.find(x => x.user._id == this.user._id);
    }

    selectContract(contract: Contract){
        this.selectedContract = new Contract(contract);
        if(this.selectedContract.type == 'c2c'){
            this.selectedPart1 = this.selectedContract.parties.find(x => x.role == 'hired').user;
            this.selectedPart2 = this.selectedContract.parties.find(x => x.role == 'hirer').user;
        }
        if(this.selectedContract.type == 'cev'){
            this.selectedPart1 = this.selectedContract.parties.find(x => x.role == 'buyer').user;
            this.selectedPart2 = this.selectedContract.parties.find(x => x.role == 'seller').user;
        }
    }

    ngOnInit() {
    }

}
