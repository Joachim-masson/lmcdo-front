import "./Hero.css"

export default function Hero (){
  return (
    <section className="hero-container">
      <div className="hero-image-wrapper">
        <img 
          src="/images/img_hero.jpg" 
          alt="les personnages principaux des mystérieuses cités d'or" 
          className="hero-img"
        />
        <div className="hero-overlay">
          <h1>Les Mysterieuses Cites d'Or</h1>
        </div>
      </div>
      
      <div className="hero-content">
        <h2>Un Front pour les gouverner tous</h2>
        <p>
          Bienvenue sur ce projet d'entraînement. Ce front-end, inspiré par l'univers mythique des 
          <strong> Mystérieuses Cités d'Or</strong>, a été conçu comme un terrain d'exercice 
          polyvalent pour tester et intégrer différentes technologies back-end. 
        </p>
        <p className="hero-subtitle">
          De l'Espagne à l'Amérique du Sud, explorez les API et les bases de données à travers les aventures d'Esteban, Zia et Tao.
        </p>
      </div>
    </section>
  );
}