"use strict";
//イベントの振り分け
var EVENT = {};
if ('ontouchstart' in window) {
  EVENT.TOUCH_START = 'touchstart';
  EVENT.TOUCH_MOVE = 'touchmove';
  EVENT.TOUCH_END = 'touchend';
} else {
  EVENT.TOUCH_START = 'mousedown';
  EVENT.TOUCH_MOVE = 'mousemove';
  EVENT.TOUCH_END = 'mouseup';
}
(function () {

  // 変数の初期化
  var camera, scene, renderer, video, texture, container,container2,spehreMesh;
  var fov = 60,
  isUserInteracting = false,
  onMouseDownMouseX = 0, onMouseDownMouseY = 0,
  lon = 0, onMouseDownLon = 0,
  lat = 0, onMouseDownLat = 0,
  phi = 0, theta = 0;
  var mouse = new THREE.Vector2();
  var uv = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  init();
  animate();

  function init() {

    // コンテナの準備
    container = document.getElementById( 'canvas-frame' );
    container2 = document.getElementById( 'canvas-frame2' );
    video = createVideo ('textures/video4.mp4');
    texture = createVideoTexture(video);
    // カメラを生成
    camera = new THREE.PerspectiveCamera( 75, container.innerWidth / container.innerHeight, 1, 2000 );
    
    // シーンを生成
    scene = new THREE.Scene();
    
    // 球体を作成し、テクスチャに video を元にして生成したテクスチャを設定します
    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );
    spehreMesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    scene.add( spehreMesh );
    // レンダラーを生成
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    container.addEventListener( EVENT.TOUCH_START, onDocumentMouseDown, false );
    // 画面のリサイズに対応
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener('contextmenu', onMouseRightClick, false );
    onWindowResize( null );
  }

function onDocumentMouseDown( event ) {
    event.preventDefault();
    if(event.clientX) {
      onMouseDownMouseX = event.clientX;
      onMouseDownMouseY = event.clientY;
    } else if(event.touches) {
      onMouseDownMouseX = event.touches[0].clientX
      onMouseDownMouseY = event.touches[0].clientY;
    } else {
      onMouseDownMouseX = event.changedTouches[0].clientX
      onMouseDownMouseY = event.changedTouches[0].clientY
    }
    onMouseDownLon = lon;
    onMouseDownLat = lat;
    document.addEventListener( EVENT.TOUCH_MOVE, onDocumentMouseMove, false );
    document.addEventListener( EVENT.TOUCH_END, onDocumentMouseUp, false );
  }
  function onDocumentMouseMove( event ) {
    event.preventDefault();
    if(event.clientX) {
      var touchClientX = event.clientX;
      var touchClientY = event.clientY;
    } else if(event.touches) {
      var touchClientX = event.touches[0].clientX
      var touchClientY = event.touches[0].clientY;
    } else {
      var touchClientX = event.changedTouches[0].clientX
      var touchClientY = event.changedTouches[0].clientY
    }
    lon = ( touchClientX - onMouseDownMouseX ) * -0.15 + onMouseDownLon;
    lat = ( touchClientY - onMouseDownMouseY ) * -0.15 + onMouseDownLat;
  }
  function onDocumentMouseUp( event ) {
    document.removeEventListener( EVENT.TOUCH_MOVE, onDocumentMouseMove, false );
    document.removeEventListener( EVENT.TOUCH_END, onDocumentMouseUp, false );
  }
  function onWindowResize ( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    renderer.setAnimationLoop( render );
  }
  function render() {
    if (typeof uv !== 'undefined') {
    //camera.lookAt( );
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 0;
    var globalpos = uvToGlobal( spehreMesh,uv,scene) ;
    camera.lookAt( globalpos[0]);
    renderer.render( scene, camera );
    }
    else{
      lat = Math.max( - 85, Math.min( 85, lat ) );
      phi = THREE.Math.degToRad( 90 - lat );
      theta = THREE.Math.degToRad( lon );
      camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
      camera.position.y = 100 * Math.cos( phi );
      camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
      camera.lookAt( scene.position );
      renderer.render( scene, camera );
    }
  }

  document.getElementById( 'canvas-frame2' ).addEventListener( "click", function( event ) {
    var clickX = event.pageX ;
    var clickY = event.pageY ;
  
    // 要素の位置を取得
    var clientRect = this.getBoundingClientRect() ;
    var positionX = clientRect.left + window.pageXOffset ;
    var positionY = clientRect.top + window.pageYOffset ;
    
    // 要素内におけるクリック位置を計算
    uv.x =  (clickX - positionX)/width ;
    uv.y =  (clickY - positionY)/height;
    }
   ) ;


  function onMouseRightClick(event){

    /*raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(scene.children);
    uv = intersects[0].uv;
    console.log(intersects[0].uv);*/
  }
})();