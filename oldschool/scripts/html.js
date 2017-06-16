var HtmlContainer = {
  container: null,
  init: function (id, filler) {
    HtmlContainer.container = document.getElementById(id);
    HtmlContainer.empty(filler);
    return HtmlContainer;
  },
  empty: function (filler) {
    HtmlContainer.fill(filler ? filler : 'Loading...');
  },
  fill: function (content) {
    if (Array.isArray(content)) {
      content = content.join('\n');
    }
    HtmlContainer.container.innerHTML = content;
  }
}

