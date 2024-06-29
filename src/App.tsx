import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { FluentProvider, useThemeClassName, webLightTheme } from '@fluentui/react-components';

import './App.scss';
import router from './router';

function ApplyToBody() {
  const classes = useThemeClassName();

  React.useEffect(() => {
    const classList = classes.split(" ");
    document.body.classList.add(...classList);

    return () => document.body.classList.remove(...classList);
  }, [classes]);

  return null;
}

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <ApplyToBody />
      
      <div className='app-container'>
        <RouterProvider router={router} />
      </div>
    </FluentProvider>);
}

export default App;
