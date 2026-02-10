"use client";

import { CalendarDays, Cpu, Globe2, Brain, Network } from "lucide-react";
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

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  All: <Globe2 className="size-4" />,
  Frontend: <Cpu className="size-4" />,
  Backend: <Network className="size-4" />,
  AI: <Brain className="size-4" />,
  DevOps: <Globe2 className="size-4" />,
};

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
    <main className="min-h-screen px-4 py-10 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:gap-10">
        {/* Hero 영역 */}
        <section className="grid gap-6 lg:grid-cols-[1.6fr,1.2fr] lg:items-center">
          <div className="space-y-5">
            <p className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Task Management UI에서 영감 받은 IT 컨퍼런스 허브
            </p>
            <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
              IT 인사이트 &amp; 컨퍼런스를
              <br />
              한 번에 모아보는 플랫폼
            </h1>
            <p className="max-w-xl text-sm md:text-base text-foreground/75">
              FE, BE, AI, DevOps까지. 분산된 뉴스와 컨퍼런스 정보를 한 곳에서
              정리하고, 일정 관리까지 도와주는 작업 관리형 대시보드입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">다가오는 컨퍼런스 보기</Button>
              <Button variant="outline" size="lg">
                뉴스 피드만 살펴보기
              </Button>
            </div>
          </div>

          {/* 오른쪽 요약 카드 */}
          <div className="space-y-4">
            <Card className="bg-primary text-white shadow-[0_30px_60px_rgba(84,74,113,0.6)]">
              <CardHeader className="mb-2">
                <CardTitle className="text-white">
                  오늘의 IT 컨퍼런스 요약
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-white/70">오늘 열리는 컨퍼런스</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {conferences.length}
                  </p>
                </div>
                <div>
                  <p className="text-white/70">저장한 세션</p>
                  <p className="mt-1 text-2xl font-extrabold">12</p>
                </div>
                <div>
                  <p className="text-white/70">읽지 않은 인사이트</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {articles.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
              <div className="rounded-2xl bg-muted px-4 py-3 shadow-sm">
                <p className="font-bold text-foreground">
                  Organized Layers
                </p>
                <p className="mt-1 text-foreground/70">
                  컨퍼런스, 뉴스, 태그가 피그마 스타일처럼 정돈된 구조.
                </p>
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3 shadow-sm">
                <p className="font-bold text-foreground">
                  Stylish &amp; Modern Design
                </p>
                <p className="mt-1 text-foreground/70">
                  Manrope 타이포와 보라색 포인트 컬러를 그대로 반영.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 필터 및 그리드 */}
        <section className="grid gap-6 lg:grid-cols-[1.7fr,1.3fr]">
          {/* 좌측: 컨퍼런스 리스트 */}
          <Card className="bg-muted">
            <CardHeader className="mb-3 flex-col items-start gap-3 md:flex-row">
              <div>
                <CardTitle>Conference List</CardTitle>
                <CardDescription>
                  FE, BE, AI 등 트랙별로 필터링해서 다가오는 컨퍼런스를 확인하세요.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                      category === cat
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-primary/10 bg-background/60 text-foreground/80 hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    {CATEGORY_ICONS[cat] ?? <Globe2 className="size-4" />}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading && (
                <p className="text-sm text-foreground/60">
                  컨퍼런스 정보를 불러오는 중입니다...
                </p>
              )}
              {!isLoading && conferences.length === 0 && (
                <p className="text-sm text-foreground/60">
                  선택한 카테고리에 해당하는 컨퍼런스가 없습니다.
                </p>
              )}
              {!isLoading &&
                conferences.map((conf) => (
                  <ConferenceRow key={conf.id} conference={conf} />
                ))}
            </CardContent>
          </Card>

          {/* 우측: IT 뉴스 피드 */}
          <Card>
            <CardHeader className="mb-3">
              <CardTitle>IT Insight Feed</CardTitle>
              <CardDescription>
                최신 기술 글과 아티클을 모아서, 컨퍼런스 전후로 공부 흐름을
                이어갈 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-background/70 px-4 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {article.title}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {article.source} · {article.publishedAt} · 약{" "}
                      {article.readingTimeMinutes}분
                    </p>
                  </div>
                  <span className="mt-1 inline-flex h-7 items-center rounded-full bg-primary/10 px-3 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {article.category}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function ConferenceRow({ conference }: { conference: Conference }) {
  return (
    <div className="grid gap-3 rounded-2xl bg-background/70 px-4 py-4 text-xs md:grid-cols-[1.7fr,1.2fr,auto] md:items-center md:text-sm">
      <div className="space-y-1">
        <p className="text-sm font-extrabold text-foreground md:text-base">
          {conference.title}
        </p>
        <p className="text-xs text-foreground/60">
          {conference.organizer} · {conference.location} · {conference.mode}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/70">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
          <CalendarDays className="size-3" />
          {conference.date} · {conference.startTime}–{conference.endTime}
        </span>
        <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-foreground/70">
          {conference.level}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {conference.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-primary/6 px-3 py-1 text-[11px] font-semibold text-primary"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

