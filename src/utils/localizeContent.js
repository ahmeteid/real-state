/**
 * Get localized content from a field that may have multilingual support
 * Supports both object format: { en: "...", ar: "...", tr: "..." }
 * and field suffix format: field_en, field_ar, field_tr
 * Falls back to the original field if no translation exists
 * 
 * @param {Object} item - The property/car object
 * @param {string} fieldName - The name of the field to localize (e.g., 'title', 'description', 'location')
 * @param {string} language - Current language code (en, ar, tr)
 * @returns {string} - Localized content
 */
export function getLocalizedContent(item, fieldName, language = 'en') {
  if (!item || !fieldName) return '';
  
  // Try object format first: item.title = { en: "...", ar: "...", tr: "..." }
  if (item[fieldName] && typeof item[fieldName] === 'object' && !Array.isArray(item[fieldName])) {
    return item[fieldName][language] || item[fieldName]['en'] || item[fieldName][Object.keys(item[fieldName])[0]] || '';
  }
  
  // Try field suffix format: title_en, title_ar, title_tr
  const localizedField = `${fieldName}_${language}`;
  if (item[localizedField]) {
    return item[localizedField];
  }
  
  // Fallback to original field or English version
  if (item[fieldName]) {
    return item[fieldName];
  }
  
  // Try English version if current language is not English
  if (language !== 'en') {
    const englishField = `${fieldName}_en`;
    if (item[englishField]) {
      return item[englishField];
    }
  }
  
  return '';
}

/**
 * Get localized property/car object with all localized fields
 * 
 * @param {Object} item - The property/car object
 * @param {string} language - Current language code (en, ar, tr)
 * @returns {Object} - Object with localized fields
 */
export function getLocalizedItem(item, language = 'en') {
  if (!item) return item;
  
  // Fields that should be localized
  const fieldsToLocalize = ['title', 'description', 'location', 'area', 'price'];
  
  // Create a new object with localized fields
  const localized = { ...item };
  
  fieldsToLocalize.forEach(field => {
    localized[field] = getLocalizedContent(item, field, language);
  });
  
  return localized;
}
