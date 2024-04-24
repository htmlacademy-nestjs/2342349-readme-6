import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { ApplicationConfiguration } from './app/app.env';

export interface AppConfig {
  environment: string;
  port: number;
  defaultPostCountLimit: number;
  defaultPostContentLineCountLimit: number;
  defaultCommentCountLimit: number;
}

async function getAppConfig(): Promise<ApplicationConfiguration> {
  const config = plainToClass(ApplicationConfiguration, {
    environment: process.env.APP_ENVIRONMENT,
    port: parseInt(process.env.APP_PORT, 10),
    defaultPostCountLimit: parseInt(process.env.APP_DEFAULT_POST_COUNT_LIMIT, 10),
    defaultPostContentLineCountLimit: parseInt(process.env.APP_DEFAULT_POST_CONTENT_LINE_COUNT_LIMIT, 10),
    defaultCommentCountLimit: parseInt(process.env.APP_DEFAULT_COMMENT_COUNT_LIMIT, 10)
  });

  await config.validate();

  return config;
}

export default registerAs('application', async (): Promise<ConfigType<typeof getAppConfig>> => {
  return getAppConfig();
});
