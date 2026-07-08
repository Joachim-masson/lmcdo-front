# ☀️ Les Mystérieuses Cités d'Or — Front-End Sandbox API

<p align="center">
  <strong>Un front-end moderne et thématique conçu comme un "bac à sable" pour s'exercer sur différents langages Back-End (Java, etc.).</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20D%C3%A9veloppement-orange?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Environment-Local-lightgrey?style=for-the-badge" alt="Environnement">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-8.0.10-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
</p>

---

## 🧭 Le Concept du Projet

Le but principal de ce projet est de me fournir une interface utilisateur (UI) complète, robuste et figée sur le thème du célèbre dessin animé des années 80 : **Les Mystérieuses Cités d'Or**. 

Plutôt que de recoder un Front-End à chaque fois que je souhaite apprendre ou tester une nouvelle technologie Back-End, **ce Front sert de modèle universel**. Actuellement, je l'utilise pour interconnecter et valider mes compétences en **JAVA**, mais il pourra être branché sur n'importe quelle API respectant le contrat d'interface (via une simple variable d'environnement).

---

## 🏛️ Fonctionnalités de l'Application

L'application intègre une navigation fluide via une **Navbar** et propose les fonctionnalités suivantes :

*   👥 **Liste des personnages :** Affichage global de l'ensemble des héros (Esteban, Zia, Tao...) et antagonistes de la série.
*   🔍 **Vue détaillée :** Clic sur un personnage pour consulter sa fiche complète, son histoire et ses spécificités.
*   🛡️ **Espace Admin (CRUD Complet) :** Une section dédiée permettant de gérer la base de données :
    *   **Create :** Ajouter un nouveau personnage.
    *   **Read :** Consulter les données existantes.
    *   **Update :** Modifier les informations d'un personnage (ex: changer la description du Grand Condor).
    *   **Delete :** Supprimer un personnage de la liste.

---

## 🔌 Connexion au Back-End (API)

Le projet est entièrement découplé. Pour lier ce Front-End à ton serveur (Java Spring Boot ou autre), il suffit de configurer l'URL de ton API dans le fichier de configuration des variables d'environnement.

1. Crée un fichier `.env` à la racine du projet.
2. Ajoute la clé suivante avec l'adresse de ton serveur local :

```env
  VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🚀 Lancement en Local

Pour faire tourner le Front-End sur ton poste :
1. **Cloner le projet :**
```bash 
  git clone [https://github.com/joachim-masson/cites-d-or-front.git](https://github.com/joachim-masson/cites-d-or-front.git)
  cd cites-d-or-front
```

2. **Installer les dépendances :**
```bash
  npm install
```

3. **Lancer le serveur de développement Vite :**
```bash
  npm run dev
```

Le site sera accessible localement (généralement sur http://localhost:5173).

---

## 🛠️ Stack Technique
Framework : React 19.2.5

Outil de build : Vite 8.0.10

Langage : TypeScript 6.0.2

---

## 👤 Auteur
Joachim Masson — Développeur Full-Stack Junior

Portfolio en ligne : joachim-masson.vercel.app

GitHub : [joachim-masson](https://github.com/Joachim-masson)
