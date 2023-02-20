const Deed = require('../models/Deed');

module.exports =  {
    add: async (req, res) => {
        console.log("add");
        try{
        const deed = new Deed(req.body);
        await deed.save();
        return res.json(deed).status(201);
        }
        catch(error){
            return res.status(500).json(error);
        }
    },
    list: async (req, res) => {
        console.log("list");
        try{
        const deeds = await Deed.find({}).sort({createdAt: -1});
        if (!deeds) {
            return res.status(404).send();
        }
        return res.json(deeds);
        }
        catch(error){
            return res.status(500).send(error);
        }
    },
    update: async (req, res) => {
        console.log("update");
        try{
        const deed = await Deed.findByIdAndUpdate(req.body.id, req.body, {new: true});
        if (!deed) {
            return res.status(404).send();
        }
        return res.json(deed);
        }
        catch(error){
            return res.status(500).send(error);
        }
    },
    remove: async (req, res) => {
        console.log("remove");
        try {
            const deed = await Deed.findByIdAndDelete(req.params.id);            
            if (!deed) {
                return res.status(404).send();
            }
            else
            return res.status(200).send();
        }
        catch(error){
            return res.status(500
            ).send(error);         
        }
    },
    get: async (req, res) => {
        console.log("get");
        try{
        const deed = await Deed.findById(req.params.id);
        if (!deed) {
            return res.status(404).send();
        }
        return res.json(deed).status(200);
    }
    catch(error){
        return res.status(500).send(error);
    }
    }
}