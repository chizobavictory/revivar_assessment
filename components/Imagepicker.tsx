/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Jimp from "jimp/custom";
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
    // Download the selected image
    const response = await axios.get(selectedImage, { responseType: "arraybuffer" });
    // Create a new Jimp image from the downloaded data
    const image = await Jimp.read(new Buffer(response.data, "binary"));
    // Resize the image to 4:5 aspect ratio
    image.resize(Jimp.AUTO, 400);
    // Get the image's width and height
    const { width, height } = image.bitmap;
    // Add the "Thank you" text to the top of the image
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    image.print(font, 10, 10, "Thank you");
    // Add the user's name to the bottom of the image
    image.print(font, 10, height - 30, userName);
    // Convert the image to a data URL
    const imageData = await image.getBase64Async(Jimp.MIME_JPEG);
    // Create a new download link
    const link = document.createElement("a");
    link.href = imageData;
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
            {currentImage && <img src={currentImage} />}
            </div>
            <div className={styles.searchInput}>
            <input type="text" placeholder="Enter your name" onChange={handleUserName} className={styles.inputbox} />
            <button onClick={handleDownload}>Download</button>
            </div>
            </div>
            );
            };
            
            export default ImagePicker;