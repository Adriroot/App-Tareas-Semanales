
const confettiCount = 50;
const confettiColors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#38bdf8'];

export const triggerConfetti = () => {
    for (let i = 0; i < confettiCount; i++) {
        createConfetti();
    }
};

const createConfetti = () => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `${Math.random() * -20}vh`;
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.transition = 'transform 2s ease-out, opacity 2s ease-out';
    confetti.style.pointerEvents = 'none';

    document.body.appendChild(confetti);

    requestAnimationFrame(() => {
        const x = Math.random() * 400 - 200;
        const y = window.innerHeight + 100;
        const rot = Math.random() * 360 * 5;
        confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        confetti.style.opacity = '0';
    });

    setTimeout(() => {
        confetti.remove();
    }, 2000);
};