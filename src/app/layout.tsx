import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { AppLayout } from "@/components/AppLayout";
import { JsonLd } from "@/components/JsonLd";

import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const SITE_URL = "https://r-h-y.jp";
const SITE_NAME = "合同会社RHY";
const TITLE = "合同会社RHY | 大阪の不動産売買・賃貸仲介";
const DESCRIPTION =
	"合同会社RHYは大阪市東成区を拠点に不動産の売買・賃貸仲介、コンサルティングを行っております。お客様一人ひとりのご要望に丁寧に寄り添い、最適な物件をご提案いたします。";
const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: TITLE,
		template: `%s | ${SITE_NAME}`,
	},
	description: DESCRIPTION,
	keywords: [
		"不動産",
		"不動産仲介",
		"売買仲介",
		"賃貸仲介",
		"大阪",
		"東成区",
		"深江北",
		"不動産コンサルティング",
		"合同会社RHY",
		"RHY",
		"物件探し",
		"マンション",
		"一戸建て",
		"土地",
		"賃貸",
	],
	authors: [{ name: SITE_NAME }],
	creator: SITE_NAME,
	publisher: SITE_NAME,
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "ja_JP",
		url: SITE_URL,
		siteName: SITE_NAME,
		title: TITLE,
		description: DESCRIPTION,
		images: [
			{
				url: OG_IMAGE,
				width: 1200,
				height: 630,
				alt: `${SITE_NAME} - 大阪の不動産売買・賃貸仲介`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: TITLE,
		description: DESCRIPTION,
		images: [OG_IMAGE],
	},
	alternates: {
		canonical: SITE_URL,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export const viewport: Viewport = {
	themeColor: "#1a2744",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<JsonLd />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppLayout>{children}</AppLayout>
				<Analytics />
			</body>
		</html>
	);
}
