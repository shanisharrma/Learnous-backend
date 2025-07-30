import { Category, Course } from '../database/models';
import { ICategoryAttributes, ICategoryRequestBody, ICourseRequestBody, ICourseUpdateParams } from '../types';
import { ShowAllCoursesResponse } from './category-service';

export interface ICourseService {
    mostSelling: () => Promise<Course[]>;
    create: (data: ICourseRequestBody, file: Express.Multer.File, instructorId: number) => Promise<Course>;
    showAll: () => Promise<Course[]>;
    getOneWithAssociationsById: (id: number) => Promise<Course>;
    getOneWithAssociationsByIdAndInstructor: (id: number, instructorId: number) => Promise<Course>;
    getOneById: (id: number) => Promise<Course>;
    taughtCourses: (instructorId: number) => Promise<Course[]>;
    enrolledCourses: (studentId: number) => Promise<Course[]>;
    update: (courseId: number, instructorId: number, data: Partial<ICourseUpdateParams>) => Promise<void>;
    destroy: (courseId: number, instructorId: number) => Promise<void>;
}

export interface ICategoryService {
    create: (data: ICategoryRequestBody) => Promise<ICategoryAttributes>;
    getAll: () => Promise<Category[]>;
    getByName: (category: string) => Promise<Category | null>;
    showAllCourses: (categoryName: string) => Promise<ShowAllCoursesResponse>;
}
