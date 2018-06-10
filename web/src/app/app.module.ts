import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToasterModule } from 'angular2-toaster';
import { TabsModule, ModalModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';

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
import { CEVComponent } from './cev/cev.component';
import { ContractModalComponent } from './profile/contract-modal/contract-modal.component';
import { CUEComponent } from './cue/cue.component';
import { CCComponent } from './cc/cc.component';

const appRoutes: Routes = [
    {path: '', component: ProposalComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'logout', component: ProposalComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'c2c', component: C2CComponent},
    {path: 'cev', component: CEVComponent},
    {path: 'cue', component: CUEComponent},
    {path: 'cc', component: CCComponent}
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        HttpClientModule,
        BrowserAnimationsModule,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        ToasterModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        ProfileComponent,
        ProposalComponent,
        RegisterComponent,
        C2CComponent,
        CEVComponent,
        ContractModalComponent,
        CUEComponent,
        CCComponent
    ],
    providers: [UserService, ContractService],
    bootstrap: [AppComponent]
})
export class AppModule { }
