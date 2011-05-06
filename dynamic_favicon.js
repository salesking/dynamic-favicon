/**
 * Dynamic Favicon's
 *
 * Copyright (c) 2011 Georg Leciejewski
 * licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

DynFav = (function() {

  var _private = {};
  

  /**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to false.
 */
  function _roundRect(ctx, x, y, width, height, radius, fill, stroke) {

    if (typeof radius === "undefined") {  radius = 5  }

    var r2d = Math.PI/180;
    if( ( width - x ) - ( 2 * radius ) < 0 ) { radius = ( ( width - x ) / 2 ); } //ensure that the radius isn't too large for x
    if( ( height - y ) - ( 2 * radius ) < 0 ) { radius = ( ( height - y ) / 2 ); } //ensure that the radius isn't too large for y
    ctx.beginPath();
    ctx.moveTo(x+radius,y);
    ctx.lineTo(width-radius,y);
    ctx.arc(width-radius,y+radius,radius,r2d*270,r2d*360,false);
    ctx.lineTo(width,height-radius);
    ctx.arc(width-radius,height-radius,radius,r2d*0,r2d*90,false);
    ctx.lineTo(x+radius,height);
    ctx.arc(x+radius,height-radius,radius,r2d*90,r2d*180,false);
    ctx.lineTo(x,y+radius);
    ctx.arc(x+radius,y+radius,radius,r2d*180,r2d*270,false);
    ctx.closePath();

    if (stroke) { ctx.stroke() }
    if (fill) { ctx.fill()  }
  }


  /* PUBLIC Interface*/
  return {

    // Options - set these right before the call to DynamicFavicon.open()
    txt_color : '#000' ,   // color of the text on the icon  '#5025f0'
    txt       : 'SK',  // text  on the icon
    txt_x     : 1,  // text  on the icon
    txt_y     : 12,  // text  on the icon
    radius    : 3,  //border radius
    font      : 'bold 10px "helvetica", sans-serif',
    bg_color  : '#D82C00',
    bg_png    : 'favicon_blank.png', //png file used as img src, background behind the canvas

     /* change the icon
     * @example DynamicFavicon.change()
     * Note that a HEAD tag needs to be existent in the current document
     */
    change: function() {
      var canvas = document.createElement('canvas'),
          ctx,
          img = document.createElement('img'),
          link = document.getElementById('favicon').cloneNode(true);

//      console.dir(canvas);

        if (canvas.getContext) {
          canvas.height = canvas.width = 16; // set the size
          ctx = canvas.getContext('2d');
          img.onload = function () { // once the image has loaded
            ctx.drawImage(this, 0, 0);
            //bg
            ctx.fillStyle = DynFav.bg_color;
            _roundRect(ctx, 0, 0, 16, 16, DynFav.radius, true);
            //fonts
            ctx.font = DynFav.font;
            ctx.fillStyle = DynFav.txt_color;
            ctx.fillText(DynFav.txt, DynFav.txt_x, DynFav.txt_y);

            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
          };
          img.src = DynFav.bg_png;
        }

    }

  }
})();
