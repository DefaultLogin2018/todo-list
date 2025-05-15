document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const mouseX = (clientX - centerX) / centerX * 100; // Значение в процентах
    const mouseY = (clientY - centerY) / centerY * 100; // Значение в процентах
    console.log('Mouse X:', mouseX, 'Mouse Y:', mouseY); // Отладка
    document.body.style.setProperty('--mouse-x', `${mouseX}`); // Без px
    document.body.style.setProperty('--mouse-y', `${mouseY}`); // Без px
});