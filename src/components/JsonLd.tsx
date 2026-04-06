/* サーバーコンポーネントとしてJSON-LDを出力（SEOクローラーが確実にパース可能） */

const SITE_URL = "https://r-h-y.jp";

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#organization`,
      name: "合同会社RHY",
      url: SITE_URL,
      logo: `${SITE_URL}/images/og-image.jpg`,
      image: `${SITE_URL}/images/building-exterior.jpg`,
      description:
        "合同会社RHYは大阪市東成区を拠点に不動産の売買・賃貸仲介、コンサルティングを行っております。",
      founder: {
        "@type": "Person",
        name: "鯰江 清裕",
        jobTitle: "代表取締役社長",
      },
      foundingDate: "2021-08-03",
      address: {
        "@type": "PostalAddress",
        postalCode: "537-0002",
        addressRegion: "大阪府",
        addressLocality: "大阪市東成区",
        streetAddress: "深江北一丁目3番5号 三好ビル306",
        addressCountry: "JP",
      },
      areaServed: {
        "@type": "City",
        name: "大阪市",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "不動産売買仲介",
            description:
              "マイホームの購入から投資用物件まで、不動産の売買をサポートいたします。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "不動産賃貸仲介",
            description:
              "お住まいやオフィス・店舗の賃貸物件をご紹介いたします。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "不動産コンサルティング",
            description:
              "資産活用や相続対策など、不動産に関するあらゆるご相談に対応いたします。",
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "合同会社RHY",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "ja",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "合同会社RHY | 大阪の不動産売買・賃貸仲介",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "ja",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: SITE_URL,
        },
      ],
    },
    /* サイトリンク表示を促進するSiteNavigationElement */
    {
      "@type": "SiteNavigationElement",
      name: "会社概要",
      description: "合同会社RHYの会社概要・沿革をご紹介します。",
      url: `${SITE_URL}/#about`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "事業内容",
      description: "売買仲介・賃貸仲介・不動産コンサルティングの事業内容をご紹介します。",
      url: `${SITE_URL}/#service`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "お知らせ",
      description: "合同会社RHYの最新のお知らせ・ニュースをお届けします。",
      url: `${SITE_URL}/#news`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "会社情報",
      description: "所在地・代表者・資本金などの会社情報をご確認いただけます。",
      url: `${SITE_URL}/#company`,
    },
    {
      "@type": "SiteNavigationElement",
      name: "お問い合わせ",
      description: "不動産に関するご相談・お問い合わせはこちらからお気軽にどうぞ。",
      url: `${SITE_URL}/#contact`,
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}
