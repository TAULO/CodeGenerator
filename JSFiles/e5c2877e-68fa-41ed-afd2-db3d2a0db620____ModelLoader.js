var x;
var y;
var z;
var ModelLoader = (function () {

    function ModelLoader() {
        this.url;
        this.datGuiLoaded = false;
        this.DocumentId;
        this.DocumentVersionId;
        this.Extension;
        this.envMap;
        this.effectComposer;
        this.ssaoPass;
        this.saoPass;
        this.renderPass;
        this.effectFXAA;
        this.ambientOcclusion = false;
        this.hdrCubeRenderTarget;
        this.showNavigationCubeViewer = false;
    }

    ModelLoader.prototype = {

        constructor: ModelLoader,

        initModel: function initModel(docExtId, docVerExtId, extension, LoadingOLprocessIdentifier, treeNode) {
            this.DocumentId = docExtId;
            this.DocumentVersionId = docVerExtId;
            this.Extension = extension;
            //document.getElementById('myID').innerHTML = "Loading " + extension + " file"
            //var fileName = docExtId + extension;
            //this.GetPresignedURLForDocument(docVerExtId, extension, "stream", fileName, LoadingOLprocessIdentifier)

            //this.url = '/Document/DownloadFile?mime=stream&bucket=PDF&externalId=' + docExtId + extension + '&projectId=' + projectId;
            //this.url = downloadItem(docExtId, docVerExtId, extension, true)
           //this.loadNewTextureHdr();
           // this.postProcessing();
            if (!LoadingOLprocessIdentifier) {
                LoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadModel");
            }
            this.loadModel(docExtId, docVerExtId, extension, LoadingOLprocessIdentifier, treeNode);
            
            return true;
        },

        genCubeUrls: function (prefix, postfix) {
            return [
                prefix + 'px' + postfix, prefix + 'nx' + postfix,
                prefix + 'py' + postfix, prefix + 'ny' + postfix,
                prefix + 'pz' + postfix, prefix + 'nz' + postfix
            ];
        },

        loadNewTextureHdr: function (callback) {
            
            var hdrUrls = Three.ModelLoader.genCubeUrls('/Content/3DGraphics/hdr/', '.hdr');
            if (typeof (Three.ModelLoader.envMap) === "undefined") {
                new THREE.HDRCubeTextureLoader().load(THREE.UnsignedByteType, hdrUrls, function (hdrCubeMap) {
                    var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap);
                    pmremGenerator.update(Three.renderer);
                    var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
                    pmremCubeUVPacker.update(Three.renderer);
                    this.hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;
                    hdrCubeMap.dispose();
                    pmremGenerator.dispose();
                    pmremCubeUVPacker.dispose();

                    Three.ModelLoader.envMap = this.hdrCubeRenderTarget;
                    callback();

                });
            }
            else {
                callback();
            }

                

        },
        //loadNewTextureHdr: function () {


        //    var hdrCubeRenderTarget;
        //    var hdrUrls = Three.ModelLoader.genCubeUrls('/Content/3DGraphics/hdr/', '.hdr');
        //    //var loader = new THREE.HDRCubeTextureLoader();
        //    new THREE.HDRCubeTextureLoader().load(THREE.UnsignedByteType, hdrUrls, Three.ModelLoader.loadHdrs());

        //},


        //loadHdrs : function(hdrCubeMap) {

        //    var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap);
        //    pmremGenerator.update(Three.renderer);

        //    var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);

        //    pmremCubeUVPacker.update(Three.renderer);

        //    hdrCubeRenderTarget = pmremCubeUVPacker.CubeUVRenderTarget;

        //    hdrCubeMap.dispose();
        //    pmremGenerator.dispose();
        //    pmremCubeUVPacker.dispose();
        //    Three.ModelLoader.envMap = hdrCubeRenderTarget;

        //},
        postProcessing: function () {
            var pixelRatio = Three.renderer.getPixelRatio();
            var newWidth = Math.floor(Three.container.clientWidth / pixelRatio) || 1;
            var newHeight = Math.floor(Three.container.clientHeight / pixelRatio) || 1;
            
            this.renderPass = new THREE.RenderPass(Three.scene, Three.camera);
            this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effectFXAA.uniforms['resolution'].value.set(1 / (Three.container.clientWidth * pixelRatio), 1 / (Three.container.clientHeight * pixelRatio));
            this.effectFXAA.renderToScreen = true;

                // Setup SSAO pass
            //this.ssaoPass = new THREE.SSAOPass(Three.scene, Three.camera);
            //this.ssaoPass.setSize(Three.container.clientWidth, Three.container.clientHeight);
            //this.ssaoPass.aoClamp = 1;
            //this.ssaoPass.radius = 5;
            //this.ssaoPass.lumInfluence =0.02;
            //this.ssaoPass.renderToScreen = false;

            //set the SAO pass for Ambient occlusion 
            this.saoPass = new THREE.SAOPass(Three.scene, Three.camera, false, false);
            ////this.saoPass.setSize(Three.container.clientWidth, Three.container.clientHeight);
            this.saoPass.renderToScreen = false;
            this.saoPass.params.output = THREE.SAOPass.OUTPUT.Default;
            
            this.saoPass.params.saoBias = 200;
            this.saoPass.params.saoIntensity = 0.01;
            this.saoPass.params.saoScale = 15;
            this.saoPass.params.saoKernelRadius = 2;
            this.saoPass.params.saoMinResolution = 0;
            this.saoPass.params.saoBlur = true;
            this.saoPass.params.saoBlurRadius =10;
            this.saoPass.params.saoBlurStdDev = 6;
            //var copyPass = new THREE.ShaderPass(THREE.CopyShader);
            //copyPass.renderToScreen = true;

            var parameters = {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                stencilBuffer: true,
            };

            
            renderTarget = new THREE.WebGLRenderTarget(Three.container.clientWidth, Three.container.clientHeight, parameters);
            renderTarget.texture.name = 'EffectComposer.rt1'; 
                // Add pass to effect composer
            this.effectComposer = new THREE.EffectComposer(Three.renderer, renderTarget);
            
            this.effectComposer.setSize(Three.container.clientWidth * pixelRatio, Three.container.clientHeight * pixelRatio);
            this.effectComposer.addPass(this.renderPass);
            //this.effectComposer.addPass(this.ssaoPass);
            
            this.effectComposer.addPass(this.saoPass);
            this.effectComposer.addPass(this.effectFXAA);
            
            

        },


        loadProductModel: function loadProductModel(productId) {
            LoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadModel");
            this.checkForProductMtl(productId, LoadingOLprocessIdentifier);
        },

        loadModel: function loadModel(docExtId, docVerExtId, extension, LoadingOLprocessIdentifier, treeNode) {
            this.DocumentId = docExtId;
            this.DocumentVersionId = docVerExtId;
            this.Extension = extension;

          /*  if (loadedModule == "EMS") {*/ //show the viewer
                Three.fileType = extension.toLowerCase().replace(".", "");
                Three.DocumentId = docExtId;
                Three.DocumentVersionId = docVerExtId;
                ThreeD_VL.onLoading3Dmodel();
                if (!LoadingOLprocessIdentifier) {
                    LoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadModel");
                }
            //} 

            var callBack; 
            var that = this;
            switch (extension.toUpperCase()) {
                case ".STL":
                    callBack = function (data, loadingOL) {
                        that.loadSTL(data, loadingOL, treeNode);
                    };
                    FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, callBack, LoadingOLprocessIdentifier);
                    break;
                case ".OBJ":
                    if (window.presignedUrl) {
                        callBack = function (data, loadingOL) {
                            that.loadOBJ(data, loadingOL, treeNode);
                        };
                        FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, callBack, LoadingOLprocessIdentifier);
                    } else {
                        // If the user opens an .obj, check to see if an .mtl exists in the same directory
                        this.checkForMtlOrObj(docExtId, ".mtl", docVerExtId, null, LoadingOLprocessIdentifier, treeNode);
                        //loadOBJ(url);
                    }
                    break;
                case ".MTL":
                    // If the user opens an .obj, check to see if an .mtl exists in the same directory
                    this.checkForMtlOrObj(docExtId, ".obj", null, docVerExtId, LoadingOLprocessIdentifier, treeNode);
                    //loadOBJ(url);
                    break;
                case ".DAE":
                    callBack = function (data, loadingOL) {
                        that.loadDae(data, loadingOL, treeNode);
                    };
                    //this.loadDae(FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, true, LoadingOLprocessIdentifier), LoadingOLprocessIdentifier);
                    FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, callBack, LoadingOLprocessIdentifier);
                    break;
                case ".IFC":

                    //this.loadObjMtl(FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, true, LoadingOLprocessIdentifier), LoadingOLprocessIdentifier);
                    this.loadIfc(docExtId, docVerExtId, LoadingOLprocessIdentifier, treeNode );
                    //FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, this.loadObjMtl, LoadingOLprocessIdentifier);
                    break;
                case ".GLB":
                    callBack = function (data, loadingOL) {
                        that.loadGlb(data, loadingOL, treeNode);
                    };
                    FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, callBack, LoadingOLprocessIdentifier);
                    //this.loadGlb(docExtId, docVerExtId, LoadingOLprocessIdentifier);
                    break;
                case ".FBX":
                    callBack = function (data, loadingOL) {
                        that.loadFBX(data, loadingOL, treeNode);
                    };
                    FileOperationLogic.downloadItem(docExtId, docVerExtId, extension, callBack, LoadingOLprocessIdentifier);
                    break;
                

            };
        },

        loadIfc: function (docExtId, docVerExtId, LoadingOLprocessIdentifier, treeNode) {
            var that = this
            Three.fileType = ".ifc";
            FileOperationLogic.downloadItem(
                docExtId,
                docVerExtId,
                ".glb",
                function (objUrl) {
                    // FileOperationLogic.downloadItem(
                    //     docExtId,
                    //     docVerExtId,
                    //     ".mtl",
                    //     function (mtlUrl) {
                    //         that.loadObjMtl({
                    //             obj: objUrl,
                    //             mtl: mtlUrl,
                    //             requiresSchucalMtl: false
                    //         }, LoadingOLprocessIdentifier);
                    //     });

                    that.loadGlb(
                        objUrl
                        //mtl: mtlUrl,
                        //requiresSchucalMtl: false
                        , LoadingOLprocessIdentifier, treeNode);
                },
                LoadingOLprocessIdentifier);
        },
        //loadIfc: function (docExtId, docVerExtId, LoadingOLprocessIdentifier) {
        //    var that = this
        //    Three.fileType = ".ifc";
        //    FileOperationLogic.downloadItem(
        //        docExtId,
        //        docVerExtId,
        //        ".glb",
        //        function (glbUrl) {
        //            that.loadGlb({
        //                glb: glbUrl,
        //                requiresSchucalMtl: false
        //            }, LoadingOLprocessIdentifier);
        //        },
        //        LoadingOLprocessIdentifier);

        //},

        //loadIfc: function (docExtId, docVerExtId, LoadingOLprocessIdentifier) {
        //    var that = this
        //    Three.fileType = ".ifc";
        //    FileOperationLogic.downloadItem(
        //        docExtId,
        //        docVerExtId,
        //        ".obj",
        //        function (objUrl) {
        //            FileOperationLogic.downloadItem(
        //                docExtId,
        //                docVerExtId,
        //                ".mtl",
        //                function (mtlUrl) {
        //                    that.loadObjMtl({
        //                        obj: objUrl,
        //                        mtl: mtlUrl,
        //                        requiresSchucalMtl: false
        //                    }, LoadingOLprocessIdentifier);
        //                });
        //        },
        //        LoadingOLprocessIdentifier);
        //},
        loadGlb: function (url, processIdentifier, treeNode) {
            //var secondLoadingOLprocessIdentifier = processIdentifier;
           
            // if (Object.keys(Loading_OL.loadingOverlayStartTimes).length > 0) {
            //     for (var i in Loading_OL.loadingOverlayStartTimes) {
            //         Loading_OL.stopGenericLoadingScreen(i);
            //     }
            // }
            
            // secondLoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadGlb");
            // Loading_OL.stopGenericLoadingScreen(processIdentifier);
           // }
            //Loading_OL.stopGenericLoadingScreen(processIdentifier);
            var loader = new THREE.GLTFLoader();
           
            Three.fileType = ".glb";
            var materialColor = new THREE.Color();
            materialColor.setHex(0xffffff);

            loader.load(url, function (mesh) {

                
                var scene = mesh.scene;
                mesh.scene.type = "Group";
                
                mesh.scene.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.side = (child.material.opacity == null || child.material.opacity >= 0.5) ? THREE.DoubleSide : THREE.SingleSide;
                        child.material.roughness = 0.5;
                        child.material.reflectivity = 0.4;
                        child.material.metalness = 0;
                        child.material.clipShadows = true;
                        child.material.clippingPlanes = [];
                        child.castShadow = true;
                        child.receiveShadow = false;
                    } else if (child instanceof THREE.Group) {
                        child.children.forEach(function (childMesh) {
                            childMesh.material.side = (childMesh.material.opacity == null || childMesh.material.opacity >= 0.5) ? THREE.DoubleSide : THREE.SingleSide;
                            childMesh.material.clipShadows = true;
                            childMesh.material.clippingPlanes = [];
                            childMesh.castShadow = true;
                            childMesh.receiveShadow = false;
                            childMesh.material.roughness = 0.5;
                            childMesh.material.reflectivity = 0.4;
                            childMesh.material.metalness = 0;
                        });
                    }
                });
                
                Three.ModelLoader.loadComplete(mesh.scene, null, false, treeNode, true);
                //Three.scene.add(mesh.scene);

            }, Three.ModelLoader.onProgress, function (xhr) { Three.ModelLoader.onError(xhr) });

        },

        loadTestCube: function loadTestCube() {
            var materials = [
               new THREE.MeshLambertMaterial({
                   //map: THREE.TextureLoader('/Content/images/3DViewer/cube_front.png')
                map: THREE.ImageUtils.loadTexture('/ClientApp/src/assets/images/3DViewer/cube_front.png')
               }),
               new THREE.MeshLambertMaterial({
                   //map: THREE.TextureLoader(load)
                 map: THREE.ImageUtils.loadTexture('/ClientApp/src/assets/images/3DViewer/cube_back.png')
               }),
               new THREE.MeshLambertMaterial({
                 map: THREE.ImageUtils.loadTexture('/ClientApp/src/assets/images/3DViewer/cube_top.png')
               }),
               new THREE.MeshLambertMaterial({
                 map: THREE.ImageUtils.loadTexture('/ClientApp/src/assets/images/3DViewer/cube_bottom.png')
               }),
               new THREE.MeshLambertMaterial({
                 map: THREE.ImageUtils.loadTexture('/ClientApp/src/assets/images/3DViewer/cube_left.png')
               }),
               new THREE.MeshLambertMaterial({
                 map: THREE.ImageUtils.loadTexture('/ClientApp/src/assets/images/3DViewer/cube_right.png')
               })
            ];

            var mesh = new THREE.Mesh(
                new THREE.BoxGeometry(10, 10, 10),
                new THREE.MeshFaceMaterial(materials)
            );

          Three.ModelLoader.loadComplete(mesh);
        },

        loadFBX: function loadFBX(url, processIdentifier, treeNode) {
            var secondLoadingOLprocessIdentifier = processIdentifier;
            if (!(secondLoadingOLprocessIdentifier)) {
                secondLoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadSTL");
            }

            var loader = new THREE.FBXLoader();
            var materialColor = new THREE.Color();
            materialColor.setHex(0xffffff);
            Three.fileType = ".fbx";
            loader.load(url, function (mesh) {
                //mixer = new THREE.AnimationMixer(mesh);
                //var action = mixer.clipAction(mesh.animations[0]);
                //action.play();
                //mesh.traverse(function (child) {
                //    if (child.isMesh) {
                //        child.castShadow = true;
                //        child.receiveShadow = true;
                //    }
                //});
                //Three.scene.add(mesh);

                var material = new THREE.MeshPhongMaterial({
                    color: materialColor,
                    side: THREE.DoubleSide,
                    clipShadows: true
                });

                //var mesh =geometry;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                //Three.scene.add(mesh);
                Three.ModelLoader.loadComplete(mesh, secondLoadingOLprocessIdentifier, false, treeNode);
            }, Three.ModelLoader.onProgress, Three.ModelLoader.onError);

        },

        loadSTL: function loadSTL(url, processIdentifier, treeNode) {
            //var secondLoadingOLprocessIdentifier = processIdentifier;
            //if (!(secondLoadingOLprocessIdentifier)) {
            //    secondLoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadSTL");
            //}

            var loader = new THREE.STLLoader();
            var materialColor = new THREE.Color();
            materialColor.setHex(0xffffff);
            Three.fileType = ".stl";
            loader.load(url, function (geometry) {

                var material = new THREE.MeshPhongMaterial({
                    color: materialColor,
                    side: THREE.DoubleSide,
                    clipShadows: true
                });

                var mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                Three.ModelLoader.loadComplete(mesh, false, treeNode);
            }, Three.ModelLoader.onProgress, Three.ModelLoader.onError);

        },

        loadOBJ: function loadOBJ(url, processIdentifier, treeNode) {
            //var secondLoadingOLprocessIdentifier = processIdentifier;
            //if (!(secondLoadingOLprocessIdentifier)) {
            //    secondLoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadOBJ");
            //}
            var loader = new THREE.OBJLoader();
            var materialColor = new THREE.Color();
            materialColor.setHex(0xffffff);
            Three.fileType = ".obj";
            //var url = "../Content/3DGraphics/Clinic_A_20110906_optimized.obj";
            //var url = "../Content/3DGraphics/OneWallTwoWindows.obj";

            loader.load(url, function (mesh) {

                // if (loadedModule != "EMS") {
                    var material = new THREE.MeshPhongMaterial({
                        color: materialColor,
                        side: THREE.DoubleSide,
                        clipShadows: true
                    });
                // } else {
                //     var material = new THREE.MeshBasicMaterial({
                //         color: materialColor,
                //         side: THREE.DoubleSide,
                //         clipShadows: true
                //     });
                // }

                mesh.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                        child.castShadow = true;
                        child.receiveShadow = false;
                    }
                });

                // if (loadedModule == "EMS") {
                //     mesh.rotateX(-Math.PI / 2);
                //     mesh.rotateZ(-Math.PI / 2);
                // }
                for (i = 0; i < mesh.children.length; i++) {
                    mesh.children[i].geometry.computeVertexNormals();
                }
                Three.ModelLoader.loadComplete(mesh, false, treeNode);

            }, Three.ModelLoader.onProgress, function (xhr) { Three.ModelLoader.onError(xhr) });
        },

        loadDae: function loadDae(url, processIdentifier, treeNode) {
            //var secondLoadingOLprocessIdentifier = processIdentifier;
            //if (!(secondLoadingOLprocessIdentifier)) {
            //    var secondLoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadDAE");
            //}

            var loader = new THREE.ColladaLoader();
            var materialColor = new THREE.Color();
            loader.options.convertUpAxis = true;
            materialColor.setHex(0xffffff);
            Three.fileType = ".dae";
            loader.load(url, function (collada) {
                var mesh = collada.scene;
                //var material = new THREE.MeshPhongMaterial({
                //    color: materialColor,
                //    side: THREE.DoubleSide,
                //    clipShadows: true
                //});

                //mesh.traverse(function (child) {
                //    if (child instanceof THREE.Mesh) {
                //        child.material = material;
                //        child.castShadow = true;
                //        child.receiveShadow = true;
                //    }
                //});

                Three.ModelLoader.loadComplete(mesh, treeNode);

            }, Three.ModelLoader.onProgress, function (xhr) { Three.ModelLoader.onError(xhr) });

        },


        loadObjMtl: function loadObjMtl(urls, processIdentifier, treeNode) {
            //if (Object.keys(Loading_OL.loadingOverlayStartTimes).length > 0) {
            //    for (var i in Loading_OL.loadingOverlayStartTimes) {
            //        Loading_OL.stopGenericLoadingScreen(i);
            //    }
            //}
            //if (processIdentifier) {
            //    var secondLoadingOLprocessIdentifier = processIdentifier;
            //} else {
               // var secondLoadingOLprocessIdentifier = Loading_OL.startGenericLoadingScreenWithDelay("loadOBJMTL");
            //}

           // Loading_OL.stopGenericLoadingScreen(processIdentifier);

            var fileAsObj = urls[0];
            var fileAsMtl = urls[1];

            Three.fileType = ".ifc";

             requiresSchucalMtl = (urls[0].requiresSchucalMtl && urls[0].requiresSchucalMtl !== "false")
             if (requiresSchucalMtl) {
                 fileAsObj = urls[0].obj;
                 fileAsMtl = "/ClientApp/src/assets/Schuecal/schucal.mtl";
             }
            // else {//if (typeof urls.fileFound !== "undefined" && url.fileFound) {
            //     fileAsObj = urls.obj;
            //     fileAsMtl = urls.mtl;
            // }
            //else {
            //    fileAsObj = urls.toString().replace(".ifc", ".obj");
            //    fileAsMtl = urls.toString().replace(".ifc", ".mtl");
            //}
            //var fileAsObj = "../Content/3DGraphics/Clinic_A_20110906_optimized.obj";
            //var fileAsMtl = "../Content/3DGraphics/Clinic_A_20110906_optimized.mtl";

            var mtlLoader = new THREE.MTLLoader();

            mtlLoader.load(fileAsMtl, function (materials) {

                var objLoader = new THREE.OBJLoader();
                //materials.preload();
                objLoader.setMaterials(materials);

                objLoader.load(fileAsObj, function (mesh) {
                    //mesh.rotateX(-Math.PI / 2);
                    //mesh.rotateZ(-Math.PI / 2);
                    for (i = 0; i < mesh.children.length; i++) {
                        mesh.children[i].geometry.computeVertexNormals();
                    }
                    if (requiresSchucalMtl) {
                        mesh.scale.set(0.001, 0.001, 0.001)
                    }
                    Three.ModelLoader.loadComplete(mesh, requiresSchucalMtl, treeNode);

                }, Three.ModelLoader.onProgress, function (xhr) { Three.ModelLoader.onError(xhr) });

            }, function(e){}, console.log("error while loading materials. This is probably due to missing textures (currently not supported)."));
        },

        onProgress: function onProgress(xhr) {
            var a = xhr;
            try {
                var total = xhr.currentTarget.getResponseHeader("Content-Length");
                //if (xhr.lengthComputable) {
                var percentComplete = (xhr.loaded / total) * 12.5;
                percentComplete = Math.round(percentComplete, 2);

                dataExchange.sendParentMessage('ifcPagePercent', {'percent': percentComplete});
                
                //console.log(percentComplete);

                //Loading_OL.updatePercentText(percentComplete);

                //if (Three.loadedModule == "DOCUMENT" && percentComplete == 100) {
                   // Loading_OL.stopGenericLoadingScreen(Three.loadingOverlayName);
                    return;
                //} 
                //}
            } catch (e) { }
        },

        onProgressConsole: function onProgressConsole(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                //console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        },

        onError: function onError(xhr, processIdentifier) {
            console.error(xhr.message);
            Three.Utils.destroyMesh()
            //if (loadedModule == "EMS") {
                //ScrlTabs.closeCastViewer();
                Loading_OL.stopGenericLoadingScreen(processIdentifier);
            //}
        },

        readyForModel: function readyForModel() {

            $("#loadingGif").addClass("hidden");

            document.addEventListener('resize', Three.DocumentEventHandler.onResizeContainer, false);

            var tapped = false;
            var isHeld = false;
            var isApple = false;
            var isAndroid = false;

            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                isApple = true;
            }
            if (/Android/i.test(navigator.userAgent)) {
                isAndroid = true;
            }

            if (!Three.isMobileTablet) {
                Three.renderer.domElement.addEventListener('mousemove',
                    Three.DocumentEventHandler.onDocumentMouseMove,
                    false);
                Three.renderer.domElement.addEventListener('mouseup',
                    Three.DocumentEventHandler.onDocumentMouseUp,
                    false);
                Three.renderer.domElement.addEventListener('dblclick',
                    Three.DocumentEventHandler.onDocumentDblClick,
                    false);
                Three.renderer.domElement.addEventListener('click', Three.DocumentEventHandler.onDocumentClick, false);
            } else {
                var hammer = new Hammer.Manager(Three.renderer.domElement);
                hammer.add(new Hammer.Tap({ event: "doubletap", taps: 2 }));
                hammer.add(new Hammer.Tap({ event: "singletap" }));
                hammer.add(new Hammer.Press({ event: "press" }));

                hammer.get('doubletap').recognizeWith('singletap');
                hammer.get('singletap').requireFailure('doubletap');

                // tap
                hammer.on("singletap", function (e) {
                    console.log("HammerJS: You're tapping me!");
                    Three.DocumentEventHandler.onDocumentClick(e);
                    console.log(e);
                });

                // Dbl Tap
                hammer.on("doubletap", function (e) {
                    console.log("HammerJS: You're double tapping me!");
                    Three.DocumentEventHandler.onDocumentDblClick(e);
                    console.log(e);
                });

                // Hold
                hammer.on("press", function (e) {
                    console.log("HammerJS: You're pressing me!");
                    Three.DocumentEventHandler.onDocumentClick(e);
                    console.log(e);
                });


                //$(Three.renderer.domElement).kendoTouch({
                //    //enableSwipe: true,
                //    touchstart: function (e) {
                //        console.log("touchstart kendo");
                //    },
                //    //swipe: function (e) {
                //    //    console.log("swipe " + e.direction);
                //    //},
                //    tap: function (e) {
                //        if (!isHeld) {
                //            console.log("tap kendo");
                //            Three.DocumentEventHandler.onDocumentClick(e.event);
                //            console.log("Tap finished kendo");
                //        } else {
                //            isHeld = false;
                //        }
                //        e.event.preventDefault();
                //    },
                //    doubletap: function (e) {
                //        console.log("double tap");
                //        Three.DocumentEventHandler.onDocumentDblTap(e.event);
                //    },
                //    hold: function (e) {
                //        console.log("hold kendo: "+e.event.type);
                //        e.event.stopPropagation();
                //        isHeld = true;
                //        e.event.preventDefault();
                //        if (isApple) {
                //            //e.event.type = "contextmenuKendo";
                //            Three.DocumentEventHandler.onDocumentClick(e.event);
                //        }
                //    },
                //    touchend: function (e) {
                //        if (isApple) {
                //            return;
                //        }
                //        console.log("touchend kendo");
                //        if (!isHeld) {

                //            e.event.stopPropagation();
                //        } else {
                //            isHeld = false;
                //        }
                //    }
                //});
            }
            Three.renderer.domElement.addEventListener('contextmenu', Three.DocumentEventHandler.onDocumentClick, false);

        },

        loadComplete: function loadComplete(mesh, processIdentifier, YAxisUp, treeNode, resetAllMaterials) {
            // Three.ThreeDToolbar.createToolbar(this.DocumentId, this.DocumentVersionId, this.Extension);

            var oldMesh = Three.scene.getObjectByName("MainMesh");

            if (typeof (oldMesh) !== "undefined") {
                Three.Utils.destroyMesh(Three.scene.getObjectByName("MainMesh").id);
            }

            mesh.name = "MainMesh";
            mesh.treeNode = treeNode;
            // Rein: work in progress
            mesh.statusMaterials = []; // select : new THREE.Color(0x26BEAD)
            if (resetAllMaterials) {
                mesh.statusMaterials.push(new THREE.Color(0x97a0ae)); // unassigned
                mesh.statusMaterials.push(new THREE.Color(0x009fe3)); // assigned
                mesh.statusMaterials.push(new THREE.Color(0x00ce7d)); // completed
                mesh.statusMaterials.push(new THREE.Color(0xffc634)); // in progress
                mesh.statusMaterials.push(new THREE.Color(0xf6503c)); // defect
            }


            mesh.statusMaterials.push(new THREE.Color(0xFFFFFF)); // hidden line

            mesh = this.ResetMaterialsRecursivly(mesh, resetAllMaterials);


            // if (loadedModule == "DOCUMENT" && !Three.isCapping) {

            //     Three.scene.add(mesh);
                
            //     this.scaleDownModel(mesh);
            //     if (!window.presignedUrl) {
            //         // it is not a shared document
            //         Three.ThreeDTagUtils.load3DTags();
            //     }

            //     if (extension == ".ifc") {
            //         Three.Gui.setUpOrientationY();
            //     }

            //     Three.Utils.centerObject(mesh);

            //     Three.ControlUtils.initTransformControls();

            //     Three.ViewToggle.setTopView();

            // } else if (loadedModule == "EMS") {
                // ScrlTabs.showCastViewer();
                Three.scene.add(mesh);
                this.scaleDownModel(mesh);
                //if (!(YAxisUp)) {
                    // Three.Gui.setUpOrientationY();
                    dataExchange.sendParentMessage('setUpOrientationY',true);
                //} else {
                //    Three.Gui.setUpOrientationY();
                //}
                Three.Utils.centerObject(mesh);

            // } else if (loadedModule == "PRODUCT") {
            //     Three.scene.add(mesh);
            //     this.scaleDownModel(mesh);
            //     Three.Utils.setUpOrientationZ()
            //     Three.Utils.centerObject(mesh);
            //     Three.Utils.zoomToObject();
            // }
            this.postProcessing();

            // if (!Three.isMobileTablet && loadedModule == "DOCUMENT") {
            //     Three.NavigationCube = new NavigationCube()
            //     Three.NavigationCube.create(Three);
            //     Three.navCubeLoaded = true;
            // }
        //    Three.NavigationCube = new NavigationCube()
        //    Three.NavigationCube.create(Three);
        //    Three.navCubeLoaded = true;


            // if (loadedModule == "EMS") {
                // ThreeD_VL.onLoading3DmodelComplete();
                Three.ViewToggle.setTopRightFrontView();
                setTimeout(function(){
                    dataExchange.sendParentMessage('fileLoaded',true);
                }, 200)
            // }

            // Loading_OL.stopGenericLoadingScreen(processIdentifier);

            // Loading_OL.checkIfOnly2DViewerRemaining();
           // Three.ThreeDTagUtils.showAllTags();
           //Three.ThreeDTagUtils.load3DTags();
        },

        scaleDownModel: function (object) {
            // resize if the model is too large

            if (object.scale.x != 1 || object.scale.y != 1 || object.scale.z != 1) {
                // Rein: the model has already explicitly been scaled. ths happens with schucal models, for example. let's hold off on further scaling
                return;
            }
            var BBhelper = new THREE.BoxHelper(object);
            BBhelper.geometry.computeBoundingSphere();

            var radius = BBhelper.geometry.boundingSphere.radius;
            var scale = 1;
            while (radius > 2000) {
                scale = scale / 1000;
                radius = scale * BBhelper.geometry.boundingSphere.radius;
            }

            while (radius < 0.5) {
                scale = scale * 1000;
                radius = scale * BBhelper.geometry.boundingSphere.radius;
            }

            if (scale !== 1 && object.children) {
                object.children.forEach(function (o) { o.scale.setScalar(scale) });
            }

        },

        checkForMtlOrObj: function checkForMtlOrObj(docExtId, extension, objDocVerId, mtlDocVerId, LoadingOLprocessIdentifier, treeNode) {

            var that = this;
            extension = docExtId[0].extension;
            objDocVerId = docExtId[0].docVerExtId;
            docExtId = docExtId[0].docExtId;
            
            var onsuccess = function (response) {
                if (extension.toUpperCase() == ".OBJ") {
                    objDocVerId = response;
                    mtlDocVerId = docExtId;
                } else if (extension.toUpperCase() == ".MTL") {
                    objDocVerId = docExtId;
                    mtlDocVerId = response;
                } else {
                    throw "unknown extnsion";
                }

                dataExchange.sendParentMessage('getObjUrl',({'objverId':objDocVerId , 'mtlverId':mtlDocVerId }))

                // right, so a bit of callback hell here, as we need to:
                //  - get the url for the OBJ 
                //  - get the url for the MTL, 
                //  - wrap those and pass them to loadObjMtl.
                // FileOperations.prototype.downloadItem(
                //     objDocVerId,
                //     null,
                //     ".obj",
                //     function (objUrl) {
                //         FileOperations.prototype.downloadItem(
                //             mtlDocVerId,
                //             null,
                //             ".mtl",
                //             function (mtlUrl) {
                //                 that.loadObjMtl({
                //                     obj: objUrl,
                //                     mtl: mtlUrl,
                //                     requiresSchucalMtl: false,
                //                     treeNode: treeNode
                //                 })
                //             },
                //             null);
                //     },
                //     null
                // )
            };

            var onerror = function (response) {
                // if (loadedModule == "EMS") {
                //     FileOperationLogic.downloadItem(
                //         docExtId,
                //         objDocVerId,
                //         ".obj",
                //         function (url) {
                //             that.loadObjMtl({
                //                 obj: url,
                //                 requiresSchucalMtl: true
                //             },
                //             LoadingOLprocessIdentifier,
                //                 treeNode);
                //         });
                //     //that.loadObjMtl(FileOperationLogic.downloadItem(docExtId, objDocVerId, ".obj", true, LoadingOLprocessIdentifier), processIdentifier, true);
                // } else {
                    // var callBack = function (data, loadingOL) {
                    //     that.loadOBJ(data, loadingOL, treeNode);
                    // };
                    // FileOperations.downloadItem(docExtId, objDocVerId, ".obj", callBack, null, treeNode);

                    dataExchange.sendParentMessage('getActualObjUrl',({'docExtId':docExtId , 'objverId':objDocVerId }))
                    //that.loadOBJ(FileOperationLogic.downloadItem(docExtId, objDocVerId, ".obj", true, LoadingOLprocessIdentifier), LoadingOLprocessIdentifier);
               // }
            };

            $.ajax({
                type: "GET",
                url: "/Document/CheckForMtlOrObj",
                data: {
                    projectId: ProjectId,
                    documentId: docExtId,
                    extension: extension
                },
                success: function (response) {

                    if (response == false || response == null || response == "") {
                        onerror(response);
                    } else {
                        onsuccess(response);
                    }
                },
                error: onerror,

                complete: function (response) {
                    //console.log(response);
                }
            });
        },

        loadProductObj: function loadProductObj(ProductGuid, mtlUrl, LoadingOLprocessIdentifier) {

            var that = this;
            var ProductGuid = ProductGuid;
            var mtlUrl = mtlUrl;
            var LoadingOLprocessIdentifier = LoadingOLprocessIdentifier;

            var onSuccess = function (objUrl) {
                if (mtlUrl == null) {
                    that.loadOBJ(objUrl, LoadingOLprocessIdentifier);
                } else {
                    that.loadObjMtl({
                        obj: objUrl,
                        mtl: mtlUrl
                    }, LoadingOLprocessIdentifier)
                }
            }

            var onError = function (response) {
                FileOperationLogic.onFailedFileOperation(response);
                Loading_OL.stopGenericLoadingScreen(LoadingOLprocessIdentifier);
            }

            FileOperationLogic.GetPublicImageUrl("ProductModel", ProductGuid, onSuccess, onError);
        },

        checkForProductMtl: function checkForProductMtl(ProductGuid, LoadingOLprocessIdentifier) {

            var that = this;
            var ProductGuid = ProductGuid;
            var LoadingOLprocessIdentifier = LoadingOLprocessIdentifier;

            var onSuccess = function (mtlUrl) {
                that.loadProductObj(ProductGuid, mtlUrl, LoadingOLprocessIdentifier)
            }

            var onError = function (response) {
                that.loadProductObj(ProductGuid, null, LoadingOLprocessIdentifier)
            }

            FileOperationLogic.GetPublicImageUrl("ProductMaterial", ProductGuid, onSuccess, onError);
        },


        getSelectionCube: function () {
            var selectionCube = Three.scene.getObjectByName("myCube");
            selectionCube = typeof (selectionCube) !== "undefined" ? selectionCube : false;
            return selectionCube;
        },

        getModel: function getModel() {
            model = Three.scene.getObjectByName("MainMesh");
            // if a model is not loaded, return a basic cube on the origin
            if (typeof (model) === "undefined") { model = new THREE.Mesh(new THREE.CubeGeometry(2, 2, 2), new THREE.MeshNormalMaterial()) }
            return model;
        },

        ResetMaterialsRecursivly: function (mesh, isIFC) {
            
            let statusMaterials = {
                solid: [],
                transparant:[]
            };

            // create two versions of each status material
            if (mesh.statusMaterials && mesh.statusMaterials.length>0) {
                mesh.statusMaterials.forEach(function (material) {
                    statusMaterials.solid.push(new THREE.MeshPhysicalMaterial({
                        color: material,
                        opacity: 1,
                        transparent: false,
                        side: THREE.DoubleSide,
                        clipShadows: true,
                        roughness: 0.5,
                        reflectivity: 0.4,
                        metalness: 0
                    }));

                    statusMaterials.transparant.push(new THREE.MeshPhysicalMaterial({
                        color: material,
                        opacity: 0.3,
                        transparent: true,
                        side: THREE.SingleSide,
                        clipShadows: true,
                        roughness: 0.5,
                        reflectivity: 0.4,
                        metalness: 0
                    }));
                });
            }


            //mesh = Three.Utils.traverseMesh(
            //    mesh,
            let groupCallback = function (group) {
                //if (typeof group.statusMaterials === "undefined") {
                //    group.statusMaterials = group.parent.statusMaterials;
                //}
                group.materialSet = 0;

                group.originalPosition = $.extend(true, {}, group.position);
                let BBhelper = new THREE.BoxHelper(group);
                if (!BBhelper.geometry.boundingSphere) {
                    BBhelper.geometry.computeBoundingSphere();
                }

                group.originalBoundingSpherePosition = new THREE.Vector3(
                    BBhelper.geometry.boundingSphere.center.x,
                    BBhelper.geometry.boundingSphere.center.y,
                    BBhelper.geometry.boundingSphere.center.z
                );
            };
            let meshCallback = function (mesh) {
                mesh.originalPosition = $.extend(true, {}, mesh.position);

                let BBhelper = new THREE.BoxHelper(mesh);
                if (!BBhelper.geometry.boundingSphere) {
                    BBhelper.geometry.computeBoundingSphere();
                }
                var BSphereChild = BBhelper.geometry.boundingSphere;
                mesh.originalBoundingSpherePosition = new THREE.Vector3(
                    BBhelper.geometry.boundingSphere.center.x,
                    BBhelper.geometry.boundingSphere.center.y,
                    BBhelper.geometry.boundingSphere.center.z
                );

                //if (typeof mesh.statusMaterials === "undefined") {
                //    if (typeof mesh.parent.statusMaterials === "undefined") {
                //        mesh.parent.statusMaterials = [];
                //    }
                //    mesh.statusMaterials = mesh.parent.statusMaterials;
                //}

                if (typeof mesh.geometry !== "undefined" && mesh.geometry.groups.length === 0 && !isIFC) {
                    // we don't have groups, so let's create a single one (required for use with multi-materials)
                    if (mesh.geometry.index !== null) {
                        mesh.geometry.addGroup(0, mesh.geometry.index.count, 0);
                    } else {
                        mesh.geometry.addGroup(0, mesh.geometry.attributes.position.count, 0);
                    }
                }
                if (typeof mesh.geometry !== "undefined") {
                    if ((typeof mesh.material.materials === "undefined" || mesh.geometry.groups.length === 0)) {
                        // add materials
                        let materialsArray = [];
                        let high = 0;
                        mesh.geometry.groups.forEach(function (e) { if (e.materialIndex > high) { high = e.materialIndex; } });

                        if (typeof mesh.material !== "undefined") {
                            for (let i = 0; i < high + 1; i++) {
                                materialsArray.push(
                                    new THREE.MeshPhysicalMaterial({
                                        color: mesh.material.color,
                                        transparent: mesh.material.transparent,
                                        opacity: mesh.material.opacity,
                                        side: mesh.material.opacity > 0.5 ? THREE.DoubleSide : THREE.SingleSide,
                                        clipShadows: mesh.material.clipShadows,
                                        clippingPlanes: [],
                                        castShadow: true,
                                        receiveShadow: false,
                                        roughness: 0.5,
                                        reflectivity: 0.4,
                                        metalness: 0
                                    })
                                );
                            }
                        } else {
                            for (let i = 0; i < high + 1; i++) {
                                materialsArray.push(new THREE.MeshPhongMaterial({
                                    color: new THREE.Color(0xffffff),
                                    side: THREE.DoubleSide,
                                    clipShadows: false
                                }));
                            }
                        }

                        if (!mesh.geometry.groups || mesh.geometry.groups.length === 0) {
                            mesh.dummyMaterial = { materials: materialsArray };
                            mesh = Three.ModelLoader.addToMultiMaterial(mesh, mesh.dummyMaterial, statusMaterials);
                        } else {
                            mesh.material = new THREE.MultiMaterial(materialsArray);
                            mesh = Three.ModelLoader.addToMultiMaterial(mesh, mesh.material, statusMaterials);
                        }
                    }
                } else {
                    mesh = Three.ModelLoader.addToMultiMaterial(mesh, mesh.material, statusMaterials);
                }
            };
            //);
       
            mesh.traverse(function (obj) {
                if (obj.type === "Mesh") {
                    meshCallback(obj);
                } else {
                    groupCallback(obj);
                }
            });

            return mesh;
        },

        addToMultiMaterial: function (mesh, multiMaterial, statusMaterials) {
            var originalMaterialArrayLength = multiMaterial.materials.length;
            var originalGroupArrayLength = mesh.geometry.groups.length;
            var bufferLength = mesh.geometry.attributes.position.count;

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // for each material make it transparent and add it to the multimaterial
            multiMaterial.materials.forEach(function (material) {
                //var newMaterial = jQuery.extend(true, {}, material);
                var newMaterialopacity = material.opacity;
                if (newMaterialopacity == null || newMaterialopacity > 0.5) {
                    newMaterialopacity = 0.5;
                }
                multiMaterial.materials.push(new THREE.MeshPhysicalMaterial(
                    {
                        color: material.color,
                        transparent: true, 
                        opacity: newMaterialopacity,
                        side: (newMaterialopacity == null || newMaterialopacity >= 0.5) ? THREE.DoubleSide : THREE.SingleSide,
                        roughness: 0.5,
                        reflectivity: 0.4,
                        metalness: 0,
                        clipShadows: true,
                        clippingPlanes: []
                    }));

            }); // add material to multimaterial

            // store transparent materials original groups seperately for easy recalling
            var dummyGeometry = new THREE.BufferGeometry();

            // adding it to the group sets, first for the transparent material
            mesh.geometry.groups.forEach(function (group) {
                dummyGeometry.addGroup(group.start, group.count, originalMaterialArrayLength + group.materialIndex);
            });

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // for each material make inverted and add it to the multimaterial
            for (var i = 0; i < originalMaterialArrayLength; i++) {
                var material = multiMaterial.materials[i];
                var delta = 0.2;
                if ((material.color.r + material.color.g + material.color.b) > 1.5) {
                    delta = -0.2;
                }
                var newMaterialopacity = material.opacity;
                if (newMaterialopacity == null || newMaterialopacity < 0.5) {
                    newMaterialopacity = 0.5;
                }
                var invertColor = new THREE.Color(Math.min(1, Math.max(0, material.color.r + delta)), Math.min(1, Math.max(0, material.color.g + delta)), Math.min(1, Math.max(0, material.color.b + delta)));
                multiMaterial.materials.push(new THREE.MeshPhysicalMaterial({
                    color: invertColor,
                    transparent: true,
                    opacity: newMaterialopacity,
                    side: (newMaterialopacity == null || newMaterialopacity >= 0.5) ? THREE.DoubleSide : THREE.SingleSide,
                    clipShadows: true,
                    roughness: 0.5,
                    reflectivity: 0.4,
                    metalness: 0
                }))
            };

            // adding it to the group sets, second for the inverted material
            var secondDummyGeometry = new THREE.BufferGeometry();
            for (var i = 0; i < originalGroupArrayLength; i++) {
                var group = mesh.geometry.groups[i];
                secondDummyGeometry.addGroup(group.start, group.count, originalMaterialArrayLength + originalGroupArrayLength + group.materialIndex);
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


            for (var i = 0; i < originalMaterialArrayLength; i++) {
                var material = multiMaterial.materials[i];

                if (material.opacity <= 0.5) {
                    var newRoughness = 0;
                } else {
                    var newRoughness = 0.8;
                }

                if (material.opacity < 1) {
                    var newMaterialTransparent = true;

                } else {
                    var newMaterialTransparent = false;
                }

                multiMaterial.materials.push(new THREE.MeshPhysicalMaterial({
                    color: material.color,
                    transparent: newMaterialTransparent,
                    opacity: material.opacity,
                    side: (material.opacity == null || material.opacity >= 0.5) ? THREE.DoubleSide : THREE.SingleSide,
                    clipShadows: false,
                    roughness: newRoughness,
                    reflectivity: 0.4,
                    metalness: 0,
                    clippingPlanes: []
                }))
            };

            // adding it to the group sets, third for the inverted material
            var thirdDummyGeometry = new THREE.BufferGeometry();
            for (var i = 0; i < originalGroupArrayLength; i++) {
                var group = mesh.geometry.groups[i];
                thirdDummyGeometry.addGroup(group.start, group.count, originalMaterialArrayLength + 2 * originalGroupArrayLength + group.materialIndex);
                //thirdDummyGeometry.addGroup(group.start, group.count, group.materialIndex);
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //if (mesh.geometry.groups[0].count !== dummyGeometry.groups[0].count) {
            //}

            mesh.geometry.groupSets = [mesh.geometry.groups, dummyGeometry.groups, secondDummyGeometry.groups, thirdDummyGeometry.groups];
            // resetting original material set, using a parameter which we can update



            mesh.materialSet = 0;
            mesh.geometry.groups = mesh.geometry.groupSets[mesh.materialSet];

            for (let j = 0; j < statusMaterials.solid.length; j++) {

                for (let i = 0; i < originalMaterialArrayLength; i++) {
                    let material = multiMaterial.materials[i];
                    let statusMaterial = statusMaterials.solid[j];
                    if (material.opacity < 0.5) {
                        statusMaterial = statusMaterials.transparant[j];
                    }

                    multiMaterial.materials.push(statusMaterial); // add material to multimaterial

                };


                let statusDummyGeometry = new THREE.BufferGeometry();
                for (let i = 0; i < originalGroupArrayLength; i++) {
                    let group = mesh.geometry.groups[i];
                    statusDummyGeometry.addGroup(
                        group.start,
                        group.count,
                        originalGroupArrayLength * (4 + j) + group.materialIndex);
                }

                mesh.geometry.groupSets.push(statusDummyGeometry.groups);
            }
            
            return mesh;
        }
    }

    return ModelLoader;

})();

