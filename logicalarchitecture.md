# Amazon Bedrock 基盤モデル比較アプリ 論理アーキテクチャ v1.5.0

## アーキテクチャ概要

本アプリケーションは、**3層アーキテクチャ**を採用したクライアントサイドWebアプリケーションです。
80以上のAmazon Bedrockモデルを動的に管理し、ダークモード・通貨切り替え機能を搭載した高度なSPAです。

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │   UI Components │ │  Event Handlers │ │   View Logic    │ │
│  │   - ModelTable  │ │  - Search       │ │  - Rendering    │ │
│  │   - FilterPanel │ │  - Filter       │ │  - Validation   │ │
│  │   - CompareModal│ │  - Sort         │ │  - Formatting   │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │  State Manager  │ │  Filter Engine  │ │  Compare Engine │ │
│  │  - appState     │ │  - applyFilters │ │  - showCompare  │ │
│  │  - updateState  │ │  - applySorting │ │  - exportData   │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │   BedrockAPI    │ │  Cache Manager  │ │  Data Adapter   │ │
│  │  - getModels    │ │  - cacheData    │ │  - mergeData    │ │
│  │  - getPricing   │ │  - validateCache│ │  - transformData│ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## レイヤー詳細

### 1. Presentation Layer (プレゼンテーション層)

#### 責務
- ユーザーインターフェースの表示
- ユーザー操作の受付
- データの視覚的表現

#### コンポーネント構成
```
Presentation Layer
├── UI Components
│   ├── ModelTable (モデル一覧表示)
│   ├── FilterPanel (フィルタ操作)
│   ├── CompareModal (比較結果表示)
│   └── Toolbar (操作ボタン群)
├── Event Handlers
│   ├── SearchHandler (検索処理)
│   ├── FilterHandler (フィルタ処理)
│   ├── SortHandler (ソート処理)
│   └── SelectionHandler (選択処理)
└── View Logic
    ├── Renderer (DOM操作)
    ├── Formatter (データ整形)
    └── Validator (入力検証)
```

### 2. Business Logic Layer (ビジネスロジック層)

#### 責務
- アプリケーションの核となる処理
- データの変換・計算
- 状態管理

#### モジュール構成
```
Business Logic Layer
├── State Manager
│   ├── appState (アプリケーション状態)
│   ├── updateState() (状態更新)
│   └── getState() (状態取得)
├── Filter Engine
│   ├── applyFilters() (フィルタ適用)
│   ├── applySorting() (ソート適用)
│   └── resetFilters() (フィルタリセット)
├── Compare Engine
│   ├── showCompareModal() (比較表示)
│   ├── renderCompareTable() (比較テーブル生成)
│   └── exportData() (データエクスポート)
└── Model Updater
    ├── updateModels() (モデル更新)
    ├── startAutoUpdate() (自動更新)
    └── showNotification() (通知表示)
```

### 3. Data Access Layer (データアクセス層)

#### 責務
- 外部データソースとの通信
- データの取得・キャッシュ
- データ形式の変換

#### サービス構成
```
Data Access Layer
├── BedrockAPI
│   ├── getLatestModels() (最新モデル取得)
│   ├── fetchModelsList() (モデル一覧取得)
│   ├── fetchPricingInfo() (価格情報取得)
│   └── getFallbackModels() (フォールバック)
├── Cache Manager
│   ├── cache (Map型キャッシュ)
│   ├── cacheExpiry (有効期限)
│   └── validateCache() (キャッシュ検証)
└── Data Adapter
    ├── mergeModelData() (データマージ)
    ├── transformData() (データ変換)
    └── validateData() (データ検証)
```

## データフロー

### 1. 初期化フロー
```
User Access → loadModels() → BedrockAPI.getLatestModels() 
→ Cache Check → API Call → Data Merge → State Update → Render
```

### 2. フィルタリングフロー
```
User Input → handleFilter() → applyFilters() → applySorting() 
→ State Update → renderTable()
```

### 3. 比較フロー
```
Model Selection → handleModelSelection() → updateState() 
→ showCompareModal() → renderCompareTable() → Display
```

### 4. 更新フロー
```
Update Button → updateModels() → Cache Clear → API Call 
→ Data Merge → State Update → Render → Notification
```

## 状態管理アーキテクチャ

### 状態構造
```javascript
appState = {
  // データ状態
  models: [],              // 全モデルデータ（80+モデル）
  filteredModels: [],      // フィルタ済みデータ
  selectedModels: [],      // 選択中モデル
  
  // UI状態
  filters: {
    provider: 'all',       // 10社プロバイダー対応
    type: 'all',          // 4種類タイプ対応
    price: 'all',         // 価格帯フィルタ
    search: ''            // リアルタイム検索
  },
  sortBy: 'name',         // ソート基準
  sortOrder: 'asc',       // ソート順序
  
  // 新機能状態
  currency: 'USD',        // 通貨設定（USD/JPY）
  exchangeRate: 150,      // USD→JPY換算レート
  theme: 'light',         // テーマ設定（light/dark）
  
  // システム状態
  loading: false,
  error: null,
  lastUpdated: null
}
```

### 状態更新パターン
- **Immutable Updates**: 状態の不変性を保持
- **Single Source of Truth**: appStateが唯一の真実の源
- **Reactive Updates**: 状態変更時の自動UI更新

## セキュリティアーキテクチャ

### データ保護
- **XSS対策**: DOM操作時のサニタイゼーション
- **CSP**: Content Security Policy適用
- **HTTPS**: 本番環境での暗号化通信

### プライバシー
- **ローカル処理**: 機密データはクライアント内で処理
- **キャッシュ管理**: 適切な有効期限設定
- **ログ制御**: 機密情報のログ出力制限

## パフォーマンスアーキテクチャ

### 最適化戦略
- **レイジーローディング**: 必要時のみデータ取得
- **キャッシュ戦略**: 24時間のメモリキャッシュ
- **仮想化**: 大量データの効率的表示
- **デバウンス**: 検索入力の最適化

### メモリ管理
- **ガベージコレクション**: 不要オブジェクトの適切な解放
- **イベントリスナー**: 適切なクリーンアップ
- **DOM操作**: 効率的な要素更新

## 拡張性アーキテクチャ

### モジュラー設計
- **疎結合**: 各レイヤーの独立性
- **インターフェース**: 明確なAPI定義
- **プラグイン**: 機能の追加・削除容易性

### 将来拡張ポイント
- **新データソース**: 他クラウドプロバイダー対応（Azure OpenAI, Google Vertex AI）
- **新機能**: リアルタイム価格更新、性能ベンチマーク
- **新UI**: PWA化、ネイティブアプリ化
- **新分析**: 使用統計・レコメンデーション、コスト計算機
- **国際化**: 多言語対応（英語・中国語）
- **統合**: AWS Console統合、実際のモデル呼び出し機能

## v1.5.0 新機能アーキテクチャ

### 1. ダークモード実装
```
Theme System
├── CSS Variables (動的色彩管理)
├── Theme Selector (UI切り替え)
├── Local Storage (設定永続化)
└── Responsive Design (全デバイス対応)
```

### 2. 通貨切り替えシステム
```
Currency System
├── Currency Selector (USD/JPY切り替え)
├── Exchange Rate Engine (150円/USD)
├── Price Formatter (精度調整)
└── Real-time Update (即座反映)
```

### 3. 拡張モデル管理
```
Model Management
├── 80+ Models (10社プロバイダー)
├── Dynamic Loading (BedrockAPI)
├── Cache System (24時間)
└── Fallback System (静的データ)
```

### 4. 高度なレスポンシブ設計
```
Responsive Architecture
├── 6-Stage Breakpoints (1400px+ → 575px-)
├── Mobile-First Design
├── Touch Optimization
└── Orientation Support
```