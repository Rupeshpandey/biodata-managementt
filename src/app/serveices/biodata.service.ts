import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiodataService {
  private baseCreateUrl = 'https://localhost:7143/api/BioData/Create'; 
  private baseListUrl = 'https://localhost:7143/api/BioData/List';

  constructor(private http: HttpClient) {}

  createBiodata(biodata: FormData): Observable<any> {
    return this.http.post(`${this.baseCreateUrl}`, biodata);
  }

  getBiodataList(): Observable<any> {
    return this.http.get(`${this.baseListUrl}`);
  }
}
