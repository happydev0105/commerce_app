/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Commerce } from 'src/app/core/models/commerce/commerce.model';
import { BillingService } from 'src/app/core/services/billing/billing.service';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-test-billing',
  templateUrl: './test-billing.page.html',
  styleUrls: ['./test-billing.page.scss'],
})
export class TestBillingPage implements OnInit {

  currentCommerce: Commerce;

  constructor(private billingService: BillingService) {
    this.currentCommerce = JSON.parse(localStorage.getItem('currentCommerce'));
  }

  ngOnInit() {
  }

  generateBilling() {
    this.billingService.getBillingMonthlyByCommerce(this.currentCommerce.uuid).subscribe(response => {
      if (response) {
        const commerce = response.commerce;
        const employee = response.owner;
        const subscription = response.subscription;
        const totalAmount = subscription.amount + (subscription.decimals / 100);
        const iva = 21;
        const totalAmountWithoutIVA = (totalAmount * ((100 - iva) / 100)).toFixed(2);
        const totalIVA = (totalAmount * (iva / 100)).toFixed(2);
        const issueDate = format(new Date(subscription.startsAt), "dd 'de' MMMM 'de' yyyy", { locale: es });

        const doc = new jsPDF();
        const img = new Image();
        img.src = 'assets/icon/LogoFinalYeasy.png';
        doc.addImage(img, 'PNG', 5, 5, 50, 20);

        // Datos del dueño del negocio
        doc.setFontSize(10);
        doc.setFont('Helvetica', 'bold');
        doc.text('Cliente', 10, 35);

        doc.setFont('Helvetica', '');
        doc.text(`${employee.name} ${employee.surname}`, 10, 40);
        doc.text(`${commerce.address}`, 10, 45);
        doc.text(`${commerce.postCode} ${commerce.province}`, 10, 50);
        doc.text(`CIF/NIF: ${commerce.nif}`, 10, 55);

        // Factura
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'bold');
        doc.text('Factura', 180, 30, null, null);

        // Datos de Yeasy
        doc.setFont('Helvetica', '');
        doc.setFontSize(10);
        doc.text('Yeasy S.L', 160, 40, null, null);
        doc.text('Calle Alcalá, 123', 160, 45, null, null);
        doc.text('28009 Madrid', 160, 50, null, null);
        doc.text('911234567', 160, 55, null, null);
        doc.text('B84749345', 160, 60, null, null);
        doc.text('yeasyapp@gmail.com', 160, 65, null, null);

        // Número de factura, fecha de emisión, forma de pago y condición de pago
        doc.text('Nº factura', 10, 80, null, null);
        doc.text(`Yeasy_RCPT_${subscription.uuid}`, 70, 80, null, null); // añadir nº factura autoincremental

        doc.text('Fecha emisión documento', 10, 85, null, null);
        doc.text(`${issueDate}`, 70, 85, null, null);

        // Siempre es así
        doc.text('Forma de pago', 10, 90, null, null);
        doc.text('Tarjeta', 70, 90, null, null);

        // Siempre es así
        doc.text('Condiciones de pago', 10, 95, null, null);
        doc.text('Pagado', 70, 95, null, null);

        // Tabla con el contenido de la factura
        doc.setFontSize(10);
        doc.setFont('Helvetica', 'bold');
        doc.text('Descripción', 10, 120);
        doc.text('Cantidad', 70, 120, null, null);
        doc.text('Precio\nUnitario', 90, 120, null, null);
        doc.text('Importe\nNeto', 110, 120, null, null);
        doc.text('Importe\ndel IVA', 130, 120, null, null);
        doc.text('% IVA', 150, 120, null, null);
        doc.text('Importe línea incl.\nIVA', 170, 120, null, null);

        doc.line(10, 125, 200, 125);

        doc.setFont('Helvetica', '');
        doc.text(`${subscription.name}`, 10, 135);
        doc.text('1', 70, 135, null, null);
        doc.text(`Período de facturación:\n ${format(new Date(subscription.startsAt), 'dd.MM.yyyy')} - ${format(new Date(subscription.expiresAt), 'dd.MM.yyyy')}`, 10, 140, null, null);
        doc.text(`${totalAmountWithoutIVA}`, 90, 135, null, null);
        doc.text(`${totalAmountWithoutIVA}`, 110, 135, null, null);
        doc.text(`${totalIVA}`, 130, 135, null, null);
        doc.text(`${iva}`, 150, 135, null, null);
        doc.text(`${totalAmount}`, 170, 135, null, null);

        // calcular precios con iva y sin iva
        doc.setFont('Helvetica', 'bold');
        doc.text('Total EUR con IVA', 120, 160, null, null);
        doc.setFont('Helvetica', '');
        doc.text('Importe IVA', 120, 165, null, null);
        doc.setFont('Helvetica', 'bold');
        doc.text('Total EUR sin IVA', 120, 170, null, null);

        doc.line(160, 157, 190, 157);
        doc.text(`${totalAmount}`, 170, 160, null, null);
        doc.line(160, 161, 190, 161);

        doc.setFont('Helvetica', '');
        doc.text(`${totalIVA}`, 170, 165, null, null);
        doc.setFont('Helvetica', 'bold');
        doc.text(`${totalAmountWithoutIVA}`, 170, 170, null, null);

        doc.text('Especificación importe IVA', 10, 190);
        doc.text('% IVA', 20, 195);
        doc.text('Base IVA', 40, 195);
        doc.text('Importe IVA', 70, 195);
        doc.line(10, 197, 90, 197);
        doc.setFont('Helvetica', '');
        doc.text(`${iva}`, 25, 201);
        doc.text(`${totalAmountWithoutIVA}`, 45, 201);
        doc.text(`${totalIVA}`, 80, 201);

        // Guardamos el PDF
        doc.save(`factura_yeasy_RCPT_${subscription.uuid}.pdf`);
      }
    });
  }

}
