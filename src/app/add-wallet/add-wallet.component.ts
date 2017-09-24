import {Component, OnInit} from '@angular/core';
import {SharedService} from "../shared.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UrlPaths} from "../constants/url-paths";

const Tx = require('ethereumjs-tx');

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.css']
})
export class AddWalletComponent implements OnInit {
  message: string = null;
  initialPage: string = null;

  constructor(private sharedService: SharedService, private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.message = params['message'];
      this.initialPage = params['initialPage'];
    });
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = function (e) {
      // you can perform an action with readed data here
      console.log(myReader.result);
      // console.log(web3.eth.accounts.decrypt(myReader.result.toLowerCase(), 'Testpass1.', true)); // not working for now
    }

    myReader.readAsText(file);
  }

  processPrivateKey(privateKey: string) {
    if (!privateKey.startsWith('0x')) {
      privateKey = '0x' + privateKey;
    }
    this.sharedService.setPrivateKey(privateKey);
    if (this.initialPage != null) {
      this.router.navigate([this.initialPage]);
    } else {
      this.router.navigate([UrlPaths.BALANCES]);
    }
  }
}
