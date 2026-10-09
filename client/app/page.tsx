import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChevronRight,
  FileCode2,
  FolderGit2,
  GitBranch,
  Layers,
  MessageSquareCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Connect GitHub",
    description: "Secure GitHub OAuth authentication. Access public and private repositories.",
    icon: FolderGit2,
  },
  {
    title: "AI Repository Analysis",
    description: "Index repositories and generate embeddings. Intelligent code understanding and search.",
    icon: Bot,
  },
  {
    title: "Chat with Code",
    description: "Ask questions about the codebase. Get context-aware answers with references.",
    icon: MessageSquareCode,
  },
  {
    title: "Code Insights",
    description: "Generate summaries, architecture explanations, and documentation.",
    icon: FileCode2,
  },
] as const;

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/14 blur-[125px]" />
        <div className="absolute left-[-8rem] top-44 h-80 w-80 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute right-[-8rem] top-24 h-72 w-72 rounded-full bg-primary/12 blur-[115px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_2%,hsl(var(--foreground)/0.12),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background:linear-gradient(to_right,hsl(var(--foreground)/0.16)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.14)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_70%_48%_at_50%_22%,#000_20%,transparent_95%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-8 lg:px-12">
        <header className="mb-14 flex items-center justify-between rounded-2xl border border-border bg-card/70 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.35)]">
              CN
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-[0.18em] text-foreground uppercase">CodeNexus</span>
              <span className="text-xs text-muted-foreground">AI developer workspace</span>
            </div>
          </div>
          <Link href="/login">
            <Button
              variant="outline"
              className="border-border bg-background/60 text-foreground hover:bg-muted"
            >
              Sign in
            </Button>
          </Link>
        </header>

        <section className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Repository Intelligence
          </div>

          <h1 className="text-balance bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Code Nexus
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Connect GitHub repositories, analyze codebases, and chat with your code using AI-powered insights.
          </p>

          <div className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="group w-full bg-primary px-6 text-primary-foreground hover:bg-primary/90 sm:w-auto">
                Continue with GitHub
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-border bg-card/70 px-6 text-foreground hover:bg-muted sm:w-auto"
              >
                Learn More
              </Button>
            </a>
          </div>

          <div className="relative mt-12 w-full max-w-4xl rounded-3xl border border-border bg-card/65 p-4 backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-primary/15 blur-3xl" />
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-border bg-background/65 p-4 text-left">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GitBranch className="h-4 w-4 text-primary" />
                    org/payment-service
                  </div>
                  <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground">
                    Indexed
                  </span>
                </div>
                <div className="space-y-2 rounded-xl border border-border bg-card p-3 font-mono text-xs text-muted-foreground">
                  <p>{"> AI analyzing architecture graph..."}</p>
                  <p>{"> 132 files parsed | 4 services detected"}</p>
                  <p>{"> references linked for auth + billing modules"}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl border border-border bg-card/80 p-4 text-left">
                  <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                    <BrainCircuit className="h-4 w-4 text-primary" />
                    Context-aware AI Answers
                  </div>
                  <p className="text-sm text-muted-foreground">Query any module and get referenced, grounded responses instantly.</p>
                </div>
                <div className="rounded-2xl border border-border bg-card/80 p-4 text-left">
                  <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Private Repository Support
                  </div>
                  <p className="text-sm text-muted-foreground">Secure GitHub OAuth with controlled access for teams and enterprises.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex items-start gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              <div className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary/90">
                Explore capability
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <div className="rounded-3xl border border-border bg-gradient-to-r from-card via-card to-muted/35 p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/75 px-3 py-1 text-xs text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  Built for modern engineering teams
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">Start building with intelligent code context</h2>
              </div>
              <Link href="/login" className="sm:shrink-0">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                  Continue with GitHub
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
