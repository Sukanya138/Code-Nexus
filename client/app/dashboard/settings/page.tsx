"use client"

import React from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="py-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-4 text-sm text-muted-foreground">User settings and preferences will appear here.</p>
      </div>
    </AppShell>
  );
}
