import { Injectable } from '@nestjs/common';
import { LCDClient, MsgSend, MnemonicKey, RawKey,Wallet, Coins, Coin, Numeric,Fee, TxAPI  } from '@terra-money/terra.js';

import { Logger } from '@nestjs/common';
import {TerraWallet} from '../Utils/wallet-util';
import { Pagination } from '@terra-money/terra.js/dist/client/lcd/APIRequester';
import { sleepMilliSec } from '../Utils/sleep-util';

//import abi from '../../../2_contracts/artifacts/DealerApplDB_metadata.json';
//import dealerApplDBABI from '../../../2_contracts/artifacts/abiDB.json';
//import '../Utils/envSetter';

@Injectable()
export class TerraService {
  private readonly logger = new Logger(TerraService.name);

  private objWallet : Wallet  = null;
  private objTerraConn : LCDClient = null;
  private blnPolling : boolean = false;
  private intSleepTimeMilli : number = 1000;
  //private numGasFee : number = 0.1 * 1000000;

  constructor()
  {
    this.objWallet = TerraWallet.getWallet();
    this.objTerraConn = TerraWallet.getLCDConnection();
  }

  async activateAssetPoll(numGasFee : number, strToAddr : string, sleepMili : number)
  {
    this.intSleepTimeMilli = sleepMili;
    this.blnPolling = true;
    while (this.blnPolling)
    {
      let objCoins : Coins = await this.getNativeBalance();
      let objLuna : Coin = objCoins.get("uluna");
      
      if (objLuna != undefined)
      {
        let numAmt : number = objLuna.amount.toNumber();
        Logger.debug("Initiate uLuna Transfer of  => " + numAmt);
        await this.transferAllLunaFixed(numGasFee, strToAddr);
      }
      await sleepMilliSec(this.intSleepTimeMilli);
    }

                
  }

  async deactivateAssetPoll()
  {
    this.blnPolling = false;
                
  }


  async getAddress() : Promise<string>
  {
    return this.objWallet.key.accAddress;
  }

  async getNativeBalance() : Promise<Coins>
  {
    Logger.debug("inside get native balance")
    let objBal : Coins;
    let objPage : Pagination;
    [objBal, objPage] = await this.objTerraConn.bank.balance(this.objWallet.key.accAddress);
    Logger.debug(objBal)
    return objBal;
  }



  async transferAllLunaFixed(intAmt : number, strToAddr: string) : Promise<string>
  {
    let objBal : Coins;
    let objPage : Pagination;
    [objBal, objPage] = await this.objTerraConn.bank.balance(this.objWallet.key.accAddress);
    let objAmt : Numeric.Output = objBal.get("uluna").amount;
    Logger.debug("objAmt.toNumber() ==> " + objAmt.toNumber());
    objAmt = objAmt.sub(intAmt);
    let strPrincipalAmt = objAmt.toString();
    Logger.debug("strPrincipal ==> " + strPrincipalAmt);

    const msgSend = new MsgSend(
      this.objWallet.key.accAddress,
      strToAddr,
      { uluna: strPrincipalAmt }
    );
    
    let objFee = new Fee(intAmt, { uluna: intAmt });
    let objTx = await this.objWallet.createAndSignTx({ msgs: [msgSend], fee: objFee});
    
    let result = await this.objTerraConn.tx.broadcast(objTx);
    Logger.debug(result);
    return strPrincipalAmt;
  }


/***
 * TODO bugged and not working
 */
  async transferAllLunaMultiplier(intMultiplier : number, strToAddr: string) : Promise<string>
  {
    let objBal : Coins;
    let objPage : Pagination;
    [objBal, objPage] = await this.objTerraConn.bank.balance(this.objWallet.key.accAddress);
    let objAmt : Numeric.Output = objBal.get("uluna").amount;
    Logger.debug("objAmt.toNumber() ==> " + objAmt.toNumber());
    
    let strPrincipalAmt = objAmt.toString();
    Logger.debug("strPrincipal ==> " + strPrincipalAmt);

    const msgSend = new MsgSend(
      this.objWallet.key.accAddress,
      strToAddr,
      { uluna: strPrincipalAmt }
    );

    let objGasPrice : Coins.Input = "0.01133uluna";
    Logger.debug(objGasPrice);

    let objTx = await this.objWallet.createAndSignTx({ msgs: [msgSend], gasPrices: objGasPrice, gasAdjustment: intMultiplier});
    
    let result = await this.objTerraConn.tx.broadcast(objTx);
    Logger.debug(result);
    return strPrincipalAmt;
  }
  





}
