/**
 * Nofil Ayaz Portfolio - Rotating Typing Animation Text Controller
 */

document.addEventListener("DOMContentLoaded", () => {
    const typedTextElement = document.getElementById("typed-text");
    if (!typedTextElement) return;

    const words = [
        "Computer Science Student",
        "Soft Tennis Athlete",
        "Strategic Chess Player",
        "Fitness & Gym Enthusiast"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typedTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deleting
        } else {
            // Add character
            typedTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing speed
        }

        // Word completed typing
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } 
        // Word completed deleting
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Small delay before next word starts
        }

        setTimeout(type, typingSpeed);
    };

    // Initiate loop
    setTimeout(type, 1000);
});
