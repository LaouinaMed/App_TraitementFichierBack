import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink,RouterLinkActive,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'appDemoFront';
  constructor( private readonly keycloakService: KeycloakService) {}
  


  logout() {
    this.keycloakService.logout();  
  }

  isAdmin(): boolean {
    const roles = this.keycloakService.getUserRoles();
    return roles.includes('client_admin');  
  }
  
}
