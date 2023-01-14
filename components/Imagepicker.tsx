/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/styles/Home.module.css";

const ImagePicker: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [userName, setUserName] = useState("");
  const [images, setImages] = useState<string[]>([]);

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

  const handleImageSelection = (image: string) => {
    setSelectedImage(image);
    setCurrentImage(image);
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
          <img className={styles.picture} key={i} src={image} onClick={() => handleImageSelection(image)} />
        ))}
      </div>
      <div className={styles.currentImage}>{currentImage && <img src={currentImage} />}</div>
      <div className={styles.searchInput}>
        <input type="text" placeholder="Enter your name" onChange={handleUserName} className={styles.inputbox} />
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default ImagePicker;
