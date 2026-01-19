import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all processed URLs with brand information
app.get("/api/processed-urls", async (req, res) => {
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
      WHERE pu.active = true
      ORDER BY pu.modified_at DESC, b.name
    `;

    const result = await pool.query(query);
    console.log("Query result: " + result);

    // Transform the data to include parsed result fields
    const transformedData = result.rows.map((row) => {
      const data = row.result || {};

      return {
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
    });

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching processed URLs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single processed URL by ID
app.get("/api/processed-urls/:id", async (req, res) => {
  try {
    const { id } = req.params;

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
});

// CSV export endpoint
app.get("/api/processed-urls/export/csv", async (req, res) => {
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

    // Generate CSV content
    const csvHeaders = [
      'id',
      'url',
      'brand',
      'model',
      'version',
      'recipients',
      'financial_product',
      'pvp_campaign',
      'monthly_fee',
      'due_date',
      'created_at',
      'modified_at',
      'screenshot',
      'active',
      'brand_id',
      'brand_name',
      'brand_url',
      'campaigns_slug'
    ];

    const csvRows = result.rows.map(row => {
      const data = row.result || {};
      return [
        row.id,
        `"${(row.url || '').replace(/"/g, '""')}"`,
        `"${(data.car?.brand || row.brand_name || '').replace(/"/g, '""')}"`,
        `"${(data.car?.model || '').replace(/"/g, '""')}"`,
        `"${(data.car?.version || '').replace(/"/g, '""')}"`,
        `"${(data.campaign?.recipients || '').replace(/"/g, '""')}"`,
        `"${(data.campaign?.financial_product || '').replace(/"/g, '""')}"`,
        data.campaign?.pvp_campaign || '',
        data.campaign?.monthly_fee?.total || '',
        `"${(data.campaign?.due_date || '').replace(/"/g, '""')}"`,
        row.created_at ? new Date(row.created_at).toISOString() : '',
        row.modified_at ? new Date(row.modified_at).toISOString() : '',
        `"${(row.screenshot || '').replace(/"/g, '""')}"`,
        row.active,
        row.brand || '',
        `"${(row.brand_name || '').replace(/"/g, '""')}"`,
        `"${(row.brand_url || '').replace(/"/g, '""')}"`,
        `"${(row.campaigns_slug || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    // Set CSV headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="processed_urls_export.csv"');
    
    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting CSV:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
