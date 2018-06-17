export class User {
    _id: string = '';
    name: string = '';
    cpf: string = '';
    username: string = '';
    rg: string = '';
    email: string = '';
    address: string = '';
    lat: number | undefined = undefined;
    lng: number | undefined = undefined;
    pubkey: string = '';
    pubkeyurl: string | undefined = undefined;
    wallet: string | undefined = undefined;
    phone: string = '';
    authid: string = '';
    verified: string = 'not verified';

    constructor(user?: any){
        if(user != undefined){
            Object.assign(this, user);
        }
    }
}
