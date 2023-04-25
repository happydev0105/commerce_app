/* eslint-disable max-len */
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { map, Observable, Subscription } from 'rxjs';
import { CustomerNoteDto } from 'src/app/core/dto/customer-notes/customer-notes.dto';
import { DeleteResult } from 'src/app/core/interfaces/delete-results.interface';
import { CustomerNote } from 'src/app/core/models/customer-notes/customer-notes.model';
import { Employee } from 'src/app/core/models/employee/employee.model';
import { CustomerNotesService } from 'src/app/core/services/customer-notes/customer-notes.service';

@Component({
  selector: 'app-customer-notes',
  templateUrl: './customer-notes.page.html',
  styleUrls: ['./customer-notes.page.scss'],
})
export class CustomerNotesPage {
  public customerNotes: Observable<CustomerNote[]>;
  commerceLogged: string;
  employeeLogged: Employee;
  subscription: Subscription = new Subscription();
  id: string;
  isEdit = false;
  customerNote: CustomerNote;
  constructor(
    private customerNoteService: CustomerNotesService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute) {
    this.employeeLogged = JSON.parse(localStorage.getItem('currentUser'));
    this.commerceLogged = this.employeeLogged.commerce;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }

  ionViewWillEnter(): void {
    this.getParam();
  }

  getParam() {
    if (this.activatedRoute.snapshot.params.id) {
      this.subscription.add(this.activatedRoute.params.subscribe((res: Params) => {
        this.id = res.id;
        this.customerNotes = this.getCustomerNotes(this.commerceLogged, this.id);
      }));
    }
  }

  async addNote(customerNote?: CustomerNote) {
    if (customerNote) {
      this.isEdit = true;
      this.customerNote = customerNote;
    }
    const alert = await this.alertController.create({
      header: 'Nota de cliente',
      buttons: [{
        text: 'Guardar',
        handler: (data: string[]) => {
       
          if(data[0].length > 0){
            this.saveNote(data);
          }

        }
      }],
      inputs: [
        {
          value: customerNote ? customerNote.note : '',
          type: 'textarea',
          attributes: {
            minlength: 1,
            maxlength: 250,
            rows: 8,
            autoGrow: true
          },
          placeholder: 'Escriba una nota...',
        }
      ]
    });
    await alert.present();
  }

  saveNote(note: string[]) {
    const dto: CustomerNoteDto = this.buildNoteDto(note, this.employeeLogged.uuid, this.commerceLogged, this.id);
    if (this.isEdit) {
      dto.uuid = this.customerNote.uuid;
    }
    this.customerNoteService.createNote(dto).subscribe((res: CustomerNote) => {
      this.customerNotes = this.getCustomerNotes(this.commerceLogged, this.id);
      this.isEdit = false;
    });
  }

  async presentRemoveAlert(note: CustomerNote) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar la nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'ok',
          handler: () => {
            this.removeNote(note);
          }
        }
      ]
    });
    await alert.present();
  }

  removeNote(note: CustomerNote): void {
    this.customerNoteService.removeNote(note.uuid).subscribe((res: DeleteResult) => {
      this.customerNotes = this.getCustomerNotes(this.commerceLogged, this.id);
    });
  }

  buildNoteDto(note: string[], author: string, commerce: string, customer: string): CustomerNoteDto {
    const newDto = new CustomerNoteDto();
    newDto.note = note[0];
    newDto.author = author;
    newDto.customer = customer;
    newDto.commerce = commerce;
    return newDto;
  }

  private getCustomerNotes(commerce: string, customer: string): Observable<CustomerNote[]> {
    return this.customerNoteService.getAllCustomerNote(commerce, customer);
  }

}
