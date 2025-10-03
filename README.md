# Devweb-tp6 : Réducteur d'URL

Application web de réduction d'URL (URL shortener) développée avec Node.js, Express et SQLite.

---

## Déploiement

**Production :** [https://devweb-tp6.onrender.com](https://devweb-tp6.onrender.com)

---

## Fonctionnalités

- Réduction d'URL longue en URL courte (6 caractères alphanumériques)
- API RESTful versionnée (v1 et v2)
- Négociation de contenu (JSON/HTML)
- Interface HTML générée côté serveur (EJS)
- Interface SPA avec client AJAX
- Compteur de visites par lien
- Suppression sécurisée avec authentification par clé API
- Documentation interactive Swagger/OpenAPI
- Responsive design avec Bulma CSS

---

## Structure du projet

```
devweb-tp6/
├── database/
│   ├── database.mjs          # Fonctions d'accès à la base de données
│   ├── database.sqlite        # Base de données SQLite (auto-générée)
│   └── database.sql           # Schéma SQL
├── router/
│   ├── api-v1.mjs            # Routes API v1 (JSON uniquement)
│   └── api-v2.mjs            # Routes API v2 (JSON + HTML)
├── static/
│   ├── client.html           # Interface SPA
│   ├── app.js                # Logique client AJAX
│   ├── style.css             # Styles personnalisés
│   ├── logo_univ_16.png      # Favicon
│   └── open-api.yaml         # Spécification OpenAPI
├── views/
│   └── root.ejs              # Template EJS pour rendu HTML serveur
├── config.mjs                # Configuration centralisée
├── app.mjs                   # Point d'entrée de l'application
├── .env                      # Variables d'environnement
├── package.json              # Dépendances npm
└── README.md
```

---

## Installation et lancement


### Installation

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd devweb-tp6
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```
   
3. **Configurer l'environnement**
   
   Le fichier `.env` contient :
   ```env
   PORT=8080
   LINK_LEN=6
   DB_FILE=database/database.sqlite
   DB_SCHEMA=database/database.sql
   ```

### Lancement

**Mode développement** (avec hot-reload) :
```bash
npm run dev
```

**Mode production** :
```bash
npm run prod
```

L'application sera accessible sur `http://localhost:8080`

---

## Documentation des APIs

### API v1 (`/api-v1`)

API JSON uniquement, sans négociation de contenu.

| Méthode | Route | Description | Réponse |
|---------|-------|-------------|---------|
| GET | `/` | Nombre de liens créés | `{ count: number }` |
| POST | `/` | Créer un lien court | `{ short: string }` |
| GET | `/:url` | Redirection vers URL longue | Redirect 302 |
| GET | `/status/:url` | Statistiques du lien | `{ created: string, visit: number }` |

**Exemple POST :**
```bash
# httpie
http POST http://localhost:8080/api-v1/ url="https://example.com"

# curl
curl -X POST http://localhost:8080/api-v1/ \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### API v2 (`/api-v2`)

API avec négociation de contenu (JSON ou HTML selon l'en-tête `Accept`).

| Méthode | Route | Description | Content-Type |
|---------|-------|-------------|--------------|
| GET | `/` | Nombre de liens | JSON / HTML |
| POST | `/` | Créer un lien | JSON / HTML |
| GET | `/:url` | Info ou redirection | JSON / HTML |
| GET | `/history` | Historique (20 derniers) | JSON |
| DELETE | `/history` | Supprimer tout l'historique | JSON |
| DELETE | `/:url` | Supprimer un lien (auth requise) | JSON |

**Exemple POST avec réponse incluant le secret :**
```bash
http POST http://localhost:8080/api-v2/ url="https://perdu.com"
```

**Réponse :**
```json
{
  "short": "WmFJQp",
  "shortUrl": "http://localhost:8080/api-v2/WmFJQp",
  "secret": "RatQak"
}
```

---

## Authentification et sécurité

### Génération de clé secrète

Lors de la création d'un lien via l'API v2, un **secret aléatoire** (6 caractères) est automatiquement généré et retourné **une seule fois** :

```json
{
  "short": "abc123",
  "shortUrl": "http://localhost:8080/api-v2/abc123",
  "secret": "xyz789"
}
```

> [!Warning] 
> - Conservez ce secret précieusement, il ne sera plus accessible par la suite
> - Le secret n'est **jamais retourné** lors des requêtes GET
> - Seul le possesseur du secret peut supprimer le lien

### Suppression d'un lien

Pour supprimer un lien, fournissez le secret via l'en-tête HTTP `X-API-KEY` :

**Avec httpie :**
```bash
http DELETE http://localhost:8080/api-v2/WmFJQp X-API-KEY:RatQak
```

**Avec curl :**
```bash
curl -X DELETE http://localhost:8080/api-v2/WmFJQp \
  -H "X-API-KEY: RatQak"
```

**Codes de réponse HTTP :**

| Code | Signification |
|------|---------------|
| 200 | Suppression réussie |
| 401 | En-tête `X-API-KEY` manquant (Unauthorized) |
| 403 | Clé API invalide (Forbidden) |
| 404 | Lien non trouvé (Not Found) |
| 500 | Erreur serveur |

---

## Interfaces utilisateur

### 1. Interface SPA AJAX (`/`)

Interface moderne en Single Page Application accessible à la racine.

**Fonctionnalités :**
- Formulaire de création de lien
- Affichage du lien raccourci avec bouton "Copier"
- Historique des 20 derniers liens
- Suppression complète de l'historique
- Design responsive avec Bulma CSS et Font Awesome

**Technologies :** HTML5, Vanilla JavaScript (Fetch API), Bulma CSS

### 2. Interface HTML serveur (`/api-v2/`)

Rendu côté serveur avec EJS pour les navigateurs sans JavaScript.

**Fonctionnalités :**
- Formulaire de création
- Affichage du lien créé

### 3. Documentation Swagger (`/api-docs/`)

Interface interactive pour tester toutes les routes de l'API.

**Fonctionnalités :**
- Test des requêtes directement depuis le navigateur
- Saisie de la clé API pour tester la suppression
- Visualisation des schémas de réponse
- Sélection du serveur (API v1 ou v2)

---

## Base de données

**Technologie :** SQLite3

**Schéma de la table `links` :**

| Colonne | Type | Description |
|---------|------|-------------|
| id | INTEGER | Clé primaire auto-incrémentée |
| short | TEXT | Code court unique (6 caractères) |
| long | TEXT | URL longue d'origine |
| secret | TEXT | Clé secrète pour suppression |
| created | DATETIME | Date de création (auto) |
| visit | INTEGER | Nombre de visites (défaut: 0) |

**Initialisation :**
- La base est créée automatiquement au premier lancement
- Fichier : `database/database.sqlite`
- Pour réinitialiser : supprimez le fichier et relancez l'application

---

## Tests manuels

### httpie (recommandé)

Installation :
```bash
# Windows
pip install httpie
```

Exemples :
```bash
# Créer un lien
http POST http://localhost:8080/api-v2/ url="https://example.com"

# Consulter un lien
http http://localhost:8080/api-v2/abc123

# Supprimer un lien
http DELETE http://localhost:8080/api-v2/abc123 X-API-KEY:secret123
```

### curl

```bash
# GET
curl http://localhost:8080/api-v1/

# POST
curl -X POST http://localhost:8080/api-v2/ \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'

# DELETE
curl -X DELETE http://localhost:8080/api-v2/abc123 \
  -H "X-API-KEY: secret123"
```

---

## Configuration

### Variables d'environnement (`.env`)

```env
PORT=8080                              # Port du serveur
LINK_LEN=6                             # Longueur des codes courts
DB_FILE=database/database.sqlite       # Chemin de la base SQLite
DB_SCHEMA=database/database.sql        # Schéma SQL
LOG_LEVEL=info                         # Niveau de log
```

### Fichier de configuration (`config.mjs`)

Centralise la configuration en important les variables d'environnement avec `dotenv`.

---

## Tags Git

| Tag | Description |
|-----|-------------|
| `reponses` | Réponses aux questions de prise en main (Partie 1) |
| `api-v1` | API v1 complète avec routes GET/POST (Partie 2) |
| `api-v2` | Négociation de contenus et HTML côté serveur (Partie 3) |
| `client-ajax` | Client SPA AJAX avec interface moderne (Partie 4) |
| `api-v2-delete` | Suppression sécurisée avec authentification (Partie 5) |

---

## URLs de l'application

- **Interface SPA :** [http://localhost:8080/](http://localhost:8080/)
- **API v1 :** [http://localhost:8080/api-v1](http://localhost:8080/api-v1)
- **API v2 :** [http://localhost:8080/api-v2/](http://localhost:8080/api-v2/)
- **Documentation Swagger :** [http://localhost:8080/api-docs/](http://localhost:8080/api-docs/)

---

## Ressources et documentation

### Dépendances principales

- **Express 5.1.0** - Framework web Node.js
- **SQLite3 5.1.7** - Base de données embarquée
- **EJS 3.1.10** - Moteur de templates
- **Swagger UI Express 5.0.1** - Documentation interactive
- **Bulma 1.0.4** (CDN) - Framework CSS

### Liens utiles

- [Express.js Documentation](https://expressjs.com/) - Guide complet d'Express
- [SQLite3 for Node.js](https://github.com/TryGhost/node-sqlite3) - API SQLite
- [EJS Documentation](https://ejs.co/) - Syntaxe des templates
- [Swagger/OpenAPI Specification](https://swagger.io/specification/) - Format de documentation API
- [Bulma Documentation](https://bulma.io/documentation) - Framework CSS
- [HTTPie Documentation](https://httpie.io/docs) - Client HTTP en ligne de commande
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - AJAX moderne



