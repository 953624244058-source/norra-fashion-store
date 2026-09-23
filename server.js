const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'norra123';
const MONGODB_URI = process.env.MONGODB_URI || '';

/* =========================
   BASIC SETUP
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const localFile = path.join(dataDir, 'store.json');

/* Make sure data folder exists */
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/* Serve frontend files */
app.use(express.static(publicDir));

/* =========================
   DEMO PRODUCTS
========================= */

const products = [
  [
    'Oversized Cotton Tee',
    'Women',
    '₹699',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Classic Denim Jacket',
    'Women',
    '₹1,499',
    'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Satin Party Dress',
    'Women',
    '₹1,899',
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Ribbed Crop Top',
    'Women',
    '₹599',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Wide Leg Trousers',
    'Women',
    '₹999',
    'https://images.unsplash.com/photo-1506629905607-d9d2f8f6b8e4?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Minimal Blazer',
    'Women',
    '₹1,799',
    'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Casual Linen Shirt',
    'Men',
    '₹899',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Relaxed Hoodie',
    'Men',
    '₹1,099',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Straight Fit Jeans',
    'Men',
    '₹1,299',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Essential Overshirt',
    'Men',
    '₹1,199',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Everyday Sneakers',
    'Accessories',
    '₹1,599',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80'
  ],
  [
    'Classic Shoulder Bag',
    'Accessories',
    '₹1,299',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80'
  ]
].map((p, i) => ({
  id: i + 1,
  name: p[0],
  category: p[1],
  price: p[2],
  image: p[3]
}));

/* =========================
   DEMO DATA
========================= */

const demo = {
  products,

  reviews: [
    {
      id: 1,
      name: 'Ananya',
      rating: 5,
      text: 'Quality is really good and delivery was smooth.'
    },
    {
      id: 2,
      name: 'Harini',
      rating: 4,
      text: 'Loved the fit and the packaging.'
    },
    {
      id: 3,
      name: 'Rahul',
      rating: 5,
      text: 'Clean designs and very nice collection.'
    }
  ],

  feedback: [],

  posts: [
    {
      id: 1,
      platform: 'Instagram',
      title: 'New Season Drop',
      text: 'Fresh looks for your everyday style.',
      date: '2026-09-21'
    },
    {
      id: 2,
      platform: 'YouTube',
      title: 'NORRA Style Edit',
      text: 'How to style your new-season essentials.',
      date: '2026-09-20'
    }
  ],

  analytics: {
    Instagram: {
      views: 25430,
      reach: 19200,
      clicks: 1280,
      likes: 2840,
      comments: 310,
      shares: 420,
      conversions: 96
    },

    TikTok: {
      views: 41200,
      reach: 35600,
      clicks: 2240,
      likes: 5120,
      comments: 540,
      shares: 890,
      conversions: 145
    },

    YouTube: {
      views: 32800,
      reach: 28400,
      clicks: 1650,
      likes: 3450,
      comments: 280,
      shares: 610,
      conversions: 122
    },

    Facebook: {
      views: 18620,
      reach: 14500,
      clicks: 820,
      likes: 1920,
      comments: 180,
      shares: 280,
      conversions: 67
    }
  }
};

/* =========================
   LOCAL STORAGE
========================= */

let localStore = null;

function loadLocal() {
  if (!localStore) {
    try {
      localStore = JSON.parse(
        fs.readFileSync(localFile, 'utf8')
      );
    } catch (error) {
      localStore = JSON.parse(JSON.stringify(demo));

      fs.writeFileSync(
        localFile,
        JSON.stringify(localStore, null, 2)
      );
    }
  }

  return localStore;
}

function saveLocal() {
  fs.writeFileSync(
    localFile,
    JSON.stringify(localStore, null, 2)
  );
}

/* =========================
   MONGODB
========================= */

const useMongo = Boolean(MONGODB_URI);

let Product;
let Review;
let Feedback;
let Post;
let Analytics;

if (useMongo) {
  const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: String,
    image: String
  });

  const reviewSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  const postSchema = new mongoose.Schema({
    platform: String,
    title: String,
    text: String,
    date: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  const analyticsSchema = new mongoose.Schema(
    {
      platform: String,
      views: Number,
      reach: Number,
      clicks: Number,
      likes: Number,
      comments: Number,
      shares: Number,
      conversions: Number
    },
    {
      timestamps: true
    }
  );

  Product = mongoose.model('Product', productSchema);
  Review = mongoose.model('Review', reviewSchema);
  Feedback = mongoose.model('Feedback', feedbackSchema);
  Post = mongoose.model('Post', postSchema);
  Analytics = mongoose.model('Analytics', analyticsSchema);

  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log('MongoDB connected');

      if ((await Product.countDocuments()) === 0) {
        await Product.insertMany(products);
      }

      if ((await Review.countDocuments()) === 0) {
        await Review.insertMany(demo.reviews);
      }

      if ((await Post.countDocuments()) === 0) {
        await Post.insertMany(demo.posts);
      }

      if ((await Analytics.countDocuments()) === 0) {
        await Analytics.insertMany(
          Object.entries(demo.analytics).map(
            ([platform, values]) => ({
              platform,
              ...values
            })
          )
        );
      }
    })
    .catch((error) => {
      console.error(
        'MongoDB connection error:',
        error.message
      );
    });
}

/* =========================
   ADMIN AUTH
========================= */

function auth(req, res, next) {
  const password = req.headers['x-admin-password'];

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: 'Invalid admin password'
    });
  }

  next();
}

/* =========================
   ANALYTICS METRICS
========================= */

function metrics(rows) {
  return rows.map((x) => ({
    ...x,

    ctr: x.views
      ? ((x.clicks / x.views) * 100).toFixed(2)
      : '0.00',

    conversionRate: x.clicks
      ? ((x.conversions / x.clicks) * 100).toFixed(2)
      : '0.00',

    engagementRate: x.reach
      ? (
          ((x.likes + x.comments + x.shares) /
            x.reach) *
          100
        ).toFixed(2)
      : '0.00',

    engagement:
      (x.likes || 0) +
      (x.comments || 0) +
      (x.shares || 0)
  }));
}

/* =========================
   PRODUCT API
========================= */

app.get('/api/products', async (req, res) => {
  try {
    if (useMongo) {
      const data = await Product.find().lean();
      return res.json(data);
    }

    res.json(loadLocal().products);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* =========================
   REVIEWS API
========================= */

app.get('/api/reviews', async (req, res) => {
  try {
    if (useMongo) {
      const data = await Review
        .find()
        .sort({ createdAt: -1 })
        .lean();

      return res.json(data);
    }

    res.json(loadLocal().reviews);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, rating, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({
        error: 'Name and review are required'
      });
    }

    if (useMongo) {
      const review = await Review.create({
        name,
        rating: Number(rating) || 5,
        text
      });

      return res.json(review);
    }

    const store = loadLocal();

    const review = {
      id: Date.now(),
      name,
      rating: Number(rating) || 5,
      text
    };

    store.reviews.unshift(review);
    saveLocal();

    res.json(review);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* =========================
   FEEDBACK API
========================= */

app.post('/api/feedback', async (req, res) => {
  try {
    const {
      name,
      email,
      message
    } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    if (useMongo) {
      const feedback = await Feedback.create({
        name,
        email,
        message
      });

      return res.json(feedback);
    }

    const store = loadLocal();

    const feedback = {
      id: Date.now(),
      name,
      email,
      message,
      date: new Date().toISOString()
    };

    store.feedback.unshift(feedback);
    saveLocal();

    res.json(feedback);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* =========================
   POSTS API
========================= */

app.get('/api/posts', async (req, res) => {
  try {
    if (useMongo) {
      const data = await Post
        .find()
        .sort({ createdAt: -1 })
        .lean();

      return res.json(data);
    }

    res.json(loadLocal().posts);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.post('/api/posts', auth, async (req, res) => {
  try {
    const {
      platform,
      title,
      text
    } = req.body;

    if (!title || !text) {
      return res.status(400).json({
        error: 'Title and text are required'
      });
    }

    if (useMongo) {
      const post = await Post.create({
        platform,
        title,
        text,
        date: new Date()
          .toISOString()
          .slice(0, 10)
      });

      return res.json(post);
    }

    const store = loadLocal();

    const post = {
      id: Date.now(),
      platform,
      title,
      text,
      date: new Date()
        .toISOString()
        .slice(0, 10)
    };

    store.posts.unshift(post);
    saveLocal();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* =========================
   ANALYTICS API
========================= */

app.get('/api/analytics', async (req, res) => {
  try {
    let rows;

    if (useMongo) {
      rows = await Analytics.find().lean();
    } else {
      rows = Object.entries(loadLocal().analytics).map(
        ([platform, values]) => ({
          platform,
          ...values
        })
      );
    }

    res.json(metrics(rows));
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* =========================
   ADMIN FEEDBACK
========================= */

app.get('/api/feedback', auth, async (req, res) => {
  try {
    if (useMongo) {
      const data = await Feedback
        .find()
        .sort({ createdAt: -1 })
        .lean();

      return res.json(data);
    }

    res.json(loadLocal().feedback);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* =========================
   SEED DEMO DATA
========================= */

app.post('/api/seed', auth, async (req, res) => {
  try {
    if (useMongo) {
      await Product.deleteMany({});
      await Product.insertMany(products);

      await Review.deleteMany({});
      await Review.insertMany(demo.reviews);

      await Post.deleteMany({});
      await Post.insertMany(demo.posts);

      await Analytics.deleteMany({});
      await Analytics.insertMany(
        Object.entries(demo.analytics).map(
          ([platform, values]) => ({
            platform,
            ...values
          })
        )
      );

      return res.json({
        ok: true,
        message: 'Demo data loaded to MongoDB'
      });
    }

    localStore = JSON.parse(
      JSON.stringify(demo)
    );

    saveLocal();

    res.json({
      ok: true,
      message: 'Demo data loaded locally'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* =========================
   FRONTEND FALLBACK
========================= */

/*
   IMPORTANT:
   API routes above are handled first.
   Any other browser route will load index.html.
*/

app.use((req, res) => {
  const indexFile = path.join(
    publicDir,
    'index.html'
  );

  if (!fs.existsSync(indexFile)) {
    return res.status(404).send(
      'NORRA frontend not found. Please make sure public/index.html exists.'
    );
  }

  res.sendFile(indexFile);
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `NORRA running on port ${PORT}`
  );
});
