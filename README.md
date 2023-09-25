# Making Ember from Elemental, Procedurally!
As I delve deeper into the world of Procedural Graphics, I wanted to use the various tools that this field equipped me with to create something close to my heart. Ember from Elemental (Pixar Animation Studios) was a character that I resonated with very deeply, and hence I wanted to use my learnings of Toolbox functions, noise functions, and WebGL to try to create her! [Try ineracting with her yourself!](https://saksham03.github.io/Elemental/)
Here is what I ended up with (GIF isn't super high-res, screenshot attached later) :  
![](captures/main_demo.gif)  
Overall, I am pretty happy with the final result! I loved the artistic journey I was able to go on with this project, and develop an analytical thinking of using maths to create cool graphics. I will try documenting my 'art direction' below, both for my own sake for later reference and for anybody else who might be interested :)

## 1. Basics - Structure of Ember's Head
The first step was of course to create the basic structure. I have used an icosphere mesh for all parts of Ember. I then use various mathematical functions to tweak it shape to make it look like waht I want. For the head, my sequential train of thought (with results) is as follows:
1. First, I squish (scale) the sphere to distort into a capsule-looking shape. Then, I apply a scaled sine wave to all the vertices to give the head a smiley-looking appearance. A section of the downard trend of the sin curve does the trick for me.

| ![](captures/step1_1.jpg) | ![](captures/step1_2.jpg) | ![](captures/step1_3.jpg) |
|:--:|:--:|:--:|
| *<b>(a)</b> Starting with an icosphere* | *<b>(b)</b> Scaling to give the capsule look* |  *<b>(c)</b> Sine wave gives the smiley-looking shape* |

2. Next, I wanted to add the 3 triangle-looking structures on her head. For this, I mapped a triangle wave of appropriate frequency and amplitude on the top part of her head :

| ![](captures/func_triangle.jpg) <br> **+** <br> ![](captures/step1_3.jpg)|= ![](captures/step2_2.jpg) |
|:--:|:--:|

3. Now, I wanted to make the middle triangle on Ember's head a bit taller than the other two. For this, I used a square wave as a signal. I used a shifted square wave with half the frequency as that of the triangle wave so that the signal will be 1 only in the middle, where the middle-most triangle is. I was then able to scale it up accordingly :

| ![](captures/func_sq_triang.jpg) <br> **+** <br> ![](captures/step3_1.jpg)|= ![](captures/step3_2.jpg) |
|:--:|:--:|

4. Finally, I add some **3D Perlin noise** on the top part as in my experience, 3D Perlin noise can be tweaked to give it the nice flamy look. For the bottom part, I add a high frequency low amplitude **3D FBM Noise** to give the surface that 'fiery' boiling look. Next up, we add an iridescent shader to give a gradient color palette to the surface that is made up of nice flame colors. I used [this](http://dev.thi.ng/gradients/) source to get the perfect **Cosine Color Gradient Palette** I wanted. The iridescent shader works using the geometry's normals, which gives it the required gradient at any viewing angle.

| ![](captures/step3_2.jpg) | ![](captures/step3_3.gif) | ![](captures/step4_2_iridshader.gif) | ![](captures/step4_2_ss.jpg) |
|:--:|:--:|:--:|:--:|
| *Adding time-varying 3D Perlin & FBMs* | *Ember is slowly coming to life!* | *Adding the cosine color palette* | *Screenshot of the iridescent shader for resolution* |  


## 2. Moving on - making the Eyebrows
The eyebrows were an easy win. I started with an icosphere again, squished it into a capsule, and applied a shifted sine curve to give it the appropriate look. It was funny as to how complex I was initally making it, and how just a simple sine wave worked so well for me. I reused the iridescent shader to match Ember's actual look from the movie.  
| ![](captures/brow_step1.jpg) | ![](captures/brow_step2.jpg) | ![](captures/brow_step3.jpg) | ![](captures/brow_step4.gif) |
|:--:|:--:|:--:|:--:|
| *Starting with an icosphere* | *Simple scaling/squishing* | *Adding a shifted sine wave* | *aaand done* |

## 3. Making the Eyes
The eyes were a fun process. My first thought was to use shifted power curves:  
![](captures/func_power.jpg)  
And when I was looking at [Inigo Quilez's Blog](https://iquilezles.org/articles/functions/) for motivation, him precisely mentioning the use of power curves for eyes gave me a temporary ego boost. I used two different power curves for the top and the bottom halves of the eye. I chalked out a quick [desmos](https://www.desmos.com/calculator/u7g4m31wqp) to test my imagination, so feel free to play around with it!

1. For the Top portion:

| ![](captures/eye_step1.jpg) | ![](captures/eye_step2.jpg) | ![](captures/eye_step3.jpg) |
|:--:|:--:|:--:|
| *Starting with an icosphere. Again.* | *For demonstration, taking off the bottom* | *Added a power curve a=0.4 b=0.6, scale=0.16* |

2. For the bottom portion:

| ![](captures/eye_step1.jpg) | ![](captures/eye_step4.jpg) | ![](captures/eye_step5.jpg) |
|:--:|:--:|:--:|
| *Starting with an icosphere. Again.* | *For demonstration, taking off the top* | *Added a power curve a=0.5, b-0.8, scale=0.06* |

3. Finally combining them together:

| ![](captures/eye_step3.jpg) <br> **+** <br> ![](captures/eye_step5.jpg)|= <br>![](captures/eye_final.jpg) |
|:--:|:--:|


## 4. Making the Eyelashes
This waas probably the most fun part for me personally. I developed a thinking of how varioust oolbox functions could be employed for various use cases, and was proud of the result that came out of this process.
1. I start, again, with an icosphere. For the top part, I first again apply a power curve :

| ![](captures/eyelash_step1.jpg) | ![](captures/eyelash_step1_2.jpg) | ![](captures/eyelash_step1_3.jpg) |
|:--:|:--:|:--:|
| *Starting with an icosphere. Again.* | *For demonstration, taking off the bottom* | *Added a power curve* |

2. Next, I wanted to give the lashes to this structure. For this, I used a saw-tooth curve:

| ![](captures/func_sawtooth.jpg) <br> **+** <br> ![](captures/eyelash_step1_3.jpg)|= <br>![](captures/eyelash_step1_4.jpg) |
|:--:|:--:|

3. I wanted to give the eyelashes a curvey look to match the reference image better. For this, I used the bias function on top of the sawtooth curve in the previous step which gave me nice-looking eyelashes:

| ![](captures/func_bias.jpg) <br> **+** <br> ![](captures/eyelash_step1_4.jpg)|= <br>![](captures/eyelash_step1_5.jpg) |
|:--:|:--:|

4. The bottom part was easy, same as the eye's bottom part. Just a power curve:

| ![](captures/eyelash_step1.jpg) | ![](captures/eyelash_step2_1.jpg) | ![](captures/eyelash_step2_2.jpg) |
|:--:|:--:|:--:|
| *Starting with an icosphere. Again.* | *For demonstration, taking off the top* | *Added a power curve* |

5. Finally, combining the two parts, I get my beautiful eyelash!

| ![](captures/eyelash_step1_5.jpg) **+** ![](captures/eyelash_step2_2.jpg)|= ![](captures/eyelash_final.jpg) |
|:--:|:--:|

## 5. The Eyeballs


