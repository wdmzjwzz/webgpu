import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Application } from "./Application";
import MainScene from "./scenes/MainScene";
export class MainApplication extends Application {
    private static _instance: MainApplication | undefined
    static get instance() {
        if (!MainApplication._instance) {
            MainApplication._instance = new MainApplication()
        }
        return MainApplication._instance
    }
    public canvasContent: HTMLDivElement | undefined;
    public scene: Scene | undefined
    public camera: Camera | undefined
    public controls: OrbitControls | undefined
    public renderer: WebGLRenderer | undefined
    init(canvasContent: HTMLDivElement, scene?: Scene) {
        if (canvasContent === this.canvasContent) {
            return
        }
        this.canvasContent = canvasContent; 
        this.renderer = new WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.canvasContent.appendChild(this.renderer.domElement)

        const mainScene = new MainScene()
        this.setScene(scene || mainScene)

        this.createCamera()
       
    }
    async start() {
        super.start()
    }
    setScene(scene: Scene) {
        this.scene = scene
    }
    getScene() {
        return this.scene
    }

    render() {
        if (!this.renderer || !this.scene || !this.camera) {
            return
        }
        (this.scene as MainScene).update()
        this.controls?.update()
        this.renderer.render(this.scene, this.camera);
    }

    private createCamera() {
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera.position.set(0, 50, 50);
        this.camera.lookAt(0, 0, 0);
        this.controls = new OrbitControls(this.camera, this.renderer!.domElement);
        this.controls.target.set(0, 0.5, 0);
        this.controls.update();
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
    }
}
export const mainApp = MainApplication.instance