const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ethrwxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const productCollection = client.db("ourStoreDB").collection("allProducts");

        // Get Products with Pagination, Searching, Categorization, and Sorting
        app.get('/allProducts', async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const searchQuery = req.query.search || '';
            const brandName = req.query.brandName || '';
            const category = req.query.category || '';
            const priceRange = req.query.priceRange || '';
            const sortField = req.query.sortField || 'ProductCreationDate';
            const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

            const query = {
                ProductName: { $regex: searchQuery, $options: 'i' },
            };

            if (brandName) {
                query.BrandName = brandName;
            }

            if (category) {
                query.Category = category;
            }

            if (priceRange) {
                const [minPrice, maxPrice] = priceRange.split('-').map(Number);
                query.Price = { $gte: minPrice, ...(maxPrice && { $lte: maxPrice }) };
            }

            

            res.send({
                products,
                totalPages,
                currentPage: page,
            });
        });

        console.log("Connected to MongoDB!");
    } finally {
        // Do not close the client here to keep the connection alive
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Our Store is Running');
});

app.listen(port, () => {
    console.log(`Our Store Is Running On Port ${port}`);
});

