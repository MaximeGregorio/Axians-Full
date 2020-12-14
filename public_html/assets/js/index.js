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

/** Quand le bouton est cliqué
 *
 * @param {Element} element
 */
function buttonClick(element) {
    if (element.className === "option-button") {
        let id = element.id;
        loadDoc(id);
    }
}

Array.from(document.getElementsByClassName("option-button")).forEach(function (element, index) {
    element.addEventListener("click", () => {
        buttonClick(element);
    })
});

loadDoc("import");