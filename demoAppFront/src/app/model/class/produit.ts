export class Produit{
    id:number;

    libeller: string;

    quantite : number;

    prix : number;

    constructor(){
        this.id = 0;
        this.libeller = '';
        this.prix = 0;
        this.quantite = 0;
    }
}