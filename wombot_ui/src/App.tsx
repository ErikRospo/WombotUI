import React from 'react';
import './App.css';
import Button from './components/button.tsx';
function App() {
  return (
    <div className="App">
      <div className="bg-black">
        <img className="max-w-fit max-h-full"></img>
        <div className="grid h-full">
          <img id="preview" className="max-w-full max-h-screen m-auto"/>
        </div>
        <div id="controls" className='fixed right-0 box-border bottom-0'>
          <button id="reject-button" className="button bg-red-50">REJECT</button>
          <button id="accept-button" className="button bg-lime-500">ACCEPT</button>
          <button id="skip-button" className="button bg-yellow-500">SKIP</button>
          <button id="more-button" className="button bg-purple-600">GENERATE</button>
          <br />
          <Button callback={console.log} text={"This is a test."}></Button>
        <pre id="prompt" className='w-fit'></pre>
          <pre id="style_int"  className='text-lg m-1 p-1 text-white'></pre>
          <pre id="images_left" className='text-lg m-1 p-1 text-white'></pre>
          <pre id="status_bar" className='text-lg m-1 p-1 text-white'></pre>
        </div>
      </div>
    </div>
  );
}

export default App;
