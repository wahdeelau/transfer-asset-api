import { IsInt, IsString, IsEnum, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';

export class DealerApplRejDto {

  @ApiProperty({
    example: "99999999 - 100",
    description: 'BR Number of the company',
  })
  @IsString()
  readonly br_num: string;

  @ApiProperty({
    example: "Test reject reason for dealer application.",
    description: 'Reject Reason for dealer application.',
  })
  @IsString()
  readonly rej_reason: string;


}
