import {useNavigate, useSearch} from "@tanstack/react-router";
import type {Topic} from "@/lib/catalog/types";
import {TOPIC_LABELS} from "@/lib/content/topics";
import type {UntrustedRecord, UntrustedValue} from "@/lib/untrusted";

const isTopic = (value: UntrustedValue): value is Topic => typeof value === "string" && value in TOPIC_LABELS;

/** Shared ?topic= parser — unknown values are ignored (treated as All). */
export function validateLearnSearch(search: UntrustedRecord) {
  return {topic: isTopic(search.topic) ? search.topic : undefined};
}

export function useLearnTopic(): {topic: Topic | null; setTopic: (topic: Topic | null) => void} {
  const search = useSearch({strict: false}) as {topic?: string};
  const navigate = useNavigate();
  const topic = isTopic(search.topic) ? search.topic : null;
  const setTopic = (next: Topic | null) => {
    void navigate({to: ".", replace: true, search: (prev) => ({...prev, topic: next ?? undefined})});
  };
  return {topic, setTopic};
}
