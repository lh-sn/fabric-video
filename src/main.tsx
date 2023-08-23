import { ChakraProvider } from "@chakra-ui/react";
import { TimerProvider } from "@layerhub-io/use-timer";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <TimerProvider>
      <App />
    </TimerProvider>
  </ChakraProvider>
);
