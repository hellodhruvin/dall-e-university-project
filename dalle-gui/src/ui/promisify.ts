export function promisify<T>(func: (...args: any[]) => void): (...args: any[]) => Promise<T> {
  return function(...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      func(...args, (err: Error | null, result?: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(result as T);
        }
      });
    });
  };
}
