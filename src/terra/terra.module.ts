import { Module } from '@nestjs/common';
import { TerraController } from './terra.controller';
import { TerraService } from './terra.service';

@Module({
  controllers: [TerraController],
  providers: [TerraService]
})
export class TerraModule {}
