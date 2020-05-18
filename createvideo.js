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