import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./Connexion.css";

export default function Connexion() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// On récupère la fonction login depuis le contexte
	const { login } = useAuth();

	const validateEmail = (emailStr: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(emailStr);
	};

	const validatePassword = (passwordStr: string) => {
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/;
		return passwordRegex.test(passwordStr);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!validateEmail(email)) {
			setError("Veuillez saisir une adresse email valide.");
			return;
		}

		if (!isLogin) {
			if (!validatePassword(password)) {
				setError("Le mot de passe ne respecte pas les critères de sécurité.");
				return;
			}
			if (password !== confirmPassword) {
				setError("Les deux mots de passe ne correspondent pas.");
				return;
			}
		}

		const API_URL = `${import.meta.env.VITE_API_URL}`;

		try {
			if (isLogin) {
				// --- CONNEXION ---
				const response = await fetch(`${API_URL}/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});

				if (!response.ok) {
					throw new Error(
						"Combinaison Identifiants/mot de passe incorrects ou compte inactif.",
					);
				}

				const userData = await response.json();

				// Sauvegarde de l'objet User complet dans le AuthContext
				login(userData);
				navigate("/userManager");
			} else {
				// --- INSCRIPTION ---
				const payload = {
					name: email.split("@")[0],
					email: email,
					password: password,
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

				const newUser = await response.json();

				// Option A : Connecter l'utilisateur automatiquement après inscription
				login(newUser);
				navigate("/userManager");

				/* Option B : Si vous préférez le basculer sur l'écran login, décommentez ceci :
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        alert("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        */
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
