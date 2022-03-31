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


    constructor(private readonly terraService: TerraService) {
      
    }

    @Get('/activate-poll')
    @ApiOperation({ summary: 'Poll Src Wallet', description: 'Poll Source Wallet and when account have luna, all luna with be transferred to destination account with defined gas fee in LUNA' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    //@ApiQuery({name: 'br_num'})    
    @ApiQuery({name: 'gas_luna'})
    @ApiQuery({name: 'to_address'}) 
    @ApiQuery({name: 'sleep_milli'}) 
    async activatePoll(@Query('gas_luna') numGasFee : number, @Query('to_address')strToAddr : string,  @Query('sleep_milli')numSleepMilli: number) : Promise<string>{
      try{        
        Logger.debug("Activating Polling");
        if (numSleepMilli = undefined)
        {
          numSleepMilli = 1000;
        }
        numGasFee = numGasFee * 1000000
        this.terraService.activateAssetPoll(numGasFee, strToAddr, numSleepMilli);
        return "Polling => " + await this.terraService.getAddress();
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }

    @Get('/deactivate-poll')
    @ApiOperation({ summary: 'Stop Polling', description: 'Stop Polling' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })  
    async deactivatePoll( ) : Promise<string>{
      try{        
        Logger.debug("Deactivate Polling");
        this.terraService.deactivateAssetPoll();
        return "Polling Stopped";
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }


    @Get('/get-address')
    @ApiOperation({ summary: 'Get Address', description: 'Get Address' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    //@ApiQuery({name: 'br_num'})    
    async getAddr( ) : Promise<string>{
      try{        
        Logger.debug("Inside getAddress Controller");
        return this.terraService.getAddress();
      }
      catch (err)
      {
        Logger.debug(err);
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
        return this.terraService.getNativeBalance();
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }

    @Get('/transfer-luna-fixed')
    @ApiOperation({ summary: 'Transfer all Luna Balance with stated gas adjustment', description: 'Transfer all Luna Balance with stated gas fee in LUNA' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiQuery({name: 'gas_luna'})   
    @ApiQuery({name: 'to_address'}) 
    async transferAllLuna(@Query('gas_luna') intGas :number, @Query('to_address')strToAddr : string ) : Promise<string>{
      try{        
        Logger.debug("Transferring all luna to => " + strToAddr);
        
        intGas = intGas * 1000000;
        Logger.debug("intGas in uluna => " + intGas);
        /*      
                                   
        let objWalletInfo : WalletInfoDto= await BesuHelper.createWallet(String(br_num) + " " + DPMSHelper.secretSalt);
        console.log(objWalletInfo);
        let objApplDtl : DealerApplDtl = await this.terraService.getApplDtl(objWalletInfo);
        return objApplDtl
        */
        let strAmt : string = await this.terraService.transferAllLunaFixed(intGas, strToAddr);
        let strRes = strAmt + " of Luna (minus gas) is transferred to " + strToAddr
        return strRes;
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }


}
