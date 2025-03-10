import { Module } from '@nestjs/common';
import { FileManagerService } from './fileManager.service';

@Module({
  providers: [FileManagerService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
