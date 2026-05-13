import { useState } from "react";
import { useNavigate } from "react-router";
import "./Connexion.css";

export default function Connexion() {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Simulation : On stocke un faux token dans le localStorage
		localStorage.setItem("userToken", "fake-jwt-token-mu");
		localStorage.setItem("userName", email.split("@")[0]);

		// Redirection vers le gestionnaire d'utilisateurs
		navigate("/user-manager");
	};

	return (
		<main className="connexion-page">
			<div className="auth-card">
				<h1>{isLogin ? "Connexion" : "Inscription"}</h1>
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
					<button type="submit" className="btn-gold">
						{isLogin ? "Rejoindre l'aventure" : "Créer mon compte"}
					</button>
				</form>
				<button
					type="button"
					onClick={() => setIsLogin(!isLogin)}
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
