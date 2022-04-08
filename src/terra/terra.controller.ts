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

    @Get('/activate-cw20-poll')
    @ApiOperation({ summary: 'Poll Src Wallet', description: 'Poll Source Wallet and when account have respective CW20 token. \n 1) Transfer Luna from Gas wallet to Source wallet. \n 2) All CW20 with be transferred to destination account with defined gas fee in LUNA' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    //@ApiQuery({name: 'br_num'})
    @ApiQuery({name: 'contract_address'})    
    @ApiQuery({name: 'gas_luna'})
    @ApiQuery({name: 'to_address'}) 
    @ApiQuery({name: 'sleep_milli'}) 
    async activateCW20Poll(@Query('contract_address') strContractAddr :string, @Query('gas_luna') numGasFee : number, @Query('to_address')strToAddr : string,  @Query('sleep_milli')numSleepMilli: number) : Promise<string>{
      try{        
        Logger.debug("Activating Polling");
        if (numSleepMilli == undefined)
        {
          numSleepMilli = 1000;
        }
        else{
          Logger.debug("Sleep mili => " + numSleepMilli);
        }
        numGasFee = numGasFee * 1000000
        this.terraService.activateCW20Poll(strContractAddr, numGasFee, strToAddr, numSleepMilli);
        return "Polling "+ + "=> " + await this.terraService.getAddress();
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }

    @Get('/deactivate-cw20-poll')
    @ApiOperation({ summary: 'Stop Polling', description: 'Stop Polling' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })  
    async deactivateCW20Poll( ) : Promise<string>{
      try{        
        Logger.debug("Deactivate Polling");
        this.terraService.deactivateCW20Poll();
        return "Polling Stopped";
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }


    @Get('/activate-luna-poll')
    @ApiOperation({ summary: 'Poll Src Wallet', description: 'Poll Source Wallet and when account have luna, all luna with be transferred to destination account with defined gas fee in LUNA' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    //@ApiQuery({name: 'br_num'})    
    @ApiQuery({name: 'gas_luna'})
    @ApiQuery({name: 'to_address'}) 
    @ApiQuery({name: 'sleep_milli'}) 
    async activateLunaPoll(@Query('gas_luna') numGasFee : number, @Query('to_address')strToAddr : string,  @Query('sleep_milli')numSleepMilli: number) : Promise<string>{
      try{        
        Logger.debug("Activating Polling");
        if (numSleepMilli == undefined)
        {
          numSleepMilli = 1000;
        }
        else{
          Logger.debug("Sleep mili => " + numSleepMilli);
        }
        numGasFee = numGasFee * 1000000
        this.terraService.activateLunaPoll(numGasFee, strToAddr, numSleepMilli);
        return "Polling => " + await this.terraService.getAddress();
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }

    @Get('/deactivate-luna-poll')
    @ApiOperation({ summary: 'Stop Polling', description: 'Stop Polling' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })  
    async deactivateLunaPoll( ) : Promise<string>{
      try{        
        Logger.debug("Deactivate Polling");
        this.terraService.deactivateLunaPoll();
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

    @Get('/get-balance-cw20')
    @ApiOperation({ summary: 'Get Luna Balance', description: 'Get Luna Balance' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiQuery({name: 'contract_address'})    
    async getBalanceCW20(@Query('contract_address') strContractAddr :string ) : Promise<string>{
      try{        
        Logger.debug("Inside getBalance Controller");
        /*      
                                   
        let objWalletInfo : WalletInfoDto= await BesuHelper.createWallet(String(br_num) + " " + DPMSHelper.secretSalt);
        console.log(objWalletInfo);
        let objApplDtl : DealerApplDtl = await this.terraService.getApplDtl(objWalletInfo);
        return objApplDtl
        */
        return await this.terraService.getCW20Balance(strContractAddr);
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }

    @Get('/transfer-cw20')
    @ApiOperation({ summary: 'Transfer all cw20 Balance with stated gas (fixed)', description: 'Transfer all cw20 Balance with stated gas fee in LUNA' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiQuery({name: 'contract_address'}) 
    @ApiQuery({name: 'gas_luna'})   
    @ApiQuery({name: 'to_address'}) 
    async transfercw20(@Query('contract_address') strContractAddress : string, @Query('gas_luna') intGas :number, @Query('to_address')strToAddr : string ) : Promise<string>{
      try{        
        Logger.debug("Transferring " + strContractAddress + " to => " + strToAddr);
        
        intGas = intGas * 1000000;
        Logger.debug("intGas in uluna => " + intGas);
        /*      
                                   
        let objWalletInfo : WalletInfoDto= await BesuHelper.createWallet(String(br_num) + " " + DPMSHelper.secretSalt);
        console.log(objWalletInfo);
        let objApplDtl : DealerApplDtl = await this.terraService.getApplDtl(objWalletInfo);
        return objApplDtl
        */
        let strAmt : string = await this.terraService.transferCW20(strContractAddress, intGas, strToAddr);
        let strRes = strAmt + " of " + strContractAddress + " (minus gas) is transferred to " + strToAddr;
        return strRes;
      }
      catch (err)
      {
        Logger.debug(err);
      }
    }

    @Get('/transfer-luna-fixed')
    @ApiOperation({ summary: 'Transfer all Luna Balance with stated gas (fixed)', description: 'Transfer all Luna Balance with stated gas fee in LUNA' })
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
