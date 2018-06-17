import { Component, OnInit, Input} from '@angular/core';
import { User, Contract } from '../../../models';
@Component({
  selector: 'app-cue-modal',
  templateUrl: './cue-modal.component.html',
  styleUrls: ['./cue-modal.component.css']
})
export class CUEModalComponent implements OnInit {
    @Input() user: User;
    @Input() contract: Contract;
    @Input() selectedContract: Contract;
    @Input() part1: User;
    @Input() part2: User;
    public contractTitle: string = 'Contrato de União Estável';

    constructor() { }

    ngOnInit() {
    }

}
