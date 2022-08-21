import { useEffect, useRef, useState } from 'react'
import { WebGPUApplication } from '../../app/WebGPUApplication'
import styles from './index.module.less'

function Scence() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [fps, setFps] = useState("0")
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
    async function run() {
        const canvas = document.querySelector('canvas')
        if (!canvas)
            throw new Error('No Canvas')
        const app = new WebGPUApplication(canvas)
        app.setTimer(() => {
            setFps(app.fps)
        },1000)
        app.start()

    }
    return (
        <>
            <span className={styles.FPS}>FPS：{fps}</span>
            <canvas className={styles.canvas} ref={canvasRef}></canvas>
        </>
    )
}

export default Scence
