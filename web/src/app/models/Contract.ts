import { User } from './User';
import { Item } from './Item';

export class Contract {
    public _id: string = '';
    public parties: Array<{
        user: User,
        role: string,
        accepted: boolean,
    }> = [];
    public type: string = '';
    public description: string = '';
    public celebrationDate?: string | undefined = undefined;
    public status: string = 'pending'; // should be either 'pending' or 'celebrated'
    public item?: Item | undefined = undefined;
    public paymentMethod?: string | undefined = undefined;

    constructor(contract?: any){
        if(contract) Object.assign(this, contract);
    }
}
