import { Injectable } from '@nestjs/common';
import { LCDClient, MsgSend, MnemonicKey, RawKey,Wallet, Coins, Coin, Numeric,Fee, TxAPI,MsgExecuteContract } from '@terra-money/terra.js';

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
  private objWalletGas : Wallet  = null;
  private objTerraConn : LCDClient = null;
  private blnPollingLuna : boolean = false;
  private blnPollingCW20 : boolean = false;
  private intSleepTimeMilli : number = 0;
  private intSequence : number = null;
  //private numGasFee : number = 0.1 * 1000000;

  constructor()
  {
    this.objWallet = TerraWallet.getWallet();
    this.objWalletGas = TerraWallet.getWalletGas();
    this.objTerraConn = TerraWallet.getLCDConnection();
  }

  async activateCW20Poll(strContractAddress: string, numGasFee : number, strToAddr : string, sleepMili : number)
  {
    this.intSleepTimeMilli = sleepMili;
    this.blnPollingCW20 = true;
    while (this.blnPollingCW20)
    {
      let strBal : string = await this.getCW20Balance(strContractAddress);
      Logger.debug("getting "+ strContractAddress +" Balance  => " + strBal);
      if (strBal != "0")
      {
        Logger.debug("Initiate uLuna Transfer of  => " + strBal);
        await this.transferLunaGas(numGasFee, this.objWallet.key.accAddress);
        await this.transferCW20(strContractAddress, numGasFee, strToAddr);
      }
      await sleepMilliSec(this.intSleepTimeMilli);
    }

                
  }

  async deactivateCW20Poll ()
  {
    this.blnPollingCW20 = false;
                
  }

  async activateLunaPoll(numGasFee : number, strToAddr : string, sleepMili : number)
  {
    this.intSleepTimeMilli = sleepMili;
    this.blnPollingLuna = true;
    while (this.blnPollingLuna)
    {
      let objCoins : Coins = await this.getNativeBalance();
      let objLuna : Coin = objCoins.get("uluna");
      Logger.debug("getting Luna Balance  => " + objLuna);
      if (objLuna != undefined)
      {
        let numAmt : number = objLuna.amount.toNumber();
        Logger.debug("Initiate uLuna Transfer of  => " + numAmt);

        await this.transferAllLunaFixed(numGasFee, strToAddr);
      }
      await sleepMilliSec(this.intSleepTimeMilli);
    }

                
  }

  async deactivateLunaPoll ()
  {
    this.blnPollingLuna = false;
                
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

  async getCW20Balance(strContractAddr : string ) : Promise<string>
  {
    Logger.debug("inside get CW20 balance => " + strContractAddr)
    let response : any = await this.objTerraConn.wasm.contractQuery(strContractAddr, { balance: { address: this.objWallet.key.accAddress }});
    Logger.debug(response.balance);
    return response.balance;
  }



  async transferAllLunaFixed(intAmt : number, strToAddr: string) : Promise<string>
  {
    let objBal : Coins;
    let objPage : Pagination;
    let strPrincipalAmt = "Balance is Zero";
    [objBal, objPage] = await this.objTerraConn.bank.balance(this.objWallet.key.accAddress);
    Logger.debug(objBal);
    if (objBal.get("uluna") != undefined)
    {
      let objAmt : Numeric.Output = objBal.get("uluna").amount;
      Logger.debug("objAmt.toNumber() ==> " + objAmt.toNumber());
      objAmt = objAmt.sub(intAmt);
      strPrincipalAmt = objAmt.toString();
      Logger.debug("strPrincipal ==> " + strPrincipalAmt);
  
      const msgSend = new MsgSend(
        this.objWallet.key.accAddress,
        strToAddr,
        { uluna: strPrincipalAmt }
      );
      
      let objFee = new Fee(106000,{ uluna: intAmt });
      let gasprices = {"uluna":intAmt};
  
      //Logger.debug("sequence before => " + await this.objWallet.sequence());
      let objTx = await this.objWallet.createAndSignTx({ msgs: [msgSend],fee: objFee});
      //Logger.debug("sequence before broadcast => " + await this.objWallet.sequence());
      let result = await this.objTerraConn.tx.broadcastSync(objTx);
      await this.adhocWaitSequence( await this.objWallet.sequence());
      //Logger.debug("sequence after => " + await this.objWallet.sequence());
      
      Logger.debug(result);
    }
    
    return strPrincipalAmt;
  }

  async transferLunaGas(intAmt : number, strToAddr: string) : Promise<string>
  {
    let strPrincipalAmt = "Balance is Zero";


      strPrincipalAmt = intAmt.toString();
      Logger.debug("strPrincipal ==> " + strPrincipalAmt);
  
      const msgSend = new MsgSend(
        this.objWalletGas.key.accAddress,
        strToAddr,
        { uluna: strPrincipalAmt }
      );
      
      let objFee = new Fee(106000,{ uluna: intAmt });
      let gasprices = {"uluna":intAmt};
  
      //Logger.debug("sequence before => " + await this.objWallet.sequence());
      let objTx = await this.objWalletGas.createAndSignTx({ msgs: [msgSend],fee: objFee});
      //Logger.debug("sequence before broadcast => " + await this.objWallet.sequence());
      let result = await this.objTerraConn.tx.broadcastSync(objTx);
      await this.adhocWaitSequenceGas( await this.objWalletGas.sequence());
      //Logger.debug("sequence after => " + await this.objWallet.sequence());
      
      Logger.debug(result);

    
    return strPrincipalAmt;
  }

  async transferCW20(strContractAddress: string, intAmt : number, strToAddr: string) : Promise<string>
  {
    let strPrincipalAmt = "Balance is Zero";
    let response : any = await this.objTerraConn.wasm.contractQuery(strContractAddress, { balance: { address: this.objWallet.key.accAddress }});
    if (response.balance != "0")
    {
      strPrincipalAmt = response.balance;
      let cw20Send = new MsgExecuteContract(
        this.objWallet.key.accAddress,
        strContractAddress,
        {
          transfer: {
            amount: strPrincipalAmt,
            recipient: strToAddr,
          },
        }
      );
      
      let objFee = new Fee(200000,{ uluna: intAmt });
      let gasprices = {"uluna":intAmt};
  
      //Logger.debug("sequence before => " + await this.objWallet.sequence());
      let objTx = await this.objWallet.createAndSignTx({ msgs: [cw20Send], fee: objFee});
      //Logger.debug("sequence before broadcast => " + await this.objWallet.sequence());
      //let gasEstimate = await this.objTerraConn.tx.estimateGas(objTx);
      //Logger.debug(gasEstimate);
      let result = await this.objTerraConn.tx.broadcastSync(objTx);
      await this.adhocWaitSequence( await this.objWallet.sequence());
      //Logger.debug("sequence after => " + await this.objWallet.sequence());
      
      Logger.debug(result);
    }
    
    return strPrincipalAmt;
  }

  async adhocWaitSequenceGas(intSequence : number)
  {
    //for (let i = 0; i < 9999999; i++)
    while(true)
    {
      Logger.debug("waiting for sequence change");
      if (await this.objWalletGas.sequence() == intSequence + 1)
      {
        return;
      }
    }
    

  }


  async adhocWaitSequence(intSequence : number)
  {
    //for (let i = 0; i < 9999999; i++)
    while(true)
    {
      Logger.debug("waiting for sequence change");
      if (await this.objWallet.sequence() == intSequence + 1)
      {
        return;
      }
    }
    

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
