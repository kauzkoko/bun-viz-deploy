export const useShadersHardcoded = (options: { balls: number; color: [] }) => {
  let balls = options.balls ?? 5;
  let color = options.color ?? [0.0, 0.0, 0.0, 1];

  let vertexShader = `
          attribute vec3 aPosition;
          uniform float width;
          uniform float height;
          varying highp vec2 vPos;
    
          void main() {
            gl_Position = vec4(aPosition, 1.0);
            vPos = vec2(
              (gl_Position.x + 1.) / 2. * width,
              (gl_Position.y + 1.) / 2. * height);
          }`;

  let fragmentShader = `
    precision highp float;
    #define BALLS ${balls}
    
    uniform float xs[BALLS];
    uniform float ys[BALLS];
    uniform float rs[BALLS];
    uniform vec4 ballColors[BALLS]; // Add this line to define colors for each ball
    // vec4 ballColors[BALLS] = [vec4(1.0, 0.0, 0.0, 1.0),vec4(1.0, 0.0, 0.0, 1.0,vec4(1.0, 0.0, 0.0, 1.0,vec4(1.0, 0.0, 0.0, 1.0,vec4(1.0, 0.0, 0.0, 1.0,vec4(1.0, 0.0, 0.0, 1.0,vec4(1.0, 0.0, 0.0, 1.0,vec4(1.0, 0.0, 0.0, 1.0]; // Red ball (default
    uniform vec4 test;
    uniform vec4 testArray[2];
    uniform float height;

    const int size = 2; // size of the array
    vec4 colorArray[size];

    varying highp vec2 vPos;
    
    vec4 green = vec4(31./255., 97./255., 0., 1.);
    void main() {
        float currentPixelY = gl_FragCoord.y;

        vec4 color = vec4(0.0); // Initialize the color as transparent or background color
        float totalInfluence = 0.0;

        //rgba(31, 97, 0, 1)
        //rgba(62, 193, 1, 1)
        // colorArray[0] = vec4(62./255., 193./255., 1./255., 1.0); 
        // colorArray[0] = vec4(62./255., 193./255., 1./255., 1.0); 
        // colorArray[0] = vec4(31./255., 97./255., 0./255., 1.0);
        // colorArray[0] = vec4(12./255., 38./255., 0./255., 1.0);
        colorArray[0] = green;
        colorArray[1] = vec4(255./255., 255./255., 255./255., 1.0);
    
        for (int i = 0; i < BALLS; i++) {
            float dx = xs[i] - vPos.x;
            float dy = ys[i] - vPos.y;
            float d = length(vec2(dx, dy));
            float influence = rs[i] / d;
            
            // color += vec4(i, 0.0, 0.0, 1.0) * influence; // Blend the color based on influence
            color += colorArray[i] * influence; // Blend the color based on influence
            totalInfluence += influence;
        }
    
        vec2 pointA = vec2(0., ys[0]);
        vec2 pointB = vec2(0., ys[1]);
        float dist = distance(pointA, pointB);
        if (currentPixelY < height - 600. && totalInfluence > 16. && dist > 449.) {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); //Atmospheric CO2 White
        }
        else if (totalInfluence > 16. && dist < 451.) {
            gl_FragColor = color / totalInfluence; //Gradient Normalize color by total influence
        } else if (totalInfluence > 16. && ys[1] < 1200.) {
            gl_FragColor = green;
        } else {
            gl_FragColor = vec4(vec3(1.), 0.0); // Background color
        }
    }  
  `;
  return { fragmentShader, vertexShader };
};
