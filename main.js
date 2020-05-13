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
  var camera, scene, renderer,  container,mesh;
  var radian ;
  var fov = 60,
  isUserInteracting = false,
  onMouseDownMouseX = 0, onMouseDownMouseY = 0,
  lon = 0, onMouseDownLon = 0,
  lat = 0, onMouseDownLat = 0,
  phi = 0, theta = 0;

  init();
  animate();

  function init() {

    // コンテナの準備
    container = document.getElementById( 'canvas-frame' );
    
    const video = createVideo('textures/video4.mp4');
    const texture = createVideoTexture('textures/video4.mp4');
    // カメラを生成
    camera = new THREE.PerspectiveCamera( 75, container.innerWidth / container.innerHeight, 1, 2000 );
    // シーンを生成
    scene = new THREE.Scene();
    
    // 球体を作成し、テクスチャに video を元にして生成したテクスチャを設定します
    var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );
    mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    scene.add( mesh );

    // レンダラーを生成
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // ドラッグ・スワイプ操作を設定
    container.addEventListener( EVENT.TOUCH_START, onDocumentMouseDown, false );
  }
  function createVideo(src){
     // video 要素を生成
     const video = document.createElement( 'video' );
     video.crossOrigin = 'anonymous';
     video.loop = true;
     video.muted = true;
     video.src = src;
     video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
     video.setAttribute( 'playsinline', 'playsinline' );
     video.setAttribute( 'muted', 'muted' );
     video.play();
     return video;
  }
  function createVideoTexture(video){
        // video からテクスチャを生成
        const texture = new THREE.Texture( video );
        texture.generateMipmaps = false;
        texture.minFilter = THREE.NearestFilter;
        texture.maxFilter = THREE.NearestFilter;
        texture.format = THREE.RGBFormat;
        // 動画に合わせてテクスチャを更新
        setInterval( function () {
          if ( video.readyState >= video.HAVE_CURRENT_DATA ) {
            texture.needsUpdate = true;
          }
        }, 1000 / 60 );
        return texture;
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

  function animate() {
    renderer.setAnimationLoop( render );
  }
  function render() {
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );
    // ラジアンに変換する
    radian = (10 * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);
        
    
    // 地球は常に回転させておく
    mesh.rotation.x = phi;
    mesh.rotation.y = theta;
   
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render( scene, camera );
  }

})();