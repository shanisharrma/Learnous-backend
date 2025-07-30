import { StatusCodes } from 'http-status-codes';
import { TagRepository } from '../repositories';
import { ResponseMessage } from '../utils/constants';
import { AppError } from '../utils/error';
import { Course, Tag } from '../database/models';
import { Op } from 'sequelize';

class TagService {
    private tagRepository: TagRepository;

    constructor() {
        this.tagRepository = new TagRepository();
    }

    public async getAll() {
        try {
            const tags = await this.tagRepository.getAll({ raw: true });
            return tags;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAllSuggestions(query: string) {
        try {
            const suggestedTags = await this.tagRepository.getAll({
                where: { name: { [Op.iLike]: `%${query}%` } },
                limit: 5,
                order: [['name', 'ASC']],
            });
            return suggestedTags;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async processTags(tags: string[]) {
        try {
            const tagIds = [];

            // * loop through each tag and check tag exists or not if not create one
            for (const tagName of tags) {
                let tag = await this.tagRepository.getOne({ where: { name: tagName } });
                if (!tag) {
                    // ** Now create new tag record
                    tag = await this.tagRepository.create({ name: tagName });
                }
                tagIds.push(tag.id);
            }
            return tagIds;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAllByIds(ids: number[]): Promise<Tag[]> {
        try {
            const tags = await this.tagRepository.getAll({
                where: { id: ids },
                include: [{ model: Course, through: { attributes: [] }, as: 'tagCourses', required: false }],
            });
            return tags;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    public async destroyAllByIds(unusedIds: number[]) {
        try {
            await this.tagRepository.destroyAll({ where: { id: unusedIds } });
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(ResponseMessage.SOMETHING_WENT_WRONG, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default TagService;
