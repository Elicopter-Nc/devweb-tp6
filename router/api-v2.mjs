import express from 'express';
import { countLinks, createLink, getLink, incrementVisit, getAllLinks, clearLinks, deleteLink } from '../database/database.mjs';
import { LINK_LEN } from '../config.mjs';

const router = express.Router();

function generateShort() {
    return Math.random().toString(36).substr(2, LINK_LEN);
}

function generateSecret() {
    return Math.random().toString(36).substr(2, LINK_LEN);
}

// GET / : nombre de liens (JSON ou HTML)
router.get('/', (req, res) => {
    countLinks((err, count) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        if (req.accepts('html')) {
            res.render('root', { count });
        } else if (req.accepts('json')) {
            res.json({ count });
        } else {
            res.status(406).send('Not Acceptable');
        }
    });
});

// POST / : création d'un lien (JSON ou HTML)
router.post('/', (req, res) => {
    const url = req.body.url || req.body.url;
    try {
        new URL(url);
    } catch {
        if (req.accepts('html')) {
            return res.render('root', { count: 0, error: 'URL invalide' });
        }
        return res.status(400).json({ error: 'URL invalide' });
    }
    const short = generateShort();
    const secret = generateSecret();
    
    createLink(url, short, secret, (err) => {
        if (err) {
            if (req.accepts('html')) {
                return res.render('root', { count: 0, error: 'DB error' });
            }
            return res.status(500).json({ error: 'DB error' });
        }
        const shortUrl = `${req.protocol}://${req.get('host')}/api-v2/${short}`;
        if (req.accepts('html')) {
            countLinks((_, count) => {
                res.render('root', { count, short: short, shortUrl, secret });
            });
        } else if (req.accepts('json')) {
            res.json({ short: short, shortUrl, secret });
        } else {
            res.status(406).send('Not Acceptable');
        }
    });
});

// GET /history - Place cette route AVANT router.get('/:url', ...)
router.get('/history', (req, res) => {
    getAllLinks((err, rows) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ links: rows });
    });
});

// DELETE /history - Suppression de tous les liens
router.delete('/history', (req, res) => {
    clearLinks((err) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ success: true });
    });
});

// DELETE /:url - Suppression d'un lien avec authentification
router.delete('/:url', (req, res) => {
    const short = req.params.url;
    const apiKey = req.get('X-API-KEY');
    
    // Pas d'en-tête X-API-Key
    if (!apiKey) {
        return res.status(401).json({ error: 'Unauthorized - X-API-KEY header required' });
    }
    
    deleteLink(short, apiKey, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'DB error' });
        }
        
        // Lien n'existe pas
        if (!result.found) {
            return res.status(404).json({ error: 'Link not found' });
        }
        
        // Secret incorrect
        if (!result.authenticated) {
            return res.status(403).json({ error: 'Forbidden - Invalid API key' });
        }
        
        // Suppression réussie
        return res.status(200).json({ message: 'Link deleted successfully' });
    });
});

// GET /:url - Route dynamique à laisser après !
router.get('/:url', (req, res) => {
    getLink(req.params.url, (err, row) => {
        if (err || !row) {
            if (req.accepts('html')) {
                return res.status(404).send('Lien non trouvé');
            }
            return res.status(404).json({ error: 'Lien non trouvé' });
        }
        incrementVisit(req.params.url, () => {
            if (req.accepts('html')) {
                res.redirect(row.long);
            } else if (req.accepts('json')) {
                // Ne pas retourner le secret dans la réponse JSON
                res.json({
                    short: row.short,
                    long: row.long,
                    created: row.created,
                    visit: row.visit
                });
            } else {
                res.status(406).send('Not Acceptable');
            }
        });
    });
});

/**
 * @swagger
 * /api-v2/:
 *   get:
 *     summary: Nombre de liens déjà créés (JSON ou HTML selon Accept)
 *     responses:
 *       200:
 *         description: Nombre de liens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *   post:
 *     summary: Crée un lien réduit à partir d'une URL longue (JSON ou HTML selon Accept)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lien raccourci créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 short:
 *                   type: string
 *                 shortUrl:
 *                   type: string
 *                 secret:
 *                   type: string
 */

/**
 * @swagger
 * /api-v2/history:
 *   get:
 *     summary: Récupère l'historique des liens raccourcis
 *     responses:
 *       200:
 *         description: Liste des liens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       short:
 *                         type: string
 *                       long:
 *                         type: string
 *   delete:
 *     summary: Supprime tout l'historique des liens
 *     responses:
 *       200:
 *         description: Historique supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */

/**
 * @swagger
 * /api-v2/{url}:
 *   get:
 *     summary: Infos du lien ou redirection (selon Accept)
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Infos du lien (JSON)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 short:
 *                   type: string
 *                 long:
 *                   type: string
 *                 created:
 *                   type: string
 *                 visit:
 *                   type: integer
 *       302:
 *         description: Redirection vers l'URL longue (HTML)
 *       404:
 *         description: Lien non trouvé
 *   delete:
 *     summary: Supprime un lien raccourci (authentification requise)
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lien supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: En-tête X-API-KEY manquant
 *       403:
 *         description: Clé API invalide
 *       404:
 *         description: Lien non trouvé
 */

export default router;