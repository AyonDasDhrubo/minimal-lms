import Module from "../models/Module.model.js"; 
// Create module 
export const createModule = async (req, res) => {
    try {
        const { title, moduleNumber, course } = req.body;
        const newModule = await Module.create({ title, moduleNumber, course });
        res.status(201).json(newModule);
    }
    catch (err) { res.status(500).json({ error: err.message }); }
};
// Get modules by course 
export const getModulesByCourse = async (req, res) => {
    try {
        const modules = await Module.find({ course: req.params.courseId });
        res.json(modules);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
// Delete module 
export const deleteModule = async (req, res) => {
    try {
        await Module.findByIdAndDelete(req.params.id);
        res.json({ message: "Module deleted" });
    }
    catch (err) { res.status(500).json({ error: err.message }); }
};