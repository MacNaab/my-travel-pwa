import { Metadata } from "next";
import MapComponent from "@/components/MapComponent";
import Localisation from "@/localisation/map.json";

// Fonction pour générer les métadonnées dynamiquement
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "fr" | "es" }>;
}): Promise<Metadata> {
  // Utiliser les données de localisation en fonction de la langue
  const lang = (await params).lang as keyof typeof Localisation;

  return {
    title: Localisation[lang].metaTitle || Localisation[lang].title,
    description: Localisation[lang].metaDescription,
  };
}
export default async function MapPage({
  params,
}: {
  params: Promise<{ lang: "fr" | "es" }>;
}) {
  const { lang } = await params;
  return <MapComponent lang={lang} />;
}
