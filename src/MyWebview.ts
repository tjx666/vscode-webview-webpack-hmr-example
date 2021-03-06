import vscode from 'vscode';

export default class MyWebview {
    public static readonly viewType = 'vscode-webview-webpack-hmr-example';
    public static currentPanel: MyWebview | undefined;

    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private readonly disposables: vscode.Disposable[] = [];
    private html = '';

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (MyWebview.currentPanel) {
            MyWebview.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            MyWebview.viewType,
            MyWebview.viewType,
            column ?? vscode.ViewColumn.One,
            getWebviewOptions(extensionUri),
        );

        MyWebview.currentPanel = new MyWebview(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.panel = panel;
        this.extensionUri = extensionUri;

        this.setupHtmlForWebview();

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case 'reload':
                        // 方法一：
                        // 需要修改 html 内容才会 relaod，所以每次都替换了 script 的 nonce 为一个随机字符串
                        this.html = this.html.replace(/nonce="\w+?"/, `nonce="${getNonce()}"`);
                        this.panel.webview.html = this.html;
                        // 方法二：注意使用这个命令会刷新所有打开的 webview
                        // vscode.commands.executeCommand('workbench.action.webview.reloadWebviewAction');
                        // https://stackoverflow.com/questions/38634125/how-to-refresh-images-in-html-preview
                        return;
                }
            },
            null,
            this.disposables,
        );
    }

    private setupHtmlForWebview() {
        const webview = this.panel.webview;
        const localPort = 3000;
        const localServerUrl = `localhost:${localPort}`;
        const scriptRelativePath = 'webview.js';
        const scriptUri = `http://${localServerUrl}/${scriptRelativePath}`;
        const nonce = getNonce();

        this.html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${MyWebview.viewType}</title>
    </head>
    <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
</html>`;
        webview.html = this.html;
    }

    public dispose() {
        MyWebview.currentPanel = undefined;

        this.panel.dispose();

        while (this.disposables.length > 0) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
    return {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
    };
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
