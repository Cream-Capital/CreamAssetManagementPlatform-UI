import {Injectable} from '@angular/core';
const Web3 = require('web3');
const creamCashJsonInterface = require('./constants/creamCash.json');
const creamDividendsJsonInterface = require('./constants/creamDividends.json');
const CDAXJsonInterface = require('./constants/CDAX.json');
const Tx = require('ethereumjs-tx');

@Injectable()
export class SharedService {
  account: any = null;
  web3: any;
  creamCashAddress = '0xD7653c1424d9b50765375e8208498674B0d247a2';
  creamCashContract: any;
  creamDividendsAddress = '0x4f69de3AA03a1cACFc3030a0D68D7566b66EFFf4';
  creamDividendsContract: any;
  CDAXAddress = '0x989D945f0f2F34b673b378a147A709B65Ee8B9Ca';
  CDAXContract: any;
  privateKeyBuffer: any;
  gasLimit = '0x5B8D80';
  gasPrice = '0xBA43B7400';
  chainId = '0x4';

  constructor() {
    // TODO : use environment variables and don't hardcode addresses/urls
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/ETw0GZkwyCWpiOLpvHAw'));
    this.creamCashContract = new this.web3.eth.Contract(creamCashJsonInterface, this.creamCashAddress);
    this.creamDividendsContract = new this.web3.eth.Contract(creamDividendsJsonInterface, this.creamDividendsAddress);
    this.CDAXContract = new this.web3.eth.Contract(CDAXJsonInterface, this.CDAXAddress);
  }

  setPrivateKey(privateKey: string) {
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.slice(2);
    }
    this.privateKeyBuffer = Buffer.from(privateKey, 'hex');
  }

  setAccount(account) {
    this.account = account;
    this.creamCashContract = new this.web3.eth.Contract(creamCashJsonInterface, this.creamCashAddress);
    this.creamDividendsContract = new this.web3.eth.Contract(creamDividendsJsonInterface, this.creamDividendsAddress);
    this.setPrivateKey(account.privateKey);
  }

  sendCreamCashRawTransaction(data: string) {
    return this.web3.eth.getTransactionCount(this.account.address).then(function (count) {
      const txParams = {
        gasLimit: this.gasLimit,
        chainId: this.chainId,
        to: this.creamCashAddress,
        gasPrice: this.gasPrice,
        nonce: this.web3.utils.toHex(count),
        data: data
      };
      const tx = new Tx(txParams);
      tx.sign(this.privateKeyBuffer);
      const serializedTx = tx.serialize();
      return this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    }.bind(this));
  }

  sendCDAXRawTransaction(value: number) {
    return this.web3.eth.getTransactionCount(this.account.address).then(function (count) {
      const txParams = {
        gasLimit: this.gasLimit,
        chainId: this.chainId,
        to: this.CDAXAddress,
        gasPrice: this.gasPrice,
        nonce: this.web3.utils.toHex(count),
        value: this.web3.utils.toHex(value)
      };
      const tx = new Tx(txParams);
      tx.sign(this.privateKeyBuffer);
      const serializedTx = tx.serialize();
      return this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
    }.bind(this));
  }

  isAccountPresent() {
    return this.account != null;
  }

  getAddress() {
    return this.account.address;
  }

  getWeb3() {
    return this.web3;
  }

  getCreamCashContract() {
    return this.creamCashContract;
  }

  getCreamDividendsContract() {
    return this.creamDividendsContract;
  }

  getPrivateKeyBuffer() {
    return this.privateKeyBuffer;
  }


}
