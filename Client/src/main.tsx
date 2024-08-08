import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import theme from "./components/theme";
import "./index.css";
import { UserProvider } from "./contexts/UserContext";
import { signUpCredentials } from "./services/users";

const Root = () => {
  const loggedInUser: signUpCredentials | null = null;
  return (
    <UserProvider user={loggedInUser}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </UserProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Root />
);
