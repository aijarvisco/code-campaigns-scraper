import pool from "../_lib/db.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    const query = `
      SELECT
        pu.id,
        pu.url,
        pu.result,
        pu.created_at,
        pu.modified_at,
        pu.screenshot,
        pu.active,
        b.name as brand_name,
        b.url as brand_url
      FROM public.processed_urls pu
      LEFT JOIN public.brands b ON pu.brand = b.id
      WHERE pu.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found" });
    }

    const row = result.rows[0];
    const data = row.result || {};

    const transformedData = {
      id: row.id,
      url: row.url,
      brand: data.car?.brand || row.brand_name || "",
      model: data.car?.model || "",
      version: data.car?.version || "",
      recipients: data.campaign?.recipients || "",
      financialProduct: data.campaign?.financial_product || "",
      pvpCampaign: data.campaign?.pvp_campaign || null,
      monthlyFee: data.campaign?.monthly_fee?.total || null,
      dueDate: data.campaign?.due_date || "",
      modifiedAt: row.modified_at,
      createdAt: row.created_at,
      screenshot: row.screenshot,
      active: row.active,
      legalNote: row.campaign?.legal_note,
      summary: row.campaign?.summary,
      brandName: row.brand_name,
      brandUrl: row.brand_url,
      fullResult: row.result,
    };

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching processed URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
