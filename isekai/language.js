(() => {
  const articles = Array.from(document.querySelectorAll("article[lang]"));
  const links = Array.from(document.querySelectorAll("nav a[hreflang]"));
  const supported = new Set(articles.map(article => article.lang));

  function matchLanguage(tag) {
    if (/^zh(?:-|$)/i.test(tag)) {
      if (/-hant(?:-|$)/i.test(tag)) return "zh-Hant";
      if (/-hans(?:-|$)/i.test(tag)) return "zh-Hans";
      return /-(tw|hk|mo)(?:-|$)/i.test(tag) ? "zh-Hant" : "zh-Hans";
    }
    const primary = tag.split("-")[0].toLowerCase();
    return supported.has(primary) ? primary : undefined;
  }

  function showLanguage() {
    const requested = location.hash.slice(1);
    const preferred = navigator.languages || [navigator.language];
    const selected = supported.has(requested) ? requested : preferred.map(matchLanguage).find(Boolean) || "ja";
    for (const article of articles) {
      article.hidden = article.lang !== selected;
      if (!article.hidden) document.title = article.dataset.title;
    }
    for (const link of links) {
      if (link.hreflang === selected) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
    document.documentElement.lang = selected;
  }

  window.addEventListener("hashchange", showLanguage);
  showLanguage();
})();
