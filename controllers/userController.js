const userService = require('../services/userService.js');

exports.createUser = async (req, res) => {
    try {
        let result = await userService.createUser(req);
        if (!result) throw new Error("Error while creating user");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { token } = await userService.loginUser(req);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req);
        if (!result) throw new Error("Error while deleting user");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser(req);
        if (!result) throw new Error("Error while updating user");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}