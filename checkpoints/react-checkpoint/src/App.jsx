import { useState } from 'react'
import './App.css'
import ProgressBar from './ProgressBar'

function App() {
  const [progress, setProgress] = useState(0);

  function increaseProgress() {
      if (progress < 100) {
          setProgress(progress + 10);
      }
  }

  function decreaseProgress() {
      if (progress > 0) {
          setProgress(progress - 10);
      }
  }

  return (
      <div>
          <ProgressBar progress={progress}/>
          <button onClick={increaseProgress}>Increase Progress</button>
          <button onClick={decreaseProgress}>Decrease Progress</button>
      </div>
  );
}

export default App
