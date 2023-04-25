import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetImagePipe } from './get-image.pipe';



@NgModule({
  declarations: [GetImagePipe],
  imports: [
    CommonModule
  ],
  exports: [GetImagePipe]
})
export class GetImageModule { }
