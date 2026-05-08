import { NavLink } from "react-router";

import "./Footer.css";

function Footer() {
	return (
		<footer className="footer">
			<p>© 2026 joachim Masson - Tous droits réservés</p>
			<div className="footer-link">
				<NavLink to="/legalNotice">Mentions légales</NavLink>
				<NavLink to="/rgpd">Politique de confidentialité</NavLink>
				<NavLink to="/contact">Contact</NavLink>
			</div>
		</footer>
	);
}

export default Footer;
