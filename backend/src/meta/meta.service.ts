import { Injectable } from '@nestjs/common';

@Injectable()
export class MetaService {
  listTimezones(): string[] {
    // Minimal static list; can be expanded or sourced from Intl API
    return ['UTC', 'Asia/Riyadh', 'Asia/Dubai', 'Asia/Amman', 'Europe/London'];
  }

  listLocales(): string[] {
    return ['ar-SA', 'ar-AE', 'ar-JO', 'en-US', 'en-GB'];
  }
}
