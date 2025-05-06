import { Component, OnInit } from '@angular/core';
import { Livrable } from 'src/app/common/livrable';
import { LivrableService } from 'src/app/servicesEmira/livrable.service';

@Component({
  selector: 'app-liv-per-proj',
  templateUrl: './liv-per-proj.component.html',
  styleUrls: ['./liv-per-proj.component.css']
})
export class LivPerProjComponent implements OnInit {
  groupedLivrables: { [projectName: string]: Livrable[] } = {};

  constructor(private livrableService: LivrableService) {}

  ngOnInit(): void {
    this.livrableService.getLivrablesGroupedByProject().subscribe((data) => {
      this.groupedLivrables = data;
    });
  }

}
