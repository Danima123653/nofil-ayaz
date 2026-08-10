/**
 * Nofil Ayaz Portfolio - Training & Performance Charts Logic
 * Initializes dynamic interactive dummy charts using Chart.js
 * Automatically respects Light / Dark theme colors
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') return;

    // Helper to get CSS Root colors dynamically
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    // Chart Configuration & Setup
    const initCharts = () => {
        const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';
        
        const accentGreen = '#22c55e'; // Green highlight
        const accentBlue = '#3b82f6';  // Blue highlight
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        const textColor = isDarkMode ? '#94a3b8' : '#475569';

        // ---------------------------------------------------------
        // 1. Weekly Training Volume Line Chart
        // ---------------------------------------------------------
        const weeklyCtx = document.getElementById('weeklyTrainingChart');
        if (weeklyCtx) {
            // Destroy existing instance if any (for theme switching re-render)
            if (window.weeklyChartInstance) window.weeklyChartInstance.destroy();

            const gradientGreen = weeklyCtx.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradientGreen.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
            gradientGreen.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

            const gradientBlue = weeklyCtx.getContext('2d').createLinearGradient(0, 0, 0, 250);
            gradientBlue.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
            gradientBlue.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

            window.weeklyChartInstance = new Chart(weeklyCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
                    datasets: [
                        {
                            label: 'On-Court Drills (Hrs)',
                            data: [12, 14, 13, 16, 15, 18, 17, 19],
                            borderColor: accentGreen,
                            backgroundColor: gradientGreen,
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: accentGreen,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        },
                        {
                            label: 'Gym & Cardio (Hrs)',
                            data: [8, 9, 10, 9, 11, 10, 12, 11],
                            borderColor: accentBlue,
                            backgroundColor: gradientBlue,
                            borderWidth: 2.5,
                            borderDash: [4, 4],
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: accentBlue,
                            pointRadius: 3,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: textColor,
                                font: { family: 'Outfit, sans-serif', size: 11, weight: '600' },
                                boxWidth: 12,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                            titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                            bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            borderWidth: 1,
                            padding: 10,
                            displayColors: true
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor, font: { family: 'Outfit, sans-serif', size: 11 } }
                        },
                        y: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: textColor, font: { family: 'Outfit, sans-serif', size: 11 } },
                            beginAtZero: true,
                            max: 25
                        }
                    }
                }
            });
        }

        // ---------------------------------------------------------
        // 2. Skill & Performance Radar Chart
        // ---------------------------------------------------------
        const radarCtx = document.getElementById('skillRadarChart');
        if (radarCtx) {
            if (window.radarChartInstance) window.radarChartInstance.destroy();

            window.radarChartInstance = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: ['Serve Speed', 'Agility & Footwork', 'Stamina', 'Tactical Sense', 'Shot Accuracy', 'Mental Resilience'],
                    datasets: [
                        {
                            label: 'Current Level',
                            data: [92, 95, 88, 90, 94, 96],
                            backgroundColor: 'rgba(59, 130, 246, 0.25)',
                            borderColor: accentBlue,
                            borderWidth: 2,
                            pointBackgroundColor: accentBlue,
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: accentBlue
                        },
                        {
                            label: 'Target Peak',
                            data: [98, 98, 95, 96, 98, 99],
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            borderColor: accentGreen,
                            borderWidth: 2,
                            borderDash: [3, 3],
                            pointBackgroundColor: accentGreen,
                            pointBorderColor: '#fff'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: textColor,
                                font: { family: 'Outfit, sans-serif', size: 11, weight: '600' },
                                boxWidth: 12,
                                usePointStyle: true
                            }
                        },
                        tooltip: {
                            backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                            titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                            bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            borderWidth: 1,
                            padding: 10
                        }
                    },
                    scales: {
                        r: {
                            angleLines: { color: gridColor },
                            grid: { color: gridColor },
                            pointLabels: {
                                color: textColor,
                                font: { family: 'Outfit, sans-serif', size: 10, weight: '600' }
                            },
                            ticks: {
                                display: false,
                                stepSize: 20
                            },
                            suggestedMin: 50,
                            suggestedMax: 100
                        }
                    }
                }
            });
        }
    };

    // Initialize charts on load
    initCharts();

    // Re-initialize charts when Theme Switcher is clicked
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTimeout(initCharts, 100);
        });
    }
});
