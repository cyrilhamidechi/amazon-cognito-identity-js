var API = {
  request: function (verb, endpoint) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      $('api-demo-results').innerHTML = HtmlContainer.displayDetails(xhr);
    };
    xhr.open(verb, endpoint, true);
    xhr.send();
  }
}
