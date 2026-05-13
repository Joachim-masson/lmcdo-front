import { useNavigate } from "react-router";
import "./UserManager.css";

export default function UserManager() {
	const navigate = useNavigate();
	const userName = localStorage.getItem("userName") || "Explorateur";

	const handleLogout = () => {
		localStorage.clear();
		navigate("/connexion");
	};

	return (
		<main className="manager-page">
			<header className="manager-header">
				<h1>Tableau de bord</h1>
				<p>
					Bienvenue, <strong>{userName}</strong>
				</p>
			</header>

			<div className="manager-grid">
				<section className="manager-card">
					<h3>Gestion des Personnages</h3>
					<p>Ajouter, modifier ou supprimer des héros des Cités d'Or.</p>
					<button
						type="button"
						onClick={() => navigate("/update-character")}
						className="btn-action"
					>
						Accéder à l'éditeur
					</button>
				</section>

				<section className="manager-card">
					<h3>Paramètres du compte</h3>
					<p>Modifier vos informations personnelles ou votre mot de passe.</p>
					<button className="btn-secondary" type="button">
						Modifier le profil
					</button>
				</section>
			</div>

			<button onClick={handleLogout} className="btn-logout" type="button">
				Quitter l'expédition (Déconnexion)
			</button>
		</main>
	);
}
