"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "strentor-install-prompt-dismissed";

// True when the site is already running as the installed app rather than
// in a regular browser tab — standalone display-mode covers Chrome/Edge/
// Android, navigator.standalone covers iOS Safari (which has no
// display-mode support and never fires beforeinstallprompt anyway).
function isRunningInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isRunningInstalled()) return;
    if (window.sessionStorage.getItem(DISMISSED_KEY)) return;

    function handler(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setVisible(false);
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-xl border border-[#C9A96A]/30 bg-card p-4 shadow-lg">
      <Download className="h-5 w-5 flex-shrink-0 text-[#C9A96A]" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-card-foreground">Install STRENTOR</p>
        <p className="text-muted-foreground">Add to your home screen for quick, offline-friendly access.</p>
      </div>
      <Button size="sm" onClick={install} className="bg-[#C9A96A] hover:bg-[#C9A96A]/90 flex-shrink-0">
        Install
      </Button>
      <button onClick={dismiss} aria-label="Dismiss" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
