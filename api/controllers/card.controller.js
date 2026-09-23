import Card from "../models/card.model.js";

const DEFAULT_CARDS = [
  "ADCB",
  "CITY",
  "ASEEL",
  "NBD",
  "RAK RED",
  "RAK TITANIUM",
  "SHARJH ISLAMIC",
  "OTHER",
];

export const getAllCards = async (req, res) => {
  try {
    let cards = await Card.find().sort({ name: 1 });

    // Seed default cards if collection is empty
    if (cards.length === 0) {
      const defaultDocs = DEFAULT_CARDS.map((name) => ({ name }));
      await Card.insertMany(defaultDocs, { ordered: false }).catch(() => {});
      cards = await Card.find().sort({ name: 1 });
    }

    res.json({ success: true, data: cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ success: false, message: "Fetching cards failed" });
  }
};

export const createCard = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Card name is required" });
    }

    const trimmedName = name.trim();

    // Check case-insensitive duplicate
    const existingCard = await Card.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existingCard) {
      return res.status(400).json({ success: false, message: "Card with this name already exists" });
    }

    const card = new Card({ name: trimmedName });
    await card.save();

    res.status(201).json({ success: true, data: card, message: "Card created successfully" });
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(400).json({ success: false, message: error.message || "Failed to create card" });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Card name is required" });
    }

    const trimmedName = name.trim();

    // Check if another card already has this name
    const existingCard = await Card.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existingCard) {
      return res.status(400).json({ success: false, message: "Card with this name already exists" });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { name: trimmedName },
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    res.json({ success: true, data: updatedCard, message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(400).json({ success: false, message: error.message || "Failed to update card" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ success: false, message: "Card not found" });
    }

    res.json({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete card" });
  }
};
