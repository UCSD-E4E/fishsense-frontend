import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { FluentProvider, useThemeClassName, webLightTheme } from '@fluentui/react-components';

import './App.scss';
import router from './router';
import MainNav from './components/main-nav-component';

function ApplyToBody() {
  const classes = useThemeClassName();

  useEffect(() => {
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
      <MainNav />

      <RouterProvider router={router} />
    </FluentProvider>);
}

export default App;
