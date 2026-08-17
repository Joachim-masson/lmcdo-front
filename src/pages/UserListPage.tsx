import { useEffect, useState } from "react";
import "./UserListPage.css";

// Interface alignée avec le multi-rôles
interface UserData {
	id: number;
	name: string;
	email: string;
	roles: string[];
	isActive: boolean;
	lastLoginAt: string | null;
	emailVerifiedAt: string | null;
	createdAt: string;
	updateAt: string;
	deletedAt: string | null;
	bannedAt: string | null;
}

interface ToastNotification {
	message: string;
	type: "success" | "error";
}

// Liste des rôles disponibles dans votre application
const AVAILABLE_ROLES = ["MEMBER", "MODERATOR", "ADMIN"];

export default function UserListPage() {
	const [users, setUsers] = useState<UserData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const [notification, setNotification] = useState<ToastNotification | null>(
		null,
	);
	const [editingUser, setEditingUser] = useState<UserData | null>(null);
	const [editForm, setEditForm] = useState<Partial<UserData>>({});

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

	const triggerNotification = (message: string, type: "success" | "error") => {
		setNotification({ message, type });
		setTimeout(() => {
			setNotification(null);
		}, 3500);
	};

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

	const handleBan = async (id: number) => {
		const userToBan = users.find((u) => u.id === id);
		const userName = userToBan ? userToBan.name : "l'utilisateur";

		if (!window.confirm("Êtes-vous sûr de vouloir bannir cet explorateur ?"))
			return;

		const now = new Date().toISOString();
		const payload = { isActive: false, bannedAt: now };

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/user/${id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) throw new Error("Erreur lors du bannissement.");

			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === id ? { ...user, ...payload } : user,
				),
			);
			triggerNotification(
				`L'explorateur "${userName}" a été banni avec succès.`,
				"success",
			);
		} catch (err) {
			console.error(err);
			triggerNotification(
				"Impossible de procéder au bannissement de l'utilisateur.",
				"error",
			);
		}
	};

	const handleDelete = async (id: number) => {
		const userToDelete = users.find((u) => u.id === id);
		const userName = userToDelete ? userToDelete.name : "l'utilisateur";

		if (
			!window.confirm(
				`⚠️ ATTENTION : Êtes-vous sûr de vouloir supprimer définitivement l'explorateur "${userName}" ? Ses données seront anonymisées.`,
			)
		) {
			return;
		}

		const now = new Date().toISOString();

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/user/${id}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (!response.ok) throw new Error("Erreur lors de la suppression.");

			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === id
						? {
								...user,
								name: `DeletedUser_${id}`,
								email: `deleted_${id}@lmcdo.local`,
								isActive: false,
								deletedAt: now,
							}
						: user,
				),
			);
			triggerNotification(
				`L'explorateur "${userName}" a été supprimé.`,
				"success",
			);
		} catch (err) {
			console.error(err);
			triggerNotification("Impossible de supprimer l'explorateur.", "error");
		}
	};

	const handleOpenEdit = (user: UserData) => {
		setEditingUser(user);
		setEditForm({
			name: user.name,
			email: user.email,
			roles: user.roles ? [...user.roles] : ["MEMBER"],
			isActive: user.isActive,
		});
	};

	const handleCloseEdit = () => {
		setEditingUser(null);
		setEditForm({});
	};

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;

		if (type === "checkbox") {
			setEditForm((prev) => ({ ...prev, [name]: checked }));
		} else {
			setEditForm((prev) => ({ ...prev, [name]: value }));
		}
	};

	// Gestion de l'ajout / retrait d'un rôle dans la liste
	const handleRoleToggle = (role: string) => {
		setEditForm((prev) => {
			const currentRoles = prev.roles ? [...prev.roles] : [];
			const roleUpper = role.toUpperCase();

			const updatedRoles = currentRoles.includes(roleUpper)
				? currentRoles.filter((r) => r !== roleUpper) // On le retire si déjà présent
				: [...currentRoles, roleUpper]; // On l'ajoute sinon

			return { ...prev, roles: updatedRoles };
		});
	};

	const handleSaveEdit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editingUser) return;

		// Assurer qu'au moins 1 rôle est conservé (sécurité facultative)
		const rolesToSend =
			editForm.roles && editForm.roles.length > 0 ? editForm.roles : ["MEMBER"];

		const payload = {
			...editForm,
			roles: rolesToSend,
			updateAt: new Date().toISOString(),
		};

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/user/${editingUser.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) throw new Error("Erreur lors de la modification.");

			// Mise à jour de l'état local avec la nouvelle liste de rôles
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === editingUser.id ? { ...user, ...payload } : user,
				),
			);
			handleCloseEdit();
			triggerNotification(
				`Le profil de "${payload.name}" a été mis à jour.`,
				"success",
			);
		} catch (err) {
			console.error(err);
			triggerNotification(
				"Une erreur est survenue lors de l'enregistrement des modifications.",
				"error",
			);
		}
	};

	return (
		<main className="manager-page">
			{notification && (
				<div
					className={`toast-notification toast-${notification.type}`}
					role="alert"
				>
					<span className="toast-icon">
						{notification.type === "success" ? "✓" : "⚠️"}
					</span>
					<p className="toast-message">{notification.message}</p>
				</div>
			)}
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
						const isBanned = user.bannedAt !== null;
						const isDeleted = user.deletedAt !== null;

						return (
							<div
								key={user.id}
								className={`manager-card ${isBanned ? "card-banned" : ""} ${
									isDeleted ? "card-deleted" : ""
								}`}
							>
								<div className="card-header-info">
									<h3>{user.name}</h3>
									{/* Affichage de tous les rôles de l'utilisateur */}
									<div
										className="roles-container"
										style={{
											display: "flex",
											gap: "0.25rem",
											flexWrap: "wrap",
										}}
									>
										{(user.roles && user.roles.length > 0
											? user.roles
											: ["MEMBER"]
										).map((role) => (
											<span
												key={role}
												className={`role-badge role-${role.toLowerCase()}`}
											>
												{role}
											</span>
										))}
									</div>
								</div>

								<div className="user-details">
									<p>
										<strong>Email :</strong> {user.email}
									</p>
									<p>
										<strong>Statut :</strong>{" "}
										{isDeleted ? (
											<span className="status-badge deleted">
												Supprimé le {formatDate(user.deletedAt)}
											</span>
										) : isBanned ? (
											<span className="status-badge banned">
												Banni le {formatDate(user.bannedAt)}
											</span>
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
									{!isDeleted && (
										<button
											type="button"
											className="btn-action"
											onClick={() => handleOpenEdit(user)}
											disabled={isDeleted}
										>
											Modifier
										</button>
									)}
									{!isBanned && !isDeleted && (
										<button
											type="button"
											className="btn-secondary"
											onClick={() => handleBan(user.id)}
										>
											Bannir
										</button>
									)}
									{!isDeleted && (
										<button
											type="button"
											className="btn-danger"
											onClick={() => handleDelete(user.id)}
										>
											Supprimer
										</button>
									)}
								</div>
							</div>
						);
					})}
				</section>
			)}

			{/* MODALE D'ÉDITION */}
			{editingUser && (
				<div className="modal-overlay">
					<button
						type="button"
						className="modal-backdrop-btn"
						onClick={handleCloseEdit}
						aria-label="Fermer la modale"
					/>
					<div
						className="modal-content"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-title"
						tabIndex={-1}
					>
						<h2>Modifier {editingUser.name}</h2>
						<form onSubmit={handleSaveEdit} className="edit-form">
							<label>
								Nom :
								<input
									type="text"
									name="name"
									value={editForm.name || ""}
									onChange={handleFormChange}
									required
								/>
							</label>

							<label>
								Email :
								<input
									type="email"
									name="email"
									value={editForm.email || ""}
									onChange={handleFormChange}
									required
								/>
							</label>

							{/* SÉLECTION MULTI-RÔLES AVEC CHECKBOXES */}
							<fieldset
								style={{
									border: "1px solid #ccc",
									padding: "0.75rem",
									borderRadius: "6px",
									margin: "0.5rem 0",
								}}
							>
								<legend style={{ fontWeight: "bold" }}>
									Rôles attribués :
								</legend>
								<div
									style={{
										display: "flex",
										gap: "1rem",
										flexWrap: "wrap",
										marginTop: "0.25rem",
									}}
								>
									{AVAILABLE_ROLES.map((role) => {
										const isChecked = editForm.roles?.includes(role) ?? false;
										return (
											<label
												key={role}
												style={{
													display: "flex",
													alignItems: "center",
													gap: "0.25rem",
													cursor: "pointer",
												}}
											>
												<input
													type="checkbox"
													value={role}
													checked={isChecked}
													onChange={() => handleRoleToggle(role)}
												/>
												{role}
											</label>
										);
									})}
								</div>
							</fieldset>

							<label className="checkbox-label">
								<input
									type="checkbox"
									name="isActive"
									checked={editForm.isActive || false}
									onChange={handleFormChange}
								/>
								Compte actif
							</label>

							<div className="modal-actions">
								<button
									type="button"
									className="btn-secondary"
									onClick={handleCloseEdit}
								>
									Annuler
								</button>
								<button type="submit" className="btn-action">
									Sauvegarder
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</main>
	);
}
