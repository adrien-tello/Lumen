import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import apiRoutes from './routes';
import { notFound, errorHandler } from './middleware/error';

/** Builds and configures the Express application. */
export function createApp() {
  const app = express();

  // Security & parsing middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (!env.isProd) app.use(morgan('dev'));

  // API routes
  app.use('/api/v1', apiRoutes);

  // Error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
