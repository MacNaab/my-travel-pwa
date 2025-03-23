"use client";
import { useState } from "react";
import { format, isSunday } from "date-fns";
import { fr, es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import activities from "@/data/activities.json";
import locations from "@/data/locations.json";
import Localisation from "@/localisation/calendar.json";
import { Car, Dot, TrainFront } from "lucide-react";

// Types pour les données
type Activity = {
  id: string;
  title: string;
  location: string;
  time: string;
};

type LocationMap = {
  [key: string]: {
    name: string;
    description: string;
  };
};

// Jours fériés en France pour 2025
const holidays2025 = [
  new Date(2025, 3, 21), // Lundi de Pâques (21 avril 2025)
  //new Date(2025, 4, 1), // Fête du travail (1er mai 2025)
  //new Date(2025, 4, 8), // Victoire 1945 (8 mai 2025)
];

// Fonction pour vérifier si une date est un jour férié
const isHoliday = (date: Date): boolean => {
  return holidays2025.some(
    (holiday) =>
      holiday.getDate() === date.getDate() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getFullYear() === date.getFullYear()
  );
};

// Fonction pour vérifier si c'est le premier ou dernier jour de notre plage
const isFirstOrLastDay = (date: Date): boolean => {
  // 8 avril 2025
  const firstDay = new Date(2025, 3, 8);
  // 28 avril 2025
  const lastDay = new Date(2025, 3, 28);

  return (
    (date.getDate() === firstDay.getDate() &&
      date.getMonth() === firstDay.getMonth() &&
      date.getFullYear() === firstDay.getFullYear()) ||
    (date.getDate() === lastDay.getDate() &&
      date.getMonth() === lastDay.getMonth() &&
      date.getFullYear() === lastDay.getFullYear())
  );
};

export default function ActivityCalendar({ lang }: { lang: "fr" | "es" }) {
  // Créer une plage de dates du 8 au 28 avril 2025
  const fromDate = new Date(2025, 3, 8); // Avril est le mois 3 (0-indexé)
  const toDate = new Date(2025, 3, 28);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(fromDate);

  // Convertir les locations en map pour un accès facile
  const locationMap: LocationMap = locations.reduce((acc, loc) => {
    acc[loc.id] = { name: loc.name, description: loc[lang].description };
    return acc;
  }, {} as LocationMap);

  // Obtenir les activités pour la date sélectionnée
  const getActivitiesForDate = (date: Date | undefined) => {
    if (!date) return [];

    const dateStr = format(date, "dd-MM-yyyy");
    return (activities as { [key: string]: Activity[] })[dateStr] || [];
  };

  const selectedActivities = getActivitiesForDate(selectedDate);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{Localisation[lang].title}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>{Localisation[lang].cardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              fromDate={fromDate}
              toDate={toDate}
              locale={lang === "fr" ? fr : es}
              // Mettre en évidence les différents types de jours
              modifiers={{
                highlighted: Object.keys(activities).map(
                  (dateStr) => new Date(dateStr)
                ),
                sunday: (date) => isSunday(date),
                holiday: (date) => isHoliday(date),
                firstOrLastDay: (date) => isFirstOrLastDay(date),
              }}
              modifiersStyles={{
                highlighted: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                },
                sunday: {
                  backgroundColor: "rgba(252, 165, 165, 0.2)",
                  color: "#ef4444",
                },
                holiday: {
                  backgroundColor: "rgba(252, 165, 165, 0.2)",
                  color: "#ef4444",
                },
                firstOrLastDay: {
                  backgroundColor: "rgba(52, 211, 153, 0.2)",
                  fontWeight: "bold",
                  borderRadius: "25%",
                },
              }}
              classNames={{
                day_selected:
                  "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
              }}
              className="rounded-md border"
            />
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-200 mr-2"></div>
                <span>{Localisation[lang].card1}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
                <span>{Localisation[lang].card2}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `${Localisation[lang].activity} ${format(
                    selectedDate,
                    "dd MMMM yyyy",
                    {
                      locale: lang === "fr" ? fr : es,
                    }
                  )}`
                : Localisation[lang].noDate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedActivities.length > 0 ? (
              <div className="space-y-4">
                {selectedActivities.map((activity: Activity, index: number) => {
                  if (activity.id === "transport") {
                    const Icon =
                      activity.title === "Train" ? <TrainFront /> : <Car />;
                    return (
                      <div
                        key={activity.id + "_" + index}
                        className="flex justify-around items-center m-4"
                      >
                        <div className="flex">
                          <div className="flex items-end">
                            <Dot className="animate-bounce" />
                            <Dot className="animate-bounce" />
                          </div>
                          <div className="p-2">{Icon}</div>
                          <div className="flex items-end">
                            <Dot className="animate-bounce" />
                            <Dot className="animate-bounce" />
                          </div>
                        </div>
                        <div>{activity.time}</div>
                      </div>
                    );
                  }
                  return (
                    <Card
                      key={activity.id}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {locationMap[activity.location]?.name ||
                              "Lieu inconnu"}
                          </p>
                        </div>
                        <div className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                          {activity.time}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {Localisation[lang].noActivity}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
