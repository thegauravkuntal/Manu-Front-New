const slugify = (text) => {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const norm = (value) => (value || "").toLowerCase().trim();

/**
 * Match products for marketplace filters.
 */
export const productMatchesFilter = (product, { category, subcategory } = {}) => {
  if (subcategory) {
    const q = norm(subcategory);
    const qs = slugify(subcategory);
    return (
      norm(product.subcategory) === q ||
      slugify(product.subcategory) === qs ||
      norm(product.category) === q ||
      slugify(product.category) === qs
    );
  }

  if (category) {
    const q = norm(category);
    const qs = slugify(category);
    return (
      norm(product.category) === q ||
      slugify(product.category) === qs ||
      norm(product.subcategory) === q ||
      slugify(product.subcategory) === qs
    );
  }

  return true;
};

export const filterProducts = (products, filters) =>
  (products || []).filter((p) => productMatchesFilter(p, filters));
