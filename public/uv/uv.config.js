self.__uv$config = {
  prefix: "/uv/service/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};

self.onload = () => {
  if (typeof window === "object" && self.constructor === Window && location.pathname.startsWith("/uv/service/")) {
    const observer = new MutationObserver((mutations) => {
      parent.updateOmni(mutations[0].target.text);
    });

    observer.observe(document.querySelector("title"), {
      subtree: true,
      characterData: true,
      childList: true,
    })
    try {
      parent.updateCurrentTab(document.title);
      parent.updateOmni();
    } catch (_) { }
  }
}
