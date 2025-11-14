export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    return setTimeout(() => {
      return resolve();
    }, ms);
  });
};
