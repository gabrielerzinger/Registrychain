import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    public user: {
        username: string,
        cpf: string,
        name: string,
        email: string,
        rg?: string,
        address?: string,
        lat?: number,
        lng?: number,
        pubkey: string,
        password: string
    } = {
        username: '',
        cpf: '',
        name: '',
        email: '',
        rg: '',
        address: '',
        pubkey: '',
        password: ''
    };

    constructor(public userService: UserService) { }

    ngOnInit() {
    }

    onSubmit(){
        this.user.username = this.user.cpf;
        this.userService.register(this.user).subscribe();
    }
}
