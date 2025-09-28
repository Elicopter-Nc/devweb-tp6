# Reponses.md

### 1/ Donner la commande httpie correspondant à la commande curl donnée par la doc pour la route POST.

```
http POST http://localhost:8080/api-v2/ url=https://exemple.com
```

### 2/ Démarrer l’application en mode production avec npm run prod puis en mode développement avec npm run dev. Donner les principales différences entre les deux modes.

* npm run prod : lance l’application en mode production (Node.js simple, pas de rechargement automatique, logs réduits).
* npm run dev : lance l’application en mode développement (utilise nodemon, rechargement automatique à chaque modification de fichier, logs plus détaillés).

### 3/ Donner le script npm qui permet de formatter automatiquement tous les fichiers .mjs

* Le script à ajouté dans ```package.json``` :

```js
"scripts": {
  "format": "prettier --write \"**/*.mjs\""
}
```   

* La commande :
```npm run format```

### 4/ Les réponses HTTP contiennent une en-tête X-Powered-By. Donner la configuration Express à modifier pour qu’elle n’apparaisse plus.

Dans le fichier ```app.mjs``` :

```js
app.disable('x-powered-by');
```


### 5/ Créer un nouveau middleware (niveau application) qui ajoute un header X-API-version avec la version de l’application. Donner le code.

Dans le fichier ```app.mjs``` :
```js
app.use((req, res, next) => {
  res.setHeader('X-API-version', '1.0.0');
  next();
});
```

### 6/ Trouver un middleware Express qui permet de répondre aux requêtes favicon.ico avec static/logo_univ_16.png. Donner le code.

Dans le fichier ```app.mjs``` :
```js
import favicon from 'serve-favicon';
import { fileURLToPath } from 'url';
import path from 'path';

const _fileName = fileURLToPath(import.meta.url);
const _directoryName = path.dirname(_fileName);

app.use(favicon(path.join(_directoryName, "static", "logo_univ_16.png")));
```

### 7/ Donner les liens vers la documentation du driver SQLite utilisé dans l’application.  


* [Documentation officielle sqlite3 pour Node.js](https://github.com/TryGhost/node-sqlite3)
  
* [Documentation SQLite](https://sqlite.org/docs.html)


### 8/ Indiquer à quels moments la connexion à la base de données est ouverte est quand elle est fermée.

* La connexion est ouverte à l’appel de new sqlite3.Database(...) (au démarrage du serveur).  
* Elle est fermée à l’appel de db.close() (généralement à l’arrêt du serveur ou lors d’un nettoyage).


### 9/ Avec un navigateur en mode privé visiter une première fois http://localhost:8080/, puis une deuxième. Ensuite rechargez avec Ctrl+Shift+R. Conclure sur la gestion du cache par Express.

* La première visite charge tous les fichiers depuis le serveur.
* La deuxième visite utilise le cache du navigateur pour les fichiers statiques.
* Ctrl+Shift+R force le rechargement depuis le serveur, ignorant le cache.
* Conclusion : Express sert les fichiers statiques avec des headers permettant le cache, mais le navigateur peut forcer le rechargement.

### 10/ Ouvrir deux instances de l’application, une sur le port 8080 avec npm run dev et une autre sur le port 8081 avec la commande cross-env PORT=8081 NODE_ENV=development npx nodemon server.mjs. Créer un lien sur la première instance http://localhost:8080/ et ensuite un autre sur la seconde instante http://localhost:8081/. Les liens de l’un doivent être visibles avec l’autre. Expliquer pourquoi.

Dans le fichier ``` ```:

```js

```

* Les liens ne sont pas visibles entre les deux instances car chaque serveur utilise sa propre base SQLite locale (fichier différent ou même fichier mais verrouillé par une instance).
* Pour partager les liens, il faudrait que les deux serveurs utilisent exactement le même fichier de base de données et que celui-ci soit accessible en lecture/écriture par les deux processus.














