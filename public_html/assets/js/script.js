let mobileScren = false;

function loadDoc(button) {
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
    onResize();
    if (element.className === "option-button") {
        let id = element.id;
        loadDoc(id);
    }

    if (mobileScren) {
        closeMenu();
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

function onResize() {
    if (screen.width < 980) {
        mobileScren = true;
        closeMenu();
    } else {
        mobileScren = false;
        document.getElementById("main-page").style = "display: block";
        document.getElementById("menu-header").style = "display: block";
        document.getElementById("open-mobile-menu-button").style = "display: none"
    }

}

function openMenu() {
    document.getElementById("main-page").style = "display:none";
    document.getElementById("menu-header").style = "display: block";
    document.getElementById("open-mobile-menu-button").style = "display: none"
}

function closeMenu() {
    document.getElementById("main-page").style = "display: block";
    document.getElementById("menu-header").style = "display: none";
    document.getElementById("open-mobile-menu-button").style = "display: block"
}

// Get Buttons listener
Array.from(document.getElementsByClassName("option-button")).forEach(function (element, index) {
    element.addEventListener("click", () => {
        buttonClick(element);
    })
});

// Mobile menu
document.getElementById("open-mobile-menu-button").addEventListener("click", openMenu);
document.getElementById("close-mobile-menu-button").addEventListener("click", closeMenu);

onResize(); // Get first verification for screen width
loadDoc("import"); // Load default docs
window.onresize = onResize; // Get screen size changes