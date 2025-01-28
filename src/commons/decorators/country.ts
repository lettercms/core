import * as requestIp from '@supercharge/request-ip';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as geoip from 'geoip-lite';

export const Country = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ip = requestIp.getClientIp(request);

    return geoip.lookup(ip)?.country ?? 'Unknown';
  },
);
