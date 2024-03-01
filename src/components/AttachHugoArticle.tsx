import {EditorConfig, WebPlayground} from './WebPlayground';
import { createRoot } from 'react-dom/client';


function splitBy<T = any>(arr: T[], isDelimiter: (it: T, idx: number) => boolean): T[][] {
    return arr.reduce((rslt: T[][], curr, idx) => {
        if (isDelimiter(curr, idx)) {
            rslt.push([]);
        } else {
            rslt[rslt.length - 1].push(curr);
        }
        return rslt;
    }, [[]]);
}


interface WebPlaygroundRawMeta {
    title?: string;
    ['keep-origin']?: string;
    ['hide-web']?: string;
    ['hide-console']?: string;
    ['editor-default-open']?: string;
}

export class AttachHugoArticleWorker {
    public attach() {
        const article = document.querySelector('article');
        if (!article) {
            return;
        }

        const childNodes = Array.from(article.childNodes) as HTMLElement[];
        const codeElSeqArr = splitBy(childNodes, it => it.className !== 'highlight');

        codeElSeqArr
            .filter(codeElSeq => codeElSeq.length)
            .map(codeElSeq => {
                const codeInfos = codeElSeq.map(codeEl => this.getCodeInfo(codeEl));
                return {
                    title: codeInfos[0].meta?.title,
                    keepOrigin: codeInfos[0].meta?.["keep-origin"] === 'true',
                    hideWeb: 'hide-web' in codeInfos[0].meta ? codeInfos[0].meta["hide-web"] === 'true' : undefined,
                    hideConsole: 'hide-console' in codeInfos[0].meta ? codeInfos[0].meta["hide-console"] === 'true' : undefined,
                    codes: codeInfos,
                    codeElSeq,
                };
            })
            .filter(it => it.title)
            .forEach(it => {
                const lastEl = it.codeElSeq[it.codeElSeq.length - 1];
                const attachEl = document.createElement('div');
                this.insertAfter(lastEl, attachEl);

                const reactRoot = createRoot(attachEl)
                const editors = it.codes.reduce((rslt, curr) => {
                    rslt[curr.language] = {
                        initCode: curr.code,
                        defaultOpen: 'editor-default-open' in curr.meta ? curr.meta['editor-default-open'] === 'true' : !it.keepOrigin,
                    } satisfies EditorConfig;
                    return rslt;
                }, {} as any);
                reactRoot.render(<WebPlayground title={it.title} hideWeb={it.hideWeb} hideConsole={it.hideConsole} editors={editors}/>);

                if (!it.keepOrigin) {
                    it.codeElSeq.forEach(it => {
                        it.parentNode?.removeChild(it);
                    })
                }
            });
    }

    private getCodeInfo(codeRootEl: HTMLElement) {
        const codeEl = codeRootEl.querySelector('code');
        if (!codeEl) {
            throw Error('Invalid code root el');
        }
        const code = codeEl.textContent || '';
        const language = codeEl.getAttribute('data-lang')?.toLowerCase() || '';

        const codeLines = code.trim()
            .split('\n')
            .filter(x => x);
        const metaCommentsList = splitBy(codeLines, line => !this.isMetaCommentLine(language, line));
        const leadMetaComments = metaCommentsList[0];
        let meta: WebPlaygroundRawMeta = {};
        if (leadMetaComments && leadMetaComments.length) {
            meta = leadMetaComments
                .map(line => this.unwrapMetaCommentLine(language, line))
                .map(line => this.parseMetaInfo(line))
                .reduce((rslt, it) => {
                    rslt[it.key] = it.val;
                    return rslt;
                }, {} as any)
        }

        return {
            language,
            code,
            meta,
        }
    }

    private isMetaCommentLine(language: string, line: string) {
        if (!line.includes('pg-')) {
            return false;
        }

        switch (language) {
            case 'html':
                return line.startsWith('<!-- ');
            case 'css':
                return line.startsWith('/* ');
            case 'javascript':
                return line.startsWith('// ');
            default:
                return false;
        }
    }

    private unwrapMetaCommentLine(language: string, line: string) {
        switch (language) {
            case 'html':
                line = line.slice(4);
                line = line.slice(0, line.length - 3);
                return line.trim();
            case 'css':
                line = line.slice(2);
                line = line.slice(0, line.length - 2);
                return line.trim();
            case 'javascript':
            default:
                line = line.slice(2);
                return line.trim();
        }
    }

    private parseMetaInfo(line: string) {
        const matchRslt = line.match(/^pg-([\w\-]+):(.*)$/)
        if (!matchRslt) {
            throw Error('Parse comment meta info failed. Line: ' + line);
        }

        const [_, key, val] = matchRslt;

        return {
            key,
            val: val.trim(),
        }
    }

    private insertAfter(node: HTMLElement, newNode: HTMLElement) {
        node.parentNode?.insertBefore(newNode, node.nextSibling);
    }
}
