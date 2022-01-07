import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListResponseModel } from '../models/Response/listResponseModel';
import { ResponseModel } from '../models/Response/responseModel';
import { StokBirim } from '../models/Entity/stokBirim';
import { StokRaf } from '../models/Entity/stokRaf';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StokSabitService {

  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  getStokRaf(fkDepo:number): Observable<ListResponseModel<StokRaf>> {
    let newUrl = this.apiUrl + "sabitler/getalldeporaf";
    let params = new HttpParams().set('fkDepo', fkDepo);
    return this.httpClient.get<ListResponseModel<StokRaf>>(newUrl,{params:params});
  }
  addStokRaf(raf: StokRaf): Observable<ResponseModel> {
    let newUrl = this.apiUrl + "sabitler/addraf";
    return this.httpClient.post<ResponseModel>(newUrl, raf);
  }

  getStokBirim(): Observable<ListResponseModel<StokBirim>> {
    let newUrl = this.apiUrl + "sabitler/getallbirim";
    return this.httpClient.get<ListResponseModel<StokBirim>>(newUrl);
  }
  
  addStokBirim(birim: StokBirim): Observable<ResponseModel> {
    let newUrl = this.apiUrl + "sabitler/addbirim";
    return this.httpClient.post<ResponseModel>(newUrl, birim);
  }
  updateStokBirim(birim: StokBirim): Observable<ResponseModel> {
    let newUrl = this.apiUrl + "sabitler/updatebirim";
    return this.httpClient.post<ResponseModel>(newUrl, birim);
  }

  getPdf(id:number,tur:number): Observable<any> {
    let newUrl = this.apiUrl + "sabitler/pdf";
    let params = new HttpParams().set('id', id).set('tur', tur);
    return this.httpClient.get<any>(newUrl,{params:params, responseType: 'arraybuffer' as 'json'}).pipe(
      map((result:any) => {
        this.downloadFile(result);
        return result;
      })
      );
  }

  downloadFile(data: BlobPart) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  
  

}
