import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@/shared/shared.module';
import { AccountModule } from '../../account.module';
import { MaterialModule } from '@/shared/material.module';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [ ReactiveFormsModule, MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should return the form control values set in the form', () => {
    component.profileForm.controls.UserName.setValue("Mgun");
    component.profileForm.controls.Email.setValue("gunnermad59@hotmail.com");

    let profile = component.saveProfile();
  })

});
