import { Component, OnInit, Input } from '@angular/core';

import { User, Contract } from '../../../models';

@Component({
  selector: 'app-cc-modal',
  templateUrl: './cc-modal.component.html',
  styleUrls: ['./cc-modal.component.css']
})
export class CCModalComponent implements OnInit {
    @Input() user: User;
    @Input() contract: Contract;
    @Input() selectedContract: Contract;
    @Input() part1: User;
    @Input() part2: User;
    public contractTitle: string = 'Contrato de Casamento';
  constructor() { }

  ngOnInit() {
  }

}
