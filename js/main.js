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

let allVideos = [];
const loadVideos = async () => {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/phero-tube/videos"
  );
  const data = await res.json();
  allVideos = data.videos;
  displayVideos(allVideos);
};

const displayVideos = (videos) => {
  const tubeContainer = document.getElementById("tube-container");
  tubeContainer.innerHTML = "";
  videos.length ? toggleHidden(true) : toggleHidden();
  videos.forEach((video) => {
    const { thumbnail, authors, others, title } = video;
    const minutes = others.posted_date / 60;
    const hours = parseInt(minutes / 60);
    const restMin = parseInt(minutes % 60);

    tubeContainer.innerHTML += `
      <div class="rounded-xl hover:shadow-md">
        <div class="relative">
            <img src="${thumbnail}" alt="" class="w-full md:w-80 h-52 transform  hover:scale-105 duration-300 rounded-xl" />
            <p class="${
              others.posted_date || "hidden"
            } bg-black px-3 py-1 rounded-2xl text-white absolute bottom-2 right-2">${`${hours} hrs ${restMin} ago`}</p>
        </div>
        <div class="flex gap-3 p-1">
            <div>
            <img src="${
              authors[0].profile_picture
            }" alt="" class="w-10 h-10 rounded-full" />
            </div>
            <div>
            <h2 class="text-base font-bold text-[#171717B3]">
                ${title}
            </h2>
            <h4 class="text-sm">${authors[0].profile_name} 
                <svg data-slot="icon" fill="#2568EF" stroke-width="2" class="w-6 h-6 ${
                  authors[0].verified ? "inline" : "hidden"
                }" stroke="#FFF" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> 
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"></path>
                </svg>
            </h4>
            <p class="text-sm text-[#171717B3]">${others.views}</p>
            </div>
        </div>
       </div>
      `;
  });
};

const loadDataById = async (categoryId) => {
  // load all videos by clicking ALL button
  if (!categoryId) {
    loadVideos();
  }
  const res = await fetch(
    `https://openapi.programming-hero.com/api/phero-tube/category/${categoryId}`
  );
  const data = await res.json();
  displayVideos(data.category);
};

const toggleHidden = (status) => {
  if (status) {
    document.getElementById("data-not-found").classList.add("hidden");
  } else {
    document.getElementById("data-not-found").classList.remove("hidden");
  }
};

let prevBtn = null;
// Added Active style
document
  .getElementById("category-container")
  .addEventListener("click", function (e) {
    // console.dir(e.target);
    const isBtn = e.target.nodeName === "BUTTON";
    if (!isBtn) {
      return;
    }
    e.target.classList.add(`bg-[#FF1F3D]`);
    if (prevBtn !== null) {
      prevBtn.classList.remove(`bg-[#FF1F3D]`);
    }
    prevBtn = e.target;
  });

const sortByView = () => {
  const sortedVideos = allVideos.sort(function (a, b) {
    // remove last alphabet from the view counts
    a = a.others.views.slice(0, a.others.views.length - 1);
    b = b.others.views.slice(0, b.others.views.length - 1);
    return a - b;
  });
  displayVideos(sortedVideos);
};

document
  .getElementById("search-input")
  .addEventListener("keyup", async function (e) {
    // const inputText = document.getElementById("search-input").value;
    const inputText = e.target.value;
    if (e.key === "Enter") {
      const res = await fetch(
        `https://openapi.programming-hero.com/api/phero-tube/videos?title=${inputText}`
      );
      const data = await res.json();
      displayVideos(data.videos);
    }
  });

displayCategories();
loadVideos();
