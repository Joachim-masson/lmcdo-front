import { useState } from "react";
import "./AddChar.css"; // Pour le style spécifique du formulaire si besoin

interface AddCharProps {
	onClose?: () => void;
	onSuccess?: () => void;
}

export default function AddChar({ onClose, onSuccess }: AddCharProps) {
	const [formData, setFormData] = useState({
		name: "",
		age: "",
		origin: "",
		picture: "",
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const API_URL = `${import.meta.env.VITE_API_URL}/character`;

	// Gestion des changements dans les champs de saisie
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Soumission du formulaire
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Formatage des données avant envoi (ex: conversion de l'âge si numérique)
		const payload = {
			name: formData.name.trim(),
			age: formData.age === "" ? null : parseInt(formData.age, 10),
			origin: formData.origin.trim(),
			picture: formData.picture.trim() === "" ? null : formData.picture.trim(),
		};

		try {
			const response = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error(`Erreur lors de la création (${response.status})`);
			}

			// Si tout s'est bien passé, on notifie le composant parent
			if (onSuccess) {
				onSuccess();
			}
		} catch (err: any) {
			console.error("Erreur POST character:", err);
			setError(err.message || "Une erreur est survenue lors de l'ajout.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add-char-container">
			<h2>Nouveau Personnage</h2>

			{error && <p className="error-message">{error}</p>}

			<form onSubmit={handleSubmit} className="add-char-form">
				<div className="form-group">
					<label htmlFor="name">Nom *</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						value={formData.name}
						onChange={handleChange}
						placeholder="Ex: Esteban, Tao..."
					/>
				</div>

				<div className="form-group">
					<label htmlFor="age">Âge</label>
					<input
						type="text"
						id="age"
						name="age"
						value={formData.age}
						onChange={handleChange}
						placeholder="Ex: 12 ou Inconnu"
					/>
				</div>

				<div className="form-group">
					<label htmlFor="origin">Origine *</label>
					<input
						type="text"
						id="origin"
						name="origin"
						required
						value={formData.origin}
						onChange={handleChange}
						placeholder="Ex: Barcelone, Peuple Hiva..."
					/>
				</div>

				<div className="form-group">
					<label htmlFor="picture">URL de l'image</label>
					<input
						type="url"
						id="picture"
						name="picture"
						value={formData.picture}
						onChange={handleChange}
						placeholder="https://..."
					/>
				</div>

				<div className="form-actions">
					{onClose && (
						<button
							type="button"
							className="btn-cancel"
							onClick={onClose}
							disabled={loading}
						>
							Annuler
						</button>
					)}

					<button type="submit" className="btn-submit" disabled={loading}>
						{loading ? "Création..." : "Ajouter"}
					</button>
				</div>
			</form>
		</div>
	);
}
