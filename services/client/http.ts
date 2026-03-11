export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

const resolveBaseUrl = () => {
  const remoteBase = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;
  if (remoteBase && remoteBase.trim().length > 0) {
    return remoteBase.replace(/\/$/, "");
  }
  return "";
};

const BASE_URL = resolveBaseUrl();

export const httpRequest = async <T>(
  path: string,
  init?: RequestInit & { nextTags?: string[] },
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Error de servidor";
    try {
      const payload = (await response.json()) as { error?: string };
      message = payload.error ?? message;
    } catch {
      // Ignore malformed body.
    }
    throw new HttpError(message, response.status);
  }

  return (await response.json()) as T;
};
