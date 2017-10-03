import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UrlPaths} from './constants/url-paths';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CreamUI';

  constructor(private router: Router) {
  }

  redirectUnlockWallet() {
    this.router.navigate([UrlPaths.ADD_WALLET]);
  }

  redirectBalances() {
    this.router.navigate([UrlPaths.BALANCES]);
  }

  redirectStakings() {
    this.router.navigate([UrlPaths.STAKINGS]);
  }

  redirectExchange() {
    this.router.navigate([UrlPaths.EXCHANGE]);
  }
}
