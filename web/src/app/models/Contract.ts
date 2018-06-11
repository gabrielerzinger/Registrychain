import { User } from './User';
import { Item } from './Item';
import { Address } from './Address';

export class Contract {
    public _id: string = '';
    public parties: Array<{
        user: User,
        role: string,
        accepted: boolean,
        parents?: {
            fatherName: string,
            motherName: string
        } | undefined;
    }> = [];
    public type: string = '';
    public description: string = '';
    public celebrationDate?: string | undefined = undefined;
    public status: string = 'pending'; // should be either 'pending' or 'celebrated'
    public item?: Item | undefined = undefined;
    public paymentMethod?: string | undefined = undefined;
    public address?: Address | undefined = undefined;


    constructor(contract?: any){
        if(contract) Object.assign(this, contract);
    }
}
