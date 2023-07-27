import { BufferGeometry, ColorRepresentation, Line, LineBasicMaterial, Vector3 } from "three";

export const drawPath = (path: Vector3[], color: ColorRepresentation = 0x0000ff) => {
    const material = new LineBasicMaterial({ color });
    const geometry = new BufferGeometry().setFromPoints(path);
    const line = new Line(geometry, material);
    return line
}
