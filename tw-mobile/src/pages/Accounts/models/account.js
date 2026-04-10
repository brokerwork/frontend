export class AccountModel{
  constructor(options){
    this.account = options.account;
    this.logo = options.logo;
    this.accountName = options.accountName;
    this.accountType = options.accountType;
    this.currency = options.currency;
    this.vendor = options.vendor;
    this.leverage = options.leverage;
    this.serverName = options.serverName;
    this.serverId = options.serverId;
    this.balance = options.balance;
  }
}