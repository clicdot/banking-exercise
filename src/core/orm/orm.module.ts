import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmService } from './services/orm.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: OrmService
    })
  ],
  providers: []
})
export class OrmModule {}
