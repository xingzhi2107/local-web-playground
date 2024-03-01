import React, {PureComponent} from 'react';
import Editor from '@monaco-editor/react';
import {Preview} from './Preview';

import styles from './index.module.scss';
import {editor} from "monaco-editor";

const Languages = ['html', 'css', 'javascript'] as const;
type LanguagesIndex = (typeof Languages)[number];

export interface EditorConfig {
    initCode: string;
    defaultOpen?: boolean;
    hide?: boolean;
}

interface WebPlaygroundProps {
    title?: string;
    autoRun?: boolean;
    editors: Partial<Record<LanguagesIndex, EditorConfig>>
    hideConsole?: boolean;
    hideWeb?: boolean;
}

interface State {
}

export class WebPlayground extends PureComponent<WebPlaygroundProps, State> {
    private previewRef = React.createRef<Preview>();
    private editorAreaRef = React.createRef<HTMLDivElement>();
    private editors: Record<LanguagesIndex, null | editor.IStandaloneCodeEditor> = {
        html: null,
        css: null,
        javascript: null,
    };

    private codes = {
        javascript: '',
        css: '',
        html: '',
    }

    constructor(props: WebPlaygroundProps) {
        super(props);

        this.state = {}

        Languages.forEach(lang => {
            this.codes[lang] = props.editors[lang]?.initCode || '';
        })
    }

    get hideWeb() {
        const {hideWeb, editors} = this.props;
        if (hideWeb === undefined) {
            return !editors.css && !editors.html;
        } else {
            return hideWeb;
        }
    }

    get hideConsole() {
        const {hideConsole, editors} = this.props;
        if (hideConsole === undefined) {
            return !editors.javascript;
        } else {
            return hideConsole;
        }
    }

    componentDidMount() {
        if (this.props.autoRun) {
            this.run();
        }
    }

    render() {
        return (
            <div className={styles.root}>
                {this.renderEditorsArea()}
                <Preview ref={this.previewRef} hideWeb={this.hideWeb} hideConsole={this.hideConsole} />
            </div>
        );
    }

    renderEditorsArea() {
        const {editors} = this.props;
        const editorEls = Object.entries(editors).map(([language, conf]) => this.renderEditorItem(language as LanguagesIndex, conf));
        const title = this.props.title ? `Playground - ${this.props.title}` : 'Playground';
        return (
            <div className={styles.editors_area} ref={this.editorAreaRef}>
                <aside>
                    <span className={styles.title}>{title}</span>
                    <div className={styles.actions}>
                        <button onClick={this.run}>{'Run'}</button>
                        <button onClick={this.reset}>{'Reset'}</button>
                    </div>
                </aside>
                {editorEls}
            </div>
        );
    }

    renderEditorItem(language: LanguagesIndex, conf: EditorConfig) {
        if (conf.hide) {
            return null;
        }

        return (
            <details key={language} className={`${styles.editor_item} ${language}`} open={conf.defaultOpen}>
                <summary>{language}</summary>
                <Editor
                    height={(conf.initCode.split('\n').length + 1) * 18}
                    defaultLanguage={language}
                    defaultValue={conf.initCode}
                    onChange={(val) => {
                        this.codes[language] = val || '';
                    }}
                    options={{
                        minimap: {enabled: false,},
                    }}
                    onMount={(editor, monaco) => {
                        this.editors[language] = editor;
                    }}
                />
            </details>
        );
    }

    run = () => {
        const {javascript, css, html} = this.codes;
        this.previewRef.current?.run(html, css, javascript);
    }

    reset = () => {
        Languages.forEach(lang => {
            const initCode = this.props.editors[lang]?.initCode || '';
            this.codes[lang] = initCode;
            this.editors[lang]?.getModel()?.setValue(initCode);
        })
        this.previewRef.current?.run('', '', '');
    }
}
