#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;
uniform vec4 u_Color;
in vec2 fs_Pos;
in vec3 viewVec;
in vec4 fs_Nor;
out vec4 out_Col;

//created using : http://dev.thi.ng/gradients/

void main()
{
    vec3 a = vec3(2.278, 0.318, -1.022),
            b = vec3(0.048, 0.448, 0.098),
            c = vec3(-0.972, -0.442, 0.000),
            d = vec3(-0.442, -0.572, 0.000);

    float lambertianDotProduct = dot(normalize(fs_Nor.xyz), normalize(viewVec));

    out_Col.rgb = a + b * cos(6.28318 * (c * lambertianDotProduct + d));
    out_Col.a = 1.0;
}
