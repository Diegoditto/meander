var rand = Math.random;
var cos = Math.cos;
var acos = Math.acos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var pow = Math.pow;
var pi = Math.PI;
var pii = Math.PI*2.0;

//window.requestAnimFrame = (function(){
  //return  window.requestAnimationFrame ||
          //window.webkitRequestAnimationFrame ||
          //window.mozRequestAnimationFrame ||
          //function(callback){
            //window.setTimeout(callback,1000/60);
          //};
//})();

$(document).ready(function(){

  var $container = $('#box');
  window.itt = 0;

  var size = 1024;

  var uniforms = {
    size: {
      type: 'f',
      value: size 
    }
  };

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

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), basicMat);
  sphere.position.x = 300;
  scene.add(sphere);
  
  $container.append(renderer.domElement);

  var tnum = 800;
  var vnum = 3*tnum;
  var vertices = new Float32Array(vnum*3);
  var colors = new Float32Array(vnum*3);
  var normals = new Float32Array(vnum*3);
  var geometry = new THREE.BufferGeometry();

  var flip = 0;
  
  function init(){
    for (var i = 0; i < vnum; i++){
      var i3 = i*3;

      vertices[i3] = i-400;
      vertices[i3 + 1] = i-400;
      vertices[i3 + 2] = 0;

      normals[i3] = 0;
      normals[i3 + 1] = 0;
      normals[i3 + 2] = 1;

      colors[i3] = rand();
      colors[i3 + 1] = rand();

      if (i>2){
        colors[i3 + 2] = 0;
      }else{
        colors[i3 + 2] = 0;
      }

    }


    geometry.addAttribute('position', new THREE.BufferAttribute(vertices,3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    mesh = new THREE.Mesh(geometry, shaderMat);
    scene.add(mesh);
  }

  function updatePos(stp){

    for (var i = 0; i < vnum; i++){
      var i3 = i*3;
      var x = rand()*stp- stp*0.5;
      var y = rand()*stp- stp*0.5;
      var z = 0;

      vertices[i3] += x;
      vertices[i3 + 1] += y;
      vertices[i3 + 2] += z;

    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }

  init();

  var t = new Date();
  
  function animate(){
    window.itt += 1;
    requestAnimationFrame(animate);
    updatePos(10);
    render();
    var t2 = new Date();
    console.log(t2-t);
    t = t2;
  }

  function render(){
    renderer.render(scene, camera);
  }

  animate();

});
