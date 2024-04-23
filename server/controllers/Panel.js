const Panel = require('../models/Panel');

exports.addPanelOption = async (req, res) => {
    try {
        const { optionName, optionIcon, redirectionUrl } = req.body;
        const newPanelOption = new Panel({
            optionName,
            optionIcon,
            redirectionUrl,
        });
        const savedOption = await newPanelOption.save();
        res.status(201).json(savedOption);
    } catch (error) {
        console.error('Error adding panel option:', error);
        res.status(500).json({ error: 'Failed to add panel option' });
    }
};

exports.deletePanelOption = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOption = await Panel.findByIdAndDelete(id);
        if (!deletedOption) {
            return res.status(404).json({ error: 'Panel option not found' });
        }
        res.status(200).json({ message: 'Panel option deleted successfully' });
    } catch (error) {
        console.error('Error deleting panel option:', error);
        res.status(500).json({ error: 'Failed to delete panel option' });
    }
};

exports.getAllPanelOptions = async (req, res) => {
    try {
        const panelOptions = await Panel.find();
        res.status(200).json(panelOptions);
    } catch (error) {
        console.error('Error fetching panel options:', error);
        res.status(500).json({ error: 'Failed to fetch panel options' });
    }
};