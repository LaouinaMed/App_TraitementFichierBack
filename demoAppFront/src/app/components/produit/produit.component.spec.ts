import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ProduitComponent } from './produit.component';
import { ProduitService } from 'src/app/services/produit/produit.service';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';
import { of } from 'rxjs';
import { Produit } from 'src/app/model/class/produit';

fdescribe('ProduitComponent', () => {
  let component: ProduitComponent;
  let fixture: ComponentFixture<ProduitComponent>;
  let produitServiceSpy: jasmine.SpyObj<ProduitService>;
  let keycloakServiceSpy: jasmine.SpyObj<KeycloakService>;

  beforeEach(async () => {
    produitServiceSpy = jasmine.createSpyObj('ProduitService', [
      'getAllProduits',
      'deleteProduitById',
      'addProduit',
      'updateProduits'
    ]);
    keycloakServiceSpy = jasmine.createSpyObj('KeycloakService', ['getUserRoles']);

    await TestBed.configureTestingModule({
      imports: [ProduitComponent, FormsModule],
      providers: [
        { provide: ProduitService, useValue: produitServiceSpy },
        { provide: KeycloakService, useValue: keycloakServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitComponent);
    component = fixture.componentInstance;
    produitServiceSpy.getAllProduits.and.returnValue(of([]));
    keycloakServiceSpy.getUserRoles.and.returnValue(['client_admin']);
    fixture.detectChanges(); // déclenche ngOnInit()
  });

  it('should create the component and load produits', () => {
    expect(component).toBeTruthy();
    expect(produitServiceSpy.getAllProduits).toHaveBeenCalled();
    expect(component.isAdmin).toBeTrue();
  });

  it('should filter produits correctly with search query', () => {
    component.produitList = [
      { id: 1, libeller: 'Pomme', prix: 10, quantite: 5 },
      { id: 2, libeller: 'Banane', prix: 5, quantite: 10 }
    ] as Produit[];
    component.searchQuery = 'pom';
    component.onSearch();
    expect(component.filteredProduits.length).toBe(1);
    expect(component.filteredProduits[0].libeller).toContain('Pomme');
  });

  it('should reset produit object when openNewProduit is called', () => {
    component.produitObj = { id: 1, libeller: 'Test', prix: 50, quantite: 10 };
    component.openNewProduit();
    expect(component.produitObj.id).toBe(0); // reset
    expect(component.produitObj.libeller).toBe('');
    expect(component.produitObj.prix).toBe(0);
    expect(component.produitObj.quantite).toBe(0);
  });

  it('should call deleteProduitById and reload produits on confirm', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    produitServiceSpy.deleteProduitById.and.returnValue(of());
    produitServiceSpy.getAllProduits.and.returnValue(of([]));

    component.onDelete(1);
    tick();

    expect(produitServiceSpy.deleteProduitById).toHaveBeenCalledWith(1);
    expect(produitServiceSpy.getAllProduits).toHaveBeenCalled();
  }));

  it('should not call deleteProduitById if confirm is false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.onDelete(1);
    expect(produitServiceSpy.deleteProduitById).not.toHaveBeenCalled();
  });

  it('should call addProduit if id is null or zero', fakeAsync(() => {
    component.produitObj = { id: 0, libeller: 'Nouveau Produit', prix: 20, quantite: 3 };
    produitServiceSpy.addProduit.and.returnValue(
      of({ id: 1, libeller: 'Nouveau Produit', prix: 20, quantite: 3 })
    );
    produitServiceSpy.getAllProduits.and.returnValue(of([]));

    component.onSaveProduit({} as any);
    tick();

    expect(produitServiceSpy.addProduit).toHaveBeenCalled();
    expect(produitServiceSpy.getAllProduits).toHaveBeenCalled();
  }));

  it('should call updateProduits if id exists', fakeAsync(() => {
    component.produitObj = { id: 3, libeller: 'Produit Modifié', prix: 100, quantite: 4 };
    produitServiceSpy.updateProduits.and.returnValue(
      of({ id: 3, libeller: 'Produit Modifié', prix: 100, quantite: 4 })
    );
    produitServiceSpy.getAllProduits.and.returnValue(of([]));

    component.onSaveProduit({} as any);
    tick();

    expect(produitServiceSpy.updateProduits).toHaveBeenCalledWith(3, component.produitObj);
    expect(produitServiceSpy.getAllProduits).toHaveBeenCalled();
  }));
});
