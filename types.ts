import React from 'react';

export enum Language {
  EN = 'EN',
  DE = 'DE'
}

export type DetailSection = 
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  specs?: Record<string, string>;
  image: string;
  details?: DetailSection[];
}

export interface RoadmapItem {
  year: string;
  milestone: string;
  status: 'completed' | 'ongoing' | 'planned';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
}

export interface NewsArticle {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  category: string;
}

export interface JourneyMilestone {
  year: string;
  title: string;
  content: string;
  tag: string;
  stats: string;
  icon: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'Product' | 'News' | 'Career' | 'Tech';
  page: string;
}

// Augment React's JSX namespace
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        icon?: string;
        width?: string | number;
        height?: string | number;
        class?: string;
        [key: string]: any;
      };
    }
  }
}

// Augment global JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        icon?: string;
        width?: string | number;
        height?: string | number;
        class?: string;
        [key: string]: any;
      };
    }
  }
}