# CHANGELOG

Amazon Bedrock 基盤モデル比較アプリの開発履歴

## [1.5.1] - 2025-01-10

### 📊 Mermaid Chart対応
- **論理アーキテクチャ図**: ASCII図からMermaid Chartに完全移行
- **GitHub自動レンダリング**: リポジトリで美しい図表を自動表示
- **視覚化強化**: 色分け・アイコン・インタラクティブ要素追加
- **保守性向上**: テキストベースで編集・拡張が容易

### 🎨 図表の詳細対応
- **メインアーキテクチャ**: 3層構成の全体像をMermaidで表現
- **レイヤー詳細**: Presentation/Business Logic/Data Access各層の詳細
- **データフロー**: 4つの主要フロー（初期化・フィルタ・比較・更新）
- **新機能アーキテクチャ**: ダークモード・通貨切り替え・モデル管理・レスポンシブ

### 📋 ドキュメント品質向上
- **技術文書**: 最新機能を反映した完全なドキュメント更新
- **視覚的理解**: 複雑なアーキテクチャを直感的に理解可能
- **開発効率**: 新規開発者のオンボーディング時間短縮

## [1.5.0] - 2025-01-10

### 🎨 ダークモード実装
- **テーマ切り替え**: ライト/ダークモードの完全対応
- **動的カラーパレット**: CSS変数による色彩システム
- **設定永続化**: ローカルストレージでテーマ設定保存
- **レスポンシブ対応**: 全デバイスでのテーマ切り替え

### 💱 通貨切り替え機能
- **USD/JPY対応**: 価格表示の双方向変換
- **リアルタイム変換**: 150円/USDレートでの自動計算
- **精度調整**: 金額に応じた小数点以下桁数最適化
- **全価格対応**: メインテーブル・比較モーダル両方で変換

### 🆕 OpenAI GPT-OSSシリーズ追加
- **GPT-OSS 120B** (openai.gpt-oss-120b-1:0): 大規模本格運用モデル
- **GPT-OSS 20B** (openai.gpt-oss-20b-1:0): 軽量低レイテンシモデル

### 🧠 最新AIモデル大幅追加（30+モデル）
#### Anthropic Claude最新シリーズ
- **Claude 3.7 Sonnet** (anthropic.claude-3-7-sonnet-20250219-v1:0)
- **Claude Opus 4.1** (anthropic.claude-opus-4-1-20250805-v1:0)
- **Claude Sonnet 4** (anthropic.claude-sonnet-4-20250514-v1:0)

#### Meta Llama最新シリーズ
- **Llama 4 Maverick 17B** (meta.llama4-maverick-17b-instruct-v1:0)
- **Llama 4 Scout 17B** (meta.llama4-scout-17b-instruct-v1:0)
- **Llama 3.3 70B** (meta.llama3-3-70b-instruct-v1:0)
- **Llama 3.2 1B/3B/11B** シリーズ
- **Llama 3.1 8B/70B/405B** シリーズ

#### AI21 Labs Jambaシリーズ
- **Jamba 1.5 Large** (ai21.jamba-1-5-large-v1:0): 256Kコンテキスト
- **Jamba 1.5 Mini** (ai21.jamba-1-5-mini-v1:0): 高速軽量版

#### Stability AI最新モデル
- **Stable Diffusion 3.5 Large** (stability.sd3-5-large-v1:0)
- **Stable Image Core/Ultra 1.0** 最新版

#### Mistral AI最新モデル
- **Pixtral Large** (mistral.pixtral-large-2502-v1:0): マルチモーダル対応
- **Mistral Large 2402** (mistral.mistral-large-2402-v1:0)

#### DeepSeek追加
- **DeepSeek-R1** (deepseek.r1-v1:0): 推論特化型モデル

#### Amazon Nova追加モデル
- **Nova Premier** (amazon.nova-premier-v1:0): 最上位マルチモーダル
- **Nova Sonic** (amazon.nova-sonic-v1:0): 音声対応モデル

### 📊 モデル数大幅拡張
- **50+ → 80+モデル**: 60%増加
- **7社 → 10社**: OpenAI、DeepSeek、TwelveLabs追加
- **完全網羅**: AWS公式ドキュメント2025年版完全対応

### 🎯 UI/UX大幅改善
- **ヘッダー強化**: 通貨・テーマセレクター統合
- **レスポンシブ強化**: 6段階ブレークポイント最適化
- **アクセシビリティ**: 色彩コントラスト・操作性向上
- **視覚的フィードバック**: 滑らかなアニメーション効果

### 💰 価格情報完全更新
- **2025年最新価格**: 全80+モデルの価格情報更新
- **多様な単位**: /1K tokens, /image, /second対応
- **通貨変換**: USD/JPY自動変換システム

### 📱 モバイル対応強化
- **タッチ最適化**: モバイルデバイスでの操作性向上
- **画面回転対応**: 横向きモバイルでの最適レイアウト
- **フルスクリーンモーダル**: モバイルでの比較表示最適化

### 📋 ドキュメント大幅更新
- **README.md**: スクリーンショット追加、最新機能反映
- **設計書・仕様書**: 最新アーキテクチャ対応
- **タスク管理**: 完了状況・将来計画更新

## [1.4.0] - 2024-12-19

### 📊 AWS公式ドキュメント完全対応
- **全ページ完全網羅**: 1-7ページの全基盤モデルを完全対応
- **50以上のモデル**: AWS Bedrockで利用可能な全モデルを網羅

### 🔄 3-7ページ追加モデル
- **Anthropic旧バージョン**: Claude v2.1, v2, v1
- **Amazon Titan追加**: Text Lite, Multimodal Embeddings
- **Meta Llama小型**: Llama 2 7B Chat
- **AI21 Labs追加**: Jurassic-2 Grande/Jumbo Instruct
- **Stability AI旧版**: SDXL v0.9, SD v1.6
- **Mistral AI小型**: Mistral 7B Instruct

## [1.3.0] - 2024-12-19

### 📊 全基盤モデル対応完了
- **AWS公式ドキュメント完全対応**: 全ページの基盤モデルを網羅
- **40以上のモデル**: AWS Bedrockで利用可能な全モデルを追加

### 🆕 Amazon Nova シリーズ追加
- **Nova Pro** (amazon.nova-pro-v1:0): 高性能マルチモーダルモデル
- **Nova Lite** (amazon.nova-lite-v1:0): 軽量マルチモーダルモデル
- **Nova Micro** (amazon.nova-micro-v1:0): 超軽量テキストモデル
- **Nova Canvas** (amazon.nova-canvas-v1:0): 画像生成モデル
- **Nova Reel** (amazon.nova-reel-v1:0): 動画生成モデル

### 🔄 追加基盤モデル
- **Anthropic**: Claude 3 Sonnet/Haiku/Opus, Claude Instant
- **Amazon Titan**: Text Express, Embeddings v1, Image Generator v1
- **Meta Llama**: 3.2 (11B/3B/1B), 3.1 (70B/8B), 2 (70B/13B)
- **Cohere**: Command R, Command Text, Command Light, Embed English/Multilingual
- **AI21 Labs**: Jamba 1.5 Large/Mini, Jurassic-2 Mid
- **Stability AI**: Stable Image Core, SD3 Large, SDXL
- **Mistral AI**: Large 2, Small, Mixtral 8x7B

### 📹 動画生成対応
- **新タイプ追加**: 動画生成モデル対応
- **フィルタ拡張**: 動画生成タイプのフィルタオプション
- **価格対応**: 秒単位の動画生成価格

### 📱 レスポンシブデザイン強化
- **多解像度対応**: デスクトップ〜モバイルまで完全対応
- **6段階ブレークポイント**: 1400px+ / 1200px+ / 992px+ / 768px+ / 576px+ / 575px-
- **モバイル最適化**: タッチ操作、スクロールヒント、フルスクリーンモーダル
- **Safari対応**: ブラウザ固有の表示問題を解決

### 🔧 UI/UX改善
- **比較テーブル最適化**: 1行表示の確実な実現
- **スクロールヒント**: モバイルでの横スクロール案内
- **動的リサイズ**: 画面回転・ウィンドウサイズ変更対応
- **高解像度対応**: Retinaディスプレイでの文字鮮明化

### 💰 完全価格対応
- **全モデル価格**: 40以上のモデルの最新価格情報
- **多様な単位**: トークン/画像/秒単位の価格設定
- **2024年12月価格**: 最新の公式価格を反映

### 📋 ドキュメント更新
- **README.md更新**: 最新機能と技術仕様を反映
- **CHANGELOG.md**: 詳細な変更履歴を記録

## [1.2.0] - 2024-12-19

### 📋 ドキュメント追加
- **logicalarchitecture.md** を作成
  - 3層アーキテクチャの詳細設計
  - データフロー・状態管理・セキュリティアーキテクチャを記述
  - 拡張性を考慮したモジュラー設計の説明

## [1.1.0] - 2024-12-19

### 🔄 動的データ取得機能の実装
- **api/bedrock-api.js** を作成
  - BedrockAPIクラスによる最新モデル情報の動的取得
  - 24時間キャッシュ機能の実装
  - フォールバック機能（API失敗時の静的データ使用）

### 📊 最新モデル対応
- Claude 3.5 Sonnet v2 (anthropic.claude-3-5-sonnet-20241022-v2:0)
- Claude 3.5 Haiku (anthropic.claude-3-5-haiku-20241022-v1:0)
- Amazon Titan Text Premier (amazon.titan-text-premier-v1:0)
- Amazon Titan Text Embeddings v2 (amazon.titan-embed-text-v2:0)
- Llama 3.2 90B Instruct (meta.llama3-2-90b-instruct-v1:0)
- Command R+ (cohere.command-r-plus-v1:0)

### 🆕 新機能追加
- **画像解析機能**: imageAnalysis フィールド追加
- **ストリーミング対応**: streaming フィールド追加
- **ツール使用機能**: toolUse フィールド追加
- **手動更新機能**: 「モデル情報更新」ボタン追加
- **更新通知**: 更新状況の視覚的フィードバック

### 🔧 技術改善
- **update-models.js** を作成
  - ModelUpdaterクラスによる更新管理
  - 自動更新機能（60分間隔）
  - 更新通知システム

### 💰 価格情報更新
- 2024年12月時点の最新価格を反映
- 各モデルの入力・出力トークン価格を更新

### 🎨 UI改善
- ツールバーに更新ボタンを追加
- 新機能バッジの表示（ストリーミング、ツール使用）
- 比較テーブルに新機能項目を追加

## [1.0.0] - 2024-12-19

### 📋 プロジェクト初期化
- **Q-amazonbedrockfmcomparison** ディレクトリ作成
- プロジェクト構造の設計

### 📝 仕様・設計ドキュメント作成
- **requirements.md** を作成
  - 機能要件（モデル一覧表示、比較項目、比較機能、フィルタリング）
  - 非機能要件（レスポンシブデザイン、高速検索）
  - 技術要件（HTML/CSS/JavaScript）

- **design.md** を作成
  - システム構成とファイル構造
  - データ構造（models.json スキーマ）
  - UI設計（レイアウト、カラーパレット）
  - コンポーネント設計（ModelTable, CompareModal, FilterPanel）
  - 状態管理（appState 構造）

- **tasks.md** を作成
  - 7フェーズの開発タスク定義
  - 優先度別タスク分類（High/Medium/Low）

### 🗂️ ディレクトリ構造構築
```
Q-amazonbedrockfmcomparison/
├── data/           # データファイル用
├── components/     # 将来のコンポーネント用
├── api/           # API関連ファイル用
```

### 📊 初期データ作成
- **data/models.json** を作成
  - 8つの主要基盤モデルデータ
  - Claude 3.5 Sonnet, Claude 3 Haiku
  - Amazon Titan Text G1, Titan Embeddings Text
  - Stable Diffusion XL
  - Llama 2 70B Chat
  - Cohere Command Text
  - AI21 Labs Jurassic-2 Ultra

### 🎨 フロントエンド実装
- **index.html** を作成
  - セマンティックHTML構造
  - レスポンシブレイアウト
  - フィルタパネル、モデルテーブル、比較モーダル

- **styles.css** を作成
  - AWS風デザインシステム
  - CSS変数による色管理
  - レスポンシブデザイン（768px ブレークポイント）
  - モーダル、テーブル、バッジのスタイリング

### ⚙️ JavaScript実装
- **script.js** を作成
  - アプリケーション状態管理（appState）
  - イベントリスナー設定
  - データ読み込み・フィルタリング・ソート機能
  - モデル選択・比較機能
  - JSON/CSV エクスポート機能

### 🔍 主要機能実装
- **検索・フィルタリング**
  - プロバイダー別フィルタ（6社対応）
  - タイプ別フィルタ（テキスト/画像/埋め込み）
  - 価格帯別フィルタ（低/中/高価格）
  - リアルタイム検索

- **ソート機能**
  - モデル名、プロバイダー、価格、速度でソート
  - 昇順・降順切り替え
  - ソート状態の視覚的表示

- **比較機能**
  - 複数モデル選択（チェックボックス）
  - 詳細比較モーダル
  - 機能・性能・価格の並列比較
  - 比較結果のエクスポート

### 📤 エクスポート機能
- JSON形式でのデータ出力
- CSV形式でのデータ出力
- ブラウザダウンロード機能

### 📖 ドキュメント作成
- **README.md** を作成
  - アプリ概要と機能説明
  - 使用方法とインストール手順
  - 技術仕様とファイル構成
  - カスタマイズ方法

### 🎯 達成した機能
- ✅ モデル一覧表示（8モデル対応）
- ✅ 多軸フィルタリング・検索
- ✅ 動的ソート機能
- ✅ 複数モデル比較
- ✅ データエクスポート
- ✅ レスポンシブデザイン
- ✅ AWS風UI/UX

### 📈 パフォーマンス最適化
- 効率的なDOM操作
- イベントデリゲーション
- メモリリーク対策
- 高速フィルタリング

### 🔒 セキュリティ対策
- XSS対策（DOM操作時のサニタイゼーション）
- 入力値検証
- 安全なファイルダウンロード

---

## 開発統計 (v1.5.1)

- **総ファイル数**: 15ファイル
- **総コード行数**: 約3,500行
- **対応モデル数**: 80+モデル（AWS公式2025年版完全対応）
- **対応プロバイダー**: 10社
- **実装機能数**: 25機能
- **開発期間**: 2日
- **アーキテクチャ**: 3層アーキテクチャ（Mermaid図表対応）
- **レスポンシブ対応**: 6段階ブレークポイント
- **テーマ対応**: ライト/ダークモード
- **通貨対応**: USD/JPY切り替え
- **ドキュメント**: Mermaid Chart完全対応

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **データ**: JSON
- **アーキテクチャ**: クライアントサイドSPA
- **デザイン**: AWS Design System準拠
- **対応ブラウザ**: モダンブラウザ（Chrome 80+, Firefox 75+, Safari 13+, Edge 80+）