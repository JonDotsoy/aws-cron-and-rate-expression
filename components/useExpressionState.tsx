import { useState } from "react";
import { sample } from "./libs/sample";

const sampleExpressions = [
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
];

export function useExpressionState() {
  const defaultState = sample(sampleExpressions);
  const [keyChanes, setKeyChanges] = useState(0);
  const [inpt, setInpt] = useState<string | null>(defaultState);

  const random = () => {
    setInpt(sample(sampleExpressions));
    setKeyChanges(k => k + 1);
  };

  return [
    inpt,
    keyChanes,
    setInpt,
    random,
  ] as [
      typeof inpt,
      typeof keyChanes,
      typeof setInpt,
      typeof random
    ];
}
