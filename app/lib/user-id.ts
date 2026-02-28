const KEY = "jobnyaha_user_id";

/**
 * localStorage にUUIDを保存し、同一ブラウザでは同じIDを返す。
 * SSR時（window未定義）は空文字を返す。
 */
export function getUserId(): string {
  if (typeof window === "undefined") return "";

  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
