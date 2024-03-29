const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

// • Extension Optional Settings • 
const settings = vscode.workspace.getConfiguration("c64opcodes");
const useC64Font = settings.get("useC64Font");
const useC64SidePanel = settings.get("useSidePanel");

let extensionContext;

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Function activate ●                             │
//  │                                                                              │
//  │            • This Method is Called When Extension is Activated •             │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function activate(context) {

    // • Track currently webview panel • 
    extensionContext = context;
    let webviewPanel = undefined;
    context.subscriptions.push(vscode.commands.registerCommand('c64opcodes.openOpcodesList', () => {
        if (webviewPanel) {
            webviewPanel.dispose();
        };
        if (useC64SidePanel) {
            // • Create a new panel in side panel • 
            webviewPanel = vscode.window.createWebviewPanel('c64opcodes', 'C64 Opcodes', vscode.ViewColumn.Beside, {
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'html'))],
                enableScripts: true,
                enableFindWidget: true,
            });
            //            console.log("col 2");
        } else {
            // • Create a new panel in current column • 
            webviewPanel = vscode.window.createWebviewPanel('c64opcodes', 'C64 Opcodes', vscode.ViewColumn.Active, {
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'html'))],
                enableScripts: true,
                enableFindWidget: true,
            });
            //            console.log("col 1");
        }

        // Use a nonce to only allow a specific script to be run.
        // const nonce = getNonce();
        //---------------------------------------------

        // • Get Uri to load script in the webview • 
        const scriptUri = getUri("main.js", webviewPanel);

        // • Get Uri to load C64 Font into webview • 
        const fontc64opcodesUri = getUri("c64font.ttf", webviewPanel);

        // • Get Uri to load styles into webview • 
        const stylesc64opcodesUri = getUri("c64opcodes.css", webviewPanel);

        // • Get Uri to load styles into webview • 
        const imgc64screenUri = getUri("c64_mainscreen.gif", webviewPanel);

        // • Get word under cursor for (name).html file • 
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);
        let wordText = editor.document.getText(wordRange);
        let lowWordText = wordText.toLowerCase(); // Convert to lower case for comparison
        let highWordText = wordText.toUpperCase(); // Convert to Upper case for Title
        // • Correct page title text for duplicate opcodes • 
        if (highWordText === 'ASO') {
            highWordText = 'ASO (SLO)';
            lowWordText = 'slo';
        }
        if (highWordText === 'SLO') {
            highWordText = 'SLO (ASO)';
        }
        if (highWordText === 'LSE') {
            highWordText = 'LSE (SRE)';
            lowWordText = 'sre';
        }
        if (highWordText === 'SRE') {
            highWordText = 'SRE (LSE)';
        }
        if (highWordText === 'SAX') {
            highWordText = 'SAX (AXS AAX)';
        }
        if (highWordText === 'AAX') {
            highWordText = 'AAX (SAX AXS)';
            lowWordText = 'sax';
        }
        if (highWordText === 'AXS') {
            highWordText = 'AXS (SAX AAX)';
            lowWordText = 'sax';
        }
        if (highWordText === 'DCM') {
            highWordText = 'DCM (DCP)';
            lowWordText = 'dcp';
        }
        if (highWordText === 'DCP') {
            highWordText = 'DCP (DCM)';
        }
        if (highWordText === 'ISC') {
            highWordText = 'ISC (ISB INS)';
        }
        if (highWordText === 'ISB') {
            highWordText = 'ISB (ISC INS)';
            lowWordText = 'isc';
        }
        if (highWordText === 'INS') {
            highWordText = 'INS (ISB ISC)';
            lowWordText = 'isc';
        }
        if (highWordText === 'ALR') {
            highWordText = 'ALR (ASR)';
        }
        if (highWordText === 'ASR') {
            highWordText = 'ASR (ALR)';
            lowWordText = 'alr';
        }
        if (highWordText === 'ANE') {
            highWordText = 'ANE (XAA)';
        }
        if (highWordText === 'XAA') {
            highWordText = 'XXA (ANE)';
            lowWordText = 'ane';
        }
        if (highWordText === 'USBC') {
            highWordText = 'USBC (SBC2 SBC)';
        }
        if (highWordText === 'SBC2') {
            highWordText = 'SBC2 (USBC SBC)';
            lowWordText = 'usbc';
        }
        if (highWordText === 'LAS') {
            highWordText = 'LAS (LAR LAE)';
        }
        if (highWordText === 'LAR') {
            highWordText = 'LAR (LAS LAE)';
            lowWordText = 'las';
        }
        if (highWordText === 'LAE') {
            highWordText = 'LAE (LAS LAR)';
            lowWordText = 'las';
        }
        if (highWordText === 'JAM') {
            highWordText = 'JAM (KIL HLT)';
        }
        if (highWordText === 'KIL') {
            highWordText = 'KIL (JAM HLT)';
            lowWordText = 'jam';
        }
        if (highWordText === 'HLT') {
            highWordText = 'HLT (JAM KIL)';
            lowWordText = 'jam';
        }
        if (highWordText === 'SHA') {
            highWordText = 'SHA (AXA AHX)';
        }
        if (highWordText === 'AXA') {
            highWordText = 'AXA (SHA AHX)';
            lowWordText = 'sha';
        }
        if (highWordText === 'AHX') {
            highWordText = 'AHX (SHA AXA)';
            lowWordText = 'sha';
        }
        if (highWordText === 'SHX') {
            highWordText = 'SHX (A11 SXA XAS)';
        }
        if (highWordText === 'A11') {
            highWordText = 'A11 (SHX SXA XAS)';
            lowWordText = 'shx';
        }
        if (highWordText === 'SXA') {
            highWordText = 'SXA (SHX A11 XAS)';
            lowWordText = 'shx';
        }
        if (highWordText === 'XAS') {
            highWordText = 'XAS (SHX A11 SXA)';
            lowWordText = 'shx';
        }
        if (highWordText === 'SHY') {
            highWordText = 'SHY (A11 SYA SAY)';
        }
        if (highWordText === 'SYA') {
            highWordText = 'SYA (SHY A11 SAY)';
            lowWordText = 'shy';
        }
        if (highWordText === 'SAY') {
            highWordText = 'SAY (SHY A11 SYA)';
            lowWordText = 'shy';
        }
        if (highWordText === 'TAS') {
            highWordText = 'TAS (SHS)';
        }
        if (highWordText === 'SHS') {
            highWordText = 'SHS (TAS)';
            lowWordText = 'tas';
        }

        // • If word is opcode then display its html page in webview • 
        if (lowWordText.match(/^(adc|and|asl|bcc|bcs|beq|bit|bmi|bne|bpl|brk|bvc|bvs|clc|cld|cli|clv|cmp|cpx|cpy|dec|dex|dey|eor|inc|inx|iny|jmp|jsr|lda|ldx|ldy|lsr|nop|ora|pha|php|pla|plp|rol|ror|rti|rts|sbc|sec|sed|sei|sta|stx|sty|tax|tay|tsx|txa|txs|tya|a11|aax|ahx|alr|anc|anc2|ane|arr|aso|asr|axa|axs|dcm|dcp|hlt|illegalnop|ins|isb|isc|jam|kil|lae|lar|las|lax|lse|lxa|rla|rra|sax|say|sbc2|sbx|sha|shs|shx|shy|slo|sre|sxa|sya|tas|usbc|xas)$/)) {
            // • Local path to html file • 
            const htmlFilePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'html', lowWordText + '.html'));
            var localhtml = fs.readFileSync(htmlFilePath.fsPath, 'utf8').toString();
            localhtml = localhtml.replace('${stylesc64opcodesUri}', stylesc64opcodesUri.toString());
            localhtml = localhtml.replace('${scriptUri}', scriptUri.toString());
            // localhtml = localhtml.replace('${nonce}', nonce);
            if (useC64Font) {
                localhtml = localhtml.replace('/*C64FONT*/', '@font-face {\nfont-family: c64font;\nsrc: url("${fontc64opcodesUri}");\n}\np {\nfont-family: c64font;\n}');
            }
            localhtml = localhtml.replace('${imgc64screenUri}', imgc64screenUri.toString());
            localhtml = localhtml.replace('${fontc64opcodesUri}', fontc64opcodesUri.toString());
            // console.log(localhtml);
            webviewPanel.webview.html = localhtml;
            webviewPanel.title = 'C64 Opcodes - ' + highWordText;
            // • Otherwise display Home Page • 
        } else {
            const htmlFilePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'html', 'index.html'));
            var localhtml = fs.readFileSync(htmlFilePath.fsPath, 'utf8').toString();
            localhtml = localhtml.replace('${stylesc64opcodesUri}', stylesc64opcodesUri.toString());
            localhtml = localhtml.replace('${scriptUri}', scriptUri.toString());
            // localhtml = localhtml.replace('${nonce}', nonce);
            localhtml = localhtml.replace('${imgc64screenUri}', imgc64screenUri.toString());
            webviewPanel.webview.html = localhtml;
            webviewPanel.title = 'C64 Opcodes - Welcome';
        };

        // • Reset when the current panel is closed • 
        webviewPanel.onDidDispose(() => {
            webviewPanel = undefined;
        }, null, context.subscriptions);

        // • Display User Selected Page on Button Clicked • 
        webviewPanel.webview.onDidReceiveMessage(message => {
            if (webviewPanel) {
                const filePath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'html', message.command + '.html'));
                var localhtml = fs.readFileSync(filePath.fsPath, 'utf8').toString();
                localhtml = localhtml.replace('${stylesc64opcodesUri}', stylesc64opcodesUri.toString());
                localhtml = localhtml.replace('${scriptUri}', scriptUri.toString());
                // localhtml = localhtml.replace('${nonce}', nonce);
                if (message.command != 'index') {
                    if (useC64Font) {
                        localhtml = localhtml.replace('/*C64FONT*/', '@font-face {\nfont-family: c64font;\nsrc: url("${fontc64opcodesUri}");\n}\np {\nfont-family: c64font;\n}');
                    }
                };
                localhtml = localhtml.replace('${imgc64screenUri}', imgc64screenUri.toString());
                localhtml = localhtml.replace('${fontc64opcodesUri}', fontc64opcodesUri.toString());
                webviewPanel.webview.html = localhtml;
                webviewPanel.title = 'C64 Opcodes - ' + message.pageTitle;
            }
        }, undefined, context.subscriptions);
    }));
}

// function getOpcodeHomeContent() {
//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>C64 Opcodes List Internal HTML</title>
// </head>
// <body>
//    <h1>Show Opcode List</h1>
//    <button class="button button1">Green</button>
//    <button class="button button2">Blue</button>
//    <img src="src/html/c64_mainscreen.gif"/>
//    <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
//   </body>
// </html>`;
// }

// function getNonce() {
// 	let text = '';
// 	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// 	for (let i = 0; i < 32; i++) {
// 		text += possible.charAt(Math.floor(Math.random() * possible.length));
// 	}
// 	return text;
// }
// this method is called when your extension is deactivated

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                             ● Function getUri ●                              │
//  │                                                                              │
//  │             • Get the Webview-Compliant URI for the Resources  •             │
//  │                                                                              │
//  │                   • CSS, Images, Font and Main.js Script •                   │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function getUri(filename,panel) {
    const onDiskPath = vscode.Uri.file(
      path.join(extensionContext.extensionPath, "src", "html", filename)
    );
    const src = panel.webview.asWebviewUri(onDiskPath);
    return src;
}

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                           ● Function deactivate ●                            │
//  │                                                                              │
//  │           • This Method is Called When Extension is Deactivated •            │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function deactivate() {};

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                              ● Export modules ●                              │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
module.exports = {
    activate,
    deactivate
};