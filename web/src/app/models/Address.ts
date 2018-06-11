export class Address {
    public street: string = '';
    public number: number = 0;
    public neighborhood: string = '';
    public postalCode: string = '';
    public city: string = '';
    public state: string = '';

    constructor(address?: any){
        if(address) Object.assign(this, address);
    }
}
