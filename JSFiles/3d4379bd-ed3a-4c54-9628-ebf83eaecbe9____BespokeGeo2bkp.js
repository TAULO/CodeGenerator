import * as THREE from "./three.module.js"
import {GearGenerator} from "./GearGenerator.js"
import {MeshOps} from "./MeshOps.js";

let bevelSteps = 2;
let bevelThickness = 0.5;
let hardNormalExtension = 0.3;
let singleBevelLength = bevelThickness/(Math.cos(Math.PI/6)+Math.cos(Math.PI/3));//for 2 bevel steps only
let sBL = singleBevelLength;
let createQuadFace = function(vertA,vertB,vertC,vertD,index,height,normalA,normalB,normalC,normalD){
    let faceVerts = []
//skin triangle1

//skin triangle2

    return faceVerts;
};

let createTriFace = function(){};

let dotProduct = function(vectorA,vectorB){}
let crossProduct = function(vectorA,vectorB){}

let BespokeGeo = {
    cube: function(sideLength){
        const cubeVertices = [
            // front
            { pos: [-sideLength, -sideLength,  sideLength], norm: [ 0,  0,  1], uv: [0, 0], },
            { pos: [ sideLength, -sideLength,  sideLength], norm: [ 0,  0,  1], uv: [1, 0], },
            { pos: [-sideLength,  sideLength,  sideLength], norm: [ 0,  0,  1], uv: [0, 1], },
           
            { pos: [-sideLength,  sideLength,  sideLength], norm: [ 0,  0,  1], uv: [0, 1], },
            { pos: [ sideLength, -sideLength,  sideLength], norm: [ 0,  0,  1], uv: [1, 0], },
            { pos: [ sideLength,  sideLength,  sideLength], norm: [ 0,  0,  1], uv: [1, 1], },
            // right
            { pos: [ sideLength, -sideLength,  sideLength], norm: [ 1,  0,  0], uv: [0, 0], },
            { pos: [ sideLength, -sideLength, -sideLength], norm: [ 1,  0,  0], uv: [1, 0], },
            { pos: [ sideLength,  sideLength,  sideLength], norm: [ 1,  0,  0], uv: [0, 1], },
           
            { pos: [ sideLength,  sideLength,  sideLength], norm: [ 1,  0,  0], uv: [0, 1], },
            { pos: [ sideLength, -sideLength, -sideLength], norm: [ 1,  0,  0], uv: [1, 0], },
            { pos: [ sideLength,  sideLength, -sideLength], norm: [ 1,  0,  0], uv: [1, 1], },
            // back
            { pos: [ sideLength, -sideLength, -sideLength], norm: [ 0,  0, -1], uv: [0, 0], },
            { pos: [-sideLength, -sideLength, -sideLength], norm: [ 0,  0, -1], uv: [1, 0], },
            { pos: [ sideLength,  sideLength, -sideLength], norm: [ 0,  0, -1], uv: [0, 1], },
           
            { pos: [ sideLength,  sideLength, -sideLength], norm: [ 0,  0, -1], uv: [0, 1], },
            { pos: [-sideLength, -sideLength, -sideLength], norm: [ 0,  0, -1], uv: [1, 0], },
            { pos: [-sideLength,  sideLength, -sideLength], norm: [ 0,  0, -1], uv: [1, 1], },
            // left
            { pos: [-sideLength, -sideLength, -sideLength], norm: [-1,  0,  0], uv: [0, 0], },
            { pos: [-sideLength, -sideLength,  sideLength], norm: [-1,  0,  0], uv: [1, 0], },
            { pos: [-sideLength,  sideLength, -sideLength], norm: [-1,  0,  0], uv: [0, 1], },
           
            { pos: [-sideLength,  sideLength, -sideLength], norm: [-1,  0,  0], uv: [0, 1], },
            { pos: [-sideLength, -sideLength,  sideLength], norm: [-1,  0,  0], uv: [1, 0], },
            { pos: [-sideLength,  sideLength,  sideLength], norm: [-1,  0,  0], uv: [1, 1], },
            // top
            { pos: [ sideLength,  sideLength, -sideLength], norm: [ 0,  1,  0], uv: [0, 0], },
            { pos: [-sideLength,  sideLength, -sideLength], norm: [ 0,  1,  0], uv: [1, 0], },
            { pos: [ sideLength,  sideLength,  sideLength], norm: [ 0,  1,  0], uv: [0, 1], },
           
            { pos: [ sideLength,  sideLength,  sideLength], norm: [ 0,  1,  0], uv: [0, 1], },
            { pos: [-sideLength,  sideLength, -sideLength], norm: [ 0,  1,  0], uv: [1, 0], },
            { pos: [-sideLength,  sideLength,  sideLength], norm: [ 0,  1,  0], uv: [1, 1], },
            // bottom
            { pos: [ sideLength, -sideLength,  sideLength], norm: [ 0, -1,  0], uv: [0, 0], },
            { pos: [-sideLength, -sideLength,  sideLength], norm: [ 0, -1,  0], uv: [1, 0], },
            { pos: [ sideLength, -sideLength, -sideLength], norm: [ 0, -1,  0], uv: [0, 1], },
           
            { pos: [ sideLength, -sideLength, -sideLength], norm: [ 0, -1,  0], uv: [0, 1], },
            { pos: [-sideLength, -sideLength,  sideLength], norm: [ 0, -1,  0], uv: [1, 0], },
            { pos: [-sideLength, -sideLength, -sideLength], norm: [ 0, -1,  0], uv: [1, 1], },
          ];
        
        const positions = [];
        const normals = [];
        const uvs = [];
        
        for(const vertex of cubeVertices){
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }
        
        const cubeGeometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        cubeGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions),positionNumComponents
        ));
        cubeGeometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals),normalNumComponents
        ));
        cubeGeometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs),uvNumComponents
        ));
        
        const loader = new THREE.TextureLoader();
         //  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        
        const material_z = new THREE.MeshPhongMaterial({color: 0xcccc00, map:texture});
        
            const cubez = new THREE.Mesh(cubeGeometry, material_z);
            // scene.add(cubez);


            return cubez;
    },

    cylinder: function(diameter,height,ringSegments){
        let r=diameter/2;
        height=height/2;

          let cylinderVerts = [];

          let theta = 2*Math.PI/ringSegments;
          let phi = theta/2;
          for(let i = 0;i<ringSegments;i++){
              ////////////////////////////////
          let normalDir = [Math.cos(i*theta),0,Math.sin(i*theta)]
          let normalA = [Math.cos((i-1)*theta),0,Math.sin((i-1)*theta)]
          let normalB = [Math.cos(i*theta),0,Math.sin(i*theta)]
              let vert = {
                 pos: [r*Math.cos(phi+i*theta),  height,  r*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              cylinderVerts.push(vert);
              vert = {
                 pos: [r*Math.cos(phi+i*theta),  -height,  r*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              cylinderVerts.push(vert);

              vert = {
                 pos: [r*Math.cos(phi+(i-1)*theta),  -height,  r*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              cylinderVerts.push(vert);
///////////////////////////////////////////////////
              vert = {
                 pos:  [r*Math.cos(phi+(i-1)*theta),  -height,  r*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              cylinderVerts.push(vert);

              vert = {
                 pos: [r*Math.cos(phi+(i-1)*theta),  height,  r*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              cylinderVerts.push(vert);

              vert = {
                 pos: [r*Math.cos(phi+i*theta),  height,  r*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              cylinderVerts.push(vert);
              //////////////////////////////////
          }//skin sides


          for(let i=0; i<ringSegments;i++){
            let normalDir = [0,1,0]
            let vert = {
               pos: [r*Math.cos(phi+(i)*theta),  height,  r*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            cylinderVerts.push(vert);
            vert = {
               pos: [r*Math.cos(phi+(i-1)*theta),  height,  r*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            cylinderVerts.push(vert);

            vert = {
               pos: [0,  height,  0], norm: normalDir, uv: [0.5, 0.5] 
            }

            cylinderVerts.push(vert);
          }//cap top
          for(let i = 0;i<3*ringSegments;i++){
            let normalDir = [0,-1,0]
            let vert = {
               pos: [r*Math.cos(phi+(i)*theta),  -height,  r*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            cylinderVerts.push(vert);
            vert = {
               pos: [r*Math.cos(phi+(i-1)*theta), -height,  r*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            cylinderVerts.push(vert);

            vert = {
               pos: [0,  -height,  0], norm: normalDir, uv: [0.5, 0.5] 
            }

            cylinderVerts.push(vert);
          }//cap bottom

        
        const positions = [];
        const normals = [];
        const uvs = [];
        
        for(const vertex of cylinderVerts){
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }
        
        const cylinderGeometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        cylinderGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions),positionNumComponents
        ));
        cylinderGeometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals),normalNumComponents
        ));
        cylinderGeometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs),uvNumComponents
        ));
        
        const loader = new THREE.TextureLoader();
         //  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        
        const cylinderMaterial = new THREE.MeshPhongMaterial({color: 0xcccc00, map:texture});
        
            const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
            // scene.add(cubez);


            return cylinder;
    

    },

    ring: function(outerDiameter,innerDiameter,height,ringSegments){
        let rTO=outerDiameter/2 - bevelThickness - hardNormalExtension;
        let rTI=innerDiameter/2  + bevelThickness + hardNormalExtension;
        let rSO=outerDiameter/2;
        let rSI=innerDiameter/2;
        const heightTop = height/2;
        height=height/2  - bevelThickness - hardNormalExtension;

          let ringVerts = [];

          let theta = 2*Math.PI/ringSegments;
          let phi = theta/2;

          
          for(let i = 0;i<ringSegments;i++){//skin outer sides
              ////////////////////////////////
          let normalDir = [Math.cos(i*theta),0,Math.sin(i*theta)]
          let normalA = [Math.cos((i-1)*theta),0,Math.sin((i-1)*theta)]
          let normalB = [Math.cos(i*theta),0,Math.sin(i*theta)]
              let vert = {
                 pos: [rSO*Math.cos(phi+i*theta),  height,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
              vert = {
                 pos: [rSO*Math.cos(phi+i*theta),  -height,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);

              vert = {
                 pos: [rSO*Math.cos(phi+(i-1)*theta),  -height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
///////////////////////////////////////////////////
              vert = {
                 pos:  [rSO*Math.cos(phi+(i-1)*theta),  -height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);

              vert = {
                 pos: [rSO*Math.cos(phi+(i-1)*theta),  height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);

              vert = {
                 pos: [rSO*Math.cos(phi+i*theta),  height,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
              //////////////////////////////////
          }//skin outer sides


          for(let i = 0;i<ringSegments;i++){//harden outer sides top normals
              ////////////////////////////////
          let normalDir = [Math.cos(i*theta),0,Math.sin(i*theta)]
          let normalA = [Math.cos((i-1)*theta),0,Math.sin((i-1)*theta)]
          let normalB = [Math.cos(i*theta),0,Math.sin(i*theta)]
              let vert = {
                 pos: [rSO*Math.cos(phi+i*theta),  height + hardNormalExtension,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
              vert = {
                 pos: [rSO*Math.cos(phi+i*theta),  height,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);

              vert = {
                 pos: [rSO*Math.cos(phi+(i-1)*theta),  height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
///////////////////////////////////////////////////
              vert = {
                 pos:  [rSO*Math.cos(phi+(i-1)*theta),  height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);

              vert = {
                 pos: [rSO*Math.cos(phi+(i-1)*theta),  height +hardNormalExtension,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);

              vert = {
                 pos: [rSO*Math.cos(phi+i*theta),  height+hardNormalExtension,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
              //////////////////////////////////
          }//harden outer sides top normals


          
          for(let i = 0;i<ringSegments;i++){//harden outer sides bottom normals
            ////////////////////////////////
        let normalDir = [Math.cos(i*theta),0,Math.sin(i*theta)]
        let normalA = [Math.cos((i-1)*theta),0,Math.sin((i-1)*theta)]
        let normalB = [Math.cos(i*theta),0,Math.sin(i*theta)]
            let vert = {
               pos: [rSO*Math.cos(phi+i*theta),  -height + hardNormalExtension,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rSO*Math.cos(phi+i*theta),  -height,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rSO*Math.cos(phi+(i-1)*theta),  -height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
///////////////////////////////////////////////////
            vert = {
               pos:  [rSO*Math.cos(phi+(i-1)*theta),  -height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rSO*Math.cos(phi+(i-1)*theta),  -height +hardNormalExtension,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rSO*Math.cos(phi+i*theta),  -height+hardNormalExtension,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            //////////////////////////////////
        }//harden outer sides bottom normals




          for(let i = 0;i<ringSegments;i++){//skin inner sides
              ////////////////////////////////
          let normalDir = [Math.cos(i*theta),0,Math.sin(i*theta)]
          let normalA = [-Math.cos((i-1)*theta),0,-Math.sin((i-1)*theta)]
          let normalB = [-Math.cos(i*theta),0,-Math.sin(i*theta)]
              let vert = {
                pos: [rSI*Math.cos(phi+i*theta),  -height,  rSI*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
             }

             ringVerts.push(vert); 
              
              
              vert = {
                 pos: [rSI*Math.cos(phi+i*theta),  height,  rSI*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
              

              vert = {
                 pos: [rSI*Math.cos(phi+(i-1)*theta),  -height,  rSI*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
///////////////////////////////////////////////////


              vert = {
                 pos: [rSI*Math.cos(phi+(i-1)*theta),  height,  rSI*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
              
              vert = {
                 pos:  [rSI*Math.cos(phi+(i-1)*theta),  -height,  rSI*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);


              vert = {
                 pos: [rSI*Math.cos(phi+i*theta),  height,  rSI*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
              }

              ringVerts.push(vert);
              //////////////////////////////////
          }//skin inner sides




          for(let i=0; i<ringSegments;i++){//cap top
            let normalDir = [0,1,0]
            let vert = {
               pos: [rTI*Math.cos(phi+(i-1)*theta),  heightTop,  rTI*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTI*Math.cos(phi+(i)*theta),  heightTop,  rTI*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTO*Math.cos(phi+(i)*theta),  heightTop,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////
            vert = {
               pos: [rTO*Math.cos(phi+(i)*theta),  heightTop,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTO*Math.cos(phi+(i-1)*theta),  heightTop,  rTO*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTI*Math.cos(phi+(i-1)*theta),  heightTop,  rTI*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////


          }//cap top

          let rTIb = rTI - hardNormalExtension;
          for(let i=0; i<ringSegments;i++){//harden top inner normal
            let normalDir = [0,1,0]
            let vert = {
               pos: [rTIb*Math.cos(phi+(i-1)*theta),  heightTop,  rTIb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0, 0] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTIb*Math.cos(phi+(i)*theta),  heightTop,  rTIb*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0, 0] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTI*Math.cos(phi+(i)*theta),  heightTop,  rTI*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0, 0] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////
            vert = {
               pos: [rTI*Math.cos(phi+(i)*theta),  heightTop,  rTI*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0, 0] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTI*Math.cos(phi+(i-1)*theta),  heightTop,  rTI*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0, 0] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTIb*Math.cos(phi+(i-1)*theta),  heightTop,  rTIb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0, 0] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////


          }//harden top inner Normals

          
          let rTOb = rTO + hardNormalExtension;
          for(let i=0; i<ringSegments;i++){//harden top outer normal
            let normalDir = [0,1,0]
            let vert = {
               pos: [rTO*Math.cos(phi+(i-1)*theta),  heightTop,  rTO*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTO*Math.cos(phi+(i)*theta),  heightTop,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTOb*Math.cos(phi+(i)*theta),  heightTop,  rTOb*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////
            vert = {
               pos: [rTOb*Math.cos(phi+(i)*theta),  heightTop,  rTOb*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTOb*Math.cos(phi+(i-1)*theta),  heightTop,  rTOb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTO*Math.cos(phi+(i-1)*theta),  heightTop,  rTO*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////


          }//harden top outer normal
          
           let rTOb1 = rTOb + sBL*Math.cos(Math.PI/6);
           let hb1 = heightTop - sBL*Math.sin(Math.PI/6);
          for(let i=0; i<ringSegments;i++){//bevel top outer ring 1
            let normalDir = [0,1,0]
            let normalA = [Math.cos((i-1)*theta),Math.cos(Math.PI/6),Math.sin((i-1)*theta)]
            let normalB = [Math.cos(i*theta),Math.cos(Math.PI/6),Math.sin(i*theta)]
            let normalC = [];
            let nornalD = [];

            let vert = {
               pos: [rTOb*Math.cos(phi+(i-1)*theta),  heightTop,  rTOb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTOb*Math.cos(phi+(i)*theta),  heightTop,  rTOb*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTOb1*Math.cos(phi+(i)*theta), hb1 ,  rTOb1*Math.sin(phi+(i)*theta)], norm: normalB, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////
            vert = {
               pos: [rTOb1*Math.cos(phi+(i)*theta), hb1,  rTOb1*Math.sin(phi+(i)*theta)], norm: normalB, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTOb1*Math.cos(phi+(i-1)*theta),  hb1,  rTOb1*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTOb*Math.cos(phi+(i-1)*theta),  heightTop,  rTOb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////


          }//bevel top outer ring1
          
           let rTOb2 = rTOb1 + sBL*Math.cos(Math.PI/3);
           let hb2 = hb1 - sBL*Math.sin(Math.PI/3);
          for(let i=0; i<ringSegments;i++){//bevel top outer ring 2
            let normalDir = [0,Math.cos(Math.PI/3),0]
            let normalA = [Math.cos((i-1)*theta),Math.cos(Math.PI/6),Math.sin((i-1)*theta)]
            let normalB = [Math.cos(i*theta),Math.cos(Math.PI/6),Math.sin(i*theta)]
            let normalC = [Math.cos((i-1)*theta),0,Math.sin((i-1)*theta)]
            let normalD = [Math.cos(i*theta),0,Math.sin(i*theta)]

            let vert = {
               pos: [rTOb1*Math.cos(phi+(i-1)*theta),  hb1,  rTOb1*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTOb1*Math.cos(phi+(i)*theta),  hb1,  rTOb1*Math.sin(phi+(i)*theta)], norm: normalB, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTOb2*Math.cos(phi+(i)*theta), hb2 ,  rTOb2*Math.sin(phi+(i)*theta)], norm: normalD, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////
            vert = {
               pos: [rTOb2*Math.cos(phi+(i)*theta), hb2,  rTOb2*Math.sin(phi+(i)*theta)], norm: normalD, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTOb2*Math.cos(phi+(i-1)*theta),  hb2,  rTOb2*Math.sin(phi+(i-1)*theta)], norm: normalC, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTOb1*Math.cos(phi+(i-1)*theta),  hb1,  rTOb1*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////


          }//bevel top outer ring2

          for(let i=0; i<ringSegments;i++){
            let normalDir = [0,-1,0]
            let vert = {
               pos: [rTI*Math.cos(phi+(i-1)*theta),  -height,  rTI*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTI*Math.cos(phi+(i)*theta),  -height,  rTI*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTO*Math.cos(phi+(i)*theta),  -height,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////
            vert = {
               pos: [rTO*Math.cos(phi+(i)*theta),  -height,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            vert = {
               pos: [rTO*Math.cos(phi+(i-1)*theta),  -height,  rTO*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);

            vert = {
               pos: [rTI*Math.cos(phi+(i-1)*theta),  -height,  rTI*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
            }

            ringVerts.push(vert);
            ///////////////////////////////////////


          }//cap bottom

        
        const positions = [];
        const normals = [];
        const uvs = [];
        
        for(const vertex of ringVerts){
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }
        
        const ringGeometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        ringGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions),positionNumComponents
        ));
        ringGeometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals),normalNumComponents
        ));
        ringGeometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs),uvNumComponents
        ));
        
        const loader = new THREE.TextureLoader();
         //  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        
        const ringMaterial = new THREE.MeshPhongMaterial({color: 0xcccc00, map:texture});
        
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);


            return ring;
    

    },

    sphere: function(diameter, ringSegments, heightSegments){

    },

    sprocket: function(teethCount,xOffset,yOffset,zOffset){
        let radiusToTeethRatio = 520; //in metres //52 teeth is 200mm diameter
        //centreToCentre spacing is 410mm (will show in gear generator, not here)
        //current z offset is problematic, so reduce till visually appealing
//1 tooth is 1.2cm wide with a 5cm groove width

        //min ring segments = 4 x teethCount
        //thicknes =2mm with 2mm gap for starters
        let outerDiameter = 20;
        let scaleFactor = 20/520;
        scaleFactor /= (105/13);
        let fiftyTwoPitchDiameter = radiusToTeethRatio*scaleFactor;
        let innerDiameter =100;
        let height = 4;
        let ringSegments = teethCount*10;
        let sprocketSectionSegments = 5;//10;
        let ringVerts = [];
        let teethTipExtension = 0.02;//0.1;

        //sprocket params
        let thetaOne = 2*Math.PI/teethCount;
        let ringSupportThickness = 3;
        let rGearFlats;
        
        let rPitch = fiftyTwoPitchDiameter*teethCount/52;
      //   console.log(teethCount);
      //   console.log(rPitch);
        let radialSum = 2*rPitch*(Math.sin(thetaOne/4));
        let rGroove = 0.4*radialSum;
        let rTip = radialSum - rGroove;
        let rInner = rPitch - ringSupportThickness*rGroove;
        let aLittle = 0.2*rGroove;
        let rLoop = rPitch - rGroove - aLittle;

        let rFlatTip = rTip + teethTipExtension;
   
        let rTO=outerDiameter/2 - bevelThickness - hardNormalExtension;
        let rTI=innerDiameter/2  + bevelThickness + hardNormalExtension;
        let rSO=outerDiameter/2;
        let rSI=innerDiameter/2;
        const heightTop = height/2;
        const sprocketInnerRingHeight = scaleFactor * 10;
        height=height/2  - bevelThickness - hardNormalExtension;

        
        let theta = 2*Math.PI/ringSegments;
        let theta2 = 2*Math.PI/teethCount;
        let phi = theta/2;
        let phi2 = theta/5;
        let thetaBendGroove = GearGenerator.extensionGrooveAngle*Math.PI/180;
        let thetaBendTip = GearGenerator.extensionTipAngle*Math.PI/180;

////////////////--------------------SKINNING MESHES-----------------//////////////

      ////rInner --> rLoop
      for(let i=0; i<ringSegments;i++){//cap top

         let vertAops, vertBops, vertCops, vertDops;
         let normalAops, normalBops, normalCops, normalDops;
         let uvAops, uvBops, uvCops, uvDops;
         vertAops = [rInner*Math.cos(1*(phi+(i-1)*theta)),  sprocketInnerRingHeight,  rInner*Math.sin(1*(phi+(i-1)*theta))];
         vertBops = [rInner*Math.cos(1*(phi+(i)*theta)),  sprocketInnerRingHeight,  rInner*Math.sin(1*(phi+(i)*theta))];
         vertCops = [rLoop*Math.cos(1*(phi+(i)*theta)),  sprocketInnerRingHeight,  rLoop*Math.sin(1*(phi+(i)*theta))];
         vertDops = [rLoop*Math.cos(1*(phi+(i-1)*theta)),  sprocketInnerRingHeight,  rLoop*Math.sin(1*(phi+(i-1)*theta))];

         normalCops = normalDops = normalAops =  normalBops = [0,1,0];
         uvAops= uvBops= uvCops= uvDops = [0,0];

         ringVerts.push (...MeshOps.makeQuadFace(
            vertAops,vertBops,vertCops,vertDops,
            normalAops,normalBops,normalCops,normalDops,
            uvAops,uvBops,uvCops,uvDops
        ));

       }//cap top
      ////rInner --> rLoop

       //////rLoop --> rPitch (grooves)
       let thetaGroove = Math.PI/2 - 2*Math.PI/(4*teethCount);
       let thetaGap = Math.PI/2 - thetaGroove;
       let thetaGrooveITR = thetaGroove/sprocketSectionSegments;
       let thetaLoopA, thetaLoopB;
       let rUnknownA,rUnknownB,thetaXA,thetaQA,thetaXB,thetaQB; 
       for(let i = 0; i<teethCount;i++){
          for(let j = 0; j < sprocketSectionSegments*2; j++){
            let normalDir = [0,1,0];
            thetaXA = Math.PI/2 - thetaGap - (j+1)*thetaGrooveITR;
            thetaXB = Math.PI/2 - thetaGap - (j)*thetaGrooveITR;
            thetaQA = Math.asin(rGroove*Math.sin(thetaXA)/rUnknownA);
            thetaQB = Math.asin(rGroove*Math.sin(thetaXB)/rUnknownB);
            rUnknownA = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXA));
            rUnknownB = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXB));
            
            let rAx= rPitch*Math.cos(i*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
            let rBx= rPitch*Math.cos((i)*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
            let rAy= rPitch*Math.sin(i*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
            let rBy= rPitch*Math.sin((i)*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
            let rAz= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove);
            thetaLoopA = thetaQA + i*thetaOne;//Math.atan(rAy/rAx);
            thetaLoopB = thetaQB + i*thetaOne;//Math.atan(rBy/rBx);


            let vertAops, vertBops, vertCops, vertDops;
            let normalAops, normalBops, normalCops, normalDops;
            let uvAops, uvBops, uvCops, uvDops;
            vertAops = [rAx,  rAz,  rAy];
            vertBops = [rLoop*Math.cos(thetaLoopA),  sprocketInnerRingHeight,  rLoop*Math.sin(thetaLoopA)];
            vertCops = [rLoop*Math.cos(thetaLoopB),  sprocketInnerRingHeight,  rLoop*Math.sin(thetaLoopB)];
            vertDops = [rBx,  rAz,  rBy];

            normalBops =  normalCops = [Math.cos(thetaLoopA)*Math.sin(thetaBendGroove),Math.cos(thetaBendGroove),Math.sin(thetaLoopA)*Math.sin(thetaBendGroove)];
            normalAops = normalDops = [Math.cos(thetaLoopB)*Math.sin(thetaBendGroove),Math.cos(thetaBendGroove),Math.sin(thetaLoopB)*Math.sin(thetaBendGroove)];
            uvAops= uvBops= uvCops= uvDops = [0,0];
   
         //    ringVerts.push (...MeshOps.makeQuadFace(
         //       vertAops,vertBops,vertCops,vertDops,
         //       normalAops,normalBops,normalCops,normalDops,
         //       uvAops,uvBops,uvCops,uvDops
         //   ));
          }
       }rGearFlats = rUnknownA;
       //////rLoop --> rPitch (grooves)

      ////rLoop --> rPitch (flats)
      let thetaFlat = 2*Math.PI/teethCount;
       let phiFlat=  0.44*thetaFlat;
       let thetaFlatITR = (rTip/radialSum)*1*thetaFlat/sprocketSectionSegments;
for(let i = 0; i < teethCount; i++){
      for(let j=0; j<sprocketSectionSegments*1;j++){//cap top

         let vertAops, vertBops, vertCops, vertDops;
         let normalAops, normalBops, normalCops, normalDops;
         let uvAops, uvBops, uvCops, uvDops;
         let rAz= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove);
         vertAops = [rLoop*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  sprocketInnerRingHeight,  rLoop*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];
         vertBops = [rLoop*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  sprocketInnerRingHeight,  rLoop*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
         vertCops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAz,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
         vertDops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  rAz,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];

         normalAops = normalDops =  [Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(thetaBendGroove),Math.cos(thetaBendGroove),Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(thetaBendGroove)];
         normalBops = normalCops = [Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(thetaBendGroove),Math.cos(thetaBendGroove),Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(thetaBendGroove)];
         uvAops= uvBops= uvCops= uvDops = [0,0];

         ringVerts.push (...MeshOps.makeQuadFace(
            vertAops,vertBops,vertCops,vertDops,
            normalAops,normalBops,normalCops,normalDops,
            uvAops,uvBops,uvCops,uvDops
        ));

         }
       }//cap top
      ////rLoop --> rPitch (flats)

////////////////////////////////////////////////////////////////////////////////
//BOTTOM CAP--->
////////////////////////////////////////////////////////////////////////////

      ////rInner --> rLoop

      for(let i=0; i<ringSegments;i++){//cap top

         let vertAops, vertBops, vertCops, vertDops;
         let normalAops, normalBops, normalCops, normalDops;
         let uvAops, uvBops, uvCops, uvDops;
         vertAops = [rInner*Math.cos(1*(phi+(i-1)*theta)),  -sprocketInnerRingHeight,  rInner*Math.sin(1*(phi+(i-1)*theta))];
         vertBops = [rInner*Math.cos(1*(phi+(i)*theta)),  -sprocketInnerRingHeight,  rInner*Math.sin(1*(phi+(i)*theta))];
         vertCops = [rLoop*Math.cos(1*(phi+(i)*theta)),  -sprocketInnerRingHeight,  rLoop*Math.sin(1*(phi+(i)*theta))];
         vertDops = [rLoop*Math.cos(1*(phi+(i-1)*theta)),  -sprocketInnerRingHeight,  rLoop*Math.sin(1*(phi+(i-1)*theta))];

         normalCops = normalDops = normalAops =  normalBops = [0,-1,0];
         uvAops= uvBops= uvCops= uvDops = [0,0];

         ringVerts.push (...MeshOps.makeInvertedQuadFace(
            vertAops,vertBops,vertCops,vertDops,
            normalAops,normalBops,normalCops,normalDops,
            uvAops,uvBops,uvCops,uvDops
        ));

       }//cap top
      ////rInner --> rLoop

       //////rLoop --> rPitch (grooves)
       for(let i = 0; i<teethCount;i++){
          for(let j = 0; j < sprocketSectionSegments*2; j++){
            thetaXA = Math.PI/2 - thetaGap - (j+1)*thetaGrooveITR;
            thetaXB = Math.PI/2 - thetaGap - (j)*thetaGrooveITR;
            thetaQA = Math.asin(rGroove*Math.sin(thetaXA)/rUnknownA);
            thetaQB = Math.asin(rGroove*Math.sin(thetaXB)/rUnknownB);
            rUnknownA = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXA));
            rUnknownB = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXB));
            
            let rAx= rPitch*Math.cos(i*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
            let rBx= rPitch*Math.cos((i)*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
            let rAy= rPitch*Math.sin(i*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
            let rBy= rPitch*Math.sin((i)*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
            let rAz= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove);
            thetaLoopA = thetaQA + i*thetaOne;//Math.atan(rAy/rAx);
            thetaLoopB = thetaQB + i*thetaOne;//Math.atan(rBy/rBx);

         let vertAops, vertBops, vertCops, vertDops;
         let normalAops, normalBops, normalCops, normalDops;
         let uvAops, uvBops, uvCops, uvDops;
         vertAops = [rAx,  -rAz,  rAy];
         vertBops = [rLoop*Math.cos(thetaLoopA),  -sprocketInnerRingHeight,  rLoop*Math.sin(thetaLoopA)];
         vertCops = [rLoop*Math.cos(thetaLoopB),  -sprocketInnerRingHeight,  rLoop*Math.sin(thetaLoopB)];
         vertDops = [rBx,  -rAz,  rBy];

         normalBops = normalCops = [Math.cos(thetaLoopA+Math.PI)*Math.sin(thetaBendGroove+Math.PI),Math.cos(thetaBendGroove+Math.PI),Math.sin(thetaLoopA+Math.PI)*Math.sin(thetaBendGroove+Math.PI)];
         normalAops = normalDops = [Math.cos(thetaLoopB+Math.PI)*Math.sin(thetaBendGroove+Math.PI),Math.cos(thetaBendGroove+Math.PI),Math.sin(thetaLoopB+Math.PI)*Math.sin(thetaBendGroove+Math.PI)];
           
         uvAops= uvBops= uvCops= uvDops = [0,0];

         ringVerts.push (...MeshOps.makeInvertedQuadFace(
            vertAops,vertBops,vertCops,vertDops,
            normalAops,normalBops,normalCops,normalDops,
            uvAops,uvBops,uvCops,uvDops
        ));
          }
       } rGearFlats = rUnknownA;
      

       //////rLoop --> rPitch (grooves)

       //////rLoop --> rPitch (grooves) [top repeat]
      //  let thetaGroove = Math.PI/2 - 2*Math.PI/(4*teethCount);
      //  let thetaGap = Math.PI/2 - thetaGroove;
      //  let thetaGrooveITR = thetaGroove/sprocketSectionSegments;
      //  let thetaLoopA, thetaLoopB;
      //  let rUnknownA,rUnknownB,thetaXA,thetaQA,thetaXB,thetaQB; 
       for(let i = 0; i<teethCount;i++){
          for(let j = 0; j < sprocketSectionSegments*2; j++){
            let normalDir = [0,1,0];
            thetaXA = Math.PI/2 - thetaGap - (j+1)*thetaGrooveITR;
            thetaXB = Math.PI/2 - thetaGap - (j)*thetaGrooveITR;
            thetaQA = Math.asin(rGroove*Math.sin(thetaXA)/rUnknownA);
            thetaQB = Math.asin(rGroove*Math.sin(thetaXB)/rUnknownB);
            rUnknownA = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXA));
            rUnknownB = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXB));
            
            let rAx= rPitch*Math.cos(i*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
            let rBx= rPitch*Math.cos((i)*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
            let rAy= rPitch*Math.sin(i*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
            let rBy= rPitch*Math.sin((i)*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
            let rAz= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove);
            thetaLoopA = thetaQA + i*thetaOne;//Math.atan(rAy/rAx);
            thetaLoopB = thetaQB + i*thetaOne;//Math.atan(rBy/rBx);


            let vertAops, vertBops, vertCops, vertDops;
            let normalAops, normalBops, normalCops, normalDops;
            let uvAops, uvBops, uvCops, uvDops;
            vertAops = [rAx,  rAz,  rAy];
            vertBops = [rLoop*Math.cos(thetaLoopA),  sprocketInnerRingHeight,  rLoop*Math.sin(thetaLoopA)];
            vertCops = [rLoop*Math.cos(thetaLoopB),  sprocketInnerRingHeight,  rLoop*Math.sin(thetaLoopB)];
            vertDops = [rBx,  rAz,  rBy];

            normalBops =  normalCops = [Math.cos(thetaLoopA)*Math.sin(thetaBendGroove),Math.cos(thetaBendGroove),Math.sin(thetaLoopA)*Math.sin(thetaBendGroove)];
            normalAops = normalDops = [Math.cos(thetaLoopB)*Math.sin(thetaBendGroove),Math.cos(thetaBendGroove),Math.sin(thetaLoopB)*Math.sin(thetaBendGroove)];
            uvAops= uvBops= uvCops= uvDops = [0,0];
   
            ringVerts.push (...MeshOps.makeQuadFace(
               vertAops,vertBops,vertCops,vertDops,
               normalAops,normalBops,normalCops,normalDops,
               uvAops,uvBops,uvCops,uvDops
           ));
          }
       }rGearFlats = rUnknownA;
       //////rLoop --> rPitch (grooves) [top repeat]

       //////rLoop --> rPitch (flats)
for(let i = 0; i < teethCount; i++){
      for(let j=0; j<sprocketSectionSegments*1;j++){//cap top

         let vertAops, vertBops, vertCops, vertDops;
         let normalAops, normalBops, normalCops, normalDops;
         let uvAops, uvBops, uvCops, uvDops;
         let rAz= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove);
         vertAops = [rLoop*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  -sprocketInnerRingHeight,  rLoop*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];
         vertBops = [rLoop*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -sprocketInnerRingHeight,  rLoop*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
         vertCops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAz,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
         vertDops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  -rAz,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];

         normalAops = normalDops =  [Math.cos(Math.PI + 1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(Math.PI + thetaBendGroove),Math.cos(Math.PI + thetaBendGroove),Math.sin(Math.PI + 1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(Math.PI + thetaBendGroove)];
         normalBops = normalCops = [Math.cos(Math.PI + 1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(Math.PI + thetaBendGroove),Math.cos(Math.PI + thetaBendGroove),Math.sin(Math.PI + 1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(Math.PI + thetaBendGroove)];
         
         uvAops= uvBops= uvCops= uvDops = [0,0];

         ringVerts.push (...MeshOps.makeInvertedQuadFace(
            vertAops,vertBops,vertCops,vertDops,
            normalAops,normalBops,normalCops,normalDops,
            uvAops,uvBops,uvCops,uvDops
        ));

         }
       }
      ////rLoop --> rPitch (flats)
//(END OF CAP BOTTOM)
////////////////////////////////////////////////////////////////////////////////

      ////skin inner loop sides
      for(let i = 0;i<ringSegments;i++){

               let vertAops, vertBops, vertCops, vertDops;
               let normalAops, normalBops, normalCops, normalDops;
               let uvAops, uvBops, uvCops, uvDops;

               vertAops = [rInner*Math.cos(phi+(i)*theta),  -sprocketInnerRingHeight,  rInner*Math.sin(phi+(i)*theta)];
               vertBops = [rInner*Math.cos(phi+i*theta),  sprocketInnerRingHeight,  rInner*Math.sin(phi+i*theta)];
               vertCops = [rInner*Math.cos(phi+(i-1)*theta),  sprocketInnerRingHeight,  rInner*Math.sin(phi+(i-1)*theta)];
               vertDops = [rInner*Math.cos(phi+(i-1)*theta),  -sprocketInnerRingHeight,  rInner*Math.sin(phi+(i-1)*theta)];

               normalCops = normalDops =[-Math.cos((i-1)*theta),0,-Math.sin((i-1)*theta)];
               normalAops =  normalBops =[-Math.cos(i*theta),0,-Math.sin(i*theta)];

               uvAops= uvBops= uvCops= uvDops = [0,0];

               ringVerts.push (...MeshOps.makeQuadFace(
                  vertAops,vertBops,vertCops,vertDops,
                  normalAops,normalBops,normalCops,normalDops,
                  uvAops,uvBops,uvCops,uvDops
              ));
         //////////////////////////////////
     }////skin inner loop sides

            //////skin gear groove sides
            thetaGroove = Math.PI/2 - 2*Math.PI/(4*teethCount);
            thetaGap = Math.PI/2 - thetaGroove;
            thetaGrooveITR = thetaGroove/sprocketSectionSegments;
            // thetaLoopA, thetaLoopB;
            // let rUnknownA,rUnknownB,thetaXA,thetaQA,thetaXB,thetaQB; 
            for(let i = 0; i<teethCount;i++){
               for(let j = 0; j < sprocketSectionSegments*2; j++){

                 let normalA = [Math.cos(Math.PI*3/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR),0,Math.sin(Math.PI*3/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR)];//Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR
                 let normalB = [Math.cos(Math.PI*3/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR),0,Math.sin(Math.PI*3/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR)];//Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR
                 thetaXA = Math.PI/2 - thetaGap - (j+1)*thetaGrooveITR;
                 thetaXB = Math.PI/2 - thetaGap - (j)*thetaGrooveITR;
                 thetaQA = Math.asin(rGroove*Math.sin(thetaXA)/rUnknownA);
                 thetaQB = Math.asin(rGroove*Math.sin(thetaXB)/rUnknownB);
                 rUnknownA = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXA));
                 rUnknownB = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXB));
                 
                 let rAx= rPitch*Math.cos(i*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
                 let rBx= rPitch*Math.cos((i)*thetaOne)+rGroove*Math.cos(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
                 let rAy= rPitch*Math.sin(i*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR);
                 let rBy= rPitch*Math.sin((i)*thetaOne)+rGroove*Math.sin(Math.PI/2+i*thetaOne + thetaGap + (j)*thetaGrooveITR);
                 let rAz= sprocketInnerRingHeight-(Math.sqrt(rAx**2 + rAy**2)-rLoop)*Math.tan(thetaBendGroove);
                 let rBz= sprocketInnerRingHeight-(Math.sqrt(rBx**2 + rBy**2)-rLoop)*Math.tan(thetaBendGroove);
                 thetaLoopA = thetaQA + i*thetaOne;//Math.atan(rAy/rAx);
                 thetaLoopB = thetaQB + i*thetaOne;//Math.atan(rBy/rBx);

                 let vertAops, vertBops, vertCops, vertDops;
                 let normalAops, normalBops, normalCops, normalDops;
                 let uvAops, uvBops, uvCops, uvDops;

                 vertAops = [rAx,  rAz,  rAy];
                 vertBops = [rBx,  rBz,  rBy];
                 vertCops = [rBx,  -rBz,  rBy];
                 vertDops = [rAx,  -rAz,  rAy];

                 normalAops = normalA;
                 normalBops = normalB;
                 normalCops = normalB;
                 normalDops = normalA;

                 uvAops= uvBops= uvCops= uvDops = [0,0];

                ringVerts.push (...MeshOps.makeQuadFace(
                     vertAops,vertBops,vertCops,vertDops,
                     normalAops,normalBops,normalCops,normalDops,
                     uvAops,uvBops,uvCops,uvDops
                 ));
    
               }
            }//////skin gear groove sides

////skin gear flats outer (tangent)sides
      rFlatTip = rGearFlats + teethTipExtension;
for(let i = 0; i < teethCount; i++){
     for(let j=0; j<sprocketSectionSegments*1;j++){

        let vertAops,vertBops,vertCops,vertDops;
        let normalAops, normalBops, normalCops, normalDops;
        let uvAops, uvBops, uvCops, uvDops;
        let rAzO= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove) - teethTipExtension*Math.tan(thetaBendTip); 
        vertAops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];
        vertBops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
        vertCops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
        vertDops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  -rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];

        normalAops= normalDops = [Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),0,rPitch*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];
        normalBops= normalCops= [Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),0,rPitch*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];

        uvAops= uvBops= uvCops =uvDops = [0,0];

        ringVerts.push(...MeshOps.makeQuadFace(
         vertAops,vertBops,vertCops,vertDops,
         normalAops,normalBops,normalCops,normalDops,
         uvAops,uvBops,uvCops,uvDops
     ));

        }
      }////skin gear flats outer (tangent) sides

     //cap extension top sides
for(let i = 0; i < teethCount; i++){
    for(let j=0; j<sprocketSectionSegments*1;j++){
         let vertAops,vertBops,vertCops,vertDops;
         let normalAops, normalBops, normalCops, normalDops;
         let uvAops, uvBops, uvCops, uvDops;
         let rAzI= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove); 
         let rAzO= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove) - teethTipExtension*Math.tan(thetaBendTip); 
         vertAops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];
         vertBops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
         vertCops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
         vertDops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];

         normalBops =  normalCops = [Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(thetaBendTip),
            Math.cos(thetaBendTip),
            Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(thetaBendTip)];
         normalAops = normalDops = [Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(thetaBendTip),
            Math.cos(thetaBendTip),
            Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(thetaBendTip)];
           

        uvAops= uvBops= uvCops =uvDops = [0,0];
       ringVerts.push(...MeshOps.makeQuadFace(
           vertAops,vertBops,vertCops,vertDops,
           normalAops,normalBops,normalCops,normalDops,
           uvAops,uvBops,uvCops,uvDops
       ));
    }
}//cap extension top sides

     //cap extension bottom sides
for(let i = 0; i < teethCount; i++){
    for(let j=0; j<sprocketSectionSegments*1;j++){
        
        let vertAops,vertBops,vertCops,vertDops;
        let normalAops, normalBops, normalCops, normalDops;
        let uvAops, uvBops, uvCops, uvDops;

        let rAzI= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove); 
        let rAzO= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove) - teethTipExtension*Math.tan(thetaBendTip); 

        vertAops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  -rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];
        vertBops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
        vertCops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
        vertDops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  -rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];

        normalBops =  normalCops = [Math.cos(Math.PI + 1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(Math.PI +thetaBendTip),
         Math.cos(Math.PI +thetaBendTip),
         Math.sin(Math.PI +1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)*Math.sin(Math.PI +thetaBendTip)];
      normalAops = normalDops = [Math.cos(Math.PI +1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(Math.PI +thetaBendTip),
         Math.cos(Math.PI +thetaBendTip),
         Math.sin(Math.PI +1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)*Math.sin(Math.PI +thetaBendTip)];

        uvAops= uvBops= uvCops =uvDops = [0,0];
       ringVerts.push(...MeshOps.makeInvertedQuadFace(
           vertAops,vertBops,vertCops,vertDops,
           normalAops,normalBops,normalCops,normalDops,
           uvAops,uvBops,uvCops,uvDops
       ));
    }
}//cap extension bottom sides

//cap extension groove one side
for(let i = 0; i < teethCount; i++){
    // for(let j=0; j<sprocketSectionSegments;j++){
        let j = sprocketSectionSegments-1;
        // j = 0;

        let normalA = [Math.cos(1*((i)*thetaFlat)+phiFlat+Math.PI/2+(j)*thetaFlatITR),  0,  Math.sin(1*((i)*thetaFlat)+phiFlat+Math.PI/2+(j)*thetaFlatITR)];//Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR
        thetaXA = Math.PI/2 - thetaGap - (j+1)*thetaGrooveITR;
        thetaXB = Math.PI/2 - thetaGap - (j)*thetaGrooveITR;
        thetaQA = Math.asin(rGroove*Math.sin(thetaXA)/rUnknownA);
        thetaQB = Math.asin(rGroove*Math.sin(thetaXB)/rUnknownB);
        rUnknownA = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXA));
        rUnknownB = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXB));

        thetaLoopA = thetaQA + i*thetaOne;//Math.atan(rAy/rAx);
        thetaLoopB = thetaQB + i*thetaOne;//Math.atan(rBy/rBx);

        let rAzI= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove); 
         let rAzO= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove) - teethTipExtension*Math.tan(thetaBendTip); 
         //vertAops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR),  rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j-1)*thetaFlatITR)];

        let vertAops,vertBops,vertCops,vertDops;
        let normalAops, normalBops, normalCops, normalDops;
        let uvAops, uvBops, uvCops, uvDops;

        vertAops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
        vertBops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
        vertCops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
        vertDops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];

        normalAops= normalBops= normalCops= normalDops= normalA;

        uvAops= uvBops= uvCops =uvDops = [0,0];
       ringVerts.push(...MeshOps.makeQuadFace(
           vertAops,vertBops,vertCops,vertDops,
           normalAops,normalBops,normalCops,normalDops,
           uvAops,uvBops,uvCops,uvDops
       ));
    // }
}//cap extension groove one side

//cap extension groove other side
for(let i = 0; i < teethCount; i++){
        // for(let j=0; j<sprocketSectionSegments;j++){
            let j = 0-1;
            // j = 0;
    
            let normalA = [Math.cos(1*((i)*thetaFlat)+phiFlat+Math.PI*3/2+(j)*thetaFlatITR),  0,  Math.sin(1*((i)*thetaFlat)+phiFlat+Math.PI*3/2+(j)*thetaFlatITR)];//Math.PI/2+i*thetaOne + thetaGap + (j+1)*thetaGrooveITR
            thetaXA = Math.PI/2 - thetaGap - (j+1)*thetaGrooveITR;
            thetaXB = Math.PI/2 - thetaGap - (j)*thetaGrooveITR;
            thetaQA = Math.asin(rGroove*Math.sin(thetaXA)/rUnknownA);
            thetaQB = Math.asin(rGroove*Math.sin(thetaXB)/rUnknownB);
            rUnknownA = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXA));
            rUnknownB = Math.sqrt(rGroove*rGroove + rPitch*rPitch - 2*rGroove*rPitch*Math.cos(thetaXB));
    
            thetaLoopA = thetaQA + i*thetaOne;//Math.atan(rAy/rAx);
            thetaLoopB = thetaQB + i*thetaOne;//Math.atan(rBy/rBx);

            let rAzI= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove); 
         let rAzO= sprocketInnerRingHeight-(rPitch-rLoop)*Math.tan(thetaBendGroove) - teethTipExtension*Math.tan(thetaBendTip); 
    
            let vertAops,vertBops,vertCops,vertDops;
            let normalAops, normalBops, normalCops, normalDops;
            let uvAops, uvBops, uvCops, uvDops;
    
            vertAops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
            vertBops = [rGearFlats*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAzI,  rGearFlats*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
            vertCops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  -rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
            vertDops = [rFlatTip*Math.cos(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR),  rAzO,  rFlatTip*Math.sin(1*((i)*thetaFlat)+phiFlat+(j)*thetaFlatITR)];
    
            normalAops= normalBops= normalCops= normalDops= normalA;
    
            uvAops= uvBops= uvCops =uvDops = [0,0];
           ringVerts.push(...MeshOps.makeInvertedQuadFace(
               vertAops,vertBops,vertCops,vertDops,
               normalAops,normalBops,normalCops,normalDops,
               uvAops,uvBops,uvCops,uvDops
           ));
        // }
}
//cap extension groove other side

      //////rPitch --> Tip
      //  let thetaGroove = Math.PI/2 - 2*Math.PI/(4*teethCount);
      //  let thetaGap = Math.PI/2 - thetaGroove;
      // let thetaTipITR = (Math.PI - thetaGroove)/sprocketSectionSegments;
      //  let thetaLoopA, thetaLoopB;
      //  let rUnknownA,rUnknownB,thetaXA,thetaQA,thetaXB,thetaQB;  
      //  let phiTip = thetaOne/2;//+thetaOne*(rTip/radialSum);
       
      //  for(let i = 0; i<teethCount;i++){



      //     for(let j = 0; j < sprocketSectionSegments*0.5; j++){
      //       let normalDir = [0,1,0];
      //       thetaXA = Math.PI/2 - thetaGap + (j)*thetaTipITR;
      //       thetaXB = Math.PI/2 - thetaGap + (j+1)*thetaTipITR;

      //       rUnknownA = Math.sqrt(rTip*rTip + rPitch*rPitch - 2*rTip*rPitch*Math.cos(thetaXA));
      //       rUnknownB = Math.sqrt(rTip*rTip + rPitch*rPitch - 2*rTip*rPitch*Math.cos(thetaXB));

      //       thetaQA = Math.asin(rTip*Math.sin(thetaXA)/rUnknownA);
      //       thetaQB = Math.asin(rTip*Math.sin(thetaXB)/rUnknownB);
      //       ///something's not right. curvature is moving towards center instead of away
      //       let rAx= rPitch*Math.cos(i*thetaOne + phiTip )+rTip*Math.cos(2*((j+0)*thetaOne + phiTip)-(Math.PI/2)+thetaGap);
      //       let rBx= rPitch*Math.cos((i)*thetaOne + phiTip)+rTip*Math.cos(2*((j+1)*thetaOne + phiTip)-(Math.PI/2)+thetaGap);
      //       let rAy= rPitch*Math.sin(i*thetaOne + phiTip)+rTip*Math.sin(2*((j+0)*thetaOne + phiTip)-(Math.PI/2)+thetaGap);
      //       let rBy= rPitch*Math.sin((i)*thetaOne + phiTip)+rTip*Math.sin(2*((j+1)*thetaOne + phiTip)-(Math.PI/2)+thetaGap);
      //       thetaLoopA = i*thetaOne + phiTip - thetaQA;//Math.atan(rAy/rAx);
      //       thetaLoopB = i*thetaOne + phiTip - thetaQB;//Math.atan(rBy/rBx);
            
      //       let  vert = {
      //          pos: [rPitch*Math.cos(thetaLoopA),  heightTop,  rPitch*Math.sin(thetaLoopA)], norm: normalDir, uv: [0, 0] 
      //       }
   
      //       ringVerts.push(vert);

      //       vert = {
      //          pos: [rAx,  heightTop,  rAy], norm: normalDir, uv: [0, 0] 
      //       }
   
      //       ringVerts.push(vert);

      //       vert = {
      //          pos: [rPitch*Math.cos(thetaLoopB),  heightTop,  rPitch*Math.sin(thetaLoopB)], norm: normalDir, uv: [0, 0] 
      //       }
   
      //       ringVerts.push(vert);
            ///////////////////////////////////////
            // vert = {
            //    pos: [rPitch*Math.cos(thetaLoopB),  heightTop,  rPitch*Math.sin(thetaLoopB)], norm: normalDir, uv: [0, 0] 
            // }
   
            // ringVerts.push(vert);
            // vert = {
            //    pos: [rBx,  heightTop,  rBy], norm: normalDir, uv: [0, 0] 
            // }
   
            // ringVerts.push(vert);
   
            // // vert = {
            // //    pos: [rAx,  heightTop,  rAy], norm: normalDir, uv: [0, 0] 
            // // }
   
            // // ringVerts.push(vert);

            // vert = {
            //    pos: [rPitch*Math.cos(thetaLoopA),  heightTop,  rPitch*Math.sin(thetaLoopA)], norm: normalDir, uv: [0, 0] 
            // }
   
            // ringVerts.push(vert);
            ///////////////////////////////////////
         //  }
      //  }
       //////rPitch --> Tip


      //     for(let i = 0; i<teethCount;i++){
      //       ////////////////////////////////////
      //       let normalDir = [0,1,0]
      //       let vert = {
      //          pos: [10*Math.cos(phi+(i-0.4)*theta2),  0,  10*Math.sin(phi+(i-0.4)*theta2)], norm: normalDir, uv: [0, 0] 
      //       }

      //       ringVerts.push(vert);
      //       vert = {
      //          pos: [10*Math.cos(phi+(i)*theta2),  0,  10*Math.sin(phi+(i)*theta2)], norm: normalDir, uv: [0, 0] 
      //       }

      //       ringVerts.push(vert);

      //       vert = {
      //          pos: [11*Math.cos(phi+(i)*theta2),  0,  11*Math.sin(phi+(i)*theta2)], norm: normalDir, uv: [0, 0] 
      //       }

      //       ringVerts.push(vert);
      //           //////////////////////////////////////////

            
      //       ////////////////////////////////////
      //       normalDir = [0,-1,0]
      //       vert = {
      //           pos: [10*Math.cos(phi+(i)*theta2),  -0.5,  10*Math.sin(phi+(i)*theta2)], norm: normalDir, uv: [0, 0] 
      //        }
 
      //        ringVerts.push(vert);

      //       vert = {
      //          pos: [10*Math.cos(phi+(i-0.4)*theta2),  -0.5,  10*Math.sin(phi+(i-0.4)*theta2)], norm: normalDir, uv: [0, 0] 
      //       }

      //       ringVerts.push(vert);


      //       vert = {
      //          pos: [11*Math.cos(phi+(i)*theta2),  -0.5,  11*Math.sin(phi+(i)*theta2)], norm: normalDir, uv: [0, 0] 
      //       }

      //       ringVerts.push(vert);
      //           //////////////////////////////////////////

      //   }//sharp teeth


          


//           for(let i = 0;i<ringSegments;i++){//harden outer sides top normals
//               ////////////////////////////////
//           let normalDir = [Math.cos(i*theta),0,Math.sin(i*theta)]
//           let normalA = [Math.cos((i-1)*theta),0,Math.sin((i-1)*theta)]
//           let normalB = [Math.cos(i*theta),0,Math.sin(i*theta)]
//               let vert = {
//                  pos: [rSO*Math.cos(phi+i*theta),  height + hardNormalExtension,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
//               }

//               ringVerts.push(vert);
//               vert = {
//                  pos: [rSO*Math.cos(phi+i*theta),  height,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
//               }

//               ringVerts.push(vert);

//               vert = {
//                  pos: [rSO*Math.cos(phi+(i-1)*theta),  height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
//               }

//               ringVerts.push(vert);
// ///////////////////////////////////////////////////
//               vert = {
//                  pos:  [rSO*Math.cos(phi+(i-1)*theta),  height,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
//               }

//               ringVerts.push(vert);

//               vert = {
//                  pos: [rSO*Math.cos(phi+(i-1)*theta),  height +hardNormalExtension,  rSO*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
//               }

//               ringVerts.push(vert);

//               vert = {
//                  pos: [rSO*Math.cos(phi+i*theta),  height+hardNormalExtension,  rSO*Math.sin(phi+i*theta)], norm: normalB, uv: [0.5, 0.5] 
//               }

//               ringVerts.push(vert);
//               //////////////////////////////////
//           }//harden outer sides top normals

         //  for(let i=0; i<ringSegments;i++){//cap top
         //    let normalDir = [0,1,0]
         //    let vert = {
         //       pos: [rTI*Math.cos(phi+(i-1)*theta),  heightTop,  rTI*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTI*Math.cos(phi+(i)*theta),  heightTop,  rTI*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTO*Math.cos(phi+(i)*theta),  heightTop,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////
         //    vert = {
         //       pos: [rTO*Math.cos(phi+(i)*theta),  heightTop,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTO*Math.cos(phi+(i-1)*theta),  heightTop,  rTO*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTI*Math.cos(phi+(i-1)*theta),  heightTop,  rTI*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////


         //  }//cap top



          
         //  let rTOb = rTO + hardNormalExtension;
         //  for(let i=0; i<ringSegments;i++){//harden top outer normal
         //    let normalDir = [0,1,0]
         //    let vert = {
         //       pos: [rTO*Math.cos(phi+(i-1)*theta),  heightTop,  rTO*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTO*Math.cos(phi+(i)*theta),  heightTop,  rTO*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTOb*Math.cos(phi+(i)*theta),  heightTop,  rTOb*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////
         //    vert = {
         //       pos: [rTOb*Math.cos(phi+(i)*theta),  heightTop,  rTOb*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTOb*Math.cos(phi+(i-1)*theta),  heightTop,  rTOb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTO*Math.cos(phi+(i-1)*theta),  heightTop,  rTO*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////


         //  }//harden top outer normal
          
         //   let rTOb1 = rTOb + sBL*Math.cos(Math.PI/6);
         //   let hb1 = heightTop - sBL*Math.sin(Math.PI/6);
         //  for(let i=0; i<ringSegments;i++){//bevel top outer ring 1
         //    let normalDir = [0,1,0]
         //    let normalA = [Math.cos((i-1)*theta),Math.cos(Math.PI/6),Math.sin((i-1)*theta)]
         //    let normalB = [Math.cos(i*theta),Math.cos(Math.PI/6),Math.sin(i*theta)]
         //    let normalC = [];
         //    let nornalD = [];

         //    let vert = {
         //       pos: [rTOb*Math.cos(phi+(i-1)*theta),  heightTop,  rTOb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTOb*Math.cos(phi+(i)*theta),  heightTop,  rTOb*Math.sin(phi+(i)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTOb1*Math.cos(phi+(i)*theta), hb1 ,  rTOb1*Math.sin(phi+(i)*theta)], norm: normalB, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////
         //    vert = {
         //       pos: [rTOb1*Math.cos(phi+(i)*theta), hb1,  rTOb1*Math.sin(phi+(i)*theta)], norm: normalB, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTOb1*Math.cos(phi+(i-1)*theta),  hb1,  rTOb1*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTOb*Math.cos(phi+(i-1)*theta),  heightTop,  rTOb*Math.sin(phi+(i-1)*theta)], norm: normalDir, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////


         //  }//bevel top outer ring1
          
         //   let rTOb2 = rTOb1 + sBL*Math.cos(Math.PI/3);
         //   let hb2 = hb1 - sBL*Math.sin(Math.PI/3);
         //  for(let i=0; i<ringSegments;i++){//bevel top outer ring 2
         //    let normalDir = [0,Math.cos(Math.PI/3),0]
         //    let normalA = [Math.cos((i-1)*theta),Math.cos(Math.PI/6),Math.sin((i-1)*theta)]
         //    let normalB = [Math.cos(i*theta),Math.cos(Math.PI/6),Math.sin(i*theta)]
         //    let normalC = [Math.cos((i-1)*theta),0,Math.sin((i-1)*theta)]
         //    let normalD = [Math.cos(i*theta),0,Math.sin(i*theta)]

         //    let vert = {
         //       pos: [rTOb1*Math.cos(phi+(i-1)*theta),  hb1,  rTOb1*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTOb1*Math.cos(phi+(i)*theta),  hb1,  rTOb1*Math.sin(phi+(i)*theta)], norm: normalB, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTOb2*Math.cos(phi+(i)*theta), hb2 ,  rTOb2*Math.sin(phi+(i)*theta)], norm: normalD, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////
         //    vert = {
         //       pos: [rTOb2*Math.cos(phi+(i)*theta), hb2,  rTOb2*Math.sin(phi+(i)*theta)], norm: normalD, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    vert = {
         //       pos: [rTOb2*Math.cos(phi+(i-1)*theta),  hb2,  rTOb2*Math.sin(phi+(i-1)*theta)], norm: normalC, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);

         //    vert = {
         //       pos: [rTOb1*Math.cos(phi+(i-1)*theta),  hb1,  rTOb1*Math.sin(phi+(i-1)*theta)], norm: normalA, uv: [0.5, 0.5] 
         //    }

         //    ringVerts.push(vert);
         //    ///////////////////////////////////////


         //  }//bevel top outer ring2



        
        const positions = [];
        const normals = [];
        const uvs = [];
        
        for(const vertex of ringVerts){
            positions.push(...vertex.pos);
            normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
        }
        
        const ringGeometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        ringGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions),positionNumComponents
        ));
        ringGeometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals),normalNumComponents
        ));
        ringGeometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs),uvNumComponents
        ));
        
        const loader = new THREE.TextureLoader();
         //  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        
        const ringMaterial = new THREE.MeshPhongMaterial({color: 0xcccc00, /*map:texture*/});
        const ringMaterial2 = new THREE.MeshStandardMaterial( { color: 0xf0eae8,roughness:0.1, metalness: 0.8} );
        
            const ring = new THREE.Mesh(ringGeometry, ringMaterial2);
            ring.rotation.x = Math.PI/2;
            // ring.position.y = 2.1;
            // ring.position.z = zOffset;

            ring.position.set(xOffset,yOffset,zOffset);


            return ring;
    

    


    }

}

export {BespokeGeo};