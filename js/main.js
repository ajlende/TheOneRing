var scene, camera, controls, renderer;

var theOne, theThree, theSeven, theNine;

// TODO: Skybox Textures
var path = "images/";
var imageNames = [
  path + "px.png",
  path + "nx.png",
  path + "py.png",
  path + "ny.png",
  path + "pz.png",
  path + "nz.png"
];

var lavaMapPath = path + 'LavaCracks.jpg';
var lavaBumpMapPath = path + 'LavaCracks_h.jpg';

init();
animate();

function init() {

  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  // Add a renderer to the body
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(WIDTH, HEIGHT);
  document.body.appendChild(renderer.domElement);

  // The scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 0.1, 3000);


  //////////////////////////////////////////////////////////////////////////////
  //  CAMERA                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  var VIEW_ANGLE = 45,
      ASPECT = WIDTH/HEIGHT,
      NEAR = 0.1,
      FAR = 20000;

  // Add a perspective camera to the scene
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(505, -149, -565);
  scene.add(camera);

  // Resize everything when the window resizes
  window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  });


  //////////////////////////////////////////////////////////////////////////////
  //  SKYBOX                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  /* DONE:
   * [X] Has a skybox
   */

  // Loads the skybox texture
  var cubeMap = THREE.ImageUtils.loadTextureCube(imageNames);

  var cubeMapShader = THREE.ShaderLib["cube"];

  cubeMapShader.uniforms["tCube"].value = cubeMap;

  var skyboxMaterial = new THREE.ShaderMaterial({
    fragmentShader: cubeMapShader.fragmentShader,
    vertexShader: cubeMapShader.vertexShader,
    uniforms: cubeMapShader.uniforms,
    side: THREE.BackSide  // we'll only see the inside of the cube
  });

  var skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
  var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);

  scene.add(skybox);


  //////////////////////////////////////////////////////////////////////////////
  //  OBJECTS/GEOMETRY                                                        //
  //////////////////////////////////////////////////////////////////////////////

  /* DONE:
   *
   * [X] Add at least 8 objects.
   * [X] Some of which are hierarchically related.
   * [X] Uses at least 3 types of geometry (cubes, spheres, planes,
   *     extrusions, etc.).
   * [X] At least 1 of which is a model loaded from an OBJ file.
   * [X] Has at least 1 feature that is animated.
   */

  var geometry, material, mesh;
  var shader, uniforms;
  var texture, bumpMap;

  // The ground
  texture = THREE.ImageUtils.loadTexture(lavaMapPath);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = texture.repeat.y = 11;
  texture.offset.set(0.3, 0.1);

  bumpMap = THREE.ImageUtils.loadTexture(lavaBumpMapPath);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.x = bumpMap.repeat.y = 11;
  bumpMap.offset.set(0.3, 0.1);

  shader = THREE.ParallaxShader;
  uniforms = THREE.UniformsUtils.clone(shader.uniforms);
  material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: uniforms,
  });
  material.map = texture;
  material.bumpMap = bumpMap;
  material.map.anisotropy = 4;
  material.bumpMap.anisotropy = 4;
  material.defines = {};
  material.defines[ THREE.ParallaxShader.modes['occlusion'] ] = '';
  uniforms[ 'map' ].value = material.map;
  uniforms[ 'bumpMap' ].value = material.bumpMap;
  uniforms[ 'parallaxScale' ].value = -1.0 * 5;
  uniforms[ 'parallaxMinLayers' ].value = 20;
  uniforms[ 'parallaxMaxLayers' ].value = 30;
  uniforms[ 'repeat' ].value = 11;
  uniforms[ 'fogColor' ].value = scene.fog.color;
  uniforms[ 'fogNear' ].value = scene.fog.near;
  uniforms[ 'fogFar' ].value = scene.fog.far;
  geometry = new THREE.PlaneBufferGeometry(5000, 5000, 1, 1);
  mesh = new THREE.Mesh(geometry, material);
  mesh.translateY(-190);
  mesh.rotateX(-90*Math.PI/180);

  scene.add(mesh);

  // The Rings Of Power //

  // One Ring to rule them all
  var loader = new THREE.ObjectLoader();
  loader.load( 'models/theOneObject.json', function ( obj ) {
    theOne = obj;
    scene.add( theOne );
  }, function() {}, function(err) {
    console.log(err);
    console.log('err');
  });

  // Ring Material
  material = new THREE.MeshPhongMaterial({
    color: 0xCC9900,
    ambient: 0x140F00,
    specular: 0xF0E0B2,
    shininess: 30,
    shading: THREE.SmoothShading
  });

  // The Others are basic toruses
  geometry = new THREE.TorusGeometry(10, 3, 32, 64);

  // Three Rings for the Elven-kings under the sky
  theThree = new THREE.Object3D();
  for (i = 0; i < 3; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateY( (i+1) * (120 * Math.PI / 180) );
    mesh.translateX(3 * 14);
    theThree.add(mesh);
  }
  theThree.rotationAutoUpdate;
  scene.add(theThree);

  // Seven for the Dwarf-lords in their halls of stone
  theSeven = new THREE.Object3D();
  for (i = 0; i < 7; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateY( (i+1) * (51.43 * Math.PI / 180) );
    mesh.translateX(7 * 14);
    theSeven.add(mesh);
  }
  scene.add(theSeven);

  // Nine for Mortal Men doomed to die
  theNine = new THREE.Object3D();
  for (i = 0; i < 9; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateY( (i+1) * (40 * Math.PI / 180) );
    mesh.translateX(11 * 14);
    theNine.add(mesh);
  }
  scene.add(theNine);


  //////////////////////////////////////////////////////////////////////////////
  //  LIGHTS                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  /* DONE:
   * [X] Uses multiple lights.
   */

  var directionalLight = new THREE.DirectionalLight(0xEFEFEF, 0.5);
  directionalLight.position.set(0, 200, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);


  var hemisphereLight = new THREE.HemisphereLight(0x2E3436, 0xE84610, 0.3);
  scene.add(hemisphereLight);


  //////////////////////////////////////////////////////////////////////////////
  //  CONTROLS                                                                //
  //////////////////////////////////////////////////////////////////////////////

  /* DONE:
   * [X] Has controls for the camera.
   */

  // Orbit controlls from http://threejs.org/examples/#misc_controls_orbit
  controls = new THREE.OrbitControls(camera, renderer.domElement);


}

function animate() {
  requestAnimationFrame(animate);

  theOne.rotation.y -= 0.01;
  theOne.rotation.x -= 0.01;

  for (ring in theThree.children) {
    theThree.children[ring].rotation.y -= 5.625 * Math.PI / 180;
  }
  for (ring in theSeven.children) {
    theSeven.children[ring].rotation.y += 5.625 * Math.PI / 180;
  }
  for (ring in theNine.children) {
    theNine.children[ring].rotation.y -= 5.625 * Math.PI / 180;
  }

  theThree.rotation.x +=  0.625 * Math.PI / 180 / 5;
  theThree.rotation.y += 12.625 * Math.PI / 180 / 5;
  theThree.rotation.z -=  0.625 * Math.PI / 180 / 5;
  theSeven.rotation.x +=  0.625 * Math.PI / 180 / 5;
  theSeven.rotation.y -=  6.625 * Math.PI / 180 / 5;
  theSeven.rotation.z +=  1.625 * Math.PI / 180 / 5;
  theNine.rotation.x  -=  0.625 * Math.PI / 180 / 5;
  theNine.rotation.y  +=  3.625 * Math.PI / 180 / 5;
  theNine.rotation.z  +=  0.625 * Math.PI / 180 / 5;

  renderer.render(scene, camera);
  controls.update();
}
