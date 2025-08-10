# Amazon Bedrock 基盤モデル比較アプリ 設計書 v1.5.0

## システム構成
```
kiro-amazonbedrockfmcomparison/
├── index.html              # メインページ
├── styles.css              # スタイルシート（ダークモード対応）
├── script.js               # メインロジック
├── api/
│   └── bedrock-api.js      # AWS Bedrock API クライアント
├── update-models.js        # モデル更新管理
├── data/
│   └── models.json         # フォールバック用モデルデータ
├── assets/
│   └── image/              # スクリーンショット画像
│       ├── Light Mode.png
│       └── Dark Mode.png
├── components/             # 将来のコンポーネント用
├── requirements.md         # 仕様書
├── design.md              # 設計書（このファイル）
├── logicalarchitecture.md  # 論理アーキテクチャ
├── tasks.md               # タスクリスト
├── CHANGELOG.md           # 変更履歴
└── README.md              # プロジェクト概要
```

## データ構造

### モデルデータ構造 (BedrockAPI)
```json
{
  "models": [
    {
      "id": "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "name": "Claude 3.5 Sonnet v2",
      "provider": "Anthropic",
      "type": "text",
      "features": {
        "textGeneration": true,
        "imageAnalysis": true,
        "embedding": false,
        "multiLanguage": true,
        "contextLength": 200000,
        "fineTuning": false,
        "streaming": true,
        "toolUse": true
      },
      "performance": {
        "speed": "fast",
        "accuracy": "very-high",
        "tokenThroughput": 1200,
        "latency": "low"
      },
      "pricing": {
        "inputTokenPrice": 0.003,
        "outputTokenPrice": 0.015,
        "currency": "USD",
        "per": 1000
      },
      "regions": ["us-east-1", "us-west-2", "eu-west-1", "ap-northeast-1"],
      "lastUpdated": "2025-01-10T12:00:00Z"
    }
  ]
}
```

### 対応プロバイダー（10社）
- **Anthropic**: Claude 3.7/4.1/4, 3.5 Sonnet v2/Haiku, 3 Sonnet/Haiku/Opus
- **Amazon**: Nova Premier/Pro/Lite/Micro/Canvas/Reel/Sonic, Titan Text/Image/Embeddings
- **Meta**: Llama 4 Maverick/Scout, 3.3/3.2/3.1/3/2 シリーズ
- **OpenAI**: GPT-OSS 120B/20B
- **Cohere**: Command R+/R/Text/Light, Embed English/Multilingual
- **AI21 Labs**: Jamba 1.5 Large/Mini, Jurassic-2 シリーズ
- **Stability AI**: SD3.5 Large, Stable Image Ultra/Core, SDXL
- **Mistral AI**: Pixtral Large, Large 2402/2407, Small, Mixtral 8x7B
- **DeepSeek**: R1
- **TwelveLabs**: Marengo Embed, Pegasus

## UI設計

### レイアウト
1. **ヘッダー**: タイトル、通貨切り替え、テーマ切り替え、検索バー
2. **フィルタパネル**: プロバイダー（10社）、タイプ（4種）、価格帯フィルタ
3. **ツールバー**: 選択数表示、モデル更新ボタン、比較ボタン
4. **メインテーブル**: モデル一覧と選択チェックボックス、ソート機能
5. **比較モーダル**: 詳細比較結果表示、エクスポート機能

### カラーパレット（ライト/ダークモード対応）

#### ライトモード
- プライマリ: #FF9900 (AWS Orange)
- セカンダリ: #232F3E (AWS Dark Blue)
- アクセント: #146EB4 (AWS Blue)
- 背景: #F2F3F3
- テキスト: #16191F
- カード背景: #FFFFFF

#### ダークモード
- プライマリ: #FF9900 (AWS Orange)
- セカンダリ: #1a1a1a (Dark Gray)
- アクセント: #4A9EFF (Light Blue)
- 背景: #0d1117 (GitHub Dark)
- テキスト: #e6edf3 (Light Gray)
- カード背景: #161b22 (Dark Card)

## コンポーネント設計

### ModelTable
- モデル一覧の表示
- ソート機能
- 選択機能

### CompareModal
- 選択モデルの詳細比較
- 比較結果のエクスポート

### FilterPanel
- 各種フィルタ機能
- リセット機能

## 状態管理
```javascript
const appState = {
  models: [],              // 全モデルデータ（80+モデル）
  filteredModels: [],      // フィルタ済みデータ
  selectedModels: [],      // 選択中モデルID配列
  filters: {
    provider: 'all',       // プロバイダーフィルタ
    type: 'all',          // タイプフィルタ（text/image/embedding/video）
    price: 'all',         // 価格帯フィルタ
    search: ''            // 検索クエリ
  },
  sortBy: 'name',         // ソート基準
  sortOrder: 'asc',       // ソート順序
  currency: 'USD',        // 通貨設定（USD/JPY）
  exchangeRate: 150       // USD→JPY換算レート
}
```

## 新機能アーキテクチャ

### 1. ダークモード実装
- CSS変数による動的テーマ切り替え
- ローカルストレージでの設定永続化
- 全コンポーネントの色彩対応

### 2. 通貨切り替え機能
- USD/JPY双方向変換
- リアルタイム価格表示更新
- 精度調整アルゴリズム

### 3. 動的データ取得
- BedrockAPIクラスによる最新情報取得
- 24時間キャッシュシステム
- フォールバック機能

### 4. レスポンシブデザイン
- 6段階ブレークポイント対応
- モバイルファースト設計
- タッチ操作最適化