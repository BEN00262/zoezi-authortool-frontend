import {Container} from "semantic-ui-react";
import ContentPage from "./components/ContentPage";
import SideMenu from "./components/SideMenu"

import PaperProvider from "./context/paperContext";

function MainPage() {
  return (
    <PaperProvider>
      <SideMenu/>
      <Container>
        <ContentPage/>
      </Container>
    </PaperProvider>
  );
}

export default MainPage;