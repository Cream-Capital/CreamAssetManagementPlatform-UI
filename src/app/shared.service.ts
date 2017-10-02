import {Injectable} from '@angular/core';
const Web3 = require('web3');
const creamCashJsonInterface = require('./constants/creamCash.json');
const creamDividendsJsonInterface = require('./constants/creamDividends.json');
const Tx = require('ethereumjs-tx');

@Injectable()
export class SharedService {
  account: any = null;
  web3: any;
  creamCashAddress = '0x0bB67cd015a54b87d5AEee976fF74ABa41adA09F';
  creamCashContract: any;
  creamDividendsAddress = '0x6c0BBd6c47395d83747418aEd7B4ebe5FAD08F5C';
  creamDividendsContract: any;
  privateKeyBuffer: any;
  gasLimit = '0x5B8D80';
  gasPrice = '0xBA43B7400';
  chainId = '0x4';

  constructor() {
    // TODO : use environment variables and don't hardcode addresses/urls
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/ETw0GZkwyCWpiOLpvHAw'));
  }

  setPrivateKey(privateKey: string) {
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.creamCashContract = new this.web3.eth.Contract(creamCashJsonInterface, this.creamCashAddress);
    this.creamDividendsContract = new this.web3.eth.Contract(creamDividendsJsonInterface, this.creamDividendsAddress);
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.slice(2);
    }
    this.privateKeyBuffer = Buffer.from(privateKey, 'hex');
  }

  setAccount(account) {
    this.account = account;
    this.creamCashContract = new this.web3.eth.Contract(creamCashJsonInterface, this.creamCashAddress);
    this.creamDividendsContract = new this.web3.eth.Contract(creamDividendsJsonInterface, this.creamDividendsAddress);
    this.privateKeyBuffer = Buffer.from(account.privateKey, 'hex');
  }

  sendCreamCashRawTransaction(data: string) {
    this.web3.eth.getTransactionCount(this.account.address).then(function (count) {
      const txParams = {
        gasLimit: this.gasLimit,
        chainId: this.chainId,
        to: this.creamCashAddress,
        gasPrice: this.gasPrice,
        nonce: this.web3.utils.toHex(count),
        data: data
      }
      const tx = new Tx(txParams);
      tx.sign(this.privateKeyBuffer);
      const serializedTx = tx.serialize()
      this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then(console.log);
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
