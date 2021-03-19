import { useState } from "react";
import { Cron, Rate } from "../components/libs/AST";
import { useExpressionEvaluation } from "../components/useExpressionEvaluation";

const App = () => {
  const [inpt, setInpt] = useState<string | null>('rate(1 day)');
  const { evaluation } = useExpressionEvaluation({ inpt: inpt })

  console.log(evaluation)

  return <>
    <div className="bg-gray-700 min-h-screen">

      <div className="container mx-auto px-4 py-20">
        <div className="pb-20">
          <h1 className="font-normal text-yellow-500 text-center text-5xl pb-4">AWS Cron And Rate Expression</h1>
          <p className="text-white text-center">Simple editor of Cron and Rate Expression.</p>
        </div>
        <div>
          <input className="border rounded-full bg-blue-100 border-blue-600 w-full p-4 text-5xl text-center font-mono" type="text" placeholder="rate(3 days)" defaultValue={inpt} onChange={(target) => setInpt(target.currentTarget.value)} />
          {typeof evaluation?.error?.meta?.start === 'number' && <div className="text-white text-center text-5xl font-mono"><span className="text-transparent">{inpt.slice(0, evaluation.error.meta.start)}</span>^<span className="text-transparent">{inpt.slice(evaluation.error.meta.start + 1)}</span></div>}
        </div>
        {/* <div>
          {evaluation?.error && <>
            <p className="text-white">{evaluation?.error?.typeError}: {evaluation?.error?.message ?? null}</p>
            <pre className="bg-gray-50 p-10"><code>{JSON.stringify(evaluation?.error?.meta)}</code></pre>
          </>}
        </div> */}

        <div>
          <table className="table-fixed">
            <tbody>
              {evaluation?.evaluation?.body?.type && evaluation.evaluation.body instanceof Rate && <>
                <tr>
                  <th className="text-white">Unit</th>
                  <td className="text-white">{evaluation.evaluation.body.unit}</td>
                </tr>
                <tr>
                  <th className="text-white">Value</th>
                  <td className="text-white">{evaluation.evaluation.body.value}</td>
                </tr>
              </>}

              {evaluation?.evaluation?.body?.type && evaluation.evaluation.body instanceof Cron && <>
                <tr>
                  <th className="text-white">Minutes</th>
                  <td className="text-white">{evaluation.evaluation.body.minutes}</td>
                </tr>
                <tr>
                  <th className="text-white">Hours</th>
                  <td className="text-white">{evaluation.evaluation.body.hours}</td>
                </tr>
                <tr>
                  <th className="text-white">Day of month</th>
                  <td className="text-white">{evaluation.evaluation.body.dayOfMonth}</td>
                </tr>
                <tr>
                  <th className="text-white">Month</th>
                  <td className="text-white">{evaluation.evaluation.body.month}</td>
                </tr>
                <tr>
                  <th className="text-white">Day of week</th>
                  <td className="text-white">{evaluation.evaluation.body.dayOfWeek}</td>
                </tr>
                <tr>
                  <th className="text-white">Year</th>
                  <td className="text-white">{evaluation.evaluation.body.year}</td>
                </tr>
              </>}
            </tbody>
          </table>
        </div>
      </div>
      <div>

      </div>
    </div>
  </>
}

export default App;
