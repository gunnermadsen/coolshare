import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityInfoDialogComponent } from './entity-info-dialog.component';

describe('EntityInfoDialogComponent', () => {
  let component: EntityInfoDialogComponent;
  let fixture: ComponentFixture<EntityInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
