document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccess');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const data = {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value,
      };
  
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
  
        const result = await res.json();
  
        if (res.ok && result.success) {
          successMessage.style.display = 'block';
          form.reset();
        } else {
          alert('Email failed. Please try again.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Server error. Try again later.');
      }
    });
  });

    // Email validation helper function (if needed)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            const navbar = document.querySelector('.navbar');
            window.scrollTo({
                top: targetElement.offsetTop - navbar.offsetHeight,
                behavior: 'smooth'
            });
        });
    });

    // Update copyright year
    document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Sunil Kumar. All rights reserved.`;

<<<<<<< HEAD
    // Chatbot functionality
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatbot = document.querySelector('.close-chatbot');
    const sendButton = document.querySelector('.send-query');
    const chatInput = document.querySelector('.chatbot-query');
    const chatMessages = document.querySelector('.chatbot-messages');
    const llmToggle = document.querySelector('.llm-toggle');

    // Resume data for chatbot responses
    const resumeData = {
        name: "Sunil Kumar",
        skills: [
            "Frontend: React, JavaScript, HTML5/CSS3",
            "Programming: C++, basic Python",
            "Database: MongoDB",
            "App Dev: Flutter, Dart, Firebase",
            "Tools: Git/GitHub, Linux, Latex, Gnuplot, Android Studio, Visual Studio",
            "LeetCode: 150+ problems solved"
        ],
        experience: [
            "Computer Science Engineering student at IIT Bhilai",
            "Built various projects using modern web and app development technologies"
        ],
        projects: [
            "Web development projects using React",
            "Mobile apps developed with Flutter",
            "Problem solving with C++ and Python"
        ],
        education: [
            "BTech in Computer Science Engineering at IIT Bhilai"
        ],
        contact: [
            "Email: sunilkr@iitbhilai.ac.in",
            "LinkedIn: linkedin.com/in/sunil-kumar-0b5219324",
            "GitHub: github.com/sunilkumar2170"
        ],
        general: [
            "Passionate about building innovative digital solutions",
            "Strong problem solving skills",
            "Experience with both web and mobile development"
        ]
    };

    let useLLM = true;
    llmToggle.checked = useLLM;
    let conversationHistory = [
        { role: "assistant", content: "Hi! I'm Sunil's AI assistant. Ask me about my skills, projects, or experience!" }
    ];

    // Initialize chatbot with welcome message
    function initChatbot() {
        addMessage("Hi! I'm Sunil's AI assistant. Ask me about my skills, projects, or experience!", 'bot');
    }

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close chatbot
    closeChatbot.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });

    // Toggle between AI and basic mode
    llmToggle.addEventListener('change', function() {
        useLLM = this.checked;
        addMessage(`Switched to ${useLLM ? 'AI Mode' : 'Basic Mode'}`, 'bot');
    });

    // Send message handler for chatbot
    function sendMessage() {
        const query = chatInput.value.trim();
        if (!query) return;

        addMessage(query, 'user');
        chatInput.value = '';
        showTypingIndicator();

        setTimeout(() => {
            const response = generateRuleBasedResponse(query);
            addMessage(response, 'bot');
            removeTypingIndicator();
        }, 1000);
    }

    // Rule-based chatbot responses
    function generateRuleBasedResponse(query) {
        query = query.toLowerCase();
        
        if (query.includes('skill') || query.includes('technology')) {
            return "My technical skills include:\n" + resumeData.skills.map(s => `• ${s}`).join('\n');
        } else if (query.includes('experience') || query.includes('work')) {
            return "My experience:\n" + resumeData.experience.map(e => `• ${e}`).join('\n');
        } else if (query.includes('project')) {
            return "Projects I've worked on:\n" + resumeData.projects.map(p => `• ${p}`).join('\n');
        } else if (query.includes('education') || query.includes('study')) {
            return "Education:\n• " + resumeData.education.join('\n• ');
        } else if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
            return "Contact me at:\n• " + resumeData.contact.join('\n• ');
        } else if (query.includes('hello') || query.includes('hi')) {
            return "Hello! Ask me about my skills, projects, or experience.";
        } else {
            return "I can discuss:\n• My skills\n• Projects\n• Experience\n• Education\nTry asking about these!";
        }
    }

    // Add message to chat window
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    // Event listeners for chatbot send button and enter key
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Initialize chatbot on page load
    initChatbot();
});
=======
>>>>>>> f3172b2464d40d6e6dff578fc763573a38cdd019
