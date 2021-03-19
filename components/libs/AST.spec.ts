import { Parser } from "./AST"

describe('AST', () => {
  it('Parse', () => {
    console.log(new Parser().parse('cron(0/30 * * d ? *)'));
    // console.log(new Parser().parse('rate(1 minute)'));
  })
})