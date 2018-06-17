import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-token-dialog',
  templateUrl: './token-dialog.component.html',
  styleUrls: ['./token-dialog.component.css']
})
export class TokenDialogComponent implements OnInit {
    public token: string = '';
    public tokenSubject: Subject<string> = new Subject<string>();

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {

    }

    sendToken(){
        this.tokenSubject.next(this.token);
    }

    public getToken(){
        return this.tokenSubject;
    }

}
