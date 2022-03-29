import { Module } from '@nestjs/common';
import { TerraModule } from './terra/terra.module';
import { ConfigModule } from '@nestjs/config';
//import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TerraModule,ConfigModule.forRoot()],
})
export class AppModule {}
