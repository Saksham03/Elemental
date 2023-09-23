#version 300 es
precision highp float;

uniform vec4 u_Color;
uniform float u_IcosphereRadius;
in vec4 fs_Pos;
out vec4 out_Col;

void main() {
    float dist = length(fs_Pos);
    if(dist < u_IcosphereRadius * 0.5) {
        out_Col = vec4(vec3(0.0), 1.0);
    }
    else {
        out_Col = u_Color;
    }    
}
