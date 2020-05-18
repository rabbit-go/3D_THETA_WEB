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
  var camera, scene, renderer, video, texture, container,mesh;
  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  const width = 400;
  const height = 200;
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
    video = createVideo ('textures/video4.mp4');
    texture = createVideoTexture(video);

    // カメラを生成
    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 2000 );

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
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    // ドラッグ・スワイプ操作を設定
    container.addEventListener( EVENT.TOUCH_START, onDocumentMouseDown, false );
    window.addEventListener(EVENT.TOUCH_MOVE, onMouseMove, false );
    window.addEventListener('contextmenu', onMouseRightClick, false );
    // 画面のリサイズに対応
    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize( null );
  }
  function onMouseRightClick(event){
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects[0].uv);
  }
  function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
  
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  }
  function createVideo (src) {
        // video 要素を生成
        const local_video = document.createElement( 'video' );
        local_video.crossOrigin = 'anonymous';
        local_video.loop = true;
        local_video.muted = true;
        local_video.src = src;
        local_video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
        local_video.setAttribute( 'playsinline', 'playsinline' );
        local_video.setAttribute( 'muted', 'muted' );
        local_video.play();
        return local_video;
  }
  function createVideoTexture ( local_video ) {
        // video からテクスチャを生成
        const local_texture = new THREE.Texture( local_video );
        local_texture.generateMipmaps = false;
        local_texture.minFilter = THREE.NearestFilter;
        local_texture.maxFilter = THREE.NearestFilter;
        local_texture.format = THREE.RGBFormat;
        // 動画に合わせてテクスチャを更新
        setInterval( function () {
          if ( local_video.readyState >= local_video.HAVE_CURRENT_DATA ) {
            local_texture.needsUpdate = true;
          }
        }, 1000 / 60 );
        return local_texture;
  }
  function onWindowResize ( event ) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
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
    const radian = (10 * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);
        
    
    // 地球は常に回転させておく
    mesh.rotation.x = lat;
    mesh.rotation.y = lon;
    mesh.rotation.z = theta;
   
    // 原点方向を見つめる
    camera.lookAt(mesh.position);
    renderer.render( scene, camera );




  }
  // 初期化のために実行
onResize();
// リサイズイベント発生時に実行
window.addEventListener('resize', onResize);

function onResize() {


  // レンダラーのサイズを調整する
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

})();