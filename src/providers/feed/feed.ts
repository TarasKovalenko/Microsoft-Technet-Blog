import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

export class FeedItem {
  description: string;
  link: string;
  title: string;

  constructor(description: string, link: string, title: string) {
    this.description = description;
    this.link = link;
    this.title = title;
  }
}

export class Feed {
  title: string;
  url: string;

  constructor(title: string, url: string) {
    this.title = title;
    this.url = url;
  }
}

@Injectable()
export class FeedProvider {

  constructor(private http: Http,
              public storage: Storage) {
  }

  public getSavedFeeds(): Promise<any> {
    return this.storage.get('savedFeeds').then(data => {
      return data !== null && data !== undefined ? JSON.parse(data) : [];
    });
  }

  public addFeed(newFeed: Feed): Promise<any> {
    return this.getSavedFeeds().then(arrayOfFeeds => {
      arrayOfFeeds.push(newFeed);
      let jsonString = JSON.stringify(arrayOfFeeds);
      return this.storage.set('savedFeeds', jsonString);
    });
  }

  public getArticlesForUrl(feedUrl: string): Observable<FeedItem[]> {
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22' + encodeURIComponent(feedUrl) + '%22&format=json';
    let articles = [];
    return this.http.get(url)
      .map(data => data.json()['query']['results'])
      .map((res) => {
        if (res == null) {
          return articles;
        }
        let objects = res['item'];
        const length = 20;

        for (let i = 0; i < objects.length; i++) {
          let item = objects[i];
          let trimmedDescription = item.description.length > length ?
            item.description.substring(0, 80) + "..." : item.description;

          let newFeedItem = new FeedItem(trimmedDescription, item.link, item.title);
          articles.push(newFeedItem);
        }
        return articles
      })
  }
}
