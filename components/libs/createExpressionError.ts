import ExpressionError from "./ExpressionError";

export const createExpressionError = (...args: any[]): ExpressionError => {
  const err = new ExpressionError();

  Error.captureStackTrace(err, createExpressionError);

  return Object.assign(err, ...args.map(arg => {
    if (typeof arg === 'function') {
      Error.captureStackTrace(err, arg);
      return arg;
    }
    return (typeof arg === 'string') ? { message: arg } : arg;
  }));
};
