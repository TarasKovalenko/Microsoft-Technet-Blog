import {Component, ViewChild} from '@angular/core';
import {NavController, AlertController, Nav, IonicPage} from 'ionic-angular';

import {FeedProvider, Feed} from '../../providers/feed/feed';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // docs: https://ionicframework.com/docs/components/#avatar-list

  @ViewChild(Nav) nav: Nav;

  rootPage = 'FeedListPage';
  feeds: Feed[];

  constructor(private navController: NavController, private feedProvider: FeedProvider, public alertCtrl: AlertController) {
  }

  public addFeed() {
    let prompt = this.alertCtrl.create({
      title: 'Add Feed URL',
      inputs: [
        {
          name: 'name',
          placeholder: 'The best Feed ever'
        },
        {
          name: 'url',
          placeholder: 'http://www.myfeedurl.com/feed'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: data => {
            let newFeed = new Feed(data.name, data.url);
            this.feedProvider.addFeed(newFeed).then(
              res => {
                this.loadFeeds();
              }
            );
          }
        }
      ]
    });
    prompt.present();
  }

  private loadFeeds() {
    this.feedProvider.getSavedFeeds().then(
      allFeeds => {
        this.feeds = allFeeds;
      });
  }

  public openFeed(feed: Feed) {
    this.nav.setRoot('FeedListPage', {'selectedFeed': feed});
  }

  public ionViewWillEnter() {
    this.loadFeeds();
  }

}
