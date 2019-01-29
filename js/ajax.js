function Ajax() {
    this.async = true;
    this.open = function(id, url, cFunction) {
        this.xhttp = new XMLHttpRequest();
        this.xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                cFunction(id, this);
            }
        };
        this.xhttp.open("POST", url, this.async);
    };
    this.send = function(send) {
        this.xhttp.setRequestHeader("Content-type", 
            "application/x-www-form-urlencoded");
        this.xhttp.send(send);
    };
}