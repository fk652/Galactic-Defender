import Game from "./game";

class GameView {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.game = new Game(canvas);
    this.game.bindStartHandler();

    const img = new Image();
    // User Variables - customize these to change the image being scrolled, its
    // direction, and the speed.
    img.src = "src/assets/game_background.png";
    const canvasXSize = 700;
    const canvasYSize = 550;
    const speed = 30; // lower is faster
    const scale = 1.05;
    const y = 0; // vertical offset
  
    // Main program
    const dx = 0.75;
    let imgW;
    let imgH;
    let x = 0;
    let clearX;
    let clearY;
  
    img.onload = () => {
      imgW = img.width * scale;
      imgH = img.height * scale;
  
      if (imgW > canvasXSize) {
        // Image larger than canvas
        x = canvasXSize - imgW;
      }
  
      // Check if image dimension is larger than canvas
      clearX = Math.max(imgW, canvasXSize);
      clearY = Math.max(imgH, canvasYSize);
  
      // Set refresh rate
      return setInterval(draw, speed);
    };

    function draw() {
      ctx.clearRect(0, 0, clearX, clearY); // clear the canvas
  
      // If image is <= canvas size
      if (imgW <= canvasXSize) {
        // Reset, start from beginning
        if (x > canvasXSize) {
          x = -imgW + x;
        }
  
        // Draw additional image1
        if (x > 0) {
          ctx.drawImage(img, -imgW + x, y, imgW, imgH);
        }
  
        // Draw additional image2
        if (x - imgW > 0) {
          ctx.drawImage(img, -imgW * 2 + x, y, imgW, imgH);
        }
      } else {
        // Image is > canvas size
        // Reset, start from beginning
        if (x > canvasXSize) {
          x = canvasXSize - imgW;
        }
  
        // Draw additional image
        if (x > canvasXSize - imgW) {
          ctx.drawImage(img, x - imgW + 1, y, imgW, imgH);
        }
      }
  
      // Draw image
      ctx.drawImage(img, x, y, imgW, imgH);
  
      // Amount to move
      x += dx;
    }

    this.start();
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    // always draw moving background here?
    // this.drawBackground(this.ctx);

    if (this.game.startScreen || this.game.gameOver || this.game.win) {
      this.game.drawStartWinGameOver(this.ctx);
    } else {
      const timeDelta = time - this.lastTime;
      this.game.step(timeDelta);
      this.game.draw(this.ctx);
    }

    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }

  // drawBackground(ctx) {
    // const img = new Image();
  
    // // User Variables - customize these to change the image being scrolled, its
    // // direction, and the speed.
    // img.src = "src/assets/game_background.png";
    // const canvasXSize = 600;
    // const canvasYSize = 600;
    // const speed = 30; // lower is faster
    // const scale = 1.05;
    // const y = -4.5; // vertical offset
  
    // // Main program
    // const dx = 0.75;
    // let imgW;
    // let imgH;
    // let x = 0;
    // let clearX;
    // let clearY;
    // let ctx;
  
    // img.onload = () => {
    //   imgW = img.width * scale;
    //   imgH = img.height * scale;
  
    //   if (imgW > canvasXSize) {
    //     // Image larger than canvas
    //     x = canvasXSize - imgW;
    //   }
  
    //   // Check if image dimension is larger than canvas
    //   clearX = Math.max(imgW, canvasXSize);
    //   clearY = Math.max(imgH, canvasYSize);
  
    //   // Get canvas context
    //   ctx = document.getElementById("canvas").getContext("2d");
  
    //   // Set refresh rate
    //   return setInterval(draw, speed);
    // };
  
  //   function draw() {
  //     ctx.clearRect(0, 0, clearX, clearY); // clear the canvas
  
  //     // If image is <= canvas size
  //     if (imgW <= canvasXSize) {
  //       // Reset, start from beginning
  //       if (x > canvasXSize) {
  //         x = -imgW + x;
  //       }
  
  //       // Draw additional image1
  //       if (x > 0) {
  //         ctx.drawImage(img, -imgW + x, y, imgW, imgH);
  //       }
  
  //       // Draw additional image2
  //       if (x - imgW > 0) {
  //         ctx.drawImage(img, -imgW * 2 + x, y, imgW, imgH);
  //       }
  //     } else {
  //       // Image is > canvas size
  //       // Reset, start from beginning
  //       if (x > canvasXSize) {
  //         x = canvasXSize - imgW;
  //       }
  
  //       // Draw additional image
  //       if (x > canvasXSize - imgW) {
  //         ctx.drawImage(img, x - imgW + 1, y, imgW, imgH);
  //       }
  //     }
  
  //     // Draw image
  //     ctx.drawImage(img, x, y, imgW, imgH);
  
  //     // Amount to move
  //     x += dx;
  //   }
  // }
}

export default GameView;