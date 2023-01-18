import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import ImagePicker from "@/components/Imagepicker";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Card Genuis</title>
        <meta name="description" content="Card creation website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <p>Select an image to create a card</p>
          <div>
            <a href="https://github.com/chizobavictory" target="_blank" rel="noopener noreferrer">
              Built By {"Chizoba Victory"}
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <ImagePicker />
        </div>
      </main>
    </>
  );
}
