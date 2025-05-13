import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Personne } from 'src/app/model/class/Personne';
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { PersonneService } from 'src/app/services/personne/personne.service';
import * as bootstrap from 'bootstrap';
import { RoleManagmentComponent } from '../role-managment/role-managment.component';


@Component({
  selector: 'app-personne',
  standalone: true,
  imports: [CommonModule, FormsModule, RoleManagmentComponent],
  templateUrl: './personne.component.html',
  styleUrls: ['./personne.component.css']
})
export class PersonneComponent implements OnInit {
  @ViewChild(RoleManagmentComponent) roleMangementComponent!: RoleManagmentComponent; // Référence au composant enfant

  personneObj: Personne = new Personne();
  personneList: Personne[] = [];

  filteredPersonnes: Personne[] = [];
  searchQuery: string = ''; 
  selectedFile: File | null = null;

  selectedUser: Personne | null = null; 
  
  userRoles: string[] = []; 

  availableRoles: string[] = [];  
  rolesToAdd: string[] = [];  

  modalInstance: bootstrap.Modal | null = null;






  personneService = inject(PersonneService);

  patterns = {
    nom: '^[A-Za-z]{2,}$',
    prenom: '^[A-Za-z]{2,}$',
    cin: '^[A-Z][A-Z0-9]\\d{5}$',  
    tel: '^(212[6-7]\\d{8}|0[67]\\d{8})$',  
    adresse: '^[A-Za-z0-9,\\.\\s-_]{5,}$',
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
};

  ngOnInit(): void {
    this.loadPersonnes();
    
  }

  


  loadPersonnes(){
    this.personneService.getAllPersonnes().subscribe(
      {
        next:(res : Personne[]) => {
          this.personneList =res;
          this.filteredPersonnes = res;
        },
        error: (error) =>{
          console.error('Error fetching personnes', error);

        }
      }
    )
  }


  
  resetForm(form: NgForm) {
    this.personneObj = new Personne();
  }

  onSavePersonne(form: NgForm){
    if(this.personneObj.id != null && this.personneObj.id !== 0){
      this.personneService.updatePersonne(this.personneObj.id, this.personneObj).subscribe(
        {
          next:(res : Personne) =>{
            alert("Personne mise à jour avec succès");
            this.loadPersonnes();
            this.modalInstance?.hide();
          },
          error: (error)=>{
            alert("Échec de la mise à jour de la personne");
          }
        }
      )
    }
    else{this.personneService.addPersonne(this.personneObj).subscribe(
      {
        next: (res: Personne)=>{
          alert("Personne créée avec succès");
          this.loadPersonnes(); 
          this.modalInstance?.hide();
        },
        error: (error)=>{
          alert("Échec de la création de la personne");
        }
      }
    )

    }
  }


  onDelete(id: number) {
    const isDelete = confirm("Are you sure you want to delete?");
    if (isDelete) {
      this.personneService.deletePersonneById(id).subscribe({
        next: () => {
          alert("Personne deleted successfully");
          this.loadPersonnes(); 
        },
        error: (error) => {
          alert("Personne deletion failed");
          console.error('Error during personne deletion', error);
        }
      });
    }
  }


  onEdit(data: Personne) {
    this.personneObj = { ...data };
    this.showPersonneModal(); 
  }


  onSearch(): void {
    if (this.searchQuery) {
      this.filteredPersonnes = this.personneList.filter(personne =>
        personne.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        personne.cin.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        personne.prenom.toLowerCase().includes(this.searchQuery.toLowerCase())||
        personne.adresse.includes(this.searchQuery)||
        personne.tel.includes(this.searchQuery)
      );
    } else {
      this.filteredPersonnes = [...this.personneList];  
    }
    console.log('Filtered list:', this.filteredPersonnes);
  }
  
  showPersonneModal() {
    const modalElement = document.getElementById('personneModal');
    if (modalElement) {
      this.modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      this.modalInstance.show();
    }
  }

  openNewPersonne() {
    this.personneObj = new Personne();
    this.showPersonneModal();
  }



  onSelectUser(user: Personne) {
    this.selectedUser = { ...user };  

    if (this.roleMangementComponent) {
      this.roleMangementComponent.viewRoles(this.selectedUser);
    }
  }


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
/*
  onUploadFile(): void {
    if (this.selectedFile) {
      this.personneService.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Fichier uploadé avec succès', response);
          alert("Fichier uploadé avec succès");
          this.loadPersonnes(); 
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
*/
  onImport(): void {
    this.personneService.importData().subscribe({
      next: (res) => {
        console.log('Données importées:', res);
    },
    error: (error) => {
        console.error('Erreur lors de l\'importation:', error);
    },
    complete: () => {
        console.log('Importation terminée.');
    }
    }); 
  }


  
}