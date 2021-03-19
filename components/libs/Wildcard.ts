export class Wildcard<T extends string = string> extends RegExp {
  constructor(readonly name: T) {
    super(Wildcard.strToRegExp(name));
  }

  static strToRegExp(str: string) {
    const r = `NUM ${str}`.split(/\s+/g).map((exp, i, exps) => {
      const weekDayName = [
        'TUE',
        'WED',
        'THU',
        'FRI',
        'SAT',
        'SUN',
        'MON',
      ];
      const weekDayNameStr = `(${weekDayName.join('|')})`;
      switch (exp) {
        case `NUM`: return exps.includes('L') ? `${weekDayNameStr}|\\d+` : `\\d+`;
        case `#`: return exps.includes('L') ? `(${weekDayNameStr}|\\d+)\\#\\d+` : `\\d+\\#\\d+`;
        case `,`: return exps.includes('L') ? `(${weekDayNameStr}\\,${weekDayNameStr}(\\,${weekDayNameStr})*)|(\\d+\\,\\d+(\\,\\d+)*)` : `\\d+\\,\\d+(\\,\\d+)*`;
        case `-`: return exps.includes('L') ? `(${weekDayNameStr}\\-${weekDayNameStr}|\\d+\\-\\d+)` : `\\d+\\-\\d+`;
        case `/`: return `\\d+\\/\\d+`;
        case 'L': return `(L|\\d+L)`;
        case 'W': return `(\\d+W)`;
        case `*`: return `\\*`;
        case `?`: return `\\?`;
      }
    }).filter(Boolean).join('|');
    return new RegExp(`^(${r})$`);
  }
}
