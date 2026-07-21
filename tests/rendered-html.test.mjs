import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("청첩장과 방명록 입력 화면을 서버에서 렌더링한다", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>이세린 ♥ 이혜린 결혼합니다<\/title>/);
  assert.match(html, /축하의 마음 남기기/);
  assert.match(html, /삭제 비밀번호/);
  assert.match(html, /마음 남기기/);
  assert.match(html, /010-5355-8310/);
  assert.match(html, /010-3608-5580/);
  assert.match(html, /tel:01053558310/);
  assert.match(html, /sms:01036085580/);
  const contactStart = html.indexOf("CONTACT");
  const contactEnd = html.indexOf("WEDDING DAY", contactStart);
  const contactHtml = html.slice(contactStart, contactEnd);
  assert.ok(contactHtml.indexOf("이진웅") < contactHtml.indexOf("전명자"));
  assert.ok(contactHtml.indexOf("전명자") < contactHtml.indexOf("이세린"));
  assert.ok(contactHtml.indexOf("이동춘") < contactHtml.indexOf("김옥자"));
  assert.ok(contactHtml.indexOf("김옥자") < contactHtml.indexOf("이혜린"));
  assert.doesNotMatch(html, /photo-[1-9]\.jpg|GALLERY/);
});

test("방명록 저장소와 마이그레이션을 포함한다", async () => {
  const [hosting, schema, migration, worker] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0000_abandoned_stick.sql", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  assert.match(hosting, /"d1": "DB"/);
  assert.match(schema, /guestbook_entries/);
  assert.match(migration, /CREATE TABLE `guestbook_entries`/);
  assert.match(worker, /handleGuestbookApi/);
  await access(new URL("../app/Guestbook.tsx", import.meta.url));
});
