const prisma = require('../config/prismaClient');

exports.addPanelOption = async (req, res) => {
    try {
        const { optionName, optionIcon, redirectionUrl } = req.body;
        const newPanelOption = await prisma.panel.create({
            data: {
                optionName,
                optionIcon,
                redirectionUrl,
            }
        });

        return res.status(201).json(newPanelOption);
    } catch (error) {
        console.error('Error adding panel option:', error);
        return res.status(500).json({ error: 'Failed to add panel option' });
    }
};

exports.deletePanelOption = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedOption = await prisma.panel.delete({
            where: {
                id: parseInt(id)
            }
        });

        if (!deletedOption) {
            return res.status(404).json({ error: 'Panel option not found' });
        }

        return res.status(200).json({ message: 'Panel option deleted successfully' });
    } catch (error) {
        console.error('Error deleting panel option:', error);
        return res.status(500).json({ error: 'Failed to delete panel option' });
    }
};

exports.getAllPanelOptions = async (req, res) => {
    try {
        const panelOptions = await prisma.panel.findMany();
        return res.status(200).json(panelOptions);
    } catch (error) {
        console.error('Error fetching panel options:', error);
        return res.status(500).json({ error: 'Failed to fetch panel options' });
    }
};
