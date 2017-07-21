var API = {
  request: function (verb, endpoint, auth, headers) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var result = HtmlContainer.displayDetails(xhr);
      if(xhr.status && 200 === xhr.status) {
        result = xhr.response;
      }
      $('api-demo-results').innerHTML = result;
    };
    if (auth) {
      headers = headers || {};
      if(Cognito.session) {
        headers.Authorization = Cognito.session.getIdToken().getJwtToken();
      } else {
        console.log('API auth request > no session found');
      }

    }
    xhr.open(verb, endpoint, true);
    if (headers) {
      for (var key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
    xhr.send();
  }
}
