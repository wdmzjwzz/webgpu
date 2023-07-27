import { useEffect, useRef } from 'react'
import styles from './index.module.less'
import { mainApp } from '../../../app/MainApplication'

function Scence() {
    const canvasRef = useRef<HTMLDivElement | null>(null)
    
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        } 
        run() 
    }, [])
    function run() {
        const canvas = canvasRef.current
        if (!canvas)
            throw new Error('No Canvas')
        mainApp.init(canvas)
        mainApp.start()
    }
    return (
        <div ref={canvasRef}></div>
    )
}

export default Scence
