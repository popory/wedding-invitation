import {
  createGuestbookEntry,
  deleteGuestbookEntry,
  getGuestbookPassword,
  hasRecentGuestbookEntry,
  listGuestbookEntries,
} from "../db/guestbook";

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}

function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashText(value: string) {
  return toHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function createSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isValidId(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0;
}

export async function handleGuestbookApi(request: Request, db: D1Database) {
  try {
    if (request.method === "GET") {
      return json({ entries: await listGuestbookEntries(db) });
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 4096) {
      return json({ error: "입력 내용이 너무 깁니다." }, 413);
    }

    if (request.method === "POST") {
      const payload = (await request.json()) as {
        name?: unknown;
        message?: unknown;
        password?: unknown;
      };
      const name = typeof payload.name === "string" ? payload.name.trim() : "";
      const message = typeof payload.message === "string" ? payload.message.trim() : "";
      const password = typeof payload.password === "string" ? payload.password : "";

      if (name.length < 1 || name.length > 20) {
        return json({ error: "이름은 1자 이상 20자 이하로 입력해 주세요." }, 400);
      }
      if (message.length < 1 || message.length > 200) {
        return json({ error: "메시지는 1자 이상 200자 이하로 입력해 주세요." }, 400);
      }
      if (password.length < 4 || password.length > 20) {
        return json({ error: "삭제 비밀번호는 4자 이상 20자 이하로 입력해 주세요." }, 400);
      }

      const clientSource = request.headers.get("cf-connecting-ip") ?? "unknown";
      const clientHash = await hashText(`guestbook:${clientSource}`);
      if (await hasRecentGuestbookEntry(db, clientHash)) {
        return json({ error: "잠시 후 다시 작성해 주세요." }, 429);
      }

      const passwordSalt = createSalt();
      const passwordHash = await hashText(`${passwordSalt}:${password}`);
      const entry = await createGuestbookEntry(db, {
        name,
        message,
        passwordHash,
        passwordSalt,
        clientHash,
      });
      return json({ entry }, 201);
    }

    if (request.method === "DELETE") {
      const payload = (await request.json()) as { id?: unknown; password?: unknown };
      const password = typeof payload.password === "string" ? payload.password : "";
      if (!isValidId(payload.id) || password.length < 4 || password.length > 20) {
        return json({ error: "삭제 정보를 확인해 주세요." }, 400);
      }

      const stored = await getGuestbookPassword(db, payload.id);
      if (!stored) {
        return json({ error: "이미 삭제된 메시지입니다." }, 404);
      }

      const passwordHash = await hashText(`${stored.password_salt}:${password}`);
      if (passwordHash !== stored.password_hash) {
        return json({ error: "삭제 비밀번호가 일치하지 않습니다." }, 403);
      }

      await deleteGuestbookEntry(db, payload.id);
      return json({ ok: true });
    }

    return json({ error: "지원하지 않는 요청입니다." }, 405);
  } catch {
    return json({ error: "방명록을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." }, 500);
  }
}
