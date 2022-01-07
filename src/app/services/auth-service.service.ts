import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginModel } from '../models/Auth/loginModel';
import { RegisterModel } from '../models/Auth/registerModel';
import { SingleResponseModel } from '../models/Response/singleResponceMedol';
import { TokenModel } from '../models/Auth/tokenModel';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  apiUrl = environment.apiUrl+"auth/";

  constructor(private httpClient: HttpClient) { }

  register(user: RegisterModel) {
    return this.httpClient.post(this.apiUrl + "register", user);
  }

  login(user: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + "login", user);
  }

  logout(user: number): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + "logout", user);
  }

  async isAuthenticated(){
    if (localStorage.getItem("token")) {
      return await this.httpClient.get<boolean>(this.apiUrl + "isauth").toPromise()
        .then(res => { return res; })
        .catch(err => { return err; })
      
    } else {
      return false;
    }
    //return this.httpClient.get<ResponseModel>(this.apiUrl + "isauth");
  }
}
