import { FAQ } from './../faq.model';

export class Tag {
  uuid?: string;
  name: string;
  faq: FAQ[]
}
