#!/usr/bin/env node

var showdown = require('showdown');
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var converter = new showdown.Converter();

const FILE_NAME = "readme.txt";
const HTML_FOOT = '</div><script src="../main.js"></script></body></html>';

var folder = process.argv[2];
if (folder == null) {
    folder = ".";
}

function isNumericName(value) {
    return /^\d+$/.test(value);
}

function fileExists(filePath) {
    if (fs.existsSync(filePath)) {
        return true;
    } else {
        console.error("File does not exist: " + filePath);
        return false;
    }
}

function htmlHead(title) {
    return `
    <!doctype html><html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link rel="stylesheet" href="../highlight.css">
        <link rel="stylesheet" href="../main.css">
        <script src="../highlight.pack.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
    </head>
    <body>
    <header>
        <div>
            <span>${title}</span>
            <img src="../logo.svg"/>
        </div>
    </header>
    <div class="body">`;
}

function startCodeBlock(lang) {
    if (lang === "") {
        return "<pre><code>";
    } else {
        return `<pre><code class="${lang} language-${lang}">`;
    }
}

function endCodeBlock() {
    return "</code></pre>\n";
}

function labLink(folder, title) {
    var dashIndex = title.lastIndexOf("-");
    if (dashIndex !== -1) {
        title = title.substring(dashIndex + 1);
    }
    return `<li><a href="./${folder}/index.html">${title}</a></li>\n`;
}

function trimLeftByChar(string, character) {
    const first = [...string].findIndex(char => char !== character);
    return string.substring(first);
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function getCourseTitle(labTitle) {
    var dashIndex = labTitle.lastIndexOf("-");
    if (dashIndex !== -1) {
        return labTitle.substring(0, dashIndex - 1) + " LABS";
    } else {
        return "Course Labs";
    }
}

fs.readdir(folder, { withFileTypes: true }, function(err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    var htmlFolder = path.join(folder, "html");
    if (!fs.existsSync(htmlFolder)) {
        fs.mkdirSync(htmlFolder);
    }

    var labs = {};

    files.forEach(function(dirent) {
        if (dirent.isDirectory() && isNumericName(dirent.name)) {
            fs.readdirSync(folder, function(err, files) {
                if (err) {
                    console.error("Could not list the directory.", err);
                    process.exit(1);
                }
            });

            var readMePath = path.join(folder, dirent.name);
            var readMeFile = path.join(readMePath, FILE_NAME);

            if (fileExists(readMeFile)) {
                var readMeContent = "";
                var title = "Lab " + dirent.name;

                var continousCode = false;
                var firstLine = true;

                var fileContent = fs.readFileSync(readMeFile, "utf8");
                fileContent.split(/\r?\n/).forEach(function(line) {
                    if (firstLine) {
                        if (line.startsWith('#')) {
                            title = trimLeftByChar(line, '#');
                        }
                        firstLine = false;
                        return;
                    }
                    if (line.startsWith('>') || line.startsWith('<')) {
                        var closed = line.startsWith('<');
                        line = line.substring(2).trimRight();
                        var parts = line.split(" ");
                        var language = "shell";
                        if (line.startsWith("mysql>")) {
                            language = "sql";
                        } else if (!(line.startsWith("$") || line.startsWith("#"))) {
                            language = "";
                        }
                        if (parts[1] === "cat") {
                            var fileName = parts[parts.length - 1];
                            if (fileName.startsWith('~')) {
                                fileName = fileName.replace("~/" + dirent.name + "/", '');
                            }
                            var filePath = path.join(readMePath, fileName);
                            if (fileExists(filePath)) {
                                if (continousCode) {
                                    readMeContent += endCodeBlock();
                                    continousCode = false;
                                }
                                var file = fs.readFileSync(filePath, "utf8");
                                var highlightType = "yaml";
                                if (fileName.toLocaleLowerCase().endsWith("dockerfile")) {
                                    highlightType = "dockerfile";
                                } else {
                                    var extensionIndex = fileName.lastIndexOf(".");
                                    if (extensionIndex !== -1) {
                                        var fileExtension = fileName.substring(extensionIndex + 1).toLocaleLowerCase();
                                        if (fileExtension === "repo" || fileExtension === "conf") {
                                            highlightType = "properties";
                                        } else {
                                            highlightType = fileExtension;
                                        }
                                    }
                                }
                                var fileDisplayName = fileName.replace(/\_/g, "\\_").replace(/\-/g, "\\-");
                                var fileTemplate = `\n<details class="cmd-file"><summary>${fileDisplayName} <span class="show-text">&plus;</span></summary>${startCodeBlock(highlightType)}${file}\n${endCodeBlock()}</details>\n\n`;
                                readMeContent += fileTemplate.toString();
                                return;
                            }
                        }
                        if (closed) {
                            if (continousCode) {
                                readMeContent += endCodeBlock();
                                continousCode = false;
                            }
                            readMeContent += `\n<details class="cmd-one-line"><summary>Show command</summary>${startCodeBlock("shell")}${line}\n${endCodeBlock()}</details>\n\n`.toString();
                        } else {
                            if (!continousCode) {
                                readMeContent += startCodeBlock(language);
                                continousCode = true;
                            }
                            readMeContent += line + "\n";
                        }
                    } else {
                        if (continousCode) {
                            readMeContent += endCodeBlock();
                            continousCode = false;
                        }
                        readMeContent += line + "\n";
                    }
                });

                if (continousCode) {
                    readMeContent += endCodeBlock();
                    continousCode = false;
                }
                if (readMeContent !== "") {
                    var html = htmlHead(title) + converter.makeHtml(readMeContent) + HTML_FOOT;
                    var htmlPath = path.join(htmlFolder, dirent.name);
                    if (!fs.existsSync(htmlPath)) {
                        fs.mkdirSync(htmlPath);
                    }
                    fs.writeFile(path.join(htmlPath, ("index.html")), html, function(err) {
                        if (err) {
                            console.error("Could not write an html file", err);
                            process.exit(1);
                        }

                        console.log("Readme html written to " + htmlPath);
                    });
                }

                labs[dirent.name] = title;
            }
        }
    });

    if (labs) {
        var title = getCourseTitle(labs[Object.keys(labs)[0]]);
        var html = `
        <!doctype html><html lang="en">
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <link rel="stylesheet" href="./main.css">
        </head>
        <body>
        <header>
            <div>
                <span>${title}</span>
                <img src="./logo.svg"/>
            </div>
        </header>
        <div class="body">
        <ul class="labs-list">
        `;

        for (var key in labs) {
            html += labLink(key, labs[key]);
        }

        html += "</ul></body></html>";
        fs.writeFile(path.join(htmlFolder, ("index.html")), html, function(err) {
            if (err) {
                console.error("Could not write main index file", err);
                process.exit(1);
            }

            console.log("Main index written to " + htmlFolder);
        });
    }
});