/**
 * Dynamic Favicon's
 *
 * Copyright (c) 2011 Georg Leciejewski
 * licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Creates a canvas image and maps it to a favicon link in the header section.
 * This is not fully supported by all browsers 
 * - Chrome: fully dynamic
 * - Safari+Firefox: only works once on page load
 * - Opera .. sorry guys
 * - IE ... i personally dont care
 */


DynFav = (function() {
  // Default options
  var _defaults = {
    textColor : '#000',    // color of the text on the icon  #5025f0
    text      : 'SK',      // text  on the icon
    textX     : 1,         // x pos from right
    textY     : 12,        // y pos from top, txt baselin
    radius    : 3,         //border radius
    font      : 'bold 10px "helvetica", sans-serif',
    bgColor   : '#D82C00',
    bgImg     : 'favicon_blank.png', //png file used as img src, background behind the canvas, could contain a logo or so
  };

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

     /* draw the icon
     * @example DynamicFavicon.draw()
     * Note that a link header-tag with id=favicon needs to be existent in the current document
     */
    draw: function(options) {
      var canvas = document.createElement('canvas'),
          ctx,
          img = document.createElement('img'),
          link = document.getElementById('favicon').cloneNode(true),
          opts =_defaults;

      // merge given options with defaults
      if(typeof options != 'undefined'){
        for(var prop in options) {
          if(opts.hasOwnProperty(prop) && typeof options[prop] !='undefined')
              opts[prop] = options[prop];
        }
      }

      if (canvas.getContext) {
        canvas.height = canvas.width = 16; // set the size
        ctx = canvas.getContext('2d');
        img.onload = function () { // once the image has loaded
          ctx.drawImage(this, 0, 0);
          //bg
          ctx.fillStyle = opts.bgColor;
          _roundRect(ctx, 0, 0, 16, 16, opts.radius, true);
          //fonts
          ctx.font = opts.font;
          ctx.fillStyle = opts.textColor;
          ctx.fillText(opts.text, opts.textX, opts.textY);

          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
        };
        img.src = opts.bgImg;
      }

    },
    
    /**
     * Get or Set default options
     * @param new_opts hash with to be overriden default options
     */
    options: function(new_opts){
      if(typeof new_opts == 'undefined') return _defaults;
      for(var prop in new_opts) {
        if(_defaults.hasOwnProperty(prop) && typeof new_opts[prop] !='undefined')
            _defaults[prop] = new_opts[prop];
      }
      return _defaults;
    }
    
    

  }
})();
