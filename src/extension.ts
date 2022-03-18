import vscode, { ExtensionContext } from 'vscode';
import MyWebview from './MyWebview';

export function activate(context: ExtensionContext) {
    console.log(
        'Congratulations, your extension "vscode-webview-webpack-hmr-example" is now active!',
    );

    let disposable = vscode.commands.registerCommand(
        'vscode-webview-webpack-hmr-example.openWebview',
        () => {
            MyWebview.createOrShow(context.extensionUri);
        },
    );

    context.subscriptions.push(disposable);
}
