import 'semantic-ui-css/semantic.min.css'
import {Container} from "semantic-ui-react";
import {BrowserRouter,Route,Switch} from "react-router-dom";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import ContentPage from "./components/ContentPage";
import PaperProvider from "./context/paperContext";
import LoginForm from './pages/login';
import ProtectedRoute from "./routes/ProtectedRoute";
import Analytics from './components/analytics';
import Notifications from './components/Notifications';
import SocketWatcher from './components/SocketWatcher';
import AuthorManagement from './pages/authorManagement';

function App() {
  return (
    <BrowserRouter>
        <ReactNotification />
        <PaperProvider>
          <Container>
            <SocketWatcher/>
            <Switch>
              <Route exact path="/">
                <LoginForm/>
              </Route>
              <ProtectedRoute path="/dashboard" component={ContentPage}/>
              <ProtectedRoute path="/analytics" component={Analytics}/>
              <ProtectedRoute path="/notifications" component={Notifications}/>
              {/* <ProtectedRoute path="/admin" component={AuthorManagement}/> */}
            </Switch>
          </Container>
        </PaperProvider>
    </BrowserRouter>
  );
}

export default App;