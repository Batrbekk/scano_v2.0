export type SiteConfig = {
  name: string
  author: string
  description: string
  keywords: Array<string>
  url: {
    base: string
    author: string
  }
  links: {
    github: string
  }
  ogImage: string
}

export type UserData = {
  created_at: string;
  updated_at: string;
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  admin_id: string;
  organization_id: string;
  company_name: string;
  photo_url: string;
  timezone: string;
  interface_language: string | null;
  themes: string[];
}

export type ThemeData = {
  created_at: string;
  updated_at: string;
  _id: string;
  name: string;
  group_id: string;
  user_id: string;
  organization_id: string | null;
  admin_id: string | null;
  keywords: Array<string>;
  minus_keywords: Array<string>;
  source_types: Array<string>;
  language: string;
  exclude_sources: Array<string>;
  theme_type: string;
  material_types: Array<string>;
  search_domains: Array<string>;
  tags: Array<string>;
  is_active: boolean;
  materials_count_percent: number;
  materials_count: number;
  materials_count_max: number;
  today: {
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  week: {
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  total: {
    positive: number;
    negative: number;
    neutral: number;
    total: number;
  };
  countries: Array<string>;
}