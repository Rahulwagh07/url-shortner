const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { name, shortCode } = req.body;
        const existingCategory = await Category.findOne({ $or: [{ name }, { shortCode }] });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists.' });
        }
        const newCategory = new Category({
            name,
            shortCode
        });
        await newCategory.save();

        return res.status(201).json({
             message: 'Category created successfully', 
             category: newCategory 
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};
