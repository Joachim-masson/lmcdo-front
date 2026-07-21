import { useState } from "react";
import { useNavigate } from "react-router";
import "./Connexion.css";

export default function Connexion() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Validations Regex
	const validateEmail = (emailStr: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(emailStr);
	};

	const validatePassword = (passwordStr: string) => {
		// Au moins 16 caractères, 1 Majuscule, 1 Minuscule, 1 Chiffre, 1 Caractère spécial
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/;
		return passwordRegex.test(passwordStr);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// 1. Validation de l'adresse Email (Pour Connexion & Inscription)
		if (!validateEmail(email)) {
			setError(
				"Veuillez saisir une adresse email valide (ex: utilisateur@domaine.com).",
			);
			return;
		}
		// 2. Validations spécifiques à l'Inscription
		if (!isLogin) {
			// Vérification des règles de sécurité
			if (!validatePassword(password)) {
				setError("Le mot de passe ne respecte pas les critères de sécurité.");
				return;
			}
			// Vérification de la correspondance des deux mots de passe
			if (password !== confirmPassword) {
				setError("Les deux mots de passe ne correspondent pas.");
				return;
			}
		}

		const API_URL = `${import.meta.env.VITE_API_URL}`;
		// Redirection vers le gestionnaire d'utilisateurs

		try {
			if (isLogin) {
				// --- CAS : CONNEXION ---
				const response = await fetch(`${API_URL}/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});

				if (!response.ok) {
					throw new Error("Identifiants incorrects ou compte inactif.");
				}

				const data = await response.json();
				localStorage.setItem("userToken", "fake-jwt-token-mu"); // Remplacer par data.token si JWT implémenté
				localStorage.setItem("userName", data.name || email.split("@")[0]);
				navigate("/userManager");
			} else {
				// --- CAS : INSCRIPTION ---
				const payload = {
					name: email.split("@")[0], // Nom temporaire basé sur l'email
					email: email,
					password: password, // Transmis au back
				};

				const response = await fetch(`${API_URL}/user`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});

				if (!response.ok) {
					throw new Error(
						"Erreur lors de la création du compte. L'email est peut-être déjà utilisé.",
					);
				}

				// Succès : On bascule sur l'écran de connexion avec un message
				setIsLogin(true);
				setPassword("");
				setConfirmPassword(""); // On vide aussi la confirmation
				alert(
					"Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
				);
			}
		} catch (err: any) {
			setError(err.message || "Une erreur est survenue.");
		}
	};

	return (
		<main className="connexion-page">
			<div className="auth-card">
				<h1>{isLogin ? "Connexion" : "Inscription"}</h1>

				{error && <div className="error-message">{error}</div>}

				<form onSubmit={handleSubmit}>
					<input
						type="email"
						placeholder="Email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Mot de passe"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{/* Affichage des règles et du deuxième champ uniquement à l'inscription */}
					{!isLogin && (
						<>
							<div className="password-requirements">
								<p>Le mot de passe doit contenir au moins :</p>
								<ul>
									<li className={password.length >= 16 ? "valid" : ""}>
										16 caractères
									</li>
									<li className={/[A-Z]/.test(password) ? "valid" : ""}>
										Une majuscule
									</li>
									<li className={/[a-z]/.test(password) ? "valid" : ""}>
										Une minuscule
									</li>
									<li className={/\d/.test(password) ? "valid" : ""}>
										Un chiffre
									</li>
									<li className={/[@$!%*?&]/.test(password) ? "valid" : ""}>
										Un caractère spécial (@, $, !, %, *, ?, &)
									</li>
								</ul>
							</div>

							<input
								type="password"
								placeholder="Confirmez le mot de passe"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</>
					)}
					<button type="submit" className="btn-gold">
						{isLogin ? "Rejoindre l'aventure" : "Créer mon compte"}
					</button>
				</form>
				<button
					type="button"
					onClick={() => {
						setIsLogin(!isLogin);
						setError("");
					}}
					className="toggle-auth-btn"
				>
					{isLogin
						? "Pas encore de compte ? S'inscrire"
						: "Déjà membre ? Se connecter"}
				</button>
			</div>
		</main>
	);
}
