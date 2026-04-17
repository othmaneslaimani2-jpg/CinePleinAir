// Fetch movies from TVMaze API
async function fetchMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    
    try {
        // Fetch shows from TVMaze API
        const response = await fetch('https://api.tvmaze.com/shows');
        const shows = await response.json();
        
        // Filter shows with images and ratings, then select 5 random ones
        const validShows = shows.filter(show => 
            show.image && 
            show.rating && 
            show.rating.average
        ).sort(() => 0.5 - Math.random()).slice(0, 5);
        
        // If we don't have enough from the main list, search for specific popular shows
        if (validShows.length < 10) {
            const popularSearches = ['breaking bad', 'game of thrones', 'the walking dead', 'stranger things', 'the office'];
            for (const search of popularSearches) {
                if (validShows.length >= 5) break;
                const searchResponse = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(search)}`);
                const searchData = await searchResponse.json();
                if (searchData.length > 0 && searchData[0].show.image && searchData[0].show.rating.average) {
                    validShows.push(searchData[0].show);
                }
            }
        }
        
        // Clear loading message
        moviesGrid.innerHTML = '';
        
        // Create movie cards
        validShows.forEach(show => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            
            const rating = show.rating.average.toFixed(1);
            const imageUrl = show.image.medium || show.image.original;
            
            movieCard.innerHTML = `
                <img src="${imageUrl}" alt="${show.name}" class="movie-poster" onerror="this.src='https://via.placeholder.com/248x353/1a1a1a/ffffff?text=No+Image'">
                <div class="movie-rating">
                    <span class="star">★</span>
                    <span class="rating-value">${rating}</span>
                </div>
                <div class="movie-title">${show.name}</div>
            `;
            
            moviesGrid.appendChild(movieCard);
        });
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        moviesGrid.innerHTML = '<div class="error">Unable to load movies. Please try again later.</div>';
        
        // Fallback movies with static data
        const fallbackMovies = [
            { name: 'Breaking Bad', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/0/2400.jpg', rating: 9.5 },
            { name: 'Game of Thrones', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/190/476117.jpg', rating: 9.3 },
            { name: 'Stranger Things', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/200/501916.jpg', rating: 8.7 },
            { name: 'The Crown', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/313/784469.jpg', rating: 8.6 },
            { name: 'The Mandalorian', image: 'https://static.tvmaze.com/uploads/images/medium_portrait/213/534666.jpg', rating: 8.8 }
        ];
        
        fallbackMovies.forEach(show => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${show.image}" alt="${show.name}" class="movie-poster">
                <div class="movie-rating">
                    <span class="star">★</span>
                    <span class="rating-value">${show.rating}</span>
                </div>
                <div class="movie-title">${show.name}</div>
            `;
            moviesGrid.appendChild(movieCard);
        });
    }
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form submission handler
function initFormHandler() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    initSmoothScroll();
    initFormHandler();
});