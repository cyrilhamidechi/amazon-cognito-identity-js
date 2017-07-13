var HtmlContainer = {
  container: null,
  init: function (id, filler) {
    HtmlContainer.container = $(id);
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
  },
  displayDetails: function(object) {
    var details = [];
    for(var prop in object) {
      details.push('<li>' + prop + ' => ' + object[prop] + '</li>');
    }
    return '<small><ul>' + details.join('\n') + '</ul></small>';
  }
  //todo: buffer + flush
}

function $(id) {
  return document.getElementById(id);
}

