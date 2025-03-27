window.bitablePluginSDK.init().then(() => {
    // 监听单元格选择事件
    bitable.base.onSelectionChange((event) => {
        const { tableId, recordId, fieldId } = event.data;
        if (tableId && recordId && fieldId) {
            // 获取选中的单元格值
            const record = bitable.base.getTableById(tableId).getRecordById(recordId);
            const cellValue = record.getCellValue(fieldId);
            
            // 发送消息到侧边栏
            bitable.bridge.sendMessage({
                type: 'cell-selected',
                data: {
                    value: cellValue
                }
            });
        }
    });
}); 