const FoundItem = require("../Models/FoundItem");


// CREATE Found Item
exports.createFoundItem = async (req, res) => {
  try {
    const itemData = req.body;
    
    if (req.file) {
      itemData.image = req.file.filename;
    }

    const newItem = new FoundItem(itemData);
    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// READ All Found Items
exports.getAllFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// READ Single Found Item
exports.getFoundItemById = async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE Found Item
exports.updateFoundItem = async (req, res) => {
  try {
    const updateData = req.body;
    
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedItem = await FoundItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE / ARCHIVE Found Item
exports.archiveFoundItem = async (req, res) => {
  try {
    const item = await FoundItem.findByIdAndUpdate(
      req.params.id,
      { status: "Archived" },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item archived successfully", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};