const prisma = require('../config/prismaClient')

exports.createCategory = async (req, res) => {
    try {
        const { name, shortCode } = req.body;
        const existingCategory = await prisma.category.findFirst({
            where: {
                OR: [
                    { name: name },
                    { shortCode: shortCode }
                ]
            }
        });

        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists.' });
        }
 
        const newCategory = await prisma.category.create({
            data: {
                name,
                shortCode
            }
        });

        return res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};

