import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
// import { AccountService } from '../../services/account.service';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@/reducers';

import * as account from '@/modules/account/store/actions/account.actions';


@Component({
  selector: 'picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.less']
})
export class PictureComponent implements OnInit, OnDestroy {
  public isProfileImageSet: boolean = false;
  public accountPictureForm: FormGroup;
  private subscription: Subscription = new Subscription();
  public imageConfig: object;
  public backgroundImage: SafeStyle;
  public fileSet: boolean = false;
  public fileType: string;
  public imageChangedEvent: any = '';
  public croppedImage: SafeStyle;
  
  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private toastrService: ToastrService, private store$: Store<AppState>) {} //private accountService: AccountService
  @ViewChild(ImageCropperComponent, { static: false }) imageCropper: ImageCropperComponent;
  @ViewChild('uploader', { static: true }) fileInput: ElementRef;
  @Output() saveFormData: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit() {
    this.accountPictureForm = this.formBuilder.group({
      Avatar: ['']
    })
  }
  public setImage(event: any): void {
    
    const file = <File>event.target.files[0];
    if (file) {

      if (file.size / 1000000 >= 5) {
        this.toastrService.warning('Your image exceeds the 5MB file limit. Please select another file.');
        return;
      }

      this.fileType = file.type.split('/').pop();

      if (this.fileType === 'png' || this.fileType === 'jpeg') {
        this.fileSet = true;
        
        this.imageChangedEvent = event;

      } else {
        this.toastrService.warning(`${this.fileType} files are not allowed.`);
      }
    } 
  }

  public saveImage() {
    const image = this.accountPictureForm.controls['Avatar'].value;
    this.store$.dispatch(new account.UpdatePictureAction({ picture: image }));
    this.fileSet = false;
    this.croppedImage = null;
  }

  removeImage(event: any): void {
    this.croppedImage = '';
    this.imageChangedEvent = '';
    this.fileInput.nativeElement.value = "";
    this.fileSet = false;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.accountPictureForm.get('Avatar').setValue(event.base64);
  }

  imageLoaded(event: any) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed(event: any) {
    console.log(event)
    // show message
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }
  
}
