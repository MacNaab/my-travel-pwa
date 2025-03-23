/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, useMap } from "react-leaflet";
import { Marker } from "@adamscybot/react-leaflet-component-marker";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  House,
  MessageCircleHeart,
  PlaneTakeoff,
  Locate,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import locations from "@/data/locations.json";
import Localisation from "@/localisation/map.json";

import SASPAS from "@/data/saspas.json";
const colors = [
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
];

const filterEffect =
  "drop-shadow(2px 0 0 antiquewhite) drop-shadow(-2px 0 0 antiquewhite) drop-shadow(0 2px 0 antiquewhite) drop-shadow(0 -2px 0 antiquewhite) drop-shadow(1px 0 0 antiquewhite) drop-shadow(-1px 0 0 antiquewhite) drop-shadow(0 -1px 0 antiquewhite) drop-shadow(0 1px 0 antiquewhite)";

// Composant interne pour accéder à l'instance de la carte
function RecenterControl({
  center,
  zoom,
  lang,
}: {
  center: [number, number];
  zoom: number;
  lang: "fr" | "es";
}) {
  const map = useMap();

  const handleRecenter = () => {
    map.setView(center, zoom);
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-white hover:bg-gray-100 dark:hover:bg-gray-200 border-gray-300 cursor-pointer"
          onClick={handleRecenter}
          title={Localisation[lang as keyof typeof Localisation].cardHover}
        >
          <Locate size={18} className="text-black" />
        </Button>
      </div>
    </div>
  );
}

export default function MapComponent({ lang }: { lang: "fr" | "es" }) {
  const [mounted, setMounted] = useState(false);
  const [innerWidth, setinnerWidth] = useState(1080);

  // Définir les coordonnées du centre et le niveau de zoom
  const CENTER: [number, number] = [49.5, 3]; // Centre de la France
  const ZOOM = 8;

  // Hydratation côté client uniquement
  useEffect(() => {
    setinnerWidth(window.innerWidth);
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-md"></div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{Localisation[lang].title}</h1>
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>{Localisation[lang].cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full rounded-md overflow-hidden">
            <MapContainer
              center={CENTER}
              zoom={ZOOM}
              style={{ height: "100%", width: "100%" }}
            >
              {/* Utilisation de Open Street Map (gratuit) */}
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Bouton de recentrage */}
              <RecenterControl center={CENTER} zoom={ZOOM} lang={lang} />

              {/* Boucle sur les lieux pour afficher les markers */}
              {locations.map((location) => {
                let MyIcon = (
                  <MessageCircleHeart
                    size={30}
                    color="darkblue"
                    style={{ filter: filterEffect }}
                  />
                );
                if (location.id === "hombleux" || location.id === "estrees") {
                  MyIcon = (
                    <House
                      size={30}
                      color={
                        location.id === "hombleux" ? "darkorange" : "darkgreen"
                      }
                      style={{ filter: filterEffect }}
                    />
                  );
                }
                if (location.id === "aeroport") {
                  MyIcon = (
                    <PlaneTakeoff
                      size={30}
                      color="red"
                      style={{ filter: filterEffect }}
                    />
                  );
                }
                return (
                  <Marker
                    key={location.id}
                    position={location.coordinates as [number, number]}
                    icon={MyIcon}
                  >
                    <Popup maxWidth={innerWidth - 200}>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-bold text-lg">{location.name}</h3>
                        <div className="flex gap-2 w-full items-center">
                          {location.image ? (
                            <img
                              src={location.image}
                              alt={location.name}
                              height={"auto"}
                              className="w-1/2 object-contain rounded-md"
                            />
                          ) : null}
                          <p className="text-justify">
                            {location[lang]?.description}
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              <Marker
                position={SASPAS.home.coordinates as [number, number]}
                icon={
                  <House
                    size={30}
                    color="darkgreen"
                    style={{ filter: filterEffect }}
                  />
                }
              >
                <Popup maxWidth={innerWidth - 200}>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">{SASPAS.home.name}</h3>
                  </div>
                </Popup>
              </Marker>

              {SASPAS.groups.map((group, index) => {
                const color = colors[index % colors.length];
                return (
                  <>
                    {group.map((saspas) => {
                      return (
                        <Marker
                          key={saspas.name + index}
                          position={saspas.coordinates as [number, number]}
                          icon={
                            <Activity
                              size={30}
                              color={color}
                              style={{ filter: filterEffect }}
                            />
                          }
                        >
                          <Popup maxWidth={innerWidth - 200}>
                            <div className="flex flex-col gap-2">
                              <h3 className="font-bold text-lg">
                                {saspas.name}
                              </h3>
                              <div className="flex gap-2 w-full items-center">
                                {`Groupe #${index + 1}`}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </>
                );
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
