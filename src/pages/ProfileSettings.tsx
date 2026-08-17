import React, { useState } from "react";
import "./ProfileSettings.css";
import { useAuth } from "../context/AuthContext";

export const ProfileSettings: React.FC = () => {
	const { user, updateUser } = useAuth();

	// États pour le nom d'utilisateur
	const [username, setUsername] = useState<string>(user?.name || "Explorateur");
	const [usernameMessage, setUsernameMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);
	const [isUpdatingUsername, setIsUpdatingUsername] = useState<boolean>(false);

	// États pour le mot de passe
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [passwordMessage, setPasswordMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);
	const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

	// Validation du mot de passe
	const isLengthValid = password.length >= 16;
	const hasUppercase = /[A-Z]/.test(password);
	const hasLowercase = /[a-z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSpecialChar = /[@$!%*?&]/.test(password);

	const isPasswordValid =
		isLengthValid && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;

	// Soumission de la mise à jour du Username
	const handleUsernameSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setUsernameMessage(null);

		if (!user?.id) {
			setUsernameMessage({
				text: "Session utilisateur introuvable. Veuillez vous reconnecter.",
				type: "error",
			});
			return;
		}

		if (!username.trim()) {
			setUsernameMessage({
				text: "Le nom d'utilisateur ne peut pas être vide.",
				type: "error",
			});
			return;
		}

		try {
			setIsUpdatingUsername(true);

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/user/${user.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name: username.trim() }),
				},
			);

			if (!response.ok) {
				throw new Error("Erreur lors de la sauvegarde du nom.");
			}

			// Mise à jour du contexte local et du localStorage
			updateUser({ name: username.trim() });

			setUsernameMessage({
				text: "Nom d'utilisateur mis à jour avec succès !",
				type: "success",
			});
		} catch (err) {
			console.error(err);
			setUsernameMessage({
				text: "Erreur lors de la mise à jour du nom d'utilisateur.",
				type: "error",
			});
		} finally {
			setIsUpdatingUsername(false);
		}
	};

	// Soumission de la mise à jour du Mot de passe
	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordMessage(null);

		if (!user?.id) {
			setPasswordMessage({
				text: "Session utilisateur introuvable. Veuillez vous reconnecter.",
				type: "error",
			});
			return;
		}

		if (!isPasswordValid) {
			setPasswordMessage({
				text: "Le mot de passe ne respecte pas tous les critères requis.",
				type: "error",
			});
			return;
		}

		if (password !== confirmPassword) {
			setPasswordMessage({
				text: "Les mots de passe ne correspondent pas.",
				type: "error",
			});
			return;
		}

		try {
			setIsUpdatingPassword(true);

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/user/${user.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ password }),
				},
			);

			if (!response.ok) {
				throw new Error("Erreur lors du changement de mot de passe.");
			}

			setPasswordMessage({
				text: "Mot de passe modifié avec succès !",
				type: "success",
			});
			setPassword("");
			setConfirmPassword("");
		} catch (err) {
			console.error(err);
			setPasswordMessage({
				text: "Erreur lors du changement de mot de passe.",
				type: "error",
			});
		} finally {
			setIsUpdatingPassword(false);
		}
	};

	return (
		<div className="manager-page">
			<header className="manager-header">
				<h1>Mon Compte</h1>
				<p>
					Gérez vos informations personnelles et la sécurité de votre compte{" "}
					<strong>{username}</strong>.
				</p>
			</header>

			<div className="manager-grid">
				{/* CARTE 1 : Informations profil (Username) */}
				<div className="manager-card">
					<h3>Informations personnelles</h3>
					<p>Mettez à jour votre nom d'utilisateur d'aventurier.</p>

					<form onSubmit={handleUsernameSubmit} className="profile-form">
						<div className="form-group">
							<label htmlFor="username">Nom d'utilisateur</label>
							<input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Votre nom d'utilisateur"
								required
							/>
						</div>

						{usernameMessage && (
							<div className={`form-message ${usernameMessage.type}`}>
								{usernameMessage.text}
							</div>
						)}

						<button
							type="submit"
							className="btn-action"
							disabled={isUpdatingUsername}
						>
							{isUpdatingUsername ? "Enregistrement..." : "Enregistrer le nom"}
						</button>
					</form>
				</div>

				{/* CARTE 2 : Changement de mot de passe */}
				<div className="manager-card">
					<h3>Sécurité & Mot de passe</h3>
					<p>Modifiez votre mot de passe pour protéger votre accès.</p>

					<form onSubmit={handlePasswordSubmit} className="profile-form">
						<div className="form-group">
							<label htmlFor="new-password">Nouveau mot de passe</label>
							<input
								id="new-password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••••••••••"
								required
							/>
						</div>

						{/* Checklist des exigences du mot de passe */}
						<div className="password-requirements">
							<p>Le mot de passe doit contenir au moins :</p>
							<ul>
								<li className={isLengthValid ? "valid" : ""}>16 caractères</li>
								<li className={hasUppercase ? "valid" : ""}>Une majuscule</li>
								<li className={hasLowercase ? "valid" : ""}>Une minuscule</li>
								<li className={hasDigit ? "valid" : ""}>Un chiffre</li>
								<li className={hasSpecialChar ? "valid" : ""}>
									Un caractère spécial (@, $, !, %, *, ?, &)
								</li>
							</ul>
						</div>

						<div className="form-group">
							<label htmlFor="confirm-password">
								Confirmer le mot de passe
							</label>
							<input
								id="confirm-password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="••••••••••••••••"
								required
							/>
							{confirmPassword && password !== confirmPassword && (
								<span className="field-error-hint">
									Les mots de passe ne correspondent pas
								</span>
							)}
						</div>

						{passwordMessage && (
							<div className={`form-message ${passwordMessage.type}`}>
								{passwordMessage.text}
							</div>
						)}

						<button
							type="submit"
							className="btn-action"
							disabled={
								!isPasswordValid ||
								password !== confirmPassword ||
								isUpdatingPassword
							}
						>
							{isUpdatingPassword
								? "Modification..."
								: "Changer le mot de passe"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ProfileSettings;
