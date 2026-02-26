import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AdminAppComponent } from './app.component';
import { routes } from './app.routes';

bootstrapApplication(AdminAppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});
