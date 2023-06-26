const removeSection = () => {
  const recProductsSection = document.querySelector('.custom-recommendations-swiper');
  console.log(recProductsSection);
  recProductsSection.remove();
};

const generateCustomRecommenedProducts = ({productId, btnText, productsLimit, recommendationType}) => {
  const finalProdLimit = productsLimit || 6;
  const apiURL = `${window.Shopify.routes.root}recommendations/products.json?product_id=${productId}&limit=${finalProdLimit}&intent=related`;

  fetch(apiURL)
    .then(res => res.json())
    .then(({products}) => {
      if (products?.length === 0 || !products) {
        removeSection();
        return;  
      }

      const wrapper = document.querySelector(`.${recommendationType === 'dynamic' ? 'custom-recs .swiper-wrapper' : 'custom-recommendations__row'}`);
      // const swiperWrapper = document.querySelector('.custom-recs .swiper-wrapper');

      products.forEach((product, i) => {
        const productColHTML = `
        <div class="swiper-slide">
          <div class="custom-recommendations__product-col">
          <a href="${product.url}">
            <img 
             class="custom-recommendations__product-image" 
             src="${product.featured_image}" 
             alt="${product.title}" 
             />
          </a>
          
            <h4 class="custom-recommendations__product-title">
                <a href="${product.url}">
                    ${product.title}
                </a>
            </h4>
            <a class="custom-recommendations__col-button btn" href="${product.url}">${btnText}</a>
          </div>
        </div>
        `;
        wrapper.insertAdjacentHTML('beforeend', productColHTML);
      })
    })
    .catch(err => {
      removeSection();
    });
};
