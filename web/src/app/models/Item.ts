export class Item {
    public name: string = '';
    public value: number = 0;

    constructor(item?: any){
        if(item) Object.assign(this, item);
    }
}
