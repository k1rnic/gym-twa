import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

import { initTgMiniApp } from '@/shared/lib/telegram';

const root = ReactDOM.createRoot(document.getElementById('root')!);

try {
  await initTgMiniApp();

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (e) {
  root.render(<>Unsupported...:(</>);
}
