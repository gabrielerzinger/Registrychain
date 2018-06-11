import { Component, OnInit, ViewChild} from '@angular/core';
import { ToasterService, Toast } from 'angular2-toaster';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { User, Contract } from '../models';
import {UserService} from '../services/user.service';
import {ContractService} from '../services/contract.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    @ViewChild('parentsModal') parentsModal: ModalDirective;

    public user: User;
    public myContracts: Contract[] = [];
    public pendingContracts: Contract[] = [];
    public selectedContract: Contract;
    public selectedPart1: {
        user: User,
        role: string,
        accepted: boolean,
        parents?: {
            fatherName: string,
            motherName: string
        }
    };
    public selectedPart2: {
        user: User,
        role: string,
        accepted: boolean,
        parents?: {
            fatherName: string,
            motherName: string
        }
    };
    public submitSubject: Subject<void> = new Subject<void>();
    public subscriptions: Subscription[] = [];
    public father: string;
    public mother: string;

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

    onAccept(contract: Contract){
        if(contract.status == 'celebrated'){
            this.pendingContracts.splice(this.pendingContracts.findIndex(x => x._id == contract._id), 1);
            this.myContracts.push(contract);
        }
    }

    onRefuse(contract: Contract){
        this.pendingContracts.splice(this.pendingContracts.findIndex(x => x._id == contract._id), 1);
    }

    accept(contract: Contract){
        if(contract.type == 'cc'){
            this.parentsModal.show();
            this.subscriptions.push(this.submitSubject.subscribe(() => {
                this.acceptDone(contract);
                this.parentsModal.hide();
                this.unsubscribe();
            }));
        }
        else {
            this.acceptDone(contract);
        }
    }

    acceptDone(contract: Contract){
        contract.parties.find(x => x.user._id == this.user._id).accepted = true;
        if(contract.parties.every(x => x.accepted)) {
            contract.status = 'celebrated';
            contract.celebrationDate = moment().format('DD-MM-YYYY');
        };
        this.contractService.accept(contract).subscribe(() => {
            this.onAccept(contract);
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
            this.onRefuse(contract);
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
        switch(this.selectedContract.type){
          case 'c2c':
            this.selectedPart1 = this.selectedContract.parties.find(x => x.role == 'hired');
            this.selectedPart2 = this.selectedContract.parties.find(x => x.role == 'hirer');
            break;
          case 'cev':
            this.selectedPart1 = this.selectedContract.parties.find(x => x.role == 'buyer');
            this.selectedPart2 = this.selectedContract.parties.find(x => x.role == 'seller');
            break;
          case 'cue':
            this.selectedPart1 = this.selectedContract.parties.find(x => x.role == 'residentOne');
            this.selectedPart2 = this.selectedContract.parties.find(x => x.role == 'residentTwo');
            break;
          case 'cc':
            this.selectedPart1 = this.selectedContract.parties.find(x => x.role == 'consortOne');
            this.selectedPart2 = this.selectedContract.parties.find(x => x.role == 'consortTwo');
            break;
        }

    }

    ngOnInit() {
    }

    onSubmit(){
        console.log(this.selectedContract);
        this.selectedContract.parties.find(x => x.user._id == this.user._id).parents = {
            fatherName: this.father,
            motherName: this.mother
        }
        this.submitSubject.next();
    }

    unsubscribe(){
        this.subscriptions.forEach(x => x.unsubscribe());
    }

}
