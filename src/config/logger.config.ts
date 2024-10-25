import { ConfigService } from '@nestjs/config';

export const getLoggerConfig = async (configService: ConfigService) => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  const pinoHttp = {
    transport: isProduction
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
    level: isProduction ? 'info' : 'debug',
  };

  return { pinoHttp };
};
