import { ICourseAttributes } from './course-types';

export interface ITagsAttributes {
    id?: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    tagCourses?: ICourseAttributes[];
}

export interface ICourseTagsAttributes {
    id?: number;
    tagId: number;
    courseId: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
