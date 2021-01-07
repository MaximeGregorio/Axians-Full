function loadDoc(button) {
    console.log("refresh AJAX");
    document.getElementById("main-page").innerHTML = "";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("main-page").innerHTML = this.responseText;
            configFileInput();
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

function configFileInput() {

    let fileInput = document.getElementById("test_input");
    let dropZone = document.getElementById("drop_zone");
    fileInput.addEventListener("change", function () {
        dropZone.style.borderColor = "green";
        if (fileInput.files.length > 0) {
            document.getElementById("inputFileName").innerHTML = fileInput.files[0].name;
        }
    });
}

loadDoc("import");

Array.from(document.getElementsByClassName("option-button")).forEach(function (element, index) {
    element.addEventListener("click", () => {
        buttonClick(element);
    })
});

