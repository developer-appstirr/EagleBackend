import express, { Application, ErrorRequestHandler, Request, NextFunction, Response } from 'express';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import { ValidationError } from 'express-validation';

import { MulterError } from 'multer';
import swaggerUi from 'swagger-ui-express';

/* Require configuration */
import Configuration from './config';

/* Swagger Configuration */
import Swagger from './libraries/swagger';

/* Error factory for error response */
import ErrorFactory from './libraries/factories/error.factory';

/* Mapping errors for error response */
import RouteErrors from './libraries/mappings/errors/route.errors';

/* Require all routes */
import route from './routes';

/* Create Express Application */
const app: Application = express();

/**
 * Load all middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compress());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());
// configure logger if in development
if (Configuration.ENV === 'development') {
  app.use(logger('dev'));
}

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(Swagger));
app.use('/api/v1', route);

/**
 * If requested route does not exist
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = ErrorFactory.getError(RouteErrors.ROUTE_NOT_FOUND);
  next(error);
});

/**
 * GLOBAL ERROR HANDLER
 * this is a global error handler to catch all errors and pass it to next middleware
 * to pass a custom error to this handler from any route call next(error)
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let finalError = err;
  /* Validation Error */
  if (finalError instanceof ValidationError) {
    /**
     * Handling on flattened validation error
     * make sure to use custom validation middleware in middleware dir
     * or to set keyByField to true if using validate middleware directly
     * or change this handling to handle detailed Validation error
     * See: https://www.npmjs.com/package/express-validation
     */
    // deep clone whole error
    const ROUTE_VALIDATION_FAILED = {
      ...RouteErrors.ROUTE_VALIDATION_FAILED,
    };

    const validationDetailArray = finalError.details as any;

    ROUTE_VALIDATION_FAILED.message = validationDetailArray[0][Object.keys(validationDetailArray[0])[0]];
    finalError = ErrorFactory.getError(ROUTE_VALIDATION_FAILED);
  }

  if (finalError instanceof MulterError) {
    /**
     * Handling on flattened multer validation error
     * make sure to use custom validation middleware in middleware dir
     * or to set keyByField to true if using validate middleware directly
     * or change this handling to handle detailed multer Validation error
     * See: https://www.npmjs.com/package/multer
     */
    // deep clone whole error
    const ROUTE_VALIDATION_FAILED = {
      ...RouteErrors.ROUTE_VALIDATION_FAILED,
    };
    ROUTE_VALIDATION_FAILED.message = finalError.message;
    finalError = ErrorFactory.getError(ROUTE_VALIDATION_FAILED);
  }
  /* Unexpected Error */
  if (finalError.name !== 'APIError') {
    // log this error since this is an unexpected error that we didn't created ourself
    console.error('SYSTEM ERROR: ', finalError);
    finalError = ErrorFactory.getError();
  }
  next(finalError);
});

/**
 * This middleware sends error response back to user that is formatted by previous user
 * stack trace is sent only when the system is running in development mode
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode).json({
    status: false,
    statusCode: err.statusCode,
    messageKey: err.messageKey,
    message: err.message,
    data: {},
    stack: Configuration.ENV === 'development' ? err.stack : {},
  });
});

export default app;
