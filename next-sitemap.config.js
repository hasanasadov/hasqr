/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://asadov.site",
  generateRobotsTxt: true, // robots.txt faylını avtomatik yaradır
  sitemapSize: 5000, // sitemap faylında maksimal URL sayı, default 5000
  changefreq: "daily", // axtarış motorlarına URL-lərin nə vaxt dəyişə biləcəyini bildirir
  priority: 0.7, // URL-lərin önəm səviyyəsi (0-1 arası)
  exclude: ["/secret-page", "/admin/*"], // sitemapdan URL-ləri çıxartmaq üçün
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", disallow: ["/secret-page"] },
    ],
    additionalSitemaps: [
      "https://asadov.site/my-custom-sitemap-1.xml",
      "https://asadov.site/my-custom-sitemap-2.xml",
    ],
  },
  // transform: async (config, url) => {
  //   // URL-ləri fərdiləşdirmək üçün istifadə olunur
  //   return {
  //     loc: url, // URL
  //     changefreq: 'weekly',
  //     priority: 0.8,
  //     lastmod: new Date().toISOString(),
  //   }
  // },
};
