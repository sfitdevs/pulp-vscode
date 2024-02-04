const vscode = require("vscode");
const fetch = require("cross-fetch");
const INSTANCE_URL = "https://pulp.deta.dev";

let pulpStatusBar, textEditor;

function getLanguage() {
    let arrayOfPath = textEditor.document.fileName.split("\\");
    let fileName = arrayOfPath[arrayOfPath.length - 1].split(".");

    if (fileName.length < 2) return "txt"
    return fileName[fileName.length - 1];
}

function getText() {
    let selectedText = textEditor.document.getText(textEditor.selection);
    let documentText = textEditor.document.getText();

    if (selectedText) return selectedText
    return documentText;
}

function handleButtonSelected(selected, data) {
    if (selected == "copy") {
        vscode.env.clipboard.writeText(data);
    } else if (selected == "open") {
        vscode.env.openExternal(vscode.Uri.parse(data));
    }
}

function showError(message) {
    vscode.window.showErrorMessage(message || "something unexpected happened!");
}

async function showMessage(message, buttons, data) {
    let selected = await vscode.window.showInformationMessage(message, ...buttons);
    handleButtonSelected(selected, data);
}

async function createPulp() {
    textEditor = vscode.window.activeTextEditor;
    let content = getText();
    if (!content) return showError("error: editor is empty!");
    let language = getLanguage();
    let options = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, language }) };
    let response = await fetch(`${INSTANCE_URL}/api`, options);

    if (!response.ok) return showError("error: internal server error");

    let resJson = await response.json();
    await showMessage(`pulp created successfully - ${resJson.key}.${resJson.language}`, ["open", "copy"], `${INSTANCE_URL}/${resJson.key}`);
}

function updateStatusBarItem() {
    if (!textEditor) pulpStatusBar.hide();
    pulpStatusBar.text = `$(file-add) Pulp`;
    pulpStatusBar.show();
}

function activate({ subscriptions }) {
    subscriptions.push(vscode.commands.registerCommand("pulp.create", createPulp));
    pulpStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    pulpStatusBar.command = "pulp.create";
    subscriptions.push(pulpStatusBar);
    updateStatusBarItem();
    subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
