import {Injectable} from '@angular/core';
import {
    CanActivate, Router, ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import {SharedService} from '../shared.service';
import {UrlPaths} from '../constants/url-paths';
@Injectable()
export class PrivateKeyGuard implements CanActivate {

    constructor(private router: Router, private configService: SharedService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.configService.isAccountPresent()) {
            this.router.navigate([UrlPaths.ADD_WALLET, {message: 'Sorry, this page requires a wallet.', initialPage: route.url[0]}]);
        }
        return this.configService.isAccountPresent();
    }

}
