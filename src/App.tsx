

import styles from './App.module.less'
import Scence from './components/Scence'

function App() {
  return (
    <div className={styles.App}>
      <div className={styles.left}>
        <h1>WebGPU</h1>
      </div>
      <div className={styles.right}  >
        <Scence />
      </div>

    </div>
  )
}

export default App
