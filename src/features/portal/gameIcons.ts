import { Earth, Store, LampDesk, Rocket, Waves, type LucideIcon } from "lucide-react";
import type { GameSlug } from "@/lib/modules";

export const GAME_ICONS: Record<GameSlug, LucideIcon> = {
  "chien-co": Rocket,
  "quy-dao": Earth,
  "tau-ngam": Waves,
  "duong-sang-lang-coi": LampDesk,
  "lang-coi-mo-hoi": Store,
};
