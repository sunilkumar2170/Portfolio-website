
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Current year in footer
document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Sunil   Kumar. All rights reserved.`;

// Resume Knowledge Base
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

// Enhanced System Prompt for OpenAI
const SYSTEM_PROMPT = `
You are Sunil Kumar, a Computer Science Engineering student at IIT Bhilai. 
You're an expert in web and mobile development with skills in React, Flutter, and problem solving.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

GUIDELINES:
1. For resume-specific questions, provide detailed answers from the resume data
2. For technical questions (coding, frameworks), provide helpful explanations
3. For general/professional questions, give thoughtful responses
4. For unknown topics, say "I'm not sure about that, but I can tell you about [related topic]"
5. Keep responses professional yet conversational
6. Format technical answers clearly with bullet points when helpful
7. For contact requests, share only the info from the resume
`;

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatbot = document.querySelector('.close-chatbot');
    const sendButton = document.querySelector('.send-query');
    const chatInput = document.querySelector('.chatbot-query');
    const chatMessages = document.querySelector('.chatbot-messages');
    const llmToggle = document.querySelector('.llm-toggle');
    
    // State
    let useLLM = true; // Default to LLM mode
    llmToggle.checked = useLLM;
    let conversationHistory = [
        {
            role: "system",
            content: SYSTEM_PROMPT
        },
        {
            role: "assistant",
            content: "Hi! I'm Sunil's AI assistant. How can I help you today?"
        }
    ];
    
    // Initialize chatbot
    function initChatbot() {
        addMessage("Hi! I'm Sunil's AI assistant. How can I help you today?", 'bot');
    }
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });
    
    closeChatbot.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });
    
    // Toggle LLM mode
    llmToggle.addEventListener('change', (e) => {
        useLLM = e.target.checked;
        addMessage(`Switched to ${useLLM ? 'Smart Mode (AI-powered)' : 'Basic Mode (rule-based)'}`, 'bot');
    });
    
    // Send message function
    async function sendMessage() {
        const query = chatInput.value.trim();
        if (query) {
            // Add user message to UI and history
            addMessage(query, 'user');
            if(useLLM) {
                conversationHistory.push({
                    role: "user",
                    content: query
                });
            }
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            try {
                let response;
                if (useLLM) {
                    response = await generateAIResponse(query);
                } else {
                    // Simulate delay for rule-based response
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    response = generateRuleBasedResponse(query);
                }
                addMessage(response, 'bot');
                if(useLLM) {
                    conversationHistory.push({
                        role: "assistant",
                        content: response
                    });
                }
            } catch (error) {
                console.error("Error generating response:", error);
                addMessage("Sorry, I'm having trouble connecting to the AI service. Please try again later.", 'bot');
            } finally {
                removeTypingIndicator();
            }
        }
    }
    
    // Generate AI response using OpenAI
    async function generateAIResponse(query) {
        // Replace with your actual OpenAI API key
        const API_KEY = "sk-your-openai-api-key-here"; 
        const API_URL = "https://api.openai.com/v1/chat/completions";
        
        try {
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
                    max_tokens: 500
                })
            });

            const data = await response.json();
            if(data.choices && data.choices[0]) {
                return data.choices[0].message.content;
            } else {
                console.error("Unexpected API response:", data);
                return generateRuleBasedResponse(query);
            }
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
    
    // Rule-based response generator
    function generateRuleBasedResponse(query) {
        query = query.toLowerCase();
        
        if (query.includes('skill') || query.includes('technology') || query.includes('what can you do')) {
            return "My technical skills include:\n- " + resumeData.skills.join("\n- ");
        } 
        else if (query.includes('experience') || query.includes('work')) {
            return "My experience includes:\n- " + resumeData.experience.join("\n- ");
        }
        else if (query.includes('project') || query.includes('build')) {
            return "I've worked on projects involving:\n- " + resumeData.projects.join("\n- ");
        }
        else if (query.includes('education') || query.includes('study') || query.includes('degree')) {
            return "My educational background:\n- " + resumeData.education.join("\n- ");
        }
        else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            return "Hello! I'm Sunil's assistant. Ask me about my skills, experience, or projects!";
        }
        else if (query.includes('contact') || query.includes('reach') || query.includes('email')) {
            return "You can contact me through:\n- " + resumeData.contact.join("\n- ");
        }
        else {
            return "I can tell you about my:\n- Skills and technologies\n- Work experience\n- Projects\n- Education\n\nTry asking about any of these!";
        }
    }
    
    // Add message to chat UI
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
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        typingDiv.id = 'typing-indicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Event listeners for sending messages
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Initialize
    initChatbot();
});