import React from 'react';
// import ReactDOM from 'react-dom/client';

import {AttachHugoArticleWorker} from './components/AttachHugoArticle';
// import {ExamplePage} from "./ExamplePage/ExamplePage";

window.addEventListener('load', () => {
    new AttachHugoArticleWorker().attach();
})


// const root = ReactDOM.createRoot(
//     document.getElementById('root') as HTMLElement
// );
// root.render(
//     <ExamplePage />
// );
