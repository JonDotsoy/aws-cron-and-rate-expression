import { createExpressionError } from "./createExpressionError";
import { Wildcard } from "./Wildcard";
import { wildcards } from "./wildcards";

export enum ExpressionType {
  cron = 'cron',
  rate = 'rate',
}

export enum RateUnit {
  minutes = 'minutes',
  minute = 'minute',
  hour = 'hour',
  hours = 'hours',
  days = 'days',
  day = 'day',
}

const regexpExpression = /^(?<type>.+)\((?<body>.+)\)$/;
const regexpCronExpression = /^\s*(?<Minutes>[^\s]+)\s+(?<Hours>[^\s]+)\s+(?<Day_of_month>[^\s]+)\s+(?<Month>[^\s]+)\s+(?<Day_of_week>[^\s]+)\s+(?<Year>[^\s]+)\s*$/;
const regexpRateExpression = /^\s*(?<Value>\d+)\s+(?<Unit>[^\s]+)\s*$/;

export class Expression {

  inspect(expression: string) {
    const resultEvalExpression = regexpExpression.exec(expression);
    if (resultEvalExpression === null) throw createExpressionError(Expression.prototype.inspect, `Expression unrecognizable`, { meta: { SyntaxError: '' } });
    console.log(resultEvalExpression)
    const type = this.parseType(resultEvalExpression.groups.type);

    return {
      type,
      ... this.inspectBody(type, resultEvalExpression.groups.body),
      toString() { return expression },
      toJSON() { return expression },
    }
  }

  private inspectBody(type: string, body: string) {
    switch (type) {
      case ExpressionType.cron: return this.inspectCronBody(body);
      case ExpressionType.rate: return this.inspectRateBody(body);
    }
  }

  private inspectCronBody(body: string) {
    const resultExpresion = regexpCronExpression.exec(body);
    if (resultExpresion === null) throw createExpressionError(Expression.prototype.inspect, `Unrecognizable expression`);

    const minutes = this.assertCronValueExpression('Minutes', resultExpresion.groups.Minutes, wildcards.get(", - * /"))
    const hours = this.assertCronValueExpression('Hours', resultExpresion.groups.Hours, wildcards.get(", - * /"))
    const dayOfMonth = this.assertCronValueExpression('Day-of-month', resultExpresion.groups.Day_of_month, wildcards.get(", - * ? / L W"))
    const month = this.assertCronValueExpression('Month', resultExpresion.groups.Month, wildcards.get(', - * /'))
    const dayOfWeek = this.assertCronValueExpression('Day-of-week', resultExpresion.groups.Day_of_week, wildcards.get(", - * ? L #"))
    const year = this.assertCronValueExpression('Year', resultExpresion.groups.Year, wildcards.get(", - * /"))

    return {
      minutes,
      hours,
      dayOfMonth,
      month,
      dayOfWeek,
      year,
    }
  }

  private assertCronValueExpression(propName: string, value: string, wildcard: Wildcard) {
    if (!wildcard.test(value)) throw createExpressionError(Expression.prototype.inspect, `Error ${propName} ${value} expression ${wildcard.name}`)
    return value;
  }

  private inspectRateBody(body: string) {
    const resultExpresion = regexpRateExpression.exec(body);
    if (resultExpresion === null) throw createExpressionError(Expression.prototype.inspect, `Unrecognizable body ${JSON.stringify(body)} in rate expression`);

    const value = Number(resultExpresion.groups.Value);
    const unit = this.parseRateUnit(value, resultExpresion.groups.Unit);

    return {
      'value': value,
      'unit': unit,
    }
  }

  private parseRateUnit(value: number, unit: string) {
    if (value === 1) {
      switch (unit) {
        case 'minute': return RateUnit.minute;
        case 'hour': return RateUnit.hour;
        case 'day': return RateUnit.day;
        default: throw createExpressionError(Expression.prototype.inspect, `Unit ${JSON.stringify(unit)} values is not a expression valid`);
      }
    } else {
      switch (unit) {
        case 'minutes': return RateUnit.minutes;
        case 'hours': return RateUnit.hours;
        case 'days': return RateUnit.days;
        default: throw createExpressionError(Expression.prototype.inspect, `Unit ${JSON.stringify(unit)} values is not a expression valid`);
      }
    }
  }

  private parseType(type: string) {
    switch (type) {
      case 'cron': return ExpressionType.cron;
      case 'rate': return ExpressionType.rate;
      default: throw createExpressionError(Expression.prototype.inspect, `Invalid type ${JSON.stringify(type)}.`);
    }
  }

}

export const E = (template: TemplateStringsArray, ...substitutions: any[]) => {
  const e = String.raw(template, ...substitutions);
  try {
    return new Expression().inspect(e);
  } catch (ex) {
    Error.captureStackTrace(ex, E);
    throw ex;
  }
}
