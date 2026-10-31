const APP_ORIGIN = "https://rc.auctorlabs.in";

export function appAttributionHref(
  path: string,
  content: string,
  extra: Record<string, string> = {},
) {
  const url = new URL(path, APP_ORIGIN);
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_medium", "button");
  url.searchParams.set("utm_campaign", "oct_push");
  url.searchParams.set("utm_content", content);
  url.searchParams.set("source", "website");
  for (const [key, value] of Object.entries(extra)) url.searchParams.set(key, value);
  return url.toString();
}

export function blogAppAttributionHref(slug: string) {
  const url = new URL("/signup", APP_ORIGIN);
  url.searchParams.set("utm_source", "blog");
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", "oct_push");
  url.searchParams.set("utm_content", slug);
  url.searchParams.set("source", "blog");
  return url.toString();
}
