import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './app/app';
import Home from './app/home';
import { PokemonDetail } from './app/pokemon-detail';
import { environment } from './environments/environment';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="pokemon">
            <Route path=":id" element={<PokemonDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

function setEnvironment() {
  (window as any).env = {
    supabaseApiUrl: environment.supabaseApiUrl,
    supabaseApiKey: environment.supabaseApiKey,
  };
}

setEnvironment();
