import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface LivrableAlertDTO {
  title: string;
  projectName: string;
  dueDate: Date;
  daysLeft: number;
}
@Injectable({
  providedIn: 'root'
})
export class LivrableAlertService {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}
  private apiUrl = 'http://localhost:8085/livrable/api/Livrables'; 

  fetchAndShowAlerts(): void {
    this.http.get<LivrableAlertDTO[]>(`${this.apiUrl}/alerts/upcoming?days=3`)
      .subscribe(alerts => {
        alerts.forEach(alert => {
          const days = alert.daysLeft;
          const message = `🕒 ${alert.title} (Project: ${alert.projectName}) due in ${days} day(s)`;
  
          let toastClass = '';
          if (days <= 1) {
            toastClass = 'toast-red';
          } else if (days === 2) {
            toastClass = 'toast-orange';
          } else if (days === 3) {
            toastClass = 'toast-yellow';
          }
  
          this.toastr.show(message, '📢 Livrable Reminder', {
            toastClass,
            timeOut: 8000,
            positionClass: 'toast-bottom-right',
            progressBar: true,
            enableHtml: true,
          });
        });
      });
  }

}