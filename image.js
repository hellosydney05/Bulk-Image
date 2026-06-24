let processedImages = [];

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("upload");

// Drag & Drop
dropArea.addEventListener("dragover", e => {
  e.preventDefault();
  dropArea.style.background = "rgba(255,255,255,0.2)";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.background = "transparent";
});

dropArea.addEventListener("drop", e => {
  e.preventDefault();
  fileInput.files = e.dataTransfer.files;
});

function processImages() {
  const files = fileInput.files;
  const preview = document.getElementById("preview");
  preview.innerHTML = "";
  processedImages = [];

  const width = document.getElementById("width").value;
  const height = document.getElementById("height").value;
  const padding = document.getElementById("padding").value || 0;
  const margin = document.getElementById("margin").value || 0;
  const rotate = document.getElementById("rotate").value || 0;
  const bgcolor = document.getElementById("bgcolor").value || "#ffffff";

  Array.from(files).forEach(file => {
    const reader = new FileReader();

    reader.onload = function(e) {
      const img = new Image();
      img.src = e.target.result;

      img.onload = function() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width || img.width;
        canvas.height = height || img.height;

        ctx.fillStyle = bgcolor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const pad = (padding / 100) * canvas.width;
        const mar = (margin / 100) * canvas.width;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotate * Math.PI) / 180);

        ctx.drawImage(
          img,
          -canvas.width / 2 + pad + mar,
          -canvas.height / 2 + pad + mar,
          canvas.width - (pad + mar) * 2,
          canvas.height - (pad + mar) * 2
        );

        const dataUrl = canvas.toDataURL("image/png");
        processedImages.push(dataUrl);

        const previewImg = document.createElement("img");
        previewImg.src = dataUrl;
        preview.appendChild(previewImg);
      };
    };

    reader.readAsDataURL(file);
  });
}

function downloadZip() {
  const zip = new JSZip();

  processedImages.forEach((img, i) => {
    zip.file(`image_${i}.png`, img.split(",")[1], { base64: true });
  });

  zip.generateAsync({ type: "blob" }).then(content => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "images.zip";
    a.click();
  });
}