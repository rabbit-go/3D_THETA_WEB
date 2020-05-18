"use strict";

(function () {

  // 変数の初期化
  var camera, scene, renderer, video, texture, container;
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
    dragInit(container);
    // カメラを生成
    camera = new THREE.PerspectiveCamera( 75, container.innerWidth / container.innerHeight, 1, 2000 );

    // シーンを生成
    scene = new THREE.Scene();
    
    // 球体を作成し、テクスチャに video を元にして生成したテクスチャを設定します
    var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    scene.add( mesh );

    // レンダラーを生成
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // 画面のリサイズに対応
    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize( null );
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
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );
    camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = 100 * Math.cos( phi );
    camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
  }

})();