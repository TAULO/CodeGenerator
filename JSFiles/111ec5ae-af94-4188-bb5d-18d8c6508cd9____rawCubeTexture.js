import { b as __assign, a as __extends, _ as __decorate } from '../../../../common/tslib.es6-2542203d.js';
import { S as SerializationHelper, s as serialize, l as serializeAsMatrix } from '../../../../common/decorators-549f2b16.js';
import { T as Tools } from '../../../../common/tools-7eb5c69a.js';
import { M as Matrix, V as Vector3 } from '../../../../common/math.vector-92740b4e.js';
import { S as Scalar } from '../../../../common/math.scalar-e66d1d02.js';
import '../../../../common/sphericalPolynomial-25a51db3.js';
import { d as InternalTexture, e as InternalTextureSource, c as ThinEngine, b as LoadImage } from '../../../../common/fileTools-e883e409.js';
import { B as BaseTexture, T as Texture } from '../../../../common/texture-a93bc695.js';
import '../../../../common/scene-02f0c3e7.js';
import { P as PostProcess } from '../../../../common/baseTexture.polynomial-97d9cf1c.js';
import { L as Logger } from '../../../../common/logger-bef9f4b6.js';
import '../../../../common/renderTargetTexture-410d481a.js';
import '../../../../common/engine-6da2def3.js';
import { d as ShaderStore } from '../../../../common/effect-95a5a78c.js';
import '../../../../common/helperFunctions-8f465fbc.js';
import { R as RegisterClass, G as GetClass } from '../../../../common/typeStore-e0f83823.js';
import { R as RandomGUID } from '../../../../common/guid-586031d9.js';
import { O as Observable } from '../../../../common/observable-08535f24.js';
import '../../../../common/engine.rawTexture-f81738c1.js';
import '../../../../common/devTools-40c203e4.js';
import '../../../../common/math.color-1c350db4.js';
import '../../../../common/arrayTools-18b75ee3.js';
import '../../../../common/webRequest-2d96397b.js';
import '../../../../common/engineStore-733743e8.js';
import '../../../../common/math.axis-65421e97.js';
import '../../../../common/math.frustum-eeb481de.js';
import '../../../../common/math.plane-b261e683.js';
import '../../../../common/math.size-6da31c23.js';
import '../../../../common/math.viewport-b1e0df60.js';
import '../../../../common/error-ec1bafe5.js';
import '../../../../common/stringTools-39526e6b.js';
import '../../../../common/dataBuffer-bed89e2d.js';
import '../../../../common/drawWrapper-5520764a.js';
import '../../../../common/compatibilityOptions-4310763a.js';
import '../../../../common/smartArray-23f1522f.js';
import '../../../../common/uniformBuffer-c6105a9c.js';
import '../../../../common/pickingInfo-2221fa52.js';
import '../../../../common/buffer-82c85d65.js';
import '../../../../common/renderingManager-0400bd4b.js';
import '../../../../common/deviceInputEvents-42cd30dd.js';
import '../../../../common/perfCounter-0abcf648.js';
import '../../../../common/lightConstants-574d2608.js';

// Do not edit.
var name = "rgbdEncodePixelShader";
var shader = "varying vec2 vUV;\nuniform sampler2D textureSampler;\n#include<helperFunctions>\n#define CUSTOM_FRAGMENT_DEFINITIONS\nvoid main(void) \n{\ngl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);\n}";
// Sideeffect
ShaderStore.ShadersStore[name] = shader;

var DefaultEnvironmentTextureImageType = "image/png";
function _OnImageReadyAsync(image, engine, expandTexture, rgbdPostProcess, url, face, i, generateNonLODTextures, lodTextures, cubeRtt, texture) {
    return new Promise(function (resolve, reject) {
        if (expandTexture) {
            var tempTexture_1 = engine.createTexture(null, true, true, null, 1, null, function (message) {
                reject(message);
            }, image);
            rgbdPostProcess.getEffect().executeWhenCompiled(function () {
                // Uncompress the data to a RTT
                rgbdPostProcess.externalTextureSamplerBinding = true;
                rgbdPostProcess.onApply = function (effect) {
                    effect._bindTexture("textureSampler", tempTexture_1);
                    effect.setFloat2("scale", 1, engine._features.needsInvertingBitmap && image instanceof ImageBitmap ? -1 : 1);
                };
                if (!engine.scenes.length) {
                    return;
                }
                engine.scenes[0].postProcessManager.directRender([rgbdPostProcess], cubeRtt, true, face, i);
                // Cleanup
                engine.restoreDefaultFramebuffer();
                tempTexture_1.dispose();
                URL.revokeObjectURL(url);
                resolve();
            });
        }
        else {
            engine._uploadImageToTexture(texture, image, face, i);
            // Upload the face to the non lod texture support
            if (generateNonLODTextures) {
                var lodTexture = lodTextures[i];
                if (lodTexture) {
                    engine._uploadImageToTexture(lodTexture._texture, image, face, 0);
                }
            }
            resolve();
        }
    });
}
/**
 * Uploads the levels of image data to the GPU.
 * @param texture defines the internal texture to upload to
 * @param imageData defines the array buffer views of image data [mipmap][face]
 * @param imageType the mime type of the image data
 * @returns a promise
 */
function UploadLevelsAsync(texture, imageData, imageType) {
    if (imageType === void 0) { imageType = DefaultEnvironmentTextureImageType; }
    if (!Tools.IsExponentOfTwo(texture.width)) {
        throw new Error("Texture size must be a power of two");
    }
    var mipmapsCount = Scalar.ILog2(texture.width) + 1;
    // Gets everything ready.
    var engine = texture.getEngine();
    var expandTexture = false;
    var generateNonLODTextures = false;
    var rgbdPostProcess = null;
    var cubeRtt = null;
    var lodTextures = null;
    var caps = engine.getCaps();
    texture.format = 5;
    texture.type = 0;
    texture.generateMipMaps = true;
    texture._cachedAnisotropicFilteringLevel = null;
    engine.updateTextureSamplingMode(3, texture);
    // Add extra process if texture lod is not supported
    if (!caps.textureLOD) {
        expandTexture = false;
        generateNonLODTextures = true;
        lodTextures = {};
    }
    // in webgl 1 there are no ways to either render or copy lod level information for float textures.
    else if (!engine._features.supportRenderAndCopyToLodForFloatTextures) {
        expandTexture = false;
    }
    // If half float available we can uncompress the texture
    else if (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering) {
        expandTexture = true;
        texture.type = 2;
    }
    // If full float available we can uncompress the texture
    else if (caps.textureFloatRender && caps.textureFloatLinearFiltering) {
        expandTexture = true;
        texture.type = 1;
    }
    // Expand the texture if possible
    if (expandTexture) {
        // Simply run through the decode PP
        rgbdPostProcess = new PostProcess("rgbdDecode", "rgbdDecode", null, null, 1, null, 3, engine, false, undefined, texture.type, undefined, null, false);
        texture._isRGBD = false;
        texture.invertY = false;
        cubeRtt = engine.createRenderTargetCubeTexture(texture.width, {
            generateDepthBuffer: false,
            generateMipMaps: true,
            generateStencilBuffer: false,
            samplingMode: 3,
            type: texture.type,
            format: 5,
        });
    }
    else {
        texture._isRGBD = true;
        texture.invertY = true;
        // In case of missing support, applies the same patch than DDS files.
        if (generateNonLODTextures) {
            var mipSlices = 3;
            var scale = texture._lodGenerationScale;
            var offset = texture._lodGenerationOffset;
            for (var i = 0; i < mipSlices; i++) {
                //compute LOD from even spacing in smoothness (matching shader calculation)
                var smoothness = i / (mipSlices - 1);
                var roughness = 1 - smoothness;
                var minLODIndex = offset; // roughness = 0
                var maxLODIndex = (mipmapsCount - 1) * scale + offset; // roughness = 1 (mipmaps start from 0)
                var lodIndex = minLODIndex + (maxLODIndex - minLODIndex) * roughness;
                var mipmapIndex = Math.round(Math.min(Math.max(lodIndex, 0), maxLODIndex));
                var glTextureFromLod = new InternalTexture(engine, InternalTextureSource.Temp);
                glTextureFromLod.isCube = true;
                glTextureFromLod.invertY = true;
                glTextureFromLod.generateMipMaps = false;
                engine.updateTextureSamplingMode(2, glTextureFromLod);
                // Wrap in a base texture for easy binding.
                var lodTexture = new BaseTexture(null);
                lodTexture.isCube = true;
                lodTexture._texture = glTextureFromLod;
                lodTextures[mipmapIndex] = lodTexture;
                switch (i) {
                    case 0:
                        texture._lodTextureLow = lodTexture;
                        break;
                    case 1:
                        texture._lodTextureMid = lodTexture;
                        break;
                    case 2:
                        texture._lodTextureHigh = lodTexture;
                        break;
                }
            }
        }
    }
    var promises = [];
    var _loop_1 = function (i) {
        var _loop_2 = function (face) {
            // Constructs an image element from image data
            var bytes = imageData[i][face];
            var blob = new Blob([bytes], { type: imageType });
            var url = URL.createObjectURL(blob);
            var promise = void 0;
            if (typeof Image === "undefined" || engine._features.forceBitmapOverHTMLImageElement) {
                promise = engine.createImageBitmap(blob, { premultiplyAlpha: "none" }).then(function (img) {
                    return _OnImageReadyAsync(img, engine, expandTexture, rgbdPostProcess, url, face, i, generateNonLODTextures, lodTextures, cubeRtt, texture);
                });
            }
            else {
                var image_1 = new Image();
                image_1.src = url;
                // Enqueue promise to upload to the texture.
                promise = new Promise(function (resolve, reject) {
                    image_1.onload = function () {
                        _OnImageReadyAsync(image_1, engine, expandTexture, rgbdPostProcess, url, face, i, generateNonLODTextures, lodTextures, cubeRtt, texture)
                            .then(function () { return resolve(); })
                            .catch(function (reason) {
                            reject(reason);
                        });
                    };
                    image_1.onerror = function (error) {
                        reject(error);
                    };
                });
            }
            promises.push(promise);
        };
        // All faces
        for (var face = 0; face < 6; face++) {
            _loop_2(face);
        }
    };
    // All mipmaps up to provided number of images
    for (var i = 0; i < imageData.length; i++) {
        _loop_1(i);
    }
    // Fill remaining mipmaps with black textures.
    if (imageData.length < mipmapsCount) {
        var data = void 0;
        var size = Math.pow(2, mipmapsCount - 1 - imageData.length);
        var dataLength = size * size * 4;
        switch (texture.type) {
            case 0: {
                data = new Uint8Array(dataLength);
                break;
            }
            case 2: {
                data = new Uint16Array(dataLength);
                break;
            }
            case 1: {
                data = new Float32Array(dataLength);
                break;
            }
        }
        for (var i = imageData.length; i < mipmapsCount; i++) {
            for (var face = 0; face < 6; face++) {
                engine._uploadArrayBufferViewToTexture(texture, data, face, i);
            }
        }
    }
    // Once all done, finishes the cleanup and return
    return Promise.all(promises).then(function () {
        // Release temp RTT.
        if (cubeRtt) {
            engine._releaseTexture(texture);
            cubeRtt._swapAndDie(texture);
        }
        // Release temp Post Process.
        if (rgbdPostProcess) {
            rgbdPostProcess.dispose();
        }
        // Flag internal texture as ready in case they are in use.
        if (generateNonLODTextures) {
            if (texture._lodTextureHigh && texture._lodTextureHigh._texture) {
                texture._lodTextureHigh._texture.isReady = true;
            }
            if (texture._lodTextureMid && texture._lodTextureMid._texture) {
                texture._lodTextureMid._texture.isReady = true;
            }
            if (texture._lodTextureLow && texture._lodTextureLow._texture) {
                texture._lodTextureLow._texture.isReady = true;
            }
        }
    });
}
/**
 * @param internalTexture
 * @param data
 * @param sphericalPolynomial
 * @param lodScale
 * @param lodOffset
 * @hidden
 */
function _UpdateRGBDAsync(internalTexture, data, sphericalPolynomial, lodScale, lodOffset) {
    var proxy = internalTexture
        .getEngine()
        .createRawCubeTexture(null, internalTexture.width, internalTexture.format, internalTexture.type, internalTexture.generateMipMaps, internalTexture.invertY, internalTexture.samplingMode, internalTexture._compression);
    var proxyPromise = UploadLevelsAsync(proxy, data).then(function () { return internalTexture; });
    internalTexture.onRebuildCallback = function (_internalTexture) {
        return {
            proxy: proxyPromise,
            isReady: true,
            isAsync: true,
        };
    };
    internalTexture._source = InternalTextureSource.CubeRawRGBD;
    internalTexture._bufferViewArrayArray = data;
    internalTexture._lodGenerationScale = lodScale;
    internalTexture._lodGenerationOffset = lodOffset;
    internalTexture._sphericalPolynomial = sphericalPolynomial;
    return UploadLevelsAsync(internalTexture, data).then(function () {
        internalTexture.isReady = true;
        return internalTexture;
    });
}

ThinEngine.prototype._createDepthStencilCubeTexture = function (size, options, rtWrapper) {
    var internalTexture = new InternalTexture(this, InternalTextureSource.DepthStencil);
    internalTexture.isCube = true;
    if (this.webGLVersion === 1) {
        Logger.Error("Depth cube texture is not supported by WebGL 1.");
        return internalTexture;
    }
    var internalOptions = __assign({ bilinearFiltering: false, comparisonFunction: 0, generateStencil: false }, options);
    var gl = this._gl;
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, internalTexture, true);
    this._setupDepthStencilTexture(internalTexture, size, internalOptions.generateStencil, internalOptions.bilinearFiltering, internalOptions.comparisonFunction);
    rtWrapper._depthStencilTexture = internalTexture;
    rtWrapper._depthStencilTextureWithStencil = internalOptions.generateStencil;
    // Create the depth/stencil buffer
    for (var face = 0; face < 6; face++) {
        if (internalOptions.generateStencil) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, gl.DEPTH24_STENCIL8, size, size, 0, gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8, null);
        }
        else {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 0, gl.DEPTH_COMPONENT24, size, size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
        }
    }
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
    this._internalTexturesCache.push(internalTexture);
    return internalTexture;
};
ThinEngine.prototype._partialLoadFile = function (url, index, loadedFiles, onfinish, onErrorCallBack) {
    if (onErrorCallBack === void 0) { onErrorCallBack = null; }
    var onload = function (data) {
        loadedFiles[index] = data;
        loadedFiles._internalCount++;
        if (loadedFiles._internalCount === 6) {
            onfinish(loadedFiles);
        }
    };
    var onerror = function (request, exception) {
        if (onErrorCallBack && request) {
            onErrorCallBack(request.status + " " + request.statusText, exception);
        }
    };
    this._loadFile(url, onload, undefined, undefined, true, onerror);
};
ThinEngine.prototype._cascadeLoadFiles = function (scene, onfinish, files, onError) {
    if (onError === void 0) { onError = null; }
    var loadedFiles = [];
    loadedFiles._internalCount = 0;
    for (var index = 0; index < 6; index++) {
        this._partialLoadFile(files[index], index, loadedFiles, onfinish, onError);
    }
};
ThinEngine.prototype._cascadeLoadImgs = function (scene, texture, onfinish, files, onError, mimeType) {
    if (onError === void 0) { onError = null; }
    var loadedImages = [];
    loadedImages._internalCount = 0;
    for (var index = 0; index < 6; index++) {
        this._partialLoadImg(files[index], index, loadedImages, scene, texture, onfinish, onError, mimeType);
    }
};
ThinEngine.prototype._partialLoadImg = function (url, index, loadedImages, scene, texture, onfinish, onErrorCallBack, mimeType) {
    if (onErrorCallBack === void 0) { onErrorCallBack = null; }
    var tokenPendingData = RandomGUID();
    var onload = function (img) {
        loadedImages[index] = img;
        loadedImages._internalCount++;
        if (scene) {
            scene.removePendingData(tokenPendingData);
        }
        if (loadedImages._internalCount === 6 && onfinish) {
            onfinish(texture, loadedImages);
        }
    };
    var onerror = function (message, exception) {
        if (scene) {
            scene.removePendingData(tokenPendingData);
        }
        if (onErrorCallBack) {
            onErrorCallBack(message, exception);
        }
    };
    LoadImage(url, onload, onerror, scene ? scene.offlineProvider : null, mimeType);
    if (scene) {
        scene.addPendingData(tokenPendingData);
    }
};
ThinEngine.prototype._setCubeMapTextureParams = function (texture, loadMipmap, maxLevel) {
    var gl = this._gl;
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, loadMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texture.samplingMode = loadMipmap ? 3 : 2;
    if (loadMipmap && this.getCaps().textureMaxLevel && maxLevel !== undefined && maxLevel > 0) {
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAX_LEVEL, maxLevel);
        texture._maxLodLevel = maxLevel;
    }
    this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, null);
};
ThinEngine.prototype.createCubeTextureBase = function (rootUrl, scene, files, noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, fallback, beforeLoadCubeDataCallback, imageHandler, useSRGBBuffer) {
    var _this = this;
    if (onLoad === void 0) { onLoad = null; }
    if (onError === void 0) { onError = null; }
    if (forcedExtension === void 0) { forcedExtension = null; }
    if (createPolynomials === void 0) { createPolynomials = false; }
    if (lodScale === void 0) { lodScale = 0; }
    if (lodOffset === void 0) { lodOffset = 0; }
    if (fallback === void 0) { fallback = null; }
    if (beforeLoadCubeDataCallback === void 0) { beforeLoadCubeDataCallback = null; }
    if (imageHandler === void 0) { imageHandler = null; }
    if (useSRGBBuffer === void 0) { useSRGBBuffer = false; }
    var texture = fallback ? fallback : new InternalTexture(this, InternalTextureSource.Cube);
    texture.isCube = true;
    texture.url = rootUrl;
    texture.generateMipMaps = !noMipmap;
    texture._lodGenerationScale = lodScale;
    texture._lodGenerationOffset = lodOffset;
    texture._useSRGBBuffer = !!useSRGBBuffer && this._caps.supportSRGBBuffers && (this.webGLVersion > 1 || this.isWebGPU || !!noMipmap);
    if (!this._doNotHandleContextLost) {
        texture._extension = forcedExtension;
        texture._files = files;
    }
    var originalRootUrl = rootUrl;
    if (this._transformTextureUrl && !fallback) {
        rootUrl = this._transformTextureUrl(rootUrl);
    }
    var lastDot = rootUrl.lastIndexOf(".");
    var extension = forcedExtension ? forcedExtension : lastDot > -1 ? rootUrl.substring(lastDot).toLowerCase() : "";
    var loader = null;
    for (var _i = 0, _a = ThinEngine._TextureLoaders; _i < _a.length; _i++) {
        var availableLoader = _a[_i];
        if (availableLoader.canLoad(extension)) {
            loader = availableLoader;
            break;
        }
    }
    var onInternalError = function (request, exception) {
        if (rootUrl === originalRootUrl) {
            if (onError && request) {
                onError(request.status + " " + request.statusText, exception);
            }
        }
        else {
            // fall back to the original url if the transformed url fails to load
            Logger.Warn("Failed to load ".concat(rootUrl, ", falling back to the ").concat(originalRootUrl));
            _this.createCubeTextureBase(originalRootUrl, scene, files, !!noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, texture, beforeLoadCubeDataCallback, imageHandler, useSRGBBuffer);
        }
    };
    if (loader) {
        var onloaddata_1 = function (data) {
            if (beforeLoadCubeDataCallback) {
                beforeLoadCubeDataCallback(texture, data);
            }
            loader.loadCubeData(data, texture, createPolynomials, onLoad, onError);
        };
        if (files && files.length === 6) {
            if (loader.supportCascades) {
                this._cascadeLoadFiles(scene, function (images) { return onloaddata_1(images.map(function (image) { return new Uint8Array(image); })); }, files, onError);
            }
            else {
                if (onError) {
                    onError("Textures type does not support cascades.");
                }
                else {
                    Logger.Warn("Texture loader does not support cascades.");
                }
            }
        }
        else {
            this._loadFile(rootUrl, function (data) { return onloaddata_1(new Uint8Array(data)); }, undefined, undefined, true, onInternalError);
        }
    }
    else {
        if (!files) {
            throw new Error("Cannot load cubemap because files were not defined");
        }
        this._cascadeLoadImgs(scene, texture, function (texture, imgs) {
            if (imageHandler) {
                imageHandler(texture, imgs);
            }
        }, files, onError);
    }
    this._internalTexturesCache.push(texture);
    return texture;
};
ThinEngine.prototype.createCubeTexture = function (rootUrl, scene, files, noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, fallback, loaderOptions, useSRGBBuffer) {
    var _this = this;
    if (onLoad === void 0) { onLoad = null; }
    if (onError === void 0) { onError = null; }
    if (forcedExtension === void 0) { forcedExtension = null; }
    if (createPolynomials === void 0) { createPolynomials = false; }
    if (lodScale === void 0) { lodScale = 0; }
    if (lodOffset === void 0) { lodOffset = 0; }
    if (fallback === void 0) { fallback = null; }
    if (useSRGBBuffer === void 0) { useSRGBBuffer = false; }
    var gl = this._gl;
    return this.createCubeTextureBase(rootUrl, scene, files, !!noMipmap, onLoad, onError, format, forcedExtension, createPolynomials, lodScale, lodOffset, fallback, function (texture) { return _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true); }, function (texture, imgs) {
        var width = _this.needPOTTextures ? ThinEngine.GetExponentOfTwo(imgs[0].width, _this._caps.maxCubemapTextureSize) : imgs[0].width;
        var height = width;
        var faces = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        ];
        _this._bindTextureDirectly(gl.TEXTURE_CUBE_MAP, texture, true);
        _this._unpackFlipY(false);
        var internalFormat = format ? _this._getInternalFormat(format, texture._useSRGBBuffer) : texture._useSRGBBuffer ? gl.SRGB8_ALPHA8 : gl.RGBA;
        var texelFormat = format ? _this._getInternalFormat(format) : gl.RGBA;
        if (texture._useSRGBBuffer && _this.webGLVersion === 1) {
            texelFormat = internalFormat;
        }
        for (var index = 0; index < faces.length; index++) {
            if (imgs[index].width !== width || imgs[index].height !== height) {
                _this._prepareWorkingCanvas();
                if (!_this._workingCanvas || !_this._workingContext) {
                    Logger.Warn("Cannot create canvas to resize texture.");
                    return;
                }
                _this._workingCanvas.width = width;
                _this._workingCanvas.height = height;
                _this._workingContext.drawImage(imgs[index], 0, 0, imgs[index].width, imgs[index].height, 0, 0, width, height);
                gl.texImage2D(faces[index], 0, internalFormat, texelFormat, gl.UNSIGNED_BYTE, _this._workingCanvas);
            }
            else {
                gl.texImage2D(faces[index], 0, internalFormat, texelFormat, gl.UNSIGNED_BYTE, imgs[index]);
            }
        }
        if (!noMipmap) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        }
        _this._setCubeMapTextureParams(texture, !noMipmap);
        texture.width = width;
        texture.height = height;
        texture.isReady = true;
        if (format) {
            texture.format = format;
        }
        texture.onLoadedObservable.notifyObservers(texture);
        texture.onLoadedObservable.clear();
        if (onLoad) {
            onLoad();
        }
    }, !!useSRGBBuffer);
};

/**
 * Class for creating a cube texture
 */
var CubeTexture = /** @class */ (function (_super) {
    __extends(CubeTexture, _super);
    /**
     * Creates a cube texture to use with reflection for instance. It can be based upon dds or six images as well
     * as prefiltered data.
     * @param rootUrl defines the url of the texture or the root name of the six images
     * @param sceneOrEngine defines the scene or engine the texture is attached to
     * @param extensions defines the suffixes add to the picture name in case six images are in use like _px.jpg...
     * @param noMipmap defines if mipmaps should be created or not
     * @param files defines the six files to load for the different faces in that order: px, py, pz, nx, ny, nz
     * @param onLoad defines a callback triggered at the end of the file load if no errors occurred
     * @param onError defines a callback triggered in case of error during load
     * @param format defines the internal format to use for the texture once loaded
     * @param prefiltered defines whether or not the texture is created from prefiltered data
     * @param forcedExtension defines the extensions to use (force a special type of file to load) in case it is different from the file name
     * @param createPolynomials defines whether or not to create polynomial harmonics from the texture data if necessary
     * @param lodScale defines the scale applied to environment texture. This manages the range of LOD level used for IBL according to the roughness
     * @param lodOffset defines the offset applied to environment texture. This manages first LOD level used for IBL according to the roughness
     * @param loaderOptions options to be passed to the loader
     * @param useSRGBBuffer Defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU) (default: false)
     * @return the cube texture
     */
    function CubeTexture(rootUrl, sceneOrEngine, extensions, noMipmap, files, onLoad, onError, format, prefiltered, forcedExtension, createPolynomials, lodScale, lodOffset, loaderOptions, useSRGBBuffer) {
        if (extensions === void 0) { extensions = null; }
        if (noMipmap === void 0) { noMipmap = false; }
        if (files === void 0) { files = null; }
        if (onLoad === void 0) { onLoad = null; }
        if (onError === void 0) { onError = null; }
        if (format === void 0) { format = 5; }
        if (prefiltered === void 0) { prefiltered = false; }
        if (forcedExtension === void 0) { forcedExtension = null; }
        if (createPolynomials === void 0) { createPolynomials = false; }
        if (lodScale === void 0) { lodScale = 0.8; }
        if (lodOffset === void 0) { lodOffset = 0; }
        var _this = this;
        var _a;
        _this = _super.call(this, sceneOrEngine) || this;
        _this._lodScale = 0.8;
        _this._lodOffset = 0;
        /**
         * Observable triggered once the texture has been loaded.
         */
        _this.onLoadObservable = new Observable();
        /**
         * Gets or sets the center of the bounding box associated with the cube texture.
         * It must define where the camera used to render the texture was set
         * @see https://doc.babylonjs.com/how_to/reflect#using-local-cubemap-mode
         */
        _this.boundingBoxPosition = Vector3.Zero();
        _this._rotationY = 0;
        /** @hidden */
        _this._files = null;
        _this._forcedExtension = null;
        _this._extensions = null;
        _this.name = rootUrl;
        _this.url = rootUrl;
        _this._noMipmap = noMipmap;
        _this.hasAlpha = false;
        _this._format = format;
        _this.isCube = true;
        _this._textureMatrix = Matrix.Identity();
        _this._createPolynomials = createPolynomials;
        _this.coordinatesMode = Texture.CUBIC_MODE;
        _this._extensions = extensions;
        _this._files = files;
        _this._forcedExtension = forcedExtension;
        _this._loaderOptions = loaderOptions;
        _this._useSRGBBuffer = useSRGBBuffer;
        _this._lodScale = lodScale;
        _this._lodOffset = lodOffset;
        if (!rootUrl && !files) {
            return _this;
        }
        _this.updateURL(rootUrl, forcedExtension, onLoad, prefiltered, onError, extensions, (_a = _this.getScene()) === null || _a === void 0 ? void 0 : _a.useDelayedTextureLoading, files);
        return _this;
    }
    Object.defineProperty(CubeTexture.prototype, "boundingBoxSize", {
        /**
         * Returns the bounding box size
         * @see https://doc.babylonjs.com/how_to/reflect#using-local-cubemap-mode
         */
        get: function () {
            return this._boundingBoxSize;
        },
        /**
         * Gets or sets the size of the bounding box associated with the cube texture
         * When defined, the cubemap will switch to local mode
         * @see https://community.arm.com/graphics/b/blog/posts/reflections-based-on-local-cubemaps-in-unity
         * @example https://www.babylonjs-playground.com/#RNASML
         */
        set: function (value) {
            if (this._boundingBoxSize && this._boundingBoxSize.equals(value)) {
                return;
            }
            this._boundingBoxSize = value;
            var scene = this.getScene();
            if (scene) {
                scene.markAllMaterialsAsDirty(1);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CubeTexture.prototype, "rotationY", {
        /**
         * Gets texture matrix rotation angle around Y axis radians.
         */
        get: function () {
            return this._rotationY;
        },
        /**
         * Sets texture matrix rotation angle around Y axis in radians.
         */
        set: function (value) {
            this._rotationY = value;
            this.setReflectionTextureMatrix(Matrix.RotationY(this._rotationY));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CubeTexture.prototype, "noMipmap", {
        /**
         * Are mip maps generated for this texture or not.
         */
        get: function () {
            return this._noMipmap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CubeTexture.prototype, "forcedExtension", {
        /**
         * Gets the forced extension (if any)
         */
        get: function () {
            return this._forcedExtension;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates a cube texture from an array of image urls
     * @param files defines an array of image urls
     * @param scene defines the hosting scene
     * @param noMipmap specifies if mip maps are not used
     * @returns a cube texture
     */
    CubeTexture.CreateFromImages = function (files, scene, noMipmap) {
        var rootUrlKey = "";
        files.forEach(function (url) { return (rootUrlKey += url); });
        return new CubeTexture(rootUrlKey, scene, null, noMipmap, files);
    };
    /**
     * Creates and return a texture created from prefilterd data by tools like IBL Baker or Lys.
     * @param url defines the url of the prefiltered texture
     * @param scene defines the scene the texture is attached to
     * @param forcedExtension defines the extension of the file if different from the url
     * @param createPolynomials defines whether or not to create polynomial harmonics from the texture data if necessary
     * @return the prefiltered texture
     */
    CubeTexture.CreateFromPrefilteredData = function (url, scene, forcedExtension, createPolynomials) {
        if (forcedExtension === void 0) { forcedExtension = null; }
        if (createPolynomials === void 0) { createPolynomials = true; }
        var oldValue = scene.useDelayedTextureLoading;
        scene.useDelayedTextureLoading = false;
        var result = new CubeTexture(url, scene, null, false, null, null, null, undefined, true, forcedExtension, createPolynomials);
        scene.useDelayedTextureLoading = oldValue;
        return result;
    };
    /**
     * Get the current class name of the texture useful for serialization or dynamic coding.
     * @returns "CubeTexture"
     */
    CubeTexture.prototype.getClassName = function () {
        return "CubeTexture";
    };
    /**
     * Update the url (and optional buffer) of this texture if url was null during construction.
     * @param url the url of the texture
     * @param forcedExtension defines the extension to use
     * @param onLoad callback called when the texture is loaded  (defaults to null)
     * @param prefiltered Defines whether the updated texture is prefiltered or not
     * @param onError callback called if there was an error during the loading process (defaults to null)
     * @param extensions defines the suffixes add to the picture name in case six images are in use like _px.jpg...
     * @param delayLoad defines if the texture should be loaded now (false by default)
     * @param files defines the six files to load for the different faces in that order: px, py, pz, nx, ny, nz
     */
    CubeTexture.prototype.updateURL = function (url, forcedExtension, onLoad, prefiltered, onError, extensions, delayLoad, files) {
        if (onLoad === void 0) { onLoad = null; }
        if (prefiltered === void 0) { prefiltered = false; }
        if (onError === void 0) { onError = null; }
        if (extensions === void 0) { extensions = null; }
        if (delayLoad === void 0) { delayLoad = false; }
        if (files === void 0) { files = null; }
        if (!this.name || this.name.startsWith("data:")) {
            this.name = url;
        }
        this.url = url;
        if (forcedExtension) {
            this._forcedExtension = forcedExtension;
        }
        var lastDot = url.lastIndexOf(".");
        var extension = forcedExtension ? forcedExtension : lastDot > -1 ? url.substring(lastDot).toLowerCase() : "";
        var isDDS = extension.indexOf(".dds") === 0;
        var isEnv = extension.indexOf(".env") === 0;
        if (isEnv) {
            this.gammaSpace = false;
            this._prefiltered = false;
            this.anisotropicFilteringLevel = 1;
        }
        else {
            this._prefiltered = prefiltered;
            if (prefiltered) {
                this.gammaSpace = false;
                this.anisotropicFilteringLevel = 1;
            }
        }
        if (files) {
            this._files = files;
        }
        else {
            if (!isEnv && !isDDS && !extensions) {
                extensions = ["_px.jpg", "_py.jpg", "_pz.jpg", "_nx.jpg", "_ny.jpg", "_nz.jpg"];
            }
            this._files = this._files || [];
            this._files.length = 0;
            if (extensions) {
                for (var index = 0; index < extensions.length; index++) {
                    this._files.push(url + extensions[index]);
                }
                this._extensions = extensions;
            }
        }
        if (delayLoad) {
            this.delayLoadState = 4;
            this._delayedOnLoad = onLoad;
            this._delayedOnError = onError;
        }
        else {
            this._loadTexture(onLoad, onError);
        }
    };
    /**
     * Delays loading of the cube texture
     * @param forcedExtension defines the extension to use
     */
    CubeTexture.prototype.delayLoad = function (forcedExtension) {
        if (this.delayLoadState !== 4) {
            return;
        }
        if (forcedExtension) {
            this._forcedExtension = forcedExtension;
        }
        this.delayLoadState = 1;
        this._loadTexture(this._delayedOnLoad, this._delayedOnError);
    };
    /**
     * Returns the reflection texture matrix
     * @returns the reflection texture matrix
     */
    CubeTexture.prototype.getReflectionTextureMatrix = function () {
        return this._textureMatrix;
    };
    /**
     * Sets the reflection texture matrix
     * @param value Reflection texture matrix
     */
    CubeTexture.prototype.setReflectionTextureMatrix = function (value) {
        var _this = this;
        var _a;
        if (value.updateFlag === this._textureMatrix.updateFlag) {
            return;
        }
        if (value.isIdentity() !== this._textureMatrix.isIdentity()) {
            (_a = this.getScene()) === null || _a === void 0 ? void 0 : _a.markAllMaterialsAsDirty(1, function (mat) { return mat.getActiveTextures().indexOf(_this) !== -1; });
        }
        this._textureMatrix = value;
    };
    CubeTexture.prototype._loadTexture = function (onLoad, onError) {
        var _this = this;
        var _a;
        if (onLoad === void 0) { onLoad = null; }
        if (onError === void 0) { onError = null; }
        var scene = this.getScene();
        var oldTexture = this._texture;
        this._texture = this._getFromCache(this.url, this._noMipmap, undefined, undefined, this._useSRGBBuffer, this.isCube);
        var onLoadProcessing = function () {
            var _a;
            _this.onLoadObservable.notifyObservers(_this);
            if (oldTexture) {
                oldTexture.dispose();
                (_a = _this.getScene()) === null || _a === void 0 ? void 0 : _a.markAllMaterialsAsDirty(1);
            }
            if (onLoad) {
                onLoad();
            }
        };
        var errorHandler = function (message, exception) {
            _this._loadingError = true;
            _this._errorObject = { message: message, exception: exception };
            if (onError) {
                onError(message, exception);
            }
            Texture.OnTextureLoadErrorObservable.notifyObservers(_this);
        };
        if (!this._texture) {
            if (this._prefiltered) {
                this._texture = this._getEngine().createPrefilteredCubeTexture(this.url, scene, this._lodScale, this._lodOffset, onLoad, errorHandler, this._format, this._forcedExtension, this._createPolynomials);
            }
            else {
                this._texture = this._getEngine().createCubeTexture(this.url, scene, this._files, this._noMipmap, onLoad, errorHandler, this._format, this._forcedExtension, false, this._lodScale, this._lodOffset, null, this._loaderOptions, !!this._useSRGBBuffer);
            }
            (_a = this._texture) === null || _a === void 0 ? void 0 : _a.onLoadedObservable.add(function () { return _this.onLoadObservable.notifyObservers(_this); });
        }
        else {
            if (this._texture.isReady) {
                Tools.SetImmediate(function () { return onLoadProcessing(); });
            }
            else {
                this._texture.onLoadedObservable.add(function () { return onLoadProcessing(); });
            }
        }
    };
    /**
     * Parses text to create a cube texture
     * @param parsedTexture define the serialized text to read from
     * @param scene defines the hosting scene
     * @param rootUrl defines the root url of the cube texture
     * @returns a cube texture
     */
    CubeTexture.Parse = function (parsedTexture, scene, rootUrl) {
        var texture = SerializationHelper.Parse(function () {
            var prefiltered = false;
            if (parsedTexture.prefiltered) {
                prefiltered = parsedTexture.prefiltered;
            }
            return new CubeTexture(rootUrl + parsedTexture.name, scene, parsedTexture.extensions, false, parsedTexture.files || null, null, null, undefined, prefiltered, parsedTexture.forcedExtension);
        }, parsedTexture, scene);
        // Local Cubemaps
        if (parsedTexture.boundingBoxPosition) {
            texture.boundingBoxPosition = Vector3.FromArray(parsedTexture.boundingBoxPosition);
        }
        if (parsedTexture.boundingBoxSize) {
            texture.boundingBoxSize = Vector3.FromArray(parsedTexture.boundingBoxSize);
        }
        // Animations
        if (parsedTexture.animations) {
            for (var animationIndex = 0; animationIndex < parsedTexture.animations.length; animationIndex++) {
                var parsedAnimation = parsedTexture.animations[animationIndex];
                var internalClass = GetClass("BABYLON.Animation");
                if (internalClass) {
                    texture.animations.push(internalClass.Parse(parsedAnimation));
                }
            }
        }
        return texture;
    };
    /**
     * Makes a clone, or deep copy, of the cube texture
     * @returns a new cube texture
     */
    CubeTexture.prototype.clone = function () {
        var _this = this;
        var uniqueId = 0;
        var newCubeTexture = SerializationHelper.Clone(function () {
            var cubeTexture = new CubeTexture(_this.url, _this.getScene() || _this._getEngine(), _this._extensions, _this._noMipmap, _this._files);
            uniqueId = cubeTexture.uniqueId;
            return cubeTexture;
        }, this);
        newCubeTexture.uniqueId = uniqueId;
        return newCubeTexture;
    };
    __decorate([
        serialize()
    ], CubeTexture.prototype, "url", void 0);
    __decorate([
        serialize("rotationY")
    ], CubeTexture.prototype, "rotationY", null);
    __decorate([
        serialize("files")
    ], CubeTexture.prototype, "_files", void 0);
    __decorate([
        serialize("forcedExtension")
    ], CubeTexture.prototype, "_forcedExtension", void 0);
    __decorate([
        serialize("extensions")
    ], CubeTexture.prototype, "_extensions", void 0);
    __decorate([
        serializeAsMatrix("textureMatrix")
    ], CubeTexture.prototype, "_textureMatrix", void 0);
    return CubeTexture;
}(BaseTexture));
Texture._CubeTextureParser = CubeTexture.Parse;
// Some exporters relies on Tools.Instantiate
RegisterClass("BABYLON.CubeTexture", CubeTexture);

/**
 * Raw cube texture where the raw buffers are passed in
 */
var RawCubeTexture = /** @class */ (function (_super) {
    __extends(RawCubeTexture, _super);
    /**
     * Creates a cube texture where the raw buffers are passed in.
     * @param scene defines the scene the texture is attached to
     * @param data defines the array of data to use to create each face
     * @param size defines the size of the textures
     * @param format defines the format of the data
     * @param type defines the type of the data (like Engine.TEXTURETYPE_UNSIGNED_INT)
     * @param generateMipMaps  defines if the engine should generate the mip levels
     * @param invertY defines if data must be stored with Y axis inverted
     * @param samplingMode defines the required sampling mode (like Texture.NEAREST_SAMPLINGMODE)
     * @param compression defines the compression used (null by default)
     */
    function RawCubeTexture(scene, data, size, format, type, generateMipMaps, invertY, samplingMode, compression) {
        if (format === void 0) { format = 5; }
        if (type === void 0) { type = 0; }
        if (generateMipMaps === void 0) { generateMipMaps = false; }
        if (invertY === void 0) { invertY = false; }
        if (samplingMode === void 0) { samplingMode = 3; }
        if (compression === void 0) { compression = null; }
        var _this = _super.call(this, "", scene) || this;
        _this._texture = scene.getEngine().createRawCubeTexture(data, size, format, type, generateMipMaps, invertY, samplingMode, compression);
        return _this;
    }
    /**
     * Updates the raw cube texture.
     * @param data defines the data to store
     * @param format defines the data format
     * @param type defines the type fo the data (Engine.TEXTURETYPE_UNSIGNED_INT by default)
     * @param invertY defines if data must be stored with Y axis inverted
     * @param compression defines the compression used (null by default)
     */
    RawCubeTexture.prototype.update = function (data, format, type, invertY, compression) {
        if (compression === void 0) { compression = null; }
        this._texture.getEngine().updateRawCubeTexture(this._texture, data, format, type, invertY, compression);
    };
    /**
     * Updates a raw cube texture with RGBD encoded data.
     * @param data defines the array of data [mipmap][face] to use to create each face
     * @param sphericalPolynomial defines the spherical polynomial for irradiance
     * @param lodScale defines the scale applied to environment texture. This manages the range of LOD level used for IBL according to the roughness
     * @param lodOffset defines the offset applied to environment texture. This manages first LOD level used for IBL according to the roughness
     * @returns a promise that resolves when the operation is complete
     */
    RawCubeTexture.prototype.updateRGBDAsync = function (data, sphericalPolynomial, lodScale, lodOffset) {
        if (sphericalPolynomial === void 0) { sphericalPolynomial = null; }
        if (lodScale === void 0) { lodScale = 0.8; }
        if (lodOffset === void 0) { lodOffset = 0; }
        return _UpdateRGBDAsync(this._texture, data, sphericalPolynomial, lodScale, lodOffset).then(function () { });
    };
    /**
     * Clones the raw cube texture.
     * @return a new cube texture
     */
    RawCubeTexture.prototype.clone = function () {
        var _this = this;
        return SerializationHelper.Clone(function () {
            var scene = _this.getScene();
            var internalTexture = _this._texture;
            var texture = new RawCubeTexture(scene, internalTexture._bufferViewArray, internalTexture.width, internalTexture.format, internalTexture.type, internalTexture.generateMipMaps, internalTexture.invertY, internalTexture.samplingMode, internalTexture._compression);
            if (internalTexture.source === InternalTextureSource.CubeRawRGBD) {
                texture.updateRGBDAsync(internalTexture._bufferViewArrayArray, internalTexture._sphericalPolynomial, internalTexture._lodGenerationScale, internalTexture._lodGenerationOffset);
            }
            return texture;
        }, this);
    };
    return RawCubeTexture;
}(CubeTexture));

export { RawCubeTexture };
