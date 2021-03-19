import * as c from "./createExpressionError";
import { Wildcard } from "./Wildcard";
import { WildcardList } from "./WildcardList";

const createExpressionError = (start: number, ...args: any[]) => {
  return c.createExpressionError(Parser.prototype.parse, { meta: { start } }, ...args);
}

const wildcards = new WildcardList<', - * /' | ', - * ? / L W' | ', - * ? L #'>([
  new Wildcard(', - * /'),
  new Wildcard(', - * ? / L W'),
  new Wildcard(', - * ? L #'),
]);

export interface Node {
  type: string
  start: number
  end: number
  _exp: string
}

export class Cron implements Node {
  type = 'Cron';
  end: number;

  minutes: string;
  hours: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  year: string;

  constructor(readonly start: number, readonly _exp: string) {
    this.end = this._exp.length;

    this.prepare()
  }

  private prepare() {
    const regexp = /^\s*(?<Minutes>[^\s]+)\s+(?<Hours>[^\s]+)\s+(?<Day_of_month>[^\s]+)\s+(?<Month>[^\s]+)\s+(?<Day_of_week>[^\s]+)\s+(?<Year>[^\s]+)\s*$/.test(this._exp);
    if (!regexp) throw createExpressionError(this.start, `Unexpected token (${this.start})`);

    const rMinutes = /(?<Minutes>[^\s]+)/.exec(this._exp);
    const rMinutesStart = rMinutes.index
    const rMinutesEnd = rMinutes.index + rMinutes.groups.Minutes.length;
    const rHours = /(?<Hours>[^\s]+)/.exec(this._exp.slice(rMinutesEnd));
    const rHoursStart = rMinutesEnd + rHours.index
    const rHoursEnd = rMinutesEnd + rHours.index + rHours.groups.Hours.length;
    const rDay_of_month = /(?<Day_of_month>[^\s]+)/.exec(this._exp.slice(rHoursEnd));
    const rDay_of_monthStart = rHoursEnd + rDay_of_month.index
    const rDay_of_monthEnd = rHoursEnd + rDay_of_month.index + rDay_of_month.groups.Day_of_month.length;
    const rMonth = /(?<Month>[^\s]+)/.exec(this._exp.slice(rDay_of_monthEnd));
    const rMonthStart = rDay_of_monthEnd + rMonth.index
    const rMonthEnd = rDay_of_monthEnd + rMonth.index + rMonth.groups.Month.length;
    const rDay_of_week = /(?<Day_of_week>[^\s]+)/.exec(this._exp.slice(rMonthEnd));
    const rDay_of_weekStart = rMonthEnd + rDay_of_week.index
    const rDay_of_weekEnd = rMonthEnd + rDay_of_week.index + rDay_of_week.groups.Day_of_week.length;
    const rYear = /(?<Year>[^\s]+)/.exec(this._exp.slice(rDay_of_weekEnd));
    const rYearStart = rDay_of_weekEnd + rYear.index
    const rYearEnd = rDay_of_weekEnd + rYear.index + rYear.groups.Year.length;

    this.minutes = this.parseCronValueExpression(this.start + rMinutesStart, rMinutes.groups.Minutes, wildcards.get(", - * /"))
    this.hours = this.parseCronValueExpression(this.start + rHoursStart, rHours.groups.Hours, wildcards.get(", - * /"))
    this.dayOfMonth = this.parseCronValueExpression(this.start + rDay_of_monthStart, rDay_of_month.groups.Day_of_month, wildcards.get(", - * ? / L W"))
    this.month = this.parseCronValueExpression(this.start + rMonthStart, rMonth.groups.Month, wildcards.get(', - * /'))
    this.dayOfWeek = this.parseCronValueExpression(this.start + rDay_of_weekStart, rDay_of_week.groups.Day_of_week, wildcards.get(", - * ? L #"))
    this.year = this.parseCronValueExpression(this.start + rYearStart, rYear.groups.Year, wildcards.get(", - * /"))
  }

  private parseCronValueExpression(start: number, value: string, wildcard: Wildcard) {
    if (!wildcard.test(value)) throw createExpressionError(start, `Unexpected token (${start}) wildcard ${wildcard.name}`)
    return value;
  }
}

export enum RateUnit {
  minutes = 'minutes',
  minute = 'minute',
  hour = 'hour',
  hours = 'hours',
  days = 'days',
  day = 'day',
}

export class Rate implements Node {
  type = 'Rate';
  end: number;
  value: number;
  unit: string;

  constructor(readonly start: number, readonly _exp: string) {
    this.end = this._exp.length;
    this.procesable();
  }

  private procesable() {
    if (!/^\s*(?<Value>\d+)\s+(?<Unit>[^\s]+)\s*$/.test(this._exp)) throw createExpressionError(this.start, `Unexpected token (${this.start})`)
    const r = /(?<Value>\d+)/.exec(this._exp);
    const r2 = /(?<Unit>[^\s]+)/.exec(this._exp.slice(r.index + r.groups.Value.length));

    this.value = Number(r.groups.Value);
    this.unit = this.parseRateUnit(this.value, r2.groups.Unit, this.start + r.index + r.groups.Value.length + r2.index);
  }

  private parseRateUnit(value: number, unit: string, start: number) {
    if (value === 1) {
      switch (unit) {
        case 'minute': return RateUnit.minute;
        case 'hour': return RateUnit.hour;
        case 'day': return RateUnit.day;
        default: throw createExpressionError(start, `Unexpected token (${start})`);
      }
    } else {
      switch (unit) {
        case 'minutes': return RateUnit.minutes;
        case 'hours': return RateUnit.hours;
        case 'days': return RateUnit.days;
        default: throw createExpressionError(start, `Unexpected token (${start})`);
      }
    }
  }
}

export class Program implements Node {
  type = 'Program'
  start: number
  end: number
  _exp: string
  body: Cron | Rate

  constructor(body: string) {
    this.start = 0
    this.end = body.length
    this._exp = body
    this.procesable();
  }

  private procesable() {
    const resultExp = /^(?<ExpressionType>cron|rate)\((?<Body>[\W|\w]+)\)/.exec(this._exp);
    if (!resultExp) throw createExpressionError(this.start, `Unexpected token (${this.start})`);

    if (resultExp.groups.ExpressionType === 'cron')
      this.body = new Cron(this.start + resultExp.groups.ExpressionType.length + 1, resultExp.groups.Body);
    if (resultExp.groups.ExpressionType === 'rate')
      this.body = new Rate(this.start + resultExp.groups.ExpressionType.length + 1, resultExp.groups.Body);
  }
}

export class Parser {
  parse(body: string) {
    return new Program(body);
  }
}
