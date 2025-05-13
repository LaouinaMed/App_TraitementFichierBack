import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande/commande.service'; // Assurez-vous que le service existe
import { Commande } from 'src/app/model/class/commande';
import { Personne } from 'src/app/model/class/Personne'; // Assurez-vous que le modèle existe
import { Produit } from 'src/app/model/class/produit'; // Assurez-vous que le modèle existe
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService } from 'src/app/services/produit/produit.service';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {

  commandes: Commande[] = [];
  commandeObj: Commande = new Commande(); 
  filteredCommandes: Commande[] = [];
  searchQuery: string = '';  // Pour rechercher des commandes
  statutsDisponibles: string[] = [];  // Array pour stocker les statuts disponibles
  produitsDisponibles: Produit[] = [];
  userRoles: string[] = [];
  isAdmin: boolean = false;
  isUser_Edit_Statut: boolean = false;  
  modalInstance: bootstrap.Modal | null = null;
  selectedFile: File | null = null;

  


  constructor(private commandeService: CommandeService, private produitService: ProduitService , private keycloakService : KeycloakService // Injecter ProduitService
) {}

  ngOnInit(): void {
    this.loadCommandes();
    this.getUserRoles();
    this.loadStatutsDisponibles();
    this.loadProduitsDisponibles();
  }

  getUserRoles() {
    this.userRoles = this.keycloakService.getUserRoles();  

    if (this.userRoles.includes('client_admin')) {
      this.isAdmin = true;  
    }
    if (this.userRoles.includes('client_user_edit_statut')) {
      this.isUser_Edit_Statut = true;  
    }
  }

  loadCommandes() {
    this.commandeService.getAllCommandes().subscribe({
      next: (res: Commande[]) => {
        this.commandes = res;  
        this.filteredCommandes = res;  
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    });
  }
  
  

  loadProduitsDisponibles() {
    this.produitService.getAllProduits().subscribe({
      next: (produits: Produit[]) => {
        this.produitsDisponibles = produits;  
        console.log('Produits Disponibles:', this.produitsDisponibles);  
      },
      error: (error) => {
        console.error('Error fetching produits', error);
      }
    });
  }

  loadStatutsDisponibles() {
    this.commandeService.getStatutsDisponibles().subscribe({
      next: (statuts: string[]) => {
        this.statutsDisponibles = statuts; 
        console.log('Statuts Disponibles:', this.statutsDisponibles);  
      },
      error: (error) => {
        console.error('Error fetching statuts', error);
      }
    });
  }

  onSaveCommande() {
    if (this.commandeObj.id !== 0) {
      this.commandeService.updateCommande(this.commandeObj.id, this.commandeObj).subscribe({
        next: (res: Commande) => {
          alert('Commande mise à jour avec succès');
          this.loadCommandes(); 
          this.modalInstance?.hide();

        },
        error: (error) => {
          alert(error.error.error);
        }
      });
    } else {
      this.commandeService.addCommande(this.commandeObj).subscribe({
        next: (res: Commande) => {
          alert('Commande créée avec succès');
          this.loadCommandes(); 
          this.modalInstance?.hide();
        },
        error: (error) => {
          alert('Échec de la création de la commande');
        }
      });
    }
  }

  onDelete(id: number) {
    const isDelete = confirm('Êtes-vous sûr de vouloir supprimer cette commande ?');
    if (isDelete) {
      this.commandeService.deleteCommande(id).subscribe({
        next: () => {
          alert('Commande supprimée avec succès');
          this.loadCommandes();  
        },
        error: (error) => {
          alert('Échec de la suppression de la commande');
          console.error('Error during commande deletion', error);
        }
      });
    }
  }

  onSearch(): void {
    if (this.searchQuery) {
      this.filteredCommandes = this.commandes.filter(commande =>
        commande.personne.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        commande.produit.libeller.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        commande.statut.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredCommandes = [...this.commandes];  
    }
  }

    showCommandeModal() {
      const modalElement = document.getElementById('commandeModal');
      if (modalElement) {
        this.modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        this.modalInstance.show();
      }
    }
  
    openNewCommande() {
      this.commandeObj = new Commande();
      this.showCommandeModal();
    }

  onEdit(data: Commande) {
    this.commandeObj = { ...data };  
    this.showCommandeModal(); 

  }

  resetForm() {
    this.commandeObj = new Commande();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUploadFile(): void {
    if (this.selectedFile) {
      this.commandeService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Fichier uploadé avec succès', response);
          alert("Fichier uploadé avec succès");
          this.loadCommandes(); 
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          
          if (fileInput) {
            fileInput.value = ''; 
          }
        },
        error: (error) => {
          console.error("Erreur lors de l'upload du fichier", error);
          alert("Échec de l'upload du fichier");
        }
      });
    } else {
      alert("Veuillez sélectionner un fichier");
    }
  }

}
