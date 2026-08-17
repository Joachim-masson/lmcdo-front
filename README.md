# ☀️ Les Mystérieuses Cités d'Or — Front-End React & TypeScript

<p align="center">
  <strong>L'interface utilisateur interactive et thématique conçue pour explorer le grand registre galactique de l'univers LMCDO.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20D%C3%A9veloppement-orange?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Environment-Local-lightgrey?style=for-the-badge" alt="Environnement">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Biome-2.4-60A5FA?style=flat-square&logo=biome&logoColor=white" alt="Biome">
</p>

---

## 🧭 Le Concept du Projet

Ce projet constitue le client **Front-End (SPA)** de l'univers **LMCDO** (Les Mystérieuses Cités d'Or). Développé avec **React 19, TypeScript et Vite**, il offre une interface moderne, dynamique et typée pour interagir avec les données du grand registre.

💡 **Approche Agnostique du Back-End :**  
Cette application client a été conçue comme un terrain d'expérimentation modulaire. Son architecture de communication API est flexible, ce qui me permet de la brancher à différents serveurs Back-End au fil de mon apprentissage :
* ☕ **API Java (Spring Boot)** — *API principale opérationnelle.*
* 🐍 **API Python (Django / FastAPI)** — *Prochaine étape d'expérimentation.*
* 📜 **Back-End COBOL / Autre** — *Défi et exploration bas niveau.*

---

## 🏛️ Fonctionnalités de l'Interface

L'interface propose un dashboard et des vues dédiées pour consommer les endpoints des différentes API :

* 👥 **Gestion des Explorateurs :** Visualisation de la liste des utilisateurs, création de profils, édition et gestion du statut (actif/banni).
* 🗿 **Registre des Personnages :** Affichage des fiches détaillées des héros (Esteban, Zia, Tao...) et formulaires de création/mise à jour.
* ⚡ **Performance & Validation :** Navigation fluide via **React Router v7**, typage strict via **TypeScript** et formatage/linting ultra-rapide avec **Biome**.

---

## 🔌 Configuration & Variables d'Environnement

Pour lier l'application Front-End au serveur de ton choix (Spring Boot, Django, etc.) :

1. Crée un fichier `.env.local` à la racine du projet.
2. Définis l'URL de base de l'API à consommer :

```env
VITE_API_BASE_URL=http://localhost:9000
```

---
## 🚀 Lancement en Local

Pour faire tourner le Front-End sur ton poste :
1. **Cloner le projet :**
```bash
git clone [https://github.com/Joachim-masson/lmcdo-front.git](https://github.com/Joachim-masson/lmcdo-front.git)
cd lmcdo-front
```

2. **Installer les dépendances :**
```bash
npm install
```

3. **Lancer le serveur de développement Vite :**
```bash
npm run dev
```

L'application sera accessible localement sur : http://localhost:5173 (ou le port indiqué dans la console).

---
## 🛠️ Stack Technique
Bibliothèque UI : React 19

Langage : TypeScript

Build Tool & Dev Server : Vite 8

Routage : React Router v7

Linter & Formatter : Biome

---
## 👤 Auteur
Joachim Masson — Développeur Full-Stack Junior

Portfolio en ligne : joachim-masson.vercel.app

GitHub : [joachim-masson](https://github.com/Joachim-masson)
