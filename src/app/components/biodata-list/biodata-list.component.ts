import { Component, OnInit } from '@angular/core';
import { BiodataService } from 'src/app/serveices/biodata.service';

@Component({
  selector: 'app-biodata-list',
  templateUrl: './biodata-list.component.html',
  styleUrls: ['./biodata-list.component.css']
})
export class BiodataListComponent implements OnInit {
  biodataList: any[] = [];

  constructor(private biodataService: BiodataService) { }

  ngOnInit(): void {
    this.loadBiodata();
  }

  loadBiodata() {
    this.biodataService.getBiodataList().subscribe(response => {
      this.biodataList = response;
    });
  }
}
