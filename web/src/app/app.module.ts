import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TabsModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProposalComponent } from './proposal/proposal.component';
import { RegisterComponent } from './register/register.component';
import { C2CComponent } from './c2-c/c2-c.component';
import { UserService } from './services/user.service';
import { ContractService } from './services/contract.service';

const appRoutes: Routes = [
    {path: '', component: ProposalComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'logout', component: ProposalComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'c2c', component: C2CComponent}
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        TabsModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        ProfileComponent,
        ProposalComponent,
        RegisterComponent,
        C2CComponent
    ],
    providers: [UserService, ContractService],
    bootstrap: [AppComponent]
})
export class AppModule { }
