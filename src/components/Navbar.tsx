"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { Mx, Fr } from "@/icons";

const languages = {
  es: {
    name: "Español",
    icon: Mx,
  },
  fr: {
    name: "Français",
    icon: Fr,
  },
};

import Localisation from "@/localisation/base.json";

export function Navbar() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  const lang =
    (pathNames.length > 0 && pathNames[0] == "es") || pathNames[0] == "fr"
      ? pathNames[0]
      : "fr";
  const DropdownMenuIcon = languages[lang as keyof typeof languages].icon;

  return (
    <nav className="flex space-x-8 text-gray-900 dark:text-white">
      <Link
        href={`/${lang}/`}
        className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        {Localisation[lang as keyof typeof Localisation].map}
      </Link>
      <Link
        href={`/${lang}/calendar`}
        className="hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
      >
        {Localisation[lang as keyof typeof Localisation].calendar}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto cursor-pointer" asChild>
          <Button variant="outline">
            <div className="inline-flex items-center">
              <DropdownMenuIcon className="h-3.5 w-3.5 rounded-full me-2" />
              {languages[lang as keyof typeof languages].name}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(languages).map(([code, name]) => (
            <DropdownMenuItem key={code} className="cursor-pointer">
              <Link
                href={
                  pathNames.length > 0
                    ? `/${pathNames
                        .map((path, index) => `${index == 0 ? code : path}/`)
                        .join("")}`
                    : `/${code}`
                }
              >
                <div className="inline-flex items-center">
                  <name.icon className="h-3.5 w-3.5 rounded-full me-2" />
                  {name.name}
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ModeToggle />
    </nav>
  );
}

export function FootBar() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  const lang =
    (pathNames.length > 0 && pathNames[0] == "es") || pathNames[0] == "fr"
      ? pathNames[0]
      : "fr";
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {`${
          Localisation[lang as keyof typeof Localisation].footer
        } © ${new Date().getFullYear()}`}
      </p>
    </div>
  );
}
