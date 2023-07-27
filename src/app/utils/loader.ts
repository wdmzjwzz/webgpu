import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class LoaderUtils {
    static loadGLTF(url: string) {
        const loader = new GLTFLoader();
        loader.setPath("src/app/models/")
        return new Promise((resolve, reject) => {
            loader.load(url, function (gltf) {
                resolve(gltf);
            }, undefined, function (error) {
                reject(error)
            });
        })

    }
}
