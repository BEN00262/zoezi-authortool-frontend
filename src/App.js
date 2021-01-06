import 'semantic-ui-css/semantic.min.css'
import {Container} from "semantic-ui-react";
import {BrowserRouter,Route,Switch} from "react-router-dom";

import ContentPage from "./components/ContentPage";
import PaperProvider from "./context/paperContext";
import LoginForm from './pages/login';
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
        <PaperProvider>
          <Container>
            <Switch>
              <Route exact path="/">
                <LoginForm/>
              </Route>
              <ProtectedRoute path="/dashboard" component={ContentPage}/>
            </Switch>
          </Container>
        </PaperProvider>
    </BrowserRouter>
  );
}

export default App;
