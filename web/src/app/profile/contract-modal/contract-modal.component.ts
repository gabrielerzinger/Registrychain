import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnChanges} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService, Toast } from 'angular2-toaster';
import * as moment from 'moment';
import { Subject } from 'rxjs';

import { Contract, User } from '../../models';
import { ContractService } from '../../services/contract.service';

@Component({
  selector: 'app-contract-modal',
  templateUrl: './contract-modal.component.html',
  styleUrls: ['./contract-modal.component.css']
})
export class ContractModalComponent implements OnInit, OnChanges {

    @Input() user: User;
    @Input() selectedContract: Contract;
    @Input() selectedPart1: User;
    @Input() selectedPart2: User;
    @ViewChild('contractModal') contractModal: ModalDirective;
    public contractTitle: string = 'Contrato';


    constructor(public contractService: ContractService, public toasterService: ToasterService) { }

    ngOnInit() {
    }

    show(){
        this.contractModal.show();
    }

    ngOnChanges(){
        if(!this.selectedContract) return;
        switch(this.selectedContract.type){
          case 'c2c':
            this.contractTitle = 'Contrato entre Pessoas Físicas';
            break;
          case 'cev':
            this.contractTitle = 'Contrato de Compra & Venda';
            break;
          case 'cue':
            this.contractTitle = 'Contrato de União Estável';
            break;
          case 'cc':
            this.contractTitle = 'Contrato de Casamento';
            break;
        }
    }

}
