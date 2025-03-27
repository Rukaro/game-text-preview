window.bitablePluginSDK.init().then(() => {
    const previewElement = document.getElementById('preview');
    
    // 监听来自主页面的消息
    bitable.bridge.onMessage((event) => {
        if (event.type === 'cell-selected') {
            const text = event.data.value;
            if (text) {
                // 解析并高亮CSS标签
                const highlightedText = text.replace(
                    /<([^>]+)>/g,
                    (match, content) => {
                        // 解析标签属性
                        const attributes = content.match(/(\w+)=["']([^"']*)["']/g) || [];
                        const tagName = content.split(' ')[0];
                        
                        // 构建高亮的HTML
                        let highlighted = `<span class="tag">&lt;${tagName}</span>`;
                        attributes.forEach(attr => {
                            const [name, value] = attr.split('=');
                            highlighted += ` <span class="attribute">${name}</span>=<span class="value">"${value.slice(1, -1)}"</span>`;
                        });
                        highlighted += `<span class="tag">&gt;</span>`;
                        
                        return highlighted;
                    }
                );
                
                previewElement.innerHTML = highlightedText;
            } else {
                previewElement.innerHTML = '请选择一个包含文本的单元格';
            }
        }
    });
}); 