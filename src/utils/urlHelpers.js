export const slugify = (text) => {
  return text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const getCategoryUrl = (category) => {
  if (!category || category === "All Categories") return "/all-products";
  return `/${slugify(category)}`;
};

export const getSubCategoryUrl = (category, subcategory) => {
  const cat = slugify(category || "industrial");
  const sub = slugify(subcategory);
  return `/${cat}/${sub}`;
};

export const getProductUrl = (item) => {
  const category = slugify(item.category || "industrial");
  const subcategory = slugify(item.subcategory || "machinery");
  const slug = item.slug || slugify(item.title);
  return `/${category}/${subcategory}/${slug}`;
};
