/**
 * Clean neutral SVG placeholder used when a recipe's thumbnail
 * is missing or fails to load.
 * 
 * Strict rule: Never substitute another recipe's image.
 * Uses CareerGhana neutral tones (#F1F5F9 background, #94A3B8 icon/text).
 */
export const NEUTRAL_RECIPE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" fill="%23F1F5F9"><rect width="600" height="450" fill="%23F1F5F9"/><g fill="%2394A3B8" transform="translate(250, 150)"><path d="M50 0C32 0 16 12 11 29C4 32 0 38 0 46C0 55 7 62 15 63C15 70 19 75 25 78L25 95L75 95L75 78C81 75 85 70 85 63C93 62 100 55 100 46C100 38 96 32 89 29C84 12 68 0 50 0ZM35 105L65 105L65 115L35 115Z"/><line x1="20" y1="130" x2="80" y2="130" stroke="%2394A3B8" stroke-width="4" stroke-linecap="round"/></g><text x="300" y="320" text-anchor="middle" fill="%2394A3B8" font-family="Poppins, sans-serif" font-size="15" font-weight="500">Image not available</text></svg>';
