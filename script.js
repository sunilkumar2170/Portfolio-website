document.addEventListener('DOMContentLoaded', function() {
  
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        if (chatbotContainer.classList.contains('active')) {
            chatbotContainer.classList.remove('active');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - navbar.offsetHeight,
                behavior: 'smooth'
            });
        });
    });

    // Footer Year Update
    document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Sunil Kumar. All rights reserved.`;

    // Chatbot Implementation
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatbot = document.querySelector('.close-chatbot');
    const sendButton = document.querySelector('.send-query');
    const chatInput = document.querySelector('.chatbot-query');
    const chatMessages = document.querySelector('.chatbot-messages');
    const llmToggle = document.querySelector('.llm-toggle');

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

    const SYSTEM_PROMPT = `You are Sunil Kumar, a Computer Science student at IIT Bhilai specializing in web and mobile development.
    Strictly follow these rules:
    1. For resume questions, answer ONLY using the provided data
    2. For technical questions, provide clear explanations
    3. Be professional but friendly
    4. Format responses neatly with bullet points when helpful
    5. If unsure, say "I don't have that information but I can tell you about [related topic]"

    RESUME DATA:
    ${JSON.stringify(resumeData, null, 2)}`;

    let useLLM = true;
    llmToggle.checked = useLLM;
    let conversationHistory = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "assistant", content: "Hi! I'm Sunil's AI assistant. Ask me about my skills, projects, or experience!" }
    ];

    function initChatbot() {
        addMessage("Hi! I'm Sunil's AI assistant. Ask me about my skills, projects, or experience!", 'bot');
    }

    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    closeChatbot.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });

    llmToggle.addEventListener('change', function() {
        useLLM = this.checked;
        addMessage(`Switched to ${useLLM ? 'AI Mode (powered by OpenAI)' : 'Basic Mode'}`, 'bot');
    });

    async function sendMessage() {
        const query = chatInput.value.trim();
        if (!query) return;

        addMessage(query, 'user');
        if (useLLM) {
            conversationHistory.push({ role: "user", content: query });
        }
        chatInput.value = '';
        
        showTypingIndicator();
        
        try {
            const response = useLLM 
                ? await generateAIResponse(query) 
                : generateRuleBasedResponse(query);
            
            addMessage(response, 'bot');
            if (useLLM) {
                conversationHistory.push({ role: "assistant", content: response });
            }
        } catch (error) {
            console.error("Error:", error);
            addMessage("Sorry, I'm having trouble responding. Please try again.", 'bot');
        } finally {
            removeTypingIndicator();
        }
    }

    async function generateAIResponse(query) {
        const API_KEY = "sk-your-openai-api-key-here";
        const API_URL = "https://api.openai.com/v1/chat/completions";
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 300
            })
        });

        const data = await response.json();
        return data.choices?.[0]?.message?.content || generateRuleBasedResponse(query);
    }

    function generateRuleBasedResponse(query) {
        query = query.toLowerCase();
        
        if (query.includes('skill') || query.includes('technology')) {
            return "My technical skills include:\n" + resumeData.skills.map(s => `• ${s}`).join('\n');
        } 
        else if (query.includes('experience') || query.includes('work')) {
            return "My experience:\n" + resumeData.experience.map(e => `• ${e}`).join('\n');
        }
        else if (query.includes('project')) {
            return "Projects I've worked on:\n" + resumeData.projects.map(p => `• ${p}`).join('\n');
        }
        else if (query.includes('education') || query.includes('study')) {
            return "Education:\n• " + resumeData.education.join('\n• ');
        }
        else if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
            return "Contact me at:\n• " + resumeData.contact.join('\n• ');
        }
        else if (query.includes('hello') || query.includes('hi')) {
            return "Hello! Ask me about my skills, projects, or experience.";
        }
        else {
            return "I can discuss:\n• My skills\n• Projects\n• Experience\n• Education\nTry asking about these!";
        }
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    initChatbot();
});