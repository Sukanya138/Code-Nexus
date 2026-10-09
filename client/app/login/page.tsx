"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AlertCircle } from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icon";
import { BrandMark } from "@/components/layout/app-shell";
import { api, getGithubLoginUrl, type User } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, setAuthCookie } from "@/hooks/use-auth";

function LoginLoading(){
    return(
        <div className="flex min-h-svh items-center justify-center">
            <Spinner className="size-8"/>
        </div>
    )
}

const LoginContent = () => {
    const params = useSearchParams();
    const router = useRouter();
    const error = params.get("error");
    const next = params.get("next") || "/dashboard";
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        let isActive = true;

        void api
            .session()
            .then((currentUser) => {
                if (!isActive) {
                    return;
                }

                setUser(currentUser);
                if (currentUser) {
                    // ensure the frontend auth cookie matches the backend session
                    setAuthCookie(true);
                }
                setIsLoading(false);
            })
            .catch(() => {
                if (!isActive) {
                    return;
                }

                setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        router.replace(next);
    }, [next, router, user]);

    if (isLoading || user) {
        return <LoginLoading/>
    }


  return (
        <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(from_var(--primary)_l_c_h/0.08),transparent_55%)]" />

            <header className="relative z-10 flex h-14 items-center justify-between px-4">
                <BrandMark />
                <ModeToggle />
            </header>

            <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
                <Card className="w-full max-w-sm border-border/70 bg-card/90 shadow-lg shadow-foreground/5 backdrop-blur">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
                            <GitHubIcon className="size-6" />
                        </div>

                        <div className="space-y-1">
                            <CardTitle className="text-xl">Sign in</CardTitle>
                            <CardDescription>
                                Connect GitHub to chat with your repositories.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error ? (
                            <Alert variant="destructive">
                                <AlertCircle className="size-4" />
                                <AlertTitle>Could not sign in</AlertTitle>
                                <AlertDescription>
                                    Authentication failed. Please try again.
                                </AlertDescription>
                            </Alert>
                        ) : null}

                        <a
                            href={getGithubLoginUrl()}
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "inline-flex w-full items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90"
                            )}
                        >
                            <GitHubIcon className="size-5" />
                            Continue with GitHub
                        </a>
                    </CardContent>
                </Card>
            </main>
        </div>
  );
};

export default function LoginPage(){
    return(
        <Suspense fallback={<LoginLoading/>}>
            <LoginContent/>
        </Suspense>
    )
}
