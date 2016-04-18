var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"); // create canvas element and get context

var preloader = { // holds methods for creating image elements
  path: "images/",
  srcs: ["1.jpg", "2.jpg", "3.jpg"],
  createImage: function(i, src) {
    var $img = $("<img />", { src: this.path + src }); // set img src attribute
    $img.on("load", manipulator.process.bind(manipulator));
  },
  run: function() {
    $.each(this.srcs, this.createImage.bind(this));
  }
};

var manipulator = { // methods for manipulating images
  drawImage: function(img) {
    canvas.width = img.width; // set canvas width and height to img width and height
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0); // draw image at point 0, 0
  },
  getData: function() {
    return ctx.getImageData(0, 0, canvas.width, canvas.height); // returns ImageData object
  },
  convertToGrayscale: function() {
    var image_data = this.getData(),
        gray_data;

    for (var i = 0, len = image_data.data.length; i < len; i += 4) {
      // convert red, green, and blue channel values to grayscale values by multiplying them by respective weights
      gray_data = image_data.data[i] * 0.3086 + image_data.data[i + 1] * 0.6094 + image_data.data[i + 2] * 0.0820;
      // set red, green and blue values to grayscale value
      image_data.data[i] = gray_data;
      image_data.data[i + 1] = gray_data;
      image_data.data[i + 2] = gray_data;
    }
    ctx.putImageData(image_data, 0, 0); // write ImageData object back to the context
  },
  writeImage: function() { // create an image, update its src attribute to data from canvas
    var img = document.createElement("img");
    img.src = canvas.toDataURL();
    $(document.body).append(img);
  },
  process: function(e) {
    var img = e.target;
    this.drawImage(img);
    this.convertToGrayscale();
    this.writeImage();
  }
};

$(preloader.run.bind(preloader)); // bind preloader object as the context
