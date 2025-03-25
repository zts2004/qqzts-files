// 生成动态密码
function generatePassword() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 验证密码
function verifyPassword() {
    const input = document.getElementById('password-input');
    const correctPassword = generatePassword();
    
    if (input.value === correctPassword) {
        // 密码正确，显示主界面
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('main-container').classList.remove('hidden');
        // 存储验证状态
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authTime', new Date().getTime());
    } else {
        alert('密码错误，请重试！');
        input.value = '';
    }
}

// 检查是否已经验证
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const authTime = localStorage.getItem('authTime');
    
    if (isAuthenticated === 'true' && authTime) {
        // 检查验证是否在24小时内
        const now = new Date().getTime();
        const timeDiff = now - parseInt(authTime);
        
        if (timeDiff < 24 * 60 * 60 * 1000) {
            document.getElementById('auth-container').classList.add('hidden');
            document.getElementById('main-container').classList.remove('hidden');
        } else {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('authTime');
        }
    }
}

// 页面加载时检查验证状态
document.addEventListener('DOMContentLoaded', checkAuth); 