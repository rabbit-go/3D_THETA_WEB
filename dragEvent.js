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
function dragInit(container){
    // ドラッグ・スワイプ操作を設定
    container.addEventListener( EVENT.TOUCH_START, onDocumentMouseDown, false );
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