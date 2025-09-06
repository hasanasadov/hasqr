import { metaKeywords } from "@/constants/metadata";

export default function Head() {
  return (
    <>
      <title>Website</title>
      <meta
        name="google-site-verification"
        content="google-verification-code"
      />
      {/* <meta name="description" content="Next.js Developer Personal Website" /> */}
      <meta name="keywords" content={metaKeywords.join(", ")} />
      {/* <link rel="canonical" href="https://asadov.site" /> */}
      <link rel="icon" href="/favicon.ico" />
      {/* <meta name="author" content="Hasanali Asadov" /> */}
      <meta property="og:title" content="Website" />
      {/* <meta property="og:description" content="Hasanali Portfolio" /> */}
      {/* <meta property="og:url" content="https://asadov.site" /> */}
      <meta property="og:type" content="website" />
    </>
  );
}
