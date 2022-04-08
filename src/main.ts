import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import './Utils/envSetter';



async function bootstrap() {

  let port : number = Number(process.env.PORT) || 15000;
  //let port : number = 15000;
  

  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Transfer Asset API (POC)')
    .setDescription('Transfer Asset API for Terra and EVM (POC)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  console.log(port);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
