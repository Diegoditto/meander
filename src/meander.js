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
  var shaderMaterial = new THREE.ShaderMaterial({
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

  var geometry = new THREE.SphereGeometry(5, 32, 32);
  var material = new THREE.MeshBasicMaterial({color: 0xaaaa00});
  var sphere = new THREE.Mesh(geometry, material);
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
  var red = new THREE.MeshBasicMaterial({color: 0xff0000});
  //var mesh = new THREE.Mesh(geometry, material);

  var segments = 10000;

  var geometry = new THREE.BufferGeometry();
  var lineMat = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

  var positions = new Float32Array( segments * 3 );
  var colors = new Float32Array( segments * 3 );

  var r = 800;

  for ( var i = 0; i < segments; i ++ ) {

    var x = Math.random() * r - r / 2;
    var y = Math.random() * r - r / 2;
    var z = Math.random() * r - r / 2;
    positions[ i * 3 ] = x;
    positions[ i * 3 + 1 ] = y;
    positions[ i * 3 + 2 ] = z;
  }

  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

  geometry.computeBoundingSphere();

  mesh = new THREE.Line( geometry, shaderMaterial);
  scene.add( mesh );
  
  function animate(){
    window.itt += 1;
    requestAnimationFrame(animate);
    render();
  }

  function render(){
    renderer.render(scene, camera);
  }

  animate();

});
