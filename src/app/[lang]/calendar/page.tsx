import { Metadata } from "next";
import ActivityCalendar from "@/components/ActivityCalendar";
import Localisation from "@/localisation/calendar.json";

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

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ lang: "fr" | "es" }>;
}) {
  const { lang } = await params;
  return <ActivityCalendar lang={lang} />;
}
