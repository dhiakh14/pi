import { Component, OnInit } from '@angular/core';
import { StatsDTO } from 'src/app/models/stats.model';
import { StatsService } from 'src/app/servicesEmira/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  stats?: StatsDTO;

  statusChart: any;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getStats().subscribe(data => {
      this.stats = data;
      this.initStatusChart(data.byStatus);
    });
  }

  initStatusChart(data: { [key: string]: number }) {
    const labels = Object.keys(data);
    const values = Object.values(data);

    this.statusChart = {
      series: values,
      chart: {
        type: 'donut',
        width: 500
      },
      labels: labels,
      plotOptions: {
        pie: {
          donut: {
            size: '50%'
          }
        }
      }
    };
  }

}
