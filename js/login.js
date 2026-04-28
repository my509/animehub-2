/**
 * 🎬 ANIMEHUB - LOGIN PAGE SCRIPTS
 */

(function() {
    'use strict';

    // ========== STORAGE ==========
    const KEYS = {
        users: 'ah_users_v5',
        currentUser: 'ah_current_user_v5',
        socialLogs: 'ah_social_logs_v5'
    };

    function loadData(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function saveData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Lỗi lưu dữ liệu:', e);
        }
    }

    // ========== DEFAULT DATA ==========
    function initDefaultUsers() {
        let users = loadData(KEYS.users, []);
        
        if (!users.find(function(u) { return u.email === 'admin@animehub.com'; })) {
            users.push({
                id: 'admin001',
                name: 'Admin',
                email: 'admin@animehub.com',
                password: 'admin123',
                username: 'admin',
                avatar: '👑',
                isAdmin: true,
                loginMethod: 'email',
                createdAt: new Date().toISOString()
            });
        }

        // Thêm user mặc định từ form login anime
        if (!users.find(function(u) { return u.username === 'admin' || u.email === 'admin@anime.com'; })) {
            users.push({
                id: 'user001',
                name: 'Senpai',
                email: 'senpai@anime.com',
                password: '123456',
                username: 'admin',
                avatar: '😎',
                isAdmin: false,
                loginMethod: 'email',
                createdAt: new Date().toISOString()
            });
        }

        saveData(KEYS.users, users);
        return users;
    }

    // ========== PARTICLES ==========
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 10;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;
            
            container.appendChild(particle);
        }
    }

    // ========== TAB SWITCHING ==========
    window.switchTab = function(tab) {
        document.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(function(content) {
            content.classList.remove('active');
        });

        document.querySelector('.tab-btn[onclick*="' + tab + '"]').classList.add('active');
        document.getElementById('tab-' + tab).classList.add('active');
    };

    // ========== FORM SWITCHING ==========
    window.showRegisterForm = function() {
        document.querySelector('.login-form-wrapper').style.display = 'none';
        document.querySelector('.register-form-wrapper').style.display = 'block';
    };

    window.showLoginForm = function() {
        document.querySelector('.register-form-wrapper').style.display = 'none';
        document.querySelector('.login-form-wrapper').style.display = 'block';
    };

    // ========== TOGGLE PASSWORD ==========
    window.togglePassword = function(inputId, icon) {
        const input = document.getElementById(inputId);
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    // ========== MESSAGE ==========
    function showMessage(message, type) {
        const msgBox = document.getElementById('loginMessage');
        if (!msgBox) return;
        
        const icons = {
            error: 'fa-exclamation-circle',
            success: 'fa-check-circle',
            info: 'fa-info-circle'
        };

        msgBox.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + message;
        msgBox.className = 'message-box ' + type;

        if (type === 'success') {
            setTimeout(function() {
                msgBox.innerHTML = '';
                msgBox.className = 'message-box';
            }, 3000);
        }
    }

    // ========== EMAIL LOGIN ==========
    window.handleEmailLogin = function(event) {
        event.preventDefault();

        const userInput = document.getElementById('loginUser').value.trim();
        const password = document.getElementById('loginPass').value;

        if (!userInput || !password) {
            showMessage('⚠️ Vui lòng nhập đầy đủ thông tin!', 'error');
            return false;
        }

        const users = loadData(KEYS.users, []);

        // Tìm user theo username hoặc email
        const user = users.find(function(u) {
            return (u.username === userInput || u.email.toLowerCase() === userInput.toLowerCase()) 
                   && u.password === password;
        });

        if (user) {
            showMessage('✨ Chào mừng ' + user.name + '! Đang chuyển hướng...', 'success');

            // Lưu current user
            saveData(KEYS.currentUser, user);

            // Chuyển hướng sau 1 giây
            setTimeout(function() {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            showMessage('❌ Sai tên đăng nhập hoặc mật khẩu!', 'error');
        }

        return false;
    };

    // ========== REGISTER ==========
    window.handleRegister = function(event) {
        event.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPass').value;
        const confirmPass = document.getElementById('regConfirmPass').value;

        if (!name || !email || !password || !confirmPass) {
            showMessage('⚠️ Vui lòng điền đầy đủ thông tin!', 'error');
            return false;
        }

        if (password.length < 4) {
            showMessage('⚠️ Mật khẩu phải có ít nhất 4 ký tự!', 'error');
            return false;
        }

        if (password !== confirmPass) {
            showMessage('❌ Mật khẩu xác nhận không khớp!', 'error');
            return false;
        }

        const users = loadData(KEYS.users, []);

        if (users.find(function(u) { return u.email.toLowerCase() === email.toLowerCase(); })) {
            showMessage('⚠️ Email này đã được đăng ký!', 'error');
            return false;
        }

        const newUser = {
            id: 'u' + Date.now(),
            name: name,
            email: email.toLowerCase(),
            password: password,
            username: email.toLowerCase().split('@')[0],
            avatar: '👤',
            isAdmin: false,
            loginMethod: 'email',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveData(KEYS.users, users);

        showMessage('🎉 Đăng ký thành công! Bạn có thể đăng nhập ngay.', 'success');

        // Chuyển về form login
        setTimeout(function() {
            showLoginForm();
            document.getElementById('loginUser').value = newUser.username;
        }, 1500);

        return false;
    };

    // ========== SOCIAL LOGIN ==========
    window.socialLogin = function(method) {
        const defaultName = method === 'google' ? 'Google User' : 'Facebook User';
        const name = prompt('Nhập tên hiển thị của bạn (' + method + '):', defaultName);
        
        if (!name || !name.trim()) return;

        const cleanName = name.trim();
        const email = cleanName.toLowerCase().replace(/\s+/g, '.') + '@' + method + '.social';
        const password = method + '_' + Date.now();

        const users = loadData(KEYS.users, []);
        let user = users.find(function(u) { return u.email.toLowerCase() === email; });

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

        showMessage('✅ Đăng nhập ' + method + ' thành công! Đang chuyển hướng...', 'success');

        setTimeout(function() {
            window.location.href = 'home.html';
        }, 1000);
    };

    // ========== GUEST LOGIN ==========
    window.guestLogin = function() {
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
        
        showMessage('👋 Chào mừng Khách! Đang chuyển hướng...', 'success');
        
        setTimeout(function() {
            window.location.href = 'home.html';
        }, 800);
    };

    // ========== INIT ==========
    function init() {
        initDefaultUsers();
        createParticles();
        
        // Check if user is already logged in
        const savedUser = loadData(KEYS.currentUser, null);
        if (savedUser) {
            document.getElementById('loginUser').value = savedUser.username || savedUser.email || '';
        }

        console.log('🎬 AnimeHub Login đã sẵn sàng!');
        console.log('👤 Demo: admin / admin123 hoặc admin / 123456');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
