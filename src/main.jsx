import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { clearStoredPortfolio } from "./storage.js";
import "./styles.css";

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-error">
          <p>Portfolio Studio could not start.</p>
          <h1>{this.state.error.message}</h1>
          <button
            onClick={async () => {
              await clearStoredPortfolio();
              window.location.reload();
            }}
          >
            Reset saved portfolio and reload
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
);
