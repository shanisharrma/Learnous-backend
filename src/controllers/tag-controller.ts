import { NextFunction, Request, Response } from 'express';
import TagService from '../services/tag-service';
import { ResponseMessage } from '../utils/constants';
import { StatusCodes } from 'http-status-codes';
import { HttpError, HttpResponse } from '../utils/common';
import { AppError } from '../utils/error';

interface ISuggestionRequest extends Request {
    query: { q: string };
}

class TagController {
    private static tagService: TagService = new TagService();

    public static async showAll(req: Request, res: Response, next: NextFunction) {
        try {
            // * call tag service
            const response = await TagController.tagService.getAll();

            const tagResponse = response.map((tag) => tag.name);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, tagResponse);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async getSuggestions(req: Request, res: Response, next: NextFunction) {
        try {
            const { query } = req as ISuggestionRequest;

            const { q } = query;

            if (!q) {
                throw new AppError(ResponseMessage.QUERY_PARAMS_REQUIRED('q'), StatusCodes.BAD_REQUEST);
            }

            // * call tag service
            const response = await TagController.tagService.getAllSuggestions(q);

            const tagResponse = response.map((tag) => tag.name);

            HttpResponse(req, res, StatusCodes.OK, ResponseMessage.SUCCESS, tagResponse);
        } catch (error) {
            HttpError(
                next,
                error,
                req,
                error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}

export default TagController;
