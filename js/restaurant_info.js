/**
 * Initialize Google map, called from HTML.
 */
let restaurantObject = null;

function initMap() {
  restaurantObject = new Restaurant();
  restaurantObject.fetchRestaurantFromURL().then((restaurant) => {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: restaurant.latlng,
      scrollwheel: false
    });
    DBHelper.mapMarkerForRestaurant(restaurant, map);
  });
}

class Restaurant {

  constructor() {
    this.restaurant = null;
  }

  /**
   * Get current restaurant from page URL.
   */
  fetchRestaurantFromURL() {
    const id = getParameterByName('id'); // TODO: error if id is not available
    return DBHelper.fetchRestaurantById(id).then((restaurant) => {
      this.restaurant = restaurant;
      this.fillRestaurantHTML();
      this.fillBreadcrumb();
      return restaurant;
    });
  }

  /**
   * Create restaurant HTML and add it to the webpage
   */
  fillRestaurantHTML() {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = this.restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = this.restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img'
    image.src = DBHelper.imageUrlForRestaurant(this.restaurant);

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = this.restaurant.cuisine_type;

    // fill operating hours
    if (this.restaurant.operating_hours) {
      this.fillRestaurantHoursHTML();
    }
    // fill reviews
    this.fillReviewsHTML();
  }

  /**
   * Create restaurant operating hours HTML table and add it to the webpage.
   */
  fillRestaurantHoursHTML() {
    const operatingHours = this.restaurant.operating_hours;
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      row.appendChild(time);

      hours.appendChild(row);
    }
  }

  /**
   * Create all reviews HTML and add them to the webpage.
   */
  fillReviewsHTML() {
    const reviews = this.restaurant.reviews;
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h2');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      ul.appendChild(this.createReviewHTML(review));
    });
    container.appendChild(ul);
  }

  /**
   * Create review HTML and add it to the webpage.
   */
  createReviewHTML(review) {
    const li = document.createElement('li');
    const name = document.createElement('p');
    name.innerHTML = review.name;
    li.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    li.appendChild(date);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
  }

  /**
   * Add restaurant name to the breadcrumb navigation menu
   */
  fillBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.innerHTML = this.restaurant.name;
    breadcrumb.appendChild(li);
  }
}

/**
 * Get a parameter by name from page URL.
 */
function getParameterByName(name, url) {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
