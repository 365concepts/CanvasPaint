BEM.DOM.decl('b-paint', { 
  onSetMod : {
    'js' : function() {
        var paint = {};
        paint.control = false;
        paint.color = 'c3c3c3';
        paint.draw_active = false;
        paint.eraser_active = false;
        paint.history = {};
        paint.history.step = 0;
        paint.history.arr = [];
        paint.history.list = [];
        paint.history.off = true;
        
        var canvas = $('#b-paint');
        canvas.height = canvas.height;
        canvas.width = canvas.width;
        ctx = canvas[0].getContext('2d');

        var body = document.body;
        var clickEventType=((document.ontouchstart!==null)?'click':'tap');
        var startEventType=((document.ontouchstart!==null)?'mousedown':'touchstart');
        var moveEventType=((document.ontouchmove!==null)?'mousemove':'touchmove');
        var endEventType=((document.ontouchend!==null)?'mouseup':'touchend');

        body.addEventListener('touchmove', function (e) {
           e.preventDefault();
        }, false);



        paint.active = function(){
          if (paint.control){
            paint.control = false;
            paint.draw_active = false;
            paint.eraser_active = false;
            $('.b-paint-control__wrap-control').removeClass('b-paint-control__wrap-control_show');
          }else{
            paint.control = true;
            paint.draw_active = false;
            paint.eraser_active = false;
            $('.b-paint-control__wrap-control').addClass('b-paint-control__wrap-control_show');
          }
        };

        paint.clear = function(bid){
          ctx.clearRect(0,0,canvas[0].width, canvas[0].height);
          paint.history.step = 0;
          paint.history.list = [];
        };

        paint.history.undo = function(){
          ctx.clearRect(0,0,canvas[0].width, canvas[0].height);
          console.log(paint.history.step);
          console.log(paint.history.off);
          paint.history.list.length = paint.history.step -1;
          if (paint.history.step > 0){
            paint.history.step--;
            for(var step = 0; step <= paint.history.step -1; step++){
              // console.log(step + 'step');
              for(var i = 0; i <= paint.history.list[step].length -1; i++){

                var undoPaint = paint.history.list[step][i];
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(undoPaint.X, undoPaint.Y);
                if(undoPaint.draw){
                  ctx.globalCompositeOperation = "source-over";  
                  ctx.strokeStyle = undoPaint.color;
                  ctx.lineWidth = 30;
                }else{
                  ctx.globalCompositeOperation = "destination-out";
                  ctx.strokeStyle = "rgba(0,0,0,1)";
                  ctx.lineWidth = 60;
                }                
                ctx.lineTo(undoPaint.x, undoPaint.y);
                ctx.stroke();
              }
            }
            
            
          }
          console.log(paint.history.list);
        };

        paint.draw = function(ctx){
          
          canvas.on(startEventType, function(e) {
            if (paint.draw_active == true || paint.eraser_active == true) {
              this.down = true; // Флаг
              this.X = e.clientX + (window.pageXOffset || body.scrollLeft || 0) - canvas.offset().left;
              this.Y = e.clientY + (window.pageYOffset || body.scrollTop || 0) - canvas.offset().top;
              this.color = paint.color;
            }
          });
          var historyArr = new Array();
          canvas.on(endEventType, function(e) {
            this.down = false;

            if (paint.draw_active == true || paint.eraser_active == true) {
              if(paint.history.off){
                paint.history.step++;
                var x = e.clientX + (window.pageXOffset || body.scrollLeft || 0) - canvas.offset().left;
                var y = e.clientY + (window.pageYOffset || body.scrollTop || 0) - canvas.offset().top;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x, y);

                if (paint.eraser_active == true) {
                  ctx.globalCompositeOperation = "destination-out";
                  ctx.strokeStyle = "rgba(0,0,0,1)";
                  ctx.lineWidth = 60;
                  //paint.history.arr.push({ X: this.X, Y: this.Y, x: x, y: y, color: "rgba(0,0,0,1)", draw: false });
                  paint.history.arr.push({ X: x, Y: y, x: x+1, y: y+1, color: "rgba(0,0,0,1)", draw: false });
                }
                if (paint.draw_active == true) {
                  ctx.globalCompositeOperation = "source-over";
                  ctx.strokeStyle = this.color;
                  ctx.lineWidth = 30;
                  //paint.history.arr.push({ X: this.X, Y: this.Y, x: x, y: y, color: this.color, draw: true });
                  paint.history.arr.push({ X: x, Y: y, x: x+1, y: y+1, color: this.color, draw: true });
                }
                
                ctx.lineTo(x+1, y+1);
                ctx.stroke();

                paint.history.list.push(paint.history.arr);
                paint.history.arr = [];
                console.log(paint.history.list);
              }
              paint.history.off = false;
            }
          });
          canvas.on(moveEventType, function(e) {
            var x = e.clientX + (window.pageXOffset || body.scrollLeft || 0) - canvas.offset().left;
            var y = e.clientY + (window.pageYOffset || body.scrollTop || 0) - canvas.offset().top;
            
            if(x < 5 || x > 1465 || y < 5 || y > 710){
              this.down = false;
              if (paint.draw_active == true || paint.eraser_active == true) {
                if(paint.history.off){
                  paint.history.off = false;
                  paint.history.list.push(paint.history.arr);
                  paint.history.step++;
                  paint.history.arr = [];
                  console.log(paint.history.list);
                  console.log(paint.history.step);
                }else{
                  paint.history.off = false;
                  // paint.history.list.push(paint.history.arr);
                  // paint.history.step++;
                  paint.history.arr = [];
                  console.log(paint.history.list);
                  console.log(paint.history.step);
                }
              }
            }
            if(this.down) {
              paint.history.off = true;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(this.X, this.Y);

              var historyObj = new Object();
              if (paint.eraser_active == true) {
                ctx.globalCompositeOperation = "destination-out";
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.lineWidth = 60;
                historyObj = { X: this.X, Y: this.Y, x: x, y: y, color: "rgba(0,0,0,1)", draw: false };
              }
              if (paint.draw_active == true) {
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 30;
                historyObj = { X: this.X, Y: this.Y, x: x, y: y, color: this.color, draw: true };
              }              
              ctx.lineTo(x,y);
              ctx.stroke();
              
              
              
              paint.history.arr.push(historyObj);

              this.X = x;
              this.Y = y;
            }
          });  
        };

        paint.draw(ctx);
        
        $('#clear').bind(startEventType, function(){
          paint.clear();
          $('.b-paint-color__item').removeClass('b-paint-control_curent_yes');
          $('.b-paint-color').removeClass('b-paint-color_show');
          setTimeout(function(){$('.b-paint-color').css('height', 0)}, 200);
          $('#draw').removeClass('b-paint-control__button_active_true');
          $('.b-paint-control__draw').removeClass('b-paint-control__draw_color_' + paint.color);
          paint.color = 'c3c3c3';
          $('.b-paint-control__draw').addClass('b-paint-control__draw_color_' + paint.color);
          $('#eraser').removeClass('b-paint-control__button_active_true');
          paint.active();
        });
        
        $("#draw").bind(startEventType, function(){
          paint.eraser_active = false;
          $('#eraser').removeClass('b-paint-control__button_active_true');
          if (paint.control){
            if(paint.draw_active){
              $(this).removeClass('b-paint-control__button_active_true');
              paint.draw_active = false;
            }else{
              $('.b-paint-color').css('height', '375px')
              $('.b-paint-color').addClass('b-paint-color_show');
            }  
          }else{
            
            $('.b-paint-color').css('height', '375px')
            $('.b-paint-color').addClass('b-paint-color_show');
          }
        });

        $('#eraser').bind(startEventType, function(){
          paint.draw_active = false;
          $('#draw').removeClass('b-paint-control__button_active_true');
          $('.b-paint-color').removeClass('b-paint-color_show');
          setTimeout(function(){$('.b-paint-color').css('height', 0)}, 200);
          if(paint.eraser_active){
            paint.eraser_active = false;
            $(this).removeClass('b-paint-control__button_active_true');
          }else{
            paint.eraser_active = true;
            $('#draw').removeClass('b-paint-control__button_active_true');
            $(this).addClass('b-paint-control__button_active_true');  
          }
          console.log(paint.eraser_active);
        });

        $('#undo').bind(startEventType, function(){
          paint.history.undo();
        });

        $('.b-paint-color__item').bind(clickEventType, function(){
          if(!paint.control){
            paint.active();
          }
          $('.b-paint-color__item').removeClass('b-paint-control_curent_yes');
          $(this).addClass('b-paint-control_curent_yes');
          $('.b-paint-control__draw').removeClass('b-paint-control__draw_color_' + paint.color);
          paint.color = $(this).data('color');
          $('.b-paint-control__draw').addClass('b-paint-control__draw_color_' + paint.color);
          paint.draw_active = true;
          

          $('.b-paint-color').removeClass('b-paint-color_show');
          setTimeout(function(){$('.b-paint-color').css('height', 0)}, 200);
          $('#draw').addClass('b-paint-control__button_active_true');
          return false;
        });

    }

  }

});
