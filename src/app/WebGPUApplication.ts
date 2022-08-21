import { Application } from "./Application";

import triangleVert from './shaders/triangle.vert.wgsl?raw'
import redFrag from './shaders/red.frag.wgsl?raw'
export class WebGPUApplication extends Application {
    constructor(public canvas: HTMLCanvasElement) {
        super()
        this.context = canvas.getContext('webgpu');
    }
    adapter: GPUAdapter | null = null
    context: GPUCanvasContext | null
    device: GPUDevice | null = null
    pipeline: GPURenderPipeline | null = null;
    commandEncoder: GPUCommandEncoder | null = null
    format: any;
    passEncoder: GPURenderPassEncoder | null = null
    async start() {
        super.start()
        await this.initGPU();
        const pipeline = this.device!.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this.device!.createShaderModule({
                    code: triangleVert,
                }),
                entryPoint: 'main',
            },
            fragment: {
                module: this.device!.createShaderModule({
                    code: redFrag,
                }),
                entryPoint: 'main',
                targets: [
                    {
                        format: this.format,
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
            },
            multisample: {
                count: 4,
            },
        });
        const commandEncoder = this.device!.createCommandEncoder();
        const view = this.createTexture()!

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view,
                    resolveTarget: this.context!.getCurrentTexture().createView(),
                    clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();

        this.device!.queue.submit([commandEncoder.finish()]);
    }
    render(): void {
        
    }
    async initGPU() {
        if (!navigator.gpu)
            throw new Error('Not Support WebGPU')
        this.adapter = await navigator.gpu.requestAdapter()
        if (!this.adapter)
            throw new Error('No Adapter Found')

        if (!this.context)
            throw new Error('getContext("webgpu") Error')
        this.device = await this.adapter.requestDevice()
        this.format = navigator.gpu.getPreferredCanvasFormat()


        const devicePixelRatio = window.devicePixelRatio || 1
        this.canvas.width = this.canvas.clientWidth * devicePixelRatio
        this.canvas.height = this.canvas.clientHeight * devicePixelRatio

        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'opaque'
        })

    }
    createTexture() {
        if (!this.device) {
            return
        }
        const texture = this.device.createTexture({
            size: [this.canvas.width, this.canvas.height],
            sampleCount: 4,
            format: this.format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        return texture.createView();
    }

}