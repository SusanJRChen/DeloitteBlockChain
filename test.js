let requestPath = "http:localhost:3001";
let http = new XMLHttpRequest();

function request(url, method="get", body=null) {
    http.open(method, url, true);
    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
        }
    }

    http.send(body);
}

request(requestPath + "/Blocks");