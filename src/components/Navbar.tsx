import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

export default function Navbar() {
	const navigate = useNavigate();
	const { user, logout, isAuthenticated } = useAuth();
	// On vérifie si le token existe

	const handleAuthClick = () => {
		if (isAuthenticated) {
			// Si loggué, on déconnecte
			logout();
			navigate("/"); // Redirection vers l'accueil après déconnexion
		} else {
			// Si pas loggué, on va vers la page de connexion
			navigate("/connexion");
		}
	};
	return (
		<nav className="navbar">
			<NavLink to="/">Accueil</NavLink>
			<NavLink to="/characters">Personnages</NavLink>

			{isAuthenticated && <NavLink to="/userManager">Gestion</NavLink>}
			<button onClick={handleAuthClick} className="auth-nav-link" type="button">
				{isAuthenticated ? "Sign Out" : "Sign In"}
			</button>
		</nav>
	);
}
