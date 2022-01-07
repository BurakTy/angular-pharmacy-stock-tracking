import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepoTumStokComponent } from './components/depo-tum-stok/depo-tum-stok.component';
import { EmtyComponent } from './components/emty/emty.component';
import { HastaKayitComponent } from './components/hasta-kayit/hasta-kayit.component';
import { HomeComponent } from './components/home/home.component';
import { IlacCikisComponent } from './components/ilac-cikis/ilac-cikis.component';
import { LoginComponent } from './components/login/login.component';
import { PathNotFoundComponentComponent } from './components/path-not-found-component/path-not-found-component.component';
import { RegisterComponent } from './components/register/register.component';
import { StokCikisComponent } from './components/stok-cikis/stok-cikis.component';
import { StokDepoComponent } from './components/stok-depo/stok-depo.component';
import { StokEkleComponent } from './components/stok-ekle/stok-ekle.component';
import { StokKartComponent } from './components/stok-kart/stok-kart.component';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate:[LoginGuard],
    children: [
      { path: '', pathMatch:"full", component: HomeComponent},
      { path: 'stokdepo', component: StokDepoComponent },
      { path: 'stokkart', component: StokKartComponent },
      { path: 'stokcikis', component: StokCikisComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'stokekle', component: StokEkleComponent},
      { path: 'stokgoster', component: DepoTumStokComponent},
      { path: 'ilaccikis', component: IlacCikisComponent},
      { path: 'hastakayit', component: HastaKayitComponent},
      { path: 'emty', component: EmtyComponent },
    ],
    
  },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PathNotFoundComponentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
