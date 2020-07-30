// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('wiki-link.search', async () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    
    const inputBoxOptions: vscode.InputBoxOptions = {
      placeHolder: "search wiki"
    };

    const search = await vscode.window.showInputBox(inputBoxOptions);
    if (!search) {
      return;
    }
    const response = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURI(search)}&limit=4&format=json`);
    vscode.window.showQuickPick(response.data[1]);
    vscode.window.showInformationMessage(search);
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
