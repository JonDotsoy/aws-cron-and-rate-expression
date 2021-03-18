import { Expression, E } from "./Expression"

describe('Expression', () => {
  it('DEMO', () => {
    const exp = new Expression()

    const expressions = [
      'cron(0/30 * * * ? *)',
      'cron(15 10 ? * 6L 2002-2005)',
      'cron(0 0/1 * * ? *)',
      'cron(0 0/2 * * ? *)',
      'cron(0 0/4 * * ? *)',
      'cron(0 0/8 * * ? *)',
      'cron(0 0/12 * * ? *)',
      'cron(15 13 ? * * *)',
      'cron(15 13 ? * MON *)',
      'cron(0 2 ? * THU#3 *)',
      'cron(15 10 ? * * *)',
      'cron(15 10 ? * MON-FRI *)',
      'cron(0 2 L * ? *)',
      'cron(15 10 ? * 6L *)',
      'cron(15 10 3W * 6L *)',
      'rate(30 minutes)',
      'rate(1 minute)',
      'rate(1 hour)',
      'rate(5 hours)',
      'rate(25 days)',
      'rate(1 day)',
      'cron(5,35 14 * * ? *)',
    ]

    for (const expression of expressions) {
      exp.inspect(expression)
    }
  })

  it('Error', () => {
    // const exp = new Expression();

    // exp.inspect('cron(asd)');

    const r = E`cron(* * ? * * *)`
    console.log(r);
  });
})
