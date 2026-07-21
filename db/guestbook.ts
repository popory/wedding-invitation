export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

interface GuestbookRow {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface PasswordRow {
  password_hash: string;
  password_salt: string;
}

export async function listGuestbookEntries(db: D1Database) {
  const result = await db
    .prepare(
      `SELECT id, name, message, created_at
       FROM guestbook_entries
       ORDER BY id DESC
       LIMIT 50`
    )
    .all<GuestbookRow>();

  return result.results.map((entry) => ({
    id: entry.id,
    name: entry.name,
    message: entry.message,
    createdAt: entry.created_at,
  }));
}

export async function hasRecentGuestbookEntry(db: D1Database, clientHash: string) {
  const row = await db
    .prepare(
      `SELECT id
       FROM guestbook_entries
       WHERE client_hash = ? AND created_at >= datetime('now', '-30 seconds')
       LIMIT 1`
    )
    .bind(clientHash)
    .first<{ id: number }>();

  return Boolean(row);
}

export async function createGuestbookEntry(
  db: D1Database,
  values: {
    name: string;
    message: string;
    passwordHash: string;
    passwordSalt: string;
    clientHash: string;
  }
) {
  const result = await db
    .prepare(
      `INSERT INTO guestbook_entries
       (name, message, password_hash, password_salt, client_hash)
       VALUES (?, ?, ?, ?, ?)
       RETURNING id, name, message, created_at`
    )
    .bind(
      values.name,
      values.message,
      values.passwordHash,
      values.passwordSalt,
      values.clientHash
    )
    .first<GuestbookRow>();

  if (!result) {
    throw new Error("방명록을 저장하지 못했습니다.");
  }

  return {
    id: result.id,
    name: result.name,
    message: result.message,
    createdAt: result.created_at,
  } satisfies GuestbookEntry;
}

export function getGuestbookPassword(db: D1Database, id: number) {
  return db
    .prepare(
      `SELECT password_hash, password_salt
       FROM guestbook_entries
       WHERE id = ?`
    )
    .bind(id)
    .first<PasswordRow>();
}

export function deleteGuestbookEntry(db: D1Database, id: number) {
  return db.prepare("DELETE FROM guestbook_entries WHERE id = ?").bind(id).run();
}
