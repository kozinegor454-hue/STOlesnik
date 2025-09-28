// Инициализация карты Яндекс
function initMap() {
    if (typeof ymaps !== 'undefined') {
        // Координаты ул. Володарского, 68, Торжок
        var myMap = new ymaps.Map("map", {
            center: [57.042734, 34.933263],
            zoom: 15
        });

        // Метка на карте
        var myPlacemark = new ymaps.Placemark([57.042734, 34.933263], {
            hintContent: 'СТО «Лесник»',
            balloonContent: `
                <strong>СТО «Лесник»</strong><br>
                ул. Володарского, 68, Торжок<br>
                Телефон: +7 (999) 123-45-67<br>
                <em>Круглосуточный грузовой сервис</em>
            `
        }, {
            preset: 'islands#greenAutoIcon',
            iconColor: '#3A5A40'
        });
        
        myMap.geoObjects.add(myPlacemark);
        
        // Упрощаем элементы управления
        myMap.controls.remove('geolocationControl');
        myMap.controls.remove('searchControl');
        myMap.controls.remove('trafficControl');
        myMap.controls.remove('typeSelector');
    } else {
        console.error('Yandex Maps API не загружен');
        // Альтернатива если карты не загрузились
        document.getElementById('map').innerHTML = `
            <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; border-radius: 10px; border: 2px dashed #ccc;">
                <div style="text-align: center;">
                    <h3>Карта не загрузилась</h3>
                    <p>Используйте ссылки ниже для открытия карты</p>
                </div>
            </div>
        `;
    }
}

// Плавный скролл по якорным ссылкам
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

// Управление кнопкой "показать больше" в прайсе
function initPriceToggle() {
    const toggleBtn = document.getElementById("toggle-price");
    const extraPrice = document.getElementById("extra-price");

    if (toggleBtn && extraPrice) {
        toggleBtn.addEventListener("click", () => {
            if (extraPrice.classList.contains("hidden")) {
                extraPrice.classList.remove("hidden");
                toggleBtn.textContent = "Скрыть";
            } else {
                extraPrice.classList.add("hidden");
                toggleBtn.textContent = "Показать больше";
            }
        });
    }
}

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
    }
}

// Закрытие меню при ресайзе окна
function handleResize() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (menuToggle) menuToggle.textContent = '☰';
        }
    });
}

// Инициализация всех функций после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карты после загрузки API
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    } else {
        // Если API не загрузилось, попробуем через setTimeout
        setTimeout(() => {
            if (typeof ymaps !== 'undefined') {
                ymaps.ready(initMap);
            } else {
                initMap(); // Вызовет альтернативную версию
            }
        }, 1000);
    }
    
    // Инициализация остального функционала
    initSmoothScroll();
    initPriceToggle();
    initMobileMenu();
    handleResize();
});


// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
});
// Управление отображением прайса по категориям
function initPriceCategories() {
    const categoryButtons = document.querySelectorAll('.price-category-btn');
    const categories = document.querySelectorAll('.price-category');
    const priceSection = document.getElementById('price');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-category');
            
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            categories.forEach(cat => cat.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(categoryId).classList.add('active');
            
            // Прокрутка к началу контента прайса (ниже кнопок)
            const headerHeight = document.querySelector('header').offsetHeight;
            const priceContent = document.querySelector('.price-content');
            const pricePosition = priceSection.offsetTop + priceContent.offsetTop - headerHeight;
            
            window.scrollTo({
                top: pricePosition,
                behavior: 'smooth'
            });
        });
    });
}

// В функции инициализации замените вызов initPriceToggle() на initPriceCategories()
document.addEventListener('DOMContentLoaded', function() {
    // ... остальной код ...
    
    // Замените эту строку:
    // initPriceToggle();
    // На эту:
    initPriceCategories();
    
    // ... остальной код ...
});





// Слайдер примеров работ с зацикленным переключением
function initPortfolioSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;
    let isAnimating = false;

    // Функция показа слайда
    function showSlide(index, direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        const prevSlide = currentSlide;
        
        // Зацикливание слайдов
        if (index < 0) {
            index = slides.length - 1; // Переходим к последнему слайду
        } else if (index >= slides.length) {
            index = 0; // Переходим к первому слайду
        }
        
        currentSlide = index;

        // Убираем все классы
        slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });

        // Добавляем классы для анимации
        if (direction === 'next') {
            slides[prevSlide].classList.add('prev'); // уходит налево
            slides[currentSlide].classList.add('next'); // приходит справа
        } else {
            slides[prevSlide].classList.add('next'); // уходит направо
            slides[currentSlide].classList.add('prev'); // приходит слева
        }

        // Показываем новый слайд после небольшой задержки
        setTimeout(() => {
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Завершаем анимацию
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }, 50);
    }

    // Следующий слайд
    function nextSlide() {
        showSlide(currentSlide + 1, 'next');
    }

    // Предыдущий слайд
    function prevSlide() {
        showSlide(currentSlide - 1, 'prev');
    }

    // Автопрокрутка
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // 5 секунд
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Обработчики событий
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    // Индикаторы
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index === currentSlide) return;
            const direction = index > currentSlide ? 'next' : 'prev';
            showSlide(index, direction);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Пауза при наведении
    const slider = document.querySelector('.portfolio-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }

    // Запускаем автопрокрутку
    startAutoSlide();
}


















// Добавьте вызов в инициализацию
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    initPortfolioSlider();
});