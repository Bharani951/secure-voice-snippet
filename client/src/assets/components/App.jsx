import { BrowserRouter as Router } from 'react-router-dom';
import '../App.css';
import { AuthProvider } from '../context/AuthContext';
import { SnippetProvider } from '../context/SnippetContext';
import AppRoutes from '../../routes';
import Header from './Header';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SnippetProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
          </div>
        </SnippetProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;