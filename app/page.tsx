"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const greeting =
  "Hai! 👋\nAku SPARK, asisten cerdas yang membantu kamu.\nKamu mau aku bantu cari atau jelaskan apa hari ini? Seperti Peraturan Direksi, Petunjuk Teknis, dan Panduan Aplikasi SMILE.";

export default function Home() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = question.trim();

    if (!message || isLoading) {
      if (!message) setError("Masukkan pertanyaan untuk mencari referensi.");
      return;
    }

    const userMessage: Message = { role: "user", content: message };
    const conversation = [...messages, userMessage];

    setMessages(conversation);
    setQuestion("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan. Silakan coba lagi.");
      }

      setMessages([...conversation, { role: "assistant", content: data.answer || "Tidak ada jawaban yang dikembalikan." }]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Tidak dapat menghubungi layanan referensi.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSignOut() {
    setMessages([]);
    setError("");
    signOut({ callbackUrl: "/login" });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading && question.trim()) {
        event.currentTarget.form?.requestSubmit();
      }
    }
  }

  return (
    <main className="chat-shell">
      <header className="chat-header">
        <div>
          <p className="eyebrow">Asisten Referensi BPJS Ketenagakerjaan</p>
          <h1>SPARK</h1>
        </div>
        <div className="account-actions">
          <span className="account-email">{session?.user?.email}</span>
          <button className="text-button" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <section className="conversation" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && (
          <article className="bubble-row assistant">
            <div className="bubble-meta">SPARK</div>
            <div className="bubble">{greeting}</div>
          </article>
        )}

        {messages.map((message, index) => (
          <article className={`bubble-row ${message.role}`} key={`${message.role}-${index}`}>
            <div className="bubble-meta">{message.role === "user" ? "YOU" : "SPARK"}</div>
            <div className="bubble markdown-content">
              {message.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          </article>
        ))}

        {isLoading && (
          <article className="bubble-row assistant">
            <div className="bubble-meta">SPARK</div>
            <div className="bubble loading-bubble"><span /> <span /> <span /></div>
          </article>
        )}

        {error && <div className="chat-error" role="alert">{error}</div>}
      </section>

      <form className="composer" onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Tanyakan sesuatu..."
          rows={2}
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          aria-label="Your question"
        />
        <div className="composer-footer">
          <span>Jawaban berdasarkan dokumen referensi Anda.</span>
          <button type="submit" disabled={isLoading || !question.trim()}>
            {isLoading ? "Mencari..." : "Kirim"}
            {!isLoading && <span aria-hidden="true">↗</span>}
          </button>
        </div>
      </form>
    </main>
  );
}
