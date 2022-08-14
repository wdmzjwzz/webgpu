import { useEffect, useRef } from 'react' 
import styles from './index.module.less'
import { WebGLApplication } from '../../app/WebGLApplication'

function Scence() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const resize = () => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        const devicePixelRatio = window.devicePixelRatio || 1
        canvas.width = canvas.clientWidth * devicePixelRatio
        canvas.height = canvas.clientHeight * devicePixelRatio
    }
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }
        resize()
        run()
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])
    function run() {
        const canvas = document.querySelector('canvas')
        if (!canvas)
            throw new Error('No Canvas')
        const app = new WebGLApplication(canvas)

        app.start()

    }
    return (
        <canvas className={styles.canvas} ref={canvasRef}></canvas>
    )
}

export default Scence
