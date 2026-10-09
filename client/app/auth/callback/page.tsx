"use client"
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
	const { data: user, isLoading, isError, isFetched } = useCurrentUser();

	useEffect(() => {
		if (!isFetched || isLoading) return;

		if (user) {
			window.location.replace("/dashboard");
			return;
		}

		window.location.replace("/login?error=session");
	}, [user, isLoading, isFetched, isError]);

	return (
		<div className="flex min-h-svh flex-col items-center justify-center">
			<Spinner className="size-6" />
			<p className="text-sm text-muted-foreground mt-4">Finishing GitHub sign-in…</p>
		</div>
	);
}