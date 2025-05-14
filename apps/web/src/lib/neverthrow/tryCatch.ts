import { CustomResult } from "@/types/neverthrow";

export async function tryCatch<T>(promise: Promise<T>): Promise<CustomResult<T, Error>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
