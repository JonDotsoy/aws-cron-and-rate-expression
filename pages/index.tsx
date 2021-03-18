
const App = () => {
  return <>
    <div className="bg-gray-700 min-h-screen">

      <div className="container mx-auto px-4 py-20">
        <div className="pb-20">
          <h1 className="font-normal text-yellow-500 text-center text-5xl pb-4">AWS Cron And Rate Expression</h1>
          <p className="text-white text-center">Simple editor of Cron and Rate Expression.</p>
        </div>
        <div>
          <input className="border rounded-full bg-blue-100 border-blue-600 w-full p-4 text-5xl text-center" type="text" placeholder="rate(3 days)" />
        </div>
      </div>
      <div>

      </div>
    </div>
  </>
}

export default App;
