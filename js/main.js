const displayCategories = async () => {
  const categoryContainer = document.getElementById("category-container");
  const res = await fetch(
    "https://openapi.programming-hero.com/api/phero-tube/categories"
  );
  const data = await res.json();
  const categories = data.categories;
  categories.forEach((category) => {
    categoryContainer.innerHTML += `
      <button onclick="loadDataById('${category.category_id}')" class="btn hover:text-white hover:bg-[#FF1F3D]">${category.category}</button>
      `;
  });
};

displayCategories();
