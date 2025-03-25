// 阿里云OSS配置
const ossConfig = {
    region: 'oss-cn-chengdu', // 西南1（成都）区域
    accessKeyId: '您的AccessKey ID', // 请在config.js中配置
    accessKeySecret: '您的AccessKey Secret', // 请在config.js中配置
    bucket: 'qqzts'
};

// 初始化OSS客户端
const client = new OSS(ossConfig);

// 文件类型映射
const fileTypes = {
    attachment1: '附件一',
    attachment2: '附件二',
    attachment3: '附件三',
    attachment4: '附件四',
    video: '视频'
};

// 显示文件列表
async function showFiles(type) {
    const previewContent = document.getElementById('preview-content');
    const previewTitle = document.getElementById('preview-title');
    const filePreview = document.getElementById('file-preview');
    
    try {
        // 显示加载状态
        previewContent.innerHTML = '<div class="loading">加载中...</div>';
        filePreview.classList.remove('hidden');
        
        // 获取文件列表
        const files = await listFiles(type);
        
        // 更新标题
        previewTitle.textContent = getTypeName(type);
        
        // 渲染文件列表
        renderFiles(files, previewContent);
    } catch (error) {
        console.error('Error loading files:', error);
        previewContent.innerHTML = '<div class="error">加载失败，请稍后重试</div>';
    }
}

// 获取文件列表
async function listFiles(type) {
    try {
        const result = await client.list({
            prefix: `${fileTypes[type]}/`,
            delimiter: '/'
        });
        // 过滤掉文件夹本身，只返回文件
        return (result.objects || []).filter(file => 
            file.name !== `${fileTypes[type]}/` && 
            !file.name.endsWith('/')
        );
    } catch (error) {
        console.error('Error listing files:', error);
        throw error;
    }
}

// 渲染文件列表
function renderFiles(files, container) {
    if (files.length === 0) {
        container.innerHTML = '<div class="no-files">暂无文件</div>';
        return;
    }

    const fileList = document.createElement('div');
    fileList.className = 'file-list';

    files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileName = file.name.split('/').pop();
        const fileType = getFileType(fileName);
        
        fileItem.innerHTML = `
            <div class="file-icon">${getFileIcon(fileType)}</div>
            <div class="file-info">
                <div class="file-name">${fileName}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="preview-btn" onclick="previewFile('${file.name}')">预览</button>
        `;
        
        fileList.appendChild(fileItem);
    });

    container.innerHTML = '';
    container.appendChild(fileList);
}

// 预览文件
async function previewFile(fileName) {
    try {
        const url = await client.signatureUrl(fileName);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error previewing file:', error);
        alert('预览失败，请稍后重试');
    }
}

// 关闭预览
function closePreview() {
    document.getElementById('file-preview').classList.add('hidden');
}

// 获取文件类型图标
function getFileIcon(fileType) {
    const icons = {
        pdf: '📄',
        doc: '📝',
        docx: '📝',
        xls: '📊',
        xlsx: '📊',
        mp4: '🎥',
        avi: '🎥',
        jpg: '🖼️',
        jpeg: '🖼️',
        png: '🖼️'
    };
    return icons[fileType] || '📁';
}

// 获取文件类型
function getFileType(fileName) {
    return fileName.split('.').pop().toLowerCase();
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 获取类型名称
function getTypeName(type) {
    const names = {
        attachment1: '附件一',
        attachment2: '附件二',
        attachment3: '附件三',
        attachment4: '附件四',
        video: '视频'
    };
    return names[type] || type;
} 