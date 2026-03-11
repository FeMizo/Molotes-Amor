import { NextResponse } from "next/server";

export const ok = <T>(payload: T, init?: ResponseInit) => NextResponse.json(payload, init);

export const fail = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });
