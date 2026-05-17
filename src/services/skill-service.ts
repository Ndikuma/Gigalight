'use client';

import { api } from '@/lib/api-client';
import { Skill, PaginatedList } from '@/lib/types';

/**
 * @fileOverview Expertise Taxonomy and Skill Definition Services.
 */

export const SkillService = {
  async listSkills(params?: any) {
    const query = new URLSearchParams(params).toString();
    return api.get<PaginatedList<Skill>>(`/skills/${query ? '?' + query : ''}`);
  },

  async getSkillCategories() {
    return api.get<Skill[]>('/skills/categories/');
  },

  async getTrendingSkills() {
    return api.get<Skill[]>('/skills/trending/');
  },

  async getVerifiedSkills() {
    return api.get<Skill[]>('/skills/verified/');
  }
};
