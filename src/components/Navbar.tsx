import { NavLink } from "react-router";

export default function Navbar() {
	return (
		<nav className="navbar">
			<h2> Component Navbar</h2>
			<NavLink to="/">Accueil</NavLink>
			<NavLink to="/characters">Personnages</NavLink>
			<NavLink to="/userManager">Gestion</NavLink>
			<NavLink to="/connexion">Sing In</NavLink>
		</nav>
	);
}
