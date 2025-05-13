export class Personne {
    id: number;        
    cin: string;             
    nom: string;             
    prenom: string;          
    tel: string;       
    adresse: string;         
    email :string;
    keycloakId: string;
  
    constructor() {
      this.id = 0;      
      this.cin = '';         
      this.nom = '';          
      this.prenom = '';       
      this.tel = '';    
      this.adresse = '';      
      this.email="";
      this.keycloakId = '';
    }
  }
  