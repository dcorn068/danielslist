import Axios from 'axios';
import { detail as craigslistDetail } from 'craigslist-searcher';

// TODO: if corsLink => 429 too many requests, try a different cors proxy
// TODO: node server & front-end on heroku using npm-run-all
// TODO: letgo ottawa https://ca.letgo.com/en?searchTerm=hutch

const corsProxy = `https://cors-proxy-danielslist.herokuapp.com/`;

export const getKijiji = query => {
  return new Promise((resolve, reject) => {
    const corsLink = `${corsProxy}https://www.kijiji.ca/b-buy-sell/ontario/${
      query ? query : ''
    }/k0c10l9004`;

    Axios.get(
      // use a cors proxy instead of a server https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
      corsLink,
    ).then(response => {
      const imageDivArray = response.data.split(`<div class="image"`).slice(1);
      const imgArray = imageDivArray.map(s =>
        s.slice(s.indexOf('=') + 2, s.indexOf('" ')),
      );

      const titleArray = imageDivArray
        .map(s => s.slice(s.indexOf('alt="') + 5, s.indexOf('</div>')))
        .map(s => s.slice(0, s.indexOf('">')));

      const linksArray = response.data.split(`data-vip-url="`).map(s => {
        const query = s.slice(0, s.indexOf(`"`));
        return `https://www.kijiji.ca${query}`;
      });

      const kijijiItems = imgArray.map((img, idx) => {
        return {
          image: img,
          title: titleArray[idx],
          url: linksArray[idx],
          type: 'kijiji',
        };
      });
      // first item is always an ad
      console.log('Kijiji results:', kijijiItems);
      resolve(kijijiItems);
    });
  });
};

export const getCraigslist = query => {
  return new Promise((resolve, reject) => {
    const corsLink = `${corsProxy}https://ottawa.craigslist.org/search/sss?sort=date&query=${
      query ? query : ''
    }`;

    Axios.get(corsLink).then(async response => {
      const itemsArray = response.data
        .slice(response.data.indexOf(`<li class="result-row"`))
        .split(`<li class="result-row"`);

      const linksArray = itemsArray.map(item =>
        item.slice(
          item.indexOf(`<a href="`) + 9,
          item.indexOf(`" class="result-image`),
        ),
      );

      Promise.all(
        linksArray.map(async (link, idx) => {
          try {
            const detail = await craigslistDetail(
              `${corsProxy}` + (link || ''),
            );
            const nextItem = {
              image: detail.images ? detail.images[0] : null,
              title: detail.title,
              url: linksArray[idx],
              type: 'craigslist',
            };
            return nextItem;
          } catch (error) {
            console.warn(error);
          }
        }),
      ).then(craigslistItems => {
        console.log('Craigslist results:', craigslistItems);
        resolve(craigslistItems);
      });
      // {
      //   title: 'Item's title text,
      //   price: 'Item's price',
      //   location: 'Item's location',
      //   images: ['The first image url', 'The second image url', ...],
      //   latitude: 'Latitude', // Will return null if no latitude information
      //   longitude: 'Longitude', // Will return null if no longitude information
      //   accuracy: 'Location accuracy', // Will return null if no accuracy information
      //   googleMap: 'Google map's url', // Will return null if no Google map information
      //   description: 'Item's description',
      //   postedDate: 'Posted date and time',
      //   dataId: 'post id'
      // }
    });

    console.log('getting craigslist');
  });
};

export const getUsedottawa = query => {
  return new Promise((resolve, reject) => {
    const corsLink = `${corsProxy}https://www.usedottawa.com/classifieds/all?description=${
      query ? query : ''
    }`;
    Axios.get(corsLink).then(async response => {
      const itemsArray = response.data
        .slice(response.data.indexOf(`<div class="article"`))
        .split(`<div class="article"`)
        .slice(1);

      const linksEndsArray = itemsArray.map(
        item =>
          `${item.slice(item.indexOf(`<a href="`) + 9, item.indexOf(`" ><`))}`,
      );
      const linksArray = linksEndsArray.map(
        end => `https://www.usedottawa.com${end}`,
      );
      const imgArray = itemsArray.map(item =>
        item.slice(item.indexOf(`<img src="`) + 10, item.indexOf(`" alt="`)),
      );
      const titleArray = itemsArray.map(item =>
        item.slice(
          item.indexOf(`itemprop="description">`) + 23,
          item.indexOf(`</p> <div class="property"`),
        ),
      );
      const usedOttawaItems = imgArray.map((img, idx) => {
        return {
          image: img,
          title: titleArray[idx],
          url: linksArray[idx],
          type: 'usedottawa',
        };
      });

      console.log('Used Ottawa results:', usedOttawaItems);
      resolve(usedOttawaItems);
    });

    console.log('getting usedottawa');
  });
};

export const getLetgo = query => {
  return new Promise((resolve, reject) => {
    const corsLink = `${corsProxy}https://ca.letgo.com/en?searchTerm=${
      query ? query : ''
    }`;
    Axios.get(corsLink).then(async response => {
      const itemsArray = response.data
        .slice(response.data.indexOf(`FeedListstyles__FeedListContainer`))
        .split(`FeedListstyles__FeedCardItem`)
        .slice(2);

      const linksArray = itemsArray.map(
        item =>
          `https://ca.letgo.com${item.slice(
            item.indexOf(`<a href="`) + 9,
            item.indexOf(`" title="`),
          )}`,
      );
      const imgArray = itemsArray.map(item =>
        item.slice(item.indexOf(`<img src="`) + 10, item.indexOf(`" alt="`)),
      );
      const titleArray = itemsArray.map(item =>
        item.slice(item.indexOf(`" title="`) + 9, item.indexOf(`"><img src="`)),
      );
      const letgoItems = imgArray.map((img, idx) => {
        return {
          image: img,
          title: titleArray[idx],
          url: linksArray[idx],
          type: 'letgo',
        };
      });

      console.log('Letgo results:', letgoItems);
      resolve(letgoItems);
    });

    console.log('getting letgo');
  });
};