import { Application } from "./Application";

export class WebGPUApplication extends Application {
    constructor(public canvas: HTMLCanvasElement) {
        super()
        this.context = canvas.getContext('webgpu');
    }
    adapter: GPUAdapter | null = null
    context: GPUCanvasContext | null
    device: GPUDevice | null = null
    pipeline: GPURenderPipeline | null = null
    format: any;

    async initGPU() {
        if (!navigator.gpu)
            throw new Error('Not Support WebGPU')
        this.adapter = await navigator.gpu.requestAdapter({
            powerPreference: 'high-performance'
            // powerPreference: 'low-power'
        })
        if (!this.adapter)
            throw new Error('No Adapter Found')

        if (!this.context)
            throw new Error('getContext("webgpu") Error')
        this.device = await this.adapter.requestDevice()

        this.format = navigator.gpu.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : this.context.getPreferredFormat(this.adapter)
        const devicePixelRatio = window.devicePixelRatio || 1
        this.canvas.width = this.canvas.clientWidth * devicePixelRatio
        this.canvas.height = this.canvas.clientHeight * devicePixelRatio

        this.context.configure({
            // json specific format when key and value are the same
            device: this.device,
            format: this.format,
            // prevent chrome warning
            alphaMode: 'premultiplied'
        })

    }

    async initPipeline(vert: string, frag: string, topology?: GPUPrimitiveTopology, layout: GPUPipelineLayout | "auto" = "auto") {
        if (!this.device) {
            throw new Error("device is undefind");
        }
        const descriptor: GPURenderPipelineDescriptor = {
            layout: layout,
            vertex: {
                module: this.device.createShaderModule({
                    code: vert
                }),
                entryPoint: 'main'
            },
            primitive: {
                topology: topology // try point-list, line-list, line-strip, triangle-strip?
            },
            fragment: {
                module: this.device.createShaderModule({
                    code: frag
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: this.format
                    }
                ]
            }
        }
        this.pipeline = await this.device.createRenderPipelineAsync(descriptor)
    }
    /**
     * @param intervalSec 上一帧到这一帧执行的时间
     */
    update() { }
    render() {
        const commandEncoder = this.device!.createCommandEncoder()
        const view = this.context!.getCurrentTexture().createView()
        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: view,
                    clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
                    loadOp: 'clear', // clear/load
                    storeOp: 'store' // store/discard
                }
            ]
        }
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        passEncoder.setPipeline(this.pipeline!)
        // 3 vertex form a triangle
        passEncoder.draw(3)
        passEncoder.end()
        // webgpu run in a separate process, all the commands will be executed after submit
        this.device!.queue.submit([commandEncoder.finish()])
    }


}