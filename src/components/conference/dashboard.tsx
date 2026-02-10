"use client";

import {
  Bell,
  CalendarDays,
  ChevronRight,
  Globe2,
  Radio,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useConferenceFeed } from "@/hooks/use-conference-feed";
import type { Conference } from "@/types/conference";
import { cn } from "@/lib/utils";

export function ConferenceDashboard() {
  const {
    categories,
    category,
    setCategory,
    conferences,
    articles,
    isLoading,
  } = useConferenceFeed();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-6 pt-5 md:gap-8 md:px-6 lg:px-8">
        {/* 상단 네비게이션 (상태바 + 헤더 느낌) */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-foreground/60">
              오늘의 발견
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              IT 인사이트 &amp; 컨퍼런스
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-none bg-muted"
            >
              <Globe2 className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-none bg-muted"
            >
              <Bell className="size-4" />
            </Button>
          </div>
        </header>

        {/* 상단 탭 (최신 / 트렌딩 / 토픽 / 팟캐스트) */}
        <section className="flex flex-col gap-3 rounded-3xl bg-muted px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground/80">
              오늘의 IT 뉴스
            </p>
            <button className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              더 많은 아티클
              <ChevronRight className="size-3" />
            </button>
          </div>
          <div className="inline-flex gap-2 rounded-full bg-background/80 p-1 text-xs font-semibold">
            <NewsTab label="최신" active />
            <NewsTab label="트렌딩" />
            <NewsTab label="토픽" />
            <NewsTab label="팟캐스트" />
          </div>
        </section>

        {/* 메인 콘텐츠: 모바일에서는 세로, 데스크탑에서는 2컬럼 */}
        <section className="grid gap-5 md:grid-cols-[1.7fr,1.3fr]">
          {/* 좌측: IT 뉴스 피드 (Latest + Trending 섹션 구조) */}
          <div className="space-y-4">
            {/* Trending 섹션 */}
            <Card className="bg-muted">
              <CardHeader className="mb-1">
                <CardTitle className="text-base font-semibold">
                  트렌딩 인사이트
                </CardTitle>
                <CardDescription className="text-xs">
                  지금 가장 많이 읽히는 프론트엔드, 백엔드, AI 관련 글입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {articles.slice(0, 2).map((article) => (
                  <ArticleRow key={article.id} article={article} variant="hero" />
                ))}
              </CardContent>
            </Card>

            {/* Latest 섹션 */}
            <Card className="bg-background border border-muted">
              <CardHeader className="mb-1">
                <CardTitle className="text-base font-semibold">
                  최신 아티클
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {articles.map((article) => (
                  <ArticleRow key={article.id} article={article} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 우측: 컨퍼런스 일정 (Conference_Card 느낌) */}
          <div className="space-y-3">
            <Card className="bg-muted">
              <CardHeader className="mb-1 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    다가오는 컨퍼런스
                  </CardTitle>
                  <CardDescription className="text-xs">
                    FE, BE, AI 트랙별로 오늘의 발견과 연결된 행사를 모았습니다.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-none bg-background text-[11px]"
                >
                  전체 보기
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading && (
                  <p className="text-xs text-foreground/60">
                    컨퍼런스 정보를 불러오는 중입니다...
                  </p>
                )}
                {!isLoading &&
                  conferences.map((conf) => (
                    <ConferenceCard key={conf.id} conference={conf} />
                  ))}
              </CardContent>
            </Card>

            {/* 하단: 팟캐스트/세션 추천 블록 */}
            <Card className="bg-primary text-white">
              <CardContent className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/15">
                  <Radio className="size-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-medium text-white/80">
                    팟캐스트
                  </p>
                  <p className="text-sm font-semibold">
                    최신 AI &amp; FE 컨퍼런스 세션 다시 듣기
                  </p>
                </div>
                <Sparkles className="size-4 text-white/80" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

type ArticleRowProps = {
  article: ReturnType<typeof useConferenceFeed>["articles"][number];
  variant?: "default" | "hero";
};

function ArticleRow({ article, variant = "default" }: ArticleRowProps) {
  const isHero = variant === "hero";
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl bg-background px-3 py-3",
        isHero && "border border-primary/10 shadow-sm"
      )}
    >
      <div className="flex-1 space-y-1">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wide text-primary",
            "max-w-[12rem] truncate"
          )}
        >
          {article.category}
        </p>
        <p
          className={cn(
            "line-clamp-2 text-sm font-semibold text-foreground",
            isHero && "text-[15px]"
          )}
        >
          {article.title}
        </p>
        <p className="text-[11px] text-foreground/60">
          {article.source} · {article.publishedAt} · 약{" "}
          {article.readingTimeMinutes}분
        </p>
      </div>
      {isHero && (
        <div className="hidden h-16 w-16 rounded-2xl bg-muted md:block" />
      )}
    </div>
  );
}

function NewsTab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full px-3 py-1 text-xs",
        active
          ? "bg-primary text-white shadow-sm"
          : "text-foreground/60 hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}

function ConferenceCard({ conference }: { conference: Conference }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-background px-3 py-3 text-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-[11px] font-semibold text-foreground/70">
        {conference.category}
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {conference.title}
        </p>
        <p className="text-[11px] text-foreground/60">
          {conference.organizer} · {conference.location} · {conference.mode}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground/60">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
            <CalendarDays className="size-3" />
            {conference.date} · {conference.startTime}–{conference.endTime}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
            {conference.level}
          </span>
        </div>
      </div>
    </div>
  );
}

