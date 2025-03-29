import React from 'react';
import { __DEVELOPMENT__ } from '@frontend/common/build-defined';

import { createRoot } from 'react-dom/client';

export default function renderer(rootName, App: React.FC) {

  document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById(rootName);

    if (!container) {
      console.error(`Cannot find root element ${rootName}`);
      return;
    }


    if (__DEVELOPMENT__) {
      // The following options allow you to reload the entire page when changes are made. 
      // HMR allows you to reload only the necessary components but this does not work correctly for css/sass/scss which are built together with Pug.
      const options = {
        reload: true
      };
      const hmr = await import('webpack-hot-middleware/client');
      hmr.setOptionsAndConnect(options);

      hmr.subscribeAll((obj) => {
        if (obj.action === 'built')
          location.reload();
      });

      if (import.meta.webpackHot) {
        console.log('Accepting hot middleware');
        const webpackHot = import.meta.webpackHot;
        webpackHot.accept();
      }
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>);
    } else {
      const root = createRoot(container);
      root.render(<App />);
    }
  });
};
