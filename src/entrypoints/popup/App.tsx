function App() {
  return (
    <>
      <div className='flex flex-col items-center p-[30px] gap-3'>
        <img src="/wxt.svg" alt="" className='h-8 w-8 bg-black rounded-full' />
        <h1 className='text-lg font-bold'>ChatGPT Writer</h1>
      </div>
      <div className='pl-[30px] pr-[30px]'>
        <p className='text-base font-semibold text-slate- mb-2 text-center'>Transform Your Messaging Approach</p>
        <p className='text-sm text-center'>
          Welcome to ChatGPT Writer, an innovative Chrome extension designed to enhance your communication on LinkedIn. 
          Leverage the power of AI to generate tailored messages effortlessly, enabling you to connect more effectively 
          with your professional network and seize new opportunities.
        </p>
        <div className='mt-4 flex justify-center items-center'>
          <button className='bg-black text-white pb-[6px] pt-[6px] w-52 rounded-md hover:bg-slate-950'>
            Begin Your Journey
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
