const actorService = require('../services/actorService.js');

exports.uploadActors = async (req, res) => {
    try {
        let result = await actorService.uploadActors(req);
        if (!result) throw new Error("Error while uploading the file");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.downloadActors = async (req, res) => {
    try {
        await actorService.downloadActors(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}