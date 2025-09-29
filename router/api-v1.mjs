import express from 'express';
import { countLinks, createLink, getLink, incrementVisit, getStatus } from '../database/database.mjs';
import { LINK_LEN } from '../config.mjs';

const router = express.Router();

function generateShort() {
    return Math.random().toString(36).substr(2, LINK_LEN);
}

/**
 * @swagger
 * /api-v1/:
 *   get:
 *     summary: Nombre de liens déjà créés
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
 *     summary: Crée un lien réduit à partir d'une URL longue
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
 */

/**
 * @swagger
 * /api-v1/status/{url}:
 *   get:
 *     summary: Donne l’état du lien (date de création, origine et nombre de visites)
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du lien
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: string
 *                 visit:
 *                   type: integer
 */

/**
 * @swagger
 * /api-v1/{url}:
 *   get:
 *     summary: Redirige le lien raccourci vers le lien donné lors de la création
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirection vers l’URL longue
 *       404:
 *         description: Lien non trouvé
 */

router.get('/', (req, res) => {
    countLinks((err, count) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ count });
    });
});

router.post('/', (req, res) => {
    const { url } = req.body;
    try {
        new URL(url);
    } catch {
        return res.status(400).json({ error: 'URL invalide' });
    }
    const short = generateShort();
    createLink(url, short, (err) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ short });
    });
});

router.get('/status/:url', (req, res) => {
    getStatus(req.params.url, (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Lien non trouvé' });
        res.json(row);
    });
});

router.get('/:url', (req, res) => {
    getLink(req.params.url, (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Lien non trouvé' });
        incrementVisit(req.params.url, () => {
            res.redirect(row.long);
        });
    });
});

export default router;