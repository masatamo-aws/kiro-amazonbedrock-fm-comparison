# Amazon Bedrock 基盤モデル比較アプリ v1.5.0

Amazon Bedrockで利用可能な基盤モデルの機能・性能・費用を比較できるWebアプリケーションです。
**AWS公式ドキュメント2025年版完全対応**で、80以上の全基盤モデルを網羅し、ダークモード・通貨切り替え機能を搭載したリアルタイム比較・分析アプリです。

## スクリーンショット

### ライトモード
![ライトモード](https://raw.githubusercontent.com/masatamo-aws/kiro-amazonbedrock-fm-comparison/main/assets/image/Light%20Mode.png)

### ダークモード
![ダークモード](https://raw.githubusercontent.com/masatamo-aws/kiro-amazonbedrock-fm-comparison/main/assets/image/Dark%20Mode.png)

## 機能

### 🎨 ダークモード・テーマ切り替え
- **ライト/ダークモード**: 目に優しいダークテーマ対応
- **動的切り替え**: ヘッダーのラジオボタンで即座に変更
- **設定永続化**: ローカルストレージで設定を保存
- **全コンポーネント対応**: テーブル・モーダル・フィルタ全てに適用

### 💱 通貨切り替え機能
- **USD/JPY対応**: 価格表示を米ドル・日本円で切り替え
- **リアルタイム変換**: 150円/USDレートで自動計算
- **精度調整**: 金額に応じた小数点以下桁数の最適化
- **全価格対応**: メインテーブル・比較モーダル両方で変換

### 🔄 動的データ取得
- **最新モデル情報**: AWS公式情報から最新データを自動取得
- **24時間キャッシュ**: 効率的なデータ管理
- **手動更新**: 「モデル情報更新」ボタンで即座に最新情報を取得
- **フォールバック**: ネットワーク問題時も基本機能を維持

### 📊 モデル一覧表示
- Amazon Bedrockの最新基盤モデルを表形式で表示
- プロバイダー、タイプ、機能、価格、性能を一覧で確認
- リアルタイム更新通知

### 🔍 フィルタリング・検索
- **プロバイダー別フィルタ**: Anthropic, Amazon, Meta, Cohere, Stability AI
- **タイプ別フィルタ**: テキスト生成, 画像生成, 埋め込み
- **価格帯別フィルタ**: 低価格, 中価格, 高価格
- **検索機能**: モデル名での検索

### 📈 ソート機能
- モデル名、プロバイダー、価格、速度でソート
- 昇順・降順の切り替え

### ⚖️ 比較機能
- 複数モデルの選択（チェックボックス）
- 詳細比較モーダルで並列表示
- 機能、性能、価格の詳細比較
- **新機能**: 画像解析、ストリーミング、ツール使用の比較

### 📤 エクスポート機能
- JSON形式でのデータ出力
- CSV形式でのデータ出力

## 使用方法

### 1. アプリの起動
```bash
# ローカルサーバーで起動（例：Python）
python -m http.server 8000

# または Node.js
npx serve .
```

ブラウザで `http://localhost:8000` にアクセス

### 2. 最新情報の取得
1. アプリ起動時に自動で最新モデル情報を取得
2. 「モデル情報更新」ボタンで手動更新
3. 更新通知で最新状況を確認

### 3. モデルの検索・フィルタリング
1. 上部の検索バーでモデル名を検索
2. 左側のフィルタパネルで条件を設定
3. テーブルヘッダーをクリックしてソート

### 4. モデルの比較
1. 比較したいモデルのチェックボックスを選択
2. 「選択モデルを比較」ボタンをクリック
3. 比較モーダルで詳細を確認

### 5. データのエクスポート
1. 比較モーダル内の「JSON出力」または「CSV出力」ボタンをクリック
2. ファイルが自動ダウンロードされます

## 技術仕様

### アーキテクチャ
- **3層アーキテクチャ**: Presentation / Business Logic / Data Access
- **モジュラー設計**: 疎結合な構成で拡張性を確保
- **状態管理**: 単一の真実の源（appState）

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: レスポンシブデザイン、CSS Grid/Flexbox
- **JavaScript (ES6+)**: モジュラー設計、非同期処理

### データ管理
- **動的取得**: BedrockAPIクラスによる最新情報取得
- **キャッシュ**: 24時間のメモリキャッシュ
- **JSON**: モデル情報の構造化データ
- **フォールバック**: 静的データによる安定性確保

### 対応ブラウザ
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## ファイル構成

```
Q-amazonbedrockfmcomparison/
├── index.html              # メインページ
├── styles.css              # スタイルシート
├── script.js               # メインロジック
├── api/
│   └── bedrock-api.js      # AWS Bedrock API クライアント
├── update-models.js        # モデル更新管理
├── data/
│   └── models.json         # フォールバック用モデルデータ
├── components/             # 将来のコンポーネント用
├── requirements.md         # 仕様書
├── design.md              # 設計書
├── logicalarchitecture.md  # 論理アーキテクチャ
├── tasks.md               # タスクリスト
├── CHANGELOG.md           # 変更履歴
└── README.md              # このファイル
```

## 対応モデル（完全版）

### 📊 80以上の全モデル対応
**AWS公式ドキュメント完全対応 - 2025年最新版**

### テキスト生成モデル
- **Anthropic Claude**: 3.7 Sonnet, Opus 4.1, Sonnet 4, 3.5 Sonnet v2/Haiku, 3 Sonnet/Haiku/Opus, v2.1/v2/v1, Instant
- **Amazon Titan**: Text Premier/Express/Lite
- **Amazon Nova**: Premier/Pro/Lite/Micro/Sonic (最新)
- **Meta Llama**: 4 Maverick/Scout 17B, 3.3 70B, 3.2 (90B/11B/3B/1B), 3.1 (405B/70B/8B), 2 (70B/13B/7B)
- **OpenAI**: GPT-OSS 120B/20B (最新追加)
- **Cohere**: Command R+/R/Text/Light
- **AI21 Labs**: Jamba 1.5 Large/Mini, Jurassic-2 Ultra/Mid/Grande/Jumbo
- **Mistral AI**: Pixtral Large, Large 2402/2407, Small, Mixtral 8x7B, 7B Instruct
- **DeepSeek**: R1 (最新追加)

### 画像生成モデル
- **Amazon**: Titan Image Generator v2/v1, Nova Canvas
- **Stability AI**: SD3.5 Large, Stable Image Ultra/Core, SD3 Large, SDXL v1/v0.9, SD v1.6

### 埋め込みモデル
- **Amazon Titan**: Text Embeddings v2/v1, Multimodal Embeddings
- **Cohere**: Embed English/Multilingual v3

### 🎥 動画生成モデル
- **Amazon Nova Reel**: 動画生成対応

### 新機能対応
- **画像解析**: Claude 3.5, Llama 3.2, Nova Pro/Lite
- **ストリーミング**: ほぼ全モデル対応
- **ツール使用**: Claude, Llama, Command R+, Nova
- **ファインチューニング**: Titan, Llama, Cohere

## カスタマイズ

### 新しいモデルの追加
`api/bedrock-api.js` の `fetchModelsList()` に新しいモデル情報を追加：

```javascript
{
  id: 'new-model-id',
  name: 'New Model Name',
  provider: 'Provider Name',
  type: 'text|image|embedding',
  features: {
    textGeneration: true,
    imageAnalysis: false,
    embedding: false,
    streaming: true,
    toolUse: false
  },
  performance: { ... },
  regions: ['us-east-1', 'us-west-2']
}
```

価格情報は `fetchPricingInfo()` に追加してください。

### スタイルのカスタマイズ
`styles.css` の CSS変数を変更：

```css
:root {
  --primary-color: #FF9900;
  --secondary-color: #232F3E;
  /* ... */
}
```

## バージョン履歴

- **v1.5.0**: ダークモード・通貨切り替え機能、OpenAI GPT-OSS・DeepSeek・最新AIモデル追加（80+モデル）
- **v1.4.0**: AWS公式ドキュメント完全対応（50+モデル）
- **v1.3.0**: レスポンシブデザイン強化、Novaシリーズ追加
- **v1.2.0**: 論理アーキテクチャドキュメント追加
- **v1.1.0**: 動的データ取得機能、最新モデル対応
- **v1.0.0**: 初期リリース

詳細は [CHANGELOG.md](CHANGELOG.md) をご確認ください。

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。