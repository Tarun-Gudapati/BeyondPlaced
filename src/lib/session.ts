import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "beyondplaced_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export const usingFallbackSecret = !process.env.AUTH_SECRET;

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "beyondplaced-dev-only-secret-set-AUTH_SECRET-in-production",
);

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  await connection();
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return typeof payload.uid === "string" ? payload.uid : null;
  } catch {
    return null;
  }
}
