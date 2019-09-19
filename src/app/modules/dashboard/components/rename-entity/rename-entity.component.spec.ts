import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameEntityComponent } from './rename-entity.component';

describe('RenameEntityComponent', () => {
  let component: RenameEntityComponent;
  let fixture: ComponentFixture<RenameEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
