import {Component, OnInit} from '@angular/core';
import {SharedService} from "../shared.service";

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {
  estimatedSellPrice: number;
  buyPriceInETH = 0;
  sellPriceInETH = 0;
  estimatedCreamCash: number;
  web3: any;

  constructor(private sharedService: SharedService) {
    this.web3 = this.sharedService.web3;

    this.sharedService.CDAXContract.methods.buyPriceInWei().call({
      from: this.sharedService.getAddress()
    }).then(function (buyPriceInWei) {
      this.buyPriceInETH = this.web3.utils.fromWei(buyPriceInWei);
    }.bind(this));

    this.sharedService.CDAXContract.methods.sellPriceInWei().call({
      from: this.sharedService.getAddress()
    }).then(function (sellPriceInWei) {
      this.sellPriceInETH = this.web3.utils.fromWei(sellPriceInWei);
    }.bind(this));
  }

  ngOnInit() {
  }

  buyCreamCash(amountInEther: number) {
    const amountInWei = this.web3.utils.toWei(amountInEther);
    console.log(amountInWei);
    this.sharedService.sendCDAXRawTransaction(amountInWei).then(console.log);
  }

  sellCreamCash(amount: number) {
    this.sharedService.sendCreamCashRawTransaction(this.sharedService.getCreamCashContract().methods.transfer(this.sharedService.CDAXAddress, amount * 100).encodeABI())
      .on('transactionHash', function (transactionHash) {
        console.log(transactionHash);
      }).then(console.log);
  }

  estimateCreamCashReceived(amount: number) {
    this.estimatedCreamCash = amount / this.buyPriceInETH;
  }

  estimateSellPriceInETH(amount: number) {
    this.estimatedSellPrice = this.sellPriceInETH * amount;
  }

}
