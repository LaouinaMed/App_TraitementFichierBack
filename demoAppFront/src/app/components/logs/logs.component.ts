import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsErreur } from 'src/app/model/class/LogsErreur';
import { LogsService } from 'src/app/services/logs/logs.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent {

  logsList : LogsErreur[] =[];
  searchQuery: string = '';
  filteredLogs: LogsErreur[] = []; 

  currentPage: number = 0;
  pageSize: number = 12;
  totalLogs: number = 0;  
  totalPages: number = 0;

  logsService = inject(LogsService);

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.logsService.getLogs(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (res: any) => {
        this.logsList = res.content;  
        this.filteredLogs = this.logsList;
        this.totalLogs = res.totalElements;
        this.totalPages = res.totalPages;
      },
      error: (error) => {
        console.error('Error fetching logs', error);
      }
    });
  }

  onSearch(): void {
    this.loadLogs();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLogs();  
  }

}
