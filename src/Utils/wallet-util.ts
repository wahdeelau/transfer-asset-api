import { LCDClient, MsgSend, MnemonicKey, RawKey,Wallet, Coins, Numeric,Fee  } from '@terra-money/terra.js';
import { encrypt, decrypt } from "@terra-money/key-utils"
import { Logger } from '@nestjs/common';
//import { Axios } from 'axios';


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

    
    // create a key out of a mnemonic

    private static objTerraConn: LCDClient = null;

    private static objWallet : Wallet = null;
    private static objWalletGas : Wallet = null;

    

    static initWallet()
    {
      let strPassword : string = "";

      let strMnemonicPhrase : string = "found apology cement response style hello arena course gasp fall cupboard canyon inner ceiling appear manual inside vehicle ill very hamster flower balance main";
      let strMnemonicPhraseGas : string = "purity mango pony situate satoshi plug dance hour patient uncover drift stool file humor oppose confirm melody copper sound come become slide scissors flight";
      let strRawKey : RawKey;
      let strRawKeyGas : RawKey;
      /*
      let strExKey :string = "eyJuYW1lIjoiZGF2Zm9ybXNoayIsImFkZHJlc3MiOiJ0ZXJyYTFhcmxqZjV5cnpqZHZ2dzZyenhteDdueWVwNDlrdnpoNXNweWozaCIsImVuY3J5cHRlZF9rZXkiOiI0MDRiZDg5NTI3N2IzMjVmNjJiM2ZhZWNlZTJiYzM4ODM3NDU3ZjFlNmVmYjMyMWFmYTRhZjdjMzZjOGE2YzJhU3JSanRWRGdBZzBEMXVEZm9Vcno4bWMyYnlNNEh5VGYxbUJPeG1tUzFDTUNkd2x1VTV5SnRUUFJDbncrT0hYQzZwMXNrcFpldEcrZUMrVzJ6dDFick9QRXY0Z2U0b1p4eGNJTUNFR2tRaDQ9In0="
      let strKey : ExportedTerraStationWallet = JSON.parse(Buffer.from(
        strExKey,
        "base64"
      ).toString("utf8"));

      let strDecryptKey : string = decrypt(strKey.encrypted_key, strPassword);
      strRawKey  = new RawKey(Buffer.from(strDecryptKey, "hex"));
        */
      strRawKey = new MnemonicKey({
        mnemonic: strMnemonicPhrase,
      });
      strRawKeyGas = new MnemonicKey({
        mnemonic: strMnemonicPhraseGas,
      });


/*
      //Local Terra
      this.objTerraConn  = new LCDClient({
        URL: 'http://localhost:1317',
        chainID: 'localterra'
      });
      */


      //Bombay Testnet
      this.objTerraConn  = new LCDClient({
        URL: 'https://bombay-lcd.terra.dev',
        chainID: 'bombay-12'
      });


      

/*
      //Columbus Mainnet
      this.objTerraConn  = new LCDClient({
        URL: 'https://lcd.terra.dev',
        chainID: 'columbus-5'
      });
      */

      
      

      this.objWallet = this.objTerraConn.wallet(strRawKey);    
      this.objWalletGas = this.objTerraConn.wallet(strRawKeyGas);  
    }



    static getLCDConnection() : LCDClient
    {
      if (this.objTerraConn == null)
      {
        this.initWallet();
      }
      return this.objTerraConn;
    }

    static getWallet() : Wallet
    {
      if (this.objWallet == null)
      {
        this.initWallet();
      }
      return this.objWallet;
    }

    static getWalletGas() : Wallet
    {
      if (this.objWalletGas == null)
      {
        this.initWallet();
      }
      return this.objWalletGas;
    }

    /*
    static async getGasPrice() : Promise<string>
    {
      let axios : Axios = new Axios();
      let objGasPrice = await axios.get("https://fcd.terra.dev/v1/txs/gas_prices");
      //let strGasPrice : string = objGasPrice.data;
      Logger.debug(objGasPrice);
      
      
      return "";
    }
    */
    


    

  }