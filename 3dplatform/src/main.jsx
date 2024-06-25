

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://cb7382e0c05b60648e7c6ba87eaca79b@o4507091120619520.ingest.us.sentry.io/4507103745146880",
    // integrations: [new Sentry.BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);


