import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return <>initialized...</>;
};

export default App;
