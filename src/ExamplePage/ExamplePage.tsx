import React, {useEffect} from 'react';
import {AttachHugoArticleWorker} from "../components/AttachHugoArticle";

const page_html = `
<main class="page-content" aria-label="Content">
            <div class="w">
<a href="/">..</a>


<article>
    <p class="post-meta">
        <time datetime="2024-02-29 00:00:00 +0000 UTC">
            2024-02-29
        </time>
    </p>

    <h1>Web Playground Demo</h1>

    

    <h3 id="web-playground-是什么">Web Playground 是什么？</h3>
<p>它可以把浏览器里的代码块渲染成一个可以交互式的 Playground。其原理是依托 Web 环境，在 iframe 里运行 HTML、CSS、JavaScript代码，所以就叫 Web Playground。</p>
<h3 id="基本使用">基本使用</h3>
<p>一般的代码块不会被渲染成 Playground。</p>
<div class="highlight"><pre tabindex="0" style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-javascript" data-lang="javascript"><span style="display:flex;"><span><span style="color:#f92672">&lt;</span><span style="color:#a6e22e">h1</span><span style="color:#f92672">&gt;</span><span style="color:#a6e22e">hello</span>, <span style="color:#a6e22e">world</span><span style="color:#f92672">!&lt;</span><span style="color:#960050;background-color:#1e0010">/h1&gt;</span>
</span></span></code></pre></div><p>当你认为这个代码块可以被执行的时候，在代码的第一行用备注的形式写上一个 Playground 标题。如下：</p>
<div class="highlight"><pre tabindex="0" style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-html" data-lang="html"><span style="display:flex;"><span><span style="color:#75715e">&lt;!-- pg-title: Basic example --&gt;</span>
</span></span><span style="display:flex;"><span>&lt;<span style="color:#f92672">h1</span>&gt;hello, world!&lt;/<span style="color:#f92672">h1</span>&gt;
</span></span></code></pre></div><p><code>pg-title: Basic example</code> 是一个原始的元信息对。它指明 Playground 的标题是 “Basic example”。每个 Playground 的标题是必填的，可以重复。</p>
<p>对于只有 JavaScript 的 Playground，默认只显示 Console</p>
<div class="highlight"><pre tabindex="0" style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-javascript" data-lang="javascript"><span style="display:flex;"><span><span style="color:#75715e">// pg-title: JavaScript example
</span></span></span><span style="display:flex;"><span><span style="color:#75715e"></span><span style="color:#66d9ef">for</span> (<span style="color:#66d9ef">let</span> <span style="color:#a6e22e">i</span> <span style="color:#f92672">=</span> <span style="color:#ae81ff">0</span>; <span style="color:#a6e22e">i</span> <span style="color:#f92672">&lt;</span> <span style="color:#ae81ff">10</span>; <span style="color:#a6e22e">i</span><span style="color:#f92672">++</span>) {
</span></span><span style="display:flex;"><span>  <span style="color:#a6e22e">console</span>.<span style="color:#a6e22e">log</span>(<span style="color:#a6e22e">i</span>);
</span></span><span style="display:flex;"><span>}
</span></span></code></pre></div><h3 id="多个语言块">多个语言块</h3>
<p>当一个 Playground 需要多种语言的时候，只需要连续定义多个语言块。只有第一个语言块需要定义整个 Playground 的元信息。</p>
<div class="highlight"><pre tabindex="0" style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-html" data-lang="html"><span style="display:flex;"><span><span style="color:#75715e">&lt;!-- pg-title: Multiple languages example --&gt;</span>
</span></span><span style="display:flex;"><span>&lt;<span style="color:#f92672">h1</span>&gt;hello&lt;/<span style="color:#f92672">h1</span>&gt;
</span></span></code></pre></div><div class="highlight"><pre tabindex="0" style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-css" data-lang="css"><span style="display:flex;"><span><span style="color:#f92672">h1</span> {
</span></span><span style="display:flex;"><span>    <span style="color:#66d9ef">color</span>: <span style="color:#66d9ef">red</span>;
</span></span><span style="display:flex;"><span>}
</span></span></code></pre></div><h3 id="折叠代码块">折叠代码块</h3>
<p>有时候，我们希望只关注修改某一个语言。尤其是 CSS 的 Playground，可以把其它不重要的代码块默认折叠起来：</p>
<div class="highlight"><pre tabindex="0" style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-html" data-lang="html"><span style="display:flex;"><span><span style="color:#75715e">&lt;!-- pg-title: Multiple languages example --&gt;</span>
</span></span><span style="display:flex;"><span>&lt;<span style="color:#f92672">h1</span>&gt;hello&lt;/<span style="color:#f92672">h1</span>&gt;
</span></span></code></pre></div><div class="highlight"><pre tabindex="0" style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4;"><code class="language-css" data-lang="css"><span style="display:flex;"><span><span style="color:#f92672">h1</span> {
</span></span><span style="display:flex;"><span>    <span style="color:#66d9ef">color</span>: <span style="color:#66d9ef">red</span>;
</span></span><span style="display:flex;"><span>}
</span></span></code></pre></div>
</article>

            </div>
        </main>
`


export const ExamplePage = () => {
    useEffect(() => {
        new AttachHugoArticleWorker().attach();
    }, []);
    return (
        <div dangerouslySetInnerHTML={{__html: page_html}}></div>
    );
}
