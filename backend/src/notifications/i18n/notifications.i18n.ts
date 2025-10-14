export const NOTIFICATION_TEMPLATES = {
  post_scheduled: {
    title: {
      en: 'Post Scheduled',
      ar: 'تم جدولة المنشور',
      tr: 'Gönderi Zamanlandı',
    },
    message: {
      en: 'Your post will be published on {platform} at {scheduledAt}.',
      ar: 'سيتم نشر منشورك على {platform} في {scheduledAt}.',
      tr: '{platform} üzerinde gönderiniz {scheduledAt} tarihinde yayınlanacak.',
    },
  },
  publish_failed: {
    title: {
      en: 'Publish Failed',
      ar: 'فشل النشر',
      tr: 'Yayın Başarısız',
    },
    message: {
      en: 'Failed to publish post: {error}',
      ar: 'فشل نشر المنشور: {error}',
      tr: 'Gönderi yayınlanamadı: {error}',
    },
  },
};
