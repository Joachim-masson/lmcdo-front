import { useEffect, useState } from "react";
import "./UserListPage.css";

// Définition de l'interface basée sur tes colonnes BDD
interface UserData {
	id: number;
	name: string;
	email: string;
	userRole: string;
	isActive: boolean;
	lastLoginAt: string | null;
	emailVerifiedAt: string | null;
	createdAt: string;
	updateAt: string;
	deletedAt: string | null;
	bannedAt: string | null;
}

export default function UserListPage() {
	const [users, setUsers] = useState<UserData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Récupération de l'URL depuis les variables d'environnement
	const API_URL = `${import.meta.env.VITE_API_URL}/users`;

	useEffect(() => {
		fetch(API_URL)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				setUsers(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Erreur lors de la récupération des utilisateurs :", err);
				setError("Impossible de charger la liste des explorateurs.");
				setLoading(false);
			});
	}, []);

	// Fonction utilitaire pour formater joliment les dates ISO de la BDD
	const formatDate = (dateString: string | null) => {
		if (!dateString) return "Jamais";
		return new Date(dateString).toLocaleDateString("fr-FR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<main className="manager-page">
			<header className="manager-header">
				<h1>Gestion des Explorateurs</h1>
				<p>
					Liste complète des utilisateurs enregistrés dans la base de données{" "}
					<strong>LMCDO</strong>.
				</p>
			</header>

			{loading && (
				<p className="loading-text">
					Chargement du grand registre des utilisateurs...
				</p>
			)}
			{error && <p className="error-text">{error}</p>}

			{!loading && !error && (
				<section className="manager-grid">
					{users.map((user) => {
						// Logique d'affichage des statuts de sécurité
						const isBanned = user.bannedAt !== null;
						const isDeleted = user.deletedAt !== null;

						return (
							<div
								key={user.id}
								className={`manager-card ${isBanned ? "card-banned" : ""} ${isDeleted ? "card-deleted" : ""}`}
							>
								<div className="card-header-info">
									<h3>{user.name}</h3>
									<span
										className={`role-badge role-${user.userRole.toLowerCase()}`}
									>
										{user.userRole}
									</span>
								</div>

								<div className="user-details">
									<p>
										<strong>Email :</strong> {user.email}
									</p>

									<p>
										<strong>Statut :</strong>{" "}
										{isBanned ? (
											<span className="status-badge banned">
												Banni le {formatDate(user.bannedAt)}
											</span>
										) : isDeleted ? (
											<span className="status-badge deleted">Supprimé</span>
										) : user.isActive ? (
											<span className="status-badge active">Actif</span>
										) : (
											<span className="status-badge inactive">Inactif</span>
										)}
									</p>

									<hr className="card-divider" />

									<p>
										<strong>Vérifié le :</strong>{" "}
										{user.emailVerifiedAt
											? formatDate(user.emailVerifiedAt)
											: "Non vérifié"}
									</p>
									<p>
										<strong>Dernière connexion :</strong>{" "}
										{formatDate(user.lastLoginAt)}
									</p>
									<p>
										<strong>Créé le :</strong> {formatDate(user.createdAt)}
									</p>
									<p>
										<strong>Modifié le :</strong> {formatDate(user.updateAt)}
									</p>
								</div>

								<div className="card-actions">
									<button type="button" className="btn-action">
										Modifier
									</button>
									{!isBanned && (
										<button type="button" className="btn-secondary">
											Bannir
										</button>
									)}
								</div>
							</div>
						);
					})}
				</section>
			)}
		</main>
	);
}
