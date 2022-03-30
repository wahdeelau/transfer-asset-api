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

    private strMnemonicPhrase : string = "satisfy adjust timber high purchase tuition stool faith fine install that you unaware feed domain license impose boss human eager hat rent enjoy dawn";

    constructor()
    {

      let strExKey :string = "eyJuYW1lIjoiZGF2Zm9ybXNoayIsImFkZHJlc3MiOiJ0ZXJyYTFhcmxqZjV5cnpqZHZ2dzZyenhteDdueWVwNDlrdnpoNXNweWozaCIsImVuY3J5cHRlZF9rZXkiOiJkM2MwMmNiYmJhOWM1ZjY5NWE2ZDhhN2VkY2RmNjg5ODZjNzZkYzQ4ZDUwZjhlZWE0NjdhNzdhMjBhNzMzNmFhRm5GeHUvdFBsRWpFRUx1UmI0MGRLRGpZVzRhY1c0T1lKUllXUUdNTm92M0xXcVNMNnNuK3h2Q1lEK2JERlZhLzVJdE9mVE9xREZZRXpJRGJ5Y0VUdi94OTJaVUUxaXBldWNxZS9PbWRFbE09In0="
      let strKey : ExportedTerraStationWallet = JSON.parse(Buffer.from(
        strExKey,
        "base64"
      ).toString("utf8"));

      let strDecryptKey : string = decrypt(strKey.encrypted_key, this.strPassword);
      this.strRawKey  = new RawKey(Buffer.from(strDecryptKey, "hex"));
/*
      this.strRawKey = new MnemonicKey({
        mnemonic: this.strMnemonicPhrase,
      });
      */

    
      this.objTerraConn  = new LCDClient({
        URL: 'http://localhost:1317',
        chainID: 'localTerra'
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

    async 
    

  }