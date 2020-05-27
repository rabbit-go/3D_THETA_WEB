function create(canvas){
    document.getElementById( 'canvas-frame2' ).addEventListener( EVENT.TOUCH_START, onMouseClickDown) ;
    document.getElementById( 'canvas-frame2' ).addEventListener( EVENT.TOUCH_END, onMouseClickUp) ;
    function onMouseClickDown(event){
      calcUV_c(event,this.getBoundingClientRect());
      document.getElementById( 'canvas-frame2' ).addEventListener( EVENT.TOUCH_MOVE, calcUV) ;
    }
    function onMouseClickUp(event){
      document.getElementById( 'canvas-frame2' ).removeEventListener(EVENT.TOUCH_MOVE, calcUV);
    }
}