"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { Bot, User, Send, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAction } from "@/hooks/useAction";
import { sendAiCoachMessage } from "@/actions/ai-coach/send-message.action";
import type { AiCoachChatMessage } from "@/actions/ai-coach/get-chat-history.action";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  redFlagIntercepted?: boolean;
}

function toDisplayMessage(message: AiCoachChatMessage): DisplayMessage {
  return {
    id: message.id,
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
  };
}

export function AiCoachChat({ initialMessages }: { initialMessages: AiCoachChatMessage[] }) {
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessages.map(toDisplayMessage));
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { execute, isLoading } = useAction(sendAiCoachMessage, {
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          redFlagIntercepted: data.redFlagIntercepted,
        },
      ]);
    },
    onError: (error) => {
      toast.error(error);
      // Roll back the optimistic user message so the thread doesn't show a
      // question that never actually got a reply.
      setMessages((prev) => prev.slice(0, -1));
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content: trimmed }]);
    setInput("");
    execute({ message: trimmed });
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card">
      <div className="flex h-[28rem] flex-col gap-4 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="m-auto max-w-sm text-center text-sm text-muted-foreground">
            Ask your AI Trainer anything about training, mindset, or habits —
            for example, &ldquo;What&apos;s a good warm-up for my shoulders?&rdquo;
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex items-start gap-3", message.role === "user" && "flex-row-reverse")}
          >
            <div
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-[#C9A96A]/10 text-[#C9A96A]"
              )}
            >
              {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              )}
            >
              {message.redFlagIntercepted && (
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-destructive">
                  <ShieldAlert className="h-3.5 w-3.5" /> Routed to your coach
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96A]/10 text-[#C9A96A]">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">Thinking…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border p-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type a message…"
          rows={2}
          maxLength={2000}
          className="resize-none"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
