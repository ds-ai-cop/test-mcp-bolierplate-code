import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CONFERENCE_CATEGORIES,
  DUMMY_CONFERENCES,
  DUMMY_IT_ARTICLES,
} from "@/lib/conferences";
import type { ConferenceCategory } from "@/types/conference";

const QUERY_KEY = ["conference-feed"];

export function useConferenceFeed() {
  const [category, setCategory] = useState<ConferenceCategory>("All");

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      // 실제 환경에서는 여기서 API 호출
      return {
        conferences: DUMMY_CONFERENCES,
        articles: DUMMY_IT_ARTICLES,
      };
    },
  });

  const filteredConferences = useMemo(() => {
    if (!data) return [];
    if (category === "All") return data.conferences;
    return data.conferences.filter(
      (conf) => conf.category === category
    );
  }, [category, data]);

  const filteredArticles = useMemo(() => {
    if (!data) return [];
    if (category === "All") return data.articles;
    return data.articles.filter(
      (article) => article.category === category
    );
  }, [category, data]);

  return {
    categories: CONFERENCE_CATEGORIES,
    category,
    setCategory,
    conferences: filteredConferences,
    articles: filteredArticles,
    isLoading,
  };
}

