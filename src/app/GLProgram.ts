class GLProgram {
    static _instance: GLProgram;
    static get instance() {
        if (!GLProgram._instance) {
            GLProgram._instance = new GLProgram()
        }
        return GLProgram._instance
    }
    createProgram(
        gl: WebGL2RenderingContext, shaders: WebGLShader[], opt_attribs?: any, opt_locations?: any) {

        const program = gl.createProgram()!;
        shaders.forEach(function (shader) {
            gl.attachShader(program, shader);
        });
        if (opt_attribs) {
            opt_attribs.forEach(function (attrib: string, ndx: number) {
                gl.bindAttribLocation(
                    program,
                    opt_locations ? opt_locations[ndx] : ndx,
                    attrib);
            });
        }
        gl.linkProgram(program);

        // Check the link status
        const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            // something went wrong with the link
            const lastError = gl.getProgramInfoLog(program);
            console.error(`Error in program linking: ${lastError}\n${shaders.map(shader => {
                const src = gl.getShaderSource(shader);
                const type = gl.getShaderParameter(shader, gl.SHADER_TYPE);
                return `${type}:\n${src}`;
            }).join('\n')
                }`);

            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    createProgramFromSources(
        gl: WebGL2RenderingContext, shaderSources: string[], opt_attribs?: any, opt_locations?: any) {
        const shaders = [];
        const shader = this.loadShader(
            gl, shaderSources[0], gl.VERTEX_SHADER)
        shaders.push(shader!);
        const fragshader = this.loadShader(
            gl, shaderSources[1], gl.FRAGMENT_SHADER)
        shaders.push(fragshader!);
        return this.createProgram(gl, shaders, opt_attribs, opt_locations);
    }
    private loadShader(gl: WebGL2RenderingContext, shaderSource: string, shaderType: number) {

        // Create the shader object
        const shader = gl.createShader(shaderType)!;

        // Load the shader source
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check the compile status
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error
            const lastError = gl.getShaderInfoLog(shader);
            console.error(`Error compiling shader: ${lastError}\n${lastError}`);
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

}
export const ProgramManager= GLProgram.instance