import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import "./App.css";

const App = () => {
  const [image, setImage] = useState({
    crop: { aspect: 1 / 1 },
    src: "",
    croppedImageUrl: ""
  });
  const imageRef = useRef("");

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage({ ...image, src: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = image => {
    imageRef.current = image;
  };

  const onCropComplete = crop => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async crop => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        "newFile.jpeg"
      );
      setImage({ ...image, croppedImageUrl });
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        resolve(window.URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  return (
    <>
      <div>
        <input type="file" onChange={onSelectFile} />
      </div>
      <ReactCrop
        src={image.src}
        crop={image.crop}
        ruleOfThirds
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
        onChange={newCrop => setImage({ ...image, crop: newCrop })}
      />
      <br/>
      {image.croppedImageUrl && (
        <img
          alt="Crop"
          style={{ maxWidth: "100%" }}
          src={image.croppedImageUrl}
        />
      )}
    </>
  );
};

export default App;

