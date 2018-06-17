import { Component, OnInit, Input } from '@angular/core';

import { User, Contract } from '../../../models';

@Component({
  selector: 'app-cev-modal',
  templateUrl: './cev-modal.component.html',
  styleUrls: ['./cev-modal.component.css']
})
export class CEVModalComponent implements OnInit {
    @Input() user: User;
    @Input() contract: Contract;
    @Input() selectedContract: Contract;
    @Input() buyer: User;
    @Input() seller: User;
    public contractTitle: string = 'Contrato de Compra e Venda';
  constructor() { }

  ngOnInit() {
  }

}
