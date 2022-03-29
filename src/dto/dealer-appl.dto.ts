import { IsInt, IsString, IsEnum, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';

export enum businessType  {
  SoleProp = 0,
  Partnership = 1,
  Corporation = 2
}

export class DealerApplDto {
  @ApiProperty({
    example: 'FORMS HK LIMITED',
    description: 'The name that is shown in the BR',
  })
  @IsString()
  readonly company_name_eng: string;

  @ApiProperty({
    example: '四方精创',
    description: '公司中文名称',
  })
  @IsString()
  readonly company_name_chi: string;

  @ApiProperty({
    example: "99999999 - 100",
    description: 'BR Number of the company',
  })
  @IsString()
  readonly br_num: string;

  @ApiProperty({
    example: '2021-05-13',
    description: 'Business Type',
  })
  @IsString()
  readonly expiry_date: string;

  @ApiProperty({
    example: '/mnt/d/dev/Projects/ogcio/git-clone/develop/OGCIO/1_node_swagger/ApplFiles/registration_cert.png',
    description: 'Application File Path',
  })
  @IsString()
  readonly appl_file_path: string;

  @ApiProperty({
    example: 'Floor G, Gravity, 29 Hing Yip Street, Kwun Tong, Kowloon, Hong Kong',
    description: 'Company Address',
  })
  @IsString()
  readonly company_address: string;
  
  @ApiProperty({
    example: 'SoleProp / Partnership / Corporation',
    description: 'Business Type',
  })
  @IsEnum(businessType)
  readonly business_type: businessType;
}
