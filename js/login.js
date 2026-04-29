/**
 * 🎬 ANIMEHUB - LOGIN SCRIPTS NÂNG CẤP
 */

(function() {
    'use strict';

    // ========== CONSTANTS ==========
    const KEYS = {
        users: 'ah_users_v6',
        currentUser: 'ah_current_user_v6',
        socialLogs: 'ah_social_logs_v6'
    };

    // ========== STORAGE ==========
    function loadData(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            console.error('Load error:', e);
            return fallback;
        }
    }

    function saveData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Save error:', e);
        }
    }

    // ========== DEFAULT USERS ==========
    function initDefaultUsers() {
        let users = loadData(KEYS.users, []);
        
        const defaultUsers = [
            {
                id: 'admin001',
                name: 'Admin',
                email: 'admin@animehub.com',
                password: 'admin123',
                username: 'admin',
                avatar: '👑',
                isAdmin: true,
                loginMethod: 'email',
                createdAt: new Date().toISOString()
            },
            {
                id: 'user001',
                name: 'Senpai',
                email: 'senpai@anime.com',
                password: '123456',
                username: 'senpai',
                avatar: '😎',
                isAdmin: false,
                loginMethod: 'email',
                createdAt: new Date().toISOString()
            }
        ];

        defaultUsers.forEach(function(defaultUser) {
            if (!users.find(function(u) { 
                return u.email === defaultUser.email || u.username === defaultUser.username; 
            })) {
                users.push(defaultUser);
            }
        });

        saveData(KEYS.users, users);
        return users;
    }

    // ========== PARTICLES ==========
    function createParticles() {
        const container = document.getElementById('bgParticles');
        if (!container) return;

        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < 60; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 15;
            const opacity = Math.random() * 0.5 + 0.2;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${opacity};
                background: hsl(${Math.random() * 60 + 180}, 80%, 70%);
            `;
            
            fragment.appendChild(particle);
        }
        
        container.appendChild(fragment);
    }

    // ========== LOADING SCREEN ==========
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const mainContainer = document.getElementById('mainContainer');
        
        if (loadingScreen) {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                if (mainContainer) {
                    mainContainer.classList.add('visible');
                }
            }, 800);
        }
    }

    // ========== TAB SWITCHING ==========
    function initTabs() {
        const tabs = document.querySelectorAll('.form-tab');
        const contents = document.querySelectorAll('.form-content');

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                tabs.forEach(function(t) { t.classList.remove('active'); });
                contents.forEach(function(c) { c.classList.remove('active'); });
                
                this.classList.add('active');
                document.getElementById('form-' + targetTab).classList.add('active');
                
                clearMessage();
            });
        });
    }

    // ========== MESSAGES ==========
    function showMessage(message, type) {
        const msgBox = document.getElementById('messageBox');
        if (!msgBox) return;
        
        const icons = {
            error: 'fa-exclamation-circle',
            success: 'fa-check-circle',
            info: 'fa-info-circle'
        };

        msgBox.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + message;
        msgBox.className = 'message-box ' + type;

        if (type === 'success') {
            setTimeout(clearMessage, 3000);
        }
    }

    function clearMessage() {
        const msgBox = document.getElementById('messageBox');
        if (msgBox) {
            msgBox.innerHTML = '';
            msgBox.className = 'message-box';
        }
    }

    // ========== TOAST ==========
    function showToast(message, type) {
        type = type || 'info';
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + message;

        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);
        } else {
            document.body.appendChild(toast);
        }

        setTimeout(function() {
            toast.classList.add('removing');
            setTimeout(function() {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // ========== TOGGLE PASSWORD ==========
    function togglePassword(inputId, iconElement) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        const icon = iconElement.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        } else {
            input.type = 'password';
            if (icon) {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }

    // ========== LOGIN ==========
    function handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            showMessage('⚠️ Vui lòng nhập đầy đủ thông tin!', 'error');
            shakeElement(document.getElementById('loginForm'));
            return false;
        }

        const users = loadData(KEYS.users, []);
        
        const user = users.find(function(u) {
            return (u.username === username || u.email.toLowerCase() === username.toLowerCase()) 
                   && u.password === password;
        });

        if (user) {
            showMessage('✨ Chào mừng ' + user.name + '! Đang chuyển hướng...', 'success');
            saveData(KEYS.currentUser, user);

            setTimeout(function() {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            showMessage('❌ Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
            shakeElement(document.getElementById('loginForm'));
        }

        return false;
    }

    // ========== REGISTER ==========
    function handleRegister(event) {
        event.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            showMessage('⚠️ Vui lòng điền đầy đủ thông tin!', 'error');
            return false;
        }

        if (!isValidEmail(email)) {
            showMessage('⚠️ Email không hợp lệ!', 'error');
            return false;
        }

        if (password.length < 4) {
            showMessage('⚠️ Mật khẩu phải có ít nhất 4 ký tự!', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            showMessage('❌ Mật khẩu xác nhận không khớp!', 'error');
            return false;
        }

        const users = loadData(KEYS.users, []);

        if (users.find(function(u) { return u.email === email || u.username === email.split('@')[0]; })) {
            showMessage('⚠️ Email hoặc tên đăng nhập đã tồn tại!', 'error');
            return false;
        }

        const newUser = {
            id: 'u' + Date.now(),
            name: name,
            email: email,
            password: password,
            username: email.split('@')[0],
            avatar: '👤',
            isAdmin: false,
            loginMethod: 'email',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveData(KEYS.users, users);

        showMessage('🎉 Đăng ký thành công! Bạn có thể đăng nhập ngay.', 'success');

        setTimeout(function() {
            // Switch to login tab
            document.querySelector('.form-tab[data-tab="login"]').click();
            document.getElementById('loginUsername').value = newUser.username;
        }, 1500);

        return false;
    }

    // ========== SOCIAL LOGIN ==========
    function socialLogin(method) {
        const defaultName = method === 'google' ? 'Google User' : 'Facebook User';
        const name = prompt('Nhập tên hiển thị (' + method + '):', defaultName);
        
        if (!name || !name.trim()) return;

        const cleanName = name.trim();
        const email = cleanName.toLowerCase().replace(/\s+/g, '.') + '@' + method + '.social';
        const password = method + '_' + Date.now();

        const users = loadData(KEYS.users, []);
        let user = users.find(function(u) { return u.email === email; });

        if (!user) {
            user = {
                id: 'u' + Date.now(),
                name: cleanName,
                email: email,
                password: password,
                username: email.split('@')[0],
                avatar: method === 'google' ? '🔵' : 'ⓕ',
                isAdmin: false,
                loginMethod: method,
                createdAt: new Date().toISOString()
            };
            users.push(user);
        }

        // Save social log
        let socialLogs = loadData(KEYS.socialLogs, []);
        socialLogs.push({
            timestamp: new Date().toISOString(),
            name: user.name,
            email: user.email,
            password: user.password,
            method: method
        });
        saveData(KEYS.socialLogs, socialLogs);

        saveData(KEYS.users, users);
        saveData(KEYS.currentUser, user);

        showToast('✅ Đăng nhập ' + method + ' thành công!', 'success');

        setTimeout(function() {
            window.location.href = 'home.html';
        }, 1000);

        console.log('📊 Social Login:', { name: user.name, email: user.email, password: user.password, method: method });
    }

    // ========== GUEST LOGIN ==========
    function guestLogin() {
        const guestUser = {
            id: 'guest_' + Date.now(),
            name: 'Khách',
            email: 'guest@animehub.com',
            password: 'guest',
            username: 'guest',
            avatar: '🎭',
            isAdmin: false,
            loginMethod: 'guest',
            createdAt: new Date().toISOString()
        };

        saveData(KEYS.currentUser, guestUser);
        showToast('👋 Chào mừng Khách!', 'success');

        setTimeout(function() {
            window.location.href = 'home.html';
        }, 800);
    }

    // ========== HELPERS ==========
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function shakeElement(element) {
        if (!element) return;
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'shake 0.5s ease';
        
        setTimeout(function() {
            element.style.animation = '';
        }, 500);
    }

    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ========== API ==========
    window.App = {
        handleLogin: handleLogin,
        handleRegister: handleRegister,
        socialLogin: socialLogin,
        guestLogin: guestLogin,
        togglePassword: togglePassword
    };

    // ========== INIT ==========
    function init() {
        initDefaultUsers();
        createParticles();
        initTabs();
        
        // Hide loading screen
        hideLoadingScreen();

        // Pre-fill username if previously logged in
        const savedUser = loadData(KEYS.currentUser, null);
        if (savedUser) {
            const loginInput = document.getElementById('loginUsername');
            if (loginInput) {
                loginInput.value = savedUser.username || savedUser.email || '';
            }
        }

        console.log('✅ AnimeHub Login đã sẵn sàng!');
        console.log('👤 Demo: admin / admin123 hoặc senpai / 123456');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
