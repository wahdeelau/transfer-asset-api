import { IsInt, IsString, IsEnum, IsDate } from 'class-validator';
import {DealerApplDto} from './dealer-appl.dto'
import {sha256} from 'ethereum-cryptography/sha256';
import { ApiParam } from '@nestjs/swagger';


export class DealerChainDto {
  @IsString()
  readonly company_name_eng: string;

  @IsString()
  readonly company_name_chi: string;

  @IsString()
  readonly br_num: string;

  @IsString()
  readonly payload: string;

  @IsString()
  readonly payload_hash_hex: string;

  constructor(objDealerAppl : DealerApplDto, bufFileHash: Buffer)
  {
    let objChainPayload = {
      company_name_eng : objDealerAppl.company_name_eng,
      company_name_chi : objDealerAppl.company_name_chi,
      br_num : objDealerAppl.br_num,
      appl_file_hash : bufFileHash.toString("hex"),
      business_type : objDealerAppl.business_type,
      company_address : objDealerAppl.company_address,
      expiry_date : objDealerAppl.expiry_date
    };
    this.company_name_eng = objDealerAppl.company_name_eng;
    this.company_name_chi = objDealerAppl.company_name_chi;
    this.br_num = objDealerAppl.br_num;
    this.payload = JSON.stringify(objChainPayload);
    let buf = Buffer.from(this.payload, 'ascii');
    this.payload_hash_hex = sha256(buf).toString("hex");
  }
}
