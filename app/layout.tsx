import type { Metadata, Viewport } from "next";
import "./globals.css";
import SkyProvider from "@/components/weather/SkyProvider";
import Sky from "@/components/weather/Sky";
import SkyControls from "@/components/weather/SkyControls";
import BottomBar from "@/components/weather/BottomBar";
import CityPager from "@/components/weather/CityPager";

export const metadata: Metadata = {
  title: "Kata Iturriaga — Product Designer",
  description:
    "Portfolio de diseño de producto: casos, procesos y trayectoria, contados como una app del tiempo.",
};

export const viewport: Viewport = {
  themeColor: "#0b1530",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full weather-body">
        <SkyProvider>
          <Sky />
          <SkyControls />
          <CityPager>{children}</CityPager>
          <BottomBar />
        </SkyProvider>
      </body>
    </html>
  );
}
