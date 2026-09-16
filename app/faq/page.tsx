"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

const faqContent = `## FAQ SPARK

### Q: Mengapa jawaban yang diberikan SPARK terkadang belum tepat atau kurang akurat?

*Admin SPARK:*
SPARK saat ini masih dalam tahap pengembangan dan penyempurnaan. Jawaban yang belum tepat dapat terjadi karena referensi yang dibutuhkan belum tersedia atau belum diperbarui dalam *Knowledge Database SPARK*.

Kami terus melakukan pembaruan referensi dan peningkatan kualitas jawaban agar SPARK semakin akurat dan relevan.

---

### Q: Apakah ada prompt yang dapat digunakan agar jawaban SPARK lebih akurat dan tetap mengacu pada referensi?

*Admin SPARK:*
Ada. Untuk membantu SPARK memberikan jawaban yang lebih terarah berdasarkan referensi yang tersedia, tambahkan instruksi berikut di akhir pertanyaan:

*“Jawab sesuai dengan dokumen referensi.”*

atau

*“Jawab sesuai dengan dokumen referensi terbaru yang tersedia.”*

Contoh:
*“Jelaskan ketentuan pengajuan klaim JHT sesuai dengan dokumen referensi terbaru yang tersedia.”*

---

### Q: Bagaimana cara menambahkan referensi seperti Perdir, Juknis, Pedoman, atau Tutorial ke SPARK?

*Admin SPARK:*
Apabila terdapat dokumen atau referensi yang perlu ditambahkan ke *Knowledge Database SPARK*, silakan mengirimkan dokumen tersebut kepada Admin SPARK melalui email:

📧 *[spark.admin@bpjsketenagakerjaan.go.id](mailto:spark.admin@bpjsketenagakerjaan.go.id)*

Referensi dapat berupa *Peraturan Direksi (Perdir), Juknis, Pedoman, Tutorial, SOP, Surat Edaran*, maupun dokumen resmi lainnya yang dapat meningkatkan kelengkapan dan akurasi pengetahuan SPARK.`;

export default function FaqPage() {
  const { data: session } = useSession();

  return (
    <main className="chat-shell faq-shell">
      <header className="chat-header">
        <div>
          <p className="eyebrow">SPARK</p>
          <h1>Asisten Referensi BPJS Ketenagakerjaan.</h1>
        </div>
        <div className="account-actions">
          <span className="account-email">{session?.user?.email}</span>
          <Link className="faq-link" href="/faq">FAQ</Link>
          <button className="text-button" type="button" onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign out
          </button>
        </div>
      </header>

      <section className="faq-content">
        <Link className="back-link" href="/">← Kembali ke SPARK</Link>
        <article className="faq-panel markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {faqContent}
          </ReactMarkdown>
        </article>
      </section>
    </main>
  );
}
