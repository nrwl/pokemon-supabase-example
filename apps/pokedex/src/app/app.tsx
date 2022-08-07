// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import NxWelcome from './nx-welcome';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  BrowserRouter,
  Outlet,
} from 'react-router-dom';

export function App() {
  return <Outlet />;
}

export default App;
