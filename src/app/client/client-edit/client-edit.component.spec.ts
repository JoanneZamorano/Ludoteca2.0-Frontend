import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientEditComponent } from './client-edit.component';

describe('ClientEdit', () => {
  let component: ClientEditComponent;
  let fixture: ComponentFixture<ClientEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
