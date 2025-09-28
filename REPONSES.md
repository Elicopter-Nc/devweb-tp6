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








