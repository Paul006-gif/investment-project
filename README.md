# Market Investment Dashboard

A modern, high-performance financial market dashboard built with **Astro**, **Tailwind CSS**, and **Framer Motion**. Track, analyze, and manage your investment portfolio with an intuitive and responsive interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Commands](#available-commands)
- [Configuration](#configuration)
- [Development](#development)
- [Building & Deployment](#building--deployment)
- [Contributing](#contributing)
- [Support](#support)

## 🎯 Overview

The Market Investment Dashboard is a comprehensive financial application designed to help investors monitor market trends, manage portfolios, and make data-driven investment decisions. Built on a modern web stack, it delivers exceptional performance and a seamless user experience.

## ✨ Features

- **Portfolio Management** - Track your investments and asset allocation
- **Market Analysis** - Real-time market data and trend analysis
- **Performance Metrics** - Detailed analytics and performance tracking
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Smooth Animations** - Beautiful transitions with Framer Motion
- **Tailwind Styling** - Modern, utility-first CSS framework
- **Type-Safe** - Built with TypeScript for reliability
- **Fast Loading** - Optimized with Astro for exceptional performance

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Astro 5.16+** | Static site generation and framework |
| **Tailwind CSS 4.1+** | Utility-first CSS framework |
| **Framer Motion 12.23+** | Animation and motion library |
| **TypeScript** | Type-safe JavaScript |
| **Node.js** | JavaScript runtime |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Paul006-gif/investment-project.git
cd market
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

## 📁 Project Structure

```
market/
├── public/                 # Static assets (images, fonts, etc.)
│   └── favicon.svg        # Site favicon
├── src/
│   ├── components/        # Reusable Astro components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── ...
│   ├── layouts/           # Layout templates
│   │   └── Layout.astro
│   ├── pages/             # Route pages (auto-generated routes)
│   │   ├── index.astro    # Home page
│   │   └── ...
│   ├── styles/            # Global styles and utilities
│   └── utils/             # Utility functions
├── astro.config.mjs       # Astro configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

### Directory Details

- **`public/`** - Static files served directly without processing
- **`src/components/`** - Reusable components for layouts and pages
- **`src/pages/`** - Page components that auto-generate routes (Astro Pages Router)
- **`src/layouts/`** - Base layout templates for consistent page structure
- **`src/styles/`** - Global CSS and Tailwind utilities

## 📝 Available Commands

All commands run from the project root directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server at `http://localhost:4321` |
| `npm run build` | Build production-ready site to `./dist/` directory |
| `npm run preview` | Preview the production build locally |
| `npm install` | Install project dependencies |
| `npm run astro -- --help` | Display Astro CLI help information |
| `npm run astro add` | Add framework integrations (React, Vue, etc.) |
| `npm run astro check` | Type-check your project |

## ⚙️ Configuration

### Astro Configuration

Edit `astro.config.mjs` to customize build settings, integrations, and project options.

### Tailwind CSS

Customize styling in `tailwind.config.js`:
- Define color palette
- Adjust spacing scales
- Configure typography
- Set responsive breakpoints

### TypeScript

Modify `tsconfig.json` for TypeScript strictness levels and path aliases.

## 💻 Development

### Setting Up Your IDE

For best development experience, install:
- **VS Code Extensions**: Astro, Tailwind CSS IntelliSense, Thunder Client (for API testing)
- **Prettier** - Auto-format code
- **ESLint** - Find and fix problems

### Writing Components

Components can be written in multiple frameworks:
- `.astro` - Astro native components
- `.jsx/.tsx` - React components
- `.vue` - Vue components
- `.svelte` - Svelte components

### Styling

Use Tailwind classes for styling:

```astro
---
// Component.astro
---

<div class="flex flex-col gap-4 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
  <h1 class="text-3xl font-bold text-white">Welcome</h1>
  <p class="text-gray-100">This is a styled component</p>
</div>
```

## 🏗️ Building & Deployment

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build Locally

```bash
npm run preview
```

### Deploy to Hosting Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages:**
Configure `astro.config.mjs` with your repository name and push to deploy.

## 🤝 Contributing

Contributions are welcome. Please:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📚 Learning Resources

- [Astro Documentation](https://docs.astro.build) - Official Astro guides and API
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - CSS framework documentation
- [Framer Motion Guide](https://www.framer.com/motion/) - Animation library reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript learning

## 💬 Support & Community

- [Astro Discord Server](https://astro.build/chat) - Community support
- [GitHub Issues](https://github.com/Paul006-gif/investment-project/issues) - Report bugs
- [GitHub Discussions](https://github.com/Paul006-gif/investment-project/discussions) - Feature requests

## 📄 License

This project is open source and available under the MIT License.

---

**Happy investing! 📈**

*Built with ❤️ using Astro*
