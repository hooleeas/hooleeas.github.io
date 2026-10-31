export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (
      (request.method === "GET" || request.method === "HEAD") &&
      pathname !== "/" &&
      !pathname.endsWith("/") &&
      !/\.[^/]+$/.test(pathname)
    ) {
      const canonicalUrl = new URL(url);
      canonicalUrl.pathname = `${pathname}/`;
      const canonicalResponse = await env.ASSETS.fetch(
        new Request(canonicalUrl, request),
      );

      if (canonicalResponse.status < 400) {
        return Response.redirect(canonicalUrl.toString(), 301);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
