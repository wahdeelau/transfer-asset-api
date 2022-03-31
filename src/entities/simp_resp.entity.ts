import { ApiProperty } from '@nestjs/swagger';

export class SimpleResp {

  @ApiProperty({
    example: 'Success / Failed',
    description: 'Shows whether the transaction is success or failed',
  })
  result_status: string;
  

  @ApiProperty({
    example: '0xef3d5b3919d39bd794984ecc950664be17139793dcfbf9a7b83bfb4edd76abd0',
    description: 'Shows Transaction Hash',
  })
  transaction_hash: string;

  @ApiProperty({
    example: '0x1afA4017Ad4d0f6e6Ff722a7e83b19f347525B53',
    description: 'Wallet Address (Public Key)',
  })
  wallet_address: string;

  
  constructor(strResStatus : string, strTxnHash : string, strWalletAddr : string)
  {
        this.result_status = strResStatus;
        this.transaction_hash = strTxnHash;
        this.wallet_address = strWalletAddr;

  }


}
