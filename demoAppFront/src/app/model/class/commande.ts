import { Personne } from "./Personne";
import { Produit } from "./produit";

export class Commande {
    id: number;
    statut: string;
    quantite: number;
    montant: number;
    personne: Personne;
    produit: Produit;
  
    constructor() {
      this.id = 0;
      this.statut = 'statut';
      this.quantite = 0;
      this.montant = 0;
      this.personne = new Personne();
      this.produit = new Produit();
    }
  }