import { TestBed } from '@angular/core/testing';
import { provideToastr } from 'ngx-toastr';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideToastr()],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extract message from HttpErrorResponse body', () => {
    const spy = vi.spyOn(service, 'error');
    service.fromHttpError(
      new HttpErrorResponse({
        status: 400,
        error: { message: 'Email invalide' },
      }),
    );
    expect(spy).toHaveBeenCalledWith('Email invalide');
  });
});
