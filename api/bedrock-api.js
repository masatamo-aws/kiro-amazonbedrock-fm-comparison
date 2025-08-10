// AWS Bedrock API クライアント
class BedrockAPI {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24時間
    }

    // 最新のモデル情報を取得
    async getLatestModels() {
        const cacheKey = 'bedrock-models';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }

        try {
            const [modelsData, pricingData] = await Promise.all([
                this.fetchModelsList(),
                this.fetchPricingInfo()
            ]);

            const models = this.mergeModelData(modelsData, pricingData);
            
            this.cache.set(cacheKey, {
                data: models,
                timestamp: Date.now()
            });

            return models;
        } catch (error) {
            console.error('最新モデル情報の取得に失敗:', error);
            return this.getFallbackModels();
        }
    }

    // 最新モデル一覧を取得
    async fetchModelsList() {
        return {
            models: [
                {
                    id: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
                    name: 'Claude 3.5 Sonnet v2',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 200000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'very-high',
                        tokenThroughput: 1200,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
                },
                {
                    id: 'anthropic.claude-3-5-haiku-20241022-v1:0',
                    name: 'Claude 3.5 Haiku',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 200000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'high',
                        tokenThroughput: 1800,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
                },
                {
                    id: 'amazon.titan-text-premier-v1:0',
                    name: 'Amazon Titan Text Premier',
                    provider: 'Amazon',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 32000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'high',
                        tokenThroughput: 1000,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
                },
                {
                    id: 'amazon.titan-embed-text-v2:0',
                    name: 'Amazon Titan Text Embeddings v2',
                    provider: 'Amazon',
                    type: 'embedding',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: true,
                        multiLanguage: true,
                        contextLength: 8000,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'high',
                        tokenThroughput: 2500,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
                },
                {
                    id: 'meta.llama3-2-90b-instruct-v1:0',
                    name: 'Llama 3.2 90B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 800,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'cohere.command-r-plus-v1:0',
                    name: 'Command R+',
                    provider: 'Cohere',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'high',
                        tokenThroughput: 1100,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                // Amazon Nova Models
                {
                    id: 'amazon.nova-pro-v1:0',
                    name: 'Amazon Nova Pro',
                    provider: 'Amazon',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 300000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'very-high',
                        tokenThroughput: 1100,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'amazon.nova-lite-v1:0',
                    name: 'Amazon Nova Lite',
                    provider: 'Amazon',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 300000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'high',
                        tokenThroughput: 1500,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'amazon.nova-micro-v1:0',
                    name: 'Amazon Nova Micro',
                    provider: 'Amazon',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 2000,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'amazon.nova-canvas-v1:0',
                    name: 'Amazon Nova Canvas',
                    provider: 'Amazon',
                    type: 'image',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: false,
                        contextLength: 512,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 0,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'amazon.nova-reel-v1:0',
                    name: 'Amazon Nova Reel',
                    provider: 'Amazon',
                    type: 'video',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: false,
                        contextLength: 512,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'slow',
                        accuracy: 'high',
                        tokenThroughput: 0,
                        latency: 'high'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                // Additional Models
                {
                    id: 'anthropic.claude-instant-v1',
                    name: 'Claude Instant',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 100000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 2000,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'cohere.command-light-text-v14',
                    name: 'Command Light',
                    provider: 'Cohere',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 4000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 1500,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'meta.llama2-70b-chat-v1',
                    name: 'Llama 2 70B Chat',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 4096,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'high',
                        tokenThroughput: 900,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'meta.llama2-13b-chat-v1',
                    name: 'Llama 2 13B Chat',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 4096,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'medium',
                        tokenThroughput: 1200,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                // Additional Models from Pages 3-7
                {
                    id: 'anthropic.claude-v2:1',
                    name: 'Claude v2.1',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 200000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'high',
                        tokenThroughput: 800,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'anthropic.claude-v2',
                    name: 'Claude v2',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 100000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'high',
                        tokenThroughput: 800,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'anthropic.claude-v1',
                    name: 'Claude v1',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 9000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'medium',
                        tokenThroughput: 700,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'amazon.titan-text-lite-v1',
                    name: 'Amazon Titan Text Lite',
                    provider: 'Amazon',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 4000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 1500,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'amazon.titan-embed-image-v1',
                    name: 'Amazon Titan Multimodal Embeddings',
                    provider: 'Amazon',
                    type: 'embedding',
                    features: {
                        textGeneration: false,
                        imageAnalysis: true,
                        embedding: true,
                        multiLanguage: true,
                        contextLength: 8000,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'high',
                        tokenThroughput: 2000,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'meta.llama2-7b-chat-v1',
                    name: 'Llama 2 7B Chat',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 4096,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 1500,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'ai21.j2-grande-instruct',
                    name: 'Jurassic-2 Grande Instruct',
                    provider: 'AI21 Labs',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 8192,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'medium',
                        tokenThroughput: 800,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'ai21.j2-jumbo-instruct',
                    name: 'Jurassic-2 Jumbo Instruct',
                    provider: 'AI21 Labs',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 8192,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'high',
                        tokenThroughput: 750,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'stability.stable-diffusion-xl-v0',
                    name: 'Stable Diffusion XL v0.9',
                    provider: 'Stability AI',
                    type: 'image',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: false,
                        contextLength: 77,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'high',
                        tokenThroughput: 0,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'stability.stable-diffusion-v1',
                    name: 'Stable Diffusion v1.6',
                    provider: 'Stability AI',
                    type: 'image',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: false,
                        contextLength: 77,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'medium',
                        tokenThroughput: 0,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'mistral.mistral-7b-instruct-v0:2',
                    name: 'Mistral 7B Instruct',
                    provider: 'Mistral AI',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 32000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 1600,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                // OpenAI GPT-OSS Models
                {
                    id: 'openai.gpt-oss-120b-1:0',
                    name: 'GPT-OSS 120B',
                    provider: 'OpenAI',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 800,
                        latency: 'medium'
                    },
                    regions: ['us-west-2']
                },
                {
                    id: 'openai.gpt-oss-20b-1:0',
                    name: 'GPT-OSS 20B',
                    provider: 'OpenAI',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'high',
                        tokenThroughput: 1200,
                        latency: 'low'
                    },
                    regions: ['us-west-2']
                },
                // Latest Anthropic Models
                {
                    id: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
                    name: 'Claude 3.7 Sonnet',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 200000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'very-high',
                        tokenThroughput: 1300,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
                },
                {
                    id: 'anthropic.claude-opus-4-1-20250805-v1:0',
                    name: 'Claude Opus 4.1',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 200000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 900,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'anthropic.claude-sonnet-4-20250514-v1:0',
                    name: 'Claude Sonnet 4',
                    provider: 'Anthropic',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 200000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'very-high',
                        tokenThroughput: 1100,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1']
                },
                // Latest Meta Llama Models
                {
                    id: 'meta.llama3-1-8b-instruct-v1:0',
                    name: 'Llama 3.1 8B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'high',
                        tokenThroughput: 1800,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'meta.llama3-1-70b-instruct-v1:0',
                    name: 'Llama 3.1 70B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 900,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'meta.llama3-1-405b-instruct-v1:0',
                    name: 'Llama 3.1 405B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'slow',
                        accuracy: 'very-high',
                        tokenThroughput: 400,
                        latency: 'high'
                    },
                    regions: ['us-east-2', 'us-west-2']
                },
                {
                    id: 'meta.llama3-2-1b-instruct-v1:0',
                    name: 'Llama 3.2 1B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 2500,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1']
                },
                {
                    id: 'meta.llama3-2-3b-instruct-v1:0',
                    name: 'Llama 3.2 3B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'very-fast',
                        accuracy: 'medium',
                        tokenThroughput: 2200,
                        latency: 'very-low'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1']
                },
                {
                    id: 'meta.llama3-2-11b-instruct-v1:0',
                    name: 'Llama 3.2 11B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'high',
                        tokenThroughput: 1400,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'meta.llama3-3-70b-instruct-v1:0',
                    name: 'Llama 3.3 70B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 950,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                // Latest Llama 4 Models
                {
                    id: 'meta.llama4-maverick-17b-instruct-v1:0',
                    name: 'Llama 4 Maverick 17B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'very-high',
                        tokenThroughput: 1300,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'meta.llama4-scout-17b-instruct-v1:0',
                    name: 'Llama 4 Scout 17B Instruct',
                    provider: 'Meta',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: true,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'very-high',
                        tokenThroughput: 1350,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                // AI21 Labs Jamba Models
                {
                    id: 'ai21.jamba-1-5-large-v1:0',
                    name: 'Jamba 1.5 Large',
                    provider: 'AI21 Labs',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 256000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 850,
                        latency: 'medium'
                    },
                    regions: ['us-east-1']
                },
                {
                    id: 'ai21.jamba-1-5-mini-v1:0',
                    name: 'Jamba 1.5 Mini',
                    provider: 'AI21 Labs',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 256000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'high',
                        tokenThroughput: 1400,
                        latency: 'low'
                    },
                    regions: ['us-east-1']
                },
                // Latest Stability AI Models
                {
                    id: 'stability.sd3-5-large-v1:0',
                    name: 'Stable Diffusion 3.5 Large',
                    provider: 'Stability AI',
                    type: 'image',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: false,
                        contextLength: 77,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 0,
                        latency: 'medium'
                    },
                    regions: ['us-west-2']
                },
                {
                    id: 'stability.stable-image-core-v1:1',
                    name: 'Stable Image Core 1.0',
                    provider: 'Stability AI',
                    type: 'image',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: false,
                        contextLength: 77,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'very-high',
                        tokenThroughput: 0,
                        latency: 'low'
                    },
                    regions: ['us-west-2']
                },
                {
                    id: 'stability.stable-image-ultra-v1:1',
                    name: 'Stable Image Ultra 1.0',
                    provider: 'Stability AI',
                    type: 'image',
                    features: {
                        textGeneration: false,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: false,
                        contextLength: 77,
                        fineTuning: false,
                        streaming: false,
                        toolUse: false
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 0,
                        latency: 'medium'
                    },
                    regions: ['us-west-2']
                },
                // Mistral AI Latest Models
                {
                    id: 'mistral.mistral-large-2402-v1:0',
                    name: 'Mistral Large (24.02)',
                    provider: 'Mistral AI',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 32000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 900,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'mistral.pixtral-large-2502-v1:0',
                    name: 'Pixtral Large (25.02)',
                    provider: 'Mistral AI',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 850,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2', 'eu-west-1']
                },
                // DeepSeek Model
                {
                    id: 'deepseek.r1-v1:0',
                    name: 'DeepSeek-R1',
                    provider: 'DeepSeek',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 900,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                // Amazon Nova Premier and Sonic
                {
                    id: 'amazon.nova-premier-v1:0',
                    name: 'Amazon Nova Premier',
                    provider: 'Amazon',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: true,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 300000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: true
                    },
                    performance: {
                        speed: 'medium',
                        accuracy: 'very-high',
                        tokenThroughput: 950,
                        latency: 'medium'
                    },
                    regions: ['us-east-1', 'us-west-2']
                },
                {
                    id: 'amazon.nova-sonic-v1:0',
                    name: 'Amazon Nova Sonic',
                    provider: 'Amazon',
                    type: 'text',
                    features: {
                        textGeneration: true,
                        imageAnalysis: false,
                        embedding: false,
                        multiLanguage: true,
                        contextLength: 128000,
                        fineTuning: false,
                        streaming: true,
                        toolUse: false
                    },
                    performance: {
                        speed: 'fast',
                        accuracy: 'high',
                        tokenThroughput: 1300,
                        latency: 'low'
                    },
                    regions: ['us-east-1', 'ap-northeast-1', 'eu-north-1']
                }
            ]
        };
    }

    // 最新価格情報を取得
    async fetchPricingInfo() {
        return {
            pricing: {
                'anthropic.claude-3-5-sonnet-20241022-v2:0': {
                    inputTokenPrice: 0.003,
                    outputTokenPrice: 0.015,
                    currency: 'USD',
                    per: 1000
                },
                'anthropic.claude-3-5-haiku-20241022-v1:0': {
                    inputTokenPrice: 0.00025,
                    outputTokenPrice: 0.00125,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.titan-text-premier-v1:0': {
                    inputTokenPrice: 0.0005,
                    outputTokenPrice: 0.0015,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.titan-embed-text-v2:0': {
                    inputTokenPrice: 0.0001,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama3-2-90b-instruct-v1:0': {
                    inputTokenPrice: 0.002,
                    outputTokenPrice: 0.002,
                    currency: 'USD',
                    per: 1000
                },
                'cohere.command-r-plus-v1:0': {
                    inputTokenPrice: 0.003,
                    outputTokenPrice: 0.015,
                    currency: 'USD',
                    per: 1000
                },
                // Amazon Nova Pricing
                'amazon.nova-pro-v1:0': {
                    inputTokenPrice: 0.0008,
                    outputTokenPrice: 0.0032,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.nova-lite-v1:0': {
                    inputTokenPrice: 0.0002,
                    outputTokenPrice: 0.0008,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.nova-micro-v1:0': {
                    inputTokenPrice: 0.000035,
                    outputTokenPrice: 0.00014,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.nova-canvas-v1:0': {
                    inputTokenPrice: 0.04,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 'image'
                },
                'amazon.nova-reel-v1:0': {
                    inputTokenPrice: 0.05,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 'second'
                },
                // Additional Model Pricing
                'anthropic.claude-instant-v1': {
                    inputTokenPrice: 0.0008,
                    outputTokenPrice: 0.0024,
                    currency: 'USD',
                    per: 1000
                },
                'cohere.command-light-text-v14': {
                    inputTokenPrice: 0.0003,
                    outputTokenPrice: 0.0006,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama2-70b-chat-v1': {
                    inputTokenPrice: 0.00195,
                    outputTokenPrice: 0.00256,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama2-13b-chat-v1': {
                    inputTokenPrice: 0.00075,
                    outputTokenPrice: 0.001,
                    currency: 'USD',
                    per: 1000
                },
                // Additional Model Pricing (Pages 3-7)
                'anthropic.claude-v2:1': {
                    inputTokenPrice: 0.008,
                    outputTokenPrice: 0.024,
                    currency: 'USD',
                    per: 1000
                },
                'anthropic.claude-v2': {
                    inputTokenPrice: 0.008,
                    outputTokenPrice: 0.024,
                    currency: 'USD',
                    per: 1000
                },
                'anthropic.claude-v1': {
                    inputTokenPrice: 0.008,
                    outputTokenPrice: 0.024,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.titan-text-lite-v1': {
                    inputTokenPrice: 0.0003,
                    outputTokenPrice: 0.0004,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.titan-embed-image-v1': {
                    inputTokenPrice: 0.0001,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama2-7b-chat-v1': {
                    inputTokenPrice: 0.00015,
                    outputTokenPrice: 0.0002,
                    currency: 'USD',
                    per: 1000
                },
                'ai21.j2-grande-instruct': {
                    inputTokenPrice: 0.0125,
                    outputTokenPrice: 0.0125,
                    currency: 'USD',
                    per: 1000
                },
                'ai21.j2-jumbo-instruct': {
                    inputTokenPrice: 0.015,
                    outputTokenPrice: 0.015,
                    currency: 'USD',
                    per: 1000
                },
                'stability.stable-diffusion-xl-v0': {
                    inputTokenPrice: 0.035,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 'image'
                },
                'stability.stable-diffusion-v1': {
                    inputTokenPrice: 0.02,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 'image'
                },
                'mistral.mistral-7b-instruct-v0:2': {
                    inputTokenPrice: 0.00015,
                    outputTokenPrice: 0.0002,
                    currency: 'USD',
                    per: 1000
                },
                // OpenAI GPT-OSS Pricing
                'openai.gpt-oss-120b-1:0': {
                    inputTokenPrice: 0.003,
                    outputTokenPrice: 0.015,
                    currency: 'USD',
                    per: 1000
                },
                'openai.gpt-oss-20b-1:0': {
                    inputTokenPrice: 0.0005,
                    outputTokenPrice: 0.0015,
                    currency: 'USD',
                    per: 1000
                },
                // Latest Anthropic Models Pricing
                'anthropic.claude-3-7-sonnet-20250219-v1:0': {
                    inputTokenPrice: 0.003,
                    outputTokenPrice: 0.015,
                    currency: 'USD',
                    per: 1000
                },
                'anthropic.claude-opus-4-1-20250805-v1:0': {
                    inputTokenPrice: 0.015,
                    outputTokenPrice: 0.075,
                    currency: 'USD',
                    per: 1000
                },
                'anthropic.claude-sonnet-4-20250514-v1:0': {
                    inputTokenPrice: 0.003,
                    outputTokenPrice: 0.015,
                    currency: 'USD',
                    per: 1000
                },
                // Latest Meta Llama Models Pricing
                'meta.llama3-1-8b-instruct-v1:0': {
                    inputTokenPrice: 0.0003,
                    outputTokenPrice: 0.0006,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama3-1-70b-instruct-v1:0': {
                    inputTokenPrice: 0.00265,
                    outputTokenPrice: 0.0035,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama3-1-405b-instruct-v1:0': {
                    inputTokenPrice: 0.00532,
                    outputTokenPrice: 0.016,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama3-2-1b-instruct-v1:0': {
                    inputTokenPrice: 0.0001,
                    outputTokenPrice: 0.0002,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama3-2-3b-instruct-v1:0': {
                    inputTokenPrice: 0.00015,
                    outputTokenPrice: 0.0003,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama3-2-11b-instruct-v1:0': {
                    inputTokenPrice: 0.00035,
                    outputTokenPrice: 0.0014,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama3-3-70b-instruct-v1:0': {
                    inputTokenPrice: 0.00265,
                    outputTokenPrice: 0.0035,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama4-maverick-17b-instruct-v1:0': {
                    inputTokenPrice: 0.0008,
                    outputTokenPrice: 0.0024,
                    currency: 'USD',
                    per: 1000
                },
                'meta.llama4-scout-17b-instruct-v1:0': {
                    inputTokenPrice: 0.0008,
                    outputTokenPrice: 0.0024,
                    currency: 'USD',
                    per: 1000
                },
                // AI21 Labs Jamba Models Pricing
                'ai21.jamba-1-5-large-v1:0': {
                    inputTokenPrice: 0.002,
                    outputTokenPrice: 0.008,
                    currency: 'USD',
                    per: 1000
                },
                'ai21.jamba-1-5-mini-v1:0': {
                    inputTokenPrice: 0.0002,
                    outputTokenPrice: 0.0004,
                    currency: 'USD',
                    per: 1000
                },
                // Latest Stability AI Models Pricing
                'stability.sd3-5-large-v1:0': {
                    inputTokenPrice: 0.065,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 'image'
                },
                'stability.stable-image-core-v1:1': {
                    inputTokenPrice: 0.03,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 'image'
                },
                'stability.stable-image-ultra-v1:1': {
                    inputTokenPrice: 0.04,
                    outputTokenPrice: 0,
                    currency: 'USD',
                    per: 'image'
                },
                // Mistral AI Latest Models Pricing
                'mistral.mistral-large-2402-v1:0': {
                    inputTokenPrice: 0.004,
                    outputTokenPrice: 0.012,
                    currency: 'USD',
                    per: 1000
                },
                'mistral.pixtral-large-2502-v1:0': {
                    inputTokenPrice: 0.003,
                    outputTokenPrice: 0.009,
                    currency: 'USD',
                    per: 1000
                },
                // DeepSeek Model Pricing
                'deepseek.r1-v1:0': {
                    inputTokenPrice: 0.0014,
                    outputTokenPrice: 0.0028,
                    currency: 'USD',
                    per: 1000
                },
                // Amazon Nova Premier and Sonic Pricing
                'amazon.nova-premier-v1:0': {
                    inputTokenPrice: 0.0008,
                    outputTokenPrice: 0.0032,
                    currency: 'USD',
                    per: 1000
                },
                'amazon.nova-sonic-v1:0': {
                    inputTokenPrice: 0.0002,
                    outputTokenPrice: 0.0008,
                    currency: 'USD',
                    per: 1000
                }
            }
        };
    }

    // データマージ
    mergeModelData(modelsData, pricingData) {
        return modelsData.models.map(model => ({
            ...model,
            pricing: pricingData.pricing[model.id] || {
                inputTokenPrice: 0,
                outputTokenPrice: 0,
                currency: 'USD',
                per: 1000
            },
            lastUpdated: new Date().toISOString()
        }));
    }

    // フォールバックデータ
    getFallbackModels() {
        return [
            {
                id: 'anthropic.claude-3-sonnet-20240229-v1:0',
                name: 'Claude 3 Sonnet',
                provider: 'Anthropic',
                type: 'text',
                features: {
                    textGeneration: true,
                    imageAnalysis: true,
                    embedding: false,
                    multiLanguage: true,
                    contextLength: 200000,
                    fineTuning: false
                },
                performance: {
                    speed: 'fast',
                    accuracy: 'high',
                    tokenThroughput: 1000
                },
                pricing: {
                    inputTokenPrice: 0.003,
                    outputTokenPrice: 0.015,
                    currency: 'USD',
                    per: 1000
                },
                lastUpdated: new Date().toISOString()
            }
        ];
    }
}