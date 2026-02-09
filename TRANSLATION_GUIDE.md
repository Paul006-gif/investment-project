# Translation System Guide

## Overview
The website now supports multiple languages: **English (en)**, **Spanish (es)**, **Portuguese (pt)**, and **Polish (pl)**.

## How It Works

### 1. Language Files
Translation files are located in `src/i18n/` directory:
- `en.json` - English
- `es.json` - Spanish  
- `pt.json` - Portuguese
- `pl.json` - Polish

### 2. Language Selection
Users can select their language using the language dropdown icon in the header (top right).

### 3. Features
✅ Language preference is saved to localStorage
✅ Page reloads to apply new language
✅ All text can be translated
✅ Fallback to English if translation missing
✅ Google Translate integration as backup

## Adding Translations

### For Static Content (Astro Pages)
1. Open the relevant translation file in `src/i18n/`
2. Add your key-value pairs following the existing structure
3. Use dot notation for nested keys (e.g., `nav.home`)

Example structure:
```json
{
  "nav": {
    "home": "Home",
    "about": "About Us"
  }
}
```

### For React Components
Import and use the translation utility:
```jsx
import { t, getLanguage } from '../utils/i18n';

const currentLanguage = getLanguage();
const translatedText = t('nav.home');
```

### For Astro Components
```astro
---
import { t, getLanguage } from '../utils/i18n';

const lang = getLanguage();
const greeting = t('nav.home', lang);
---

<div>{greeting}</div>
```

## Language Codes
- **en** - English
- **es** - Spanish
- **pt** - Portuguese
- **pl** - Polish

## Adding a New Language

1. Create a new JSON file in `src/i18n/` (e.g., `fr.json` for French)
2. Copy the structure from `en.json` and translate all values
3. Update `src/utils/i18n.ts`:
   ```typescript
   import fr from '../i18n/fr.json';
   
   const translations = {
     en,
     es,
     pt,
     pl,
     fr  // Add here
   };
   ```
4. Add the language to the LanguageModal.astro button list

## Testing
1. Click the language icon in the header
2. Search for or select a language
3. The page should reload with the selected language
4. Check that localStorage is updated with the new language preference

## Troubleshooting

### Language not changing
- Clear browser cache and localStorage
- Check browser console for errors
- Verify translation file syntax (valid JSON)

### Missing translations
- Check if the key exists in all language files
- Fall back text is in English
- Add missing keys to translation files

### Google Translate conflicts
- The custom translation system takes priority
- Google Translate is a backup system
- Disable Google Translate if needed by removing the script tag
