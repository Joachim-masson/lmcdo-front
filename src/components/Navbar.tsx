import { NavLink } from "react-router";

import "./Navbar.css";

export default function Navbar() {
	return (
		<nav className="navbar">
			<NavLink to="/">Accueil</NavLink>
			<div className="secondNavbar">
				<NavLink to="/">Accueil</NavLink>
				<NavLink to="/characters">Personnages</NavLink>
				<NavLink to="/userManager">Gestion</NavLink>
				<NavLink to="/connexion">Sing In</NavLink>
			</div>
		</nav>
	);
}
