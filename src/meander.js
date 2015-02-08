var rand = Math.random;
var cos = Math.cos;
var acos = Math.acos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var pow = Math.pow;
var pi = Math.PI;
var pii = Math.PI*2.0;
var abs = Math.abs;

var size = 1024;
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

  this.setColor = function setColor(t,v,x,y,z){
    var ind = t*9+3*v;
    this.colors[ind] = x;
    this.colors[ind+1] = y;
    this.colors[ind+2] = z;
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
    this.ntri = 1;
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

    var red = this.red;
    var green = this.green;
    var blue = this.blue;
    this.setColor(ntri,0,red,green,blue);
    this.setColor(ntri,1,red,green,blue);
    this.setColor(ntri,2,red,green,blue);

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

  this.initMeander = function initMeander(x,y,angle,height,red,green,blue){
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.M = new THREE.Vector2(x,y);
    this.angle = angle;
    this.height = height;
  }

  this.step = function step(stp,stpa,stph){

    var x = this.M.x;
    var y = this.M.y;
    var ntri = this.ntri;
    var tnum = this.tnum;
    var size5 = size*0.5;

    if (x>size5 || x<-size5 || y>size5 || y<-size5 || ntri>tnum){
      return false;
    }

    var height = this.height*0.5;
    var angle = this.angle;

    var step = new THREE.Vector2(sin(angle)*stp,cos(angle)*stp);

    var diff = new THREE.Vector3(step.y,-step.x);
    diff.normalize();
    diff.multiplyScalar(height);

    var a = new THREE.Vector2();
    a.addVectors(this.M,diff);
    var b = new THREE.Vector2();
    b.subVectors(this.M,diff);

    if (this.alast){
      this.addTri(a,b,this.blast);
      this.addTri(this.alast,this.blast,a);
    }

    this.alast = a;
    this.blast = b;

    var newpos = new THREE.Vector2();
    newpos.addVectors(this.M,step);
    this.M = newpos;

    this.height += (rand()-0.5)*stph;
    this.angle += (rand()-0.5)*stpa;

    return true;
  }

  this.remove = function remove(scene){
    scene.remove(this.mesh);
  }
}

$(document).ready(function(){

  // RENDERER, SCENE AND CAMERA

  var $container = $('#box');
  window.itt = 0;

  //var loader = new THREE.TextureLoader();
  //loader.load(
    //'textures/colors.gif',
    //function(texture){
      //var texmat = new THREE.MeshBasicMaterial({
        //map: texture
       //});
       //console.log('loaded: textures/colors.gif');
    //},
    //function(xhr){
      //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //},
    //function(xhr){
      //console.log('An error happened');
    //}
  //);

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

  var tnum = 2000;
  var mnum = 100;
  var maxitt = 10000;

  var height = 15;
  var stp = 1;
  var stpa = 0.4;
  var stph = 5;

  MM = [];
  for (var i=0;i<mnum;i++){
    M = new Meander(tnum);
    M.initGeomBuffer(scene,shaderMat);
    var red = rand();
    var green = 0;
    var blue = rand();
    M.initMeander(0,0,rand()*pii,(rand()-0.5)*height,red,green,blue);
    MM.push(M);
  }


  // ANIMATE

  function animate(){
    window.itt += 1;
    if (window.itt>maxitt){
      return;
    }
    requestAnimationFrame(animate);
    render();

    for (var i=0;i<mnum;i++){
      var keep = MM[i].step(stp,stpa,stph);
      if (!keep){
        MM[i].softInit();
        var red = 0.;
        var green = rand();
        var blue = rand();
        MM[i].initMeander(0,0,rand()*pii,(rand()-0.5)*height,red,green,blue);
      }
    }
  }

  function render(){
    renderer.render(scene, camera);
  }


  // START

  animate();

});
