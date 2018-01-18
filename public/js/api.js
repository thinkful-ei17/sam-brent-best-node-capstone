/* global $ */
'use strict';

class Api {

  constructor(path, baseUrl = window.location.origin) {
    this.baseUrl = baseUrl;
    this.path = path;
  }

  _buildUrl(path, query = {}) {
    const url = new URL(path, this.baseUrl);

    const queryKeys = Object.keys(query);
    queryKeys.forEach(key => url.searchParams.set(key, query[key]));
    console.log(url);
    return url;
  }

  search(query = {}) {
    const url = this._buildUrl('/users', query);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json());
  }


}