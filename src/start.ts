import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { ReviewService } from './services/review-service';

@inject(ReviewService)
export class Start {
  router: Router;
  constructor(private rs: ReviewService) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      {
        route: ['', 'login'],
        name: 'Login',
        moduleId: PLATFORM.moduleName('views/login'),
        nav: true,
        title: 'Login'
      },
      {
        route: 'signup',
        name: 'signup',
        moduleId: PLATFORM.moduleName('views/signup'),
        nav: true,
        title: 'Sign-up'
      }
    ]);
    this.router = router;
  }

  attached() {
    this.rs.checkIsAuthenticated();
  }
}
