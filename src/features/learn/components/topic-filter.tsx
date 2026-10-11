import type {Topic} from "@/lib/catalog/types";
import {TOPIC_LABELS} from "@/lib/content/topics";
import {ChipGroup} from "@/components/ui/chip-group";

interface TopicFilterProps {
  counts: {topic: Topic; count: number}[];
  /** Currently selected topic, or null for All. */
  value: Topic | null;
  onChange: (topic: Topic | null) => void;
}

// One chip per topic that has articles, in TOPIC_LABELS order (learn/topic-filter
// spec). Selecting updates ?topic= so the grid and video library re-filter.
export function TopicFilter({counts, value, onChange}: TopicFilterProps) {
  const countByTopic = new Map(counts.map((c) => [c.topic, c.count]));
  const options = [
    {value: "", label: "All"},
    ...(Object.keys(TOPIC_LABELS) as Topic[])
      .filter((topic) => countByTopic.has(topic))
      .map((topic) => ({value: topic, label: `${TOPIC_LABELS[topic]} (${countByTopic.get(topic)})`})),
  ];
  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar">
      <ChipGroup
        aria-label="Filter articles by topic"
        options={options}
        value={value ?? ""}
        onChange={(v) => onChange((v || null) as Topic | null)}
      />
    </div>
  );
}
