const urlInput = document.querySelector("#image__url");
const urlBtn = document.querySelector(".url__upload");
const localBtn = document.querySelector("#local__upload");
const saveBtn = document.querySelector(".save__button");

const invertFilterBtn = document.querySelector(".black__filter");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// 이미지 크기 잘리지않도록 그려내는 함수
function drawImageData(image) {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  console.log(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// download image
function downloadImage() {
  const dataURL = canvas.toDataURL("image/png");
  saveBtn.href = dataURL;
}

// delete function
function deleteBeforeImage() {
  if (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
}

localBtn.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const fileReader = new FileReader();

  fileReader.addEventListener("load", (e) => {
    deleteBeforeImage();
    const image = new Image();
    image.src = e.target.result;
    image.crossOrigin = "Anonymous";
    image.onload = function (e) {
      drawImageData(image);
    };
  });
  fileReader.readAsDataURL(file);
});

urlBtn.addEventListener("click", () => {
  deleteBeforeImage();
  const imgPath = urlInput.value;

  const image = new Image();
  image.src = imgPath;
  image.crossOrigin = "Anonymous";
  image.onload = function (e) {
    drawImageData(image);
  };

  urlInput.value = "";
  urlInput.focus();
});

saveBtn.addEventListener("click", downloadImage);

// Various Filter

function invertFilter(pixels) {
  let d = pixels.data;
  for (let i = 0; i < pixels.data.length; i += 4) {
    d[i] = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2];
    d[i + 3] = 255;
  }
  return pixels;
}

function sketchedImage() {
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const filteredData = invertFilter(pixels);
  ctx.putImageData(filteredData, 0, 0);
}

invertFilterBtn.addEventListener("click", (e) => {
  sketchedImage();
});
