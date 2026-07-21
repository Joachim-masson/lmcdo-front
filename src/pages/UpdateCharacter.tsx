import { FormEvent, useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./UpdateCharacter.css";

interface CharacterData {
	id: number;
	name: string;
	age: number | string;
	origin: string;
	picture: string;
	createdAt?: string; // ISO String (ex: "2026-03-31T10:00:00")
	creatorUserId?: number | null; // ID de l'utilisateur
}

export default function UpdateCharacter() {
	const [characters, setCharacters] = useState<CharacterData[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// État pour l'édition en ligne
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editForm, setEditForm] = useState<Partial<CharacterData>>({});

	// État pour la Modal de création
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newChar, setNewChar] = useState({
		name: "",
		age: "",
		origin: "",
		picture: "",
	});

	const API_URL = import.meta.env.VITE_API_URL;

	// 1. Charger tous les personnages
	const fetchCharacters = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_URL}/characters`);
			if (!response.ok) throw new Error("Erreur de chargement");
			const data = await response.json();
			setCharacters(data);
		} catch (err) {
			console.error(err);
			toast.error("Impossible de charger les personnages.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCharacters();
	}, [fetchCharacters]);

	// 2. Gestion de l'édition (Modifications locales)
	const handleStartEdit = (char: CharacterData) => {
		setEditingId(char.id);
		setEditForm({ ...char });
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditForm({});
	};

	const handleSaveEdit = async (id: number) => {
		try {
			const response = await fetch(`${API_URL}/character/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...editForm,
					age: editForm.age === "" ? 0 : Number(editForm.age),
				}),
			});

			if (!response.ok) throw new Error();

			toast.success("Personnage mis à jour avec succès !");
			setEditingId(null);
			fetchCharacters(); // Rafraîchir la liste
		} catch {
			toast.error("Erreur lors de la mise à jour.");
		}
	};

	// 3. Gestion de la Création via Modal

	// TODO: Remplacer plus tard par le vrai utilisateur connecté via ton système d'Auth
	const TEMPORARY_MOCK_USER_ID = 1;
	const handleCreateCharacter = async (e: FormEvent) => {
		e.preventDefault();
		if (!newChar.name.trim()) {
			toast.error("Le nom est obligatoire.");
			return;
		}

		const payload = {
			...newChar,
			age: newChar.age === "" ? 0 : Number(newChar.age),
			createdAt: new Date().toISOString(), // Date de création
			creatorUserId: TEMPORARY_MOCK_USER_ID, // ID Utilisateur connecté
		};

		try {
			const response = await fetch(`${API_URL}/character`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error();

			toast.success("Nouveau personnage ajouté !");
			setIsModalOpen(false);
			setNewChar({ name: "", age: "", origin: "", picture: "" });
			fetchCharacters();
		} catch {
			toast.error("Erreur lors de la création.");
		}
	};

	// 4. Suppression avec Toast de Confirmation
	const confirmDelete = (id: number, name: string) => {
		toast(
			(t) => (
				<div className="toast-confirm">
					<p>
						Supprimer <strong>{name}</strong> ?
					</p>
					<div className="toast-actions">
						<button
							type="button"
							className="btn-danger-small"
							onClick={() => {
								toast.dismiss(t.id);
								executeDelete(id);
							}}
						>
							Oui, supprimer
						</button>
						<button
							type="button"
							className="btn-secondary-small"
							onClick={() => toast.dismiss(t.id)}
						>
							Annuler
						</button>
					</div>
				</div>
			),
			{ duration: 5000, id: `delete-${id}` },
		);
	};

	const executeDelete = async (id: number) => {
		try {
			const response = await fetch(`${API_URL}/character/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) throw new Error();

			toast.success("Personnage supprimé.");
			fetchCharacters();
		} catch {
			toast.error("Erreur lors de la suppression.");
		}
	};

	// Filtrage
	const filteredCharacters = characters.filter((char) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			char.name.toLowerCase().includes(searchLower) ||
			char.origin.toLowerCase().includes(searchLower)
		);
	});

	return (
		<main className="update-page">
			{/* Composant Toaster pour afficher les notifications */}
			<Toaster position="top-right" />

			<header className="update-header">
				<h1>Gestion des Personnages</h1>
				<div className="header-controls">
					<input
						type="text"
						placeholder="Rechercher un personnage..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
					<button
						type="button"
						className="btn-add"
						onClick={() => setIsModalOpen(true)}
						title="Ajouter un personnage"
					>
						+
					</button>
				</div>
			</header>

			{/* Grille / Cartes d'édition */}
			<section className="admin-grid">
				{isLoading ? (
					<p className="loading-text">Chargement des données...</p>
				) : filteredCharacters.length > 0 ? (
					filteredCharacters.map((char) => {
						const isEditing = editingId === char.id;

						return (
							<div
								key={char.id}
								className={`admin-card ${isEditing ? "editing" : ""}`}
							>
								{isEditing ? (
									// Mode Édition
									<div className="edit-mode">
										<label>
											Nom :
											<input
												type="text"
												value={editForm.name || ""}
												onChange={(e) =>
													setEditForm({ ...editForm, name: e.target.value })
												}
											/>
										</label>
										<label>
											Âge :
											<input
												type="number"
												value={editForm.age ?? ""}
												onChange={(e) =>
													setEditForm({ ...editForm, age: e.target.value })
												}
											/>
										</label>
										<label>
											Origine :
											<input
												type="text"
												value={editForm.origin || ""}
												onChange={(e) =>
													setEditForm({ ...editForm, origin: e.target.value })
												}
											/>
										</label>
										<label>
											URL Image :
											<input
												type="text"
												value={editForm.picture || ""}
												onChange={(e) =>
													setEditForm({ ...editForm, picture: e.target.value })
												}
											/>
										</label>

										<div className="card-actions">
											<button
												type="button"
												className="btn-save"
												onClick={() => handleSaveEdit(char.id)}
											>
												Sauvegarder
											</button>
											<button
												type="button"
												className="btn-cancel"
												onClick={handleCancelEdit}
											>
												Annuler
											</button>
										</div>
									</div>
								) : (
									// Mode Affichage / Action
									<div className="view-mode">
										<h3>{char.name}</h3>
										<p>
											<strong>Âge :</strong>{" "}
											{char.age === 0 || char.age === "" ? "Inconnu" : char.age}
										</p>
										<p>
											<strong>Origine :</strong> {char.origin}
										</p>
										{/* Informations de création */}
										{char.createdAt && (
											<p>
												<strong>Créé le :</strong>{" "}
												{new Date(char.createdAt).toLocaleDateString("fr-FR")}
											</p>
										)}
										{char.creatorUserId && (
											<p>
												<strong>Créateur (ID) :</strong> #{char.creatorUserId}
											</p>
										)}
										<p>
											<strong>Image :</strong> {char.picture || "Aucune"}
										</p>

										<div className="card-actions">
											<button
												type="button"
												className="btn-edit"
												onClick={() => handleStartEdit(char)}
											>
												Modifier
											</button>
											<button
												type="button"
												className="btn-delete"
												onClick={() => confirmDelete(char.id, char.name)}
											>
												Supprimer
											</button>
										</div>
									</div>
								)}
							</div>
						);
					})
				) : (
					<p className="no-result">Aucun personnage trouvé.</p>
				)}
			</section>

			{/* Modal d'ajout de Personnage */}
			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h2>Ajouter un explorateur</h2>
						<form onSubmit={handleCreateCharacter}>
							<div className="form-group">
								<label htmlFor="create-char-name">Nom *</label>
								<input
									id="create-char-name"
									type="text"
									required
									value={newChar.name}
									onChange={(e) =>
										setNewChar({ ...newChar, name: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="create-char-age">Âge</label>
								<input
									id="create-char-age"
									type="number"
									value={newChar.age}
									onChange={(e) =>
										setNewChar({ ...newChar, age: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="create-char-origin">Origine</label>
								<input
									id="create-char-origin"
									type="text"
									value={newChar.origin}
									onChange={(e) =>
										setNewChar({ ...newChar, origin: e.target.value })
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="create-char-picture">
									Lien Image (Optionnel)
								</label>
								<input
									id="create-char-picture"
									type="text"
									value={newChar.picture}
									onChange={(e) =>
										setNewChar({ ...newChar, picture: e.target.value })
									}
								/>
							</div>

							<div className="modal-actions">
								<button
									type="button"
									className="btn-cancel"
									onClick={() => setIsModalOpen(false)}
								>
									Annuler
								</button>
								<button type="submit" className="btn-save">
									Créer
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</main>
	);
}
