import { Stats } from "../enums/Stats";

export default function getStatLabel(statKey: string): string {
  return Stats[statKey as keyof typeof Stats] ?? statKey;
}
