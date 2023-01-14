/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/styles/Home.module.css";

const ImagePicker: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [userName, setUserName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const canvasRef = React.createRef<HTMLCanvasElement>();

  useEffect(() => {
    const generateImages = async () => {
      const images = await Promise.all(
        Array.from({ length: 4 }, async (_, i) => {
          const res = await axios.get(`https://source.unsplash.com/random/300x300?sig=${i}`);
          return res.request.responseURL;
        })
      );
      setImages(images);
    };
    generateImages();
  }, []);

  const handleImageSelection = async (image: string) => {
    setSelectedImage(image);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "white";
      ctx.fillText("Thank You", canvas.width / 2, canvas.height / 4);
      ctx.textBaseline = "bottom";
      ctx.fillText(userName, canvas.width / 2, (canvas.height / 4) * 3);
    };
  };

  const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleDownload = async () => {
    if (!selectedImage || !userName) {
      return;
    }
    const response = await axios.get(selectedImage, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${userName}.jpeg`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={styles.imagepicker}>
      <div className={styles.centered}>
        {images.map((image, i) => (
          <img crossOrigin="anonymous" className={styles.picture} key={i} src={image} onClick={() => handleImageSelection(image)} />
        ))}
      </div>
      <div className={`${styles.currentImage} ${styles.aspectRatio}`}>
        <canvas ref={canvasRef} width={400} height={500} />
      </div>
      <div className={styles.searchInput}>
        <input type="text" placeholder="Enter your name" onChange={handleUserName} className={styles.inputbox} />
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};
export default ImagePicker;
