"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const { data: user, isLoading, isError } = useCurrentUser();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) {
			const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
			router.replace(`/login?next=${encodeURIComponent(next)}`);
		}
	}, [isLoading, user, router]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center gap-3 text-muted-foreground">
					<Spinner className="size-6" />
					<p className="text-sm">Loading your workspace.</p>
				</div>
			</div>
		);
	}

	if (isError || !user) {
		return null;
	}

	return <>{children}</>;
}
