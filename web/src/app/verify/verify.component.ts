import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService, Toast } from 'angular2-toaster';

import { User } from '../models';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
    public user: User = new User();
    @ViewChild('docForm') docForm: NgForm;
    public photo: File = null;
    public rg_front: File = null;
    public rg_back: File = null;

    constructor(public userService: UserService, public toasterService: ToasterService, public router: Router) {
        userService.userSubject.subscribe(u => {
            this.user = u;
        });
    }

    ngOnInit() {
    }

    onSubmit(){
        if(this.docForm.valid) {
            let formData: FormData = new FormData();
            formData.append('photo', this.photo, 'photo_'+this.user.cpf);
            formData.append('rg_front', this.rg_front, 'rg_front_'+this.user.cpf);
            formData.append('rg_back', this.rg_back, 'rg_back_'+this.user.cpf);
            console.log(this.photo);
            console.log(formData);
            this.userService.sendDocs(this.user, formData).subscribe(x => {
                let toast: Toast = {
                    type: 'success',
                    title: 'Successo!',
                    body: 'Obrigado por enviar seus documentos!'
                };
                this.toasterService.pop(toast);
                this.user.verified = 'pending';
                this.router.navigate(['/profile']);
            });
        } else {
            this.errToast('Anexe todos os arquivos!');
        }
    }

    errToast(msg: string){
        let toast: Toast = {
            type: 'error',
            title: 'Ops!',
            body: msg
        };
        this.toasterService.pop(toast);
    }
}
