import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationRoomComponent } from './conversation-room.component';

describe('ConversationRoomComponent', () => {
  let component: ConversationRoomComponent;
  let fixture: ComponentFixture<ConversationRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
