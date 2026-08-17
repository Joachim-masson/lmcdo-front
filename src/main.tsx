import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import "./index.css";
import App from "./App.tsx";

// Import the main app component
import Characters from "./pages/Characters.tsx";
import Connexion from "./pages/Connexion.tsx";
import Contact from "./pages/Contact.tsx";
import Error404 from "./pages/Error404.tsx";
import Home from "./pages/Home.tsx";
import LegalNotice from "./pages/LegalNotice.tsx";
import ProfileSettings from "./pages/ProfileSettings.tsx";
import Rgpd from "./pages/Rgpd.tsx";
import UserManager from "./pages/UserManager.tsx";
import UpdateCharacter from "./pages/UpdateCharacter.tsx";
import UserListPage from "./pages/UserListPage.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
	{
		element: <App />, // Renders the App component for the home page
		errorElement: <Error404 />,
		children: [
			{
				path: "/",
				element: <Home />,
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
					<ProtectedRoute allowedRoles={["MODERATOR"]}>
						<UserManager />
					</ProtectedRoute>
				),
			},
			{
				path: "/updateCharacter",
				element: (
					<ProtectedRoute allowedRoles={["MODERATOR"]}>
						<UpdateCharacter />
					</ProtectedRoute>
				),
			},
			{
				path: "/userListPage",
				element: (
					<ProtectedRoute allowedRoles={["ADMIN"]}>
						<UserListPage />
					</ProtectedRoute>
				),
			},
			{
				path: "/profileSettings",
				element: (
					<ProtectedRoute allowedRoles={["MEMBER"]}>
						<ProfileSettings />
					</ProtectedRoute>
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
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>,
);
