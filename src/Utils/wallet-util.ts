import { LCDClient, MsgSend, MnemonicKey, RawKey,Wallet  } from '@terra-money/terra.js';
import { Logger } from '@nestjs/common';

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

    constructor()
    {
      this.strRawKey  = new RawKey(Buffer.from("eyJuYW1lIjoiZHJhZnNvbG5fdGVzdCIsImFkZHJlc3MiOiJ0ZXJyYTEycGNhazB0ZzA1NDU2ZWZxd2h5OGUzYzZzaHJweDAwcDR5ZXdnMCIsImVuY3J5cHRlZF9rZXkiOiIzMjNiMGFhNzlkY2FkOTgxOGRlMWFkNGUzZDQ2MWU0NTY2MWYyZDVlNDE2Mjk2OTA1MjZiYTM1OTg5ZGU1YzMxaEhkMlo4VDFjK0tqTTQvSEZ3MlJoNkhTUnlaamJ3Y0d5RENZRHMvdENlck9vaTEzN2Z4SXN6azJndzNabWlTRFVZa3NrUFY2NmhIQ3Q5STV2WG9vR0hpWjhrTDZNZUtmblU3WlorVWlCMFU9In0=","base64"));
    
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

  }