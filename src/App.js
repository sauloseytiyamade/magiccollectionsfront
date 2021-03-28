import Router from './Routes'
import {AuthProvider} from './utils/auth'
import HttpsRedirect from 'react-https-redirect'


function App() {
  return (
    <div className="App">
      <AuthProvider>
          <Router />
      </AuthProvider>
    </div>
  );
}

export default App;
