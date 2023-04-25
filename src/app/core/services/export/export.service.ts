import { Injectable } from '@angular/core';
import * as Excel from 'exceljs';
import * as FileSaver from 'file-saver';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { ToastService } from '../toast/toast.service';
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private toastService: ToastService,) { }

  async createNewExcel(json: any[]) {

    const workbook = new Excel.Workbook();
    // add a worksheet to the workbook, and populate it with the JSON data
    const worksheet = workbook.addWorksheet('Sheet1');

    const keys = json.map(object => Object.keys(object));
    worksheet.addRow(keys[0]);

    for (const x1 of json) {
      const x2 = Object.keys(x1);
      const temp: any = [];
      for (const y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    workbook.xlsx.writeBuffer().then(async (data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      this.blobToBase64(blob, this.writeFile);
    });
  }
  async writeFile(str) {
    await Filesystem.writeFile({
      path: `yeasy-extracto-${new Date().getTime()}.xlsx`,
      data: str,
      directory: Directory.Documents
    });
  }
  blobToBase64(blob, callback) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = (dataUrl as string).split(',')[1];
      callback(base64);
    };
    reader.onloadend = () => {
      this.toastService.presentToast('Archivo guardado correctamente en los "Documentos" de su dispositivo', true);
    };
    reader.onerror = () => {
      this.toastService.presentToast('Ha habido un error en el proceso', false);
    };
    reader.readAsDataURL(blob);
  };
  blobToSaveAs(fileName: string, blob: Blob) {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);

        link.click();
        window.open(url, '_blank');
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error('BlobToSaveAs error', e);
    }
  }
}
