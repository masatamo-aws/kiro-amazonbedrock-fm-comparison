// アプリケーション状態
const appState = {
    models: [],
    filteredModels: [],
    selectedModels: [],
    filters: {
        provider: 'all',
        type: 'all',
        price: 'all',
        search: ''
    },
    sortBy: 'name',
    sortOrder: 'asc',
    currency: 'USD',
    exchangeRate: 150 // USD to JPY レート（実際のアプリでは動的に取得）
};

// DOM要素
const elements = {
    searchInput: document.getElementById('searchInput'),
    providerFilter: document.getElementById('providerFilter'),
    typeFilter: document.getElementById('typeFilter'),
    priceFilter: document.getElementById('priceFilter'),
    resetFilters: document.getElementById('resetFilters'),
    selectAll: document.getElementById('selectAll'),
    modelsTableBody: document.getElementById('modelsTableBody'),
    selectedCount: document.getElementById('selectedCount'),
    compareBtn: document.getElementById('compareBtn'),
    compareModal: document.getElementById('compareModal'),
    compareContent: document.getElementById('compareContent'),
    exportJson: document.getElementById('exportJson'),
    exportCsv: document.getElementById('exportCsv')
};

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    initializeTheme();
    initializeCurrency();
    await loadModels();
    setupEventListeners();
    renderTable();
});

// モデルデータの読み込み
async function loadModels() {
    try {
        // BedrockAPIから最新データを取得
        const bedrockAPI = new BedrockAPI();
        const models = await bedrockAPI.getLatestModels();
        
        appState.models = models;
        appState.filteredModels = [...appState.models];
        
        // 最終更新時刻を表示
        const lastUpdated = models[0]?.lastUpdated;
        if (lastUpdated) {
            console.log('モデル情報最終更新:', new Date(lastUpdated).toLocaleString('ja-JP'));
        }
    } catch (error) {
        console.error('モデルデータの読み込みに失敗しました:', error);
        // フォールバックとして静的データを読み込み
        try {
            const response = await fetch('./data/models.json');
            const data = await response.json();
            appState.models = data.models;
            appState.filteredModels = [...appState.models];
        } catch (fallbackError) {
            console.error('フォールバックデータの読み込みも失敗しました:', fallbackError);
        }
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // 検索
    elements.searchInput.addEventListener('input', handleSearch);
    
    // フィルタ
    elements.providerFilter.addEventListener('change', handleFilter);
    elements.typeFilter.addEventListener('change', handleFilter);
    elements.priceFilter.addEventListener('change', handleFilter);
    elements.resetFilters.addEventListener('click', resetFilters);
    
    // 選択
    elements.selectAll.addEventListener('change', handleSelectAll);
    
    // ソート
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => handleSort(header.dataset.sort));
    });
    
    // 比較
    elements.compareBtn.addEventListener('click', showCompareModal);
    
    // モーダル
    document.querySelector('.close').addEventListener('click', hideCompareModal);
    window.addEventListener('click', (e) => {
        if (e.target === elements.compareModal) hideCompareModal();
    });
    
    // エクスポート
    elements.exportJson.addEventListener('click', exportJson);
    elements.exportCsv.addEventListener('click', exportCsv);
    
    // モデル情報更新
    document.getElementById('updateModels').addEventListener('click', () => {
        if (window.modelUpdater) {
            window.modelUpdater.updateModels();
        }
    });
    
    // レスポンシブ対応
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
        setTimeout(handleResize, 100);
    });
    
    // テーマ切り替え
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', handleThemeChange);
    });
    
    // 通貨切り替え
    document.querySelectorAll('input[name="currency"]').forEach(radio => {
        radio.addEventListener('change', handleCurrencyChange);
    });
}

// リサイズ処理
function handleResize() {
    // モバイルでのテーブルスクロールヒントを再評価
    if (window.innerWidth <= 767) {
        const existingHint = document.querySelector('.scroll-hint');
        if (existingHint) existingHint.remove();
        setTimeout(addMobileScrollHint, 100);
    } else {
        const existingHint = document.querySelector('.scroll-hint');
        if (existingHint) existingHint.remove();
    }
    
    // モーダルのサイズ調整
    const modal = elements.compareModal;
    if (modal.style.display === 'block') {
        adjustModalForMobile();
    }
}

// モバイル用モーダル調整
function adjustModalForMobile() {
    const modalContent = document.querySelector('.modal-content');
    if (window.innerWidth <= 575) {
        modalContent.style.width = '100%';
        modalContent.style.height = '100%';
        modalContent.style.margin = '0';
        modalContent.style.borderRadius = '0';
    } else if (window.innerWidth <= 767) {
        modalContent.style.width = '98%';
        modalContent.style.height = 'auto';
        modalContent.style.margin = '2% auto';
        modalContent.style.borderRadius = '8px';
    }
}

// 検索処理
function handleSearch(e) {
    appState.filters.search = e.target.value.toLowerCase();
    applyFilters();
}

// フィルタ処理
function handleFilter() {
    appState.filters.provider = elements.providerFilter.value;
    appState.filters.type = elements.typeFilter.value;
    appState.filters.price = elements.priceFilter.value;
    applyFilters();
}

// フィルタリセット
function resetFilters() {
    appState.filters = { provider: 'all', type: 'all', price: 'all', search: '' };
    elements.searchInput.value = '';
    elements.providerFilter.value = 'all';
    elements.typeFilter.value = 'all';
    elements.priceFilter.value = 'all';
    applyFilters();
}

// フィルタ適用
function applyFilters() {
    appState.filteredModels = appState.models.filter(model => {
        // 検索フィルタ
        if (appState.filters.search && 
            !model.name.toLowerCase().includes(appState.filters.search)) {
            return false;
        }
        
        // プロバイダーフィルタ
        if (appState.filters.provider !== 'all' && 
            model.provider !== appState.filters.provider) {
            return false;
        }
        
        // タイプフィルタ
        if (appState.filters.type !== 'all' && 
            model.type !== appState.filters.type) {
            return false;
        }
        
        // 価格フィルタ
        if (appState.filters.price !== 'all') {
            const price = model.pricing.inputTokenPrice;
            if (appState.filters.price === 'low' && price >= 0.002) return false;
            if (appState.filters.price === 'medium' && (price < 0.002 || price > 0.01)) return false;
            if (appState.filters.price === 'high' && price <= 0.01) return false;
        }
        
        return true;
    });
    
    applySorting();
    renderTable();
}

// ソート処理
function handleSort(sortBy) {
    if (appState.sortBy === sortBy) {
        appState.sortOrder = appState.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        appState.sortBy = sortBy;
        appState.sortOrder = 'asc';
    }
    
    // ソートヘッダーの更新
    document.querySelectorAll('.sortable').forEach(header => {
        header.classList.remove('asc', 'desc');
        if (header.dataset.sort === sortBy) {
            header.classList.add(appState.sortOrder);
        }
    });
    
    applySorting();
    renderTable();
}

// ソート適用
function applySorting() {
    appState.filteredModels.sort((a, b) => {
        let aValue = getNestedValue(a, appState.sortBy);
        let bValue = getNestedValue(b, appState.sortBy);
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return appState.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return appState.sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
}

// ネストされた値の取得
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// テーブル描画
function renderTable() {
    const tbody = elements.modelsTableBody;
    tbody.innerHTML = '';
    
    appState.filteredModels.forEach(model => {
        const row = createTableRow(model);
        tbody.appendChild(row);
    });
    
    updateSelectedCount();
    
    // モバイルでのスクロールヒントを追加
    if (window.innerWidth <= 767) {
        addMobileScrollHint();
    }
}

// モバイルスクロールヒント
function addMobileScrollHint() {
    const tableContainer = document.querySelector('.table-container');
    const existingHint = document.querySelector('.scroll-hint');
    
    if (existingHint) existingHint.remove();
    
    if (tableContainer.scrollWidth > tableContainer.clientWidth) {
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.textContent = '← 左右にスクロールできます →';
        hint.style.cssText = `
            text-align: center;
            padding: 0.5rem;
            background: #fff3cd;
            color: #856404;
            font-size: 0.8rem;
            border-bottom: 1px solid #ffeaa7;
        `;
        
        tableContainer.parentNode.insertBefore(hint, tableContainer);
        
        // 3秒後に自動消去
        setTimeout(() => {
            if (hint.parentNode) hint.remove();
        }, 3000);
    }
}

// テーブル行作成
function createTableRow(model) {
    const row = document.createElement('tr');
    
    const features = [];
    if (model.features.textGeneration) features.push('テキスト');
    if (model.features.imageAnalysis) features.push('画像解析');
    if (model.features.embedding) features.push('埋め込み');
    if (model.features.multiLanguage) features.push('多言語');
    if (model.features.fineTuning) features.push('FT');
    if (model.features.streaming) features.push('ストリーミング');
    if (model.features.toolUse) features.push('ツール使用');
    
    const featuresHtml = features.map(f => 
        `<span class="feature-badge">${f}</span>`
    ).join('');
    
    const speedClass = `speed-${model.performance.speed.replace('-', '-')}`;
    const inputPrice = formatPrice(model.pricing.inputTokenPrice, model.pricing.per);
    const outputPrice = model.pricing.outputTokenPrice === 0 ? 
        '-' : formatPrice(model.pricing.outputTokenPrice, 1000);
    
    row.innerHTML = `
        <td><input type="checkbox" class="model-checkbox" data-model-id="${model.id}"></td>
        <td><strong>${model.name}</strong></td>
        <td>${model.provider}</td>
        <td>${getTypeLabel(model.type)}</td>
        <td><div class="features">${featuresHtml}</div></td>
        <td class="price">${inputPrice}</td>
        <td class="price">${outputPrice}</td>
        <td><span class="performance-speed ${speedClass}">${getSpeedLabel(model.performance.speed)}</span></td>
    `;
    
    // チェックボックスイベント
    const checkbox = row.querySelector('.model-checkbox');
    checkbox.addEventListener('change', handleModelSelection);
    
    return row;
}

// タイプラベル取得
function getTypeLabel(type) {
    const labels = {
        'text': 'テキスト生成',
        'image': '画像生成',
        'embedding': '埋め込み',
        'video': '動画生成'
    };
    return labels[type] || type;
}

// 速度ラベル取得
function getSpeedLabel(speed) {
    const labels = {
        'very-fast': '超高速',
        'fast': '高速',
        'medium': '中程度',
        'slow': '低速'
    };
    return labels[speed] || speed;
}

// モデル選択処理
function handleModelSelection(e) {
    const modelId = e.target.dataset.modelId;
    const isChecked = e.target.checked;
    
    if (isChecked) {
        if (!appState.selectedModels.includes(modelId)) {
            appState.selectedModels.push(modelId);
        }
    } else {
        appState.selectedModels = appState.selectedModels.filter(id => id !== modelId);
    }
    
    updateSelectedCount();
    updateCompareButton();
}

// 全選択処理
function handleSelectAll(e) {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('.model-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        const modelId = checkbox.dataset.modelId;
        
        if (isChecked) {
            if (!appState.selectedModels.includes(modelId)) {
                appState.selectedModels.push(modelId);
            }
        } else {
            appState.selectedModels = appState.selectedModels.filter(id => id !== modelId);
        }
    });
    
    updateSelectedCount();
    updateCompareButton();
}

// 選択数更新
function updateSelectedCount() {
    elements.selectedCount.textContent = appState.selectedModels.length;
}

// 比較ボタン更新
function updateCompareButton() {
    elements.compareBtn.disabled = appState.selectedModels.length < 2;
}

// 比較モーダル表示
function showCompareModal() {
    const selectedModelData = appState.selectedModels.map(id => 
        appState.models.find(model => model.id === id)
    );
    
    renderCompareTable(selectedModelData);
    elements.compareModal.style.display = 'block';
    
    // モバイル対応
    adjustModalForMobile();
    
    // モバイルでのスクロールをトップにリセット
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
}

// 比較モーダル非表示
function hideCompareModal() {
    elements.compareModal.style.display = 'none';
}

// 比較テーブル描画
function renderCompareTable(models) {
    const table = document.createElement('table');
    table.className = 'compare-table';
    
    // ヘッダー
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>項目</th>' + 
        models.map(model => `<th>${model.name}</th>`).join('');
    table.appendChild(headerRow);
    
    // 基本情報
    addCompareRow(table, '基本情報', '', true);
    addCompareRow(table, 'プロバイダー', models.map(m => m.provider));
    addCompareRow(table, 'タイプ', models.map(m => getTypeLabel(m.type)));
    
    // 機能
    addCompareRow(table, '機能', '', true);
    addCompareRow(table, 'テキスト生成', models.map(m => m.features.textGeneration ? '○' : '×'));
    addCompareRow(table, '画像解析', models.map(m => m.features.imageAnalysis ? '○' : '×'));
    addCompareRow(table, '埋め込み', models.map(m => m.features.embedding ? '○' : '×'));
    addCompareRow(table, '多言語対応', models.map(m => m.features.multiLanguage ? '○' : '×'));
    addCompareRow(table, 'コンテキスト長', models.map(m => m.features.contextLength.toLocaleString()));
    addCompareRow(table, 'ファインチューニング', models.map(m => m.features.fineTuning ? '○' : '×'));
    addCompareRow(table, 'ストリーミング', models.map(m => m.features.streaming ? '○' : '×'));
    addCompareRow(table, 'ツール使用', models.map(m => m.features.toolUse ? '○' : '×'));
    
    // 性能
    addCompareRow(table, '性能', '', true);
    addCompareRow(table, '速度', models.map(m => getSpeedLabel(m.performance.speed)));
    addCompareRow(table, '精度', models.map(m => m.performance.accuracy));
    addCompareRow(table, 'トークン処理能力', models.map(m => m.performance.tokenThroughput.toLocaleString()));
    
    // 価格
    addCompareRow(table, '価格', '', true);
    addCompareRow(table, '入力価格', models.map(m => 
        formatPrice(m.pricing.inputTokenPrice, m.pricing.per)
    ));
    addCompareRow(table, '出力価格', models.map(m => 
        m.pricing.outputTokenPrice === 0 ? '-' : formatPrice(m.pricing.outputTokenPrice, 1000)
    ));
    
    elements.compareContent.innerHTML = '';
    elements.compareContent.appendChild(table);
}

// 比較行追加
function addCompareRow(table, label, values, isCategory = false) {
    const row = document.createElement('tr');
    
    if (isCategory) {
        row.innerHTML = `<td class="category" colspan="${values.length + 1}">${label}</td>`;
    } else {
        row.innerHTML = `<td><strong>${label}</strong></td>` + 
            values.map(value => `<td>${value}</td>`).join('');
    }
    
    table.appendChild(row);
}

// JSON エクスポート
function exportJson() {
    const selectedModelData = appState.selectedModels.map(id => 
        appState.models.find(model => model.id === id)
    );
    
    const dataStr = JSON.stringify(selectedModelData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'bedrock-models-comparison.json';
    link.click();
}

// CSV エクスポート
function exportCsv() {
    const selectedModelData = appState.selectedModels.map(id => 
        appState.models.find(model => model.id === id)
    );
    
    const headers = ['Name', 'Provider', 'Type', 'Input Price', 'Output Price', 'Speed', 'Accuracy'];
    const rows = selectedModelData.map(model => [
        model.name,
        model.provider,
        getTypeLabel(model.type),
        model.pricing.inputTokenPrice,
        model.pricing.outputTokenPrice,
        getSpeedLabel(model.performance.speed),
        model.performance.accuracy
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'bedrock-models-comparison.csv';
    link.click();
}

// テーマ初期化
function initializeTheme() {
    // ローカルストレージからテーマを取得
    const savedTheme = localStorage.getItem('bedrock-theme') || 'light';
    
    // テーマを適用
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // ラジオボタンを更新
    const themeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    if (themeRadio) {
        themeRadio.checked = true;
    }
}

// テーマ変更処理
function handleThemeChange(e) {
    const selectedTheme = e.target.value;
    
    // テーマを適用
    document.documentElement.setAttribute('data-theme', selectedTheme);
    
    // ローカルストレージに保存
    localStorage.setItem('bedrock-theme', selectedTheme);
    
    // アニメーション効果
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// 通貨初期化
function initializeCurrency() {
    // ローカルストレージから通貨設定を取得
    const savedCurrency = localStorage.getItem('bedrock-currency') || 'USD';
    
    // 通貨を適用
    appState.currency = savedCurrency;
    
    // ラジオボタンを更新
    const currencyRadio = document.querySelector(`input[name="currency"][value="${savedCurrency}"]`);
    if (currencyRadio) {
        currencyRadio.checked = true;
    }
}

// 通貨変更処理
function handleCurrencyChange(e) {
    const selectedCurrency = e.target.value;
    
    // 通貨を適用
    appState.currency = selectedCurrency;
    
    // ローカルストレージに保存
    localStorage.setItem('bedrock-currency', selectedCurrency);
    
    // テーブルを再描画
    renderTable();
    
    // 比較モーダルが開いている場合は更新
    if (elements.compareModal.style.display === 'block') {
        const selectedModelData = appState.selectedModels.map(id => 
            appState.models.find(model => model.id === id)
        );
        renderCompareTable(selectedModelData);
    }
}

// 価格フォーマット関数
function formatPrice(price, per = 1000, currency = null) {
    const currentCurrency = currency || appState.currency;
    
    if (price === 0) return '-';
    
    let convertedPrice = price;
    let currencySymbol = '$';
    
    if (currentCurrency === 'JPY') {
        convertedPrice = price * appState.exchangeRate;
        currencySymbol = '¥';
        
        // 日本円の場合は小数点以下を適切に調整
        if (convertedPrice < 1) {
            convertedPrice = convertedPrice.toFixed(3);
        } else if (convertedPrice < 10) {
            convertedPrice = convertedPrice.toFixed(2);
        } else {
            convertedPrice = convertedPrice.toFixed(1);
        }
    } else {
        // USDの場合
        if (price < 0.001) {
            convertedPrice = price.toFixed(6);
        } else if (price < 0.01) {
            convertedPrice = price.toFixed(4);
        } else {
            convertedPrice = price.toFixed(3);
        }
    }
    
    if (per === 'image') {
        return `${currencySymbol}${convertedPrice}/image`;
    } else if (per === 'second') {
        return `${currencySymbol}${convertedPrice}/sec`;
    } else {
        return `${currencySymbol}${convertedPrice}/1K`;
    }
}