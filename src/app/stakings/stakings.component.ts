import {Component, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-stakings',
  templateUrl: './stakings.component.html',
  styleUrls: ['./stakings.component.css']
})
export class StakingsComponent implements OnInit {
  stakings = [];

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    const stakings = 4; // will be changed in the future after the contract is updated
    const address = this.sharedService.getAddress();
    for (let i = 0; i < stakings; i++) {
      this.sharedService.getCreamCashContract().methods.stakings(address, i).call({
        from: address
      }).then(function (staking) {
        this.stakings.push({value: staking, position: i});
      }.bind(this));
    }
  }

  unlock(position: number) {
    this.sharedService.sendCreamCashRawTransaction(this.sharedService.getCreamCashContract().methods.unlock(position).encodeABI());
  }

  stake(amount: number, days: number) {
    this.sharedService.sendCreamCashRawTransaction(this.sharedService.getCreamCashContract().methods.stake(amount * 100, days).encodeABI());
  }

  claimDividends() {
    this.sharedService.sendCreamCashRawTransaction(this.sharedService.getCreamCashContract().methods.claimDividends().encodeABI());
  }

}
