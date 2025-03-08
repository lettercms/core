import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationCodeDTO {
  @ApiProperty()
  email: string;
}
