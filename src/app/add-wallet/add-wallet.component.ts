import {Component, OnInit} from '@angular/core';
import {SharedService} from "../shared.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UrlPaths} from "../constants/url-paths";
const Tx = require('ethereumjs-tx');
const _ = require("underscore");
const scryptsy = require('scrypt.js');
const crypto = require('crypto-browserify');
const Account = require("eth-lib/lib/account");
const utils = require('web3-utils');

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.css']
})
export class AddWalletComponent implements OnInit {
  message: string = null;
  initialPage: string = null;
  wallet: any = null;

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
    const web3 = this.sharedService.web3;
    myReader.onloadend = function (e) {
      // you can perform an action with readed data here
      this.wallet = myReader.result.toLowerCase();
    }.bind(this);

    myReader.readAsText(file);
  }

  unlockWallet(password: string) {
    const account = this.decrypt(this.wallet, password, true);
    this.sharedService.setAccount(account);
    this.redirectNextPage();
  }

  private redirectNextPage() {
    if (this.initialPage != null) {
      this.router.navigate([this.initialPage]);
    } else {
      this.router.navigate([UrlPaths.BALANCES]);
    }
  }

  processPrivateKey(privateKey: string) {
    this.sharedService.setPrivateKey(privateKey);
    this.redirectNextPage();
  }

  decrypt(v3Keystore, password, nonStrict) {
    /* jshint maxcomplexity: 10 */

    if (!_.isString(password)) {
      throw new Error('No password given.');
    }

    const json = (_.isObject(v3Keystore)) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

    if (json.version !== 3) {
      throw new Error('Not a valid V3 wallet');
    }

    let derivedKey;
    let kdfparams;
    if (json.crypto.kdf === 'scrypt') {
      kdfparams = json.crypto.kdfparams;

      // FIXME: support progress reporting callback
      derivedKey = scryptsy(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else if (json.crypto.kdf === 'pbkdf2') {
      kdfparams = json.crypto.kdfparams;

      if (kdfparams.prf !== 'hmac-sha256') {
        throw new Error('Unsupported parameters to PBKDF2');
      }

      derivedKey = crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
      throw new Error('Unsupported key derivation scheme');
    }

    const ciphertext = new Buffer(json.crypto.ciphertext, 'hex');

    const mac = utils.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext])).replace('0x', '');
    if (mac !== json.crypto.mac) {
      throw new Error('Key derivation failed - possibly wrong password');
    }

    const decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'));
    const seed = '0x' + Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('hex');

    return this.privateKeyToAccount(seed);
  }

  privateKeyToAccount(privateKey) {
    return this._addAccountFunctions(Account.fromPrivate(privateKey));
  }

  _addAccountFunctions = function (account) {
    const _this = this;

    // add sign functions
    account.signTransaction = function signTransaction(tx, callback) {
      return _this.signTransaction(tx, account.privateKey, callback);
    };
    account.sign = function sign(data) {
      return _this.sign(data, account.privateKey);
    };

    account.encrypt = function encrypt(password, options) {
      return _this.encrypt(account.privateKey, password, options);
    };


    return account;
  };
}
