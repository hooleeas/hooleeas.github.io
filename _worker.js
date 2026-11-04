export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (
      (request.method === "GET" || request.method === "HEAD") &&
      pathname !== "/" &&
      // 404 页是文件页（404.html），不能补斜杠：/404/ 会被资源层跳回 /404，形成死循环
      pathname !== "/404" &&
      !pathname.endsWith("/") &&
      !/\.[^/]+$/.test(pathname)
    ) {
      const canonicalUrl = new URL(url);
      canonicalUrl.pathname = `${pathname}/`;
      const canonicalResponse = await env.ASSETS.fetch(
        new Request(canonicalUrl, request),
      );

      // 只认 200 的真页面；3xx 是资源层自己的跳转信号，不能据此再跳一次
      if (canonicalResponse.status === 200) {
        return Response.redirect(canonicalUrl.toString(), 301);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
