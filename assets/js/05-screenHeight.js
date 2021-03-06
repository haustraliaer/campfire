
// adust height on resize
var rtime = new Date(1, 1, 2000, 12,00,00);
var timeout = false;
var delta = 200;

function initScreenHeight() {
  __w.resize(function() {
      rtime = new Date();
      if (timeout === false) {
          timeout = true;
          setTimeout(resizeend, delta);
      }
  });
}


function resizeend() {
    if(new Date() - rtime < delta) {

        setTimeout(resizeend, delta);

    } else {

        timeout = false;

    // do stuff at end of browser resize...
    introHeightCheck();

    }

}

function introHeightCheck () {

  // for when I want to use breakpoints...
  // var breakpoint = window.getComputedStyle(document.getElementById("mediaquery"),":after").getPropertyValue("content");

  // get each element I want to force fullscreen
  $('#js-fullscreen-intro').each(function(i, panel) {

    // setup variables

    var w_height = __w.height();

    if (w_height > 700) {

      // set the panel height to browser height
      $(panel).css({ height: w_height + "px" });

    }

  });

}
