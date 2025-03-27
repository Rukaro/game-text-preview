window.bitable.initializePlugin().then(() => {
    const previewElement = document.getElementById('preview');
    
    // 监听选择变化
    window.bitable.base.onSelectionChange(async (event) => {
        try {
            const { data: { tableId, recordId, fieldId } } = event;
            if (!tableId || !recordId || !fieldId) {
                previewElement.innerHTML = '<span class="empty-text">请选择一个单元格</span>';
                return;
            }

            // 获取选中的单元格值
            const table = await window.bitable.base.getTableById(tableId);
            const field = await table.getFieldById(fieldId);
            const record = await table.getRecordById(recordId);
            const cellValue = await record.getCellValue(fieldId);

            if (!cellValue) {
                previewElement.innerHTML = '<span class="empty-text">单元格内容为空</span>';
                return;
            }

            // 解析并高亮标签
            const highlightedText = cellValue.toString().replace(
                /<([^>]+)>/g,
                (match, content) => {
                    // 解析标签和属性
                    const parts = content.split(' ');
                    const tagName = parts[0];
                    const attributes = content.match(/(\w+)=["']([^"']*)["']/g) || [];
                    
                    // 构建高亮HTML
                    let highlighted = `<span class="tag">&lt;${tagName}</span>`;
                    attributes.forEach(attr => {
                        const [name, value] = attr.split('=');
                        highlighted += ` <span class="attribute">${name}</span>=<span class="value">${value}</span>`;
                    });
                    highlighted += `<span class="tag">&gt;</span>`;
                    
                    return highlighted;
                }
            ).replace(
                /<\/(\w+)>/g,
                (match, tagName) => `<span class="tag">&lt;/${tagName}&gt;</span>`
            );
            
            previewElement.innerHTML = highlightedText;
        } catch (error) {
            console.error('Error:', error);
            previewElement.innerHTML = '<span class="empty-text">发生错误：' + error.message + '</span>';
        }
    });
}); 