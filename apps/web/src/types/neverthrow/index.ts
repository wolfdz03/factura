export type CustomResult<T, E extends Error> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };
