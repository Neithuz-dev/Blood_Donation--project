// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.stat-box, .step, .blood-type');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        fadeObserver.observe(element);
    });

    // Blood drop animation
    const bloodDrop = document.querySelector('.logo-animation');
    let isAnimating = false;

    bloodDrop.addEventListener('mouseenter', () => {
        if (!isAnimating) {
            isAnimating = true;
            bloodDrop.style.transform = 'scale(1.2)';
            setTimeout(() => {
                bloodDrop.style.transform = 'scale(1)';
                isAnimating = false;
            }, 500);
        }
    });

    // Sticky navigation with hide/show on scroll
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    const navHeight = nav.offsetHeight;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > navHeight) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Statistics counter animation
    const stats = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseFloat(stat.textContent);
            const decimal = stat.textContent.includes('.') ? 1 : 0;
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    stat.textContent = target.toFixed(decimal);
                } else {
                    stat.textContent = current.toFixed(decimal);
                }
            }, 30);
        });
    };

    // Observe stats section for animation trigger
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            animateStats();
            hasAnimated = true;
        }
    });

    statsObserver.observe(document.querySelector('.stats-container'));

    // Form validation for donation scheduling
    const scheduleForm = document.querySelector('.cta-button');
    if (scheduleForm) {
        scheduleForm.addEventListener('click', () => {
            // Create and show modal
            const modal = document.createElement('div');
            modal.className = 'schedule-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Schedule Your Donation</h3>
                    <form id="donationForm">
                        <input type="text" placeholder="Full Name" required>
                        <input type="email" placeholder="Email" required>
                        <input type="tel" placeholder="Phone Number" required>
                        <input type="date" required>
                        <select required>
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                        <button type="submit">Schedule Appointment</button>
                        <button type="button" class="close-modal">Cancel</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
            
            // Add modal styles
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            `;

            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
            `;

            // Form styles
            const form = modal.querySelector('form');
            form.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 1rem;
            `;

            const inputs = modal.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.style.cssText = `
                    padding: 0.8rem;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 1rem;
                `;
            });

            const buttons = modal.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.cssText = `
                    padding: 1rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.3s;
                `;
            });

            const submitBtn = modal.querySelector('button[type="submit"]');
            submitBtn.style.backgroundColor = '#FF1E1E';
            submitBtn.style.color = 'white';

            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.style.backgroundColor = '#eee';

            // Form submission handler
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Simulated API call
                console.log('Scheduling appointment:', data);

                // Send appointment data to backend
                fetch('http://localhost:4000/api/appointments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        staffId: data.doctorId,
                        staffName: data.doctorName,
                        service: 'Donation Screening',
                        center: 'BloodLife Center',
                        dateISO: data.dateISO,
                        time: data.time,
                        donor: {
                            name: data.patient.name,
                            email: data.patient.email,
                            phone: data.patient.phone,
                            note: data.patient.reason
                        }
                    })
                })
                .then(response => response.json())
                .then(result => {
                    console.log('Appointment saved:', result);
                })
                .catch(error => {
                    console.error('Error saving appointment:', error);
                });

                // Show success message
                modalContent.innerHTML = `
                    <h3>Thank You!</h3>
                    <p>Your appointment has been scheduled. We'll send you a confirmation email shortly.</p>
                    <button class="close-modal">Close</button>
                `;
            });

            // Close modal handler
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('close-modal') || e.target === modal) {
                    modal.remove();
                }
            });
        });
    }

    // Blood type hover effects
    const bloodTypes = document.querySelectorAll('.blood-type');
    bloodTypes.forEach(type => {
        type.addEventListener('mouseenter', () => {
            type.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        type.addEventListener('mouseleave', () => {
            type.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }

    nav {
        transition: transform 0.3s ease-out;
    }

    .logo-animation {
        transition: transform 0.3s ease-out;
    }

    .blood-type {
        transition: transform 0.3s ease-out, background-color 0.3s ease-out, color 0.3s ease-out;
    }
`;
document.head.appendChild(style);