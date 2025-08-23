import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from "./authConfig";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <AuthProvider authConfig={authConfig} loadingComponent={<div>Loading...</div>}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  );
}
