import type { Metadata } from "next";
import { RatesPage } from "./rates-page";

export const metadata: Metadata = {
  title: "Live Rates",
};

export default function Rates() {
  return <RatesPage />;
}
