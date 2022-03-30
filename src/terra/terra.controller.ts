import { Body, Controller, Get, Param, Post,Query,Req } from '@nestjs/common';
import { LCDClient, MsgSend, MnemonicKey, RawKey,Wallet, Coins  } from '@terra-money/terra.js';
import {TerraService} from './terra.service';
import {TerraWallet} from '../Utils/wallet-util';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import {SimpleResp} from '../entities/simp_resp.entity'


@ApiBearerAuth()
@ApiTags('terra')
@Controller('terra')
export class TerraController {
    private readonly logger = new Logger(TerraController.name);
    private objWallet : TerraWallet = new TerraWallet();
    constructor(private readonly terraService: TerraService) {
      
    }


    @Get('/get-address')
    @ApiOperation({ summary: 'Get Address', description: 'Get Address' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    //@ApiQuery({name: 'br_num'})    
    async getAddr( ) : Promise<string>{
      try{        
        Logger.debug("Inside getAddress Controller");
        return this.objWallet.getAddress();
      }
      catch (err)
      {
        console.log()
      }
    }

    @Get('/get-balance')
    @ApiOperation({ summary: 'Get Luna Balance', description: 'Get Luna Balance' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    //@ApiQuery({name: 'br_num'})    
    async getBalance( ) : Promise<Coins>{
      try{        
        Logger.debug("Inside getBalance Controller");
        /*      
                                   
        let objWalletInfo : WalletInfoDto= await BesuHelper.createWallet(String(br_num) + " " + DPMSHelper.secretSalt);
        console.log(objWalletInfo);
        let objApplDtl : DealerApplDtl = await this.terraService.getApplDtl(objWalletInfo);
        return objApplDtl
        */
        return this.objWallet.getNativeBalance();
      }
      catch (err)
      {
        console.log()
      }
    }
}
