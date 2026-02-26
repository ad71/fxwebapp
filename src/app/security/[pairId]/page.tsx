import { notFound } from "next/navigation";
import { CURRENCY_PAIRS } from "../../../lib/rates/currency-pairs";
import { SecurityPage } from "./security-page";

interface Props {
  params: Promise<{ pairId: string }>;
}

export default async function SecurityRoute({ params }: Props) {
  const { pairId } = await params;

  const pair = CURRENCY_PAIRS.find((p) => p.id === pairId);
  if (!pair) {
    notFound();
  }

  return <SecurityPage pairId={pairId} />;
}
