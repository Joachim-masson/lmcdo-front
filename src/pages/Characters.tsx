import { useEffect, useState } from "react";
import CarChar from "../components/CarChar";
import "./Characters.css";
import AddChar from "../components/AddChar";

// Définition du type pour tes personnages
interface CharacterData {
	id: number;
	name: string;
	age: number | string;
	origin: string;
	picture: string;
}

export default function Characters() {
	const [searchTerm, setSearchTerm] = useState("");
	const [characters, setCharacters] = useState<CharacterData[]>([]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const API_URL = `${import.meta.env.VITE_API_URL}/characters`;

	//Charge tous les personnages
	const fetchCharacters = () => {
		fetch(API_URL)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				setCharacters(data);
			})
			.catch((err) => console.error("Erreur fetch:", err));
	};

	useEffect(() => {
		fetchCharacters();
	}, []);

	const filteredCharacters = characters.filter((char) => {
		const searchLower = searchTerm.toLowerCase();
		return (
			char.name.toLowerCase().includes(searchLower) ||
			char.origin.toLowerCase().includes(searchLower)
		);
	});

	return (
		<main className="characters-page">
			<header className="characters-header">
				<h1>Les Personnages</h1>
				<div className="search-container">
					<input
						type="text"
						placeholder="Rechercher un héros, un peuple..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
					{/* 3. Ouverture de la modale au clic */}
					<button
						type="button"
						className="add-character-btn"
						onClick={() => setIsModalOpen(true)}
					>
						+ Ajouter un personnage
					</button>
				</div>
				<p>Retrouvez les héros et antagonistes de la quête des cités d'or.</p>
			</header>

			<section className="characters-grid">
				{filteredCharacters.length > 0 ? (
					filteredCharacters.map((char) => (
						<CarChar
							key={char.id}
							name={char.name}
							age={char.age === "" ? "Inconnu" : char.age}
							origin={char.origin}
							image={char.picture}
						/>
					))
				) : (
					<p className="no-result">
						Aucun explorateur trouvé pour "{searchTerm}"...
					</p>
				)}
			</section>
			{/* 4. Affichage conditionnel de la Modale */}
			{isModalOpen && (
				<button
					type="button"
					className="modal-overlay"
					onClick={() => setIsModalOpen(false)}
				>
					<button
						type="button"
						className="modal-content"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							className="modal-close-btn"
							onClick={() => setIsModalOpen(false)}
						>
							✖
						</button>

						<AddChar
							onClose={() => setIsModalOpen(false)}
							onSuccess={() => {
								setIsModalOpen(false);
								fetchCharacters(); // Recharge la liste après l'ajout d'un personnage
							}}
						/>
					</button>
				</button>
			)}
		</main>
	);
}
