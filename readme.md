# VANTA Backend

The backend API for **Vanta E-commerce** — a powerful, scalable, and easy-to-maintain system that powers the Vanta website.

This backend is specially designed for **dropshipping** today and can easily scale to **own inventory & fulfillment** in the future.

---

## ✨ Key Features

- **Google Sheet Auto Sync** — The #1 feature requested by the client.  
  Just edit the Google Sheet → products appear on the website automatically (syncs every 2 minutes).

- **Full REST API** for products with filtering and search.
- **MongoDB** as database for fast and flexible data handling.
- **Category Support**: `Men` (VantaBlack), `Women` (VantaRozze), `Others` (tech, gadgets, accessories, or anything).
- **Variant Support** (colors, sizes, etc.).
- **CORS Ready** for frontend integration.
- **Vercel Serverless** optimized (fast cold starts, reliable).
- **Production Ready** error handling and logging.

---

## 🛠 Tech Stack

- **Runtime**: Node.js + Express (JavaScript)
- **Database**: MongoDB Atlas
- **Google Sheets Integration**: Google Sheets API v4 + Service Account
- **Cron Jobs**: Auto sync every 2 minutes (`node-cron`)
- **Deployment**: Vercel (Serverless Functions)
- **Security**: Helmet, CORS, Environment Variables

---

## 📁 Project Structure

```
vanta-backend/
├── server.js                    # Main entry point
├── config/
│   └── db.js                    # MongoDB connection
├── models/
│   └── Product.js               # Product schema
├── routes/
│   ├── productRoutes.js         # GET products, filter, search
│   └── syncRoutes.js            # Google Sheet sync (manual + auto)
├── .env                         # Environment variables
├── vercel.json                  # Vercel configuration
└── package.json 
```




 ## 🔑 Environment Variables (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string

# Google Sheets
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_LONG_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Cloudinary (Recommended for images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 📊 Google Sheet Format (Important)

Your Google Sheet must have these exact columns in Row 1:

| ProductID | Title | Description | Price | SalePrice | Images | Category | Variants | SKU | Status |
|-----------|-------|-------------|-------|-----------|--------|----------|---------|-----|--------|
| VB-001    | ...   | ...         | 1499  | 1299      | url1,url2 | Men     | Black-M,Black-L | ... | Active |

**Notes:**
- `Images`: Multiple Cloudinary URLs separated by comma
- `Category`: Must be `Men`, `Women`, or `Others`
- `Variants`: Comma separated (e.g. `Black-M,White-L`)

---

## 🚀 API Endpoints

| Method | Endpoint                        | Description |
|--------|----------------------------------|-----------|
| GET    | `/`                              | Health check |
| GET    | `/api/products`                  | Get all active products |
| GET    | `/api/products?category=Men`     | Filter by category |
| GET    | `/api/products?search=shirt`     | Search by title |
| GET    | `/api/products/:productID`       | Get single product |
| POST   | `/api/sync/manual`               | Manual sync from Google Sheet |
| GET    | `/api/admin/stats`               | Admin statistics |

---

## 🔄 How Sync Works

- **Auto Sync**: Runs every 2 minutes automatically
- **Manual Sync**: Can be triggered via `/api/sync/manual`
- Compares ProductID and updates/creates/deletes products
- Very reliable and fast

---

## 🖼 Image Recommendation

Use **Cloudinary** for best performance:
1. Upload images to Cloudinary
2. Copy direct URLs
3. Paste multiple URLs in **Images** column separated by comma

---

## 📦 Deployment

Backend is deployed on **Vercel** as serverless functions.

**Important**: All environment variables must be added in Vercel Dashboard → Settings → Environment Variables.

---

## 🔮 Future Ready

This backend is built to easily support:
- Real inventory management
- Order tracking
- Payment integration (Stripe, bKash, etc.)
- Supplier automation (AliExpress, etc.)
- Admin dashboard

---

## 📞 Support & Contact

**For technical issues:**
- Check logs on Vercel
- Verify Google Sheet columns and Service Account permissions
- Make sure environment variables are correctly set

---

**Built for Vanta E-commerce**  
Backend by Salman Toha — April 2026