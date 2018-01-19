/* global $ */
'use strict';

class Api {

  constructor(path, baseUrl = window.location.origin) {
    this.baseUrl = baseUrl;
  }

  _buildUrl(path, query = {}) {
    const url = new URL(path, this.baseUrl);

    const queryKeys = Object.keys(query);
    queryKeys.forEach(key => url.searchParams.set(key, query[key]));
    console.log(url);
    return url;
  }

  searchAll(query = {}) {
    const url = this._buildUrl('/users', query);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json());
  }

  searchOne(id, query = {}) {
    const url = this._buildUrl(`/users/${id}`, query);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json());
  }

  details(id, wishlist_id){
    const url = this._buildUrl(`/users/${id}/wishlist/${wishlist_id}`);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json());
  }

  create(user) {
    const url = this._buildUrl('/users');

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: user ? JSON.stringify(user) : null
    }).then(res => res.json());
  }

  createWishlistEntry(id, restaurant){
    const url = this._buildUrl(`/restaurants/${restaurant.place_id}`);
    
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: restaurant ? JSON.stringify(restaurant) : null
    }).then(res => res.json())
      .then(restaurant => {
        const url = this._buildUrl(`/users/${id}/wishlist/${restaurant._id}`);
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: restaurant ? JSON.stringify(restaurant) : null
        });
      }).then(res => res.json());
  }
  
  updateWishlistEntry(id, wishlist_id, entry) {
    const url = this._buildUrl(`/users/${id}/wishlist/${wishlist_id}`);

    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: entry ? JSON.stringify(entry) : null
    }).then(res => res.json());
  }
  
  removeUser(id) {
    const url = this._buildUrl(`users/${id}`);

    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.text());
  }

  removeWishlistEntry(id, entry) {
    const url = this._buildUrl(`/users/${id}/wishlist/${entry}`);
    
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.text());
  }

  // createWishlistEntry(id, restaurant){
  //   const url1 = this._buildUrl(`users/restaurants/${restaurant.place_id}`);
  //   const url2 = this._buildUrl(`/users/${id}`);

  //   return fetch(url1, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json'
  //     },
  //     body: restaurant ? JSON.stringify(restaurant) : null
  //   }).then( result => {
  //     return fetch(url2, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json'
  //       },
  //       body: result ? JSON.stringify(result) : null
  //   }).then(res => res.json());
  // })

}


