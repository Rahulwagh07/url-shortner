const prisma = require('../config/prismaClient');
const fs = require('fs');
const path = require('path');

exports.addPanelOption = async (req, res) => {
    try {
        const { optionName, redirectionUrl } = req.body;
        const imgfile = req.files.optionIcon;  
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        //move uploaded file to dir
        const fileName = Date.now() + '_' + imgfile.name;
        const filePath = path.join(uploadDir, fileName);
        imgfile.mv(filePath);

        const fileUrl = `/uploads/${fileName}`; 
        const newPanelOption = await prisma.panel.create({
            data: {
                optionName,
                optionIcon: fileUrl, 
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
        const deletedOption = await prisma.panel.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!deletedOption) {
            return res.status(404).json({ error: 'Panel option not found' });
        }

        const filename = path.basename(deletedOption.optionIcon);

        //delete file from server dir
        const filePath = path.join(__dirname, 'uploads', filename);
        fs.unlinkSync(filePath);
        
        await prisma.panel.delete({
            where: {
                id: parseInt(id)
            }
        });

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
