import { Component, OnInit, Input, EventEmitter, ViewModal, Output, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService, Toast } from 'angular2-toaster';

import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-contract-modal',
  templateUrl: './contract-modal.component.html',
  styleUrls: ['./contract-modal.component.css']
})
export class ContractModalComponent implements OnInit {

    @Input() selectedContract: Contract;
    @Input() selectedPart1: User;
    @Input() selectedPart2: User;
    @Output() onAccept: EventEmitter<Contract> = new EventEmitter<Contract>();
    @Output() onRefuse: EventEmitter<Contract> = new EventEmitter<Contract>();
    @ViewChild('contractModal') contractModal: ModalDirective;


    constructor(public contractService: ContractService, public toasterService: ToasterService) { }

    ngOnInit() {
    }

    show(){
        this.contractModal.show();
    }

    accept(contract: Contract){
        contract.parties.find(x => x.user._id == this.user._id).accepted = true;
        if(contract.parties.every(x => x.accepted)) {
            contract.status = 'celebrated';
            contract.celebrationDate = moment().format('DD-MM-YYYY');
        };
        this.contractService.accept(contract).subscribe(() => {
            this.onAccept.emit(contract);
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
            this.onRefuse.emit(contract);
        }, () => {
            let toast: Toast = {
                type: 'error',
                title: 'Ops!',
                body: 'Não foi possível efetuar essa ação!'
            };
            this.toasterService.pop(toast);
        });
    }

}
