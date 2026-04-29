import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";

// Import the main app component
import Home from "./pages/Home.tsx";
import Error404 from "./pages/Error404.tsx";
import Characters from "./pages/Characters.tsx";
import Connexion from "./pages/Connexion.tsx";
import UserManager from "./pages/UserManager.tsx";

const router = createBrowserRouter([
	{
		element: <App />, // Renders the App component for the home page
		children: [
			{
				path: "/characters",
				element: <Characters />,
			},
			{
				path: "/connexion",
				element: <Connexion />,
			},
			{
				path: "/",
				element: <Home />,
				errorElement: <Error404 />,
			},
			{
				path: "/userManager",
				element: (
					//					<ProtectedRoute requiredRole="fullAdmin">
					<UserManager />
					//					</ProtectedRoute>
				),
			},
		],
	},
]);

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
	throw new Error(`Your HTML Document must contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
