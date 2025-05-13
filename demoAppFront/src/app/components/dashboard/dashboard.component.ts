import { Component, AfterViewInit } from '@angular/core';
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';  // Importer le plugin
import { Commande } from 'src/app/model/class/commande';
import { Personne } from 'src/app/model/class/Personne';
import { Produit } from 'src/app/model/class/produit';
import { CommandeService } from 'src/app/services/commande/commande.service';
import { PersonneService } from 'src/app/services/personne/personne.service';
import { ProduitService } from 'src/app/services/produit/produit.service';

// Enregistrer les composants nécessaires pour les graphiques circulaires
Chart.register(PieController, ArcElement, Tooltip, Legend, Title, ChartDataLabels);  // Enregistrer le plugin

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  {
  totalClients: number = 120;
  totalOrders: number = 450;
  totalProducts: number = 320;
  totalConfirmees: number = 0;
  totalRejetees: number = 0;

  constructor(private produitService: ProduitService, private commandeService: CommandeService, private personneService: PersonneService) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadProduits();
    this.loadCommandes();
  }

    loadProduits() {
      this.produitService.getAllProduits().subscribe({
        next: (produits: Produit[]) => {
          this.totalProducts = produits.length;  
        },
        error: (error) => {
          console.error('Erreur lors du chargement des produits', error);
        }
      });
    }

    loadClients(){
      this.personneService.getAllPersonnes().subscribe({
        next: (personnes: Personne[]) => {
          this.totalClients = personnes.length;  
        },
        error: (error) => {
          console.error('Erreur lors du chargement des personnes', error);
        }
      });
    }

    loadCommandes(){
      this.commandeService.getAllCommandes().subscribe({
        next:(commandes : Commande[])=>{
          this.totalOrders = commandes.length;
          this.totalConfirmees = commandes.filter(commande => commande.statut === 'CONFIRMEE').length;
          this.totalRejetees = commandes.filter(commande => commande.statut === 'REJETEE').length;
          console.log("dsds");

          this.createOrderStatusChart();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des commandes', error);
        }
      });
    }

  createOrderStatusChart(): void {
    const ctx = document.getElementById('orderStatusChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error("Canvas element not found");
      return;
    }
   
    const orderStatusChart = new Chart(ctx, {
      type: 'pie',  
      data: {
        labels: ['Commandes CONFIRMEE', 'Commandes REJETEE'],
        datasets: [{
          data: [this.totalConfirmees,this.totalRejetees],  
          backgroundColor: ['#28a745', '#dc3545'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw + ' Commandes';
              }
            }
          },
          datalabels: {
            formatter: (value: number, context: any) => {
              let total = context.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
              let percentage = ((value / total) * 100).toFixed(2);  
              return percentage + '%';  
            },
            color: '#fff',  
            font: {
              weight: 'bold',
              size: 16
            },
            anchor: 'center',
            align: 'center'
          }
        }
      }
    });
  }
}
