import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { ValentinesApp } from "../valentinesApp/valentinesApp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ultimate Valentines Test" },
    { name: "description", content: "This is the ultimate test!" },
  ];
}

export default function Home() {
  // return <Welcome />;
  return <ValentinesApp />
}
