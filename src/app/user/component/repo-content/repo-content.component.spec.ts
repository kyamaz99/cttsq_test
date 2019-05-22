import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoContentComponent } from './repo-content.component';

describe('RepoContentComponent', () => {
  let component: RepoContentComponent;
  let fixture: ComponentFixture<RepoContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepoContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
