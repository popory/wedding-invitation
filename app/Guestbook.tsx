"use client";

import { FormEvent, useEffect, useState } from "react";

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

const SITES_URL = "https://serin-hyerin-wedding.popory8.chatgpt.site/";

function formatDate(value: string) {
  const normalized = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isGitHubPages, setIsGitHubPages] = useState(false);

  useEffect(() => {
    if (window.location.hostname.endsWith("github.io")) {
      setIsGitHubPages(true);
      setLoading(false);
      return;
    }

    fetch("/api/guestbook", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { entries?: GuestbookEntry[]; error?: string };
        if (!response.ok) throw new Error(data.error);
        setEntries(data.entries ?? []);
      })
      .catch(() => setStatus("방명록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."))
      .finally(() => setLoading(false));
  }, []);

  async function submitEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, password }),
      });
      const data = (await response.json()) as { entry?: GuestbookEntry; error?: string };
      if (!response.ok || !data.entry) throw new Error(data.error ?? "저장하지 못했습니다.");
      setEntries((current) => [data.entry!, ...current]);
      setName("");
      setMessage("");
      setPassword("");
      setStatus("따뜻한 마음이 등록되었습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "저장하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeEntry(id: number) {
    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("/api/guestbook", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: deletePassword }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "삭제하지 못했습니다.");
      setEntries((current) => current.filter((entry) => entry.id !== id));
      setDeleteId(null);
      setDeletePassword("");
      setStatus("메시지가 삭제되었습니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "삭제하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isGitHubPages) {
    return (
      <section className="section guestbook">
        <p className="sectionLabel">GUESTBOOK</p>
        <h2>축하의 마음 남기기</h2>
        <p className="subtext">방명록은 청첩장 기본 주소에서 이용할 수 있습니다.</p>
        <a className="guestbookLink" href={SITES_URL}>방명록으로 이동</a>
      </section>
    );
  }

  return (
    <section className="section guestbook">
      <p className="sectionLabel">GUESTBOOK</p>
      <h2>축하의 마음 남기기</h2>
      <p className="subtext">두 사람의 새로운 시작을 따뜻한 메시지로 축복해 주세요.</p>

      <form className="guestbookForm" onSubmit={submitEntry}>
        <label>
          <span>이름</span>
          <input value={name} onChange={(event) => setName(event.target.value)} maxLength={20} required />
        </label>
        <label>
          <span>메시지</span>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={200} rows={4} required />
          <small>{message.length} / 200</small>
        </label>
        <label>
          <span>삭제 비밀번호</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={4} maxLength={20} autoComplete="new-password" required />
        </label>
        <button type="submit" disabled={submitting}>{submitting ? "등록 중..." : "마음 남기기"}</button>
      </form>

      {status && <p className="guestbookStatus" role="status">{status}</p>}

      <div className="guestbookList" aria-live="polite">
        {loading && <p className="guestbookEmpty">메시지를 불러오고 있습니다.</p>}
        {!loading && entries.length === 0 && <p className="guestbookEmpty">첫 번째 축하 메시지를 남겨주세요.</p>}
        {entries.map((entry) => (
          <article className="guestbookEntry" key={entry.id}>
            <div className="guestbookEntryHead">
              <strong>{entry.name}</strong>
              <time>{formatDate(entry.createdAt)}</time>
            </div>
            <p>{entry.message}</p>
            {deleteId === entry.id ? (
              <div className="guestbookDelete">
                <input type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} placeholder="삭제 비밀번호" minLength={4} maxLength={20} autoComplete="current-password" />
                <button type="button" onClick={() => removeEntry(entry.id)} disabled={submitting}>확인</button>
                <button type="button" onClick={() => { setDeleteId(null); setDeletePassword(""); }}>취소</button>
              </div>
            ) : (
              <button className="guestbookDeleteOpen" type="button" onClick={() => setDeleteId(entry.id)}>삭제</button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
