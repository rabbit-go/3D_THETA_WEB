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
  var camera, scene, renderer, video, texture, container,container2,spehreMesh,materilal;
  var fov = 50,
  lon = 0, 
  lat = 0, 
  phi = 0, theta = 0;
  var uv = new THREE.Vector2();
  init();
  animate();

  function init() {

    // コンテナの準備
    container = document.getElementById( 'canvas-frame' );
    container2 = document.getElementById( 'canvas-frame2' );
    var select = document.getElementById( 'video_src' );
    select.addEventListener( 'change', function (e) {
      if(select.value=='video'){
        video = createVideo('textures/nogawa.mp4');
        texture = createVideoTexture(video);
        materilal.map = texture;
      }
      else{
        video = createWebVideo();
        texture = createVideoTexture(video);
        materilal.map = texture;
      }
    } );
    video = createVideo ('textures/nogawa.mp4');
    texture = createVideoTexture(video);
    fileLoad();
    // カメラを生成
    camera = new THREE.PerspectiveCamera( fov, container.offsetWidth / container.offsetHeight, 1, 2000 );
    
    // シーンを生成
    scene = new THREE.Scene();
    
    // 球体を作成し、テクスチャに video を元にして生成したテクスチャを設定します
    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );
    materilal = new THREE.MeshBasicMaterial( { map: texture } );
    spehreMesh = new THREE.Mesh( geometry, materilal);
    scene.add( spehreMesh );
    // レンダラーを生成
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild( renderer.domElement );

  }
  function fileLoad(){
    const output = document.getElementById('output');
      if (window.FileList && window.File) {
        document.getElementById('file-selector').addEventListener('change', event => {
          for (const file of event.target.files) {
            video =createVideo(window.URL.createObjectURL(file));
            texture = createVideoTexture(video);
            materilal.map = texture;
          }
        }); 
      }
  }
  function animate() {
    renderer.setAnimationLoop( render );
  }
  function render() {
    const ctx=container2.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth , video.videoHeight, 0, 0, container2.width, container2.height);


    if (uv.x != 0 && uv.y != 0) {
    //camera.lookAt( );
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 0;
    var globalpos = uvToGlobal( spehreMesh,uv,scene) ;
    if(globalpos.length >0){
      globalpos[0].y = -globalpos[0].y;
    camera.lookAt(globalpos[0] );
    }
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

  
  document.getElementById( 'canvas-frame2' ).addEventListener( EVENT.TOUCH_START, onMouseClickDown) ;
  document.getElementById( 'canvas-frame2' ).addEventListener( EVENT.TOUCH_END, onMouseClickUp) ;
  function onMouseClickDown(event){
    calcUV_c(event,this.getBoundingClientRect());
    document.getElementById( 'canvas-frame2' ).addEventListener( EVENT.TOUCH_MOVE, calcUV) ;
  }
  function onMouseClickUp(event){
    document.getElementById( 'canvas-frame2' ).removeEventListener(EVENT.TOUCH_MOVE, calcUV);
  }

  function calcUV(event){
    var clickX = event.pageX ;
    var clickY = event.pageY ;
  
    // 要素の位置を取得
    var clientRect = this.getBoundingClientRect();
    var positionX = clientRect.left + window.pageXOffset;
    var positionY = clientRect.top + window.pageYOffset;
    
    // 要素内におけるクリック位置を計算
    uv.x =  (clickX - positionX)/clientRect.width ;
    uv.y =  (clickY - positionY)/clientRect.height;
    console.log(uv);

  }
  function calcUV_c(event,clientRect){
    var clickX = event.pageX ;
    var clickY = event.pageY ;
  
    // 要素の位置を取得
    var clientRect = clientRect;
    var positionX = clientRect.left + window.pageXOffset ;
    var positionY = clientRect.top + window.pageYOffset ;
    
    // 要素内におけるクリック位置を計算
    uv.x =  (clickX - positionX)/clientRect.width ;
    uv.y =  (clickY - positionY)/clientRect.height;
    console.log(uv);

  }
})();