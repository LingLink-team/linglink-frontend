import { AxiosResponse } from "axios";
import createAxiosInstance from "../utils/axiosInstance";

export class CourseService {
  static async createCourse(course: any): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/courses`,
      course
    );
    return response;
  }

  static async getCourse(courseId: string): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`
    );
    return response;
  }

  static async updateCourse(
    courseId: string,
    updatedCourseData: any
  ): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`,
      updatedCourseData
    );
    return response;
  }

  static async deleteCourse(courseId: string): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const response: AxiosResponse<any> = await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}`
    );
    return response;
  }

  static async getCourses(
    page: number,
    limit: number,
    filters?: any
  ): Promise<AxiosResponse<any>> {
    const axiosInstance = createAxiosInstance();
    const queryParams: any = {
      page: page,
      limit: limit,
    };

    // Sort Type
    const sortType: any = {
      price_down: {
        key: "price",
        type: "desc",
      },
      price_up: {
        key: "price",
        type: "asc",
      },
      student_down: {
        key: "student",
        type: "desc",
      },
      student_up: {
        key: "student",
        type: "asc",
      },
    };

    if (filters) {
      if (filters.name) queryParams.name = filters.name;
      if (filters.sort) {
        queryParams.sortField = sortType[filters.sort].key;
        queryParams.sortOrder = sortType[filters.sort].type;
      }
      if (filters.startDate) queryParams.startDate = filters.startDate;
      if (filters.priceRange) {
        queryParams.minPrice = filters.priceRange[0];
        queryParams.maxPrice = filters.priceRange[1];
      }
      if (filters.type) {
        let newFilters = Object.entries(filters.type)
          .filter(([key, value]) => value === true)
          .map(([key, value]) => key);
        queryParams.courseTypes = newFilters;
      }
    }
    const response: AxiosResponse<any> = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/courses`,
      {
        params: queryParams,
      }
    );
    return response;
  }
}
