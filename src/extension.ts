import * as vscode from 'vscode';
import axios, { AxiosResponse } from 'axios';

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('wiki-link.search', async () => {
    
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage("Can't insert. No active editor open.");
      return;
    }

    const document = editor.document;
    const selection = editor.selection;

    const word = document.getText(selection);
    
    let response: AxiosResponse;
    try {
      response = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURI(word)}&limit=4&format=json`);
    } catch (e) {
      vscode.window.showInformationMessage(`Search fail`);
      throw e;
    }

    const links = response.data[1].map((title: string, index: string) => ({
      label: title,
      description: response.data[3][index]
    }));

    const pickOption: vscode.QuickPickOptions = {
      canPickMany: false,
      onDidSelectItem: (item: vscode.QuickPickItem) => {
      }
    };

    const selectedItem =
      await vscode.window.showQuickPick<vscode.QuickPickItem>(links, pickOption);
    if (!selectedItem) { return; }
    editor.edit(editBuilder => {
      editBuilder.replace(selection, `[${selectedItem.label}](${selectedItem.description})`);
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }
