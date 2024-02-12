const vscode = require("vscode");
const INSTANCE_URL = "https://pulp.deta.dev";

const identifierList = [
    {
        extension: "js",
        identifier: "javascript"
    },
    {
        extension: "jsx",
        identifier: "javascriptreact"
    },
    {
        extension: "c",
        identifier: "c"
    },
    {
        extension: "cpp",
        identifier: "cpp"
    },
    {
        extension: "java",
        identifier: "java"
    },
    {
        extension: "ts",
        identifier: "typescript"
    },
    {
        extension: "tsx",
        identifier: "typescriptreact"
    },
    {
        extension: "cs",
        identifier: "csharp"
    },
    {
        extension: "css",
        identifier: "css"
    },
    {
        extension: "go",
        identifier: "go"
    },
    {
        extension: "html",
        identifier: "html"
    },
    {
        extension: "json",
        identifier: "json"
    },
    {
        extension: "lua",
        identifier: "lua"
    },
    {
        extension: "php",
        identifier: "php"
    },
    {
        extension: "txt",
        identifier: "plaintext"
    },
    {
        extension: "ps1",
        identifier: "powershell"
    },
    {
        extension: "py",
        identifier: "python"
    },
    {
        extension: "r",
        identifier: "r"
    },
    {
        extension: "rs",
        identifier: "rust"
    },
    {
        extension: "scss",
        identifier: "scss"
    },
    {
        extension: "rb",
        identifier: "ruby"
    },
    {
        extension: "swift",
        identifier: "swift"
    },
    {
        extension: "sql",
        identifier: "sql"
    },
    {
        extension: "vue",
        identifier: "vue"
    },
    {
        extension: "yaml",
        identifier: "yaml"
    },
    {
        extension: "xml",
        identifier: "xml"
    },
]

let pulpStatusBar, textEditor;

function getIdentifier(extension) {
    let match = identifierList.find((identifier) => {
        return identifier.extension == extension;
    })

    return match?.identifier || "plaintext";
}


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
    let content = getText();
    if (!content) return showError("error: editor is empty!");
    let language = getLanguage();
    let options = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, language }) };
    let response = await fetch(`${INSTANCE_URL}/api`, options);

    if (!response.ok) return showError("error: internal server error");

    let resJson = await response.json();
    await showMessage(`pulp created successfully - ${resJson.key}.${resJson.language}`, ["open", "copy"], `${INSTANCE_URL}/${resJson.key}`);
}

async function openPulp() {
    const code = await vscode.window.showInputBox({
        placeHolder: '5-digit code for the pulp, ex: wdiex',
        validateInput: text => {
            return text.length == 5 ? null : "code must be 5-digit long.";
        }
    });

    if (!code) return;
    let response = await fetch(`${INSTANCE_URL}/api/${code}`);

    if (!response.ok) return showError("error: pulp not found");

    let { content, language: extension } = await response.json();
    const document = await vscode.workspace.openTextDocument({ content, language: getIdentifier(extension) });
    await vscode.window.showTextDocument(document);
}

function updateStatusBarItem(editor) {
    textEditor = editor;
    if (!textEditor) {
        pulpStatusBar.text = "$(file-code) Pulp";
        pulpStatusBar.tooltip = "Open a file from pulp"
        pulpStatusBar.command = "pulp.open";
    } else {
        pulpStatusBar.text = "$(file-add) Pulp";
        pulpStatusBar.tooltip = "Create a pulp of current text editor"
        pulpStatusBar.command = "pulp.create";
    }
}

function activate({ subscriptions }) {
    subscriptions.push(vscode.commands.registerCommand("pulp.create", createPulp));
    subscriptions.push(vscode.commands.registerCommand("pulp.open", openPulp));
    pulpStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    subscriptions.push(pulpStatusBar);
    updateStatusBarItem(vscode.window.activeTextEditor);
    pulpStatusBar.show();
    subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
