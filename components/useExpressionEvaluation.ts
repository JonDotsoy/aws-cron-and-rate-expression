import { useEffect, useState } from 'react';
import { Parser } from './libs/AST';
import ExpressionError from "./libs/ExpressionError";

export const useExpressionEvaluation = (opts: { inpt: string }) => {
  type EvaluationExpression = {
    evaluation?: ReturnType<Parser['parse']>,
    error?: {
      typeError: string;
      message: string;
      meta: any;
    };
  };

  const [evaluatio, setEvaluation] = useState<null | EvaluationExpression>(null);

  useEffect(() => {
    try {
      setEvaluation({
        evaluation: new Parser().parse(opts.inpt),
      });
    } catch (ex: any) {
      console.error(ex);
      if (ex instanceof ExpressionError) {
        setEvaluation({
          error: {
            typeError: Object.getPrototypeOf(ex)?.name,
            message: ex.message,
            meta: ex.meta,
          },
        });
      }
    }

  }, [opts.inpt]);

  return {
    evaluation: evaluatio,
  }
}
