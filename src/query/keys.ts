export const qk = {
  profile: (userId: string | undefined | null) => ['profile', userId] as const,
  templates: () => ['templates'] as const,
  activities: () => ['activities'] as const,
  skillsByCategory: (category: string) => ['skills', category] as const,
};
