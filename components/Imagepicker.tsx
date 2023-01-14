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
      ctx.drawImage(img, 0, 0);
      ctx.font = "32px sans-serif";
      ctx.fillStyle = "black";
      ctx.fillText("Thank You", 10, 40);
      ctx.fillText(userName, 10, 80);
    };
  };

  const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleDownload = () => {
    if (!selectedImage || !userName) {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg");
    link.setAttribute("download", `${userName}.jpeg`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={styles.imagepicker}>
      <div className={styles.centered}>
        {images.map((image, i) => (
          <img className={styles.picture} key={i} src={image} onClick={() => handleImageSelection(image)} />
        ))}
      </div>
      <div className={styles.currentImage}>
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
