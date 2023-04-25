import { FAQCategory } from "./faq-category/faq-category.model";
import { Tag } from "./tag/tag.model";

export class FAQ {
  uuid: string;
  topic: string;
  content: string;
  category: FAQCategory[];
  tag: Tag[]
  createdAt: Date;
  updatedAt: Date;
}
