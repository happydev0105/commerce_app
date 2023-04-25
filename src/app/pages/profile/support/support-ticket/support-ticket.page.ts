/* eslint-disable max-len */
import { NavController } from '@ionic/angular';
import { TicketComment } from './../../../../core/models/comment/comment.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ticket } from 'src/app/core/models/ticket/ticket.model';
import { Router } from '@angular/router';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { TicketStatus } from 'src/app/core/models/enums/ticket-status.enum';
import { SupportService } from 'src/app/core/services/support/support.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.page.html',
  styleUrls: ['./support-ticket.page.scss'],
})
export class SupportTicketPage implements OnInit, OnDestroy {

  title = 'Crear nuevo chat';
  isNew = true;
  currentTicket: Ticket;
  ticketForm: FormGroup;
  commentContent = '';
  commerceLogged: string;

  typeCollection = [
    {
      label: 'general'
    },
    {
      label: 'fallo en la aplicación'
    },
    {
      label: 'otro'
    }
  ];

  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private supportService: SupportService,
    private navCtrl: NavController) {
    this.initForms();
    this.commerceLogged = JSON.parse(localStorage.getItem('currentUser')).commerce;
    if (this.router.getCurrentNavigation().extras.state) {
      this.currentTicket = this.router.getCurrentNavigation().extras.state.ticket;
      this.title = 'Gestionar chat';
      this.isNew = false;
      this.initForms();
    }
  }


  get type() {
    return this.ticketForm.get('type');
  }

  get description() {
    return this.ticketForm.get('description');
  }


  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ngOnInit() {

  }

  ionViewWillEnter() {

  }

  initForms() {
    this.ticketForm = this.formBuilder.group({
      type: [{ value: this.currentTicket ? this.currentTicket.type : '', disabled: this.currentTicket }, Validators.required],
      description: [{ value: this.currentTicket ? this.currentTicket.description : '', disabled: this.currentTicket }, Validators.required]
    });
  }

  saveTicket() {
    const newTicket = this.createTicket();
    this.subscription.add(this.supportService.createNewTicket(newTicket).subscribe(response => {
      if (response) {
        this.isNew = false;
        this.title = 'Gestionar chat';
        this.currentTicket = response;
        this.type.disable({ onlySelf: true });
        this.description.disable({ onlySelf: true });
        const newTicketComment = this.createDefaultSupportCommentTicket();
        this.sendComment(newTicketComment);
      }
    }));
  }

  createComment() {
    const newComment: TicketComment = new TicketComment();
    newComment.content = this.commentContent;
    newComment.from = 'commerce';
    newComment.ticket = this.currentTicket.uuid;
    newComment.createdAt = new Date();
    newComment.updatedAt = new Date();

    this.sendComment(newComment);
  }

  sendComment(newComment: TicketComment) {
    this.subscription.add(this.supportService.createNewComment(newComment).subscribe(
      response => {
        if (response) {
          this.currentTicket.comments.push(response);
          this.commentContent = '';
        }
      }
    ));
  }

  createTicket(): Ticket {
    const newTicket: Ticket = new Ticket();
    newTicket.commerce = this.commerceLogged;
    newTicket.type = this.type.value;
    newTicket.description = this.description.value;
    newTicket.status = TicketStatus.PENDING;
    newTicket.comments = [];
    newTicket.createdAt = new Date();
    newTicket.updatedAt = new Date();

    return newTicket;
  }

  createDefaultSupportCommentTicket(): TicketComment {
    const defaultSupportCommentTicket: TicketComment = new TicketComment();
    defaultSupportCommentTicket.content = 'Buenas, gracias por contactar con el servicio técnico. Nos pondremos en contacto contigo mediante este chat con la mayor brevedad posible. Gracias';
    defaultSupportCommentTicket.from = 'manager';
    defaultSupportCommentTicket.ticket = this.currentTicket.uuid;
    defaultSupportCommentTicket.createdAt = new Date();
    defaultSupportCommentTicket.updatedAt = new Date();
    return defaultSupportCommentTicket;
  }

  cancel() {
    this.navCtrl.navigateBack(['tabs/profile/support'], { replaceUrl: true });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
