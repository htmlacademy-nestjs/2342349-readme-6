import { Module } from '@nestjs/common';
import { FileConfigModule } from '@project/file-config';

@Module({
  imports: [
    FileConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
