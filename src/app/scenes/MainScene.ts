import {
    AmbientLight,
    BoxGeometry,
    Camera,
    DirectionalLight,
    Fog,
    GridHelper,
    HemisphereLight,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    PlaneGeometry,
    Scene,
} from "three";
import LoaderUtils from "../utils/loader";

export default class MainScene extends Scene {
    constructor() {
        super()
        // this.fog = new Fog(0xa0a0a0,20, 100);
        this.createLight()
        this.createGroud()
        this.addPlayer()
    }
    public camera: Camera | undefined
    public nodePool = new Map<string, Object3D>()
    update() {

    }
    private createLight() {
        const hemiLight = new HemisphereLight(0xffffff, 0x8d8d8d, 1);
        hemiLight.position.set(0, 20, 0);
        this.add(hemiLight);

        const dirLight = new DirectionalLight(0xffffff, 1);
        dirLight.position.set(3, 10, 10);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.add(dirLight);
    }

    private createGroud() {
        const mesh = new Mesh(new PlaneGeometry(2000, 2000), new MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false }));
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.add(mesh);

        const helper = new GridHelper(2000, 200);
        helper.material.opacity = 0.5;
        helper.material.transparent = true;
        this.add(helper);
    }
    private async addPlayer() {
        const gltf = await LoaderUtils.loadGLTF("RobotExpressive.glb") as any
      
        const model = gltf.scene;
        model.traverse(function (object: any) {
            console.log(object.isMesh, 111);
            if (object.isMesh) object.castShadow = true;
        });
        this.add(model);

    }
}