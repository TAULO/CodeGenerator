import {Color} from "../math/Color.js";
import {Vector3} from "../math/Vector3.js";
import {Vector4} from "../math/Vector4.js";
import {Sphere} from "../math/Sphere.js";
import {Matrix4} from '../math/Matrix4.js';
import {Plane} from "../math/Plane.js";
import {_Math} from "../math/math.js"
import {Object3D} from "../core/Object3D.js";
import {WebGLProgram} from "../renderers/webgl/WebGLProgram.js";
import {ShaderLib} from "../renderers/shaders/ShaderLib.js";
import {UniformsUtils} from "../renderers/shaders/UniformsUtils.js";
import {WebGLUniforms} from "../renderers/webgl/WebGLUniforms.js";
import {BufferGeometry} from "../core/BufferGeometry.js";
import {WebGLLights} from "../renderers/webgl/WebGLLights.js";

var PGL = PGL || {};

/**
 * 获取数组中最小值
 * @param array
 * @returns {number|*}
 */
PGL.arrayMin = function(array) {

  if (array.length === 0) return Infinity;

  var min = array[0];

  for (var i = 1, l = array.length; i < l; ++i) {

    if (array[i] < min) min = array[i];

  }

  return min;

};

/**
 * 获取数组中最大值
 * @param array
 * @returns {number|*}
 */
PGL.arrayMax = function(array) {

  if (array.length === 0) return -Infinity;

  var max = array[0];

  for (var i = 1, l = array.length; i < l; ++i) {

    if (array[i] > max) max = array[i];

  }

  return max;

};

/**
 * 由六个平面组成的锥体
 * @param p0
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @param p5
 * @constructor
 */
PGL.Frustum = function(p0, p1, p2, p3, p4, p5) {

  this.planes = [

    (p0 !== undefined) ? p0 : new Plane(),
    (p1 !== undefined) ? p1 : new Plane(),
    (p2 !== undefined) ? p2 : new Plane(),
    (p3 !== undefined) ? p3 : new Plane(),
    (p4 !== undefined) ? p4 : new Plane(),
    (p5 !== undefined) ? p5 : new Plane()

  ];

};
Object.assign(PGL.Frustum.prototype, {

  set: function(p0, p1, p2, p3, p4, p5) {

    var planes = this.planes;

    planes[0].copy(p0);
    planes[1].copy(p1);
    planes[2].copy(p2);
    planes[3].copy(p3);
    planes[4].copy(p4);
    planes[5].copy(p5);

    return this;

  },

  clone: function() {

    return new this.constructor().copy(this);

  },

  copy: function(frustum) {

    var planes = this.planes;

    for (var i = 0; i < 6; i++) {

      planes[i].copy(frustum.planes[i]);

    }

    return this;

  },

  /**
   * WebGLRenderer使用它来从Camera的projectionMatrix和matrixWorldInverse设置Frustum。
   * @param m
   * @return {setFromMatrix}
   */
  setFromMatrix: function(m) {

    var planes = this.planes;
    var me = m.elements;
    var me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
    var me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
    var me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
    var me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

    planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
    planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
    planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
    planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
    planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
    planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();

    return this;

  },

  /**
   * 检查对象的边界球是否与Frustum相交。
   * 请注意，对象必须具有Geometry或BufferGeometry，以便可以计算边界球。
   */
  intersectsObject: function() {

    var sphere = new Sphere();

    return function intersectsObject(object) {

      var geometry = object.geometry;

      if (geometry.boundingSphere === null)
        geometry.computeBoundingSphere();

      sphere.copy(geometry.boundingSphere)
      .applyMatrix4(object.matrixWorld);

      return this.intersectsSphere(sphere);

    };

  }(),

  /**
   * 检查精灵是否与Frustum相交
   */
  intersectsSprite: function() {

    var sphere = new Sphere();

    return function intersectsSprite(sprite) {

      sphere.center.set(0, 0, 0);
      sphere.radius = 0.7071067811865476;
      sphere.applyMatrix4(sprite.matrixWorld);

      return this.intersectsSphere(sphere);

    };

  }(),

  /**
   * 如果球体与此平截头体相交，则返回true。
   * @param sphere
   * @return {boolean}
   */
  intersectsSphere: function(sphere) {

    var planes = this.planes;
    var center = sphere.center;
    var negRadius = -sphere.radius;

    for (var i = 0; i < 6; i++) {

      var distance = planes[i].distanceToPoint(center);

      if (distance < negRadius) {

        return false;

      }

    }

    return true;

  },

  intersectsBox: function() {

    var p = new Vector3();

    return function intersectsBox(box) {

      var planes = this.planes;

      for (var i = 0; i < 6; i++) {

        var plane = planes[i];

        // corner at max distance

        p.x = plane.normal.x > 0 ? box.max.x : box.min.x;
        p.y = plane.normal.y > 0 ? box.max.y : box.min.y;
        p.z = plane.normal.z > 0 ? box.max.z : box.min.z;

        if (plane.distanceToPoint(p) < 0) {

          return false;

        }

      }

      return true;

    };

  }(),

  containsPoint: function(point) {

    var planes = this.planes;

    for (var i = 0; i < 6; i++) {

      if (planes[i].distanceToPoint(point) < 0) {

        return false;

      }

    }

    return true;

  }

});

// 光照
PGL.Light = function(color, intensity) {

  Object3D.call(this);

  this.type = 'Light';

  this.color = new Color(color);
  this.intensity = intensity !== undefined ? intensity : 1;

  this.receiveShadow = undefined;

};
PGL.Light.prototype = Object.assign(Object.create(Object3D.prototype), {

  constructor: PGL.Light,

  isLight: true,

  copy: function(source) {

    Object3D.prototype.copy.call(this, source);

    this.color.copy(source.color);
    this.intensity = source.intensity;

    return this;

  },

  toJSON: function(meta) {

    var data = Object3D.prototype.toJSON.call(this, meta);

    data.object.color = this.color.getHex();
    data.object.intensity = this.intensity;

    if (this.groundColor !== undefined) data.object.groundColor = this.groundColor.getHex();

    if (this.distance !== undefined) data.object.distance = this.distance;
    if (this.angle !== undefined) data.object.angle = this.angle;
    if (this.decay !== undefined) data.object.decay = this.decay;
    if (this.penumbra !== undefined) data.object.penumbra = this.penumbra;

    if (this.shadow !== undefined) data.object.shadow = this.shadow.toJSON();

    return data;

  }

});

PGL.AmbientLight = function(color, intensity) {

  PGL.Light.call(this, color, intensity);

  this.type = 'AmbientLight';

  this.castShadow = undefined;

};
PGL.AmbientLight.prototype = Object.assign(Object.create(PGL.Light.prototype), {

  constructor: PGL.AmbientLight,

  isAmbientLight: true

});

PGL.DirectionalLight = function(color, intensity) {

  PGL.Light.call(this, color, intensity);

  this.type = 'DirectionalLight';

  this.position.copy(Object3D.DefaultUp);
  this.updateMatrix();

  this.target = new Object3D();

  // this.shadow = new PGL.DirectionalLightShadow();

};
PGL.DirectionalLight.prototype = Object.assign(Object.create(PGL.Light.prototype), {

  constructor: PGL.DirectionalLight,

  isDirectionalLight: true,

  copy: function(source) {

    PGL.Light.prototype.copy.call(this, source);

    this.target = source.target.clone();

    this.shadow = source.shadow.clone();

    return this;

  }

});

// 相机
PGL.Camera = function() {

  Object3D.call(this);

  this.type = 'Camera';

  this.matrixWorldInverse = new Matrix4(); // 相机位置矩阵的倒数矩阵
  this.projectionMatrix = new Matrix4(); // 投影矩阵
  this.projectionMatrixInverse = new Matrix4();

};
PGL.Camera.prototype = Object.assign(Object.create(Object3D.prototype), {

  constructor: PGL.Camera,

  isCamera: true,

  copy: function(source, recursive) {

    Object3D.prototype.copy.call(this, source, recursive);

    this.matrixWorldInverse.copy(source.matrixWorldInverse);
    this.projectionMatrix.copy(source.projectionMatrix);
    this.projectionMatrixInverse.copy(source.projectionMatrixInverse);

    return this;

  },

  getWorldDirection: function(target) {

    if (target === undefined) {

      console.warn('THREE.Camera: .getWorldDirection() target is now required');
      target = new Vector3();

    }

    this.updateMatrixWorld(true);

    var e = this.matrixWorld.elements;

    return target.set(-e[8], -e[9], -e[10]).normalize();

  },

  /**
   * 更新相机以及相机子类的本地和世界坐标矩阵
   * 设置matrixWorld的倒数矩阵matrixWorldInverse
   * @param force
   */
  updateMatrixWorld: function(force) {

    Object3D.prototype.updateMatrixWorld.call(this, force);

    this.matrixWorldInverse.getInverse(this.matrixWorld);

  },

  clone: function() {

    return new this.constructor().copy(this);

  }

});

/**
 * 投影相机对象
 * @param fov
 * @param aspect
 * @param near
 * @param far
 * @constructor
 */
PGL.PerspectiveCamera = function(fov, aspect, near, far) {

  PGL.Camera.call(this);

  this.type = 'PerspectiveCamera';

  this.fov = fov !== undefined ? fov : 50;
  this.zoom = 1;

  this.near = near !== undefined ? near : 0.1;
  this.far = far !== undefined ? far : 2000;
  this.focus = 10;

  this.aspect = aspect !== undefined ? aspect : 1;
  this.view = null;

  this.filmGauge = 35;	// width of the film (default in millimeters)
  this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

  // 初始化投影矩阵
  this.updateProjectionMatrix();

};
PGL.PerspectiveCamera.prototype = Object.assign(Object.create(PGL.Camera.prototype), {

  constructor: PGL.PerspectiveCamera,

  isPerspectiveCamera: true,

  copy: function(source, recursive) {

    PGL.Camera.prototype.copy.call(this, source, recursive);

    this.fov = source.fov;
    this.zoom = source.zoom;

    this.near = source.near;
    this.far = source.far;
    this.focus = source.focus;

    this.aspect = source.aspect;
    this.view = source.view === null ? null : Object.assign({}, source.view);

    this.filmGauge = source.filmGauge;
    this.filmOffset = source.filmOffset;

    return this;

  },

  /**
   * Sets the FOV by focal length in respect to the current .filmGauge.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * Values for focal length and film gauge must have the same unit.
   */
  setFocalLength: function(focalLength) {

    // see http://www.bobatkins.com/photography/technical/field_of_view.html
    var vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;

    this.fov = _Math.RAD2DEG * 2 * Math.atan(vExtentSlope);
    this.updateProjectionMatrix();

  },

  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   */
  getFocalLength: function() {

    var vExtentSlope = Math.tan(_Math.DEG2RAD * 0.5 * this.fov);

    return 0.5 * this.getFilmHeight() / vExtentSlope;

  },

  getEffectiveFOV: function() {

    return _Math.RAD2DEG * 2 * Math.atan(
      Math.tan(_Math.DEG2RAD * 0.5 * this.fov) / this.zoom);

  },

  getFilmWidth: function() {

    // film not completely covered in portrait format (aspect < 1)
    return this.filmGauge * Math.min(this.aspect, 1);

  },

  getFilmHeight: function() {

    // film not completely covered in landscape format (aspect > 1)
    return this.filmGauge / Math.max(this.aspect, 1);

  },

  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   var w = 1920;
   *   var h = 1080;
   *   var fullWidth = w * 3;
   *   var fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset: function(fullWidth, fullHeight, x, y, width, height) {

    this.aspect = fullWidth / fullHeight;

    if (this.view === null) {

      this.view = {
        enabled: true,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1
      };

    }

    this.view.enabled = true;
    this.view.fullWidth = fullWidth;
    this.view.fullHeight = fullHeight;
    this.view.offsetX = x;
    this.view.offsetY = y;
    this.view.width = width;
    this.view.height = height;

    this.updateProjectionMatrix();

  },

  clearViewOffset: function() {

    if (this.view !== null) {

      this.view.enabled = false;

    }

    this.updateProjectionMatrix();

  },

  /**
   * 根据给定值计算top，height，width，left等值，并调用方法设置投影矩阵
   */
  updateProjectionMatrix: function() {

    var near = this.near,
      top = near * Math.tan(
        _Math.DEG2RAD * 0.5 * this.fov) / this.zoom,
      height = 2 * top,
      width = this.aspect * height,
      left = -0.5 * width,
      view = this.view;

    if (this.view !== null && this.view.enabled) {

      var fullWidth = view.fullWidth,
        fullHeight = view.fullHeight;

      left += view.offsetX * width / fullWidth;
      top -= view.offsetY * height / fullHeight;
      width *= view.width / fullWidth;
      height *= view.height / fullHeight;

    }

    var skew = this.filmOffset;
    if (skew !== 0) left += near * skew / this.getFilmWidth();

    this.projectionMatrix.makePerspective(left, left + width, top, top - height, near, this.far);

    this.projectionMatrixInverse.getInverse(this.projectionMatrix);

  },

  toJSON: function(meta) {

    var data = Object3D.prototype.toJSON.call(this, meta);

    data.object.fov = this.fov;
    data.object.zoom = this.zoom;

    data.object.near = this.near;
    data.object.far = this.far;
    data.object.focus = this.focus;

    data.object.aspect = this.aspect;

    if (this.view !== null) data.object.view = Object.assign({}, this.view);

    data.object.filmGauge = this.filmGauge;
    data.object.filmOffset = this.filmOffset;

    return data;

  }

});

// 场景
PGL.Scene = function() {
  Object3D.call(this);

  this.type = 'Scene';

  this.background = null;

  this.autoUpdate = true; // checked by the renderer
};
PGL.Scene.prototype = Object.assign(Object.create(Object3D.prototype), {

  constructor: PGL.Scene,

  isScene: true
});

PGL.Points = function(geometry, material) {

  Object3D.call(this);

  this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
  this.material = material !== undefined ? material : new PGL.PointsMaterial({color: Math.random() * 0xffffff});
};
PGL.Points.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: PGL.Points,

  isPoints: true
});

var geometryId = 0; // Geometry uses even numbers as Id
PGL.Geometry = function() {
  Object.defineProperty(this, 'id', {value: geometryId += 2});
};

PGL.WebGLInfo = function(gl) {

  var memory = {
    geometries: 0,
    textures: 0
  };

  var render = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };

  function update(count, mode, instanceCount) {

    instanceCount = instanceCount || 1;

    render.calls++;

    switch(mode){

      case gl.TRIANGLES:
        render.triangles += instanceCount * (count / 3);
        break;

      case gl.TRIANGLE_STRIP:
      case gl.TRIANGLE_FAN:
        render.triangles += instanceCount * (count - 2);
        break;

      case gl.LINES:
        render.lines += instanceCount * (count / 2);
        break;

      case gl.LINE_STRIP:
        render.lines += instanceCount * (count - 1);
        break;

      case gl.LINE_LOOP:
        render.lines += instanceCount * count;
        break;

      case gl.POINTS:
        render.points += instanceCount * count;
        break;

      default:
        console.error('THREE.WebGLInfo: Unknown draw mode:', mode);
        break;

    }

  }

  function reset() {

    render.frame++;
    render.calls = 0;
    render.triangles = 0;
    render.points = 0;
    render.lines = 0;

  }

  return {
    memory: memory,
    render: render,
    programs: null,
    autoReset: true,
    reset: reset,
    update: update
  };

};

/**
 * 工具类
 * @param gl 上下文
 * @param extensions 获取扩展方法的对象
 * @param capabilities
 * @return {{convert: convert}}
 * @constructor
 */
PGL.WebGLUtils = function(gl, extensions, capabilities) {

  /**
   * 根据three中的常量，返回webgl中对应的常量
   * @param p
   * @returns {GLenum|number|*|GLenum|number|*|number|GLenum}
   */
  function convert(p) {

    var extension;

    if (p === PGL.RepeatWrapping) return gl.REPEAT;
    if (p === PGL.ClampToEdgeWrapping) return gl.CLAMP_TO_EDGE;
    if (p === PGL.MirroredRepeatWrapping) return gl.MIRRORED_REPEAT;

    if (p === PGL.NearestFilter) return gl.NEAREST;
    if (p === PGL.NearestMipMapNearestFilter) return gl.NEAREST_MIPMAP_NEAREST;
    if (p === PGL.NearestMipMapLinearFilter) return gl.NEAREST_MIPMAP_LINEAR;

    if (p === PGL.LinearFilter) return gl.LINEAR;
    if (p === PGL.LinearMipMapNearestFilter) return gl.LINEAR_MIPMAP_NEAREST;
    if (p === PGL.LinearMipMapLinearFilter) return gl.LINEAR_MIPMAP_LINEAR;

    if (p === PGL.UnsignedByteType) return gl.UNSIGNED_BYTE;
    if (p === PGL.UnsignedShort4444Type) return gl.UNSIGNED_SHORT_4_4_4_4;
    if (p === PGL.UnsignedShort5551Type) return gl.UNSIGNED_SHORT_5_5_5_1;
    if (p === PGL.UnsignedShort565Type) return gl.UNSIGNED_SHORT_5_6_5;

    if (p === PGL.ByteType) return gl.BYTE;
    if (p === PGL.ShortType) return gl.SHORT;
    if (p === PGL.UnsignedShortType) return gl.UNSIGNED_SHORT;
    if (p === PGL.IntType) return gl.INT;
    if (p === PGL.UnsignedIntType) return gl.UNSIGNED_INT;
    if (p === PGL.FloatType) return gl.FLOAT;

    if (p === PGL.HalfFloatType) {

      if (capabilities.isWebGL2) return gl.HALF_FLOAT;

      extension = extensions.get('OES_texture_half_float');

      if (extension !== null) return extension.HALF_FLOAT_OES;

    }

    if (p === PGL.AlphaFormat) return gl.ALPHA;
    if (p === PGL.RGBFormat) return gl.RGB;
    if (p === PGL.RGBAFormat) return gl.RGBA;
    if (p === PGL.LuminanceFormat) return gl.LUMINANCE;
    if (p === PGL.LuminanceAlphaFormat) return gl.LUMINANCE_ALPHA;
    if (p === PGL.DepthFormat) return gl.DEPTH_COMPONENT;
    if (p === PGL.DepthStencilFormat) return gl.DEPTH_STENCIL;
    if (p === PGL.RedFormat) return gl.RED;

    if (p === PGL.AddEquation) return gl.FUNC_ADD;
    if (p === PGL.SubtractEquation) return gl.FUNC_SUBTRACT;
    if (p === PGL.ReverseSubtractEquation) return gl.FUNC_REVERSE_SUBTRACT;

    if (p === PGL.ZeroFactor) return gl.ZERO;
    if (p === PGL.OneFactor) return gl.ONE;
    if (p === PGL.SrcColorFactor) return gl.SRC_COLOR;
    if (p === PGL.OneMinusSrcColorFactor) return gl.ONE_MINUS_SRC_COLOR;
    if (p === PGL.SrcAlphaFactor) return gl.SRC_ALPHA;
    if (p === PGL.OneMinusSrcAlphaFactor) return gl.ONE_MINUS_SRC_ALPHA;
    if (p === PGL.DstAlphaFactor) return gl.DST_ALPHA;
    if (p === PGL.OneMinusDstAlphaFactor) return gl.ONE_MINUS_DST_ALPHA;

    if (p === PGL.DstColorFactor) return gl.DST_COLOR;
    if (p === PGL.OneMinusDstColorFactor) return gl.ONE_MINUS_DST_COLOR;
    if (p === PGL.SrcAlphaSaturateFactor) return gl.SRC_ALPHA_SATURATE;

    if (p === PGL.RGB_S3TC_DXT1_Format || p === PGL.RGBA_S3TC_DXT1_Format ||
      p === PGL.RGBA_S3TC_DXT3_Format || p === PGL.RGBA_S3TC_DXT5_Format) {

      extension = extensions.get('WEBGL_compressed_texture_s3tc');

      if (extension !== null) {

        if (p === PGL.RGB_S3TC_DXT1_Format) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (p === PGL.RGBA_S3TC_DXT1_Format) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (p === PGL.RGBA_S3TC_DXT3_Format) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (p === PGL.RGBA_S3TC_DXT5_Format) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;

      }

    }

    if (p === PGL.RGB_PVRTC_4BPPV1_Format || p === PGL.RGB_PVRTC_2BPPV1_Format ||
      p === PGL.RGBA_PVRTC_4BPPV1_Format || p === PGL.RGBA_PVRTC_2BPPV1_Format) {

      extension = extensions.get('WEBGL_compressed_texture_pvrtc');

      if (extension !== null) {

        if (p === PGL.RGB_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (p === PGL.RGB_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (p === PGL.RGBA_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (p === PGL.RGBA_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

      }

    }

    if (p === PGL.RGB_ETC1_Format) {

      extension = extensions.get('WEBGL_compressed_texture_etc1');

      if (extension !== null) return extension.COMPRESSED_RGB_ETC1_WEBGL;

    }

    if (p === PGL.RGBA_ASTC_4x4_Format || p === PGL.RGBA_ASTC_5x4_Format || p === PGL.RGBA_ASTC_5x5_Format ||
      p === PGL.RGBA_ASTC_6x5_Format || p === PGL.RGBA_ASTC_6x6_Format || p === PGL.RGBA_ASTC_8x5_Format ||
      p === PGL.RGBA_ASTC_8x6_Format || p === PGL.RGBA_ASTC_8x8_Format || p === PGL.RGBA_ASTC_10x5_Format ||
      p === PGL.RGBA_ASTC_10x6_Format || p === PGL.RGBA_ASTC_10x8_Format || p === PGL.RGBA_ASTC_10x10_Format ||
      p === PGL.RGBA_ASTC_12x10_Format || p === PGL.RGBA_ASTC_12x12_Format) {

      extension = extensions.get('WEBGL_compressed_texture_astc');

      if (extension !== null) {

        return p;

      }

    }

    if (p === PGL.MinEquation || p === PGL.MaxEquation) {

      if (capabilities.isWebGL2) {

        if (p === PGL.MinEquation) return gl.MIN;
        if (p === PGL.MaxEquation) return gl.MAX;

      }

      extension = extensions.get('EXT_blend_minmax');

      if (extension !== null) {

        if (p === PGL.MinEquation) return extension.MIN_EXT;
        if (p === PGL.MaxEquation) return extension.MAX_EXT;

      }

    }

    if (p === PGL.UnsignedInt248Type) {

      if (capabilities.isWebGL2) return gl.UNSIGNED_INT_24_8;

      extension = extensions.get('WEBGL_depth_texture');

      if (extension !== null) return extension.UNSIGNED_INT_24_8_WEBGL;

    }

    return 0;

  }

  return {convert: convert};

};

/**
 * 和贴图相关的方法属性
 * @param _gl
 * @param extensions
 * @param state
 * @param properties
 * @param capabilities
 * @param utils 辅助类
 * @param info
 * @constructor
 */
PGL.WebGLTextures = function(_gl, extensions, state, properties, capabilities, utils, info) {

  var _canvas;

  /**
   * 限制图片的大小
   * @param image
   * @param maxSize
   * @returns {HTMLElement|*}
   */
  function clampToMaxSize(image, maxSize) {

    if (image.width > maxSize || image.height > maxSize) {

      if ('data' in image) {

        console.warn('THREE.WebGLRenderer: image in DataTexture is too big (' + image.width + 'x' + image.height + ').');
        return;

      }

      // Warning: Scaling through the canvas will only work with images that use
      // premultiplied alpha.

      var scale = maxSize / Math.max(image.width, image.height);

      var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
      canvas.width = Math.floor(image.width * scale);
      canvas.height = Math.floor(image.height * scale);

      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

      console.warn('THREE.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height);

      return canvas;

    }

    return image;

  }

  function isPowerOfTwo(image) {

    return PGL._Math.isPowerOfTwo(image.width) && PGL._Math.isPowerOfTwo(image.height);

  }

  function setTexture2D(texture, slot) {

    var textureProperties = properties.get(texture);

    if (texture.version > 0 && textureProperties.__version !== texture.version) {

      var image = texture.image;

      if (image === undefined) {
        console.warn('THREE.WebGLRenderer: Texture marked for update but image is undefined');
      } else if (image.complete === false) {
        console.warn('THREE.WebGLRenderer: Texture marked for update but image is incomplete');
      } else {
        uploadTexture(textureProperties, texture, slot);
        return;
      }
    }

    state.activeTexture(_gl.TEXTURE0 + slot);
    state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);
  }

  function textureNeedsPowerOfTwo(texture) {

    if (capabilities.isWebGL2) return false;

    return (texture.wrapS !== PGL.ClampToEdgeWrapping || texture.wrapT !== PGL.ClampToEdgeWrapping) ||
      (texture.minFilter !== PGL.NearestFilter && texture.minFilter !== PGL.LinearFilter);

  }

  function makePowerOfTwo(image) {

    if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof ImageBitmap) {

      if (_canvas === undefined) _canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');

      _canvas.width = PGL._Math.floorPowerOfTwo(image.width);
      _canvas.height = PGL._Math.floorPowerOfTwo(image.height);

      var context = _canvas.getContext('2d');
      context.drawImage(image, 0, 0, _canvas.width, _canvas.height);

      console.warn('THREE.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + _canvas.width + 'x' + _canvas.height);

      return _canvas;

    }

    return image;

  }

  function getInternalFormat(glFormat, glType) {

    if (!capabilities.isWebGL2) return glFormat;

    if (glFormat === 6403) {

      if (glType === 5126) return 33326;
      if (glType === 5131) return 33325;
      if (glType === 5121) return 33321;

    }

    if (glFormat === 6407) {

      if (glType === 5126) return 34837;
      if (glType === 5131) return 34843;
      if (glType === 5121) return 32849;

    }

    if (glFormat === 6408) {

      if (glType === 5126) return 34836;
      if (glType === 5131) return 34842;
      if (glType === 5121) return 32856;

    }

    return glFormat;

  }

  // Fallback filters for non-power-of-2 textures
  function filterFallback(f) {

    if (f === PGL.NearestFilter || f === PGL.NearestMipMapNearestFilter || f === PGL.NearestMipMapLinearFilter) {
      return 9728;
    }
    return 9729;
  }

  /**
   * 设置纹理参数
   * @param textureType
   * @param texture
   * @param isPowerOfTwoImage
   */
  function setTextureParameters(textureType, texture, isPowerOfTwoImage) {

    var extension;

    if (isPowerOfTwoImage) {

      _gl.texParameteri(textureType, 10242, utils.convert(texture.wrapS));
      _gl.texParameteri(textureType, 10243, utils.convert(texture.wrapT));

      _gl.texParameteri(textureType, 10240, utils.convert(texture.magFilter));
      _gl.texParameteri(textureType, 10241, utils.convert(texture.minFilter));

    } else {

      _gl.texParameteri(textureType, 10242, 33071);
      _gl.texParameteri(textureType, 10243, 33071);

      if (texture.wrapS !== PGL.ClampToEdgeWrapping || texture.wrapT !== PGL.ClampToEdgeWrapping) {

        console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.');

      }

      _gl.texParameteri(textureType, 10240, filterFallback(texture.magFilter));
      _gl.texParameteri(textureType, 10241, filterFallback(texture.minFilter));

      if (texture.minFilter !== PGL.NearestFilter && texture.minFilter !== PGL.LinearFilter) {

        console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.');

      }

    }

    extension = extensions.get('EXT_texture_filter_anisotropic');

    if (extension) {

      if (texture.type === PGL.FloatType && extensions.get('OES_texture_float_linear') === null) return;
      if (texture.type === PGL.HalfFloatType && (capabilities.isWebGL2 || extensions.get('OES_texture_half_float_linear')) === null) return;

      if (texture.anisotropy > 1 || properties.get(texture).__currentAnisotropy) {

        _gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, capabilities.getMaxAnisotropy()));
        properties.get(texture).__currentAnisotropy = texture.anisotropy;

      }

    }

  }

  /**
   *
   * @param textureProperties
   * @param texture
   * @param slot：纹理单元
   */
  function uploadTexture(textureProperties, texture, slot) {

    var textureType; // 纹理类型

    if (texture.isDataTexture3D) {
      textureType = 32879;
    } else {
      textureType = 3553;// _gl.TEXTURE_2D
    }

    if (textureProperties.__webglInit === undefined) {
      textureProperties.__webglInit = true;
      // texture.addEventListener( 'dispose', onTextureDispose );
      textureProperties.__webglTexture = _gl.createTexture();
      // info.memory.textures ++;
    }

    state.activeTexture(33984 + slot);
    // 向target绑定纹理对象
    state.bindTexture(textureType, textureProperties.__webglTexture);

    _gl.pixelStorei(37440, texture.flipY); //对纹理图像进行y轴反转
    _gl.pixelStorei(37441, texture.premultiplyAlpha); // 将Alpha通道与其他颜色通道相乘
    _gl.pixelStorei(3317, texture.unpackAlignment); // 从内存中解包像素数据。

    var image = clampToMaxSize(texture.image, capabilities.maxTextureSize);

    if (textureNeedsPowerOfTwo(texture) && isPowerOfTwo(image) === false) {
      image = makePowerOfTwo(image);
    }

    var isPowerOfTwoImage = isPowerOfTwo(image),
      glFormat = utils.convert(texture.format),
      glType = utils.convert(texture.type),
      glInternalFormat = getInternalFormat(glFormat, glType);

    setTextureParameters(textureType, texture, isPowerOfTwoImage);

    var mipmap, mipmaps = texture.mipmaps;

    if (texture.isDepthTexture) {
    } else if (texture.isDataTexture) {
    } else if (texture.isCompressedTexture) {
    } else if (texture.isDataTexture3D) {
    } else {

      // regular Texture (image, video, canvas)

      // use manually created mipmaps if available
      // if there are no manual mipmaps
      // set 0 level mipmap and then use GL to generate other mipmap levels

      if (mipmaps.length > 0 && isPowerOfTwoImage) {

        for (var i = 0, il = mipmaps.length; i < il; i++) {

          mipmap = mipmaps[i];
          state.texImage2D(3553, i, glInternalFormat, glFormat, glType, mipmap);

        }

        texture.generateMipmaps = false;
        textureProperties.__maxMipLevel = mipmaps.length - 1;

      } else {
        // 配置纹理图像
        state.texImage2D(3553, 0, glInternalFormat, glFormat, glType, image);
        textureProperties.__maxMipLevel = 0;
      }
    }

    // if ( textureNeedsGenerateMipmaps( texture, isPowerOfTwoImage ) ) {
    //
    //     generateMipmap( 3553, texture, image.width, image.height );
    //
    // }

    textureProperties.__version = texture.version;

    // if ( texture.onUpdate ) texture.onUpdate( texture );
  }

  this.setTexture2D = setTexture2D;
};

/**
 * WebGL的相关状态
 * @param gl
 * @constructor
 */
PGL.WebGLState = function(gl) {

  function ColorBuffer() {

    var color = new Vector4();
    var currentColorClear = new Vector4(0, 0, 0, 0);

    return {
      setClear: function(r, g, b, a) {
        color.set(r, g, b, a);

        if (currentColorClear.equals(color) === false) {
          gl.clearColor(r, g, b, a);
          currentColorClear.copy(color);
        }
      }
    }
  }

  function DepthBuffer() {

    var locked = false; // 锁定或释放深度缓存区的写入操作

    var currentDepthMask = null; // 锁定或释放深度缓存区的写入操作
    var currentDepthFunc = null; // 比较函数值
    var currentDepthClear = null;

    return {

      /**
       * 隐藏面消除 true 启动 false 关闭
       * @param depthTest
       */
      setTest: function(depthTest) {
        if (depthTest) {
          enable(gl.DEPTH_TEST);
        } else {
          disable(gl.DEPTH_TEST);
        }
      },

      /**
       * @param depthMask 指定是锁定深度缓存区的写入操作（false），还是释放（true）
       */
      setMask: function(depthMask) {

        if (currentDepthMask !== depthMask && !locked) {

          gl.depthMask(depthMask);
          currentDepthMask = depthMask;

        }

      },

      /**
       * 将传入像素深度与当前深度缓冲区值进行比较的函数
       * @param depthFunc
       */
      setFunc: function(depthFunc) {

        if (currentDepthFunc !== depthFunc) {

          if (depthFunc) {

            switch(depthFunc){

              case NeverDepth:

                gl.depthFunc(gl.NEVER);
                break;

              case AlwaysDepth:

                gl.depthFunc(gl.ALWAYS);
                break;

              case LessDepth:

                gl.depthFunc(gl.LESS);
                break;

              case LessEqualDepth:

                gl.depthFunc(gl.LEQUAL);
                break;

              case EqualDepth:

                gl.depthFunc(gl.EQUAL);
                break;

              case GreaterEqualDepth:

                gl.depthFunc(gl.GEQUAL);
                break;

              case GreaterDepth:

                gl.depthFunc(gl.GREATER);
                break;

              case NotEqualDepth:

                gl.depthFunc(gl.NOTEQUAL);
                break;

              default:

                gl.depthFunc(gl.LEQUAL);

            }

          } else {

            gl.depthFunc(gl.LEQUAL);

          }

          currentDepthFunc = depthFunc;

        }

      },

      setLocked: function(lock) {

        locked = lock;

      },

      setClear: function(depth) {

        if (currentDepthClear !== depth) {

          gl.clearDepth(depth);
          currentDepthClear = depth;

        }

      },

      reset: function() {

        locked = false;

        currentDepthMask = null;
        currentDepthFunc = null;
        currentDepthClear = null;

      }

    };

  }

  var colorBuffer = new ColorBuffer();
  var depthBuffer = new DepthBuffer();

  var maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
  var newAttributes = new Uint8Array(maxVertexAttributes);
  var enabledAttributes = new Uint8Array(maxVertexAttributes);
  var attributeDivisors = new Uint8Array(maxVertexAttributes);

  var enabledCapabilities = {}; // 保存功能开启状态

  var currentProgram = null; // 当前使用的着色器程序

  // 多边形偏移参数
  var currentPolygonOffsetFactor = null;
  var currentPolygonOffsetUnits = null;

  var maxTextures = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS); // 获取最大的纹理单元

  var currentTextureSlot = null;// 当前激活的纹理单元
  var currentBoundTextures = {}; // 当前绑定的纹理对象

  /**
   * 创建纹理贴图
   * @param type
   * @param target
   * @param count
   * @returns {WebGLTexture}
   */
  function createTexture(type, target, count) {

    var data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.
    var texture = gl.createTexture();

    gl.bindTexture(type, texture);
    gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    for (var i = 0; i < count; i++) {
      gl.texImage2D(target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    }
    return texture;
  }

  var emptyTextures = {};
  emptyTextures[gl.TEXTURE_2D] = createTexture(gl.TEXTURE_2D, gl.TEXTURE_2D, 1);

  // 指定绘图区域的颜色
  colorBuffer.setClear(0, 0, 0, 1);
  // 指定绘图区域的深度
  depthBuffer.setClear(1);

  enable(gl.DEPTH_TEST); // 开启隐藏面消除

  // 初始化newAttributes为0
  function initAttributes() {
    for (var i = 0, l = newAttributes.length; i < l; i++) {
      newAttributes[i] = 0;
    }
  }

  function texImage2D() {

    try{

      gl.texImage2D.apply(gl, arguments);

    }catch(error){

      console.error('THREE.WebGLState:', error);

    }

  }

  /**
   * 开启功能
   * @param attribute
   */
  function enableAttribute(attribute) {
    enableAttributeAndDivisor(attribute, 0);
  }

  /**
   * 开启buffer地址
   * @param attribute
   * @param meshPerAttribute
   */
  function enableAttributeAndDivisor(attribute, meshPerAttribute) {

    newAttributes[attribute] = 1;

    if (enabledAttributes[attribute] === 0) {
      gl.enableVertexAttribArray(attribute);
      enabledAttributes[attribute] = 1;
    }
  }

  /**
   * 开启功能
   * @param id
   */
  function enable(id) {
    if (enabledCapabilities[id] !== true) {
      gl.enable(id);
      enabledCapabilities[id] = true;
    }
  }

  /**
   * 关闭功能
   * @param id
   */
  function disable(id) {
    if (enabledCapabilities[id] !== false) {
      gl.disable(id);
      enabledCapabilities[id] = false;
    }
  }

  function useProgram(program) {
    if (currentProgram !== program) {
      gl.useProgram(program);

      currentProgram = program;

      return true;

    }

    return false;
  }

  /**
   * 根据材质设置绘制图形的方式（剔除、缠绕方向、混合、偏移）
   * @param material 材质
   * @param frontFaceCW 控制缠绕方向 true 反转缠绕方向
   */
  function setMaterial(material, frontFaceCW) {

    depthBuffer.setTest(material.depthTest);

    setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
  }

  /**
   * 设置多边形偏移
   * @param polygonOffset true 启动 false 关闭
   * @param factor
   * @param units
   */
  function setPolygonOffset(polygonOffset, factor, units) {

    if (polygonOffset) {
      enable(gl.POLYGON_OFFSET_FILL);

      if (currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units) {

        gl.polygonOffset(factor, units);

        currentPolygonOffsetFactor = factor;
        currentPolygonOffsetUnits = units;
      }
    } else {
      disable(gl.POLYGON_OFFSET_FILL);
    }
  }

  // texture

  // 开启对应的纹理单元
  function activeTexture(webglSlot) {

    if (webglSlot === undefined) webglSlot = gl.TEXTURE0 + maxTextures - 1;

    if (currentTextureSlot !== webglSlot) {
      gl.activeTexture(webglSlot);
      currentTextureSlot = webglSlot;
    }
  }

  /**
   * 向target绑定纹理对象
   * @param webglType 绑定的纹理目标
   * @param webglTexture 纹理贴图
   */
  function bindTexture(webglType, webglTexture) {

    if (currentTextureSlot === null) {
      activeTexture();
    }

    var boundTexture = currentBoundTextures[currentTextureSlot];

    if (boundTexture === undefined) {
      boundTexture = {type: undefined, texture: undefined};
      currentBoundTextures[currentTextureSlot] = boundTexture;
    }

    if (boundTexture.type !== webglType || boundTexture.texture !== webglTexture) {

      gl.bindTexture(webglType, webglTexture || emptyTextures[webglType]);

      boundTexture.type = webglType;
      boundTexture.texture = webglTexture;
    }
  }

  return {
    buffers: {
      color: colorBuffer,
      depth: depthBuffer
    },

    initAttributes: initAttributes,
    enableAttribute: enableAttribute,
    enableAttributeAndDivisor: enableAttributeAndDivisor,
    enable: enable,

    useProgram: useProgram,

    setMaterial: setMaterial,

    setPolygonOffset: setPolygonOffset,

    activeTexture: activeTexture,
    bindTexture: bindTexture,
    texImage2D: texImage2D
  }
};

/**
 * 渲染列表
 * @returns {{init: init, opaque: Array, unshift: unshift, sort: sort, transparent: Array, push: push}}
 * @constructor
 */
PGL.WebGLRenderList = function() {

  var renderItems = [];
  var renderItemsIndex = 0;

  var opaque = [];
  var transparent = [];

  var defaultProgram = {id: -1};

  function init() {

    renderItemsIndex = 0;

    opaque.length = 0;
    transparent.length = 0;

  }

  function getNextRenderItem(object, geometry, material, groupOrder, z, group) {

    var renderItem = renderItems[renderItemsIndex];

    if (renderItem === undefined) {

      renderItem = {
        id: object.id,
        object: object,
        geometry: geometry,
        material: material,
        program: material.program || defaultProgram,
        groupOrder: groupOrder,
        renderOrder: object.renderOrder,
        z: z,
        group: group
      };

      renderItems[renderItemsIndex] = renderItem;

    } else {

      renderItem.id = object.id;
      renderItem.object = object;
      renderItem.geometry = geometry;
      renderItem.material = material;
      renderItem.program = material.program || defaultProgram;
      renderItem.groupOrder = groupOrder;
      renderItem.renderOrder = object.renderOrder;
      renderItem.z = z;
      renderItem.group = group;

    }

    renderItemsIndex++;

    return renderItem;

  }

  function push(object, geometry, material, groupOrder, z, group) {

    var renderItem = getNextRenderItem(object, geometry, material, groupOrder, z, group);

    (material.transparent === true ? transparent : opaque).push(renderItem);

  }

  function unshift(object, geometry, material, groupOrder, z, group) {

    var renderItem = getNextRenderItem(object, geometry, material, groupOrder, z, group);

    (material.transparent === true ? transparent : opaque).unshift(renderItem);

  }

  function sort() {

    if (opaque.length > 1) opaque.sort(painterSortStable);
    if (transparent.length > 1) transparent.sort(reversePainterSortStable);

  }

  return {
    opaque: opaque,
    transparent: transparent,

    init: init,
    push: push,
    unshift: unshift,

    sort: sort
  };

};

/**
 * 渲染列表管理
 * @returns {{get: (function(*, *): {init: init, opaque: Array, unshift: unshift, sort: sort, transparent: Array, push: push}), dispose: dispose}}
 * @constructor
 */
PGL.WebGLRenderLists = function() {

  var lists = {};

  function onSceneDispose(event) {

    var scene = event.target;

    scene.removeEventListener('dispose', onSceneDispose);

    delete lists[scene.id];

  }

  function get(scene, camera) {

    var cameras = lists[scene.id];
    var list;
    if (cameras === undefined) {

      list = new PGL.WebGLRenderList();
      lists[scene.id] = {};
      lists[scene.id][camera.id] = list;

      // scene.addEventListener( 'dispose', onSceneDispose );

    } else {

      list = cameras[camera.id];
      if (list === undefined) {

        list = new PGL.WebGLRenderList();
        cameras[camera.id] = list;

      }

    }

    return list;

  }

  function dispose() {

    lists = {};

  }

  return {
    get: get,
    dispose: dispose
  };

};

/**
 * 着色器程序管理
 * @constructor
 */
PGL.WebGLPrograms = function(renderer, extensions, capabilities, textures) {

  var programs = []; // 保存所有的着色器程序

  var precision = capabilities.precision; // 获取精度

  var shaderIDs = {
    MeshDepthMaterial: 'depth',
    MeshDistanceMaterial: 'distanceRGBA',
    MeshNormalMaterial: 'normal',
    MeshBasicMaterial: 'basic',
    MeshLambertMaterial: 'lambert',
    MeshPhongMaterial: 'phong',
    MeshToonMaterial: 'toon',
    MeshStandardMaterial: 'physical',
    MeshPhysicalMaterial: 'physical',
    MeshMatcapMaterial: 'matcap',
    LineBasicMaterial: 'basic',
    LineDashedMaterial: 'dashed',
    PointsMaterial: 'points',
    ShadowMaterial: 'shadow',
    SpriteMaterial: 'sprite'
  };

  function getShaderObject(material, shaderID) {

    var shaderobject;

    if (shaderID) {

      var shader = ShaderLib[shaderID];

      shaderobject = {
        name: material.type,
        uniforms: UniformsUtils.clone(shader.uniforms),
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
      };

    } else {

      shaderobject = {
        name: material.type,
        uniforms: material.uniforms,
        vertexShader: material.vertexShader,
        fragmentShader: material.fragmentShader
      };

    }

    return shaderobject;

  }

  /**
   * 获取参数标记
   * @param material 材质对象
   * @param lights 光照的状态
   * @param shadows
   * @param fog
   * @param nClipPlanes
   * @param nClipIntersection
   * @param object 对象
   * @return {{numDirLights: number, shaderID: *, precision: (number|string|null|GLint), map: boolean, vertexColors: (*|boolean|number)}}
   */
  this.getParameters = function(material, lights, shadows, fog, nClipPlanes, nClipIntersection, object) {

    var shaderID = shaderIDs[material.type];

    if (material.precision !== null) {
      precision = capabilities.getMaxPrecision(material.precision);
      if (precision !== material.precision) {
        console.warn('THREE.WebGLProgram.getParameters:', material.precision, 'not supported, using', precision, 'instead.');
      }
    }

    var shaderobject = getShaderObject(material, shaderID);

    var parameters = {
      shaderID: shaderID,

      shaderName: shaderobject.name, // 着色器名称
      uniforms: shaderobject.uniforms, //
      vertexShader: shaderobject.vertexShader,
      fragmentShader: shaderobject.fragmentShader,

      isRawShaderMaterial: material.isRawShaderMaterial,
      isShaderMaterial: material.isShaderMaterial,

      precision: precision,

      map: !!material.map,

      vertexColors: material.vertexColors, // 顶点颜色

      numDirLights: lights.directional.length // 光照的数量
    };

    return parameters;
  };

  /**
   * 获得着色器程序
   * @param parameters 参数
   * @param cacheKey
   * @return {*}
   */
  this.acquireProgram = function(parameters, cacheKey) {

    var program;

    if (program === undefined) {
      program = new WebGLProgram(renderer, cacheKey, parameters);
      programs.push(program);
    }

    return program;
  };

  this.programs = programs;
};

function addLineNumbers(string) {

  var lines = string.split('\n');

  for (var i = 0; i < lines.length; i++) {

    lines[i] = (i + 1) + ': ' + lines[i];

  }

  return lines.join('\n');

}

/**
 * 实例化一个着色器
 * @param gl 上下文
 * @param type 类型
 * @param string 字符串
 * @param debug 标记是否打印调试信息
 * @return {*|WebGLShader}
 * @constructor
 */
PGL.WebGLShader = function(gl, type, string, debug) {

  var shader = gl.createShader(type);

  gl.shaderSource(shader, string);
  gl.compileShader(shader);

  if (debug === true) {

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
      console.error('THREE.WebGLShader: Shader couldn\'t compile.');
    }

    if (gl.getShaderInfoLog(shader) !== '') {
      console.warn('THREE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog(shader), addLineNumbers(string));
    }
  }

  // --enable-privileged-webgl-extension
  // console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

  return shader;
};

/**
 * 绘制图形gl.drawArrays
 * @param gl
 * @constructor
 */
PGL.WebGLBufferRenderer = function(gl) {
  var mode;

  function setMode(value) {
    mode = value;
  }

  function render(start, count) {
    gl.drawArrays(mode, start, count);
  }

  this.setMode = setMode;
  this.render = render;
};

/**
 * 绘制图形gl.drawElements
 * @param gl
 * @param extensions
 * @param info
 * @param capabilities
 * @constructor
 */
PGL.WebGLIndexedBufferRenderer = function(gl, extensions, info, capabilities) {

  var mode; // 绘制图形的方式

  /**
   * 设置绘制图形的方式
   * @param value
   */
  function setMode(value) {

    mode = value;

  }

  var type, bytesPerElement;

  function setIndex(value) {
    type = value.type;
    bytesPerElement = value.bytesPerElement;
  }

  /**
   * 绘制图形，更新info信息
   * @param start 从哪个顶点开始绘制
   * @param count 指定绘制需要用到多少顶点
   */
  function render(start, count) {

    gl.drawElements(mode, count, type, start * bytesPerElement);

    info.update(count, mode);

  }

  function renderInstances(geometry, start, count) {

    var extension;

    if (capabilities.isWebGL2) {

      extension = gl;

    } else {

      var extension = extensions.get('ANGLE_instanced_arrays');

      if (extension === null) {

        console.error('THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
        return;

      }

    }

    extension[capabilities.isWebGL2 ? 'drawElementsInstanced' : 'drawElementsInstancedANGLE'](mode, count, type, start * bytesPerElement, geometry.maxInstancedCount);

    info.update(count, mode, geometry.maxInstancedCount);

  }

  //

  this.setMode = setMode;
  this.setIndex = setIndex;
  this.render = render;
  this.renderInstances = renderInstances;

};

/**
 * 材质属性管理器
 * @constructor
 */
PGL.WebGLProperties = function() {
  var properties = new WeakMap();

  /**
   * 获取map，如果未定义，设置为{}
   * @param object
   */
  function get(object) {

    var map = properties.get(object);

    if (map === undefined) {
      map = {};
      properties.set(object, map);
    }

    return map;
  }

  return {
    get: get
  }
};

/**
 * 背景管理
 * @param renderer
 * @param state
 * @param objects
 * @constructor
 */
PGL.WebGLBackground = function(renderer, state) {

  var clearColor = new Color(0x000000);
  var clearAlpha = 0;

  /**
   * 设置清空背景颜色值，
   * @param scene
   * @param forceClear 强制清空缓存区
   */
  function render(scene, forceClear) {
    var background = scene.background;
    if (background === null) {
      setClear(clearColor, clearAlpha);
    }

    if (renderer.autoClear || forceClear) {
      renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
    }
  }

  /**
   * 设置背景颜色
   * @param color
   * @param alpha
   */
  function setClear(color, alpha) {
    state.buffers.color.setClear(color.r, color.g, color.b, alpha);
  }

  return {
    getClearColor: function() {

      return clearColor;

    },
    setClearColor: function(color, alpha) {
      clearColor.set(color);
      clearAlpha = alpha !== undefined ? alpha : 1;
      setClear(clearColor, clearAlpha);
    },
    getClearAlpha: function() {
      return clearAlpha;
    },
    setClearAlpha: function(alpha) {
      clearAlpha = alpha;
      setClear(clearColor, clearAlpha);
    },
    render: render
  }
};

/**
 * 管理attribute变量（创建buffer）
 * @param gl
 * @constructor
 */
PGL.WebGLAttributes = function(gl) {

  var buffers = new WeakMap();

  /**
   * 创建缓存区
   * @param attribute
   * @param bufferType
   * @return {{buffer: AudioBuffer | WebGLBuffer, type: number, bytesPerElement: number, version}}
   */
  function createBuffer(attribute, bufferType) {
    var array = attribute.array;
    var usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    var buffer = gl.createBuffer();

    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, array, usage);

    var type = gl.FLOAT;

    if (array instanceof Float32Array) {

      type = gl.FLOAT;

    } else if (array instanceof Float64Array) {
      console.warn('THREE.WebGLAttributes: Unsupported data buffer format: Float64Array.');
    } else if (array instanceof Uint16Array) {
      type = gl.UNSIGNED_SHORT;
    } else if (array instanceof Int16Array) {
      type = gl.SHORT;
    } else if (array instanceof Uint32Array) {
      type = gl.UNSIGNED_INT;
    } else if (array instanceof Int32Array) {
      type = gl.INT;
    } else if (array instanceof Int8Array) {
      type = gl.BYTE;
    } else if (array instanceof Uint8Array) {
      type = gl.UNSIGNED_BYTE;
    }

    return {
      buffer: buffer,
      type: type,
      bytesPerElement: array.BYTES_PER_ELEMENT,
      version: attribute.version
    };
  }

  function get(attribute) {
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;
    return buffers.get(attribute);
  }

  /**
   * 创建或则更新buffer
   * @param attribute
   * @param bufferType
   */
  function update(attribute, bufferType) {
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    var data = buffers.get(attribute);

    if (data === undefined) {
      buffers.set(attribute, createBuffer(attribute, bufferType));
    }
  }

  return {
    get: get,
    update: update
  }
};

/**
 * 管理几何体
 * @param gl
 * @param attributes
 * @return
 * @constructor
 */
PGL.WebGLGeometries = function(gl, attributes) {
  var geometries = {};
  var wireframeAttributes = {};

  /**
   * 获取对象的buffer几何体
   * @param object 对象
   * @param geometry 几何体
   * @return {*}
   */
  function get(object, geometry) {
    var buffergeometry = geometries[geometry.id];

    if (buffergeometry) return buffergeometry;

    if (geometry.isBufferGeometry) {
      buffergeometry = geometry;
    }

    geometries[geometry.id] = buffergeometry;

    return buffergeometry;
  }

  /**
   * 更新几何体
   * @param geometry
   */
  function update(geometry) {
    var index = geometry.index;
    var geometryAttributes = geometry.attributes;

    if (index !== null) {
      attributes.update(index, gl.ELEMENT_ARRAY_BUFFER);
    }

    for (var name in geometryAttributes) {
      attributes.update(geometryAttributes[name], gl.ARRAY_BUFFER);
    }
  }

  return {
    get: get,
    update: update
  }
};

/**
 * 管理几何体对象
 * @param geometries
 * @param info
 * @return {{update: update}}
 * @constructor
 */
PGL.WebGLObjects = function(geometries, info) {
  var updateList = {};

  function update(object) {
    var frame = info.render.frame;

    var geometry = object.geometry;
    var buffergeometry = geometries.get(object, geometry);

    // Update once per frame

    if (updateList[buffergeometry.id] !== frame) {
      geometries.update(buffergeometry);
      updateList[buffergeometry.id] = frame;
    }

    return buffergeometry;
  }

  return {
    update: update
  }
};

/**
 * 保存当前WebGL开启的扩展功能
 * @param gl 上下文
 * @return {{get: get}}
 * @constructor
 */
PGL.WebGLExtensions = function(gl) {

  var extensions = {};

  return {

    get: function(name) {

      if (extensions[name] !== undefined) {

        return extensions[name];

      }

      var extension;

      switch(name){

        case 'WEBGL_depth_texture':
          extension = gl.getExtension('WEBGL_depth_texture') || gl.getExtension('MOZ_WEBGL_depth_texture') || gl.getExtension('WEBKIT_WEBGL_depth_texture');
          break;

        case 'EXT_texture_filter_anisotropic':
          extension = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
          break;

        case 'WEBGL_compressed_texture_s3tc':
          extension = gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
          break;

        case 'WEBGL_compressed_texture_pvrtc':
          extension = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
          break;

        default:
          extension = gl.getExtension(name);

      }

      if (extension === null) {

        console.warn('THREE.WebGLRenderer: ' + name + ' extension not supported.');

      }

      extensions[name] = extension;

      return extension;

    }

  };

};

/**
 * 获取当前webgl的基础参数
 * @param gl 上下文
 * @param extensions 获取扩展方法的对象
 * @param parameters 参数
 *    precision：精度 highp
 *    logarithmicDepthBuffer：
 * @return {{getMaxAnisotropy: getMaxAnisotropy, getMaxPrecision: getMaxPrecision, precision: *, logarithmicDepthBuffer: boolean, maxTextures: *|any, maxVertexTextures: *|any, maxTextureSize: *|any, maxCubemapSize: *|any, maxAttributes: *|any, maxVertexUniforms: *|any, maxVaryings: *|any, maxFragmentUniforms: *|any, vertexTextures: boolean, floatFragmentTextures: boolean, floatVertexTextures: boolean}}
 * @constructor
 */
PGL.WebGLCapabilities = function(gl, extensions, parameters) {

  var maxAnisotropy;

  function getMaxAnisotropy() {

    if (maxAnisotropy !== undefined) return maxAnisotropy;

    var extension = extensions.get('EXT_texture_filter_anisotropic');

    if (extension !== null) {

      maxAnisotropy = gl.getParameter(extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);

    } else {

      maxAnisotropy = 0;

    }

    return maxAnisotropy;

  }

  /**
   * 检查支持的最高精度
   * @param precision
   * @return {string}
   */
  function getMaxPrecision(precision) {

    if (precision === 'highp') {

      if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 &&
        gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {

        return 'highp';

      }

      precision = 'mediump';

    }

    if (precision === 'mediump') {

      if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 &&
        gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {

        return 'mediump';

      }

    }

    return 'lowp';

  }

  var isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

  var precision = parameters.precision !== undefined ? parameters.precision : 'highp';
  var maxPrecision = getMaxPrecision(precision);

  if (maxPrecision !== precision) {

    console.warn('THREE.WebGLRenderer:', precision, 'not supported, using', maxPrecision, 'instead.');
    precision = maxPrecision;

  }

  var logarithmicDepthBuffer = parameters.logarithmicDepthBuffer === true;

  var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
  var maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  var maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  var maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);

  var maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
  var maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  var maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
  var maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

  var vertexTextures = maxVertexTextures > 0;
  var floatFragmentTextures = isWebGL2 || !!extensions.get('OES_texture_float');
  var floatVertexTextures = vertexTextures && floatFragmentTextures;

  var maxSamples = isWebGL2 ? gl.getParameter(gl.MAX_SAMPLES) : 0;

  return {

    isWebGL2: isWebGL2,

    getMaxAnisotropy: getMaxAnisotropy,
    getMaxPrecision: getMaxPrecision,

    precision: precision,
    logarithmicDepthBuffer: logarithmicDepthBuffer,

    maxTextures: maxTextures,
    maxVertexTextures: maxVertexTextures,
    maxTextureSize: maxTextureSize,
    maxCubemapSize: maxCubemapSize,

    maxAttributes: maxAttributes,
    maxVertexUniforms: maxVertexUniforms,
    maxVaryings: maxVaryings,
    maxFragmentUniforms: maxFragmentUniforms,

    vertexTextures: vertexTextures,
    floatFragmentTextures: floatFragmentTextures,
    floatVertexTextures: floatVertexTextures,

    maxSamples: maxSamples

  };

};

export {PGL};
