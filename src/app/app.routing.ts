import {Routes, RouterModule} from '@angular/router';
import {AddWalletComponent} from './add-wallet/add-wallet.component';
import {BalancesComponent} from './balances/balances.component';
import {UrlPaths} from './constants/url-paths';
import {PrivateKeyGuard} from './page-guards/private-key.guard';
import {StakingsComponent} from './stakings/stakings.component';



export const appRoutes: Routes = [
    {path: UrlPaths.ADD_WALLET, component: AddWalletComponent},
    {path: UrlPaths.BALANCES, component: BalancesComponent, canActivate: [PrivateKeyGuard]},
    {path: UrlPaths.STAKINGS, component: StakingsComponent, canActivate: [PrivateKeyGuard]},
];
export const routes = RouterModule.forRoot(appRoutes);
