import type {Topic} from "@/lib/catalog/types";

// Display labels for article/video topics (shared with change 14's hub).
export const TOPIC_LABELS: Record<Topic, string> = {
  digestion: "Digestion",
  energy: "Energy",
  immunity: "Immunity",
  "heart-and-circulation": "Heart & circulation",
  women: "Women's wellness",
  men: "Men's wellness",
  weight: "Weight",
  "everyday-wellness": "Everyday wellness",
};

export function topicLabel(topic: Topic): string {
  return TOPIC_LABELS[topic];
}
