const originalImages = document.querySelectorAll("#original_image");

 
  const displayImage = document.querySelector("#display_image");

 
  originalImages.forEach((originalImage, index) => {
    originalImage.addEventListener("mouseenter", () => {
      
      displayImage.src = originalImage.src;
    });
  });

  //////////////////////////////////////////////////////////////////
  var options = {
    width: 300,
    zoomWidth: 800,
    offset: {vertical: 0, horizontal: 100}
};
new ImageZoom(document.getElementById("img-container"), options);