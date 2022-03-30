import { LCDClient, MsgSend, MnemonicKey, RawKey,Wallet, Coins  } from '@terra-money/terra.js';
import { encrypt, decrypt } from "@terra-money/key-utils"
import { Logger } from '@nestjs/common';
import { Pagination } from '@terra-money/terra.js/dist/client/lcd/APIRequester';
//import * as CryptoJS from "crypto-js";

type ExportedTerraStationWallet = {
  name: string;
  address: string;
  encrypted_key: string;
};

/**
 * Wallet to handle terra related operations
 * @param seconds Number of seconds to sleep
 */
 export class TerraWallet {
    private readonly logger = new Logger(TerraWallet.name);

    private strRawKey : RawKey;
    // create a key out of a mnemonic

    private objTerraConn: LCDClient;

    private objWallet : Wallet = null;

    private strPassword : string = "";

    constructor()
    {
      /*
      let strExKey :string = "eyJuYW1lIjoiZHJhZnNvbG5fdGVzdCIsImFkZHJlc3MiOiJ0ZXJyYTEycGNhazB0ZzA1NDU2ZWZxd2h5OGUzYzZzaHJweDAwcDR5ZXdnMCIsImVuY3J5cHRlZF9rZXkiOiIzMjNiMGFhNzlkY2FkOTgxOGRlMWFkNGUzZDQ2MWU0NTY2MWYyZDVlNDE2Mjk2OTA1MjZiYTM1OTg5ZGU1YzMxaEhkMlo4VDFjK0tqTTQvSEZ3MlJoNkhTUnlaamJ3Y0d5RENZRHMvdENlck9vaTEzN2Z4SXN6azJndzNabWlTRFVZa3NrUFY2NmhIQ3Q5STV2WG9vR0hpWjhrTDZNZUtmblU3WlorVWlCMFU9In0="
      let strKey : ExportedTerraStationWallet = JSON.parse(Buffer.from(
        strExKey,
        "base64"
      ).toString("utf8"));

      let strDecryptKey : string = decrypt(strKey.encrypted_key, this.strPassword);
      this.strRawKey  = new RawKey(Buffer.from(strDecryptKey, "hex"));
*/
      this.strRawKey = new MnemonicKey({
        mnemonic: "satisfy adjust timber high purchase tuition stool faith fine install that you unaware feed domain license impose boss human eager hat rent enjoy dawn",
      });

    
      this.objTerraConn  = new LCDClient({
        URL: 'http://localhost:1317',
        chainID: 'localterra'
      });
      this.objWallet = this.objTerraConn.wallet(this.strRawKey);    
    }

    getAddress() : string
    {
      let strAddr : string = this.objWallet.key.accAddress;
      return strAddr;
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
    

  }