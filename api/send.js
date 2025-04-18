export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  console.log(`New entry: ${firstName} - ${email}`);

  return res.status(200).json({ message: "Success", firstName, email });
}

