export async function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.src = src;  // MUST BE SAME DOMAIN!!!
        image.onload = function () {
            resolve(image)
        };
        image.onerror = function (...error: any) {
            reject(error)
        }
    })

}
export function setRectangle(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}