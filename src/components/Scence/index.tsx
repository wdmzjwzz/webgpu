import { useEffect, useRef } from 'react'
import { WebGPUApplication } from '../../app/WebGPUApplication'
import triangleVert from '../../app/shaders/triangle.vert.wgsl?raw'
import redFrag from '../../app/shaders/red.frag.wgsl?raw'
import styles from './index.module.less'

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
    async function run() {
        const canvas = document.querySelector('canvas')
        if (!canvas)
            throw new Error('No Canvas')
        const app = new WebGPUApplication(canvas)
        await app.initGPU();
        await app.initPipeline(triangleVert, redFrag)
        app.start()

    }
    return (
        <canvas className={styles.canvas} ref={canvasRef}></canvas>
    )
}

export default Scence
