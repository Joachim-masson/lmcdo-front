import { useState } from "react";
import CarChar from "../components/CarChar";
import "./Characters.css";

// Définition du type pour tes personnages
interface CharacterData {
	id: number;
	name: string;
	age: number | string;
	origin: string;
	image: string;
}

const CHARACTERS_MOCK: CharacterData[] = [
	{ id: 1, name: "Esteban", age: 12, origin: "Atlante", image: "" },
	{ id: 2, name: "Zia", age: 11, origin: "Inca", image: "" },
	{ id: 3, name: "Tao", age: 13, origin: "Muen", image: "" },
	{
		id: 4,
		name: "Juan Carlos Mendoza",
		age: 28,
		origin: "Espagnol",
		image: "",
	},
	{ id: 5, name: "Pedro", age: "", origin: "Espagnol", image: "" },
	{ id: 6, name: "Sancho", age: "", origin: "Espagnol", image: "" },
	{ id: 7, name: "Gomez", age: "", origin: "Espagnol", image: "" },
];

export default function Characters() {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredCharacters = CHARACTERS_MOCK.filter((char) => {
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
							image={char.image}
						/>
					))
				) : (
					<p className="no-result">
						Aucun explorateur trouvé pour "{searchTerm}"...
					</p>
				)}
			</section>
		</main>
	);
}
