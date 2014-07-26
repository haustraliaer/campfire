

__document.ready(function() {

  set_breakpoint();

  // eventCheck for all browsers
  __mq.addEventListener('webkitTransitionEnd', set_breakpoint, true);
  __mq.addEventListener('MSTransitionEnd', set_breakpoint, true);
  __mq.addEventListener('oTransitionEnd', set_breakpoint, true);
  __mq.addEventListener('transitionend', set_breakpoint, true);

  update_fastclick();
  introHeightCheck();
  initChat();

  // adust height on resize
  var rtime = new Date(1, 1, 2000, 12,00,00);
  var timeout = false;
  var delta = 200;
  __w.resize(function() {
      rtime = new Date();
      if (timeout === false) {
          timeout = true;
          setTimeout(resizeend, delta);
      }
  });

});
