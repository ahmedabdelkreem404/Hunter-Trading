# Hunter Trading - Premium Trading Education Platform

## 1. Project Overview

**Project Name:** Hunter Trading  
**Project Type:** Full-Stack Trading Education & Affiliate Platform  
**Core Functionality:** A high-end, conversion-focused website that combines trading education, community building (Telegram), and affiliate monetization to convert visitors into paying customers and Telegram subscribers.  
**Target Users:** Aspiring traders looking to learn profitable trading strategies, existing traders seeking mentorship, and affiliate partners promoting trading platforms.  
**Tech Stack:** Core PHP (Backend API) + React.js (Frontend) + Three.js (3D Animations) + MySQL (Database) + Tailwind CSS (Styling)

## 2. Technical Architecture

### Backend (PHP REST API)
```
/api/
  ├── config/
  │   ├── database.php          # MySQL connection
  │   └── cors.php              # CORS headers
  ├── models/
  │   ├── User.php
  │   ├── Course.php
  │   ├── Signal.php
  │   ├── Testimonial.php
  │   ├── Lead.php
  │   └── Analytics.php
  ├── controllers/
  │   ├── AuthController.php
  │   ├── ContentController.php
  │   ├── CourseController.php
  │   ├── SignalController.php
  │   ├── LeadController.php
  │   └── AnalyticsController.php
  ├── routes/
  │   └── api.php
  └── index.php                 # Entry point
```

### Frontend (React.js)
```
/frontend/
  ├── public/
  │   └── index.html
  ├── src/
  │   ├── components/
  │   │   ├── three/            # 3D components
  │   │   │   ├── TradingScene.jsx
  │   │   │   ├── CandlestickChart.jsx
  │   │   │   └── GlobeAnimation.jsx
  │   │   ├── sections/         # Page sections
  │   │   │   ├── Hero.jsx
  │   │   │   ├── Coach.jsx
  │   │   │   ├── Results.jsx
  │   │   │   ├── Testimonials.jsx
  │   │   │   ├── Courses.jsx
  │   │   │   ├── Signals.jsx
  │   │   │   ├── Affiliate.jsx
  │   │   │   ├── Blog.jsx
  │   │   │   └── Footer.jsx
  │   │   ├── ui/               # Reusable UI
  │   │   │   ├── Button.jsx
  │   │   │   ├── Card.jsx
  │   │   │   ├── Modal.jsx
  │   │   │   └── TelegramButton.jsx
  │   │   └── admin/             # Admin panel
  │   │       ├── Dashboard.jsx
  │   │       ├── ContentManager.jsx
  │   │       ├── CourseManager.jsx
  │   │       ├── SignalManager.jsx
  │   │       └── UserManager.jsx
  │   ├── pages/
  │   │   ├── Home.jsx
  │   │   ├── Courses.jsx
  │   │   ├── Signals.jsx
  │   │   ├── Affiliate.jsx
  │   │   ├── Blog.jsx
  │   │   ├── Admin.jsx
  │   │   └── Login.jsx
  │   ├── hooks/
  │   │   ├── useTheme.js
  │   │   ├── useLanguage.js
  │   │   └── useAnalytics.js
  │   ├── i18n/
  │   │   ├── en.json
  │   │   └── ar.json
  │   ├── styles/
  │   │   └── globals.css
  │   ├── App.jsx
  │   └── main.jsx
  ├── package.json
  └── vite.config.js
```

### Database Schema (MySQL)
```sql
-- Users table (admin/moderators)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin', 'moderator'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Home content (dynamic)
CREATE TABLE home_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section VARCHAR(50),
  field VARCHAR(100),
  value TEXT,
  language ENUM('en', 'ar') DEFAULT 'en'
);

-- Courses
CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title_en VARCHAR(255),
  title_ar VARCHAR(255),
  description_en TEXT,
  description_ar TEXT,
  level ENUM('beginner', 'intermediate', 'advanced'),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons
CREATE TABLE lessons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT,
  title_en VARCHAR(255),
  title_ar VARCHAR(255),
  video_url VARCHAR(500),
  pdf_url VARCHAR(500),
  order_index INT,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Signals
CREATE TABLE signals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('buy', 'sell'),
  pair VARCHAR(20),
  entry_price DECIMAL(10,5),
  take_profit DECIMAL(10,5),
  stop_loss DECIMAL(10,5),
  status ENUM('active', 'closed', 'profitable', 'loss') DEFAULT 'active',
  result_pips DECIMAL(10,3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE testimonials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  content_en TEXT,
  content_ar TEXT,
  rating INT DEFAULT 5,
  order_index INT
);

-- Results
CREATE TABLE results (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(500),
  description VARCHAR(500),
  profit_amount DECIMAL(15,2),
  win_rate DECIMAL(5,2),
  total_trades INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  phone VARCHAR(20),
  name VARCHAR(100),
  source VARCHAR(50),
  telegram_joined BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts
CREATE TABLE blog_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title_en VARCHAR(255),
  title_ar VARCHAR(255),
  content_en TEXT,
  content_ar TEXT,
  image_url VARCHAR(500),
  slug VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(50),
  event_data JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate tracking
CREATE TABLE affiliate_clicks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  broker_id VARCHAR(50),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Visual & Rendering Specification

### Scene Setup (3D Trading Scene)
- **Camera:** Perspective camera with subtle auto-rotation
- **Position:** (0, 0, 10) looking at origin
- **Controls:** OrbitControls with limited range for subtle mouse interaction
- **Lighting:**
  - Ambient light: #1a1a2e (intensity 0.3)
  - Point light 1: #00ff88 (intensity 1.5) from above-right
  - Point light 2: #0066ff (intensity 0.8) from below-left
  - Rim light: #ff6b35 (intensity 0.5) for depth

### Materials & Effects

#### Candlestick Chart
- **Bullish candles:** #00ff88 (green) with emissive glow
- **Bearish candles:** #ff4757 (red) with emissive glow
- **Wicks:** Same color as body, thinner (0.02 width)
- **Animation:** Smooth upward movement, new candles appearing from right

#### Floating Data Lines
- **Material:** LineBasicMaterial with vertex colors
- **Colors:** Gradient from #00ff88 to #0066ff
- **Animation:** Sine wave motion, 3-5 floating lines

#### Globe/World
- **Geometry:** SphereGeometry with custom shader
- **Material:** Custom with wireframe overlay
- **Animation:** Slow Y-axis rotation (0.001 rad/frame)
- **Size:** Radius 2, positioned back-left of scene

#### Profit Numbers
- **Font:** Three.js TextGeometry or canvas texture
- **Colors:** #00ff88 with bloom effect
- **Animation:** Fade in/out, float upward
- **Content:** "+$1,247", "+52 pips", etc.

### Post-Processing
- **Bloom:** Subtle bloom on emissive elements (threshold 0.8, strength 0.4)
- **Anti-aliasing:** FXAA for smooth edges

### Color Palette
- **Primary Dark:** #0a0a0f (background)
- **Secondary Dark:** #12121a (cards/sections)
- **Accent Green:** #00ff88 (profit/buy/positive)
- **Accent Red:** #ff4757 (loss/sell/negative)
- **Accent Blue:** #0066ff (links/info)
- **Accent Orange:** #ff6b35 (highlights/CTAs)
- **Text Primary:** #ffffff
- **Text Secondary:** #8a8a9a

## 4. UI/UX Specification

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                       │
│  Logo | Home | Courses | Signals | Affiliate | Blog    │
│  [Theme Toggle] [Language Toggle] [Telegram CTA]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO SECTION                                          │
│  ┌─────────────────────┬───────────────────────────┐   │
│  │  Headline (H1)     │                           │   │
│  │  Subheadline        │     3D TRADING SCENE     │   │
│  │  [Join Telegram]    │                           │   │
│  │  [Start Learning]  │                           │   │
│  └─────────────────────┴───────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  COACH SECTION (trust builder)                          │
│  Profile image | Bio | Stats                           │
├─────────────────────────────────────────────────────────┤
│  RESULTS SECTION                                       │
│  Trade screenshots | Win rate | Statistics            │
├─────────────────────────────────────────────────────────┤
│  TESTIMONIALS (carousel)                               │
│  User reviews with images/videos                       │
├─────────────────────────────────────────────────────────┤
│  COURSES SECTION                                       │
│  Cards: Beginner | Intermediate | Advanced             │
├─────────────────────────────────────────────────────────┤
│  SIGNALS SECTION                                       │
│  Live/Recent signals table                             │
├─────────────────────────────────────────────────────────┤
│  AFFILIATE SECTION                                     │
│  Broker benefits | CTA with referral link             │
├─────────────────────────────────────────────────────────┤
│  BLOG SECTION                                          │
│  Recent articles grid                                  │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                │
│  Links | Social | Legal Disclaimer                     │
└─────────────────────────────────────────────────────────┘

[FLOATING TELEGRAM BUTTON - bottom right]
[LEAD CAPTURE MODAL - triggered on exit intent/timeout]
```

### Typography
- **Font Family:** 
  - Headings: "Space Grotesk" (Google Fonts) - geometric, modern
  - Body: "Inter" (Google Fonts) - clean, readable
  - Arabic: "IBM Plex Sans Arabic" fallback
- **Sizes:**
  - H1: 4rem (hero), 2.5rem (sections)
  - H2: 1.75rem
  - Body: 1rem (16px base)
  - Small: 0.875rem

### Spacing System
- Base unit: 4px
- Section padding: 80px vertical, 5% horizontal
- Card padding: 24px
- Gap between elements: 16px (small), 32px (medium), 64px (large)

### Components

#### Buttons
- **Primary:** 
  - Background: linear-gradient(135deg, #00ff88, #00cc6a)
  - Text: #0a0a0f
  - Padding: 16px 32px
  - Border-radius: 8px
  - Hover: scale(1.02), glow effect
- **Secondary:**
  - Background: transparent
  - Border: 2px solid #00ff88
  - Text: #00ff88
  - Hover: fill with #00ff88, text #0a0a0f
- **Ghost:**
  - No border
  - Text: #ffffff
  - Hover: underline

#### Cards
- Background: #12121a
- Border: 1px solid rgba(255,255,255,0.1)
- Border-radius: 16px
- Shadow: 0 4px 24px rgba(0,0,0,0.4)
- Hover: border-color #00ff88, translateY(-4px)

#### Modal
- Backdrop: rgba(0,0,0,0.8) with blur(8px)
- Content: #12121a, max-width 500px
- Animation: fade in + scale from 0.95

#### Telegram Button (Floating)
- Fixed: bottom 32px, right 32px
- Size: 64px circle
- Background: linear-gradient(135deg, #0088cc, #0066aa)
- Icon: Telegram SVG, white
- Animation: pulse every 3s, hover scale(1.1)
- Shadow: 0 4px 20px rgba(0,136,204,0.4)

### Animations
- **Page transitions:** Fade in sections on scroll (IntersectionObserver)
- **Hover effects:** 200ms ease-out
- **3D scene:** 60fps continuous
- **Modal:** 300ms ease-out
- **Scroll reveal:** translateY(20px) → 0, opacity 0 → 1

### Responsive Breakpoints
- Mobile: < 640px (single column, smaller 3D scene)
- Tablet: 640px - 1024px (2 columns where applicable)
- Desktop: > 1024px (full layout)

## 5. Feature Specifications

### 5.1 Home Page
- Dynamic content from database (editable via admin)
- 3D scene loads lazily
- Parallax scroll effects on sections

### 5.2 Coach Section
- Profile image with glow effect
- Animated counters (years, students)
- Story text with RTL support for Arabic

### 5.3 Results Section
- Masonry grid of trade screenshots
- Modal on click for larger view
- Statistics counters with animation

### 5.4 Testimonials
- Auto-rotating carousel (5s interval)
- Manual navigation dots
- Video support with play button overlay
- Star rating display

### 5.5 Courses
- Filter by level (tabs)
- Progress tracking for logged-in users
- Video player with custom controls
- PDF viewer modal

### 5.6 Signals
- Table view with color-coded rows
- Filter by status (active/closed)
- Click to see details
- Historical performance stats

### 5.7 Affiliate Page
- Broker comparison table
- Step-by-step guide
- CTA buttons with UTM tracking
- Conversion analytics

### 5.8 Lead Capture
- Trigger: exit intent, 30s timeout, scroll 70%
- Form: name, email, phone (optional)
- Incentive: free trading guide
- Success: redirect to Telegram

### 5.9 Blog
- Grid layout with featured image
- Category tags
- SEO meta tags per post
- Read time estimate

### 5.10 Admin Dashboard
- Protected by authentication
- CRUD for all content types
- Drag-drop for ordering
- Preview before publish

## 6. Interaction Specification

### User Controls
- **Mouse:** Click buttons, hover effects, 3D orbit
- **Touch:** Swipe carousel, tap buttons
- **Keyboard:** Tab navigation, escape modal

### API Endpoints (PHP)

#### Public
```
GET  /api/content/home         → Home page content
GET  /api/courses             → List courses
GET  /api/courses/{id}        → Course details + lessons
GET  /api/signals             → List signals (paginated)
GET  /api/testimonials        → List testimonials
GET  /api/results             → Trading results
GET  /api/blog                → Blog posts (paginated)
GET  /api/blog/{slug}         → Single blog post
POST /api/leads               → Submit lead form
```

#### Protected (Admin)
```
POST /api/auth/login          → Login
POST /api/auth/logout         → Logout
GET  /api/admin/dashboard     → Analytics overview
CRUD /api/admin/content       → Manage home content
CRUD /api/admin/courses       → Manage courses
CRUD /api/admin/signals       → Manage signals
CRUD /api/admin/testimonials  → Manage testimonials
GET  /api/admin/users         → List users
GET  /api/admin/leads         → List leads
```

## 7. Internationalization

### Supported Languages
- English (en) - LTR
- Arabic (ar) - RTL

### Implementation
- JSON translation files
- Direction attribute on body
- Font swap for Arabic
- Number formatting locale-aware

## 8. Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- 3D scene FPS: 60 (or 30 on mobile)
- Lighthouse Score: > 90

## 9. Acceptance Criteria

### Visual
- [ ] 3D scene renders with candlesticks, globe, floating lines
- [ ] Dark theme with green/red accents visible
- [ ] RTL layout works for Arabic
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations smooth at 60fps

### Functional
- [ ] Lead form submits and stores in database
- [ ] Telegram button opens in new tab
- [ ] Course/lesson navigation works
- [ ] Signals display correctly
- [ ] Admin login/logout works
- [ ] Content editable from admin panel

### Technical
- [ ] PHP API returns JSON
- [ ] React app builds without errors
- [ ] No console errors
- [ ] API endpoints return proper status codes
