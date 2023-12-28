export interface FaqKb {
    _id?: string;
    updatedAt?: Date;
    createdAt?: Date;
    name?: string;
    url?: string;
    webhook_enabled?: boolean;
    webhook_url?: string;
    kbkey_remote?: string;
    id_project?: string;
    createdBy?: string;
    __v?: any;
    has_faq?: any;
    faqs_number?: number;
    external?: boolean;
    type?: string;
    description?: string;
    message_count?: number;
    mainCategory?: string
    language?: string;
    trashed?: boolean;
  
}

export interface Chatbot extends FaqKb {
    attributes?: any
    public?: boolean;
    certified?: boolean;
    tags?: any;
    title?: string;
    short_description?: string;
    certifiedTags?: Array<{color: string, name: string}>;
    intentsEngine?: 'none' | 'tiledesk-ai'
}