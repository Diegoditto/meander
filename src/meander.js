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

  var height = 800;
  var width = 800;

  //var bytes = 32/8; 
  //var qbuf = new ArrayBuffer((width+2)*(height+2)*bytes);
  //var Q = new Float32Array(qbuf);
  //
  var uniforms = {
    height: {
      type: 'f',
      value: height
    },
    width: {
      type: 'f',
      value: width
    }
  };

  var vertexShader = $('#vertexShader').text();
  var fragmentShader = $('#fragmentShader').text();
  var shaderMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms
  });

  var basicMat = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
  var lambertMat = new THREE.MeshLambertMaterial({color: 0xaaaaaa});

  var renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(width, height);
  var scene = new THREE.Scene();

  var camera = new THREE.OrthographicCamera(
    width*0.5,
    -width*0.5, 
    height*0.5,
    -height*0.5,
    0,
    1000
  );
  camera.position.z = 500;
  scene.add(camera);

  var material = new THREE.MeshBasicMaterial({color: 0xaaaa00});
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), material);
  sphere.position.x = 300;
  scene.add(sphere);
  
  $container.append(renderer.domElement);

  //var geometry = new THREE.BufferGeometry();
  //// create a simple square shape. We duplicate the top left and bottom right
  //// vertices because each vertex needs to appear once per triangle. 
  //var vertexPositions = [ 
    //[-1.0, -1.0,  1.0],
    //[ 1.0, -1.0,  1.0],
    //[ 1.0,  1.0,  1.0],
    //[ 1.0,  1.0,  1.0],
    //[-1.0,  1.0,  1.0],
    //[-1.0, -1.0,  1.0]
  //];
  //var vertices = new Float32Array(vertexPositions.length*3); // three components per vertex

  //// components of the position vector for each vertex are stored
  //// contiguously in the buffer.
  //for ( var i = 0; i < vertexPositions.length; i++ ){
    //vertices[ i*3 + 0 ] = vertexPositions[i][0];
    //vertices[ i*3 + 1 ] = vertexPositions[i][1];
    //vertices[ i*3 + 2 ] = vertexPositions[i][2];
  //}

  //// itemSize = 3 because there are 3 values (components) per vertex
  //geometry.addAttribute('position', new THREE.BufferAttribute(vertices,3));

  //var red = new THREE.MeshBasicMaterial({color: 0xff0000});
  //var mesh = new THREE.Mesh(geometry, material);

  var segments = 1000;

  var geometry = new THREE.BufferGeometry();
  var lineMat = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    linewidth: 100
  });

  var positions = new Float32Array(segments * 3);
  var tangents = new Float32Array(segments * 3);
  var colors = new Float32Array(segments * 3);
  //
  var stp = 1.0;
  
  function init(){
    for (var i = 0; i < segments; i++){
      var i3 = i*3;
      var x = rand()*width - width*0.5;
      var y = rand()*width - width*0.5;
      var z = 0;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      tangents[i3] = rand();
      tangents[i3 + 1] = 0.0;
      tangents[i3 + 2] = 0.0;
      colors[i3] = rand();
      colors[i3 + 1] = rand();
      colors[i3 + 2] = rand();
    }
  }

  init();

  function updatePositions(){
    for (var i = 0; i < segments; i++){
      var i3 = i*3;
      var x = rand()*stp - stp*0.5;
      var y = rand()*stp - stp*0.5;
      var z = rand()*stp - stp*0.5;

      positions[i3] += x;
      positions[i3 + 1] += y;
      positions[i3 + 2] += z;

      tangents[i3] = rand();
      tangents[i3 + 1] = 0.0;
      tangents[i3 + 2] = 0.0;

      //colors[i3] = rand();
      //colors[i3 + 1] = rand();
      //colors[i3 + 2] = rand();

    }

    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('tangent', new THREE.BufferAttribute(tangents, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    //geometry.verticesNeedUpdate = true;

  }

  updatePositions();


  mesh = new THREE.Line(geometry, shaderMat);
  scene.add(mesh);
  
  function animate(){
    window.itt += 1;
    requestAnimationFrame(animate);
    updatePositions();
    render();
  }

  function render(){
    renderer.render(scene, camera);
  }

  animate();

});
