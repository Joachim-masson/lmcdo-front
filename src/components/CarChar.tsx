import './CarChar.css';

interface CharacterProps {
  name: string;
  age: number | string;
  origin: string;
  image: string;
}

export default function CarChar({ name, age, origin, image }: CharacterProps) {
  // Image par défaut si le champ image est vide
  const displayImage = image || "/images/placeholder_char.jpg";

  return (
    <article className="char-card">
      <div className="char-image-container">
        <img src={displayImage} alt={name} className="char-img" />
      </div>
      <div className="char-info">
        <h3>{name}</h3>
        <div className="char-details">
          <p><span>Âge :</span> {age} ans</p>
          <p><span>Origine :</span> {origin}</p>
        </div>
      </div>
      <div className="char-decoration"></div>
    </article>
  );
}