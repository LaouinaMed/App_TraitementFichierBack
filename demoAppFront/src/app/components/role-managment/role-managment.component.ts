import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Personne } from 'src/app/model/class/Personne';
import { PersonneService } from 'src/app/services/personne/personne.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-role-managment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-managment.component.html',
  styleUrls: ['./role-managment.component.css']
})
export class RoleManagmentComponent {
  @Input() selectedUser: Personne | null = null;
  //@Input() userRoles: string[] = [];
  //@Input() availableRoles: string[] = [];; 
  
  userRoles: string[] = []; 
  availableRoles: string[] = [];  
  rolesToAdd: string[] = []; 


  
  personneService = inject(PersonneService);
  

  ngOnChanges() {
    if ( this.selectedUser) {
      this.selectedUser;
    }
  }
  
  viewRoles(user: Personne) {
    this.selectedUser = { ...user };  
    if (!user.keycloakId) {
      console.error("Erreur : Cet utilisateur n'a pas de Keycloak ID !");
      return;
    }
  
    this.personneService.getUserRolesByKeycloakId(user.keycloakId).subscribe({
      next: (roles) => {
        this.userRoles = roles;
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des rôles", error);
        this.userRoles = [];
      }
    });
  
    this.personneService.getAvailableRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
        this.rolesToAdd = [];  
        this.showRoleModal();  
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des rôles disponibles", error);
        this.availableRoles = [];
      }
    });
  }
  
  showRoleModal() {
    const modal = new bootstrap.Modal(document.getElementById('rolesModal')!);
    modal.show();
  }
    
    
  onRoleChange(role: string) {
    const index = this.rolesToAdd.indexOf(role);
    if (index === -1) {
      this.rolesToAdd.push(role);  
    } else {
      this.rolesToAdd.splice(index, 1);  
    }
  }
  
  addRolesToUser() {
    if (this.selectedUser && this.rolesToAdd.length > 0) {
      const roles = this.rolesToAdd.join(','); 
      this.personneService.assignRoleToUser(this.selectedUser.keycloakId!, roles).subscribe({
        next: () => {
          alert('Les rôles ont été attribués avec succès !');
          this.refreshUserRoles();  

        },
        error: (error) => {
          console.error("Erreur lors de l'attribution des rôles", error);
          alert('Une erreur s\'est produite lors de l\'attribution des rôles.');
        }
      });
    }
  }
  
  removeRoleFromUser(roleName: string) {
    if (this.selectedUser) {

      console.log(roleName)
      this.personneService.removeRoleFromUser(this.selectedUser.keycloakId!, roleName).subscribe({
        next: (response) => {
          alert('Le rôle a été supprimé avec succès!');
          this.refreshUserRoles();  

        },
        error: (error) => {
          console.error('Erreur lors de la suppression du rôle', error);
          alert('Une erreur s\'est produite lors de la suppression du rôle');
        }
      });
    }
  }
  
  refreshUserRoles() {
    if (this.selectedUser && this.selectedUser.keycloakId) {
      this.personneService.getUserRolesByKeycloakId(this.selectedUser.keycloakId).subscribe({
        next: (roles) => {
          this.userRoles = roles;  
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des rôles actualisés", error);
        }
      });
    }
  }

}
