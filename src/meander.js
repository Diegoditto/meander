var rand = Math.random;
var cos = Math.cos;
var acos = Math.acos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var pow = Math.pow;
var pi = Math.PI;
var pii = Math.PI*2.0;

var size = 1024;

var uniforms = {
  size: {
    type: 'f',
    value: size 
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

  this.setColor = function setColor(t,v,x,y,z){
    var ind = t*9+3*v;
    this.colors[ind] = x;
    this.colors[ind+1] = y;
    this.colors[ind+2] = z;
  }

  this.initGeomBuffer = function initGeomBuffer(scene,mat){
    for (var t=0; t<this.tnum; t++){
      for (var v=0; v<3; v++){
        this.setVertex(t,v,0,0,0);
        this.setNormal(t,v,0,0,1);
        this.setColor(t,v,0,0,1);
      }
    }
    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.addAttribute('normal', new THREE.BufferAttribute(this.normals, 3));

    mesh = new THREE.Mesh(this.geometry, mat);
    scene.add(mesh);
    this.ntri = 1;
  }

  this.addBox = function addBox(a,b){

    var ntri = this.ntri;

    var ba = new THREE.Vector2();
    ba.subVectors(b,a);
    var c = new THREE.Vector2();
    var diff = new THREE.Vector3(ba.y,-ba.x);
    diff.normalize();
    c.addVectors(a,diff.multiplyScalar(10.));

    var r = rand();
    var g = rand();
    this.setColor(ntri,0,r,g,0);
    this.setColor(ntri,1,r,g,0);
    this.setColor(ntri,2,r,g,0);

    this.setVertex(ntri,0,a.x,a.y,0);
    this.setVertex(ntri,1,b.x,b.y,0);
    this.setVertex(ntri,2,c.x,c.y,0);

    this.ntri = ntri+1;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  this. initMeander = function initMeander(x,y,a){
    this.M = new THREE.Vector2(x,y);
    this.a = a
  }

  this.step = function step(){
    var stp = 2;
    var stpa = 0.1
    var a = this.a;
    var mn = new THREE.Vector2(sin(a)*stp,cos(a)*stp);
    mn.add(this.M);
    this.addBox(this.M,mn);
    this.M = mn;
    da = (rand()-0.5)*stpa;
    this.a = a+da;
  }
}

$(document).ready(function(){

  // RENDERER, SCENE AND CAMERA

  var $container = $('#box');
  window.itt = 0;

  var vertexShader = $('#vertexShader').text();
  var fragmentShader = $('#fragmentShader').text();
  var shaderMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms
  });
  var basicMat = new THREE.MeshBasicMaterial({color: 0xff0000});
  var lambertMat = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
  var lineMat = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    linewidth: 100
  });

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setSize(size, size);
  var scene = new THREE.Scene();

  var camera = new THREE.OrthographicCamera(
    size*0.5,
    -size*0.5, 
    size*0.5,
    -size*0.5,
    0,
    1000
  );
  camera.position.z = 500;
  scene.add(camera);

  //var sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), basicMat);
  //sphere.position.x = 300;
  //scene.add(sphere);
  
  $container.append(renderer.domElement);


  // INIT MEANDER

  var tnum = 1000;
  var mnum = 100;

  MM = [];
  for (var i=0;i<mnum;i++){
    M = new Meander(tnum);
    M.initGeomBuffer(scene,shaderMat);
    M.initMeander(0,-size*0.5,0);
    MM.push(M);
  }


  // ANIMATE

  var t = new Date();
  function animate(){
    window.itt += 1;
    if (window.itt>1000){
      return;
    }
    requestAnimationFrame(animate);
    render();

    for (var i=0;i<mnum;i++){
      MM[i].step();
    }

    if (!(window.itt%20)){
      var t2 = new Date();
      console.log((t2-t)/20.);
      t = t2;
    }
  }

  function render(){
    renderer.render(scene, camera);
  }


  // START

  animate();

});
