/**
 * ANIMEHUB - LOGIN JS
 */
(function() {
    'use strict';

    // ========== STORAGE ==========
    const KEYS = {
        users: 'ah_users_v7',
        currentUser: 'ah_current_user_v7',
        socialLogs: 'ah_social_logs_v7'
    };

    function load(k, d) {
        try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : d; }
        catch(e) { return d; }
    }
    function save(k, v) {
        try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
    }

    // ========== INIT DATA ==========
    function initData() {
        let users = load(KEYS.users, []);
        const defaults = [
            { id:'admin001', name:'Admin', email:'admin@animehub.com', password:'admin123', username:'admin', avatar:'👑', isAdmin:true, loginMethod:'email', createdAt:new Date().toISOString() },
            { id:'user001', name:'Senpai', email:'senpai@anime.com', password:'123456', username:'senpai', avatar:'😎', isAdmin:false, loginMethod:'email', createdAt:new Date().toISOString() }
        ];
        let changed = false;
        defaults.forEach(function(d) {
            if (!users.find(function(u) { return u.email === d.email || u.username === d.username; })) {
                users.push(d); changed = true;
            }
        });
        if (changed) save(KEYS.users, users);
        return users;
    }

    // ========== PARTICLES ==========
    function createParticles() {
        const c = document.getElementById('bgParticles');
        if (!c) return;
        const f = document.createDocumentFragment();
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = 'width:'+(Math.random()*3+1)+'px;height:'+(Math.random()*3+1)+'px;left:'+(Math.random()*100)+'%;animation-duration:'+(Math.random()*12+8)+'s;animation-delay:'+(Math.random()*10)+'s;opacity:'+(Math.random()*0.5+0.2)+';';
            f.appendChild(p);
        }
        c.appendChild(f);
    }

    // ========== LOADING ==========
    function hideLoading() {
        const ls = document.getElementById('loadingScreen');
        if (ls) {
            setTimeout(function() { ls.classList.add('hidden'); }, 600);
        }
    }

    // ========== TAB SWITCH ==========
    window.switchTab = function(tab) {
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.form-panel').forEach(function(p) { p.classList.remove('active'); });
        var btn = document.querySelector('.tab-btn[onclick*="' + tab + '"]');
        var panel = document.getElementById('panel-' + tab);
        if (btn) btn.classList.add('active');
        if (panel) panel.classList.add('active');
        clearMsg();
    };

    // ========== TOGGLE PASSWORD ==========
    window.togglePassword = function(inputId, icon) {
        var input = document.getElementById(inputId);
        if (!input) return;
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

    // ========== MESSAGES ==========
    function showMsg(msg, type) {
        var box = document.getElementById('msgBox');
        if (!box) return;
        var icons = { error: 'fa-exclamation-circle', success: 'fa-check-circle', info: 'fa-info-circle' };
        box.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + msg;
        box.className = 'msg-box ' + type;
    }
    function clearMsg() {
        var box = document.getElementById('msgBox');
        if (box) { box.innerHTML = ''; box.className = 'msg-box'; }
    }

    function toast(msg, type) {
        type = type || 'info';
        var icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
        var t = document.createElement('div');
        t.className = 'toast ' + type;
        t.innerHTML = '<i class="fas ' + (icons[type] || icons.info) + '"></i> ' + msg;
        var container = document.getElementById('toastContainer');
        if (container) container.appendChild(t);
        else document.body.appendChild(t);
        setTimeout(function() {
            t.classList.add('removing');
            setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
        }, 3000);
    }

    // ========== LOGIN ==========
    window.loginSubmit = function(event) {
        event.preventDefault();
        var userInput = document.getElementById('loginUser').value.trim();
        var pass = document.getElementById('loginPass').value;
        if (!userInput || !pass) {
            showMsg('⚠️ Vui lòng nhập đầy đủ thông tin!', 'error');
            return false;
        }
        var users = load(KEYS.users, []);
        var user = users.find(function(u) {
            return (u.username === userInput || u.email.toLowerCase() === userInput.toLowerCase()) && u.password === pass;
        });
        if (user) {
            showMsg('✨ Chào mừng ' + user.name + '! Đang chuyển hướng...', 'success');
            save(KEYS.currentUser, user);
            setTimeout(function() { window.location.href = 'home.html'; }, 1000);
        } else {
            showMsg('❌ Sai tên đăng nhập hoặc mật khẩu!', 'error');
        }
        return false;
    };

    // ========== REGISTER ==========
    window.registerSubmit = function(event) {
        event.preventDefault();
        var name = document.getElementById('regName').value.trim();
        var email = document.getElementById('regEmail').value.trim().toLowerCase();
        var pass = document.getElementById('regPass').value;
        var confirm = document.getElementById('regConfirm').value;
        if (!name || !email || !pass || !confirm) {
            showMsg('⚠️ Vui lòng điền đầy đủ thông tin!', 'error');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMsg('⚠️ Email không hợp lệ!', 'error');
            return false;
        }
        if (pass.length < 4) {
            showMsg('⚠️ Mật khẩu phải có ít nhất 4 ký tự!', 'error');
            return false;
        }
        if (pass !== confirm) {
            showMsg('❌ Mật khẩu xác nhận không khớp!', 'error');
            return false;
        }
        var users = load(KEYS.users, []);
        if (users.find(function(u) { return u.email === email || u.username === email.split('@')[0]; })) {
            showMsg('⚠️ Email hoặc tên đăng nhập đã tồn tại!', 'error');
            return false;
        }
        var newUser = {
            id: 'u' + Date.now(),
            name: name,
            email: email,
            password: pass,
            username: email.split('@')[0],
            avatar: '👤',
            isAdmin: false,
            loginMethod: 'email',
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        save(KEYS.users, users);
        showMsg('🎉 Đăng ký thành công! Chuyển sang đăng nhập...', 'success');
        setTimeout(function() {
            switchTab('login');
            document.getElementById('loginUser').value = newUser.username;
        }, 1500);
        return false;
    };

    // ========== SOCIAL LOGIN ==========
    window.socialLogin = function(method) {
        var defaultName = method === 'google' ? 'Google User' : 'Facebook User';
        var name = prompt('Nhập tên hiển thị (' + method + '):', defaultName);
        if (!name || !name.trim()) return;
        var cleanName = name.trim();
        var email = cleanName.toLowerCase().replace(/\s+/g, '.') + '@' + method + '.social';
        var password = method + '_' + Date.now();
        var users = load(KEYS.users, []);
        var user = users.find(function(u) { return u.email === email; });
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
        var socialLogs = load(KEYS.socialLogs, []);
        socialLogs.push({
            timestamp: new Date().toISOString(),
            name: user.name,
            email: user.email,
            password: user.password,
            method: method
        });
        save(KEYS.socialLogs, socialLogs);
        save(KEYS.users, users);
        save(KEYS.currentUser, user);
        toast('✅ Đăng nhập ' + method + ' thành công!', 'success');
        setTimeout(function() { window.location.href = 'home.html'; }, 1000);
    };

    // ========== GUEST ==========
    window.guestLogin = function() {
        var guest = {
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
        save(KEYS.currentUser, guest);
        toast('👋 Chào mừng Khách!', 'success');
        setTimeout(function() { window.location.href = 'home.html'; }, 800);
    };

    // ========== INIT ==========
    function init() {
        initData();
        createParticles();
        hideLoading();
        console.log('✅ AnimeHub Login sẵn sàng!');
        console.log('👤 admin / admin123 | senpai / 123456');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
