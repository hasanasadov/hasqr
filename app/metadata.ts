import { metaKeywords } from "@/constants/metadata";

export const metadata = {
  title: "Hasanali Asadov Portfolio",
  description: "Next.js developer portfolio website",
  keywords: metaKeywords,
  authors: [{ name: "Hasanali Asadov" }],
  openGraph: {
    title: "Hasanali Asadov Portfolio",
    description: "Developer portfolio website",
    url: "https://hasanali.site",
    type: "website",
    images: [
      {
        url: "https://hasanali.site/1.png",
        width: 1200,
        height: 630,
        alt: "Hasanali Asadov Portfolio",
      },
    ],
  },
  // sosial media, favicon, open graph və s. metadata da əlavə oluna bilər
};
