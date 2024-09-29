import { NextFunction, Request, Response } from 'express';
import { THttpError } from '../types';

class ErrorMiddleware {
    public static global(
        err: THttpError,
        _: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        __: NextFunction,
    ) {
        res.status(err.statusCode).json(err);
    }
}

export default ErrorMiddleware;
