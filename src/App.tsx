import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Viewer from './components/viewer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <> 
      <h1>BVH Viewer</h1>

      <div>
        <Viewer />
      </div>
    </>
  )
}

export default App
