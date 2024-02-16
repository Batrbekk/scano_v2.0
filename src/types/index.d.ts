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