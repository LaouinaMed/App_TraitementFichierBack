import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from '../keycloak/keycloak.service';
import { Observable } from 'rxjs';
import { Personne } from 'src/app/model/class/Personne';
import { environment } from 'src/environments/environment.development';
import { Produit } from 'src/app/model/class/produit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  constructor(private readonly http: HttpClient , private readonly keycloakService: KeycloakService){}

  getAllProduits(): Observable<Produit[]>{
    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.get<Produit[]>(`${environment.API_URL}api/produits`,{headers})
  }

  addProduit(obj : Produit): Observable<Produit >{
    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
    return this.http.post<Produit>(`${environment.API_URL}api/produits`, obj, {headers})
  }

  deleteProduitById(id: number): Observable<void> {
    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<void>(`${environment.API_URL}api/produits/${id}`, { headers });
  }

  updateProduits(id: number, obj: Produit): Observable<Produit> {
    const token = this.keycloakService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Produit>(`${environment.API_URL}api/produits/${id}`, obj, { headers });
  }

}
