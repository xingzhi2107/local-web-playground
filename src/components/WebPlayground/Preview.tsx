import React, {CSSProperties, PureComponent} from 'react';
import styles from './index.module.scss';

interface Props {
    hideConsole?: boolean;
    hideWeb?: boolean;
}

interface State {}


export class Preview extends PureComponent<Props, State> {
    private iframeRef = React.createRef<HTMLIFrameElement>();
    private consoleRef = React.createRef<HTMLUListElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            logItems: [],
        }
    }

    render() {
        const {hideWeb} = this.props;
        const iframeStyles: CSSProperties = {};
        if (hideWeb) {
            iframeStyles.display = 'none';
        }

        return (
            <div className={styles.preview_area}>
                <iframe ref={this.iframeRef} style={iframeStyles}></iframe>
                {this.renderConsole()}
            </div>
        );
    }

    renderConsole() {
        if (this.props.hideConsole) {
            return null;
        }

        return (
            <div className={styles.console}>
                <span>{'Console'}</span>
                <ul ref={this.consoleRef}>
                </ul>
            </div>
        );
    }

    run = (html: string, css: string, javascript: string) => {
        this.clearConsole();
        const iframe = this.iframeRef.current;
        if (!iframe) {
            return;
        }
        this.attachConsole(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) {
            return;
        }

        doc.open()
        doc.write(this.generateHtmlResult(html, css, javascript));
        doc.close();
    }

    private generateHtmlResult = (html: string, css: string, js: string) => {
        return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, inital-scale=1.0" />
<title></title>
<style type="text/css">
${css}
</style>
</head>
<body>
${html}
<script type="text/javascript">
(function() {
${js}
})();
</script>
</body>
</html>`;
    }


    private clearConsole = () => {
        if (this.consoleRef.current) {
            this.consoleRef.current.innerHTML = "";
        }
    }

    private attachConsole = (iframe: HTMLIFrameElement) => {
        if (this.props.hideConsole) {
            return;
        }

        const methods = ['log', 'debug', 'warn', 'error', 'info'];
        methods.forEach((method) => {
            if (!iframe.contentWindow) {
                return;
            }
            (iframe.contentWindow as any).console[method] = (rawContent: any) => {
                if (!this.consoleRef.current) {
                    return;
                }

                let content = '';
                switch (typeof rawContent) {
                    case "number":
                    case "string":
                    case "undefined":
                    case "symbol":
                    case "boolean":
                        content = rawContent?.toString() || "undefined";
                        break;
                    case "bigint":
                        content = rawContent.toString() + 'n';
                        break;
                    case "object":
                        content = '[object Object]'
                        break;
                    case "function":
                        content = `[Function: ${rawContent?.name}]`
                        break;
                    default:
                        throw Error('Unknown value to print: ' + rawContent);
                }

                const outputEl = document.createElement('li');
                outputEl.innerHTML = '> ' + content;
                this.consoleRef.current.appendChild(outputEl);
            }
        });
    }

}
