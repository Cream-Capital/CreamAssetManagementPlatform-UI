import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AddWalletComponent } from './add-wallet/add-wallet.component';
import {routes} from './app.routing';
import { BalancesComponent } from './balances/balances.component';
import {SharedService} from './shared.service';
import {PrivateKeyGuard} from './page-guards/private-key.guard';
import { StakingsComponent } from './stakings/stakings.component';
import { ExchangeComponent } from './exchange/exchange.component';

@NgModule({
  declarations: [
    AppComponent,
    AddWalletComponent,
    BalancesComponent,
    StakingsComponent,
    ExchangeComponent
  ],
  imports: [
    BrowserModule,
    routes
  ],
  providers: [
    SharedService,
    PrivateKeyGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
