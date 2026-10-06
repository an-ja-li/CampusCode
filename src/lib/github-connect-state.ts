import { createHmac, timingSafeEqual } from "crypto";

interface ConnectState {
  projectId: string;
  userId: string;
  expiresAt: number;
}

function secret() {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
}

export function createGitHubConnectState(projectId: string, userId: string) {
  const signingSecret = secret();
  if (!signingSecret) throw new Error("Authentication secret is not configured.");
  const payload = Buffer.from(JSON.stringify({ projectId, userId, expiresAt: Date.now() + 10 * 60 * 1000 })).toString("base64url");
  const signature = createHmac("sha256", signingSecret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readGitHubConnectState(value: string | null): ConnectState | null {
  const signingSecret = secret();
  if (!value || !signingSecret) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", signingSecret).update(payload).digest("base64url");
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ConnectState;
    return decoded.expiresAt > Date.now() ? decoded : null;
  } catch {
    return null;
  }
}
