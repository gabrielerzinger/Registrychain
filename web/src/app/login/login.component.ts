import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    public username: string;
    public password: string;

    constructor(public userService: UserService, public router: Router) { }

    ngOnInit() {
    }

    onSubmit(){
        this.userService.login(this.username, this.password).subscribe(undefined, err => console.log(err), () => {
            this.router.navigate(['/']);
        });
    }

}
