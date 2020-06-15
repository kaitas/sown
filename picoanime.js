  var container, stats;
  var camera, scene, renderer;
  var cube, plane;
  p = new Array();
  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;
  var targetRotationGravity = 0;
  var mouseX = 0;
  var mouseXOnMouseDown = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  init();
  animate();
  function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    var info = document.createElement( 'div' );
//    info.style.position = 'absolute';
    info.style.top = '0px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
//    info.innerHTML = 'SOWN2013 L-PoD::PicoPico';
//    info.innerHTML = '<iframe width="80%" height="30%" frameborder="0" allowtransparency="true" src="http://wp.shirai.la:3000/">IFRAME非対応</iframe>';


    container.appendChild( info );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
//    camera = new THREE.OrthographicCamera( 0, window.innerWidth, 0, window.innerHeight, 1, 1000 );
//    camera.position.y = 150;
    camera.position.y = 0;
    camera.position.z = 500;
    scene = new THREE.Scene();
    //Material
    var texture = THREE.ImageUtils.loadTexture( "/picture/picos.png" );
    texture.wrapS   = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );  
    var material, geometry, mesh;
        material = new THREE.MeshBasicMaterial( {map: texture} );
/*
    // Cube
    var geometry = new THREE.CubeGeometry( 100, 100, 100 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {
      var hex = Math.random() * 0xffffff;
      geometry.faces[ i ].color.setHex( hex );
      geometry.faces[ i + 1 ].color.setHex( hex );
    }
//    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
        material = new THREE.MeshBasicMaterial( {map: texture} );
    cube = new THREE.Mesh( geometry, material );
//    cube.position.y = 150;
    cube.position.y = 300;
    scene.add( cube );
*/
    
    // Plane
    var geometry = new THREE.PlaneGeometry( 200, 512 );
//    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
//    geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( - Math.PI / 2 ) );
//    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( i*Math.PI / 180 ) );
    plane = new THREE.Mesh( geometry, material );
    scene.add( plane );

//Planes
  for ( var i = 0; i <5; i ++ ) {
//    p[i]=new Pico(0, 0, 0, i);
    var geometry = new THREE.PlaneGeometry( 200, 512 );
//    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
//    geometry.applyMatrix( new THREE.Matrix4().makeRotationZ( - Math.PI / 2 ) );
//    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
    p[i] = new THREE.Mesh( geometry, material );
    p[i].position.x = Math.random() * window.innerWidth - window.innerWidth / 2;
    p[i].position.y = 1000 + Math.random() * window.innerHeight;
    p[i].rotation.z = Math.random();
    scene.add( p[i] );
  }

//加速度センサイベント
    var home = this;
    window.addEventListener('devicemotion',function(e){
      home.fireEvent('rotation',{rotX : e.rotationRate.alpha / 20, rotY : e.rotationRate.beta / 20, rotZ : e.rotationRate.gamma / 20});
    },true);

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
/*FPS表示
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
*/
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    
    //
    window.addEventListener( 'resize', onWindowResize, false );
  }
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  //
  function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
  }

  function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }

  function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }

  function onDocumentTouchStart( event ) {
    if ( event.touches.length === 1 ) {
      event.preventDefault();
      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;
    }
  }

  function onDocumentTouchMove( event ) {
    if ( event.touches.length === 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    }
  }
  //
  function animate() {
    requestAnimationFrame( animate );
    render();
//    stats.update();
  }

  function render() {
//    plane.rotation.y = cube.rotation.y += ( targetRotation - cube.rotation.y ) * 0.05;
//    plane.rotation.z += ( targetRotation - plane.rotation.z ) * 0.05;
    for (i in p) {
//      p[i].rotation.z += 0.05;
      p[i].rotation.z += ( targetRotation ) * 0.05;
      p[i].position.y--;
      if (p[i].position.y<-500) {
          p[i].position.y = 1000;
          p[i].position.x = Math.random() * window.innerWidth - window.innerWidth/2;
      }
    }
    renderer.render( scene, camera );
  }
  

/*
var Gyro = new Class({
  Extends:Events,
  initialize:function(){
    var home = this;
    window.addEventListener('devicemotion',function(e){
      home.fireEvent('rotation',{rotX : e.rotationRate.alpha / 20, rotY : e.rotationRate.beta / 20, rotZ : e.rotationRate.gamma / 20});
    },true);
  }
});


var Main = new Class({
  initialize:function(config){
    if (window.DeviceMotionEvent) {
      var gyro = new Gyro();
//      var world = new World3d('container');
//      gyro.addEvent('rotation',function(obj){
//        world.update.apply(world,[obj]);
//      }.bind(this));
      $('container').set({
        events:{
          touchend:function(){
//            world.reset.apply(world);
          }
        }
      });
    }else{
      $('container').set({html:'<div>Requires iOS 4.0 or later (Android 3 or later).</div>'});
    }
  }
});
*/
