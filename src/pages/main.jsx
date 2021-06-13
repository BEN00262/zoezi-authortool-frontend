import {Container} from "semantic-ui-react";
import ContentPage from "./components/ContentPage";

import PaperProvider from "./context/paperContext";

function MainPage() {
  return (
    <PaperProvider>
      {/* <Container> */}
        <ContentPage/>
      {/* </Container> */}
    </PaperProvider>
  );
}

export default MainPage;