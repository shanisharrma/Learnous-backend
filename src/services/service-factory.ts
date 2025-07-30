import CategoryService from './category-service';
import CourseService from './course-service';
// import { ICategoryService, ICourseService } from './interfaces';

class ServiceFactory {
    private static instance: ServiceFactory;
    private categoryService: CategoryService | null = null;
    private courseService: CourseService | null = null;

    private constructor() {}

    public static getInstance(): ServiceFactory {
        if (!ServiceFactory.instance) {
            ServiceFactory.instance = new ServiceFactory();
        }
        return ServiceFactory.instance;
    }

    public getCategoryService(): CategoryService {
        if (!this.categoryService) {
            this.categoryService = new CategoryService(this.getCourseService.bind(this));
        }
        return this.categoryService;
    }

    public getCourseService(): CourseService {
        if (!this.courseService) {
            this.courseService = new CourseService(this.getCategoryService.bind(this));
        }
        return this.courseService;
    }
}

export default ServiceFactory;
