import { IsInt, IsString, IsEnum, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';

export class DealerApplApprovalDto {

  @ApiProperty({
    example: "99999999 - 100",
    description: 'BR Number of the company',
  })
  @IsString()
  readonly br_num: string;

  @ApiProperty({
    example: "237877883272",
    description: 'Registration number generated ',
  })
  @IsString()
  readonly registration_no: string;


}
