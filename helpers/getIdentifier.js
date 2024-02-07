// convert a file extension to a valid language identifier
// https://code.visualstudio.com/docs/languages/identifiers

// todo: add all identifiers (currently only common & popular languages are added)
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

module.exports = (extension) => {
    let match = identifierList.find((identifier) => {
        return identifier.extension == extension;
    })

    return match.identifier || "plaintext";
}
