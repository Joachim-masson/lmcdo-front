import { useState } from 'react';
import CarChar from '../components/CarChar';
import './Characters.css';

// Définition du type pour tes personnages
interface CharacterData {
  name: string;
  age: number | string;
  origin: string;
  image: string;
}

const CHARACTERS_MOCK: CharacterData[] = [
  { "name": "Esteban", "age": 12, "origin": "Atlante", "image": "" },
  { "name": "Zia", "age": 11, "origin": "Inca", "image": "" },
  { "name": "Tao", "age": 13, "origin": "Muen", "image": "" },
  { "name": "Juan Carlos Mendoza", "age": 28, "origin": "Espagnol", "image": "" },
  { "name": "Pedro", "age": "Inconnu", "origin": "Espagnol", "image": "" },
  { "name": "Sancho", "age": "Inconnu", "origin": "Espagnol", "image": "" },
  { "name": "Gomez", "age": "Inconnu", "origin": "Espagnol", "image": "" }
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
          filteredCharacters.map((char, index) => (
            <CarChar 
              key={index} 
              name={char.name} 
              age={char.age === "" ? "Inconnu" : char.age} 
              origin={char.origin} 
              image={char.image} 
            />
          ))
        ) : (
          <p className="no-result">Aucun explorateur trouvé pour "{searchTerm}"...</p>
        )}
      </section>
    </main>
  );
}