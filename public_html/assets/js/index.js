function loadDoc(button) {
    console.log("refresh AJAX");
    document.getElementById("main-page").innerHTML = "";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("main-page").innerHTML = this.responseText;
        }
    };

    xhr.open("GET", "/assets/html/" + button + ".html");
    xhr.send();

}

loadDoc("import");