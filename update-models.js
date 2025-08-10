// モデル情報更新スクリプト
class ModelUpdater {
    constructor() {
        this.bedrockAPI = new BedrockAPI();
    }

    // 手動でモデル情報を更新
    async updateModels() {
        try {
            console.log('モデル情報を更新中...');
            
            // キャッシュをクリア
            this.bedrockAPI.cache.clear();
            
            // 最新データを取得
            const models = await this.bedrockAPI.getLatestModels();
            
            // アプリ状態を更新
            appState.models = models;
            appState.filteredModels = [...models];
            
            // テーブルを再描画
            renderTable();
            
            console.log(`${models.length}個のモデル情報を更新しました`);
            
            // 更新時刻を表示
            const updateTime = new Date().toLocaleString('ja-JP');
            this.showUpdateNotification(`モデル情報を更新しました (${updateTime})`);
            
        } catch (error) {
            console.error('モデル情報の更新に失敗:', error);
            this.showUpdateNotification('モデル情報の更新に失敗しました', 'error');
        }
    }

    // 更新通知を表示
    showUpdateNotification(message, type = 'success') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.update-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 新しい通知を作成
        const notification = document.createElement('div');
        notification.className = `update-notification ${type}`;
        notification.textContent = message;
        
        // スタイルを設定
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: ${type === 'error' ? '#d32f2f' : '#4caf50'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // 3秒後に自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // 定期更新を開始
    startAutoUpdate(intervalMinutes = 60) {
        console.log(`${intervalMinutes}分間隔でモデル情報の自動更新を開始します`);
        
        setInterval(() => {
            this.updateModels();
        }, intervalMinutes * 60 * 1000);
    }
}

// グローバルに利用可能にする
window.modelUpdater = new ModelUpdater();