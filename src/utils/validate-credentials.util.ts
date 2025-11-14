export const validateCredentials = (
  credentials: Record<string, string>
): boolean => {
  return Object.values(credentials).every((value) => {
    return value.trim() !== "";
  });
};
