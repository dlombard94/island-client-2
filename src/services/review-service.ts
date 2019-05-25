import {inject, Aurelia} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';
import {Island, Review, Location} from "./poi-types";
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TotalUpdate, IslandLocation} from "./messages";
import {log} from "util";


@inject(HttpClient, EventAggregator, Aurelia, Router)
export class ReviewService {
  islands : Island[] = [];
  reviews: Review[] =[];
  bestForOptions =   ['Poor','Below Average', 'Average', 'Above Average', 'Excellent'];
  total = this.reviews.length;

  constructor(
    private httpClient: HttpClient,
    private ea: EventAggregator,
    private au: Aurelia,
    private router: Router
  ) {
    httpClient.configure(http => {
      http.withBaseUrl('http://dlombard:3000');
    });
  }

  async getIslands() {
    const response = await this.httpClient.get('/api/islands');
    this.islands = await response.content;
    console.log (this.islands);
  }

  async createIsland(name: string, area: number, category: string, description: string, location: Location) {
    const island = {
      name: name,
      area: area,
      category: category,
      description: description
    };
    const islandLocation = {

      lat: location.lat,
      lng: location.lng
    };
    const response = await this.httpClient.post('/api/islands', island);
    const newIsland = await response.content;
    this.islands.push(newIsland);
    this.ea.publish(new IslandLocation(islandLocation));
    console.log('New Island Added at lat: ' + islandLocation.lat + ', lng: ' + islandLocation.lng);

  }

  async review( review: string, bestFor: string, island: Island) {
    const islandReview = {
      review: review,
      bestFor: bestFor,
      island : island
    };

    const response = await this.httpClient.post('/api/islands/' + island._id + '/reviews', islandReview);
    this.reviews.push(islandReview);
    this.total = this.total + 1;
    this.ea.publish(new TotalUpdate(this.total));
    console.log('Number of Reviews' + this.total);
  }

  // async getReviews() {
  //   const response = await this.httpClient.get('/api/reviews');
  //   const rawReviews: RawReview[] = await response.content;
  //   rawReviews.forEach(rawReview => {
  //     const review = {
  //       review: rawReview.review,
  //       bestFor : rawReview.bestFor,
  //       //island is returning undefined for some reason?????????????????
  //       island :this.islands.find(island => rawReview.island == island._id),
  //       reviewer: this.usersById.get(rawReview.reviewer)
  //     }
  //     this.reviews.push(review);
  //   });
  // }

  async signup(firstName: string, lastName: string, email: string, password: string) {
    const user = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };
    const response = await this.httpClient.post('/api/users', user);
    const newUser = await response.content;
    this.changeRouter(PLATFORM.moduleName('app'))
    return false;
  }

  async login(email: string, password: string) {
    const response = await this.httpClient.post('/api/users/authenticate', {
      email: email,
      password: password
    });
    const status = await response.content;
    if (status.success) {
      this.httpClient.configure(configuration => {
        configuration.withHeader('Authorization', 'bearer ' + status.token);
      });
      localStorage.review = JSON.stringify(response.content);
      await this.getIslands();
      this.changeRouter(PLATFORM.moduleName('app'));
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.review = null;
    this.httpClient.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
    this.changeRouter(PLATFORM.moduleName('start'));
  }

  checkIsAuthenticated() {
    let authenticated = false;
    if (localStorage.review !== 'null') {
      authenticated = true;
      this.httpClient.configure(http => {
        const auth = JSON.parse(localStorage.review);
        http.withHeader('Authorization', 'bearer ' + auth.token);
      });
      this.changeRouter(PLATFORM.moduleName('app'));
    }
  }

  changeRouter(module:string) {
    this.router.navigate('/', { replace: true, trigger: false });
    this.router.reset();
    this.au.setRoot(PLATFORM.moduleName(module));
  }

}
