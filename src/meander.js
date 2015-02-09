var rand = Math.random;
var round = Math.round;
var floor = Math.floor;
var cos = Math.cos;
var acos = Math.acos;
var atan2 = Math.atan2;
var sin = Math.sin;
var sqrt = Math.sqrt;
var pow = Math.pow;
var pi = Math.PI;
var pii = Math.PI*2.0;
var abs = Math.abs;

function halfrand(x){
  return (rand()-0.5)*x;
}

var size = 1024;
var size5 = size*0.5;
var mousedown = false;

var opacity = 0.5;

var uniforms = {
  size: {
    type: 'f',
    value: size 
  },
  opacity: {
    type: 'f',
    value: opacity 
  }
};


window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function(callback){
            window.setTimeout(callback,1000/60);
          };
})();


function Meander(tnum){
  this.tnum = tnum;
  this.vnum = 3*tnum;
  this.vertices = new Float32Array(this.vnum*3);
  this.colors = new Float32Array(this.vnum*3);
  this.normals = new Float32Array(this.vnum*3);
  this.geometry = new THREE.BufferGeometry();

  this.setVertex = function setVertex(t,v,x,y,z){
    var ind = t*9+3*v;
    this.vertices[ind] = x;
    this.vertices[ind+1] = y;
    this.vertices[ind+2] = z;
  }

  this.setNormal = function setNormal(t,v,x,y,z){
    var ind = t*9+3*v;
    this.normals[ind] = x;
    this.normals[ind+1] = y;
    this.normals[ind+2] = z;
  }

  this.setColor = function setColor(t,v,rgb){
    var ind = t*9+3*v;
    this.colors[ind] = rgb[0];
    this.colors[ind+1] = rgb[1];
    this.colors[ind+2] = rgb[2];
  }

  this.initGeomBuffer = function initGeomBuffer(scene,mat){

    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3));

    mesh = new THREE.Mesh(this.geometry, mat);
    this.mesh = mesh;
    scene.add(mesh);

    this.softInit();
  }

  this.softInit = function softInit(){
    for (var t=0; t<this.tnum; t++){
      for (var v=0; v<3; v++){
        this.setVertex(t,v,0,0,0);
        this.setNormal(t,v,0,0,1);
        this.setColor(t,v,0,0,0);
      }
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
    this.ntri = 0;
    this.blast = undefined;
    this.alast = undefined;
  }

  this.addTri = function addTri(a,b,c){

    var ntri = this.ntri;
    var ab = new THREE.Vector2();
    ab.subVectors(b,a);
    var ac = new THREE.Vector2();
    ac.subVectors(c,a);
    var cross = ac.x*ab.y-ac.y*ab.x;

    var h = this.height;

    var rgb = this.rgb;

    this.setColor(ntri,0,rgb);
    this.setColor(ntri,1,rgb);
    this.setColor(ntri,2,rgb);

    this.setNormal(ntri,0,0,h,0);
    this.setNormal(ntri,1,0,h,0);
    this.setNormal(ntri,2,0,h,0);

    if (cross<0){
      this.setVertex(ntri,0,a.x,a.y,0);
      this.setVertex(ntri,1,c.x,c.y,0);
      this.setVertex(ntri,2,b.x,b.y,0);
    }
    else{
      this.setVertex(ntri,0,a.x,a.y,0);
      this.setVertex(ntri,1,b.x,b.y,0);
      this.setVertex(ntri,2,c.x,c.y,0);
    }

    this.ntri = ntri+1;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.normal.needsUpdate = true;
  }

  this.initMeander = function initMeander(xy,vxy,height,rgb){
    this.rgb = rgb;
    this.xy = xy;
    this.vxy = vxy;
    this.height = height;
  }

  this.mstep = function mstep(stp,stpa,stph){

    var x = this.xy.x;
    var y = this.xy.y;
    var ntri = this.ntri;
    var tnum = this.tnum;

    if (ntri>tnum){
      this.ntri = 0;
    }

    var height = this.height*0.5;

    var step = this.vxy;
    var diff = new THREE.Vector3(step.y,-step.x);
    diff.normalize();
    diff.multiplyScalar(height);

    var a = new THREE.Vector2();
    a.addVectors(this.xy,diff);
    var b = new THREE.Vector2();
    b.subVectors(this.xy,diff);

    if (this.alast){
      this.addTri(a,b,this.blast);
      this.addTri(this.alast,this.blast,a);
    }

    this.alast = a;
    this.blast = b;

    var newpos = new THREE.Vector2();
    newpos.addVectors(this.xy,step);
    this.xy = newpos;

    this.height += halfrand(stph)
    var ranAngle = rand()*pii;
    var ranx = cos(ranAngle);
    var rany = sin(ranAngle);
    var da = new THREE.Vector2(ranx,rany);
    da.multiplyScalar(15);
    this.vxy.add(da);

    if (mousedown){
      var dx = (window.mouseX-x);
      var dy = (window.mouseY-y);
      //var dd = sqrt(dx*dx+dy*dy);
      var mouseStep = new THREE.Vector2(dx,dy);
      mouseStep.multiplyScalar(0.2);
      this.vxy.add(mouseStep);
    }

    this.vxy.multiplyScalar(0.3);

    this.xy.add(this.vxy);

  }

  this.remove = function remove(scene){
    scene.remove(this.mesh);
  }
}


$(document).ready(function(){


  // RENDERER, SCENE AND CAMERA

  var $container = $('#box');
  window.itt = 0;

  var offset = $container.offset();

  $(window).resize(function () {
    offset = $container.offset();
  });

  $(document).mousedown(function() {
    mousedown = true;
  }).bind('mouseup mouseleave', function() {
    mousedown = false;
  });

  $(document).mousemove(function(e) {
    window.mouseX = size5-e.pageX+offset.left;
    window.mouseY = size5-e.pageY+offset.top;
  });

  var vertexShader = $('#vertexShader').text();
  var fragmentShader = $('#fragmentShader').text();
  var shaderMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      transparent: true
  });
  var basicMat = new THREE.MeshBasicMaterial({color: 0xff0000});
  var lambertMat = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
  var lineMat = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    linewidth: 100
  });

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: false
  });
  renderer.setSize(size, size);
  renderer.setPixelRatio( window.devicePixelRatio || 1 );

  var scene = new THREE.Scene();

  var camera = new THREE.OrthographicCamera(
    size5,
    -size5, 
    size5,
    -size5,
    0,
    1000
  );
  camera.position.z = 500;
  scene.add(camera);

  $container.append(renderer.domElement);


  // INIT MEANDER

  var tnum = 130;
  var mnum = 100;
  var maxitt = 100000;

  var height = 100;
  var stp = 1;
  var stpa = 0.4;
  var stph = 2;

  function set(m){
    rgb = color[floor(rand()*color.length)];
    m.initMeander(
      new THREE.Vector2(0,0),
      new THREE.Vector2(0,1),
      halfrand(height),
      rgb
    );
  }

  MM = [];
  for (var i=0;i<mnum;i++){
    M = new Meander(tnum);
    M.initGeomBuffer(scene,shaderMat);
    MM.push(M);
    set(M);
  }

  // ANIMATE

  function animate(){
    window.itt += 1;
    if (window.itt>maxitt){
      return;
    }
    requestAnimationFrame(animate);
    render();

    for (var s=0;s<2;s++){
      for (var i=0;i<mnum;i++){
        MM[i].mstep(stp,stpa,stph);
      }
    }
  }

  function render(){
    renderer.render(scene, camera);
  }


  // START

  animate();

});
