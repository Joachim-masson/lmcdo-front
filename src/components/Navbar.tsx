import { NavLink, useNavigate } from "react-router";

import "./Navbar.css";

export default function Navbar() {
	const navigate = useNavigate();
	// On vérifie si le token existe
	const isLoggedIn = !!localStorage.getItem("userToken");

	const handleAuthClick = () => {
		if (isLoggedIn) {
			// Si loggué, on déconnecte
			localStorage.clear();
			navigate("/"); // Redirection vers l'accueil après déconnexion
		} else {
			// Si pas loggué, on va vers la page de connexion
			navigate("/connexion");
		}
	};
	return (
		<nav className="navbar">
			<NavLink to="/">Accueil</NavLink>
			<div className="secondNavbar">
				<NavLink to="/">Accueil</NavLink>
				<NavLink to="/characters">Personnages</NavLink>
				{isLoggedIn && <NavLink to="/userManager">Gestion</NavLink>}
				<button
					onClick={handleAuthClick}
					className="auth-nav-link"
					type="button"
				>
					{isLoggedIn ? "Sign Out" : "Sign In"}
				</button>
			</div>
		</nav>
	);
}
