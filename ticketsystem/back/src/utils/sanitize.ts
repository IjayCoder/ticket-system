import sanitizeHtml from "sanitize-html";

export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [], // aucune balise autorisée
    allowedAttributes: {}, // aucun attribut HTML autorisé
  }).trim(); // retire aussi les espaces inutiles
}
