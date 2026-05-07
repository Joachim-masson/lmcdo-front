import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";

// Import the main app component
import Characters from "./pages/Characters.tsx";
import Connexion from "./pages/Connexion.tsx";
import Contact from "./pages/Contact.tsx";
import Error404 from "./pages/Error404.tsx";
import Home from "./pages/Home.tsx";
import LegalNotice from "./pages/LegalNotice.tsx";
import Rgpd from "./pages/Rgpd.tsx";
import UserManager from "./pages/UserManager.tsx";

const router = createBrowserRouter([
	{
		element: <App />, // Renders the App component for the home page
		children: [
			{
				path: "/",
				element: <Home />,
				errorElement: <Error404 />,
			},
			{
				path: "/characters",
				element: <Characters />,
			},
			{
				path: "/connexion",
				element: <Connexion />,
			},
			{
				path: "/legalNotice",
				element: <LegalNotice />,
			},
			{
				path: "/rgpd",
				element: <Rgpd />,
			},
			{
				path: "/contact",
				element: <Contact />,
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
