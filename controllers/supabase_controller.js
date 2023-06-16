import supabase from "../config/supabase_config.js";
import path from "path";
export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "please upload Image" });
    let uploadedFilename = file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname);
    const { data, error } = await supabase.storage.from("User").upload(`/` + uploadedFilename, file.buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.mimetype,
    });
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
