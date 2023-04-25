import { FAQCategory } from './faq-category/faq-category.model';
import { Tag } from './tag/tag.model';
export class FAQDto {
  uuid?: string;
  topic: string;
  content: string;
  category: FAQCategory[];
  tags: Tag[]
  createdAt: Date;
  updatedAt: Date;
}
