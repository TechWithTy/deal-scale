import React from "react";
import ReactDOM from "react-dom/client";
import PreviewApp from "../../vite-preview/src/preview-app";
import "../../../src/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element #root was not found in index.html.");
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<PreviewApp />
	</React.StrictMode>,
);

