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

    let keyword = word.trim();
    let links = await searchWikiLinksWithProgressIndicator(keyword); 

    while (links.length === 0) {
      const newKeyword = await getKeywordFromInputBox(keyword);
      if (newKeyword !== undefined) {
        keyword = newKeyword.trim();
        links = await searchWikiLinksWithProgressIndicator(keyword);
      } else {
        return;
      }
    }

    const selectedItem = await selectLinksFromList(links);
    if (!selectedItem) { return; }
    editor.edit(editBuilder => {
      editBuilder.replace(selection, `[${word}](${selectedItem.description})`);
    });
  });

  context.subscriptions.push(disposable);
}

async function getKeywordFromInputBox(prevKeyword: string) {
  const inputOption: vscode.InputBoxOptions = {
    prompt: prevKeyword !== "" ? 
      `Can't find links of keyword ${prevKeyword}, try with a new keyword?` :
      `Try with a new keyword?`
  };
  return await vscode.window.showInputBox(inputOption);
}

async function selectLinksFromList(links: vscode.QuickPickItem[]) {
  const pickOption: vscode.QuickPickOptions = {
    canPickMany: false,
    onDidSelectItem: (item: vscode.QuickPickItem) => {
    }
  };

  return await vscode.window.showQuickPick<vscode.QuickPickItem>(links, pickOption);
}

async function searchWikiLinks(keyWord: string): Promise<vscode.QuickPickItem[]> {
  if (keyWord === "") {return [];}

  const config = vscode.workspace.getConfiguration('wikilink');
  const linkNum = config.get("linknum");

  let response: AxiosResponse;
  let links: vscode.QuickPickItem[];
  try {
    response = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURI(keyWord)}&limit=${linkNum}&format=json`
    );
    links = response.data[1].map((title: string, index: string) => ({
      label: title,
      description: response.data[3][index]
    }));
  } catch (e) {
    vscode.window.showInformationMessage(`Search fail`);
    return [];
  }

  return links;
}

async function searchWikiLinksWithProgressIndicator(keyWord: string) {
  return await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    cancellable: false,
    title: 'Loading wiki links'
  }, async (progress) => {
    progress.report({ increment: 0 });
    const links = await searchWikiLinks(keyWord);
    progress.report({ increment: 100 });
    return links;
  });
}

export function deactivate() { }
