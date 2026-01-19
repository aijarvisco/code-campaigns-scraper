import pool from "../../_lib/db.js";

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
        pu.brand,
        b.name as brand_name,
        b.url as brand_url,
        b.campaigns_slug
      FROM public.processed_urls pu
      LEFT JOIN public.brands b ON pu.brand = b.id
      ORDER BY pu.modified_at DESC, b.name
    `;

    const result = await pool.query(query);

    const csvHeaders = [
      "id",
      "url",
      "brand",
      "model",
      "version",
      "recipients",
      "financial_product",
      "pvp_campaign",
      "monthly_fee",
      "due_date",
      "created_at",
      "modified_at",
      "screenshot",
      "active",
      "brand_id",
      "brand_name",
      "brand_url",
      "campaigns_slug",
    ];

    const csvRows = result.rows.map((row) => {
      const data = row.result || {};
      return [
        row.id,
        `"${(row.url || "").replace(/"/g, '""')}"`,
        `"${(data.car?.brand || row.brand_name || "").replace(/"/g, '""')}"`,
        `"${(data.car?.model || "").replace(/"/g, '""')}"`,
        `"${(data.car?.version || "").replace(/"/g, '""')}"`,
        `"${(data.campaign?.recipients || "").replace(/"/g, '""')}"`,
        `"${(data.campaign?.financial_product || "").replace(/"/g, '""')}"`,
        data.campaign?.pvp_campaign || "",
        data.campaign?.monthly_fee?.total || "",
        `"${(data.campaign?.due_date || "").replace(/"/g, '""')}"`,
        row.created_at ? new Date(row.created_at).toISOString() : "",
        row.modified_at ? new Date(row.modified_at).toISOString() : "",
        `"${(row.screenshot || "").replace(/"/g, '""')}"`,
        row.active,
        row.brand || "",
        `"${(row.brand_name || "").replace(/"/g, '""')}"`,
        `"${(row.brand_url || "").replace(/"/g, '""')}"`,
        `"${(row.campaigns_slug || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="processed_urls_export.csv"'
    );

    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
