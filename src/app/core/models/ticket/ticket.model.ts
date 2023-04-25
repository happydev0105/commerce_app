import { TicketComment } from "../comment/comment.model";
import { TicketStatus } from "../enums/ticket-status.enum";

export class Ticket {
  uuid?: string;
  type: string;
  description: string;
  commerce: string;
  status: TicketStatus;
  comments: TicketComment[];
  createdAt: Date;
  updatedAt: Date;
}
