# Devweb-tp6 : Réducteur d'URL


## Fonctionnalités

- Réduction d’URL longue en URL courte
- API RESTful (v1 et v2)
- Interface HTML générée côté serveur (EJS)
- Interface SPA AJAX côté client (HTML/JS/CSS)
- Historique des liens créés
- Suppression de l’historique
- Documentation Swagger interactive

---

## Structure du projet

```
.
├── database/
│   ├── database.mjs
│   ├── database.sqlite
│   └── database.sql
├── router/
│   ├── api-v1.mjs
│   └── api-v2.mjs
├── static/
│   ├── client.html
│   ├── app.js
│   ├── style.css
│   └── logo_univ_16.png
├── views/
│   └── root.ejs
├── config.mjs
├── app.mjs
├── .env
├── package.json
└── README.md
```

---

## Installation

1. **Cloner le dépôt**
  
3. **Installer les dépendances**
   ```
   npm install
   ```
   
4. **Configurer les variables d’environnement**
   - Modifier le fichier `.env` si besoin (port, chemin de la base, etc.)

---

## Lancement

* **Développement** :  
  ```
  npm run dev
  ```
* **Production** :  
  ```
  npm run prod
  ```

---

## Utilisation

- **API v1** :  
  - Routes JSON pour la gestion des liens
  - Utilisation via `/api-v1/`
    
- **API v2** :  
  - Négociation de contenu (JSON ou HTML selon `Accept`)
  - Historique accessible via `/api-v2/history`
  - Suppression de l’historique via DELETE `/api-v2/history`
    
- **Interface HTML serveur** :  
  - Accessible via `/api-v2/` (rendu EJS)
    
- **Interface SPA AJAX** :
  - Accessible via `/client.html`
  - Toutes les interactions se font en AJAX (fetch)
  - Historique affiché et réinitialisable

---

## Documentation API

- Swagger disponible sur :  
  [http://localhost:8080/api-docs/](http://localhost:8080/api-docs/)
  
- Permet de tester toutes les routes et voir les schémas de réponse

---

> [!NOTE]
>
> * **Routes dynamiques** :  
>  Les routes spécifiques (ex : `/history`) doivent être déclarées avant les routes dynamiques >(`/:url`) dans Express.
>  
> * **Base SQLite** :  
>  Chaque instance du serveur utilise son propre fichier de base. Les liens ne sont pas >partagés entre plusieurs instances sauf configuration spéciale.
>  
>
> * **Variables d’environnement** :  
>  Centralisées dans `config.mjs` et `.env`.

---

## Les différents URL

* [http://localhost:8080/api-v1](http://localhost:8080/api-v1)
* [http://localhost:8080/api-v2/](http://localhost:8080/api-v2/)
* [http://localhost:8080/client.html](http://localhost:8080/client.html)
* [http://localhost:8080/api-docs/](http://localhost:8080/api-docs/)



---

## Liens utiles

* [ExpressJS Documentation](https://expressjs.com/)
* [SQLite3 Node.js](https://github.com/TryGhost/node-sqlite3)
* [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
* [Official Bulma Documentation](https://bulma.io/documentation)

