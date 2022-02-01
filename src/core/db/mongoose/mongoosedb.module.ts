import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { databaseProviders } from './db.providers';
import { MongooseConfigService } from './mongoose.service';
// import { IdentityTmpSchema } from './../../../api/v1/vendor/facade/models/schemas';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService
    })
  ],
  providers: [],
  exports: []
})
export class MongoosedbModule {}
