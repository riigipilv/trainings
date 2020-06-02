const urlParams = new URLSearchParams(window.location.search);
const userNr = urlParams.get('user');

var hiddenCommands = document.querySelectorAll(".cmd-one-line");

function replaceCommand() {
    var preChild = this.querySelector("pre");
    this.parentNode.replaceChild(preChild, this);
    preChild.style.display = "block";
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

for (var i = 0; i < hiddenCommands.length; i++) {
    var command = hiddenCommands[i];
    command.querySelector("pre").style.display = "none";
    command.addEventListener("click", replaceCommand);
}

if (userNr !== null) {
    var allCodes = document.querySelectorAll("code");

    for (var i = 0; i < allCodes.length; i++) {
        var code = allCodes[i];
        code.innerHTML = code.innerHTML.replaceAll("userN", "user" + userNr).replaceAll("uN", "u" + userNr);
    }

    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        link.innerHTML = link.innerHTML.replaceAll("userN", "user" + userNr).replaceAll("uN", "u" + userNr);
        link.href = link.innerHTML;
    }
}

var allFiles = document.querySelectorAll(".cmd-file");

function showFile() {
    var preChild = this.parentNode.querySelector("pre");
    if (preChild.style.display === "none") {
        this.querySelector(".show-text").innerHTML = '&minus;';
        preChild.style.display = 'block'
    } else {
        this.querySelector(".show-text").innerHTML = '&plus;';
        preChild.style.display = 'none'
    }
}

for (var i = 0; i < allFiles.length; i++) {
    var file = allFiles[i];
    file.querySelector("pre").style.display = "none";
    file.querySelector("summary").addEventListener("click", showFile);
}