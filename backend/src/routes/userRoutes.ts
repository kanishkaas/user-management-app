import express, { Request, Response } from "express";
import { Router } from "express";
import pool from "../config/db";
import upload from "../middlewares/upload";
import xlsx from "xlsx";
import fs from "fs";

const router = Router(); 

router.post("/upload", upload.single("file"), async (req: Request, res: Response): Promise<void> => {

 const file = req.file as Express.Multer.File;


  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);
const data = rawData.map((row: any) => ({
  first_name: row["First Name"],
  last_name: row["Last Name"],
  email: row["Email"],
  phone_number: row["Phone Number"],
  pan_number: row["PAN Number"],
}));


    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      const { first_name, last_name, email, phone_number, pan_number } = row;

      if (!first_name || !last_name || !email || !phone_number || !pan_number) {
        errors.push({ row: i + 2, error: "Missing fields" });
        continue;
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        errors.push({ row: i + 2, error: "Invalid email" });
        continue;
      }

      if (!/^\d{10}$/.test(phone_number)) {
        errors.push({ row: i + 2, error: "Phone must be 10 digits" });
        continue;
      }

      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan_number)) {
        errors.push({ row: i + 2, error: "Invalid PAN format" });
        continue;
      }

      await pool.query(
        "INSERT INTO users (first_name, last_name, email, phone_number, pan_number) VALUES (?, ?, ?, ?, ?)",
        [first_name, last_name, email, phone_number, pan_number]
      );
    }

    if (file) fs.unlinkSync(file.path);

    if (errors.length > 0) {
      res.status(400).json({ error: "Validation errors", details: errors });
      return;
    }

    res.status(201).json({ message: "Users uploaded successfully" });
  } catch (error) {
    console.error("Upload error:", error);
    if (file) fs.unlinkSync(file.path);
    res.status(500).json({ error: "Server error during upload" });
    return;
  }
});

router.get("/sample", (req: Request, res: Response): void => {
  const workbook = xlsx.utils.book_new();

  const sampleData = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone_number: "9876543210",
    pan_number: "ABCDE1234F",
  },
];


  const worksheet = xlsx.utils.json_to_sheet(sampleData);
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sample");

  const filePath = "sample_template.xlsx";
  xlsx.writeFile(workbook, filePath);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error sending sample file:", err);
      res.status(500).json({ error: "Could not download file" });
    } else {
      fs.unlinkSync(filePath); 
    }
  });
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/users/:id
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone_number, pan_number } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, pan_number = ? WHERE id = ?',
      [first_name, last_name, email, phone_number, pan_number, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//✅ This is the missing POST / route
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { first_name, last_name, email, phone_number, pan_number } = req.body;

  if (!first_name || !last_name || !email || !phone_number || !pan_number) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  if (!/^\d{10}$/.test(phone_number)) {
    res.status(400).json({ error: "Phone number must be 10 digits" });
    return;
  }

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan_number)) {
    res.status(400).json({ error: "Invalid PAN format" });
    return;
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO users (first_name, last_name, email, phone_number, pan_number) VALUES (?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone_number, pan_number]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error while creating user" });
  }
});






export default router;
