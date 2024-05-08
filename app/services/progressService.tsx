import createAxiosInstance from "../utils/axiosInstance";

export class ProgressService {
  static async updateQuestion(questionId: string, isCorrect: boolean) {
    const req: any = {
      questionId: questionId,
      isCorrect: isCorrect,
    };
    const axiosInstance = createAxiosInstance();
    const result: any = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/progresses/question`,
      req
    );
    return result;
  }

  static async updateFlashcard(flashcardId: string, isRemember: boolean) {
    const req: any = {
      flashcardId: flashcardId,
      isRemember: isRemember,
    };
    const axiosInstance = createAxiosInstance();
    const result: any = await axiosInstance.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/progresses/flashcard`,
      req
    );
    return result;
  }

  static async getProgress(userId: string, date?: Date) {
    const params: any = {
      userId: userId,
      ...(date && { date: date }),
    };
    const axiosInstance = createAxiosInstance();
    const result: any = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/progresses`,
      {
        params: params,
      }
    );
    return result;
  }
}
