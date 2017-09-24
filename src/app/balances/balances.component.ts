import {Component, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.css']
})
export class BalancesComponent implements OnInit {
  etherBallance: number;
  creamCashBallance: number;
  creamDividendsBallance: number;

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    const web3 = this.sharedService.getWeb3();
    const address = this.sharedService.getAddress();
    web3.eth.getBalance(address).then(function (ballance) {
      console.log(ballance);
      this.etherBallance = web3.utils.fromWei(ballance);
    }.bind(this));

    this.sharedService.getCreamCashContract().methods.balanceOf(address).call({
      from: address
    }).then(function (ballance) {
      this.creamCashBallance = ballance / 100;
    }.bind(this));

    this.sharedService.getCreamDividendsContract().methods.balanceOf(address).call({
      from: address
    }).then(function (ballance) {
      this.creamDividendsBallance = ballance / Math.pow(10, 8);
    }.bind(this));
  }

}
