import { Module } from '@nestjs/common';
import { ModelManagerService } from './modelManager.service';

@Module({
  providers: [ModelManagerService],
  exports: [ModelManagerService],
})
export class ModelManagerModule {}
