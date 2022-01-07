import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/Response/listResponseModel';
import { StokCikis } from '../models/Entity/stokCikis';
import { environment } from '../../environments/environment';
import { StokCikisDetay } from '../models/Entity/stokCikisDetay';
import { ResponseModel } from '../models/Response/responseModel';
import { StokCikisDetayDto } from '../models/Dto/stokCikisDetayDto';
import { StokCikisDto } from '../models/Dto/stokCikisDto';
import { AddStokCikisDto } from '../models/Dto/addStokCikisDto';
import { SingleResponseModel } from '../models/Response/singleResponceMedol';
import { StokIlacCikis } from '../models/Entity/stoIlacCikis';
import { OnayStokIlacCikisDto } from '../models/Dto/onayIlacCikisDto';

@Injectable({
  providedIn: 'root'
})
export class StokCikisService {

  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }


  stokCikisKaydet(stokCikis: StokCikis, stokCikisDetay: StokCikisDetay[]): Observable<SingleResponseModel<StokCikis>> {
    let newUrl = this.apiUrl + 'stokcikis/addstokcikis';
    let newParamas:AddStokCikisDto = {
      stokCikis: stokCikis,
      stokCikisDetay: stokCikisDetay
    }
    return this.httpClient.post<SingleResponseModel<StokCikis>>(newUrl, newParamas);
  }

  stokCikisOnayla(fkonay: number,islemNo: number, stokCikisDetay: StokCikisDetay[]): Observable<ResponseModel> {
    let newUrl = this.apiUrl + 'stokcikis/onaystokcikis';
    let newlist:StokCikisDetay[]=[];
    let newstokcikis:StokCikis={aciklama:"",fk_IstekDepo:0,fk_IsteyenDepo:0,fk_Login:fkonay,fk_OnayLogin:0,islemNo:islemNo,islemTarih:new Date(),islemTip:0,onayTarihi:new Date()}
    for(let item of stokCikisDetay){
      let s:StokCikisDetay={
        detayNo:item.detayNo,
        fk_StokKod:item.fk_StokKod,
        islemNo:item.islemNo,
        istenilen:item.istenilen,
        verilen:item.verilen
      }
      newlist.push(s);
    }
    let newParamas:AddStokCikisDto = {
      stokCikis: newstokcikis,
      stokCikisDetay: newlist
    }
    return this.httpClient.post<ResponseModel>(newUrl, newParamas);
  }

  ilacCikisOnay(stokCikis: StokCikis, stokilacCikisDetay: StokIlacCikis[]): Observable<SingleResponseModel<StokCikis>> {
    let newUrl = this.apiUrl + 'stokcikis/onayilaccikis';
    let newParamas:OnayStokIlacCikisDto = {
      stokCikis: stokCikis,
      stokIlacCikis: stokilacCikisDetay
    }
    return this.httpClient.post<SingleResponseModel<StokCikis>>(newUrl, newParamas);
  }
  // stokCikisGuncelle(stokCikis: StokCikis): Observable<ResponseModel> {
  //   let newUrl = this.apiUrl + 'stokcikis/update';
  //   return this.httpClient.post<ResponseModel>(newUrl, stokCikis);
  // }

  getStokCikis(): Observable<ListResponseModel<StokCikis>> {
    let newUrl = this.apiUrl + "stokcikis/getallcikis";
    return this.httpClient.get<ListResponseModel<StokCikis>>(newUrl);
  }

  getPastStokCikisByTarih(min: string, max: string, fkDepo?: number): Observable<ListResponseModel<StokCikis>> {
    let newUrl = this.apiUrl + "stokcikis/getallcikisbytarih";
    let params = new HttpParams()
      .set('fkDepo', fkDepo?fkDepo:0)
      .set('min', min)
      .set('max', max);

    return this.httpClient.get<ListResponseModel<StokCikis>>(newUrl, { params: params });
  }

  getOnaylanacak(min: string, max: string, istekDepo: number): Observable<ListResponseModel<StokCikisDto>> {
    let newUrl = this.apiUrl + "stokcikis/getonaylanacakbytarih";
    let params = new HttpParams()
      .set('istekDepo', istekDepo)
      .set('min', min)
      .set('max', max);

    return this.httpClient.get<ListResponseModel<StokCikisDto>>(newUrl, { params: params });
  }

  // getByFkLogin(fkLogin: number): Observable<ListResponseModel<StokCikis>> {
  //   let newUrl = this.apiUrl + "stokcikis/getallbylogin";
  //   let params = new HttpParams().set('fkLogin', fkLogin);
  //   return this.httpClient.get<ListResponseModel<StokCikis>>(newUrl, { params: params });
  // }

  // getByIslemNo(islemNo: number): Observable<ListResponseModel<StokCikis>> {
  //   let newUrl = this.apiUrl + "stokcikis/getcikisbyislemno";
  //   let params = new HttpParams().set('islemNo', islemNo);
  //   return this.httpClient.get<ListResponseModel<StokCikis>>(newUrl, { params: params });
  // }

  // getByFkOnaylayan(fkOnaylayan: number): Observable<ListResponseModel<StokCikis>> {
  //   let newUrl = this.apiUrl + "stokcikis/getallbyonaylayan";
  //   let params = new HttpParams().set('fkOnaylayan', fkOnaylayan);
  //   return this.httpClient.get<ListResponseModel<StokCikis>>(newUrl, { params: params });
  // }

  getCikisDetay(islemNo: number): Observable<ListResponseModel<StokCikisDetayDto>> {
    let newUrl = this.apiUrl + "stokcikis/getcikisdetay";
    let params = new HttpParams().set('islemNo', islemNo);
    return this.httpClient.get<ListResponseModel<StokCikisDetayDto>>(newUrl, { params: params });
  }
}
