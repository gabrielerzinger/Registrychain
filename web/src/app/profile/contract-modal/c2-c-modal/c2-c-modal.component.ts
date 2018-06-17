import { Component, OnInit, Input } from '@angular/core';

import { User, Contract } from '../../../models';

@Component({
  selector: 'app-c2-c-modal',
  templateUrl: './c2-c-modal.component.html',
  styleUrls: ['./c2-c-modal.component.css']
})
export class C2CModalComponent implements OnInit {
    @Input() user: User;
    @Input() contract: Contract;
    @Input() selectedContract: Contract;
    @Input() hired: User;
    @Input() hirer: User;
    public contractTitle: string = 'Contrato entre Pessoas Físicas';
  constructor() { }

  ngOnInit() {
  }

}
