import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
registerLocaleData(localeTr);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PathNotFoundComponentComponent } from './components/path-not-found-component/path-not-found-component.component';
import { StokDepoComponent } from './components/stok-depo/stok-depo.component';
import { StokKartComponent } from './components/stok-kart/stok-kart.component';
import { StokCikisComponent } from './components/stok-cikis/stok-cikis.component';
import { IlacAramaDialogComponent } from './components/ilac-arama-dialog/ilac-arama-dialog.component';
import { GecmisSiparisDialogComponent } from './components/gecmis-siparis-dialog/gecmis-siparis-dialog.component';


import { MaterialModule } from './material/material.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { EmtyComponent } from './components/emty/emty.component';
import { RegisterComponent } from './components/register/register.component';
import { StokEkleComponent } from './components/stok-ekle/stok-ekle.component';
import { FaturaBilgiDialogComponent } from './components/fatura-bilgi-dialog/fatura-bilgi-dialog.component';
import { OrderByPipe } from './pipe/order-by.pipe';
import { ShowFilterPipe } from './pipe/show-filter.pipe';
import { DepoTumStokComponent } from './components/depo-tum-stok/depo-tum-stok.component';
import { IlacCikisComponent } from './components/ilac-cikis/ilac-cikis.component';
import { HastaKayitComponent } from './components/hasta-kayit/hasta-kayit.component';
import { GecmisFaturaDialogComponent } from './components/gecmis-fatura-dialog/gecmis-fatura-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    HomeComponent,
    LoginComponent,
    StokDepoComponent,
    PathNotFoundComponentComponent,
    StokKartComponent,
    StokCikisComponent,
    IlacAramaDialogComponent,
    GecmisSiparisDialogComponent,
    EmtyComponent,
    RegisterComponent,
    StokEkleComponent,
    FaturaBilgiDialogComponent,
    OrderByPipe,
    ShowFilterPipe,
    DepoTumStokComponent,
    IlacCikisComponent,
    HastaKayitComponent,
    GecmisFaturaDialogComponent
  ],
  entryComponents:[
    IlacAramaDialogComponent,
    GecmisSiparisDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'tr' },
    { provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
